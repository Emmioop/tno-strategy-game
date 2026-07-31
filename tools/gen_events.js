/* ============================================================
 * TNO 事件生成器 - 批量生成 lore 丰富的随机事件
 * 运行: node tools/gen_events.js
 * 输出: js/events_gen.js
 * ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

// 简单确定性随机（种子），保证可复现
let _seed = 19621027;
function rnd() {
  _seed = (_seed * 1103515245 + 12345) & 0x7fffffff;
  return _seed / 0x7fffffff;
}
function pick(arr) { return arr[Math.floor(rnd() * arr.length)]; }
function ri(lo, hi) { return lo + Math.floor(rnd() * (hi - lo + 1)); }
function chance(p) { return rnd() < p; }

// ===== TNO lore 词库 =====
const LOCATIONS = [
  '日耳曼尼亚','慕尼黑','汉堡','法兰克福','纽伦堡','科隆','维也纳','林茨','格拉茨',
  '布拉格','布尔诺','布拉迪斯拉发','华沙','克拉科夫','罗兹','格但斯克','波兹南',
  '巴黎','里昂','马赛','南特','波尔多','里尔','斯特拉斯堡','东方巴黎',
  '阿姆斯特丹','鹿特丹','海牙','布鲁塞尔','安特卫普','奥斯陆','卑尔根','特隆赫姆',
  '哥本哈根','奥胡斯','赫尔辛基','雷克雅未克','斯德哥尔摩','哥德堡',
  '里加','塔林','维尔纽斯','考纳斯','明斯克','基辅','哈尔科夫','敖德萨','利沃夫','第聂伯罗',
  '莫斯科维恩废土','图拉','梁赞','特维尔','斯摩棱斯克','卡卢加','阿尔汉格尔斯克','摩尔曼斯克',
  '托木斯克','鄂木斯克','斯维尔德洛夫斯克','秋明','新西伯利亚','克麦罗沃','克拉斯诺亚尔斯克',
  '伊尔库茨克','赤塔','哈巴罗夫斯克','符拉迪沃斯托克','马加丹','雅库茨克',
  '巴库','第比利斯','埃里温','巴统','格罗兹尼','罗斯托夫','克拉斯诺达尔','索契',
  '东京','大阪','名古屋','横滨','京都','札幌','福冈','长崎',
  '南京','上海','北京','广州','武汉','奉天','长春','大连','哈尔滨','青岛',
  '汉城','平壤','奉天','承德','新加坡','雅加达、巴达维亚','泗水','万隆','马尼拉','河内','西贡','曼谷','仰光',
  '悉尼','墨尔本','布里斯班','奥克兰','惠灵顿','新德里','孟买','加尔各答','马德拉斯','卡拉奇',
  '华盛顿','纽约','波士顿','费城','芝加哥','底特律','洛杉矶','旧金山','西雅图','迈阿密','新奥尔良','亚特兰大','达拉斯','休斯敦',
  '伦敦','爱丁堡','格拉斯哥','贝尔法斯特','都柏林','卡迪夫',
  '马德里','巴塞罗那','塞维利亚','里斯本','波尔图','罗马','米兰','那不勒斯','都灵','热那亚','佛罗伦萨','威尼斯','巴勒莫','卡利亚里',
  '伊斯坦布尔、君士坦丁堡','安卡拉','伊兹密尔','布尔萨','开罗','亚历山大港','耶路撒冷','大马士革','巴格达','德黑兰','伊斯法罕','设拉子','利雅得','吉达','亚丁','马斯喀特',
  '勃艮第堡垒','色当','兰斯','梅斯','南锡','第戎','贝桑松','科尔马','米卢斯','斯特拉斯堡'
];

const PEOPLE = [
  '阿道夫·希特勒','阿尔伯特·施佩尔','马丁·鲍曼','赫尔曼·戈林','莱因哈德·海德里希','海因里希·希姆莱',
  '埃尔温·隆美尔','汉斯·斯派达尔','迈尔·霍费尔','约瑟夫·戈培尔','卡尔·邓尼茨','海因茨·古德里安',
  '埃里希·冯·曼施坦因','瓦尔特·莫德尔','费迪南德·舍尔纳','卡尔·沃尔夫','奥托·斯科尔兹内',
  '莱因哈德·盖伦','威廉·卡纳里斯','瓦尔特·谢伦贝格','恩斯特·卡尔滕布伦纳','阿图尔·赛斯-英夸特',
  '齐亚诺伯爵','贝尼托·墨索里尼','加莱阿佐·齐亚诺','弗朗西斯科·弗朗哥','安东尼奥·萨拉查',
  '约翰·F·肯尼迪','理查德·尼克松','巴里·戈德华特','林登·约翰逊','乔治·华莱士',
  '裕仁天皇','东条英机','近卫文麿','冈田启介','山本五十六','石原莞尔','岸信介',
  '根里克·雅戈达','谢尔盖·塔博里茨基','弗拉索夫','朱可夫','铁木辛哥','科涅夫','罗科索夫斯基',
  '乌尔丽克·梅茵霍芙','安德烈·萨哈罗夫','亚历山大·索尔仁尼琴'
];

const ORGS = [
  '党卫军SS','国防军','盖世太保','帝国安全总局RSHA','冲锋队SA','希特勒青年团','帝国邮政','帝国铁路',
  '法本工业','克虏伯','蒂森财团','大众汽车','西门子','乌发电影','勃艮第骑士团','党卫军查理曼师','瓦隆师',
  '帝国劳工局','托特组织','帝国研究委员会','帝国青年团','德国少女联盟','帝国文化协会','帝国新闻办公室'
];

const ITEMS = [
  'V-2火箭','V-3多级火箭','Me 262喷气战机','Ta 183战斗机','XXI型潜艇','豹式坦克','虎式坦克','鼠式超重型坦克',
  '原子弹','重水','合成油','合成橡胶','合成羊毛','亚特兰特罗帕大坝','奇迹武器Wunderwaffe','布谷鸟钟',
  '青霉素','磺胺','人民收音机','大众甲壳虫','齐柏林飞艇','电视广播塔','早期计算机Z3','恩尼格玛密码机',
  '夜视仪','红外瞄准镜','声导鱼雷','空对空导弹','洲际弹道导弹','间谍卫星','登月舱','核反应堆'
];

const SCENES = [
  '黑市走私','奴隶起义','党卫军异动','国防军哗变','学生示威','暗杀阴谋','核设施事故','火箭试射失败',
  '太空竞赛突破','外交危机','边境冲突','经济危机','马克贬值','粮食短缺','瘟疫爆发','罢工潮','宣传战',
  '间谍案','高官叛逃','艺术品掠夺','宗教冲突','体育赛事','电影首映','工业事故','矿井坍塌','潜艇失踪',
  '气象异常','UFO目击','神秘学活动','勃艮第渗透','俄罗斯军阀动态','日本陆海对立','美国民权运动',
  '情报泄露','军火库爆炸','毒气泄漏','粮食丰收','技术突破','外交婚礼','国葬','阅兵式','航空展',
  '货币改革','奴隶拍卖','集中营暴动','地下抵抗','密码破译','核试验','人造卫星发射','超自然现象调查'
];

const MOOD_OPEN = [
  '又是一个灰暗的清晨，雾气低垂在{loc}的废墟之上。',
  '{loc}的钟楼敲响了七下，但街上少有人影。',
  '电报机的滴答声打破了{loc}深夜的寂静。',
  '雨水冲刷着{loc}的石板路，将血迹与谎言一并冲入下水道。',
  '{loc}的酒馆里烟雾缭绕，醉汉们低声谈论着不敢明言的事。',
  '当{org}的人敲门时，{loc}没有人愿意开门。',
  '{loc}的天空被工厂的浓烟染成铅灰色。',
  '在{loc}的地下档案室里，积灰的卷宗揭开了尘封的秘密。',
  '一个衣衫褴褛的信使跌跌撞撞地冲进{loc}的市政厅。',
  '夜幕下的{loc}，只有探照灯的光柱在云层中扫荡。',
  '{loc}的火车站挤满了想要逃离的人，但火车早已停运。',
  '广播塔上传来刺耳的电流声，随后是{loc}熟悉的宣传腔调。',
  '审讯室的白炽灯下，{loc}的秘密一点点被撬开。',
  '{loc}的港口漂浮着一具无名尸体，没有证件，只有一枚徽章。',
  '教堂的钟声在{loc}回荡，但祈祷的人越来越少。'
];

const MOOD_BODY = [
  '据报告，{org}在{loc}的一次行动中暴露了破绽，引发了连锁反应。目击者称，{people}的亲信在事件中扮演了暧昧的角色——既未阻止，也未参与，仿佛在等待什么。',
  '一桩与{item}有关的丑闻在{loc}败露。黑市商人、低级官僚与{org}的线人形成了一张错综复杂的网，而网的中心，似乎指向了更高层的名字。',
  '{loc}的居民已经习惯了恐惧，但这次不同。{org}的卡车彻夜未停，邻居消失的速度比以往任何时候都快。有人说，这与勃艮第的影子有关。',
  '{people}（如果还活着的话）会对此感到愤怒。一份关于{scene}的密报摆上了决策者的案头，措辞谨慎，却字字见血。',
  '{org}的内部审计发现了{loc}账目的巨大漏洞。资金的去向指向东方——那里是{item}的原材料产地，也是无数奴隶埋骨之地。',
  '在{loc}的地下室，审讯官终于撬开了嫌疑人的嘴。供词涉及{scene}、{org}，以及一个令人不安的名字。',
  '{scene}的消息传到{loc}时，已经走了样。传言说这与{people}有关，但没有人敢公开核实。',
  '{loc}的工厂因{item}的短缺而停工，愤怒的工人聚集在厂门口。{org}的人已经在赶来的路上。',
  '一名自称来自{org}的军官在{loc}的酒馆里喝得酩酊大醉，说出了不该说的话。第二天，他消失了，但话已经传开。',
  '关于{scene}的谣言在{loc}不胫而走。{people}的名字被反复提起，每一次提起都伴随着压低的嗓音和不安的眼神。',
  '{loc}的夜空中划过一道诡异的光——有人说是{item}的试射，有人说是勃艮第的信号，更多的人选择闭嘴。',
  '一份从{org}流出的文件显示，{loc}的情况远比公开报告严峻。{scene}只是冰山一角，水面之下是整座冰山。',
  '当{people}的画像在{loc}的广场上被悄悄撤下时，敏锐的人嗅到了风向的变化。',
  '{loc}的监狱人满为患，最新的囚犯都与{scene}有关。{org}的审讯官已经连续工作了三天三夜。',
  '一列没有编号的火车驶入{loc}的货运站，卸下的不是货物，而是沉默。{org}的人封锁了整个站台。'
];

const MOOD_CLOSE = [
  '决策的时刻到了。无论你如何选择，{loc}的钟都不会为你停留。',
  '窗外的雨还在下。这个帝国的雨，似乎永远也下不完。',
  '一份决定命运的文件，正等待着你的签字。',
  '历史会记住这一刻——或者，根本没有人会记住。',
  '情报官的目光落在你身上，等待指示。',
  '电话线那头，沉默得可怕。',
  '你拿起笔，又放下。有些选择，比核按钮更沉重。',
  '档案被合上，但故事远未结束。',
  '走廊尽头的脚步声渐近，你必须在它们到达前做出决断。',
  '窗外的万国旗在风中翻卷，像无数只不眠的眼睛。'
];

const CHOICE_TEMPLATES = [
  { text: '彻查此事', desc: '派出盖世太保深入调查', e: { money: -8, stability: 1 }, t: '调查组已派出' },
  { text: '掩盖真相', desc: '封锁消息，保护高层', e: { stability: 3, money: -5 }, t: '消息已封锁' },
  { text: '冷处理', desc: '静观其变，不作回应', e: {}, t: '按兵不动' },
  { text: '严惩不贷', desc: '杀一儆百', e: { stability: 2, manpower: -2, money: -3 }, t: '惩处令已下达' },
  { text: '与{org}妥协', desc: '利益交换', e: { money: -15, stability: 4 }, t: '达成默契' },
  { text: '向{people}汇报', desc: '将烫手山芋上交', e: { stability: -2 }, t: '已上报' },
  { text: '动用{item}资源', desc: '以技术手段解决', e: { research: -3, money: -10, stability: 2 }, t: '技术介入' },
  { text: '牺牲{loc}的官员', desc: '找替罪羊', e: { stability: 3, manpower: -1 }, t: '替罪羊已就位' },
  { text: '扩大事态', desc: '借此清洗异己', e: { stability: -5, militaryPower: 2 }, t: '清洗开始' },
  { text: '寻求OFN介入', desc: '向美国暗中通报', e: { ofn_relation: 5, stability: -3 }, t: '情报已送出' },
  { text: '通报日本盟友', desc: '与共荣圈协调', e: { japan_relation: 4, money: -5 }, t: '已与东京沟通' },
  { text: '警告勃艮第', desc: '敲山震虎', e: { burgundy_relation: -8, stability: 2 }, t: '警告已发出' },
  { text: '安抚俄罗斯势力', desc: '释放善意', e: { russia_relation: 3, stability: -1 }, t: '释放善意' },
  { text: '联系三头同盟', desc: '与地中海势力商议', e: { italy_relation: 4 }, t: '已与罗马联络' },
  { text: '增加军费', desc: '以武力背书', e: { money: -20, militaryPower: 3, deterrence: 1 }, t: '军费追加' },
  { text: '削减预算', desc: '紧缩财政', e: { money: 15, stability: -2 }, t: '预算已削减' },
  { text: '加强宣传', desc: '戈培尔的遗产', e: { money: -6, stability: 2 }, t: '宣传攻势启动' },
  { text: '动用核威慑', desc: '亮出底牌', e: { nukeDeter: 2, stability: -4 }, t: '核威慑已动员' },
  { text: '人道处理', desc: '网开一面', e: { stability: 1, manpower: 2, money: -4 }, t: '宽大处理' },
  { text: '视而不见', desc: '装作什么都没发生', e: { stability: -1 }, t: '你什么都没看见' }
];

// 生成单个事件
function genEvent(id) {
  const loc = pick(LOCATIONS);
  const people = pick(PEOPLE);
  const org = pick(ORGS);
  const item = pick(ITEMS);
  const scene = pick(SCENES);

  const open = pick(MOOD_OPEN).replace(/\{loc\}/g, loc);
  const b1 = pick(MOOD_BODY)
    .replace(/\{loc\}/g, loc).replace(/\{people\}/g, people)
    .replace(/\{org\}/g, org).replace(/\{item\}/g, item).replace(/\{scene\}/g, scene);
  const b2 = pick(MOOD_BODY)
    .replace(/\{loc\}/g, pick(LOCATIONS)).replace(/\{people\}/g, pick(PEOPLE))
    .replace(/\{org\}/g, pick(ORGS)).replace(/\{item\}/g, pick(ITEMS)).replace(/\{scene\}/g, pick(SCENES));
  const close = pick(MOOD_CLOSE);

  const yearStart = ri(1962, 1995);
  const yearEnd = Math.min(2000, yearStart + ri(2, 8));

  // 生成 2-4 个选项
  const nChoices = ri(2, 4);
  const usedTexts = new Set();
  const choices = [];
  for (let i = 0; i < nChoices; i++) {
    let tpl;
    let tries = 0;
    do { tpl = pick(CHOICE_TEMPLATES); tries++; } while (usedTexts.has(tpl.text) && tries < 10);
    if (usedTexts.has(tpl.text)) continue;
    usedTexts.add(tpl.text);
    const text = tpl.text.replace(/\{org\}/g, org).replace(/\{people\}/g, people)
      .replace(/\{item\}/g, item).replace(/\{loc\}/g, loc);
    const desc = tpl.desc.replace(/\{org\}/g, org).replace(/\{people\}/g, people)
      .replace(/\{item\}/g, item).replace(/\{loc\}/g, loc);
    const toast = tpl.t;
    // 克隆 effects
    const e = Object.assign({}, tpl.e);
    choices.push({ text, desc, effects: e, showToast: toast });
  }
  if (choices.length < 2) {
    choices.push({ text: '冷处理', desc: '静观其变', effects: {}, showToast: '按兵不动' });
  }

  const title = `${loc}：${scene}`;

  const body = `<p>${open}</p><p>${b1}</p><p>${b2}</p><p>${close}</p>`;

  return {
    id: 'ev_gen_' + id,
    weight: ri(1, 4),
    minTurn: { year: yearStart },
    maxTurn: { year: yearEnd },
    once: false,
    tag: 'random',
    title: title,
    body: body,
    choices: choices
  };
}

function esc(s) { return String(s).replace(/\\/g,'\\\\').replace(/"/g,'\\"'); }

function eventToJs(ev) {
  const choicesStr = ev.choices.map(c => {
    const eStr = Object.keys(c.effects).length === 0 ? '{}' : JSON.stringify(c.effects);
    return `      { text: "${esc(c.text)}", desc: "${esc(c.desc)}", effects: ${eStr}, showToast: "${esc(c.showToast)}" }`;
  }).join(',\n');
  return `  {
    id: "${ev.id}",
    weight: ${ev.weight},
    minTurn: { year: ${ev.minTurn.year} },
    maxTurn: { year: ${ev.maxTurn.year} },
    once: false,
    tag: "${ev.tag}",
    title: "${esc(ev.title)}",
    body: \`${ev.body}\`,
    choices: [
${choicesStr}
    ]
  }`;
}

// ===== 主流程 =====
const TARGET_COUNT = 80000; // 约80000个事件，目标80MB+
const OUT = path.join(__dirname, '..', 'js', 'events_gen.js');

console.log('开始生成事件，目标数量：' + TARGET_COUNT);
const t0 = Date.now();

// 分批写入，避免内存峰值
const header = `/* ============================================================
 * 自动生成的 TNO 随机事件 - 由 tools/gen_events.js 生成
 * 请勿手动编辑。包含 ${TARGET_COUNT} 个 lore 丰富的随机事件。
 * ============================================================ */
'use strict';
const GENERATED_EVENTS = [
`;

const footer = `
];
if (typeof window !== 'undefined' && window.STORY_EVENTS) {
  window.STORY_EVENTS = window.STORY_EVENTS.concat(GENERATED_EVENTS);
}
`;

const BATCH = 2000;
const fd = fs.openSync(OUT, 'w');
fs.writeSync(fd, header);
let wrote = 0;
for (let batch = 0; batch < Math.ceil(TARGET_COUNT / BATCH); batch++) {
  const start = batch * BATCH;
  const end = Math.min(TARGET_COUNT, start + BATCH);
  const parts = [];
  for (let i = start; i < end; i++) {
    if (i > 0) parts.push(',');
    parts.push('\n' + eventToJs(genEvent(i + 1)));
  }
  fs.writeSync(fd, parts.join(''));
  wrote = end;
  const mb = (fs.statSync(OUT).size / 1024 / 1024).toFixed(1);
  console.log(`批次 ${batch + 1}: 已生成 ${wrote}/${TARGET_COUNT}，文件 ${mb} MB，用时 ${((Date.now()-t0)/1000).toFixed(1)}s`);
}
fs.writeSync(fd, footer);
fs.closeSync(fd);

const finalSize = fs.statSync(OUT).size;
console.log(`\n完成！`);
console.log(`生成事件数: ${wrote}`);
console.log(`文件大小: ${(finalSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`总用时: ${((Date.now()-t0)/1000).toFixed(1)}s`);
