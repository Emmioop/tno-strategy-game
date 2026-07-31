/* ============================================================
 * 千年帝国的最后一息 - 剧情事件链
 * 时间跨度 1962 - 2000
 * 基于 TNO (The New Order: Last Days of Europe) 架空世界观
 *
 * 声明：本游戏基于TNO架空世界观创作，纯属虚构历史推演。
 * 内容旨在探讨极权主义的后果与历史教训，绝无政治立场或意识形态宣传意图。
 * ============================================================ */

/*
 * 事件结构:
 * {
 *   id, turn{year,quarter}, once, tag(critical/major/minor),
 *   condition(state), title, body(HTML), choices[],
 *   onTrigger(state)
 * }
 * choice: { text, desc, effects{}, setFlags{}, condition, disabledReason,
 *           showToast, nextEventId }
 */

const STORY_EVENTS = [

  /* ===========================================================
   * 第一幕：诸神黄昏（1962）
   * =========================================================== */

  {
    id: 'ev_moon_landing',
    turn: { year: 1962, quarter: 1 },
    once: true,
    tag: 'critical',
    title: '帝国之巅',
    body: `<p>1962年1月9日。帝国宣称——<strong>德国宇航员第一个登上了月球</strong>。</p>
    <p>从佩内明德到月球，冯·布劳恩的火箭划过夜空，在莫斯科、华盛顿与东京的头顶留下耻辱的尾迹。日耳曼尼亚的庆典持续了整整一周，党卫军仪仗队踏过威廉大街，广场上的万人举起右臂，仿佛这一刻，帝国真的将永垂不朽。</p>
    <p>但在贝格霍夫，<em>那个老人</em>没有出席庆典。他的医生们进进出出，窗帘紧闭。元首的健康，是帝国不能谈论的秘密。</p>
    <p>而在庆典的喧嚣之下，四双眼睛正盯着同一张椅子——那张很快就会空出来的椅子。</p>`,
    choices: [
      {
        text: '这是帝国的荣光时刻',
        desc: '享受这最后的辉煌',
        effects: { stability: 6, money: 30, deterrence: 8 },
        showToast: '登月庆典振奋了帝国的士气'
      }
    ]
  },

  {
    id: 'ev_hitler_assassinated',
    turn: { year: 1962, quarter: 1 },
    once: true,
    tag: 'critical',
    title: '贝格霍夫的枪声',
    body: `<p>庆典的香槟还未喝完，噩耗便传来。</p>
    <p>一名<strong>伪装成日本外交官的刺客</strong>潜入了贝格霍夫，向元首连开两枪。党卫军当场击毙了刺客，但希特勒已倒在血泊之中。帝国宣传机器连夜运作，宣称这是日本宪兵队的阴谋；东京方面则矢口否认，反指这是德国自导自演的借口。</p>
    <p>元首没有死——但他也没有真正活着。他在病榻上苟延残喘，时而昏迷，时而清醒地咒骂着身边的人。整个帝国屏息以待，等待着那只悬在半空中的靴子最终落下。</p>
    <p>而那些秃鹫们，已经开始磨利爪子了。</p>`,
    choices: [
      {
        text: '加紧戒备，等待尘埃落定',
        desc: '稳定局势，但权力真空已然形成',
        effects: { stability: -8, deterrence: -5 },
        setFlags: { hitler_wounded: true, succession_crisis: true },
        showToast: '元首遇刺，帝国陷入恐慌'
      }
    ]
  },

  {
    id: 'ev_succession_announcement',
    turn: { year: 1962, quarter: 2 },
    once: true,
    tag: 'critical',
    title: '继承者',
    body: `<p>元首奇迹般地清醒了一周。他发表了全国讲话，颤抖的手指向了<strong>四个人</strong>——他将从中选择自己的继承人：</p>
    <p><em>阿尔伯特·施佩尔</em>，建筑师，改革派。他相信帝国可以不靠奴隶制存活。</p>
    <p><em>马丁·鲍曼</em>，党的秘书，保守派。他相信帝国就该这样腐朽下去，只要腐朽得够稳。</p>
    <p><em>赫尔曼·戈林</em>，帝国元帅，军国派。他相信轰炸机能解决一切问题——包括国内的。</p>
    <p><em>莱因哈德·海德里希</em>，布拉格屠夫，党卫军。没人知道他相信什么，但所有人都害怕。</p>
    <p>从这一刻起，四位候选人开始疯狂拉拢人心。国会成了马戏团，街头的学生与工人成了筹码。而你，作为权力核心的一员，必须选择站在哪一边。</p>
    <p><strong>这将决定帝国的命运。</strong></p>`,
    choices: [
      {
        text: '观望，先处理国内危机',
        desc: '暂不表态，专注稳定局势',
        effects: { stability: 3 },
        setFlags: { observing_succession: true },
        showToast: '你选择保持中立'
      }
    ]
  },

  {
    id: 'ev_student_protests_1962',
    turn: { year: 1962, quarter: 2 },
    once: true,
    tag: 'major',
    title: '街头的年轻人',
    body: `<p>他们从未工作过，从未服役过，从小在奴隶制带来的优越中长大——但奇怪的是，正是这一代人开始反抗。</p>
    <p>黑市上走私来的美国爵士乐、意大利电影、被禁的文学，让他们意识到：帝国之外还有一个世界，而那个世界比他们的更真实。从慕尼黑到汉堡，从日耳曼尼亚到维也纳，学生走上街头，高喊"<em>结束奴隶制</em>"、"<em>放弃东方总督辖区</em>"、"<em>给我们自由</em>"。</p>
    <p>党卫军建议镇压。施佩尔建议对话。鲍曼建议收编。戈林建议把他们送进兵营。</p>`,
    choices: [
      {
        text: '镇压抗议',
        desc: '党卫军上街清场。+稳定 -人力 -国际声誉',
        effects: { stability: 8, manpower: -10, ofn_relation: -5 },
        setFlags: { youth_suppressed: true }
      },
      {
        text: '收编学生领袖',
        desc: '将抗议纳入体制。温和但花钱',
        effects: { stability: 3, money: -40 },
        setFlags: { youth_coopted: true }
      },
      {
        text: '默认他们的存在',
        desc: '不作为。局势可能恶化',
        effects: { stability: -5 },
        setFlags: { youth_ignored: true }
      }
    ]
  },

  {
    id: 'ev_black_market',
    turn: { year: 1962, quarter: 3 },
    once: true,
    tag: 'major',
    title: '黑市帝国',
    body: `<p>帝国的官方经济早已死亡，真正运转的是<strong>黑市</strong>。</p>
    <p>从波兰奴隶走私的粮食，到法国抵抗组织伪造的马克；从美国走私的香烟，到东方军阀倒卖的军火——整个帝国的血管里流淌的不是马克，而是见不得光的交易。官员、军官、党卫军，人人都从中分一杯羹。</p>
    <p>财政部长报告：如果清理黑市，帝国经济将立即崩溃；如果放任不管，帝国将慢慢被掏空。这是一个没有好选项的选择题。</p>`,
    choices: [
      {
        text: '严厉打击黑市',
        desc: '短期损失资金，长期提升稳定',
        effects: { money: -60, stability: 4 },
        setFlags: { blackmarket_cracked: true }
      },
      {
        text: '将其纳入管制',
        desc: '灰色合法化。+资金 -稳定',
        effects: { money: 80, stability: -3 },
        setFlags: { blackmarket_regulated: true }
      },
      {
        text: '视而不见',
        desc: '继续放任',
        effects: { money: 30, stability: -2 }
      }
    ]
  },

  {
    id: 'ev_west_russia_remnants',
    turn: { year: 1962, quarter: 4 },
    once: true,
    tag: 'major',
    title: '东方废土的低语',
    body: `<p>西俄战争结束已五年，但东方总督辖区从未真正安宁。</p>
    <p>1955年，红军残部发起反攻，一度逼近莫斯科城郊。舍尔纳元帅的血腥防御最终拖垮了他们，但代价是整个东方边境的荒芜。如今，AA线（阿斯特拉罕-阿尔汉格尔斯克）以东是无尽的军阀混战，而线西的"专员辖区"里，游击队仍在活动。</p>
    <p>最新的情报显示，几个军阀正在秘密谈判，似乎有人想<strong>重新统一俄罗斯</strong>。如果这一天到来，帝国将面对一个复仇的巨人。</p>`,
    choices: [
      {
        text: '加强东方边境防御',
        desc: '+威慑 -资金',
        effects: { deterrence: 5, money: -50 },
        setFlags: { east_border_fortified: true }
      },
      {
        text: '资助亲德军阀',
        desc: '让俄国人打俄国人',
        effects: { money: -40, deterrence: 3, russia_relation: 10 },
        setFlags: { russia_proxies: true }
      },
      {
        text: '暂时忽略',
        desc: '等内战结束再说',
        effects: { stability: -2 }
      }
    ]
  },

  {
    id: 'ev_hitler_death',
    turn: { year: 1963, quarter: 3 },
    once: true,
    tag: 'critical',
    title: '恶魔之死',
    body: `<p>1963年10月。让整个世界遭受了三十年苦难的恶魔，<strong>像一个普通的老人一样死了</strong>。</p>
    <p>没有惊天动地的遗言，没有戏剧性的最后时刻。他在贝格霍夫的病床上停止了呼吸，护士发现时，窗外的阿尔卑斯山正下着雪。国丧持续了七日，半旗降下，钟声敲响。但钟声之下，是无数人松了一口气——以及无数人磨刀霍霍。</p>
    <p>四位候选人参加了葬礼，黑色制服，面无表情。葬礼结束后，他们立刻各自返回地盘，开始拉拢军队与官僚。国会大厦里的争吵持续了三周，没有任何结果。</p>
    <p>然后，<em>第一声枪响</em>，从日耳曼尼亚的街头传来。</p>`,
    choices: [
      {
        text: '帝国，分崩离析',
        desc: '内战已不可避免',
        effects: { stability: -20, deterrence: -10 },
        setFlags: { hitler_dead: true, civil_war_imminent: true },
        showToast: '元首驾崩。内战即将爆发。'
      }
    ]
  },

  /* ===========================================================
   * 第二幕：德国内战（1963-1965）
   * =========================================================== */

  {
    id: 'ev_choose_successor',
    turn: { year: 1963, quarter: 4 },
    once: true,
    tag: 'critical',
    title: '选择你的元首',
    body: `<p>内战爆发了。日耳曼尼亚的街头变成战场，党卫军与国防军互相射击，城市的灯火在炮火中熄灭。四位候选人各自建立了自己的势力范围：</p>
    <p><em>施佩尔</em>控制了西部工业区，得到部分改革派官僚与学生的支持。</p>
    <p><em>鲍曼</em>占据了柏林-勃兰登堡核心，掌握着党的机器与大部分官僚。</p>
    <p><em>戈林</em>获得了空军与部分国防军的支持，以巴伐利亚为基地。</p>
    <p><em>海德里希</em>的党卫军盘踞在东部，背后是希姆莱的阴影。</p>
    <p>而国防军元帅<em>汉斯·斯派达尔</em>与老帅<em>隆美尔</em>率领日耳曼尼亚卫戍部队控制了首都核心区，宣布中立——等待着一个胜者，或一个意外。</p>
    <p><strong>你必须选择效忠的对象。这将决定你领导的帝国的意识形态与未来三十八年的命运。</strong></p>`,
    choices: [
      {
        text: '效忠施佩尔（改革派）',
        desc: '渐进改革，挽救帝国于腐朽',
        effects: { stability: 5, research: 5 },
        setFlags: { chosen_path: 'speer', reformist: true },
        showToast: '你选择了改革路线'
      },
      {
        text: '效忠鲍曼（保守派）',
        desc: '维持现状，巩固权力',
        effects: { stability: 10, money: 80 },
        setFlags: { chosen_path: 'bormann', conservative: true },
        showToast: '你选择了保守路线'
      },
      {
        text: '效忠戈林（军国派）',
        desc: '以武力解决问题，对外扩张',
        effects: { deterrence: 15, militaryPower: 20, money: -50 },
        setFlags: { chosen_path: 'goring', militarist: true },
        showToast: '你选择了军国路线'
      },
      {
        text: '效忠海德里希（党卫军）',
        desc: '恐怖统治，与希姆莱结盟。代价是你的灵魂',
        effects: { deterrence: 20, stability: -15, ofn_relation: -20, japan_relation: -10 },
        setFlags: { chosen_path: 'heydrich', extremist: true, burgundy_ally: true },
        showToast: '你选择了黑暗之路',
        condition: (s) => !s.flags.burgundy_betrayed
      }
    ]
  },

  {
    id: 'ev_civil_war_battles',
    turn: { year: 1964, quarter: 1 },
    once: true,
    tag: 'critical',
    title: '兄弟相残',
    body: `<p>内战全面爆发。帝国的心脏沦为废墟，曾经并肩作战的将军们在不同的旗帜下互相屠杀。</p>
    <p>鲁尔区的工厂停转，汉堡港被封锁，慕尼黑在轰炸中燃烧。东方总督辖区趁机脱离控制，意大利与日本在一旁观望，美国的中情局则在暗中资助每一个反德势力。</p>
    <p>你的军队在前线苦战。物资短缺，士气低落，而敌人不止一个。</p>
    <p><strong>你需要做一个关键决策：如何赢得这场内战？</strong></p>`,
    choices: [
      {
        text: '全面动员，速战速决',
        desc: '倾尽资源决战。+军力 -资金 -人力',
        effects: { militaryPower: 25, money: -100, manpower: -20, stability: -5 },
        setFlags: { civil_war_strategy: 'blitz' }
      },
      {
        text: '稳扎稳打，蚕食对手',
        desc: '消耗战。缓慢但损失较小',
        effects: { militaryPower: 10, money: -50, stability: 3 },
        setFlags: { civil_war_strategy: 'attrition' }
      },
      {
        text: '寻求外国援助',
        desc: '向美国或日本求援。有效但伤国际地位',
        effects: { money: 80, militaryPower: 15, deterrence: -8 },
        setFlags: { civil_war_strategy: 'foreign_aid', foreign_intervention: true }
      }
    ]
  },

  {
    id: 'ev_civil_war_burgundy',
    turn: { year: 1964, quarter: 2 },
    once: true,
    tag: 'critical',
    title: '勃艮第的阴影',
    body: `<p>内战最混乱的时刻，一个幽灵从西方浮现。</p>
    <p><strong>希姆莱</strong>和他的勃艮第骑士团国，名义上是团结协定的一员，实际上早已脱离柏林控制。这个由前法国东部与低地组成的"国家"，是一个完全由党卫军管理的噩梦——更多的工作营而非房屋，任何反抗者直接消失。</p>
    <p>情报显示，勃艮第正在<strong>秘密窃取德国的核武器</strong>。希姆莱的野心早已超越德国本身——他梦想着一场"净化"世界的核子末日，让"纯洁"的SS在废墟上重建文明。</p>
    <p>在内战的混乱中，你必须决定如何应对这个最危险的邻居。</p>`,
    choices: [
      {
        text: '集中力量先打赢内战',
        desc: '暂时无视勃艮第。核武器可能流失',
        effects: { stability: 3 },
        setFlags: { burgundy_ignored: true, nukes_stolen: true },
        showToast: '勃艮第趁乱窃取了部分核武器'
      },
      {
        text: '派特工阻止核武器转移',
        desc: '冒险行动。成功则阻止核扩散',
        effects: { money: -40, stability: -3 },
        setFlags: { burgundy_sabotaged: true },
        showToast: '你的特工部分阻止了核武器转移'
      },
      {
        text: '与希姆莱谈判，换取支持',
        desc: '与魔鬼交易。+军力 但与勃艮德结盟',
        effects: { militaryPower: 20, stability: -8, ofn_relation: -15 },
        setFlags: { burgundy_deal: true, burgundy_ally: true },
        condition: (s) => s.flags.chosen_path === 'heydrich' || s.flags.chosen_path === 'goring'
      }
    ]
  },

  {
    id: 'ev_civil_war_climax',
    turn: { year: 1964, quarter: 4 },
    once: true,
    tag: 'critical',
    title: '日耳曼尼亚之战',
    body: `<p>内战的决定性时刻到来。各派军队汇聚日耳曼尼亚城下，这座希特勒用奴隶血汗建成的世界之都，即将见证新元首的诞生。</p>
    <p>斯派达尔元帅的中立卫戍部队最终撑不住了——他必须选择一方，或者自己出来收拾残局。隆美尔元帅年迈体衰，但他的威望仍能号召一部分国防军。</p>
    <p>城市的每一栋建筑都成了战场，人民大会堂的穹顶在炮火中震颤。这一战的胜负，将决定谁坐在那张椅子上。</p>`,
    choices: [
      {
        text: '亲自指挥决战',
        desc: '身先士卒。高风险高回报',
        effects: { militaryPower: 15, stability: 8, manpower: -10 },
        setFlags: { civil_war_hero: true }
      },
      {
        text: '委托将军们指挥',
        desc: '专业的事交给专业的人',
        effects: { militaryPower: 10, money: -30 },
        setFlags: { generals_trusted: true }
      },
      {
        text: '策反敌方将领',
        desc: '用金钱与承诺瓦解对手',
        effects: { money: -80, militaryPower: 8, stability: 5 },
        setFlags: { defections_engineered: true }
      }
    ]
  },

  {
    id: 'ev_civil_war_end',
    turn: { year: 1965, quarter: 2 },
    once: true,
    tag: 'critical',
    title: '新元首',
    body: `<p>1965年春。内战结束了。</p>
    <p>历时一年半的厮杀，让帝国损失了<em>数百万人口</em>，工业倒退十年，国际地位一落千丈。但终于，有一个人坐上了那张椅子——你支持的那个人。</p>
    <p>败者或死或逃：海德里希的党卫军残部遁入勃艮第；戈林的尸体被发现于上萨尔茨堡的废墟（亦有传言他逃往瑞典）；施佩尔与鲍曼的命运则取决于谁获胜。</p>
    <p>斯派达尔元帅交还了日耳曼尼亚的控制权，他只想回到兵营。但新元首知道，真正的战争才刚刚开始——重建一个比战前更虚弱、更分裂、更被世界敌视的帝国。</p>
    <p><strong>1965年。新秩序的第一年。距离2000年，还有35年。</strong></p>`,
    choices: [
      {
        text: '开始重建帝国',
        desc: '内战结束，进入新时代',
        effects: { stability: 15, money: 50 },
        setFlags: { civil_war_over: true, reconstruction: true },
        showToast: '内战结束。重建开始。'
      }
    ],
    onTrigger: (s) => {
      // 根据路线应用不同加成
      const path = s.flags.chosen_path;
      if (path && SUCCESSION_PATHS[path]) {
        const bonuses = SUCCESSION_PATHS[path].bonuses;
        for (const k in bonuses) {
          s.resources[k] = (s.resources[k] || 0) + bonuses[k];
        }
        s.leader = SUCCESSION_PATHS[path];
      }
    }
  },

  /* ===========================================================
   * 第三幕：重建与改革（1965-1972）
   * =========================================================== */

  {
    id: 'ev_reconstruction_plan',
    turn: { year: 1965, quarter: 3 },
    once: true,
    tag: 'major',
    title: '废墟上的蓝图',
    body: `<p>内战留下的废墟需要清理，而新的蓝图需要绘制。</p>
    <p>帝国的工业产能下降了40%，东方总督辖区半数失控，国库空虚，人心惶惶。新元首召集了经济会议，要求提出重建方案。</p>
    <p>施佩尔派主张<strong>现代化改革</strong>——削减军费，发展民用工业，引入市场机制。鲍曼派主张<strong>恢复旧制</strong>——加强奴隶制，重振重工业，用铁腕稳定。戈林派残余主张<strong>以战养战</strong>——通过对外掠夺填补亏空。</p>`,
    choices: [
      {
        text: '推动现代化重建',
        desc: '+民产 +研发 -军力。需改革派',
        effects: { money: 40, research: 8, militaryPower: -5, stability: 5 },
        setFlags: { modern_reconstruction: true, economic_reform_1: true },
        condition: (s) => s.flags.reformist || s.flags.conservative
      },
      {
        text: '恢复传统奴隶经济',
        desc: '+资金 +稳定 -人力',
        effects: { money: 60, stability: 8, manpower: -15 },
        setFlags: { slave_reconstruction: true }
      },
      {
        text: '军工优先重建',
        desc: '+军力 +威慑 -资金。需军国派',
        effects: { militaryPower: 20, deterrence: 10, money: -60 },
        setFlags: { military_reconstruction: true },
        condition: (s) => s.flags.militarist || s.flags.extremist
      }
    ]
  },

  {
    id: 'ev_slave_question',
    turn: { year: 1966, quarter: 1 },
    once: true,
    tag: 'major',
    title: '奴隶的枷锁',
    body: `<p>数百万东方奴隶支撑着帝国的工业——这是公开的秘密，也是无法回避的伤口。</p>
    <p>内战期间，许多奴隶趁机起义或逃亡，东方总督辖区的种植园与矿场损失惨重。如今，新政权必须决定：是重新套上枷锁，还是松开它？</p>
    <p>改革派警告：奴隶制让帝国在道德与技术上停滞，长此以往必亡。保守派反驳：没有奴隶，帝国经济立刻崩溃，连军饷都发不出。</p>`,
    choices: [
      {
        text: '维持并加强奴隶制',
        desc: '+资金 -稳定 -人力',
        effects: { money: 50, stability: -5, manpower: -10 },
        setFlags: { slavery_maintained: true }
      },
      {
        text: '改善奴隶待遇',
        desc: '缓和矛盾。-资金 +稳定',
        effects: { money: -30, stability: 6 },
        setFlags: { slavery_reformed: true, slave_reform_1: true },
        condition: (s) => s.flags.reformist
      },
      {
        text: '渐进解放计划',
        desc: '10年内分批解放。巨大风险',
        effects: { stability: -10, money: -50, ofn_relation: 15 },
        setFlags: { emancipation_started: true, slave_reform_1: true },
        condition: (s) => s.flags.reformist
      },
      {
        text: '更严酷的镇压',
        desc: '杀一儆百。+资金 -稳定 -国际声誉',
        effects: { money: 40, stability: -8, ofn_relation: -10 },
        setFlags: { slavery_brutal: true },
        condition: (s) => s.flags.militarist || s.flags.extremist
      }
    ]
  },

  {
    id: 'ev_ofn_diplomacy_1967',
    turn: { year: 1967, quarter: 2 },
    once: true,
    tag: 'major',
    title: '华盛顿的试探',
    body: `<p>内战后的美国，正经历着自己的政治风暴。</p>
    <p>1964年大选后，共和民主党与国家进步党（NPP）的斗争白热化。美国注意到德国内战后的虚弱，华盛顿开始试探：是否可能与新德国缓和关系，集中精力应对日本共荣圈？</p>
    <p>中情局送来了一份非官方备忘录：如果德国愿意在奴隶制与核武器上做出姿态，美国可以承认新政权，甚至提供经济援助。</p>
    <p>这是一个机会，也是一个陷阱——与"自由世界"握手，意味着背叛帝国的意识形态根基。</p>`,
    choices: [
      {
        text: '积极回应，寻求缓和',
        desc: '+美国关系 +资金 -威慑',
        effects: { ofn_relation: 20, money: 60, deterrence: -5 },
        setFlags: { ofn_detente: true, detente_started: true },
        condition: (s) => s.flags.reformist || s.flags.conservative
      },
      {
        text: '冷淡回应，保持距离',
        desc: '维持现状',
        effects: { ofn_relation: 5 }
      },
      {
        text: '拒绝并公开羞辱',
        desc: '+威慑 -美国关系',
        effects: { deterrence: 8, ofn_relation: -15 },
        setFlags: { ofn_humiliated: true },
        condition: (s) => s.flags.militarist || s.flags.extremist
      }
    ]
  },

  {
    id: 'ev_japan_sphere_1968',
    turn: { year: 1968, quarter: 1 },
    once: true,
    tag: 'major',
    title: '日出之国的邀请',
    body: `<p>日本帝国也注意到了德国的变化。</p>
    <p>共荣圈在60年代后期相对稳定，但内部矛盾丛生：中国的反抗从未停歇，东南亚的资源掠夺引发人道灾难，而东京的军部与文官政府明争暗斗。日本希望与德国重建某种"轴心"，共同对抗美国。</p>
    <p>但德国与日本在亚太利益上有根本冲突——谁控制太平洋？谁主导中国？这些问题没有答案。日本的邀请，更像是一份陷阱密布的盟约。</p>`,
    choices: [
      {
        text: '重建轴心同盟',
        desc: '+日本关系 +威慑 -美国关系',
        effects: { japan_relation: 20, deterrence: 8, ofn_relation: -10 },
        setFlags: { axis_revived: true }
      },
      {
        text: '签订有限互不侵犯条约',
        desc: '温和合作',
        effects: { japan_relation: 10 }
      },
      {
        text: '拒绝，转向对抗',
        desc: '+美国关系 -日本关系',
        effects: { japan_relation: -15, ofn_relation: 8 },
        setFlags: { japan_rivalry: true }
      }
    ]
  },

  {
    id: 'ev_italy_triumvirate',
    turn: { year: 1969, quarter: 2 },
    once: true,
    tag: 'major',
    title: '三头同盟的裂痕',
    body: `<p>意大利、伊比利亚联盟、土耳其组成的"三头同盟"，是德国在欧洲南翼的对手。</p>
    <p>齐亚诺的意大利试图在德、美、日之间走钢丝；弗朗哥的伊比利亚联盟苟延残喘；土耳其则在泛突厥主义的迷梦中挣扎。如今，三头同盟内部矛盾激化——伊比利亚的老独裁者将死，土耳其的军方蠢蠢欲动，意大利想摆脱德国阴影却又怕被吞掉。</p>
    <p>这是一个拉拢南欧、巩固欧洲霸权的良机——或者，把它推向美国的怀抱。</p>`,
    choices: [
      {
        text: '武力威胁，迫使臣服',
        desc: '+威慑 -意大利关系',
        effects: { deterrence: 10, italy_relation: -15 },
        setFlags: { italy_threatened: true },
        condition: (s) => s.flags.militarist
      },
      {
        text: '外交拉拢，经济渗透',
        desc: '+意大利关系 -资金',
        effects: { italy_relation: 15, money: -50 },
        setFlags: { italy_courted: true }
      },
      {
        text: '放任其崩溃，分而治之',
        desc: '+威慑 -稳定',
        effects: { deterrence: 5, stability: -5 },
        setFlags: { italy_abandoned: true }
      }
    ]
  },

  {
    id: 'ev_economic_miracle_1970',
    turn: { year: 1970, quarter: 3 },
    once: true,
    tag: 'major',
    title: '工业复兴',
    body: `<p>内战五年后，帝国的工业终于开始复苏。</p>
    <p>鲁尔区的烟囱重新冒烟，莱茵河上的驳船恢复航运，东方总督辖区的奴隶（或自由工人，取决于你的政策）重新填满工厂。施佩尔的现代化方案（如果你选择了它）开始见效：合成橡胶、新型合金、早期的晶体管——帝国似乎在追赶那个被它抛弃的世界。</p>
    <p>但财政部的报告也警告：增长依赖投资，投资依赖借贷，而帝国的信用正在透支。这是一个虚假的繁荣，还是真正的复兴？</p>`,
    choices: [
      {
        text: '加大民用投资',
        desc: '+资金 +稳定 -军力',
        effects: { money: 80, stability: 8, militaryPower: -5 },
        setFlags: { civilian_boom: true }
      },
      {
        text: '均衡发展',
        desc: '各方面小幅提升',
        effects: { money: 40, stability: 4, deterrence: 3 }
      },
      {
        text: '军工扩张',
        desc: '+军力 +威慑 -资金',
        effects: { militaryPower: 15, deterrence: 8, money: -50 },
        setFlags: { military_boom: true }
      }
    ]
  },

  {
    id: 'ev_russia_reunification_threat',
    turn: { year: 1971, quarter: 2 },
    once: true,
    tag: 'critical',
    title: '红色幽灵的归来',
    body: `<p>东方废土上，一个名字开始让柏林胆寒。</p>
    <p>经过十五年的军阀混战，<strong>西俄罗斯革命阵线</strong>在朱可夫元帅（如果他活着）或其继承人的领导下，正在统一俄罗斯。AA线以东的军阀一个接一个被吞并，一个复仇的巨人正在苏醒。</p>
    <p>情报显示，统一后的俄罗斯可能拥有数百万军队、核武器（从勃艮第或内战流失的），以及对德国<em>刻骨的仇恨</em>。第二次西俄战争，似乎只是时间问题。</p>
    <p>帝国必须准备。但如何准备？</p>`,
    choices: [
      {
        text: '先发制人，发动预防性战争',
        desc: '趁其未统一先打。+军力 -稳定 -国际声誉',
        effects: { militaryPower: 20, deterrence: 15, stability: -15, ofn_relation: -10 },
        setFlags: { preventive_war: true, russia_relation: -30 }
      },
      {
        text: '加强东方防线',
        desc: '巩固防御。+威慑 -资金',
        effects: { deterrence: 12, money: -80, militaryPower: 8 },
        setFlags: { eastern_wall: true }
      },
      {
        text: '外交谈判，承认俄罗斯',
        desc: '+俄罗斯关系 -威慑',
        effects: { russia_relation: 20, deterrence: -8, stability: 5 },
        setFlags: { russia_recognized: true },
        condition: (s) => s.flags.reformist
      },
      {
        text: '资助俄罗斯内部反对派',
        desc: '破坏其统一。-资金',
        effects: { money: -60, russia_relation: -15, stability: 2 },
        setFlags: { russia_sabotage: true }
      }
    ]
  },

  /* ===========================================================
   * 第四幕：冷战高潮（1972-1985）
   * =========================================================== */

  {
    id: 'ev_nuclear_arms_race',
    turn: { year: 1972, quarter: 3 },
    once: true,
    tag: 'critical',
    title: '核子达摩克利斯',
    body: `<p>1972年，世界站在核火山的边缘。</p>
    <p>德国、美国、日本都在疯狂扩充核武库。勃艮第的希姆莱——如果他还没死——手中也有从德国窃取的核武器。每一枚洲际导弹都是悬在文明头顶的剑。</p>
    <p>你的参谋部提交了核战略方案：<strong>第一次打击</strong>（在敌人核力量成熟前摧毁之）、<strong>相互确保毁灭</strong>（建立足够的二次打击能力）、<strong>有限核扩散</strong>（让盟友也拥有核武，分担风险）。</p>
    <p>每一种选择都可能拯救帝国，也可能毁灭世界。</p>`,
    choices: [
      {
        text: '扩充核武库，确保毁灭',
        desc: '+核威慑 -资金 -稳定',
        effects: { nukeDeter: 20, nukes: 5, money: -100, stability: -5 },
        setFlags: { mad_doctrine: true, nuclear_tech: true }
      },
      {
        text: '研发导弹防御系统',
        desc: '+研发 +威慑 -资金',
        effects: { research: 10, deterrence: 10, money: -80 },
        setFlags: { missile_defense: true, advanced_tech: true }
      },
      {
        text: '寻求核军控谈判',
        desc: '+国际声誉 -核威慑',
        effects: { ofn_relation: 15, japan_relation: 10, nukeDeter: -8 },
        setFlags: { arms_control: true },
        condition: (s) => s.flags.reformist || s.flags.detente_started
      }
    ]
  },

  {
    id: 'ev_burgundian_crisis',
    turn: { year: 1973, quarter: 2 },
    once: true,
    tag: 'critical',
    title: '黑太阳的威胁',
    body: `<p>勃艮第的威胁，终于到了无法忽视的地步。</p>
    <p>情报机关破获了一起惊天阴谋：希姆莱的SS特工已经渗透进德国的核指挥链，他们计划在某个"合适"的时机，<strong>同时向三大国发射核武器</strong>，引发全面核战争，让"纯洁"的勃艮第在废墟上统治世界。</p>
    <p>这是希姆莱的"末日计划"——他相信，只有核火才能"净化"被污染的人类。</p>
    <p>你必须行动。但要如何对付一个拥有核武器、毫无底线、且渗透了你政府的敌人？</p>`,
    choices: [
      {
        text: '联合美国与日本，先发制人',
        desc: '三极联手铲除勃艮第。+国际关系 -资金',
        effects: { ofn_relation: 25, japan_relation: 20, money: -100, deterrence: -5 },
        setFlags: { burgundian_war: true, burgundian_threat: true, three_way_alliance: true },
        showToast: '三极世界罕见地站在了同一阵线'
      },
      {
        text: '单独发动闪电战',
        desc: '+威慑 -国际声誉 -稳定',
        effects: { deterrence: 15, stability: -10, ofn_relation: -10, money: -80 },
        setFlags: { burgundian_war: true, solo_strike: true, burgundian_threat: true }
      },
      {
        text: '内部颠覆，刺杀希姆莱',
        desc: '派特工暗杀。高风险',
        effects: { money: -50, stability: -3 },
        setFlags: { himmler_assassination: true, burgundian_threat: true },
        showToast: '刺杀行动已启动'
      },
      {
        text: '与希姆莱达成协议',
        desc: '黑暗交易。+威慑 -灵魂',
        effects: { deterrence: 10, stability: -15, ofn_relation: -20 },
        setFlags: { burgundy_deal: true, burgundy_ally: true },
        condition: (s) => s.flags.extremist || s.flags.burgundy_ally
      }
    ]
  },

  {
    id: 'ev_burgundian_war_result',
    turn: { year: 1973, quarter: 4 },
    once: true,
    tag: 'critical',
    title: '勃艮第的覆灭',
    body: `<p>战争——或阴谋——结束了勃艮第的噩梦。</p>
    <p>希姆莱死于非命（具体细节因你选择而异），他的SS国家在内外夹击下崩溃。东巴黎的集中营被打开，幸存者走出地狱，世界第一次看到了"勃艮第体系"的全貌——其恐怖程度超出了所有人的想象。</p>
    <p>勃艮第的领土被瓜分：法国收复东部，低地重获独立，德国收回了部分核武器。但希姆莱的核武库中，<em>有几枚至今下落不明</em>——它们可能落入了任何人的手中。</p>
    <p>世界松了一口气，但恐惧并未消散。一个能诞生希姆莱的世界，随时可能再诞生一个。</p>`,
    choices: [
      {
        text: '协助建立国际核监管',
        desc: '+国际声誉 +美国关系',
        effects: { ofn_relation: 15, japan_relation: 10, stability: 8 },
        setFlags: { nuclear_watchdog: true },
        condition: (s) => s.flags.three_way_alliance || s.flags.arms_control
      },
      {
        text: '独占勃艮第遗产',
        desc: '+核威慑 -国际关系',
        effects: { nukeDeter: 15, nukes: 3, ofn_relation: -15 },
        setFlags: { burgundy_annexed: true }
      },
      {
        text: '让法国与低地自治',
        desc: '+稳定 +国际声誉',
        effects: { stability: 10, ofn_relation: 12 },
        setFlags: { burgundy_freed: true }
      }
    ],
    condition: (s) => s.flags.burgundian_war || s.flags.himmler_assassination
  },

  {
    id: 'ev_us_civil_unrest',
    turn: { year: 1974, quarter: 1 },
    once: true,
    tag: 'major',
    title: '美洲的动荡',
    body: `<p>大洋彼岸，美国正经历着自己的危机。</p>
    <p>NPP的极端派系——无论是左翼的还是右翼的——在1960年代末崛起，将美国政治推向悬崖。1972年大选引发宪政危机，1973-74年间，美国可能陷入<strong>第二次内战</strong>：太平洋各州、新英格兰、南方各派系互相敌对。</p>
    <p>这对德国意味着什么？一个分裂的美国无法威胁德国，但一个混乱的美国也可能让核武器失控——或让某个疯狂的派系按下按钮。</p>
    <p>你将如何应对这个机会与危险并存的局面？</p>`,
    choices: [
      {
        text: '资助亲德派系',
        desc: '干涉美国内政。+威慑 -美国关系',
        effects: { deterrence: 5, ofn_relation: -20, money: -40 },
        setFlags: { us_intervention: true }
      },
      {
        text: '保持中立，专注自身',
        desc: '不介入',
        effects: { stability: 3 }
      },
      {
        text: '秘密提供人道援助',
        desc: '+美国关系 -资金',
        effects: { ofn_relation: 10, money: -30 },
        setFlags: { us_aid: true },
        condition: (s) => s.flags.reformist
      }
    ]
  },

  {
    id: 'ev_oil_crisis_1975',
    turn: { year: 1975, quarter: 3 },
    once: true,
    tag: 'major',
    title: '能源危机',
    body: `<p>中东的动荡波及全球。</p>
    <p>无论是因为美国的内乱、日本对东南亚的掠夺、还是德国在非洲的代理人战争，石油供应出现了严重中断。帝国虽然控制着罗马尼亚油田与合成燃料工业，但仍受到冲击：物价飞涨，工厂减产，黑市再次猖獗。</p>
    <p>能源，成了新的战略资源。谁掌握能源，谁就掌握未来。</p>`,
    choices: [
      {
        text: '扩张合成燃料工业',
        desc: '+资金 -研发投入',
        effects: { money: 40, research: -5, stability: 3 },
        setFlags: { synthetic_fuel: true }
      },
      {
        text: '研发核能',
        desc: '+研发 +长期收益 -资金',
        effects: { research: 15, money: -80, stability: 2 },
        setFlags: { nuclear_energy: true, nuclear_tech: true }
      },
      {
        text: '军事控制中东油田',
        desc: '+资金 +威慑 -国际声誉',
        effects: { money: 60, deterrence: 8, ofn_relation: -15, japan_relation: -10 },
        setFlags: { middle_east_intervention: true },
        condition: (s) => s.flags.militarist
      }
    ]
  },

  {
    id: 'ev_computer_revolution',
    turn: { year: 1977, quarter: 2 },
    once: true,
    tag: 'major',
    title: '硅与火',
    body: `<p>一场静悄悄的革命正在发生。</p>
    <p>在美国（如果它还统一）与日本，<strong>计算机技术</strong>正以惊人速度发展。晶体管变成集成电路，集成电路变成微处理器。信息的处理与传递方式被彻底颠覆。</p>
    <p>帝国的科研机构落后了。施佩尔（如果他还活着）警告：如果德国错过这场革命，将在一代人内被彻底甩开。但保守派斥之为"犹太人的伪科学"，海德里希的残余则担心计算机会让"思想控制"变得更难。</p>
    <p>这是一个十字路口。</p>`,
    choices: [
      {
        text: '全力投入计算机革命',
        desc: '+研发 +长期收益 -资金',
        effects: { research: 20, money: -100, stability: 3 },
        setFlags: { computer_revolution: true, electronics: true, advanced_tech: true }
      },
      {
        text: '有限的军用计算机研发',
        desc: '+军力 +研发 -资金',
        effects: { militaryPower: 10, research: 8, money: -50 },
        setFlags: { military_computers: true }
      },
      {
        text: '抵制"堕落科技"',
        desc: '+稳定 -研发 -长期',
        effects: { stability: 5, research: -10 },
        setFlags: { tech_rejected: true },
        condition: (s) => s.flags.extremist || s.flags.conservative
      }
    ]
  },

  {
    id: 'ev_space_race_2',
    turn: { year: 1979, quarter: 3 },
    once: true,
    tag: 'major',
    title: '星辰大海',
    body: `<p>登月十七年后，太空竞赛进入新阶段。</p>
    <p>美国宣布"火星计划"，日本部署了军事空间站，俄罗斯（如果统一）也开始追赶。帝国虽是第一个登月的国家，但航天预算在内战中被大幅削减，如今只剩下一个勉力维持的月球基地。</p>
    <p>太空，不再只是荣耀的象征——它是新的战略高地。轨道武器、侦察卫星、轨道核弹，谁能控制太空，谁就控制地球。</p>`,
    choices: [
      {
        text: '重启登月与火星计划',
        desc: '+威慑 +研发 -巨额资金',
        effects: { deterrence: 10, research: 15, money: -120, stability: 5 },
        setFlags: { mars_program: true, rocketry: true }
      },
      {
        text: '发展军事太空力量',
        desc: '+威慑 +军力 -资金',
        effects: { deterrence: 15, militaryPower: 10, money: -90 },
        setFlags: { military_space: true, rocketry: true }
      },
      {
        text: '放弃太空，专注地球',
        desc: '+资金 -威慑',
        effects: { money: 50, deterrence: -8 },
        setFlags: { space_abandoned: true }
      }
    ]
  },

  {
    id: 'ev_russia_unified',
    turn: { year: 1980, quarter: 2 },
    once: true,
    tag: 'critical',
    title: '巨熊苏醒',
    body: `<p>东方的噩耗终于成真——<strong>俄罗斯重新统一了</strong>。</p>
    <p>无论是朱可夫的红军、还是某个军阀、还是某种意想不到的民主联盟，一个横跨欧亚的新巨人站在了AA线的那一侧。它拥有数亿人口、无尽的资源、核武器，以及对德国<em>三十年的仇恨</em>。</p>
    <p>统一后的俄罗斯立刻向德国发出照会：归还被占领土，否则战争。帝国的东方总督辖区成了火药桶，第二次西俄战争的阴云笼罩。</p>
    <p>这是帝国生死存亡的时刻。</p>`,
    choices: [
      {
        text: '强硬回应，准备战争',
        desc: '+威慑 -稳定 -资金',
        effects: { deterrence: 20, stability: -10, money: -80, militaryPower: 15 },
        setFlags: { russia_war_preparing: true }
      },
      {
        text: '谈判，部分让步',
        desc: '+俄罗斯关系 -威慑 -稳定',
        effects: { russia_relation: 25, deterrence: -15, stability: -8 },
        setFlags: { russia_negotiation: true },
        condition: (s) => s.flags.reformist
      },
      {
        text: '联合美国遏制俄罗斯',
        desc: '+美国关系 -俄罗斯关系',
        effects: { ofn_relation: 20, russia_relation: -20, deterrence: 10 },
        setFlags: { russia_containment: true }
      },
      {
        text: '先发制人核打击',
        desc: '极端选项。+威慑 -一切',
        effects: { nukeDeter: 30, stability: -25, ofn_relation: -30, japan_relation: -20 },
        setFlags: { nuclear_first_strike: true },
        condition: (s) => s.flags.militarist || s.flags.extremist
      }
    ]
  },

  {
    id: 'ev_economic_bubble_1982',
    turn: { year: 1982, quarter: 2 },
    once: true,
    tag: 'major',
    title: '繁荣的泡沫',
    body: `<p>70年代末的"经济奇迹"露出了真面目——一个巨大的泡沫。</p>
    <p>帝国靠借贷维持繁荣，靠军费注入虚假需求，靠奴隶（或廉价劳动力）压低成本。如今，账单到了。通货膨胀、工厂倒闭、马克贬值，中产阶级一夜返贫。</p>
    <p>财政部提出三个方案：紧缩（牺牲民众）、加税（牺牲富人）、印钞（牺牲未来）。没有一个是好的。</p>`,
    choices: [
      {
        text: '紧缩政策',
        desc: '-稳定 +资金',
        effects: { stability: -12, money: 80 },
        setFlags: { austerity: true }
      },
      {
        text: '向富人与军头加税',
        desc: '+资金 -军力',
        effects: { money: 60, militaryPower: -8, stability: 3 },
        setFlags: { wealth_tax: true }
      },
      {
        text: '印钞救急',
        desc: '+资金 -稳定 -长期',
        effects: { money: 100, stability: -15 },
        setFlags: { hyperinflation: true }
      },
      {
        text: '结构性改革',
        desc: '+研发 +长期 -资金',
        effects: { research: 12, money: -50, stability: 5 },
        setFlags: { structural_reform: true },
        condition: (s) => s.flags.reformist
      }
    ]
  },

  /* ===========================================================
   * 第五幕：黄昏（1985-2000）
   * =========================================================== */

  {
    id: 'ev_internet_era',
    turn: { year: 1985, quarter: 3 },
    once: true,
    tag: 'major',
    title: '网络的诞生',
    body: `<p>如果帝国追上了计算机革命，那么1985年，它将面对一个全新的怪物：<strong>互联网</strong>。</p>
    <p>信息的自由流动，是极权体制的天敌。当任何人都能与任何人交流，当任何真相都能绕过审查传播，帝国的宣传机器将面临前所未有的挑战。</p>
    <p>美国的"阿帕网"已经连接了数千个节点；日本的"共荣网络"覆盖了亚洲；帝国的"日耳曼网"则被设计成一个封闭的、受监控的内部网络。但防火墙能挡住思想的洪水吗？</p>`,
    choices: [
      {
        text: '建立严密的网络防火墙',
        desc: '+稳定 -研发 -长期',
        effects: { stability: 8, research: -8 },
        setFlags: { internet_firewall: true }
      },
      {
        text: '开放网络，拥抱信息时代',
        desc: '+研发 +资金 -稳定',
        effects: { research: 20, money: 60, stability: -10 },
        setFlags: { internet_open: true },
        condition: (s) => s.flags.computer_revolution && s.flags.reformist
      },
      {
        text: '军用网络，民用禁入',
        desc: '+军力 +研发 -稳定',
        effects: { militaryPower: 12, research: 8, stability: -5 },
        setFlags: { internet_military: true },
        condition: (s) => s.flags.computer_revolution
      }
    ],
    condition: (s) => s.flags.computer_revolution || s.flags.military_computers
  },

  {
    id: 'ev_environmental_crisis',
    turn: { year: 1987, quarter: 2 },
    once: true,
    tag: 'major',
    title: '燃烧的地球',
    body: `<p>帝国的工业奇迹，正在杀死帝国本身。</p>
    <p>鲁尔区的酸雨腐蚀了莱茵河畔的森林，东方总督辖区的奴隶矿场毒化了地下水，亚特兰特罗帕计划抽干地中海后留下的盐碱地成了不毛之地。科学家（如果他们还能发声）警告：气候变化正在加速，沿海城市可能在未来几十年被淹没。</p>
    <p>但环保意味着减产，减产意味着动荡。帝国负担不起"绿色"，但也负担不起"灰色"。</p>`,
    choices: [
      {
        text: '推行环保法规',
        desc: '+稳定 -资金 +研发',
        effects: { stability: 5, money: -60, research: 8 },
        setFlags: { environmental_reform: true }
      },
      {
        text: '无视环境，继续发展',
        desc: '+资金 -稳定 -长期',
        effects: { money: 70, stability: -8 },
        setFlags: { environment_ignored: true }
      },
      {
        text: '研发清洁能源',
        desc: '+研发 +长期 -资金',
        effects: { research: 15, money: -80, stability: 3 },
        setFlags: { clean_energy: true, nuclear_energy: true }
      }
    ]
  },

  {
    id: 'ev_third_world_war_crisis',
    turn: { year: 1989, quarter: 3 },
    once: true,
    tag: 'critical',
    title: '午夜差一分',
    body: `<p>1989年秋。世界距离核毁灭，只差一个按钮。</p>
    <p>起因因地而异：可能是俄罗斯收复失地的战争升级，可能是中日太平洋冲突外溢，可能是勃艮第残党的核恐怖袭击，也可能是某个醉酒军官的误判。无论如何，三大国的核导弹已进入战备状态，<strong>末日时钟指向23:59</strong>。</p>
    <p>作为帝国的决策者，你手中的核按钮，将决定人类文明的存亡。</p>
    <p>这是你一生中最漫长的几分钟。</p>`,
    choices: [
      {
        text: '冷静斡旋，避免战争',
        desc: '+国际声誉 +稳定 -威慑',
        effects: { ofn_relation: 20, japan_relation: 15, russia_relation: 15, stability: 15, deterrence: -10 },
        setFlags: { ww3_averted: true, peace_maker: true },
        showToast: '你拯救了世界——这一次'
      },
      {
        text: '保持威慑，静观其变',
        desc: '+威慑 -稳定',
        effects: { deterrence: 15, stability: -10 },
        setFlags: { ww3_brinkmanship: true }
      },
      {
        text: '按下按钮',
        desc: '核子末日。游戏结束',
        effects: {},
        setFlags: { nuclear_holocaust: true },
        showToast: '你按下了那个按钮'
      }
    ]
  },

  {
    id: 'ev_decolonization_wave',
    turn: { year: 1990, quarter: 2 },
    once: true,
    tag: 'major',
    title: '殖民地的黄昏',
    body: `<p>帝国的殖民体系，正在崩解。</p>
    <p>非洲的"中央非洲"专员辖区早已是混乱的代名词；东方总督辖区的奴隶不断逃亡；即便是最忠诚的荷兰、丹麦、挪威傀儡政权，也开始出现要求"自治"的声音。</p>
    <p>帝国的国库已经无法维持全球霸权。放手，意味着衰落；紧握，意味着被拖垮。</p>`,
    choices: [
      {
        text: '允许殖民地自治/独立',
        desc: '+稳定 +国际声誉 -威慑',
        effects: { stability: 10, ofn_relation: 15, deterrence: -10, money: 30 },
        setFlags: { decolonization: true },
        condition: (s) => s.flags.reformist
      },
      {
        text: '改革为联邦制',
        desc: '+稳定 -资金',
        effects: { stability: 8, money: -50 },
        setFlags: { federation_reform: true }
      },
      {
        text: '武力镇压独立运动',
        desc: '+威慑 -稳定 -国际声誉',
        effects: { deterrence: 8, stability: -12, ofn_relation: -15, money: -40 },
        setFlags: { colonial_repression: true },
        condition: (s) => s.flags.militarist || s.flags.extremist
      }
    ]
  },

  {
    id: 'ev_demographic_winter',
    turn: { year: 1992, quarter: 3 },
    once: true,
    tag: 'major',
    title: '人口寒冬',
    body: `<p>帝国的青年，正在消失。</p>
    <p>战争、内战、奴隶制的后遗症、经济的动荡、环境的恶化——几十年的累积让帝国的生育率跌至谷底。学校关闭，工厂招不到工人，兵营空空荡荡。与此同时，俄罗斯、美国、日本的人口仍在增长。</p>
    <p>帝国正在变老，而它的敌人正在变年轻。这是一个缓慢的、不可逆的衰亡。</p>`,
    choices: [
      {
        text: '推行鼓励生育政策',
        desc: '+人力 -资金',
        effects: { manpower: 20, money: -70, stability: 3 },
        setFlags: { pro_natalist: true }
      },
      {
        text: '引入移民劳动力',
        desc: '+人力 -稳定',
        effects: { manpower: 25, stability: -8 },
        setFlags: { immigration_policy: true },
        condition: (s) => s.flags.reformist || s.flags.decolonization
      },
      {
        text: '自动化替代人力',
        desc: '+研发 +资金 -稳定',
        effects: { research: 15, money: 40, stability: -5 },
        setFlags: { automation: true },
        condition: (s) => s.flags.computer_revolution
      }
    ]
  },

  {
    id: 'ev_millennium_anxiety',
    turn: { year: 1995, quarter: 4 },
    once: true,
    tag: 'major',
    title: '千禧年的阴影',
    body: `<p>2000年临近，帝国上下弥漫着一种奇怪的情绪。</p>
    <p>有人恐惧"千年虫"会让帝国的计算机系统崩溃（如果有的话）；有人期待"千年帝国"的预言终于成真；有人在地下修建避难所；有人在街头布道末日。帝国走过了三十三年，从内战的废墟中活了下来，但它还能再活五年吗？</p>
    <p>新元首（或老元首，如果他活得够久）必须为帝国的最后一个五年定调。</p>`,
    choices: [
      {
        text: '盛大庆典，彰显国威',
        desc: '+稳定 -资金 +威慑',
        effects: { stability: 12, money: -80, deterrence: 8 },
        setFlags: { millennium_celebration: true }
      },
      {
        text: '低调务实，专注内政',
        desc: '+资金 +研发',
        effects: { money: 50, research: 10 }
      },
      {
        text: '宗教复兴运动',
        desc: '+稳定 -研发',
        effects: { stability: 10, research: -5 },
        setFlags: { religious_revival: true },
        condition: (s) => s.flags.extremist || s.flags.conservative
      }
    ]
  },

  {
    id: 'ev_final_five_years',
    turn: { year: 1996, quarter: 1 },
    once: true,
    tag: 'critical',
    title: '最后的五年',
    body: `<p>1996年。距离2000年，只剩四年。</p>
    <p>帝国走过了希特勒之死、内战、勃艮第危机、核危机、能源危机、计算机革命、环境危机——它居然还活着。但这"活着"是什么样子？取决于你这三十四年的每一个选择。</p>
    <p>最后四年，你将为帝国定下终章。是让它继续作为三极之一存续？是让它融入新的世界秩序？是让它在火焰中结束？还是让它在沉睡中消亡？</p>
    <p><strong>千年帝国的最后一息，由你来呼出。</strong></p>`,
    choices: [
      {
        text: '迎接新时代',
        desc: '为终局做准备',
        effects: { stability: 8 },
        setFlags: { final_act: true },
        showToast: '终局倒计时开始'
      }
    ]
  },

  /* ===========================================================
   * 随机事件（可在多个回合触发）
   * =========================================================== */

  {
    id: 'rnd_industrial_accident',
    once: false,
    weight: 8,
    minTurn: { year: 1965 },
    tag: 'minor',
    title: '工厂事故',
    body: `<p>鲁尔区的一座兵工厂发生爆炸，数十名工人（或奴隶）死亡，生产线停摆。</p>`,
    choices: [
      { text: '拨款善后', desc: '-资金 +稳定', effects: { money: -30, stability: 3 } },
      { text: '淡化处理', desc: '-稳定', effects: { stability: -4 } }
    ]
  },

  {
    id: 'rnd_scientist_defects',
    once: false,
    weight: 6,
    minTurn: { year: 1966 },
    tag: 'minor',
    title: '科学家出逃',
    body: `<p>一名帝国核物理学家试图经瑞士逃往美国，被边防截获。他声称"无法再忍受帝国的窒息"。</p>`,
    choices: [
      { text: '处决以儆效尤', desc: '-研发 +威慑', effects: { research: -3, deterrence: 2 } },
      { text: '说服他留下', desc: '+研发 -资金', effects: { research: 5, money: -20 } },
      { text: '放他走', desc: '+美国关系 -威慑', effects: { ofn_relation: 8, deterrence: -3 }, condition: (s) => s.flags.reformist }
    ]
  },

  {
    id: 'rnd_slave_revolt',
    once: false,
    weight: 7,
    minTurn: { year: 1965 },
    maxTurn: { year: 1990 },
    tag: 'major',
    title: '奴隶起义',
    body: `<p>东方总督辖区的一处矿场爆发奴隶起义，守卫被杀，奴隶控制了整个矿区。</p>`,
    choices: [
      { text: '血腥镇压', desc: '+资金 -稳定 -人力', effects: { money: 20, stability: -5, manpower: -10 } },
      { text: '谈判安抚', desc: '-资金 +稳定', effects: { money: -30, stability: 4 } },
      { text: '派遣党卫军', desc: '+威慑 -稳定', effects: { deterrence: 3, stability: -3 } }
    ]
  },

  {
    id: 'rnd_diplomatic_breakthrough',
    once: false,
    weight: 5,
    minTurn: { year: 1970 },
    tag: 'minor',
    title: '外交突破',
    body: `<p>一次非正式的多边会谈上，帝国外交官与美国代表达成了意外的共识。</p>`,
    choices: [
      { text: '深化对话', desc: '+美国关系', effects: { ofn_relation: 12 } },
      { text: '保持距离', desc: '无变化', effects: {} }
    ]
  },

  {
    id: 'rnd_economic_boom',
    once: false,
    weight: 6,
    minTurn: { year: 1970 },
    tag: 'minor',
    title: '经济利好',
    body: `<p>一项新的合成材料专利为帝国带来了意外的出口订单。</p>`,
    choices: [
      { text: '投入再生产', desc: '+资金', effects: { money: 60 } },
      { text: '投入研发', desc: '+研发', effects: { research: 8 } }
    ]
  },

  {
    id: 'rnd_youth_subculture',
    once: false,
    weight: 7,
    minTurn: { year: 1968 },
    tag: 'minor',
    title: '亚文化浪潮',
    body: `<p>一种融合了美国爵士、意大利电影与帝国叛逆元素的新亚文化在年轻人中流行，党卫军称之为"堕落"。</p>`,
    choices: [
      { text: '查禁', desc: '+稳定 -人力', effects: { stability: 4, manpower: -5 } },
      { text: '收编为官方文化', desc: '+稳定 -资金', effects: { stability: 3, money: -20 } },
      { text: '放任', desc: '-稳定 +研发', effects: { stability: -3, research: 4 } }
    ]
  },

  {
    id: 'rnd_burgundy_remnant',
    once: false,
    weight: 5,
    minTurn: { year: 1975 },
    tag: 'major',
    title: '勃艮第残党',
    body: `<p>情报机关发现，仍有勃艮第SS残党在地下活动，他们可能掌握着部分失落的核武器。</p>`,
    choices: [
      { text: '全面追捕', desc: '-资金 +稳定', effects: { money: -40, stability: 5 } },
      { text: '与国际合作', desc: '+美国关系 -资金', effects: { ofn_relation: 10, money: -20 } },
      { text: '忽视', desc: '-稳定', effects: { stability: -3 } }
    ]
  },

  {
    id: 'rnd_natural_disaster',
    once: false,
    weight: 6,
    minTurn: { year: 1965 },
    tag: 'minor',
    title: '自然灾害',
    body: `<p>莱茵河泛滥，多个城市受灾，损失惨重。</p>`,
    choices: [
      { text: '全力救灾', desc: '-资金 +稳定', effects: { money: -50, stability: 5 } },
      { text: '有限救援', desc: '-稳定', effects: { stability: -4 } }
    ]
  },

  {
    id: 'rnd_military_scandal',
    once: false,
    weight: 6,
    minTurn: { year: 1968 },
    tag: 'minor',
    title: '军方丑闻',
    body: `<p>一名国防军将军被曝长期挪用军费，私生活奢靡。</p>`,
    choices: [
      { text: '严惩', desc: '+稳定 -军力', effects: { stability: 4, militaryPower: -3 } },
      { text: '掩盖', desc: '-稳定', effects: { stability: -3 } },
      { text: '让其"意外"死亡', desc: '+威慑 -稳定', effects: { deterrence: 2, stability: -2 } }
    ]
  },

  {
    id: 'rnd_research_breakthrough',
    once: false,
    weight: 5,
    minTurn: { year: 1975 },
    tag: 'minor',
    title: '科研突破',
    body: `<p>帝国科学家在材料科学领域取得突破，新型合金可显著提升军工品质。</p>`,
    choices: [
      { text: '投入军用', desc: '+军力 +威慑', effects: { militaryPower: 8, deterrence: 4 } },
      { text: '投入民用', desc: '+资金 +稳定', effects: { money: 50, stability: 3 } },
      { text: '保密储备', desc: '+研发', effects: { research: 10 } }
    ]
  },

  /* ===========================================================
   * 俄罗斯分裂与统一事件链
   * =========================================================== */

  {
    id: 'ev_russia_warlords_1968',
    turn: { year: 1968, quarter: 3 },
    once: true,
    tag: 'critical',
    title: '群雄逐鹿',
    body: `<p>1968年，东方废土上的军阀混战进入新阶段。</p>
    <p>西俄罗斯革命阵线（朱可夫）、科米共和国、乌拉尔军阀、西伯利亚黑军、远东的各路势力——每一方都梦想着重新统一俄罗斯。情报机关报告，几个军阀正在秘密谈判结盟，一个统一的俄罗斯可能在未来十年内出现。</p>
    <p>但最令人不安的是：没有人知道谁会赢。可能是民主派，可能是共产党，甚至可能是某种疯子。</p>`,
    choices: [
      {
        text: '派遣间谍渗透各派系',
        desc: '-资金 获取情报',
        effects: { money: -40, russia_relation: -5 },
        setFlags: { russia_infiltrated: true }
      },
      {
        text: '资助亲德军阀',
        desc: '让俄国人打俄国人',
        effects: { money: -60, deterrence: 5, russia_relation: -15 },
        setFlags: { russia_proxies: true }
      },
      {
        text: '加强东方防线',
        desc: '+威慑 -资金',
        effects: { deterrence: 8, money: -70, militaryPower: 5 },
        setFlags: { eastern_wall: true }
      },
      {
        text: '忽略，专注内政',
        desc: '等内战结束再说',
        effects: { stability: -3 }
      }
    ]
  },

  {
    id: 'ev_russia_unification_type',
    turn: { year: 1972, quarter: 1 },
    once: true,
    tag: 'critical',
    title: '东方的曙光——或暗夜',
    body: `<p>经过十年的混战，一个军阀开始在俄罗斯脱颖而出。</p>
    <p>情报来源纷乱而矛盾：有人说是一个民主派物理学家，有人说是一个共产党的老元帅，有人甚至说是一个为"失踪皇子"摄政的狂信徒。但所有人都同意一件事——<strong>俄罗斯即将统一</strong>。</p>
    <p>帝国的命运，取决于东方是谁统一了俄罗斯。而此刻，你什么都做不了，只能等待。</p>`,
    choices: [
      {
        text: '等待命运的宣判',
        desc: '随机决定俄罗斯统一者',
        effects: { stability: -5 },
        showToast: '俄罗斯的统一者即将揭晓'
      }
    ],
    onTrigger: (s) => {
      const types = ['democratic', 'communist', 'fascist', 'madman', 'monarchist'];
      s.flags.russia_unifier = types[Math.floor(Math.random() * types.length)];
    }
  },

  {
    id: 'ev_russia_democratic_unified',
    turn: { year: 1972, quarter: 2 },
    once: true,
    tag: 'critical',
    title: '新俄罗斯的曙光',
    body: `<p>萨哈罗夫——一个物理学家出身的理想主义者——统一了俄罗斯。</p>
    <p>他建立了一个民主共和国，承诺改革与开放。新俄罗斯向帝国伸出了橄榄枝，愿意以和平谈判解决领土争端。这不是最好的结局，但绝对不是最坏的。</p>
    <p>然而，一个民主的、强大的俄罗斯，本身就是对帝国意识形态的最大威胁——它的存在证明了，没有奴隶制、没有极权，也能建立强国。</p>`,
    choices: [
      {
        text: '积极回应，建立外交关系',
        desc: '+俄罗斯关系 +稳定 -威慑',
        effects: { russia_relation: 30, stability: 8, deterrence: -8 },
        setFlags: { russia_democratic: true, russia_peace: true }
      },
      {
        text: '谨慎接触',
        desc: '+俄罗斯关系微 -研发',
        effects: { russia_relation: 10, research: -3 },
        setFlags: { russia_cautious: true }
      },
      {
        text: '保持警惕，加强军备',
        desc: '+威慑 -俄罗斯关系',
        effects: { deterrence: 10, russia_relation: -10, militaryPower: 5 },
        setFlags: { russia_suspicious: true }
      }
    ],
    condition: (s) => s.flags.russia_unifier === 'democratic'
  },

  {
    id: 'ev_russia_communist_unified',
    turn: { year: 1972, quarter: 2 },
    once: true,
    tag: 'critical',
    title: '红色巨熊的归来',
    body: `<p>朱可夫元帅——或他的继承者——以铁拳统一了俄罗斯。</p>
    <p>新苏联的红旗再次飘扬在莫斯科上空。红军的坦克轰鸣着开向西方边境，三十年前的仇恨从未消散。这个统一的俄罗斯拥有数亿人口、无尽的资源、以及核武器。</p>
    <p>帝国面对的不再是分散的军阀，而是一个复仇的巨人。第二次西俄战争，似乎只是时间问题。</p>`,
    choices: [
      {
        text: '全面备战',
        desc: '+军力 +威慑 -资金 -稳定',
        effects: { militaryPower: 20, deterrence: 15, money: -80, stability: -8 },
        setFlags: { russia_communist: true, russia_war_preparing: true }
      },
      {
        text: '寻求外交缓和',
        desc: '+俄罗斯关系 -威慑 -稳定',
        effects: { russia_relation: 20, deterrence: -10, stability: -5 },
        setFlags: { russia_detente: true }
      },
      {
        text: '联合美国遏制红色威胁',
        desc: '+美国关系 -俄罗斯关系 +威慑',
        effects: { ofn_relation: 20, russia_relation: -25, deterrence: 10 },
        setFlags: { russia_containment: true }
      }
    ],
    condition: (s) => s.flags.russia_unifier === 'communist'
  },

  {
    id: 'ev_russia_fascist_unified',
    turn: { year: 1972, quarter: 2 },
    once: true,
    tag: 'critical',
    title: '黑色俄罗斯的崛起',
    body: `<p>奥克坦——一个前合作者、法西斯狂热者——统一了俄罗斯。</p>
    <p>他的"俄罗斯民族国"建立在前德国盟友和纯粹的暴力之上。这个俄罗斯对德国怀有复杂的感情：既模仿又仇恨，既想结盟又想复仇。它比苏联更危险，因为它不受任何意识形态束缚——它只有赤裸裸的权力欲望。</p>
    <p>更可怕的是，这个法西斯俄罗斯可能拥有从勃艮第或内战中流失的核武器。</p>`,
    choices: [
      {
        text: '结盟，共同对抗美国',
        desc: '+俄罗斯关系 +威慑 -美国关系 -稳定',
        effects: { russia_relation: 15, deterrence: 10, ofn_relation: -20, stability: -8 },
        setFlags: { russia_fascist: true, russia_alliance: true }
      },
      {
        text: '先发制人打击',
        desc: '+军力 -稳定 -资金 -国际声誉',
        effects: { militaryPower: 15, stability: -15, money: -60, ofn_relation: -15 },
        setFlags: { russia_preemptive: true }
      },
      {
        text: '加强防御，静观其变',
        desc: '+威慑 -资金',
        effects: { deterrence: 12, money: -50, stability: 3 },
        setFlags: { russia_fascist: true }
      }
    ],
    condition: (s) => s.flags.russia_unifier === 'fascist'
  },

  {
    id: 'ev_russia_madman_unified',
    turn: { year: 1972, quarter: 2 },
    once: true,
    tag: 'critical',
    title: '摄政的疯狂',
    body: `<p>塔博里茨基——一个为"失踪"的沙皇皇子摄政的狂信徒——统一了俄罗斯。</p>
    <p>他相信阿列克谢皇子仍然活着，终将归来。在等待皇子的过程中，他用核火和死亡"净化"一切不洁。这不是一个国家，这是一个末日教派——一个拥有核武器的末日教派。</p>
    <p>情报显示，塔博里茨基的俄罗斯正在崩溃。但在崩溃之前，他可能拉着整个世界一起毁灭。</p>`,
    choices: [
      {
        text: '紧急备战',
        desc: '+军力 +威慑 -稳定 -资金',
        effects: { militaryPower: 25, deterrence: 20, stability: -12, money: -70 },
        setFlags: { russia_madman: true }
      },
      {
        text: '试图与疯子谈判',
        desc: '-稳定 -资金 可能无效',
        effects: { stability: -8, money: -30 },
        setFlags: { russia_madman: true, russia_negotiation: true }
      },
      {
        text: '封锁边境，静待其崩溃',
        desc: '+威慑 -资金 -稳定',
        effects: { deterrence: 8, money: -50, stability: -5 },
        setFlags: { russia_madman: true, russia_quarantine: true }
      },
      {
        text: '联合世界，暗杀塔博里茨基',
        desc: '-资金 高风险',
        effects: { money: -80, ofn_relation: 15, stability: -3 },
        setFlags: { russia_madman: true, tabi_assassination: true },
        showToast: '暗杀行动已启动——这是拯救世界的最后手段'
      }
    ],
    condition: (s) => s.flags.russia_unifier === 'madman'
  },

  {
    id: 'ev_russia_monarchist_unified',
    turn: { year: 1972, quarter: 2 },
    once: true,
    tag: 'critical',
    title: '双头鹰的重生',
    body: `<p>赤塔的罗曼诺夫家族——弗拉基米尔大公的继承者——统一了俄罗斯，恢复了沙皇制度。</p>
    <p>这个新帝国既不像苏联那样仇恨德国，也不像民主俄罗斯那样友好。它是一个骄傲的、古老的、充满复仇欲望的帝国。沙皇要求归还所有被占领的俄罗斯领土——包括东方总督辖区。</p>
    <p>两个帝国面对面站着：一个宣称千年，一个已经重生。</p>`,
    choices: [
      {
        text: '承认沙皇政权',
        desc: '+俄罗斯关系 -威慑',
        effects: { russia_relation: 15, deterrence: -5 },
        setFlags: { russia_monarchist: true, russia_recognized: true }
      },
      {
        text: '拒绝承认',
        desc: '-俄罗斯关系 +威慑 +稳定',
        effects: { russia_relation: -15, deterrence: 8, stability: 5 },
        setFlags: { russia_monarchist: true }
      },
      {
        text: '提出君主制同盟',
        desc: '+俄罗斯关系 -美国关系 +威慑',
        effects: { russia_relation: 20, ofn_relation: -15, deterrence: 5 },
        setFlags: { russia_monarchist: true, monarchist_alliance: true }
      }
    ],
    condition: (s) => s.flags.russia_unifier === 'monarchist'
  },

  {
    id: 'ev_second_west_russian_war',
    turn: { year: 1981, quarter: 2 },
    once: true,
    tag: 'critical',
    title: '第二次西俄战争',
    body: `<p>统一的俄罗斯向帝国发出了最后通牒：归还被占领的东方总督辖区领土，否则战争。</p>
    <p>无论统一者是民主派还是共产党，是法西斯还是沙皇——他们都要求同一件事：俄罗斯的领土完整。红军/俄军的集结在AA线东侧展开，帝国东方边境硝烟弥漫。</p>
    <p>这是帝国生死存亡的时刻。三十年前，帝国在第一次西俄战争中险胜。这一次，对手更强大，而帝国更虚弱。</p>`,
    choices: [
      {
        text: '全面战争，寸土不让',
        desc: '+军力 +威慑 -稳定 -资金 -人力',
        effects: { militaryPower: 25, deterrence: 15, stability: -15, money: -100, manpower: -20 },
        setFlags: { west_russian_war: true, total_war: true }
      },
      {
        text: '部分让步，避免全面战争',
        desc: '+俄罗斯关系 -威慑 -稳定 -资金',
        effects: { russia_relation: 15, deterrence: -12, stability: -8, money: -50 },
        setFlags: { west_russian_war: true, partial_concession: true }
      },
      {
        text: '核威慑，逼退俄罗斯',
        desc: '+核威慑 -稳定 -资金 -国际声誉',
        effects: { nukeDeter: 25, stability: -10, money: -60, ofn_relation: -10 },
        setFlags: { west_russian_war: true, nuclear_brinkmanship: true }
      },
      {
        text: '归还领土，求和',
        desc: '+俄罗斯关系 -威慑 -稳定',
        effects: { russia_relation: 30, deterrence: -20, stability: -12, money: -30 },
        setFlags: { west_russian_war: true, territory_returned: true },
        condition: (s) => s.flags.reformist || s.flags.russia_detente
      }
    ],
    condition: (s) => s.flags.russia_democratic || s.flags.russia_communist ||
                     s.flags.russia_fascist || s.flags.russia_madman || s.flags.russia_monarchist
  },

  /* ===========================================================
   * 欧洲事件链
   * =========================================================== */

  {
    id: 'ev_iberian_crisis',
    turn: { year: 1969, quarter: 1 },
    once: true,
    tag: 'major',
    title: '伊比利亚的黄昏',
    body: `<p>弗朗哥老了。西班牙-葡萄牙联盟（伊比利亚）这个不自然的婚姻正在瓦解。</p>
    <p>葡萄牙的萨拉查独撑残局，西班牙的王子们蠢蠢欲动，军方暗中密谋。三头同盟的南翼正在崩溃，而意大利对此无能为力。</p>
    <p>伊比利亚的崩溃将改变南欧的力量平衡——是机会，还是灾难？</p>`,
    choices: [
      {
        text: '支持伊比利亚维持统一',
        desc: '+意大利关系 -资金 +稳定',
        effects: { italy_relation: 10, money: -40, stability: 4 },
        setFlags: { iberia_supported: true }
      },
      {
        text: '暗中支持葡萄牙独立',
        desc: '+意大利关系 -稳定',
        effects: { italy_relation: 5, stability: -3 },
        setFlags: { portugal_backed: true }
      },
      {
        text: '趁机吞并直布罗陀',
        desc: '+威慑 -意大利关系 -稳定',
        effects: { deterrence: 8, italy_relation: -10, stability: -4 },
        setFlags: { gibraltar_seized: true }
      }
    ]
  },

  {
    id: 'ev_iberian_collapse',
    turn: { year: 1971, quarter: 3 },
    once: true,
    tag: 'major',
    title: '伊比利亚的崩溃',
    body: `<p>弗朗哥死了。伊比利亚联盟在一夜之间分崩离析。</p>
    <p>西班牙陷入内战——保皇派、军方、共和派残余互相厮杀。葡萄牙宣布独立，萨拉查独撑残局。三头同盟失去了南翼，意大利不得不独自面对德国的压力。</p>
    <p>南欧的地图正在被重新绘制，而帝国有机会在这场混乱中渔利。</p>`,
    choices: [
      {
        text: '干预西班牙内战',
        desc: '+威慑 -资金 -稳定 -意大利关系',
        effects: { deterrence: 10, money: -60, stability: -5, italy_relation: -10 },
        setFlags: { spain_intervention: true }
      },
      {
        text: '支持葡萄牙独立',
        desc: '+意大利关系 -资金',
        effects: { italy_relation: 12, money: -30 },
        setFlags: { portugal_independent: true }
      },
      {
        text: '放任不管',
        desc: '+稳定 -意大利关系',
        effects: { stability: 3, italy_relation: -8 }
      }
    ]
  },

  {
    id: 'ev_french_resistance',
    turn: { year: 1970, quarter: 2 },
    once: true,
    tag: 'major',
    title: '法兰西的幽灵',
    body: `<p>法国——被德国肢解、被勃艮第恐怖统治的国家——从未真正屈服。</p>
    <p>地下抵抗组织"自由法国"在废墟中重建，他们的口号穿越了三十年：liberté, égalité, fraternité。从巴黎的地下印刷所到布列塔尼的森林，从马赛的码头到里昂的工厂，法国人在用一切方式反抗。</p>
    <p>情报显示，自由法国正在与美国的情报机构合作，获得资金与武器。帝国的西翼正在被掏空。</p>`,
    choices: [
      {
        text: '全面镇压抵抗运动',
        desc: '+稳定 -资金 -美国关系',
        effects: { stability: 6, money: -40, ofn_relation: -10 },
        setFlags: { french_resistance_crushed: true }
      },
      {
        text: '与抵抗组织秘密谈判',
        desc: '+美国关系 -稳定 -资金',
        effects: { ofn_relation: 15, stability: -4, money: -30 },
        setFlags: { french_negotiation: true },
        condition: (s) => s.flags.reformist
      },
      {
        text: '忽视，专注于其他事务',
        desc: '-稳定',
        effects: { stability: -4 }
      }
    ]
  },

  {
    id: 'ev_british_resistance',
    turn: { year: 1973, quarter: 1 },
    once: true,
    tag: 'major',
    title: '不列颠的怒火',
    body: `<p>英格兰合作国——德国的傀儡——的统治下，英国抵抗运动从未停止。</p>
    <p>从苏格兰高地到威尔士山谷，从伦敦地下到乡村的酒馆，"不列颠自由军"在进行游击战。他们炸毁铁路，暗杀合作者，散发传单。帝国驻英部队疲于奔命，而英国人的仇恨只会越来越深。</p>
    <p>华盛顿的电台每天向不列颠广播："坚持下去，解放终将到来。"</p>`,
    choices: [
      {
        text: '增援驻英部队',
        desc: '+威慑 -资金 -人力',
        effects: { deterrence: 8, money: -50, manpower: -10 },
        setFlags: { britain_reinforced: true }
      },
      {
        text: '与抵抗组织谈判',
        desc: '+美国关系 -稳定',
        effects: { ofn_relation: 12, stability: -5 },
        setFlags: { britain_negotiation: true },
        condition: (s) => s.flags.reformist
      },
      {
        text: '撤退部分驻军，减少损失',
        desc: '-威慑 +资金 +人力',
        effects: { deterrence: -10, money: 30, manpower: 8 },
        setFlags: { britain_withdrawn: true }
      }
    ]
  },

  {
    id: 'ev_italy_leaves_sphere',
    turn: { year: 1975, quarter: 2 },
    once: true,
    tag: 'major',
    title: '意大利的背叛',
    body: `<p>三头同盟崩溃后，意大利终于摆脱了德国的阴影。</p>
    <p>齐亚诺（或其继承者）宣布意大利退出德国势力范围，转向美国寻求安全保障。这是帝国在南欧的重大挫败——意大利的倒戈意味着地中海不再是帝国的内湖。</p>
    <p>更糟糕的是，意大利的背叛可能引发连锁反应：土耳其、匈牙利、罗马尼亚都可能效仿。</p>`,
    choices: [
      {
        text: '武力威胁，迫使其回头',
        desc: '+威慑 -意大利关系 -稳定 -资金',
        effects: { deterrence: 12, italy_relation: -20, stability: -6, money: -40 },
        setFlags: { italy_threatened: true }
      },
      {
        text: '经济制裁',
        desc: '+威慑 -意大利关系 -资金',
        effects: { deterrence: 5, italy_relation: -12, money: -30 },
        setFlags: { italy_sanctioned: true }
      },
      {
        text: '接受现实，维持贸易',
        desc: '+稳定 -威慑',
        effects: { stability: 5, deterrence: -8 },
        setFlags: { italy_accepted: true }
      }
    ],
    condition: (s) => s.flags.iberian_collapse || s.flags.italy_abandoned || s.flags.italy_threatened || s.flags.spain_intervention
  },

  {
    id: 'ev_turkey_revolt',
    turn: { year: 1974, quarter: 3 },
    once: true,
    tag: 'major',
    title: '土耳其的怒火',
    body: `<p>土耳其军方发动政变，推翻了亲德政府。</p>
    <p>新政权的军官们宣称要恢复"泛突厥主义"荣光，将目光投向中亚和高加索——那片德国东方总督辖区的软腹。土耳其退出三头同盟，转向与俄罗斯（如果统一）和美国同时示好。</p>
    <p>帝国在高加索的油田和巴库的输油管，突然变得不安全了。</p>`,
    choices: [
      {
        text: '支持政变政府，换取石油利益',
        desc: '+威慑 -资金 -稳定',
        effects: { deterrence: 5, money: -40, stability: -3 },
        setFlags: { turkey_junta: true }
      },
      {
        text: '支持流亡政府复辟',
        desc: '+资金 -威慑 -稳定',
        effects: { money: 30, deterrence: -5, stability: -5 },
        setFlags: { turkey_restoration: true }
      },
      {
        text: '忽视，专注东方',
        desc: '-威慑 -稳定',
        effects: { deterrence: -5, stability: -3 }
      }
    ]
  },

  /* ===========================================================
   * 更多随机事件
   * =========================================================== */

  {
    id: 'rnd_russian_refugees',
    once: false,
    weight: 5,
    minTurn: { year: 1970 },
    tag: 'major',
    title: '俄罗斯难民潮',
    body: `<p>俄罗斯统一战争的难民涌入帝国东方边境。数十万人饥寒交迫，帝国边境城镇不堪重负。</p>`,
    choices: [
      { text: '接纳难民', desc: '+人力 -稳定 -资金', effects: { manpower: 15, stability: -5, money: -30 } },
      { text: '驱逐难民', desc: '+稳定 -美国关系 -人力', effects: { stability: 4, ofn_relation: -8, manpower: -5 } },
      { text: '建立难民营', desc: '-资金 +稳定微', effects: { money: -40, stability: 2 } }
    ]
  },

  {
    id: 'rnd_economic_sanctions',
    once: false,
    weight: 4,
    minTurn: { year: 1972 },
    tag: 'major',
    title: '国际制裁',
    body: `<p>美国主导的国际联盟对帝国实施经济制裁，限制高科技出口与金融交易。帝国的对外贸易受到严重冲击。</p>`,
    choices: [
      { text: '反制裁', desc: '+威慑 -资金 -美国关系', effects: { deterrence: 5, money: -50, ofn_relation: -10 } },
      { text: '寻求日本斡旋', desc: '+日本关系 -资金', effects: { japan_relation: 10, money: -30 } },
      { text: '忍受制裁', desc: '-资金 -研发', effects: { money: -40, research: -5 } }
    ]
  },

  {
    id: 'rnd_plague_outbreak',
    once: false,
    weight: 3,
    minTurn: { year: 1980 },
    tag: 'major',
    title: '瘟疫',
    body: `<p>一种新型流感在东方总督辖区爆发，正在向帝国核心蔓延。奴隶聚居区的卫生条件让疫情雪上加霜。</p>`,
    choices: [
      { text: '全面封锁疫区', desc: '+稳定 -资金 -人力', effects: { stability: 4, money: -50, manpower: -10 } },
      { text: '研发疫苗', desc: '+研发 -资金', effects: { research: 10, money: -40 } },
      { text: '忽视疫情', desc: '-稳定 -人力', effects: { stability: -8, manpower: -15 } }
    ]
  },

  {
    id: 'rnd_assassination_attempt',
    once: false,
    weight: 4,
    minTurn: { year: 1970 },
    tag: 'major',
    title: '暗杀阴谋',
    body: `<p>安全机关破获了一起针对元首的暗杀阴谋。刺客是国防军内部的反对派军官，他们认为帝国正在走向毁灭。</p>`,
    choices: [
      { text: '大清洗', desc: '+威慑 -稳定 -军力', effects: { deterrence: 6, stability: -8, militaryPower: -10 } },
      { text: '秘密处决', desc: '+威慑 -稳定', effects: { deterrence: 3, stability: -3 } },
      { text: '公开审判', desc: '+稳定 -威慑', effects: { stability: 5, deterrence: -3 } }
    ]
  },

  {
    id: 'rnd_spain_refugees',
    once: false,
    weight: 3,
    minTurn: { year: 1972 },
    tag: 'minor',
    title: '西班牙难民',
    body: `<p>伊比利亚内战的难民涌入法国和低地国家，帝国不得不面对新一轮的人道危机。</p>`,
    choices: [
      { text: '接纳', desc: '+人力 -稳定 -资金', effects: { manpower: 8, stability: -3, money: -20 } },
      { text: '封锁边境', desc: '+稳定 -资金 -美国关系', effects: { stability: 3, money: -15, ofn_relation: -5 } }
    ]
  },

  {
    id: 'rnd_civil_unrest',
    once: false,
    weight: 6,
    minTurn: { year: 1975 },
    tag: 'major',
    title: '民众骚乱',
    body: `<p>物价飞涨引发了多个城市的民众骚乱。工人罢工、学生示威、家庭主妇上街——帝国的社会契约正在瓦解。</p>`,
    choices: [
      { text: '镇压', desc: '+稳定 -人力 -美国关系', effects: { stability: 5, manpower: -8, ofn_relation: -8 } },
      { text: '发放补贴', desc: '+稳定 -资金', effects: { stability: 4, money: -50 } },
      { text: '承诺改革', desc: '+稳定 -威慑', effects: { stability: 6, deterrence: -3 }, condition: (s) => s.flags.reformist }
    ]
  },

  {
    id: 'rnd_nuclear_accident',
    once: false,
    weight: 3,
    minTurn: { year: 1975 },
    tag: 'major',
    title: '核事故',
    body: `<p>一座核武器设施发生意外泄漏，放射性物质扩散到周边地区。掩盖还是公开？</p>`,
    choices: [
      { text: '全力隐瞒', desc: '+稳定 -研发', effects: { stability: 3, research: -8 } },
      { text: '公开并处理', desc: '-稳定 +研发', effects: { stability: -6, research: 5 } },
      { text: '疏散居民', desc: '-资金 -稳定', effects: { money: -60, stability: -4 } }
    ]
  },

  {
    id: 'rnd_coup_attempt',
    once: false,
    weight: 3,
    minTurn: { year: 1980 },
    tag: 'critical',
    title: '政变企图',
    body: `<p>一群军官试图发动政变，企图推翻现政府。虽然政变已被镇压，但其背后牵涉的势力远未清除。</p>`,
    choices: [
      { text: '严惩主谋', desc: '+威慑 -军力 -稳定', effects: { deterrence: 8, militaryPower: -8, stability: -5 } },
      { text: '宽大处理', desc: '+军力 -威慑', effects: { militaryPower: 5, deterrence: -5 } },
      { text: '深入调查', desc: '-资金 +稳定', effects: { money: -40, stability: 4 } }
    ]
  }
  ,

  /* ===========================================================
   * 法国事件
   * =========================================================== */

  {
    id: 'ev_free_france_rallying',
    turn: { year: 1964, quarter: 2 },
    once: true,
    tag: 'major',
    title: '自由法国集结',
    body: `<p>在法国南部，一股新生的力量正在集结——<strong>自由法国</strong>运动。</p>
    <p>戴高乐的追随者们从马赛、图卢兹和里昂的地下走出，他们与美国的情报机构合作，在山区建立训练营，在城市中开展地下印刷。他们的口号穿越了被占领的法国：<em>liberté, égalité, fraternité</em>。</p>
    <p>情报显示，自由法国正在寻求与帝国的直接谈判。他们的要求很明确：结束占领，恢复法国主权。</p>`,
    choices: [
      {
        text: '派遣部队镇压',
        desc: '+威慑 -法国抵抗 -美国关系',
        effects: { deterrence: 5, ofn_relation: -10 },
        setFlags: { french_resistance_crushed: true, war_europe: true }
      },
      {
        text: '开启秘密谈判',
        desc: '+美国关系 -稳定 -威慑',
        effects: { ofn_relation: 10, stability: -4, deterrence: -3 },
        setFlags: { french_negotiation: true },
        showToast: '与自由法国的秘密谈判已开启'
      },
      {
        text: '静观其变',
        desc: '-稳定',
        effects: { stability: -3 }
      }
    ]
  },

  {
    id: 'ev_french_civil_war',
    turn: { year: 1966, quarter: 1 },
    once: true,
    tag: 'critical',
    title: '法国内战',
    body: `<p>法国正在燃烧。</p>
    <p>自由法国的抵抗力量与维希政权的民兵在巴黎街头激战。德军占领当局面临两难：是支持维希政权镇压抵抗，还是直接介入？</p>
    <p>法国的局势已经失控。如果帝国不采取果断行动，整个法国可能陷入全面内战，届时不仅占领成本激增，美国也可能借此机会加大对欧洲的干涉。</p>`,
    choices: [
      {
        text: '全面军事介入',
        desc: '+威慑 -资金 -人力 -美国关系',
        effects: { deterrence: 10, money: -80, manpower: -15, ofn_relation: -15 },
        setFlags: { french_resistance_crushed: true, war_europe: true },
        showToast: '帝国全面介入法国内战'
      },
      {
        text: '支持维希政权',
        desc: '+资金 -美国关系 -稳定',
        effects: { money: 20, ofn_relation: -10, stability: -3 },
        setFlags: { french_resistance_crushed: true }
      },
      {
        text: '与自由法国妥协',
        desc: '+美国关系 -威慑 -资金',
        effects: { ofn_relation: 15, deterrence: -5, money: -40 },
        setFlags: { french_negotiation: true },
        condition: (s) => s.flags.french_negotiation || s.flags.reformist
      }
    ]
  },

  {
    id: 'ev_french_occupation_costs',
    turn: { year: 1968, quarter: 3 },
    once: true,
    tag: 'major',
    title: '占领法国的经济成本',
    body: `<p>占领法国的成本正在急剧上升。</p>
    <p>每年帝国需要投入大量资金维持占领军、镇压抵抗运动、重建被破坏的基础设施。法国的经济价值远不及占领成本，而民众的敌意只在与日俱增。</p>
    <p>有人开始质疑：继续占领法国是否真的符合帝国的利益？</p>`,
    choices: [
      {
        text: '增加占领投入',
        desc: '+威慑 -资金',
        effects: { deterrence: 3, money: -60 }
      },
      {
        text: '削减占领开支',
        desc: '+资金 -威慑 -稳定',
        effects: { money: 40, deterrence: -4, stability: -3 },
        condition: (s) => s.resources.money < -100
      },
      {
        text: '推动自治方案',
        desc: '+稳定 +美国关系 -威慑',
        effects: { stability: 5, ofn_relation: 8, deterrence: -3 },
        condition: (s) => s.flags.reformist
      }
    ]
  },

  {
    id: 'ev_degaulle_return',
    turn: { year: 1970, quarter: 4 },
    once: true,
    tag: 'major',
    title: '戴高乐回归',
    body: `<p>夏尔·戴高乐——自由法国的传奇领袖——正在策划一场惊天回归。</p>
    <p>如果自由法国在南部占据优势，戴高乐将从流亡中归来，统一法国的抵抗力量，建立一个与帝国分庭抗礼的法国政权。这将是对帝国在西欧霸权的直接挑战。</p>
    <p>情报报告显示，戴高乐已秘密从美国获得资金支持。</p>`,
    choices: [
      {
        text: '加强监视与镇压',
        desc: '+威慑 -资金 -美国关系',
        effects: { deterrence: 6, money: -40, ofn_relation: -12 },
        setFlags: { degaulle_suppressed: true, french_resistance_crushed: true },
        condition: (s) => !s.flags.french_negotiation
      },
      {
        text: '与戴高乐派对话',
        desc: '+美国关系 -威慑 -资金',
        effects: { ofn_relation: 12, deterrence: -3, money: -30 },
        setFlags: { degaulle_negotiation: true, french_negotiation: true },
        condition: (s) => s.flags.french_negotiation
      },
      {
        text: '暂不关注意大利，处理内政',
        desc: '无重大影响',
        effects: { stability: -2 }
      }
    ],
    condition: (s) => s.flags.french_negotiation || s.year >= 1970
  },

  /* ===========================================================
   * 非洲事件
   * =========================================================== */

  {
    id: 'ev_north_africa_rising',
    turn: { year: 1965, quarter: 2 },
    once: true,
    tag: 'major',
    title: '北非殖民地起义',
    body: `<p>摩洛哥、阿尔及利亚和突尼斯的法国殖民地爆发了大规模起义。</p>
    <p>民族主义者要求独立，法国殖民当局疲于应对。帝国在北非的利益受到威胁——摩洛哥的战略位置、阿尔及利亚的石油资源、突尼斯的海军基地都面临丧失的风险。</p>
    <p>当地驻军请求增援，但帝国的兵力已分散在欧洲和东线。</p>`,
    choices: [
      {
        text: '派遣远征军镇压',
        desc: '+威慑 -资金 -人力',
        effects: { deterrence: 5, money: -50, manpower: -10 },
        setFlags: { war_africa: true }
      },
      {
        text: '外交施压',
        desc: '+稳定 -威慑',
        effects: { stability: 4, deterrence: -2 }
      },
      {
        text: '放弃部分殖民地',
        desc: '+资金 -威慑 -稳定',
        effects: { money: 30, deterrence: -4, stability: -3 },
        setFlags: { north_africa_conceded: true },
        condition: (s) => s.flags.reformist
      }
    ]
  },

  {
    id: 'ev_italian_africa_collapse',
    turn: { year: 1969, quarter: 4 },
    once: true,
    tag: 'critical',
    title: '意大利非洲帝国崩溃',
    body: `<p>意大利的非洲帝国正在土崩瓦解。</p>
    <p>埃塞俄比亚的起义、利比亚的动荡、索马里的叛乱——墨索里尼的罗马帝国梦想在非洲化为尘埃。意大利的崩溃将影响整个地中海的力量平衡。</p>
    <p>如果意大利倒台，帝国将不得不接管其非洲领地——这将是一个沉重的负担，同时也是一个机会。</p>`,
    choices: [
      {
        text: '接管意大利非洲领地',
        desc: '+威慑 -资金 -人力 -意大利关系',
        effects: { deterrence: 8, money: -70, manpower: -12, italy_relation: -10 },
        setFlags: { war_africa: true, italy_africa_collapse: true }
      },
      {
        text: '支持意大利维持统治',
        desc: '+意大利关系 -资金 -威慑',
        effects: { italy_relation: 12, money: -40, deterrence: -3 }
      },
      {
        text: '让意大利自行崩溃',
        desc: '-威慑 -稳定',
        effects: { deterrence: -5, stability: -4 },
        setFlags: { italy_africa_collapse: true }
      }
    ],
    condition: (s) => s.flags.italy_africa_collapse || s.year >= 1969
  },

  {
    id: 'ev_suez_crisis',
    turn: { year: 1973, quarter: 1 },
    once: true,
    tag: 'critical',
    title: '苏伊士运河危机',
    body: `<p>埃及宣布将苏伊士运河国有化，并封锁了以色列的航运。</p>
    <p>以色列随即发动军事行动，入侵西奈半岛。英国和法国以保护运河为借口介入。整个中东濒临全面战争。</p>
    <p>苏伊士运河是帝国从中东获取石油的生命线。如果运河被封锁，帝国的经济将受到严重冲击。</p>`,
    choices: [
      {
        text: '派遣舰队保护运河',
        desc: '+威慑 -资金 -中东关系',
        effects: { deterrence: 8, money: -60, stability: -3 },
        setFlags: { suez_crisis: true, war_middle_east: true }
      },
      {
        text: '外交斡旋',
        desc: '+稳定 -威慑',
        effects: { stability: 5, deterrence: -3 },
        setFlags: { suez_crisis: true }
      },
      {
        text: '与以色列合作',
        desc: '+以色列关系 -中东关系',
        effects: { deterrence: 3, ofn_relation: 8, stability: -3 },
        setFlags: { suez_crisis: true, war_middle_east: true }
      }
    ]
  },

  {
    id: 'ev_africa_scramble',
    turn: { year: 1975, quarter: 3 },
    once: true,
    tag: 'major',
    title: '非洲独立浪潮',
    body: `<p>非洲独立运动进入高潮。</p>
    <p>从摩洛哥到南非，从埃及到尼日利亚，民族主义浪潮席卷整个非洲大陆。殖民地体系正在崩溃，新的国家如雨后春笋般涌现。</p>
    <p>帝国在非洲的殖民利益面临全面挑战。是时候做出选择了——是维持旧秩序，还是接受非洲的独立？</p>`,
    choices: [
      {
        text: '强化殖民统治',
        desc: '+威慑 -资金 -稳定',
        effects: { deterrence: 6, money: -50, stability: -4 },
        setFlags: { war_africa: true }
      },
      {
        text: '有条件地承认独立',
        desc: '+稳定 -威慑 +资金',
        effects: { stability: 8, deterrence: -3, money: 20 },
        setFlags: { africa_emancipation: true },
        condition: (s) => s.flags.reformist
      },
      {
        text: '顺其自然',
        desc: '-稳定',
        effects: { stability: -3 }
      }
    ]
  },

  {
    id: 'ev_south_africa_crisis',
    turn: { year: 1980, quarter: 2 },
    once: true,
    tag: 'major',
    title: '南非种族隔离危机',
    body: `<p>南非的种族隔离政权面临空前的国际压力。</p>
    <p>纳尔逊·曼德拉领导的非洲人国民大会(ANC)发起了大规模抗议运动。国际社会呼吁制裁南非，但一些国家仍在与比勒陀利亚进行贸易。</p>
    <p>帝国在南非拥有重要的矿产投资——黄金、钻石和铀矿。是支持种族隔离政权，还是转向民主力量？</p>`,
    choices: [
      {
        text: '支持南非政府',
        desc: '+资金 -人道形象',
        effects: { money: 50, stability: -2 }
      },
      {
        text: '转向民主力量',
        desc: '+稳定 -资金',
        effects: { stability: 6, money: -30 },
        condition: (s) => s.flags.reformist
      },
      {
        text: '保持中立',
        desc: '无重大影响',
        effects: { stability: -1 }
      }
    ]
  },

  /* ===========================================================
   * 战争事件
   * =========================================================== */

  {
    id: 'ev_first_nile_war',
    turn: { year: 1967, quarter: 2 },
    once: true,
    tag: 'critical',
    title: '第一次尼罗河战争',
    body: `<p>以色列对埃及发动了先发制人的空中打击。</p>
    <p>在六天之内，以色列摧毁了埃及、叙利亚和约旦的空军，占领了西奈半岛、约旦河西岸和戈兰高地。这场"六日战争"彻底改变了中东的力量格局。</p>
    <p>帝国的石油供应线受到威胁。战争可能波及整个中东地区。</p>`,
    choices: [
      {
        text: '支持以色列',
        desc: '+威慑 -中东关系',
        effects: { deterrence: 8, ofn_relation: 10, stability: -5 },
        setFlags: { first_nile_war: true, war_middle_east: true }
      },
      {
        text: '支持阿拉伯国家',
        desc: '+中东关系 -美国关系 -威慑',
        effects: { stability: 5, ofn_relation: -10, deterrence: -3 },
        setFlags: { first_nile_war: true, war_middle_east: true }
      },
      {
        text: '保持中立',
        desc: '-稳定',
        effects: { stability: -2 },
        setFlags: { first_nile_war: true }
      }
    ]
  },

  {
    id: 'ev_mediterranean_crisis',
    turn: { year: 1971, quarter: 3 },
    once: true,
    tag: 'critical',
    title: '地中海危机',
    body: `<p>地中海地区爆发了一场涉及多国的军事危机。</p>
    <p>意大利、南斯拉夫、希腊、土耳其——地中海沿岸的帝国卫星国和中立国之间爆发了一系列边境冲突。一场更大规模的战争似乎一触即发。</p>
    <p>帝国作为欧洲的主导力量，必须决定如何介入这场危机。</p>`,
    choices: [
      {
        text: '派兵稳定局势',
        desc: '+威慑 -资金 -人力',
        effects: { deterrence: 7, money: -55, manpower: -8 },
        setFlags: { war_europe: true, war_mediterranean: true }
      },
      {
        text: '外交调停',
        desc: '+稳定 -威慑',
        effects: { stability: 6, deterrence: -2 }
      },
      {
        text: '支持意大利扩张',
        desc: '+意大利关系 -稳定',
        effects: { italy_relation: 10, stability: -3, deterrence: -2 },
        setFlags: { war_europe: true }
      }
    ]
  },

  {
    id: 'ev_saharan_war',
    turn: { year: 1985, quarter: 1 },
    once: true,
    tag: 'critical',
    title: '撒哈拉战争',
    body: `<p>一场爆发在撒哈拉沙漠的战争震惊了世界。</p>
    <p>摩洛哥与阿尔及利亚因西撒哈拉领土争端爆发军事冲突。毛里塔尼亚、马里、尼日尔等国相继卷入。这场战争不仅涉及领土争端，还牵涉到石油、天然气和矿产资源的争夺。</p>
    <p>帝国在北非的殖民地利益再次面临威胁。</p>`,
    choices: [
      {
        text: '派兵保护帝国利益',
        desc: '+威慑 -资金 -人力',
        effects: { deterrence: 9, money: -80, manpower: -12 },
        setFlags: { war_africa: true, war_saharan: true }
      },
      {
        text: '外交调停',
        desc: '+稳定 -威慑',
        effects: { stability: 7, deterrence: -3 },
        setFlags: { war_saharan: true }
      },
      {
        text: '出售军火牟利',
        desc: '+资金 -稳定',
        effects: { money: 100, stability: -4, deterrence: -5 },
        setFlags: { war_africa: true },
        condition: (s) => s.flags.militarist
      }
    ]
  },

  {
    id: 'ev_global_boom_1985',
    turn: { year: 1985, quarter: 4 },
    once: true,
    tag: 'major',
    title: '全球经济繁荣',
    body: `<p>1985年见证了一场全球性的经济繁荣。</p>
    <p>石油价格下跌、技术创新加速、金融市场繁荣——世界经济进入了一个黄金时期。帝国的经济也受益匪浅，工业产值大幅增长，失业率下降，人民生活水平提高。</p>
    <p>然而，繁荣之下隐藏着泡沫和不平衡。通货膨胀的压力正在积累……</p>`,
    choices: [
      {
        text: '加大投资，抓住机遇',
        desc: '+资金 +研发 -稳定',
        effects: { money: 80, research: 8, stability: -2 }
      },
      {
        text: '收紧财政，防范风险',
        desc: '+稳定 -资金',
        effects: { stability: 8, money: -40 }
      },
      {
        text: '投资核武器现代化',
        desc: '+核威慑 -资金',
        effects: { nukeDeter: 10, money: -70 },
        condition: (s) => s.flags.militarist
      }
    ]
  }

];

// 导出
if (typeof window !== 'undefined') {
  window.STORY_EVENTS = STORY_EVENTS;
}
