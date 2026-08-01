/* ============================================================
 * 千年帝国的最后一息 - UI 渲染与交互
 * ============================================================ */

// ============ UI 数据读取: 优先 DataStore, 失败回退到旧全局 ============
(function _defineUIHelpers(scope) {
  function _DS() {
    if (typeof DataStore !== 'undefined') return DataStore;
    if (scope.DataStore) return scope.DataStore;
    if (typeof window !== 'undefined' && window.DataStore) return window.DataStore;
    return null;
  }
  scope._uiGetBuildings = function () {
    const d = _DS(); if (d) { const r = d.getBuildings(); if (r && Object.keys(r).length) return r; }
    return BUILDINGS || {};
  };
  scope._uiGetTechs = function () {
    const d = _DS(); if (d) { const r = d.getTechs(); if (r && Object.keys(r).length) return r; }
    return TECHS || {};
  };
  scope._uiGetPolicies = function () {
    const d = _DS(); if (d) { const r = d.getPolicies(); if (r && Object.keys(r).length) return r; }
    return POLICIES || {};
  };
  scope._uiGetFoci = function () {
    const d = _DS(); if (d) { const r = d.getNationalFoci(); if (r && Object.keys(r).length) return r; }
    return NATIONAL_FOCI || {};
  };
  scope._uiGetSuccession = function () {
    const d = _DS(); if (d) { const r = d.getSuccessionPaths(); if (r && Object.keys(r).length) return r; }
    return SUCCESSION_PATHS || {};
  };
  scope._uiGetFactions = function () {
    const d = _DS(); if (d) { const r = d.getFactions(); if (r && Object.keys(r).length) return r; }
    return FACTIONS || {};
  };
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));

// ===== 结局定义 =====
const ENDINGS = {
  nuclear_holocaust: {
    id: 'nuclear_holocaust',
    tag: '末日结局',
    title: '诸神黄昏',
    text: `1962年，帝国登月，举世欢腾。但在你按下核按钮的那一刻，所有的荣耀都化为灰烬。\n\n三大国的导弹同时升空，地球的大气层被点燃，文明的灯火在一小时内熄灭。日耳曼尼亚、华盛顿、东京、莫斯科——所有伟大的首都都成了放射性废墟。希姆莱在地下堡垒中笑了：他的"净化"终于实现了。\n\n几百年后，残存的人类在废墟上重新学会用火。他们口口相传着一个故事：曾经有个帝国，活了一千年，然后用一个下午毁灭了世界。\n\n这是你选择的道路。`
  },
  democratic_reform: {
    id: 'democratic_reform',
    tag: '改革胜利',
    title: '帝国之春',
    text: `没有人想到这一切会以这种方式结束。\n\n施佩尔的改革——或者说，你推动的改革——最终让帝国脱胎换骨。奴隶制在1990年代彻底废除，自由选举在地方层面试行，美国与帝国签署了历史性的缓和协定。日耳曼尼亚不再是恐惧的代名词，而成了欧洲对话的舞台。\n\n2000年元旦，帝国举行了一场低调的庆典。没有阅兵，没有万字旗，只有一群老人在人民大会堂前默默饮酒。他们记得1962年的登月，记得内战的血，记得每一个让帝国走到今天的抉择。\n\n千年帝国没有活到一千年。但它活成了一个更好的自己。这，或许就够了。`
  },
  peaceful_coexistence: {
    id: 'peaceful_coexistence',
    tag: '黄金结局',
    title: '长夜将尽',
    text: `1989年那个秋夜，当你拒绝按下核按钮、选择斡旋时，世界屏住了呼吸。然后，它松了一口气。\n\n此后的十年，帝国、美国、日本与重新统一的俄罗斯，在磕磕绊绊中走向了一种脆弱的共存。核军控条约签署，殖民体系瓦解，互联网（如果你开放了它）让思想跨越了铁幕。帝国的青年与美国、日本的青年在网络上争吵、和解、相爱。\n\n2000年，四位大国领导人在日内瓦签署《新世纪宣言》，正式结束三极冷战。希特勒的阴影终于散去。\n\n帝国依然存在——它改名了，改革了，但血脉还在。而你的名字，被刻在了历史的一个角落：不是作为征服者，而是作为那个在最黑暗的时刻，选择了不按下按钮的人。`
  },
  reformist_survival: {
    id: 'reformist_survival',
    tag: '改革延续',
    title: '半途的黎明',
    text: `改革没有完全成功，但帝国活了下来。\n\n奴隶制被削弱但未废除，民主被引入但受限，与美国的关系缓和但未同盟。帝国成了一个矛盾的怪物——既非旧日的极权，也非真正的新生。\n\n2000年，老一代的改革者相继离世，年轻一代接过了权柄。他们不知道帝国将走向何方，只知道它还没有死。\n\n这或许就是最好的结局：不是胜利，不是失败，而是延续。在黑暗与光明之间，帝国选择了灰色——而灰色，至少意味着还有选择。`
  },
  reformist_failure: {
    id: 'reformist_failure',
    tag: '改革失败',
    title: '未竟之梦',
    text: `改革失败了。\n\n不是因为你不够努力，而是因为帝国的根基已经腐烂得太深。保守派的反扑、经济的动荡、奴隶的暴动、外部的压力——每一个都足以让改革夭折。当施佩尔（或他的继承人）在1990年代被迫下台时，旧势力卷土重来，比从前更加凶残。\n\n2000年，帝国又回到了1962年的样子：奴隶、黑市、党卫军、衰老的元首。只是这一次，连登月的荣耀都成了遥远的记忆。\n\n改革的火种没有熄灭——它只是被埋进了更深的地下。也许有一天，会有人重新点燃它。但不是今天。`
  },
  militarist_victory: {
    id: 'militarist_victory',
    tag: '军国胜利',
    title: '铁与火的新世纪',
    text: `戈林会为你骄傲——如果他没死的话。\n\n帝国用铁与火重塑了世界秩序。军国派的胜利让德国重新成为欧洲无可争议的霸主，军队是国家，国家是军队。威慑让美国与日本不敢轻举妄动，俄罗斯的复仇被扼杀在摇篮里。\n\n2000年，帝国举行了一场规模空前的阅兵。一万辆坦克碾过日耳曼尼亚的大街，一万架飞机掠过天空。人民挥舞着旗帜，高呼着元首的名字。\n\n没有人问：这一切的代价是什么？因为问问题的人，早已不在了。帝国赢了，但赢得的是什么，已经没人记得。`
  },
  militarist_stalemate: {
    id: 'militarist_stalemate',
    tag: '军国僵持',
    title: '武装的和平',
    text: `帝国没有赢，但也没有输。\n\n军国路线让德国维持了表面的强大，但内部早已被军费拖垮。每一个马克都变成了子弹，每一座工厂都在造坦克，而人民却在配给制下苟延残喘。\n\n2000年，帝国成了一个武装到牙齿的巨人——但巨人也有骨质疏松。美国与日本在等待，俄罗斯在等待，连帝国的将军们都在等待：什么时候，这个巨人会自己倒下？\n\n威慑维持着和平，但和平的代价，是帝国的灵魂。`
  },
  militarist_collapse: {
    id: 'militarist_collapse',
    tag: '军国崩溃',
    title: '将军们的黄昏',
    text: `军国路线走到尽头时，帝国成了一具穿着铠甲的尸体。\n\n经济崩溃，军队哗变，将军们为争夺残骸互相厮杀。美国趁机收复欧洲，俄罗斯收复东方，日本吞并亚太。日耳曼尼亚的万国旗换成了占领军的旗帜。\n\n2000年，曾经的大日耳曼国已经不存在。它的领土被瓜分，它的人民被清算，它的历史被改写。\n\n将军们说，武力能解决一切。他们是对的——武力解决了帝国本身。`
  },
  dark_victory: {
    id: 'dark_victory',
    tag: '黑暗结局',
    title: '永夜',
    text: `海德里希笑了。在某个地下深处，他终于笑了。\n\n帝国成了SS的国度，党卫军是法律，恐怖是秩序。集中营遍布欧洲，"劣等民族"被系统性地清除，连德国人自己都活在告密与消失的阴影中。核武器是帝国的盾牌，也是它的剑——指向任何胆敢反抗的人。\n\n2000年，世界其他地方假装帝国不存在。OFN闭上了眼睛，日本转过了身，俄罗斯躲在了乌拉尔之后。他们说，那里什么都没有，只有黑暗。\n\n而黑暗中，帝国还在运转。它不会停下，因为它的引擎是恐惧，而恐惧永不会枯竭。\n\n这是你选择的道路。愿你能在地狱中安眠。`
  },
  terror_state: {
    id: 'terror_state',
    tag: '恐怖结局',
    title: '面具之下',
    text: `帝国没有变成海德里希梦想的那种纯粹噩梦，但也没有逃离它的阴影。\n\nSS的权力被削弱但未消除，恐怖统治被缓和但未停止。帝国成了一个戴面具的国家——表面是秩序，下面是血。\n\n2000年，外人看帝国，看到的是强大的工业、整齐的街道、忠诚的人民。但他们看不到的是：每一个微笑背后，都有一个秘密警察；每一句赞美背后，都是一颗颤抖的心。\n\n帝国活着。但活着的，到底是什么？`
  },
  conservative_survival: {
    id: 'conservative_survival',
    tag: '保守延续',
    title: '停滞的永恒',
    text: `鲍曼会满意——帝国还是老样子。\n\n保守路线让德国维持了1962年的状态：奴隶制、黑市、党卫军、官僚机器，一切照旧。没有改革，没有崩溃，只有日复一日的停滞。帝国像一个老人，慢慢地、慢慢地、慢慢地老去。\n\n2000年，帝国还在。它的边境还在，它的旗帜还在，它的元首（已经是第三任了）还在。但没有人记得帝国为什么存在，除了"因为它一直存在"。\n\n这或许就是保守主义的胜利：不是让帝国变好，而是让它不变。直到某一天，不变本身成了死亡。`
  },
  conservative_decay: {
    id: 'conservative_decay',
    tag: '保守衰亡',
    title: '朽木',
    text: `帝国没有死于刀剑，它死于腐烂。\n\n保守路线无法应对新时代的挑战：计算机、互联网、全球化、环保——每一个都让旧体制摇摇欲坠。当OFN在2000年登陆月球时，帝国的航天局还在用1960年代的图纸。\n\n2000年，帝国还在，但只是"还在"。它的工业过时，它的军队老化，它的人民麻木。世界已经向前走，而帝国还在原地，像一块被时间遗忘的朽木。\n\n没有人来砍倒它。它只是慢慢地、自己地，化为了尘土。`
  },
  collapse: {
    id: 'collapse',
    tag: '崩溃结局',
    title: '分崩离析',
    text: `帝国终于撑不住了。\n\n稳定度归零的那一刻，一切看似突然，实则必然。各省独立，军队哗变，奴隶起义，邻国入侵。日耳曼尼亚的政府在一夜之间蒸发，留下的只有空荡的办公室和满地的文件。\n\n2000年，大日耳曼国成了历史书上的一个注脚。它的领土被瓜分，它的人民四散，它的故事被用来警告后人：极权主义的尽头，从来不是荣耀，而是瓦解。\n\n你尽力了。但有些东西，从一开始就注定无法挽回。`
  },
  economic_collapse: {
    id: 'economic_collapse',
    tag: '经济崩溃',
    title: '破产的帝国',
    text: `帝国的金库空了。\n\n数十年的赤字、借贷、印钞，最终压垮了经济机器。马克成了废纸，工厂停转，军队发不出军饷。当财政部长在2000年宣布"帝国破产"时，街头已经燃烧了三天。\n\n美国与国际货币基金组织伸出援手——但代价是帝国的独立。接受了援助的德国，从此成了华盛顿的附庸。\n\n千年帝国没有死于战争，它死于账本。这或许是最讽刺的结局。`
  },
  invasion: {
    id: 'invasion',
    tag: '战败结局',
    title: '铁蹄之下',
    text: `威慑崩溃的那一刻，敌人来了。\n\n俄罗斯的坦克碾过东方总督辖区，OFN的登陆舰驶向北海，日本的舰队封锁了波罗的海。帝国连象征性的抵抗都组织不起来——它的军队早已在内战与腐败中瓦解。\n\n2000年，柏林（它已经不叫日耳曼尼亚了）迎来了新的占领者。万国旗被降下，新的旗帜升起。帝国的人民看着这一切，有人哭泣，有人欢呼，更多人只是沉默。\n\n历史就是这样循环的：一个帝国倒下，另一个站起来。而你的帝国，成了倒下的那一个。`
  }
};

// ===== UI 主对象 =====
const UI = {

  currentTab: 'overview',
  pendingEvents: [],
  currentEventIndex: 0,
  // 懒加载状态标记
  _lazy: {
    eventsGenLoaded: false,
    eventsGenLoading: false,
    pendingFirstEvent: false
  },
  // tab渲染缓存（避免每次切换都innerHTML重建DOM）
  _tabCache: {},

  // ===== 懒加载工具 =====
  loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[data-lazy="${src}"]`)) { resolve(); return; }
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.setAttribute('data-lazy', src);
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('加载失败: ' + src));
      document.head.appendChild(s);
    });
  },

  // 加载 events_gen.js (84MB, 首屏跳过)
  async loadEventsGen() {
    if (this._lazy.eventsGenLoaded) return true;
    if (this._lazy.eventsGenLoading) {
      return new Promise(res => {
        const itv = setInterval(() => {
          if (this._lazy.eventsGenLoaded) { clearInterval(itv); res(true); }
        }, 100);
      });
    }
    this._lazy.eventsGenLoading = true;
    try {
      await this.loadScript('js/events_gen.js?v=30');
      this._lazy.eventsGenLoaded = true;
      return true;
    } catch (e) {
      console.warn(e);
      return false;
    } finally {
      this._lazy.eventsGenLoading = false;
    }
  },

  // 旧版 SVG 地图的 11MB map_extra.js 已弃用（第11阶段优化移除）
  // 保留空方法防止旧代码调用时报错
  async loadMapExtra() { return false; },

  // ===== 启动游戏 =====
  start(mode) {
    if (mode && GAME_MODES[mode]) {
      Game.setMode(mode);
    }
    Game.init();
    document.getElementById('splash').style.display = 'none';
    document.getElementById('game').classList.add('active');
    this.renderAll();
    // 首屏初始化 DataStore (加载 story_core.json + 当前年 + 前后1年随机池 ≈ 380KB+7.8MB ≈ 8.2MB)
    // 替代原先加载整个 84MB events_gen.js 的流程，手机端减少内存~76MB
    const initDsPromise = (typeof DataStore !== 'undefined' && DataStore && typeof DataStore.init === 'function')
      ? DataStore.init(Game.state.year)
      : Promise.reject(new Error('no DataStore'));
    initDsPromise.then(ok => {
      if (ok) {
        const pool = DataStore.getEventPool();
        console.log('[DataStore] 首屏就绪, 当前事件池: ' + pool.length.toLocaleString() + ' 个 (剧情 + ' + (Game.state.year - 1) + '/' + Game.state.year + '/' + (Game.state.year + 1) + ' 年随机)');
      }
    }).catch(() => {
      // DataStore不可用时，退化为旧版懒加载：后台异步加载 84MB 事件库（不阻塞首屏和开场事件）
      this.loadEventsGen().then(ok => {
        if (ok) console.log('[懒加载-兼容] events_gen.js 已就绪 (' + (typeof window.STORY_EVENTS === 'undefined' ? '?' : window.STORY_EVENTS.length.toLocaleString()) + ' 事件)');
      });
    });
    // 触发开场事件
    setTimeout(() => this.processTurnEvents(), 300);
  },

  // ===== 渲染全部 =====
  // ===== 渲染调度 (防抖, 避免短时间多次renderAll卡顿) =====
  _renderTimer: null,
  requestRender() {
    if (this._renderTimer) return; // 已有 pending 渲染, 跳过
    this._renderTimer = requestAnimationFrame(() => {
      this._renderTimer = null;
      this.renderAll();
    });
  },

  renderAll() {
    this.renderTopbar();
    this.renderLeftPanel();
    this.renderRightPanel();
    this.renderTab(this.currentTab);
  },

  // ===== 顶栏 =====
  renderTopbar() {
    const s = Game.state;
    const r = s.resources;
    const income = Game.calculateIncome();

    const fmt = (v) => Math.round(v);
    const fmtDelta = (d) => {
      const v = Math.round(d);
      if (v > 0) return `<span class="delta positive">+${v}</span>`;
      if (v < 0) return `<span class="delta negative">${v}</span>`;
      return '';
    };

    const topbar = document.getElementById('topbar');
    // 缓存策略：第一次用innerHTML建立结构；后续直接用DOM引用更新文本（避免每帧100+节点重建）
    if (!this._topbarCache) {
      const diffInfo = DIFFICULTIES[s.difficulty] || DIFFICULTIES.normal;
      const modeInfo = (typeof GAME_MODES !== 'undefined' && GAME_MODES[s.gameMode]) ? GAME_MODES[s.gameMode] : GAME_MODES.historical;
      topbar.innerHTML = `
        <div class="faction-emblem">大日耳曼国 <span class="diff-tag" style="font-size:10px;color:${diffInfo.color};border:1px solid ${diffInfo.color};padding:1px 5px;border-radius:2px;margin-left:6px">${diffInfo.name}</span><span class="diff-tag" style="font-size:10px;color:${modeInfo.color};border:1px solid ${modeInfo.color};padding:1px 5px;border-radius:2px;margin-left:4px">${modeInfo.icon} ${modeInfo.name}</span></div>
        <div class="leader-info">
          <div>元首</div>
          <div class="leader-name" data-k="leader">${s.leader.name}</div>
          <div style="font-size:10px;color:var(--text-muted)" data-k="title">${s.leader.title || ''}</div>
        </div>
        <div class="resources">
          <div class="resource" title="帝国马克">
            <span class="icon">资金</span>
            <span class="value" data-v="money">${fmt(r.money)}</span>
            <span class="d-money" data-d="money">${fmtDelta(income.money)}</span>
          </div>
          <div class="resource" title="人力">
            <span class="icon">人力</span>
            <span class="value" data-v="manpower">${fmt(r.manpower)}</span>
            <span class="d-manpower" data-d="manpower">${fmtDelta(income.manpower)}</span>
          </div>
          <div class="resource" title="稳定度：只能通过事件恢复，持续衰减">
            <span class="icon">稳定</span>
            <span class="value" data-v="stability">${fmt(r.stability)}</span>
            <span class="d-stability" data-d="stability">${fmtDelta(income.stability)}</span>
          </div>
          <div class="resource" title="威慑：只能通过事件提升，持续衰减">
            <span class="icon">威慑</span>
            <span class="value" data-v="deterrence">${fmt(r.deterrence)}</span>
            <span class="d-deterrence" data-d="deterrence">${fmtDelta(income.deterrence)}</span>
          </div>
          <div class="resource" title="军力：只能通过事件提升，持续衰减">
            <span class="icon">军力</span>
            <span class="value" data-v="militaryPower">${fmt(r.militaryPower)}</span>
            <span class="d-militaryPower" data-d="militaryPower">${fmtDelta(income.militaryPower)}</span>
          </div>
          <div class="resource" title="核慑：只能通过事件提升，持续衰减">
            <span class="icon">核慑</span>
            <span class="value" data-v="nukeDeter">${fmt(r.nukeDeter)}</span>
            <span class="d-nukeDeter" data-d="nukeDeter">${fmtDelta(income.nukeDeter)}</span>
          </div>
          <div class="resource" title="核武器：通过核设施建造，或事件获得">
            <span class="icon">核弹</span>
            <span class="value" data-v="nukes">${fmt(r.nukes)}</span>
          </div>
          <div class="resource" title="研发：只能通过事件获得，持续老化衰减">
            <span class="icon">研发</span>
            <span class="value" data-v="research">${fmt(r.research)}</span>
            <span class="d-research" data-d="research">${fmtDelta(income.research)}</span>
          </div>
        </div>
        <div class="date-block">
          <div class="date" data-k="date">${Game.getDateStr()}</div>
          <div class="turn-info" data-k="turn">回合 ${s.turn} / ${s.totalTurns}</div>
        </div>
      `;
      // 建立快速引用
      this._topbarCache = {
        vals: {},
        dels: {},
        leader: topbar.querySelector('[data-k="leader"]'),
        title: topbar.querySelector('[data-k="title"]'),
        date: topbar.querySelector('[data-k="date"]'),
        turn: topbar.querySelector('[data-k="turn"]'),
      };
      ['money','manpower','stability','deterrence','militaryPower','nukeDeter','nukes','research'].forEach(k => {
        this._topbarCache.vals[k] = topbar.querySelector(`[data-v="${k}"]`);
        const d = topbar.querySelector(`[data-d="${k}"]`);
        if (d) this._topbarCache.dels[k] = d;
      });
      return;
    }

    // 增量更新：只更新数值文本，不重建DOM（性能提升~10x）
    const c = this._topbarCache;
    ['money','manpower','stability','deterrence','militaryPower','nukeDeter','nukes','research'].forEach(k => {
      if (c.vals[k]) c.vals[k].firstChild.nodeValue = String(fmt(r[k]));
      if (c.dels[k]) c.dels[k].innerHTML = fmtDelta(income[k]);
    });
    if (c.leader && c.leader.textContent !== s.leader.name) c.leader.textContent = s.leader.name;
    if (c.title && c.title.textContent !== (s.leader.title || '')) c.title.textContent = s.leader.title || '';
    if (c.date) c.date.textContent = Game.getDateStr();
    if (c.turn) c.turn.textContent = `回合 ${s.turn} / ${s.totalTurns}`;
  },

  // ===== 左面板 =====
  renderLeftPanel() {
    const s = Game.state;
    const r = s.resources;
    const rel = s.relations;

    const relLabel = (v) => {
      if (v <= -40) return { cls: 'hostile', text: '敌对' };
      if (v <= -10) return { cls: 'cold', text: '冷淡' };
      if (v <= 10) return { cls: 'neutral', text: '中立' };
      if (v <= 40) return { cls: 'neutral', text: '友好' };
      return { cls: 'friendly', text: '盟友' };
    };

    const relRow = (id) => {
      const v = rel[id];
      const f = FACTIONS[id];
      const lbl = relLabel(v);
      return `<div class="faction-row">
        <span class="fname">${f.short}</span>
        <span class="fval ${lbl.cls}">${v > 0 ? '+' : ''}${v} (${lbl.text})</span>
      </div>`;
    };

    const barHtml = (val, max, cls) => {
      const pct = Math.max(0, Math.min(100, (val / max) * 100));
      return `<div class="bar-track"><div class="bar-fill ${cls}" style="width:${pct}%"></div></div>`;
    };

    document.getElementById('left-panel').innerHTML = `
      <button class="mobile-close-btn" onclick="UI.toggleDrawer('')">✕ 关闭</button>
      <div class="panel-section">
        <h3>国势</h3>
        <div class="section-body">
          <div class="stat-line"><span>稳定度</span><span class="stat-val">${Math.round(r.stability)}/100</span></div>
          ${barHtml(r.stability, 100, 'stab')}
          <div class="stat-line" style="margin-top:6px"><span>综合威慑</span><span class="stat-val">${Math.round(r.deterrence)}/150</span></div>
          ${barHtml(r.deterrence, 150, 'deter')}
          <div class="stat-line" style="margin-top:6px"><span>核威慑</span><span class="stat-val">${Math.round(r.nukeDeter)}/150</span></div>
          ${barHtml(r.nukeDeter, 150, 'nuke')}
          <div class="stat-line" style="margin-top:6px"><span>工业效率</span><span class="stat-val">${(r.efficiency * 100).toFixed(0)}%</span></div>
          ${barHtml(r.efficiency * 50, 100, 'research')}
        </div>
      </div>
      <div class="panel-section">
        <h3>列强关系</h3>
        <div class="section-body">
          ${relRow('ofn')}
          ${relRow('japan')}
          ${relRow('italy')}
          ${relRow('burgundy')}
          ${relRow('russia')}
        </div>
      </div>
      <div class="panel-section">
        <h3>工业</h3>
        <div class="section-body">
          <div class="stat-line"><span>民用建筑</span><span class="stat-val">${this.countBuildings('civilian')}</span></div>
          <div class="stat-line"><span>军用建筑</span><span class="stat-val">${this.countBuildings('military')}</span></div>
          <div class="stat-line"><span>建造中</span><span class="stat-val">${s.buildQueue.length}</span></div>
        </div>
      </div>
      <div class="panel-section">
        <h3>研发</h3>
        <div class="section-body">
          <div class="stat-line"><span>已研科技</span><span class="stat-val">${Object.keys(s.techs).length}</span></div>
          <div class="stat-line"><span>研发点数</span><span class="stat-val">${Math.round(r.research)}</span></div>
        </div>
      </div>
      ${s.chosenPath ? `<div class="panel-section">
        <h3>路线</h3>
        <div class="section-body">
          <div class="stat-line"><span>路线</span><span class="stat-val">${SUCCESSION_PATHS[s.chosenPath]?.title || '—'}</span></div>
          <div class="stat-line"><span>意识形态</span><span class="stat-val">${Game.state.leader.ideology || '—'}</span></div>
        </div>
      </div>` : ''}
    `;
  },

  countBuildings(type) {
    let count = 0;
    for (const id in Game.state.buildings) {
      if (BUILDINGS[id] && BUILDINGS[id].type === type) {
        count += Game.state.buildings[id];
      }
    }
    return count;
  },

  // ===== 右面板 =====
  renderRightPanel() {
    const s = Game.state;
    const newsHtml = s.newsLog.length > 0
      ? s.newsLog.map(n => `
        <div class="news-item ${n.type}">
          <div class="news-date">${n.date}</div>
          <div class="news-text">${n.text}</div>
        </div>`).join('')
      : '<div style="color:var(--text-muted);font-size:12px;padding:12px;text-align:center">暂无新闻</div>';

    document.getElementById('news-ticker').innerHTML = newsHtml;

    document.getElementById('action-bar').innerHTML = `
      <button class="btn-next-turn" id="btn-next-turn">推进至下一季度 ▸</button>
      <button class="btn-secondary" id="btn-save">保存</button>
      <button class="btn-secondary" id="btn-load">读取</button>
      <button class="btn-secondary" id="btn-restart">重启</button>
      ${this.isDebugMode() ? '<button class="btn-secondary" id="btn-debug" style="border-color:var(--accent-gold);color:var(--accent-gold);">DEBUG</button>' : ''}
    `;

    document.getElementById('btn-next-turn').onclick = () => this.nextTurn();
    document.getElementById('btn-save').onclick = () => this.showSavePanel('save');
    document.getElementById('btn-load').onclick = () => this.showSavePanel('load');
    document.getElementById('btn-restart').onclick = () => {
      if (confirm('确定要重新开始吗？当前进度将丢失。')) {
        location.reload();
      }
    };
    const dbgBtn = document.getElementById('btn-debug');
    if (dbgBtn) dbgBtn.onclick = () => this.toggleDebugPanel();

    // 移动端底部操作栏
    this.renderMobileActionBar();
  },

  // ===== 移动端底部操作栏 =====
  renderMobileActionBar() {
    const bar = document.getElementById('mobile-action-bar');
    if (!bar) return;
    // 危机状态指示 (若有核危机)
    const crisis = (typeof NationSim !== 'undefined' && NationSim.getNuclearCrisis) ? NationSim.getNuclearCrisis() : null;
    const crisisBadge = (crisis && crisis.level !== 'low')
      ? `<span style="position:absolute;top:2px;right:2px;width:8px;height:8px;background:${crisis.color};border-radius:50%;box-shadow:0 0 6px ${crisis.color};"></span>`
      : '';
    bar.innerHTML = `
      <button class="mobile-nav-btn" id="m-btn-left" aria-label="势力面板" style="position:relative;">
        <span class="nav-icon">☰</span>
        <span>势力</span>
        ${crisisBadge}
      </button>
      <button class="btn-next-turn" id="m-btn-next">下一季度 ▸</button>
      <button class="mobile-nav-btn" id="m-btn-save" aria-label="存档">
        <span class="nav-icon">💾</span>
        <span>存档</span>
      </button>
      <button class="mobile-nav-btn" id="m-btn-news" aria-label="新闻">
        <span class="nav-icon">📰</span>
        <span>新闻</span>
      </button>
    `;
    document.getElementById('m-btn-next').onclick = () => this.nextTurn();
    document.getElementById('m-btn-left').onclick = () => this.toggleDrawer('left-panel');
    document.getElementById('m-btn-save').onclick = () => this.showSavePanel('save');
    document.getElementById('m-btn-news').onclick = () => this.toggleDrawer('right-panel');

    // 给左右面板各加一个关闭按钮（手机端可见）
    // 注意：left-panel 在 renderLeftPanel 模板中已经自带了，这里只处理 right-panel，
    // 并且为了保险，每次都先清掉旧的再重新添加，确保不会丢失
    ['right-panel'].forEach(id => {
      const panel = document.getElementById(id);
      if (!panel) return;
      // 先移除已有的旧关闭按钮（避免重复）
      const oldBtns = panel.querySelectorAll('.mobile-close-btn');
      oldBtns.forEach(b => b.remove());
      // 在最前面插入新的关闭按钮
      const closeBtn = document.createElement('button');
      closeBtn.className = 'mobile-close-btn';
      closeBtn.innerHTML = '✕ 关闭';
      closeBtn.onclick = () => this.toggleDrawer('');
      panel.insertBefore(closeBtn, panel.firstChild);
    });
  },

  // ===== 抽屉切换（手机端） =====
  toggleDrawer(panelId) {
    const overlay = document.getElementById('drawer-overlay');
    // 先关闭所有
    document.getElementById('left-panel').classList.remove('drawer-open');
    document.getElementById('right-panel').classList.remove('drawer-open');
    overlay.classList.remove('active');
    // 如果传入了有效 panelId，则判断是否要打开
    if (panelId) {
      const panel = document.getElementById(panelId);
      if (panel) {
        panel.classList.add('drawer-open');
        overlay.classList.add('active');
      }
    }
  },

  // ===== 教程/帮助系统 =====
  showTutorial() {
    const modal = document.getElementById('tutorial-modal');
    modal.innerHTML = `
      <div style="position:fixed;inset:0;z-index:800;background:rgba(0,0,0,0.85);backdrop-filter:blur(4px);display:flex;align-items:flex-start;justify-content:center;padding:16px;overflow-y:auto;" onclick="if(event.target===this){document.getElementById('tutorial-modal').innerHTML='';}">
        <div class="tutorial-modal" style="background:var(--bg-panel);border:1px solid var(--accent-gold);border-radius:4px;max-width:600px;width:100%;max-height:88vh;overflow-y:auto;padding:24px;margin:auto;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;border-bottom:1px solid var(--border);padding-bottom:12px;">
            <h2 style="font-family:var(--font-serif);color:var(--accent-gold-bright);font-size:20px;letter-spacing:0.1em;">游戏教程</h2>
            <button onclick="document.getElementById('tutorial-modal').innerHTML='';" style="background:none;border:none;color:var(--text-muted);font-size:24px;cursor:pointer;line-height:1;">×</button>
          </div>

          <div style="color:var(--text-secondary);font-size:13px;line-height:1.8;">
            <h3 style="color:var(--accent-gold);font-family:var(--font-serif);margin:14px 0 6px;font-size:15px;">一、游戏目标</h3>
            <p>你扮演大日耳曼国权力核心的一员，从1962年希特勒垂危之际开始，在三十八年间为帝国的未来做出抉择，直到2000年迎来终局。根据你的路线与决策，将走向<strong style="color:var(--accent-gold-bright);">15种不同结局</strong>之一。</p>

            <h3 style="color:var(--accent-gold);font-family:var(--font-serif);margin:14px 0 6px;font-size:15px;">二、核心资源（顶栏）</h3>
            <p>顶部状态栏显示八项关键资源，每季度会增减：</p>
            <ul style="margin:6px 0 6px 18px;">
              <li><strong style="color:var(--text-primary);">资金</strong> — 建造与研发的基础，由民工业产出</li>
              <li><strong style="color:var(--text-primary);">人力</strong> — 建造所需，由住宅与农业产出</li>
              <li><strong style="color:var(--text-primary);">稳定</strong> — 低于0帝国崩溃，影响结局</li>
              <li><strong style="color:var(--text-primary);">威慑</strong> — 综合威慑力，过低会被敌国入侵</li>
              <li><strong style="color:var(--text-primary);">军力</strong> — 常规军事力量，由军工业产出</li>
              <li><strong style="color:var(--text-primary);">核慑</strong> — 核威慑力，由核武器设施产出</li>
              <li><strong style="color:var(--text-primary);">核弹</strong> — 核武器数量，终极威慑</li>
              <li><strong style="color:var(--text-primary);">研发</strong> — 科技研发点数，由研发中心产出</li>
            </ul>
            <p style="font-size:12px;color:var(--text-muted);">括号内的 <span style="color:var(--accent-toxic);">+数字</span> / <span style="color:var(--accent-blood-bright);">-数字</span> 表示每季度变化量。</p>

            <h3 style="color:var(--accent-gold);font-family:var(--font-serif);margin:14px 0 6px;font-size:15px;">三、工业建设（核心玩法）</h3>
            <p>切换到「工业建设」标签，可建造两类建筑：</p>
            <p style="margin:8px 0;"><strong style="color:var(--accent-steel);">民工业</strong>（蓝色边框）— 产出资金、人力、稳定、研发，保障经济：</p>
            <ul style="margin:4px 0 8px 18px;">
              <li>消费品工厂 → 资金</li>
              <li>工人住宅区 → 人力与稳定</li>
              <li>研发中心 → 研发点数</li>
              <li>基础设施 → 降低建造成本</li>
            </ul>
            <p style="margin:8px 0;"><strong style="color:var(--accent-blood-bright);">军工业</strong>（红色边框）— 产出威慑、军力、核武，震慑敌国：</p>
            <ul style="margin:4px 0 8px 18px;">
              <li>兵工厂 → 军事实力</li>
              <li>核武器设施 → 核弹与核威慑</li>
              <li>奇迹武器实验室 → 高级研发</li>
              <li>国土防空网 → 防御与威慑</li>
            </ul>
            <p style="background:rgba(168,50,50,0.1);padding:8px 12px;border-radius:2px;font-size:12px;">建议：前期平衡发展，保证资金与稳定不为负；中期重点军工业提升威慑；后期视路线决定核武或民生。</p>

            <h3 style="color:var(--accent-gold);font-family:var(--font-serif);margin:14px 0 6px;font-size:15px;">四、国策与科技</h3>
            <p><strong>国策政策</strong> — 通过立法影响帝国走向（如奴隶制存废、军事改革等），不同路线解锁不同政策。</p>
            <p><strong>科技研发</strong> — 消耗研发点数解锁永久增益，如「核聚变研究」「计算机革命」等。</p>

            <h3 style="color:var(--accent-gold);font-family:var(--font-serif);margin:14px 0 6px;font-size:15px;">五、事件与抉择</h3>
            <p>剧情事件会自动触发并弹窗，每个选择都有不同后果。关键节点：</p>
            <ul style="margin:6px 0 6px 18px;">
              <li><strong>1963 希特勒之死</strong> — 选择继任者（施佩尔/鲍曼/戈林/海德里希），决定四条路线</li>
              <li><strong>1963-65 德国内战</strong> — 勃艮第可能窃取核武器</li>
              <li><strong>1989 核危机</strong> — 午夜差一分钟，抉择决定存亡</li>
            </ul>

            <h3 style="color:var(--accent-gold);font-family:var(--font-serif);margin:14px 0 6px;font-size:15px;">六、操作方式</h3>
            <ul style="margin:6px 0 6px 18px;">
              <li><strong>电脑端</strong>：按 <code style="background:var(--bg-elevated);padding:1px 5px;border-radius:2px;">空格键</code> 推进下一季度</li>
              <li><strong>手机端</strong>：点底部「下一季度」按钮推进；点「势力」「新闻」打开侧边面板</li>
              <li>事件弹窗出现时，必须做出选择才能继续</li>
              <li>威慑过低时敌国可能入侵，稳定为负则帝国崩溃</li>
            </ul>

            <h3 style="color:var(--accent-gold);font-family:var(--font-serif);margin:14px 0 6px;font-size:15px;">七、结局判定</h3>
            <p>2000年游戏结束（或提前触发结局），根据<strong>稳定度、威慑、核弹、路线</strong>综合判定。从「帝国之春」（民主化改革成功）到「诸神黄昏」（核子末日），命运在你手中。</p>

          </div>

          <button onclick="document.getElementById('tutorial-modal').innerHTML='';" style="display:block;width:100%;margin-top:20px;padding:12px;background:linear-gradient(180deg,rgba(168,50,50,0.25),rgba(168,50,50,0.08));border:1px solid var(--accent-blood);color:var(--accent-gold-bright);font-family:var(--font-serif);font-size:15px;letter-spacing:0.15em;cursor:pointer;border-radius:2px;">明白了，开始游戏</button>
        </div>
      </div>
    `;
  },

  // ===== 标签页内容 =====
  renderTab(tab) {
    this.currentTab = tab;
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));

    const content = document.getElementById('tab-content');
    switch (tab) {
      case 'overview':
        content.innerHTML = this.renderOverview();
        break;
      case 'nation':
        content.innerHTML = this.renderNation();
        break;
      case 'world':
        content.innerHTML = this.renderWorld();
        this._bindWorld();
        break;
      case 'map':
        this._mapPostRenderBound = false;
        if (!this._tabCache.map || Game.state._dirtyMap) {
          content.innerHTML = this.renderMap();
          this._tabCache.map = { html: content.innerHTML };
          delete Game.state._dirtyMap;
        } else {
          content.innerHTML = this._tabCache.map.html;
        }
        this._bindMapPostRender.bind(this)();
        break;
      case 'industry':
        if (!this._tabCache.industry || tab === 'industry' && Game.state._dirtyIndustry) {
          content.innerHTML = this.renderIndustry();
          this._tabCache.industry = { html: content.innerHTML };
          delete Game.state._dirtyIndustry;
        } else content.innerHTML = this._tabCache.industry.html;
        break;
      case 'policy':
        content.innerHTML = this.renderPolicy();
        this._tabCache.policy = { html: content.innerHTML };
        break;
      case 'tech':
        content.innerHTML = this.renderTech();
        this._tabCache.tech = { html: content.innerHTML };
        break;
      case 'shop':
        content.innerHTML = this.renderShop();
        this._tabCache.shop = { html: content.innerHTML };
        this.bindShopEvents();
        break;
      case 'events':
        content.innerHTML = this.renderEventLog();
        this._tabCache.events = { html: content.innerHTML };
        break;
    }
    if (tab === 'shop' && !this._tabCache.shop) {
      this.bindShopEvents();
    }
  },

  // 地图渲染后的后处理：间隙、分区按钮 + Canvas初始化 + 渲染器/层级切换
  _bindMapPostRender() {
    const UI = this;
    if (this._mapPostRenderBound) return;
    this._mapPostRenderBound = true;

    setTimeout(() => {
      const container = document.querySelector('.map-container');
      if (!container) return;

      // 清理旧实例
      if (UI._svgMapInstance) { UI._svgMapInstance.destroy(); UI._svgMapInstance = null; }
      if (UI._canvasMapInstance) { UI._canvasMapInstance.destroy(); UI._canvasMapInstance = null; }

      const canvas = document.getElementById('tno-map-canvas');
      if (!canvas || typeof SVGMap === 'undefined') return;

      // 创建tooltip
      const tooltip = document.createElement('div');
      tooltip.id = 'tno-map-tooltip';
      tooltip.style.cssText = 'position:absolute;pointer-events:none;background:rgba(10,14,22,0.92);border:1px solid #4a4030;color:#f0e8c8;padding:4px 8px;border-radius:3px;font-size:11px;line-height:1.4;white-space:nowrap;display:none;z-index:5;box-shadow:0 2px 8px rgba(0,0,0,0.6);';
      container.appendChild(tooltip);

      const selector = document.getElementById('tno-map-selector');
      const lastMap = (function(){ try { return localStorage.getItem('tno_last_map') || 'einheitspakt'; } catch(_){ return 'einheitspakt'; } })();
      if (selector) selector.value = lastMap;

      UI._svgMapInstance = new SVGMap(canvas, {
        dataDir: 'data/svg_maps',
        autoLoad: false,
      });

      UI._svgMapInstance.on('hover', (evt) => {
        const f = evt && evt.feature;
        if (!f) { tooltip.style.display = 'none'; return; }
        const rect = container.getBoundingClientRect();
        tooltip.innerHTML = `<b>${f.zh}</b><br><span style="color:#a0a0b0">ID: ${f.id}</span>`;
        tooltip.style.left = Math.min(rect.width - 80, evt.x - rect.left + 12) + 'px';
        tooltip.style.top = Math.min(rect.height - 40, evt.y - rect.top + 12) + 'px';
        tooltip.style.display = 'block';
      });
      UI._svgMapInstance.on('hoverout', () => { tooltip.style.display = 'none'; });
      UI._svgMapInstance.on('click', (evt) => {
        const f = evt && evt.feature;
        if (f) UI.toast(`${f.zh} [${f.id}]`, 'info');
      });

      UI._svgMapInstance.loadMap(lastMap);

      // 地图选择器
      if (selector) {
        selector.onchange = () => {
          const mapId = selector.value;
          try { localStorage.setItem('tno_last_map', mapId); } catch(_) {}
          if (UI._svgMapInstance) UI._svgMapInstance.loadMap(mapId);
        };
      }

      // 缩放按钮
      const btnZoomIn = document.getElementById('btn-zoom-in');
      const btnZoomOut = document.getElementById('btn-zoom-out');
      const btnFit = document.getElementById('btn-zoom-fit');
      if (btnZoomIn && !btnZoomIn._bound) {
        btnZoomIn._bound = true;
        btnZoomIn.addEventListener('click', () => {
          if (UI._svgMapInstance) UI._svgMapInstance.zoomBy(1.4);
        });
      }
      if (btnZoomOut && !btnZoomOut._bound) {
        btnZoomOut._bound = true;
        btnZoomOut.addEventListener('click', () => {
          if (UI._svgMapInstance) UI._svgMapInstance.zoomBy(1 / 1.4);
        });
      }
      if (btnFit && !btnFit._bound) {
        btnFit._bound = true;
        btnFit.addEventListener('click', () => {
          if (UI._svgMapInstance) UI._svgMapInstance.zoomToFit();
        });
      }

      // 全屏按钮（优先 Fullscreen API，失败则伪全屏 fixed）
      const btnFS = document.getElementById('btn-fullscreen-map');
      const mapPageRoot = document.getElementById('map-page-root');
      function _exitFullscreen() {
        try {
          if (document.fullscreenElement) {
            document.exitFullscreen();
            return;
          }
        } catch (_) {}
        mapPageRoot && mapPageRoot.classList.remove('map-fullscreen-mode');
        btnFS && (btnFS.textContent = '⛶ 全屏');
        setTimeout(() => UI._svgMapInstance && UI._svgMapInstance.zoomToFit(), 120);
      }
      function _enterFullscreen() {
        let usedRealFS = false;
        try {
          const target = document.documentElement || mapPageRoot;
          if (target && typeof target.requestFullscreen === 'function'
              && document.fullscreenEnabled !== false) {
            target.requestFullscreen().catch(() => {
              // Fullscreen API 被拒绝（iframe/权限），降级伪全屏
              mapPageRoot && mapPageRoot.classList.add('map-fullscreen-mode');
              btnFS && (btnFS.textContent = '✕ 退出全屏');
              setTimeout(() => UI._svgMapInstance && UI._svgMapInstance.zoomToFit(), 120);
            });
            usedRealFS = true;
          }
        } catch (_) { usedRealFS = false; }
        if (!usedRealFS) {
          mapPageRoot && mapPageRoot.classList.add('map-fullscreen-mode');
          btnFS && (btnFS.textContent = '✕ 退出全屏');
          setTimeout(() => UI._svgMapInstance && UI._svgMapInstance.zoomToFit(), 120);
        }
        btnFS && (btnFS.textContent = '✕ 退出全屏');
      }
      // 监听真实全屏变化，同步按钮文字和伪全屏状态
      if (!UI._fsChangeListener) {
        UI._fsChangeListener = () => {
          if (!document.fullscreenElement
              && mapPageRoot && !mapPageRoot.classList.contains('map-fullscreen-mode')) {
            btnFS && (btnFS.textContent = '⛶ 全屏');
          }
        };
        document.addEventListener('fullscreenchange', UI._fsChangeListener);
      }
      if (btnFS && !btnFS._bound) {
        btnFS._bound = true;
        btnFS.addEventListener('click', () => {
          const fsActive = (document.fullscreenElement)
            || (mapPageRoot && mapPageRoot.classList.contains('map-fullscreen-mode'));
          if (fsActive) _exitFullscreen(); else _enterFullscreen();
        });
        // ESC 退出伪全屏
        document.addEventListener('keydown', function onKey(e) {
          if (e.key === 'Escape'
              && mapPageRoot && mapPageRoot.classList.contains('map-fullscreen-mode')) {
            _exitFullscreen();
          }
        });
      }
    }, 0);
  },

  // ===== 势力地图页 =====
  renderMap() {
    const s = Game.state || { flags: {}, relations: {}, turn: 1, totalTurns: 156 };
    const f = s.flags || {};

    // 势力详情数据 (保留在地图下方)
    const germanyColor = f.civil_war_imminent && !f.civil_war_over ? '#6a2a2a' : '#a83232';
    const germanyLabel = f.civil_war_imminent && !f.civil_war_over ? '大日耳曼国（内战）' : '大日耳曼国';
    const italyColor = f.italy_accepted || f.italy_leaves_sphere ? '#3a6a3a' : '#5a8a4a';
    const italyLabel = f.italy_accepted ? '意大利（已脱离）' : '意大利（三头同盟）';
    const burgundyColor = '#4a2a4a';
    const iberiaColor = f.iberian_collapse ? '#6a5a3a' : '#8a7a4a';

    let russiaColor = '#3a3a3a';
    let russiaLabel = '俄罗斯（分裂）';
    let russiaFragments = true;
    if (f.russia_democratic) { russiaColor = '#3a7a5a'; russiaLabel = '俄罗斯共和国'; russiaFragments = false; }
    else if (f.russia_communist) { russiaColor = '#8a2a2a'; russiaLabel = '新苏联'; russiaFragments = false; }
    else if (f.russia_fascist) { russiaColor = '#5a3a3a'; russiaLabel = '俄罗斯民族国'; russiaFragments = false; }
    else if (f.russia_madman) { russiaColor = '#2a2a2a'; russiaLabel = '摄政俄罗斯（疯狂）'; russiaFragments = false; }
    else if (f.russia_monarchist) { russiaColor = '#4a4a8a'; russiaLabel = '俄罗斯帝国'; russiaFragments = false; }

    const factionDetails = [
      { name: '大日耳曼国', rel: null, desc: germanyLabel, color: germanyColor, isPlayer: true },
      { name: '美国 (OFN)', rel: s.relations.ofn, desc: '自由世界残部，民主灯塔', color: '#3a5a8a' },
      { name: '日本', rel: s.relations.japan, desc: '共荣圈霸主，太平洋帝国', color: '#8a7a3a' },
      { name: '意大利', rel: s.relations.italy, desc: italyLabel, color: italyColor },
      { name: '勃艮第', rel: s.relations.burgundy, desc: '希姆莱的黑暗国度', color: burgundyColor },
      ...(russiaFragments ? [
        { name: '俄罗斯（军阀割据）', rel: s.relations.russia, desc: '群雄割据，前途未卜', color: russiaColor },
      ] : [
        { name: russiaLabel, rel: s.relations.russia, desc: '已统一的东方巨人', color: russiaColor },
      ]),
    ];

    const satelliteStates = [
      { name: '奥地利', color: '#6a5a7a' }, { name: '捷克斯洛伐克', color: '#7a6a5a' },
      { name: '匈牙利', color: '#7a5a5a' }, { name: '罗马尼亚', color: '#7a5a4a' },
      { name: '保加利亚', color: '#6a4a5a' }, { name: '希腊', color: '#5a6a7a' },
      { name: '伊比利亚', color: iberiaColor },
    ];

    const relText = (v) => v === null ? '—' : v <= -40 ? '敌对' : v <= -10 ? '冷淡' : v <= 10 ? '中立' : v <= 40 ? '友好' : '盟友';
    const relColor = (v) => v === null ? 'var(--text-muted)' : v <= -40 ? 'var(--accent-blood-bright)' : v <= -10 ? '#c97a3a' : v <= 10 ? 'var(--text-muted)' : v <= 40 ? 'var(--accent-toxic)' : 'var(--accent-gold-bright)';

    const factionHtml = factionDetails.map(fd => `
      <div class="faction-detail-card">
        <div class="fdc-color" style="background:${fd.color}"></div>
        <div class="fdc-info"><div class="fdc-name">${fd.name}</div><div class="fdc-desc">${fd.desc}</div></div>
        <div class="fdc-rel" style="color:${relColor(fd.rel)}">${relText(fd.rel)}${fd.rel !== null ? ` ${fd.rel > 0 ? '+' : ''}${fd.rel}` : ''}</div>
      </div>`).join('');

    const satelliteHtml = `
      <div class="satellite-group" style="margin-top:16px;padding:12px;background:var(--bg-panel);border:1px solid var(--border);border-left:3px solid var(--accent-steel);border-radius:2px;">
        <div style="font-family:var(--font-serif);color:var(--accent-gold);margin-bottom:8px;letter-spacing:0.1em;font-size:12px">帝国卫星国 / 傀儡国</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px">
          ${satelliteStates.map(s => `<div style="display:flex;align-items:center;gap:4px;padding:3px 8px;background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:2px;font-size:10px;color:var(--text-secondary)"><span style="display:inline-block;width:8px;height:8px;background:${s.color};border-radius:1px"></span>${s.name}</div>`).join('')}
        </div>
      </div>`;

    const timelineHtml = this.renderTimeline();

    // 地图选择器选项
    const mapNames = (typeof SVGMap !== 'undefined' && SVGMap.MAP_NAMES) ? SVGMap.MAP_NAMES : {
      einheitspakt: '轴心国集团（欧洲）', america: '美洲', geacs: '大东亚共荣圈',
      russia: '俄罗斯地区', south_asia: '南亚/中东', triumvirate: '三头同盟（地中海）',
      einheitspakt_afrika: '轴心非洲', west_africa: '西非', antarctica: '南极洲',
    };
    const lastMap = (function(){ try { return localStorage.getItem('tno_last_map') || 'einheitspakt'; } catch(_){ return 'einheitspakt'; } })();
    const options = Object.entries(mapNames).map(([id, name]) =>
      `<option value="${id}"${id === lastMap ? ' selected' : ''}>${name}</option>`
    ).join('');

    return `
      <div class="map-page" id="map-page-root">
        <div class="map-header">
          <h2 style="font-family:var(--font-serif);color:var(--accent-gold-bright);letter-spacing:0.1em">TNO 世界地图</h2>
          <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
            <select id="tno-map-selector" style="padding:4px 10px;background:rgba(30,35,50,0.8);color:#c0c8d0;border:1px solid #4a5a6a;border-radius:4px;font-size:12px;cursor:pointer;">${options}</select>
            <button id="btn-zoom-out" style="width:32px;height:28px;background:rgba(30,35,50,0.8);color:#c0c8d0;border:1px solid #4a5a6a;border-radius:4px;cursor:pointer;font-size:16px;font-weight:bold;display:flex;align-items:center;justify-content:center;" title="缩小">−</button>
            <button id="btn-zoom-fit" style="padding:4px 10px;background:rgba(30,35,50,0.8);color:#c0c8d0;border:1px solid #4a5a6a;border-radius:4px;cursor:pointer;font-size:12px;" title="重置视图">⤢</button>
            <button id="btn-zoom-in" style="width:32px;height:28px;background:rgba(30,35,50,0.8);color:#c0c8d0;border:1px solid #4a5a6a;border-radius:4px;cursor:pointer;font-size:16px;font-weight:bold;display:flex;align-items:center;justify-content:center;" title="放大">+</button>
            <button id="btn-fullscreen-map" style="padding:4px 10px;background:rgba(50,40,60,0.8);color:#d8c0f0;border:1px solid #6a5a8a;border-radius:4px;cursor:pointer;font-size:13px;font-weight:bold;" title="全屏显示地图">⛶ 全屏</button>
            <div style="font-size:12px;color:var(--text-muted);margin-left:8px">${Game.getDateStr()} · 回合 ${s.turn}/${s.totalTurns}</div>
          </div>
        </div>
        <div class="map-container" style="width:100%;background:#0e1520;border-radius:4px;overflow:hidden;">
          <canvas id="tno-map-canvas" style="width:100%;height:100%;display:block;touch-action:none;cursor:grab;"></canvas>
        </div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:6px;text-align:center;flex-shrink:0;">滚轮缩放 · 拖拽平移 · 点击国家查看详情 · 矢量地图 by lilaui (CC-BY-SA 3.0)</div>
        <div class="map-factions" style="flex-shrink:0;">${factionHtml}${satelliteHtml}</div>
        <div class="map-timeline-section" style="flex-shrink:0;">
          <h3 style="font-family:var(--font-serif);color:var(--accent-gold);letter-spacing:0.1em;margin-bottom:10px">历史进程</h3>
          ${timelineHtml}
        </div>
      </div>
    `;
  },

  // ===== 时间轴 =====
  renderTimeline() {
    const s = Game.state;
    const f = s.flags;

    // 关键时间节点
    const milestones = [
      { year: 1962, label: '帝国登月', triggered: true },
      { year: 1963, label: '元首之死', triggered: s.turn > 4 || f.civil_war_imminent },
      { year: 1965, label: '内战结束', triggered: f.civil_war_over },
      { year: 1968, label: '俄军阀混战', triggered: f.russia_infiltrated || f.russia_proxies || s.year >= 1968 },
      { year: 1972, label: '俄罗斯统一', triggered: f.russia_unifier !== undefined || s.year >= 1972 },
      { year: 1975, label: '冷战高潮', triggered: s.year >= 1975 },
      { year: 1981, label: '西俄战争', triggered: f.west_russian_war },
      { year: 1989, label: '核危机', triggered: s.year >= 1989 },
      { year: 1996, label: '黄昏时代', triggered: s.year >= 1996 },
      { year: 2000, label: '终局', triggered: s.year >= 2000 }
    ];

    // 当前进度百分比
    const progressPct = Math.min(100, ((s.turn - 1) / s.totalTurns) * 100);

    const milestoneHtml = milestones.map(m => {
      const milestonePct = ((m.year - 1962) / 38) * 100;
      const isPast = s.year > m.year || (s.year === m.year && m.triggered);
      const isCurrent = s.year === m.year && !m.triggered;
      const cls = isPast ? 'past' : (isCurrent ? 'current' : 'future');
      return `
        <div class="timeline-milestone ${cls}" style="left:${milestonePct}%">
          <div class="tm-dot"></div>
          <div class="tm-label">${m.year}</div>
          <div class="tm-desc">${m.label}</div>
        </div>
      `;
    }).join('');

    return `
      <div class="timeline-container">
        <div class="timeline-bar">
          <div class="timeline-progress" style="width:${progressPct}%"></div>
          <div class="timeline-marker" style="left:${progressPct}%">
            <div class="tm-current">${s.year}Q${s.quarter}</div>
          </div>
          ${milestoneHtml}
        </div>
        <div class="timeline-labels">
          <span>1962</span>
          <span>1981</span>
          <span>2000</span>
        </div>
      </div>
    `;
  },

  // ===== 世界页 (全国家虚拟滚动列表) =====
  renderWorld() {
    if (!this._worldData) {
      this._worldData = this._buildWorldData();
    }
    const data = this._worldData;
    const total = data.length;

    return `
      <div class="world-container" style="padding:0;height:calc(100vh - 180px);display:flex;flex-direction:column;">
        <div class="world-toolbar" style="padding:12px 16px;border-bottom:1px solid var(--border);display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
          <input id="world-search" type="text" placeholder="搜索国家名/缩写..." style="flex:1;min-width:180px;padding:8px 12px;background:var(--bg-secondary);border:1px solid var(--border);color:var(--text);border-radius:6px;font-size:13px;outline:none;" />
          <div id="world-filters" style="display:flex;gap:6px;flex-wrap:wrap;"></div>
          <span id="world-count" style="color:var(--text-muted);font-size:12px;margin-left:auto;"></span>
        </div>
        <div id="world-virtual-scroll" style="flex:1;overflow-y:auto;position:relative;">
          <div id="world-spacer" style="position:relative;"></div>
        </div>
        <!-- 国家详情全屏模态（带遮罩，z-index 9999） -->
        <div id="world-detail-mask" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:9998;backdrop-filter:blur(2px);"
             onclick="var el=document.getElementById('world-detail');el&&(el.style.display='none');this.style.display='none'"></div>
        <div id="world-detail" style="display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:min(520px,92vw);max-height:min(80vh,720px);background:var(--bg-secondary);border:1px solid var(--accent-steel);padding:18px;overflow-y:auto;z-index:9999;border-radius:10px;box-shadow:0 8px 40px rgba(0,0,0,0.6);"></div>
      </div>
    `;
  },

  _buildWorldData() {
    const major = [
      { id:'GER', name:'大日耳曼国', short:'德国', flag:'#a83232', sphere:'pakt', tier:'major', capital:'日耳曼尼亚', leader:'阿登纳' },
      { id:'USA', name:'美利坚合众国', short:'美国', flag:'#3a6a9a', sphere:'ofn', tier:'major', capital:'华盛顿', leader:'尼克松' },
      { id:'JAP', name:'大日本帝国', short:'日本', flag:'#d8d0a8', sphere:'japanese_sphere', tier:'major', capital:'东京', leader:'昭和天皇' },
      { id:'ITA', name:'意大利帝国', short:'意大利', flag:'#b0a060', sphere:'italian_sphere', tier:'major', capital:'罗马', leader:'墨索里尼' },
      { id:'BUR', name:'勃艮第骑士团国', short:'勃艮第', flag:'#3a1a3a', sphere:'pakt', tier:'major', capital:'南锡', leader:'希姆莱' },
      { id:'RUS', name:'俄罗斯诸军阀', short:'俄罗斯', flag:'#7a3a3a', sphere:'none', tier:'major', capital:'莫斯科', leader:'—' },
    ];
    const regional = [
      { id:'CAN', name:'加拿大', short:'加拿大', flag:'#d40000', sphere:'ofn', tier:'regional', capital:'渥太华', leader:'迪芬贝克' },
      { id:'MEX', name:'墨西哥合众国', short:'墨西哥', flag:'#006847', sphere:'none', tier:'regional', capital:'墨西哥城', leader:'鲁伊斯' },
      { id:'BRA', name:'巴西联邦共和国', short:'巴西', flag:'#009c3b', sphere:'none', tier:'regional', capital:'巴西利亚', leader:'库比契克' },
      { id:'ARG', name:'阿根廷共和国', short:'阿根廷', flag:'#74acdf', sphere:'none', tier:'regional', capital:'布宜诺斯艾利斯', leader:'弗朗迪西' },
      { id:'AUS', name:'澳大利亚联邦', short:'澳大利亚', flag:'#00008b', sphere:'ofn', tier:'regional', capital:'堪培拉', leader:'孟席斯' },
      { id:'IND', name:'印度共和国', short:'印度', flag:'#ff9933', sphere:'none', tier:'regional', capital:'新德里', leader:'尼赫鲁' },
      { id:'CHI', name:'中华民国', short:'中国', flag:'#fe0000', sphere:'japanese_sphere', tier:'regional', capital:'南京', leader:'蒋介石' },
      { id:'SAU', name:'沙特阿拉伯王国', short:'沙特', flag:'#006c35', sphere:'none', tier:'regional', capital:'利雅得', leader:'阿卜杜勒-阿齐兹' },
      { id:'IRN', name:'伊朗王国', short:'伊朗', flag:'#239f40', sphere:'pakt', tier:'regional', capital:'德黑兰', leader:'巴列维' },
      { id:'TUR', name:'土耳其共和国', short:'土耳其', flag:'#e30a17', sphere:'italian_sphere', tier:'regional', capital:'安卡拉', leader:'古尔特' },
      { id:'EGY', name:'埃及王国', short:'埃及', flag:'#ce1126', sphere:'italian_sphere', tier:'regional', capital:'开罗', leader:'纳赛尔' },
      { id:'ETH', name:'埃塞俄比亚帝国', short:'埃塞俄比亚', flag:'#ffcc00', sphere:'italian_sphere', tier:'regional', capital:'亚的斯亚贝巴', leader:'海尔·塞拉西' },
      { id:'THA', name:'暹罗王国', short:'泰国', flag:'#a51931', sphere:'japanese_sphere', tier:'regional', capital:'曼谷', leader:'普密蓬' },
      { id:'IDN', name:'印度尼西亚共和国', short:'印尼', flag:'#ff0000', sphere:'japanese_sphere', tier:'regional', capital:'雅加达', leader:'苏加诺' },
      { id:'VNM', name:'越南帝国', short:'越南', flag:'#ffcc00', sphere:'japanese_sphere', tier:'regional', capital:'顺化', leader:'保大' },
      { id:'KHM', name:'柬埔寨王国', short:'柬埔寨', flag:'#033ea0', sphere:'japanese_sphere', tier:'regional', capital:'金边', leader:'西哈努克' },
      { id:'MMR', name:'缅甸联邦', short:'缅甸', flag:'#fecb00', sphere:'japanese_sphere', tier:'regional', capital:'仰光', leader:'吴努' },
      { id:'MNG', name:'蒙古人民共和国', short:'蒙古', flag:'#c41230', sphere:'japanese_sphere', tier:'regional', capital:'乌兰巴托', leader:'泽登巴尔' },
      { id:'PAK', name:'巴基斯坦', short:'巴基斯坦', flag:'#01411c', sphere:'none', tier:'regional', capital:'伊斯兰堡', leader:'阿尤布·汗' },
      { id:'GBR', name:'联合王国', short:'英国', flag:'#012169', sphere:'pakt', tier:'regional', capital:'伦敦', leader:'伊丽莎白二世' },
      { id:'FRA', name:'法国', short:'法国', flag:'#002654', sphere:'pakt', tier:'regional', capital:'巴黎', leader:'贝当' },
      { id:'ESP', name:'西班牙国', short:'西班牙', flag:'#aa151b', sphere:'pakt', tier:'regional', capital:'马德里', leader:'佛朗哥' },
      { id:'PRT', name:'葡萄牙', short:'葡萄牙', flag:'#006600', sphere:'pakt', tier:'regional', capital:'里斯本', leader:'萨拉查' },
      { id:'POL', name:'波兰共和国', short:'波兰', flag:'#dc143c', sphere:'pakt', tier:'regional', capital:'华沙', leader:'—' },
      { id:'HUN', name:'匈牙利', short:'匈牙利', flag:'#477056', sphere:'pakt', tier:'regional', capital:'布达佩斯', leader:'—' },
      { id:'SWE', name:'瑞典王国', short:'瑞典', flag:'#006aa7', sphere:'none', tier:'regional', capital:'斯德哥尔摩', leader:'古斯塔夫六世' },
      { id:'FIN', name:'芬兰共和国', short:'芬兰', flag:'#003580', sphere:'pakt', tier:'regional', capital:'赫尔辛基', leader:'—' },
      { id:'CHL', name:'智利共和国', short:'智利', flag:'#0039a6', sphere:'none', tier:'regional', capital:'圣地亚哥', leader:'伊瓦涅斯' },
      { id:'COL', name:'哥伦比亚共和国', short:'哥伦比亚', flag:'#fcd116', sphere:'none', tier:'regional', capital:'波哥大', leader:'卡马戈' },
      { id:'CUB', name:'古巴共和国', short:'古巴', flag:'#002a8f', sphere:'none', tier:'regional', capital:'哈瓦那', leader:'—' },
      { id:'NLD', name:'尼德兰', short:'荷兰', flag:'#ae1c28', sphere:'pakt', tier:'regional', capital:'阿姆斯特丹', leader:'—' },
      { id:'BEL', name:'比利时', short:'比利时', flag:'#000000', sphere:'pakt', tier:'regional', capital:'布鲁塞尔', leader:'—' },
    ];
    const minor = [
      { id:'AFG', name:'阿富汗王国', short:'阿富汗', flag:'#006666', sphere:'none', tier:'minor', capital:'喀布尔', leader:'查希尔沙' },
      { id:'ALB', name:'阿尔巴尼亚王国', short:'阿尔巴尼亚', flag:'#c0392b', sphere:'italian_sphere', tier:'minor', capital:'地拉那', leader:'—' },
      { id:'AND', name:'安道尔公国', short:'安道尔', flag:'#00159b', sphere:'pakt', tier:'minor', capital:'安道尔城', leader:'—' },
      { id:'ARG_ANT', name:'阿根廷南极', short:'阿属南极', flag:'#74acdf', sphere:'none', tier:'minor', capital:'—', leader:'—' },
      { id:'AAB', name:'南极古腾堡基地', short:'古腾堡', flag:'#2a2a2a', sphere:'pakt', tier:'minor', capital:'—', leader:'—' },
      { id:'AAJ', name:'日本南极', short:'日属南极', flag:'#d8d0a8', sphere:'japanese_sphere', tier:'minor', capital:'昭和基地', leader:'—' },
      { id:'AAO', name:'OFN南极', short:'美属南极', flag:'#3a6a9a', sphere:'ofn', tier:'minor', capital:'麦克默多', leader:'—' },
      { id:'AAB_ANT', name:'勃艮第南极', short:'勃属南极', flag:'#3a1a3a', sphere:'pakt', tier:'minor', capital:'—', leader:'—' },
      { id:'AAF', name:'法属南半球', short:'法属南极', flag:'#002654', sphere:'pakt', tier:'minor', capital:'—', leader:'—' },
      { id:'AAB_GER', name:'德国新斯瓦比亚', short:'新斯瓦比亚', flag:'#4a4a4a', sphere:'pakt', tier:'minor', capital:'—', leader:'—' },
      { id:'AAG', name:'德国南极探险', short:'南极探险', flag:'#2a2a2a', sphere:'pakt', tier:'minor', capital:'—', leader:'—' },
      { id:'AZE', name:'阿塞拜疆', short:'阿塞拜疆', flag:'#0098c3', sphere:'pakt', tier:'minor', capital:'巴库', leader:'—' },
      { id:'ARM', name:'亚美尼亚', short:'亚美尼亚', flag:'#d60000', sphere:'pakt', tier:'minor', capital:'埃里温', leader:'—' },
      { id:'AUT', name:'奥地利', short:'奥地利', flag:'#ed2939', sphere:'none', tier:'minor', capital:'维也纳', leader:'—' },
      { id:'AYR', name:'艾尔苏丹国', short:'艾尔', flag:'#ffcc00', sphere:'none', tier:'minor', capital:'阿加德兹', leader:'易卜拉欣' },
      { id:'BAH', name:'巴哈马', short:'巴哈马', flag:'#002a8f', sphere:'ofn', tier:'minor', capital:'拿骚', leader:'—' },
      { id:'BEL_AFR', name:'比属刚果', short:'比属刚果', flag:'#000000', sphere:'pakt', tier:'minor', capital:'利奥波德维尔', leader:'—' },
      { id:'BEN', name:'达荷美共和国', short:'达荷美', flag:'#ffcc00', sphere:'none', tier:'minor', capital:'波多诺伏', leader:'—' },
      { id:'BHT', name:'不丹王国', short:'不丹', flag:'#f47920', sphere:'japanese_sphere', tier:'minor', capital:'廷布', leader:'旺楚克' },
      { id:'BLR', name:'白俄罗斯', short:'白俄罗斯', flag:'#ce1720', sphere:'pakt', tier:'minor', capital:'明斯克', leader:'—' },
      { id:'BLZ', name:'英属洪都拉斯', short:'英属洪都拉斯', flag:'#002a8f', sphere:'ofn', tier:'minor', capital:'贝尔莫潘', leader:'—' },
      { id:'BOL', name:'玻利维亚共和国', short:'玻利维亚', flag:'#ffcc00', sphere:'none', tier:'minor', capital:'拉巴斯', leader:'特拉萨斯' },
      { id:'BWA', name:'贝专纳', short:'贝专纳', flag:'#ffcc00', sphere:'pakt', tier:'minor', capital:'哈博罗内', leader:'—' },
      { id:'BRB', name:'巴巴多斯', short:'巴巴多斯', flag:'#002a8f', sphere:'ofn', tier:'minor', capital:'布里奇敦', leader:'—' },
      { id:'BRY', name:'布里亚特', short:'布里亚特', flag:'#6a3a3a', sphere:'none', tier:'minor', capital:'乌兰乌德', leader:'—' },
      { id:'BUL', name:'保加利亚沙皇国', short:'保加利亚', flag:'#00966e', sphere:'pakt', tier:'minor', capital:'索非亚', leader:'—' },
      { id:'CAF', name:'中非共和国', short:'中非', flag:'#00209f', sphere:'pakt', tier:'minor', capital:'班加西', leader:'—' },
      { id:'CAN_AFR', name:'喀麦隆', short:'喀麦隆', flag:'#009a44', sphere:'pakt', tier:'minor', capital:'雅温得', leader:'—' },
      { id:'CHD', name:'乍得', short:'乍得', flag:'#00209f', sphere:'pakt', tier:'minor', capital:'恩贾梅纳', leader:'—' },
      { id:'CHT', name:'赤塔', short:'赤塔', flag:'#6a5a3a', sphere:'none', tier:'minor', capital:'赤塔', leader:'—' },
      { id:'CIV', name:'象牙海岸', short:'象牙海岸', flag:'#ffcc00', sphere:'none', tier:'minor', capital:'阿比让', leader:'—' },
      { id:'CMR', name:'喀麦隆', short:'喀麦隆', flag:'#009a44', sphere:'pakt', tier:'minor', capital:'雅温得', leader:'—' },
      { id:'COD', name:'刚果民主共和国', short:'刚果金', flag:'#007bff', sphere:'pakt', tier:'minor', capital:'金沙萨', leader:'—' },
      { id:'COG', name:'刚果共和国', short:'刚果布', flag:'#009a44', sphere:'pakt', tier:'minor', capital:'布拉柴维尔', leader:'—' },
      { id:'CRI', name:'哥斯达黎加', short:'哥斯达黎加', flag:'#002a8f', sphere:'none', tier:'minor', capital:'圣何塞', leader:'—' },
      { id:'CRO', name:'克罗地亚王国', short:'克罗地亚', flag:'#003893', sphere:'pakt', tier:'minor', capital:'萨格勒布', leader:'—' },
      { id:'CUB_ANT', name:'智利南极', short:'智属南极', flag:'#0039a6', sphere:'none', tier:'minor', capital:'—', leader:'—' },
      { id:'CZE', name:'捷克斯洛伐克', short:'捷克斯洛伐克', flag:'#0060b5', sphere:'pakt', tier:'minor', capital:'布拉格', leader:'—' },
      { id:'DEU_ORG', name:'德意志骑士团国', short:'骑士团国', flag:'#4a2a4a', sphere:'pakt', tier:'minor', capital:'—', leader:'—' },
      { id:'DJI', name:'法属阿法尔', short:'吉布提', flag:'#003da5', sphere:'italian_sphere', tier:'minor', capital:'吉布提市', leader:'—' },
      { id:'DNK', name:'丹麦王国', short:'丹麦', flag:'#c8102e', sphere:'pakt', tier:'minor', capital:'哥本哈根', leader:'弗雷德里克九世' },
      { id:'DOM', name:'多米尼加共和国', short:'多米尼加', flag:'#002a8f', sphere:'none', tier:'minor', capital:'圣多明各', leader:'—' },
      { id:'ECU', name:'厄瓜多尔共和国', short:'厄瓜多尔', flag:'#ffcc00', sphere:'none', tier:'minor', capital:'基多', leader:'—' },
      { id:'ERI', name:'厄立特里亚', short:'厄立特里亚', flag:'#003da5', sphere:'italian_sphere', tier:'minor', capital:'阿斯马拉', leader:'—' },
      { id:'ESP_AFR', name:'西属撒哈拉', short:'西撒哈拉', flag:'#aa151b', sphere:'pakt', tier:'minor', capital:'—', leader:'—' },
      { id:'EST', name:'爱沙尼亚', short:'爱沙尼亚', flag:'#72c2ce', sphere:'pakt', tier:'minor', capital:'塔林', leader:'—' },
      { id:'ETH_COL', name:'意属埃塞俄比亚', short:'意属埃塞俄比亚', flag:'#008c45', sphere:'italian_sphere', tier:'minor', capital:'亚的斯亚贝巴', leader:'—' },
      { id:'FAR', name:'法罗群岛', short:'法罗群岛', flag:'#006aa7', sphere:'ofn', tier:'minor', capital:'托尔斯港', leader:'—' },
      { id:'FAV', name:'自由飞行员', short:'自由飞行员', flag:'#4a5a3a', sphere:'none', tier:'minor', capital:'苏尔古特', leader:'—' },
      { id:'FJI', name:'斐济群岛', short:'斐济', flag:'#002a8f', sphere:'ofn', tier:'minor', capital:'苏瓦', leader:'—' },
      { id:'FIN', name:'芬兰共和国', short:'芬兰', flag:'#003580', sphere:'pakt', tier:'minor', capital:'赫尔辛基', leader:'—' },
      { id:'FRA_COL', name:'法属马达加斯加', short:'法属马达加斯加', flag:'#002654', sphere:'pakt', tier:'minor', capital:'塔那那利佛', leader:'—' },
      { id:'FSA', name:'自由沙特', short:'自由沙特', flag:'#ffcc00', sphere:'none', tier:'minor', capital:'—', leader:'—' },
      { id:'GAB', name:'加蓬', short:'加蓬', flag:'#009a44', sphere:'pakt', tier:'minor', capital:'利伯维尔', leader:'—' },
      { id:'GBR_COL', name:'英属圭亚那', short:'英属圭亚那', flag:'#002a8f', sphere:'pakt', tier:'minor', capital:'乔治敦', leader:'—' },
      { id:'GBR_HON', name:'英属洪都拉斯', short:'英属洪都拉斯', flag:'#002a8f', sphere:'ofn', tier:'minor', capital:'—', leader:'—' },
      { id:'GER_NLD', name:'尼德兰专员辖区', short:'尼德兰专员辖区', flag:'#aa2222', sphere:'pakt', tier:'minor', capital:'阿姆斯特丹', leader:'—' },
      { id:'GER_NOR', name:'挪威专员辖区', short:'挪威专员辖区', flag:'#aa2222', sphere:'pakt', tier:'minor', capital:'奥斯陆', leader:'—' },
      { id:'GER_OST', name:'东方专员辖区', short:'东方专员辖区', flag:'#aa2222', sphere:'pakt', tier:'minor', capital:'里加', leader:'—' },
      { id:'GER_UKR', name:'乌克兰专员辖区', short:'乌克兰专员辖区', flag:'#aa2222', sphere:'pakt', tier:'minor', capital:'基辅', leader:'—' },
      { id:'GER_MOS', name:'莫斯科专员辖区', short:'莫斯科专员辖区', flag:'#aa2222', sphere:'pakt', tier:'minor', capital:'莫斯科', leader:'—' },
      { id:'GER_KAU', name:'高加索专员辖区', short:'高加索专员辖区', flag:'#aa2222', sphere:'pakt', tier:'minor', capital:'第比利斯', leader:'—' },
      { id:'GER_OSTAF', name:'东非专员辖区', short:'东非专员辖区', flag:'#aa2222', sphere:'pakt', tier:'minor', capital:'布勒尔施塔特', leader:'—' },
      { id:'GER_SDAF', name:'西南非专员辖区', short:'西南非专员辖区', flag:'#aa2222', sphere:'pakt', tier:'minor', capital:'温得和克', leader:'—' },
      { id:'GER_ZENTRAAF', name:'中非专员辖区', short:'中非专员辖区', flag:'#aa2222', sphere:'pakt', tier:'minor', capital:'利奥波德维尔', leader:'—' },
      { id:'GER_RUSLAND', name:'俄罗斯专员辖区', short:'俄罗斯专员辖区', flag:'#aa2222', sphere:'pakt', tier:'minor', capital:'莫斯科', leader:'—' },
      { id:'GHA', name:'加纳共和国', short:'加纳', flag:'#ff0000', sphere:'none', tier:'minor', capital:'阿克拉', leader:'恩克鲁玛' },
      { id:'GIN', name:'几内亚共和国', short:'几内亚', flag:'#ff0000', sphere:'none', tier:'minor', capital:'科纳克里', leader:'塞古·杜尔' },
      { id:'GNB', name:'几内亚比绍', short:'几比', flag:'#00853f', sphere:'none', tier:'minor', capital:'比绍', leader:'—' },
      { id:'GOL', name:'黄金海岸', short:'黄金海岸', flag:'#ffcc00', sphere:'ofn', tier:'minor', capital:'阿克拉', leader:'—' },
      { id:'GRC', name:'希腊王国', short:'希腊', flag:'#0d5eaf', sphere:'italian_sphere', tier:'minor', capital:'雅典', leader:'保罗一世' },
      { id:'GUA', name:'危地马拉共和国', short:'危地马拉', flag:'#0060b5', sphere:'none', tier:'minor', capital:'危地马拉城', leader:'—' },
      { id:'GUC', name:'法属圭亚那', short:'法属圭亚那', flag:'#002654', sphere:'pakt', tier:'minor', capital:'卡宴', leader:'—' },
      { id:'GUY', name:'圭亚那合作共和国', short:'圭亚那', flag:'#009c3b', sphere:'none', tier:'minor', capital:'乔治敦', leader:'—' },
      { id:'HAI', name:'海地共和国', short:'海地', flag:'#00209f', sphere:'ofn', tier:'minor', capital:'太子港', leader:'—' },
      { id:'HND', name:'洪都拉斯共和国', short:'洪都拉斯', flag:'#0060b5', sphere:'none', tier:'minor', capital:'特古西加尔巴', leader:'—' },
      { id:'HUN', name:'匈牙利王国', short:'匈牙利', flag:'#ed2939', sphere:'pakt', tier:'minor', capital:'布达佩斯', leader:'—' },
      { id:'ICE', name:'冰岛共和国', short:'冰岛', flag:'#004080', sphere:'ofn', tier:'minor', capital:'雷克雅未克', leader:'—' },
      { id:'IND_COL', name:'英属印度', short:'英属印度', flag:'#ffcc00', sphere:'ofn', tier:'minor', capital:'新德里', leader:'—' },
      { id:'IND_FRA', name:'法属印度', short:'法属印度', flag:'#002654', sphere:'pakt', tier:'minor', capital:'本地治里', leader:'—' },
      { id:'IND_PRT', name:'葡属印度', short:'葡属印度', flag:'#006600', sphere:'pakt', tier:'minor', capital:'果阿', leader:'—' },
      { id:'IRE', name:'爱尔兰共和国', short:'爱尔兰', flag:'#169b62', sphere:'ofn', tier:'minor', capital:'都柏林', leader:'—' },
      { id:'ITA_COL', name:'意属非洲', short:'意属非洲', flag:'#008c45', sphere:'italian_sphere', tier:'minor', capital:'—', leader:'—' },
      { id:'JAM', name:'牙买加', short:'牙买加', flag:'#009a44', sphere:'ofn', tier:'minor', capital:'金斯顿', leader:'—' },
      { id:'JOR', name:'约旦哈希姆王国', short:'约旦', flag:'#ffcc00', sphere:'italian_sphere', tier:'minor', capital:'安曼', leader:'侯赛因' },
      { id:'KAS', name:'克什米尔', short:'克什米尔', flag:'#ffcc00', sphere:'none', tier:'minor', capital:'—', leader:'—' },
      { id:'KAZ', name:'哈萨克苏维埃社会主义共和国', short:'哈萨克', flag:'#d8d0a8', sphere:'none', tier:'minor', capital:'阿拉木图', leader:'—' },
      { id:'KEN', name:'肯尼亚', short:'肯尼亚', flag:'#bb0000', sphere:'pakt', tier:'minor', capital:'内罗毕', leader:'—' },
      { id:'KHM', name:'高棉共和国', short:'高棉', flag:'#033ea0', sphere:'japanese_sphere', tier:'minor', capital:'金边', leader:'西哈努克' },
      { id:'KOR_ANT', name:'韩国', short:'韩国', flag:'#003478', sphere:'ofn', tier:'minor', capital:'首尔', leader:'李承晚' },
      { id:'KWT', name:'科威特王国', short:'科威特', flag:'#ffcc00', sphere:'none', tier:'minor', capital:'科威特城', leader:'—' },
      { id:'LAO', name:'老挝王国', short:'老挝', flag:'#002d62', sphere:'japanese_sphere', tier:'minor', capital:'万象', leader:'西萨旺' },
      { id:'LBN', name:'黎巴嫩共和国', short:'黎巴嫩', flag:'#ed1c24', sphere:'italian_sphere', tier:'minor', capital:'贝鲁特', leader:'—' },
      { id:'LBR', name:'利比里亚共和国', short:'利比里亚', flag:'#c8102e', sphere:'ofn', tier:'minor', capital:'蒙罗维亚', leader:'—' },
      { id:'LBY', name:'利比亚王国', short:'利比亚', flag:'#ffcc00', sphere:'italian_sphere', tier:'minor', capital:'的黎波里', leader:'—' },
      { id:'LIE', name:'列支敦士登公国', short:'列支敦士登', flag:'#002b5c', sphere:'pakt', tier:'minor', capital:'瓦杜兹', leader:'弗朗茨·约瑟夫' },
      { id:'LTU', name:'立陶宛', short:'立陶宛', flag:'#f3b400', sphere:'pakt', tier:'minor', capital:'维尔纽斯', leader:'—' },
      { id:'LUX', name:'卢森堡', short:'卢森堡', flag:'#ed1c24', sphere:'pakt', tier:'minor', capital:'卢森堡城', leader:'—' },
      { id:'LV', name:'拉脱维亚', short:'拉脱维亚', flag:'#9e1b34', sphere:'pakt', tier:'minor', capital:'里加', leader:'—' },
      { id:'MAD', name:'马达加斯加', short:'马达加斯加', flag:'#ffcc00', sphere:'pakt', tier:'minor', capital:'塔那那利佛', leader:'—' },
      { id:'MAG', name:'马加丹', short:'马加丹', flag:'#5a5a5a', sphere:'japanese_sphere', tier:'minor', capital:'马加丹', leader:'—' },
      { id:'MAR', name:'摩洛哥王国', short:'摩洛哥', flag:'#c1272d', sphere:'pakt', tier:'minor', capital:'拉巴特', leader:'穆罕默德五世' },
      { id:'MHL', name:'马绍尔群岛', short:'马绍尔', flag:'#002a8f', sphere:'ofn', tier:'minor', capital:'马朱罗', leader:'—' },
      { id:'MKD', name:'马其顿', short:'马其顿', flag:'#ffcc00', sphere:'none', tier:'minor', capital:'斯科普里', leader:'—' },
      { id:'MLI', name:'马里共和国', short:'马里', flag:'#00853f', sphere:'none', tier:'minor', capital:'巴马科', leader:'莫迪博·凯塔' },
      { id:'MMR_ANT', name:'缅甸', short:'缅甸', flag:'#fecb00', sphere:'japanese_sphere', tier:'minor', capital:'仰光', leader:'吴努' },
      { id:'MNE', name:'黑山王国', short:'黑山', flag:'#c8102e', sphere:'italian_sphere', tier:'minor', capital:'采蒂涅', leader:'—' },
      { id:'MON', name:'摩纳哥公国', short:'摩纳哥', flag:'#b0a060', sphere:'pakt', tier:'minor', capital:'摩纳哥城', leader:'雷尼尔三世' },
      { id:'MOZ', name:'莫桑比克', short:'莫桑比克', flag:'#ffcc00', sphere:'pakt', tier:'minor', capital:'马普托', leader:'—' },
      { id:'MRT', name:'毛里求斯', short:'毛里求斯', flag:'#ffcc00', sphere:'pakt', tier:'minor', capital:'路易港', leader:'—' },
      { id:'MWI', name:'马拉维', short:'马拉维', flag:'#ffcc00', sphere:'pakt', tier:'minor', capital:'利隆圭', leader:'—' },
      { id:'NAM', name:'西南非洲', short:'西南非洲', flag:'#ffcc00', sphere:'pakt', tier:'minor', capital:'温得和克', leader:'—' },
      { id:'NCL', name:'新喀里多尼亚', short:'新喀里多尼亚', flag:'#002654', sphere:'pakt', tier:'minor', capital:'努美阿', leader:'—' },
      { id:'NER', name:'尼日尔共和国', short:'尼日尔', flag:'#ffcc00', sphere:'none', tier:'minor', capital:'尼亚美', leader:'—' },
      { id:'NIC', name:'尼加拉瓜共和国', short:'尼加拉瓜', flag:'#002a8f', sphere:'none', tier:'minor', capital:'马那瓜', leader:'—' },
      { id:'NLD_ANT', name:'荷属安的列斯', short:'荷属安的列斯', flag:'#ae1c28', sphere:'ofn', tier:'minor', capital:'威廉斯塔德', leader:'—' },
      { id:'NRU', name:'瑙鲁共和国', short:'瑙鲁', flag:'#002a8f', sphere:'ofn', tier:'minor', capital:'亚伦', leader:'—' },
      { id:'NZL', name:'新西兰自治领', short:'新西兰', flag:'#00008b', sphere:'ofn', tier:'minor', capital:'惠灵顿', leader:'—' },
      { id:'OMA', name:'马斯喀特苏丹国', short:'马斯喀特', flag:'#ffcc00', sphere:'italian_sphere', tier:'minor', capital:'马斯喀特', leader:'赛义德·本·泰穆尔' },
      { id:'OMN', name:'阿曼', short:'阿曼', flag:'#ffcc00', sphere:'italian_sphere', tier:'minor', capital:'马斯喀特', leader:'—' },
      { id:'PAK_ANT', name:'巴基斯坦', short:'巴基斯坦', flag:'#01411c', sphere:'none', tier:'minor', capital:'伊斯兰堡', leader:'阿尤布·汗' },
      { id:'PAN', name:'巴拿马共和国', short:'巴拿马', flag:'#002a8f', sphere:'none', tier:'minor', capital:'巴拿马城', leader:'—' },
      { id:'PER', name:'秘鲁共和国', short:'秘鲁', flag:'#d91023', sphere:'none', tier:'minor', capital:'利马', leader:'普拉多' },
      { id:'PHI', name:'菲律宾共和国', short:'菲律宾', flag:'#0038a8', sphere:'japanese_sphere', tier:'minor', capital:'马尼拉', leader:'马科斯' },
      { id:'PNG', name:'巴布亚新几内亚', short:'巴新', flag:'#009a44', sphere:'ofn', tier:'minor', capital:'莫尔兹比港', leader:'—' },
      { id:'PRK', name:'朝鲜民主主义人民共和国', short:'朝鲜', flag:'#024fa2', sphere:'none', tier:'minor', capital:'平壤', leader:'—' },
      { id:'PRT_AFR', name:'葡属非洲', short:'葡属非洲', flag:'#006600', sphere:'pakt', tier:'minor', capital:'—', leader:'—' },
      { id:'PRY', name:'巴拉圭共和国', short:'巴拉圭', flag:'#009c3b', sphere:'none', tier:'minor', capital:'亚松森', leader:'莫里尼戈' },
      { id:'PSE', name:'耶路撒冷', short:'耶路撒冷', flag:'#ffcc00', sphere:'italian_sphere', tier:'minor', capital:'耶路撒冷', leader:'—' },
      { id:'QAT', name:'卡塔尔', short:'卡塔尔', flag:'#ffcc00', sphere:'none', tier:'minor', capital:'多哈', leader:'—' },
      { id:'ROU', name:'罗马尼亚王国', short:'罗马尼亚', flag:'#002b7f', sphere:'pakt', tier:'minor', capital:'布加勒斯特', leader:'—' },
      { id:'RWA', name:'卢旺达', short:'卢旺达', flag:'#ffcc00', sphere:'pakt', tier:'minor', capital:'基加利', leader:'—' },
      { id:'SAU_ANT', name:'沙特', short:'沙特', flag:'#006c35', sphere:'none', tier:'minor', capital:'利雅得', leader:'—' },
      { id:'SEN', name:'塞内加尔', short:'塞内加尔', flag:'#00853f', sphere:'none', tier:'minor', capital:'达喀尔', leader:'桑戈尔' },
      { id:'SLV', name:'萨尔瓦多共和国', short:'萨尔瓦多', flag:'#0060b5', sphere:'none', tier:'minor', capital:'圣萨尔瓦多', leader:'—' },
      { id:'SLB', name:'所罗门群岛', short:'所罗门群岛', flag:'#002a8f', sphere:'ofn', tier:'minor', capital:'霍尼亚拉', leader:'—' },
      { id:'SLE', name:'塞拉利昂', short:'塞拉利昂', flag:'#007ad9', sphere:'none', tier:'minor', capital:'弗里敦', leader:'—' },
      { id:'SLO', name:'斯洛伐克共和国', short:'斯洛伐克', flag:'#0b4ea2', sphere:'pakt', tier:'minor', capital:'布拉迪斯拉发', leader:'—' },
      { id:'SOM', name:'索马里', short:'索马里', flag:'#003da5', sphere:'italian_sphere', tier:'minor', capital:'摩加迪沙', leader:'—' },
      { id:'SRB', name:'塞尔维亚', short:'塞尔维亚', flag:'#c0392b', sphere:'pakt', tier:'minor', capital:'贝尔格莱德', leader:'—' },
      { id:'SSD', name:'南苏丹', short:'南苏丹', flag:'#ffcc00', sphere:'none', tier:'minor', capital:'朱巴', leader:'—' },
      { id:'SGP', name:'新加坡自治邦', short:'新加坡', flag:'#ef3340', sphere:'japanese_sphere', tier:'minor', capital:'新加坡', leader:'李光耀' },
      { id:'SUI', name:'瑞士联邦', short:'瑞士', flag:'#d52b1e', sphere:'none', tier:'minor', capital:'伯尔尼', leader:'—' },
      { id:'SUR', name:'苏里南共和国', short:'苏里南', flag:'#007a45', sphere:'ofn', tier:'minor', capital:'帕拉马里博', leader:'—' },
      { id:'SWE_ANT', name:'瑞典', short:'瑞典', flag:'#006aa7', sphere:'none', tier:'minor', capital:'斯德哥尔摩', leader:'古斯塔夫六世' },
      { id:'SWZ', name:'斯威士兰', short:'斯威士兰', flag:'#ffcc00', sphere:'pakt', tier:'minor', capital:'姆巴巴内', leader:'—' },
      { id:'SYR', name:'叙利亚共和国', short:'叙利亚', flag:'#ce1126', sphere:'none', tier:'minor', capital:'大马士革', leader:'—' },
      { id:'TCD', name:'乍得', short:'乍得', flag:'#00209f', sphere:'pakt', tier:'minor', capital:'恩贾梅纳', leader:'—' },
      { id:'TGO', name:'多哥', short:'多哥', flag:'#ffcc00', sphere:'none', tier:'minor', capital:'洛美', leader:'—' },
      { id:'TTO', name:'特立尼达和多巴哥', short:'特多', flag:'#002a8f', sphere:'ofn', tier:'minor', capital:'西班牙港', leader:'—' },
      { id:'TUN', name:'突尼斯王国', short:'突尼斯', flag:'#e30a17', sphere:'italian_sphere', tier:'minor', capital:'突尼斯', leader:'—' },
      { id:'TWN', name:'中华民国台湾', short:'台湾', flag:'#fe0000', sphere:'ofn', tier:'minor', capital:'台北', leader:'蒋介石' },
      { id:'TZA', name:'坦噶尼喀', short:'坦噶尼喀', flag:'#008736', sphere:'pakt', tier:'minor', capital:'多多马', leader:'—' },
      { id:'UGA', name:'乌干达', short:'乌干达', flag:'#000000', sphere:'pakt', tier:'minor', capital:'坎帕拉', leader:'—' },
      { id:'UKR', name:'乌克兰', short:'乌克兰', flag:'#ffd500', sphere:'pakt', tier:'minor', capital:'基辅', leader:'—' },
      { id:'URG', name:'乌拉圭共和国', short:'乌拉圭', flag:'#ffcc00', sphere:'none', tier:'minor', capital:'蒙得维的亚', leader:'—' },
      { id:'USA_ANT', name:'美国', short:'美国', flag:'#3a6a9a', sphere:'ofn', tier:'minor', capital:'华盛顿', leader:'尼克松' },
      { id:'UZB', name:'乌兹别克苏维埃社会主义共和国', short:'乌兹别克', flag:'#d8d0a8', sphere:'none', tier:'minor', capital:'塔什干', leader:'—' },
      { id:'VAN', name:'瓦努阿图', short:'瓦努阿图', flag:'#009a44', sphere:'ofn', tier:'minor', capital:'维拉港', leader:'—' },
      { id:'VAT', name:'梵蒂冈城国', short:'梵蒂冈', flag:'#ffcc00', sphere:'pakt', tier:'minor', capital:'梵蒂冈城', leader:'约翰二十三世' },
      { id:'VEN', name:'委内瑞拉共和国', short:'委内瑞拉', flag:'#fcd116', sphere:'none', tier:'minor', capital:'加拉加斯', leader:'拉里萨巴尔' },
      { id:'VUT', name:'瓦利斯和富图纳', short:'瓦富', flag:'#002654', sphere:'pakt', tier:'minor', capital:'马塔乌图', leader:'—' },
      { id:'YEM', name:'也门王国', short:'也门', flag:'#ffcc00', sphere:'italian_sphere', tier:'minor', capital:'萨那', leader:'穆塔瓦基勒' },
      { id:'YUG', name:'南斯拉夫王国', short:'南斯拉夫', flag:'#002b5c', sphere:'pakt', tier:'minor', capital:'贝尔格莱德', leader:'—' },
      { id:'ZAF', name:'南非联邦', short:'南非', flag:'#007749', sphere:'ofn', tier:'minor', capital:'比勒陀利亚', leader:'—' },
      { id:'ZMB', name:'北罗得西亚', short:'北罗得西亚', flag:'#ffcc00', sphere:'pakt', tier:'minor', capital:'卢萨卡', leader:'—' },
      { id:'ZWE', name:'南罗得西亚', short:'南罗得西亚', flag:'#ffcc00', sphere:'pakt', tier:'minor', capital:'索尔兹伯里', leader:'—' },
    ];
    return [...major, ...regional, ...minor];
  },

  _bindWorld(initialFilter) {
    const UI = this;
    const container = document.getElementById('world-virtual-scroll');
    const spacer = document.getElementById('world-spacer');
    const searchInput = document.getElementById('world-search');
    const filtersEl = document.getElementById('world-filters');
    const countEl = document.getElementById('world-count');
    const ROW_H = 52;
    let filter = initialFilter || 'all';
    let search = '';
    let filteredList = [];

    const sphereNames = {
      pakt: '轴心', ofn: 'OFN', japanese_sphere: '共荣圈',
      italian_sphere: '三头同盟', none: '中立',
      syndicalist: '工团主义', turkish_sphere: '土耳其圈'
    };
    const tierNames = { major: '大国', regional: '地区', minor: '小国' };

    function applyFilter() {
      let list = UI._worldData;
      if (filter === 'major') list = list.filter(d => d.tier === 'major');
      else if (filter !== 'all' && filter !== 'major') list = list.filter(d => d.sphere === filter);
      if (search) {
        const q = search.toLowerCase();
        list = list.filter(d => d.name.toLowerCase().includes(q) || d.short.toLowerCase().includes(q) || d.id.toLowerCase().includes(q));
      }
      filteredList = list;
      countEl.textContent = `显示 ${list.length} / ${UI._worldData.length}`;
    }

    function renderFilterChips() {
      const chips = [
        ['all', '全部'],
        ['major', '大国'],
        ['pakt', '轴心'],
        ['ofn', 'OFN'],
        ['japanese_sphere', '共荣圈'],
        ['italian_sphere', '三头同盟'],
        ['none', '中立'],
      ];
      filtersEl.innerHTML = chips.map(([k, l]) =>
        `<button data-filter="${k}" style="padding:4px 10px;font-size:11px;border:1px solid var(--border);border-radius:12px;background:${filter===k?'var(--accent)':'var(--bg-secondary)'};color:${filter===k?'#fff':'var(--text)'};cursor:pointer;transition:all .15s;">${l}</button>`
      ).join('');
      filtersEl.querySelectorAll('button').forEach(btn => {
        btn.onclick = () => { filter = btn.dataset.filter; renderFilterChips(); applyFilter(); render(); };
      });
    }

    function render() {
      applyFilter();
      const total = filteredList.length;
      const viewH = container.clientHeight || 600;
      const buffer = 5;
      const startIdx = Math.max(0, Math.floor(container.scrollTop / ROW_H) - buffer);
      const endIdx = Math.min(total, Math.ceil((container.scrollTop + viewH) / ROW_H) + buffer);

      spacer.style.height = (total * ROW_H) + 'px';
      let html = '';
      for (let i = startIdx; i < endIdx; i++) {
        const d = filteredList[i];
        const bg = i % 2 ? 'rgba(255,255,255,0.02)' : 'transparent';
        html += `
          <div class="world-row" data-id="${d.id}" style="position:absolute;top:${i*ROW_H}px;left:0;right:0;height:${ROW_H}px;display:flex;align-items:center;padding:0 16px;border-bottom:1px solid var(--border);background:${bg};cursor:pointer;transition:background .15s;" onmouseover="this.style.background='rgba(255,255,255,0.08)'" onmouseout="this.style.background='${bg}'">
            <div style="width:28px;height:18px;background:${d.flag};border-radius:2px;margin-right:12px;flex-shrink:0;border:1px solid rgba(255,255,255,0.15);"></div>
            <div style="flex:1;min-width:0;">
              <div style="font-size:13px;font-weight:500;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${d.name}</div>
              <div style="font-size:11px;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${d.short} · ${d.capital}${d.leader ? ' · ' + d.leader : ''}</div>
            </div>
            <div style="display:flex;gap:4px;flex-shrink:0;">
              <span style="font-size:10px;padding:2px 6px;border-radius:3px;background:var(--bg-secondary);color:var(--text-muted);">${sphereNames[d.sphere] || d.sphere}</span>
              <span style="font-size:10px;padding:2px 6px;border-radius:3px;background:var(--bg-secondary);color:var(--text-muted);">${tierNames[d.tier]}</span>
            </div>
          </div>
        `;
      }
      spacer.innerHTML = html;
      spacer.querySelectorAll('.world-row').forEach(row => {
        row.onclick = () => UI._showCountryDetail(row.dataset.id);
      });
    }

    container.onscroll = () => render();
    searchInput.oninput = (e) => { search = e.target.value; render(); };

    renderFilterChips();
    applyFilter();
    render();

    this._worldRaf = null;
    const ro = new ResizeObserver(() => { if (!this._worldRaf) this._worldRaf = requestAnimationFrame(() => { render(); this._worldRaf = null; }); });
    ro.observe(container);
    this._worldResizeObs = ro;
  },

  async _showCountryDetail(id) {
    const UI = this;
    const data = this._worldData.find(d => d.id === id);
    if (!data) return;
    const el = document.getElementById('world-detail');
    const mask = document.getElementById('world-detail-mask');
    function _close() {
      if (el) el.style.display = 'none';
      if (mask) mask.style.display = 'none';
    }
    if (el) el.style.display = 'block';
    if (mask) mask.style.display = 'block';
    el.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted);">加载中...</div>';

    let detail = null;
    if (typeof DataStore !== 'undefined') {
      detail = await DataStore.getCountry(id);
    }

    const fmt = (v) => {
      if (!v && v !== 0) return '—';
      if (typeof v === 'number') {
        if (v >= 1e8) return (v / 1e8).toFixed(2) + '亿';
        if (v >= 1e4) return (v / 1e4).toFixed(1) + '万';
        return v.toLocaleString();
      }
      return v;
    };

    if (detail) {
      const d = detail;
      el.innerHTML = `
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
          <div style="width:32px;height:22px;background:${data.flag};border-radius:3px;border:1px solid rgba(255,255,255,0.2);"></div>
          <div style="flex:1;">
            <div style="font-size:16px;font-weight:600;color:var(--text);">${d.name || data.name}${data.short !== data.name ? ` <span style="font-size:13px;color:var(--text-muted);font-weight:400">(${data.short})</span>` : ''}</div>
            <div style="font-size:12px;color:var(--text-muted);">${data.capital}${data.leader ? ' · ' + data.leader : ''}</div>
          </div>
          <button onclick="var el=document.getElementById('world-detail');var mk=document.getElementById('world-detail-mask');if(el)el.style.display='none';if(mk)mk.style.display='none'" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:20px;">✕</button>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;margin-bottom:16px;">
          ${d.gdp ? `<div style="background:var(--bg-primary);padding:8px 12px;border-radius:6px;"><div style="font-size:10px;color:var(--text-muted);">GDP</div><div style="font-size:14px;color:var(--text);">${fmt(d.gdp)}</div></div>` : ''}
          ${d.population ? `<div style="background:var(--bg-primary);padding:8px 12px;border-radius:6px;"><div style="font-size:10px;color:var(--text-muted);">人口</div><div style="font-size:14px;color:var(--text);">${fmt(d.population)}</div></div>` : ''}
          ${d.stability != null ? `<div style="background:var(--bg-primary);padding:8px 12px;border-radius:6px;"><div style="font-size:10px;color:var(--text-muted);">稳定度</div><div style="font-size:14px;color:${d.stability>50?'var(--success)':'var(--danger)'}">${d.stability}</div></div>` : ''}
          ${d.support != null ? `<div style="background:var(--bg-primary);padding:8px 12px;border-radius:6px;"><div style="font-size:10px;color:var(--text-muted);">支持率</div><div style="font-size:14px;color:var(--text);">${d.support}%</div></div>` : ''}
          ${d.army ? `<div style="background:var(--bg-primary);padding:8px 12px;border-radius:6px;"><div style="font-size:10px;color:var(--text-muted);">陆军</div><div style="font-size:14px;color:var(--text);">${fmt(d.army)}k</div></div>` : ''}
          ${d.airforce ? `<div style="background:var(--bg-primary);padding:8px 12px;border-radius:6px;"><div style="font-size:10px;color:var(--text-muted);">空军</div><div style="font-size:14px;color:var(--text);">${fmt(d.airforce)}</div></div>` : ''}
          ${d.navy ? `<div style="background:var(--bg-primary);padding:8px 12px;border-radius:6px;"><div style="font-size:10px;color:var(--text-muted);">海军</div><div style="font-size:14px;color:var(--text);">${fmt(d.navy)}</div></div>` : ''}
          ${d.nuclear && d.nuclear.warheads ? `<div style="background:var(--bg-primary);padding:8px 12px;border-radius:6px;"><div style="font-size:10px;color:var(--text-muted);">核弹</div><div style="font-size:14px;color:var(--danger);">${d.nuclear.warheads}</div></div>` : ''}
        </div>
        ${d.desc ? `<div style="font-size:12px;color:var(--text-muted);line-height:1.6;margin-bottom:12px;">${d.desc}</div>` : ''}
        ${d.territories ? `<div style="font-size:11px;color:var(--text-muted);">领土: ${d.territories.join(', ')}</div>` : ''}
      `;
    } else {
      el.innerHTML = `
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
          <div style="width:32px;height:22px;background:${data.flag};border-radius:3px;border:1px solid rgba(255,255,255,0.2);"></div>
          <div style="flex:1;">
            <div style="font-size:16px;font-weight:600;color:var(--text);">${data.name}</div>
            <div style="font-size:12px;color:var(--text-muted);">${data.capital}${data.leader ? ' · ' + data.leader : ''}</div>
          </div>
          <button onclick="var el=document.getElementById('world-detail');var mk=document.getElementById('world-detail-mask');if(el)el.style.display='none';if(mk)mk.style.display='none'" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:20px;">✕</button>
        </div>
        <div style="font-size:12px;color:var(--text-muted);text-align:center;padding:20px;">
          ${data.tier === 'minor' ? '此为小国/傀儡，详细数据暂未建模。' : '详细数据加载失败。'}
          <br>国家代码: ${id}
        </div>
      `;
    }
  },

  // ===== 国势页 (国家模拟系统) =====
  renderNation() {
    const s = Game.state;
    const NS = (typeof NationSim !== 'undefined') ? NationSim : null;
    if (!NS) return '<div style="padding:40px;text-align:center;color:var(--text-muted)">国家模拟系统未加载</div>';

    // 获取玩家国摘要
    const ger = NS.getSummary('GER');
    if (!ger) return '<div style="padding:40px;text-align:center;color:var(--text-muted)">数据加载中...</div>';

    // 获取势力排名
    const ranking = NS.getPowerRanking();
    const gerRank = ranking.findIndex(r => r.id === 'GER') + 1;

    // 格式化数字
    const fmtGDP = (v) => {
      if (v >= 1000000) return (v / 1000000).toFixed(2) + '万亿';
      if (v >= 10000) return (v / 10000).toFixed(1) + '亿';
      return v.toLocaleString() + '万';
    };
    const fmtPop = (v) => {
      if (v >= 100000000) return (v / 100000000).toFixed(2) + '亿';
      if (v >= 10000) return (v / 10000).toFixed(0) + '万';
      return v.toLocaleString();
    };
    const fmtPct = (v) => (v * 100).toFixed(1) + '%';

    // 进度条颜色
    const barColor = (pct, thresholds = [30, 60]) => {
      if (pct < thresholds[0]) return '#c84040';
      if (pct < thresholds[1]) return '#c8a040';
      return '#4a8a4a';
    };

    // GDP趋势图 (简易柱状图)
    const gdpHistory = ger.gdpHistory || [ger.gdp];
    const maxGdp = Math.max.apply(null, gdpHistory);
    const minGdp = Math.min.apply(null, gdpHistory);
    const gdpRange = Math.max(1, maxGdp - minGdp);
    const chartBars = gdpHistory.slice(-40).map((v, i) => {
      const h = Math.max(2, ((v - minGdp) / gdpRange) * 48 + 4);
      const isLast = i === gdpHistory.slice(-40).length - 1;
      return `<div style="display:inline-block;width:${100/Math.min(40, gdpHistory.length)}%;height:${h}px;background:${isLast ? '#e8c860' : 'rgba(232,200,96,0.4)'};border-radius:1px 1px 0 0;vertical-align:bottom;" title="${fmtGDP(v)}"></div>`;
    }).join('');

    // 势力对比条 (含AI国家战略)
    const maxPower = ranking[0] ? ranking[0].power : 100;
    const rankingHtml = ranking.map((r, i) => {
      const isPlayer = r.id === 'GER';
      const pct = (r.power / maxPower) * 100;
      const colors = { GER:'#a83232', USA:'#3a6a9a', JAP:'#b89438', ITA:'#5a8a4a', BUR:'#4a2a4a', RUS:'#7a3a3a' };
      const c = colors[r.id] || '#5a5a5a';
      // 获取该国AI战略
      const aiSum = NS.getSummary(r.id);
      const ai = aiSum && aiSum.aiState;
      const diploSign = ai ? (ai.diploMod > 0 ? '+' : '') + ai.diploMod.toFixed(0) : '';
      const diploColor = ai ? (ai.diploMod > 5 ? '#4a8a4a' : (ai.diploMod < -5 ? '#c84040' : 'var(--text-muted)')) : 'var(--text-muted)';
      const milTag = ai ? (ai.milMod > 0.2 ? '·扩军' : (ai.milMod < -0.1 ? '·裁军' : '')) : '';
      return `
        <div style="margin-bottom:8px;${isPlayer ? 'background:rgba(168,50,50,0.08);border-radius:4px;padding:4px 6px;' : ''}">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;">
            <span style="font-size:12px;color:${isPlayer ? 'var(--accent-gold-bright)' : 'var(--text-primary)'};font-weight:${isPlayer ? 'bold' : 'normal'}">${i+1}. ${r.name}</span>
            <span style="font-size:11px;color:var(--text-muted)">国力 ${r.power}</span>
          </div>
          <div style="height:6px;background:rgba(255,255,255,0.06);border-radius:3px;overflow:hidden;">
            <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,${c},${c}cc);border-radius:3px;"></div>
          </div>
          <div style="display:flex;gap:8px;margin-top:2px;font-size:10px;color:var(--text-muted);align-items:center;flex-wrap:wrap;">
            <span>GDP ${fmtGDP(r.gdp)}</span>
            <span>核弹 ${r.nukes}</span>
            <span>威慑 ${r.deterrence}</span>
            ${ai ? `<span style="margin-left:auto;padding:1px 6px;background:rgba(255,255,255,0.05);border:1px solid var(--border);border-radius:8px;font-size:9px;color:var(--accent-gold);">战略: ${ai.goalName}${milTag}</span><span style="font-size:9px;color:${diploColor};">对德${diploSign}</span>` : '<span style="margin-left:auto;font-size:9px;color:var(--accent-gold-bright);">玩家</span>'}
          </div>
        </div>`;
    }).join('');

    // 预算分配条
    const b = ger.budget || {};
    const budgetItems = [
      { label: '军事', val: b.military || 0, color: '#c84040' },
      { label: '福利', val: b.welfare || 0, color: '#4a8a4a' },
      { label: '研发', val: b.research || 0, color: '#4a7aaa' },
      { label: '行政', val: b.administration || 0, color: '#8a7a4a' },
      { label: '情报', val: b.espionage || 0, color: '#4a2a4a' }
    ];
    const budgetBar = budgetItems.map(bi =>
      `<div style="display:inline-block;height:18px;width:${(bi.val*100).toFixed(1)}%;background:${bi.color};line-height:18px;text-align:center;font-size:9px;color:#fff;overflow:hidden;white-space:nowrap;">${bi.val>0.05?bi.label:''}</div>`
    ).join('');

    // 科技等级
    const techStars = (tier) => '★'.repeat(tier) + '☆'.repeat(Math.max(0, 5 - tier));

    return `
      <div class="nation-page" style="padding:16px;">
        <!-- 国家概况 -->
        <div style="background:linear-gradient(135deg,rgba(168,50,50,0.12),rgba(60,30,30,0.05));border:1px solid var(--border);border-radius:6px;padding:14px;margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;">
            <div>
              <h2 style="font-family:var(--font-serif);color:var(--accent-gold-bright);letter-spacing:0.08em;margin:0 0 4px;">${ger.name}</h2>
              <div style="font-size:12px;color:var(--text-muted);">
                元首: ${ger.leader} · 首都: ${ger.capital} · 意识形态: ${ger.ideology}
              </div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:11px;color:var(--text-muted);">综合国力排名</div>
              <div style="font-size:24px;font-weight:bold;color:${gerRank === 1 ? 'var(--accent-gold-bright)' : 'var(--text-primary)'};">第${gerRank}位</div>
              <div style="font-size:10px;color:var(--text-muted);">/${ranking.length}国</div>
            </div>
          </div>
        </div>

        <!-- 经济面板 -->
        <div style="background:var(--bg-panel);border:1px solid var(--border);border-radius:6px;padding:12px;margin-bottom:10px;">
          <h3 style="font-family:var(--font-serif);color:var(--accent-gold);font-size:14px;margin:0 0 10px;letter-spacing:0.08em;">经济</h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px;margin-bottom:10px;">
            <div style="text-align:center;padding:6px;background:rgba(255,255,255,0.03);border-radius:4px;">
              <div style="font-size:10px;color:var(--text-muted);">GDP</div>
              <div style="font-size:15px;font-weight:bold;color:#e8c860;">${fmtGDP(ger.gdp)}</div>
              <div style="font-size:9px;color:${ger.gdpGrowth > 0 ? '#4a8a4a' : '#c84040'};">${ger.gdpGrowth > 0 ? '↑' : '↓'} ${(ger.gdpGrowth*100).toFixed(2)}%/年</div>
            </div>
            <div style="text-align:center;padding:6px;background:rgba(255,255,255,0.03);border-radius:4px;">
              <div style="font-size:10px;color:var(--text-muted);">国库</div>
              <div style="font-size:15px;font-weight:bold;color:#c8c8a0;">${fmtGDP(ger.treasury)}</div>
              <div style="font-size:9px;color:var(--text-muted);">税率 ${fmtPct(ger.taxRate)}</div>
            </div>
            <div style="text-align:center;padding:6px;background:rgba(255,255,255,0.03);border-radius:4px;">
              <div style="font-size:10px;color:var(--text-muted);">通胀率</div>
              <div style="font-size:15px;font-weight:bold;color:${ger.inflation > 0.08 ? '#c84040' : '#a0a0a0'};">${fmtPct(ger.inflation)}</div>
              <div style="font-size:9px;color:var(--text-muted);">${ger.inflation > 0.08 ? '⚠ 恶性通胀' : ger.inflation > 0.05 ? '偏高' : '正常'}</div>
            </div>
            <div style="text-align:center;padding:6px;background:rgba(255,255,255,0.03);border-radius:4px;">
              <div style="font-size:10px;color:var(--text-muted);">人均GDP</div>
              <div style="font-size:15px;font-weight:bold;color:#a0c8e0;">${(ger.gdpPerCapita/1000).toFixed(1)}千</div>
              <div style="font-size:9px;color:var(--text-muted);">马克</div>
            </div>
          </div>
          <!-- GDP趋势图 -->
          <div style="margin-top:8px;">
            <div style="font-size:10px;color:var(--text-muted);margin-bottom:4px;">GDP趋势 (近${Math.min(40, gdpHistory.length)}季度)</div>
            <div style="height:56px;display:flex;align-items:flex-end;border-bottom:1px solid var(--border);border-left:1px solid var(--border);padding:2px;">
              ${chartBars || '<div style="font-size:11px;color:var(--text-muted);margin:auto;">数据收集中</div>'}
            </div>
          </div>
          <!-- 预算分配 -->
          <div style="margin-top:10px;">
            <div style="font-size:10px;color:var(--text-muted);margin-bottom:4px;">政府预算分配</div>
            <div style="height:18px;border-radius:3px;overflow:hidden;display:flex;background:rgba(255,255,255,0.05);">
              ${budgetBar}
            </div>
          </div>
        </div>

        <!-- 政治面板 -->
        <div style="background:var(--bg-panel);border:1px solid var(--border);border-radius:6px;padding:12px;margin-bottom:10px;">
          <h3 style="font-family:var(--font-serif);color:var(--accent-gold);font-size:14px;margin:0 0 10px;letter-spacing:0.08em;">政治</h3>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
            <div>
              <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:3px;">
                <span style="color:var(--text-muted);">稳定度</span>
                <span style="color:${barColor(ger.stability)};font-weight:bold;">${ger.stability.toFixed(1)}</span>
              </div>
              <div style="height:6px;background:rgba(255,255,255,0.06);border-radius:3px;overflow:hidden;">
                <div style="height:100%;width:${ger.stability}%;background:${barColor(ger.stability)};border-radius:3px;"></div>
              </div>
            </div>
            <div>
              <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:3px;">
                <span style="color:var(--text-muted);">支持率</span>
                <span style="color:${barColor(ger.support)};font-weight:bold;">${ger.support.toFixed(1)}</span>
              </div>
              <div style="height:6px;background:rgba(255,255,255,0.06);border-radius:3px;overflow:hidden;">
                <div style="height:100%;width:${ger.support}%;background:${barColor(ger.support)};border-radius:3px;"></div>
              </div>
            </div>
            <div>
              <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:3px;">
                <span style="color:var(--text-muted);">腐败度</span>
                <span style="color:${ger.corruption > 0.2 ? '#c84040' : '#a0a0a0'};font-weight:bold;">${fmtPct(ger.corruption)}</span>
              </div>
              <div style="height:6px;background:rgba(255,255,255,0.06);border-radius:3px;overflow:hidden;">
                <div style="height:100%;width:${ger.corruption * 100 * 2}%;background:${ger.corruption > 0.2 ? '#c84040' : '#8a7a4a'};border-radius:3px;"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 军事面板 -->
        <div style="background:var(--bg-panel);border:1px solid var(--border);border-radius:6px;padding:12px;margin-bottom:10px;">
          <h3 style="font-family:var(--font-serif);color:var(--accent-gold);font-size:14px;margin:0 0 10px;letter-spacing:0.08em;">军事</h3>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">
            <div style="text-align:center;padding:8px 4px;background:rgba(168,50,50,0.08);border-radius:4px;">
              <div style="font-size:10px;color:var(--text-muted);">陆军</div>
              <div style="font-size:16px;font-weight:bold;color:#e8a0a0;">${ger.army}</div>
            </div>
            <div style="text-align:center;padding:8px 4px;background:rgba(168,50,50,0.08);border-radius:4px;">
              <div style="font-size:10px;color:var(--text-muted);">空军</div>
              <div style="font-size:16px;font-weight:bold;color:#a0c8e0;">${ger.airforce}</div>
            </div>
            <div style="text-align:center;padding:8px 4px;background:rgba(168,50,50,0.08);border-radius:4px;">
              <div style="font-size:10px;color:var(--text-muted);">海军</div>
              <div style="font-size:16px;font-weight:bold;color:#a0a0d0;">${ger.navy}</div>
            </div>
            <div style="text-align:center;padding:8px 4px;background:rgba(168,50,50,0.12);border-radius:4px;">
              <div style="font-size:10px;color:var(--text-muted);">核弹头</div>
              <div style="font-size:16px;font-weight:bold;color:#e8c860;">${ger.nukes}</div>
            </div>
          </div>
          <div style="margin-top:8px;display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:11px;color:var(--text-muted);">核威慑值</span>
            <div style="flex:1;margin:0 8px;height:6px;background:rgba(255,255,255,0.06);border-radius:3px;overflow:hidden;">
              <div style="height:100%;width:${Math.min(100, ger.nukeDeterrence/150*100)}%;background:linear-gradient(90deg,#4a4a8a,#e8c860);border-radius:3px;"></div>
            </div>
            <span style="font-size:12px;font-weight:bold;color:${ger.nukeDeterrence > 50 ? '#e8c860' : '#a0a0a0'};">${ger.nukeDeterrence}/150</span>
          </div>
          <!-- 核威慑公式分解 -->
          ${(() => {
            const db = ger.deterBreakdown;
            if (!db) return '';
            return `
              <div style="margin-top:8px;padding-top:6px;border-top:1px dashed var(--border);font-size:9px;color:var(--text-muted);line-height:1.5;">
                <div style="color:var(--accent-gold);font-size:10px;margin-bottom:2px;">威慑构成</div>
                <div>核弹×5: <span style="color:#e8c860;">${db.warheads}</span> · 投送: <span style="color:#a0c8e0;">${db.delivery}</span></div>
                <div>科技: <span style="color:#a0d0a0;">${db.tech}</span> · 外交: <span style="color:${db.diplo > 0 ? '#4a8a4a' : '#c84040'};">${db.diplo > 0 ? '+' : ''}${db.diplo}</span> · 工效: <span style="color:#a0a0d0;">${db.eff}</span></div>
              </div>`;
          })()}
        </div>

        <!-- 核危机状态警示 -->
        ${(() => {
          const crisis = NS.getNuclearCrisis ? NS.getNuclearCrisis() : null;
          if (!crisis) return '';
          const effText = crisis.level === 'low' ? '无影响' :
            (crisis.level === 'medium' ? `稳定-${Math.abs(crisis.effects.stability)}/回合 · GDP-${Math.abs(crisis.effects.gdpMod*100).toFixed(1)}%/回合` :
            `稳定-${Math.abs(crisis.effects.stability)}/回合 · GDP-${Math.abs(crisis.effects.gdpMod*100).toFixed(1)}%/回合`);
          return `
            <div style="background:${crisis.color}15;border:1px solid ${crisis.color}50;border-radius:6px;padding:10px;margin-bottom:10px;">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <div>
                  <span style="font-family:var(--font-serif);color:${crisis.color};font-size:13px;font-weight:bold;">⚠ 核危机: ${crisis.name}</span>
                  <div style="font-size:10px;color:var(--text-muted);margin-top:2px;">全球平均威慑 ${crisis.avgDeter} · ${effText}</div>
                </div>
                <div style="text-align:right;font-size:9px;color:var(--text-muted);line-height:1.4;">
                  ${Object.keys(crisis.breakdown).map(id => `<div>${id}: ${crisis.breakdown[id]}</div>`).join('')}
                </div>
              </div>
            </div>`;
        })()}

        <!-- 科技 + 工业 + 人口 -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">
          <!-- 科技 -->
          <div style="background:var(--bg-panel);border:1px solid var(--border);border-radius:6px;padding:10px;">
            <h4 style="font-family:var(--font-serif);color:var(--accent-gold);font-size:12px;margin:0 0 8px;">科技等级</h4>
            <div style="font-size:11px;line-height:1.8;">
              <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-muted);">军事科技</span><span style="color:#e8a0a0;">${techStars(ger.techMil)}</span></div>
              <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-muted);">民用科技</span><span style="color:#a0c8e0;">${techStars(ger.techCiv)}</span></div>
              <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-muted);">核技术</span><span style="color:#e8c860;">${techStars(ger.techNuke)}</span></div>
              <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-muted);">火箭技术</span><span style="color:#a0d0a0;">${techStars(ger.techRocket)}</span></div>
            </div>
          </div>
          <!-- 工业系统 (四类工业 + 效率公式) -->
          <div style="background:var(--bg-panel);border:1px solid var(--border);border-radius:6px;padding:10px;">
            <h4 style="font-family:var(--font-serif);color:var(--accent-gold);font-size:12px;margin:0 0 8px;">工业体系</h4>
            <div style="font-size:10px;color:var(--text-muted);margin-bottom:6px;border-bottom:1px dashed var(--border);padding-bottom:4px;">
              效率 = 数量/槽位 × 科技 × 稳定 · 综合: <span style="font-weight:bold;color:${ger.industryEff > 0.7 ? '#4a8a4a' : '#c8a040'};">${fmtPct(ger.industryEff)}</span>
            </div>
            <div style="font-size:10px;line-height:1.6;">
              ${(() => {
                const is = ger.industryStats;
                if (!is) return '<div style="color:var(--text-muted);">建筑工业统计中...</div>';
                const rows = [
                  { key:'civil',    name:'民用', color:'#a0c8e0', icon:'🏭', desc:'GDP+稳定' },
                  { key:'military', name:'军事', color:'#e8a0a0', icon:'⚔️', desc:'军力+威慑' },
                  { key:'hitech',   name:'高科技', color:'#c8a0e0', icon:'🔬', desc:'研发+科技' },
                  { key:'energy',   name:'能源', color:'#e0c060', icon:'⚡', desc:'石油+效率' }
                ];
                return rows.map(row => {
                  const cnt = is.counts[row.key];
                  const slot = is.slots[row.key];
                  const e = is.eff[row.key];
                  const fillPct = slot > 0 ? Math.min(100, (cnt / slot) * 100) : 0;
                  const effPct = (e * 100).toFixed(0);
                  return `
                    <div style="margin-bottom:5px;">
                      <div style="display:flex;justify-content:space-between;align-items:center;">
                        <span style="color:${row.color};">${row.icon} ${row.name}</span>
                        <span style="color:var(--text-muted);font-size:9px;">${cnt}/${slot} · ${row.desc}</span>
                      </div>
                      <div style="display:flex;align-items:center;gap:4px;margin-top:2px;">
                        <div style="flex:1;height:6px;background:rgba(255,255,255,0.08);border-radius:3px;overflow:hidden;">
                          <div style="width:${fillPct}%;height:100%;background:${row.color};opacity:0.7;"></div>
                        </div>
                        <span style="font-size:9px;color:${e > 0.3 ? '#4a8a4a' : 'var(--text-muted)'};min-width:28px;text-align:right;">${effPct}%</span>
                      </div>
                    </div>`;
                }).join('');
              })()}
            </div>
          </div>
        </div>

        <!-- 人口 -->
        <div style="background:var(--bg-panel);border:1px solid var(--border);border-radius:6px;padding:10px;margin-bottom:12px;">
          <h4 style="font-family:var(--font-serif);color:var(--accent-gold);font-size:12px;margin:0 0 8px;">人口与社会</h4>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;font-size:11px;text-align:center;">
            <div><div style="color:var(--text-muted);font-size:9px;">总人口</div><div style="font-weight:bold;">${fmtPop(ger.population)}</div></div>
            <div><div style="color:var(--text-muted);font-size:9px;">预期寿命</div><div style="font-weight:bold;">${ger.lifeExpectancy}岁</div></div>
            <div><div style="color:var(--text-muted);font-size:9px;">识字率</div><div style="font-weight:bold;">${fmtPct(ger.literacy)}</div></div>
            <div><div style="color:var(--text-muted);font-size:9px;">城镇化</div><div style="font-weight:bold;">${fmtPct(ger.urbanRate)}</div></div>
          </div>
        </div>

        <!-- 势力对比 -->
        <div style="background:var(--bg-panel);border:1px solid var(--border);border-radius:6px;padding:12px;">
          <h3 style="font-family:var(--font-serif);color:var(--accent-gold);font-size:14px;margin:0 0 10px;letter-spacing:0.08em;">列强国力对比</h3>
          ${rankingHtml}
        </div>

        <div style="text-align:center;margin-top:12px;font-size:10px;color:var(--text-muted);">
          数据来源: NationSim v1.0 · ${NS._fallback ? '内置数据' : 'JSON加载'} · ${Game.getDateStr()}
        </div>
      </div>
    `;
  },

  // ===== 概览页 =====
  renderOverview() {
    const s = Game.state;
    const r = s.resources;
    const income = Game.calculateIncome();

    const recentEvents = s.eventLog.slice(0, 8).map(e =>
      `<div class="log-entry"><span class="log-date">${e.date}</span>${e.title} — <em style="color:var(--accent-gold)">${e.choice}</em></div>`
    ).join('') || '<div style="color:var(--text-muted);font-size:12px">尚无重大事件</div>';

    return `
      <div class="overview-grid">
        <div class="overview-card">
          <h4>帝国状态</h4>
          <div class="big-num">${Math.round(r.stability)}</div>
          <div class="desc">稳定度 / 100</div>
        </div>
        <div class="overview-card">
          <h4>军事威慑</h4>
          <div class="big-num">${Math.round(r.deterrence)}</div>
          <div class="desc">综合威慑 / 150</div>
        </div>
        <div class="overview-card">
          <h4>核武库</h4>
          <div class="big-num">${Math.round(r.nukes)}</div>
          <div class="desc">核武器数量</div>
        </div>
        <div class="overview-card">
          <h4>财政</h4>
          <div class="big-num">${Math.round(r.money)}</div>
          <div class="desc">帝国马克 (百万元) | 每季 ${income.money > 0 ? '+' : ''}${Math.round(income.money)}</div>
        </div>
      </div>
      <div class="situation-log">
        <h4>近期要事</h4>
        ${recentEvents}
      </div>
      <div style="margin-top:16px;padding:14px;background:var(--bg-panel);border:1px solid var(--border);border-left:3px solid var(--accent-steel);border-radius:2px;">
        <h4 style="font-family:var(--font-serif);color:var(--accent-gold);margin-bottom:8px;letter-spacing:0.1em">帝国纪要</h4>
        <div style="font-size:13px;color:var(--text-secondary);line-height:1.8;font-family:var(--font-serif)">
          ${this.getSituationSummary()}
        </div>
      </div>
      <div style="margin-top:16px;">
        <h4 style="font-family:var(--font-serif);color:var(--accent-gold);margin-bottom:10px;letter-spacing:0.1em">历史进程</h4>
        ${this.renderTimeline()}
      </div>
    `;
  },

  getSituationSummary() {
    const s = Game.state;
    const r = s.resources;
    let parts = [];

    if (s.year < 1963 && !s.flags.civil_war_imminent) {
      parts.push(`<strong>1962年。</strong>帝国刚刚登月，但元首遇刺，权力真空已然形成。四位继承者虎视眈眈，街头的年轻人开始反抗。`);
    } else if (s.flags.civil_war_imminent && !s.flags.civil_war_over) {
      parts.push(`<strong>内战爆发。</strong>帝国分崩离析，四派势力争夺那张椅子。你的选择将决定一切。`);
    } else if (s.flags.civil_war_over && s.year < 1972) {
      parts.push(`<strong>内战结束，重建开始。</strong>帝国满目疮痍，但新元首已就位。前路漫长。`);
    } else if (s.year >= 1972 && s.year < 1985) {
      parts.push(`<strong>冷战高潮。</strong>三极世界的核武器足以毁灭文明十次。勃艮第的阴影、俄罗斯的重生、美国的动荡——每一处都是火药桶。`);
    } else if (s.year >= 1985 && s.year < 1996) {
      parts.push(`<strong>黄昏时代。</strong>帝国的黄金已逝，新的挑战接踵而至：计算机、环境、人口、解殖。旧秩序在松动。`);
    } else if (s.year >= 1996) {
      parts.push(`<strong>最后倒计时。</strong>2000年临近，千年帝国的终章即将书写。你的每一个选择，都将在历史中回响。`);
    }

    if (r.stability < 25) parts.push(`<em style="color:var(--accent-blood-bright)">⚠ 帝国稳定度危急，崩溃风险极高。</em>`);
    if (r.deterrence < 20) parts.push(`<em style="color:var(--accent-blood-bright)">⚠ 威慑力不足，敌国蠢蠢欲动。</em>`);
    if (r.money < 0) parts.push(`<em style="color:var(--accent-blood-bright)">⚠ 国库赤字，经济危机迫近。</em>`);
    if (s.flags.burgundian_threat && !s.flags.burgundian_war) parts.push(`<em style="color:var(--accent-gold)">⌬ 勃艮第的核威胁未除。</em>`);

    return parts.join('<br><br>');
  },

  // ===== 工业页 =====
  renderIndustry() {
    const s = Game.state;
    const queueHtml = s.buildQueue.length > 0
      ? `<div style="margin-bottom:16px;padding:12px;background:var(--bg-panel);border:1px solid var(--border);border-radius:2px;">
          <div style="font-family:var(--font-serif);color:var(--accent-gold);margin-bottom:8px;letter-spacing:0.1em">建造队列</div>
          ${s.buildQueue.map(q => `<div style="font-size:12px;color:var(--text-secondary);padding:3px 0">${q.name} — 剩余 ${q.turnsLeft} 季度</div>`).join('')}
        </div>`
      : '';

    const buildings = Object.values(BUILDINGS);
    const civilian = buildings.filter(b => b.type === 'civilian');
    const military = buildings.filter(b => b.type === 'military');

    const renderCard = (b) => {
      const count = s.buildings[b.id] || 0;
      const canBuild = s.resources.money >= b.cost && (!b.requires || s.flags[b.requires] || s.techs[b.requires]);
      const requiresMsg = b.requires && (!s.flags[b.requires] && !s.techs[b.requires])
        ? ` <span style="color:var(--accent-blood-bright);font-size:10px">(需${TECHS[b.requires]?.name || b.requires})</span>` : '';

      const effectHtml = Object.entries(b.effects).map(([k, v]) => {
        const sign = v > 0 ? '+' : '';
        const cls = v > 0 ? 'gain' : 'cost';
        const labels = {
          money: '资金', manpower: '人力', stability: '稳定', deterrence: '威慑',
          militaryPower: '军力', nukeDeter: '核慑', nukes: '核弹', research: '研发', efficiency: '效率'
        };
        return `<span class="b-stat ${cls}">${labels[k] || k} ${sign}${v}</span>`;
      }).join('');
      const maintHtml = b.maint > 0 ? `<span class="b-stat cost">维护 -${b.maint}资金</span>` : '';

      return `
        <div class="building-card ${b.type}">
          <div class="b-name">${b.name} ${requiresMsg}</div>
          <div class="b-desc">${b.desc}</div>
          <div class="b-count">已建: ${count} 座</div>
          <div class="b-stats">
            <span class="b-stat cost">造价 ${b.cost} 资金</span>
            <span class="b-stat">${b.buildTime}季</span>
            ${effectHtml}
            ${maintHtml}
          </div>
          <div class="b-actions">
            <button class="btn btn-build" data-build="${b.id}" ${canBuild ? '' : 'disabled'}>建造</button>
            ${count > 0 ? `<button class="btn btn-demolish" data-demolish="${b.id}">拆除</button>` : ''}
          </div>
        </div>`;
    };

    const html = `
      <div class="industry-header">
        <h2>帝国工业</h2>
        <div style="font-size:12px;color:var(--text-secondary)">资金: <span style="color:var(--accent-gold);font-family:var(--font-mono)">${Math.round(s.resources.money)} 资金</span></div>
      </div>
      ${queueHtml}
      <h3 style="font-family:var(--font-serif);color:var(--accent-steel);margin-bottom:10px;letter-spacing:0.1em;border-bottom:1px solid var(--border);padding-bottom:6px">民工业 — 经济与发展</h3>
      <div class="building-grid">
        ${civilian.map(renderCard).join('')}
      </div>
      <h3 style="font-family:var(--font-serif);color:var(--accent-blood);margin:20px 0 10px;letter-spacing:0.1em;border-bottom:1px solid var(--border);padding-bottom:6px">军工业 — 威慑与战争</h3>
      <div class="building-grid">
        ${military.map(renderCard).join('')}
      </div>
    `;

    // 绑定按钮（延迟，因为innerHTML刚设置）
    setTimeout(() => {
      document.querySelectorAll('[data-build]').forEach(btn => {
        btn.onclick = () => {
          const result = Game.buildBuilding(btn.dataset.build);
          this.toast(result.msg, result.ok ? 'success' : 'error');
          this.requestRender();
        };
      });
      document.querySelectorAll('[data-demolish]').forEach(btn => {
        btn.onclick = () => {
          const result = Game.demolishBuilding(btn.dataset.demolish);
          this.toast(result.msg, result.ok ? 'success' : 'error');
          this.requestRender();
        };
      });
    }, 0);

    return html;
  },

  // ===== 国策树页（沿用 policy 标签） =====
  renderPolicy() {
    const s = Game.state;
    const branches = { '经济': [], '军事': [], '政治': [], '外交': [], '科技': [] };
    for (const f of Object.values(NATIONAL_FOCI)) {
      if (branches[f.branch]) branches[f.branch].push(f);
    }

    // 当前国策进度
    let currentFocusHtml = '';
    if (s.currentFocus) {
      const f = NATIONAL_FOCI[s.currentFocus];
      const pct = (s.focusProgress / f.turns) * 100;
      currentFocusHtml = `
        <div class="focus-current">
          <div class="fc-name">${f.name}</div>
          <div class="fc-progress-bar">
            <div class="fc-progress-fill" style="width:${pct}%"></div>
          </div>
          <div class="fc-turns">${s.focusProgress}/${f.turns} 回合</div>
        </div>`;
    }

    // 渲染每个分支
    const renderBranch = (branchName, foci) => {
      const cards = foci.map(f => {
        const completed = s.completedFoci.includes(f.id);
        const current = s.currentFocus === f.id;
        const canStart = Game.canStartFocus(f.id);
        const lockReason = !canStart && !completed && !current ? Game.getFocusLockReason(f.id) : '';
        const cls = completed ? 'completed' : current ? 'current' : canStart ? 'available' : 'locked';
        const labels = {money:'资金',manpower:'人力',stability:'稳定',deterrence:'威慑',militaryPower:'军力',nukeDeter:'核慑',research:'研发',nukes:'核弹'};
        return `
          <div class="focus-card ${cls}" data-focus="${f.id}">
            <div class="fc-title">${f.name}</div>
            <div class="fc-info">
              <span>${f.cost}金</span>
              <span>${f.turns}回合</span>
            </div>
            <div class="fc-desc">${f.desc}</div>
            <div class="fc-effects">
              ${Object.entries(f.effects).map(([k,v]) => {
                const sign = v > 0 ? '+' : '';
                return `<span class="fe-tag ${v>0?'pos':'neg'}">${labels[k]||k} ${sign}${v}</span>`;
              }).join('')}
            </div>
            ${current ? `<div class="fc-cur">进行中 ${s.focusProgress}/${f.turns}</div>` : ''}
            ${lockReason ? `<div class="fc-lock">${lockReason}</div>` : ''}
            ${completed ? '<div class="fc-done">✓ 已完成</div>' : ''}
          </div>`;
      }).join('');
      return `<div class="focus-branch"><h4 class="fb-title">${branchName}</h4><div class="fb-cards">${cards}</div></div>`;
    };

    const html = `
      <div class="industry-header">
        <h2>国策树</h2>
        <div style="font-size:12px;color:var(--text-muted)">选择国策执行，完成后获得加成</div>
      </div>
      ${currentFocusHtml}
      ${Object.entries(branches).map(([name, foci]) => renderBranch(name, foci)).join('')}
    `;

    setTimeout(() => {
      document.querySelectorAll('.focus-card.available').forEach(card => {
        card.onclick = () => {
          const result = Game.startFocus(card.dataset.focus);
          this.toast(result.msg, result.ok ? 'success' : 'error');
          this.requestRender();
        };
      });
    }, 0);

    return html;
  },

  getPolicyLockReason(opt) {
    if (opt.requires) {
      const ideologyNames = { reformist: '改革派', conservative: '保守派', militarist: '军国派', extremist: '极端派' };
      if (Game.state.leader.ideology !== opt.requires && !Game.state.flags[opt.requires]) {
        return `需要${ideologyNames[opt.requires] || opt.requires}路线`;
      }
    }
    if (opt.requiresFlag) {
      if (!Game.state.flags[opt.requiresFlag]) {
        return '需要前置事件解锁';
      }
    }
    return '条件不满足';
  },

  // ===== 科技页 =====
  renderTech() {
    const s = Game.state;
    const techs = Object.values(TECHS);
    const treeStatus = (typeof Game.getTechTreeStatus === 'function') ? Game.getTechTreeStatus() : null;

    // ===== 新科技树面板 (四类×时代解锁) =====
    let treeHtml = '';
    if (treeStatus && treeStatus.trees) {
      const statusColor = { done: '#4a8a4a', available: '#e8c860', locked: '#5a5a5a', era_locked: '#3a3a3a' };
      const statusLabel = { done: '✓已掌握', available: '可研发', locked: '锁定', era_locked: '时代未到' };
      treeHtml = `
        <div style="background:linear-gradient(135deg,rgba(168,50,50,0.08),rgba(60,30,30,0.03));border:1px solid var(--border);border-radius:6px;padding:14px;margin-bottom:14px;">
          <h2 style="font-family:var(--font-serif);color:var(--accent-gold-bright);letter-spacing:0.1em;margin:0 0 4px;">科技树</h2>
          <div style="font-size:11px;color:var(--text-muted);margin-bottom:10px;">
            四类科技 × 时代解锁 · 当前 ${s.year}年 · 研发点数: <span style="color:var(--accent-gold);font-weight:bold;">${Math.round(s.resources.research)}</span>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px;">
            ${Object.keys(treeStatus.trees).map(treeId => {
              const t = treeStatus.trees[treeId];
              return `
                <div style="background:var(--bg-panel);border:1px solid var(--border);border-radius:6px;padding:10px;">
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;border-bottom:1px solid var(--border);padding-bottom:6px;">
                    <span style="font-family:var(--font-serif);color:${t.color};font-size:13px;font-weight:bold;">${t.icon} ${t.name}</span>
                    <span style="font-size:10px;color:var(--text-muted);">Lv.${t.currentTier}/5</span>
                  </div>
                  <div style="font-size:10px;line-height:1.5;">
                    ${t.tiers.map(tier => {
                      const sc = statusColor[tier.status];
                      const sl = statusLabel[tier.status];
                      const isAvail = tier.status === 'available';
                      return `
                        <div style="display:flex;justify-content:space-between;align-items:center;padding:3px 0;border-bottom:1px dashed rgba(255,255,255,0.04);">
                          <div style="flex:1;min-width:0;">
                            <div style="color:${tier.status === 'done' ? sc : (tier.status === 'available' ? t.color : 'var(--text-muted)')};font-size:11px;">
                              ${tier.status === 'done' ? '✓' : (tier.status === 'available' ? '▶' : '🔒')} ${tier.tier}.${tier.name}
                            </div>
                            <div style="font-size:9px;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${tier.desc}</div>
                          </div>
                          <div style="text-align:right;min-width:60px;">
                            <div style="font-size:9px;color:var(--text-muted);">${tier.eraName || ''} ${tier.cost}💰</div>
                            ${isAvail
                              ? `<button class="btn btn-build" data-tree="${treeId}" style="padding:2px 8px;font-size:10px;margin-top:2px;">研发</button>`
                              : `<span style="font-size:9px;color:${sc};">${sl}</span>`
                            }
                          </div>
                        </div>`;
                    }).join('')}
                  </div>
                </div>`;
            }).join('')}
          </div>
        </div>`;
    }

    const html = `
      ${treeHtml}
      <div class="industry-header">
        <h2>特殊科技</h2>
        <div style="font-size:12px;color:var(--text-secondary)">研发点数: <span style="color:var(--accent-gold);font-family:var(--font-mono)">${Math.round(s.resources.research)} 研发</span></div>
      </div>
      <div class="building-grid">
        ${techs.map(t => {
          const done = s.techs[t.id];
          const canResearch = !done && s.resources.research >= t.cost;
          return `
            <div class="building-card civilian ${done ? 'tech-done' : ''}">
              <div class="b-name">${t.name} ${done ? '<span style="color:var(--accent-toxic);font-size:11px;margin-left:6px">✓ 已研发</span>' : ''}</div>
              <div class="b-desc">${t.desc}</div>
              <div class="b-stats">
                ${done
                  ? `<span class="b-stat">研发成本 ${t.cost} 研发</span>`
                  : `<span class="b-stat cost">研发 ${t.cost} 研发</span>`
                }
              </div>
              <div class="b-actions">
                ${done
                  ? '<button class="btn btn-build" disabled>已完成</button>'
                  : `<button class="btn btn-build" data-tech="${t.id}" ${canResearch ? '' : 'disabled'}>研发</button>`
                }
              </div>
            </div>`;
        }).join('')}
      </div>
    `;

    setTimeout(() => {
      document.querySelectorAll('[data-tech]').forEach(btn => {
        btn.onclick = () => {
          const result = Game.researchTech(btn.dataset.tech);
          this.toast(result.msg, result.ok ? 'success' : 'error');
          this.requestRender();
        };
      });
      // 新科技树研发按钮
      document.querySelectorAll('[data-tree]').forEach(btn => {
        btn.onclick = () => {
          const result = Game.researchTech(btn.dataset.tree);
          this.toast(result.msg, result.ok ? 'success' : 'error');
          this.requestRender();
        };
      });
    }, 0);

    return html;
  },

  // ===== 商店页 =====
  renderShop() {
    const s = Game.state;
    const r = s.resources;
    const isDebug = this.isDebugMode();

    // 商店商品定义
    const shopItems = [
      { id: 'shop_stab', name: '维稳拨款', desc: '派遣党卫军巡逻队，恢复秩序。', cost: { money: 80 }, gain: { stability: 5 }, icon: '⚖' },
      { id: 'shop_det', name: '军事演习', desc: '在东部边境举行大规模演习，展示武力。', cost: { money: 120, manpower: 25 }, gain: { deterrence: 5 }, icon: '⚔' },
      { id: 'shop_mil', name: '雇佣兵合同', desc: '从海外招募职业军人。', cost: { money: 180 }, gain: { militaryPower: 8 }, icon: '🎖' },
      { id: 'shop_res', name: '科研资助', desc: '向帝国大学拨发专项经费。', cost: { money: 150 }, gain: { research: 6 }, icon: '🔬' },
      { id: 'shop_nuke', name: '核材料采购', desc: '从铀矿采购浓缩铀。', cost: { money: 250, research: 25 }, gain: { nukeDeter: 5, nukes: 1 }, icon: '☢', reqFlag: 'nuclear_tech' },
      { id: 'shop_recruit', name: '征兵动员', desc: '在占领区强制征兵。', cost: { money: 60 }, gain: { manpower: 15 }, icon: '👥' },
      { id: 'shop_loan', name: '帝国债券', desc: '发行战争债券，换取现金。代价是未来需偿还。', cost: { stability: -5 }, gain: { money: 120 }, icon: '💰' },
      { id: 'shop_propa', name: '宣传套餐', desc: '戈培尔亲自操刀的宣传攻势。', cost: { money: 70 }, gain: { stability: 3, deterrence: 2 }, icon: '📻' }
    ];

    let itemsHtml = '';
    for (const item of shopItems) {
      if (item.reqFlag && !s.flags[item.reqFlag]) continue;
      const canAfford = Object.entries(item.cost).every(([k, v]) => (r[k] || 0) + v >= 0);
      const costStr = Object.entries(item.cost).map(([k, v]) => {
        const labels = { money: '资金', manpower: '人力', stability: '稳定', deterrence: '威慑', militaryPower: '军力', nukeDeter: '核慑', research: '研发' };
        return `${labels[k] || k} ${v > 0 ? '-' : '+'}${Math.abs(v)}`;
      }).join(' · ');
      const gainStr = Object.entries(item.gain).map(([k, v]) => {
        const labels = { money: '资金', manpower: '人力', stability: '稳定', deterrence: '威慑', militaryPower: '军力', nukeDeter: '核慑', research: '研发', nukes: '核弹' };
        return `+${v} ${labels[k] || k}`;
      }).join(' · ');
      itemsHtml += `
        <div class="shop-item ${canAfford ? '' : 'disabled'}" data-shop-id="${item.id}">
          <div class="shop-icon">${item.icon}</div>
          <div class="shop-info">
            <div class="shop-name">${item.name}</div>
            <div class="shop-desc">${item.desc}</div>
            <div class="shop-cost">${costStr}</div>
          </div>
          <div class="shop-gain">${gainStr}</div>
          <button class="shop-buy-btn" data-shop-buy="${item.id}" ${canAfford ? '' : 'disabled'}>购买</button>
        </div>
      `;
    }

    return `
      <div class="shop-container">
        <div class="shop-header">
          <h3>帝国特别采购</h3>
          <p style="font-size:12px;color:var(--text-muted);margin:4px 0 16px;">用资源换取即时加成。谨慎使用。</p>
        </div>
        <div class="shop-list">${itemsHtml}</div>

        ${isDebug ? this.renderDebugPanel() : `
          <div class="shop-footer">
            <div style="font-size:11px;color:var(--text-muted);margin-top:32px;padding-top:16px;border-top:1px solid var(--border);">
              帝国总理府 · 物资调配司
            </div>
            <div style="margin-top:12px;">
              <input type="password" id="shop-code-input" placeholder="授权码"
                style="background:var(--bg-dark);border:1px solid var(--border);color:var(--text-muted);padding:6px 10px;border-radius:4px;font-size:12px;width:140px;font-family:var(--font-mono);" />
              <button id="shop-code-btn"
                style="background:transparent;border:1px solid var(--border);color:var(--text-muted);padding:6px 12px;border-radius:4px;font-size:12px;cursor:pointer;">验证</button>
            </div>
          </div>
        `}
      </div>
    `;
  },

  // ===== 商店事件绑定 =====
  bindShopEvents() {
    // 商品购买
    document.querySelectorAll('[data-shop-buy]').forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.shopBuy;
        this.shopBuy(id);
      };
    });

    // 密码输入
    const codeBtn = document.getElementById('shop-code-btn');
    const codeInput = document.getElementById('shop-code-input');
    if (codeBtn && codeInput) {
      codeBtn.onclick = () => this.checkShopCode();
      codeInput.onkeydown = (e) => {
        if (e.key === 'Enter') this.checkShopCode();
      };
    }

    // debug按钮
    document.querySelectorAll('[data-dbg-act]').forEach(btn => {
      btn.onclick = () => this.debugAction(btn.dataset.dbgAct);
    });
  },

  checkShopCode() {
    const input = document.getElementById('shop-code-input');
    if (!input) return;
    const val = (input.value || '').trim().toUpperCase();
    if (val === 'WOLFSCHANZE') {
      sessionStorage.setItem('tno_debug', '1');
      this.toast('授权成功。开发者模式已激活。', 'success');
      this.renderTab('shop');
    } else {
      this.toast('授权码无效', 'error');
      input.value = '';
    }
  },

  shopBuy(id) {
    const s = Game.state;
    const r = s.resources;
    const shopItems = {
      shop_stab: { cost: { money: 80 }, gain: { stability: 5 } },
      shop_det: { cost: { money: 120, manpower: 25 }, gain: { deterrence: 5 } },
      shop_mil: { cost: { money: 180 }, gain: { militaryPower: 8 } },
      shop_res: { cost: { money: 150 }, gain: { research: 6 } },
      shop_nuke: { cost: { money: 250, research: 25 }, gain: { nukeDeter: 5, nukes: 1 } },
      shop_recruit: { cost: { money: 60 }, gain: { manpower: 15 } },
      shop_loan: { cost: { stability: -5 }, gain: { money: 120 } },
      shop_propa: { cost: { money: 70 }, gain: { stability: 3, deterrence: 2 } }
    };
    const item = shopItems[id];
    if (!item) return;

    // 检查资源
    for (const [k, v] of Object.entries(item.cost)) {
      if ((r[k] || 0) + v < 0) {
        this.toast('资源不足', 'error');
        return;
      }
    }
    // 扣除
    for (const [k, v] of Object.entries(item.cost)) {
      r[k] = (r[k] || 0) - v;
    }
    // 增加
    for (const [k, v] of Object.entries(item.gain)) {
      if (k === 'stability') r[k] = Math.min(100, (r[k] || 0) + v);
      else r[k] = (r[k] || 0) + v;
    }
    Game.clampResources();
    this.toast('购买成功', 'success');
    this.requestRender();
    this.autoSave();
  },

  // ===== Debug 面板渲染（商店内） =====
  renderDebugPanel() {
    return `
      <div style="margin-top:24px;padding:16px;border:1px solid var(--accent-gold);border-radius:8px;background:rgba(168,50,50,0.05);">
        <div style="color:var(--accent-gold);font-weight:bold;margin-bottom:12px;">⚙ 开发者控制台</div>
        <div style="display:grid;gap:8px;">
          <div style="font-size:11px;color:var(--text-muted);">资源调整</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
            <button class="dbg-btn" data-dbg-act="money100">+100 资金</button>
            <button class="dbg-btn" data-dbg-act="money500">+500 资金</button>
            <button class="dbg-btn" data-dbg-act="mp50">+50 人力</button>
            <button class="dbg-btn" data-dbg-act="mp200">+200 人力</button>
            <button class="dbg-btn" data-dbg-act="stab20">+20 稳定</button>
            <button class="dbg-btn" data-dbg-act="det20">+20 威慑</button>
            <button class="dbg-btn" data-dbg-act="mil30">+30 军力</button>
            <button class="dbg-btn" data-dbg-act="nuk20">+20 核慑</button>
            <button class="dbg-btn" data-dbg-act="res20">+20 研发</button>
            <button class="dbg-btn" data-dbg-act="nuke5">+5 核弹</button>
          </div>
          <div style="font-size:11px;color:var(--text-muted);margin:8px 0 4px;">时间控制</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
            <button class="dbg-btn" data-dbg-act="skip4">跳4回合</button>
            <button class="dbg-btn" data-dbg-act="skip16">跳16回合</button>
            <button class="dbg-btn" data-dbg-act="goto1980">跳到1980</button>
            <button class="dbg-btn" data-dbg-act="goto2000">跳到2000</button>
          </div>
          <div style="font-size:11px;color:var(--text-muted);margin:8px 0 4px;">国策 / 科技</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
            <button class="dbg-btn" data-dbg-act="focus">秒完当前国策</button>
            <button class="dbg-btn" data-dbg-act="allfocus">完成所有国策</button>
            <button class="dbg-btn" data-dbg-act="techs">解锁所有科技</button>
            <button class="dbg-btn" data-dbg-act="flags">解锁所有标记</button>
          </div>
          <div style="font-size:11px;color:var(--text-muted);margin:8px 0 4px;">其他</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
            <button class="dbg-btn" data-dbg-act="relation">关系全+50</button>
            <button class="dbg-btn" data-dbg-act="russia">俄罗斯立即统一</button>
            <button class="dbg-btn" data-dbg-act="maxall">资源全满</button>
            <button class="dbg-btn" data-dbg-act="reset">资源清零</button>
          </div>
          <div style="font-size:11px;color:var(--text-muted);margin:8px 0 4px;">查看状态</div>
          <button class="dbg-btn" data-dbg-act="dump">输出状态到控制台</button>
        </div>
      </div>
    `;
  },

  // ===== 事件日志页 =====
  renderEventLog() {
    const s = Game.state;
    if (s.eventLog.length === 0) {
      return '<div style="color:var(--text-muted);font-size:13px;text-align:center;padding:40px">尚无重大事件记录</div>';
    }
    return `
      <div class="events-feed">
        ${s.eventLog.map(e => `
          <div class="event-card major">
            <div class="e-date">${e.date}</div>
            <div class="e-title">${e.title}</div>
            <div class="e-desc">抉择: <em style="color:var(--accent-gold)">${e.choice}</em></div>
          </div>
        `).join('')}
      </div>
    `;
  },

  // ===== 下一回合 =====
  nextTurn() {
    if (Game.state.ended) return;
    const btn = document.getElementById('btn-next-turn');
    const mBtn = document.getElementById('m-btn-next');
    if (btn) { btn.disabled = true; btn.textContent = '处理中...'; }
    if (mBtn) { mBtn.disabled = true; mBtn.textContent = '处理中...'; }

    // 暂存待处理事件队列
    this.pendingEvents = [];

    const result = Game.advanceTurn([], (events) => {
      this.pendingEvents = events;
    });

    this.requestRender();

    // 自动保存
    this.autoSave();

    // 处理事件
    if (this.pendingEvents.length > 0) {
      this.currentEventIndex = 0;
      this.showNextEvent();
    } else if (Game.state.ended) {
      this.showEnding();
    } else {
      if (btn) { btn.disabled = false; btn.textContent = '推进至下一季度 ▸'; }
      if (mBtn) { mBtn.disabled = false; mBtn.textContent = '下一季度 ▸'; }
    }
  },

  // ===== 处理本回合事件 =====
  processTurnEvents() {
    // 开场触发第一回合事件
    const events = Game.getEventsForTurn();
    if (events.length > 0) {
      this.pendingEvents = events;
      this.currentEventIndex = 0;
      this.showNextEvent();
    }
  },

  // ===== 显示下一个事件 =====
  showNextEvent() {
    if (this.currentEventIndex >= this.pendingEvents.length) {
      // 所有事件处理完毕
      this.pendingEvents = [];
      // 事件处理完后自动保存
      this.autoSave();
      if (Game.state.ended) {
        this.showEnding();
      } else {
        const btn = document.getElementById('btn-next-turn');
        const mBtn = document.getElementById('m-btn-next');
        if (btn) { btn.disabled = false; btn.textContent = '推进至下一季度 ▸'; }
        if (mBtn) { mBtn.disabled = false; mBtn.textContent = '下一季度 ▸'; }
        this.requestRender();
      }
      return;
    }

    const ev = this.pendingEvents[this.currentEventIndex];
    this.showEventModal(ev);
  },

  // ===== 显示事件弹窗 =====
  showEventModal(ev) {
    const s = Game.state;
    const tagText = { critical: '关键事件', major: '重大事件', minor: '一般事件' };
    const modal = document.getElementById('event-modal');
    const dateStr = Game.getDateStr();

    const choicesHtml = ev.choices.map((c, i) => {
      const canChoose = Game.canChooseEventOption(ev, c);
      const cls = canChoose ? '' : 'disabled';
      const effectsHtml = c.effects ? this.renderEffectsPreview(c.effects) : '';
      return `
        <button class="choice-btn ${cls}" data-choice="${i}" ${canChoose ? '' : 'disabled'}>
          <div class="choice-title">${c.text}</div>
          <div class="choice-desc">${c.desc || ''}</div>
          ${effectsHtml}
        </button>`;
    }).join('');

    modal.innerHTML = `
      <div class="modal-box">
        <div class="modal-header">
          <div class="m-date">${dateStr}</div>
          <div class="m-title">${ev.title}</div>
          <span class="m-tag ${ev.tag || 'minor'}">${tagText[ev.tag] || '事件'}</span>
        </div>
        <div class="modal-body">${ev.body}</div>
        <div class="modal-choices">${choicesHtml}</div>
      </div>
    `;
    modal.classList.add('active');

    // 绑定选项
    modal.querySelectorAll('[data-choice]').forEach(btn => {
      btn.onclick = () => {
        if (btn.disabled) return;
        const idx = parseInt(btn.dataset.choice);
        const choice = ev.choices[idx];
        Game.chooseEventOption(ev, choice);
        if (choice.showToast) this.toast(choice.showToast, 'info');

        modal.classList.remove('active');
        this.currentEventIndex++;

        // 检查是否触发结局（如核毁灭）
        if (Game.state.ended) {
          this.showEnding();
          return;
        }

        // 显示下一个事件
        setTimeout(() => this.showNextEvent(), 200);
      };
    });
  },

  renderEffectsPreview(effects) {
    const labels = {
      money: '资金', manpower: '人力', stability: '稳定', deterrence: '威慑',
      militaryPower: '军力', nukeDeter: '核慑', nukes: '核弹', research: '研发',
      ofn_relation: '美国', japan_relation: '日本', italy_relation: '意大利',
      burgundy_relation: '勃艮第', russia_relation: '俄罗斯'
    };
    const parts = Object.entries(effects).map(([k, v]) => {
      const sign = v > 0 ? '+' : '';
      const cls = v > 0 ? 'pos' : 'neg';
      return `<span class="eff ${cls}">${labels[k] || k} ${sign}${v}</span>`;
    }).join('');
    return parts ? `<div style="margin-top:6px;font-size:11px;">${parts}</div>` : '';
  },

  // ===== 结局画面 =====
  showEnding() {
    const s = Game.state;
    const ending = ENDINGS[s.endingId] || ENDINGS.collapse;
    const r = s.resources;

    const screen = document.getElementById('ending-screen');
    screen.innerHTML = `
      <div class="ending-tag">${ending.tag} · ${s.year}年 · ${DIFFICULTIES[s.difficulty]?.name || '普通'}难度</div>
      <div class="ending-title">${ending.title}</div>
      <div class="ending-stats">
        <div class="ending-stat"><div class="es-val">${s.turn}</div><div class="es-label">历经回合</div></div>
        <div class="ending-stat"><div class="es-val">${Math.round(r.stability)}</div><div class="es-label">最终稳定度</div></div>
        <div class="ending-stat"><div class="es-val">${Math.round(r.deterrence)}</div><div class="es-label">最终威慑</div></div>
        <div class="ending-stat"><div class="es-val">${Math.round(r.nukes)}</div><div class="es-label">核武器</div></div>
        <div class="ending-stat"><div class="es-val">${SUCCESSION_PATHS[s.chosenPath]?.title || '无'}</div><div class="es-label">路线</div></div>
      </div>
      <div class="ending-text">${ending.text}</div>
      <button class="btn-restart" onclick="location.reload()">重启帝国 ▸</button>
    `;
    screen.classList.add('active');
    document.getElementById('game').classList.remove('active');
  },

  // ===== Toast 通知 =====
  toast(msg, type = 'info') {
    const container = document.getElementById('toast-container');
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  },

  // ===== DEBUG 模式 =====
  isDebugMode() {
    try { return sessionStorage.getItem('tno_debug') === '1'; } catch(e) { return false; }
  },

  toggleDebugPanel() {
    let panel = document.getElementById('debug-panel');
    if (panel) {
      panel.remove();
      return;
    }
    panel = document.createElement('div');
    panel.id = 'debug-panel';
    panel.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:var(--bg-panel);border:1px solid var(--accent-gold);border-radius:8px;padding:16px;z-index:9999;width:320px;max-height:80vh;overflow-y:auto;box-shadow:0 8px 32px rgba(0,0,0,0.6);';
    panel.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <strong style="color:var(--accent-gold);">DEBUG 控制台</strong>
        <span id="dbg-close" style="cursor:pointer;color:var(--text-muted);">✕</span>
      </div>
      <div style="display:grid;gap:8px;">
        <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">资源调整</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
          <button class="dbg-btn" data-act="money100">+100 资金</button>
          <button class="dbg-btn" data-act="money500">+500 资金</button>
          <button class="dbg-btn" data-act="mp50">+50 人力</button>
          <button class="dbg-btn" data-act="mp200">+200 人力</button>
          <button class="dbg-btn" data-act="stab20">+20 稳定</button>
          <button class="dbg-btn" data-act="det20">+20 威慑</button>
          <button class="dbg-btn" data-act="mil30">+30 军力</button>
          <button class="dbg-btn" data-act="nuk20">+20 核慑</button>
          <button class="dbg-btn" data-act="res20">+20 研发</button>
          <button class="dbg-btn" data-act="nuke5">+5 核弹</button>
        </div>
        <div style="font-size:11px;color:var(--text-muted);margin:8px 0 4px;">时间控制</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
          <button class="dbg-btn" data-act="skip4">跳4回合</button>
          <button class="dbg-btn" data-act="skip16">跳16回合</button>
          <button class="dbg-btn" data-act="goto1980">跳到1980</button>
          <button class="dbg-btn" data-act="goto2000">跳到2000</button>
        </div>
        <div style="font-size:11px;color:var(--text-muted);margin:8px 0 4px;">国策 / 科技</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
          <button class="dbg-btn" data-act="focus">秒完当前国策</button>
          <button class="dbg-btn" data-act="allfocus">完成所有国策</button>
          <button class="dbg-btn" data-act="techs">解锁所有科技</button>
          <button class="dbg-btn" data-act="flags">解锁所有标记</button>
        </div>
        <div style="font-size:11px;color:var(--text-muted);margin:8px 0 4px;">其他</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
          <button class="dbg-btn" data-act="relation">关系全+50</button>
          <button class="dbg-btn" data-act="russia">俄罗斯立即统一</button>
          <button class="dbg-btn" data-act="maxall">资源全满</button>
          <button class="dbg-btn" data-act="reset">资源清零</button>
        </div>
        <div style="font-size:11px;color:var(--text-muted);margin:8px 0 4px;">查看状态</div>
        <button class="dbg-btn" data-act="dump">输出状态到控制台</button>
      </div>
    `;
    document.body.appendChild(panel);
    panel.querySelector('#dbg-close').onclick = () => panel.remove();
    panel.querySelectorAll('.dbg-btn').forEach(btn => {
      btn.style.cssText = 'background:var(--bg-dark);border:1px solid var(--border);color:var(--text);padding:6px 8px;border-radius:4px;font-size:12px;cursor:pointer;';
      btn.onclick = () => this.debugAction(btn.dataset.act);
    });
  },

  debugAction(act) {
    const s = Game.state;
    const r = s.resources;
    switch(act) {
      case 'money100': r.money += 100; this.toast('+100 资金', 'success'); break;
      case 'money500': r.money += 500; this.toast('+500 资金', 'success'); break;
      case 'mp50': r.manpower += 50; this.toast('+50 人力', 'success'); break;
      case 'mp200': r.manpower += 200; this.toast('+200 人力', 'success'); break;
      case 'stab20': r.stability = Math.min(100, r.stability + 20); this.toast('+20 稳定', 'success'); break;
      case 'det20': r.deterrence += 20; this.toast('+20 威慑', 'success'); break;
      case 'mil30': r.militaryPower += 30; this.toast('+30 军力', 'success'); break;
      case 'nuk20': r.nukeDeter += 20; this.toast('+20 核慑', 'success'); break;
      case 'res20': r.research += 20; this.toast('+20 研发', 'success'); break;
      case 'nuke5': r.nukes += 5; this.toast('+5 核弹', 'success'); break;
      case 'skip4':
        for (let i = 0; i < 4 && !s.ended; i++) { Game.advanceTurn([], () => {}); }
        this.toast('跳过4回合', 'success'); break;
      case 'skip16':
        for (let i = 0; i < 16 && !s.ended; i++) { Game.advanceTurn([], () => {}); }
        this.toast('跳过16回合', 'success'); break;
      case 'goto1980':
        while (s.year < 1980 && !s.ended) { Game.advanceTurn([], () => {}); }
        this.toast(`跳到 ${s.year}Q${s.quarter}`, 'success'); break;
      case 'goto2000':
        while (s.year < 2000 && !s.ended) { Game.advanceTurn([], () => {}); }
        this.toast(`跳到 ${s.year}Q${s.quarter}`, 'success'); break;
      case 'focus':
        if (s.currentFocus) {
          const f = NATIONAL_FOCI[s.currentFocus];
          if (f) {
            s.completedFoci.push(s.currentFocus);
            if (f.setFlags) { for (const k in f.setFlags) s.flags[k] = f.setFlags[k]; }
            if (f.effects) { for (const k in f.effects) {
              if (k.includes('_relation')) { s.relations[k] = (s.relations[k]||0) + f.effects[k]; }
              else { r[k] = (r[k]||0) + f.effects[k]; }
            }}
            s.currentFocus = null; s.focusProgress = 0;
            this.toast(`国策完成: ${f.name}`, 'success');
          }
        } else { this.toast('当前无执行中国策', 'error'); }
        break;
      case 'allfocus':
        for (const fid in NATIONAL_FOCI) {
          if (!s.completedFoci.includes(fid)) {
            s.completedFoci.push(fid);
            const f = NATIONAL_FOCI[fid];
            if (f.setFlags) { for (const k in f.setFlags) s.flags[k] = f.setFlags[k]; }
          }
        }
        s.currentFocus = null; s.focusProgress = 0;
        s.flags.economic_reform_1 = true;
        s.flags.slave_reform_1 = true;
        s.flags.political_reform_1 = true;
        s.flags.nuclear_tech = true;
        s.flags.advanced_tech = true;
        s.flags.burgundian_threat = true;
        this.toast('所有国策已完成', 'success'); break;
      case 'techs':
        for (const tid in (typeof TECHS !== 'undefined' ? TECHS : {})) {
          s.techs[tid] = true; s.flags[tid] = true;
        }
        this.toast('所有科技已解锁', 'success'); break;
      case 'flags':
        s.flags.economic_reform_1 = true;
        s.flags.slave_reform_1 = true;
        s.flags.political_reform_1 = true;
        s.flags.nuclear_tech = true;
        s.flags.advanced_tech = true;
        s.flags.burgundian_threat = true;
        s.flags.rocketry_done = true;
        s.flags.burgundy_betrayed = false;
        this.toast('关键标记已解锁', 'success'); break;
      case 'relation':
        for (const k in s.relations) { s.relations[k] = Math.min(100, (s.relations[k]||0) + 50); }
        this.toast('所有关系+50', 'success'); break;
      case 'russia':
        s.russiaState = 'unified';
        s.flags.russia_unified = true;
        s.flags.russia_democratic = true;
        this.toast('俄罗斯已统一（民主派）', 'success'); break;
      case 'maxall':
        r.money = 9999; r.manpower = 9999; r.stability = 100; r.deterrence = 999;
        r.militaryPower = 999; r.nukeDeter = 999; r.research = 999; r.nukes = 99;
        this.toast('资源全满', 'success'); break;
      case 'reset':
        r.money = 200; r.manpower = 30; r.stability = 45; r.deterrence = 60;
        r.militaryPower = 80; r.nukeDeter = 30; r.research = 20; r.nukes = 2;
        this.toast('资源已重置', 'success'); break;
      case 'dump':
        console.log('===== GAME STATE DUMP =====');
        console.log(JSON.parse(JSON.stringify(s)));
        console.log('===== END DUMP =====');
        this.toast('状态已输出到控制台(F12)', 'success'); break;
    }
    Game.clampResources();
    this.requestRender();
    this.autoSave();
  },

  // ===== 保存游戏 (默认槽位1) =====
  saveGame() {
    if (typeof SaveSystem === 'undefined') {
      this.toast('存档系统未加载', 'error');
      return;
    }
    const result = SaveSystem.saveToSlot(1);
    this.toast(result.msg, result.ok ? 'success' : 'error');
  },

  // ===== 自动保存 (静默, 槽位0) =====
  autoSave() {
    if (typeof SaveSystem !== 'undefined') {
      SaveSystem.autoSave();
    }
  },

  // ===== 加载游戏 (优先槽位1, 回退自动存档) =====
  loadGame() {
    if (typeof SaveSystem === 'undefined') return false;
    // 迁移旧存档
    SaveSystem.migrateLegacy();
    // 优先加载槽位1
    let result = SaveSystem.loadFromSlot(1);
    if (!result.ok) {
      // 回退到自动存档
      result = SaveSystem.loadFromSlot(0);
    }
    if (result.ok) {
      this.toast(result.msg, 'success');
      return true;
    } else {
      console.log('无可用存档:', result.msg);
      return false;
    }
  },

  // ===== 存档管理面板 =====
  showSavePanel(mode) {
    // mode: 'save' | 'load'
    if (typeof SaveSystem === 'undefined') {
      this.toast('存档系统未加载', 'error');
      return;
    }
    const slots = SaveSystem.getAllSlots();
    const diffNames = { easy: '简单', normal: '普通', hard: '困难', hell: '地狱' };
    const pathNames = {
      reform: '改革派', militarist: '军部路线', conservative: '保守派',
      reform_democrat: '民主改革', militarist_extreme: '极端军部'
    };

    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;';
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };

    const panel = document.createElement('div');
    panel.style.cssText = 'background:var(--bg-panel);border:1px solid var(--border);border-radius:8px;padding:20px;max-width:500px;width:100%;max-height:80vh;overflow-y:auto;';
    panel.onclick = (e) => e.stopPropagation();

    panel.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;border-bottom:1px solid var(--border);padding-bottom:10px;">
        <h2 style="font-family:var(--font-serif);color:var(--accent-gold-bright);margin:0;letter-spacing:0.05em;">${mode === 'save' ? '保存进度' : '读取存档'}</h2>
        <button class="btn-secondary" id="save-close" style="padding:4px 10px;">关闭</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        ${slots.map(slot => {
          const m = slot.meta;
          const isAuto = slot.type === 'auto';
          const occupied = slot.occupied;
          let infoHtml = '';
          if (occupied && m) {
            const date = new Date(m.savedAt).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
            const path = m.chosenPath ? (pathNames[m.chosenPath] || m.chosenPath) : '未定';
            infoHtml = `
              <div style="font-size:11px;color:var(--text-primary);margin-top:4px;">
                ${m.year}年Q${m.quarter} · ${diffNames[m.difficulty] || m.difficulty} · ${m.leader}
              </div>
              <div style="font-size:10px;color:var(--text-muted);">
                路线: ${path} · 稳定: ${m.stability} · ${date}
              </div>`;
          } else {
            infoHtml = '<div style="font-size:11px;color:var(--text-muted);margin-top:4px;">空槽位</div>';
          }
          return `
            <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:6px;padding:10px;${isAuto ? 'opacity:0.85;' : ''}">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <div style="flex:1;">
                  <span style="font-size:13px;color:${isAuto ? 'var(--accent-gold)' : 'var(--text-primary)'};font-weight:bold;">
                    ${isAuto ? '🔄 ' : '💾 '}${slot.name}
                  </span>
                  ${infoHtml}
                </div>
                <div style="display:flex;gap:4px;">
                  ${mode === 'save'
                    ? (isAuto
                      ? '<span style="font-size:10px;color:var(--text-muted);padding:4px 8px;">自动</span>'
                      : `<button class="btn btn-build" data-save-slot="${slot.id}" style="padding:4px 10px;font-size:11px;">${occupied ? '覆盖' : '保存'}</button>`)
                    : (occupied
                      ? `<button class="btn btn-build" data-load-slot="${slot.id}" style="padding:4px 10px;font-size:11px;">读取</button>${!isAuto ? `<button class="btn-secondary" data-del-slot="${slot.id}" style="padding:4px 8px;font-size:10px;margin-left:2px;">删除</button>` : ''}`
                      : '<span style="font-size:10px;color:var(--text-muted);padding:4px 8px;">空</span>')
                  }
                </div>
              </div>
            </div>`;
        }).join('')}
      </div>
      <div style="font-size:10px;color:var(--text-muted);margin-top:12px;text-align:center;border-top:1px solid var(--border);padding-top:8px;">
        存档包含: 年份 · 国家数据 · 科技 · 工业 · 外交 · 事件进度 · AI战略
      </div>
    `;
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    // 绑定事件
    panel.querySelector('#save-close').onclick = () => overlay.remove();
    panel.querySelectorAll('[data-save-slot]').forEach(btn => {
      btn.onclick = () => {
        const slotId = +btn.dataset.saveSlot;
        const result = SaveSystem.saveToSlot(slotId);
        this.toast(result.msg, result.ok ? 'success' : 'error');
        if (result.ok) {
          overlay.remove();
          this.requestRender();
        }
      };
    });
    panel.querySelectorAll('[data-load-slot]').forEach(btn => {
      btn.onclick = () => {
        const slotId = +btn.dataset.loadSlot;
        const result = SaveSystem.loadFromSlot(slotId);
        this.toast(result.msg, result.ok ? 'success' : 'error');
        if (result.ok) {
          overlay.remove();
          this.requestRender();
        }
      };
    });
    panel.querySelectorAll('[data-del-slot]').forEach(btn => {
      btn.onclick = () => {
        const slotId = +btn.dataset.delSlot;
        const result = SaveSystem.deleteSlot(slotId);
        this.toast(result.msg, 'success');
        overlay.remove();
        this.showSavePanel(mode); // 刷新面板
      };
    });
  }
};

// 导出
if (typeof window !== 'undefined') {
  window.UI = UI;
  window.ENDINGS = ENDINGS;
}
