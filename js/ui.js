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
        <div class="resource" title="稳定度：只能通过事件恢复，持续衰减">
          <span class="icon">稳定</span>
          <span class="value">${fmt(r.stability)}</span>
          ${fmtDelta(income.stability)}
        </div>
        <div class="resource" title="威慑：只能通过事件提升，持续衰减">
          <span class="icon">威慑</span>
          <span class="value">${fmt(r.deterrence)}</span>
          ${fmtDelta(income.deterrence)}
        </div>
        <div class="resource" title="军力：只能通过事件提升，持续衰减">
          <span class="icon">军力</span>
          <span class="value">${fmt(r.militaryPower)}</span>
          ${fmtDelta(income.militaryPower)}
        </div>
        <div class="resource" title="核慑：只能通过事件提升，持续衰减">
          <span class="icon">核慑</span>
          <span class="value">${fmt(r.nukeDeter)}</span>
          ${fmtDelta(income.nukeDeter)}
        </div>
        <div class="resource" title="核武器：通过核设施建造，或事件获得">
          <span class="icon">核弹</span>
          <span class="value">${fmt(r.nukes)}</span>
        </div>
        <div class="resource" title="研发：只能通过事件获得，持续老化衰减">
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
      ${this.isDebugMode() ? '<button class="btn-secondary" id="btn-debug" style="border-color:var(--accent-gold);color:var(--accent-gold);">DEBUG</button>' : ''}
    `;

    document.getElementById('btn-next-turn').onclick = () => this.nextTurn();
    document.getElementById('btn-save').onclick = () => this.saveGame();
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
      case 'shop': content.innerHTML = this.renderShop(); break;
      case 'events': content.innerHTML = this.renderEventLog(); break;
    }
    if (tab === 'shop') {
      this.bindShopEvents();
    }
    if (tab === 'map') {
      // 给普通的.map-region路径添加间隙stroke；特殊势力（德/美/日/勃艮第）保留醒目彩色边框
      setTimeout(() => {
        const specialClasses = ['germany-region', 'ofn-region', 'japan-region', 'burgundy-region'];
        const regions = document.querySelectorAll('.map-container .map-region');
        regions.forEach(path => {
          const isSpecial = specialClasses.some(cls => path.classList.contains(cls));
          if (isSpecial) {
            // 特殊区域：稍微加粗自身彩色边框，并在外面再套一个间隙
            path.setAttribute('stroke-width', (parseFloat(path.getAttribute('stroke-width')) || 1.5) + 1.5);
            path.setAttribute('stroke-linejoin', 'round');
            // 外层间隙：通过 filter / 伪元素不好做，这里简化：原彩色边框 + 比普通稍大的外扩
          } else {
            // 普通区域：深色间隙
            path.setAttribute('stroke', '#1a2030');
            path.setAttribute('stroke-width', '3.5');
            path.setAttribute('stroke-linejoin', 'round');
          }
        });
      }, 0);
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
      <!-- ===== 俄罗斯军阀格局（1962初始）· 布局修正版 ===== -->
      <g class="russia-fragments">
        <!-- AA线（乌拉尔边界，调整到x=800） -->
        <line x1="800" y1="120" x2="800" y2="400" stroke="#c9a84a" stroke-width="1" stroke-dasharray="2,2" opacity="0.65"/>
        <text x="800" y="114" font-size="6.5" fill="#c9a84a" text-anchor="middle" opacity="0.9">AA线</text>

        <!-- ======= 西俄罗斯（x710–800，AA线以西，三专员辖区东侧的废土） ======= -->
        <!-- 科米共和国（民主试验田，最西北） -->
        <path d="M 710 138 Q 742 132, 768 142 Q 774 170, 766 194 Q 746 206, 726 198 Q 710 176, 710 156 Z"
              fill="#4a4a5a" stroke="#2a2a2a" stroke-width="0.8" class="map-region" data-info="科米共和国（俄罗斯仅存的民主试验田）"/>
        <text x="738" y="172" font-size="5.5" fill="#a0a0c0" text-anchor="middle" font-weight="bold">科米</text>

        <!-- WRRF · 西俄罗斯革命阵线（科米以南，莫斯科以东） -->
        <path d="M 710 196 Q 748 188, 776 198 Q 782 228, 774 254 Q 754 270, 728 266 Q 710 244, 710 218 Z"
              fill="#5a3a3a" stroke="#2a2a2a" stroke-width="0.8" class="map-region" data-info="WRRF · 西俄罗斯革命阵线（苏沃洛夫）"/>
        <text x="742" y="232" font-size="5.5" fill="#c8a0a0" text-anchor="middle" font-weight="bold">WRRF</text>

        <!-- 维亚特卡（君主制复辟，WRRF以南） -->
        <path d="M 712 268 Q 748 260, 776 272 Q 782 300, 774 324 Q 754 338, 730 332 Q 712 308, 712 288 Z"
              fill="#4a4a8a" stroke="#2a2a2a" stroke-width="0.8" class="map-region" data-info="维亚特卡（君主制复辟，沙皇遗老）"/>
        <text x="744" y="302" font-size="5.5" fill="#a0a0d8" text-anchor="middle" font-weight="bold">维亚特卡</text>

        <!-- 萨马拉 · 俄罗斯解放军（弗拉索夫叛军，东南） -->
        <path d="M 760 254 Q 788 248, 806 262 Q 810 290, 802 314 Q 782 326, 762 316 Q 752 292, 756 272 Z"
              fill="#5a5a3a" stroke="#2a2a2a" stroke-width="0.8" class="map-region" data-info="萨马拉 · 俄罗斯解放军（弗拉索夫叛军）"/>
        <text x="782" y="286" font-size="5.5" fill="#c8c8a0" text-anchor="middle" font-weight="bold">萨马拉</text>

        <!-- 雅利安兄弟会（邪教军国主义，维亚特卡以南，乌克兰东侧） -->
        <path d="M 718 332 Q 750 326, 776 338 Q 782 366, 772 390 Q 752 402, 730 394 Q 716 370, 718 350 Z"
              fill="#6a3a4a" stroke="#2a2a2a" stroke-width="0.8" class="map-region" data-info="雅利安兄弟会（新异教军国主义邪教）"/>
        <text x="746" y="366" font-size="5" fill="#c8a0b0" text-anchor="middle" font-weight="bold">雅利安兄弟会</text>

        <!-- ======= 西西伯利亚/乌拉尔（x800–930，AA线东侧） ======= -->
        <!-- 斯维尔德洛夫斯克（工业军阀，最北） -->
        <path d="M 802 160 Q 838 154, 864 164 Q 872 194, 864 222 Q 842 236, 820 230 Q 804 206, 802 184 Z"
              fill="#3a5a4a" stroke="#2a2a2a" stroke-width="0.8" class="map-region" data-info="斯维尔德洛夫斯克（工业军阀）"/>
        <text x="834" y="196" font-size="5.5" fill="#a0c8b0" text-anchor="middle" font-weight="bold">斯维尔德洛夫斯克</text>

        <!-- 秋明（斯维尔德洛夫斯克以南） -->
        <path d="M 802 232 Q 834 226, 860 238 Q 868 266, 858 292 Q 836 304, 816 296 Q 802 272, 802 252 Z"
              fill="#5a4a3a" stroke="#2a2a2a" stroke-width="0.8" class="map-region" data-info="秋明"/>
        <text x="830" y="266" font-size="5.5" fill="#c8b8a0" text-anchor="middle" font-weight="bold">秋明</text>

        <!-- 鄂木斯克（黑色联盟 · 极端复仇主义） -->
        <path d="M 862 236 Q 900 228, 926 242 Q 934 278, 920 310 Q 892 324, 868 314 Q 852 286, 858 260 Z"
              fill="#2a2a2a" stroke="#5a5a5a" stroke-width="1" class="map-region" data-info="鄂木斯克 · 黑色联盟（极端军国复仇主义）"/>
        <text x="894" y="276" font-size="5.5" fill="#e8e8e8" text-anchor="middle" font-weight="bold">鄂木斯克</text>
        <text x="894" y="288" font-size="4.5" fill="#a8a8a8" text-anchor="middle">黑色联盟</text>

        <!-- 新西伯利亚（鄂木斯克以南） -->
        <path d="M 860 314 Q 896 306, 924 318 Q 934 346, 922 370 Q 896 382, 872 374 Q 856 348, 860 328 Z"
              fill="#4a4a3a" stroke="#2a2a2a" stroke-width="0.8" class="map-region" data-info="新西伯利亚"/>
        <text x="892" y="346" font-size="5.5" fill="#c8c8a0" text-anchor="middle" font-weight="bold">新西伯利亚</text>

        <!-- ======= 中西伯利亚（x920–1035） ======= -->
        <!-- 托木斯克（学者共和，最北） -->
        <path d="M 920 198 Q 952 190, 978 202 Q 986 230, 976 256 Q 954 268, 932 260 Q 920 236, 920 216 Z"
              fill="#4a5a5a" stroke="#2a2a2a" stroke-width="0.8" class="map-region" data-info="托木斯克（学者共和，西伯利亚文人政府）"/>
        <text x="948" y="232" font-size="5.5" fill="#a0c0c0" text-anchor="middle" font-weight="bold">托木斯克</text>

        <!-- 克麦罗沃（托木斯克以南） -->
        <path d="M 920 260 Q 950 254, 974 266 Q 982 294, 970 318 Q 948 328, 928 320 Q 918 296, 920 276 Z"
              fill="#5a3a5a" stroke="#2a2a2a" stroke-width="0.8" class="map-region" data-info="克麦罗沃"/>
        <text x="948" y="292" font-size="5.5" fill="#c0a0c0" text-anchor="middle" font-weight="bold">克麦罗沃</text>

        <!-- 黑军自由领土（无政府主义，东北） -->
        <path d="M 976 212 Q 1006 206, 1028 218 Q 1036 248, 1024 274 Q 998 284, 978 272 Q 968 246, 974 228 Z"
              fill="#2a2a2a" stroke="#5a5a5a" stroke-width="0.9" class="map-region" data-info="黑军自由领土（马赫诺无政府主义）"/>
        <text x="1002" y="248" font-size="5" fill="#d8d8d8" text-anchor="middle" font-weight="bold">黑军自由领土</text>

        <!-- 人民革命委员会（布党残部，新西伯利亚以东） -->
        <path d="M 924 324 Q 958 316, 986 328 Q 996 356, 984 382 Q 958 394, 932 386 Q 920 360, 924 342 Z"
              fill="#7a2a2a" stroke="#2a2a2a" stroke-width="0.8" class="map-region" data-info="人民革命委员会（西伯利亚布党残部）"/>
        <text x="956" y="358" font-size="5" fill="#e8a0a0" text-anchor="middle" font-weight="bold">人民革命委员会</text>

        <!-- 克拉斯诺亚尔斯克（灰色地带） -->
        <path d="M 978 286 Q 1008 280, 1030 292 Q 1038 322, 1026 346 Q 1004 356, 984 348 Q 972 322, 976 302 Z"
              fill="#4a4a4a" stroke="#2a2a2a" stroke-width="0.8" opacity="0.75" class="map-region" data-info="克拉斯诺亚尔斯克（灰色地带）"/>
        <text x="1004" y="320" font-size="5" fill="#a8a8a8" text-anchor="middle">克拉斯诺亚尔斯克</text>

        <!-- ======= 远东区（x1035+） ======= -->
        <!-- 伊尔库茨克（最北） -->
        <path d="M 1032 186 Q 1060 180, 1082 192 Q 1090 220, 1080 244 Q 1058 254, 1040 244 Q 1030 220, 1032 200 Z"
              fill="#5a4a4a" stroke="#2a2a2a" stroke-width="0.8" class="map-region" data-info="伊尔库茨克"/>
        <text x="1056" y="216" font-size="5.5" fill="#c8b0b0" text-anchor="middle" font-weight="bold">伊尔库茨克</text>

        <!-- 布里亚特（伊尔库茨克以南） -->
        <path d="M 1034 248 Q 1062 242, 1080 254 Q 1086 280, 1074 300 Q 1054 306, 1038 296 Q 1030 274, 1034 258 Z"
              fill="#6a3a3a" stroke="#2a2a2a" stroke-width="0.8" class="map-region" data-info="布里亚特"/>
        <text x="1058" y="278" font-size="5.5" fill="#c8a0a0" text-anchor="middle" font-weight="bold">布里亚特</text>

        <!-- 马加丹（远东流放地，最东北） -->
        <path d="M 1084 198 Q 1112 192, 1130 206 Q 1136 236, 1122 260 Q 1098 268, 1084 254 Q 1076 228, 1084 208 Z"
              fill="#5a5a5a" stroke="#2a2a2a" stroke-width="0.8" class="map-region" data-info="马加丹（远东流放地军阀，投机者）"/>
        <text x="1106" y="234" font-size="5.5" fill="#c8c8c8" text-anchor="middle" font-weight="bold">马加丹</text>

        <!-- 赤塔（远东据点） -->
        <path d="M 1080 230 Q 1106 224, 1124 238 Q 1130 266, 1116 288 Q 1094 294, 1078 282 Q 1072 258, 1080 240 Z"
              fill="#6a5a3a" stroke="#2a2a2a" stroke-width="0.8" class="map-region" data-info="赤塔"/>
        <text x="1102" y="262" font-size="5.5" fill="#c8c0a0" text-anchor="middle" font-weight="bold">赤塔</text>

        <!-- 阿穆尔（白色独裁，最东南） -->
        <path d="M 1034 306 Q 1070 298, 1098 312 Q 1108 342, 1094 370 Q 1066 380, 1042 368 Q 1030 342, 1034 322 Z"
              fill="#4a3a5a" stroke="#2a2a2a" stroke-width="0.8" class="map-region" data-info="阿穆尔（远东白色独裁，日军阴影下）"/>
        <text x="1066" y="342" font-size="5.5" fill="#b0a0c8" text-anchor="middle" font-weight="bold">阿穆尔</text>

        <!-- 堪察加（半岛） -->
        <path d="M 1128 222 Q 1148 216, 1160 232 Q 1164 262, 1150 286 Q 1130 294, 1122 276 Q 1118 250, 1128 230 Z"
              fill="#4a4a4a" stroke="#2a2a2a" stroke-width="0.7" opacity="0.75" class="map-region" data-info="堪察加"/>
        <text x="1144" y="258" font-size="4.5" fill="#a8a8a8" text-anchor="middle">堪察加</text>
      </g>` : `
      <!-- 统一后的俄罗斯（巨型块） · 坐标与新AA线对齐 -->
      <path d="M 710 138 Q 820 120, 940 128 Q 1060 134, 1156 154 Q 1160 250, 1144 336 Q 1120 376, 1032 384 Q 920 388, 808 382 Q 724 374, 664 352 Q 652 270, 680 202 Z"
            fill="${russiaColor}" stroke="#1a1a1a" stroke-width="1.5" class="map-region russia-unified" data-info="${russiaLabel}"/>
      <text x="900" y="260" font-size="14" fill="#e8e6e0" text-anchor="middle" font-family="Georgia,serif" font-weight="bold">${russiaLabel}</text>
    `;
    // 生成SVG地图
    const mapSvg = `
      <svg viewBox="0 0 1200 750" class="world-map" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="waves" x="0" y="0" width="48" height="24" patternUnits="userSpaceOnUse">
            <path d="M 0 12 Q 12 6, 24 12 T 48 12" stroke="#0f1520" fill="none" stroke-width="0.5"/>
            <path d="M 0 20 Q 12 14, 24 20 T 48 20" stroke="#0f1520" fill="none" stroke-width="0.3" opacity="0.5"/>
          </pattern>
          <pattern id="medSea" x="0" y="0" width="32" height="16" patternUnits="userSpaceOnUse">
            <path d="M 0 8 Q 8 4, 16 8 T 32 8" stroke="#1a3550" fill="none" stroke-width="0.4"/>
          </pattern>
          <pattern id="caspian" x="0" y="0" width="20" height="10" patternUnits="userSpaceOnUse">
            <path d="M 0 5 Q 5 2, 10 5 T 20 5" stroke="#1a3550" fill="none" stroke-width="0.3"/>
          </pattern>
          <style>
            @keyframes warBlink { 0%,100%{opacity:0.3} 50%{opacity:1} }
            @keyframes warShake { 0%,100%{transform:translate(0,0)} 25%{transform:translate(1px,-1px)} 50%{transform:translate(-1px,1px)} 75%{transform:translate(1px,1px)} }
            @keyframes explosion { 0%{r:2;opacity:1} 100%{r:10;opacity:0} }
          </style>
        </defs>
        <rect width="1200" height="750" fill="#0a0e14"/>
        <rect width="1200" height="750" fill="url(#waves)" opacity="0.3"/>
        <g stroke="#181824" stroke-width="0.4" opacity="0.2">
          <line x1="0" y1="187" x2="1200" y2="187"/>
          <line x1="0" y1="375" x2="1200" y2="375"/>
          <line x1="0" y1="562" x2="1200" y2="562"/>
          <line x1="300" y1="0" x2="300" y2="750"/>
          <line x1="600" y1="0" x2="600" y2="750"/>
          <line x1="900" y1="0" x2="900" y2="750"/>
        </g>

        <!-- ===== 地中海 ===== -->
        <path d="M 400 330 Q 450 318, 500 322 Q 550 328, 590 338 L 596 354 Q 570 372, 510 378 Q 450 380, 408 374 Q 394 360, 398 345 Z"
              fill="#0f1e2e" stroke="#1a3550" stroke-width="0.8"/>
        <path d="M 400 330 Q 450 318, 500 322 Q 550 328, 590 338 L 596 354 Q 570 372, 510 378 Q 450 380, 408 374 Q 394 360, 398 345 Z"
              fill="url(#medSea)" opacity="0.5"/>
        <text x="488" y="358" font-size="8" fill="#3a6a8a" text-anchor="middle" opacity="0.6">地中海</text>
        <!-- 黑海 -->
        <path d="M 592 290 Q 618 284, 644 290 Q 650 308, 636 322 Q 612 328, 594 322 Q 586 306, 592 290 Z"
              fill="#0f1e2e" stroke="#1a3550" stroke-width="0.8"/>
        <text x="618" y="310" font-size="6.5" fill="#3a6a8a" text-anchor="middle" opacity="0.6">黑海</text>
        <!-- 里海 -->
        <path d="M 682 308 Q 708 300, 730 310 Q 736 340, 724 370 Q 704 380, 686 370 Q 674 346, 676 324 Z"
              fill="#0f1e2e" stroke="#1a3550" stroke-width="0.8"/>
        <path d="M 682 308 Q 708 300, 730 310 Q 736 340, 724 370 Q 704 380, 686 370 Q 674 346, 676 324 Z"
              fill="url(#caspian)" opacity="0.5"/>
        <text x="706" y="344" font-size="6.5" fill="#3a6a8a" text-anchor="middle" opacity="0.6">里海</text>
        <!-- 波斯湾 -->
        <path d="M 688 430 Q 710 424, 724 436 L 722 452 Q 710 458, 696 456 Q 686 446, 688 430 Z"
              fill="#0f1e2e" stroke="#1a3550" stroke-width="0.6"/>

        <!-- ============ 北美洲 ============ -->
        <!-- 加拿大 -->
        <path d="M 35 90 Q 120 78, 220 82 Q 280 95, 290 128 L 285 158 Q 270 172, 235 176 L 155 172 Q 88 166, 52 155 Q 32 128, 35 90 Z"
              fill="#3a4a5a" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="加拿大（OFN）"/>
        <text x="160" y="130" font-size="9" fill="#8aaaca" text-anchor="middle" font-weight="bold">加拿大</text>
        <!-- 格陵兰 -->
        <path d="M 310 72 Q 340 64, 360 80 Q 362 110, 348 132 Q 328 142, 314 130 Q 304 106, 310 72 Z"
              fill="#4a4a54" stroke="#2a2a2a" stroke-width="0.8" opacity="0.7" class="map-region" data-info="格陵兰"/>
        <!-- 阿拉斯加 -->
        <path d="M 18 110 Q 48 100, 70 112 Q 72 140, 58 162 Q 40 170, 28 158 Q 14 138, 18 110 Z"
              fill="#3a4a5a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="阿拉斯加（美国）"/>
        <!-- 美国/OFN -->
        <path d="M 45 180 Q 130 170, 220 175 Q 265 182, 272 215 L 268 278 Q 252 300, 220 304 L 125 300 Q 72 292, 54 265 Q 42 230, 45 180 Z"
              fill="#1a2a4a" stroke="#3a5a8a" stroke-width="1.5" class="map-region ofn-region" data-info="美国（OFN领袖）"/>
        <text x="158" y="238" font-size="13" fill="#6a8aca" text-anchor="middle" font-family="Georgia,serif" font-weight="bold">美国</text>
        <text x="158" y="256" font-size="8" fill="#4a6a9a" text-anchor="middle">OFN · 自由国家组织</text>
        <!-- 墨西哥 -->
        <path d="M 90 308 Q 140 302, 178 312 L 182 344 Q 168 360, 142 362 Q 112 356, 94 340 Q 84 322, 90 308 Z"
              fill="#4a5a4a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="墨西哥"/>
        <text x="138" y="334" font-size="7" fill="#a8b8a0" text-anchor="middle">墨西哥</text>
        <!-- 中美洲 -->
        <path d="M 132 365 Q 160 362, 178 374 L 174 394 Q 152 400, 136 390 Q 126 378, 132 365 Z"
              fill="#4a5a4a" stroke="#1a1a1a" stroke-width="0.6" class="map-region" data-info="中美洲（巴拿马）"/>
        <text x="154" y="386" font-size="5.5" fill="#8a9a80" text-anchor="middle">巴拿马</text>

        <!-- ============ 南美洲 ============ -->
        <!-- 南美北部（哥伦比亚/委内瑞拉） -->
        <path d="M 80 388 Q 120 378, 156 392 L 160 452 Q 144 478, 122 480 Q 94 472, 82 446 Q 72 412, 76 398 Z"
              fill="#5a5a3a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="南美北部（哥伦比亚/委内瑞拉/秘鲁）"/>
        <text x="118" y="432" font-size="6" fill="#a8a880" text-anchor="middle">哥伦比亚</text>
        <!-- 巴西 -->
        <path d="M 158 404 Q 220 390, 270 404 Q 284 442, 276 478 Q 262 510, 230 518 Q 192 512, 168 488 Q 146 450, 152 424 Z"
              fill="#4a5a3a" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="巴西"/>
        <text x="218" y="460" font-size="9" fill="#a8c880" text-anchor="middle" font-weight="bold">巴西</text>
        <!-- 阿根廷/智利 -->
        <path d="M 132 518 Q 175 508, 218 522 L 226 580 Q 212 612, 188 624 Q 156 620, 138 596 Q 122 556, 132 518 Z"
              fill="#5a4a3a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="阿根廷/智利"/>
        <text x="178" y="572" font-size="8" fill="#c8a888" text-anchor="middle" font-weight="bold">阿根廷</text>

        <!-- ============ 欧洲 ============ -->
        <!-- 冰岛 -->
        <path d="M 295 155 Q 320 146, 340 158 Q 346 180, 336 196 Q 316 202, 302 190 Q 292 172, 295 155 Z"
              fill="#3a3a48" stroke="#2a2a2a" stroke-width="1" class="map-region" data-info="冰岛"/>
        <text x="318" y="178" font-size="6" fill="#8a8a9a" text-anchor="middle">冰岛</text>
        <!-- 斯堪的纳维亚（挪威/瑞典/中立） -->
        <path d="M 420 118 Q 448 104, 475 114 Q 488 140, 486 180 L 480 214 Q 470 234, 452 240 L 436 230 Q 424 204, 422 174 Q 418 142, 420 118 Z"
              fill="#3a3a44" stroke="#2a2a2a" stroke-width="1" class="map-region" data-info="斯堪的纳维亚（瑞典中立）"/>
        <text x="454" y="182" font-size="8" fill="#7a7a8a" text-anchor="middle">斯堪的纳维亚</text>
        <!-- 芬兰 -->
        <path d="M 484 120 Q 508 110, 528 126 Q 534 156, 528 192 Q 520 216, 504 230 Q 490 232, 484 208 Q 480 168, 484 138 Z"
              fill="#4a4a54" stroke="#2a2a2a" stroke-width="1" class="map-region" data-info="芬兰"/>
        <text x="506" y="180" font-size="7" fill="#8a8a9a" text-anchor="middle">芬兰</text>
        <!-- 爱尔兰（中立） -->
        <path d="M 335 212 Q 352 205, 362 218 Q 364 240, 354 252 Q 338 256, 330 244 Q 326 224, 335 212 Z"
              fill="${englandColor}" stroke="#1a1a1a" stroke-width="0.8" opacity="0.85" class="map-region" data-info="爱尔兰（中立）"/>
        <text x="346" y="234" font-size="6" fill="#a8a6a0" text-anchor="middle">爱尔兰</text>
        <!-- 大不列颠（英格兰+苏格兰，德国傀儡） -->
        <path d="M 366 188 Q 388 176, 408 184 Q 418 202, 416 222 L 412 256 Q 404 278, 386 284 Q 368 280, 360 264 Q 352 236, 356 210 Z"
              fill="${englandColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="大不列颠（德国傀儡）"/>
        <text x="388" y="210" font-size="6" fill="#8a8a9a" text-anchor="middle">苏格兰</text>
        <text x="388" y="250" font-size="8" fill="#a8a6a0" text-anchor="middle" font-weight="bold">英格兰</text>
        <!-- 伊比利亚联盟（西班牙+葡萄牙） -->
        <path d="M 324 298 Q 360 288, 400 296 Q 422 312, 428 334 L 422 368 Q 406 392, 380 400 Q 348 396, 330 380 Q 314 354, 318 324 Z"
              fill="${iberiaColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="${iberiaLabel}"/>
        <path d="M 320 304 Q 332 300, 340 314 L 338 366 Q 330 380, 322 372 Q 318 344, 318 322 Z"
              fill="${iberiaColor}" stroke="#2a2a2a" stroke-width="0.5" opacity="0.7" class="map-region" data-info="葡萄牙"/>
        <text x="330" y="344" font-size="5.5" fill="#c8b88a" text-anchor="middle">葡</text>
        <text x="378" y="346" font-size="9" fill="#d8c8a0" text-anchor="middle" font-weight="bold">伊比利亚</text>
        <!-- 法国北部（德占区） -->
        <path d="M 412 248 Q 450 240, 480 248 Q 490 266, 486 286 L 480 310 Q 462 318, 444 312 Q 418 302, 408 286 Q 402 268, 412 248 Z"
              fill="${franceOccupiedColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="法兰西（德国占领区）"/>
        <text x="448" y="280" font-size="7" fill="#c8a0a0" text-anchor="middle" font-weight="bold">德占法国</text>
        <!-- 法国南部（维希/自由法国） -->
        <path d="M 400 312 Q 440 304, 476 314 Q 488 332, 480 358 L 472 378 Q 452 388, 430 384 Q 406 376, 398 354 Q 392 332, 400 312 Z"
              fill="${vichyColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="${franceLabel}"/>
        <text x="440" y="348" font-size="7" fill="#d8a87a" text-anchor="middle">${f.french_resistance_crushed ? '维希法国' : '维希'}</text>
        <text x="440" y="362" font-size="6.5" fill="#a8d8a8" text-anchor="middle">${freeFranceLabel.length > 8 ? '自由法国' : freeFranceLabel}</text>
        <!-- 荷兰 -->
        <path d="M 460 222 Q 480 218, 488 228 L 484 242 Q 472 248, 462 242 Q 456 232, 460 222 Z"
              fill="#6a7a8a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="荷兰（中立/德占）"/>
        <text x="472" y="238" font-size="5.5" fill="#a8a6a0" text-anchor="middle">荷</text>
        <!-- 比利时 -->
        <path d="M 464 242 Q 486 240, 494 252 L 490 266 Q 478 272, 466 266 Q 460 254, 464 242 Z"
              fill="#7a6a5a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="比利时（中立/德占）"/>
        <text x="478" y="260" font-size="5.5" fill="#a8a6a0" text-anchor="middle">比</text>
        <!-- 勃艮第国（希姆莱） -->
        <path d="M 472 262 Q 498 256, 520 268 Q 530 292, 522 316 L 510 336 Q 492 344, 476 332 Q 464 310, 466 286 Z"
              fill="${burgundyColor}" stroke="#1a1a1a" stroke-width="1.5" class="map-region burgundy-region" data-info="勃艮第国（希姆莱）"/>
        <text x="496" y="304" font-size="8" fill="#8a6a8a" text-anchor="middle" font-weight="bold">勃艮第</text>
        <!-- 瑞士（中立） -->
        <path d="M 494 314 Q 518 310, 528 324 L 524 340 Q 510 346, 496 340 Q 488 328, 494 314 Z"
              fill="#8a7a6a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="瑞士（中立）"/>
        <text x="510" y="332" font-size="5.5" fill="#a8a6a0" text-anchor="middle">瑞士</text>
        <!-- 丹麦 -->
        <path d="M 452 218 Q 474 212, 486 222 L 482 238 Q 470 244, 458 236 Q 450 226, 452 218 Z"
              fill="#5a4a4a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="丹麦"/>
        <text x="468" y="232" font-size="5.5" fill="#a8a0a0" text-anchor="middle">丹</text>

        <!-- 大日耳曼国（德+奥+捷+苏台德） -->
        <path d="M 480 220 Q 518 210, 560 216 Q 594 226, 606 246 Q 612 278, 604 310 Q 592 332, 570 344 Q 542 350, 518 342 Q 498 330, 488 312 L 482 290 Q 478 262, 482 244 Q 478 230, 480 220 Z"
              fill="${germanyColor}" stroke="#e8c860" stroke-width="2" class="map-region germany-region" data-info="${germanyLabel}"/>
        <text x="542" y="272" font-size="13" fill="#e8c860" text-anchor="middle" font-family="Georgia,serif" font-weight="bold">大日耳曼国</text>
        <text x="566" y="320" font-size="6.5" fill="#d8b8d0" text-anchor="middle">奥</text>
        <text x="590" y="240" font-size="6.5" fill="#d8c8a8" text-anchor="middle">捷</text>

        <!-- 东方总督辖区（Ostland：波罗的海三国+白俄罗斯） -->
        <path d="M 576 182 Q 608 174, 638 184 Q 646 218, 640 248 Q 628 266, 604 270 Q 580 264, 572 242 Q 566 212, 576 182 Z"
              fill="#6a2a2a" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="东方总督辖区（Ostland）"/>
        <text x="606" y="224" font-size="7" fill="#c8a0a0" text-anchor="middle" font-weight="bold">Ostland</text>
        <text x="606" y="238" font-size="5.5" fill="#a88080" text-anchor="middle">东方总督辖区</text>
        <!-- 总督辖区（波兰） -->
        <path d="M 576 274 Q 606 268, 634 278 Q 642 298, 638 320 Q 626 338, 602 340 Q 580 334, 574 312 Q 570 290, 576 274 Z"
              fill="#7a3a3a" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="总督辖区（波兰）"/>
        <text x="604" y="308" font-size="6.5" fill="#d8a8a8" text-anchor="middle">波兰</text>
        <!-- 莫斯科专员辖区（Moskowien：仅保留莫斯科周边核心区） -->
        <path d="M 640 180 Q 672 174, 702 180 Q 712 210, 706 240 Q 692 262, 668 266 Q 646 258, 638 232 Q 634 204, 640 180 Z"
              fill="#5a2a2a" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="莫斯科专员辖区（Moskowien）"/>
        <text x="672" y="224" font-size="7" fill="#c89898" text-anchor="middle" font-weight="bold">Moskowien</text>
        <text x="672" y="236" font-size="5" fill="#a87878" text-anchor="middle">莫斯科专员辖区</text>
        <!-- 乌克兰专员辖区（Ukraine：第聂伯河以西，给东侧留军阀空间） -->
        <path d="M 640 270 Q 678 264, 710 272 Q 720 302, 714 332 Q 700 356, 672 358 Q 648 348, 638 322 Q 634 294, 640 270 Z"
              fill="#6a3a2a" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="乌克兰专员辖区（Ukraine）"/>
        <text x="676" y="316" font-size="7" fill="#d8a888" text-anchor="middle" font-weight="bold">Ukraine</text>
        <text x="676" y="328" font-size="5" fill="#b88868" text-anchor="middle">乌克兰专员辖区</text>
        <!-- 高加索专员辖区（Kaukasus） -->
        <path d="M 670 352 Q 714 344, 752 354 Q 764 382, 758 412 Q 744 436, 718 442 Q 692 436, 678 414 Q 668 386, 670 352 Z"
              fill="#5a3a2a" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="高加索专员辖区（Kaukasus）"/>
        <text x="714" y="396" font-size="7" fill="#d8a878" text-anchor="middle" font-weight="bold">Kaukasus</text>
        <text x="714" y="408" font-size="5" fill="#b88858" text-anchor="middle">高加索专员辖区</text>
        <!-- 匈牙利 -->
        <path d="M 576 334 Q 602 328, 620 338 Q 626 356, 618 374 Q 602 382, 586 378 Q 574 364, 576 348 Z"
              fill="#7a5a5a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="匈牙利（帝国卫星）"/>
        <text x="598" y="360" font-size="6.5" fill="#d8b8b8" text-anchor="middle">匈牙利</text>
        <!-- 罗马尼亚 -->
        <path d="M 622 272 Q 650 268, 668 280 Q 676 308, 666 336 Q 650 356, 632 358 Q 620 340, 622 316 Q 618 290, 622 272 Z"
              fill="#7a5a4a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="罗马尼亚（帝国卫星）"/>
        <text x="644" y="322" font-size="6.5" fill="#d8c8a0" text-anchor="middle">罗马尼亚</text>
        <!-- 保加利亚 -->
        <path d="M 604 382 Q 630 378, 646 390 Q 650 408, 640 420 Q 622 424, 608 416 Q 598 402, 604 382 Z"
              fill="#6a4a5a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="保加利亚（帝国卫星）"/>
        <text x="626" y="404" font-size="6" fill="#c8a8c0" text-anchor="middle">保加利亚</text>
        <!-- 南斯拉夫 -->
        <path d="M 544 340 Q 574 334, 590 346 Q 596 366, 586 384 Q 570 396, 550 392 Q 538 378, 538 360 Z"
              fill="#6a5a6a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="南斯拉夫（帝国卫星）"/>
        <text x="566" y="370" font-size="6.5" fill="#c8b8c8" text-anchor="middle">南斯拉夫</text>
        <!-- 阿尔巴尼亚/希腊 -->
        <path d="M 538 394 Q 568 390, 584 400 Q 590 420, 578 440 Q 560 448, 546 438 Q 536 422, 538 408 Z"
              fill="#5a6a7a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="阿尔巴尼亚/希腊（帝国卫星）"/>
        <text x="564" y="422" font-size="6.5" fill="#a8b8d0" text-anchor="middle">希腊</text>
        <!-- 土耳其 -->
        <path d="M 588 382 Q 626 372, 662 380 Q 680 402, 670 428 Q 656 448, 632 450 Q 604 444, 590 426 Q 580 406, 588 382 Z"
              fill="${turkeyColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="土耳其"/>
        <text x="628" y="416" font-size="8" fill="#a8a0a0" text-anchor="middle" font-weight="bold">土耳其</text>

        <!-- 意大利（靴型半岛） -->
        <path d="M 470 322 Q 498 316, 516 330 L 526 360 Q 528 390, 516 414 Q 504 438, 494 450 Q 480 448, 478 432 Q 470 410, 466 386 Q 460 358, 466 340 Z"
              fill="${italyColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="${italyLabel}"/>
        <text x="496" y="382" font-size="9" fill="#c8e8a0" text-anchor="middle" font-weight="bold">意大利</text>
        <!-- 西西里岛 -->
        <path d="M 490 456 Q 512 450, 524 462 Q 522 476, 506 480 Q 490 476, 490 456 Z"
              fill="${italyColor}" stroke="#1a1a1a" stroke-width="0.5" opacity="0.75" class="map-region" data-info="西西里"/>
        <text x="508" y="472" font-size="5" fill="#a8c880" text-anchor="middle">西西里</text>
        <!-- 撒丁岛 -->
        <path d="M 448 364 Q 462 358, 470 374 Q 466 394, 452 396 Q 442 382, 448 364 Z"
              fill="${italyColor}" stroke="#1a1a1a" stroke-width="0.5" opacity="0.75" class="map-region" data-info="撒丁岛"/>
        <text x="458" y="380" font-size="4.5" fill="#a8c880" text-anchor="middle">撒丁</text>
        <!-- 科西嘉 -->
        <path d="M 440 322 Q 456 318, 462 332 Q 458 348, 446 350 Q 438 338, 440 322 Z"
              fill="${vichyColor}" stroke="#1a1a1a" stroke-width="0.5" opacity="0.7" class="map-region" data-info="科西嘉"/>
        <text x="450" y="338" font-size="4" fill="#d8a87a" text-anchor="middle">科西嘉</text>

        <!-- ============ 俄罗斯区域（军阀分裂 / 统一） ============ -->
        ${russiaFragmentHtml}

        <!-- ============ 非洲 ============ -->
        <!-- 摩洛哥/阿尔及利亚/突尼斯（法属北非） -->
        <path d="M 310 400 Q 370 392, 440 398 Q 456 422, 448 450 L 440 474 Q 410 488, 368 488 Q 328 482, 310 460 Q 298 432, 310 400 Z"
              fill="${northAfricaColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="摩洛哥/阿尔及利亚（法属北非）"/>
        <text x="378" y="440" font-size="7" fill="#e8c8a0" text-anchor="middle">法属北非</text>
        <!-- 利比亚（意属） -->
        <path d="M 450 408 Q 490 400, 526 408 Q 538 434, 530 462 L 518 484 Q 488 492, 462 486 Q 448 470, 448 442 Z"
              fill="${italyAfricaColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="利比亚（意大利殖民地）"/>
        <text x="490" y="448" font-size="7" fill="#c8e8a0" text-anchor="middle">利比亚</text>
        <!-- 埃及 -->
        <path d="M 528 420 Q 560 414, 586 422 Q 596 448, 586 476 L 574 498 Q 550 508, 530 500 Q 520 478, 522 450 Z"
              fill="${egyptColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="埃及"/>
        <text x="556" y="460" font-size="7" fill="#d8c88a" text-anchor="middle" font-weight="bold">埃及</text>
        <path d="M 562 424 Q 564 450, 560 472 Q 558 488, 556 500" fill="none" stroke="#2a5a8a" stroke-width="1.2" opacity="0.8"/>
        <text x="568" y="468" font-size="5" fill="#4a8aca" text-anchor="start" opacity="0.7">尼罗河</text>
        <!-- 非洲战争标记 -->
        ${warAfrica ? `
        <g style="${warAnimStyle}">
          <line x1="400" y1="438" x2="420" y2="456" stroke="#ff4444" stroke-width="2"/>
          <line x1="420" y1="438" x2="400" y2="456" stroke="#ff4444" stroke-width="2"/>
          <circle cx="410" cy="447" r="7" fill="none" stroke="#ff4444" stroke-width="1" opacity="0.6"/>
        </g>
        <g style="${warShakeStyle}">
          <circle cx="480" cy="438" r="2.5" fill="#ff6644" opacity="0.8"/>
        </g>` : ''}
        <!-- 意属东非（埃塞俄比亚/索马里/厄立特里亚） -->
        <path d="M 532 524 Q 572 516, 604 528 Q 614 556, 604 586 Q 580 600, 552 594 Q 530 578, 526 554 Z"
              fill="${italyAfricaColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="意属东非（埃塞俄比亚/索马里/厄立特里亚）"/>
        <text x="566" y="560" font-size="6.5" fill="#c8e8a0" text-anchor="middle">意属东非</text>
        <!-- 西非 -->
        <path d="M 272 510 Q 340 498, 420 506 Q 432 540, 422 570 Q 370 586, 308 580 Q 268 568, 262 540 Q 264 522, 272 510 Z"
              fill="${subSaharanColor}" stroke="#1a1a1a" stroke-width="0.8" opacity="0.7" class="map-region" data-info="西非/中非"/>
        <text x="348" y="544" font-size="7" fill="#7a7a5a" text-anchor="middle" opacity="0.85">西非 / 中非</text>
        <!-- 中非/刚果 -->
        <path d="M 424 514 Q 480 506, 526 520 Q 534 552, 526 584 Q 488 600, 448 594 Q 426 574, 426 544 Z"
              fill="${subSaharanColor}" stroke="#1a1a1a" stroke-width="0.7" opacity="0.65" class="map-region" data-info="中非/刚果"/>
        <text x="478" y="556" font-size="6" fill="#7a7a5a" text-anchor="middle" opacity="0.85">中非</text>
        <!-- 南非 -->
        <path d="M 428 602 Q 478 592, 520 606 Q 530 640, 518 672 Q 488 692, 452 686 Q 428 668, 424 640 Z"
              fill="${subSaharanColor}" stroke="#1a1a1a" stroke-width="0.9" class="map-region" data-info="南非"/>
        <text x="476" y="644" font-size="7" fill="#a8b88a" text-anchor="middle" font-weight="bold">南非</text>
        <!-- 马达加斯加（德属） -->
        <path d="M 572 602 Q 594 596, 604 612 Q 602 652, 592 670 Q 578 672, 572 656 Q 568 626, 572 604 Z"
              fill="#5a3a5a" stroke="#1a1a1a" stroke-width="0.7" class="map-region" data-info="马达加斯加（德属）"/>
        <text x="588" y="638" font-size="5.5" fill="#c8a8c8" text-anchor="middle">马达加斯加</text>

        <!-- ============ 中东 ============ -->
        <!-- 黎凡特/叙利亚/伊拉克 -->
        <path d="M 592 432 Q 624 424, 648 436 Q 654 462, 642 484 Q 620 492, 604 480 Q 594 458, 594 444 Z"
              fill="${iraqColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="伊拉克/黎凡特"/>
        <text x="622" y="462" font-size="6" fill="#d8b8b8" text-anchor="middle">伊拉克</text>
        <!-- 伊朗 -->
        <path d="M 650 390 Q 690 380, 728 392 Q 742 422, 732 456 Q 710 482, 680 482 Q 656 470, 646 446 Q 640 418, 650 390 Z"
              fill="${iranColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="伊朗"/>
        <text x="688" y="434" font-size="7.5" fill="#d8b8b8" text-anchor="middle" font-weight="bold">伊朗</text>
        <!-- 沙特阿拉伯 -->
        <path d="M 584 492 Q 630 484, 676 498 Q 688 530, 678 566 Q 652 586, 618 584 Q 588 572, 578 546 Q 572 518, 584 492 Z"
              fill="${saudiColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="沙特阿拉伯"/>
        <text x="632" y="538" font-size="7" fill="#c8b898" text-anchor="middle" font-weight="bold">沙特</text>
        <!-- 也门/阿曼 -->
        <path d="M 674 546 Q 710 540, 732 554 Q 736 582, 720 602 Q 696 608, 676 594 Q 668 572, 674 552 Z"
              fill="${saudiColor}" stroke="#1a1a1a" stroke-width="0.8" opacity="0.85" class="map-region" data-info="也门/阿曼"/>
        <text x="702" y="576" font-size="5.5" fill="#b8a888" text-anchor="middle">也门/阿曼</text>
        <!-- 阿富汗 -->
        <path d="M 722 380 Q 760 372, 790 386 Q 798 414, 788 440 Q 766 452, 738 446 Q 722 426, 720 404 Z"
              fill="#6a5a5a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="阿富汗"/>
        <text x="756" y="416" font-size="6" fill="#c8b8b0" text-anchor="middle">阿富汗</text>
        <!-- 中东战争标记 & 苏伊士运河 -->
        ${warMiddleEast ? `
        <g style="${warAnimStyle}">
          <line x1="530" y1="440" x2="550" y2="456" stroke="#ff4444" stroke-width="2"/>
          <line x1="550" y1="440" x2="530" y2="456" stroke="#ff4444" stroke-width="2"/>
          <circle cx="540" cy="448" r="7" fill="none" stroke="#ff4444" stroke-width="1" opacity="0.6"/>
        </g>
        <g style="${warShakeStyle}">
          <polygon points="662,434 684,438 674,452" fill="#ff6644" opacity="0.7"/>
        </g>` : ''}
        <text x="536" y="488" font-size="5.5" fill="#a8a86a" text-anchor="middle" opacity="${warMiddleEast ? '0.95' : '0.55'}">苏伊士</text>

        <!-- ============ 亚洲 ============ -->
        <!-- 印度 -->
        <path d="M 760 402 Q 802 390, 844 402 Q 860 438, 850 478 Q 826 508, 798 508 Q 770 496, 758 466 Q 748 436, 754 418 Z"
              fill="#6a5a4a" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="印度"/>
        <text x="804" y="456" font-size="9" fill="#d8c8b0" text-anchor="middle" font-weight="bold">印度</text>
        <!-- 巴基斯坦/俾路支斯坦 -->
        <path d="M 730 430 Q 756 422, 762 444 L 758 480 Q 742 492, 728 480 Q 718 458, 722 444 Z"
              fill="#6a5a4a" stroke="#1a1a1a" stroke-width="0.8" opacity="0.7" class="map-region" data-info="巴基斯坦"/>
        <text x="742" y="464" font-size="6" fill="#b8a89a" text-anchor="middle">巴基斯坦</text>
        <!-- 蒙古 -->
        <path d="M 876 286 Q 920 278, 950 290 Q 960 316, 948 342 Q 918 350, 888 344 Q 874 320, 876 298 Z"
              fill="#5a4a3a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="蒙古"/>
        <text x="914" y="318" font-size="6.5" fill="#c8b8a0" text-anchor="middle">蒙古</text>
        <!-- 中国（日占/合作政府） -->
        <path d="M 870 326 Q 930 316, 990 324 Q 1010 362, 1000 404 Q 976 438, 938 440 Q 902 432, 882 410 Q 866 378, 868 352 Z"
              fill="#7a6a3a" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="中国（日占/合作政府）"/>
        <text x="934" y="386" font-size="9" fill="#d8c8a0" text-anchor="middle" font-weight="bold">中国</text>
        <!-- 满洲国（日属傀儡） -->
        <path d="M 978 282 Q 1012 274, 1038 286 Q 1044 310, 1034 330 Q 1014 340, 990 332 Q 974 312, 978 292 Z"
              fill="#6a5a2a" stroke="#1a1a1a" stroke-width="0.9" class="map-region" data-info="满洲国（日属傀儡）"/>
        <text x="1006" y="310" font-size="6" fill="#d8c890" text-anchor="middle">满洲国</text>
        <!-- 朝鲜（日属） -->
        <path d="M 1028 334 Q 1048 328, 1060 342 Q 1064 368, 1052 386 Q 1038 390, 1030 374 Q 1022 352, 1028 336 Z"
              fill="#6a5a2a" stroke="#1a1a1a" stroke-width="0.9" class="map-region" data-info="朝鲜（日属）"/>
        <text x="1044" y="364" font-size="6" fill="#d8c890" text-anchor="middle">朝鲜</text>
        <!-- 法属印度支那 -->
        <path d="M 882 442 Q 912 434, 934 448 Q 940 478, 928 504 Q 908 512, 890 500 Q 878 478, 880 460 Z"
              fill="${frenchIndochinaColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="法属印度支那"/>
        <text x="908" y="474" font-size="6.5" fill="#a8b8c8" text-anchor="middle">法属印度支那</text>
        <!-- 泰国/缅甸 -->
        <path d="M 844 468 Q 874 462, 884 478 L 882 508 Q 868 520, 852 514 Q 840 498, 840 482 Z"
              fill="#5a6a4a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="泰国/缅甸"/>
        <text x="862" y="496" font-size="6" fill="#a8c8a0" text-anchor="middle">泰国/缅甸</text>
        <!-- 荷属东印度（印尼） -->
        <path d="M 912 512 Q 956 502, 996 518 Q 1010 544, 1000 574 Q 970 590, 936 580 Q 908 560, 908 534 Z"
              fill="${dutchIndiesColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="荷属东印度（印尼）"/>
        <text x="954" y="546" font-size="6.5" fill="#b8c8d8" text-anchor="middle">荷属东印度</text>
        <!-- 菲律宾 -->
        <path d="M 1016 450 Q 1042 442, 1056 460 Q 1054 492, 1038 506 Q 1022 500, 1016 482 Q 1010 464, 1016 450 Z"
              fill="#5a6a4a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="菲律宾"/>
        <text x="1036" y="478" font-size="5.5" fill="#a8b8a0" text-anchor="middle">菲律宾</text>
        <!-- 新几内亚 -->
        <path d="M 994 560 Q 1030 552, 1058 572 Q 1060 596, 1044 612 Q 1016 618, 992 604 Q 984 582, 994 562 Z"
              fill="#6a5a4a" stroke="#1a1a1a" stroke-width="0.7" class="map-region" data-info="新几内亚"/>
        <text x="1026" y="590" font-size="5.5" fill="#c8b8a0" text-anchor="middle">新几内亚</text>

        <!-- 日本本土四岛 -->
        <g class="japan-zone">
          <path d="M 1088 326 Q 1122 314, 1144 328 Q 1150 358, 1136 386 Q 1114 402, 1098 386 Q 1088 358, 1090 340 Z"
                fill="#4a3a1a" stroke="#8a7a3a" stroke-width="1.3" class="map-region japan-region" data-info="日本（共荣圈霸主）"/>
          <path d="M 1100 292 Q 1124 286, 1140 296 Q 1142 314, 1126 322 Q 1106 320, 1096 308 Z"
                fill="#4a3a1a" stroke="#8a7a3a" stroke-width="1" class="map-region" data-info="日本（北海道）"/>
          <path d="M 1080 390 Q 1098 384, 1108 396 Q 1106 412, 1094 418 Q 1080 414, 1078 400 Z" fill="#4a3a1a" stroke="#8a7a3a" stroke-width="1" class="map-region" data-info="日本（九州）"/>
          <text x="1118" y="362" font-size="11" fill="#c8a84a" text-anchor="middle" font-family="Georgia,serif" font-weight="bold">日本</text>
          <text x="1118" y="376" font-size="6.5" fill="#8a7a3a" text-anchor="middle">共荣圈</text>
        </g>
        <!-- 台湾 -->
        <path d="M 1064 400 Q 1076 396, 1082 406 Q 1080 422, 1070 424 Q 1060 414, 1064 400 Z"
              fill="#4a3a1a" stroke="#8a7a3a" stroke-width="0.8" class="map-region" data-info="台湾（日属）"/>
        <!-- 琉球/冲绳 -->
        <path d="M 1140 404 Q 1156 398, 1164 410 Q 1162 422, 1150 424 Q 1140 416, 1140 404 Z"
              fill="#4a3a1a" stroke="#8a7a3a" stroke-width="0.6" opacity="0.7" class="map-region" data-info="琉球（日属）"/>

        <!-- 澳大利亚 -->
        <path d="M 1000 578 Q 1060 566, 1120 576 Q 1138 610, 1128 658 Q 1096 694, 1056 698 Q 1018 688, 1002 662 Q 992 622, 1000 586 Z"
              fill="#6a5a3a" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="澳大利亚"/>
        <text x="1068" y="632" font-size="9" fill="#d8c8a0" text-anchor="middle" font-weight="bold">澳大利亚</text>
        <!-- 新西兰 -->
        <path d="M 1142 662 Q 1160 656, 1170 670 Q 1168 694, 1154 702 Q 1140 696, 1138 678 Z"
              fill="#5a5a4a" stroke="#1a1a1a" stroke-width="0.7" class="map-region" data-info="新西兰"/>
        <text x="1154" y="686" font-size="5.5" fill="#c8c8a0" text-anchor="middle">新西兰</text>

        <!-- ============ 关系连线 ============ -->
        <g class="relation-lines" opacity="0.5">
          <line x1="542" y1="282" x2="496" y2="376" stroke="${relLine(s.relations.italy)}" stroke-width="1.8"/>
          ${russiaFragments ? `
          <line x1="640" y1="260" x2="740" y2="194" stroke="${relLine(s.relations.russia)}" stroke-width="1.8" stroke-dasharray="5,3"/>` : `
          <line x1="640" y1="260" x2="920" y2="230" stroke="${relLine(s.relations.russia)}" stroke-width="1.8" stroke-dasharray="5,3"/>`}
          <line x1="542" y1="272" x2="158" y2="240" stroke="${relLine(s.relations.ofn)}" stroke-width="1.5" stroke-dasharray="3,4"/>
          <line x1="496" y1="304" x2="496" y2="312" stroke="${relLine(s.relations.burgundy)}" stroke-width="2.5"/>
          <line x1="604" y1="264" x2="1118" y2="356" stroke="${relLine(s.relations.japan)}" stroke-width="1.2" stroke-dasharray="2,5"/>
          <line x1="600" y1="340" x2="628" y2="416" stroke="${relLine(s.relations.turkey)}" stroke-width="1.3" stroke-dasharray="4,3"/>
          <line x1="620" y1="348" x2="688" y2="436" stroke="${relLine(s.relations.iran || 0)}" stroke-width="0.9" stroke-dasharray="3,4" opacity="0.4"/>
        </g>

        <!-- ============ 战争动画标记 ============ -->
        ${hasWar ? `
        <g class="war-markers">
          ${warEurope ? `
          <g>
            <g style="${warAnimStyle}">
              <line x1="518" y1="286" x2="538" y2="306" stroke="#ff4444" stroke-width="2.2"/>
              <line x1="538" y1="286" x2="518" y2="306" stroke="#ff4444" stroke-width="2.2"/>
              <circle cx="528" cy="296" r="10" fill="none" stroke="#ff4444" stroke-width="1.3" opacity="0.5"/>
            </g>
            <g style="${warShakeStyle}">
              <polygon points="548,254 570,250 564,266" fill="#ff6644" opacity="0.7"/>
              <polygon points="558,314 578,318 570,330" fill="#ff6644" opacity="0.7"/>
            </g>
            <circle cx="558" cy="286" r="3.5" fill="#ff8844" opacity="0.8" style="animation: explosion 1.5s ease-out infinite;"/>
          </g>` : ''}
          ${warAfrica ? `
          <g>
            <g style="${warAnimStyle}">
              <line x1="380" y1="436" x2="400" y2="454" stroke="#ff4444" stroke-width="2.2"/>
              <line x1="400" y1="436" x2="380" y2="454" stroke="#ff4444" stroke-width="2.2"/>
              <circle cx="390" cy="445" r="8" fill="none" stroke="#ff4444" stroke-width="1" opacity="0.5"/>
            </g>
            <g style="${warShakeStyle}">
              <polygon points="482,426 502,422 498,438" fill="#ff6644" opacity="0.7"/>
            </g>
            <circle cx="490" cy="432" r="3" fill="#ff8844" opacity="0.8" style="animation: explosion 1.8s ease-out infinite;"/>
          </g>` : ''}
          ${warMiddleEast ? `
          <g>
            <g style="${warAnimStyle}">
              <line x1="526" y1="440" x2="546" y2="458" stroke="#ff4444" stroke-width="2.2"/>
              <line x1="546" y1="440" x2="526" y2="458" stroke="#ff4444" stroke-width="2.2"/>
              <circle cx="536" cy="449" r="8" fill="none" stroke="#ff4444" stroke-width="1" opacity="0.5"/>
            </g>
            <g style="${warShakeStyle}">
              <polygon points="660,434 680,438 672,452" fill="#ff6644" opacity="0.7"/>
            </g>
          </g>` : ''}
          ${warAsia ? `
          <g>
            <g style="${warAnimStyle}">
              <line x1="912" y1="464" x2="932" y2="482" stroke="#ff4444" stroke-width="2.2"/>
              <line x1="932" y1="464" x2="912" y2="482" stroke="#ff4444" stroke-width="2.2"/>
              <circle cx="922" cy="473" r="8" fill="none" stroke="#ff4444" stroke-width="1" opacity="0.5"/>
            </g>
          </g>` : ''}
        </g>` : ''}

        <!-- 指北针 -->
        <g transform="translate(1158, 48)">
          <circle r="16" fill="none" stroke="#3a3a4a" stroke-width="1"/>
          <polygon points="0,-13 -4,4 0,0 4,4" fill="#a83232"/>
          <polygon points="0,13 -4,-4 0,0 4,-4" fill="#3a3a4a"/>
          <text y="-20" text-anchor="middle" font-size="9" fill="#8a8884">N</text>
        </g>

        <!-- 图例（左下角） -->
        <g transform="translate(12, 690)" class="map-legend">
          <rect x="-4" y="-4" width="520" height="52" fill="#0a0a0c" stroke="#2a2a2a" stroke-width="1" rx="2"/>
          <rect x="4" y="4" width="11" height="7" fill="${germanyColor}"/>
          <text x="19" y="10" font-size="7" fill="#a8a6a0">帝国</text>
          <rect x="58" y="4" width="11" height="7" fill="${burgundyColor}"/>
          <text x="73" y="10" font-size="7" fill="#a8a6a0">勃艮第</text>
          <rect x="118" y="4" width="11" height="7" fill="${italyColor}"/>
          <text x="133" y="10" font-size="7" fill="#a8a6a0">意大利</text>
          <rect x="178" y="4" width="11" height="7" fill="${russiaColor}"/>
          <text x="193" y="10" font-size="7" fill="#a8a6a0">俄罗斯</text>
          <rect x="248" y="4" width="11" height="7" fill="${freeFranceColor}"/>
          <text x="263" y="10" font-size="7" fill="#a8a6a0">自由法</text>
          <rect x="312" y="4" width="11" height="7" fill="${vichyColor}"/>
          <text x="327" y="10" font-size="7" fill="#a8a6a0">维希</text>
          <rect x="368" y="4" width="11" height="7" fill="${egyptColor}"/>
          <text x="383" y="10" font-size="7" fill="#a8a6a0">埃及</text>
          <rect x="424" y="4" width="11" height="7" fill="${saudiColor}"/>
          <text x="439" y="10" font-size="7" fill="#a8a6a0">中东</text>
          <line x1="4" y1="22" x2="18" y2="22" stroke="#4a8a4a" stroke-width="1.6"/>
          <text x="22" y="25" font-size="7" fill="#a8a6a0">友</text>
          <line x1="48" y1="22" x2="62" y2="22" stroke="#5a5a5a" stroke-width="1.6"/>
          <text x="66" y="25" font-size="7" fill="#a8a6a0">中</text>
          <line x1="92" y1="22" x2="106" y2="22" stroke="#a83232" stroke-width="1.6"/>
          <text x="110" y="25" font-size="7" fill="#a8a6a0">敌</text>
          <rect x="142" y="17" width="11" height="7" fill="${northAfricaColor}"/>
          <text x="157" y="24" font-size="7" fill="#a8a6a0">法属北非</text>
          <rect x="212" y="17" width="11" height="7" fill="${italyAfricaColor}"/>
          <text x="227" y="24" font-size="7" fill="#a8a6a0">意属非</text>
          <rect x="278" y="17" width="11" height="7" fill="${iranColor}"/>
          <text x="293" y="24" font-size="7" fill="#a8a6a0">伊朗</text>
          <rect x="332" y="17" width="11" height="7" fill="${frenchIndochinaColor}"/>
          <text x="347" y="24" font-size="7" fill="#a8a6a0">印支</text>
          <rect x="386" y="17" width="11" height="7" fill="${dutchIndiesColor}"/>
          <text x="401" y="24" font-size="7" fill="#a8a6a0">东印度</text>
          <rect x="442" y="17" width="11" height="7" fill="${turkeyColor}"/>
          <text x="457" y="24" font-size="7" fill="#a8a6a0">土耳其</text>
          <line x1="4" y1="38" x2="18" y2="38" stroke="#e8c860" stroke-width="1.6"/>
          <text x="22" y="41" font-size="7" fill="#a8a6a0">玩家</text>
          <line x1="62" y1="38" x2="76" y2="38" stroke="#3a5a8a" stroke-width="1.6"/>
          <text x="80" y="41" font-size="7" fill="#a8a6a0">OFN</text>
          <line x1="128" y1="38" x2="142" y2="38" stroke="#8a7a3a" stroke-width="1.6"/>
          <text x="146" y="41" font-size="7" fill="#a8a6a0">共荣圈</text>
          <rect x="200" y="33" width="11" height="7" fill="${iberiaColor}"/>
          <text x="215" y="40" font-size="7" fill="#a8a6a0">伊比利亚</text>
          <rect x="280" y="33" width="11" height="7" fill="#4a3a3a"/>
          <text x="295" y="40" font-size="7" fill="#a8a6a0">俄军阀</text>
          <rect x="338" y="33" width="11" height="7" fill="#1a2a4a"/>
          <text x="353" y="40" font-size="7" fill="#a8a6a0">美国</text>
          <rect x="392" y="33" width="11" height="7" fill="#4a3a1a"/>
          <text x="407" y="40" font-size="7" fill="#a8a6a0">日本</text>
          <rect x="442" y="33" width="11" height="7" fill="#5a3a5a"/>
          <text x="457" y="40" font-size="7" fill="#a8a6a0">马岛</text>
        </g>
        ${typeof MAP_EXTRA_SVG !== 'undefined' ? MAP_EXTRA_SVG : ''}
      </svg>
    `;

    // 势力详情面板
    const factionDetails = [
      { name: '大日耳曼国', rel: null, desc: germanyLabel, color: germanyColor, isPlayer: true },
      { name: '美国 (OFN)', rel: s.relations.ofn, desc: '自由世界残部，民主灯塔', color: '#3a5a8a' },
      { name: '日本', rel: s.relations.japan, desc: '共荣圈霸主，太平洋帝国', color: '#8a7a3a' },
      { name: '意大利', rel: s.relations.italy, desc: italyLabel, color: italyColor },
      { name: '勃艮第', rel: s.relations.burgundy, desc: '希姆莱的黑暗国度', color: burgundyColor },
      ...(russiaFragments ? [
        { name: '俄罗斯（军阀割据）', rel: s.relations.russia, desc: '群雄割据，前途未卜', color: russiaColor },
        { name: 'WRRF · 西俄革命阵线', rel: null, desc: '苏沃洛夫的军政府，最强军阀之一', color: '#5a3a3a' },
        { name: '科米共和国', rel: null, desc: '俄罗斯仅存的民主试验田', color: '#4a4a5a' },
        { name: '维亚特卡', rel: null, desc: '君主制复辟，沙皇遗老', color: '#4a4a8a' },
        { name: '萨马拉 · 俄罗斯解放军', rel: null, desc: '弗拉索夫的叛军政权', color: '#5a5a3a' },
        { name: '鄂木斯克 · 黑色联盟', rel: null, desc: '极端军国主义，以复仇为业', color: '#2a2a2a' },
        { name: '托木斯克', rel: null, desc: '学者共和，西伯利亚文人政府', color: '#4a5a5a' },
        { name: '人民革命委员会', rel: null, desc: '西伯利亚布党残部', color: '#7a2a2a' },
        { name: '阿穆尔', rel: null, desc: '远东白色独裁，日军阴影下', color: '#4a3a5a' },
        { name: '马加丹', rel: null, desc: '远东流放地军阀，投机者', color: '#5a5a5a' },
      ] : [
        { name: russiaLabel, rel: s.relations.russia, desc: '已统一的东方巨人', color: russiaColor },
      ]),
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
    this.renderAll();
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
    this.renderAll();
    this.autoSave();
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
        const parsed = JSON.parse(saved);
        // 存档版本检查：版本不匹配则拒绝加载旧存档
        if (!parsed.saveVersion || parsed.saveVersion !== Game.SAVE_VERSION) {
          console.log('存档版本不匹配，需要开新档');
          localStorage.removeItem('tno_game_save');
          return false;
        }
        Game.state = parsed;
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
