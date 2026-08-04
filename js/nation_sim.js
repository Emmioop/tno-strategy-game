/**
 * js/nation_sim.js  v1.0
 * 国家模拟系统 — 经济/政治/军事/科技/人口 每回合推演
 *
 * 设计原则:
 *   - 玩家国(GER)深度模拟: GDP增长→税收→财政→工业→军事, 受政策/稳定度/腐败影响
 *   - AI国(USA/JAP/ITA/BUR/RUS)简化模拟: 每季度GDP/军力/稳定微调, 带随机波动
 *   - 现有 Game.state.resources 从 GER 国势数据同步, 保持向下兼容
 *   - 数据源: data/countries/*.JSON (通过DataStore或fetch加载)
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.NationSim = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // ===== 国家中文名映射 =====
  const NAMES = {
    GER: '大日耳曼国', USA: '美利坚/OFN', JAP: '大日本帝国',
    ITA: '意大利帝国', BUR: '勃艮第', RUS: '俄罗斯'
  };

  // ===== 工业分类 fallback (当建筑JSON无industry字段时按id推导) =====
  const INDUSTRY_FALLBACK = {
    // 能源工业
    hydroelectric_plant: 'energy', synthetic_oil_plant: 'energy',
    // 高科技工业
    research_lab: 'hitech', university: 'hitech', chemical_plant: 'hitech',
    pharmaceutical_lab: 'hitech', weather_station: 'hitech', geological_survey: 'hitech',
    wunderwaffe: 'hitech', biological_lab: 'hitech', electronic_warfare: 'hitech',
    space_launch_facility: 'hitech', nuclear_research_center: 'hitech', radar_station: 'hitech',
    missile_silo: 'hitech', missile_base: 'hitech', nuclear_facility: 'hitech', underground_bunker: 'hitech',
    // 军事工业
    arms_factory: 'military', tank_factory: 'military', aircraft_factory: 'military',
    shipyard: 'military', panzer_factory: 'military', fighter_plant: 'military',
    submarine_yard: 'military', munitions_plant: 'military', naval_academy: 'military',
    air_force_base: 'military', ss_barracks: 'military', coastal_battery: 'military',
    fortification_line: 'military', coastal_defense: 'military', air_defense: 'military',
    // 民用工业
    consumer_factory: 'civil', infrastructure: 'civil', agriculture: 'civil',
    housing: 'civil', bank: 'civil', textile_mill: 'civil', luxury_goods: 'civil',
    imperial_post: 'civil', agricultural_collective: 'civil', fishing_fleet: 'civil',
    national_highway: 'civil', imperial_broadcasting: 'civil', film_studio: 'civil', propaganda: 'civil'
  };

  // ===== AI国家战略库 (每国可选战略目标/经济策略/军事倾向) =====
  // 每年AI重新评估局势, 从可选项中按权重选择, 影响其发展倾向与对德关系
  const AI_STRATEGIES = {
    USA: {
      goals: [
        { id: 'containment', name: '遏制德意志', weight: 40, diplo: -25, mil: 0.5, gdp: -0.002 },
        { id: 'detente',     name: '外交缓和',   weight: 25, diplo: +15, mil: -0.2, gdp: +0.003 },
        { id: 'econ_race',   name: '经济竞赛',   weight: 35, diplo: -5,  mil: 0.0,  gdp: +0.006 }
      ]
    },
    JAP: {
      goals: [
        { id: 'expansion',    name: '共荣圈扩张', weight: 35, diplo: -10, mil: 0.6, gdp: +0.004 },
        { id: 'consolidate',  name: '巩固本土',   weight: 40, diplo: +5,  mil: -0.3, gdp: +0.005 },
        { id: 'detente_usa',  name: '亲美路线',   weight: 25, diplo: 0,   mil: 0.0,  gdp: +0.003 }
      ]
    },
    ITA: {
      goals: [
        { id: 'med_dream', name: '地中海帝国梦', weight: 45, diplo: -15, mil: 0.4, gdp: -0.002 },
        { id: 'stability', name: '维持稳定',     weight: 35, diplo: +8,  mil: -0.2, gdp: +0.003 },
        { id: 'reform',    name: '内部改革',     weight: 20, diplo: +12, mil: -0.3, gdp: +0.006 }
      ]
    },
    BUR: {
      goals: [
        { id: 'nuclear_arm',  name: '隐秘核武装', weight: 40, diplo: -20, mil: 0.3, gdp: -0.003 },
        { id: 'infiltration', name: '渗透德国内部', weight: 35, diplo: -10, mil: 0.1, gdp: -0.002 },
        { id: 'apocalypse',   name: '末日计划',   weight: 25, diplo: -30, mil: 0.5, gdp: -0.005 }
      ]
    },
    RUS: {
      goals: [
        { id: 'unification', name: '统一俄罗斯',   weight: 45, diplo: +5,  mil: 0.7, gdp: +0.008 },
        { id: 'survival',    name: '军阀生存',     weight: 35, diplo: 0,   mil: 0.2, gdp: +0.002 },
        { id: 'revenge',     name: '向柏林复仇',   weight: 20, diplo: -25, mil: 0.6, gdp: +0.003 }
      ]
    }
  };

  // ===== 默认初始数据 (JSON加载失败时fallback) =====
  const DEFAULTS = {
    GER: { leader: '阿登纳', capital: '日耳曼尼亚', ideology: '纳粹主义',
      gdp: 1800000, gdpGrowth: 0.012, inflation: 0.035, treasury: 120000, taxRate: 0.42,
      stability: 45, support: 40, corruption: 0.18, army: 480, airforce: 220, navy: 140,
      nuclear: { warheads: 2, delivery: { icbm: 15, slbm: 0, bomber: 80 }, deterrence: 30 },
      population: 85000000, industry: { civilSlots: 320, militarySlots: 210, hiTechSlots: 38, energySlots: 96, efficiency: 0.82 },
      tech: { militaryTier: 2, civilTier: 3, nuclearTier: 1, rocketTier: 1 },
      resources: { oil: 60, steel: 240, rare_metal: 18, uranium: 3, grain: 210, consumer: 240 } },
    USA: { leader: '尼克松', capital: '华盛顿', ideology: '共和主义',
      gdp: 3200000, gdpGrowth: 0.018, inflation: 0.028, treasury: 260000, taxRate: 0.32,
      stability: 58, support: 54, corruption: 0.1, army: 360, airforce: 380, navy: 480,
      nuclear: { warheads: 6, delivery: { icbm: 120, slbm: 80, bomber: 220 }, deterrence: 85 },
      population: 190000000, industry: { civilSlots: 560, militarySlots: 340, hiTechSlots: 88, energySlots: 180, efficiency: 0.88 },
      tech: { militaryTier: 3, civilTier: 3, nuclearTier: 2, rocketTier: 2 },
      resources: { oil: 380, steel: 480, rare_metal: 56, uranium: 8, grain: 540, consumer: 520 } },
    JAP: { leader: '昭和天皇', capital: '东京', ideology: '军国主义',
      gdp: 1560000, gdpGrowth: 0.024, inflation: 0.052, treasury: 145000, taxRate: 0.38,
      stability: 66, support: 72, corruption: 0.16, army: 520, airforce: 260, navy: 360,
      nuclear: { warheads: 0, delivery: { icbm: 0, slbm: 0, bomber: 40 }, deterrence: 18 },
      population: 430000000, industry: { civilSlots: 420, militarySlots: 280, hiTechSlots: 60, energySlots: 100, efficiency: 0.72 },
      tech: { militaryTier: 2, civilTier: 2, nuclearTier: 0, rocketTier: 1 },
      resources: { oil: 180, steel: 300, rare_metal: 40, uranium: 1, grain: 260, consumer: 220 } },
    ITA: { leader: '墨索里尼', capital: '罗马', ideology: '法西斯主义',
      gdp: 580000, gdpGrowth: 0.01, inflation: 0.068, treasury: 54000, taxRate: 0.4,
      stability: 48, support: 44, corruption: 0.28, army: 220, airforce: 140, navy: 180,
      nuclear: { warheads: 0, delivery: { icbm: 0, slbm: 0, bomber: 10 }, deterrence: 6 },
      population: 165000000, industry: { civilSlots: 200, militarySlots: 120, hiTechSlots: 14, energySlots: 60, efficiency: 0.66 },
      tech: { militaryTier: 1, civilTier: 2, nuclearTier: 0, rocketTier: 0 },
      resources: { oil: 120, steel: 180, rare_metal: 12, uranium: 1, grain: 140, consumer: 100 } },
    BUR: { leader: '海德里希', capital: '南锡', ideology: '极端纳粹主义',
      gdp: 90000, gdpGrowth: -0.004, inflation: 0.14, treasury: 12000, taxRate: 0.68,
      stability: 28, support: 18, corruption: 0.12, army: 140, airforce: 40, navy: 20,
      nuclear: { warheads: 1, delivery: { icbm: 2, slbm: 0, bomber: 18 }, deterrence: 32 },
      population: 20000000, industry: { civilSlots: 40, militarySlots: 80, hiTechSlots: 18, energySlots: 26, efficiency: 0.5 },
      tech: { militaryTier: 2, civilTier: 0, nuclearTier: 1, rocketTier: 1 },
      resources: { oil: 4, steel: 28, rare_metal: 3, uranium: 1, grain: 8, consumer: 6 } },
    RUS: { leader: '—', capital: '莫斯科', ideology: '军阀割据',
      gdp: 140000, gdpGrowth: 0.028, inflation: 0.22, treasury: 18000, taxRate: 0.32,
      stability: 36, support: 40, corruption: 0.26, army: 320, airforce: 40, navy: 6,
      nuclear: { warheads: 0, delivery: { icbm: 0, slbm: 0, bomber: 2 }, deterrence: 4 },
      population: 120000000, industry: { civilSlots: 60, militarySlots: 48, hiTechSlots: 4, energySlots: 28, efficiency: 0.5 },
      tech: { militaryTier: 1, civilTier: 1, nuclearTier: 0, rocketTier: 0 },
      resources: { oil: 120, steel: 180, rare_metal: 24, uranium: 6, grain: 60, consumer: 40 } }
  };

  const NationSim = {
    // 所有国家数据 {id: {...}}
    nations: {},
    // 是否已初始化
    _initialized: false,
    // 是否使用fallback数据
    _fallback: true,

    // ===== 初始化: 从JSON加载或使用fallback =====
    async init() {
      if (this._initialized) return this.nations;
      // 尝试通过DataStore加载
      const ds = (typeof DataStore !== 'undefined') ? DataStore
        : (typeof window !== 'undefined' ? window.DataStore : null);
      try {
        if (ds && typeof ds.getCountry === 'function' && !ds._fallback) {
          const ids = ['GER', 'USA', 'JAP', 'ITA', 'BUR', 'RUS'];
          for (const id of ids) {
            const data = ds.getCountry(id);
            if (data) { this.nations[id] = this._normalize(data); }
            else { this.nations[id] = this._normalize(DEFAULTS[id]); }
          }
          this._fallback = false;
        } else {
          // 直接fetch
          for (const id of Object.keys(DEFAULTS)) {
            try {
              const resp = await fetch('data/countries/' + id + '.json', { cache: 'no-cache' });
              if (resp.ok) {
                const data = await resp.json();
                this.nations[id] = this._normalize(data);
              } else {
                this.nations[id] = this._normalize(DEFAULTS[id]);
              }
            } catch (_) {
              this.nations[id] = this._normalize(DEFAULTS[id]);
            }
          }
          this._fallback = false;
        }
      } catch (e) {
        console.warn('[NationSim] 加载失败, 使用内置数据:', e.message);
        for (const id of Object.keys(DEFAULTS)) {
          this.nations[id] = this._normalize(DEFAULTS[id]);
        }
        this._fallback = true;
      }
      this._initialized = true;
      console.log('[NationSim] 初始化完成, ' + Object.keys(this.nations).length + '国' + (this._fallback ? ' (内置数据)' : ''));
      return this.nations;
    },

    // ===== 同步初始化 (fallback模式, 不等待fetch) =====
    initSync() {
      if (this._initialized) return this.nations;
      for (const id of Object.keys(DEFAULTS)) {
        this.nations[id] = this._normalize(DEFAULTS[id]);
      }
      this._initialized = true;
      this._fallback = true;
      console.log('[NationSim] 同步初始化(内置数据), ' + Object.keys(this.nations).length + '国');
      return this.nations;
    },

    // 规范化国家数据: 确保所有字段存在
    _normalize(data) {
      const d = Object.assign({}, data);
      // 确保嵌套对象存在
      d.nuclear = Object.assign({ warheads: 0, delivery: { icbm: 0, slbm: 0, bomber: 0 }, deterrence: 0 }, d.nuclear || {});
      d.nuclear.delivery = Object.assign({ icbm: 0, slbm: 0, bomber: 0 }, d.nuclear.delivery || {});
      d.industry = Object.assign({ civilSlots: 0, militarySlots: 0, hiTechSlots: 0, energySlots: 0, efficiency: 0.5 }, d.industry || {});
      d.tech = Object.assign({ militaryTier: 0, civilTier: 0, nuclearTier: 0, rocketTier: 0 }, d.tech || {});
      d.resources = Object.assign({ oil: 0, steel: 0, rare_metal: 0, uranium: 0, grain: 0, consumer: 0 }, d.resources || {});
      d.governmentBudget = Object.assign({ military: 0.3, welfare: 0.2, research: 0.1, administration: 0.2, espionage: 0.1 }, d.governmentBudget || {});
      // 历史GDP记录 (用于图表)
      d.gdpHistory = d.gdpHistory || [d.gdp];
      return d;
    },

    // ===== 获取国家数据 =====
    getNation(id) {
      if (!this._initialized) this.initSync();
      return this.nations[id] || null;
    },

    getAllNations() {
      if (!this._initialized) this.initSync();
      return this.nations;
    },

    // ===== 获取当前核危机状态 (UI用) =====
    getNuclearCrisis() {
      return this._lastCrisis || null;
    },

    // ===== 初始化AI国家战略状态 =====
    initAIState(id) {
      const n = this.nations[id];
      if (!n || !AI_STRATEGIES[id]) return;
      if (n.aiState) return; // 已初始化
      // 按权重随机选初始战略
      const goal = this._pickWeighted(AI_STRATEGIES[id].goals);
      n.aiState = {
        goal: goal.id,
        goalName: goal.name,
        diploMod: goal.diplo,   // 对德关系倾向
        milMod: goal.mil,        // 军事投入倾向
        gdpMod: goal.gdp,        // 经济增长修正
        lastEvalYear: 1962,
        log: [{ year: 1962, goal: goal.name }]
      };
    },

    // 加权随机选择
    _pickWeighted(items) {
      const total = items.reduce((s, it) => s + (it.weight || 1), 0);
      let r = Math.random() * total;
      for (const it of items) {
        r -= (it.weight || 1);
        if (r <= 0) return it;
      }
      return items[items.length - 1];
    },

    // ===== AI年度战略评估 (每年Q1重新评估) =====
    updateAIStrategy(id, gameState) {
      const n = this.nations[id];
      if (!n || !AI_STRATEGIES[id]) return;
      this.initAIState(id);
      const ai = n.aiState;
      const year = gameState.year || 1962;
      // 每年评估一次
      if (ai.lastEvalYear >= year) return;

      // 局势因素: 玩家德国状态影响AI选择
      const ger = this.nations.GER;
      const gerStab = ger ? ger.stability : 50;
      const gerMil = ger ? (ger.army + ger.airforce + ger.navy) : 500;
      const rel = (gameState.relations || {})[this._relKey(id)] || 0;

      // 重新计算权重 (基于局势)
      const goals = AI_STRATEGIES[id].goals.map(g => {
        let w = g.weight;
        // 玩家德国强威胁→倾向遏制/复仇
        if (gerMil > 800 && (g.id === 'containment' || g.id === 'revenge' || g.id === 'apocalypse')) w += 15;
        // 玩家德国不稳→AI倾向扩张
        if (gerStab < 40 && (g.id === 'expansion' || g.id === 'med_dream' || g.id === 'unification')) w += 10;
        // 关系友好→倾向缓和
        if (rel > 30 && (g.id === 'detente' || g.id === 'reform' || g.id === 'consolidate')) w += 12;
        // 关系恶化→倾向对抗
        if (rel < -30 && (g.id === 'containment' || g.id === 'revenge' || g.id === 'apocalypse')) w += 12;
        return Object.assign({}, g, { weight: Math.max(5, w) });
      });

      const newGoal = this._pickWeighted(goals);
      // 战略变更才记录日志
      if (newGoal.id !== ai.goal) {
        ai.log.push({ year, goal: newGoal.name, from: ai.goalName });
        if (typeof Game !== 'undefined' && Game.addNews) {
          Game.addNews(`${NAMES[id]||id} 调整战略: ${ai.goalName} → ${newGoal.name}`, 'world');
        }
      }
      ai.goal = newGoal.id;
      ai.goalName = newGoal.name;
      ai.diploMod = newGoal.diplo;
      ai.milMod = newGoal.mil;
      ai.gdpMod = newGoal.gdp;
      ai.lastEvalYear = year;
    },

    // 关系key映射 (id→Game.state.relations的key)
    _relKey(id) {
      const m = { USA: 'ofn', JAP: 'japan', ITA: 'italy', BUR: 'burgundy', RUS: 'russia' };
      return m[id] || id.toLowerCase();
    },

    // ===== 加载科技树JSON =====
    async loadTechTree() {
      if (this._techTree) return this._techTree;
      try {
        const resp = await fetch('data/technology/tech_tree.json', { cache: 'no-cache' });
        if (resp.ok) {
          this._techTree = await resp.json();
          console.log('[NationSim] 科技树加载完成');
        }
      } catch (e) {
        console.warn('[NationSim] 科技树加载失败:', e.message);
      }
      return this._techTree || null;
    },

    // 同步获取科技树 (优先缓存, 失败用内置fallback)
    getTechTree() {
      if (this._techTree) return this._techTree;
      // 尝试从DataStore获取
      try {
        const ds = (typeof DataStore !== 'undefined') ? DataStore : (typeof window !== 'undefined' ? window.DataStore : null);
        if (ds && typeof ds.getTechTree === 'function') {
          const t = ds.getTechTree();
          if (t) { this._techTree = t; return t; }
        }
      } catch (_) {}
      // 内置fallback (精简版, 确保功能可用)
      this._techTree = this._techTreeFallback();
      return this._techTree;
    },

    // 科技树fallback (当JSON未加载时)
    _techTreeFallback() {
      const tier = (tier, era, name, cost, effects, desc, flag) => ({ tier, era, name, cost, requires: tier > 1 ? [tier - 1] : [], effects, desc, flag });
      return {
        eras: [
          { id: '1960s', name: '原子时代', startYear: 1960, desc: '喷气飞机、导弹、核技术' },
          { id: '1970s', name: '电子时代', startYear: 1970, desc: '精确制导、计算机' },
          { id: '1980s', name: '信息时代', startYear: 1980, desc: '信息战争、隐形' },
          { id: '1990s', name: '网络时代', startYear: 1990, desc: '网络战争、无人设备' }
        ],
        trees: {
          military: { name: '军事科技', color: '#e8a0a0', icon: '⚔️', desc: '影响战力', tiers: [
            tier(1, '1960s', '喷气时代', 60, { militaryPower: 5 }, '喷气式战机量产化'),
            tier(2, '1960s', '导弹技术', 90, { militaryPower: 8, deterrence: 3 }, '战术导弹列装'),
            tier(3, '1970s', '精确制导', 140, { militaryPower: 12, deterrence: 5 }, '激光制导炸弹'),
            tier(4, '1980s', '隐形技术', 200, { militaryPower: 18, deterrence: 8 }, '隐身战机'),
            tier(5, '1990s', '无人战争', 280, { militaryPower: 25, deterrence: 10 }, '无人机蜂群')
          ]},
          civil: { name: '民用科技', color: '#a0c8e0', icon: '🏭', desc: '影响经济', tiers: [
            tier(1, '1960s', '大众消费', 50, { money: 3, stability: 2 }, '家电普及'),
            tier(2, '1960s', '合成材料', 80, { money: 4, efficiency: 0.02 }, '塑料革命'),
            tier(3, '1970s', '计算机化', 130, { money: 6, efficiency: 0.05, research: 2 }, '办公自动化'),
            tier(4, '1980s', '信息高速公路', 190, { money: 8, efficiency: 0.08, research: 4 }, '光纤网络'),
            tier(5, '1990s', '数字经济', 260, { money: 12, efficiency: 0.12, research: 6 }, '电子商务')
          ]},
          nuclear: { name: '核技术', color: '#e8c860', icon: '☢️', desc: '影响核力量', tiers: [
            tier(1, '1960s', '原子武器', 100, { nukes: 1, nukeDeter: 8 }, '基础裂变武器', 'nuclear_tech'),
            tier(2, '1960s', '氢弹', 160, { nukes: 2, nukeDeter: 15 }, '聚变弹头'),
            tier(3, '1970s', '分导式多弹头', 220, { nukes: 3, nukeDeter: 25 }, 'MIRV技术'),
            tier(4, '1980s', '中子弹', 300, { nukes: 4, nukeDeter: 35 }, '增强辐射武器'),
            tier(5, '1990s', '第三代核武', 400, { nukes: 6, nukeDeter: 50 }, '定向能核武器')
          ]},
          rocket: { name: '火箭技术', color: '#a0d0a0', icon: '🚀', desc: '影响投送能力', tiers: [
            tier(1, '1960s', '弹道导弹', 70, { deterrence: 5, nukeDeter: 3 }, '短程弹道导弹', 'rocketry'),
            tier(2, '1960s', '洲际导弹', 120, { deterrence: 8, nukeDeter: 8 }, 'ICBM'),
            tier(3, '1970s', '潜射导弹', 170, { deterrence: 10, nukeDeter: 12 }, 'SLBM'),
            tier(4, '1980s', '反导系统', 240, { deterrence: 12, nukeDeter: 8 }, 'ABM拦截'),
            tier(5, '1990s', '天基武器', 350, { deterrence: 18, nukeDeter: 15, research: 5 }, '轨道武器')
          ]}
        }
      };
    },

    // ===== 研发科技 (玩家手动) =====
    // 参数: treeId('military'/'civil'/'nuclear'/'rocket'), 返回 {ok, msg}
    researchTech(treeId, gameState) {
      const tree = this.getTechTree();
      if (!tree || !tree.trees || !tree.trees[treeId]) return { ok: false, msg: '科技树不存在' };
      const n = this.nations.GER;
      if (!n) return { ok: false, msg: '国家数据未加载' };

      const treeDef = tree.trees[treeId];
      const currentTier = n.tech[treeId + 'Tier'] || 0;
      const nextTier = currentTier + 1;
      if (nextTier > 5) return { ok: false, msg: treeDef.name + '已达最高级' };

      const tierDef = treeDef.tiers[nextTier - 1];
      if (!tierDef) return { ok: false, msg: '科技等级数据缺失' };

      // 1. 时代解锁检查 (era的startYear <= 当前年份)
      const era = tree.eras.find(e => e.id === tierDef.era);
      if (era && gameState.year < era.startYear) {
        return { ok: false, msg: `${era.name}(${era.startYear}年)后解锁` };
      }

      // 2. 前置科技检查 (requires数组, 已应满足因为是顺序升级)
      if (tierDef.requires && tierDef.requires.length > 0) {
        for (const reqTier of tierDef.requires) {
          if ((n.tech[treeId + 'Tier'] || 0) < reqTier) {
            return { ok: false, msg: `需先研发 ${treeDef.name} ${reqTier}级` };
          }
        }
      }

      // 3. 研发点数检查
      const r = gameState.resources || {};
      const cost = tierDef.cost;
      if ((r.research || 0) < cost) {
        return { ok: false, msg: `研发点数不足 (需${cost}, 当前${Math.floor(r.research || 0)})` };
      }

      // 4. 扣除研发点数, 升级科技
      r.research = (r.research || 0) - cost;
      n.tech[treeId + 'Tier'] = nextTier;

      // 5. 应用效果
      const effects = tierDef.effects || {};
      if (effects.militaryPower) r.militaryPower = (r.militaryPower || 0) + effects.militaryPower;
      if (effects.deterrence) r.deterrence = (r.deterrence || 0) + effects.deterrence;
      if (effects.nukeDeter) r.nukeDeter = (r.nukeDeter || 0) + effects.nukeDeter;
      if (effects.nukes) r.nukes = (r.nukes || 0) + effects.nukes;
      if (effects.money) r.money = (r.money || 0) + effects.money;
      if (effects.stability) r.stability = (r.stability || 0) + effects.stability;
      if (effects.research) r.research += effects.research;
      if (effects.efficiency) r.efficiency = Math.min(2.0, (r.efficiency || 1.0) + effects.efficiency);

      // 6. 设置flag (解锁建筑前置)
      if (tierDef.flag) {
        gameState.flags = gameState.flags || {};
        gameState.flags[tierDef.flag] = true;
        gameState.techs = gameState.techs || {};
        gameState.techs[tierDef.flag] = true;
      }

      // 7. 新闻
      if (typeof Game !== 'undefined' && Game.addNews) {
        Game.addNews(`科技突破: ${treeDef.name}升至${nextTier}级 - ${tierDef.name}`, 'tech');
      }

      return { ok: true, msg: `${treeDef.name} ${tierDef.name} 研发成功`, tier: nextTier, name: tierDef.name };
    },

    // ===== 获取科技树状态 (UI用) =====
    getTechTreeStatus(gameState) {
      const tree = this.getTechTree();
      if (!tree) return null;
      const n = this.nations.GER;
      if (!n) return null;
      const result = { eras: tree.eras, trees: {} };
      for (const treeId in tree.trees) {
        const td = tree.trees[treeId];
        const currentTier = n.tech[treeId + 'Tier'] || 0;
        result.trees[treeId] = {
          name: td.name, color: td.color, icon: td.icon, desc: td.desc,
          currentTier: currentTier,
          tiers: td.tiers.map(t => {
            const era = tree.eras.find(e => e.id === t.era);
            const eraUnlocked = !era || gameState.year >= era.startYear;
            const reqMet = !t.requires || t.requires.every(r => currentTier >= r);
            const isNext = t.tier === currentTier + 1;
            const canResearch = isNext && eraUnlocked && reqMet;
            const status = t.tier <= currentTier ? 'done' : (canResearch ? 'available' : (eraUnlocked ? 'locked' : 'era_locked'));
            return Object.assign({}, t, { eraName: era ? era.name : '', eraUnlocked, reqMet, isNext, canResearch, status });
          })
        };
      }
      return result;
    },

    // ===== 每回合更新所有国家 =====
    updateAll(gameState) {
      if (!this._initialized) this.initSync();
      if (!this.nations.GER) return;

      // 玩家国深度模拟
      this.updatePlayer(gameState);
      // AI国简化模拟
      for (const id of ['USA', 'JAP', 'ITA', 'BUR', 'RUS']) {
        if (!this.nations[id]) continue;
        // 年度战略评估 (Q1时重新评估)
        if (gameState.quarter === 1) this.updateAIStrategy(id, gameState);
        else this.initAIState(id); // 首次确保初始化
        this.updateAI(id, gameState);
      }
      // 工业系统结算: 四类工业协同加成 (基于玩家建筑数量×科技×稳定)
      this.updateIndustry(gameState);
      // 核威慑综合计算 (覆盖旧简化公式)
      const n = this.nations.GER;
      if (n) {
        const deter = this.calcNuclearDeterrence('GER', gameState);
        n.nuclear.deterrence = deter.value;
        n._deterBreakdown = deter.breakdown;
        // 同步到所有AI国
        for (const id of ['USA', 'JAP', 'ITA', 'BUR', 'RUS']) {
          if (this.nations[id]) {
            const d = this.calcNuclearDeterrence(id, gameState);
            this.nations[id].nuclear.deterrence = d.value;
          }
        }
      }
      // 核危机状态机评估 + 应用效果
      const crisis = this.evaluateNuclearCrisis(gameState);
      this._lastCrisis = crisis;
      if (crisis.level !== 'low' && n) {
        const diff = (typeof Game !== 'undefined' && Game.getDiff) ? Game.getDiff() : { penMod: 1 };
        // 危机效果直接作用于国家数据 (避免被syncPlayerResources覆盖)
        n.stability = Math.max(0, Math.min(100, n.stability + crisis.effects.stability * diff.penMod));
        // GDP受损
        if (crisis.effects.gdpMod) {
          n.gdp = Math.round(n.gdp * (1 + crisis.effects.gdpMod));
        }
        // 危机升级时触发新闻 (仅level变化时)
        if (this._lastCrisisLevel && this._lastCrisisLevel !== crisis.level) {
          if (typeof Game !== 'undefined' && Game.addNews) {
            Game.addNews(`⚠ 核危机升级: ${this._lastCrisisLevel.toUpperCase()} → ${crisis.level.toUpperCase()} (${crisis.name})`, 'crisis');
          }
        }
        this._lastCrisisLevel = crisis.level;
      } else {
        this._lastCrisisLevel = 'low';
      }
      // 同步玩家资源到旧系统
      this.syncPlayerResources(gameState);
    },

    // ===== 玩家国(GER)深度模拟 =====
    updatePlayer(gameState) {
      const n = this.nations.GER;
      if (!n) return;
      const f = gameState.flags || {};
      const policies = gameState.policies || {};
      const diff = (typeof Game !== 'undefined' && Game.getDiff) ? Game.getDiff() : { incomeMod: 1, penMod: 1 };

      // --- 1. 经济: GDP增长 ---
      // 基础增长率受稳定度影响: 稳定度>60加成, <30惩罚
      let growthMod = 1.0;
      const stab = n.stability;
      if (stab > 60) growthMod += (stab - 60) * 0.005;
      else if (stab < 30) growthMod -= (30 - stab) * 0.008;
      // 腐败惩罚
      growthMod -= n.corruption * 0.3;
      // 工业效率影响
      growthMod += (n.industry.efficiency - 0.7) * 0.1;
      // 内战状态: 经济崩溃
      if (f.civil_war_imminent && !f.civil_war_over) growthMod -= 0.05;
      if (f.civil_war_over) growthMod += 0.02; // 重建

      // 政策影响
      if (policies.economy === 'slave_economy') growthMod -= 0.002;
      if (policies.economy === 'free_market') growthMod += 0.004;
      if (policies.economy === 'war_economy') growthMod -= 0.003;

      // 季度GDP增长 (年增长率/4)
      let quarterlyGrowth = (n.gdpGrowth + growthMod - 1) * 0.25;
      // 难度修正
      quarterlyGrowth *= diff.incomeMod;
      n.gdp = Math.max(100000, Math.round(n.gdp * (1 + quarterlyGrowth)));
      n.gdpHistory.push(n.gdp);
      if (n.gdpHistory.length > 160) n.gdpHistory.shift(); // 最多保留160季度

      // --- 2. 财政: 税收 - 支出 ---
      const taxRevenue = n.gdp * n.taxRate * n.industry.efficiency * 0.001; // 缩放到游戏资金量级
      const budgetSpending = n.treasury * 0.02; // 每季度支出2%国库
      n.treasury = Math.max(0, Math.round(n.treasury + taxRevenue - budgetSpending));

      // --- 3. 通货膨胀 ---
      let inflChange = 0;
      if (n.treasury < n.gdp * 0.03) inflChange += 0.003; // 财政赤字→通胀
      if (stab < 30) inflChange += 0.005;
      if (policies.economy === 'war_economy') inflChange += 0.002;
      if (policies.economy === 'free_market') inflChange -= 0.002;
      n.inflation = Math.max(-0.02, Math.min(0.3, n.inflation + inflChange));

      // --- 4. 工业效率 ---
      let effChange = 0;
      if (stab > 50) effChange += 0.003;
      if (stab < 30) effChange -= 0.008;
      effChange -= n.corruption * 0.005;
      if (f.civil_war_imminent && !f.civil_war_over) effChange -= 0.02;
      // 科技提升效率
      effChange += n.tech.civilTier * 0.001;
      n.industry.efficiency = Math.max(0.2, Math.min(1.0, n.industry.efficiency + effChange));

      // --- 5. 稳定度 ---
      let stabChange = 0;
      if (quarterlyGrowth > 0.01) stabChange += 0.5;
      if (quarterlyGrowth < -0.01) stabChange -= 1.0;
      if (n.inflation > 0.08) stabChange -= (n.inflation - 0.08) * 20;
      if (n.corruption > 0.2) stabChange -= (n.corruption - 0.2) * 10;
      stabChange *= diff.incomeMod;
      n.stability = Math.max(0, Math.min(100, Math.round((n.stability + stabChange) * 10) / 10));

      // --- 6. 政府支持率 ---
      let supChange = 0;
      if (n.stability > 60) supChange += 0.3;
      if (n.stability < 30) supChange -= 0.8;
      if (quarterlyGrowth > 0.02) supChange += 0.4;
      if (n.inflation > 0.1) supChange -= 0.5;
      n.support = Math.max(0, Math.min(100, Math.round((n.support + supChange) * 10) / 10));

      // --- 7. 腐败度 ---
      let corChange = 0;
      if (policies.economy === 'free_market') corChange -= 0.001;
      if (policies.slave_policy === 'harsher_rule') corChange += 0.002;
      if (n.stability < 30) corChange += 0.003;
      n.corruption = Math.max(0.02, Math.min(0.6, n.corruption + corChange));

      // --- 8. 军事力量 (受预算影响) ---
      const milBudget = n.governmentBudget.military;
      const armyDecay = n.army * 0.003; // 自然折旧
      const armyGain = n.gdp * 0.000015 * milBudget * n.industry.efficiency;
      n.army = Math.max(0, Math.round(n.army - armyDecay + armyGain));
      n.airforce = Math.max(0, Math.round(n.airforce - n.airforce * 0.003 + n.gdp * 0.00001 * milBudget * n.industry.efficiency));
      n.navy = Math.max(0, Math.round(n.navy - n.navy * 0.002 + n.gdp * 0.000008 * milBudget * n.industry.efficiency));

      // --- 9. 核力量 ---
      if (n.tech.nuclearTier > 0) {
        const nukeBudget = milBudget * 0.15;
        const nukeGain = Math.floor(nukeBudget * n.gdp * 0.000001 * n.tech.nuclearTier);
        n.nuclear.warheads = Math.max(n.nuclear.warheads, n.nuclear.warheads + nukeGain - Math.floor(n.nuclear.warheads * 0.002));
      }
      // 核威慑 = 核弹数 × 投送能力 × 科技
      const deliveryScore = n.nuclear.delivery.icbm * 3 + n.nuclear.delivery.slbm * 2.5 + n.nuclear.delivery.bomber * 0.5;
      n.nuclear.deterrence = Math.min(150, Math.round(n.nuclear.warheads * 5 + deliveryScore * 0.3 + n.tech.nuclearTier * 8));

      // --- 10. 科技缓慢进步 ---
      const resBudget = n.governmentBudget.research;
      const techProgress = resBudget * n.industry.efficiency * 0.001;
      // 每季度有概率升级科技 (简化)
      if (Math.random() < techProgress) {
        const tiers = ['militaryTier', 'civilTier', 'nuclearTier', 'rocketTier'];
        const pick = tiers[Math.floor(Math.random() * tiers.length)];
        if (n.tech[pick] < 5) n.tech[pick]++;
      }

      // --- 11. 人口缓慢增长 ---
      const popGrowth = n.lifeExpectancy > 60 ? 0.001 : -0.001;
      n.population = Math.round(n.population * (1 + popGrowth * 0.25));
    },

    // ===== AI国简化模拟 (受aiState战略影响 + 游戏模式速度修正) =====
    updateAI(id, gameState) {
      const n = this.nations[id];
      if (!n) return;
      const f = gameState.flags || {};
      const ai = n.aiState || { gdpMod: 0, milMod: 0, diploMod: 0 };
      // 游戏模式影响AI发展速度 (沙盒1.5x / 混乱1.8x)
      const modeSpeed = (typeof Game !== 'undefined' && Game.getMode) ? (Game.getMode().aiSpeedMod || 1.0) : 1.0;

      // GDP增长 (带随机波动 + 战略修正 × 模式速度)
      let growth = (n.gdpGrowth + (Math.random() - 0.5) * 0.004 + (ai.gdpMod || 0)) * modeSpeed;
      // 特殊事件影响
      if (id === 'RUS' && f.russia_unifier !== undefined) growth += 0.01; // 统一后增长
      if (id === 'BUR') growth -= 0.002; // 勃艮第持续衰退
      if (id === 'USA' && f.civil_war_imminent) growth -= 0.005;
      n.gdp = Math.max(50000, Math.round(n.gdp * (1 + growth * 0.25)));
      n.gdpHistory.push(n.gdp);
      if (n.gdpHistory.length > 160) n.gdpHistory.shift();

      // 财政
      n.treasury = Math.max(0, Math.round(n.treasury * 0.98 + n.gdp * n.taxRate * n.industry.efficiency * 0.0008));

      // 稳定度波动 (战略影响: 扩张/对抗路线降低稳定)
      let stabDelta = (Math.random() - 0.5) * 1.5;
      if (id === 'ITA') stabDelta -= 0.2; // 意大利持续不稳
      if (id === 'RUS') stabDelta -= 0.3;
      if (ai.milMod > 0.3) stabDelta -= 0.3; // 军事化倾向消耗稳定
      if (ai.gdpMod > 0.003) stabDelta += 0.2; // 经济发展提升稳定
      n.stability = Math.max(5, Math.min(95, Math.round(n.stability + stabDelta)));

      // 军事缓慢变化 (战略修正: milMod决定军事投入强度 × 模式速度)
      const milBias = 0.45 - (ai.milMod || 0); // milMod>0 → 更倾向扩军
      const milChange = (Math.random() - milBias) * 2 * modeSpeed;
      n.army = Math.max(10, Math.round(n.army + milChange * n.governmentBudget.military * 10));
      n.airforce = Math.max(5, Math.round(n.airforce + (Math.random() - milBias) * n.governmentBudget.military * 8 * modeSpeed));
      n.navy = Math.max(2, Math.round(n.navy + (Math.random() - milBias) * n.governmentBudget.military * 6 * modeSpeed));

      // 核力量 (美国持续积累, 勃艮德偶尔; 核武装战略加速)
      const nukeStratBoost = (ai.goal === 'nuclear_arm' || ai.goal === 'apocalypse') ? 0.25 : 0;
      if (id === 'USA' && n.tech.nuclearTier > 0) {
        n.nuclear.warheads += Math.random() < (0.3 + nukeStratBoost) ? 1 : 0;
      }
      if (id === 'BUR' && Math.random() < (0.1 + nukeStratBoost)) {
        n.nuclear.warheads += 1;
      }
      const deliveryScore = n.nuclear.delivery.icbm * 3 + n.nuclear.delivery.slbm * 2.5 + n.nuclear.delivery.bomber * 0.5;
      n.nuclear.deterrence = Math.min(150, Math.round(n.nuclear.warheads * 5 + deliveryScore * 0.3 + n.tech.nuclearTier * 8));

      // 工业效率微调
      n.industry.efficiency = Math.max(0.2, Math.min(1.0, n.industry.efficiency + (Math.random() - 0.5) * 0.005));

      // 人口
      n.population = Math.round(n.population * (1 + (n.lifeExpectancy > 60 ? 0.0005 : -0.0005)));

      // 战略对德关系影响 (每季度调整, 玩家可感知)
      if (ai.diploMod && gameState.relations) {
        const rk = this._relKey(id);
        const cur = gameState.relations[rk] || 0;
        // diploMod为正→关系改善, 为负→关系恶化 (系数0.2, 约5回合变10点)
        gameState.relations[rk] = Math.max(-100, Math.min(100, cur + ai.diploMod * 0.2));
      }
    },

    // ===== 核威慑综合计算 (核数量+投送能力+科技+外交) =====
    // 返回 { value, breakdown } 便于UI展示公式分解
    calcNuclearDeterrence(id, gameState) {
      const n = this.nations[id];
      if (!n) return { value: 0, breakdown: {} };
      const d = n.nuclear;
      const t = n.tech;
      // 1. 核弹头贡献 (每枚×5, 边际递减)
      const warheadScore = Math.min(80, d.warheads * 5);
      // 2. 投送能力 (ICBM最强, SLBM次之, 轰炸机最弱)
      const delivery = d.delivery || { icbm: 0, slbm: 0, bomber: 0 };
      const deliveryScore = Math.min(40, delivery.icbm * 6 + delivery.slbm * 5 + delivery.bomber * 1);
      // 3. 科技水平 (核科技+火箭科技)
      const techScore = (t.nuclearTier || 0) * 10 + (t.rocketTier || 0) * 5;
      // 4. 外交修正 (与核大国关系恶化→威胁感↑→威慑压力↑; 友好→↓)
      let diploMod = 0;
      if (gameState && gameState.relations) {
        // 玩家国: 与各核大国关系影响
        if (id === 'GER') {
          const r = gameState.relations;
          // 关系越差, 自身感到的威胁越大, 威慑需求↑
          diploMod = (-r.ofn - r.japan - r.burgundy - r.russia) * 0.1;
        }
      }
      // 5. 工业效率修正 (高效工业支撑核维护)
      const effMod = n.industry.efficiency;
      const base = warheadScore + deliveryScore + techScore + diploMod;
      const value = Math.max(0, Math.min(150, Math.round(base * (0.7 + effMod * 0.3))));
      return {
        value,
        breakdown: {
          warheads: Math.round(warheadScore),
          delivery: Math.round(deliveryScore),
          tech: techScore,
          diplo: Math.round(diploMod),
          eff: +(effMod.toFixed(2))
        }
      };
    },

    // ===== 核危机状态机 (基于全球核威慑总和) =====
    // 低(<30): 常规外交威胁 / 中(30-60): 局部核警告 / 高(>60): 全球核战争风险
    evaluateNuclearCrisis(gameState) {
      // 计算全球核威慑总和 (玩家+所有AI)
      let totalDeter = 0;
      const all = ['GER', 'USA', 'JAP', 'ITA', 'BUR', 'RUS'];
      const breakdown = {};
      for (const id of all) {
        const d = this.calcNuclearDeterrence(id, gameState);
        breakdown[id] = d.value;
        totalDeter += d.value;
      }
      // 平均威慑 (避免被国家数量稀释)
      const avgDeter = totalDeter / all.length;
      let level, name, color, effects;
      if (avgDeter < 30) {
        level = 'low';
        name = '常规外交威胁';
        color = '#4a8a4a';
        effects = { stability: 0, gdpMod: 0, diploMod: 0 };
      } else if (avgDeter < 60) {
        level = 'medium';
        name = '局部核警告';
        color = '#e8c860';
        effects = { stability: -2, gdpMod: -0.002, diploMod: -1 };
      } else {
        level = 'high';
        name = '全球核战争风险';
        color = '#c84040';
        effects = { stability: -5, gdpMod: -0.005, diploMod: -3 };
      }
      return {
        level, name, color, effects,
        avgDeter: +avgDeter.toFixed(1),
        totalDeter: Math.round(totalDeter),
        breakdown
      };
    },

    // ===== 工业系统结算: 四类工业协同加成 =====
    // 公式: 工业效率 = min(1.0, 建筑数量/槽位) × 科技因子 × 稳定度因子
    // 产出: 民用→GDP增长+稳定 / 军事→军力+威慑 / 高科技→研发+科技升级 / 能源→石油+效率
    updateIndustry(gameState) {
      const n = this.nations.GER;
      if (!n) return;
      const buildings = gameState.buildings || {};
      // 获取建筑定义 (优先DataStore/全局, 失败用fallback映射)
      let BUILDINGS = {};
      try {
        if (typeof _getBuildings === 'function') BUILDINGS = _getBuildings();
        else if (typeof window !== 'undefined' && window._getBuildings) BUILDINGS = window._getBuildings();
      } catch (_) {}

      // 1. 统计四类工业建筑数量
      const counts = { civil: 0, military: 0, hitech: 0, energy: 0 };
      for (const bid in buildings) {
        const cnt = buildings[bid];
        if (!cnt) continue;
        const b = BUILDINGS[bid];
        const ind = (b && b.industry) ? b.industry : (INDUSTRY_FALLBACK[bid] || 'none');
        if (counts[ind] !== undefined) counts[ind] += cnt;
      }

      // 2. 工业效率公式: 数量×科技×稳定
      // 玩家可建造容量 (远小于国家总工业规模, 让少量建筑即有可见效果)
      const playerCap = { civil: 20, military: 20, hitech: 12, energy: 8 };
      const stabFactor = Math.max(0.1, n.stability / 100);
      const techCiv = 0.5 + n.tech.civilTier * 0.08;
      const techMil = 0.5 + n.tech.militaryTier * 0.08;
      const slots = n.industry;
      const eff = {
        civil:    Math.min(1.0, counts.civil    / playerCap.civil)    * techCiv * stabFactor,
        military: Math.min(1.0, counts.military / playerCap.military) * techMil * stabFactor,
        hitech:   Math.min(1.0, counts.hitech   / playerCap.hitech)   * techCiv * stabFactor,
        energy:   Math.min(1.0, counts.energy   / playerCap.energy)   * techCiv * stabFactor
      };

      // 3. 难度修正
      const diff = (typeof Game !== 'undefined' && Game.getDiff) ? Game.getDiff() : { incomeMod: 1 };
      const r = gameState.resources || {};
      const f = gameState.flags || {};

      // --- 民用工业: GDP增长加成 + 稳定度微增 ---
      if (counts.civil > 0) {
        const civilBonus = counts.civil * eff.civil * 0.0008 * diff.incomeMod;
        n.gdp = Math.round(n.gdp * (1 + civilBonus));
        r.stability = (r.stability || 0) + eff.civil * 0.15;
      }

      // --- 军事工业: 军事力量增长 + 威慑 ---
      if (counts.military > 0) {
        const armyGain = Math.round(counts.military * eff.military * 0.8 * diff.incomeMod);
        n.army = Math.round(n.army + armyGain * 0.6);
        n.airforce = Math.round(n.airforce + armyGain * 0.25);
        n.navy = Math.round(n.navy + armyGain * 0.15);
        r.deterrence = (r.deterrence || 0) + Math.round(counts.military * eff.military * 0.4);
      }

      // --- 高科技工业: 研发点数 + 科技升级概率 ---
      if (counts.hitech > 0) {
        const researchGain = counts.hitech * eff.hitech * 1.2 * diff.incomeMod;
        r.research = (r.research || 0) + Math.max(1, Math.round(researchGain));
        // 科技积累触发升级 (概率随工业规模提升)
        const upgradeChance = counts.hitech * eff.hitech * 0.003;
        if (Math.random() < upgradeChance) {
          const tiers = ['militaryTier', 'civilTier', 'nuclearTier', 'rocketTier'];
          const pick = tiers[Math.floor(Math.random() * tiers.length)];
          if (n.tech[pick] < 5) {
            n.tech[pick]++;
            if (typeof Game !== 'undefined' && Game.addNews) {
              Game.addNews('工业突破: ' + ({militaryTier:'军事科技',civilTier:'民用科技',nuclearTier:'核技术',rocketTier:'火箭技术'}[pick]) + ' 提升至 ' + n.tech[pick] + ' 级', 'tech');
            }
          }
        }
      }

      // --- 能源工业: 石油资源 + 工业效率加成 ---
      if (counts.energy > 0) {
        n.resources.oil = Math.min(999, (n.resources.oil || 0) + Math.round(counts.energy * eff.energy * 4));
        n.industry.efficiency = Math.min(1.0, n.industry.efficiency + eff.energy * 0.003);
      }

      // 4. 存储工业统计供UI渲染 (使用玩家容量而非国家总槽位)
      n._industryStats = {
        counts: counts,
        eff: { civil: +eff.civil.toFixed(3), military: +eff.military.toFixed(3), hitech: +eff.hitech.toFixed(3), energy: +eff.energy.toFixed(3) },
        slots: playerCap
      };
    },

    // ===== 同步玩家国数据到 Game.state.resources (向下兼容) =====
    syncPlayerResources(gameState) {
      const n = this.nations.GER;
      if (!n || !gameState.resources) return;
      const r = gameState.resources;
      const milPower = Math.round((n.army + n.airforce * 1.2 + n.navy * 0.8) * 0.1 * n.industry.efficiency);
      r.militaryPower = milPower;
      r.nukes = n.nuclear.warheads;
      r.efficiency = n.industry.efficiency;
      r.stability = Math.round(n.stability);

      // 核威慑: 只降不升 —— 保留 calculateIncome 的衰减和事件效果
      // 仅当国家实际核能力下降时（核弹被销毁/投送能力丧失）才拉低
      // 回升只能通过建筑产出、事件、外交行动
      const targetNuke = n.nuclear.deterrence;
      if (targetNuke < r.nukeDeter) {
        r.nukeDeter = targetNuke;
      }

      // 综合威慑: 只降不升 —— 军力/核威慑下降时拉低，不自动回升
      const targetDeter = Math.min(150, milPower + r.nukeDeter);
      if (targetDeter < r.deterrence) {
        r.deterrence = Math.max(0, targetDeter);
      }
    },

    // ===== 获取综合国力排名 =====
    getPowerRanking() {
      if (!this._initialized) this.initSync();
      const list = [];
      for (const id of Object.keys(this.nations)) {
        const n = this.nations[id];
        const milScore = (n.army + n.airforce * 1.2 + n.navy * 0.8) * n.industry.efficiency;
        const nukeScore = n.nuclear.deterrence * 3;
        const econScore = n.gdp * 0.0001 * n.industry.efficiency;
        const techScore = (n.tech.militaryTier + n.tech.civilTier + n.tech.nuclearTier + n.tech.rocketTier) * 20;
        const total = Math.round(milScore + nukeScore + econScore + techScore);
        list.push({ id, name: NAMES[id] || id, power: total, gdp: n.gdp, military: Math.round(milScore), nukes: n.nuclear.warheads, deterrence: n.nuclear.deterrence });
      }
      list.sort((a, b) => b.power - a.power);
      return list;
    },

    // ===== 获取国家摘要 (UI用) =====
    getSummary(id) {
      const n = this.getNation(id);
      if (!n) return null;
      return {
        id,
        name: NAMES[id] || id,
        leader: n.leader || '未知',
        ideology: n.ideology || '未知',
        capital: n.capital || '未知',
        // 经济
        gdp: n.gdp,
        gdpGrowth: n.gdpGrowth,
        inflation: n.inflation,
        treasury: n.treasury,
        taxRate: n.taxRate,
        gdpPerCapita: n.gdpPerCapita || Math.round(n.gdp * 1000000 / n.population),
        // 政治
        stability: n.stability,
        support: n.support,
        corruption: n.corruption,
        // 军事
        army: n.army, airforce: n.airforce, navy: n.navy,
        nukes: n.nuclear.warheads,
        nukeDeterrence: n.nuclear.deterrence,
        // 工业
        industryEff: n.industry.efficiency,
        civilSlots: n.industry.civilSlots,
        milSlots: n.industry.militarySlots,
        hiTechSlots: n.industry.hiTechSlots,
        // 科技
        techMil: n.tech.militaryTier,
        techCiv: n.tech.civilTier,
        techNuke: n.tech.nuclearTier,
        techRocket: n.tech.rocketTier,
        // 人口
        population: n.population,
        lifeExpectancy: n.lifeExpectancy || 65,
        literacy: n.literacy || 0.8,
        urbanRate: n.urbanRate || 0.5,
        // 预算
        budget: n.governmentBudget,
        // 资源
        resources: n.resources,
        // GDP历史
        gdpHistory: n.gdpHistory || [n.gdp],
        // 工业系统统计 (四类工业数量/效率/槽位)
        industryStats: n._industryStats || null,
        // 核威慑公式分解 (UI展示用)
        deterBreakdown: n._deterBreakdown || null,
        // AI战略状态 (仅AI国有)
        aiState: n.aiState ? {
          goal: n.aiState.goal,
          goalName: n.aiState.goalName,
          diploMod: n.aiState.diploMod,
          milMod: n.aiState.milMod,
          gdpMod: n.aiState.gdpMod,
          log: (n.aiState.log || []).slice(-5) // 最近5条战略变更
        } : null
      };
    }
  };

  return NationSim;
});
