// ===== Undertale Sans Genocide 风格 BOSS 战引擎 =====
// 单一 BOSS：德衫 (Deutschland Sans · Determination Sans)
// 逆向自 Dusttale "杀人喜剧" APK — act2_sansturn0~9 + spr_battle_ui_kr + bone_stab_alert
(function () {
  'use strict';

  // ═══════════════════════════════════════════════════════════════
  //  常量 — 对齐 Dusttale APK 里的变量/资源命名
  // ═══════════════════════════════════════════════════════════════

  const BOSS = {
    name: '德衫',
    title: 'Determination Sans',
    sanshp: 1,
    sansoverturn: 11,       // 前 11 回合闪避所有攻击 (APK 变量名 sansoverturn!)
    mercyThreshold: 80,
    color: '#e0c080',
    angryFilter: 'brightness(1.4) drop-shadow(0 0 12px #ff2222) hue-rotate(-10deg)',
    introLines: [
      '* 雪地里传来一阵低语...',
      '* "听着，小家伙..."',
      '* "我已经死过一次了。"',
      '* "你以为你能杀死我两次？"',
      '* "...好吧。那就让我看看。"',
      '* "你到底有多疼。"',
    ],
    checkText: '* sanshp 1 · sansatk ? · sansoverturn 11\n* "一个叫德衫的骷髅，厌倦了每次看到死亡。"\n* 左眼闪烁着诡异的蓝光。',
    complainText: '* "嘿...你有没有觉得我们应该谈谈？"\n* "关于...这个世界的真相？"\n* (MERCY 上升了)',
    talkText: '* "兄弟，我见过无数条时间线..."\n* "没有一条...是你能接受的。"\n* (MERCY 上升了)',
    flirtText: '* "...你认真的？"\n* "你知道我是骷髅对吧？"\n* "...好吧，MERCY 上升了。"',
    onKillText: '* 德衫倒下了。\n* "最后...一条时间线..."\n* "也...终于...结束了..."',
    onSpareText: '* 你放下了武器。\n* 德衫看着你，沉默了很久。\n* "...也许...你是对的。"\n* "也许...还有希望。"',
    dodgeText: '* sansoverturn 生效 — 德衫闪开了！',
    deathQuote: '* i\'ll save everyone from the human\n* their comedy is about to turn into tragedy.',
  };

  const PLAYER = { maxHp: 92, atk: 19, def: 9 };
  const ITEMS = [
    { id: 'tea',        name: '海茶',         heal: 10,  text: '* 你喝了一口海茶，感觉温暖。' },
    { id: 'hero',       name: '传说英雄',     heal: 40,  text: '* 传说中的英雄能量涌入体内！' },
    { id: 'steak',      name: '牛排脸',       heal: 60,  text: '* 一块带脸的牛排。你吃了它。' },
    { id: 'pie',        name: '奶油肉桂派',   heal: 92,  text: '* 妈妈做的派。你满血复活了。' },
  ];

  // 10 回合弹幕 — 对齐 act2_sansturn0~act2_sansturn9
  // soul: red=自由  blue=重力/跳跃  orange=穿弹  pink=紫互克
  const BATTLE_PHASES = [
    { id: 'sansturn0',  name: 'Phase 0 · 热身',         soul: 'red',    step2: false, duration: 4500 },
    { id: 'sansturn1',  name: 'Phase 1 · 骨墙',         soul: 'blue',   step2: false, duration: 5000 },
    { id: 'sansturn2',  name: 'Phase 2 · 龙骨炮登场',   soul: 'red',    step2: false, duration: 5000 },
    { id: 'sansturn3',  name: 'Phase 3 · 白骨横扫',     soul: 'blue',   step2: false, duration: 5000 },
    { id: 'sansturn4',  name: 'Phase 4 · 骨头夹击',     soul: 'red',    step2: false, duration: 4500 },
    { id: 'sansturn5',  name: 'Phase 5 · 平台+激光',    soul: 'blue',   step2: false, duration: 5000 },
    { id: 'sansturn6',  name: 'Phase 6 · 混乱弹幕',     soul: 'red',    step2: false, duration: 5500 },
    { id: 'sansturn7',  name: 'Phase 7 · 旋转风车',     soul: 'red',    step2: false, duration: 6000, angry: true },
    { id: 'sansturn8',  name: 'Phase 8 · 橙魂穿弹',     soul: 'orange', step2: false, duration: 5000 },
    { id: 'sansturn9',  name: 'Phase 9 · FINAL · Step_2', soul: 'red',   step2: true,  duration: 7000, angry: true, dust: true },
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
        <div style="font-size:48px;margin-bottom:12px;color:#e0c080;">⚔ DETERMINATION SANS</div>
        <div style="font-size:20px;color:#ff6666;letter-spacing:6px;">德衫 · 杀人喜剧</div>
        <div style="font-size:12px;color:#888;margin-top:8px;">逆向自 Dusttale APK — act2_sansturn0~9</div>
        <div style="font-size:11px;color:#666;margin-top:14px;">sanshp 1 · sansoverturn 11 · KR 独立UI · 骨头预警 · 橙魂穿弹</div>
      </div>
      <button id="ub-start" style="background:#000;border:2px solid #e0c080;color:#e0c080;padding:16px 48px;font-family:inherit;font-size:18px;cursor:pointer;letter-spacing:4px;min-height:56px;">开始战斗</button>
      <button id="ub-close" style="margin-top:16px;background:#222;color:#888;border:1px solid #555;padding:10px 32px;font-family:inherit;cursor:pointer;">← 返回</button>
      <div style="margin-top:24px;font-size:10px;color:#555;max-width:340px;text-align:center;line-height:1.6;">
        方向键/WASD 移动 · 蓝魂下空格/点击跳跃 · 橙魂可穿普通弹幕 · 龙骨炮子弹穿一切
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
      sanshp: BOSS.sanshp,
      sanskills: 0,              // Dusttale KILLS 计数器
      resets: 0,
      player: {
        hp: PLAYER.maxHp,
        maxHp: PLAYER.maxHp,
        karma: 0,                // KR — Karmic Retribution 紫血
        karmaMax: PLAYER.maxHp,
        mercy: 0,
        atk: PLAYER.atk,
        def: PLAYER.def,
        items: [0, 0, 0, 0],
      },
      bullets: [],
      lasers: [],
      platforms: [],
      warnings: [],              // bone_stab_alert 预警线
      dust: [],                   // spr_dustcloud_1 尘埃粒子
      soulColor: 'red',
      soulMode: 'free',           // free / gravity / pierce
      soul: { x: 0, y: 0, vx: 0, vy: 0, onGround: false },
      canvasW: 0,
      canvasH: 0,
      hitCooldown: 0,
      invulnTimer: 0,
      phaseIndex: 0,
      phaseStart: 0,
      phaseDuration: 5000,
      keys: {},
      _animStop: false,
      step2: false,
      isAngry: false,
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
    const soulColorMap = { red:'#ff2222', blue:'#4488ff', orange:'#ffaa22', pink:'#ff66aa' };
    return `
      <div id="ub-root" style="width:min(640px, 96vw, calc(100vh * 1.78));max-width:640px;background:#000;border:3px solid #fff;padding:clamp(10px,2.5vw,16px);position:relative;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;flex-wrap:wrap;gap:4px;">
          <div style="font-size:clamp(14px,3vw,18px);color:${BOSS.color};font-weight:bold;letter-spacing:2px;">${BOSS.name}</div>
          <div style="font-size:clamp(9px,2vw,11px);color:#888;">${BOSS.title}</div>
        </div>

        <div style="display:flex;gap:6px;margin-bottom:6px;">
          <div style="flex:1;">
            <div style="background:#1a1a1a;height:8px;border:1px solid #fff;border-radius:2px;overflow:hidden;">
              <div id="ub-boss-hp" style="background:linear-gradient(90deg,#ff2222,#ff8800);height:100%;width:${b.sanshp / BOSS.sanshp * 100}%;transition:width 0.3s;"></div>
            </div>
            <div style="font-size:9px;margin-top:2px;color:#aaa;">sanshp ${b.sanshp}/${BOSS.sanshp} · sansoverturn ${Math.max(0, BOSS.sansoverturn - b.turn)}</div>
          </div>
          <div style="font-size:clamp(9px,2vw,11px);color:#ff4444;display:flex;align-items:center;letter-spacing:2px;">
            KILLS ${b.sanskills}
          </div>
        </div>

        <div style="background:#0a0a0a;border:2px solid #444;height:clamp(90px,24vw,140px);display:flex;align-items:center;justify-content:center;margin-bottom:8px;position:relative;user-select:none;-webkit-user-select:none;overflow:hidden;">
          <div id="ub-sans-sprite" style="font-size:clamp(42px,12vw,72px);color:${BOSS.color};text-shadow:0 0 20px ${BOSS.color},0 0 40px #4488ff80;transition:filter 0.15s, text-shadow 0.15s;">☠</div>
          <div id="ub-sans-effect" style="position:absolute;inset:0;pointer-events:none;"></div>
          <div id="ub-battle-hint" style="display:none;position:absolute;top:4px;left:50%;transform:translateX(-50%);font-size:11px;color:#ffcc00;letter-spacing:2px;text-shadow:0 0 6px #ffcc00;pointer-events:none;">TAP / SPACE</div>
        </div>

        <div style="background:#1a1a2a;border:2px solid #444;padding:clamp(8px,2vw,12px);min-height:56px;margin-bottom:8px;">
          <div id="ub-dialog" style="font-size:clamp(12px,2.8vw,14px);line-height:1.5;color:#ddd;white-space:pre-wrap;"></div>
        </div>

        <div id="ub-bullet-area" style="background:#000;border:2px solid #0f0;height:clamp(160px,38vw,220px);margin-bottom:8px;position:relative;overflow:hidden;display:none;touch-action:none;">
          <canvas id="ub-canvas" style="position:absolute;inset:0;width:100%;height:100%;"></canvas>
          <div id="ub-soul-indicator" style="position:absolute;top:4px;right:6px;font-size:9px;color:#666;pointer-events:none;"></div>
          <div id="ub-soul-mode" style="position:absolute;top:14px;right:6px;font-size:8px;color:#aaa;pointer-events:none;letter-spacing:1px;"></div>
          <div id="ub-dpad" style="position:absolute;left:4px;bottom:4px;width:clamp(88px,22vw,120px);height:clamp(88px,22vw,120px);z-index:5;pointer-events:none;">
            <button data-dir="up"    style="position:absolute;top:0;left:50%;transform:translateX(-50%);width:33.3%;height:33.3%;border:2px solid #ffffff80;background:#00000060;color:#ffffff;font-size:clamp(18px,4.5vw,26px);border-radius:6px;pointer-events:auto;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;padding:0;margin:0;cursor:pointer;">▲</button>
            <button data-dir="left"  style="position:absolute;top:50%;left:0;transform:translateY(-50%);width:33.3%;height:33.3%;border:2px solid #ffffff80;background:#00000060;color:#ffffff;font-size:clamp(18px,4.5vw,26px);border-radius:6px;pointer-events:auto;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;padding:0;margin:0;cursor:pointer;">◀</button>
            <button data-dir="right" style="position:absolute;top:50%;right:0;transform:translateY(-50%);width:33.3%;height:33.3%;border:2px solid #ffffff80;background:#00000060;color:#ffffff;font-size:clamp(18px,4.5vw,26px);border-radius:6px;pointer-events:auto;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;padding:0;margin:0;cursor:pointer;">▶</button>
            <button data-dir="down"  style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:33.3%;height:33.3%;border:2px solid #ffffff80;background:#00000060;color:#ffffff;font-size:clamp(18px,4.5vw,26px);border-radius:6px;pointer-events:auto;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;padding:0;margin:0;cursor:pointer;">▼</button>
          </div>
          <button id="ub-jump-btn" style="position:absolute;right:4px;bottom:4px;width:clamp(56px,14vw,80px);height:clamp(56px,14vw,80px);border:2px solid #ffffff90;background:#00000070;color:#ffe066;font-family:inherit;font-size:clamp(12px,3vw,16px);font-weight:bold;border-radius:50%;z-index:5;pointer-events:auto;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;letter-spacing:1px;cursor:pointer;">JUMP</button>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px;flex-wrap:wrap;gap:4px;">
          <div style="font-size:clamp(11px,2.6vw,13px);"><span style="color:#ffcc00;">YOU</span><span style="margin-left:10px;color:#aaa;">ATK ${b.player.atk} · DEF ${b.player.def}</span></div>
          <div style="font-size:clamp(9px,2vw,11px);color:#666;">回合 ${b.turn} · Phase ${b.phaseIndex + 1}/${BATTLE_PHASES.length}</div>
        </div>

        <div style="display:flex;gap:4px;margin-bottom:4px;">
          <div style="flex:2;">
            <div style="background:#1a1a1a;height:10px;border:2px solid #ffcc00;border-radius:2px;overflow:hidden;position:relative;">
              <div id="ub-player-hp-yellow" style="background:linear-gradient(90deg,#ffcc00,#ffee44);height:100%;width:100%;transition:width 0.2s;"></div>
            </div>
          </div>
          <div style="flex:1;">
            <div style="background:#1a1a1a;height:10px;border:2px solid #8800cc;border-radius:2px;overflow:hidden;position:relative;">
              <div id="ub-player-kr" style="background:linear-gradient(90deg,#8800cc,#cc44ff);height:100%;width:0%;transition:width 0.2s;"></div>
            </div>
          </div>
        </div>
        <div id="ub-hp-text" style="font-size:9px;margin-bottom:4px;color:#aaa;">HP ${b.player.hp}/${b.player.maxHp} &nbsp;|&nbsp; KR ${b.player.karma}/${b.player.karmaMax}</div>

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
    b.modal.querySelector('#ub-boss-hp').style.width = (b.sanshp / BOSS.sanshp * 100) + '%';
    b.modal.querySelector('#ub-player-hp-yellow').style.width = (b.player.hp / b.player.maxHp * 100) + '%';
    b.modal.querySelector('#ub-player-kr').style.width = (b.player.karma / b.player.karmaMax * 100) + '%';
    b.modal.querySelector('#ub-mercy').style.width = Math.min(100, b.player.mercy / BOSS.mercyThreshold * 100) + '%';
    b.modal.querySelector('#ub-hp-text').textContent = `HP ${b.player.hp}/${b.player.maxHp}  |  KR ${b.player.karma}/${b.player.karmaMax}`;

    // 愤怒表情
    const sprite = b.modal.querySelector('#ub-sans-sprite');
    if (b.isAngry) {
      sprite.style.filter = BOSS.angryFilter;
      sprite.textContent = '😠';
    } else {
      sprite.style.filter = '';
      sprite.textContent = '☠';
    }
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
      setTimeout(() => updateBattleUI(), 120);

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
    b.sanskills++;
    const rawDmg = Math.max(1, b.player.atk - 0 + Math.floor(Math.random() * 5) - 2);
    const dmg = Math.max(0, Math.round(rawDmg * mult));

    if (b.turn <= BOSS.sansoverturn) {
      setDialog(`* 你攻击了 ${BOSS.name}！\n* ${label} 造成 ${dmg} 点伤害。\n* ${BOSS.dodgeText}\n* sansoverturn 还剩 ${BOSS.sansoverturn - b.turn} 回合`, () => {
        if (b.sanshp > 0) {
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

    b.sanshp = Math.max(0, b.sanshp - dmg);
    // 12 回合后进入愤怒
    b.isAngry = b.turn > BOSS.sansoverturn;
    setDialog(`* 你攻击了 ${BOSS.name}！\n* ${label} 造成 ${dmg} 点伤害！\n${b.isAngry ? '* 德衫的眼神变了...' : ''}`, () => {
      updateBattleUI();
      if (b.sanshp <= 0) onVictory('kill');
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
          <button class="ub-act-btn" data-act="0" style="background:#000;border:2px solid #888;color:#fff;padding:10px;font-family:inherit;cursor:pointer;text-align:left;font-size:13px;">🔍 Check — sanshp/sansoverturn 状态</button>
          <button class="ub-act-btn" data-act="1" style="background:#000;border:2px solid #888;color:#fff;padding:10px;font-family:inherit;cursor:pointer;text-align:left;font-size:13px;">😤 Complain — 抱怨命运</button>
          <button class="ub-act-btn" data-act="2" style="background:#000;border:2px solid #888;color:#fff;padding:10px;font-family:inherit;cursor:pointer;text-align:left;font-size:13px;">💬 Talk — 尝试沟通</button>
          <button class="ub-act-btn" data-act="3" style="background:#000;border:2px solid #888;color:#fff;padding:10px;font-family:inherit;cursor:pointer;text-align:left;font-size:13px;">💘 Flirt — 对骷髅调情</button>
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
    b.turn++;
    setDialog(text + (mercyGain ? `\n* MERCY +${mercyGain}` : ''), () => {
      updateBattleUI();
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
        b.player.hp = Math.min(b.player.maxHp, b.player.hp + it.heal);
        // 物品也能清除部分 KR
        if (it.heal >= 40) b.player.karma = Math.max(0, b.player.karma - Math.floor(it.heal * 0.3));
        panel.remove();
        setDialog(`${it.text}\n* 恢复 HP！`, () => {
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
      setDialog('* 你尝试饶恕...\n* 但德衫只是冷笑。\n* (MERCY 需要 ' + BOSS.mercyThreshold + ')', () => {
        b.turn++;
        setTimeout(startEnemyTurn, 500);
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════
  //  敌人回合 / 弹幕系统 — 对 Dusttale APK act2_sansturnX 逆向
  // ═══════════════════════════════════════════════════════════════

  function startEnemyTurn() {
    const b = _battle;
    if (!b || b.ended) return;
    b.phase = 'enemy_turn';
    b.bullets = [];
    b.lasers = [];
    b.platforms = [];
    b.warnings = [];
    b.dust = [];
    b.soulColor = 'red';
    b.soulMode = 'free';

    const area = b.modal.querySelector('#ub-bullet-area');
    area.style.display = 'block';

    const canvas = b.modal.querySelector('#ub-canvas');
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width);
    canvas.height = Math.round(rect.height);
    b.canvasW = canvas.width;
    b.canvasH = canvas.height;

    b.soul = { x: b.canvasW / 2, y: b.canvasH - 30, vx: 0, vy: 0, onGround: false };
    b.hitCooldown = 0;
    b.invulnTimer = 0;
    b.keys = {};

    b.phaseIndex = (b.phaseIndex + 1) % BATTLE_PHASES.length;
    const phase = BATTLE_PHASES[b.phaseIndex];
    b.phaseStart = performance.now();
    b.phaseDuration = phase.duration;
    b.step2 = phase.step2 || b.isAngry;

    const soulLabelMap = {
      red: 'RED soul — 自由移动',
      blue: 'BLUE soul — 重力/跳跃',
      orange: 'ORANGE soul — 可穿普通弹幕',
    };
    b.modal.querySelector('#ub-soul-indicator').textContent = `${phase.name}`;
    b.modal.querySelector('#ub-soul-mode').textContent = soulLabelMap[b.soulColor] || '';

    const onKeyDown = e => {
      b.keys[e.key.toLowerCase()] = true;
      if (['arrowup','arrowdown','arrowleft','arrowright',' ','w','a','s','d'].includes(e.key.toLowerCase())) e.preventDefault();
    };
    const onKeyUp = e => { b.keys[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    const dirMap = { up: 'arrowup', down: 'arrowdown', left: 'arrowleft', right: 'arrowright' };
    const dpad = b.modal.querySelector('#ub-dpad');
    const jumpBtn = b.modal.querySelector('#ub-jump-btn');
    const dpadBtnDown = e => {
      e.preventDefault(); e.stopPropagation();
      const dir = e.currentTarget.dataset.dir;
      if (dir) { b.keys[dirMap[dir]] = true; e.currentTarget.style.background = '#ffffff40'; }
    };
    const dpadBtnUp = e => {
      e.preventDefault(); e.stopPropagation();
      const dir = e.currentTarget.dataset.dir;
      if (dir) { b.keys[dirMap[dir]] = false; e.currentTarget.style.background = '#00000060'; }
    };
    const dpadBtns = dpad ? dpad.querySelectorAll('button[data-dir]') : [];
    dpadBtns.forEach(btn => {
      btn.addEventListener('touchstart', dpadBtnDown, { passive: false });
      btn.addEventListener('touchend', dpadBtnUp, { passive: false });
      btn.addEventListener('touchcancel', dpadBtnUp, { passive: false });
      btn.addEventListener('mousedown', dpadBtnDown);
      btn.addEventListener('mouseup', dpadBtnUp);
      btn.addEventListener('mouseleave', dpadBtnUp);
    });
    const jumpDown = e => {
      e.preventDefault(); e.stopPropagation();
      b.keys[' '] = true;
      if (b.soulColor === 'blue' && b.soul.onGround) { b.soul.vy = -8; b.soul.onGround = false; }
      if (jumpBtn) jumpBtn.style.background = '#ffe06650';
    };
    const jumpUp = e => {
      e.preventDefault(); e.stopPropagation();
      b.keys[' '] = false;
      if (jumpBtn) jumpBtn.style.background = '#00000070';
    };
    if (jumpBtn) {
      jumpBtn.addEventListener('touchstart', jumpDown, { passive: false });
      jumpBtn.addEventListener('touchend', jumpUp, { passive: false });
      jumpBtn.addEventListener('touchcancel', jumpUp, { passive: false });
      jumpBtn.addEventListener('mousedown', jumpDown);
      jumpBtn.addEventListener('mouseup', jumpUp);
      jumpBtn.addEventListener('mouseleave', jumpUp);
    }

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
      if (b.soulColor === 'blue' && b.soul.onGround) { b.soul.vy = -8; b.soul.onGround = false; }
      else { b.soul.x = p.x; b.soul.y = p.y; }
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
      dpadBtns.forEach(btn => {
        btn.removeEventListener('touchstart', dpadBtnDown);
        btn.removeEventListener('touchend', dpadBtnUp);
        btn.removeEventListener('touchcancel', dpadBtnUp);
        btn.removeEventListener('mousedown', dpadBtnDown);
        btn.removeEventListener('mouseup', dpadBtnUp);
        btn.removeEventListener('mouseleave', dpadBtnUp);
      });
      if (jumpBtn) {
        jumpBtn.removeEventListener('touchstart', jumpDown);
        jumpBtn.removeEventListener('touchend', jumpUp);
        jumpBtn.removeEventListener('touchcancel', jumpUp);
        jumpBtn.removeEventListener('mousedown', jumpDown);
        jumpBtn.removeEventListener('mouseup', jumpUp);
        jumpBtn.removeEventListener('mouseleave', jumpUp);
      }
    }

    spawnPhase(b.phaseIndex, b.canvasW, b.canvasH);

    const ctx = canvas.getContext('2d');
    b._running = true;
    b._animStop = false;
    b.enemyTurnStart = performance.now();
    b.enemyTurnDuration = b.step2 ? 18000 : 22000;

    const tickMs = b.step2 ? 8 : 16;

    function loop() {
      if (!b._running || b._animStop || !_battle) { cleanup(); return; }

      const now = performance.now();
      const totalElapsed = now - b.enemyTurnStart;
      if (totalElapsed > b.enemyTurnDuration) {
        b._running = false;
        cleanup();
        endEnemyTurn();
        return;
      }

      let elapsed = now - b.phaseStart;
      if (elapsed > b.phaseDuration) {
        clearEnemyTimers();
        b.phaseIndex = (b.phaseIndex + 1) % BATTLE_PHASES.length;
        b.phaseStart = performance.now();
        const next = BATTLE_PHASES[b.phaseIndex];
        b.phaseDuration = next.duration;
        b.step2 = next.step2 || b.isAngry;
        b.bullets = []; b.lasers = []; b.platforms = []; b.warnings = []; b.dust = [];
        spawnPhase(b.phaseIndex, b.canvasW, b.canvasH);
        b.modal.querySelector('#ub-soul-indicator').textContent = next.name + (b.step2 ? ' ⚡Step_2' : '');
      }

      // === 输入 ===
      if ((b.keys[' '] || b.keys['arrowup'] || b.keys['w']) && b.soulColor === 'blue' && b.soul.onGround) {
        b.soul.vy = -8; b.soul.onGround = false;
      }

      const speed = b.soulColor === 'blue' ? 3.5 : 4.2;
      if (b.soulColor === 'red' || b.soulColor === 'orange') {
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

      // === 子弹更新 ===
      const stepMul = b.step2 ? 2.0 : 1.0;
      for (const bu of b.bullets) {
        bu.x += bu.vx * stepMul;
        bu.y += bu.vy * stepMul;
        if (bu.fn) bu.fn(bu);
      }
      b.bullets = b.bullets.filter(bu => bu.x > -80 && bu.x < b.canvasW + 80 && bu.y > -80 && bu.y < b.canvasH + 80);

      // === 预警线更新 (bone_stab_alert) ===
      for (const w of b.warnings) {
        w.t = (w.t || 0) + tickMs;
        if (w.t >= w.duration) {
          w.fired = true;
          // 预警结束后发射
          if (w.type === 'bone_stab') {
            b.bullets.push({
              shape: w.shape || 'bone_v',
              x: w.x, y: w.bottom ? -30 : b.canvasH + 30,
              vx: w.vx || 0,
              vy: w.bottom ? (w.vy || 3.5) : -(w.vy || 3.5),
              w: w.bw || 14, h: w.bh || 24,
              r: 5,
              piercing: false,
            });
          } else if (w.type === 'bullet_gb') {
            b.bullets.push({
              shape: 'circle',
              x: w.x, y: w.y,
              vx: w.vx || 0, vy: w.vy || 4,
              r: 8, color: '#66aaff',
              piercing: true,  // Gaster Blaster 子弹穿一切
              gb: true,
            });
          }
        }
      }
      b.warnings = b.warnings.filter(w => !w.fired);

      // === 激光更新 ===
      for (const laser of b.lasers) {
        if (!laser.warned) {
          laser.warnTime = (laser.warnTime || 0) + tickMs;
          if (laser.warnTime >= (laser.warnDuration || 200)) { laser.warned = true; laser.fireTime = 0; }
        } else {
          laser.fireTime = (laser.fireTime || 0) + tickMs;
          if (laser.fireTime > laser.duration) laser.done = true;
        }
      }
      b.lasers = b.lasers.filter(l => !l.done);

      // === 尘埃粒子 (Step_2 最终战) ===
      if (b.step2 && b.dust.length < 30 && Math.random() < 0.3) {
        b.dust.push({
          x: Math.random() * b.canvasW,
          y: -5,
          vx: (Math.random() - 0.5) * 1.5,
          vy: 0.8 + Math.random() * 1.2,
          size: 1 + Math.random() * 3,
          alpha: 0.3 + Math.random() * 0.5,
        });
      }
      for (const d of b.dust) {
        d.x += d.vx; d.y += d.vy;
      }
      b.dust = b.dust.filter(d => d.y < b.canvasH + 10);

      if (b.hitCooldown > 0) b.hitCooldown -= tickMs;
      if (b.invulnTimer > 0) b.invulnTimer -= tickMs;

      // === 碰撞检测 ===
      for (const bu of b.bullets) {
        // 橙魂可穿普通弹幕（但穿不过骨头和穿甲弹）
        if (b.soulColor === 'orange' && !bu.piercing && bu.shape !== 'bone_v' && bu.shape !== 'bone_h') continue;

        const dx = bu.x - b.soul.x, dy = bu.y - b.soul.y;
        const hitR = (bu.r || 5) + 6;
        if (dx * dx + dy * dy < hitR * hitR && b.hitCooldown <= 0) {
          applyHit(bu.piercing ? 1.5 : 1.0); break;
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
            if (ddx * ddx + ddy * ddy < 36 && b.hitCooldown <= 0) { applyHit(1.3); break; }
          }
        } else if (laser.type === 'horizontal') {
          const dy = Math.abs(b.soul.y - laser.y);
          if (b.soul.x > 0 && b.soul.x < b.canvasW && dy < 6 && b.hitCooldown <= 0) applyHit(1.3);
        } else if (laser.type === 'vertical') {
          const dx = Math.abs(b.soul.x - laser.x);
          if (b.soul.y > 0 && b.soul.y < b.canvasH && dx < 6 && b.hitCooldown <= 0) applyHit(1.3);
        }
      }

      // === 绘制 ===
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 蓝魂背景
      if (b.soulColor === 'blue') {
        ctx.fillStyle = 'rgba(30, 60, 140, 0.25)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      // 橙魂背景
      if (b.soulColor === 'orange') {
        ctx.fillStyle = 'rgba(255, 140, 40, 0.15)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      // Step_2 红色背景闪烁
      if (b.step2) {
        const intensity = 0.05 + Math.sin(now / 100) * 0.04;
        ctx.fillStyle = `rgba(255, 0, 0, ${intensity})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // 尘埃粒子
      for (const d of b.dust) {
        ctx.fillStyle = `rgba(180, 160, 140, ${d.alpha})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // 平台
      ctx.fillStyle = '#88aadd';
      b.platforms.forEach(p => { ctx.fillRect(p.x, p.y, p.w, 4); });
      ctx.strokeStyle = '#c0d8ff';
      b.platforms.forEach(p => { ctx.strokeRect(p.x, p.y, p.w, 4); });

      // 预警线 (bone_stab_alert) — 红色闪烁
      for (const w of b.warnings) {
        const alpha = 0.5 + Math.sin(now / 50) * 0.3;
        ctx.strokeStyle = `rgba(255, 40, 40, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        if (w.type === 'bone_stab') {
          // 垂直预警
          ctx.moveTo(w.x, 0);
          ctx.lineTo(w.x, b.canvasH);
        } else if (w.type === 'bullet_gb') {
          // 范围预警
          ctx.strokeRect(w.x - 20, w.y - 20, 40, 40);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // 激光
      for (const laser of b.lasers) {
        const warn = !laser.warned;
        if (laser.type === 'rotating') {
          for (const beam of laser.beams) {
            const ang = beam.ang;
            const ex = laser.cx + Math.cos(ang) * b.canvasW * 2;
            const ey = laser.cy + Math.sin(ang) * b.canvasW * 2;
            ctx.strokeStyle = warn ? '#ff2222' : (laser.beamColor || '#4488ff');
            ctx.lineWidth = warn ? 2 : 5;
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
          ctx.globalAlpha = warn ? 0.6 + Math.sin(now / 40) * 0.3 : 1;
          ctx.beginPath(); ctx.moveTo(0, laser.y); ctx.lineTo(b.canvasW, laser.y); ctx.stroke();
          ctx.globalAlpha = 1;
        } else if (laser.type === 'vertical') {
          ctx.strokeStyle = warn ? '#ff2222' : '#4488ff';
          ctx.lineWidth = warn ? 2 : 5;
          ctx.globalAlpha = warn ? 0.6 + Math.sin(now / 40) * 0.3 : 1;
          ctx.beginPath(); ctx.moveTo(laser.x, 0); ctx.lineTo(laser.x, b.canvasH); ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }

      // 子弹
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
        } else if (bu.gb) {
          // bullet_gb — Gaster Blaster 专属子弹
          const pulse = 1 + Math.sin(now / 80) * 0.3;
          ctx.fillStyle = '#66aaff';
          ctx.beginPath();
          ctx.arc(bu.x, bu.y, bu.r * pulse, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#aaddff';
          ctx.beginPath();
          ctx.arc(bu.x, bu.y, bu.r * 0.5, 0, Math.PI * 2);
          ctx.fill();
          // 尾迹
          ctx.fillStyle = 'rgba(102,170,255,0.35)';
          ctx.beginPath();
          ctx.arc(bu.x - bu.vx, bu.y - bu.vy, bu.r * 0.7, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = bu.color || '#ffff00';
          ctx.beginPath();
          ctx.arc(bu.x, bu.y, bu.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 灵魂
      const flash = (b.hitCooldown > 0 && b.hitCooldown % 6 < 3);
      const soulColor = b.soulColor === 'blue' ? '#4488ff' :
                        b.soulColor === 'orange' ? '#ff8822' :
                        b.soulColor === 'pink' ? '#ff66aa' : '#ff2222';
      ctx.fillStyle = flash ? '#ffffff' : soulColor;
      drawHeart(ctx, b.soul.x, b.soul.y, 6);
      if (b.soulColor === 'blue') {
        ctx.fillStyle = '#ff66ff'; // 蓝魂内标
        ctx.beginPath(); ctx.arc(b.soul.x, b.soul.y, 2, 0, Math.PI*2); ctx.fill();
      }

      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    function applyHit(mult) {
      if (b.hitCooldown > 0) return;
      b.hitCooldown = 50;
      b.invulnTimer = 50;
      const raw = Math.max(1, Math.round((8 - b.player.def + Math.floor(Math.random() * 4)) * (mult || 1)));
      b.player.hp = Math.max(0, b.player.hp - raw);
      // KR 溢出到紫血 (Karmic Retribution)
      if (b.player.hp === 0) {
        b.player.karma = Math.min(b.player.karmaMax, b.player.karma + 5);
      }
      flashArea('#ff2244');
      updateBattleUI();
      if (b.player.hp <= 0 || b.player.karma >= b.player.karmaMax) {
        b._running = false;
        onDefeat();
      }
    }
  }

  function flashArea(color) {
    const area = _battle.modal.querySelector('#ub-bullet-area');
    const orig = area.style.background;
    area.style.background = color;
    setTimeout(() => { area.style.background = orig; }, 80);
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
    b.bullets = []; b.lasers = []; b.platforms = []; b.warnings = []; b.dust = [];

    function addPlatform(x, y, ww) { b.platforms.push({ x, y, w: ww }); }
    function warnBone(x, duration=300) {
      b.warnings.push({ type: 'bone_stab', x, bottom: true, duration, t: 0, fired: false, shape: 'bone_v', vy: 3.5, bw: 14, bh: 22 });
    }
    function warnGb(x, y, duration=350) {
      b.warnings.push({ type: 'bullet_gb', x, y, duration, t: 0, fired: false, vx: 0, vy: 4 });
    }

    const phase = BATTLE_PHASES[idx];
    b.soulColor = phase.soul;
    b.modal.querySelector('#ub-soul-indicator').textContent = phase.name;

    if (idx === 0) {
      // sansturn0 · 热身 — 简单骨头
      addPlatform(w * 0.1, h * 0.65, w * 0.2);
      mkInterval(() => {
        if (!_battle) return;
        warnBone(w * 0.3);
        warnBone(w * 0.7);
      }, 1800);
      mkInterval(() => {
        if (!_battle) return;
        b.bullets.push({ x: Math.random() * w, y: -10, vx: 0, vy: 3.2, r: 4, color: '#ffffff' });
      }, 400);
    }

    else if (idx === 1) {
      // sansturn1 · 骨墙
      addPlatform(w * 0.1, h * 0.6, w * 0.18);
      addPlatform(w * 0.45, h * 0.45, w * 0.18);
      addPlatform(w * 0.78, h * 0.6, w * 0.18);
      mkInterval(() => {
        if (!_battle) return;
        const cols = 4;
        const sp = w / (cols + 1);
        for (let c = 0; c < cols; c++) {
          warnBone(sp * (c + 1), 350);
        }
      }, 1500);
    }

    else if (idx === 2) {
      // sansturn2 · 龙骨炮登场 — bullet_gb
      mkInterval(() => {
        if (!_battle) return;
        warnGb(30 + Math.random() * (w - 60), 35 + Math.random() * (h - 70), 400);
      }, 900);
      mkInterval(() => {
        if (!_battle) return;
        b.lasers.push({ type: 'horizontal', y: 30 + Math.random() * (h - 60), warnDuration: 250, warned: false, warnTime: 0, fireTime: 0, duration: 400 });
      }, 1400);
      mkInterval(() => {
        if (!_battle) return;
        b.bullets.push({ x: -20, y: 30 + Math.random() * (h - 60), vx: 4 + Math.random(), vy: 0, r: 4, color: '#88ccff' });
      }, 200);
    }

    else if (idx === 3) {
      // sansturn3 · 白骨横扫
      addPlatform(10, h * 0.75, w - 20);
      mkInterval(() => {
        if (!_battle) return;
        const fromLeft = Math.random() < 0.5;
        b.bullets.push({
          shape: 'bone_h', x: fromLeft ? -w : w * 2, y: 30 + Math.random() * (h - 80),
          vx: fromLeft ? 5 : -5, vy: 0, w: w * 1.2, h: 14, r: 4,
        });
      }, 1400);
      let i = 0;
      mkInterval(() => {
        if (!_battle) return;
        b.bullets.push({
          shape: 'bone_h',
          x: -w * 1.2 + i * 5, y: h * 0.3 + Math.sin(i * 0.3) * 20,
          vx: 3.5, vy: 0, w: w * 0.7, h: 12, r: 4,
        });
        i++;
      }, 120);
    }

    else if (idx === 4) {
      // sansturn4 · 骨头夹击
      let squeeze = 0;
      mkInterval(() => {
        if (!_battle) return;
        squeeze += 1.5;
        if (squeeze > 55) squeeze = 55;
        for (let x = 10; x < w; x += 24) {
          b.bullets.push({ shape: 'bone_v', x, y: -20 + squeeze, vx: 0, vy: 0, w: 12, h: 18 + squeeze * 0.5, r: 4 });
          b.bullets.push({ shape: 'bone_v', x, y: h + 20 - squeeze, vx: 0, vy: 0, w: 12, h: 18 + squeeze * 0.5, r: 4 });
        }
      }, 220);
    }

    else if (idx === 5) {
      // sansturn5 · 平台+激光
      addPlatform(w * 0.15, h * 0.55, w * 0.2);
      addPlatform(w * 0.5, h * 0.4, w * 0.2);
      addPlatform(w * 0.8, h * 0.55, w * 0.15);
      mkInterval(() => {
        if (!_battle) return;
        b.lasers.push({ type: 'vertical', x: 40 + Math.random() * (w - 80), warnDuration: 300, warned: false, warnTime: 0, fireTime: 0, duration: 350 });
      }, 1100);
      mkInterval(() => {
        if (!_battle) return;
        b.lasers.push({ type: 'horizontal', y: 30 + Math.random() * (h - 60), warnDuration: 250, warned: false, warnTime: 0, fireTime: 0, duration: 300 });
      }, 1500);
      mkInterval(() => {
        if (!_battle) return;
        warnBone(30 + Math.random() * (w - 60), 300);
      }, 1600);
    }

    else if (idx === 6) {
      // sansturn6 · 混乱弹幕
      mkInterval(() => {
        if (!_battle) return;
        const rx = Math.random() * w;
        const ry = Math.random() < 0.5 ? -10 : h + 10;
        b.bullets.push({ x: rx, y: ry, vx: (Math.random() - 0.5) * 3, vy: ry < 0 ? 3 + Math.random() * 2 : -3 - Math.random() * 2, r: 4 + Math.random() * 2, color: ['#ff0066','#00ffcc','#ffcc00','#aa44ff','#44aaff'][Math.floor(Math.random()*5)] });
      }, 100);
      mkInterval(() => {
        if (!_battle) return;
        warnGb(30 + Math.random() * (w - 60), 30 + Math.random() * (h - 60), 380);
      }, 1800);
    }

    else if (idx === 7) {
      // sansturn7 · 旋转风车 (愤怒!)
      const laser = {
        type: 'rotating',
        cx: w / 2, cy: h / 2,
        beams: [
          { ang: 0 },
          { ang: Math.PI * 2 / 3 },
          { ang: Math.PI * 4 / 3 },
        ],
        beamColor: '#ff4444',
        warnDuration: 300,
        warned: false, warnTime: 0, fireTime: 0, duration: 9000,
        rotSpeed: 0.045,
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
        b.bullets.push({ shape: 'bone_h', x: fromLeft ? -w : w * 2, y, vx: fromLeft ? 4.5 : -4.5, vy: 0, w: w, h: 10, r: 4 });
      }, 1400);
      mkInterval(() => {
        if (!_battle) return;
        warnGb(30 + Math.random() * (w - 60), 30 + Math.random() * (h - 60), 300);
      }, 2000);
    }

    else if (idx === 8) {
      // sansturn8 · 橙魂穿弹
      addPlatform(w * 0.05, h * 0.55, w * 0.15);
      addPlatform(w * 0.3, h * 0.45, w * 0.15);
      addPlatform(w * 0.55, h * 0.55, w * 0.15);
      // 密集普通弹幕 (橙魂可穿)
      mkInterval(() => {
        if (!_battle) return;
        for (let i = 0; i < 3; i++) {
          const y = 20 + Math.random() * (h - 40);
          b.bullets.push({ shape: 'bone_h', x: -w, y, vx: 6, vy: 0, w: w * 0.4, h: 12, r: 4 });
        }
      }, 700);
      // 但骨头柱还是要躲 (穿不过)
      mkInterval(() => {
        if (!_battle) return;
        const cols = 3;
        const sp = w / (cols + 1);
        for (let c = 0; c < cols; c++) {
          warnBone(sp * (c + 1), 350);
        }
      }, 1200);
    }

    else if (idx === 9) {
      // sansturn9 · FINAL · Step_2 疯狂弹幕
      addPlatform(w * 0.08, h * 0.5, w * 0.12);
      addPlatform(w * 0.3, h * 0.4, w * 0.12);
      addPlatform(w * 0.52, h * 0.5, w * 0.12);
      addPlatform(w * 0.74, h * 0.4, w * 0.12);

      // 龙骨炮 Gaster Blaster 风暴 (bullet_gb)
      mkInterval(() => {
        if (!_battle) return;
        warnGb(20 + Math.random() * (w - 40), 20 + Math.random() * (h - 40), 300);
      }, 600);

      // 骨头预警线连续触发
      mkInterval(() => {
        if (!_battle) return;
        warnBone(w * 0.25, 250);
        warnBone(w * 0.5, 250);
        warnBone(w * 0.75, 250);
      }, 700);

      // 激光风暴
      mkInterval(() => {
        if (!_battle) return;
        if (Math.random() < 0.5) {
          b.lasers.push({ type: 'horizontal', y: 20 + Math.random() * (h - 40), warnDuration: 180, warned: false, warnTime: 0, fireTime: 0, duration: 300 });
        } else {
          b.lasers.push({ type: 'vertical', x: 20 + Math.random() * (w - 40), warnDuration: 180, warned: false, warnTime: 0, fireTime: 0, duration: 300 });
        }
      }, 1000);

      // 旋转风车
      if (!b.lasers.some(l => l.type === 'rotating')) {
        const laser = {
          type: 'rotating',
          cx: w / 2, cy: h / 2,
          beams: [{ ang: 0 }, { ang: Math.PI / 2 }, { ang: Math.PI }, { ang: Math.PI * 1.5 }],
          beamColor: '#ff2222',
          warnDuration: 200,
          warned: false, warnTime: 0, fireTime: 0, duration: 10000,
          rotSpeed: 0.06,
        };
        b.lasers.push(laser);
        const rot = setInterval(() => {
          if (!_battle) { clearInterval(rot); return; }
          laser.beams.forEach(beam => { beam.ang += laser.rotSpeed; });
        }, 16);
        _enemyTimers.push(rot);
      }
    }
  }

  function endEnemyTurn() {
    const b = _battle;
    if (!b || b.ended) return;
    b._running = false;
    clearEnemyTimers();
    b.modal.querySelector('#ub-bullet-area').style.display = 'none';
    b.bullets = []; b.lasers = []; b.platforms = []; b.warnings = []; b.dust = [];

    // KR 随时间慢慢减退 (每回合 -1)
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
          <div style="font-size:11px;color:#888;margin-bottom:8px;">剩余 HP ${b.player.hp}/${b.player.maxHp} · KR ${b.player.karma}</div>
          <div style="font-size:11px;color:#ff4444;margin-bottom:16px;">KILLS ${b.sanskills} · sansoverturn 已突破</div>
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
          <div style="font-size:11px;color:#888;margin-bottom:16px;">KR 饱和 · 德衫在某处冷笑。</div>
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
