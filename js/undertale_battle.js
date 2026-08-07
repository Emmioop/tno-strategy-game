// ===== Undertale Sans Genocide 风格 BOSS 战引擎 =====
// v46 Dusttale 弹幕素材完整实现
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
    modal.style.cssText = 'position:fixed;inset:0;background:#000;z-index:100060;display:flex;align-items:center;justify-content:center;font-family:"Courier New",monospace;color:#fff;overflow:auto;';
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
      <div id="ub-root" style="
        display:flex;flex-direction:column;
        width:100%;height:100%;
        background:#000;color:#fff;
        position:relative;overflow:hidden;box-sizing:border-box;
        font-family:'Courier New',monospace;">

        <div style="flex-shrink:0;display:flex;align-items:center;justify-content:space-between;padding:8px 14px 0 14px;gap:8px;">
          <div style="display:flex;gap:6px;align-items:center;">
            <div id="ub-close-x" style="color:#555;cursor:pointer;font-size:18px;width:28px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:4px;border:1px solid #333;">✕</div>
            <div style="display:flex;flex-direction:column;line-height:1.1;">
              <div style="font-size:13px;color:${BOSS.color};font-weight:bold;letter-spacing:3px;">${BOSS.name}</div>
              <div style="font-size:9px;color:#666;">KILLS ${b.sanskills} · sanshp ${b.sanshp}/${BOSS.sanshp}</div>
            </div>
          </div>
          <div style="font-size:10px;color:#666;letter-spacing:2px;">LV ${b.player.lv} · 回合 ${b.turn}</div>
        </div>

        <div style="flex-shrink:0;display:flex;align-items:flex-end;justify-content:center;padding:6px 0 2px 0;position:relative;min-height:130px;">
          <div id="ub-sans-sprite" style="font-size:72px;color:${BOSS.color};text-shadow:0 0 24px ${BOSS.color},0 0 48px #4488ff60;transition:filter 0.15s,text-shadow 0.15s;line-height:1;">☠</div>
          <div id="ub-sans-effect" style="position:absolute;inset:0;pointer-events:none;"></div>
          <div id="ub-battle-hint" style="display:none;position:absolute;top:4px;left:50%;transform:translateX(-50%);font-size:11px;color:#ffcc00;letter-spacing:2px;text-shadow:0 0 6px #ffcc00;pointer-events:none;">TAP / SPACE</div>
        </div>

        <div id="ub-bullet-area" style="
          background:#000;border:2px solid #fff;
          flex:1 1 auto;min-height:180px;
          margin:4px 14px 6px 14px;position:relative;overflow:hidden;
          touch-action:none;display:flex;flex-direction:column;">
          <canvas id="ub-canvas" style="position:absolute;inset:0;width:100%;height:calc(100% - 62px);"></canvas>
          <div id="ub-soul-indicator" style="position:absolute;top:4px;right:6px;font-size:9px;color:#555;pointer-events:none;"></div>
          <div id="ub-soul-mode" style="position:absolute;top:14px;right:6px;font-size:8px;color:#888;pointer-events:none;letter-spacing:1px;"></div>
          <div style="flex:1 1 auto;position:relative;"></div>
          <div style="border-top:1px solid #ffffff30;padding:6px 10px;min-height:48px;background:#000000c0;position:relative;z-index:3;">
            <div id="ub-dialog" style="font-size:12px;line-height:1.5;color:#ddd;white-space:pre-wrap;"></div>
          </div>
          <div id="ub-vcontrols" style="position:absolute;inset:0;pointer-events:none;z-index:5;">
            <canvas id="ub-dpad-circle" style="position:absolute;left:8px;bottom:8px;width:148px;height:148px;pointer-events:auto;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;touch-action:none;"></canvas>
            <canvas id="ub-buttons-canvas" style="position:absolute;right:8px;bottom:8px;width:180px;height:130px;pointer-events:auto;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;touch-action:none;"></canvas>
          </div>
        </div>

        <div style="flex-shrink:0;padding:0 14px 4px 14px;display:flex;align-items:center;gap:10px;">
          <div style="font-size:12px;letter-spacing:1px;color:#fff;min-width:72px;font-weight:bold;">${b.player.name || 'CHARA'} LV ${b.player.lv || 19}</div>
          <div style="flex:1 1 auto;height:14px;background:#222;border:1px solid #fff;border-radius:2px;overflow:hidden;position:relative;min-width:100px;">
            <div style="position:absolute;inset:0;display:flex;">
              <div id="ub-player-hp-yellow" style="background:linear-gradient(90deg,#ffee44,#ffcc00);height:100%;transition:width 0.2s;flex-shrink:0;"></div>
              <div id="ub-player-hp-red" style="background:linear-gradient(90deg,#ff4444,#ff2222);height:100%;transition:width 0.2s;flex-shrink:0;"></div>
            </div>
          </div>
          <div id="ub-hp-text" style="font-size:12px;color:#fff;white-space:nowrap;">${b.player.hp}/${b.player.maxHp}</div>
          <div style="font-size:12px;color:#cc44ff;letter-spacing:1px;white-space:nowrap;">KR <span id="ub-kr-text" style="color:#ff88ff;">${b.player.karma}</span>/${b.player.karmaMax}</div>
        </div>

        <div id="ub-menu-bar" style="flex-shrink:0;display:grid;grid-template-columns:repeat(4,1fr);gap:6px;padding:4px 14px 8px 14px;background:#000;">
          <button id="ub-fight" style="background:#000;border:2px solid #ffee44;color:#ffee44;padding:10px 6px;font-family:inherit;font-size:14px;cursor:pointer;letter-spacing:1px;min-height:46px;display:flex;align-items:center;justify-content:center;gap:6px;touch-action:manipulation;"
            onmouseover="this.style.background='#ffee4420'" onmouseout="this.style.background='#000'">❤ FIGHT</button>
          <button id="ub-act" style="background:#000;border:2px solid #ff8833;color:#ffbb66;padding:10px 6px;font-family:inherit;font-size:14px;cursor:pointer;letter-spacing:1px;min-height:46px;display:flex;align-items:center;justify-content:center;gap:6px;touch-action:manipulation;"
            onmouseover="this.style.background='#ff883320'" onmouseout="this.style.background='#000'">📣 ACT</button>
          <button id="ub-item" style="background:#000;border:2px solid #ff8833;color:#ffbb66;padding:10px 6px;font-family:inherit;font-size:14px;cursor:pointer;letter-spacing:1px;min-height:46px;display:flex;align-items:center;justify-content:center;gap:6px;touch-action:manipulation;"
            onmouseover="this.style.background='#ff883320'" onmouseout="this.style.background='#000'">💊 ITEM</button>
          <button id="ub-mercy" style="background:#000;border:2px solid #ff8833;color:#ffbb66;padding:10px 6px;font-family:inherit;font-size:14px;cursor:pointer;letter-spacing:1px;min-height:46px;display:flex;align-items:center;justify-content:center;gap:6px;touch-action:manipulation;"
            onmouseover="this.style.background='#ff883320'" onmouseout="this.style.background='#000'">💘 MERCY</button>
        </div>
      </div>
    `;
  }

  function updateBattleUI() {
    if (!_battle) return;
    const b = _battle;
    const yellowEl = b.modal.querySelector('#ub-player-hp-yellow');
    const redEl    = b.modal.querySelector('#ub-player-hp-red');
    const hpTextEl = b.modal.querySelector('#ub-hp-text');
    const krTextEl = b.modal.querySelector('#ub-kr-text');
    if (yellowEl) yellowEl.style.width = (Math.max(0, b.player.hp) / b.player.maxHp * 100) + '%';
    if (redEl)    redEl.style.width    = (b.player.karma > 0 ? Math.min(100, b.player.karma / b.player.maxHp * 100) : 0) + '%';
    if (hpTextEl) hpTextEl.textContent = `${Math.max(0, b.player.hp)}/${b.player.maxHp}`;
    if (krTextEl) krTextEl.textContent = `${b.player.karma}/${b.player.karmaMax}`;

    const sprite = b.modal.querySelector('#ub-sans-sprite');
    if (!sprite) return;
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
    const bar = _battle.modal.querySelector('#ub-menu-bar');
    if (bar) bar.style.display = enabled ? 'grid' : 'none';
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
    area.style.display = 'flex';

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
    let vc = null;
    setTimeout(() => { vc = initVirtualControls(b); }, 0);

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
          if (w.type === 'bone_stab') {
            b.bullets.push({
              shape: w.shape || 'bone_v',
              x: w.x, y: w.bottom ? -30 : b.canvasH + 30,
              vx: w.vx || 0,
              vy: w.bottom ? (w.vy || 3.5) : -(w.vy || 3.5),
              w: w.bw || 14, h: w.bh || 24,
              r: 5,
              piercing: false,
              color: w.color || 'white',
            });
          } else if (w.type === 'bone_h_stab') {
            b.bullets.push({
              shape: w.shape || 'bone_h',
              x: w.left ? -30 : b.canvasW + 30, y: w.y,
              vx: w.left ? (w.vx || 4) : -(w.vx || 4),
              vy: 0,
              w: w.w || 60, h: w.h || 10,
              r: 4,
              piercing: false,
              color: w.color || 'white',
            });
          } else if (w.type === 'bullet_gb') {
            b.bullets.push({
              shape: 'circle',
              x: w.x, y: w.y,
              vx: w.vx || 0, vy: w.vy || 4,
              r: 8, color: w.ap ? '#9933ff' : '#66aaff',
              piercing: true,
              gb: true,
              ap: !!w.ap,
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

      // === 尘埃粒子 (Dusttale 每个阶段都有 dustcloud + pixeldust) ===
      if (b.dust.length < (b.step2 ? 80 : 25) && Math.random() < (b.step2 ? 0.15 : 0.06)) {
        b.dust.push({
          x: Math.random() * b.canvasW,
          y: b.canvasH + 5,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -(0.5 + Math.random() * 1.5),
          size: 1 + Math.random() * 3,
          alpha: 0.25 + Math.random() * 0.4,
          rot: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 0.15,
        });
      }
      for (const d of b.dust) {
        d.x += d.vx; d.y += d.vy;
      }
      b.dust = b.dust.filter(d => d.y > -10 && d.y < b.canvasH + 10 && d.x > -20 && d.x < b.canvasW + 20);

      if (b.hitCooldown > 0) b.hitCooldown -= tickMs;
      if (b.invulnTimer > 0) b.invulnTimer -= tickMs;

      // === 碰撞检测 ===
      for (const bu of b.bullets) {
        // 橙魂可穿普通弹幕（但穿不过骨头/环形/弯形/U形/穿甲弹）
        const isBoneShape = bu.shape && (
          bu.shape === 'bone_v' || bu.shape === 'bone_h' ||
          bu.shape === 'bone_c' || bu.shape === 'bone_o' ||
          bu.shape === 'bone_u' || bu.shape === 'bone_skate' ||
          bu.shape === 'bone_super'
        );
        if (b.soulColor === 'orange' && !bu.piercing && !isBoneShape) continue;

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
      // Dusttale 暗紫色背景
      const bgTint = b.step2 ? 'rgba(80, 0, 20, 0.35)' :
                     b.isAngry ? 'rgba(40, 0, 50, 0.25)' :
                     'rgba(10, 0, 20, 0.15)';
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = bgTint;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 灵魂颜色背景光晕
      if (b.soulColor === 'blue') {
        ctx.fillStyle = 'rgba(60, 100, 200, 0.12)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (b.soulColor === 'orange') {
        ctx.fillStyle = 'rgba(255, 140, 40, 0.10)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (b.soulColor === 'pink') {
        ctx.fillStyle = 'rgba(255, 100, 180, 0.10)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Step_2 血红脉动 + 尘埃
      if (b.step2) {
        const intensity = 0.06 + Math.sin(now / 120) * 0.04;
        ctx.fillStyle = `rgba(200, 0, 0, ${intensity})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (Math.random() < 0.08 && b.dust.length < 80) {
          b.dust.push({
            x: Math.random() * b.canvasW,
            y: Math.random() * b.canvasH,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: 1 + Math.random() * 4,
            alpha: 0.4 + Math.random() * 0.5,
            rot: Math.random() * Math.PI * 2,
            vr: (Math.random() - 0.5) * 0.2,
          });
        }
      }

      // Dusttale 常驻尘埃粒子 (dustcloud / pixeldust)
      for (const d of b.dust) {
        d.rot = (d.rot || 0) + (d.vr || 0);
        ctx.save();
        ctx.globalAlpha = d.alpha * (b.step2 ? 1 : 0.55);
        ctx.translate(d.x, d.y);
        ctx.rotate(d.rot || 0);
        ctx.fillStyle = `rgba(180, 150, 130, 1)`;
        ctx.fillRect(-d.size, -d.size, d.size * 2, d.size * 2);
        ctx.fillStyle = `rgba(120, 100, 80, 0.6)`;
        ctx.fillRect(-d.size * 0.5, -d.size * 0.5, d.size, d.size);
        ctx.restore();
      }

      // 平台 (spr_superbone 超级骨头平台)
      b.platforms.forEach(p => {
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(p.x, p.y + 5, p.w, 3);
        ctx.fillStyle = p.color || '#e8e0d0';
        ctx.fillRect(p.x, p.y, p.w, 4);
        ctx.strokeStyle = p.color ? 'rgba(255,255,255,0.3)' : '#fff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y + 2);
        ctx.lineTo(p.x + p.w, p.y + 2);
        ctx.stroke();
        if (p.bounce) {
          ctx.fillStyle = '#ffcc44';
          ctx.beginPath(); ctx.arc(p.x + p.w/2, p.y, 3, 0, Math.PI*2); ctx.fill();
        }
      });

      // 预警线 (bone_stab_alert) — Dusttale 红色脉动闪烁
      for (const w of b.warnings) {
        const pulse = 0.5 + Math.sin(now / 40) * 0.4;
        ctx.save();
        ctx.strokeStyle = w.color || `rgba(255, 40, 40, ${pulse})`;
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 4]);
        ctx.lineDashOffset = -now / 30;
        ctx.beginPath();
        if (w.type === 'bone_stab') {
          ctx.moveTo(w.x, 0);
          ctx.lineTo(w.x, b.canvasH);
        } else if (w.type === 'bone_h_stab') {
          ctx.moveTo(0, w.y);
          ctx.lineTo(b.canvasW, w.y);
        } else if (w.type === 'bullet_gb') {
          ctx.strokeRect(w.x - 22, w.y - 22, 44, 44);
          ctx.setLineDash([]);
          ctx.beginPath();
          ctx.moveTo(w.x - 16, w.y); ctx.lineTo(w.x + 16, w.y);
          ctx.moveTo(w.x, w.y - 16); ctx.lineTo(w.x, w.y + 16);
          ctx.stroke();
        } else if (w.type === 'laser_v') {
          ctx.moveTo(w.x, 0);
          ctx.lineTo(w.x, b.canvasH);
        } else if (w.type === 'laser_h') {
          ctx.moveTo(0, w.y);
          ctx.lineTo(b.canvasW, w.y);
        }
        ctx.stroke();
        ctx.restore();
      }

      // 激光 (spr_battlelaser / spr_laser1 / spr_laser2)
      for (const laser of b.lasers) {
        const warn = !laser.warned;
        const col = laser.color || (warn ? '#ff2222' : '#5599ff');
        const coreCol = warn ? '#ff8888' : '#cceeff';
        if (laser.type === 'rotating') {
          for (const beam of laser.beams) {
            const ang = beam.ang;
            const ex = laser.cx + Math.cos(ang) * b.canvasW * 2;
            const ey = laser.cy + Math.sin(ang) * b.canvasW * 2;
            if (!warn) {
              ctx.strokeStyle = col;
              ctx.lineWidth = 10;
              ctx.globalAlpha = 0.25;
              ctx.beginPath(); ctx.moveTo(laser.cx, laser.cy); ctx.lineTo(ex, ey); ctx.stroke();
            }
            ctx.globalAlpha = warn ? 0.5 : 1;
            ctx.strokeStyle = warn ? '#ff2222' : col;
            ctx.lineWidth = warn ? 2 : 5;
            ctx.beginPath(); ctx.moveTo(laser.cx, laser.cy); ctx.lineTo(ex, ey); ctx.stroke();
            if (!warn) {
              ctx.strokeStyle = coreCol;
              ctx.lineWidth = 1.5;
              ctx.beginPath(); ctx.moveTo(laser.cx, laser.cy); ctx.lineTo(ex, ey); ctx.stroke();
            }
          }
          ctx.globalAlpha = 1;
          ctx.fillStyle = '#88ccff';
          ctx.beginPath(); ctx.arc(laser.cx, laser.cy, 5, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath(); ctx.arc(laser.cx, laser.cy, 2, 0, Math.PI*2); ctx.fill();
        } else if (laser.type === 'horizontal') {
          if (!warn) {
            ctx.fillStyle = col;
            ctx.globalAlpha = 0.2;
            ctx.fillRect(0, laser.y - 12, b.canvasW, 24);
          }
          ctx.globalAlpha = warn ? 0.6 + Math.sin(now / 35) * 0.3 : 1;
          ctx.strokeStyle = warn ? '#ff2222' : col;
          ctx.lineWidth = warn ? 2 : 6;
          ctx.beginPath(); ctx.moveTo(0, laser.y); ctx.lineTo(b.canvasW, laser.y); ctx.stroke();
          if (!warn) {
            ctx.strokeStyle = coreCol;
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(0, laser.y); ctx.lineTo(b.canvasW, laser.y); ctx.stroke();
          }
          ctx.globalAlpha = 1;
        } else if (laser.type === 'vertical') {
          if (!warn) {
            ctx.fillStyle = col;
            ctx.globalAlpha = 0.2;
            ctx.fillRect(laser.x - 12, 0, 24, b.canvasH);
          }
          ctx.globalAlpha = warn ? 0.6 + Math.sin(now / 35) * 0.3 : 1;
          ctx.strokeStyle = warn ? '#ff2222' : col;
          ctx.lineWidth = warn ? 2 : 6;
          ctx.beginPath(); ctx.moveTo(laser.x, 0); ctx.lineTo(laser.x, b.canvasH); ctx.stroke();
          if (!warn) {
            ctx.strokeStyle = coreCol;
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(laser.x, 0); ctx.lineTo(laser.x, b.canvasH); ctx.stroke();
          }
          ctx.globalAlpha = 1;
        }
      }

      // 子弹 / 骨头 (Dusttale 全部骨头形状)
      for (const bu of b.bullets) {
        const boneColor = bu.color === 'lightblue' ? '#aaddff' :
                          bu.color === 'orange'   ? '#ffaa44' :
                          bu.color === 'purple'  ? '#cc44ff' :
                          bu.color === 'red'     ? '#ff4444' :
                                                   '#ffffff';
        const boneOutline = bu.color === 'purple' ? '#660099' : 'rgba(0,0,0,0.6)';

        if (bu.shape === 'bone_h' || bu.shape === 'bone_v' || !bu.shape) {
          const bw = bu.w || (bu.shape === 'bone_v' ? 14 : 14);
          const bh = bu.h || (bu.shape === 'bone_v' ? 20 : 14);
          ctx.fillStyle = boneColor;
          ctx.strokeStyle = boneOutline;
          ctx.lineWidth = 1;
          if (bu.shape === 'bone_h') {
            ctx.fillRect(bu.x - bw/2, bu.y - bh/2, bw, bh);
            ctx.strokeRect(bu.x - bw/2, bu.y - bh/2, bw, bh);
            ctx.beginPath();
            ctx.arc(bu.x - bw/2, bu.y - bh/2, bh/2, 0, Math.PI*2);
            ctx.arc(bu.x - bw/2, bu.y + bh/2, bh/2, 0, Math.PI*2);
            ctx.arc(bu.x + bw/2, bu.y - bh/2, bh/2, 0, Math.PI*2);
            ctx.arc(bu.x + bw/2, bu.y + bh/2, bh/2, 0, Math.PI*2);
            ctx.fill();
            ctx.stroke();
          } else {
            ctx.fillRect(bu.x - bw/2, bu.y - bh/2, bw, bh);
            ctx.strokeRect(bu.x - bw/2, bu.y - bh/2, bw, bh);
            ctx.beginPath();
            ctx.arc(bu.x - bw/2, bu.y - bh/2, bw/2, 0, Math.PI*2);
            ctx.arc(bu.x + bw/2, bu.y - bh/2, bw/2, 0, Math.PI*2);
            ctx.arc(bu.x - bw/2, bu.y + bh/2, bw/2, 0, Math.PI*2);
            ctx.arc(bu.x + bw/2, bu.y + bh/2, bw/2, 0, Math.PI*2);
            ctx.fill();
            ctx.stroke();
          }
        } else if (bu.shape === 'bone_c') {
          const rad = bu.w || 18;
          const thick = bu.h || 6;
          ctx.strokeStyle = boneColor;
          ctx.lineWidth = thick;
          ctx.beginPath();
          ctx.arc(bu.x, bu.y, rad, bu.startA || 0, bu.endA || Math.PI, bu.ccw || false);
          ctx.stroke();
          ctx.strokeStyle = boneOutline;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(bu.x, bu.y, rad - thick/2, bu.startA || 0, bu.endA || Math.PI, bu.ccw || false);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(bu.x, bu.y, rad + thick/2, bu.startA || 0, bu.endA || Math.PI, bu.ccw || false);
          ctx.stroke();
        } else if (bu.shape === 'bone_o') {
          const rad = bu.w || 16;
          const thick = bu.h || 5;
          ctx.strokeStyle = boneColor;
          ctx.lineWidth = thick;
          ctx.beginPath();
          ctx.arc(bu.x, bu.y, rad, 0, Math.PI*2);
          ctx.stroke();
          ctx.strokeStyle = boneOutline;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(bu.x, bu.y, rad - thick/2, 0, Math.PI*2); ctx.stroke();
          ctx.beginPath(); ctx.arc(bu.x, bu.y, rad + thick/2, 0, Math.PI*2); ctx.stroke();
        } else if (bu.shape === 'bone_u') {
          const w = bu.w || 30;
          const h = bu.h || 20;
          const thick = bu.bw || 8;
          ctx.strokeStyle = boneColor;
          ctx.lineWidth = thick;
          ctx.beginPath();
          ctx.moveTo(bu.x - w/2, bu.y - h/2);
          ctx.lineTo(bu.x - w/2, bu.y + h/4);
          ctx.quadraticCurveTo(bu.x, bu.y + h/2 + thick, bu.x + w/2, bu.y + h/4);
          ctx.lineTo(bu.x + w/2, bu.y - h/2);
          ctx.stroke();
        } else if (bu.shape === 'bone_skate') {
          const w = bu.w || 32;
          const h = bu.h || 5;
          if (bu.vx !== 0) {
            ctx.fillStyle = boneColor + '40';
            ctx.fillRect(bu.x - bu.vx * 4 - w/2, bu.y - h/2, bu.vx * 4, h);
          }
          ctx.fillStyle = boneColor;
          ctx.strokeStyle = boneOutline;
          ctx.lineWidth = 0.5;
          ctx.fillRect(bu.x - w/2, bu.y - h/2, w, h);
          ctx.strokeRect(bu.x - w/2, bu.y - h/2, w, h);
        } else if (bu.shape === 'bone_super') {
          const w = bu.w || 60;
          const h = bu.h || 18;
          ctx.fillStyle = boneColor;
          ctx.strokeStyle = boneOutline;
          ctx.lineWidth = 1.5;
          ctx.fillRect(bu.x - w/2, bu.y - h/2, w, h);
          ctx.strokeRect(bu.x - w/2, bu.y - h/2, w, h);
          ctx.beginPath();
          ctx.arc(bu.x - w/2, bu.y - h/2, h/2, 0, Math.PI*2);
          ctx.arc(bu.x + w/2, bu.y - h/2, h/2, 0, Math.PI*2);
          ctx.arc(bu.x - w/2, bu.y + h/2, h/2, 0, Math.PI*2);
          ctx.arc(bu.x + w/2, bu.y + h/2, h/2, 0, Math.PI*2);
          ctx.fill();
          ctx.stroke();
          ctx.strokeStyle = boneOutline;
          ctx.lineWidth = 0.75;
          for (let i = 1; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(bu.x - w/2 + i * w/3, bu.y - h/2 + 2);
            ctx.lineTo(bu.x - w/2 + i * w/3, bu.y + h/2 - 2);
            ctx.stroke();
          }
        } else if (bu.gb) {
          const pulse = 1 + Math.sin(now / 70) * 0.25;
          const isAP = bu.ap;
          const outerCol = isAP ? '#9933ff' : (b.isAngry || b.step2 ? '#dd4466' : '#66aaff');
          const innerCol = isAP ? '#eebbff' : '#ffffff';
          const r = (bu.r || 8) * pulse;
          ctx.fillStyle = outerCol;
          ctx.globalAlpha = 0.35;
          ctx.beginPath();
          ctx.arc(bu.x, bu.y, r * 2.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 0.7;
          ctx.beginPath();
          ctx.arc(bu.x, bu.y, r * 1.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
          ctx.fillStyle = outerCol;
          ctx.beginPath();
          ctx.arc(bu.x, bu.y, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = innerCol;
          ctx.beginPath();
          ctx.arc(bu.x, bu.y, r * 0.5, 0, Math.PI * 2);
          ctx.fill();
          if (bu.eyeDots !== false) {
            ctx.fillStyle = '#cc44ff';
            ctx.beginPath(); ctx.arc(bu.x - 2, bu.y - 1, 1, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#ff3333';
            ctx.beginPath(); ctx.arc(bu.x + 2, bu.y - 1, 1, 0, Math.PI*2); ctx.fill();
          }
          if (bu.vx || bu.vy) {
            ctx.globalAlpha = 0.4;
            ctx.fillStyle = outerCol;
            ctx.beginPath();
            ctx.arc(bu.x - bu.vx * 2, bu.y - bu.vy * 2, r * 0.8, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 0.2;
            ctx.beginPath();
            ctx.arc(bu.x - bu.vx * 4, bu.y - bu.vy * 4, r * 0.6, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
          }
        } else if (bu.shape === 'spear') {
          ctx.save();
          ctx.translate(bu.x, bu.y);
          ctx.rotate(bu.angle || 0);
          ctx.fillStyle = '#e0d080';
          ctx.beginPath();
          ctx.moveTo(0, -8);
          ctx.lineTo(3, 0);
          ctx.lineTo(0, 4);
          ctx.lineTo(-3, 0);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#807020';
          ctx.lineWidth = 0.5;
          ctx.stroke();
          ctx.restore();
        } else {
          const pulse = 1 + Math.sin(now / 100 + bu.x) * 0.15;
          ctx.fillStyle = bu.color || '#ffff00';
          ctx.globalAlpha = 0.4;
          ctx.beginPath(); ctx.arc(bu.x, bu.y, (bu.r || 4) * 1.8 * pulse, 0, Math.PI*2); ctx.fill();
          ctx.globalAlpha = 1;
          ctx.beginPath(); ctx.arc(bu.x, bu.y, (bu.r || 4) * pulse, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath(); ctx.arc(bu.x, bu.y, (bu.r || 4) * pulse * 0.5, 0, Math.PI*2); ctx.fill();
        }
      }

      // 灵魂 (Dusttale 异色瞳/受伤闪烁)
      const flash = (b.hitCooldown > 0 && b.hitCooldown % 6 < 3);
      let soulColor = b.soulColor === 'blue' ? '#4488ff' :
                      b.soulColor === 'orange' ? '#ff8822' :
                      b.soulColor === 'pink' ? '#ff66aa' :
                      b.soulColor === 'purple' ? '#aa44ff' : '#ff2222';
      if (flash) soulColor = '#ffffff';
      if (!flash) {
        ctx.fillStyle = soulColor;
        ctx.globalAlpha = 0.3;
        drawHeart(ctx, b.soul.x, b.soul.y, 10);
        ctx.globalAlpha = 1;
      }
      ctx.fillStyle = soulColor;
      drawHeart(ctx, b.soul.x, b.soul.y, 6);
      if (b.soulColor === 'blue') {
        ctx.fillStyle = '#ff66ff';
        ctx.beginPath(); ctx.arc(b.soul.x, b.soul.y, 2, 0, Math.PI*2); ctx.fill();
      } else if (b.soulColor === 'purple') {
        ctx.fillStyle = '#ffffff';
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

    function addPlatform(x, y, ww, opts) {
      b.platforms.push({ x, y, w: ww, color: opts?.color, bounce: opts?.bounce });
    }
    function warnBone(x, duration=300, opts={}) {
      b.warnings.push({
        type: 'bone_stab', x, bottom: opts.bottom !== false,
        duration, t: 0, fired: false,
        shape: opts.shape || 'bone_v',
        vy: opts.vy || 3.5, vx: opts.vx || 0,
        bw: opts.bw || 14, bh: opts.bh || 22,
        color: opts.color,
      });
    }
    function warnBoneH(y, duration=300, opts={}) {
      b.warnings.push({
        type: 'bone_h_stab', y, left: opts.left !== false,
        duration, t: 0, fired: false,
        shape: opts.shape || 'bone_h',
        vx: opts.vx || 4,
        w: opts.w || 60, h: opts.h || 10,
        color: opts.color,
      });
    }
    function warnGb(x, y, duration=350, opts={}) {
      b.warnings.push({
        type: 'bullet_gb', x, y, duration, t: 0, fired: false,
        vx: opts.vx || 0, vy: opts.vy || 4,
        ap: opts.ap,
      });
    }
    function spawnDust(count=5) {
      for (let i = 0; i < count; i++) {
        b.dust.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          size: 1 + Math.random() * 3,
          alpha: 0.3 + Math.random() * 0.5,
          rot: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 0.15,
        });
      }
    }

    const phase = BATTLE_PHASES[idx];
    b.soulColor = phase.soul;
    b.isAngry = !!phase.angry;
    b.modal.querySelector('#ub-soul-indicator').textContent = phase.name + (b.isAngry ? ' 🔥' : '');

    spawnDust(3);

    if (idx === 0) {
      addPlatform(w * 0.15, h * 0.65, w * 0.2, { color: '#e8e0d0' });
      addPlatform(w * 0.65, h * 0.5, w * 0.18, { color: '#e8e0d0' });
      mkInterval(() => {
        if (!_battle) return;
        b.bullets.push({ shape: 'bone_skate', x: Math.random() * w, y: -10, vx: (Math.random()-0.5)*2, vy: 3, w: 30, h: 5, r: 4, color: 'white' });
      }, 500);
      mkInterval(() => {
        if (!_battle) return;
        warnBone(w * (0.2 + Math.random() * 0.6), 350, { bw: 14, bh: 24 });
      }, 1200);
    }

    else if (idx === 1) {
      addPlatform(w * 0.2, h * 0.7, w * 0.15);
      addPlatform(w * 0.5, h * 0.55, w * 0.15);
      addPlatform(w * 0.78, h * 0.4, w * 0.15);
      mkInterval(() => {
        if (!_battle) return;
        const cols = 3;
        const sp = w / (cols + 1);
        for (let c = 0; c < cols; c++) {
          warnBone(sp * (c + 1), 380, { bw: 16, bh: 26 });
        }
      }, 1400);
      mkInterval(() => {
        if (!_battle) return;
        const fromLeft = Math.random() < 0.5;
        b.bullets.push({
          shape: 'bone_skate',
          x: fromLeft ? -30 : w + 30,
          y: 20 + Math.random() * (h - 40),
          vx: fromLeft ? 5.5 : -5.5, vy: 0,
          w: 40, h: 5, r: 4, color: 'white',
        });
      }, 700);
    }

    else if (idx === 2) {
      mkInterval(() => {
        if (!_battle) return;
        warnGb(30 + Math.random() * (w - 60), 30 + Math.random() * (h - 60), 400);
      }, 800);
      mkInterval(() => {
        if (!_battle) return;
        const cx = w/2, cy = h/2;
        const count = 6;
        for (let i = 0; i < count; i++) {
          const ang = (i / count) * Math.PI * 2 + performance.now() / 1000;
          b.bullets.push({
            shape: 'circle',
            x: cx + Math.cos(ang) * 25,
            y: cy + Math.sin(ang) * 25,
            vx: Math.cos(ang) * 3,
            vy: Math.sin(ang) * 3,
            r: 7, gb: true, piercing: true,
            color: '#66aaff',
          });
        }
      }, 2500);
      mkInterval(() => {
        if (!_battle) return;
        b.lasers.push({ type: 'horizontal', y: 30 + Math.random() * (h - 60), warnDuration: 300, warned: false, warnTime: 0, fireTime: 0, duration: 350, color: '#5599ff' });
      }, 1800);
    }

    else if (idx === 3) {
      addPlatform(10, h * 0.8, w - 20);
      mkInterval(() => {
        if (!_battle) return;
        const cx = Math.random() * w;
        const cy = h + 20;
        const rot = performance.now() / 500;
        for (let i = 0; i < 3; i++) {
          const ang = rot + (i - 1) * 0.3;
          b.bullets.push({
            shape: 'bone_c',
            x: cx + Math.cos(ang) * 30,
            y: cy - 30 + Math.sin(ang) * 15,
            vx: Math.cos(ang) * 2.5,
            vy: -3.5,
            r: 10, w: 22, h: 6,
            startA: 0, endA: Math.PI * 1.4,
            color: 'white',
          });
        }
      }, 900);
      mkInterval(() => {
        if (!_battle) return;
        b.bullets.push({
          shape: 'bone_o',
          x: Math.random() * w,
          y: -20,
          vx: 0, vy: 2.5,
          r: 12, w: 18, h: 5,
          color: 'white',
        });
      }, 1200);
    }

    else if (idx === 4) {
      let squeeze = 0;
      mkInterval(() => {
        if (!_battle) return;
        squeeze += 1.8;
        if (squeeze > 60) squeeze = 60;
        for (let x = 10; x < w; x += 28) {
          b.bullets.push({ shape: 'bone_super', x, y: -25 + squeeze, vx: 0, vy: 0, w: 24, h: 14, r: 5, color: 'white' });
          b.bullets.push({ shape: 'bone_super', x, y: h + 25 - squeeze, vx: 0, vy: 0, w: 24, h: 14, r: 5, color: 'white' });
        }
      }, 200);
      mkInterval(() => {
        if (!_battle) return;
        const fromLeft = Math.random() < 0.5;
        b.bullets.push({
          shape: 'bone_u',
          x: fromLeft ? -40 : w + 40,
          y: 30 + Math.random() * (h - 60),
          vx: fromLeft ? 5 : -5, vy: 0,
          r: 8, w: 35, h: 22, bw: 8,
          color: 'white',
        });
      }, 1500);
    }

    else if (idx === 5) {
      addPlatform(w * 0.1, h * 0.55, w * 0.18, { color: '#88ccff' });
      addPlatform(w * 0.4, h * 0.4, w * 0.15, { color: '#88ccff' });
      addPlatform(w * 0.65, h * 0.55, w * 0.15, { color: '#88ccff' });
      addPlatform(w * 0.85, h * 0.35, w * 0.12, { color: '#88ccff' });
      mkInterval(() => {
        if (!_battle) return;
        b.lasers.push({ type: 'vertical', x: 40 + Math.random() * (w - 80), warnDuration: 320, warned: false, warnTime: 0, fireTime: 0, duration: 350, color: '#6688ff' });
      }, 1100);
      mkInterval(() => {
        if (!_battle) return;
        b.lasers.push({ type: 'horizontal', y: 30 + Math.random() * (h - 60), warnDuration: 320, warned: false, warnTime: 0, fireTime: 0, duration: 350, color: '#6688ff' });
      }, 1600);
      mkInterval(() => {
        if (!_battle) return;
        warnBone(30 + Math.random() * (w - 60), 320, { bw: 16, bh: 28 });
      }, 1400);
    }

    else if (idx === 6) {
      mkInterval(() => {
        if (!_battle) return;
        const rx = Math.random() * w;
        const ry = Math.random() < 0.5 ? -10 : h + 10;
        const colors = ['#ff4466','#00ffcc','#ffcc00','#cc66ff','#44aaff','#ff8844'];
        b.bullets.push({
          x: rx, y: ry,
          vx: (Math.random() - 0.5) * 4,
          vy: ry < 0 ? 3 + Math.random() * 3 : -3 - Math.random() * 3,
          r: 4 + Math.random() * 3,
          color: colors[Math.floor(Math.random()*colors.length)],
        });
      }, 80);
      mkInterval(() => {
        if (!_battle) return;
        warnGb(30 + Math.random() * (w - 60), 30 + Math.random() * (h - 60), 400, { ap: true, vy: (Math.random()-0.5)*2 });
      }, 1500);
      mkInterval(() => {
        if (!_battle) return;
        const tx = _battle.soul.x, ty = _battle.soul.y;
        const ang = Math.atan2(ty - (-20), tx - (Math.random()*w));
        b.bullets.push({
          shape: 'bone_h',
          x: Math.random() * w, y: -20,
          vx: Math.cos(ang) * 4, vy: Math.sin(ang) * 4,
          w: 36, h: 10, r: 5, color: 'purple',
        });
      }, 1800);
    }

    else if (idx === 7) {
      addPlatform(w * 0.08, h * 0.7, w * 0.15);
      addPlatform(w * 0.77, h * 0.7, w * 0.15);
      const laser = {
        type: 'rotating',
        cx: w / 2, cy: h / 2,
        beams: [
          { ang: 0 },
          { ang: Math.PI * 2 / 3 },
          { ang: Math.PI * 4 / 3 },
        ],
        color: '#ff3344',
        warnDuration: 300,
        warned: false, warnTime: 0, fireTime: 0, duration: 9999,
        rotSpeed: 0.055,
      };
      b.lasers.push(laser);
      const rot = setInterval(() => {
        if (!_battle) { clearInterval(rot); return; }
        laser.beams.forEach(beam => { beam.ang += laser.rotSpeed; });
      }, 16);
      _enemyTimers.push(rot);
      mkInterval(() => {
        if (!_battle) return;
        warnGb(30 + Math.random() * (w - 60), 30 + Math.random() * (h - 60), 280);
      }, 900);
      mkInterval(() => {
        if (!_battle) return;
        const fromLeft = Math.random() < 0.5;
        b.bullets.push({
          shape: 'bone_h',
          x: fromLeft ? -w : w * 2,
          y: 20 + Math.random() * (h - 40),
          vx: fromLeft ? 5 : -5, vy: 0,
          w: w, h: 10, r: 4, color: 'red',
        });
      }, 1200);
    }

    else if (idx === 8) {
      addPlatform(w * 0.05, h * 0.55, w * 0.15);
      addPlatform(w * 0.3, h * 0.45, w * 0.15);
      addPlatform(w * 0.55, h * 0.55, w * 0.15);
      addPlatform(w * 0.8, h * 0.45, w * 0.15);
      mkInterval(() => {
        if (!_battle) return;
        for (let i = 0; i < 3; i++) {
          const y = 20 + Math.random() * (h - 40);
          b.bullets.push({
            shape: 'bone_skate',
            x: -30, y,
            vx: 6, vy: 0, w: 38, h: 6, r: 4,
            color: 'orange',
          });
        }
      }, 600);
      mkInterval(() => {
        if (!_battle) return;
        const cols = 3;
        const sp = w / (cols + 1);
        for (let c = 0; c < cols; c++) {
          warnBone(sp * (c + 1), 350, { bw: 18, bh: 30, color: 'white' });
        }
      }, 1000);
      mkInterval(() => {
        if (!_battle) return;
        warnGb(30 + Math.random() * (w - 60), 30 + Math.random() * (h - 60), 300);
      }, 1200);
    }

    else if (idx === 9) {
      addPlatform(w * 0.06, h * 0.55, w * 0.1);
      addPlatform(w * 0.22, h * 0.42, w * 0.1);
      addPlatform(w * 0.38, h * 0.55, w * 0.1);
      addPlatform(w * 0.54, h * 0.42, w * 0.1);
      addPlatform(w * 0.7, h * 0.55, w * 0.1);
      addPlatform(w * 0.86, h * 0.42, w * 0.1);

      mkInterval(() => {
        if (!_battle) return;
        warnGb(20 + Math.random() * (w - 40), 20 + Math.random() * (h - 40), 250);
        if (Math.random() < 0.4) {
          warnGb(20 + Math.random() * (w - 40), 20 + Math.random() * (h - 40), 250, { ap: true });
        }
      }, 500);

      mkInterval(() => {
        if (!_battle) return;
        warnBone(w * 0.2, 220, { bw: 18, bh: 32 });
        warnBone(w * 0.5, 220, { bw: 18, bh: 32 });
        warnBone(w * 0.8, 220, { bw: 18, bh: 32 });
      }, 650);

      mkInterval(() => {
        if (!_battle) return;
        if (Math.random() < 0.5) {
          b.lasers.push({ type: 'horizontal', y: 20 + Math.random() * (h - 40), warnDuration: 180, warned: false, warnTime: 0, fireTime: 0, duration: 280, color: '#dd3355' });
        } else {
          b.lasers.push({ type: 'vertical', x: 20 + Math.random() * (w - 40), warnDuration: 180, warned: false, warnTime: 0, fireTime: 0, duration: 280, color: '#dd3355' });
        }
      }, 900);

      if (!b.lasers.some(l => l.type === 'rotating')) {
        const laser = {
          type: 'rotating',
          cx: w / 2, cy: h / 2,
          beams: [
            { ang: 0 },
            { ang: Math.PI / 4 },
            { ang: Math.PI / 2 },
            { ang: Math.PI * 3 / 4 },
            { ang: Math.PI },
            { ang: Math.PI * 5 / 4 },
            { ang: Math.PI * 3 / 2 },
            { ang: Math.PI * 7 / 4 },
          ],
          color: '#ff2233',
          warnDuration: 200,
          warned: false, warnTime: 0, fireTime: 0, duration: 10000,
          rotSpeed: 0.075,
        };
        b.lasers.push(laser);
        const rot = setInterval(() => {
          if (!_battle) { clearInterval(rot); return; }
          laser.beams.forEach(beam => { beam.ang += laser.rotSpeed; });
        }, 16);
        _enemyTimers.push(rot);
      }

      mkInterval(() => {
        if (!_battle) return;
        const tx = _battle.soul.x, ty = _battle.soul.y;
        for (let i = 0; i < 3; i++) {
          const startX = Math.random() * w;
          const ang = Math.atan2(ty - (-30), tx - startX);
          b.bullets.push({
            shape: 'bone_h',
            x: startX, y: -25 - i * 15,
            vx: Math.cos(ang) * 4,
            vy: Math.sin(ang) * 4 + 1,
            w: 32, h: 10, r: 5, color: 'purple',
          });
        }
      }, 1400);
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

  function initVirtualControls(b) {
    const dpadCvs = b.modal.querySelector('#ub-dpad-circle');
    const btnCvs  = b.modal.querySelector('#ub-buttons-canvas');
    if (!dpadCvs || !btnCvs) return null;

    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const dpadSize = 148;
    dpadCvs.width = dpadSize * dpr; dpadCvs.height = dpadSize * dpr;
    const dc = dpadCvs.getContext('2d');
    dc.scale(dpr, dpr); dc.imageSmoothingEnabled = false;

    const btnSize = 56;
    btnCvs.width = 180 * dpr; btnCvs.height = 130 * dpr;
    const bc = btnCvs.getContext('2d');
    bc.scale(dpr, dpr); bc.imageSmoothingEnabled = false;

    const dirMap = { up: 'arrowup', down: 'arrowdown', left: 'arrowleft', right: 'arrowright' };
    const state = {
      up:false, down:false, left:false, right:false,
      z:false, x:false, c:false,
    };

    function drawDpad() {
      dc.clearRect(0, 0, dpadSize, dpadSize);
      const cx = dpadSize / 2, cy = dpadSize / 2;
      const outerR = dpadSize / 2 - 4;
      const innerR = outerR - 10;

      // 外圈底座
      dc.fillStyle = 'rgba(40,40,40,0.55)';
      dc.beginPath(); dc.arc(cx, cy, outerR, 0, Math.PI * 2); dc.fill();

      // 外圈描边
      dc.strokeStyle = 'rgba(140,140,140,0.7)';
      dc.lineWidth = 2;
      dc.beginPath(); dc.arc(cx, cy, outerR, 0, Math.PI * 2); dc.stroke();

      // 内圈
      dc.fillStyle = 'rgba(20,20,20,0.65)';
      dc.beginPath(); dc.arc(cx, cy, innerR, 0, Math.PI * 2); dc.fill();

      dc.strokeStyle = 'rgba(100,100,100,0.5)';
      dc.lineWidth = 1;
      dc.setLineDash([3, 3]);
      dc.beginPath(); dc.arc(cx, cy, innerR, 0, Math.PI * 2); dc.stroke();
      dc.setLineDash([]);

      // 十字方向指示（四个扇形区域）
      const sectR = outerR - 6;
      const arrowCol = d => state[d] ? '#ffe066' : '#bbbbbb';

      // 上
      drawArrow('up',   cx, cy - (innerR + outerR)/2 + 2, sectR - innerR, 0);
      drawArrow('down', cx, cy + (innerR + outerR)/2 - 2, sectR - innerR, Math.PI);
      drawArrow('left',  cx - (innerR + outerR)/2 + 2, cy, sectR - innerR, -Math.PI/2);
      drawArrow('right', cx + (innerR + outerR)/2 - 2, cy, sectR - innerR, Math.PI/2);

      // 中心小圆点
      dc.fillStyle = '#888';
      dc.beginPath(); dc.arc(cx, cy, 3, 0, Math.PI * 2); dc.fill();
      dc.fillStyle = state.up||state.down||state.left||state.right ? '#ffe066' : '#aaa';
      dc.beginPath(); dc.arc(cx, cy, 2, 0, Math.PI * 2); dc.fill();
    }

    function drawArrow(dir, x, y, size, angle) {
      dc.save();
      dc.translate(x, y);
      dc.rotate(angle);
      dc.fillStyle = dir === 'up' ? '#ffffff' : '#aaa';
      if (state[dir]) { dc.fillStyle = '#ffe066'; }
      dc.strokeStyle = dir === 'up' ? '#ffffff' : '#888';
      if (state[dir]) { dc.strokeStyle = '#ffcc33'; }
      dc.lineWidth = 1.5;
      dc.beginPath();
      dc.moveTo(0, -size);
      dc.lineTo(-size * 0.6, size * 0.4);
      dc.lineTo(-size * 0.2, size * 0.4);
      dc.lineTo(-size * 0.2, size);
      dc.lineTo(size * 0.2, size);
      dc.lineTo(size * 0.2, size * 0.4);
      dc.lineTo(size * 0.6, size * 0.4);
      dc.closePath();
      dc.fill();
      dc.stroke();
      dc.restore();
    }

    function drawButtons() {
      bc.clearRect(0, 0, 180, 130);

      // Z、X、C 按钮 — 右下三圆，弧形排列（左下→右上 斜线）
      const buttons = [
        { key:'z', x: 55,  y: 95, label:'Z', label2:'跳' },
        { key:'x', x: 110, y: 58, label:'X', label2:'攻' },
        { key:'c', x: 155, y: 22, label:'C', label2:'确' },
      ];

      buttons.forEach(btn => {
        const r = btnSize / 2;
        const cx = btn.x, cy = btn.y;
        const pressed = state[btn.key];

        // 外圈阴影
        bc.fillStyle = 'rgba(0,0,0,0.5)';
        bc.beginPath(); bc.arc(cx + 2, cy + 2, r + 3, 0, Math.PI*2); bc.fill();

        // 外圈
        bc.strokeStyle = pressed ? '#ffcc33' : '#555';
        bc.lineWidth = 2;
        bc.fillStyle = pressed ? '#ff440055' : 'rgba(60,60,60,0.7)';
        bc.beginPath(); bc.arc(cx, cy, r, 0, Math.PI*2); bc.fill(); bc.stroke();

        // 内高光
        bc.fillStyle = pressed ? '#ff662266' : 'rgba(255,255,255,0.06)';
        bc.beginPath(); bc.arc(cx, cy - 4, r - 8, 0, Math.PI*2); bc.fill();

        // 字母
        bc.fillStyle = pressed ? '#ffcc33' : '#ccc';
        bc.font = 'bold 22px "Courier New", monospace';
        bc.textAlign = 'center'; bc.textBaseline = 'middle';
        bc.fillText(btn.label, cx, cy - 3);
        // 副标签
        bc.font = '10px sans-serif';
        bc.fillStyle = pressed ? '#ffee99' : '#999';
        bc.fillText(btn.label2, cx, cy + 14);
      });
    }

    function redraw() { drawDpad(); drawButtons(); }

    // ========= 事件处理 =========
    function getDpadDir(x, y) {
      const cx = dpadSize/2, cy = dpadSize/2;
      const dx = x - cx, dy = y - cy;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 14) return null;
      const ang = Math.atan2(dy, dx);
      // 右半圆: ang ∈ (-π/2, π/2) → right
      // 上半圆: ang ∈ (0, π) → up
      // 左半圆: ang ∈ (π/2, 3π/2) → left
      // 下半圆: ang ∈ (-π, 0) → down
      // 用45度扇形判定
      if (ang > -Math.PI/4 && ang <= Math.PI/4) return 'right';
      if (ang > Math.PI/4 && ang <= 3*Math.PI/4) return 'down';
      if (ang > 3*Math.PI/4 || ang <= -3*Math.PI/4) return 'left';
      if (ang > -3*Math.PI/4 && ang <= -Math.PI/4) return 'up';
      return null;
    }

    function getButtonAt(x, y) {
      const btns = [
        { key:'z', x: 55,  y: 95 },
        { key:'x', x: 110, y: 58 },
        { key:'c', x: 155, y: 22 },
      ];
      for (const btn of btns) {
        const dx = x - btn.x, dy = y - btn.y;
        if (dx*dx + dy*dy <= (btnSize/2 + 4)**2) return btn.key;
      }
      return null;
    }

    function applyDirs() {
      for (const k of ['up','down','left','right']) {
        b.keys[dirMap[k]] = state[k];
      }
    }

    function applyButtons() {
      // Z = jump (space), X = action (enter), C = confirm (z key)
      b.keys[' '] = state.z;
      b.keys['enter'] = state.x;
      b.keys['z'] = state.c;
    }

    // 按键按下回调
    function onBtnDown(key) {
      state[key] = true;
      if (key === 'z' && b.soulColor === 'blue' && b.soul.onGround) {
        b.soul.vy = -8; b.soul.onGround = false;
      }
      applyButtons();
      redraw();
    }
    function onBtnUp(key) {
      state[key] = false;
      applyButtons();
      redraw();
    }

    // Pointer events — 用 pointerdown/move/up 统一处理触摸和鼠标
    const activeDirPointers = new Map(); // pointerId -> dir
    const activeBtnPointers = new Map(); // pointerId -> key

    function dpadOnDown(e) {
      e.preventDefault(); e.stopPropagation();
      dpadCvs.setPointerCapture(e.pointerId);
      const rect = dpadCvs.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const dir = getDpadDir(x, y);
      if (dir) {
        activeDirPointers.set(e.pointerId, dir);
        state[dir] = true;
        applyDirs();
        redraw();
      }
    }
    function dpadOnMove(e) {
      if (!activeDirPointers.has(e.pointerId)) return;
      const rect = dpadCvs.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const newDir = getDpadDir(x, y);
      const oldDir = activeDirPointers.get(e.pointerId);
      if (newDir !== oldDir) {
        if (oldDir) state[oldDir] = false;
        if (newDir) { state[newDir] = true; activeDirPointers.set(e.pointerId, newDir); }
        else activeDirPointers.delete(e.pointerId);
        applyDirs();
        redraw();
      }
    }
    function dpadOnUp(e) {
      e.preventDefault(); e.stopPropagation();
      const dir = activeDirPointers.get(e.pointerId);
      if (dir) { state[dir] = false; activeDirPointers.delete(e.pointerId); applyDirs(); redraw(); }
    }

    function btnOnDown(e) {
      e.preventDefault(); e.stopPropagation();
      btnCvs.setPointerCapture(e.pointerId);
      const rect = btnCvs.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const key = getButtonAt(x, y);
      if (key) { activeBtnPointers.set(e.pointerId, key); onBtnDown(key); }
    }
    function btnOnMove(e) {
      if (!activeBtnPointers.has(e.pointerId)) return;
      const rect = btnCvs.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const newKey = getButtonAt(x, y);
      const oldKey = activeBtnPointers.get(e.pointerId);
      if (newKey !== oldKey) {
        if (oldKey) onBtnUp(oldKey);
        if (newKey) { onBtnDown(newKey); activeBtnPointers.set(e.pointerId, newKey); }
        else activeBtnPointers.delete(e.pointerId);
      }
    }
    function btnOnUp(e) {
      e.preventDefault(); e.stopPropagation();
      const key = activeBtnPointers.get(e.pointerId);
      if (key) { onBtnUp(key); activeBtnPointers.delete(e.pointerId); }
    }

    dpadCvs.addEventListener('pointerdown', dpadOnDown);
    dpadCvs.addEventListener('pointermove', dpadOnMove);
    dpadCvs.addEventListener('pointerup', dpadOnUp);
    dpadCvs.addEventListener('pointercancel', dpadOnUp);
    dpadCvs.addEventListener('pointerleave', dpadOnUp);

    btnCvs.addEventListener('pointerdown', btnOnDown);
    btnCvs.addEventListener('pointermove', btnOnMove);
    btnCvs.addEventListener('pointerup', btnOnUp);
    btnCvs.addEventListener('pointercancel', btnOnUp);
    btnCvs.addEventListener('pointerleave', btnOnUp);

    redraw();

    return {
      destroy() {
        dpadCvs.removeEventListener('pointerdown', dpadOnDown);
        dpadCvs.removeEventListener('pointermove', dpadOnMove);
        dpadCvs.removeEventListener('pointerup', dpadOnUp);
        dpadCvs.removeEventListener('pointercancel', dpadOnUp);
        dpadCvs.removeEventListener('pointerleave', dpadOnUp);
        btnCvs.removeEventListener('pointerdown', btnOnDown);
        btnCvs.removeEventListener('pointermove', btnOnMove);
        btnCvs.removeEventListener('pointerup', btnOnUp);
        btnCvs.removeEventListener('pointercancel', btnOnUp);
        btnCvs.removeEventListener('pointerleave', btnOnUp);
      },
      redraw,
    };
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
