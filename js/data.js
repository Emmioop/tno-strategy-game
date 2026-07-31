/* ============================================================
 * 千年帝国的最后一息 - 游戏数据
 * 建筑、势力、政策、科技等静态数据
 * ============================================================ */

// ===== 建筑定义 =====
// type: civilian(民工业) / military(军工业)
// effects: 每回合产出/消耗
const BUILDINGS = {
  // ---- 民工业 ----
  consumer_factory: {
    id: 'consumer_factory',
    name: '消费品工厂',
    type: 'civilian',
    desc: '生产从收音机到合成香皂的一切。让帝国的人民暂时忘记饥饿——也让黑市商贩失去生意。',
    cost: 80,
    buildTime: 2,
    effects: { money: 18, stability: 1.2 },
    maint: 2,
    category: '经济'
  },
  infrastructure: {
    id: 'infra',
    name: '基础设施',
    type: 'civilian',
    desc: '高速公路、铁路与电网。让帝国的血管重新跳动，也让军队调遣更快。',
    cost: 120,
    buildTime: 3,
    effects: { money: 8, efficiency: 0.04 },
    maint: 1,
    category: '经济'
  },
  agriculture: {
    id: 'agriculture',
    name: '农业公社',
    type: 'civilian',
    desc: '在东方总督辖区开垦的土地。粮食是稳定的第一块基石。',
    cost: 70,
    buildTime: 2,
    effects: { manpower: 4, stability: 1.5 },
    maint: 1,
    category: '民生'
  },
  research_lab: {
    id: 'research_lab',
    name: '研发中心',
    type: 'civilian',
    desc: '从火箭燃料到晶体管的实验室。奇迹诞生于这里，但经费也烧在这里。',
    cost: 160,
    buildTime: 3,
    effects: { research: 6 },
    maint: 4,
    category: '科技'
  },
  university: {
    id: 'university',
    name: '帝国大学',
    type: 'civilian',
    desc: '培养工程师与官僚。当然，也包括那些危险的、会读禁书的年轻人。',
    cost: 110,
    buildTime: 3,
    effects: { research: 3, manpower: 3, stability: 0.5 },
    maint: 3,
    category: '民生'
  },
  housing: {
    id: 'housing',
    name: '工人住宅区',
    type: 'civilian',
    desc: '为帝国工人提供的住所。比奴隶营房好——至少理论上如此。',
    cost: 60,
    buildTime: 1,
    effects: { stability: 2, manpower: 2 },
    maint: 1,
    category: '民生'
  },
  bank: {
    id: 'bank',
    name: '帝国金库',
    type: 'civilian',
    desc: '管控黑市、发行马克。让腐烂的经济机器再转一会儿。',
    cost: 140,
    buildTime: 3,
    effects: { money: 30, stability: 0.5 },
    maint: 2,
    category: '经济'
  },
  propaganda: {
    id: 'propaganda',
    name: '宣传总局',
    type: 'civilian',
    desc: '戈培尔的遗产。谎言重复一千遍，就成了真理——至少能撑过这个季度。',
    cost: 90,
    buildTime: 2,
    effects: { stability: 2.5 },
    maint: 2,
    category: '政治'
  },

  // ---- 军工业 ----
  arms_factory: {
    id: 'arms_factory',
    name: '兵工厂',
    type: 'military',
    desc: '从毛瑟步枪到突击步枪。军火是帝国唯一仍能拿得出手的出口品。',
    cost: 100,
    buildTime: 2,
    effects: { deterrence: 3, militaryPower: 5 },
    maint: 3,
    category: '陆军'
  },
  tank_factory: {
    id: 'tank_factory',
    name: '装甲车辆厂',
    type: 'military',
    desc: '豹式、虎式，以及那些永远造不完的超级坦克图纸。',
    cost: 180,
    buildTime: 4,
    effects: { deterrence: 6, militaryPower: 10 },
    maint: 5,
    category: '陆军'
  },
  aircraft_factory: {
    id: 'aircraft_factory',
    name: '航空工业',
    type: 'military',
    desc: 'Me-262的后代们。制空权意味着三极世界中的生存权。',
    cost: 200,
    buildTime: 4,
    effects: { deterrence: 7, militaryPower: 8 },
    maint: 6,
    category: '空军'
  },
  shipyard: {
    id: 'shipyard',
    name: '造船厂',
    type: 'military',
    desc: 'U型潜艇与水面舰艇。海军是帝国最薄弱的一环——也是最该补强的一环。',
    cost: 240,
    buildTime: 5,
    effects: { deterrence: 8, militaryPower: 9 },
    maint: 7,
    category: '海军'
  },
  missile_base: {
    id: 'missile_base',
    name: '导弹发射基地',
    type: 'military',
    desc: '冯·布劳恩的孩子们。从佩内明德到月球，再到——敌人的首都。',
    cost: 300,
    buildTime: 5,
    effects: { deterrence: 12, nukeDeter: 5 },
    maint: 8,
    category: '战略'
  },
  nuclear_facility: {
    id: 'nuclear_facility',
    name: '核武器设施',
    type: 'military',
    desc: '铀浓缩车间与组装工厂。这是让世界敬畏帝国的最后一根稻草。',
    cost: 450,
    buildTime: 6,
    effects: { nukes: 0.4, nukeDeter: 8 },
    maint: 12,
    category: '战略',
    requires: 'nuclear_tech'
  },
  ss_barracks: {
    id: 'ss_barracks',
    name: '党卫军兵营',
    type: 'military',
    desc: '精锐——也是隐患。希姆莱的人，未必是元首的人。',
    cost: 130,
    buildTime: 3,
    effects: { deterrence: 5, militaryPower: 6, stability: -1 },
    maint: 4,
    category: '陆军'
  },
  air_defense: {
    id: 'air_defense',
    name: '国土防空网',
    type: 'military',
    desc: '雷达、高炮、地空导弹。让敌人的轰炸机三思而后行。',
    cost: 150,
    buildTime: 3,
    effects: { deterrence: 4, militaryPower: 3 },
    maint: 4,
    category: '空军'
  },
  wunderwaffe: {
    id: 'wunderwaffe',
    name: '奇迹武器实验室',
    type: 'military',
    desc: '从飞碟到死光。多数是幻想，但偶尔——偶尔会改变战争。',
    cost: 350,
    buildTime: 6,
    effects: { deterrence: 10, research: 4, militaryPower: 4 },
    maint: 10,
    category: '战略',
    requires: 'advanced_tech'
  }
};

// ===== 势力定义 =====
const FACTIONS = {
  ofn: { id: 'ofn', name: '自由国家组织(OFN)', short: '美国/OFN', desc: '由美国领导的自由世界残部。民主的灯塔，虽已蒙尘。' },
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
  window.TECHS = TECHS;
  window.SUCCESSION_PATHS = SUCCESSION_PATHS;
}
