/* ============================================================
 * 千年帝国的最后一息 - UI 渲染与交互
 * ============================================================ */

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

  // ===== 启动游戏 =====
  start() {
    Game.init();
    document.getElementById('splash').style.display = 'none';
    document.getElementById('game').classList.add('active');
    this.renderAll();
    // 触发开场事件
    setTimeout(() => this.processTurnEvents(), 300);
  },

  // ===== 渲染全部 =====
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

    const diffInfo = DIFFICULTIES[s.difficulty] || DIFFICULTIES.normal;

    document.getElementById('topbar').innerHTML = `
      <div class="faction-emblem">大日耳曼国 <span style="font-size:10px;color:${diffInfo.color};border:1px solid ${diffInfo.color};padding:1px 5px;border-radius:2px;margin-left:6px">${diffInfo.name}</span></div>
      <div class="leader-info">
        <div>元首</div>
        <div class="leader-name">${s.leader.name}</div>
        <div style="font-size:10px;color:var(--text-muted)">${s.leader.title || ''}</div>
      </div>
      <div class="resources">
        <div class="resource" title="帝国马克">
          <span class="icon">资金</span>
          <span class="value">${fmt(r.money)}</span>
          ${fmtDelta(income.money)}
        </div>
        <div class="resource" title="人力">
          <span class="icon">人力</span>
          <span class="value">${fmt(r.manpower)}</span>
          ${fmtDelta(income.manpower)}
        </div>
        <div class="resource" title="稳定度">
          <span class="icon">稳定</span>
          <span class="value">${fmt(r.stability)}</span>
          ${fmtDelta(income.stability)}
        </div>
        <div class="resource" title="综合威慑">
          <span class="icon">威慑</span>
          <span class="value">${fmt(r.deterrence)}</span>
          ${fmtDelta(income.deterrence)}
        </div>
        <div class="resource" title="军事实力">
          <span class="icon">军力</span>
          <span class="value">${fmt(r.militaryPower)}</span>
          ${fmtDelta(income.militaryPower)}
        </div>
        <div class="resource" title="核威慑">
          <span class="icon">核慑</span>
          <span class="value">${fmt(r.nukeDeter)}</span>
          ${fmtDelta(income.nukeDeter)}
        </div>
        <div class="resource" title="核武器">
          <span class="icon">核弹</span>
          <span class="value">${fmt(r.nukes)}</span>
        </div>
        <div class="resource" title="研发点数">
          <span class="icon">研发</span>
          <span class="value">${fmt(r.research)}</span>
          ${fmtDelta(income.research)}
        </div>
      </div>
      <div class="date-block">
        <div class="date">${Game.getDateStr()}</div>
        <div class="turn-info">回合 ${s.turn} / ${s.totalTurns}</div>
      </div>
    `;
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
      <button class="btn-secondary" id="btn-save">保存进度</button>
      <button class="btn-secondary" id="btn-restart">重新开始</button>
    `;

    document.getElementById('btn-next-turn').onclick = () => this.nextTurn();
    document.getElementById('btn-save').onclick = () => this.saveGame();
    document.getElementById('btn-restart').onclick = () => {
      if (confirm('确定要重新开始吗？当前进度将丢失。')) {
        location.reload();
      }
    };

    // 移动端底部操作栏
    this.renderMobileActionBar();
  },

  // ===== 移动端底部操作栏 =====
  renderMobileActionBar() {
    const bar = document.getElementById('mobile-action-bar');
    if (!bar) return;
    bar.innerHTML = `
      <button class="mobile-nav-btn" id="m-btn-left" aria-label="势力面板">
        <span class="nav-icon">☰</span>
        <span>势力</span>
      </button>
      <button class="btn-next-turn" id="m-btn-next">下一季度 ▸</button>
      <button class="mobile-nav-btn" id="m-btn-news" aria-label="新闻">
        <span class="nav-icon">📰</span>
        <span>新闻</span>
      </button>
      <button class="mobile-nav-btn" id="m-btn-help" aria-label="教程">
        <span class="nav-icon">？</span>
        <span>教程</span>
      </button>
    `;
    document.getElementById('m-btn-next').onclick = () => this.nextTurn();
    document.getElementById('m-btn-left').onclick = () => this.toggleDrawer('left-panel');
    document.getElementById('m-btn-news').onclick = () => this.toggleDrawer('right-panel');
    document.getElementById('m-btn-help').onclick = () => this.showTutorial();

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
      case 'overview': content.innerHTML = this.renderOverview(); break;
      case 'industry': content.innerHTML = this.renderIndustry(); break;
      case 'policy': content.innerHTML = this.renderPolicy(); break;
      case 'tech': content.innerHTML = this.renderTech(); break;
      case 'events': content.innerHTML = this.renderEventLog(); break;
    }
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
          this.renderAll();
        };
      });
      document.querySelectorAll('[data-demolish]').forEach(btn => {
        btn.onclick = () => {
          const result = Game.demolishBuilding(btn.dataset.demolish);
          this.toast(result.msg, result.ok ? 'success' : 'error');
          this.renderAll();
        };
      });
    }, 0);

    return html;
  },

  // ===== 政策页 =====
  renderPolicy() {
    const s = Game.state;

    const renderPolicyCard = (p) => {
      const current = s.policies[p.id];
      const options = p.options.map(opt => {
        const active = current === opt.id;
        const canChoose = Game.canChoosePolicy(p.id, opt.id);
        const lockedReason = !canChoose ? this.getPolicyLockReason(opt) : '';
        return `<button class="policy-opt ${active ? 'active' : ''}" data-policy="${p.id}" data-opt="${opt.id}" ${canChoose ? '' : 'disabled'} title="${lockedReason}">
          ${opt.name}
          <div style="font-size:10px;color:var(--text-muted);margin-top:2px">${opt.desc}</div>
        </button>`;
      }).join('');

      return `
        <div class="policy-card">
          <h4>${p.name}</h4>
          <div class="p-desc">${p.desc}</div>
          <div class="policy-options">${options}</div>
        </div>`;
    };

    const html = `
      <div class="industry-header">
        <h2>帝国政策</h2>
        <div style="font-size:12px;color:var(--text-muted)">${s.leader.ideology === 'reformist' ? '改革派路线' : s.leader.ideology === 'militarist' ? '军国派路线' : s.leader.ideology === 'conservative' ? '保守派路线' : s.leader.ideology === 'extremist' ? '极端派路线' : '路线未定'}</div>
      </div>
      ${s.chosenPath ? '' : '<div style="padding:14px;background:var(--bg-panel);border:1px dashed var(--border);color:var(--text-muted);font-size:13px;margin-bottom:14px">⚠ 内战尚未结束，部分政策需待路线确定后解锁。</div>'}
      <div class="policy-list">
        ${Object.values(POLICIES).map(renderPolicyCard).join('')}
      </div>
    `;

    setTimeout(() => {
      document.querySelectorAll('[data-policy]').forEach(btn => {
        btn.onclick = () => {
          if (btn.disabled) return;
          const result = Game.setPolicy(btn.dataset.policy, btn.dataset.opt);
          this.toast(result.msg, result.ok ? 'success' : 'error');
          this.renderAll();
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

    const html = `
      <div class="industry-header">
        <h2>科技研发</h2>
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
          this.renderAll();
        };
      });
    }, 0);

    return html;
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

    this.renderAll();

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
      if (Game.state.ended) {
        this.showEnding();
      } else {
        const btn = document.getElementById('btn-next-turn');
        const mBtn = document.getElementById('m-btn-next');
        if (btn) { btn.disabled = false; btn.textContent = '推进至下一季度 ▸'; }
        if (mBtn) { mBtn.disabled = false; mBtn.textContent = '下一季度 ▸'; }
        this.renderAll();
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

  // ===== 保存游戏（localStorage） =====
  saveGame() {
    try {
      localStorage.setItem('tno_game_save', JSON.stringify(Game.state));
      this.toast('进度已保存', 'success');
    } catch (e) {
      this.toast('保存失败', 'error');
    }
  },

  // ===== 加载游戏 =====
  loadGame() {
    try {
      const saved = localStorage.getItem('tno_game_save');
      if (saved) {
        Game.state = JSON.parse(saved);
        // 恢复难度设置
        if (Game.state.difficulty) {
          Game.difficulty = Game.state.difficulty;
        }
        // 兼容性修复：如果有核弹但没有核武技术，自动解锁
        if (Game.state.resources.nukes > 0 && !Game.state.techs['nuclear_tech']) {
          Game.state.techs['nuclear_tech'] = true;
          Game.state.flags['nuclear_tech'] = true;
          localStorage.setItem('tno_game_save', JSON.stringify(Game.state));
        }
        return true;
      }
    } catch (e) {}
    return false;
  }
};

// 导出
if (typeof window !== 'undefined') {
  window.UI = UI;
  window.ENDINGS = ENDINGS;
}
