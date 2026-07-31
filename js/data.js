/* ============================================================
 * 千年帝国的最后一息 - 游戏数据
 * 建筑、势力、政策、科技等静态数据
 * ============================================================ */

// ===== 建筑定义 =====
// type: civilian(民工业) / military(军工业)
// effects: 每回合产出/消耗
const BUILDINGS = {
  // ---- 民工业（极少量钱/人力，主要提供微弱增长） ----
  consumer_factory: {
    id: 'consumer_factory',
    name: '消费品工厂',
    type: 'civilian',
    desc: '生产从收音机到合成香皂的一切。让帝国的人民暂时忘记饥饿。',
    cost: 120,
    buildTime: 2,
    effects: { money: 1 },
    maint: 3,
    category: '经济'
  },
  infrastructure: {
    id: 'infrastructure',
    name: '基础设施',
    type: 'civilian',
    desc: '高速公路、铁路与电网。让帝国的血管重新跳动。',
    cost: 180,
    buildTime: 3,
    effects: { money: 1 },
    maint: 4,
    category: '经济'
  },
  agriculture: {
    id: 'agriculture',
    name: '农业公社',
    type: 'civilian',
    desc: '在东方总督辖区开垦的土地。粮食是一切的基础。',
    cost: 105,
    buildTime: 2,
    effects: { manpower: 1 },
    maint: 1,
    category: '民生'
  },
  research_lab: {
    id: 'research_lab',
    name: '研发中心',
    type: 'civilian',
    desc: '技术专利卖钱，为事件中的突破打基础。',
    cost: 240,
    buildTime: 3,
    effects: { money: 1 },
    maint: 3,
    category: '科技'
  },
  university: {
    id: 'university',
    name: '帝国大学',
    type: 'civilian',
    desc: '培养工程师与官僚。提供额外人力。',
    cost: 165,
    buildTime: 3,
    effects: { manpower: 1 },
    maint: 2,
    category: '民生'
  },
  housing: {
    id: 'housing',
    name: '工人住宅区',
    type: 'civilian',
    desc: '为帝国工人提供的住所。',
    cost: 90,
    buildTime: 1,
    effects: { manpower: 1 },
    maint: 1,
    category: '民生'
  },
  bank: {
    id: 'bank',
    name: '帝国金库',
    type: 'civilian',
    desc: '管控黑市、发行马克。',
    cost: 210,
    buildTime: 3,
    effects: { money: 2 },
    maint: 2,
    category: '经济'
  },
  propaganda: {
    id: 'propaganda',
    name: '宣传总局',
    type: 'civilian',
    desc: '戈培尔的遗产。报纸收入微薄。',
    cost: 135,
    buildTime: 2,
    effects: { money: 1 },
    maint: 2,
    category: '政治'
  },

  // ---- 军工业（仅产出极少量钱/人力/核弹） ----
  // 军力/威慑/核慑/研发 必须通过国策+事件获得
  arms_factory: {
    id: 'arms_factory',
    name: '兵工厂',
    type: 'military',
    desc: '军火出口，微薄收入。',
    cost: 150,
    buildTime: 2,
    effects: { money: 1 },
    maint: 5,
    category: '陆军'
  },
  tank_factory: {
    id: 'tank_factory',
    name: '装甲车辆厂',
    type: 'military',
    desc: '重型工业，高薪就业。',
    cost: 270,
    buildTime: 4,
    effects: { money: 2 },
    maint: 5,
    category: '陆军'
  },
  aircraft_factory: {
    id: 'aircraft_factory',
    name: '航空工业',
    type: 'military',
    desc: '高附加值产业。',
    cost: 300,
    buildTime: 4,
    effects: { money: 2 },
    maint: 7,
    category: '空军'
  },
  shipyard: {
    id: 'shipyard',
    name: '造船厂',
    type: 'military',
    desc: '大型造船厂。',
    cost: 360,
    buildTime: 5,
    effects: { money: 2 },
    maint: 6,
    category: '海军'
  },
  missile_base: {
    id: 'missile_base',
    name: '导弹发射基地',
    type: 'military',
    desc: '基地提供就业。',
    cost: 450,
    buildTime: 5,
    effects: { money: 1 },
    maint: 7,
    category: '战略'
  },
  nuclear_facility: {
    id: 'nuclear_facility',
    name: '核武器设施',
    type: 'military',
    desc: '唯一能直接产出核弹的设施（极慢）。',
    cost: 675,
    buildTime: 6,
    effects: { nukes: 0.1, money: 1 },
    maint: 10,
    category: '战略',
    requires: 'nuclear_tech'
  },
  ss_barracks: {
    id: 'ss_barracks',
    name: '党卫军兵营',
    type: 'military',
    desc: '兵营提供就业。',
    cost: 195,
    buildTime: 3,
    effects: { manpower: 1, money: 1 },
    maint: 7,
    category: '陆军'
  },
  air_defense: {
    id: 'air_defense',
    name: '国土防空网',
    type: 'military',
    desc: '防空系统维护岗位。',
    cost: 225,
    buildTime: 3,
    effects: { money: 1 },
    maint: 4,
    category: '空军'
  },
  wunderwaffe: {
    id: 'wunderwaffe',
    name: '奇迹武器实验室',
    type: 'military',
    desc: '等事件突破，不直接产出。',
    cost: 525,
    buildTime: 6,
    effects: { money: 2 },
    maint: 8,
    category: '战略',
    requires: 'advanced_tech'
  }
};

// ===== 势力定义 =====
const FACTIONS = {
  ofn: { id: 'ofn', name: '自由国家组织', short: '美国', desc: '由美国领导的自由世界残部。民主的灯塔，虽已蒙尘。' },
  japan: { id: 'japan', name: '大东亚共荣圈', short: '日本', desc: '日本帝国与其仆从国。控制着太平洋与亚洲。' },
  italy: { id: 'italy', name: '三头同盟', short: '意大利', desc: '意大利、伊比利亚、土耳其的松散联盟，意图摆脱德国。' },
  burgundy: { id: 'burgundy', name: '勃艮第骑士团国', short: '勃艮第', desc: '希姆莱的噩梦之国。它策划着世界的终结。' },
  russia: { id: 'russia', name: '俄罗斯诸军阀', short: '俄罗斯', desc: '东方废土上的割据势力。终有一日会重新统一。' }
};

// ===== 政策定义 =====
// 每个政策有若干选项，选项影响各种参数
const POLICIES = {
  economy: {
    id: 'economy',
    name: '经济路线',
    desc: '帝国经济的根本方向。奴隶制是毒药，但也是止疼药。',
    options: [
      { id: 'slave_economy', name: '维持奴隶经济', desc: '稳定但腐朽。+资金 -稳定', locked: false },
      { id: 'mixed_reform', name: '渐进改革', desc: '逐步解放奴隶，引入市场。需改革派路线', requires: 'reformist' },
      { id: 'war_economy', name: '战时经济', desc: '一切为军队。+军产 -民产', requires: 'militarist' },
      { id: 'free_market', name: '自由市场', desc: '彻底市场化。巨额资金但动荡', requires: 'reformist', requiresFlag: 'economic_reform_1' }
    ]
  },
  slave_policy: {
    id: 'slave_policy',
    name: '奴隶制度',
    desc: '数百万东方奴隶支撑着帝国工业。他们的命运，也是帝国的命运。',
    options: [
      { id: 'maintain_slaves', name: '维持现状', desc: '继续奴役。稳定经济，侵蚀人心' },
      { id: 'limited_rights', name: '有限权利', desc: '改善待遇，降低产出，缓和矛盾', requires: 'reformist' },
      { id: 'gradual_emancipation', name: '渐进解放', desc: '分批解放。巨大风险，巨大回报', requires: 'reformist', requiresFlag: 'slave_reform_1' },
      { id: 'harsher_rule', name: '更严酷统治', desc: '镇压一切反抗。+产出 -稳定', requires: 'militarist' }
    ]
  },
  military_doctrine: {
    id: 'military_doctrine',
    name: '军事学说',
    desc: '国防军的方向。是守土，是扩张，还是改革？',
    options: [
      { id: 'defensive', name: '防御优先', desc: '巩固边境，降低消耗' },
      { id: 'expansionist', name: '扩张主义', desc: '准备对外战争。+威慑 -资金', requires: 'militarist' },
      { id: 'modernization', name: '现代化改革', desc: '裁撤冗员，提升效率', requires: 'reformist' },
      { id: 'nuclear_first', name: '核优先', desc: '一切为了核威慑', requiresFlag: 'nuclear_tech' }
    ]
  },
  foreign_policy: {
    id: 'foreign_policy',
    name: '外交路线',
    desc: '在三极世界中，帝国选择敌人还是伙伴？',
    options: [
      { id: 'isolation', name: '孤立主义', desc: '关起门来处理内务' },
      { id: 'detente_ofn', name: '与OFN缓和', desc: '寻求与美国的共存', requires: 'reformist' },
      { id: 'axis_japan', name: '联日抗美', desc: '重建轴心，瓜分太平洋' },
      { id: 'anti_burgundy', name: '反勃艮第', desc: '联合诸国铲除希姆莱', requiresFlag: 'burgundian_threat' }
    ]
  },
  youth_policy: {
    id: 'youth_policy',
    name: '青年政策',
    desc: '走上街头的学生，是帝国的未来，还是帝国的掘墓人？',
    options: [
      { id: 'suppress_youth', name: '镇压', desc: '党卫军上街。+稳定 -人力' },
      { id: 'coopt_youth', name: '收编', desc: '将抗议纳入体制。温和' },
      { id: 'dialogue', name: '对话', desc: '聆听诉求，推动改革', requires: 'reformist' },
      { id: 'militarize_youth', name: '军事化', desc: '送进兵营。+军力 -稳定', requires: 'militarist' }
    ]
  }
};

// ===== 国策树（HOI4式） =====
// 每个国策完成后触发效果，或解锁后续国策/设置标记
const NATIONAL_FOCI = {
  // ---- 经济分支 ----
  economic_stimulation: {
    id: 'economic_stimulation',
    name: '经济刺激',
    branch: '经济',
    cost: 50,
    turns: 2,
    desc: '财政手段刺激经济。完成后每回合+1资金。',
    effects: {},
    perTurn: { money: 1 },
    requires: [],
    ideology: null,
    setFlags: {},
    triggerEvent: null
  },
  black_market_crackdown: {
    id: 'black_market_crackdown',
    name: '打击黑市',
    branch: '经济',
    cost: 60,
    turns: 3,
    desc: '清剿地下经济。完成后每回合+1资金。',
    effects: {},
    perTurn: { money: 1 },
    requires: ['economic_stimulation'],
    ideology: null,
    setFlags: {},
    triggerEvent: null
  },
  slave_economy_reform: {
    id: 'slave_economy_reform',
    name: '奴隶制改革',
    branch: '经济',
    cost: 100,
    turns: 4,
    desc: '解放生产力。完成后每回合+1人力。',
    effects: {},
    perTurn: { manpower: 1 },
    requires: ['black_market_crackdown'],
    ideology: 'reformist',
    setFlags: { slave_reform_1: true },
    triggerEvent: null
  },
  war_economy_mobilization: {
    id: 'war_economy_mobilization',
    name: '战时经济动员',
    branch: '经济',
    cost: 80,
    turns: 3,
    desc: '工业转向军备。完成后每回合+1资金。',
    effects: {},
    perTurn: { money: 1 },
    requires: ['economic_stimulation'],
    ideology: 'militarist',
    setFlags: {},
    triggerEvent: null
  },
  free_market_transition: {
    id: 'free_market_transition',
    name: '自由市场转型',
    branch: '经济',
    cost: 150,
    turns: 6,
    desc: '彻底市场经济。完成后每回合+2资金。',
    effects: {},
    perTurn: { money: 2 },
    requires: ['slave_economy_reform'],
    ideology: 'reformist',
    setFlags: { economic_reform_1: true },
    triggerEvent: null
  },

  // ---- 军事分支 ----
  border_fortification: {
    id: 'border_fortification',
    name: '边境要塞化',
    branch: '军事',
    cost: 80,
    turns: 3,
    desc: '构筑永备工事。完成后每回合+1威慑。',
    effects: {},
    perTurn: { deterrence: 1 },
    requires: [],
    ideology: null,
    setFlags: {},
    triggerEvent: null
  },
  army_modernization: {
    id: 'army_modernization',
    name: '陆军现代化',
    branch: '军事',
    cost: 120,
    turns: 4,
    desc: '更新装备。完成后每回合+1军力。',
    effects: {},
    perTurn: { militaryPower: 1 },
    requires: ['border_fortification'],
    ideology: null,
    setFlags: {},
    triggerEvent: null
  },
  air_force_expansion: {
    id: 'air_force_expansion',
    name: '空军扩张',
    branch: '军事',
    cost: 100,
    turns: 3,
    desc: '夺取制空权。完成后每回合+1军力。',
    effects: {},
    perTurn: { militaryPower: 1 },
    requires: ['border_fortification'],
    ideology: null,
    setFlags: {},
    triggerEvent: null
  },
  nuclear_deterrence_buildup: {
    id: 'nuclear_deterrence_buildup',
    name: '核威慑建设',
    branch: '军事',
    cost: 200,
    turns: 5,
    desc: '扩建核武库。完成后每回合+1核慑。',
    effects: {},
    perTurn: { nukeDeter: 1 },
    requires: ['army_modernization'],
    ideology: null,
    setFlags: {},
    triggerEvent: null,
    requiresFlag: 'nuclear_tech'
  },
  ss_expansion: {
    id: 'ss_expansion',
    name: '党卫军扩编',
    branch: '军事',
    cost: 90,
    turns: 3,
    desc: '扩编党卫军。完成后每回合+1军力。',
    effects: {},
    perTurn: { militaryPower: 1 },
    requires: ['army_modernization'],
    ideology: 'extremist',
    setFlags: {},
    triggerEvent: null
  },
  total_war_preparation: {
    id: 'total_war_preparation',
    name: '总体战准备',
    branch: '军事',
    cost: 150,
    turns: 5,
    desc: '全部进入战时。完成后每回合+1威慑+1军力。',
    effects: {},
    perTurn: { deterrence: 1, militaryPower: 1 },
    requires: ['ss_expansion', 'air_force_expansion'],
    ideology: 'militarist',
    setFlags: {},
    triggerEvent: null
  },

  // ---- 政治分支 ----
  propaganda_campaign: {
    id: 'propaganda_campaign',
    name: '宣传攻势',
    branch: '政治',
    cost: 50,
    turns: 2,
    desc: '重塑信心。完成后每回合+1稳定。',
    effects: {},
    perTurn: { stability: 1 },
    requires: [],
    ideology: null,
    setFlags: {},
    triggerEvent: null
  },
  youth_integration: {
    id: 'youth_integration',
    name: '青年收编',
    branch: '政治',
    cost: 60,
    turns: 3,
    desc: '化掘墓人为建设者。完成后每回合+1人力。',
    effects: {},
    perTurn: { manpower: 1 },
    requires: ['propaganda_campaign'],
    ideology: null,
    setFlags: {},
    triggerEvent: null
  },
  political_reform: {
    id: 'political_reform',
    name: '政治改革',
    branch: '政治',
    cost: 100,
    turns: 5,
    desc: '体制改革。完成后每回合+1稳定。',
    effects: {},
    perTurn: { stability: 1 },
    requires: ['youth_integration'],
    ideology: 'reformist',
    setFlags: { political_reform_1: true },
    triggerEvent: null
  },
  secret_police_expansion: {
    id: 'secret_police_expansion',
    name: '秘密警察扩编',
    branch: '政治',
    cost: 80,
    turns: 3,
    desc: '恐惧编织秩序。完成后每回合+1稳定+1威慑。',
    effects: {},
    perTurn: { stability: 1, deterrence: 1 },
    requires: ['propaganda_campaign'],
    ideology: 'conservative',
    setFlags: {},
    triggerEvent: null
  },
  cult_of_personality: {
    id: 'cult_of_personality',
    name: '个人崇拜',
    branch: '政治',
    cost: 120,
    turns: 4,
    desc: '元首即神。完成后每回合+1稳定+1威慑。',
    effects: {},
    perTurn: { stability: 1, deterrence: 1 },
    requires: ['secret_police_expansion'],
    ideology: 'extremist',
    setFlags: {},
    triggerEvent: null
  },

  // ---- 外交分支 ----
  detente_with_ofn: {
    id: 'detente_with_ofn',
    name: '与美国缓和',
    branch: '外交',
    cost: 70,
    turns: 3,
    desc: '寻求共存。完成后美国关系+30。',
    effects: { ofn_relation: 30 },
    perTurn: {},
    requires: [],
    ideology: 'reformist',
    setFlags: {},
    triggerEvent: null
  },
  axis_renewal: {
    id: 'axis_renewal',
    name: '轴心复兴',
    branch: '外交',
    cost: 80,
    turns: 3,
    desc: '拉拢日本。完成后日本关系+25。',
    effects: { japan_relation: 25 },
    perTurn: {},
    requires: [],
    ideology: null,
    setFlags: {},
    triggerEvent: null
  },
  anti_burgundy_alliance: {
    id: 'anti_burgundy_alliance',
    name: '反勃艮第联盟',
    branch: '外交',
    cost: 100,
    turns: 4,
    desc: '铲除希姆莱噩梦。完成后每回合+1威慑。',
    effects: { ofn_relation: 15, italy_relation: 15 },
    perTurn: { deterrence: 1 },
    requires: ['detente_with_ofn'],
    ideology: null,
    setFlags: { burgundian_threat: true },
    triggerEvent: null
  },
  middle_east_deal: {
    id: 'middle_east_deal',
    name: '中东石油协议',
    branch: '外交',
    cost: 90,
    turns: 3,
    desc: '石油换金钱。完成后每回合+1资金。',
    effects: { middle_east_relation: 15 },
    perTurn: { money: 1 },
    requires: ['axis_renewal'],
    ideology: null,
    setFlags: {},
    triggerEvent: null
  },

  // ---- 科技分支 ----
  research_grant: {
    id: 'research_grant',
    name: '科研拨款',
    branch: '科技',
    cost: 80,
    turns: 3,
    desc: '专项经费。完成后每回合+1研发。',
    effects: {},
    perTurn: { research: 1 },
    requires: [],
    ideology: null,
    setFlags: {},
    triggerEvent: null
  },
  rocket_program: {
    id: 'rocket_program',
    name: '火箭计划',
    branch: '科技',
    cost: 120,
    turns: 4,
    desc: '直抵星辰。完成后每回合+1研发。',
    effects: {},
    perTurn: { research: 1 },
    requires: ['research_grant'],
    ideology: null,
    setFlags: { rocketry_done: true },
    triggerEvent: null
  },
  computer_revolution: {
    id: 'computer_revolution',
    name: '计算机革命',
    branch: '科技',
    cost: 150,
    turns: 5,
    desc: '跃入信息时代。完成后每回合+1研发+1资金。',
    effects: {},
    perTurn: { research: 1, money: 1 },
    requires: ['research_grant'],
    ideology: 'reformist',
    setFlags: {},
    triggerEvent: null
  },
  wunderwaffe_project: {
    id: 'wunderwaffe_project',
    name: '奇迹武器计划',
    branch: '科技',
    cost: 200,
    turns: 6,
    desc: '改变战争形态。完成后每回合+1研发+1威慑。',
    effects: {},
    perTurn: { research: 1, deterrence: 1 },
    requires: ['rocket_program', 'computer_revolution'],
    ideology: null,
    setFlags: { advanced_tech: true },
    triggerEvent: null
  }
};

// ===== 科技树（简化） =====
const TECHS = {
  nuclear_tech: { id: 'nuclear_tech', name: '核能技术', cost: 200, desc: '解锁核武器设施。让帝国拥有毁灭世界的钥匙。' },
  advanced_tech: { id: 'advanced_tech', name: '前沿科技', cost: 300, desc: '解锁奇迹武器实验室。计算机、激光、航天。' },
  rocketry: { id: 'rocketry', name: '航天工程', cost: 180, desc: '提升导弹与太空能力。' },
  electronics: { id: 'electronics', name: '电子技术', cost: 250, desc: '计算机革命。提升研发效率与经济。' },
  biology: { id: 'biology', name: '生物科学', cost: 200, desc: '农业与医学进步。提升人力与稳定。' }
};

// ===== 继任者路线 =====
const SUCCESSION_PATHS = {
  speer: {
    id: 'speer',
    name: '阿尔伯特·施佩尔',
    title: '改革派',
    desc: '建筑师出身的改革者。试图让帝国从内部转型，挽救其于腐朽之中。',
    bonuses: { research: 2, stability: 5 },
    ideology: 'reformist'
  },
  bormann: {
    id: 'bormann',
    name: '马丁·鲍曼',
    title: '保守派',
    desc: '希特勒的秘书，党内权术大师。维持现状，巩固权力。',
    bonuses: { stability: 8, money: 50 },
    ideology: 'conservative'
  },
  goring: {
    id: 'goring',
    name: '赫尔曼·戈林',
    title: '军国派',
    desc: '帝国元帅，花花公子与战争狂人。相信一切问题都能用轰炸解决。',
    bonuses: { deterrence: 10, militaryPower: 15 },
    ideology: 'militarist'
  },
  heydrich: {
    id: 'heydrich',
    name: '莱因哈德·海德里希',
    title: '党卫军派',
    desc: '布拉格屠夫。如果他要让帝国走向某个方向，那一定是地狱。',
    bonuses: { deterrence: 15, stability: -10 },
    ideology: 'extremist'
  },
  speidel: {
    id: 'speidel',
    name: '汉斯·斯派达尔',
    title: '国防军临时政府',
    desc: '内战中的意外赢家。一个不想当元首的军人，被迫接手一个不想被接手的国家。',
    bonuses: { stability: 10, militaryPower: 5 },
    ideology: 'reformist'
  }
};

// 导出（用于浏览器全局）
if (typeof window !== 'undefined') {
  window.BUILDINGS = BUILDINGS;
  window.FACTIONS = FACTIONS;
  window.POLICIES = POLICIES;
  window.NATIONAL_FOCI = NATIONAL_FOCI;
  window.TECHS = TECHS;
  window.SUCCESSION_PATHS = SUCCESSION_PATHS;
}
