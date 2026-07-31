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
  },

  // ---- 新增：民工业建筑 ----
  coastal_defense: {
    id: 'coastal_defense',
    name: '海岸防御工事',
    type: 'civilian',
    desc: '混凝土巨兽沿北海与波罗的海延绵，炮口朝向永远不来的登陆。它们存在的意义，是让敌人知道代价。',
    cost: 200,
    buildTime: 3,
    effects: { deterrence: 1 },
    maint: 3,
    category: '国防'
  },
  imperial_broadcasting: {
    id: 'imperial_broadcasting',
    name: '帝国广播电台',
    type: 'civilian',
    desc: '从日耳曼尼亚到东方总督辖区，广播电波穿越铁幕。每一台收音机都是帝国的延伸——也是它最脆弱的神经。',
    cost: 150,
    buildTime: 2,
    effects: { stability: 1 },
    maint: 2,
    category: '文化'
  },
  national_highway: {
    id: 'national_highway',
    name: '帝国高速公路网',
    type: 'civilian',
    desc: '帝国高速公路网横贯欧陆，从大西洋到乌拉尔。柏油之下埋着战俘的骨头，柏油之上跑着新贵的大众汽车。',
    cost: 220,
    buildTime: 3,
    effects: { money: 1 },
    maint: 3,
    category: '经济'
  },
  hydroelectric_plant: {
    id: 'hydroelectric_plant',
    name: '水力发电站',
    type: 'civilian',
    desc: '阿尔卑斯山融雪汇入涡轮，电流顺着铜线流向鲁尔区的工厂。水坝下的村庄已无人记得名字。',
    cost: 280,
    buildTime: 4,
    effects: { money: 2 },
    maint: 4,
    category: '经济'
  },
  synthetic_oil_plant: {
    id: 'synthetic_oil_plant',
    name: '合成油工厂',
    type: 'civilian',
    desc: '当罗马尼亚的油井不再可靠，帝国的化学家从煤中榨出黑色的命脉。每一升合成油，都燃烧着五倍于天然的代价。',
    cost: 300,
    buildTime: 4,
    effects: { money: 1 },
    maint: 5,
    category: '军事'
  },
  agricultural_collective: {
    id: 'agricultural_collective',
    name: '集体农庄',
    type: 'civilian',
    desc: '东方土地上的集体农庄。德意志移民与斯拉夫劳工在同一片黑土上弯腰，收割着不属于任何人的麦穗。',
    cost: 120,
    buildTime: 2,
    effects: { manpower: 1 },
    maint: 1,
    category: '民生'
  },
  fishing_fleet: {
    id: 'fishing_fleet',
    name: '渔业船队',
    type: 'civilian',
    desc: '北海的雾中，拖网渔船颠簸着归来。鱼罐头运往前线，鱼骨磨成肥料——大海从不拒绝帝国的索取。',
    cost: 90,
    buildTime: 1,
    effects: { manpower: 1 },
    maint: 1,
    category: '民生'
  },
  textile_mill: {
    id: 'textile_mill',
    name: '纺织厂',
    type: 'civilian',
    desc: '棉纱在纺锤间飞转，缝制着军装与平民的衬衫。机器昼夜不息，工人三班倒，肺里积满棉尘。',
    cost: 110,
    buildTime: 2,
    effects: { money: 1 },
    maint: 2,
    category: '经济'
  },
  chemical_plant: {
    id: 'chemical_plant',
    name: '化工厂',
    type: 'civilian',
    desc: '法本工业的遗产。从染料到炸药，从化肥到毒气——化学家的坩埚里熬着帝国的双重面孔。',
    cost: 250,
    buildTime: 3,
    effects: { research: 1 },
    maint: 4,
    category: '科技'
  },
  pharmaceutical_lab: {
    id: 'pharmaceutical_lab',
    name: '制药实验室',
    type: 'civilian',
    desc: '无菌实验室里培养着青霉素与希望。在前线，一针抗生素能换回一条命——这正是帝国最稀缺的货币。',
    cost: 200,
    buildTime: 3,
    effects: { manpower: 1 },
    maint: 3,
    category: '科技'
  },
  luxury_goods: {
    id: 'luxury_goods',
    name: '奢侈品工坊',
    type: 'civilian',
    desc: '为还能负担得起的人而开。水晶、香水、丝绸领带——让纳粹新贵们忘记自己曾在哪条战壕里啃过黑面包。',
    cost: 180,
    buildTime: 2,
    effects: { money: 1 },
    maint: 2,
    category: '经济'
  },
  imperial_post: {
    id: 'imperial_post',
    name: '帝国邮政',
    type: 'civilian',
    desc: '绿色的邮政卡车穿越废墟与新生。信件是家书的载体，也是审查官的猎场——每一封都拆开过两次。',
    cost: 100,
    buildTime: 2,
    effects: { stability: 1 },
    maint: 1,
    category: '民生'
  },
  weather_station: {
    id: 'weather_station',
    name: '气象站网络',
    type: 'civilian',
    desc: '从格陵兰到高加索，气象站织成一张看不见的网。预报风向，也预报到哪里投毒气最有效。',
    cost: 130,
    buildTime: 2,
    effects: { research: 1 },
    maint: 1,
    category: '科技'
  },
  geological_survey: {
    id: 'geological_survey',
    name: '地质勘探局',
    type: 'civilian',
    desc: '地质学家带着钻头走遍东方。他们在寻找铁矿、油田与稀土——也在为帝国的棺材钉最后一颗钉子。',
    cost: 160,
    buildTime: 2,
    effects: { money: 1 },
    maint: 2,
    category: '科技'
  },
  film_studio: {
    id: 'film_studio',
    name: '帝国电影制片厂',
    type: 'civilian',
    desc: '乌发电影公司的摄影棚里，胶片记录着帝国的英雄与谎言。娱乐片换外汇，纪录片换人心。',
    cost: 190,
    buildTime: 3,
    effects: { stability: 1 },
    maint: 2,
    category: '文化'
  },

  // ---- 新增：军工业建筑 ----
  panzer_factory: {
    id: 'panzer_factory',
    name: '装甲车辆工厂',
    type: 'military',
    desc: '豹式与虎式的产床。每一辆出厂的坦克都载着五名乘员驶向不可知的东方——工厂只负责制造铁棺材，不负责填埋死者。',
    cost: 350,
    buildTime: 5,
    effects: { militaryPower: 1 },
    maint: 5,
    category: '陆军'
  },
  fighter_plant: {
    id: 'fighter_plant',
    name: '战斗机生产线',
    type: 'military',
    desc: 'Me 262的喷气啸叫划破巴伐利亚的天空。当盟军轰炸机还在用螺旋桨思考时，帝国已飞向未来——只是未来来得太晚。',
    cost: 320,
    buildTime: 4,
    effects: { militaryPower: 1 },
    maint: 4,
    category: '空军'
  },
  submarine_yard: {
    id: 'submarine_yard',
    name: '潜艇船坞',
    type: 'military',
    desc: 'XXI型潜艇的船台彻夜灯火通明。电池驱动的狼群潜伏在北海深处，等待一个永远不会到来的胜仗。',
    cost: 400,
    buildTime: 5,
    effects: { deterrence: 1 },
    maint: 6,
    category: '海军'
  },
  coastal_battery: {
    id: 'coastal_battery',
    name: '海岸炮台',
    type: 'military',
    desc: '380毫米巨炮蹲守在混凝土炮台里，炮管指向海平线。它们开火的机会寥寥，但开火时地动山摇。',
    cost: 250,
    buildTime: 3,
    effects: { deterrence: 1 },
    maint: 3,
    category: '海军'
  },
  radar_station: {
    id: 'radar_station',
    name: '雷达站',
    type: 'military',
    desc: '雷达天线旋转，扫描着看不见的天空。荧光屏上的每一个亮点，都可能是死神，也可能是误报。',
    cost: 200,
    buildTime: 3,
    effects: { deterrence: 1 },
    maint: 3,
    category: '空军'
  },
  missile_silo: {
    id: 'missile_silo',
    name: '导弹发射井',
    type: 'military',
    desc: '竖井深处，V-2的后裔静静伫立。按下按钮的人永远不会看到目标——也永远不用面对它。',
    cost: 500,
    buildTime: 5,
    effects: { nukeDeter: 1 },
    maint: 8,
    category: '战略'
  },
  underground_bunker: {
    id: 'underground_bunker',
    name: '地下指挥所',
    type: 'military',
    desc: '阿尔卑斯山腹的混凝土迷宫。元首地堡的翻版——为下一位元首准备的坟墓，也是指挥所。',
    cost: 300,
    buildTime: 4,
    effects: { stability: 1 },
    maint: 4,
    category: '战略'
  },
  munitions_plant: {
    id: 'munitions_plant',
    name: '弹药厂',
    type: 'military',
    desc: '炮弹流水线昼夜轰鸣。每一发7.92毫米子弹都在等待一个胸膛，每一发88毫米炮弹都在等待一辆坦克。',
    cost: 220,
    buildTime: 3,
    effects: { militaryPower: 1 },
    maint: 3,
    category: '陆军'
  },
  naval_academy: {
    id: 'naval_academy',
    name: '海军学院',
    type: 'military',
    desc: '基尔港的海军学院。学员们在风帆时代留下的铜钟下成长，毕业时多数将奔赴海底。',
    cost: 180,
    buildTime: 3,
    effects: { militaryPower: 1 },
    maint: 2,
    category: '海军'
  },
  air_force_base: {
    id: 'air_force_base',
    name: '空军基地',
    type: 'military',
    desc: '混凝土跑道延伸至天际。地勤挥舞荧光棒，引导战机归巢——有时归巢的是飞机，有时只剩飞行员。',
    cost: 280,
    buildTime: 4,
    effects: { militaryPower: 1 },
    maint: 4,
    category: '空军'
  },
  fortification_line: {
    id: 'fortification_line',
    name: '防线工事',
    type: 'military',
    desc: '大西洋壁垒的东方翻版。碉堡、反坦克壕、雷场连成一线，等着不会到来的进攻者耗尽耐心。',
    cost: 350,
    buildTime: 5,
    effects: { deterrence: 1 },
    maint: 5,
    category: '陆军'
  },
  biological_lab: {
    id: 'biological_lab',
    name: '生物防御实验室',
    type: 'military',
    desc: 'P4级密封实验室里，穿防护服的人影培养着看不见的死神。样本编号是数字，解药编号是问号。',
    cost: 400,
    buildTime: 5,
    effects: { research: 1 },
    maint: 6,
    category: '战略'
  },
  electronic_warfare: {
    id: 'electronic_warfare',
    name: '电子战中心',
    type: 'military',
    desc: '看不见的频谱战场上，干扰与反干扰无声搏杀。一个错误信号能让一个师偏离战场，也能让一枚导弹偏离城市。',
    cost: 330,
    buildTime: 4,
    effects: { deterrence: 1 },
    maint: 5,
    category: '战略'
  },
  space_launch_facility: {
    id: 'space_launch_facility',
    name: '航天发射场',
    type: 'military',
    desc: '佩内明德的延伸。发射塔直指苍穹，火箭升空时尾焰照亮半个波罗的海——帝国最后的浪漫。',
    cost: 600,
    buildTime: 6,
    effects: { research: 1 },
    maint: 10,
    category: '战略'
  },
  nuclear_research_center: {
    id: 'nuclear_research_center',
    name: '核研究中心',
    type: 'military',
    desc: '重水反应堆在岩洞深处低鸣。海森堡的方程式指向两种未来：发电，或者毁灭——帝国只对后者感兴趣。',
    cost: 550,
    buildTime: 6,
    effects: { nukeDeter: 1 },
    maint: 8,
    category: '战略'
  }
};

// ===== 势力定义 =====
const FACTIONS = {
  ofn: {
    id: 'ofn',
    name: '自由国家组织',
    short: '美国',
    desc: '由美国领导的自由世界残部。民主的灯塔，虽已蒙尘。',
    longDesc: '1945年珍珠港遭德国原子弹轰炸后，美国被迫签署《赤城协定》，将太平洋岛屿和旧金山、洛杉矶港割让给日本。二战后美国陷入政治瘫痪和经济衰退，但仍是自由世界最后的希望。OFN由美国牵头，联合加拿大、澳大利亚等残余民主国家组成。1962年美国正经历民权运动和社会撕裂，总统肯尼迪试图重振国旗。'
  },
  japan: {
    id: 'japan',
    name: '大东亚共荣圈',
    short: '日本',
    desc: '日本帝国与其仆从国。控制着太平洋与亚洲。',
    longDesc: '日本通过偷袭珍珠港和德国提供的原子弹赢得了太平洋战争。共荣圈名义上是为了亚洲人的共同繁荣，实际上是日本军部剥削殖民地的遮羞布。日本实行封闭经济，只与共荣圈内傀儡国贸易，但日元早已失去信用。海军和陆军之间存在着严重对立，且双方都拥有核武器。1962年日本控制着从满洲到东南亚的广大领土。'
  },
  italy: {
    id: 'italy',
    name: '三头同盟',
    short: '意大利',
    desc: '意大利、伊比利亚、土耳其的松散联盟，意图摆脱德国。',
    longDesc: '由意大利、伊比利亚联邦和土耳其共和国组成。德国的亚特兰特罗帕计划（直布罗陀大坝）导致地中海海岸线下降，摧毁了意大利沿海城市经济，这是三头同盟与德国反目的主因。意大利国王安布罗西奥二世固守法西斯遗产，但国内民主运动高涨。伊比利亚联邦由弗朗哥和萨拉查·葡萄牙联合组成，内部矛盾重重。土耳其控制着中东殖民地，居于炸药桶之上。'
  },
  burgundy: {
    id: 'burgundy',
    name: '勃艮第骑士团国',
    short: '勃艮第',
    desc: '希姆莱的噩梦之国。它策划着世界的终结。',
    longDesc: '希姆莱在50年代政变失败后被赶出德国，在法国东部和比利时建立的国家。希姆莱深信纳粹党已堕落，创造了极端的"勃艮第体制"，混杂着对希姆莱的个人崇拜和异教崇拜。勃艮第实行斯巴达式的恐怖统治，雅利安人被监视、强迫劳动，非雅利安人生不如死。希姆莱梦想着一场核子末日来"净化"世界，秘密窃取德国核武器。勃艮第名义上是团结协定成员，实际不听命于柏林。'
  },
  russia: {
    id: 'russia',
    name: '俄罗斯诸军阀',
    short: '俄罗斯',
    desc: '东方废土上的割据势力。终有一日会重新统一。',
    longDesc: '1941年德国巴巴罗萨计划击溃了布哈林领导下的衰弱苏联。战后俄罗斯四分五裂，分为西俄罗斯、西西伯利亚、中西伯利亚和远东四大区域。每个区域都有数十个军阀割据，意识形态从共产主义到极端民族主义到君主制到无政府主义应有尽有。德国对西俄罗斯和西西伯利亚进行持续轰炸，阻碍统一。1962年俄罗斯的统一之路刚刚打开——因为德国内战即将爆发，轰炸即将停止。'
  }
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
  },

  // ---- 文化与社会分支 ----
  cultural_heritage: {
    id: 'cultural_heritage',
    name: '帝国文化遗产保护',
    branch: '文化',
    cost: 40,
    turns: 2,
    desc: '系统性地保护、修复和登记帝国境内从哥特式大教堂到巴洛克宫殿的各类文化遗产，建立帝国文物总目录。在意识形态狂热的年代，对物质文化的守护是对文明记忆最朴素的尊重。完成后每回合+1稳定。',
    effects: {},
    perTurn: { stability: 1 },
    requires: [],
    ideology: null,
    setFlags: {},
    triggerEvent: null
  },
  youth_league_reform: {
    id: 'youth_league_reform',
    name: '青年帝国联盟改革',
    branch: '文化',
    cost: 50,
    turns: 3,
    desc: '改革希特勒青年团的遗留体系，将其从单一的军事化灌输组织转型为兼顾职业培训、体育与公民教育的青年组织。动荡年代的年轻人需要方向，而非仅仅是口号。完成后每回合+1人力。',
    effects: {},
    perTurn: { manpower: 1 },
    requires: ['cultural_heritage'],
    ideology: null,
    setFlags: {},
    triggerEvent: null
  },
  women_labor_mobilization: {
    id: 'women_labor_mobilization',
    name: '妇女劳动力动员',
    branch: '文化',
    cost: 55,
    turns: 3,
    desc: '打破"三K主义"（Kinder, Küche, Kirche——孩子、厨房、教堂）的传统束缚，将妇女纳入正式劳动力体系，以缓解因战争损耗和奴隶制依赖造成的劳动力短缺。这是对纳粹意识形态的根本性挑战。完成后每回合+1人力。',
    effects: {},
    perTurn: { manpower: 1 },
    requires: ['cultural_heritage'],
    ideology: 'reformist',
    setFlags: {},
    triggerEvent: null
  },
  imperial_olympic_committee: {
    id: 'imperial_olympic_committee',
    name: '帝国奥林匹克委员会',
    branch: '文化',
    cost: 60,
    turns: 3,
    desc: '重组帝国奥林匹克委员会，争取在分裂的世界中举办一届展示"新德国"形象的奥运会。体育是软实力的延伸，也是与OFN和共荣圈在非战场领域较量的舞台。完成后提升帝国国际形象。',
    effects: {},
    perTurn: {},
    requires: ['youth_league_reform'],
    ideology: null,
    setFlags: {},
    triggerEvent: null
  },
  classical_renaissance: {
    id: 'classical_renaissance',
    name: '古典文艺复兴计划',
    branch: '文化',
    cost: 55,
    turns: 3,
    desc: '以巴赫、贝多芬、歌德、席勒为代表的德意志古典文化重新被确立为帝国精神生活的核心，对抗堕落现代主义和野蛮的极端民族主义。文化部资助乐团、剧院和出版社，重塑帝国的文化面貌。完成后每回合+1稳定。',
    effects: {},
    perTurn: { stability: 1 },
    requires: ['cultural_heritage'],
    ideology: 'reformist',
    setFlags: {},
    triggerEvent: null
  },
  modern_media_control: {
    id: 'modern_media_control',
    name: '现代媒体管控',
    branch: '文化',
    cost: 60,
    turns: 3,
    desc: '将宣传部的管控范围从报纸和广播扩展到电视、电影和新兴的流行音乐产业。戈培尔的遗产在新时代被赋予更精密的形式——娱乐本身就是最好的宣传。完成后每回合+1稳定。',
    effects: {},
    perTurn: { stability: 1 },
    requires: ['classical_renaissance'],
    ideology: 'conservative',
    setFlags: {},
    triggerEvent: null
  },
  imperial_language_standardization: {
    id: 'imperial_language_standardization',
    name: '帝国语言标准化',
    branch: '文化',
    cost: 50,
    turns: 2,
    desc: '推行高地德语为帝国及东方领地的唯一官方语言，规范拼写和语法，压制地方方言和少数民族语言。语言是统治的工具，也是同化的武器。完成后每回合+1稳定。',
    effects: {},
    perTurn: { stability: 1 },
    requires: ['classical_renaissance'],
    ideology: 'conservative',
    setFlags: {},
    triggerEvent: null
  },
  religious_affairs_management: {
    id: 'religious_affairs_management',
    name: '宗教事务管理',
    branch: '文化',
    cost: 55,
    turns: 3,
    desc: '在纳粹长期推行的"积极基督教"与新异教倾向之间寻求平衡，重新界定国家与教会（无论是新教还是天主教）的关系。信仰是人民的鸦片，也是秩序的支柱。完成后每回合+1稳定。',
    effects: {},
    perTurn: { stability: 1 },
    requires: ['imperial_language_standardization'],
    ideology: null,
    setFlags: {},
    triggerEvent: null
  },
  social_welfare_system: {
    id: 'social_welfare_system',
    name: '社会福利体系',
    branch: '文化',
    cost: 70,
    turns: 4,
    desc: '建立覆盖全体雅利安公民的现代化社会保障网——失业保险、养老金、医疗保险。这是对"人民共同体"承诺的兑现，也是缓解阶级矛盾、抵御激进思潮的必要之举。完成后每回合+1稳定。',
    effects: {},
    perTurn: { stability: 1 },
    requires: ['youth_league_reform'],
    ideology: 'reformist',
    setFlags: {},
    triggerEvent: null
  },
  mental_health_act: {
    id: 'mental_health_act',
    name: '精神健康法案',
    branch: '文化',
    cost: 60,
    turns: 3,
    desc: '终结T4等安乐死计划的阴影，建立现代化的精神卫生体系，承认心理创伤（尤其是前线老兵和轰炸幸存者）是需要治疗而非"净化"的疾病。这是对帝国黑暗过去的迟来赎罪。完成后每回合+1稳定。',
    effects: {},
    perTurn: { stability: 1 },
    requires: ['social_welfare_system'],
    ideology: 'reformist',
    setFlags: {},
    triggerEvent: null
  },
  imperial_archives_digitization: {
    id: 'imperial_archives_digitization',
    name: '帝国档案数字化',
    branch: '文化',
    cost: 65,
    turns: 3,
    desc: '利用新兴的计算机技术对帝国海量的行政、司法和历史档案进行系统化整理和检索。这既是行政现代化的需要，也将不可避免地让某些被深埋的历史真相浮出水面。完成后每回合+1研发。',
    effects: {},
    perTurn: { research: 1 },
    requires: ['modern_media_control'],
    ideology: 'reformist',
    setFlags: {},
    triggerEvent: null
  },
  historical_truth_commission: {
    id: 'historical_truth_commission',
    name: '历史真相委员会',
    branch: '文化',
    cost: 75,
    turns: 4,
    desc: '成立独立委员会，调查帝国建立以来对犹太人、斯拉夫人及其他"非雅利安"群体犯下的罪行，并公开档案。这是对整个纳粹意识形态根基的根本性颠覆，将引发剧烈的政治风暴。完成后每回合+1稳定。',
    effects: {},
    perTurn: { stability: 1 },
    requires: ['imperial_archives_digitization'],
    ideology: 'reformist',
    setFlags: { historical_truth: true },
    triggerEvent: null
  },
  cultural_exchange_program: {
    id: 'cultural_exchange_program',
    name: '文化交流计划',
    branch: '文化',
    cost: 60,
    turns: 3,
    desc: '在冷战铁幕的缝隙中，与OFN和三头同盟开展有限的文化和学术交流——音乐家、科学家、留学生的互访。文化是跨越意识形态鸿沟最柔软也最坚韧的桥梁。完成后提升与OFN关系。',
    effects: { ofn_relation: 15, italy_relation: 10 },
    perTurn: {},
    requires: ['imperial_olympic_committee'],
    ideology: 'reformist',
    setFlags: {},
    triggerEvent: null
  },
  imperial_medal_reform: {
    id: 'imperial_medal_reform',
    name: '帝国勋章制度改革',
    branch: '文化',
    cost: 50,
    turns: 2,
    desc: '改革臃肿且政治化的帝国勋赏体系，将其与党卫军的"血腥勋章"传统切割，建立以公民贡献而非意识形态纯度为标准的现代荣誉制度。勋章应奖励德行，而非效忠。完成后每回合+1稳定。',
    effects: {},
    perTurn: { stability: 1 },
    requires: ['cultural_exchange_program'],
    ideology: null,
    setFlags: {},
    triggerEvent: null
  },
  national_identity_reconstruction: {
    id: 'national_identity_reconstruction',
    name: '民族认同重建',
    branch: '文化',
    cost: 80,
    turns: 4,
    desc: '在清算历史罪行和重塑文化生活的双重基础上，重新定义"什么是德意志人"——从种族血统转向公民认同与文化归属。这是对纳粹核心教义最深刻的告别，也是帝国走向正常化的精神奠基。完成后每回合+1稳定。',
    effects: {},
    perTurn: { stability: 1 },
    requires: ['historical_truth_commission', 'imperial_medal_reform'],
    ideology: 'reformist',
    setFlags: { identity_reform: true },
    triggerEvent: null
  },

  // ---- 情报与安全分支 ----
  intelligence_agency_reorganization: {
    id: 'intelligence_agency_reorganization',
    name: '联邦情报局重组',
    branch: '情报',
    cost: 50,
    turns: 2,
    desc: '将分散在军事情报局（阿勃维尔）、党卫军情报处和外交情报室之间的对外情报职能整合为统一的联邦情报局，结束长期的内耗和重复劳动。柏林需要一个能看清世界的眼睛。完成后每回合+1威慑。',
    effects: {},
    perTurn: { deterrence: 1 },
    requires: [],
    ideology: null,
    setFlags: {},
    triggerEvent: null
  },
  counter_espionage_network: {
    id: 'counter_espionage_network',
    name: '反间谍网络',
    branch: '情报',
    cost: 60,
    turns: 3,
    desc: '针对OFN的中央情报局、日本的特高课，尤其是勃艮第无孔不入的渗透，建立覆盖党政军各层的反间谍网络。每一个可疑的暗号、每一笔异常的资金流向都将被记录在案。完成后每回合+1威慑。',
    effects: {},
    perTurn: { deterrence: 1 },
    requires: ['intelligence_agency_reorganization'],
    ideology: null,
    setFlags: {},
    triggerEvent: null
  },
  rsha_reform: {
    id: 'rsha_reform',
    name: '帝国安全总局改革',
    branch: '情报',
    cost: 65,
    turns: 3,
    desc: '改革海德里希遗留的帝国安全总局（RSHA），剥离其部分越界的权力，将其重新纳入国家法治框架。一个不受约束的安全机器最终会反噬其主。完成后每回合+1威慑+1稳定。',
    effects: {},
    perTurn: { deterrence: 1, stability: 1 },
    requires: ['counter_espionage_network'],
    ideology: 'conservative',
    setFlags: {},
    triggerEvent: null
  },
  border_control_enhancement: {
    id: 'border_control_enhancement',
    name: '边境管控强化',
    branch: '情报',
    cost: 55,
    turns: 2,
    desc: '强化与勃艮第、东方总督辖区及南欧三头同盟接壤地带的边境检查和海关稽查，堵截走私、间谍和人口贩卖。铁幕需要铁的边关。完成后每回合+1威慑。',
    effects: {},
    perTurn: { deterrence: 1 },
    requires: ['intelligence_agency_reorganization'],
    ideology: null,
    setFlags: {},
    triggerEvent: null
  },
  cryptography_institute: {
    id: 'cryptography_institute',
    name: '密码学研究院',
    branch: '情报',
    cost: 70,
    turns: 3,
    desc: '集中帝国最优秀的数学家和语言学家建立专门的密码学研究院，既破译敌国通讯，也加固自身的加密体系。在这个信息即权力的年代，谁能读懂对方的密信，谁就握有先机。完成后每回合+1研发+1威慑。',
    effects: {},
    perTurn: { research: 1, deterrence: 1 },
    requires: ['counter_espionage_network'],
    ideology: null,
    setFlags: {},
    triggerEvent: null
  },
  satellite_reconnaissance: {
    id: 'satellite_reconnaissance',
    name: '卫星侦察计划',
    branch: '情报',
    cost: 80,
    turns: 4,
    desc: '借助火箭计划成果发射侦察卫星，从轨道上监视OFN的航母编队、共荣圈的海军动向，以及勃艮第深山中的可疑设施。上帝视角不再是神话。完成后每回合+1研发+1威慑。',
    effects: {},
    perTurn: { research: 1, deterrence: 1 },
    requires: ['cryptography_institute'],
    ideology: 'reformist',
    setFlags: { satellite_recon: true },
    triggerEvent: null
  },
  infiltrate_burgundy: {
    id: 'infiltrate_burgundy',
    name: '渗透勃艮第',
    branch: '情报',
    cost: 75,
    turns: 4,
    desc: '向希姆莱的噩梦之国派遣潜伏特工，刺探其核武库位置、军事部署和"末日计划"的细节。勃艮第是世界上最封闭的国家，渗透它意味着九死一生——但若一无所知，便是十死无生。完成后每回合+1威慑。',
    effects: {},
    perTurn: { deterrence: 1 },
    requires: ['counter_espionage_network'],
    ideology: null,
    setFlags: { burgundy_infiltrated: true },
    triggerEvent: null
  },
  underground_resistance_monitoring: {
    id: 'underground_resistance_monitoring',
    name: '地下抵抗运动监控',
    branch: '情报',
    cost: 60,
    turns: 3,
    desc: '系统监控帝国境内残存的左翼地下组织、白玫瑰式的学生团体，以及东方少数民族的抵抗网络。监控是为了预防，但每一次监控都在拷问：秩序的代价是什么？完成后每回合+1稳定+1威慑。',
    effects: {},
    perTurn: { stability: 1, deterrence: 1 },
    requires: ['rsha_reform'],
    ideology: 'conservative',
    setFlags: {},
    triggerEvent: null
  },
  nuclear_security_protocol: {
    id: 'nuclear_security_protocol',
    name: '核武安保协议',
    branch: '情报',
    cost: 75,
    turns: 3,
    desc: '鉴于勃艮第窃取核武器的先例，建立严格的核武器储存、运输和发射授权安保协议，引入双人控制和生物识别等多重防线。世界末日的钥匙不能落入疯子之手。完成后每回合+1威慑。',
    effects: {},
    perTurn: { deterrence: 1 },
    requires: ['satellite_reconnaissance'],
    ideology: null,
    setFlags: { nuclear_secured: true },
    triggerEvent: null
  },
  intelligence_sharing_agreement: {
    id: 'intelligence_sharing_agreement',
    name: '情报共享协定',
    branch: '情报',
    cost: 65,
    turns: 3,
    desc: '与OFN和三头同盟建立有限但正式的情报共享渠道，共同监控勃艮第的核威胁和全球恐怖主义活动。即使是宿敌，在面对世界末日时也必须交换眼神。完成后提升与OFN关系。',
    effects: { ofn_relation: 20, italy_relation: 15 },
    perTurn: { deterrence: 1 },
    requires: ['infiltrate_burgundy'],
    ideology: 'reformist',
    setFlags: {},
    triggerEvent: null
  },
  counter_terror_operation: {
    id: 'counter_terror_operation',
    name: '反恐特别行动',
    branch: '情报',
    cost: 70,
    turns: 3,
    desc: '组建专门应对勃艮第赞助的极端组织和跨国恐怖活动的特别行动部队，具备快速部署和精确打击能力。在核阴影下，恐怖主义是新时代的常态化威胁。完成后每回合+1威慑。',
    effects: {},
    perTurn: { deterrence: 1 },
    requires: ['underground_resistance_monitoring', 'nuclear_security_protocol'],
    ideology: null,
    setFlags: {},
    triggerEvent: null
  },
  secret_police_modernization: {
    id: 'secret_police_modernization',
    name: '帝国秘密警察现代化',
    branch: '情报',
    cost: 80,
    turns: 4,
    desc: '将盖世太保的遗产全面现代化——电子监听、行为心理学、大数据档案。一个不再依赖酷刑而是依赖算法的监视国家，未必更仁慈，但一定更高效、更无孔不入。完成后每回合+1稳定+1威慑。',
    effects: {},
    perTurn: { stability: 1, deterrence: 1 },
    requires: ['counter_terror_operation'],
    ideology: 'extremist',
    setFlags: {},
    triggerEvent: null
  },

  // ---- 殖民与东方领地分支 ----
  eastern_reichskommissariat_reform: {
    id: 'eastern_reichskommissariat_reform',
    name: '东方总督辖区改革',
    branch: '殖民',
    cost: 50,
    turns: 2,
    desc: '改革由罗森贝格名义主管、实则各自为政的东方总督辖区行政体系，统一财政、司法和人事制度。乌拉尔山以西的广阔殖民地需要一个能真正运转的政府，而非一群贪腐的专员。完成后每回合+1资金。',
    effects: {},
    perTurn: { money: 1 },
    requires: [],
    ideology: null,
    setFlags: {},
    triggerEvent: null
  },
  ukraine_kommissariat_development: {
    id: 'ukraine_kommissariat_development',
    name: '乌克兰专员辖区开发',
    branch: '殖民',
    cost: 60,
    turns: 3,
    desc: '系统开发乌克兰的黑土地和重工业，将其从单纯的粮食掠夺地转变为帝国的粮仓和工业腹地。科赫的暴政必须被效率取代——否则饥荒将反噬帝国本身。完成后每回合+1资金。',
    effects: {},
    perTurn: { money: 1 },
    requires: ['eastern_reichskommissariat_reform'],
    ideology: null,
    setFlags: {},
    triggerEvent: null
  },
  caucasus_oil_drilling: {
    id: 'caucasus_oil_drilling',
    name: '高加索石油钻探',
    branch: '殖民',
    cost: 75,
    turns: 4,
    desc: '扩建巴库油田和格罗兹尼炼油厂，引入现代化钻探技术，将高加索打造为帝国能源命脉。石油是工业的血液，也是战争机器的燃料——谁掌控高加索，谁就掌控了欧亚大陆的脉搏。完成后每回合+2资金。',
    effects: {},
    perTurn: { money: 2 },
    requires: ['ukraine_kommissariat_development'],
    ideology: null,
    setFlags: { oil_secured: true },
    triggerEvent: null
  },
  moscow_kommissariat_rebuild: {
    id: 'moscow_kommissariat_rebuild',
    name: '莫斯科专员辖区重建',
    branch: '殖民',
    cost: 70,
    turns: 4,
    desc: '在曾遭核打击和长期轰炸的莫斯科废墟上重建行政中心和交通枢纽，将这座死城变为统治俄罗斯中部的支点。在废墟上建立秩序，是帝国最残酷也最必要的工程。完成后每回合+1资金+1稳定。',
    effects: {},
    perTurn: { money: 1, stability: 1 },
    requires: ['eastern_reichskommissariat_reform'],
    ideology: null,
    setFlags: {},
    triggerEvent: null
  },
  modern_eastern_railway: {
    id: 'modern_eastern_railway',
    name: '现代化东方铁路网',
    branch: '殖民',
    cost: 75,
    turns: 4,
    desc: '修建贯通柏林—华沙—明斯克—莫斯科—乌拉尔的高速铁路和货运网络，将东方领地真正缝合进帝国经济体系。铁轨延伸到哪里，帝国的实际统治就到达哪里。完成后每回合+1资金。',
    effects: {},
    perTurn: { money: 1 },
    requires: ['ukraine_kommissariat_development', 'moscow_kommissariat_rebuild'],
    ideology: null,
    setFlags: {},
    triggerEvent: null
  },
  colonial_autonomy_act: {
    id: 'colonial_autonomy_act',
    name: '殖民地自治法案',
    branch: '殖民',
    cost: 70,
    turns: 4,
    desc: '赋予东方总督辖区和乌克兰专员辖区有限的自治权，允许地方议会和本土公务员体系，以缓和民族矛盾、降低统治成本。这是对"生存空间"教义的温和修正——殖民也可以是治理而非仅仅是掠夺。完成后每回合+1稳定。',
    effects: {},
    perTurn: { stability: 1 },
    requires: ['moscow_kommissariat_rebuild'],
    ideology: 'reformist',
    setFlags: { colonial_reform: true },
    triggerEvent: null
  },
  eastern_migration_program: {
    id: 'eastern_migration_program',
    name: '东方移民计划',
    branch: '殖民',
    cost: 65,
    turns: 3,
    desc: '鼓励帝国本土过剩人口和退伍士兵向东方领地移民，分配土地和住房，建立德意志人定居点。这是"生存空间"理念的温和版实践——通过定居而非灭绝来巩固统治。完成后每回合+1人力。',
    effects: {},
    perTurn: { manpower: 1 },
    requires: ['modern_eastern_railway'],
    ideology: null,
    setFlags: {},
    triggerEvent: null
  },
  slavic_population_management: {
    id: 'slavic_population_management',
    name: '斯拉夫人口管理',
    branch: '殖民',
    cost: 60,
    turns: 3,
    desc: '系统登记、分类和管控东方领地的斯拉夫人口，区分"可同化"和"需隔离"群体，强制劳动配额和迁徙限制。这是东方总计划的温和残余——仍是种族压迫，但比赤裸的灭绝稍逊一筹。完成后每回合+1资金+1稳定。',
    effects: {},
    perTurn: { money: 1, stability: 1 },
    requires: ['eastern_reichskommissariat_reform'],
    ideology: 'conservative',
    setFlags: {},
    triggerEvent: null
  },
  eastern_industrial_belt: {
    id: 'eastern_industrial_belt',
    name: '东方工业带',
    branch: '殖民',
    cost: 80,
    turns: 4,
    desc: '依托高加索石油和东方铁路网，在乌克兰—顿巴斯—乌拉尔一线建设完整的重工业带，将东方领地从原料产地升级为工业腹地。这是帝国经济版图最宏大的重塑。完成后每回合+2资金。',
    effects: {},
    perTurn: { money: 2 },
    requires: ['caucasus_oil_drilling', 'modern_eastern_railway'],
    ideology: null,
    setFlags: { eastern_industry: true },
    triggerEvent: null
  },
  caspian_shipping_hub: {
    id: 'caspian_shipping_hub',
    name: '里海航运枢纽',
    branch: '殖民',
    cost: 70,
    turns: 3,
    desc: '将巴库和里海西岸港口建设为连接高加索、中亚和伊朗北部的航运枢纽，打通经里海通往东方的水路通道。掌控里海，便是掌控欧亚大陆的心脏。完成后每回合+1资金。',
    effects: {},
    perTurn: { money: 1 },
    requires: ['eastern_industrial_belt'],
    ideology: null,
    setFlags: {},
    triggerEvent: null
  }
};

// ===== 科技树（简化） =====
const TECHS = {
  nuclear_tech: { id: 'nuclear_tech', name: '核能技术', cost: 200, desc: '解锁核武器设施。让帝国拥有毁灭世界的钥匙。' },
  advanced_tech: { id: 'advanced_tech', name: '前沿科技', cost: 300, desc: '解锁奇迹武器实验室。计算机、激光、航天。' },
  rocketry: { id: 'rocketry', name: '航天工程', cost: 180, desc: '提升导弹与太空能力。' },
  electronics: { id: 'electronics', name: '电子技术', cost: 250, desc: '计算机革命。提升研发效率与经济。' },
  biology: { id: 'biology', name: '生物科学', cost: 200, desc: '农业与医学进步。提升人力与稳定。' },

  // ---- 新增科技 ----
  rocketry_advanced: {
    id: 'rocketry_advanced',
    name: '高级火箭技术',
    cost: 280,
    category: '航天',
    effects: { research: 2, deterrence: 1 },
    desc: '从V-2到多级运载，火箭的轨迹不再只是抛物线。当弹头能跨越大陆，距离第一次失去了意义。'
  },
  jet_engine: {
    id: 'jet_engine',
    name: '喷气式发动机',
    cost: 260,
    category: '航空',
    effects: { militaryPower: 1 },
    desc: '涡轮叶片在三千度高温中旋转，把螺旋桨时代抛在身后。天空的速度被重新定义，留给螺旋桨的只有博物馆。'
  },
  nuclear_fusion: {
    id: 'nuclear_fusion',
    name: '核聚变研究',
    cost: 600,
    category: '能源',
    effects: { research: 3 },
    desc: '模仿太阳的火焰在磁约束环中燃烧。一升海水能换一座城市的灯火——如果科学家能让它持续超过一秒。'
  },
  genetic_sequencing: {
    id: 'genetic_sequencing',
    name: '基因测序',
    cost: 320,
    category: '生物',
    effects: { research: 2, manpower: 1 },
    desc: '双螺旋被拆解成ATCG的字母表。生命的密码第一次被人类阅读——尽管大多数人读不懂扉页。'
  },
  satellite_technology: {
    id: 'satellite_technology',
    name: '卫星技术',
    cost: 350,
    category: '航天',
    effects: { research: 2, deterrence: 1 },
    desc: '金属球被抛入轨道，绕着这颗星球无止境地转。地面上的人仰头看见一颗移动的星——它也看见他们的一切。'
  },
  computer_networking: {
    id: 'computer_networking',
    name: '计算机网络',
    cost: 300,
    category: '电子',
    effects: { research: 2, money: 1 },
    desc: '终端机被铜线连成一张网。数据包像信件一样跳跃，只是快了十亿倍——审查官再也跟不上电的速度。'
  },
  artificial_intelligence: {
    id: 'artificial_intelligence',
    name: '人工智能',
    cost: 500,
    category: '电子',
    effects: { research: 3 },
    desc: '硅片上的逻辑门学会自己思考。它下棋赢了大师，写诗骗过编辑——但没人知道它什么时候会问出第一个问题。'
  },
  synthetic_biology: {
    id: 'synthetic_biology',
    name: '合成生物学',
    cost: 420,
    category: '生物',
    effects: { research: 2, manpower: 1 },
    desc: '科学家像搭积木一样拼装基因。细菌被改造成工厂，酵母菌吐出胰岛素——造物主的工作被外包给培养皿。'
  },
  quantum_physics: {
    id: 'quantum_physics',
    name: '量子物理',
    cost: 450,
    category: '物理',
    effects: { research: 3 },
    desc: '薛定谔的猫在盒子里同时活着与死去。观察者改变被观察者，确定性在普朗克尺度下崩塌——上帝确实掷骰子。'
  },
  advanced_materials: {
    id: 'advanced_materials',
    name: '先进材料',
    cost: 280,
    category: '材料',
    effects: { research: 2, money: 1 },
    desc: '碳纤维、钛合金、超导体——分子被重新排列成更坚硬、更轻盈、更不可思议的形态。钢铁开始显得原始。'
  },
  stealth_technology: {
    id: 'stealth_technology',
    name: '隐身技术',
    cost: 340,
    category: '军事',
    effects: { militaryPower: 1, deterrence: 1 },
    desc: '雷达波被吸波涂层吞噬，飞机在屏幕上消失。看不见的威胁比看得见的更可怕——恐惧源于未知。'
  },
  biological_warfare: {
    id: 'biological_warfare',
    name: '生物战',
    cost: 380,
    category: '军事',
    effects: { deterrence: 2 },
    desc: '培养皿里的炭疽与天花比一个装甲师更致命。释放它们的人永远不用直面受害者的脸——这正是它最恐怖之处。'
  },
  chemical_warfare: {
    id: 'chemical_warfare',
    name: '化学战',
    cost: 320,
    category: '军事',
    effects: { deterrence: 1, militaryPower: 1 },
    desc: '芥子气、神经毒剂、VX——化学家把农药的配方倒过来写。一缕黄烟能清空一条战壕，也能清空一座城市。'
  },
  cyber_warfare: {
    id: 'cyber_warfare',
    name: '网络战',
    cost: 400,
    category: '军事',
    effects: { deterrence: 1, research: 1 },
    desc: '没有硝烟的战场在光纤中展开。一段代码能让电网瘫痪、让导弹偏离——战士不再需要扣扳机，只需敲键盘。'
  },
  space_colonization: {
    id: 'space_colonization',
    name: '太空殖民',
    cost: 700,
    category: '航天',
    effects: { research: 3, stability: 1 },
    desc: '当地球被榨干，目光投向火星与月球。穹顶之下的人造生态圈是文明的备份——也是逃离自身的方舟。'
  },
  weather_control: {
    id: 'weather_control',
    name: '气象控制',
    cost: 550,
    category: '气象',
    effects: { research: 2, stability: 1 },
    desc: '电离层被加热，云层被播撒。干旱与洪涝成了按钮的选择——但没人能预料蝴蝶扇动翅膀的后果。'
  },
  mind_control: {
    id: 'mind_control',
    name: '心理控制技术',
    cost: 480,
    category: '心理',
    effects: { stability: 2, deterrence: 1 },
    desc: '从宣传到电波催眠，自由意志成了过时的奢侈品。当人脑可以被编程，反抗就成了需要被修复的bug。'
  },
  anti_ballistic_missile: {
    id: 'anti_ballistic_missile',
    name: '反导系统',
    cost: 420,
    category: '军事',
    effects: { deterrence: 2, nukeDeter: 1 },
    desc: '用子弹打子弹——理论上不可能，实践中烧钱。但只要它能拦下一枚，就改变了末日天平的倾斜方向。'
  },
  directed_energy_weapon: {
    id: 'directed_energy_weapon',
    name: '定向能武器',
    cost: 520,
    category: '军事',
    effects: { militaryPower: 2, deterrence: 1 },
    desc: '激光束以光速抵达目标，没有弹道，没有预警。一道闪光之后，目标已化为蒸汽——战争从此没有躲避的余地。'
  },
  autonomous_warfare: {
    id: 'autonomous_warfare',
    name: '无人化战争',
    cost: 560,
    category: '军事',
    effects: { militaryPower: 2, research: 1 },
    desc: '机器决定开火的时机，算法选择消灭的目标。当战争不再需要士兵，唯一被剥夺的只有人类的良心——以及战俘。'
  }
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
