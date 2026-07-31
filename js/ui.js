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
      <svg viewBox="0 0 1000 700" class="world-map" xmlns="http://www.w3.org/2000/svg">
        <!-- 背景海洋 -->
        <rect width="1000" height="700" fill="#0a0e14"/>

        <!-- 海洋纹理 -->
        <defs>
          <pattern id="waves" x="0" y="0" width="50" height="25" patternUnits="userSpaceOnUse">
            <path d="M 0 12 Q 12 6, 25 12 T 50 12" stroke="#0f1520" fill="none" stroke-width="0.5"/>
            <path d="M 0 20 Q 12 14, 25 20 T 50 20" stroke="#0f1520" fill="none" stroke-width="0.3" opacity="0.5"/>
          </pattern>
          <pattern id="deepWaves" x="0" y="0" width="60" height="30" patternUnits="userSpaceOnUse">
            <path d="M 0 15 Q 15 8, 30 15 T 60 15" stroke="#0a1018" fill="none" stroke-width="0.5"/>
          </pattern>
          <!-- 战争闪烁动画 -->
          <style>
            @keyframes warBlink { 0%,100%{opacity:0.3} 50%{opacity:1} }
            @keyframes warShake { 0%,100%{transform:translate(0,0)} 25%{transform:translate(1px,-1px)} 50%{transform:translate(-1px,1px)} 75%{transform:translate(1px,1px)} }
            @keyframes explosion { 0%{r:2;opacity:1} 100%{r:12;opacity:0} }
            @keyframes dashMove { to { stroke-dashoffset: -12; } }
          </style>
        </defs>
        <rect width="1000" height="700" fill="url(#waves)" opacity="0.3"/>
        <rect width="1000" height="700" fill="url(#deepWaves)" opacity="0.2"/>

        <!-- 经纬线 -->
        <g stroke="#181824" stroke-width="0.5" opacity="0.4">
          <line x1="0" y1="100" x2="1000" y2="100"/>
          <line x1="0" y1="200" x2="1000" y2="200"/>
          <line x1="0" y1="300" x2="1000" y2="300"/>
          <line x1="0" y1="400" x2="1000" y2="400"/>
          <line x1="0" y1="500" x2="1000" y2="500"/>
          <line x1="0" y1="600" x2="1000" y2="600"/>
          <line x1="200" y1="0" x2="200" y2="700"/>
          <line x1="400" y1="0" x2="400" y2="700"/>
          <line x1="600" y1="0" x2="600" y2="700"/>
          <line x1="800" y1="0" x2="800" y2="700"/>
        </g>

        <!-- 大西洋装饰 -->
        <g opacity="0.3" fill="none" stroke="#1a2030" stroke-width="0.5">
          <path d="M 140 50 Q 160 200, 150 400 Q 140 550, 160 690"/>
          <path d="M 100 80 Q 130 250, 120 450 Q 110 600, 130 690"/>
          <path d="M 50 120 Q 90 300, 80 500 Q 70 620, 90 690"/>
        </g>
        <!-- 岛屿装饰 -->
        <g fill="#2a2a34" opacity="0.6">
          <ellipse cx="140" cy="160" rx="8" ry="4"/>
          <ellipse cx="110" cy="320" rx="5" ry="3"/>
          <ellipse cx="130" cy="500" rx="6" ry="3"/>
          <ellipse cx="90" cy="250" rx="4" ry="2"/>
          <ellipse cx="150" cy="580" rx="5" ry="3"/>
        </g>

<!-- ===== 斯堪的纳维亚 ===== -->
        <path d="M 400 70 L 455 65 L 485 95 L 470 140 L 435 135 L 410 110 Z"
              fill="#3a3a44" stroke="#2a2a2a" stroke-width="1" class="map-region" data-info="斯堪的纳维亚（中立）"/>
        <text x="440" y="105" font-size="8" fill="#6a6a7a" text-anchor="middle">斯堪的纳维亚</text>

        <!-- ===== 英格兰（傀儡国） ===== -->
        <path d="M 280 175 L 325 170 L 340 210 L 315 235 L 280 225 Z"
              fill="${englandColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="英格兰合作国"/>
        <text x="310" y="205" font-size="8" fill="#a8a6a0" text-anchor="middle">英格兰</text>
        <!-- 爱尔兰 -->
        <path d="M 260 185 L 278 183 L 282 210 L 265 215 Z" fill="${englandColor}" stroke="#1a1a1a" stroke-width="0.8" opacity="0.8" class="map-region" data-info="爱尔兰"/>

        <!-- ===== 荷兰 ===== -->
        <path d="M 355 198 L 378 196 L 380 215 L 358 217 Z"
              fill="#6a7a8a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="荷兰（中立）"/>
        <text x="367" y="210" font-size="6" fill="#a8a6a0" text-anchor="middle">荷兰</text>

        <!-- ===== 比利时 ===== -->
        <path d="M 355 220 L 385 218 L 387 240 L 358 242 Z"
              fill="#7a6a5a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="比利时（中立）"/>
        <text x="370" y="233" font-size="6" fill="#a8a6a0" text-anchor="middle">比利时</text>

        <!-- ===== 伊比利亚 ===== -->
        <path d="M 200 355 L 280 350 L 295 395 L 265 430 L 210 415 Z"
              fill="${iberiaColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="${iberiaLabel}"/>
        <text x="245" y="395" font-size="9" fill="#d8c8a0" text-anchor="middle">伊比利亚</text>
        <!-- 葡萄牙 -->
        <path d="M 195 365 L 215 362 L 220 410 L 200 410 Z" fill="${iberiaColor}" stroke="#1a1a1a" stroke-width="0.5" opacity="0.7" class="map-region" data-info="葡萄牙"/>

        <!-- ===== 勃艮第（希姆莱之国） ===== -->
        <path d="M 295 260 L 380 258 L 395 305 L 300 315 Z"
              fill="${burgundyColor}" stroke="#1a1a1a" stroke-width="1.5" class="map-region burgundy-region" data-info="勃艮第国（希姆莱）"/>
        <text x="345" y="290" font-size="9" fill="#8a6a8a" text-anchor="middle">勃艮第</text>

        <!-- ===== 法兰西（德国占领区 · 北部） ===== -->
        <path d="M 280 240 L 325 238 L 330 295 L 285 300 Z"
              fill="${franceOccupiedColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="法兰西（德国占领区）"/>
        <text x="303" y="272" font-size="7" fill="#c8a0a0" text-anchor="middle">德占法国</text>

        <!-- ===== 法兰西（维希/自由法国 · 南部） ===== -->
        <path d="M 300 305 L 370 303 L 380 360 L 310 365 Z"
              fill="${vichyColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="${franceLabel}"/>
        <text x="340" y="325" font-size="7" fill="#d8a87a" text-anchor="middle">${f.french_resistance_crushed ? '维希法国' : '维希/自由法国'}</text>
        <text x="340" y="348" font-size="7" fill="#a8d8a8" text-anchor="middle">${freeFranceLabel}</text>

        <!-- 法国战争标记 -->
        ${warEurope ? `
        <g style="${warAnimStyle}">
          <line x1="295" y1="320" x2="310" y2="335" stroke="#ff4444" stroke-width="2"/>
          <line x1="310" y1="320" x2="295" y2="335" stroke="#ff4444" stroke-width="2"/>
          <circle cx="302" cy="327" r="8" fill="none" stroke="#ff4444" stroke-width="1" opacity="0.6"/>
        </g>
        <g style="${warShakeStyle}">
          <polygon points="370,310 385,315 380,325" fill="#ff6644" opacity="0.7"/>
        </g>` : ''}

        <!-- ===== 瑞士 ===== -->
        <path d="M 385 275 L 412 273 L 415 298 L 388 300 Z"
              fill="#8a7a6a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="瑞士（中立）"/>
        <text x="400" y="290" font-size="6" fill="#a8a6a0" text-anchor="middle">瑞士</text>

        <!-- ===== 奥地利 ===== -->
        <path d="M 448 275 L 492 273 L 495 308 L 452 310 Z"
              fill="#6a5a7a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="奥地利（帝国卫星）"/>
        <text x="470" y="295" font-size="7" fill="#c8b8d0" text-anchor="middle">奥地利</text>

        <!-- ===== 捷克斯洛伐克 ===== -->
        <path d="M 448 245 L 492 243 L 495 268 L 452 270 Z"
              fill="#7a6a5a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="捷克斯洛伐克（帝国卫星）"/>
        <text x="470" y="260" font-size="7" fill="#d8c8a8" text-anchor="middle">捷克斯洛伐克</text>

        <!-- ===== 匈牙利 ===== -->
        <path d="M 465 295 L 510 293 L 512 325 L 468 327 Z"
              fill="#7a5a5a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="匈牙利（帝国卫星）"/>
        <text x="488" y="312" font-size="7" fill="#d8b8b8" text-anchor="middle">匈牙利</text>

        <!-- ===== 罗马尼亚 ===== -->
        <path d="M 510 295 L 555 293 L 558 328 L 512 330 Z"
              fill="#7a5a4a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="罗马尼亚（帝国卫星）"/>
        <text x="533" y="312" font-size="7" fill="#d8c8a0" text-anchor="middle">罗马尼亚</text>

        <!-- ===== 保加利亚 ===== -->
        <path d="M 510 335 L 555 333 L 558 365 L 512 367 Z"
              fill="#6a4a5a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="保加利亚（帝国卫星）"/>
        <text x="533" y="352" font-size="7" fill="#c8a8c0" text-anchor="middle">保加利亚</text>

        <!-- ===== 希腊 ===== -->
        <path d="M 490 365 L 530 363 L 535 405 L 493 407 Z"
              fill="#5a6a7a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="希腊（中立/帝国卫星）"/>
        <text x="512" y="388" font-size="7" fill="#a8b8d0" text-anchor="middle">希腊</text>

        <!-- ===== 南斯拉夫 ===== -->
        <path d="M 448 325 L 495 323 L 498 370 L 452 372 Z"
              fill="#6a5a6a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="南斯拉夫（帝国卫星）"/>
        <text x="472" y="350" font-size="7" fill="#c8b8c8" text-anchor="middle">南斯拉夫</text>

        <!-- ===== 大日耳曼国（核心） ===== -->
        <path d="M 395 215 L 525 210 L 540 265 L 520 340 L 470 345 L 410 325 L 395 260 Z"
              fill="${germanyColor}" stroke="#e8c860" stroke-width="2" class="map-region germany-region" data-info="${germanyLabel}"/>
        <text x="468" y="275" font-size="13" fill="#e8c860" text-anchor="middle" font-family="Georgia,serif" font-weight="bold">大日耳曼国</text>

        <!-- 东方总督辖区 -->
        <path d="M 540 240 L 640 235 L 645 290 L 545 295 Z"
              fill="#7a2a2a" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="东方总督辖区"/>
        <text x="592" y="267" font-size="9" fill="#c8a0a0" text-anchor="middle">东方总督辖区</text>

        <!-- 高加索 -->
        <path d="M 540 325 L 630 320 L 635 370 L 545 375 Z"
              fill="#7a2a2a" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="高加索（产油区）"/>
        <text x="587" y="350" font-size="8" fill="#c8a0a0" text-anchor="middle">高加索</text>

        <!-- 莫斯科维（被占领区） -->
        <path d="M 540 200 L 630 195 L 635 235 L 540 240 Z"
              fill="#6a2a2a" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="莫斯科维（占领区）"/>

        <!-- ===== 意大利 ===== -->
        <path d="M 400 325 L 440 323 L 448 370 L 460 410 L 435 440 L 415 415 L 405 370 Z"
              fill="${italyColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="${italyLabel}"/>
        <text x="430" y="385" font-size="9" fill="#c8e8a0" text-anchor="middle">意大利</text>
        <!-- 西西里岛 -->
        <path d="M 410 425 L 427 423 L 428 438 L 412 438 Z" fill="${italyColor}" stroke="#1a1a1a" stroke-width="0.5" opacity="0.7" class="map-region" data-info="西西里"/>
        <!-- 撒丁岛 -->
        <path d="M 395 405 L 407 403 L 408 422 L 397 422 Z" fill="${italyColor}" stroke="#1a1a1a" stroke-width="0.5" opacity="0.7" class="map-region" data-info="撒丁岛"/>

        <!-- ===== 土耳其 ===== -->
        <path d="M 530 425 L 620 420 L 630 465 L 540 470 Z"
              fill="${turkeyColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="土耳其"/>
        <text x="580" y="450" font-size="8" fill="#a8a0a0" text-anchor="middle">土耳其</text>

        <!-- ===== 俄罗斯区域 ===== -->
        ${russiaFragmentHtml}

        <!-- ===== 北非（法国殖民地） ===== -->
        <path d="M 360 480 L 445 478 L 450 525 L 365 530 Z"
              fill="${northAfricaColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="北非（法属殖民地）"/>
        <text x="405" y="507" font-size="7" fill="#e8c8a0" text-anchor="middle">摩洛哥/阿尔及利亚</text>

        <!-- ===== 利比亚（意大利） ===== -->
        <path d="M 450 480 L 535 478 L 540 525 L 455 530 Z"
              fill="${italyAfricaColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="利比亚（意大利殖民地）"/>
        <text x="495" y="507" font-size="7" fill="#c8e8a0" text-anchor="middle">利比亚</text>

        <!-- 非洲战争标记 -->
        ${warAfrica ? `
        <g style="${warAnimStyle}">
          <line x1="420" y1="500" x2="435" y2="515" stroke="#ff4444" stroke-width="2"/>
          <line x1="435" y1="500" x2="420" y2="515" stroke="#ff4444" stroke-width="2"/>
          <circle cx="427" cy="507" r="8" fill="none" stroke="#ff4444" stroke-width="1" opacity="0.6"/>
        </g>
        <g style="${warShakeStyle}">
          <circle cx="500" cy="505" r="3" fill="#ff6644" opacity="0.8"/>
        </g>` : ''}

        <!-- ===== 埃及 ===== -->
        <path d="M 540 480 L 590 478 L 595 525 L 545 530 Z"
              fill="${egyptColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="埃及"/>
        <text x="567" y="507" font-size="7" fill="#d8c88a" text-anchor="middle">埃及</text>

        <!-- ===== 撒哈拉以南非洲（模糊显示） ===== -->
        <path d="M 360 535 L 595 530 L 600 595 L 365 600 Z"
              fill="${subSaharanColor}" stroke="#1a1a1a" stroke-width="0.8" opacity="0.7" class="map-region" data-info="撒哈拉以南非洲（模糊）"/>
        <text x="480" y="565" font-size="7" fill="#6a6a5a" text-anchor="middle" opacity="0.8">撒哈拉以南非洲</text>
        <!-- 马达加斯加 -->
        <ellipse cx="620" cy="580" rx="10" ry="18" fill="${subSaharanColor}" stroke="#1a1a1a" stroke-width="0.5" opacity="0.6" class="map-region" data-info="马达加斯加"/>

        <!-- ===== 中东：伊朗 ===== -->
        <path d="M 600 405 L 675 403 L 680 445 L 605 447 Z"
              fill="${iranColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="伊朗"/>
        <text x="640" y="428" font-size="7" fill="#d8b8b8" text-anchor="middle">伊朗</text>

        <!-- ===== 中东：伊拉克 ===== -->
        <path d="M 580 405 L 618 403 L 620 433 L 582 435 Z"
              fill="${iraqColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="伊拉克"/>
        <text x="600" y="423" font-size="6" fill="#d8b8b8" text-anchor="middle">伊拉克</text>

        <!-- ===== 中东：沙特阿拉伯 ===== -->
        <path d="M 580 445 L 640 443 L 645 495 L 585 498 Z"
              fill="${saudiColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="沙特阿拉伯"/>
        <text x="612" y="472" font-size="7" fill="#c8b898" text-anchor="middle">沙特</text>

        <!-- ===== 阿拉伯半岛 ===== -->
        <path d="M 600 465 L 648 463 L 652 515 L 605 518 Z"
              fill="${saudiColor}" stroke="#1a1a1a" stroke-width="0.8" opacity="0.8" class="map-region" data-info="阿拉伯半岛"/>
        <text x="625" y="495" font-size="6" fill="#b8a888" text-anchor="middle">阿拉伯半岛</text>

        <!-- 中东战争标记 -->
        ${warMiddleEast ? `
        <g style="${warAnimStyle}">
          <line x1="590" y1="430" x2="605" y2="445" stroke="#ff4444" stroke-width="2"/>
          <line x1="605" y1="430" x2="590" y2="445" stroke="#ff4444" stroke-width="2"/>
          <circle cx="597" cy="437" r="8" fill="none" stroke="#ff4444" stroke-width="1" opacity="0.6"/>
        </g>
        <g style="${warShakeStyle}">
          <polygon points="660,420 675,425 670,435" fill="#ff6644" opacity="0.7"/>
        </g>` : ''}

        <!-- ===== 东南亚：法属印度支那 ===== -->
        <path d="M 810 430 L 860 428 L 865 480 L 815 485 Z"
              fill="${frenchIndochinaColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="法属印度支那"/>
        <text x="837" y="458" font-size="7" fill="#a8b8c8" text-anchor="middle">法属印度支那</text>

        <!-- ===== 东南亚：荷属东印度 ===== -->
        <path d="M 865 450 L 935 448 L 940 500 L 870 505 Z"
              fill="${dutchIndiesColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="荷属东印度"/>
        <text x="902" y="478" font-size="7" fill="#b8c8d8" text-anchor="middle">荷属东印度</text>

        <!-- ===== 美国/OFN（远西） ===== -->
        <g class="ofn-zone">
          <rect x="25" y="295" width="110" height="125" rx="4" fill="#1a2a4a" stroke="#3a5a8a" stroke-width="1" opacity="0.7"/>
          <text x="80" y="340" font-size="10" fill="#6a8aca" text-anchor="middle" font-family="Georgia,serif">美国</text>
          <text x="80" y="355" font-size="8" fill="#4a6a9a" text-anchor="middle">OFN</text>
          <!-- 箭头指向欧洲 -->
          <line x1="135" y1="355" x2="220" y2="355" stroke="#3a5a8a" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.6"/>
          <polygon points="220,355 212,351 212,359" fill="#3a5a8a" opacity="0.6"/>
        </g>

        <!-- ===== 日本（远东） ===== -->
        <g class="japan-zone">
          <rect x="900" y="460" width="95" height="100" rx="4" fill="#4a3a1a" stroke="#8a7a3a" stroke-width="1" opacity="0.7"/>
          <text x="947" y="500" font-size="9" fill="#c8a84a" text-anchor="middle" font-family="Georgia,serif">日本</text>
          <text x="947" y="515" font-size="7" fill="#8a7a3a" text-anchor="middle">共荣圈</text>
          <!-- 箭头指向亚洲 -->
          <line x1="900" y1="490" x2="870" y2="455" stroke="#8a7a3a" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.6"/>
          <polygon points="870,455 878,453 876,461" fill="#8a7a3a" opacity="0.6"/>
        </g>

        <!-- ===== 关系连线 ===== -->
        <g class="relation-lines" opacity="0.5">
          <!-- 德国-意大利 -->
          <line x1="470" y1="345" x2="435" y2="325" stroke="${relLine(s.relations.italy)}" stroke-width="2"/>
          <!-- 德国-俄罗斯 -->
          <line x1="540" y1="240" x2="640" y2="230" stroke="${relLine(s.relations.russia)}" stroke-width="2" stroke-dasharray="5,3"/>
          <!-- 德国-美国（跨洋） -->
          <line x1="395" y1="260" x2="135" y2="355" stroke="${relLine(s.relations.ofn)}" stroke-width="2" stroke-dasharray="3,4"/>
          <!-- 德国-勃艮第 -->
          <line x1="410" y1="290" x2="395" y2="285" stroke="${relLine(s.relations.burgundy)}" stroke-width="2"/>
          <!-- 德国-日本（跨大陆） -->
          <line x1="540" y1="215" x2="900" y2="490" stroke="${relLine(s.relations.japan)}" stroke-width="1.5" stroke-dasharray="2,5"/>
          <!-- 德国-土耳其 -->
          <line x1="470" y1="345" x2="540" y2="425" stroke="${relLine(s.relations.turkey)}" stroke-width="1.5" stroke-dasharray="4,3"/>
          <!-- 德国-伊朗(中东) -->
          <line x1="555" y1="290" x2="605" y2="405" stroke="${relLine(s.relations.iran || 0)}" stroke-width="1" stroke-dasharray="3,4" opacity="0.4"/>
        </g>

        <!-- ===== 战争动画标记 ===== -->
        ${hasWar ? `
        <g class="war-markers">
          ${warEurope ? `
          <g>
            <!-- 德国/波兰边境战场 -->
            <g style="${warAnimStyle}">
              <line x1="530" y1="230" x2="550" y2="250" stroke="#ff4444" stroke-width="2.5"/>
              <line x1="550" y1="230" x2="530" y2="250" stroke="#ff4444" stroke-width="2.5"/>
              <circle cx="540" cy="240" r="12" fill="none" stroke="#ff4444" stroke-width="1.5" opacity="0.5"/>
            </g>
            <!-- 进攻箭头 -->
            <g style="${warShakeStyle}">
              <polygon points="550,235 575,225 570,240" fill="#ff6644" opacity="0.7"/>
              <polygon points="555,250 580,255 570,265" fill="#ff6644" opacity="0.7"/>
            </g>
            <!-- 爆炸效果 -->
            <circle cx="555" cy="247" r="4" fill="#ff8844" opacity="0.8" style="animation: explosion 1.5s ease-out infinite;"/>
          </g>` : ''}
          ${warAfrica ? `
          <g>
            <!-- 北非战场 -->
            <g style="${warAnimStyle}">
              <line x1="410" y1="495" x2="430" y2="515" stroke="#ff4444" stroke-width="2.5"/>
              <line x1="430" y1="495" x2="410" y2="515" stroke="#ff4444" stroke-width="2.5"/>
              <circle cx="420" cy="505" r="10" fill="none" stroke="#ff4444" stroke-width="1" opacity="0.5"/>
            </g>
            <!-- 意大利非洲崩溃 -->
            <g style="${warShakeStyle}">
              <polygon points="490,490 510,485 505,500" fill="#ff6644" opacity="0.7"/>
            </g>
            <circle cx="495" cy="495" r="4" fill="#ff8844" opacity="0.8" style="animation: explosion 1.8s ease-out infinite;"/>
          </g>` : ''}
          ${warMiddleEast ? `
          <g>
            <!-- 苏伊士/中东战场 -->
            <g style="${warAnimStyle}">
              <line x1="560" y1="495" x2="580" y2="515" stroke="#ff4444" stroke-width="2.5"/>
              <line x1="580" y1="495" x2="560" y2="515" stroke="#ff4444" stroke-width="2.5"/>
              <circle cx="570" cy="505" r="10" fill="none" stroke="#ff4444" stroke-width="1" opacity="0.5"/>
            </g>
            <g style="${warShakeStyle}">
              <polygon points="620,430 645,425 640,440" fill="#ff6644" opacity="0.7"/>
            </g>
          </g>` : ''}
          ${warAsia ? `
          <g>
            <!-- 东南亚战场 -->
            <g style="${warAnimStyle}">
              <line x1="830" y1="455" x2="850" y2="475" stroke="#ff4444" stroke-width="2.5"/>
              <line x1="850" y1="455" x2="830" y2="475" stroke="#ff4444" stroke-width="2.5"/>
              <circle cx="840" cy="465" r="10" fill="none" stroke="#ff4444" stroke-width="1" opacity="0.5"/>
            </g>
          </g>` : ''}
        </g>` : ''}

        <!-- ===== 标注区域 ===== -->
        <g class="map-annotations">
          <!-- AA线（乌拉尔边界） -->
          ${!russiaFragments ? '' : '<line x1="640" y1="175" x2="640" y2="265" stroke="#c9a84a" stroke-width="1" stroke-dasharray="2,2" opacity="0.6"/><text x="640" y="170" font-size="7" fill="#c9a84a" text-anchor="middle" opacity="0.7">AA线</text>'}
          <!-- 苏伊士运河标记 -->
          <text x="565" y="498" font-size="6" fill="#a8a86a" text-anchor="middle" opacity="0.6">苏伊士</text>
          <!-- 巴拿马运河标记 -->
          <text x="75" y="370" font-size="6" fill="#6a8a9a" text-anchor="middle" opacity="0.5">巴拿马</text>
        </g>

        <!-- 指北针 -->
        <g transform="translate(930, 45)">
          <circle r="18" fill="none" stroke="#3a3a4a" stroke-width="1"/>
          <polygon points="0,-15 -5,5 0,0 5,5" fill="#a83232"/>
          <polygon points="0,15 -5,-5 0,0 5,-5" fill="#3a3a4a"/>
          <text y="-22" text-anchor="middle" font-size="9" fill="#6a6864">N</text>
        </g>

        <!-- 图例 -->
        <g transform="translate(15, 640)" class="map-legend">
          <rect x="-5" y="-5" width="480" height="55" fill="#0a0a0c" stroke="#2a2a2a" stroke-width="1" rx="2"/>
          <rect x="5" y="5" width="12" height="8" fill="${germanyColor}"/>
          <text x="22" y="12" font-size="8" fill="#a8a6a0">帝国核心</text>
          <rect x="75" y="5" width="12" height="8" fill="${burgundyColor}"/>
          <text x="92" y="12" font-size="8" fill="#a8a6a0">勃艮第</text>
          <rect x="145" y="5" width="12" height="8" fill="${italyColor}"/>
          <text x="162" y="12" font-size="8" fill="#a8a6a0">意大利</text>
          <rect x="210" y="5" width="12" height="8" fill="${russiaColor}"/>
          <text x="227" y="12" font-size="8" fill="#a8a6a0">俄罗斯</text>
          <rect x="290" y="5" width="12" height="8" fill="${freeFranceColor}"/>
          <text x="307" y="12" font-size="8" fill="#a8a6a0">自由法国</text>
          <rect x="370" y="5" width="12" height="8" fill="${vichyColor}"/>
          <text x="387" y="12" font-size="8" fill="#a8a6a0">维希法国</text>
          <rect x="440" y="5" width="12" height="8" fill="${egyptColor}"/>
          <text x="457" y="12" font-size="8" fill="#a8a6a0">埃及</text>
          <line x1="5" y1="25" x2="20" y2="25" stroke="#4a8a4a" stroke-width="2"/>
          <text x="25" y="28" font-size="8" fill="#a8a6a0">友好</text>
          <line x1="60" y1="25" x2="75" y2="25" stroke="#5a5a5a" stroke-width="2"/>
          <text x="80" y="28" font-size="8" fill="#a8a6a0">中立</text>
          <line x1="115" y1="25" x2="130" y2="25" stroke="#a83232" stroke-width="2"/>
          <text x="135" y="28" font-size="8" fill="#a8a6a0">敌对</text>
          <rect x="190" y="20" width="12" height="8" fill="${northAfricaColor}"/>
          <text x="207" y="27" font-size="8" fill="#a8a6a0">法属北非</text>
          <rect x="270" y="20" width="12" height="8" fill="${italyAfricaColor}"/>
          <text x="287" y="27" font-size="8" fill="#a8a6a0">意属非洲</text>
          <rect x="350" y="20" width="12" height="8" fill="${iranColor}"/>
          <text x="367" y="27" font-size="8" fill="#a8a6a0">伊朗/中东</text>
          <rect x="430" y="20" width="12" height="8" fill="${frenchIndochinaColor}"/>
          <text x="447" y="27" font-size="8" fill="#a8a6a0">法属印度支那</text>
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
