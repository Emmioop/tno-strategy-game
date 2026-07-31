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
      <button class="btn-secondary" id="btn-restart">放弃存档并重启</button>
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
      case 'map': content.innerHTML = this.renderMap(); break;
      case 'industry': content.innerHTML = this.renderIndustry(); break;
      case 'policy': content.innerHTML = this.renderPolicy(); break;
      case 'tech': content.innerHTML = this.renderTech(); break;
      case 'events': content.innerHTML = this.renderEventLog(); break;
    }
  },

  // ===== 势力地图页 =====
  renderMap() {
    const s = Game.state;
    const f = s.flags;

    // 战争标志检测
    const hasWar = f.war_europe || f.war_africa || f.war_middle_east || f.war_asia || f.civil_war_imminent;
    const warEurope = f.war_europe || f.civil_war_imminent;
    const warAfrica = f.war_africa || f.italy_africa_collapse;
    const warMiddleEast = f.war_middle_east || f.suez_crisis || f.first_nile_war;
    const warAsia = f.war_asia;

    // 判断各势力状态颜色
    const germanyColor = f.civil_war_imminent && !f.civil_war_over ? '#6a2a2a' : '#a83232';
    const germanyLabel = f.civil_war_imminent && !f.civil_war_over ? '大日耳曼国（内战）' : '大日耳曼国';

    const burgundyColor = '#4a2a4a';
    const italyColor = f.italy_accepted || f.italy_leaves_sphere ? '#3a6a3a' : '#5a8a4a';
    const italyLabel = f.italy_accepted ? '意大利（已脱离）' : '意大利（三头同盟）';

    const iberiaColor = f.iberian_collapse ? '#6a5a3a' : '#8a7a4a';
    const iberiaLabel = f.iberian_collapse ? '伊比利亚（崩溃）' : '伊比利亚联盟';

    const englandColor = f.britain_withdrawn ? '#4a4a5a' : '#5a5a6a';

    // 法国颜色：根据抵抗运动和谈判状态
    const franceOccupiedColor = f.french_resistance_crushed ? '#7a3a2a' : '#5a3a3a';
    const freeFranceColor = f.french_negotiation ? '#4a7a5a' : '#3a6a4a';
    const vichyColor = f.french_resistance_crushed ? '#6a5a3a' : '#8a4a3a';
    const franceLabel = f.french_resistance_crushed ? '法国（占领·抵抗被镇压）' :
                        f.french_negotiation ? '法国（维希·谈判中）' :
                        '法国（德国占领/维希）';
    const freeFranceLabel = f.french_negotiation ? '自由法国（南部·谈判）' : '自由法国（南部抵抗）';

    // 非洲颜色
    const northAfricaColor = warAfrica ? '#8a3a3a' : '#7a5a3a';
    const italyAfricaColor = warAfrica ? '#7a4a2a' : '#6a7a4a';
    const egyptColor = warMiddleEast ? '#8a6a2a' : '#6a7a5a';
    const subSaharanColor = warAfrica ? '#5a4a2a' : '#4a5a3a';

    // 中东颜色
    const iranColor = warMiddleEast ? '#7a4a4a' : '#5a6a5a';
    const iraqColor = warMiddleEast ? '#7a5a3a' : '#5a7a5a';
    const saudiColor = '#6a5a4a';

    // 东南亚颜色
    const frenchIndochinaColor = '#5a6a7a';
    const dutchIndiesColor = '#6a7a5a';

    // 俄罗斯颜色根据统一者类型
    let russiaColor = '#3a3a3a';
    let russiaLabel = '俄罗斯（分裂）';
    let russiaFragments = true;
    if (f.russia_democratic) { russiaColor = '#3a7a5a'; russiaLabel = '俄罗斯共和国'; russiaFragments = false; }
    else if (f.russia_communist) { russiaColor = '#8a2a2a'; russiaLabel = '新苏联'; russiaFragments = false; }
    else if (f.russia_fascist) { russiaColor = '#5a3a3a'; russiaLabel = '俄罗斯民族国'; russiaFragments = false; }
    else if (f.russia_madman) { russiaColor = '#2a2a2a'; russiaLabel = '摄政俄罗斯（疯狂）'; russiaFragments = false; }
    else if (f.russia_monarchist) { russiaColor = '#4a4a8a'; russiaLabel = '俄罗斯帝国'; russiaFragments = false; }

    const turkeyColor = f.turkey_junta ? '#6a6a3a' : '#5a5a4a';

    // 关系连线颜色
    const relLine = (val) => {
      if (val > 20) return '#4a8a4a';
      if (val > -10) return '#5a5a5a';
      if (val > -40) return '#8a6a3a';
      return '#a83232';
    };

    // 战争动画样式
    const warAnimStyle = `animation: warBlink 1.2s ease-in-out infinite;`;
    const warShakeStyle = `animation: warShake 0.6s ease-in-out infinite;`;

    // 生成俄罗斯分裂区域
    const russiaFragmentHtml = russiaFragments ? `
      <g class="russia-fragments" opacity="0.7">
        <path d="M 540 180 L 590 175 L 610 220 L 580 250 L 540 240 Z" fill="#4a3a3a" stroke="#2a2a2a" stroke-width="1" class="map-region" data-info="西俄罗斯"/>
        <path d="M 590 175 L 650 170 L 670 210 L 610 220 Z" fill="#3a4a3a" stroke="#2a2a2a" stroke-width="1" class="map-region" data-info="乌拉尔"/>
        <path d="M 650 170 L 720 175 L 730 220 L 670 210 Z" fill="#3a3a4a" stroke="#2a2a2a" stroke-width="1" class="map-region" data-info="西伯利亚"/>
        <path d="M 720 175 L 770 185 L 775 230 L 730 220 Z" fill="#4a4a3a" stroke="#2a2a2a" stroke-width="1" class="map-region" data-info="远东"/>
        <text x="565" y="215" font-size="8" fill="#8a8a8a" text-anchor="middle">西俄</text>
        <text x="630" y="200" font-size="8" fill="#8a8a8a" text-anchor="middle">乌拉尔</text>
        <text x="690" y="200" font-size="8" fill="#8a8a8a" text-anchor="middle">西伯利亚</text>
        <text x="745" y="210" font-size="8" fill="#8a8a8a" text-anchor="middle">远东</text>
      </g>
    ` : `
      <path d="M 540 175 L 770 180 L 775 235 L 540 245 Z" fill="${russiaColor}" stroke="#1a1a1a" stroke-width="1.5" class="map-region russia-unified" data-info="${russiaLabel}"/>
      <text x="655" y="215" font-size="11" fill="#e8e6e0" text-anchor="middle" font-family="Georgia,serif">${russiaLabel}</text>
    `;

    // 生成SVG地图
    const mapSvg = `
      <svg viewBox="0 0 900 650" class="world-map" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="waves" x="0" y="0" width="45" height="22" patternUnits="userSpaceOnUse">
            <path d="M 0 11 Q 11 5, 22 11 T 45 11" stroke="#0f1520" fill="none" stroke-width="0.5"/>
            <path d="M 0 18 Q 11 12, 22 18 T 45 18" stroke="#0f1520" fill="none" stroke-width="0.3" opacity="0.5"/>
          </pattern>
          <pattern id="medSea" x="0" y="0" width="30" height="15" patternUnits="userSpaceOnUse">
            <path d="M 0 7 Q 7 3, 15 7 T 30 7" stroke="#1a3550" fill="none" stroke-width="0.4"/>
          </pattern>
          <style>
            @keyframes warBlink { 0%,100%{opacity:0.3} 50%{opacity:1} }
            @keyframes warShake { 0%,100%{transform:translate(0,0)} 25%{transform:translate(1px,-1px)} 50%{transform:translate(-1px,1px)} 75%{transform:translate(1px,1px)} }
            @keyframes explosion { 0%{r:2;opacity:1} 100%{r:10;opacity:0} }
          </style>
        </defs>
        <rect width="900" height="650" fill="#0a0e14"/>
        <rect width="900" height="650" fill="url(#waves)" opacity="0.3"/>
        <g stroke="#181824" stroke-width="0.4" opacity="0.35">
          <line x1="0" y1="130" x2="900" y2="130"/>
          <line x1="0" y1="260" x2="900" y2="260"/>
          <line x1="0" y1="390" x2="900" y2="390"/>
          <line x1="0" y1="520" x2="900" y2="520"/>
          <line x1="180" y1="0" x2="180" y2="650"/>
          <line x1="360" y1="0" x2="360" y2="650"/>
          <line x1="540" y1="0" x2="540" y2="650"/>
          <line x1="720" y1="0" x2="720" y2="650"/>
        </g>

        <!-- ===== 地中海 ===== -->
        <path d="M 310 395 Q 340 390, 375 392 Q 395 388, 415 380 Q 435 375, 455 365 Q 470 355, 480 340 L 488 325 Q 490 345, 485 365 Q 480 385, 470 400 Q 458 415, 440 425 Q 420 435, 395 438 Q 370 440, 345 435 Q 322 430, 310 418 Z"
              fill="#0f1e2e" stroke="#1a3550" stroke-width="0.8"/>
        <path d="M 310 395 Q 340 390, 375 392 Q 395 388, 415 380 Q 435 375, 455 365 Q 470 355, 480 340 L 488 325 Q 490 345, 485 365 Q 480 385, 470 400 Q 458 415, 440 425 Q 420 435, 395 438 Q 370 440, 345 435 Q 322 430, 310 418 Z"
              fill="url(#medSea)" opacity="0.5"/>
        <text x="395" y="410" font-size="7" fill="#3a6a8a" text-anchor="middle" opacity="0.6">地中海</text>

        <!-- ===== 北欧：冰岛 ===== -->
        <path d="M 225 55 Q 248 48, 270 52 Q 282 62, 278 82 Q 268 95, 245 93 Q 225 85, 222 70 Z"
              fill="#3a3a48" stroke="#2a2a2a" stroke-width="1" class="map-region" data-info="冰岛"/>
        <text x="250" y="75" font-size="6" fill="#6a6a7a" text-anchor="middle">冰岛</text>

        <!-- ===== 北欧：斯堪的纳维亚 ===== -->
        <path d="M 360 70 L 372 58 Q 385 48, 400 52 Q 418 45, 438 50 Q 455 55, 468 70 Q 480 85, 482 105 Q 478 125, 465 138 Q 450 148, 432 152 Q 415 148, 405 138 L 392 128 Q 380 118, 372 105 Q 362 92, 360 80 Z"
              fill="#3a3a44" stroke="#2a2a2a" stroke-width="1" class="map-region" data-info="斯堪的纳维亚（中立）"/>
        <text x="420" y="100" font-size="8" fill="#6a6a7a" text-anchor="middle">斯堪的纳维亚</text>

        <!-- ===== 北欧：芬兰（斯堪的纳维亚东边界共享） ===== -->
        <path d="M 468 70 Q 490 62, 508 68 Q 520 78, 522 95 Q 520 115, 510 128 Q 498 138, 482 138 L 465 138 Q 478 125, 482 105 Q 480 85, 468 70 Z"
              fill="#4a4a54" stroke="#2a2a2a" stroke-width="1" class="map-region" data-info="芬兰"/>
        <text x="495" y="100" font-size="7" fill="#7a7a8a" text-anchor="middle">芬兰</text>

        <!-- ===== 北欧：爱尔兰 ===== -->
        <path d="M 238 158 Q 252 150, 265 152 Q 273 162, 272 178 Q 268 192, 255 196 Q 242 193, 236 182 Q 233 170, 238 158 Z"
              fill="${englandColor}" stroke="#1a1a1a" stroke-width="0.8" opacity="0.85" class="map-region" data-info="爱尔兰"/>
        <text x="254" y="176" font-size="5.5" fill="#a8a6a0" text-anchor="middle">爱尔兰</text>

        <!-- ===== 西欧：大不列颠岛（北部苏格兰+南部英格兰共享边界） ===== -->
        <path d="M 278 140 Q 290 130, 308 128 Q 325 132, 335 145 L 338 160 Q 342 152, 352 150 Q 362 155, 364 168 L 362 190 Q 355 205, 340 210 Q 322 214, 308 208 Q 292 200, 285 185 Q 278 170, 278 155 Z"
              fill="${englandColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="大不列颠岛"/>
        <!-- 苏格兰-英格兰分界 -->
        <path d="M 285 168 Q 305 170, 328 166" fill="none" stroke="#3a3a4a" stroke-width="0.6" stroke-dasharray="2,2"/>
        <text x="310" y="152" font-size="6" fill="#8a8a9a" text-anchor="middle">苏格兰</text>
        <text x="318" y="192" font-size="8" fill="#a8a6a0" text-anchor="middle" font-weight="bold">英格兰</text>

        <!-- ===== 西欧：伊比利亚（西班牙/葡萄牙共享边界） ===== -->
        <path d="M 180 330 Q 192 320, 210 318 Q 235 315, 262 320 Q 280 325, 292 338 Q 300 355, 298 378 Q 295 400, 282 415 Q 268 428, 248 430 Q 222 427, 200 418 Q 185 405, 178 385 Q 172 362, 176 345 Z"
              fill="${iberiaColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="${iberiaLabel}"/>
        <!-- 葡萄牙（伊比利亚西边界共享） -->
        <path d="M 180 330 Q 188 326, 198 335 Q 202 355, 200 378 Q 198 400, 192 412 L 182 400 Q 175 382, 173 362 Q 172 348, 180 330 Z"
              fill="${iberiaColor}" stroke="#2a2a2a" stroke-width="0.5" opacity="0.7" class="map-region" data-info="葡萄牙"/>
        <text x="190" y="372" font-size="5.5" fill="#c8b88a" text-anchor="middle">葡</text>
        <text x="245" y="375" font-size="9" fill="#d8c8a0" text-anchor="middle" font-weight="bold">伊比利亚</text>

        <!-- ===== 西欧：法国北部（德占区）· 南边界与自由法国共享 ===== -->
        <path d="M 260 220 Q 272 212, 290 210 Q 310 205, 328 212 Q 340 218, 344 232 Q 348 245, 348 260 L 346 285 Q 338 292, 322 295 Q 298 298, 280 295 Q 268 290, 262 278 Q 256 262, 258 245 Z"
              fill="${franceOccupiedColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="法兰西（德国占领区）"/>
        <text x="302" y="255" font-size="7" fill="#c8a0a0" text-anchor="middle" font-weight="bold">德占法国</text>

        <!-- ===== 西欧：法国南部（自由法国/维希）· 北与德占法共享，西与伊比利亚共享 ===== -->
        <path d="M 262 278 Q 280 295, 298 298 L 322 295 Q 338 292, 346 285 L 350 300 Q 358 310, 360 325 L 358 355 Q 350 375, 332 385 Q 310 392, 290 388 Q 270 380, 260 365 Q 250 345, 252 320 Q 254 300, 262 278 Z"
              fill="${vichyColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="${franceLabel}"/>
        <text x="308" y="330" font-size="7" fill="#d8a87a" text-anchor="middle">${f.french_resistance_crushed ? '维希法国' : '维希'}</text>
        <text x="308" y="350" font-size="6.5" fill="#a8d8a8" text-anchor="middle">${freeFranceLabel.length > 8 ? '自由法国' : freeFranceLabel}</text>

        <!-- 法国战争标记 -->
        ${warEurope ? `
        <g style="${warAnimStyle}">
          <line x1="288" y1="310" x2="302" y2="322" stroke="#ff4444" stroke-width="2"/>
          <line x1="302" y1="310" x2="288" y2="322" stroke="#ff4444" stroke-width="2"/>
          <circle cx="295" cy="316" r="7" fill="none" stroke="#ff4444" stroke-width="1" opacity="0.6"/>
        </g>
        <g style="${warShakeStyle}">
          <polygon points="342,300 355,302 348,312" fill="#ff6644" opacity="0.7"/>
        </g>` : ''}

        <!-- ===== 中欧：荷兰（南与比利时共享，东与大日耳曼国共享） ===== -->
        <path d="M 328 212 Q 340 208, 352 210 Q 360 216, 358 228 L 356 244 Q 350 248, 344 245 Q 348 245, 344 232 Q 340 218, 328 212 Z"
              fill="#6a7a8a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="荷兰（中立）"/>
        <text x="344" y="229" font-size="5.5" fill="#a8a6a0" text-anchor="middle">荷兰</text>

        <!-- ===== 中欧：比利时（北与荷兰共享，南与勃艮第共享，西与德占法共享） ===== -->
        <path d="M 344 245 Q 356 244, 362 250 L 360 268 Q 354 278, 348 285 L 346 285 L 348 260 Q 348 245, 344 245 Z"
              fill="#7a6a5a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="比利时（中立）"/>
        <text x="353" y="265" font-size="5.5" fill="#a8a6a0" text-anchor="middle">比</text>

        <!-- ===== 中欧：勃艮第（北与比利时共享，西与德占法/自由法共享，东与大日耳曼国共享） ===== -->
        <path d="M 360 268 Q 372 262, 390 260 Q 405 258, 412 265 Q 418 275, 414 290 L 408 312 Q 398 320, 380 322 Q 360 320, 358 310 Q 350 300, 348 285 Q 354 278, 360 268 Z"
              fill="${burgundyColor}" stroke="#1a1a1a" stroke-width="1.5" class="map-region burgundy-region" data-info="勃艮第国（希姆莱）"/>
        <text x="385" y="292" font-size="8" fill="#8a6a8a" text-anchor="middle" font-weight="bold">勃艮第</text>

        <!-- ===== 中欧：瑞士（北与勃艮第/大日耳曼共享，东与奥地利共享，南与意大利共享，西与自由法共享） ===== -->
        <path d="M 398 290 L 414 290 Q 422 288, 428 296 Q 430 308, 424 318 Q 418 328, 408 328 L 400 325 Q 398 320, 408 312 Q 402 300, 398 290 Z"
              fill="#8a7a6a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="瑞士（中立）"/>
        <!-- 阿尔卑斯山锯齿标记 -->
        <path d="M 404 302 L 408 296 L 412 302 L 416 294 L 420 302 L 424 296 L 426 304" fill="none" stroke="#6a6a6a" stroke-width="0.8" opacity="0.7"/>
        <text x="414" y="312" font-size="5" fill="#a8a6a0" text-anchor="middle">瑞士</text>

        <!-- ===== 中欧：大日耳曼国（合并德/奥/捷） ===== -->
        <!-- 西边界：与荷/比/勃艮第/瑞士共享 -->
        <!-- 南边界：与瑞士/意大利/南斯拉夫共享 -->
        <!-- 东边界：与波兰/匈牙利共享（即西俄的西边界） -->
        <!-- 北边界：与斯堪的纳维亚/海相邻 -->
        <path d="M 352 210 Q 370 200, 392 195 Q 415 192, 438 196 Q 460 198, 478 205 Q 498 208, 514 215 Q 530 222, 540 235 Q 548 250, 548 275 Q 546 300, 538 320 Q 530 338, 518 350 Q 504 358, 490 352 Q 478 342, 472 330 L 465 315 Q 455 305, 448 312 L 435 325 Q 425 328, 424 318 Q 430 308, 428 296 Q 422 288, 414 290 Q 418 275, 412 265 Q 405 258, 390 260 Q 372 262, 362 250 L 358 228 Q 360 216, 352 210 Z"
              fill="${germanyColor}" stroke="#e8c860" stroke-width="2" class="map-region germany-region" data-info="${germanyLabel}"/>
        <text x="455" y="258" font-size="12" fill="#e8c860" text-anchor="middle" font-family="Georgia,serif" font-weight="bold">大日耳曼国</text>
        <text x="470" y="290" font-size="6.5" fill="#d8b8d0" text-anchor="middle">奥</text>
        <text x="495" y="242" font-size="6.5" fill="#d8c8a8" text-anchor="middle">捷</text>

        <!-- ===== 东欧：波兰/东方总督辖区（西与大日耳曼共享，东与西俄共享） ===== -->
        <path d="M 540 235 Q 560 228, 585 228 Q 610 228, 628 235 Q 638 245, 638 265 L 636 290 Q 630 302, 618 308 Q 598 312, 578 308 Q 560 302, 550 292 Q 542 282, 546 275 Q 548 250, 540 235 Z"
              fill="#7a2a2a" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="东方总督辖区"/>
        <text x="588" y="268" font-size="8" fill="#c8a0a0" text-anchor="middle" font-weight="bold">东方总督辖区</text>

        <!-- ===== 东欧：匈牙利（北与大日耳曼/波兰共享，西与奥地利共享，南与南斯拉夫共享，东与罗马尼亚共享） ===== -->
        <path d="M 490 320 Q 505 312, 522 312 Q 540 312, 550 320 Q 558 330, 555 345 L 548 360 Q 538 368, 522 368 Q 505 365, 492 355 Q 486 345, 490 332 Z"
              fill="#7a5a5a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="匈牙利（帝国卫星）"/>
        <text x="522" y="345" font-size="6.5" fill="#d8b8b8" text-anchor="middle">匈牙利</text>

        <!-- ===== 东欧：罗马尼亚（西与匈牙利共享，北与波兰共享，南与保加利亚共享，东与俄罗斯共享） ===== -->
        <path d="M 550 292 Q 570 288, 590 288 Q 608 288, 618 295 Q 625 305, 622 322 L 615 345 Q 605 355, 588 355 L 555 350 Q 558 330, 550 320 Q 548 312, 550 292 Z"
              fill="#7a5a4a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="罗马尼亚（帝国卫星）"/>
        <text x="585" y="325" font-size="6.5" fill="#d8c8a0" text-anchor="middle">罗马尼亚</text>
        <text x="610" y="305" font-size="5.5" fill="#c8a8a0" text-anchor="middle">高加索</text>

        <!-- ===== 东欧：保加利亚（北与罗马尼亚共享，西与南斯拉夫/希腊共享，南与土耳其/海共享） ===== -->
        <path d="M 522 368 Q 540 365, 555 368 Q 570 370, 575 380 Q 578 392, 572 402 L 562 412 Q 550 415, 538 412 Q 525 408, 518 398 Q 512 385, 522 375 Z"
              fill="#6a4a5a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="保加利亚（帝国卫星）"/>
        <text x="548" y="392" font-size="6" fill="#c8a8c0" text-anchor="middle">保加利亚</text>

        <!-- ===== 东欧：南斯拉夫（北与大日耳曼/匈牙利共享，东与保加利亚共享，南与希腊共享，西与意大利/海共享） ===== -->
        <path d="M 448 325 Q 462 320, 478 322 L 490 332 Q 486 345, 492 355 L 498 370 Q 492 380, 482 385 L 468 378 Q 455 370, 448 358 Q 442 345, 448 332 Z"
              fill="#6a5a6a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="南斯拉夫（帝国卫星）"/>
        <text x="472" y="355" font-size="6.5" fill="#c8b8c8" text-anchor="middle">南斯拉夫</text>

        <!-- ===== 东欧：希腊（北与南斯拉夫/保加利亚共享，东与土耳其共享） ===== -->
        <path d="M 468 378 Q 482 385, 495 385 L 518 398 Q 525 408, 522 420 L 512 428 Q 498 430, 488 422 Q 475 412, 470 400 Q 464 388, 468 378 Z"
              fill="#5a6a7a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="希腊（中立/帝国卫星）"/>
        <text x="495" y="410" font-size="6.5" fill="#a8b8d0" text-anchor="middle">希腊</text>

        <!-- ===== 东欧：土耳其（西与希腊共享，北与保加利亚/黑海共享，东与中东黎凡特共享） ===== -->
        <path d="M 512 428 Q 535 422, 558 420 Q 582 418, 600 425 Q 615 432, 618 445 Q 620 460, 610 468 Q 595 472, 575 468 Q 552 462, 535 455 Q 518 445, 512 432 Z"
              fill="${turkeyColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="土耳其"/>
        <text x="562" y="448" font-size="8" fill="#a8a0a0" text-anchor="middle">土耳其</text>

        <!-- ===== 中欧：意大利（北与瑞士/大日耳曼共享，北西与自由法共享，东与南斯拉夫共享，靴型半岛） ===== -->
        <path d="M 358 355 Q 370 360, 382 362 L 400 362 Q 408 350, 408 328 L 424 318 Q 425 328, 435 325 L 448 340 Q 452 355, 448 370 L 452 385 Q 458 402, 448 415 Q 438 425, 426 428 L 432 445 Q 428 450, 420 448 Q 410 435, 405 420 Q 400 405, 395 390 Q 385 378, 372 382 Q 358 388, 350 375 Q 352 365, 358 355 Z"
              fill="${italyColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="${italyLabel}"/>
        <text x="408" y="385" font-size="9" fill="#c8e8a0" text-anchor="middle" font-weight="bold">意大利</text>
        <!-- 西西里岛 -->
        <path d="M 410 452 Q 420 448, 430 450 Q 438 455, 435 465 Q 428 472, 418 470 Q 408 466, 408 458 Z" fill="${italyColor}" stroke="#1a1a1a" stroke-width="0.5" opacity="0.75" class="map-region" data-info="西西里"/>
        <text x="422" y="463" font-size="5" fill="#a8c880" text-anchor="middle">西西里</text>
        <!-- 撒丁岛 -->
        <path d="M 342 398 Q 352 395, 358 402 Q 360 415, 352 422 Q 342 425, 338 415 Q 338 404, 342 398 Z" fill="${italyColor}" stroke="#1a1a1a" stroke-width="0.5" opacity="0.75" class="map-region" data-info="撒丁岛"/>
        <text x="349" y="412" font-size="4.5" fill="#a8c880" text-anchor="middle">撒丁</text>

        <!-- 利比亚与意大利海上连线 -->
        <line x1="428" y1="445" x2="430" y2="485" stroke="${italyColor}" stroke-width="0.8" stroke-dasharray="3,3" opacity="0.5"/>

        <!-- ===== 俄罗斯区域 ===== -->
        ${russiaFragments ? `
        <g class="russia-fragments">
          <!-- 西俄：西边界与波兰/罗马尼亚共享 -->
          <path d="M 628 235 Q 648 228, 672 228 Q 685 240, 685 270 L 682 300 Q 678 318, 668 328 Q 652 332, 636 328 L 622 322 Q 625 305, 618 295 Q 608 288, 590 288 L 618 308 Q 630 302, 636 290 L 638 265 Q 638 245, 628 235 Z"
                fill="#4a3a3a" stroke="#2a2a2a" stroke-width="1" class="map-region" data-info="西俄罗斯"/>
          <text x="658" y="270" font-size="8" fill="#a89090" text-anchor="middle">西俄</text>
          <!-- 乌拉尔：西与西俄共享 -->
          <path d="M 672 228 Q 695 225, 718 228 Q 728 238, 728 268 L 725 298 Q 722 315, 712 322 Q 695 325, 680 322 L 668 328 Q 678 318, 682 300 L 685 270 Q 685 240, 672 228 Z"
                fill="#3a4a3a" stroke="#2a2a2a" stroke-width="1" class="map-region" data-info="乌拉尔"/>
          <text x="702" y="270" font-size="8" fill="#90a890" text-anchor="middle">乌拉尔</text>
          <!-- 西伯利亚：西与乌拉尔共享 -->
          <path d="M 718 228 Q 745 225, 770 230 Q 782 242, 782 270 L 778 300 Q 775 315, 765 320 Q 745 322, 728 320 L 712 322 Q 722 315, 725 298 L 728 268 Q 728 238, 718 228 Z"
                fill="#3a3a4a" stroke="#2a2a2a" stroke-width="1" class="map-region" data-info="西伯利亚"/>
          <text x="750" y="272" font-size="8" fill="#9090a8" text-anchor="middle">西伯利亚</text>
          <!-- 远东：西与西伯利亚共享 -->
          <path d="M 770 230 Q 798 228, 822 235 Q 835 248, 835 275 L 832 300 Q 828 315, 815 320 Q 795 320, 778 316 L 765 320 Q 775 315, 778 300 L 782 270 Q 782 242, 770 230 Z"
                fill="#4a4a3a" stroke="#2a2a2a" stroke-width="1" class="map-region" data-info="远东"/>
          <text x="802" y="275" font-size="7.5" fill="#a8a890" text-anchor="middle">远东</text>
          <!-- AA线（乌拉尔边界） -->
          <line x1="718" y1="225" x2="718" y2="325" stroke="#c9a84a" stroke-width="1" stroke-dasharray="2,2" opacity="0.6"/>
          <text x="718" y="220" font-size="6.5" fill="#c9a84a" text-anchor="middle" opacity="0.8">AA线</text>
        </g>` : `
        <path d="M 628 235 Q 660 225, 720 225 Q 780 226, 822 235 Q 835 248, 835 275 L 832 310 Q 828 325, 812 330 Q 760 332, 700 330 Q 652 328, 636 322 L 622 318 Q 625 305, 618 295 Q 608 288, 590 288 L 618 308 Q 630 302, 636 290 L 638 265 Q 638 245, 628 235 Z"
              fill="${russiaColor}" stroke="#1a1a1a" stroke-width="1.5" class="map-region russia-unified" data-info="${russiaLabel}"/>
        <text x="728" y="282" font-size="11" fill="#e8e6e0" text-anchor="middle" font-family="Georgia,serif" font-weight="bold">${russiaLabel}</text>
        `}

        <!-- ===== 北非：摩洛哥/阿尔及利亚（北与自由法共享地中海海岸线，东与利比亚共享） ===== -->
        <path d="M 260 470 Q 285 465, 315 463 Q 352 462, 390 465 Q 425 468, 440 475 Q 448 485, 445 502 L 438 520 Q 428 528, 405 528 Q 345 528, 295 525 Q 268 520, 258 508 Q 250 495, 254 482 Z"
              fill="${northAfricaColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="北非（法属殖民地）"/>
        <text x="345" y="498" font-size="7" fill="#e8c8a0" text-anchor="middle">摩洛哥/阿尔及利亚</text>

        <!-- ===== 北非：利比亚（西与摩洛哥/阿尔及利亚共享，东与埃及共享） ===== -->
        <path d="M 440 475 Q 465 472, 498 472 Q 530 473, 545 478 Q 555 488, 552 505 L 548 522 Q 540 530, 520 530 Q 465 530, 438 528 L 445 502 Q 448 485, 440 475 Z"
              fill="${italyAfricaColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="利比亚（意大利殖民地）"/>
        <text x="495" y="502" font-size="7" fill="#c8e8a0" text-anchor="middle">利比亚</text>

        <!-- 非洲战争标记 -->
        ${warAfrica ? `
        <g style="${warAnimStyle}">
          <line x1="400" y1="490" x2="415" y2="502" stroke="#ff4444" stroke-width="2"/>
          <line x1="415" y1="490" x2="400" y2="502" stroke="#ff4444" stroke-width="2"/>
          <circle cx="407" cy="496" r="7" fill="none" stroke="#ff4444" stroke-width="1" opacity="0.6"/>
        </g>
        <g style="${warShakeStyle}">
          <circle cx="492" cy="488" r="2.5" fill="#ff6644" opacity="0.8"/>
        </g>` : ''}

        <!-- ===== 北非：埃及（西与利比亚共享） ===== -->
        <path d="M 545 478 Q 568 475, 590 476 Q 605 480, 608 492 Q 610 508, 605 522 L 598 535 Q 588 542, 572 542 Q 550 538, 542 530 L 548 522 Q 552 505, 555 488 Z"
              fill="${egyptColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="埃及"/>
        <text x="575" y="508" font-size="7" fill="#d8c88a" text-anchor="middle" font-weight="bold">埃及</text>
        <!-- 尼罗河（细蓝线） -->
        <path d="M 582 482 Q 584 500, 580 520 Q 578 535, 576 542" fill="none" stroke="#2a5a8a" stroke-width="1.2" opacity="0.8"/>
        <text x="585" y="518" font-size="5" fill="#4a8aca" text-anchor="start" opacity="0.7">尼罗河</text>

        <!-- ===== 撒哈拉以南非洲 ===== -->
        <path d="M 258 528 Q 300 535, 380 538 Q 480 538, 560 535 L 590 542 Q 602 555, 602 578 L 598 602 Q 590 612, 572 612 Q 480 615, 380 612 Q 295 608, 265 602 Q 252 592, 254 572 Q 255 550, 258 538 Z"
              fill="${subSaharanColor}" stroke="#1a1a1a" stroke-width="0.8" opacity="0.7" class="map-region" data-info="撒哈拉以南非洲（模糊）"/>
        <text x="428" y="578" font-size="7" fill="#6a6a5a" text-anchor="middle" opacity="0.8">撒哈拉以南非洲</text>
        <!-- 马达加斯加 -->
        <path d="M 622 560 Q 630 558, 636 565 Q 640 580, 638 598 Q 635 612, 628 615 Q 618 612, 616 600 Q 614 580, 618 566 Z" fill="${subSaharanColor}" stroke="#1a1a1a" stroke-width="0.5" opacity="0.6" class="map-region" data-info="马达加斯加"/>

        <!-- ===== 中东：黎凡特/伊拉克（西与埃及共享，北与土耳其共享） ===== -->
        <path d="M 535 455 Q 555 450, 575 450 Q 595 450, 610 456 L 610 468 Q 600 472, 590 476 L 590 498 Q 585 508, 575 510 Q 555 508, 542 502 Q 528 492, 525 478 Q 522 465, 535 455 Z"
              fill="${iraqColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="伊拉克/黎凡特"/>
        <text x="565" y="485" font-size="6" fill="#d8b8b8" text-anchor="middle">伊拉克</text>

        <!-- ===== 中东：沙特阿拉伯（北与黎凡特/伊拉克共享，东与阿拉伯半岛共享） ===== -->
        <path d="M 525 495 Q 550 492, 575 495 Q 600 498, 615 505 Q 628 515, 628 535 L 624 555 Q 618 565, 602 565 Q 575 562, 548 555 Q 528 545, 518 528 Q 510 512, 518 500 Z"
              fill="${saudiColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="沙特阿拉伯"/>
        <text x="572" y="532" font-size="7" fill="#c8b898" text-anchor="middle" font-weight="bold">沙特</text>

        <!-- ===== 中东：阿拉伯半岛 ===== -->
        <path d="M 615 505 Q 638 508, 655 518 Q 665 532, 662 552 L 655 570 Q 645 578, 628 575 L 624 555 Q 628 535, 628 515 Z"
              fill="${saudiColor}" stroke="#1a1a1a" stroke-width="0.8" opacity="0.8" class="map-region" data-info="阿拉伯半岛"/>
        <text x="642" y="545" font-size="5.5" fill="#b8a888" text-anchor="middle">阿拉伯半岛</text>

        <!-- ===== 中东：伊朗（西与伊拉克/土耳其共享） ===== -->
        <path d="M 595 422 Q 618 418, 645 420 Q 672 425, 685 438 Q 692 452, 688 470 L 682 488 Q 672 495, 655 492 L 628 485 L 618 468 Q 620 460, 618 445 Q 615 432, 595 422 Z"
              fill="${iranColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="伊朗"/>
        <text x="642" y="458" font-size="7.5" fill="#d8b8b8" text-anchor="middle" font-weight="bold">伊朗</text>

        <!-- 中东战争标记 -->
        ${warMiddleEast ? `
        <g style="${warAnimStyle}">
          <line x1="575" y1="468" x2="590" y2="480" stroke="#ff4444" stroke-width="2"/>
          <line x1="590" y1="468" x2="575" y2="480" stroke="#ff4444" stroke-width="2"/>
          <circle cx="582" y1="474" r="7" fill="none" stroke="#ff4444" stroke-width="1" opacity="0.6"/>
        </g>
        <g style="${warShakeStyle}">
          <polygon points="660,430 675,432 668,442" fill="#ff6644" opacity="0.7"/>
        </g>
        <!-- 苏伊士标记 -->
        <text x="528" y1="488" font-size="5.5" fill="#a8a86a" text-anchor="middle" opacity="0.9">苏伊士</text>` : `
        <text x="528" y="488" font-size="5.5" fill="#a8a86a" text-anchor="middle" opacity="0.6">苏伊士</text>`}

        <!-- ===== 东南亚：法属印度支那 ===== -->
        <path d="M 735 440 Q 752 435, 770 436 Q 785 438, 792 448 Q 795 462, 792 478 L 788 495 Q 780 502, 765 500 Q 748 495, 738 485 Q 730 472, 730 458 Z"
              fill="${frenchIndochinaColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="法属印度支那"/>
        <text x="762" y="472" font-size="6.5" fill="#a8b8c8" text-anchor="middle">法属印度支那</text>

        <!-- ===== 东南亚：荷属东印度（印尼） ===== -->
        <path d="M 795 460 Q 818 455, 848 458 Q 872 462, 882 475 Q 886 490, 882 508 L 875 525 Q 865 530, 845 528 Q 815 522, 798 510 Q 788 498, 790 480 Q 792 468, 795 460 Z"
              fill="${dutchIndiesColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="荷属东印度"/>
        <text x="840" y="495" font-size="6.5" fill="#b8c8d8" text-anchor="middle">荷属东印度</text>

        <!-- ===== 美国/OFN（方框） ===== -->
        <g class="ofn-zone">
          <rect x="20" y="285" width="100" height="110" rx="5" fill="#1a2a4a" stroke="#3a5a8a" stroke-width="1.2" opacity="0.75"/>
          <text x="70" y="330" font-size="10" fill="#6a8aca" text-anchor="middle" font-family="Georgia,serif" font-weight="bold">美国</text>
          <text x="70" y="346" font-size="7.5" fill="#4a6a9a" text-anchor="middle">OFN</text>
          <text x="70" y="362" font-size="6" fill="#3a5a8a" text-anchor="middle" opacity="0.8">自由国家组织</text>
          <line x1="120" y1="345" x2="195" y2="345" stroke="#3a5a8a" stroke-width="1.2" stroke-dasharray="4,3" opacity="0.55"/>
          <polygon points="195,345 187,341 187,349" fill="#3a5a8a" opacity="0.55"/>
        </g>
        <text x="70" y="395" font-size="5.5" fill="#6a8a9a" text-anchor="middle" opacity="0.5">巴拿马</text>

        <!-- ===== 日本（方框） ===== -->
        <g class="japan-zone">
          <rect x="808" y="448" width="85" height="95" rx="5" fill="#4a3a1a" stroke="#8a7a3a" stroke-width="1.2" opacity="0.75"/>
          <text x="850" y="488" font-size="10" fill="#c8a84a" text-anchor="middle" font-family="Georgia,serif" font-weight="bold">日本</text>
          <text x="850" y="504" font-size="7.5" fill="#8a7a3a" text-anchor="middle">共荣圈</text>
          <text x="850" y="520" font-size="6" fill="#8a7a3a" text-anchor="middle" opacity="0.8">大东亚</text>
          <line x1="808" y1="480" x2="790" y2="450" stroke="#8a7a3a" stroke-width="1.2" stroke-dasharray="4,3" opacity="0.55"/>
          <polygon points="790,450 798,448 796,456" fill="#8a7a3a" opacity="0.55"/>
        </g>

        <!-- ===== 关系连线 ===== -->
        <g class="relation-lines" opacity="0.5">
          <line x1="450" y1="320" x2="420" y2="362" stroke="${relLine(s.relations.italy)}" stroke-width="1.8"/>
          ${russiaFragments ? `
          <line x1="618" y1="270" x2="660" y2="270" stroke="${relLine(s.relations.russia)}" stroke-width="1.8" stroke-dasharray="5,3"/>` : `
          <line x1="618" y1="270" x2="680" y2="280" stroke="${relLine(s.relations.russia)}" stroke-width="1.8" stroke-dasharray="5,3"/>`}
          <line x1="390" y1="260" x2="120" y2="345" stroke="${relLine(s.relations.ofn)}" stroke-width="1.5" stroke-dasharray="3,4"/>
          <line x1="390" y1="285" x2="375" y2="290" stroke="${relLine(s.relations.burgundy)}" stroke-width="2"/>
          <line x1="530" y1="235" x2="810" y2="478" stroke="${relLine(s.relations.japan)}" stroke-width="1.2" stroke-dasharray="2,5"/>
          <line x1="518" y1="335" x2="550" y2="428" stroke="${relLine(s.relations.turkey)}" stroke-width="1.3" stroke-dasharray="4,3"/>
          <line x1="568" y1="300" x2="608" y2="430" stroke="${relLine(s.relations.iran || 0)}" stroke-width="0.9" stroke-dasharray="3,4" opacity="0.4"/>
        </g>

        <!-- ===== 战争动画标记 ===== -->
        ${hasWar ? `
        <g class="war-markers">
          ${warEurope ? `
          <g>
            <g style="${warAnimStyle}">
              <line x1="555" y1="248" x2="570" y2="265" stroke="#ff4444" stroke-width="2.2"/>
              <line x1="570" y1="248" x2="555" y2="265" stroke="#ff4444" stroke-width="2.2"/>
              <circle cx="562" cy="256" r="10" fill="none" stroke="#ff4444" stroke-width="1.3" opacity="0.5"/>
            </g>
            <g style="${warShakeStyle}">
              <polygon points="570,248 592,240 588,255" fill="#ff6644" opacity="0.7"/>
              <polygon points="572,270 595,272 586,282" fill="#ff6644" opacity="0.7"/>
            </g>
            <circle cx="578" cy="262" r="3.5" fill="#ff8844" opacity="0.8" style="animation: explosion 1.5s ease-out infinite;"/>
          </g>` : ''}
          ${warAfrica ? `
          <g>
            <g style="${warAnimStyle}">
              <line x1="412" y1="488" x2="427" y2="502" stroke="#ff4444" stroke-width="2.2"/>
              <line x1="427" y1="488" x2="412" y2="502" stroke="#ff4444" stroke-width="2.2"/>
              <circle cx="419" cy="495" r="8" fill="none" stroke="#ff4444" stroke-width="1" opacity="0.5"/>
            </g>
            <g style="${warShakeStyle}">
              <polygon points="482,482 502,478 498,492" fill="#ff6644" opacity="0.7"/>
            </g>
            <circle cx="490" cy="488" r="3" fill="#ff8844" opacity="0.8" style="animation: explosion 1.8s ease-out infinite;"/>
          </g>` : ''}
          ${warMiddleEast ? `
          <g>
            <g style="${warAnimStyle}">
              <line x1="550" y1="480" x2="565" y2="495" stroke="#ff4444" stroke-width="2.2"/>
              <line x1="565" y1="480" x2="550" y2="495" stroke="#ff4444" stroke-width="2.2"/>
              <circle cx="557" cy="487" r="8" fill="none" stroke="#ff4444" stroke-width="1" opacity="0.5"/>
            </g>
            <g style="${warShakeStyle}">
              <polygon points="655,425 672,428 665,438" fill="#ff6644" opacity="0.7"/>
            </g>
          </g>` : ''}
          ${warAsia ? `
          <g>
            <g style="${warAnimStyle}">
              <line x1="760" y1="462" x2="775" y2="478" stroke="#ff4444" stroke-width="2.2"/>
              <line x1="775" y1="462" x2="760" y2="478" stroke="#ff4444" stroke-width="2.2"/>
              <circle cx="767" cy="470" r="8" fill="none" stroke="#ff4444" stroke-width="1" opacity="0.5"/>
            </g>
          </g>` : ''}
        </g>` : ''}

        <!-- 指北针 -->
        <g transform="translate(855, 40)">
          <circle r="15" fill="none" stroke="#3a3a4a" stroke-width="1"/>
          <polygon points="0,-12 -4,4 0,0 4,4" fill="#a83232"/>
          <polygon points="0,12 -4,-4 0,0 4,-4" fill="#3a3a4a"/>
          <text y="-18" text-anchor="middle" font-size="8" fill="#6a6864">N</text>
        </g>

        <!-- 图例（左下角，更紧凑） -->
        <g transform="translate(10, 588)" class="map-legend">
          <rect x="-4" y="-4" width="370" height="52" fill="#0a0a0c" stroke="#2a2a2a" stroke-width="1" rx="2"/>
          <rect x="4" y="4" width="10" height="7" fill="${germanyColor}"/>
          <text x="18" y="10" font-size="7" fill="#a8a6a0">帝国</text>
          <rect x="56" y="4" width="10" height="7" fill="${burgundyColor}"/>
          <text x="70" y="10" font-size="7" fill="#a8a6a0">勃艮第</text>
          <rect x="110" y="4" width="10" height="7" fill="${italyColor}"/>
          <text x="124" y="10" font-size="7" fill="#a8a6a0">意大利</text>
          <rect x="160" y="4" width="10" height="7" fill="${russiaColor}"/>
          <text x="174" y="10" font-size="7" fill="#a8a6a0">俄</text>
          <rect x="198" y="4" width="10" height="7" fill="${freeFranceColor}"/>
          <text x="212" y="10" font-size="7" fill="#a8a6a0">自法</text>
          <rect x="242" y="4" width="10" height="7" fill="${vichyColor}"/>
          <text x="256" y="10" font-size="7" fill="#a8a6a0">维希</text>
          <rect x="292" y="4" width="10" height="7" fill="${egyptColor}"/>
          <text x="306" y="10" font-size="7" fill="#a8a6a0">埃及</text>
          <rect x="340" y="4" width="10" height="7" fill="${saudiColor}"/>
          <text x="354" y="10" font-size="7" fill="#a8a6a0">中东</text>
          <line x1="4" y1="22" x2="17" y2="22" stroke="#4a8a4a" stroke-width="1.6"/>
          <text x="21" y="25" font-size="7" fill="#a8a6a0">友</text>
          <line x1="46" y1="22" x2="59" y2="22" stroke="#5a5a5a" stroke-width="1.6"/>
          <text x="63" y="25" font-size="7" fill="#a8a6a0">中</text>
          <line x1="88" y1="22" x2="101" y2="22" stroke="#a83232" stroke-width="1.6"/>
          <text x="105" y="25" font-size="7" fill="#a8a6a0">敌</text>
          <rect x="136" y="17" width="10" height="7" fill="${northAfricaColor}"/>
          <text x="150" y="24" font-size="7" fill="#a8a6a0">法北非</text>
          <rect x="196" y="17" width="10" height="7" fill="${italyAfricaColor}"/>
          <text x="210" y="24" font-size="7" fill="#a8a6a0">意属非</text>
          <rect x="260" y="17" width="10" height="7" fill="${iranColor}"/>
          <text x="274" y="24" font-size="7" fill="#a8a6a0">伊朗</text>
          <rect x="314" y="17" width="10" height="7" fill="${frenchIndochinaColor}"/>
          <text x="328" y="24" font-size="7" fill="#a8a6a0">印支</text>
          <line x1="4" y1="38" x2="17" y2="38" stroke="#e8c860" stroke-width="1.6"/>
          <text x="21" y="41" font-size="7" fill="#a8a6a0">玩家</text>
          <line x1="60" y1="38" x2="73" y2="38" stroke="#3a5a8a" stroke-width="1.6"/>
          <text x="77" y="41" font-size="7" fill="#a8a6a0">OFN</text>
          <line x1="128" y1="38" x2="141" y2="38" stroke="#8a7a3a" stroke-width="1.6"/>
          <text x="145" y="41" font-size="7" fill="#a8a6a0">共荣圈</text>
          <rect x="200" y="33" width="10" height="7" fill="${iberiaColor}"/>
          <text x="214" y="40" font-size="7" fill="#a8a6a0">伊比利亚</text>
          <rect x="276" y="33" width="10" height="7" fill="${dutchIndiesColor}"/>
          <text x="290" y="40" font-size="7" fill="#a8a6a0">东印度</text>
          <rect x="344" y="33" width="10" height="7" fill="${turkeyColor}"/>
          <text x="358" y="40" font-size="7" fill="#a8a6a0">土</text>
        </g>
      </svg>
    `;

    // 势力详情面板
    const factionDetails = [
      { name: '大日耳曼国', rel: null, desc: germanyLabel, color: germanyColor, isPlayer: true },
      { name: '美国 (OFN)', rel: s.relations.ofn, desc: '自由世界残部，民主灯塔', color: '#3a5a8a' },
      { name: '日本', rel: s.relations.japan, desc: '共荣圈霸主，太平洋帝国', color: '#8a7a3a' },
      { name: '意大利', rel: s.relations.italy, desc: italyLabel, color: italyColor },
      { name: '勃艮第', rel: s.relations.burgundy, desc: '希姆莱的黑暗国度', color: burgundyColor },
      { name: russiaLabel, rel: s.relations.russia, desc: russiaFragments ? '群雄割据，前途未卜' : '已统一的东方巨人', color: russiaColor },
      { name: '法国（自由）', rel: s.relations.france || (f.french_negotiation ? 15 : (f.french_resistance_crushed ? -10 : 0)), desc: freeFranceLabel, color: freeFranceColor },
      { name: '法国（维希）', rel: s.relations.vichy || 0, desc: franceLabel, color: vichyColor },
      { name: '英国（本土）', rel: s.relations.england || (f.britain_withdrawn ? -5 : 5), desc: f.britain_withdrawn ? '英国合作国（撤退中）' : '英国合作国（傀儡）', color: englandColor },
      { name: '土耳其', rel: s.relations.turkey || 0, desc: f.turkey_junta ? '土耳其（军政府）' : '土耳其共和国', color: turkeyColor },
      { name: '伊朗', rel: s.relations.iran || 0, desc: warMiddleEast ? '伊朗（战争中）' : '伊朗王国', color: iranColor },
      { name: '北非（法属）', rel: s.relations.north_africa || 0, desc: warAfrica ? '北非殖民地（战争中）' : '法属北非殖民地', color: northAfricaColor },
      { name: '埃及', rel: s.relations.egypt || 0, desc: warMiddleEast ? '埃及（苏伊士危机）' : '埃及共和国', color: egyptColor },
      { name: '中东', rel: s.relations.middle_east || 0, desc: warMiddleEast ? '中东（战争中）' : '中东诸国', color: saudiColor },
      { name: '东南亚（法属）', rel: s.relations.french_indochina || 0, desc: '法属印度支那', color: frenchIndochinaColor },
      { name: '东南亚（荷属）', rel: s.relations.dutch_indies || 0, desc: '荷属东印度', color: dutchIndiesColor },
    ];

    // 帝国卫星国组
    const satelliteStates = [
      { name: '奥地利', color: '#6a5a7a' },
      { name: '捷克斯洛伐克', color: '#7a6a5a' },
      { name: '匈牙利', color: '#7a5a5a' },
      { name: '罗马尼亚', color: '#7a5a4a' },
      { name: '保加利亚', color: '#6a4a5a' },
      { name: '希腊', color: '#5a6a7a' },
      { name: '南斯拉夫', color: '#6a5a6a' },
      { name: '瑞士', color: '#8a7a6a' },
      { name: '荷兰', color: '#6a7a8a' },
      { name: '比利时', color: '#7a6a5a' },
      { name: '伊比利亚', color: iberiaColor },
    ];

    const relText = (v) => {
      if (v === null) return '—';
      if (v <= -40) return '敌对';
      if (v <= -10) return '冷淡';
      if (v <= 10) return '中立';
      if (v <= 40) return '友好';
      return '盟友';
    };
    const relColor = (v) => {
      if (v === null) return 'var(--text-muted)';
      if (v <= -40) return 'var(--accent-blood-bright)';
      if (v <= -10) return '#c97a3a';
      if (v <= 10) return 'var(--text-muted)';
      if (v <= 40) return 'var(--accent-toxic)';
      return 'var(--accent-gold-bright)';
    };

    const factionHtml = factionDetails.map(fd => `
      <div class="faction-detail-card">
        <div class="fdc-color" style="background:${fd.color}"></div>
        <div class="fdc-info">
          <div class="fdc-name">${fd.name}</div>
          <div class="fdc-desc">${fd.desc}</div>
        </div>
        <div class="fdc-rel" style="color:${relColor(fd.rel)}">
          ${relText(fd.rel)}${fd.rel !== null ? ` ${fd.rel > 0 ? '+' : ''}${fd.rel}` : ''}
        </div>
      </div>
    `).join('');

    // 帝国卫星国组渲染
    const satelliteHtml = `
      <div class="satellite-group" style="margin-top:16px;padding:12px;background:var(--bg-panel);border:1px solid var(--border);border-left:3px solid var(--accent-steel);border-radius:2px;">
        <div style="font-family:var(--font-serif);color:var(--accent-gold);margin-bottom:8px;letter-spacing:0.1em;font-size:12px">帝国卫星国 / 傀儡国</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px">
          ${satelliteStates.map(s => `
            <div style="display:flex;align-items:center;gap:4px;padding:3px 8px;background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:2px;font-size:10px;color:var(--text-secondary)">
              <span style="display:inline-block;width:8px;height:8px;background:${s.color};border-radius:1px"></span>${s.name}
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // 时间轴
    const timelineHtml = this.renderTimeline();

    return `
      <div class="map-page">
        <div class="map-header">
          <h2 style="font-family:var(--font-serif);color:var(--accent-gold-bright);letter-spacing:0.1em">三极世界势力图</h2>
          <div style="font-size:12px;color:var(--text-muted)">${Game.getDateStr()} · 回合 ${s.turn}/${s.totalTurns}</div>
        </div>
        <div class="map-container">${mapSvg}</div>
        <div class="map-factions">${factionHtml}${satelliteHtml}</div>
        <div class="map-timeline-section">
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

  // ===== 自动保存（静默） =====
  autoSave() {
    try {
      localStorage.setItem('tno_game_save', JSON.stringify(Game.state));
    } catch (e) {}
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
