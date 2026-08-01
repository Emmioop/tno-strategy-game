/* ============================================================
 * 千年帝国的最后一息 - 核心游戏逻辑
 * ============================================================ */

// ============ 数据读取: 优先 DataStore 拆分加载, 失败回退到 data.js 旧全局 ============
(function _defineDSHelpers(scope) {
  function _DS() {
    if (typeof DataStore !== 'undefined') return DataStore;
    if (scope.DataStore) return scope.DataStore;
    if (typeof window !== 'undefined' && window.DataStore) return window.DataStore;
    return null;
  }
  scope._getBuildings = function () {
    const d = _DS(); if (d) { const r = d.getBuildings(); if (r && Object.keys(r).length) return r; }
    return BUILDINGS || {};
  };
  scope._getTechs = function () {
    const d = _DS(); if (d) { const r = d.getTechs(); if (r && Object.keys(r).length) return r; }
    return TECHS || {};
  };
  scope._getPolicies = function () {
    const d = _DS(); if (d) { const r = d.getPolicies(); if (r && Object.keys(r).length) return r; }
    return POLICIES || {};
  };
  scope._getFoci = function () {
    const d = _DS(); if (d) { const r = d.getNationalFoci(); if (r && Object.keys(r).length) return r; }
    return NATIONAL_FOCI || {};
  };
  scope._getSuccession = function () {
    const d = _DS(); if (d) { const r = d.getSuccessionPaths(); if (r && Object.keys(r).length) return r; }
    return SUCCESSION_PATHS || {};
  };
  scope._getFactions = function () {
    const d = _DS(); if (d) { const r = d.getFactions(); if (r && Object.keys(r).length) return r; }
    return FACTIONS || {};
  };
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));

// ===== 难度定义 =====
const DIFFICULTIES = {
  easy: {
    id: 'easy',
    name: '简单',
    desc: '帝国根基尚稳，适合熟悉剧情',
    color: '#4a9',
    resMod: 1.5,      // 资源倍率
    penMod: 0.5,      // 惩罚倍率
    incomeMod: 1.3,   // 收入倍率
    stabFloor: 5,     // 稳定度下限保护
    deterFloor: 10,   // 威慑下限保护
    crisisChance: 0.25, // 随机危机概率
    unlocked: true
  },
  normal: {
    id: 'normal',
    name: '普通',
    desc: '标准难度，帝国面临真实挑战',
    color: '#c93',
    resMod: 1.0,
    penMod: 1.0,
    incomeMod: 1.0,
    stabFloor: 0,
    deterFloor: 5,
    crisisChance: 0.4,
    unlocked: true
  },
  hard: {
    id: 'hard',
    name: '困难',
    desc: '帝国摇摇欲坠，步步惊心',
    color: '#e60',
    resMod: 0.7,
    penMod: 1.4,
    incomeMod: 0.8,
    stabFloor: 0,
    deterFloor: 0,
    crisisChance: 0.55,
    unlocked: true
  },
  hell: {
    id: 'hell',
    name: '地狱',
    desc: '帝国的末日已至。你确定吗？',
    color: '#a00',
    resMod: 0.5,
    penMod: 1.8,
    incomeMod: 0.6,
    stabFloor: 0,
    deterFloor: 0,
    crisisChance: 0.7,
    unlocked: false  // 需通关困难难度解锁
  }
};

// ===== 游戏模式定义 =====
// 历史: 按主线时间线, 严格TNO剧情
// 沙盒: 随机世界发展, AI加速, 事件池扩充, 自由探索
// 混乱: 随机领导人/路线/事件权重打乱, 不可预测的疯狂世界
const GAME_MODES = {
  historical: {
    id: 'historical',
    name: '历史模式',
    desc: '严格遵循TNO主线时间线，体验原汁原味的剧情',
    color: '#a83232',
    icon: '📜',
    // 影响: 剧情事件正常触发, AI正常发展, 危机正常
    aiSpeedMod: 1.0,        // AI发展速度倍率
    eventWeightMod: 1.0,    // 随机事件权重倍率
    randomLeaders: false,    // 是否随机领导人
    randomPaths: false,      // 是否随机路线
    crisisBoost: 0,          // 危机概率额外加成
    unlocked: true
  },
  sandbox: {
    id: 'sandbox',
    name: '沙盒模式',
    desc: '世界自由发展，AI加速演变，适合长期推演',
    color: '#3a6a9a',
    icon: '🌍',
    aiSpeedMod: 1.5,        // AI发展加速
    eventWeightMod: 1.3,    // 随机事件更多
    randomLeaders: false,
    randomPaths: false,
    crisisBoost: -0.1,       // 危机略降 (自由探索)
    unlocked: true
  },
  chaos: {
    id: 'chaos',
    name: '混乱模式',
    desc: '随机领导人、随机路线、事件权重打乱——不可预测的疯狂世界',
    color: '#8a3a8a',
    icon: '🎲',
    aiSpeedMod: 1.8,
    eventWeightMod: 2.0,    // 事件频发
    randomLeaders: true,     // 随机领导人
    randomPaths: true,       // 随机路线
    crisisBoost: 0.15,       // 危机更频繁
    unlocked: true
  }
};

// 混乱模式可选领导人池 (替代希特勒)
const CHAOS_LEADERS = [
  { id: 'hitler', name: '阿道夫·希特勒', title: '元首（垂死）', ideology: 'none' },
  { id: 'speidel', name: '汉斯·斯派达尔', title: '保护区元帅', ideology: 'neutral' },
  { id: 'rommel', name: '埃尔温·隆美尔', title: '沙漠之狐', ideology: 'neutral' },
  { id: 'himmler', name: '海因里希·希姆莱', title: '勃艮第之主', ideology: 'ss' },
  { id: 'donitz', name: '卡尔·邓尼茨', title: '海军元帅', ideology: 'navy' },
  { id: 'hoefer', name: '迈尔·霍费尔', title: '克里米亚之王', ideology: 'navy' },
  { id: 'random_general', name: '某位无名将领', title: '军政府首脑', ideology: 'military' },
  { id: 'random_bureaucrat', name: '某位官僚', title: '技术官僚', ideology: 'bureaucracy' }
];

// 混乱模式可选路线池
const CHAOS_PATHS = [
  'reform', 'militarist', 'conservative', 'reform_democrat', 'militarist_extreme'
];

const Game = {

  // ===== 游戏状态 =====
  state: null,
  difficulty: 'normal',
  gameMode: 'historical',  // 默认历史模式

  // ===== 检查地狱难度是否解锁 =====
  isHellUnlocked() {
    try {
      return localStorage.getItem('tno_hell_unlocked') === 'true';
    } catch(e) { return false; }
  },

  // ===== 标记困难/地狱难度通关 =====
  checkDifficultyUnlock() {
    try {
      // 只有到达2000年终局（非中途崩溃）才算通关
      const goodEndings = ['democratic_reform', 'peaceful_coexistence', 'reformist_survival',
                           'militarist_victory', 'militarist_stalemate', 'conservative_survival',
                           'dark_victory', 'terror_state', 'reformist_failure', 'militarist_collapse',
                           'conservative_decay'];
      if (this.difficulty === 'hard' && goodEndings.includes(this.state.endingId)) {
        localStorage.setItem('tno_hell_unlocked', 'true');
      }
    } catch(e) {}
  },

  // ===== 获取当前难度配置 =====
  getDiff() {
    return DIFFICULTIES[this.difficulty] || DIFFICULTIES.normal;
  },

  // ===== 获取当前游戏模式配置 =====
  getMode() {
    return GAME_MODES[this.gameMode] || GAME_MODES.historical;
  },

  // ===== 设置游戏模式 =====
  setMode(modeId) {
    if (GAME_MODES[modeId] && GAME_MODES[modeId].unlocked) {
      this.gameMode = modeId;
      return true;
    }
    return false;
  },

  // ===== 混乱模式: 随机选择领导人 =====
  _pickRandomLeader() {
    return CHAOS_LEADERS[Math.floor(Math.random() * CHAOS_LEADERS.length)];
  },

  // ===== 混乱模式: 随机选择路线 =====
  _pickRandomPath() {
    return CHAOS_PATHS[Math.floor(Math.random() * CHAOS_PATHS.length)];
  },

  // 存档版本号（修改资源平衡时递增，旧存档将被重置）
  SAVE_VERSION: 16,

  // ===== 初始化新游戏 =====
  init() {
    const diff = this.getDiff();
    const rm = diff.resMod;

    this.state = {
      // 时间：1962Q1 开始，2000Q4 结束（共156回合）
      year: 1962,
      quarter: 1,
      turn: 1,
      totalTurns: 156, // (2000-1962)*4

      // 难度 + 模式
      difficulty: this.difficulty,
      gameMode: this.gameMode,

      // 当前路线与领导人
      leader: {
        id: 'hitler',
        name: '阿道夫·希特勒',
        title: '元首（垂死）',
        ideology: 'none'
      },
      chosenPath: null,

      // 资源（受难度影响）—— 超少量初始资源
      resources: {
        money: Math.round(200 * rm),         // 帝国马克（百万元）
        manpower: Math.round(30 * rm),       // 可用人力
        stability: Math.round(45 * rm),      // 稳定度 0-100
        deterrence: Math.round(60 * rm),     // 综合威慑
        militaryPower: Math.round(80 * rm),  // 军事实力
        nukeDeter: Math.round(30 * rm),      // 核威慑
        nukes: 2,                             // 核武器数量
        research: Math.round(20 * rm),       // 研发点数
        efficiency: 1.0                       // 工业效率系数
      },

      // 国际关系 -100(敌对) ~ +100(友好)
      relations: {
        ofn: -20,
        japan: -10,
        italy: 5,
        burgundy: -30,
        russia: -40,
        france: -15,
        egypt: 0,
        middle_east: -5,
        africa: -5,
        french_indochina: 0,
        // 殖民地关系
        ukraine: 20,
        ostland: 15,
        moscow: -30,
        caucasus: 10,
        bohemia: 5,
        denmark: 10,
        norway: 5,
        netherlands: 8,
        britanny: 0,
        turkey: 0
      },

      // 建筑 {buildingId: count} —— 极少量初始建筑
      buildings: {
        consumer_factory: 1,
        agriculture: 1,
        arms_factory: 1
      },

      // 建造队列 {id, turnsLeft}
      buildQueue: [],

      // 已研发科技（1962年的帝国已经掌握核武器技术）
      techs: {
        nuclear_tech: true
      },

      // 政策选择 {policyId: optionId}
      policies: {},

      // 国策树系统
      currentFocus: null,      // 当前正在执行的国策id
      focusProgress: 0,        // 已完成回合数
      completedFoci: [],       // 已完成的国策id列表

      // 标记位
      flags: {
        nuclear_tech: true
      },

      // 已触发的一次性事件
      triggeredEvents: {},

      // 事件日志（最近的事件）
      eventLog: [],

      // 新闻流
      newsLog: [],

      // 俄罗斯统一状态
      russiaState: 'fragmented', // fragmented / unifying / unified

      // 游戏是否结束
      ended: false,
      endingId: null,
      saveVersion: this.SAVE_VERSION
    };

    // 初始化国家模拟系统
    if (typeof NationSim !== 'undefined') {
      NationSim.initSync();
      // 用GER数据初始化玩家稳定度（覆盖旧初始值）
      const ger = NationSim.getNation('GER');
      if (ger) {
        this.state.resources.stability = Math.round(ger.stability);
        this.state.resources.efficiency = ger.industry.efficiency;
      }
      // 异步加载完整JSON数据 + 科技树
      NationSim.init().then(() => {
        console.log('[Game] NationSim 异步数据加载完成');
        return NationSim.loadTechTree();
      }).then(() => {
        console.log('[Game] 科技树加载完成');
      }).catch(e => { console.warn('[Game] NationSim 异步加载失败:', e.message); });
    }

    // ===== 游戏模式特殊初始化 =====
    const mode = this.getMode();
    if (mode.randomLeaders) {
      // 混乱模式: 随机领导人
      const rl = this._pickRandomLeader();
      this.state.leader = { id: rl.id, name: rl.name, title: rl.title, ideology: rl.ideology };
      this.addNews(`混乱世界: ${rl.name} 就任 ${rl.title}`, 'world');
    }
    if (mode.randomPaths) {
      // 混乱模式: 随机路线 (但暂不锁定, 仅记录倾向)
      this.state._chaosPathHint = this._pickRandomPath();
    }
    // 沙盒/混乱模式: 初始资源微调 (更多探索空间)
    if (this.gameMode === 'sandbox') {
      this.state.resources.money += 100;
      this.state.resources.research += 30;
    } else if (this.gameMode === 'chaos') {
      // 混乱模式: 资源随机波动 ±30%
      const r = this.state.resources;
      r.money = Math.round(r.money * (0.7 + Math.random() * 0.6));
      r.manpower = Math.round(r.manpower * (0.7 + Math.random() * 0.6));
      r.stability = Math.max(20, Math.min(90, Math.round(r.stability * (0.7 + Math.random() * 0.6))));
    }

    return this.state;
  },

  // ===== 研发科技 (路由: 新科技树treeId 或 旧TECHS id) =====
  researchTech(techId) {
    // 新科技树 (military/civil/nuclear/rocket)
    const treeIds = ['military', 'civil', 'nuclear', 'rocket'];
    if (treeIds.indexOf(techId) >= 0) {
      if (typeof NationSim === 'undefined') return { ok: false, msg: '系统未加载' };
      const result = NationSim.researchTech(techId, this.state);
      if (result.ok) this.clampResources();
      return result;
    }
    // 旧TECHS (flag式: nuclear_tech/advanced_tech/...)
    const TECHS = _getTechs();
    const t = TECHS[techId];
    if (!t) return { ok: false, msg: '科技不存在' };
    if (this.state.techs[techId]) return { ok: false, msg: '已研发' };
    if (this.state.resources.research < t.cost) return { ok: false, msg: '研发点数不足' };
    this.state.resources.research -= t.cost;
    this.state.techs[techId] = true;
    this.state.flags[techId] = true;
    this.addNews('科技突破: ' + t.name, 'tech');
    this.clampResources();
    return { ok: true, msg: t.name + ' 研发成功' };
  },

  // ===== 获取科技树状态 (UI用) =====
  getTechTreeStatus() {
    if (typeof NationSim === 'undefined') return null;
    return NationSim.getTechTreeStatus(this.state);
  },

  // ===== 获取当前日期字符串 =====
  getDateStr() {
    const q = ['一', '二', '三', '四'];
    return `${this.state.year}年 第${q[this.state.quarter - 1]}季度`;
  },

  // ===== 计算回合数（用于事件触发） =====
  turnToYearQuarter(turn) {
    const year = 1962 + Math.floor((turn - 1) / 4);
    const quarter = ((turn - 1) % 4) + 1;
    return { year, quarter };
  },

  // ===== 当前是否匹配指定年/季度 =====
  matchesTurn(turnMatch) {
    if (!turnMatch) return true;
    return this.state.year === turnMatch.year && this.state.quarter === turnMatch.quarter;
  },

  // ===== 检查事件触发条件 =====
  checkEventCondition(ev) {
    // 一次性事件已触发过
    if (ev.once && this.state.triggeredEvents[ev.id]) return false;

    // 回合匹配
    if (ev.turn) {
      if (!this.matchesTurn(ev.turn)) return false;
    } else {
      // 随机事件：检查 minTurn/maxTurn
      if (ev.minTurn) {
        const t = ev.minTurn;
        if (this.state.year < t.year) return false;
      }
      if (ev.maxTurn) {
        const t = ev.maxTurn;
        if (this.state.year > t.year) return false;
      }
    }

    // 自定义条件
    if (ev.condition && !ev.condition(this.state)) return false;

    return true;
  },

  // ===== 获取本回合应触发的事件 =====
  getEventsForTurn() {
    const events = [];
    // 优先走 DataStore (年份拆分, 内存占用 <50%原加载)
    // DataStore.getEventPool() 会返回「story_core剧情事件 + 当前年±1年随机池」
    // 若启用 fallback，返回旧版 STORY_EVENTS 全局数组，兼容老代码
    const ds = (typeof DataStore !== 'undefined') ? DataStore : null;
    const pool = (ds && typeof ds.getEventPool === 'function') ? ds.getEventPool()
      : ((typeof STORY_EVENTS !== 'undefined') ? STORY_EVENTS
        : ((typeof window !== 'undefined' && window.STORY_EVENTS) ? window.STORY_EVENTS : []));

    // 1. 匹配回合的剧情事件
    for (const ev of pool) {
      if (ev.turn && this.checkEventCondition(ev)) {
        events.push(ev);
      }
    }

    // 2. 随机事件（每回合最多1个，按权重）
    const randomCandidates = pool.filter(ev =>
      !ev.turn && ev.weight && this.checkEventCondition(ev)
    );
    // 游戏模式影响: 危机概率 + eventWeightMod 调整触发频率
    const mode = this.getMode();
    const crisisChance = Math.max(0, Math.min(1, this.getDiff().crisisChance + (mode.crisisBoost || 0)));
    if (randomCandidates.length > 0 && Math.random() < crisisChance) {
      const wMod = mode.eventWeightMod || 1.0;
      const totalWeight = randomCandidates.reduce((s, e) => s + e.weight * wMod, 0);
      let r = Math.random() * totalWeight;
      for (const ev of randomCandidates) {
        r -= ev.weight * wMod;
        if (r <= 0) {
          events.push(ev);
          break;
        }
      }
    }

    return events;
  },

  // ===== 应用事件效果 =====
  applyEffects(effects) {
    if (!effects) return [];
    const changes = [];
    const diff = this.getDiff();

    // 关系key映射：事件中用 ofn_relation，state中用 ofn
    const relKeyMap = {
      ofn_relation: 'ofn',
      japan_relation: 'japan',
      italy_relation: 'italy',
      burgundy_relation: 'burgundy',
      russia_relation: 'russia',
      france_relation: 'france',
      egypt_relation: 'egypt',
      middle_east_relation: 'middle_east',
      africa_relation: 'africa',
      french_indochina_relation: 'french_indochina',
      // 殖民地关系映射
      ukraine_relation: 'ukraine',
      ostland_relation: 'ostland',
      moscow_relation: 'moscow',
      caucasus_relation: 'caucasus',
      bohemia_relation: 'bohemia',
      denmark_relation: 'denmark',
      norway_relation: 'norway',
      netherlands_relation: 'netherlands',
      britanny_relation: 'britanny',
      turkey_relation: 'turkey'
    };

    for (const key in effects) {
      const val = effects[key];
      let actualVal = val;
      // 映射关系key
      const mappedKey = relKeyMap[key] || key;

      // 负面效果受难度惩罚倍率影响
      if (val < 0 && (mappedKey in this.state.resources || mappedKey in this.state.relations)) {
        actualVal = Math.round(val * diff.penMod);
      }

      if (mappedKey in this.state.resources) {
        this.state.resources[mappedKey] += actualVal;
        changes.push({ key: mappedKey, val: actualVal });
      } else if (mappedKey in this.state.relations) {
        this.state.relations[mappedKey] = Math.max(-100, Math.min(100, this.state.relations[mappedKey] + actualVal));
        changes.push({ key: mappedKey, val: actualVal });
      }
    }
    return changes;
  },

  // ===== 设置标记 =====
  setFlags(flags) {
    if (!flags) return;
    for (const k in flags) {
      this.state.flags[k] = flags[k];
    }
  },

  // ===== 处理事件选项 =====
  chooseEventOption(ev, choice) {
    // 检查选项条件
    if (choice.condition && !choice.condition(this.state)) {
      return false;
    }

    // 应用效果
    this.applyEffects(choice.effects);
    this.setFlags(choice.setFlags);

    // 标记事件已触发
    if (ev.once) {
      this.state.triggeredEvents[ev.id] = true;
    } else {
      // 随机事件也标记，避免短期重复（但允许后期再触发）
      this.state.triggeredEvents[ev.id + '_' + this.state.turn] = true;
    }

    // 执行 onTrigger（用于特殊逻辑）
    if (ev.onTrigger) {
      ev.onTrigger(this.state);
    }

    // 记录日志
    this.state.eventLog.unshift({
      turn: this.state.turn,
      date: this.getDateStr(),
      title: ev.title,
      choice: choice.text
    });
    if (this.state.eventLog.length > 30) this.state.eventLog.pop();

    // 添加新闻
    if (choice.showToast) {
      this.addNews(choice.showToast, 'crisis');
    }

    // 限制资源范围
    this.clampResources();

    return true;
  },

  // ===== 限制资源范围 =====
  clampResources() {
    const r = this.state.resources;
    const diff = this.getDiff();
    r.stability = Math.max(0, Math.min(100, r.stability));
    r.deterrence = Math.max(0, Math.min(150, r.deterrence));
    r.nukeDeter = Math.max(0, Math.min(150, r.nukeDeter));
    r.efficiency = Math.max(0.3, Math.min(2.0, r.efficiency));
    r.money = Math.max(-200, r.money);
    r.manpower = Math.max(0, r.manpower);
    r.nukes = Math.max(0, r.nukes);
  },

  // ===== 添加新闻 =====
  addNews(text, type = 'world') {
    this.state.newsLog.unshift({
      date: this.getDateStr(),
      text: text,
      type: type
    });
    if (this.state.newsLog.length > 40) this.state.newsLog.pop();
  },

  // ===== 建造建筑 =====
  buildBuilding(buildingId) {
    const BUILDINGS = _getBuildings();
    const TECHS = _getTechs();
    const b = BUILDINGS[buildingId];
    if (!b) return { ok: false, msg: '建筑不存在' };

    // 检查科技前置
    if (b.requires && !this.state.flags[b.requires] && !this.state.techs[b.requires]) {
      return { ok: false, msg: '需要前置科技: ' + (TECHS[b.requires]?.name || b.requires) };
    }

    // 检查资金
    if (this.state.resources.money < b.cost) {
      return { ok: false, msg: '资金不足' };
    }

    // 扣除资金，加入队列
    this.state.resources.money -= b.cost;
    this.state.buildQueue.push({
      id: buildingId,
      name: b.name,
      turnsLeft: b.buildTime
    });

    return { ok: true, msg: `${b.name} 开始建造，${b.buildTime}季度后完成` };
  },

  // ===== 拆除建筑 =====
  demolishBuilding(buildingId) {
    const BUILDINGS = _getBuildings();
    const b = BUILDINGS[buildingId];
    if (!b) return { ok: false, msg: '建筑不存在' };
    if (!this.state.buildings[buildingId] || this.state.buildings[buildingId] <= 0) {
      return { ok: false, msg: '没有可拆除的建筑' };
    }
    this.state.buildings[buildingId]--;
    // 返还少量资金
    this.state.resources.money += Math.floor(b.cost * 0.3);
    return { ok: true, msg: `${b.name} 已拆除，返还部分资金` };
  },

  // ===== 研发科技 =====
  researchTech(techId) {
    const TECHS = _getTechs();
    const t = TECHS[techId];
    if (!t) return { ok: false, msg: '科技不存在' };
    if (this.state.techs[techId]) return { ok: false, msg: '已研发完成' };
    if (this.state.resources.research < t.cost) return { ok: false, msg: '研发点数不足' };

    this.state.resources.research -= t.cost;
    this.state.techs[techId] = true;
    this.state.flags[techId] = true; // 同时设为flag，便于事件条件判断

    return { ok: true, msg: `${t.name} 研发完成` };
  },

  // ===== 设置政策 =====
  setPolicy(policyId, optionId) {
    const POLICIES = _getPolicies();
    const p = POLICIES[policyId];
    if (!p) return { ok: false, msg: '政策不存在' };
    const opt = p.options.find(o => o.id === optionId);
    if (!opt) return { ok: false, msg: '选项不存在' };

    // 检查条件
    if (opt.requires && !this.state.flags[opt.requires] && this.state.leader.ideology !== opt.requires) {
      // 也允许通过 leader ideology 判断
      if (this.state.leader.ideology !== opt.requires) {
        return { ok: false, msg: '需要路线: ' + opt.requires };
      }
    }
    if (opt.requiresFlag && !this.state.flags[opt.requiresFlag]) {
      return { ok: false, msg: '需要前置条件' };
    }

    this.state.policies[policyId] = optionId;
    return { ok: true, msg: `政策已更新: ${opt.name}` };
  },

  // ===== 检查政策是否可用 =====
  canChoosePolicy(policyId, optionId) {
    const POLICIES = _getPolicies();
    const p = POLICIES[policyId];
    if (!p) return false;
    const opt = p.options.find(o => o.id === optionId);
    if (!opt) return false;

    // requires: 路线要求
    if (opt.requires) {
      if (this.state.leader.ideology !== opt.requires && !this.state.flags[opt.requires]) {
        return false;
      }
    }
    // requiresFlag: 前置标记
    if (opt.requiresFlag && !this.state.flags[opt.requiresFlag]) {
      return false;
    }
    return true;
  },

  // ===== 国策树系统 =====
  startFocus(focusId) {
    const NATIONAL_FOCI = _getFoci();
    const f = NATIONAL_FOCI[focusId];
    if (!f) return { ok: false, msg: '国策不存在' };
    if (this.state.currentFocus) return { ok: false, msg: '正在执行其他国策' };
    if (this.state.completedFoci.includes(focusId)) return { ok: false, msg: '该国策已完成' };
    if (this.state.resources.money < f.cost) return { ok: false, msg: '资金不足' };
    // 检查前置
    for (const req of (f.requires || [])) {
      if (!this.state.completedFoci.includes(req)) return { ok: false, msg: '需要前置国策' };
    }
    // 检查路线
    if (f.ideology && this.state.leader.ideology !== f.ideology && !this.state.flags[f.ideology]) {
      return { ok: false, msg: '路线不符' };
    }
    // 检查requiresFlag
    if (f.requiresFlag && !this.state.flags[f.requiresFlag]) {
      return { ok: false, msg: '需要前置条件' };
    }

    this.state.resources.money -= f.cost;
    this.state.currentFocus = focusId;
    this.state.focusProgress = 0;
    return { ok: true, msg: `开始执行: ${f.name}` };
  },

  canStartFocus(focusId) {
    const NATIONAL_FOCI = _getFoci();
    const f = NATIONAL_FOCI[focusId];
    if (!f) return false;
    if (this.state.currentFocus) return false;
    if (this.state.completedFoci.includes(focusId)) return false;
    if (this.state.resources.money < f.cost) return false;
    for (const req of (f.requires || [])) {
      if (!this.state.completedFoci.includes(req)) return false;
    }
    if (f.ideology && this.state.leader.ideology !== f.ideology && !this.state.flags[f.ideology]) return false;
    if (f.requiresFlag && !this.state.flags[f.requiresFlag]) return false;
    return true;
  },

  getFocusLockReason(focusId) {
    const NATIONAL_FOCI = _getFoci();
    const f = NATIONAL_FOCI[focusId];
    if (!f) return '国策不存在';
    if (this.state.completedFoci.includes(focusId)) return '已完成';
    if (this.state.currentFocus) return '正在执行其他国策';
    if (this.state.resources.money < f.cost) return `需要 ${f.cost} 资金`;
    for (const req of (f.requires || [])) {
      if (!this.state.completedFoci.includes(req)) {
        const reqFocus = NATIONAL_FOCI[req];
        return `需要先完成: ${reqFocus ? reqFocus.name : req}`;
      }
    }
    if (f.ideology && this.state.leader.ideology !== f.ideology && !this.state.flags[f.ideology]) {
      const ideologyNames = { reformist: '改革派', militarist: '军国派', conservative: '保守派', extremist: '极端派' };
      return `需要${ideologyNames[f.ideology] || f.ideology}路线`;
    }
    if (f.requiresFlag && !this.state.flags[f.requiresFlag]) return '需要前置科技或条件';
    return '';
  },

  // ===== 检查选项（事件）是否可用 =====
  canChooseEventOption(ev, choice) {
    if (!choice.condition) return true;
    try {
      return !!choice.condition(this.state);
    } catch (e) {
      console.warn('[事件选项] condition执行异常，视为可用:', e.message);
      return true;
    }
  },

  // ===== 计算每回合收支 =====
  calculateIncome() {
    const r = this.state.resources;
    const eff = r.efficiency;
    const diff = this.getDiff();
    let income = { money: 0, manpower: 0, stability: 0, deterrence: 0,
                   militaryPower: 0, nukeDeter: 0, nukes: 0, research: 0 };

    // 建筑产出：只允许 money/manpower/efficiency/nukes（其他资源只能通过事件获得）
    const passiveKeys = { money: 1, manpower: 1, efficiency: 1, nukes: 1 };
    const BUILDINGS = _getBuildings();
    for (const bid in this.state.buildings) {
      const count = this.state.buildings[bid];
      const b = BUILDINGS[bid];
      if (!b) continue;
      const eff_multi = b.type === 'civilian' ? eff : 1.0;
      for (const key in b.effects) {
        if (passiveKeys[key]) {
          income[key] = (income[key] || 0) + b.effects[key] * count * eff_multi;
        }
      }
      // 维护成本
      income.money -= b.maint * count;
    }

    // 政策影响 —— 大幅削弱，只保留极少量加成
    this.applyPolicyEffects(income);

    // 稳定度衰减（只降不回，必须通过事件恢复）
    if (r.stability > 60) income.stability -= (r.stability - 60) * 0.05;
    if (r.stability > 30) income.stability -= 0.5;

    // 威慑衰减（加大力度）
    income.deterrence -= 2;

    // 军力衰减（军备维护）
    income.militaryPower -= 0.5;

    // 研发衰减（研究老化）
    income.research -= 0.3;

    // 核武库衰减（维护）
    income.nukeDeter -= 1;

    // 基础收入 —— 超少量被动增加
    income.money += 1;
    income.manpower += 1;

    // 国策树持续加成：已完成国策提供每回合buff
    const NATIONAL_FOCI = _getFoci();
    for (const fid of this.state.completedFoci) {
      const f = NATIONAL_FOCI[fid];
      if (!f || !f.perTurn) continue;
      for (const key in f.perTurn) {
        income[key] = (income[key] || 0) + f.perTurn[key];
      }
    }

    // 难度修正：正面收入受incomeMod影响，负面受penMod影响
    for (const key in income) {
      if (income[key] > 0) {
        income[key] = income[key] * diff.incomeMod;
      } else if (income[key] < 0) {
        income[key] = income[key] * diff.penMod;
      }
    }

    // 地狱难度额外惩罚
    if (this.difficulty === 'hell') {
      income.stability -= 0.5;   // 持续动荡
      income.deterrence -= 0.5;  // 威慑持续衰减
    }

    return income;
  },

  // ===== 应用政策效果到收入 =====
  applyPolicyEffects(income) {
    const s = this.state;
    // 政策只提供极少量 money/manpower，其他（稳定/威慑/军力/核慑/研发）只能通过事件获得
    const econ = s.policies.economy;
    if (econ === 'slave_economy') { income.money += 2; }
    if (econ === 'mixed_reform') { income.money += 1; }
    if (econ === 'war_economy') { income.money -= 2; }
    if (econ === 'free_market') { income.money += 3; }

    const slave = s.policies.slave_policy;
    if (slave === 'maintain_slaves') { income.money += 2; }
    if (slave === 'limited_rights') { income.manpower += 1; }
    if (slave === 'gradual_emancipation') { income.money -= 2; income.manpower += 1; }
    if (slave === 'harsher_rule') { income.money += 2; income.manpower -= 1; }

    const mil = s.policies.military_doctrine;
    if (mil === 'defensive') { income.money += 1; }
    if (mil === 'expansionist') { income.money -= 2; }
    if (mil === 'modernization') { income.money += 1; }
    if (mil === 'nuclear_first') { income.money -= 3; }

    const youth = s.policies.youth_policy;
    if (youth === 'suppress_youth') { income.manpower -= 1; }
    if (youth === 'coopt_youth') { income.money += 1; }
    if (youth === 'dialogue') { income.money += 1; }
    if (youth === 'militarize_youth') { income.manpower += 2; income.money -= 1; }
  },

  // ===== 推进一回合 =====
  advanceTurn(eventsQueue, onEvent) {
    if (this.state.ended) return;

    // 1. 处理建造队列
    const completed = [];
    for (let i = this.state.buildQueue.length - 1; i >= 0; i--) {
      this.state.buildQueue[i].turnsLeft--;
      if (this.state.buildQueue[i].turnsLeft <= 0) {
        const item = this.state.buildQueue[i];
        this.state.buildings[item.id] = (this.state.buildings[item.id] || 0) + 1;
        completed.push(item.name);
        this.state.buildQueue.splice(i, 1);
      }
    }
    completed.forEach(name => {
      this.addNews(`${name} 建造完成`, 'economy');
    });

    // 2. 推进国策
    if (this.state.currentFocus) {
      this.state.focusProgress++;
      const NATIONAL_FOCI = _getFoci();
      const f = NATIONAL_FOCI[this.state.currentFocus];
      if (this.state.focusProgress >= f.turns) {
        // 国策完成
        this.applyEffects(f.effects);
        if (f.setFlags) { Object.assign(this.state.flags, f.setFlags); }
        this.state.completedFoci.push(this.state.currentFocus);
        const doneName = f.name;
        this.state.currentFocus = null;
        this.state.focusProgress = 0;
        this.addNews(`国策完成: ${doneName}`, 'world');
        // 可以在这里添加事件触发逻辑
      }
    }

    // 3. 计算并应用收入
    const income = this.calculateIncome();
    for (const key in income) {
      this.state.resources[key] = (this.state.resources[key] || 0) + income[key];
    }
    this.clampResources();

    // 3.5 国家模拟系统更新 (经济/政治/军事/科技/人口)
    if (typeof NationSim !== 'undefined') {
      NationSim.updateAll(this.state);
    }

    // 4. 推进时间
    this.state.turn++;
    const prevYear = this.state.year;
    this.state.quarter++;
    if (this.state.quarter > 4) {
      this.state.quarter = 1;
      this.state.year++;
    }

    // 4.1 借贷系统：每回合递减剩余期限
    if (this.state.flags.loan_active) {
      this.state.flags.loan_remaining--;
      if (this.state.flags.loan_remaining <= 0) {
        // 债券到期，必须偿还
        const due = this.state.flags.loan_total_due || 180;
        if (this.state.resources.money >= due) {
          // 自动扣除还款
          this.state.resources.money -= due;
          this.state.flags.loan_active = false;
          this.state.flags.loan_cooldown = 120; // 30年冷却
          this.addNews(`帝国债券到期，已偿还 ${due} 资金（含利息）`, 'economy');
        } else {
          // 无法偿还，严厉惩罚
          const shortfall = due - this.state.resources.money;
          this.state.resources.money = 0;
          this.state.resources.stability = Math.max(0, this.state.resources.stability - 30);
          this.state.resources.deterrence = Math.max(0, this.state.resources.deterrence - 15);
          this.state.relations.ofn = Math.max(-100, this.state.relations.ofn - 20);
          this.state.flags.loan_active = false;
          this.state.flags.loan_defaulted = true;
          this.state.flags.loan_cooldown = 240; // 违约后60年不能借
          this.addNews(`帝国债券违约！信用崩溃，损失 ${shortfall.toFixed(0)} 资金。稳定-30，威慑-15`, 'crisis');
        }
      } else if (this.state.flags.loan_remaining % 4 === 0) {
        // 每年提醒
        const yearsLeft = this.state.flags.loan_remaining / 4;
        this.addNews(`帝国债券还剩 ${yearsLeft} 年到期，需偿还 ${this.state.flags.loan_total_due || 180} 资金`, 'economy');
      }
    } else if (this.state.flags.loan_cooldown) {
      this.state.flags.loan_cooldown--;
      if (this.state.flags.loan_cooldown <= 0) {
        delete this.state.flags.loan_cooldown;
        this.addNews('帝国债券冷却期结束，可再次发行', 'economy');
      }
    }

    // 4.2 年份变化时通知 DataStore 加载新年份池，释放旧池（若DataStore启用）
    if (this.state.year !== prevYear) {
      const ds = (typeof DataStore !== 'undefined') ? DataStore
        : (typeof window !== 'undefined' ? window.DataStore : null);
      if (ds && typeof ds.ensureYear === 'function' && !ds._fallback) {
        // 异步执行不阻塞回合推进，加载完成后未来回合的事件池会自动变大
        ds.ensureYear(this.state.year).catch(err => { console.warn('[Game] 预加载新年份失败:', err && err.message); });
      }
    }

    // 5. 检查事件
    const turnEvents = this.getEventsForTurn();
    if (turnEvents.length > 0 && onEvent) {
      onEvent(turnEvents);
    }

    // 6. 检查结局
    this.checkEnding();

    // 7. 添加随机新闻
    if (Math.random() < 0.4) {
      this.generateRandomNews();
    }

    return { income, completed, turnEvents };
  },

  // ===== 生成随机新闻 =====
  generateRandomNews() {
    const newsPool = [
      { text: '日耳曼尼亚证券交易所开盘，马克汇率波动', type: 'economy' },
      { text: '美国太平洋舰队在夏威夷海域演习', type: 'world' },
      { text: '日本宣布新的"共荣圈"经济计划', type: 'world' },
      { text: '俄罗斯军阀在乌拉尔发生冲突', type: 'world' },
      { text: '意大利电影在帝国地下流行', type: 'world' },
      { text: '鲁尔区工厂订单增加', type: 'economy' },
      { text: '帝国空军试飞新型战斗机', type: 'world' },
      { text: '三头同盟外长会议在那不勒斯召开', type: 'world' },
      { text: '帝国教育部收紧大学课程审查', type: 'world' },
      { text: '美国NPP与共和民主党在国会激烈辩论', type: 'world' },
      { text: '合成燃料工厂产量创新高', type: 'economy' },
      { text: '东方总督辖区发生小规模骚乱', type: 'crisis' },
      { text: '帝国航天局发布新火箭设计', type: 'tech' },
      { text: '奥地利发生反奴隶制示威', type: 'crisis' },
      { text: '日本天皇接见共荣圈代表', type: 'world' },
      { text: '科米共和国举行秘密选举，结果未知', type: 'world' },
      { text: '西伯利亚黑军宣布新经济政策', type: 'world' },
      { text: '远东军阀在赤塔举行会谈', type: 'world' },
      { text: '伊比利亚联盟爆发反弗朗哥示威', type: 'crisis' },
      { text: '法国地下报纸《自由报》在巴黎散发', type: 'crisis' },
      { text: '英国抵抗组织炸毁曼彻斯特铁路', type: 'crisis' },
      { text: '土耳其军方与文官政府关系紧张', type: 'world' },
      { text: '意大利东非殖民地发生土著起义', type: 'crisis' },
      { text: '帝国马克对美元汇率持续下跌', type: 'economy' },
      { text: '美国宣布新一代洲际导弹试射成功', type: 'world' },
      { text: '日本海军在太平洋试射反舰导弹', type: 'world' },
      { text: '乌拉尔山脉以东发现新矿藏', type: 'economy' },
      { text: '帝国统计局报告：生育率再创新低', type: 'crisis' },
      { text: '勃艮第边境加强巡逻，原因不明', type: 'crisis' },
      { text: '罗马教皇发表复活节讲话，呼吁和平', type: 'world' }
    ];
    const n = newsPool[Math.floor(Math.random() * newsPool.length)];
    this.addNews(n.text, n.type);
  },

  // ===== 检查结局条件 =====
  checkEnding() {
    const s = this.state;
    const r = s.resources;
    const diff = this.getDiff();

    // 核毁灭结局
    if (s.flags.nuclear_holocaust) {
      this.endGame('nuclear_holocaust');
      return;
    }

    // 稳定度归零 - 崩溃（简单难度有保护）
    if (r.stability <= diff.stabFloor && r.stability <= 0) {
      this.endGame('collapse');
      return;
    }

    // 资金极度负债 - 经济崩溃
    const debtLimit = this.difficulty === 'hell' ? -100 : (this.difficulty === 'hard' ? -120 : -150);
    if (r.money <= debtLimit) {
      this.endGame('economic_collapse');
      return;
    }

    // 威慑过低且敌对 - 被入侵
    const deterThreshold = diff.deterFloor;
    if (r.deterrence <= deterThreshold && (s.relations.russia < -50 || s.relations.ofn < -50)) {
      this.endGame('invasion');
      return;
    }

    // 地狱难度额外：威慑极低直接崩溃
    if (this.difficulty === 'hell' && r.deterrence <= 0) {
      this.endGame('invasion');
      return;
    }

    // 到达2000年 - 根据状态判定结局
    if (s.year >= 2001) {
      this.determineFinalEnding();
      return;
    }

    // 提前到达2000Q4
    if (s.year === 2000 && s.quarter === 4 && s.turn >= s.totalTurns) {
      this.determineFinalEnding();
      return;
    }
  },

  // ===== 判定最终结局 =====
  determineFinalEnding() {
    const s = this.state;
    const r = s.resources;
    const f = s.flags;

    let endingId;

    // 根据路线和状态判定
    if (f.reformist) {
      if (r.stability > 70 && r.deterrence > 60 && f.ofn_detente) {
        endingId = 'democratic_reform'; // 民主化改革成功
      } else if (r.stability > 50) {
        endingId = 'reformist_survival'; // 改革派延续
      } else {
        endingId = 'reformist_failure'; // 改革失败
      }
    } else if (f.militarist) {
      if (r.deterrence > 100 && r.stability > 40) {
        endingId = 'militarist_victory'; // 军国胜利
      } else if (r.deterrence > 60) {
        endingId = 'militarist_stalemate'; // 军国僵持
      } else {
        endingId = 'militarist_collapse'; // 军国崩溃
      }
    } else if (f.extremist) {
      if (f.nuclear_first_strike || f.burgundy_ally) {
        endingId = 'dark_victory'; // 黑暗胜利
      } else {
        endingId = 'terror_state'; // 恐怖国家
      }
    } else if (f.conservative) {
      if (r.stability > 60) {
        endingId = 'conservative_survival'; // 保守延续
      } else {
        endingId = 'conservative_decay'; // 保守衰亡
      }
    } else {
      // 默认
      if (r.stability > 60 && r.deterrence > 50) {
        endingId = 'conservative_survival';
      } else {
        endingId = 'collapse';
      }
    }

    // 特殊结局覆盖
    if (f.peace_maker && r.stability > 65) {
      endingId = 'peaceful_coexistence'; // 缓和共存（最佳结局）
    }

    this.endGame(endingId);
  },

  // ===== 结束游戏 =====
  endGame(endingId) {
    this.state.ended = true;
    this.state.endingId = endingId;
    // 检查难度解锁：通关困难难度解锁地狱难度
    this.checkDifficultyUnlock();
  }
};

// 导出
if (typeof window !== 'undefined') {
  window.Game = Game;
  window.DIFFICULTIES = DIFFICULTIES;
  window.GAME_MODES = GAME_MODES;
  window.CHAOS_LEADERS = CHAOS_LEADERS;
  window.CHAOS_PATHS = CHAOS_PATHS;
}
