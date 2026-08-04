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
    loanInterest: 0.20, // 帝国债券利率20%
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
    loanInterest: 0.35, // 35%
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
    loanInterest: 0.50, // 50%
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
    loanInterest: 0.70, // 70%
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
  turnMode: 'quarterly',   // 'quarterly'(季度,156回合) 或 'bimonthly'(半月,936回合)

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
  SAVE_VERSION: 19,

  // ===== 事件分类配置 =====
  EVENT_CONFIG: {
    coreBudget: 4,           // 默认每回合最多弹窗的核心事件数（按 turnMode 动态调整）
    autoArchiveFlavor: true  // 风味事件自动结算归档
  },

  // ===== 回合模式事件密度配置 =====
  // 精简版(quarterly, 156回合): 剧情+玩法平衡, 45% 空白回合, 约80个弹窗, 无随机事件
  //   - critical/story 阻止空白, major 降级为风味自动结算
  //   - critical 85% 弹窗, story 90% 弹窗
  // 沉浸完整版(bimonthly, 936回合): 非常完整, 25% 空白回合, 约240个弹窗, 随机事件稀少
  //   - critical/story/major 全部阻止空白, 全部弹窗, 完整呈现剧情
  //   - 每回合最多2个弹窗, 避免同回合过载
  TURN_MODE_CONFIG: {
    quarterly: {
      coreBudget: 1,          // 每回合最多1个弹窗
      quietChance: 0.45,      // 45% 空白回合（剧情与玩法平衡）
      blockQuietTags: ['critical', 'story'], // critical/story 阻止空白，major 可被空白吞掉
      randomChanceMod: 0,     // 精简版不生成随机事件
      demoteMinor: true,      // minor/diplomacy/economy/military 降级为风味
      demoteMajor: true,      // major 降级为风味自动结算（精简版聚焦 critical+story 主线）
      criticalSparseRate: 0.85,// critical 事件 85% 弹窗（130个→约110个，配合空白回合实际约70个）
      storySparseRate: 0.9,   // story 事件 90% 弹窗
      randomMinInterval: 999  // 精简版不生成随机事件
    },
    bimonthly: {
      coreBudget: 2,          // 每回合最多2个弹窗（完整呈现剧情，允许同回合多事件）
      quietChance: 0.25,      // 仅 25% 空白回合（936回合→约700个有事件回合，足够承载全部剧情）
      blockQuietTags: ['critical', 'story', 'major'], // 所有关键事件都阻止空白回合
      randomChanceMod: 0.15,  // 随机事件概率 ×0.15（稀少但存在，增加变数）
      demoteMinor: false,     // 保留所有核心事件分类
      demoteMajor: false,     // 保留 major（完整剧情）
      criticalSparseRate: 1.0,// critical 事件全部弹窗（完整呈现）
      storySparseRate: 1.0,   // story 事件全部弹窗
      randomMinInterval: 10   // 随机事件至少间隔10回合
    }
  },

  // ===== 获取当前回合模式配置 =====
  getTurnModeCfg() {
    return this.TURN_MODE_CONFIG[this.turnMode] || this.TURN_MODE_CONFIG.quarterly;
  },

  // ===== 判断事件是否为风味事件（不影响大局，自动结算） =====
  FLAVOR_KEYWORDS: [
    'moon_landing', 'space_race', 'space_station', 'mars_landing', 'us_space_program',
    '登月', '星辰大海', '火星', '天空之城', '太空',
    'computer_revolution', 'internet_era', 'personal_computer', 'german_internet',
    'technology_revolution', 'information_age', 'genetic_engineering',
    '硅与火', '网络', '计算机', '数字革命', '信息时代', '基因', '上帝的剪刀',
    'environmental_crisis', 'environmental_movement', 'env_cold_war', 'env_nuclear',
    'atlantropa', 'gibraltar_dam', 'mediterranean_draining',
    '燃烧的地球', '灰色的天空', '绿色的觉醒', '干涸的海洋', '亚特兰特罗帕', '直布罗陀大坝',
    'demographic_winter', '人口寒冬', '千禧年', 'millennium',
    'pandemic_flu', 'rnd_plague', '瘟疫', '白色瘟疫',
    'chernobyl', 'nuclear_accident_germany', '哈茨山', '熔毁', '易北河',
    'rnd_natural_disaster', 'rnd_industrial_accident', 'rnd_scientist_defects',
    'rnd_research_breakthrough', 'rnd_youth_subculture', '亚文化'
  ],

  // ===== 核心事件方向分类关键词（只匹配ID+标题，不匹配body） =====
  DIRECTION_KEYWORDS: {
    japan: [
      'ev_japan', 'ev_cps', 'japan_', 'cps_',
      '共荣圈', '日本', '日元', '东京', '樱花', '满洲', '海陆的对立',
      '东京之春', '中国大崩溃', '中国的碎片化', '满洲的火种', '朝鲜的怒火',
      '中国腹地', '共荣圈的解体', '万隆之火', '中原烽火', '满洲的钢铁',
      '香料群岛的怒火', '次大陆的撕裂', '波斯的怒吼', '非洲之角的战争'
    ],
    us: [
      'ev_us_', 'us_civil', 'us_kennedy', 'us_race', 'us_second_civil', 'us_ofn',
      'us_recovery', 'us_presidential', 'us_detente', 'us_new_era', 'us_economic',
      'us_space', 'ofn_diplomacy', 'ofn_intervention', 'ev_ofn_',
      '美国', '美洲的动荡', '达拉斯的枪声', '华盛顿的游行', '燃烧的城市',
      '瘫痪的灯塔', '合众国', '我有一个梦想', '美国回来了', '星辰大海',
      '美国的新时代', '苏黎世的密使', '华盛顿的勃艮第影子'
    ],
    russia: [
      'ev_russia', 'ev_wrrf', 'ev_west_russia', 'ev_ural', 'ev_aryan_brotherhood',
      'russia', 'wrrf', 'west_russia',
      '俄罗斯', '巨熊', '红色幽灵', '西俄', '乌拉尔', '鄂木斯克',
      '科米', '托木斯克', '西伯利亚', '马加丹', '赤塔', '贝加尔',
      '伊尔库茨克', '克麦罗沃', '维亚特卡', '萨马拉', '阿穆尔',
      '群雄逐鹿', '东方的曙光', '东方的暗夜', '新俄罗斯', '红色巨熊',
      '黑色俄罗斯', '摄政的疯狂', '钢铁复苏', '铁幕降临', '最后通牒',
      '核阴影', '黑暗的终结', '双头鹰', 'AA线', '命运的抉择',
      '战后余波', '千年之战', '民主之灯', '自由领土', '巨熊苏醒',
      '第四极', '俄罗斯的决战', '神权恐怖', '俄罗斯难民', '乌拉尔山的枪声',
      '东方的和解', '统一之战', '东方废土的低语', '红色幽灵的归来'
    ],
    other: [
      'ev_italy', 'ev_italian', 'ev_iberian', 'ev_iberia', 'ev_turkey',
      'ev_french', 'ev_france', 'ev_british', 'ev_britain',
      'ev_suez', 'ev_africa', 'ev_saharan', 'ev_india', 'ev_indian',
      'ev_indonesia', 'ev_indonesian', 'ev_brazil', 'ev_argentina',
      'ev_iran', 'ev_iranian', 'ev_lebanon', 'ev_somali',
      'ev_oil_crisis', 'ev_decolonization', 'ev_colonial',
      'ev_triumvirate', 'ev_mediterranean', 'ev_atlantropa',
      'ev_gibraltar', 'ev_congo', 'ev_nile', 'ev_south_africa',
      'ev_north_africa', 'ev_spanish',
      'italy', 'italian', 'iberian', 'iberia', 'turkey', 'france', 'french', 'british',
      'mediterranean', 'suez', 'africa', 'saharan', 'india', 'indian', 'indonesia',
      'indonesian', 'brazil', 'argentina', 'iran', 'iranian', 'lebanon', 'somali',
      'oil_crisis', 'decolonization',
      '意大利', '伊比利亚', '土耳其', '法兰西', '不列颠', '地中海', '苏伊士',
      '非洲', '撒哈拉', '印度', '次大陆', '印尼', '香料群岛', '巴西', '阿根廷',
      '伊朗', '波斯', '黎巴嫩', '雪松', '索马里', '非洲之角',
      '殖民', '三头同盟', '意属', '北非', '南非', '好望角', '刚果',
      '尼罗河', '苏伊士运河', '戴高乐', '自由法国', '法国内战',
      '安卡拉', '伊比利亚内战', '意大利之春', '沉没的海岸',
      '直布罗陀大坝', '干涸的海洋', '亚特兰特罗帕', '刚果之泪',
      '巴尔干', '帝国的黄昏：意属', '告别的'
    ]
  },

  // ===== 判断事件类别 =====
  classifyEvent(ev) {
    // 显式字段优先
    if (ev.category) return ev.category;
    // 只匹配 ID 和标题，避免 body 中的关键词导致误分类
    const text = ((ev.id || '') + ' ' + (ev.title || '')).toLowerCase();
    // 检查是否为风味事件
    for (const kw of this.FLAVOR_KEYWORDS) {
      if (text.includes(kw.toLowerCase())) return 'flavor';
    }
    return 'core';
  },

  // ===== 判断核心事件的方向（只匹配ID+标题，不匹配body） =====
  classifyDirection(ev) {
    if (ev.direction) return ev.direction;
    // 只匹配 ID 和标题，避免 body 中偶尔提到外国名导致误分类
    const text = ((ev.id || '') + ' ' + (ev.title || '')).toLowerCase();
    // 按优先级检查：russia > japan > us > other > internal(默认)
    for (const dir of ['russia', 'japan', 'us', 'other']) {
      const kws = this.DIRECTION_KEYWORDS[dir];
      for (const kw of kws) {
        if (text.includes(kw.toLowerCase())) return dir;
      }
    }
    return 'internal'; // 默认：德国内部事务
  },

  // ===== 自动结算风味事件（不弹窗） =====
  autoResolveFlavorEvent(ev) {
    // 选取第一个可用选项
    if (ev.choices && ev.choices.length > 0) {
      let choice = ev.choices[0];
      // 找第一个可用选项
      for (const c of ev.choices) {
        if (this.canChooseEventOption(ev, c)) { choice = c; break; }
      }
      this.applyEffects(choice.effects);
      this.setFlags(choice.setFlags);
    }
    // 标记已触发
    if (ev.once) {
      this.state.triggeredEvents[ev.id] = true;
    } else {
      this.state.triggeredEvents[ev.id + '_' + this.state.turn] = true;
    }
    // 执行 onTrigger
    if (ev.onTrigger) {
      try { ev.onTrigger(this.state); } catch(e) { console.warn('[Game] onTrigger error:', e); }
    }
    // 记录到风味日志
    this.state.flavorLog = this.state.flavorLog || [];
    this.state.flavorLog.unshift({
      turn: this.state.turn,
      date: this.getDateStr(),
      title: ev.title,
      body: (ev.body || '').replace(/<[^>]+>/g, '').substring(0, 200),
      direction: this.classifyDirection(ev)
    });
    if (this.state.flavorLog.length > 60) this.state.flavorLog.pop();
    // 添加新闻提示
    this.addNews('📰 时代风貌 · ' + ev.title, 'world');
    this.clampResources();
  },

  // ===== 初始化新游戏 =====
  init() {
    const diff = this.getDiff();
    const rm = diff.resMod;

    this.state = {
      // 时间：1962Q1 开始，2000Q4 结束
      year: 1962,
      quarter: 1,
      halfMonth: 0,   // 半月模式: 0=上半月, 1=下半月
      turn: 1,
      totalTurns: this.turnMode === 'bimonthly' ? 936 : 156, // 半月模式936回合，季度模式156回合

      // 难度 + 模式
      difficulty: this.difficulty,
      gameMode: this.gameMode,
      turnMode: this.turnMode,

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
        deterrence: Math.round(120 * rm),    // 综合威慑（军力80+核威慑75≈155，取120作为初始整合度）
        militaryPower: Math.round(80 * rm),  // 军事实力
        nukeDeter: Math.round(75 * rm),     // 核威慑
        nukes: 480,                          // 核武器数量（1946试爆后16年积累）
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

      // 风味事件日志（时代风貌）
      flavorLog: [],

      // 推迟的核心事件队列（精简版事件分散机制）
      deferredEvents: [],

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
    if (this.state.turnMode === 'bimonthly') {
      const half = this.state.halfMonth === 0 ? '上旬' : '下旬';
      return `${this.state.year}年 第${q[this.state.quarter - 1]}季度${half}`;
    }
    return `${this.state.year}年 第${q[this.state.quarter - 1]}季度`;
  },

  // ===== 计算回合数（用于事件触发） =====
  turnToYearQuarter(turn) {
    if (this.state.turnMode === 'bimonthly') {
      // 半月模式：每8回合=1年(4季度×2半月)
      const year = 1962 + Math.floor((turn - 1) / 8);
      const remainder = (turn - 1) % 8;
      const quarter = Math.floor(remainder / 2) + 1;
      const halfMonth = remainder % 2;
      return { year, quarter, halfMonth };
    }
    // 季度模式：每4回合=1年
    const year = 1962 + Math.floor((turn - 1) / 4);
    const quarter = ((turn - 1) % 4) + 1;
    return { year, quarter };
  },

  // ===== 当前是否匹配指定年/季度 =====
  matchesTurn(turnMatch) {
    if (!turnMatch) return true;
    // 半月模式下，事件按季度匹配（上下旬都触发）
    if (this.state.turnMode === 'bimonthly' && turnMatch.halfMonth !== undefined) {
      return this.state.year === turnMatch.year &&
             this.state.quarter === turnMatch.quarter &&
             this.state.halfMonth === turnMatch.halfMonth;
    }
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

  // ===== 获取本回合应触发的事件（分类返回） =====
  getEventsForTurn() {
    const allEvents = [];
    // 优先走 DataStore (年份拆分, 内存占用 <50%原加载)
    const ds = (typeof DataStore !== 'undefined') ? DataStore : null;
    const pool = (ds && typeof ds.getEventPool === 'function') ? ds.getEventPool()
      : ((typeof STORY_EVENTS !== 'undefined') ? STORY_EVENTS
        : ((typeof window !== 'undefined' && window.STORY_EVENTS) ? window.STORY_EVENTS : []));

    // 1. 匹配回合的剧情事件（必须触发，不受空白回合影响）
    for (const ev of pool) {
      if (ev.turn && this.checkEventCondition(ev)) {
        allEvents.push(ev);
      }
    }

    // 2. 随机事件 — 按回合模式调整频率
    // 精简版: 完全不生成 (randomChanceMod=0)
    // 沉浸完整版: ×0.15, 至少间隔8回合
    const mode = this.getMode();
    const tmCfg = this.getTurnModeCfg();
    const crisisChance = Math.max(0, Math.min(1, this.getDiff().crisisChance * tmCfg.randomChanceMod + (mode.crisisBoost || 0)));
    const turnsSinceRandom = this.state.turn - (this.state._lastRandomTurn || 0);
    const canRandom = turnsSinceRandom >= (tmCfg.randomMinInterval || 3);
    const randomCandidates = pool.filter(ev =>
      !ev.turn && ev.weight && this.checkEventCondition(ev)
    );
    if (canRandom && randomCandidates.length > 0 && crisisChance > 0 && Math.random() < crisisChance) {
      const wMod = mode.eventWeightMod || 1.0;
      const totalWeight = randomCandidates.reduce((s, e) => s + e.weight * wMod, 0);
      let r = Math.random() * totalWeight;
      for (const ev of randomCandidates) {
        r -= ev.weight * wMod;
        if (r <= 0) {
          allEvents.push(ev);
          this.state._lastRandomTurn = this.state.turn;
          break;
        }
      }
    }

    // 3. 按分类拆分：风味事件 vs 核心政治事件
    const core = [];
    const flavor = [];
    for (const ev of allEvents) {
      if (this.classifyEvent(ev) === 'flavor') {
        flavor.push(ev);
      } else {
        core.push(ev);
      }
    }

    // 4. 空白回合机制：按回合模式调整空白概率
    // 仅当没有"阻止空白"级别的核心事件时才生效（由 blockQuietTags 控制）
    // 精简版: 仅 critical 阻止空白 → story/major 都可被空白回合吞掉
    // 沉浸版: critical/story 阻止空白 → major 可被空白回合吞掉
    const blockTags = tmCfg.blockQuietTags || ['critical', 'major', 'story'];
    const hasBlockingEvent = core.some(ev => blockTags.includes(ev.tag));
    if (!hasBlockingEvent && core.length > 0) {
      // 用回合数做伪随机分布
      const quietHash = (this.state.turn * 7 + 13) % 100;
      if (quietHash < tmCfg.quietChance * 100) {
        // 平静回合：所有核心事件降级为风味事件自动结算
        for (const ev of core) {
          flavor.push(ev);
        }
        core.length = 0;
      }
    }

    // 4b. 精简版额外削减：非关键核心事件降级为风味
    if (tmCfg.demoteMinor) {
      for (let i = core.length - 1; i >= 0; i--) {
        const ev = core[i];
        if (!['critical', 'major', 'story'].includes(ev.tag)) {
          flavor.push(ev);
          core.splice(i, 1);
        }
      }
    }
    // 4c. 精简版深度削减：major 也降级为风味自动结算（仅 critical/story 弹窗）
    if (tmCfg.demoteMajor) {
      for (let i = core.length - 1; i >= 0; i--) {
        const ev = core[i];
        if (!['critical', 'story'].includes(ev.tag)) {
          flavor.push(ev);
          core.splice(i, 1);
        }
      }
    }
    // 4d. 稀疏化：critical 事件按比例降级为风味（让玩家有更多空白期专注玩法）
    const sparseRate = tmCfg.criticalSparseRate;
    if (sparseRate !== undefined && sparseRate < 1) {
      for (let i = core.length - 1; i >= 0; i--) {
        const ev = core[i];
        if (ev.tag === 'critical') {
          // 用事件ID做稳定哈希，保证同一事件在不同对局中行为一致
          const hash = (ev.id || '').split('').reduce((h, c) => h + c.charCodeAt(0), 0) % 100;
          if (hash >= sparseRate * 100) {
            flavor.push(ev);
            core.splice(i, 1);
          }
        }
      }
    }
    // 4e. story 事件稀疏化：按比例降级为风味（控制叙事事件密度）
    const storySparseRate = tmCfg.storySparseRate;
    if (storySparseRate !== undefined && storySparseRate < 1) {
      for (let i = core.length - 1; i >= 0; i--) {
        const ev = core[i];
        if (ev.tag === 'story') {
          const hash = ((ev.id || '').split('').reduce((h, c) => h + c.charCodeAt(0), 0) * 3 + 7) % 100;
          if (hash >= storySparseRate * 100) {
            flavor.push(ev);
            core.splice(i, 1);
          }
        }
      }
    }

    // 5. 核心事件按 tag 优先级 + 显式 priority 排序，限制弹窗数量（按回合模式）
    const tagPriority = { critical: 0, major: 1, story: 2, diplomacy: 3, economy: 4, military: 5, minor: 6 };
    core.sort((a, b) => {
      const ta = (a.tag in tagPriority) ? tagPriority[a.tag] : 7;
      const tb = (b.tag in tagPriority) ? tagPriority[b.tag] : 7;
      if (ta !== tb) return ta - tb;
      // 同 tag 内：显式 priority 小的优先（默认100）
      const pa = (a.priority !== undefined) ? a.priority : 100;
      const pb = (b.priority !== undefined) ? b.priority : 100;
      return pa - pb;
    });
    const budget = tmCfg.coreBudget;

    // 精简版事件分散机制:
    // - 上一回合推迟的事件(deferredEvents)优先加入本回合弹窗
    // - 本回合新事件超出budget的, critical/major/story 推迟到下回合, 其他降级为风味
    // - 保证关键事件不丢失, 但每回合弹窗数受控
    this.state.deferredEvents = this.state.deferredEvents || [];
    const deferred = this.state.deferredEvents.splice(0); // 取出上回合推迟的全部
    const combined = [...deferred, ...core]; // 推迟的优先, 然后是本回合新的
    const coreCapped = combined.slice(0, budget);
    const overflow = combined.slice(budget);

    for (const ev of overflow) {
      const isKey = ['critical', 'major', 'story'].includes(ev.tag);
      if (this.state.turnMode === 'quarterly' && isKey && this.state.deferredEvents.length < 15) {
        // 精简版: 关键事件推迟到下回合, 最多累积15个
        this.state.deferredEvents.push(ev);
      } else {
        // 沉浸完整版 或 非关键事件 或 积压已满: 降级为风味自动结算
        flavor.push(ev);
      }
    }

    return { core: coreCapped, flavor };
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
      choice: choice.text,
      direction: this.classifyDirection(ev)
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
    this.state._dirtyIndustry = true;
    this.state._dirtyNation = true;

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
    this.state._dirtyIndustry = true;
    this.state._dirtyNation = true;
    return { ok: true, msg: `${b.name} 已拆除，返还部分资金` };
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

    // 建筑产出：所有资源键都生效（money/manpower/stability/deterrence/militaryPower/nukeDeter/nukes/research/efficiency）
    const BUILDINGS = _getBuildings();
    for (const bid in this.state.buildings) {
      const count = this.state.buildings[bid];
      const b = BUILDINGS[bid];
      if (!b) continue;
      const eff_multi = b.type === 'civilian' ? eff : 1.0;
      for (const key in b.effects) {
        // nukes 是核弹建造(非常慢, 累积值)，不乘效率以防过快
        const m = (key === 'nukes') ? 1.0 : eff_multi;
        income[key] = (income[key] || 0) + b.effects[key] * count * m;
      }
      // 维护成本（只扣资金）
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

    // 势力关系影响收支
    // 友好势力: 贸易收入加成; 敌对势力: 军费开支增加
    const rel = this.state.relations || {};
    const majorFactions = ['ofn', 'japan', 'italy', 'burgundy', 'russia'];
    let tradeBonus = 0;
    let tensionCost = 0;
    for (const fid of majorFactions) {
      const v = rel[fid] || 0;
      if (v > 10) {
        // 友好: 每点关系 +0.1 贸易收入
        tradeBonus += v * 0.1;
      } else if (v < -10) {
        // 敌对: 每点负关系 +0.15 军费
        tensionCost += Math.abs(v) * 0.15;
      }
    }
    income.money += tradeBonus;
    income.money -= tensionCost;
    // 高紧张度(多个敌对势力)额外消耗人力
    const hostileCount = majorFactions.filter(fid => (rel[fid] || 0) < -30).length;
    if (hostileCount >= 2) income.manpower -= hostileCount;

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
    if (this.state.turnMode === 'bimonthly') {
      // 半月模式：0上旬→1下旬→下个季度上旬
      this.state.halfMonth++;
      if (this.state.halfMonth > 1) {
        this.state.halfMonth = 0;
        this.state.quarter++;
        if (this.state.quarter > 4) {
          this.state.quarter = 1;
          this.state.year++;
        }
      }
    } else {
      // 季度模式
      this.state.quarter++;
      if (this.state.quarter > 4) {
        this.state.quarter = 1;
        this.state.year++;
      }
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
          delete this.state.flags.loan_cooldown; // 还清后立即可再借
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
          this.state.flags.loan_cooldown = 40; // 违约后10年不能借
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

    // 5. 检查事件（分类处理：风味事件自动结算，核心事件弹窗）
    const turnResult = this.getEventsForTurn();
    // 5.1 自动结算风味事件
    if (turnResult.flavor && turnResult.flavor.length > 0) {
      for (const fev of turnResult.flavor) {
        this.autoResolveFlavorEvent(fev);
      }
    }
    // 5.2 核心事件交给UI弹窗
    const turnEvents = turnResult.core || [];
    if (turnEvents.length > 0 && onEvent) {
      onEvent(turnEvents);
    }

    // 6. 检查结局
    this.checkEnding();

    // 7. 添加随机新闻
    if (Math.random() < 0.4) {
      this.generateRandomNews();
    }

    // 标记所有需要刷新的Tab
    this.state._dirtyIndustry = true;
    this.state._dirtyNation = true;

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

  // ===== 外交系统 =====
  // 外交行动: 改善关系/施压/贸易协定/秘密行动
  doDiplomacy(factionId, action) {
    const s = this.state;
    const r = s.resources;
    const rel = s.relations[factionId] || 0;
    const FACTIONS = (typeof _getFactions === 'function') ? _getFactions() : (typeof FACTIONS !== 'undefined' ? FACTIONS : {});
    const factionName = (FACTIONS[factionId] && FACTIONS[factionId].short) || factionId;

    const actions = {
      improve: {
        name: '改善关系',
        cost: { money: 30 },
        relChange: 8,
        desc: '派遣外交使团，赠送礼物，改善双边关系'
      },
      trade: {
        name: '贸易协定',
        cost: { money: 50 },
        relChange: 5,
        desc: '签订贸易协定，获得一次性资金回报和关系改善',
        onSuccess: () => { r.money += 40; }
      },
      pressure: {
        name: '外交施压',
        cost: { money: 20, deterrence: 3 },
        relChange: -10,
        desc: '利用威慑力迫使对方让步，恶化关系但提升国内威望',
        onSuccess: () => { r.stability = Math.min(100, (r.stability || 0) + 2); }
      },
      intrigue: {
        name: '秘密行动',
        cost: { money: 60, research: 10 },
        relChange: -15,
        desc: '派遣特工进行破坏活动，大幅恶化关系但获取情报',
        onSuccess: () => { r.research += 8; }
      }
    };

    const act = actions[action];
    if (!act) return { ok: false, msg: '未知行动' };

    // 检查资源
    for (const [k, v] of Object.entries(act.cost)) {
      if ((r[k] || 0) < v) {
        return { ok: false, msg: `${k === 'money' ? '资金' : k === 'research' ? '研发点' : k === 'deterrence' ? '威慑' : k}不足` };
      }
    }

    // 扣除资源
    for (const [k, v] of Object.entries(act.cost)) {
      r[k] = (r[k] || 0) - v;
    }

    // 应用关系变化 (带随机波动)
    const variance = Math.floor(Math.random() * 5) - 2;
    const actualChange = act.relChange + variance;
    s.relations[factionId] = Math.max(-100, Math.min(100, rel + actualChange));

    // 成功效果
    if (act.onSuccess) act.onSuccess();

    const dir = actualChange > 0 ? '改善' : '恶化';
    this.addNews(`对${factionName}外交行动: ${act.name} → 关系${dir} ${Math.abs(actualChange)}点`, 'world');

    return { ok: true, msg: `${act.name}成功！与${factionName}关系${dir} ${Math.abs(actualChange)}点`, change: actualChange };
  },

  // ===== 检查结局条件 =====
  // 失败类结局（前四种）不再"一回合秒杀"：通过累计回合数触发，且提供新闻预警
  checkEnding() {
    const s = this.state;
    const r = s.resources;
    const diff = this.getDiff();

    // 初始化危机计数器（首次运行时）
    if (s._crisis === undefined) s._crisis = {
      stab0: 0,      // 稳定度低于阈值连续回合
      debt: 0,       // 负债超过阈值连续回合
      deter: 0,      // 威慑低于阈值且敌对关系连续回合
    };
    const cc = s._crisis;

    // 核毁灭结局（无法挽回，直接触发）
    if (s.flags.nuclear_holocaust) {
      this.endGame('nuclear_holocaust');
      return;
    }

    // ============ 1. 稳定崩溃 ============
    // 阶段 1：低于 15 连续 3 回合 → 新闻预警
    // 阶段 2：低于 10 连续 5 回合 → 高危新闻
    // 阶段 3：≤ 0 且超过难度保护线 → 触发崩溃
    const stabDangerThresh = 15;
    const stabCriticalThresh = 10;
    let collapseTriggered = false;

    if (r.stability <= stabDangerThresh) {
      cc.stab0++;
      // 预警级别 1：低稳定持续 3 回合
      if (cc.stab0 === 3 && r.stability > stabCriticalThresh) {
        this.addNews('⚠ 政局动荡：民众支持率持续走低，街头抗议频发，地方官员呼吁改革', 'crisis');
      }
      // 预警级别 2：稳定 < 10 持续 5 回合
      if (cc.stab0 >= 5 && r.stability <= stabCriticalThresh && r.stability > 0) {
        if (cc.stab0 === 5 || cc.stab0 % 4 === 0) {
          this.addNews('🚨 危机警报：稳定度极低，奴隶暴动、黑市失控、党卫军蠢蠢欲动！请立即提高稳定度！', 'crisis');
        }
      }
      // 真正的崩溃触发：稳定归零且超过难度保护
      if (r.stability <= diff.stabFloor && r.stability <= 0) {
        // 需至少 2 回合低稳定才崩（避免一回合意外归零直接崩）
        if (cc.stab0 >= 2 || diff.stabFloor >= 0) {
          // 简单难度保护：如果 stabFloor>0，给玩家一个最后新闻
          if (this.difficulty === 'easy') {
            this.addNews('💀 帝国的心脏停止跳动 — 帝国崩塌！', 'crisis');
          }
          collapseTriggered = true;
          this.endGame('collapse');
          return;
        }
      }
    } else {
      if (cc.stab0 > 0) {
        if (cc.stab0 >= 5) {
          this.addNews('✅ 局势回稳：政府成功平息风波，民心渐归', 'economy');
        }
        cc.stab0 = 0;
      }
    }

    // ============ 2. 经济崩溃 ============
    // 简单/普通 连续 3 回合低于 -100  或  1回合低于 -250  才爆
    // 困难/地狱  连续 3 回合低于 -80   或  1回合低于 -200
    const softDebt = this.difficulty === 'hell' ? -80 : (this.difficulty === 'hard' ? -80 : -100);
    const hardDebt = this.difficulty === 'hell' ? -200 : -250;
    let econTriggered = false;

    if (r.money <= softDebt) {
      cc.debt++;
      // 连续 2 回合：新闻警告
      if (cc.debt === 2) {
        this.addNews('⚠ 赤字警报：帝国财政极度紧张，借贷方开始怀疑偿债能力，国库空虚！', 'crisis');
      }
      // 连续 3 回合以上：每隔几回合再催一下
      if (cc.debt >= 3 && (cc.debt === 3 || cc.debt % 4 === 0)) {
        this.addNews('🚨 帝国赤字严重：军队薪资拖欠、奴隶口粮不足、各省上缴萎缩，濒临破产！', 'crisis');
      }
      // 最终触发：连续 3 回合 软阈值 OR 一次 硬阈值
      if (cc.debt >= 3 || r.money <= hardDebt) {
        econTriggered = true;
        this.endGame('economic_collapse');
        return;
      }
    } else {
      if (cc.debt > 0) {
        if (cc.debt >= 2) this.addNews('✅ 财政回正：赤字警报解除', 'economy');
        cc.debt = 0;
      }
    }

    // ============ 3. 威慑崩盘被入侵 ============
    // 威慑低迷 + 敌对关系 连续 4 回合 → 触发入侵
    const deterSoft = Math.max(diff.deterFloor, 15);   // 普通 15
    const hasHostile = s.relations.russia < -50 || s.relations.ofn < -50;

    if (r.deterrence <= deterSoft && hasHostile) {
      cc.deter++;
      if (cc.deter === 2) {
        const enemy = s.relations.russia < -50 ? '俄罗斯' : '美国';
        this.addNews(`⚠ 外交危机：${enemy}已察觉帝国威慑疲软，边境部署开始增加！`, 'crisis');
      }
      if (cc.deter === 4) {
        const enemy = s.relations.russia < -50 ? '俄罗斯' : '美国';
        this.addNews(`🚨 战争预警：${enemy}情报判断帝国不堪一击！入侵正在准备，必须立即提升威慑！`, 'crisis');
      }
      // 连续 6 回合（1年半）低迷 → 真正入侵
      if (cc.deter >= 6) {
        this.endGame('invasion');
        return;
      }
    } else {
      if (cc.deter > 0) {
        if (cc.deter >= 2) this.addNews('✅ 局势缓和：威慑恢复/敌对关系缓和，边境降温', 'world');
        cc.deter = 0;
      }
    }

    // 地狱难度：威慑 ≤ 0 连续 2 回合直接崩（已含敌对条件，不单独判）
    if (this.difficulty === 'hell' && r.deterrence <= 0) {
      cc.hellDeter = (cc.hellDeter || 0) + 1;
      if (cc.hellDeter >= 2) {
        this.endGame('invasion');
        return;
      }
    } else if (cc.hellDeter) {
      cc.hellDeter = 0;
    }

    // ============ 到达2000年 - 根据状态判定结局 ============
    if (s.year >= 2001) {
      this.determineFinalEnding();
      return;
    }
    if (s.year === 2000 && s.quarter === 4 && s.turn >= s.totalTurns) {
      // 季度模式: 2000Q4=156回合; 半月模式: 2000Q4下旬=936回合
      if (s.turnMode === 'bimonthly' && s.halfMonth === 0) return; // 半月模式还需下旬
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
