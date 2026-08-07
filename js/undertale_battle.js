// ===== Undertale Sans Genocide 风格 BOSS 战引擎 =====
// 单一 BOSS：德衫 (Deutschland Sans)
(function () {
  'use strict';

  const BOSS = {
    name: '德衫',
    title: 'Deutschland Sans · 千年梦魇',
    hp: 1,
    dodgeTurns: 11,
    mercyThreshold: 80,
    color: '#e0c080',
    introLines: [
      '* 雪地里传来一阵低语...',
      '* "听着，小家伙..."',
      '* "我已经死过一次了。"',
      '* "你以为你能杀死我两次？"',
      '* "...好吧。那就让我看看。"',
      '* "你到底有多疼。"',
    ],
    checkText: '* 德衫。身高 183cm。喜欢黑白条纹。\n* 他的左眼闪烁着诡异的蓝光。',
    complainText: '* "嘿...你有没有觉得我们应该谈谈？"\n* "关于...这个世界的真相？"\n* (MERCY 上升了)',
    talkText: '* "兄弟，我见过无数条时间线..."\n* "没有一条...是你能接受的。"\n* (MERCY 上升了)',
    flirtText: '* "...你认真的？"\n* "你知道我是骷髅对吧？"\n* "...好吧，MERCY 上升了。"',
    onKillText: '* 德衫倒下了。\n* "最后...一条时间线..."\n* "也...终于...结束了..."',
    onSpareText: '* 你放下了武器。\n* 德衫看着你，沉默了很久。\n* "...也许...你是对的。"\n* "也许...还有希望。"',
    dodgeText: '* 德衫闪开了！',
  };

  const PLAYER = { maxHp: 92, atk: 19, def: 9 };
  const ITEMS = [
    { id: 'tea',        name: '海茶',         heal: 10,  text: '* 你喝了一口海茶，感觉温暖。' },
    { id: 'hero',       name: '传说英雄',     heal: 40,  text: '* 传说中的英雄能量涌入体内！' },
    { id: 'steak',      name: '牛排脸',       heal: 60,  text: '* 一块带脸的牛排。你吃了它。' },
    { id: 'pie',        name: '奶油肉桂派',   heal: 92,  text: '* 妈妈做的派。你满血复活了。' },
  ];

  let _battle = null;
  let _introTimer = null;
  let _enemyTimers = [];

  function clearEnemyTimers() {
    _enemyTimers.forEach(t => clearTimeout(t));
    _enemyTimers.forEach(t => clearInterval(t));
    _enemyTimers = [];
  }
  function mkInterval(fn, ms) { const id = setInterval(fn, ms); _enemyTimers.push(id); return id; }
  function mkTimeout(fn, ms) { const id = setTimeout(fn, ms); _enemyTimers.push(id); return id; }

  function openBossSelect() {
    close();
    const panel = document.createElement('div');
    panel.id = 'undertale-boss-select';
    panel.style.cssText = 'position:fixed;inset:0;background:#000;z-index:100050;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;font-family:"Courier New",monospace;';
    panel.innerHTML = `
      <div style="text-align:center;margin-bottom:30px;">
        <div style="font-size:48px;margin-bottom:12px;color:#e0c080;">⚔ SSEM</div>
        <div style="font-size:28px;color:#e0c080;letter-spacing:6px;">德衫 BOSS 战</div>
        <div style="font-size:12px;color:#888;margin-top:8px;">Undertale Sans Genocide 风格</div>
        <div style="font-size:11px;color:#666;margin-top:14px;">HP 1 但前 11 回合会闪避 · 龙骨炮 · 蓝魂重力 · Karma 紫血</div>
      </div>
      <button id="ub-start" style="background:#000;border:2px solid #e0c080;color:#e0c080;padding:16px 48px;font-family:inherit;font-size:18px;cursor:pointer;letter-spacing:4px;min-height:56px;">开始战斗</button>
      <button id="ub-close" style="margin-top:16px;background:#222;color:#888;border:1px solid #555;padding:10px 32px;font-family:inherit;cursor:pointer;">← 返回</button>
      <div style="margin-top:24px;font-size:10px;color:#555;max-width:320px;text-align:center;line-height:1.6;">
        操作：方向键/WASD 移动 · 蓝魂下空格/点击跳跃 · 屏幕触摸拖拽 · 点击按钮操作
      </div>
    `;
    document.body.appendChild(panel);
    panel.querySelector('#ub-start').onclick = () => { panel.remove(); startBattle(); };
    panel.querySelector('#ub-close').onclick = () => panel.remove();
  }

  function close() {
    if (_battle) { _battle._animStop = true; _battle._running = false; }
    clearEnemyTimers();
    if (_introTimer) { clearTimeout(_introTimer); _introTimer = null; }
    if (_battle && _battle.modal) _battle.modal.remove();
    const panel = document.getElementById('undertale-boss-select');
    if (panel) panel.remove();
    _battle = null;
  }

  function startBattle() {
    _battle = {
      phase: 'intro',
      turn: 0,
      ended: false,
      running: false,
      bossHp: BOSS.hp,
      player: {
        hp: PLAYER.maxHp,
        maxHp: PLAYER.maxHp,
        karma: 0,
        mercy: 0,
        atk: PLAYER.atk,
        def: PLAYER.def,
        items: [0, 0, 0, 0],
      },
      bullets: [],
      lasers: [],
      platforms: [],
      soulColor: 'red',
      gravity: 0,
      soul: { x: 0, y: 0, vx: 0, vy: 0, onGround: false },
      canvasW: 0,
      canvasH: 0,
      hitCooldown: 0,
      phaseIndex: 0,
      phaseStart: 0,
      phaseDuration: 5000,
      keys: {},
      _animStop: false,
    };
    _battle.player.items[0] = 2;
    _battle.player.items[1] = 1;
    _battle.player.items[2] = 1;
    _battle.player.items[3] = 1;

    const modal = document.createElement('div');
    modal.id = 'undertale-battle';
    modal.style.cssText = 'position:fixed;inset:0;background:#000;z-index:100060;display:flex;align-items:center;justify-content:center;font-family:"Courier New",monospace;color:#fff;';
    modal.innerHTML = buildBattleHTML();
    document.body.appendChild(modal);
    _battle.modal = modal;

    ['ub-fight', 'ub-act', 'ub-item', 'ub-mercy'].forEach((id, i) => {
      modal.querySelector('#' + id).onclick = () => onBtnPress(i);
    });

    modal.querySelector('#ub-close-x').onclick = () => {
      if (confirm('要放弃吗？德衫会嘲笑你的。')) close();
    };

    showIntroSequence();
  }

  function buildBattleHTML() {
    const b = _battle;
    return `
      <div id="ub-root" style="width:min(640px, 96vw, calc(100vh * 1.78));max-width:640px;background:#000;border:3px solid #fff;padding:clamp(10px,2.5vw,16px);position:relative;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;flex-wrap:wrap;gap:4px;">
          <div style="font-size:clamp(14px,3vw,18px);color:${BOSS.color};font-weight:bold;letter-spacing:2px;">${BOSS.name}</div>
          <div style="font-size:clamp(9px,2vw,11px);color:#888;">${BOSS.title}</div>
        </div>
        <div style="background:#1a1a1a;height:10px;border:1px solid #fff;border-radius:2px;overflow:hidden;margin-bottom:8px;">
          <div id="ub-boss-hp" style="background:linear-gradient(90deg,#ff2222,#ff8800);height:100%;width:${b.bossHp / BOSS.hp * 100}%;transition:width 0.3s;"></div>
        </div>
        <div style="font-size:9px;margin-bottom:6px;color:#aaa;text-align:right;">HP ${b.bossHp} / ${BOSS.hp} · 剩余闪避 ${Math.max(0, BOSS.dodgeTurns - b.turn)}</div>

        <div style="background:#0a0a0a;border:2px solid #444;height:clamp(90px,24vw,140px);display:flex;align-items:center;justify-content:center;margin-bottom:8px;position:relative;user-select:none;-webkit-user-select:none;overflow:hidden;">
          <div id="ub-sans-sprite" style="font-size:clamp(42px,12vw,72px);color:${BOSS.color};text-shadow:0 0 20px ${BOSS.color},0 0 40px #4488ff80;transition:filter 0.1s;">☠</div>
          <div id="ub-battle-hint" style="display:none;position:absolute;top:4px;left:50%;transform:translateX(-50%);font-size:11px;color:#ffcc00;letter-spacing:2px;text-shadow:0 0 6px #ffcc00;pointer-events:none;">TAP / SPACE</div>
        </div>

        <div style="background:#1a1a2a;border:2px solid #444;padding:clamp(8px,2vw,12px);min-height:56px;margin-bottom:8px;">
          <div id="ub-dialog" style="font-size:clamp(12px,2.8vw,14px);line-height:1.5;color:#ddd;white-space:pre-wrap;"></div>
        </div>

        <div id="ub-bullet-area" style="background:#000;border:2px solid #0f0;height:clamp(160px,38vw,220px);margin-bottom:8px;position:relative;overflow:hidden;display:none;touch-action:none;">
          <canvas id="ub-canvas" style="position:absolute;inset:0;width:100%;height:100%;"></canvas>
          <div id="ub-soul-indicator" style="position:absolute;top:4px;right:6px;font-size:9px;color:#666;pointer-events:none;"></div>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px;flex-wrap:wrap;gap:4px;">
          <div style="font-size:clamp(11px,2.6vw,13px);"><span style="color:#ffcc00;">YOU</span><span style="margin-left:10px;color:#aaa;">ATK ${b.player.atk} · DEF ${b.player.def}</span></div>
          <div style="font-size:clamp(9px,2vw,11px);color:#666;">回合 ${b.turn}</div>
        </div>
        <div style="background:#1a1a1a;height:12px;border:2px solid #fff;border-radius:2px;overflow:hidden;margin-bottom:4px;position:relative;">
          <div id="ub-player-hp-yellow" style="background:linear-gradient(90deg,#ffcc00,#ffee44);height:100%;width:100%;transition:width 0.2s;"></div>
          <div id="ub-player-hp-karma" style="position:absolute;top:0;left:0;height:100%;background:linear-gradient(90deg,#8800cc,#cc44ff);transition:width 0.2s;opacity:0.85;"></div>
        </div>
        <div id="ub-hp-text" style="font-size:9px;margin-bottom:4px;color:#aaa;">HP ${b.player.hp} / ${b.player.maxHp} · Karma ${b.player.karma}</div>

        <div style="margin-bottom:8px;">
          <div style="background:#1a1a1a;height:6px;border:1px solid #888;border-radius:2px;overflow:hidden;">
            <div id="ub-mercy" style="background:#00ffff;height:100%;width:0%;transition:width 0.3s;"></div>
          </div>
          <div style="font-size:9px;margin-top:2px;color:#666;text-align:right;">MERCY ${b.player.mercy}/${BOSS.mercyThreshold}</div>
        </div>

        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px;">
          ${['FIGHT','ACT','ITEM','MERCY'].map((l) => `
            <button id="ub-${l.toLowerCase()}" style="background:#000;border:2px solid #fff;color:#fff;padding:clamp(8px,2vw,12px) 4px;font-family:inherit;font-size:clamp(12px,2.8vw,15px);cursor:pointer;letter-spacing:2px;min-height:44px;touch-action:manipulation;"
              onmouseover="this.style.background='#fff';this.style.color='#000'" onmouseout="this.style.background='#000';this.style.color='#fff'">${l}</button>
          `).join('')}
        </div>

        <div id="ub-close-x" style="position:absolute;top:6px;right:10px;color:#888;cursor:pointer;font-size:14px;width:24px;height:24px;display:flex;align-items:center;justify-content:center;border-radius:50%;">✕</div>
      </div>
    `;
  }

  function updateBattleUI() {
    if (!_battle) return;
    const b = _battle;
    b.modal.querySelector('#ub-boss-hp').style.width = (b.bossHp / BOSS.hp * 100) + '%';
    const yellow = b.player.hp / b.player.maxHp * 100;
    b.modal.querySelector('#ub-player-hp-yellow').style.width = yellow + '%';
    const karmaPct = b.player.karma / b.player.maxHp * 100;
    b.modal.querySelector('#ub-player-hp-karma').style.width = karmaPct + '%';
    b.modal.querySelector('#ub-mercy').style.width = Math.min(100, b.player.mercy / BOSS.mercyThreshold * 100) + '%';
    b.modal.querySelector('#ub-hp-text').textContent = `HP ${b.player.hp} / ${b.player.maxHp} · Karma ${b.player.karma}`;
  }

  function setDialog(text, cb) {
    if (!_battle) return;
    const el = _battle.modal.querySelector('#ub-dialog');
    el.textContent = '';
    let i = 0;
    const speed = 22;
    function type() {
      if (!_battle) return;
      if (i < text.length) {
        el.textContent += text[i++];
        _introTimer = setTimeout(type, speed);
      } else if (cb) {
        _introTimer = setTimeout(cb, 250);
      }
    }
    type();
  }

  function setButtonsEnabled(enabled) {
    if (!_battle) return;
    ['ub-fight', 'ub-act', 'ub-item', 'ub-mercy'].forEach(id => {
      _battle.modal.querySelector('#' + id).disabled = !enabled;
    });
  }

  function showIntroSequence() {
    const b = _battle;
    setButtonsEnabled(false);
    let idx = 0;
    function next() {
      if (idx >= BOSS.introLines.length) {
        b.phase = 'player_turn';
        setButtonsEnabled(true);
        return;
      }
      setDialog(BOSS.introLines[idx], () => { idx++; next(); });
    }
    next();
  }

  function onBtnPress(idx) {
    const b = _battle;
    if (!b || b.ended || b.phase !== 'player_turn') return;
    b.phase = 'acting';
    setButtonsEnabled(false);
    switch (idx) {
      case 0: doFight(); break;
      case 1: doAct(); break;
      case 2: doItem(); break;
      case 3: doMercy(); break;
    }
  }

  function doFight() {
    const b = _battle;
    const enemyBox = b.modal.querySelector('#ub-sans-sprite').parentElement;
    const hint = b.modal.querySelector('#ub-battle-hint');
    enemyBox.style.position = 'relative';
    enemyBox.style.cursor = 'crosshair';

    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);height:16px;z-index:10;pointer-events:none;';
    const trackBg = document.createElement('div');
    trackBg.style.cssText = 'position:absolute;inset:0;background:rgba(255,255,255,0.08);';
    overlay.appendChild(trackBg);
    const leftZone = document.createElement('div');
    leftZone.style.cssText = 'position:absolute;top:0;bottom:0;left:30%;width:15%;background:rgba(100,200,255,0.25);';
    overlay.appendChild(leftZone);
    const centerZone = document.createElement('div');
    centerZone.style.cssText = 'position:absolute;top:0;bottom:0;left:42%;width:16%;background:rgba(255,220,80,0.35);';
    overlay.appendChild(centerZone);
    const rightZone = document.createElement('div');
    rightZone.style.cssText = 'position:absolute;top:0;bottom:0;right:30%;width:15%;background:rgba(100,200,255,0.25);';
    overlay.appendChild(rightZone);
    const centerMark = document.createElement('div');
    centerMark.style.cssText = 'position:absolute;left:50%;top:-8px;width:2px;height:32px;background:#ffcc00;transform:translateX(-50%);box-shadow:0 0 4px #ffcc00;';
    overlay.appendChild(centerMark);
    const slider = document.createElement('div');
    slider.style.cssText = 'position:absolute;left:0;top:-4px;width:8px;height:24px;background:#fff;box-shadow:0 0 8px #fff;';
    overlay.appendChild(slider);
    enemyBox.appendChild(overlay);

    hint.style.display = 'block';
    let pos = 0, dir = 1, speed = 2.8, stopped = false;

    const stop = (ev) => {
      if (stopped || !_battle) return;
      if (ev) ev.preventDefault();
      stopped = true;
      window.removeEventListener('keydown', onKey);
      enemyBox.removeEventListener('click', stop);
      enemyBox.removeEventListener('touchend', stop);
      enemyBox.style.cursor = '';
      overlay.remove();
      hint.style.display = 'none';

      const dist = Math.abs(pos - 50);
      let mult, label, color;
      if (dist <= 8)       { mult = 4.0;  label = 'PERFECT!'; color = '#ffcc00'; }
      else if (dist <= 15) { mult = 2.5;  label = 'GREAT!';  color = '#44ff44'; }
      else if (dist <= 25) { mult = 1.2;  label = 'GOOD';    color = '#88ccff'; }
      else                 { mult = 0.4;  label = 'MISS';    color = '#ff4444'; }

      b.modal.querySelector('#ub-sans-sprite').style.filter = 'brightness(3)';
      setTimeout(() => { b.modal.querySelector('#ub-sans-sprite').style.filter = ''; }, 120);

      const tag = document.createElement('div');
      tag.style.cssText = `position:absolute;top:20px;left:50%;transform:translateX(-50%);font-size:clamp(16px,4vw,24px);font-weight:bold;color:${color};text-shadow:0 0 8px ${color};pointer-events:none;z-index:11;letter-spacing:2px;`;
      tag.textContent = label;
      enemyBox.appendChild(tag);
      setTimeout(() => tag.remove(), 900);

      setTimeout(() => finishFight(mult, label), 500);
    };
    const onKey = e => { if (e.code === 'Space' || e.key === 'Enter') { e.preventDefault(); stop(); } };
    window.addEventListener('keydown', onKey);
    enemyBox.addEventListener('click', stop);
    enemyBox.addEventListener('touchend', stop, { passive: false });

    function tick() {
      if (!_battle) { window.removeEventListener('keydown', onKey); overlay.remove(); return; }
      if (stopped) return;
      pos += dir * speed;
      if (pos >= 100) { pos = 100; dir = -1; }
      if (pos <= 0)   { pos = 0;   dir = 1; }
      slider.style.left = `calc(${pos}% - 4px)`;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function finishFight(mult, label) {
    const b = _battle;
    if (!b) return;
    b.turn++;
    const rawDmg = Math.max(1, b.player.atk - 0 + Math.floor(Math.random() * 5) - 2);
    const dmg = Math.max(0, Math.round(rawDmg * mult));

    if (b.turn <= BOSS.dodgeTurns) {
      setDialog(`* 你攻击了 ${BOSS.name}！\n* ${label} 造成 ${dmg} 点伤害。\n* ${BOSS.dodgeText}`, () => {
        if (b.bossHp > 0) {
          setTimeout(startEnemyTurn, 600);
        } else {
          onVictory('kill');
        }
      });
      return;
    }

    if (label === 'MISS') {
      setDialog(`* 你攻击了 ${BOSS.name}！\n* MISS... 完全没打中。`, () => {
        setTimeout(startEnemyTurn, 600);
      });
      return;
    }

    b.bossHp = Math.max(0, b.bossHp - dmg);
    setDialog(`* 你攻击了 ${BOSS.name}！\n* ${label} 造成 ${dmg} 点伤害！`, () => {
      updateBattleUI();
      if (b.bossHp <= 0) onVictory('kill');
      else setTimeout(startEnemyTurn, 600);
    });
  }

  function doAct() {
    const b = _battle;
    const panel = document.createElement('div');
    panel.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:100065;display:flex;align-items:center;justify-content:center;font-family:"Courier New",monospace;color:#fff;';
    panel.innerHTML = `
      <div style="background:#1a1a2a;border:2px solid #fff;padding:20px;max-width:360px;width:90%;">
        <div style="font-size:14px;color:#e0c080;margin-bottom:14px;text-align:center;">⚔ 选择 ACT</div>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <button class="ub-act-btn" data-act="0" style="background:#000;border:2px solid #888;color:#fff;padding:10px;font-family:inherit;cursor:pointer;text-align:left;font-size:13px;">🔍 Check - 观察德衫</button>
          <button class="ub-act-btn" data-act="1" style="background:#000;border:2px solid #888;color:#fff;padding:10px;font-family:inherit;cursor:pointer;text-align:left;font-size:13px;">😤 Complain - 抱怨命运</button>
          <button class="ub-act-btn" data-act="2" style="background:#000;border:2px solid #888;color:#fff;padding:10px;font-family:inherit;cursor:pointer;text-align:left;font-size:13px;">💬 Talk - 尝试沟通</button>
          <button class="ub-act-btn" data-act="3" style="background:#000;border:2px solid #888;color:#fff;padding:10px;font-family:inherit;cursor:pointer;text-align:left;font-size:13px;">💘 Flirt - 对骷髅调情</button>
        </div>
      </div>
    `;
    document.body.appendChild(panel);
    panel.querySelectorAll('.ub-act-btn').forEach(btn => {
      btn.onmouseenter = () => { btn.style.background = '#333'; btn.style.borderColor = '#e0c080'; };
      btn.onmouseleave = () => { btn.style.background = '#000'; btn.style.borderColor = '#888'; };
      btn.onclick = () => {
        const idx = parseInt(btn.dataset.act);
        panel.remove();
        applyAct(idx);
      };
    });
  }

  function applyAct(idx) {
    const b = _battle;
    let text = '', mercyGain = 0;
    if (idx === 0)      text = BOSS.checkText;
    else if (idx === 1) { text = BOSS.complainText; mercyGain = 12 + Math.floor(Math.random() * 8); }
    else if (idx === 2) { text = BOSS.talkText;    mercyGain = 18 + Math.floor(Math.random() * 10); }
    else                { text = BOSS.flirtText;   mercyGain = 22 + Math.floor(Math.random() * 10); }
    b.player.mercy = Math.min(BOSS.mercyThreshold, b.player.mercy + mercyGain);
    setDialog(text + (mercyGain ? `\n* MERCY +${mercyGain}` : ''), () => {
      updateBattleUI();
      b.turn++;
      setTimeout(startEnemyTurn, 500);
    });
  }

  function doItem() {
    const b = _battle;
    const panel = document.createElement('div');
    panel.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:100065;display:flex;align-items:center;justify-content:center;font-family:"Courier New",monospace;color:#fff;';
    let html = `<div style="background:#1a1a2a;border:2px solid #fff;padding:20px;max-width:360px;width:90%;">
      <div style="font-size:14px;color:#e0c080;margin-bottom:14px;text-align:center;">📦 选择物品</div>
      <div style="display:flex;flex-direction:column;gap:8px;">`;
    ITEMS.forEach((it, i) => {
      const count = b.player.items[i];
      const disabled = count <= 0;
      html += `<button class="ub-item-btn" data-idx="${i}" ${disabled ? 'disabled' : ''} style="background:#000;border:2px solid ${disabled ? '#444' : '#888'};color:${disabled ? '#555' : '#fff'};padding:10px;font-family:inherit;cursor:${disabled ? 'default' : 'pointer'};text-align:left;font-size:13px;">
        ${it.name} (+${it.heal} HP) · x${count}
      </button>`;
    });
    html += `<button id="ub-item-back" style="margin-top:10px;background:#222;border:1px solid #555;color:#888;padding:8px;font-family:inherit;cursor:pointer;">← 返回</button>
      </div></div>`;
    panel.innerHTML = html;
    document.body.appendChild(panel);
    panel.querySelectorAll('.ub-item-btn').forEach(btn => {
      btn.onmouseenter = () => { if (!btn.disabled) { btn.style.background = '#333'; btn.style.borderColor = '#e0c080'; } };
      btn.onmouseleave = () => { btn.style.background = '#000'; btn.style.borderColor = btn.disabled ? '#444' : '#888'; };
      btn.onclick = () => {
        const idx = parseInt(btn.dataset.idx);
        if (b.player.items[idx] <= 0) return;
        b.player.items[idx]--;
        const it = ITEMS[idx];
        const realHeal = Math.min(it.heal, b.player.maxHp - b.player.hp);
        b.player.hp = Math.min(b.player.maxHp, b.player.hp + it.heal);
        panel.remove();
        setDialog(`${it.text}\n* 恢复 ${realHeal} HP！`, () => {
          updateBattleUI();
          b.turn++;
          setTimeout(startEnemyTurn, 500);
        });
      };
    });
    panel.querySelector('#ub-item-back').onclick = () => panel.remove();
  }

  function doMercy() {
    const b = _battle;
    if (b.player.mercy >= BOSS.mercyThreshold) {
      setDialog('* 你伸出了手...\n* "结束这一切吧，德衫。"\n* 他愣了很久...', () => {
        mkTimeout(() => setDialog(BOSS.onSpareText, () => onVictory('spare')), 1200);
      });
    } else {
      setDialog('* 你尝试饶恕...\n* 但德衫只是冷笑。\n* (MERCY 还需要 ' + BOSS.mercyThreshold + ')', () => {
        b.turn++;
        setTimeout(startEnemyTurn, 500);
      });
    }
  }

  // ====== 敌人回合 / 弹幕 ======
  function startEnemyTurn() {
    const b = _battle;
    if (!b || b.ended) return;
    b.phase = 'enemy_turn';
    b.bullets = [];
    b.lasers = [];
    b.platforms = [];
    b.soulColor = 'red';
    b.gravity = 0;

    const area = b.modal.querySelector('#ub-bullet-area');
    area.style.display = 'block';

    const canvas = b.modal.querySelector('#ub-canvas');
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width);
    canvas.height = Math.round(rect.height);
    b.canvasW = canvas.width;
    b.canvasH = canvas.height;

    b.soul = {
      x: b.canvasW / 2,
      y: b.canvasH - 30,
      vx: 0, vy: 0,
      onGround: false,
    };
    b.hitCooldown = 0;
    b.keys = {};
    b.phaseIndex = (b.phaseIndex + 1) % 8;
    b.phaseStart = performance.now();
    b.phaseDuration = 4000 + Math.floor(Math.random() * 3000);

    b.modal.querySelector('#ub-soul-indicator').textContent = `Phase ${b.phaseIndex + 1}/8 · RED`;

    const onKeyDown = e => {
      b.keys[e.key.toLowerCase()] = true;
      if (['arrowup','arrowdown','arrowleft','arrowright',' ','w','a','s','d'].includes(e.key.toLowerCase())) e.preventDefault();
    };
    const onKeyUp = e => { b.keys[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    let isTouching = false, touchPointerId = null;
    function canvasPos(clientX, clientY) {
      const r = canvas.getBoundingClientRect();
      return { x: (clientX - r.left) * (canvas.width / r.width), y: (clientY - r.top) * (canvas.height / r.height) };
    }
    const onTouchStart = e => {
      e.preventDefault();
      const t = e.changedTouches[0];
      isTouching = true; touchPointerId = t.identifier;
      const p = canvasPos(t.clientX, t.clientY);
      if (b.soulColor === 'blue' && b.soul.onGround) {
        b.soul.vy = -8; b.soul.onGround = false;
      } else {
        b.soul.x = p.x; b.soul.y = p.y;
      }
    };
    const onTouchMove = e => {
      if (!isTouching || b.soulColor === 'blue') return;
      e.preventDefault();
      for (const t of e.changedTouches) if (t.identifier === touchPointerId) {
        const p = canvasPos(t.clientX, t.clientY);
        b.soul.x = Math.max(6, Math.min(b.canvasW - 6, p.x));
        b.soul.y = Math.max(6, Math.min(b.canvasH - 6, p.y));
        break;
      }
    };
    const onTouchEnd = e => {
      for (const t of e.changedTouches) if (t.identifier === touchPointerId) {
        isTouching = false; touchPointerId = null; break;
      }
    };
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd, { passive: false });
    canvas.addEventListener('touchcancel', onTouchEnd, { passive: false });

    let isMouseDown = false;
    const onMD = e => {
      isMouseDown = true;
      if (b.soulColor === 'blue' && b.soul.onGround) { b.soul.vy = -8; b.soul.onGround = false; }
      else { const p = canvasPos(e.clientX, e.clientY); b.soul.x = p.x; b.soul.y = p.y; }
    };
    const onMM = e => {
      if (!isMouseDown || b.soulColor === 'blue') return;
      const p = canvasPos(e.clientX, e.clientY);
      b.soul.x = Math.max(6, Math.min(b.canvasW - 6, p.x));
      b.soul.y = Math.max(6, Math.min(b.canvasH - 6, p.y));
    };
    const onMU = () => { isMouseDown = false; };
    canvas.addEventListener('mousedown', onMD);
    canvas.addEventListener('mousemove', onMM);
    window.addEventListener('mouseup', onMU);

    function cleanup() {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
      canvas.removeEventListener('touchcancel', onTouchEnd);
      canvas.removeEventListener('mousedown', onMD);
      canvas.removeEventListener('mousemove', onMM);
      window.removeEventListener('mouseup', onMU);
    }

    spawnPhase(b.phaseIndex, b.canvasW, b.canvasH);

    const ctx = canvas.getContext('2d');
    b._running = true;
    b._animStop = false;
    b.enemyTurnStart = performance.now();
    b.enemyTurnDuration = 22000;

    function loop() {
      if (!b._running || b._animStop || !_battle) { cleanup(); return; }

      const totalElapsed = performance.now() - b.enemyTurnStart;
      if (totalElapsed > b.enemyTurnDuration) {
        b._running = false;
        cleanup();
        endEnemyTurn();
        return;
      }

      let elapsed = performance.now() - b.phaseStart;
      if (elapsed > b.phaseDuration) {
        clearEnemyTimers();
        b.phaseIndex = (b.phaseIndex + 1) % 8;
        b.phaseStart = performance.now();
        b.phaseDuration = 4000 + Math.floor(Math.random() * 3000);
        b.bullets = []; b.lasers = []; b.platforms = [];
        spawnPhase(b.phaseIndex, b.canvasW, b.canvasH);
        b.modal.querySelector('#ub-soul-indicator').textContent = `Phase ${b.phaseIndex + 1}/8 · ${b.soulColor.toUpperCase()}`;
      }

      if (b.keys[' '] && b.soulColor === 'blue' && b.soul.onGround) {
        b.soul.vy = -8; b.soul.onGround = false; b.keys[' '] = false;
      }
      if ((b.keys['arrowup'] || b.keys['w']) && b.soulColor === 'blue' && b.soul.onGround) {
        b.soul.vy = -8; b.soul.onGround = false;
      }

      const speed = b.soulColor === 'blue' ? 3.5 : 4.2;
      if (b.soulColor === 'red') {
        if (b.keys['arrowleft'] || b.keys['a'])   b.soul.x -= speed;
        if (b.keys['arrowright'] || b.keys['d'])  b.soul.x += speed;
        if (b.keys['arrowup'] || b.keys['w'])     b.soul.y -= speed;
        if (b.keys['arrowdown'] || b.keys['s'])   b.soul.y += speed;
      } else {
        if (b.keys['arrowleft'] || b.keys['a'])   b.soul.x -= speed;
        if (b.keys['arrowright'] || b.keys['d'])  b.soul.x += speed;
        b.soul.vy += 0.55;
        b.soul.y += b.soul.vy;

        b.soul.onGround = false;
        for (const p of b.platforms) {
          if (b.soul.vy >= 0 &&
              b.soul.x >= p.x - 4 && b.soul.x <= p.x + p.w + 4 &&
              b.soul.y >= p.y - 4 && b.soul.y <= p.y + 12) {
            b.soul.y = p.y; b.soul.vy = 0; b.soul.onGround = true;
          }
        }
        if (b.soul.y >= b.canvasH - 6) {
          b.soul.y = b.canvasH - 6; b.soul.vy = 0; b.soul.onGround = true;
        }
      }
      b.soul.x = Math.max(6, Math.min(b.canvasW - 6, b.soul.x));
      b.soul.y = Math.max(6, Math.min(b.canvasH - 6, b.soul.y));

      for (const bu of b.bullets) {
        bu.x += bu.vx; bu.y += bu.vy;
        if (bu.fn) bu.fn(bu);
      }
      b.bullets = b.bullets.filter(bu => bu.x > -80 && bu.x < b.canvasW + 80 && bu.y > -80 && bu.y < b.canvasH + 80);

      for (const laser of b.lasers) {
        if (!laser.warned) {
          laser.warnTime = (laser.warnTime || 0) + 16;
          if (laser.warnTime >= 200) { laser.warned = true; laser.fireTime = 0; }
        } else {
          laser.fireTime = (laser.fireTime || 0) + 16;
          if (laser.fireTime > laser.duration) laser.done = true;
        }
      }
      b.lasers = b.lasers.filter(l => !l.done);

      if (b.hitCooldown > 0) b.hitCooldown--;

      for (const bu of b.bullets) {
        const dx = bu.x - b.soul.x, dy = bu.y - b.soul.y;
        if (dx * dx + dy * dy < (bu.r + 6) * (bu.r + 6) && b.hitCooldown === 0) {
          applyHit(); break;
        }
      }

      for (const laser of b.lasers) {
        if (!laser.warned) continue;
        if (laser.type === 'rotating') {
          for (const beam of laser.beams) {
            const ang = beam.ang;
            const dx = Math.cos(ang), dy = Math.sin(ang);
            const px = b.soul.x - laser.cx, py = b.soul.y - laser.cy;
            const t = px * dx + py * dy;
            if (t < 0 || t > b.canvasW) continue;
            const cx = laser.cx + dx * t, cy = laser.cy + dy * t;
            const ddx = b.soul.x - cx, ddy = b.soul.y - cy;
            if (ddx * ddx + ddy * ddy < 36) { applyHit(); break; }
          }
        } else if (laser.type === 'horizontal') {
          const dy = Math.abs(b.soul.y - laser.y);
          if (b.soul.x > 0 && b.soul.x < b.canvasW && dy < 6) applyHit();
        } else if (laser.type === 'vertical') {
          const dx = Math.abs(b.soul.x - laser.x);
          if (b.soul.y > 0 && b.soul.y < b.canvasH && dx < 6) applyHit();
        }
      }

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (b.soulColor === 'blue') {
        ctx.fillStyle = 'rgba(30, 60, 140, 0.25)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.fillStyle = '#88aadd';
      b.platforms.forEach(p => { ctx.fillRect(p.x, p.y, p.w, 4); });
      ctx.strokeStyle = '#c0d8ff';
      b.platforms.forEach(p => { ctx.strokeRect(p.x, p.y, p.w, 4); });

      for (const laser of b.lasers) {
        const warn = !laser.warned;
        if (laser.type === 'rotating') {
          for (const beam of laser.beams) {
            const ang = beam.ang;
            const ex = laser.cx + Math.cos(ang) * b.canvasW * 2;
            const ey = laser.cy + Math.sin(ang) * b.canvasW * 2;
            ctx.strokeStyle = warn ? '#ff2222' : '#4488ff';
            ctx.lineWidth = warn ? 2 : 4;
            ctx.globalAlpha = warn ? 0.6 : 1;
            ctx.beginPath(); ctx.moveTo(laser.cx, laser.cy); ctx.lineTo(ex, ey); ctx.stroke();
            ctx.globalAlpha = 1;
            if (!warn) {
              ctx.strokeStyle = '#aaccff';
              ctx.lineWidth = 1;
              ctx.beginPath(); ctx.moveTo(laser.cx, laser.cy); ctx.lineTo(ex, ey); ctx.stroke();
            }
          }
        } else if (laser.type === 'horizontal') {
          ctx.strokeStyle = warn ? '#ff2222' : '#4488ff';
          ctx.lineWidth = warn ? 2 : 5;
          ctx.globalAlpha = warn ? 0.6 + Math.sin(performance.now() / 40) * 0.3 : 1;
          ctx.beginPath(); ctx.moveTo(0, laser.y); ctx.lineTo(b.canvasW, laser.y); ctx.stroke();
          ctx.globalAlpha = 1;
        } else if (laser.type === 'vertical') {
          ctx.strokeStyle = warn ? '#ff2222' : '#4488ff';
          ctx.lineWidth = warn ? 2 : 5;
          ctx.globalAlpha = warn ? 0.6 + Math.sin(performance.now() / 40) * 0.3 : 1;
          ctx.beginPath(); ctx.moveTo(laser.x, 0); ctx.lineTo(laser.x, b.canvasH); ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }

      for (const bu of b.bullets) {
        if (bu.shape === 'bone_h') {
          ctx.fillStyle = '#ffffff';
          const bw = bu.w, bh = bu.h;
          ctx.fillRect(bu.x - bw/2, bu.y - bh/2, bw, bh);
          ctx.beginPath();
          ctx.arc(bu.x - bw/2, bu.y - bh/2, bh/2, 0, Math.PI*2);
          ctx.arc(bu.x - bw/2, bu.y + bh/2, bh/2, 0, Math.PI*2);
          ctx.arc(bu.x + bw/2, bu.y - bh/2, bh/2, 0, Math.PI*2);
          ctx.arc(bu.x + bw/2, bu.y + bh/2, bh/2, 0, Math.PI*2);
          ctx.fill();
        } else if (bu.shape === 'bone_v') {
          ctx.fillStyle = '#ffffff';
          const bw = bu.w, bh = bu.h;
          ctx.fillRect(bu.x - bw/2, bu.y - bh/2, bw, bh);
          ctx.beginPath();
          ctx.arc(bu.x - bw/2, bu.y - bh/2, bw/2, 0, Math.PI*2);
          ctx.arc(bu.x + bw/2, bu.y - bh/2, bw/2, 0, Math.PI*2);
          ctx.arc(bu.x - bw/2, bu.y + bh/2, bw/2, 0, Math.PI*2);
          ctx.arc(bu.x + bw/2, bu.y + bh/2, bw/2, 0, Math.PI*2);
          ctx.fill();
        } else {
          ctx.fillStyle = bu.color || '#ffff00';
          ctx.beginPath();
          ctx.arc(bu.x, bu.y, bu.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.fillStyle = (b.hitCooldown > 0 && b.hitCooldown % 6 < 3)
        ? (b.soulColor === 'blue' ? '#66aaff' : '#ff8888')
        : (b.soulColor === 'blue' ? '#4488ff' : '#ff0000');
      drawHeart(ctx, b.soul.x, b.soul.y, 6);

      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    function applyHit() {
      if (b.hitCooldown > 0) return;
      b.hitCooldown = 50;
      const raw = Math.max(1, 8 - b.player.def + Math.floor(Math.random() * 4));
      const hpLoss = Math.min(b.player.hp, raw);
      b.player.hp -= hpLoss;
      const overflow = raw - hpLoss;
      if (overflow > 0) {
        b.player.karma = Math.min(b.player.maxHp, b.player.karma + overflow);
      }
      if (b.player.hp <= 0) {
        b.player.hp = 0;
        if (b.player.karma >= b.player.maxHp) {
          b._running = false;
          onDefeat();
          return;
        }
      }
      flashArea('#ff2244');
      updateBattleUI();
      if (b.player.karma >= b.player.maxHp) {
        b._running = false;
        onDefeat();
      }
    }
  }

  function flashArea(color) {
    const area = _battle.modal.querySelector('#ub-bullet-area');
    area.style.background = color;
    setTimeout(() => { area.style.background = '#000'; }, 80);
  }

  function drawHeart(ctx, x, y, size) {
    ctx.beginPath();
    ctx.moveTo(x, y + size * 0.7);
    ctx.bezierCurveTo(x + size * 1.5, y - size * 0.5, x + size * 0.5, y - size * 1.5, x, y - size * 0.2);
    ctx.bezierCurveTo(x - size * 0.5, y - size * 1.5, x - size * 1.5, y - size * 0.5, x, y + size * 0.7);
    ctx.fill();
  }

  function spawnPhase(idx, w, h) {
    const b = _battle;
    b.bullets = [];
    b.lasers = [];
    b.platforms = [];

    function addPlatform(x, y, ww) { b.platforms.push({ x, y, w: ww }); }

    if (idx === 0) {
      // Phase 1: 蓝魂骨头平台跳跃
      b.soulColor = 'blue';
      b.modal.querySelector('#ub-soul-indicator').textContent = 'Phase 1/8 · BLUE · 跳跃躲避骨头';
      addPlatform(w * 0.1, h * 0.6, w * 0.2);
      addPlatform(w * 0.5, h * 0.45, w * 0.22);
      addPlatform(w * 0.78, h * 0.6, w * 0.18);
      let i = 0;
      mkInterval(() => {
        if (!_battle) return;
        const colCount = 3;
        const spacing = w / (colCount + 1);
        for (let c = 0; c < colCount; c++) {
          const baseX = spacing * (c + 1);
          const skip = (c + i) % 4 === 0;
          if (skip) continue;
          b.bullets.push({
            shape: 'bone_v',
            x: baseX, y: -30,
            vx: 0, vy: 3.5,
            w: 14, h: 24 + Math.random() * 12,
            r: 4,
          });
        }
        i++;
      }, 450);
    }

    else if (idx === 1) {
      // Phase 2: 龙骨炮风暴
      b.soulColor = 'red';
      b.modal.querySelector('#ub-soul-indicator').textContent = 'Phase 2/8 · RED · 龙骨炮风暴';
      mkInterval(() => {
        if (!_battle) return;
        const horizontal = Math.random() < 0.5;
        if (horizontal) {
          b.lasers.push({ type: 'horizontal', y: 40 + Math.random() * (h - 80), warned: false, warnTime: 0, fireTime: 0, duration: 400 });
        } else {
          b.lasers.push({ type: 'vertical', x: 40 + Math.random() * (w - 80), warned: false, warnTime: 0, fireTime: 0, duration: 400 });
        }
      }, 900);
      let i = 0;
      mkInterval(() => {
        if (!_battle) return;
        const y = 30 + Math.random() * (h - 60);
        b.bullets.push({ x: -20, y, vx: 4 + Math.random() * 2, vy: 0, r: 4, color: '#88ccff' });
        i++;
      }, 180);
    }

    else if (idx === 2) {
      // Phase 3: 蓝魂白骨扫过
      b.soulColor = 'blue';
      b.modal.querySelector('#ub-soul-indicator').textContent = 'Phase 3/8 · BLUE · 白骨横扫';
      addPlatform(10, h * 0.75, w - 20);
      mkInterval(() => {
        if (!_battle) return;
        const fromLeft = Math.random() < 0.5;
        const gapY = 30 + Math.random() * (h - 80);
        b.bullets.push({
          shape: 'bone_h',
          x: fromLeft ? -w : w * 2, y: gapY,
          vx: fromLeft ? 5 : -5, vy: 0,
          w: w * 1.2, h: 14,
          r: 4,
        });
      }, 1400);
      let i = 0;
      mkInterval(() => {
        if (!_battle) return;
        b.bullets.push({
          shape: 'bone_h',
          x: -w * 1.2 + i * 6, y: h * 0.3 + Math.sin(i * 0.3) * 20,
          vx: 3.5, vy: 0,
          w: w * 0.7, h: 12,
          r: 4,
        });
        i++;
      }, 130);
    }

    else if (idx === 3) {
      // Phase 4: 骨头夹击
      b.soulColor = 'red';
      b.modal.querySelector('#ub-soul-indicator').textContent = 'Phase 4/8 · RED · 骨头夹击';
      let squeeze = 0;
      mkInterval(() => {
        if (!_battle) return;
        squeeze += 1.2;
        const gapTop = Math.max(20, h / 2 - 50);
        const gapBot = Math.min(h - 20, h / 2 + 50);
        if (squeeze > 60) squeeze = 60;
        for (let x = 10; x < w; x += 24) {
          b.bullets.push({ shape: 'bone_v', x, y: -20 + squeeze, vx: 0, vy: 0, w: 12, h: 18 + squeeze * 0.5, r: 4 });
          b.bullets.push({ shape: 'bone_v', x, y: h + 20 - squeeze, vx: 0, vy: 0, w: 12, h: 18 + squeeze * 0.5, r: 4 });
        }
      }, 220);
    }

    else if (idx === 4) {
      // Phase 5: 蓝魂平台 + 静止激光柱
      b.soulColor = 'blue';
      b.modal.querySelector('#ub-soul-indicator').textContent = 'Phase 5/8 · BLUE · 平台+激光';
      addPlatform(w * 0.15, h * 0.55, w * 0.2);
      addPlatform(w * 0.5, h * 0.4, w * 0.2);
      addPlatform(w * 0.8, h * 0.55, w * 0.15);
      mkInterval(() => {
        if (!_battle) return;
        b.lasers.push({ type: 'vertical', x: 40 + Math.random() * (w - 80), warned: false, warnTime: 0, fireTime: 0, duration: 350 });
      }, 1100);
      mkInterval(() => {
        if (!_battle) return;
        b.lasers.push({ type: 'horizontal', y: 30 + Math.random() * (h - 60), warned: false, warnTime: 0, fireTime: 0, duration: 300 });
      }, 1500);
    }

    else if (idx === 5) {
      // Phase 6: 混乱模式
      b.soulColor = 'red';
      b.modal.querySelector('#ub-soul-indicator').textContent = 'Phase 6/8 · RED · 混乱模式';
      mkInterval(() => {
        if (!_battle) return;
        const rx = Math.random() * w;
        const ry = Math.random() < 0.5 ? -10 : h + 10;
        b.bullets.push({ x: rx, y: ry, vx: (Math.random() - 0.5) * 3, vy: ry < 0 ? 3 + Math.random() * 2 : -3 - Math.random() * 2, r: 4 + Math.random() * 2, color: ['#ff0066','#00ffcc','#ffcc00','#aa44ff','#44aaff'][Math.floor(Math.random()*5)] });
      }, 100);
      mkInterval(() => {
        if (!_battle) return;
        if (Math.random() < 0.5) {
          b.lasers.push({ type: 'horizontal', y: 30 + Math.random() * (h - 60), warned: false, warnTime: 0, fireTime: 0, duration: 250 });
        } else {
          b.lasers.push({ type: 'vertical', x: 30 + Math.random() * (w - 60), warned: false, warnTime: 0, fireTime: 0, duration: 250 });
        }
      }, 1400);
    }

    else if (idx === 6) {
      // Phase 7: 旋转风车激光
      b.soulColor = 'red';
      b.modal.querySelector('#ub-soul-indicator').textContent = 'Phase 7/8 · RED · 旋转风车';
      const laser = {
        type: 'rotating',
        cx: w / 2, cy: h / 2,
        beams: [
          { ang: 0 },
          { ang: Math.PI * 2 / 3 },
          { ang: Math.PI * 4 / 3 },
        ],
        warned: false, warnTime: 0, fireTime: 0, duration: 9000,
        rotSpeed: 0.04,
      };
      b.lasers.push(laser);
      const rot = setInterval(() => {
        if (!_battle) { clearInterval(rot); return; }
        laser.beams.forEach(beam => { beam.ang += laser.rotSpeed; });
      }, 16);
      _enemyTimers.push(rot);
      mkInterval(() => {
        if (!_battle) return;
        const fromLeft = Math.random() < 0.5;
        const y = 20 + Math.random() * (h - 40);
        b.bullets.push({ shape: 'bone_h', x: fromLeft ? -w : w * 2, y, vx: fromLeft ? 4 : -4, vy: 0, w: w, h: 10, r: 4 });
      }, 1800);
    }

    else if (idx === 7) {
      // Phase 8: 死亡冲撞
      b.soulColor = 'blue';
      b.modal.querySelector('#ub-soul-indicator').textContent = 'Phase 8/8 · BLUE · 死亡冲撞';
      addPlatform(w * 0.05, h * 0.55, w * 0.15);
      addPlatform(w * 0.3, h * 0.45, w * 0.15);
      addPlatform(w * 0.55, h * 0.55, w * 0.15);
      mkInterval(() => {
        if (!_battle) return;
        const y = 20 + Math.random() * (h - 40);
        b.bullets.push({ shape: 'bone_h', x: -w, y, vx: 6, vy: 0, w: w * 1.2, h: 14, r: 4 });
      }, 900);
      mkInterval(() => {
        if (!_battle) return;
        const colCount = 4;
        const spacing = w / (colCount + 1);
        for (let c = 0; c < colCount; c++) {
          const baseX = spacing * (c + 1);
          b.bullets.push({ shape: 'bone_v', x: baseX, y: -30, vx: 0, vy: 4.5, w: 14, h: 20 + Math.random() * 10, r: 4 });
        }
      }, 1200);
    }
  }

  function endEnemyTurn() {
    const b = _battle;
    if (!b || b.ended) return;
    b._running = false;
    clearEnemyTimers();
    b.modal.querySelector('#ub-bullet-area').style.display = 'none';
    b.bullets = []; b.lasers = []; b.platforms = [];
    b.phase = 'player_turn';
    if (b.player.karma > 0) {
      b.player.karma = Math.max(0, b.player.karma - 1);
      updateBattleUI();
    }
    setButtonsEnabled(true);
    setDialog('* 你喘了口气...\n* 轮到你了。');
  }

  function onVictory(type) {
    const b = _battle;
    b.ended = true;
    b._running = false;
    clearEnemyTimers();
    b.modal.querySelector('#ub-bullet-area').style.display = 'none';
    const text = type === 'spare' ? BOSS.onSpareText : BOSS.onKillText;
    setDialog(text, () => showResultModal(type));
  }

  function onDefeat() {
    const b = _battle;
    if (!b) return;
    b.ended = true;
    b._running = false;
    clearEnemyTimers();
    b.modal.querySelector('#ub-bullet-area').style.display = 'none';
    setDialog('* 你倒下了...\n* 但...还没结束...', () => showDefeatModal());
  }

  function showResultModal(type) {
    const b = _battle;
    if (!b) return;
    const modal = b.modal;
    setTimeout(() => {
      let color, title;
      if (type === 'kill') { color = '#ff4444'; title = '☠ 胜利'; }
      else { color = '#44ff44'; title = '💚 饶恕成功'; }
      modal.innerHTML = `
        <div style="text-align:center;padding:30px;border:2px solid ${color};border-radius:8px;background:#0a0a0a;">
          <div style="font-size:36px;margin-bottom:12px;">${title.split(' ')[0]}</div>
          <div style="font-size:20px;color:${color};margin-bottom:16px;letter-spacing:2px;">${title.split(' ').slice(1).join(' ')}</div>
          <div style="font-size:13px;color:#ccc;margin-bottom:10px;">你战胜了 ${BOSS.name}</div>
          <div style="font-size:11px;color:#888;margin-bottom:16px;">剩余 HP ${b.player.hp}/${b.player.maxHp}</div>
          <button id="ub-result-close" style="background:#333;color:#fff;border:1px solid #fff;padding:10px 32px;border-radius:4px;cursor:pointer;font-family:inherit;min-height:44px;">结束</button>
        </div>
      `;
      modal.querySelector('#ub-result-close').onclick = () => close();
    }, 1500);
  }

  function showDefeatModal() {
    const b = _battle;
    const modal = b.modal;
    setTimeout(() => {
      modal.innerHTML = `
        <div style="text-align:center;padding:30px;border:2px solid #aa2222;border-radius:8px;background:#0a0000;">
          <div style="font-size:42px;margin-bottom:12px;color:#ff4444;">☠ GAME OVER</div>
          <div style="font-size:14px;color:#cc6666;margin-bottom:8px;">* 你又倒下了...</div>
          <div style="font-size:11px;color:#888;margin-bottom:16px;">德衫在某处冷笑。</div>
          <div style="display:flex;gap:10px;justify-content:center;">
            <button id="ub-retry" style="background:#552222;color:#ffcccc;border:1px solid #ff4444;padding:10px 24px;border-radius:4px;cursor:pointer;font-family:inherit;min-height:44px;">重新来过</button>
            <button id="ub-giveup" style="background:#222;color:#888;border:1px solid #555;padding:10px 24px;border-radius:4px;cursor:pointer;font-family:inherit;min-height:44px;">放弃</button>
          </div>
        </div>
      `;
      modal.querySelector('#ub-retry').onclick = () => { close(); setTimeout(startBattle, 150); };
      modal.querySelector('#ub-giveup').onclick = () => close();
    }, 1200);
  }

  function getPlayerStats() {
    return { maxHp: PLAYER.maxHp, atk: PLAYER.atk, def: PLAYER.def };
  }

  window.UndertaleBattle = {
    openBossSelect,
    close,
    startBattle,
    getPlayerStats,
    getBoss: () => BOSS,
    isAvailable: () => true,
  };

})();