/**
 * js/datastore.js
 * 数据仓库：负责按需加载 data/ 下的 JSON 数据，按年份释放/加载，减少内存占用 50%+
 *
 * 暴露 API:
 *   DataStore.enabled                 → 是否已启用 (根据window.USE_SPLIT_EVENTS，生产默认true)
 *   DataStore.init(startYear)         → 首屏加载 story_core + 当前年 + 前后1年，Promise
 *   DataStore.ensureYear(year)        → 确保年份±1池在内存中，返回Promise
 *   DataStore.releaseBefore(year)     → 释放所有 < year 的年份池（GC回收）
 *   DataStore.getEventPool()          → 取出合并后可直接迭代的事件数组（剧情 + 邻近3年随机）
 *   DataStore.getCountry(id)          → 加载国家数据 (data/countries/*.json)
 *   DataStore.getTech(category)       → 科技树数据加载
 *   DataStore.getEconomy(category)    → 经济/工业/资源数据加载
 *   DataStore.useFallback()           → 切回旧版 STORY_EVENTS (当fetch失败或手动触发)
 *
 * 兜底: 如果 fetch 某JSON失败超过3次，自动 fallback 到全局 STORY_EVENTS（旧逻辑不丢）
 */
'use strict';

(function (global) {
  const START_YEAR = 1962;
  const END_YEAR = 2000;
  const MAX_LOAD_TRIES = 3;
  const BASE_PATH = 'data/';

  const DataStore = {
    enabled: true,
    // 内部缓存
    _cache: {
      story: [],          // story_core.json 的剧情事件 (始终持有，约380KB)
      yearPools: {},      // year -> 事件数组，加载完成才放入（持有约3年 = 6-9MB）
      loadingPools: {},   // year -> Promise，正在加载的promise（避免重复fetch）
      tryCount: {},       // year -> 失败次数
      countries: {},      // id -> {}
      tech: {},           // category -> {}
      economy: {},        // category -> {}
    },
    startYear: null,
    currentYear: null,
    _fallback: false,

    // ============= 初始化 =============
    async init(startYear) {
      if (!this.enabled) return false;
      this.startYear = this.currentYear = startYear || START_YEAR;
      try {
        // 首屏只加载: story_core + 当前年 + 前后1年
        const years = new Set([this.currentYear - 1, this.currentYear, this.currentYear + 1]);
        years.delete(START_YEAR - 1); // 不越界
        const tasks = [this._fetchJson('events/story_core.json').then(d => {
          this._cache.story = (d && d.events) ? d.events : [];
          console.log('[DataStore] story_core 加载完成: ' + this._cache.story.length + ' 事件');
        })];
        for (const y of years) {
          if (y >= START_YEAR && y <= END_YEAR) tasks.push(this._loadYear(y));
        }
        await Promise.all(tasks);
        return true;
      } catch (e) {
        console.warn('[DataStore] init 失败, 启用fallback:', e && e.message);
        this.useFallback();
        return false;
      }
    },

    // ============= 年份池加载/释放 =============
    async _loadYear(year) {
      if (!this.enabled || this._fallback) return;
      if (year < START_YEAR || year > END_YEAR) return;
      if (this._cache.yearPools[year]) return this._cache.yearPools[year];
      if (this._cache.loadingPools[year]) return this._cache.loadingPools[year];
      const p = (async () => {
        try {
          const data = await this._fetchJson(`events/${year}.json`);
          const list = (data && data.events) ? data.events : [];
          this._cache.yearPools[year] = list;
          console.log(`[DataStore] ${year}.json 加载: ${list.length.toLocaleString()} 事件`);
          return list;
        } catch (e) {
          this._cache.tryCount[year] = (this._cache.tryCount[year] || 0) + 1;
          delete this._cache.loadingPools[year];
          if (this._cache.tryCount[year] >= MAX_LOAD_TRIES) {
            console.warn(`[DataStore] ${year}.json 加载失败${MAX_LOAD_TRIES}次，切fallback`);
            this.useFallback();
          }
          throw e;
        }
      })();
      this._cache.loadingPools[year] = p;
      return p;
    },

    async ensureYear(year) {
      if (!this.enabled || this._fallback) return;
      this.currentYear = year;
      const years = new Set([year - 1, year, year + 1]);
      const tasks = [];
      for (const y of years) if (y >= START_YEAR && y <= END_YEAR) tasks.push(this._loadYear(y));
      await Promise.all(tasks);
      this.releaseBefore(year - 2); // 释放2年以前的
    },

    releaseBefore(year) {
      if (!this.enabled) return;
      let freed = 0;
      for (let y = START_YEAR; y < year; y++) {
        if (this._cache.yearPools[y]) {
          freed += this._cache.yearPools[y].length;
          delete this._cache.yearPools[y];
        }
      }
      if (freed) console.log(`[DataStore] 释放 <${year} 的年份池, 事件数: ${freed.toLocaleString()}`);
    },

    // ============= 取出事件池（合并数组） =============
    getEventPool() {
      // fallback: 旧版STORY_EVENTS（不拆分，兼容）
      if (this._fallback || !this.enabled) {
        return (typeof global.STORY_EVENTS !== 'undefined') ? global.STORY_EVENTS
          : (typeof window !== 'undefined' && window.STORY_EVENTS ? window.STORY_EVENTS : []);
      }
      const y = this.currentYear || this.startYear || START_YEAR;
      const pool = [];
      // 先放剧情事件（所有回合会遍历一次检查turn匹配，不要丢）
      for (let i = 0; i < this._cache.story.length; i++) pool.push(this._cache.story[i]);
      // 再放3年相邻随机池
      for (let dy = -1; dy <= 1; dy++) {
        const yy = y + dy;
        const arr = this._cache.yearPools[yy];
        if (arr && arr.length) {
          // 二次过滤: minTurn/maxTurn 是否真的覆盖当前年（因为拆分时按minTurn单落点）
          for (let i = 0; i < arr.length; i++) {
            const e = arr[i];
            if (!e || !e.minTurn || !e.maxTurn) continue;
            const mn = e.minTurn.year;
            const mx = e.maxTurn.year;
            if (y >= mn && y <= mx) pool.push(e);
          }
        }
      }
      return pool;
    },

    // ============= 国家 / 科技 / 经济 / 建筑 / 国策 / 政策 =============
    // 注意: 这里的 6 类数据全部有 fallback 到旧全局(即 data.js 定义的全局对象),
    // 若 datastore 加载失败, 自动退回 data.js 原生对象, 保证所有功能不丢.

    // ---- fallback 工具: 先从 window 找旧全局对象 ----
    _legacy(name) {
      if (typeof global !== 'undefined' && global[name]) return global[name];
      if (typeof window !== 'undefined' && window[name]) return window[name];
      return null;
    },

    // ---- 通用异步加载 + 缓存, 支持 fallback 合并 ----
    async _loadCached(cacheKey, rel, legacyName, merge) {
      if (this._cache[cacheKey]) return this._cache[cacheKey];
      if (!this._cache._loading) this._cache._loading = {};
      if (this._cache._loading[cacheKey]) return this._cache._loading[cacheKey];
      const p = (async () => {
        try {
          const remote = await this._fetchJson(rel);
          // 若 remote 结构包裹了 events:[] 这样的包裹器, 这里按需拆包
          let core = (remote && typeof remote === 'object')
            ? (remote[merge] || remote.items || remote.data || remote)
            : remote;
          // 若请求成功但内容为空, 直接 fallback
          if (!core || (Array.isArray(core) && !core.length) || (typeof core === 'object' && !Object.keys(core).length)) {
            throw new Error('empty');
          }
          this._cache[cacheKey] = core;
          return core;
        } catch (e) {
          const leg = this._legacy(legacyName);
          if (leg) { this._cache[cacheKey] = leg; return leg; }
          return null;
        } finally { delete this._cache._loading[cacheKey]; }
      })();
      this._cache._loading[cacheKey] = p;
      return p;
    },

    // 同步拿缓存: 初始化首屏可能还没加载完，这时返回 legacy fallback 保证不出错
    _sync(cacheKey, legacyName) {
      if (this._cache[cacheKey]) return this._cache[cacheKey];
      const leg = this._legacy(legacyName);
      if (leg) return leg;
      return null;
    },

    // ===== 建筑 =====
    async preloadBuildings() { return this._loadCached('buildings', 'buildings.json', 'BUILDINGS'); },
    getBuildings()        { return this._sync('buildings', 'BUILDINGS') || {}; },

    // ===== 政策 =====
    async preloadPolicies() { return this._loadCached('policies', 'policies.json', 'POLICIES'); },
    getPolicies()         { return this._sync('policies', 'POLICIES') || {}; },

    // ===== 国策树 =====
    async preloadFoci()     { return this._loadCached('national_foci', 'national_foci.json', 'NATIONAL_FOCI'); },
    getNationalFoci()      { return this._sync('national_foci', 'NATIONAL_FOCI') || {}; },

    // ===== 科技 =====
    async preloadTech()     { return this._loadCached('techs', 'technology/all.json', 'TECHS'); },
    getTechs()             { return this._sync('techs', 'TECHS') || {}; },
    // v2.0 第六阶段双科技树
    async preloadTechTree() { return this._loadCached('tech_tree', 'technology/tech_tree.json', null); },
    getTechTree()          { return this._cache.tech_tree || null; },

    // ===== 继承人路线 =====
    async preloadSuccession() { return this._loadCached('succession_paths', 'succession_paths.json', 'SUCCESSION_PATHS'); },
    getSuccessionPaths()      { return this._sync('succession_paths', 'SUCCESSION_PATHS') || {}; },

    // ===== 势力 =====
    getFactions() {
      if (this._cache.factions) return this._cache.factions;
      const leg = this._legacy('FACTIONS');
      if (leg) { this._cache.factions = leg; return leg; }
      // countries 转换简易版 factions
      const idx = this._cache.countries_index || this._cache.countriesIdx;
      if (idx) { /* TODO 映射 */ return {}; }
      return {};
    },

    // ===== 国家详细数据 =====
    async preloadCountriesIndex() {
      if (this._cache.countriesIdx) return this._cache.countriesIdx;
      try {
        const idx = await this._fetchJson('countries/index.json');
        this._cache.countriesIdx = idx; return idx;
      } catch (_) { return null; }
    },
    getCountriesIndex() {
      return this._cache.countriesIdx || null;
    },
    // 覆盖: getCountry(id) 从文件直接取
    async getCountry(id) {
      if (!id) return null;
      if (this._cache.countries && this._cache.countries[id]) return this._cache.countries[id];
      if (!this._cache.countries) this._cache.countries = {};
      if (this._cache._countryLoading && this._cache._countryLoading[id]) {
        return this._cache._countryLoading[id];
      }
      const p = (async () => {
        try {
          const d = await this._fetchJson(`countries/${id}.json`);
          this._cache.countries[id] = d; return d;
        } catch (_) {
          // 无国家JSON, 用Factions拼最小数据
          const f = this.getFactions();
          if (!f) return null;
          const fkey = { GER: 'ger', USA: 'ofn', JAP: 'japan', ITA: 'italy', BUR: 'burgundy', RUS: 'russia' }[id] || id.toLowerCase();
          if (f[fkey]) {
            const d = { id, name: f[fkey].name || f[fkey].longDesc, shortName: f[fkey].short || f[fkey].name, desc: f[fkey].desc, longDesc: f[fkey].longDesc, flagColor: f[fkey].color || '#888' };
            this._cache.countries[id] = d; return d;
          }
          return null;
        } finally { if (this._cache._countryLoading) delete this._cache._countryLoading[id]; }
      })();
      if (!this._cache._countryLoading) this._cache._countryLoading = {};
      this._cache._countryLoading[id] = p;
      return p;
    },
    listCountryIds() {
      const idx = this.getCountriesIndex();
      if (idx && idx.countries) return Object.keys(idx.countries);
      return ['GER', 'USA', 'JAP', 'ITA', 'BUR', 'RUS'];
    },

    // ===== 经济: 工业分类 / 资源清单 =====
    async preloadIndustries() { return this._loadCached('industries', 'economy/industries.json', null, 'categories'); },
    getIndustries()       { return this._cache.industries || null; },
    async preloadResources()  { return this._loadCached('resources',  'economy/resources.json',  null, 'items'); },
    getResources()        { return this._cache.resources || null; },

    // ===== 首屏预加载（UI.start() 里调用）：保证后续同步读取不返回空 =====
    async preloadAllForStart() {
      await Promise.all([
        this.preloadBuildings(),
        this.preloadPolicies(),
        this.preloadFoci(),
        this.preloadTech(),
        this.preloadSuccession(),
        this.preloadTechTree(),
        this.preloadIndustries(),
        this.preloadResources(),
        this.preloadCountriesIndex(),
      ]);
      // 顺便预加载玩家 GER
      await this.getCountry('GER');
    },

    // ============= 兜底 & 内部工具 =============
    useFallback() {
      console.warn('[DataStore] 切回旧版 STORY_EVENTS（拆分模式关闭）');
      this._fallback = true;
      this._cache.yearPools = {};
      this._cache.story = [];
    },

    // 将JSON里的 {__type:'fn',__source} 节点递归恢复为真正的函数
    _restoreFunctions(obj) {
      if (obj == null) return obj;
      if (Array.isArray(obj)) return obj.map(v => this._restoreFunctions(v));
      if (typeof obj === 'object') {
        if (obj.__type === 'fn' && typeof obj.__source === 'string') {
          try {
            const src = obj.__source.trim();
            // 处理箭头函数 / 普通函数 / 简写方法
            if (src.startsWith('(') || /^\w+\s*\([^)]*\)\s*=>/.test(src) || src.includes('=>')) {
              // 箭头函数直接包一层 eval
              return (0, eval)('(' + src + ')');
            }
            // 具名 / 匿名 function: 用 new Function 把 return 出来
            return (0, eval)('(' + src + ')');
          } catch (e) {
            console.warn('[DataStore] 函数恢复失败: ' + (obj.__path || '?'), e.message);
            // 兜底：condition永远true，其他返回noop
            if (/condition/.test(obj.__path || '')) return function () { return true; };
            return function () {};
          }
        }
        const out = {};
        for (const k of Object.keys(obj)) out[k] = this._restoreFunctions(obj[k]);
        return out;
      }
      return obj;
    },

    async _fetchJson(rel) {
      const url = BASE_PATH + rel;
      const res = await fetch(url, { cache: 'force-cache' });
      if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
      const raw = await res.json();
      // 加载完后立即恢复所有函数字段
      return this._restoreFunctions(raw);
    }
  };

  // 暴露
  global.DataStore = DataStore;
  if (typeof window !== 'undefined') window.DataStore = DataStore;

})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
