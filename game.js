/* ============================================================
 * 千年帝国的最后一息 - 核心游戏逻辑
 * v0.4.2: 事件分类系统（风味/核心分离 + 方向徽章）
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
 resMod: 1.5,
 penMod: 0.5,
 incomeMod: 1.3,
 stabFloor: 5,
 deterFloor: 10,
 crisisChance: 0.25,
 loanInterest: 0.20,
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
 crisisChance: 0.30, // v0.4.2: 从0.40下调，减少随机事件干扰
 loanInterest: 0.35,
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
 crisisChance: 0.45, // v0.4.2: 从0.55下调
 loanInterest: 0.50,
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
 crisisChance: 0.55, // v0.4.2: 从0.70下调（核心事件已分类，不需要靠数量堆难度）
 loanInterest: 0.70,
 unlocked: false
 }
};

// ===== 游戏模式定义 =====
const GAME_MODES = {
 historical: {
 id: 'historical',
 name: '历史模式',
 desc: '严格遵循TNO主线时间线，体验原汁原味的剧情',
 color: '#a83232',
 icon: '📜',
 aiSpeedMod: 1.0,
 eventWeightMod: 1.0,
 randomLeaders: false,
 randomPaths: false,
 crisisBoost: 0,
 unlocked: true
 },
 sandbox: {
 id: 'sandbox',
 name: '沙盒模式',
 desc: '世界自由发展，AI加速演变，适合长期推演',
 color: '#3a6a9a',
 icon: '🌍',
 aiSpeedMod: 1.5,
 eventWeightMod: 1.3,
 randomLeaders: false,
 randomPaths: false,
 crisisBoost: -0.1,
 unlocked: true
 },
 chaos: {
 id: 'chaos',
 name: '混乱模式',
 desc: '随机领导人、随机路线、事件权重打乱——不可预测的疯狂世界',
 color: '#8a3a8a',
 icon: '🎲',
 aiSpeedMod: 1.8,
 eventWeightMod: 2.0,
 randomLeaders: true,
 randomPaths: true,
 crisisBoost: 0.15,
 unlocked: true
 }
};

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

const CHAOS_PATHS = [
 'reform', 'militarist', 'conservative', 'reform_democrat', 'militarist_extreme'
];

const Game = {

 state: null,
 difficulty: 'normal',
 gameMode: 'historical',

 // ===== v0.4.2: 事件分类配置 =====
 EVENT_CONFIG: {
 // 每回合最多弹窗的核心事件数
 coreBudget: 4,
 // 风味事件是否自动归档（不弹窗）
 autoArchiveFlavor: true,
 // 方向分类关键词表
 directionKeywords: {
 internal: [
 '希特勒', '希姆莱', '鲍曼', '戈林', '施佩尔', '海德里希', '隆美尔', '斯派达尔',
 '党卫军', '国防军', '空军', '海军', '陆军', '国会', '内阁', '总理',
 '经济', '马克', '奴隶', '罢工', '抗议', '稳定', '稳定度',
 '核武', '核弹', '核按钮', '原子弹', '核威慑', '核试验',
 '勃艮第',
 '继承', '继任', '葬礼', '遗嘱', '权力',
 '国债', '债券', '赤字', '预算', '税收',
 '日耳曼尼亚', '慕尼黑', '汉堡', '莱比锡',
 '盖世太保', '情报局', '密探',
 '集中营', '劳改', '奴工',
 '工厂', '生产效率', '科研', '研发',
 '民防', '防空', '导弹', '火箭', 'V-2', 'V-3',
 '勃兰登堡', '容克', '普鲁士', '巴伐利亚', '萨克森',
 '党卫队', '盖世太保', '冲锋队', 'SA', 'SS'
 ],
 japan: [
 '日本', '共荣圈', '东京', '天皇', '昭和', '军部', '陆军省', '海军省',
 '满洲国', '朝鲜', '韩国', '台湾', '菲律宾', '印尼', '南洋',
 '三头同盟', '日德同盟', '轴心', '太平洋',
 '珍珠港', '广岛', '长崎', '核打击',
 '日元', '通商',
 '三笠', '靖国', '神道教', '皇道派', '统制派',
 '关东军', '驻朝鲜', '驻满洲', '南洋舰队',
 '东亚', '东南亚', '千岛', '库页',
 '汪精卫', '溥仪', '满铁', '关东州'
 ],
 america: [
 '美国', 'OFN', '自由国家组织', '肯尼迪', '约翰逊', '尼克松',
 '华盛顿', '纽约', '洛杉矶', '旧金山', '芝加哥',
 '民权', '种族', '隔离', '马丁路德', '黑人',
 '冷战', '遏制', '围堵', '北约', '美洲',
 '加拿大', '墨西哥', '巴西', '阿根廷',
 '阿留申', '阿拉斯加', '格陵兰', '冰岛',
 '美元', '贸易制裁', '禁运', '外交承认',
 'CIA', 'FBI', '中情局', '联邦调查局',
 '核武库', '洲际导弹', 'B-52', '轰炸机',
 '反战', '示威', '游行', '罢工', '工会'
 ],
 russia: [
 '俄罗斯', '苏联', '莫斯科', '列宁格勒', '斯大林格勒',
 '西俄', '东俄', '乌克兰', '白俄罗斯', '波兰',
 '革命阵线', '红军', '布尔什维克', '共产党',
 '克格勃', 'NKVD', '渗透',
 '西伯利亚', '乌拉尔', '阿尔汉格尔斯克', '阿斯特拉罕',
 '鄂木斯克', '托木斯克', '科米', '雅戈达', '塔博里茨基',
 '军阀', '内乱', '统一', '分裂',
 '卢布', '能源', '石油', '天然气',
 '维切格达', '伏尔加', '顿河', '第聂伯',
 '克里米亚', '塞瓦斯托波尔', '黑海舰队'
 ],
 italy: [
 '意大利', '罗马', '齐亚诺', '墨索里尼',
 '伊比利亚', '西班牙', '葡萄牙', '弗朗哥', '萨拉查',
 '土耳其', '安卡拉', '伊斯坦布尔',
 '地中海', '亚特兰特罗帕', '直布罗陀', '苏伊士',
 '三头同盟', '地中海联盟'
 ],
 flavor: [
 '登月', '宇航员', '太空', '卫星',
 '奥运', '世界杯', '体育', '足球', '田径', '运动会',
 '圣诞', '新年', '庆典', '节日', '游行', '国庆',
 '电影', '音乐', '文学', '艺术', '文化', '小说', '诗歌',
 '流行病', '流感', '瘟疫', '疾病', '疫情', '病毒',
 '寒冬', '酷暑', '洪水', '干旱', '地震', '暴风雪', '台风',
 '阅兵', '仪式', '授勋', '奖章', '荣誉', '勋章',
 '梵蒂冈', '教皇', '教会', '宗教', '主教', '礼拜',
 '报纸', '广播', '电视', '媒体', '新闻', '杂志', '电台',
 '时尚', '时装', '服装', '巴黎', '柏林墙', '建筑',
 '博物馆', '展览', '画廊', '歌剧', '芭蕾',
 '诺贝尔奖', '科学发现', '医学突破', '发明',
 '丰收', '歉收', '粮食', '饥荒', '农业',
 '婚礼', '出生', '人口', '婴儿潮',
 '旅游', '度假', '休闲', '娱乐', '酒吧', '咖啡馆',
 '股市', '股票', '交易所', '法兰克福', '华尔街', '股价',
 '面包', '黄油', '啤酒', '葡萄酒', '香烟',
 '足球赛', '冠军', '奖牌', '破纪录',
 '发明', '专利', '新技术', '实验室'
 ]
 }
 },

 // ===== v0.4.2: 判断事件是否为"风味事件"（不影响大局的时代风貌） =====
 isFlavorEvent(ev) {
 if (!ev) return false;
 // 有 choices 且需要玩家决策 → 一定不是风味
 if (ev.choices && ev.choices.length > 0) return false;
 // 有明显效果（改资源/关系/flags） → 不是风味
 if (ev.effects && Object.keys(ev.effects).length > 0) return false;
 if (ev.setFlags && Object.keys(ev.setFlags).length > 0) return false;
 // 标题/描述包含风味关键词
 const text = (ev.title || '') + ' ' + (ev.desc || '') + ' ' + (ev.text || '');
 const flavorKw = this.EVENT_CONFIG.directionKeywords.flavor;
 for (const kw of flavorKw) {
 if (text.indexOf(kw) !== -1) return true;
 }
 // 有 tag: 'flavor' 或 'minor' 标记
 if (ev.tag === 'flavor' || ev.tag === 'minor') return true;
 return false;
 },

 // ===== v0.4.2: 判断事件的政治方向 =====
 classifyDirection(ev) {
 if (!ev) return 'other';
 // v0.4.2 修复：覆盖 body/desc/text/content 所有可能承载描述的字段
 const text = (ev.title || '') + ' ' +
             (ev.desc  || '') + ' ' +
             (ev.text  || '') + ' ' +
             (ev.body  || '') + ' ' +
             (ev.content || '');

 // 按优先级匹配：russia > japan > america > italy > internal > other
 const directions = ['russia', 'japan', 'america', 'italy', 'internal'];
 for (const dir of directions) {
 const keywords = this.EVENT_CONFIG.directionKeywords[dir] || [];
 for (const kw of keywords) {
 if (text.indexOf(kw) !== -1) return dir;
 }
 }
 return 'other';
 },

 // ===== v0.4.2: 自动结算风味事件（不弹窗，效果照常应用） =====
 autoResolveFlavorEvent(ev) {
 // 如果有默认效果，静默应用
 if (ev.effects) {
 for (const key in ev.effects) {
 const val = ev.effects[key];
 if (typeof val === 'number') {
 if (this.state.resources[key] !== undefined) {
 this.state.resources[key] += val;
 } else if (this.state.relations && this.state.relations[key] !== undefined) {
 this.state.relations[key] += val;
 }
 } else if (typeof val === 'object' && val !== null) {
 // 范围效果 {min, max}
 const min = val.min || 0, max = val.max || 0;
 const actual = Math.floor(min + Math.random() * (max - min));
 if (this.state.resources[key] !== undefined) {
 this.state.resources[key] += actual;
 }
 }
 }
 }
 // 如果有 showToast，记录到新闻流
 if (ev.showToast) {
 this.addNews(ev.showToast, 'flavor');
 } else if (ev.title) {
 this.addNews(`[时代风貌] ${ev.title}`, 'flavor');
 }
 // 写入风味日志
 if (!this.state.flavorLog) this.state.flavorLog = [];
 this.state.flavorLog.unshift({
 date: this.getDateStr(),
 title: ev.title || '未命名事件',
 text: ev.desc || ev.text || '',
 direction: this.classifyDirection(ev),
 flavor: true
 });
 if (this.state.flavorLog.length > 200) this.state.flavorLog.pop();
 },

 // ===== 检查地狱难度是否解锁 =====
 isHellUnlocked() {
 try {
 return localStorage.getItem('tno_hell_unlocked') === 'true';
 } catch(e) { return false; }
 },

 checkDifficultyUnlock() {
 try {
 const goodEndings = ['democratic_reform', 'peaceful_coexistence', 'reformist_survival',
 'militarist_victory', 'militarist_stalemate', 'conservative_survival',
 'dark_victory', 'terror_state', 'reformist_failure', 'militarist_collapse',
 'conservative_decay'];
 if (this.difficulty === 'hard' && goodEndings.includes(this.state.endingId)) {
 localStorage.setItem('tno_hell_unlocked', 'true');
 }
 } catch(e) {}
 },

 getDiff() {
 return DIFFICULTIES[this.difficulty] || DIFFICULTIES.normal;
 },

 getMode() {
 return GAME_MODES[this.gameMode] || GAME_MODES.historical;
 },

 setMode(modeId) {
 if (GAME_MODES[modeId] && GAME_MODES[modeId].unlocked) {
 this.gameMode = modeId;
 return true;
 }
 return false;
 },

 _pickRandomLeader() {
 return CHAOS_LEADERS[Math.floor(Math.random() * CHAOS_LEADERS.length)];
 },

 _pickRandomPath() {
 return CHAOS_PATHS[Math.floor(Math.random() * CHAOS_PATHS.length)];
 },

 // 存档版本号（v0.4.2 递增，旧存档将被重置）
 SAVE_VERSION: 17,

 // ===== 初始化新游戏 =====
 init() {
 const diff = this.getDiff();
 const rm = diff.resMod;

 this.state = {
 year: 1962,
 quarter: 1,
 turn: 1,
 totalTurns: 156,

 difficulty: this.difficulty,
 gameMode: this.gameMode,

 leader: {
 id: 'hitler',
 name: '阿道夫·希特勒',
 title: '元首（垂死）',
 ideology: 'none'
 },
 chosenPath: null,

 resources: {
 money: Math.round(200 * rm),
 manpower: Math.round(30 * rm),
 stability: Math.round(45 * rm),
 deterrence: Math.round(60 * rm),
 militaryPower: Math.round(80 * rm),
 nukeDeter: Math.round(30 * rm),
 nukes: 2,
 research: Math.round(20 * rm),
 efficiency: 1.0
 },

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

 buildings: {
 consumer_factory: 1,
 agriculture: 1,
 arms_factory: 1
 },

 buildQueue: [],

 techs: {
 nuclear_tech: true
 },

 policies: {},

 currentFocus: null,
 focusProgress: 0,
 completedFoci: [],

 flags: {
 nuclear_tech: true
 },

 triggeredEvents: {},

 eventLog: [],

 newsLog: [],

 // v0.4.2: 风味事件日志（时代风貌Tab专用）
 flavorLog: [],

 russiaState: 'fragmented',

 ended: false,
 endingId: null,
 saveVersion: this.SAVE_VERSION
 };

 if (typeof NationSim !== 'undefined') {
 NationSim.initSync();
 const ger = NationSim.getNation('GER');
 if (ger) {
 this.state.resources.stability = Math.round(ger.stability);
 this.state.resources.efficiency = ger.industry.efficiency;
 }
 NationSim.init().then(() => {
 console.log('[Game] NationSim 异步数据加载完成');
 return NationSim.loadTechTree();
 }).then(() => {
 console.log('[Game] 科技树加载完成');
 }).catch(e => { console.warn('[Game] NationSim 异步加载失败:', e.message); });
 }

 const mode = this.getMode();
 if (mode.randomLeaders) {
 const rl = this._pickRandomLeader();
 this.state.leader = { id: rl.id, name: rl.name, title: rl.title, ideology: rl.ideology };
 this.addNews(`混乱世界: ${rl.name} 就任 ${rl.title}`, 'world');
 }
 if (mode.randomPaths) {
 this.state._chaosPathHint = this._pickRandomPath();
 }
 if (this.gameMode === 'sandbox') {
 this.state.resources.money += 100;
 this.state.resources.research += 30;
 } else if (this.gameMode === 'chaos') {
 const r = this.state.resources;
 r.money = Math.round(r.money * (0.7 + Math.random() * 0.6));
 r.manpower = Math.round(r.manpower * (0.7 + Math.random() * 0.6));
 r.stability = Math.max(20, Math.min(90, Math.round(r.stability * (0.7 + Math.random() * 0.6))));
 }

 return this.state;
 },

 // ===== 研发科技 =====
 researchTech(techId) {
 const treeIds = ['military', 'civil', 'nuclear', 'rocket'];
 if (treeIds.indexOf(techId) >= 0) {
 if (typeof NationSim === 'undefined') return { ok: false, msg: '系统未加载' };
 const result = NationSim.researchTech(techId, this.state);
 if (result.ok) this.clampResources();
 return result;
 }
 const TECHS = _getTechs();
 const t = TECHS[techId];
 if (!t) return { ok: false, msg: '科技不存在' };
 if (this.state.techs[techId]) return { ok: false, msg: '已研发' };
 if (this.state.resources.research < t.year) return { ok: false, msg: '研究点数不足' };
 this.state.resources.research -= t.year;
 this.state.techs[techId] = true;
 this.state.flags[techId] = true;
 if (t.effect) this.applyEffects(t.effect);
 this.addNews(`科技研发完成: ${t.name}`, 'tech');
 this.clampResources();
 return { ok: true, msg: `研发完成: ${t.name}` };
 },

 // ===== 应用效果 =====
 applyEffects(effects) {
 if (!effects) return;
 const r = this.state.resources;
 for (const key in effects) {
 const val = effects[key];
 if (key === 'relations') {
 for (const fk in val) {
 this.state.relations[fk] = (this.state.relations[fk] || 0) + val[fk];
 }
 } else if (typeof val === 'number') {
 if (r[key] !== undefined) r[key] += val;
 } else if (typeof val === 'object' && val !== null) {
 if (val.min !== undefined && val.max !== undefined) {
 const actual = Math.floor(val.min + Math.random() * (val.max - val.min));
 if (r[key] !== undefined) r[key] += actual;
 }
 }
 }
 },

 // ===== 检查事件条件 =====
 checkEventCondition(ev) {
 if (!ev) return false;
 if (ev.condition && typeof ev.condition === 'function') {
 try { return ev.condition(this.state); } catch(e) { return false; }
 }
 if (ev.requiresFlag && !this.state.flags[ev.requiresFlag]) return false;
 if (ev.requiresTurn && this.state.turn < ev.requiresTurn) return false;
 if (ev.maxTurn && this.state.turn > ev.maxTurn) return false;
 if (ev.once && this.state.triggeredEvents[ev.id]) return false;
 return true;
 },

 // ===== v0.4.2: 获取本回合事件（核心/风味分离） =====
 getEventsForTurn() {
 const all = [];

 // 1) 剧情事件
 const storyEvents = (typeof STORY_EVENTS !== 'undefined') ? STORY_EVENTS : [];
 for (const ev of storyEvents) {
 if (!this.checkEventCondition(ev)) continue;
 if (ev.turn) {
 if (ev.turn.year === this.state.year && ev.turn.quarter === this.state.quarter) {
 all.push(ev);
 }
 continue;
 }
 }

 // 2) DataStore 事件池
 const dsEvents = (typeof DataStore !== 'undefined' && DataStore.getEventPool)
 ? DataStore.getEventPool() : [];
 for (const ev of dsEvents) {
 if (!this.checkEventCondition(ev)) continue;
 if (!ev.turn && ev.weight) {
 // 随机事件，等下统一抽签
 continue;
 }
 all.push(ev);
 }

 // 3) 随机候选抽签
 const mode = this.getMode();
 const wMod = mode.eventWeightMod || 1.0;
 const randomCandidates = [];
 const ds2 = (typeof DataStore !== 'undefined' && DataStore.getEventPool) ? DataStore.getEventPool() : [];
 for (const ev of ds2) {
 if (!ev.turn && ev.weight && this.checkEventCondition(ev)) {
 randomCandidates.push(ev);
 }
 }
 const crisisChance = Math.max(0, Math.min(1,
 this.getDiff().crisisChance + (mode.crisisBoost || 0)));
 if (randomCandidates.length > 0 && Math.random() < crisisChance) {
 let totalWeight = 0;
 for (const e of randomCandidates) totalWeight += (e.weight || 1) * wMod;
 let r = Math.random() * totalWeight;
 for (const ev of randomCandidates) {
 r -= (ev.weight || 1) * wMod;
 if (r <= 0) { all.push(ev); break; }
 }
 }

 // ===== v0.4.2: 分类为 core 和 flavor =====
 const core = [];
 const flavor = [];
 for (const ev of all) {
 if (this.isFlavorEvent(ev)) {
 flavor.push(ev);
 } else {
 core.push(ev);
 }
 }

 // 核心事件：按优先级排序 + 预算上限
 const tagPriority = { critical: 3, major: 2, minor: 1 };
 core.sort((a, b) =>
 (tagPriority[b.tag] || 0) - (tagPriority[a.tag] || 0)
 );

 const budget = this.EVENT_CONFIG.coreBudget;
 const shown = core.slice(0, budget);
 const overflow = core.slice(budget);

 // 溢出的核心事件 → 自动选第一个选项（降低优先级处理）
 for (const ev of overflow) {
 const choice = (ev.choices && ev.choices[0]) || null;
 if (choice) {
 if (choice.effects) this.applyEffects(choice.effects);
 if (choice.setFlags) Object.assign(this.state.flags, choice.setFlags);
 }
 if (ev.setFlags) Object.assign(this.state.flags, ev.setFlags);
 if (ev.once) this.state.triggeredEvents[ev.id] = true;
 this.addNews(`[自动处理] ${ev.title || ev.id}`, 'system');
 }

 // 风味事件：全部自动归档（不弹窗）
 for (const ev of flavor) {
 this.autoResolveFlavorEvent(ev);
 if (ev.once) this.state.triggeredEvents[ev.id] = true;
 }

 // 限制资源
 this.clampResources();

 // 返回核心事件给 UI 弹窗
 return shown;
 },

 // ===== 选择事件选项 =====
 chooseEventOption(ev, choice) {
 if (!ev || !choice) return { ok: false, msg: '无效选项' };
 if (choice.effects) this.applyEffects(choice.effects);
 if (choice.setFlags) Object.assign(this.state.flags, choice.setFlags);
 if (ev.setFlags) Object.assign(this.state.flags, ev.setFlags);
 if (ev.once) this.state.triggeredEvents[ev.id] = true;

 // 写入事件日志
 this.state.eventLog.unshift({
 date: this.getDateStr(),
 title: ev.title || '事件',
 choice: choice.text || choice.name || '',
 direction: this.classifyDirection(ev),
 effects: choice.effects || {}
 });
 if (this.state.eventLog.length > 30) this.state.eventLog.pop();

 if (choice.showToast) {
 this.addNews(choice.showToast, 'crisis');
 }

 this.clampResources();
 return { ok: true };
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
 if (b.requires && !this.state.flags[b.requires] && !this.state.techs[b.requires]) {
 return { ok: false, msg: '需要前置科技: ' + (TECHS[b.requires]?.name || b.requires) };
 }
 if (this.state.resources.money < b.cost) return { ok: false, msg: '资金不足' };
 this.state.resources.money -= b.cost;
 this.state.buildQueue.push({ id: buildingId, turnsLeft: b.buildTime || 1 });
 this.addNews(`开始建造: ${b.name}`, 'economy');
 return { ok: true, msg: `开始建造 ${b.name}` };
 },

 // ===== 政策选择 =====
 choosePolicy(policyId, optionId) {
 const POLICIES = _getPolicies();
 const p = POLICIES[policyId];
 if (!p) return { ok: false, msg: '政策不存在' };
 const opt = p.options.find(o => o.id === optionId);
 if (!opt) return { ok: false, msg: '选项不存在' };
 if (opt.requires && !this.state.flags[opt.requires] && this.state.leader.ideology !== opt.requires) {
 return { ok: false, msg: '需要路线: ' + opt.requires };
 }
 if (opt.requiresFlag && !this.state.flags[opt.requiresFlag]) {
 return { ok: false, msg: '需要前置条件' };
 }
 this.state.policies[policyId] = optionId;
 return { ok: true, msg: `政策已更新: ${opt.name}` };
 },

 canChoosePolicy(policyId, optionId) {
 const POLICIES = _getPolicies();
 const p = POLICIES[policyId];
 if (!p) return false;
 const opt = p.options.find(o => o.id === optionId);
 if (!opt) return false;
 if (opt.requires) {
 if (this.state.leader.ideology !== opt.requires && !this.state.flags[opt.requires]) {
 return false;
 }
 }
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
 if (this.state.resources.money < (f.cost || 0)) return { ok: false, msg: '资金不足' };
 this.state.resources.money -= (f.cost || 0);
 this.state.currentFocus = focusId;
 this.state.focusProgress = 0;
 this.addNews(`启动国策: ${f.name}`, 'world');
 return { ok: true, msg: `国策已启动: ${f.name}` };
 },

 // ===== 计算每回合收入 =====
 calculateIncome() {
 const r = this.state.resources;
 const income = {};

 // 建筑产出
 const BUILDINGS = _getBuildings();
 for (const bid in this.state.buildings) {
 const b = BUILDINGS[bid];
 if (!b) continue;
 const count = this.state.buildings[bid] || 0;
 if (b.provides) {
 for (const k in b.provides) {
 income[k] = (income[k] || 0) + b.provides[k] * count * r.efficiency;
 }
 }
 }

 // 稳定度衰减
 if (r.stability > 60) income.stability -= (r.stability - 60) * 0.05;
 if (r.stability < 30) income.stability -= 0.5;

 income.deterrence -= 2;
 income.militaryPower -= 0.5;
 income.research -= 0.3;
 income.nukeDeter -= 1;

 income.money += 1;
 income.manpower += 1;

 // 关系影响
 const rel = this.state.relations || {};
 const majorFactions = ['ofn', 'japan', 'italy', 'burgundy', 'russia'];
 let tradeBonus = 0;
 let tensionCost = 0;
 for (const fid of majorFactions) {
 const v = rel[fid] || 0;
 if (v > 10) tradeBonus += v * 0.1;
 else if (v < -30) tensionCost += Math.abs(v) * 0.05;
 }
 income.money += tradeBonus;
 income.money -= tensionCost;

 // 敌对关系扣人力
 let hostileCount = 0;
 for (const fid of majorFactions) {
 if ((rel[fid] || 0) < -50) hostileCount++;
 }
 if (hostileCount >= 2) income.manpower -= hostileCount;

 // 国策加成
 const NATIONAL_FOCI = _getFoci();
 for (const fid of this.state.completedFoci) {
 const f = NATIONAL_FOCI[fid];
 if (!f || !f.perTurn) continue;
 for (const key in f.perTurn) {
 income[key] = (income[key] || 0) + f.perTurn[key];
 }
 }

 // 难度修正
 const diff = this.getDiff();
 for (const key in income) {
 if (income[key] > 0) {
 income[key] = income[key] * diff.incomeMod;
 } else if (income[key] < 0) {
 income[key] = income[key] * diff.penMod;
 }
 }

 // 四舍五入
 for (const key in income) {
 income[key] = Math.round(income[key] * 10) / 10;
 }

 return income;
 },

 // ===== 推进一回合 =====
 advanceTurn() {
 // 1. 建造队列推进
 for (let i = this.state.buildQueue.length - 1; i >= 0; i--) {
 this.state.buildQueue[i].turnsLeft--;
 if (this.state.buildQueue[i].turnsLeft <= 0) {
 const item = this.state.buildQueue.splice(i, 1)[0];
 const BUILDINGS = _getBuildings();
 const b = BUILDINGS[item.id];
 if (b) {
 this.state.buildings[item.id] = (this.state.buildings[item.id] || 0) + 1;
 const name = b.name || item.id;
 this.addNews(`${name} 建造完成`, 'economy');
 }
 }
 }

 // 2. 推进国策
 if (this.state.currentFocus) {
 this.state.focusProgress++;
 const NATIONAL_FOCI = _getFoci();
 const f = NATIONAL_FOCI[this.state.currentFocus];
 if (f && this.state.focusProgress >= f.turns) {
 this.applyEffects(f.effects);
 if (f.setFlags) Object.assign(this.state.flags, f.setFlags);
 this.state.completedFoci.push(this.state.currentFocus);
 const doneName = f.name || this.state.currentFocus;
 this.state.currentFocus = null;
 this.state.focusProgress = 0;
 this.addNews(`国策完成: ${doneName}`, 'world');
 }
 }

 // 3. 计算并应用收入
 const income = this.calculateIncome();
 for (const key in income) {
 this.state.resources[key] = (this.state.resources[key] || 0) + income[key];
 }
 this.clampResources();

 // 3.5 国家模拟系统更新
 if (typeof NationSim !== 'undefined') {
 NationSim.updateAll(this.state);
 }

 // 4. 推进时间
 this.state.turn++;
 this.state.quarter++;
 if (this.state.quarter > 4) {
 this.state.quarter = 1;
 this.state.year++;
 }

 // 4.1 借贷系统
 if (this.state.flags.loan_active) {
 this.state.flags.loan_remaining--;
 if (this.state.flags.loan_remaining <= 0) {
 const due = this.state.flags.loan_total_due || 180;
 if (this.state.resources.money >= due) {
 this.state.resources.money -= due;
 this.state.flags.loan_active = false;
 delete this.state.flags.loan_cooldown;
 this.addNews(`帝国债券到期，已偿还 ${due} 资金（含利息）`, 'economy');
 } else {
 const shortfall = due - this.state.resources.money;
 this.state.resources.money = 0;
 this.state.resources.stability = Math.max(0, this.state.resources.stability - 30);
 this.state.resources.deterrence = Math.max(0, this.state.resources.deterrence - 15);
 this.state.relations.ofn = Math.max(-100, this.state.relations.ofn - 20);
 this.state.flags.loan_active = false;
 this.state.flags.loan_defaulted = true;
 this.state.flags.loan_cooldown = 40;
 this.addNews(`帝国债券违约！信用崩溃，损失 ${shortfall.toFixed(0)} 资金。稳定-30，威慑-15`, 'crisis');
 }
 } else if (this.state.flags.loan_remaining % 4 === 0) {
 const yearsLeft = this.state.flags.loan_remaining / 4;
 this.addNews(`帝国债券还剩 ${yearsLeft} 年到期，需偿还 ${this.state.flags.loan_total_due || 180} 资金`, 'economy');
 }
 } else if (this.state.flags.loan_cooldown) {
 this.state.flags.loan_cooldown--;
 if (this.state.flags.loan_cooldown <= 0) delete this.state.flags.loan_cooldown;
 }

 // 5. 预加载下一年数据
 if (typeof DataStore !== 'undefined' && DataStore.preloadNextYear) {
 const nextYear = this.state.year + 1;
 DataStore.preloadNextYear(nextYear).catch(err => { console.warn('[Game] 预加载新年份失败:', err && err.message); });
 }

 // 6. 检查事件（v0.4.2: 返回分类后的核心事件）
 const turnEvents = this.getEventsForTurn();
 const onEvent = (typeof UI !== 'undefined' && UI.onEvents) ? UI.onEvents.bind(UI) : null;
 if (turnEvents.length > 0 && onEvent) {
 onEvent(turnEvents);
 }

 // 7. 检查结局
 this.checkEnding();

 // 8. 随机新闻
 if (Math.random() < 0.3) {
 const flavorNews = [
 '柏林街头飘来烤香肠的香气，市民排队购买限量配给。',
 '慕尼黑啤酒节如期举行，尽管啤酒供应紧张。',
 '汉堡港的一艘货轮悄然离港，目的地不明。',
 '莱比锡书展上，一本禁书在黑市流通。',
 '维也纳歌剧院上演《尼伯龙根的指环》，座无虚席。',
 '科隆大教堂的钟声在清晨回荡，信徒寥寥。',
 '德累斯顿的废墟上，野花悄然绽放。',
 '法兰克福证券交易所里，交易员们神情焦虑。',
 '斯图加特的奔驰工厂加班生产军用车辆。',
 '多特蒙德的煤矿工人举行无声罢工。'
 ];
 const idx = Math.floor(Math.random() * flavorNews.length);
 this.addNews(flavorNews[idx], 'flavor');
 }

 // 9. 通知UI更新
 const onTurn = (typeof UI !== 'undefined' && UI.onTurnEnd) ? UI.onTurnEnd.bind(UI) : null;
 if (onTurn) onTurn();
 },

 // ===== 外交行动 =====
 diplomaticAction(factionId, action) {
 const r = this.state.resources;
 const rel = this.state.relations;
 const factions = {
 ofn: '美国/OFN',
 japan: '日本/共荣圈',
 italy: '意大利',
 burgundy: '勃艮第',
 russia: '俄罗斯'
 };
 const factionName = factions[factionId] || factionId;

 const actions = {
 ally: {
 name: '外交示好',
 cost: { money: 10, deterrence: 1 },
 relChange: 8,
 desc: '释放善意信号，改善双边关系'
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

 for (const [k, v] of Object.entries(act.cost)) {
 if ((r[k] || 0) < v) return { ok: false, msg: '资源不足: ' + k };
 }

 for (const [k, v] of Object.entries(act.cost)) {
 r[k] -= v;
 }

 const actualChange = act.relChange;
 rel[factionId] = (rel[factionId] || 0) + actualChange;
 rel[factionId] = Math.max(-100, Math.min(100, rel[factionId]));

 if (act.onSuccess) act.onSuccess();

 const dir = actualChange > 0 ? '改善' : '恶化';
 this.addNews(`对${factionName}外交行动: ${act.name} → 关系${dir} ${Math.abs(actualChange)}点`, 'world');

 return { ok: true, msg: `${act.name}成功！与${factionName}关系${dir} ${Math.abs(actualChange)}点`, change: actualChange };
 },

 // ===== 检查结局条件 =====
 checkEnding() {
 const s = this.state;
 const r = s.resources;
 const diff = this.getDiff();

 if (s._crisis === undefined) s._crisis = { stab0: 0, debt: 0, deter: 0 };
 const cc = s._crisis;

 if (s.flags.nuclear_holocaust) {
 this.endGame('nuclear_holocaust');
 return;
 }

 // 稳定崩溃
 const stabCriticalThresh = 10;
 if (r.stability <= stabCriticalThresh) {
 cc.stab0++;
 if (cc.stab0 === 3) {
 this.addNews('⚠ 政局动荡：民众支持率持续走低，街头抗议频发', 'crisis');
 }
 if (cc.stab0 >= 5 && cc.stab0 % 2 === 0) {
 this.addNews('🚨 危机警报：稳定度极低，奴隶暴动、党卫军蠢蠢欲动！', 'crisis');
 }
 if (r.stability <= 0 && diff.stabFloor <= 0) {
 this.addNews('💀 帝国的心脏停止跳动 — 帝国崩塌！', 'crisis');
 this.endGame('collapse');
 return;
 }
 } else {
 if (cc.stab0 >= 3) {
 this.addNews('✅ 局势回稳：政府成功平息风波，民心渐归', 'economy');
 }
 cc.stab0 = 0;
 }

 // 经济崩溃
 const softDebt = this.difficulty === 'hell' ? -80 : (this.difficulty === 'hard' ? -80 : -100);
 const hardDebt = this.difficulty === 'hell' ? -200 : -250;
 if (r.money < softDebt) {
 cc.debt++;
 if (cc.debt >= 3 && (cc.debt === 3 || cc.debt % 4 === 0)) {
 this.addNews('🚨 帝国赤字严重：军队薪资拖欠、奴隶口粮不足，濒临破产！', 'crisis');
 }
 if (cc.debt >= 3 || r.money <= hardDebt) {
 this.addNews('💀 帝国财政崩溃 — 经济全面瓦解！', 'crisis');
 this.endGame('economic_collapse');
 return;
 }
 } else {
 if (cc.debt >= 2) this.addNews('✅ 财政回正：赤字警报解除', 'economy');
 cc.debt = 0;
 }

 // 威慑崩盘
 const deterSoft = Math.max(diff.deterFloor, 15);
 const hasHostile = s.relations.russia < -50 || s.relations.ofn < -50 || s.relations.japan < -50;
 if (r.deterrence < deterSoft && hasHostile) {
 cc.deter++;
 if (cc.deter >= 4) {
 this.addNews('💀 威慑崩盘 — 敌国大军压境！', 'crisis');
 this.endGame('invasion');
 return;
 }
 } else {
 if (cc.deter >= 2) this.addNews('✅ 局势缓和：威慑恢复，边境降温', 'world');
 cc.deter = 0;
 }

 // 地狱难度快速崩溃
 if (this.difficulty === 'hell' && r.deterrence <= 0) {
 cc.hellDeter = (cc.hellDeter || 0) + 1;
 if (cc.hellDeter >= 2) {
 this.endGame('invasion');
 return;
 }
 } else {
 cc.hellDeter = 0;
 }

 // 到达2000年终局
 if (s.year >= 2001 || (s.year === 2000 && s.quarter === 4 && s.turn >= s.totalTurns)) {
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

 if (f.reformist) {
 if (r.stability > 70 && r.deterrence > 60 && f.ofn_detente) {
 endingId = 'democratic_reform';
 } else if (r.stability > 50) {
 endingId = 'reformist_survival';
 } else {
 endingId = 'reformist_failure';
 }
 } else if (f.militarist) {
 if (r.deterrence > 100 && r.stability > 40) {
 endingId = 'militarist_victory';
 } else if (r.deterrence > 60) {
 endingId = 'militarist_stalemate';
 } else {
 endingId = 'militarist_collapse';
 }
 } else if (f.extremist) {
 if (f.nuclear_first_strike || f.burgundy_ally) {
 endingId = 'dark_victory';
 } else {
 endingId = 'terror_state';
 }
 } else if (f.conservative) {
 if (r.stability > 60) {
 endingId = 'conservative_survival';
 } else {
 endingId = 'conservative_decay';
 }
 } else {
 if (r.stability > 60 && r.deterrence > 50) {
 endingId = 'conservative_survival';
 } else {
 endingId = 'collapse';
 }
 }

 if (f.peace_maker && r.stability > 65) {
 endingId = 'peaceful_coexistence';
 }

 this.endGame(endingId);
 },

 // ===== 结束游戏 =====
 endGame(endingId) {
 this.state.ended = true;
 this.state.endingId = endingId;
 this.checkDifficultyUnlock();
 },

 // ===== 获取日期字符串 =====
 getDateStr() {
 const seasons = ['春', '夏', '秋', '冬'];
 const season = seasons[(this.state.quarter - 1) % 4] || '';
 return `${this.state.year}年${season}`;
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
