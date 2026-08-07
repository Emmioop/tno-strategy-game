// ===== Undertale Sans BOSS 战引擎 v90 =====
// 固定 640x480 内部分辨率，CSS object-fit:contain 自动横竖屏
// 所有 UI 画在 canvas 里 — 不再有 scale 混乱
(function () {
  'use strict';

  const CW = 640, CH = 480;
  const BOSS = {
    name: '德衫',
    sanshp: 1,
    sansoverturn: 11,
    color: '#e0c080',
    mercyThreshold: 60,
    introLines: [
      '* 雪地里传来一阵低语...',
      '* "听着，小家伙..."',
      '* "我已经死过一次了。"',
      '* "你以为你能杀死我两次？"',
      '* "...好吧。那就让我看看。"',
      '* "你到底有多疼。"',
    ],
    dodgeText: '* 德衫 闪避了！\n* "你还早了十年呢。"',
    checkText: '* 德衫 - ATK ??? DEF ???\n* "你不需要知道。"',
    complainText: '* "喂，别浪费我时间。"',
    talkText: '* "...有事吗？"',
    flirtText: '* "..."\n* "别这样。"',
    onSpareText: '* MERCY 成功！\n* "下次别再让我看见你了。"',
    onKillText: '* 你被彻底消灭了。',
  };
  const PLAYER = { maxHp: 92, atk: 19, def: 9, lv: 19, name: 'CHARA' };
  const ITEMS = [
    { id: 'tea',    name: '海茶',       heal: 10, text: '* 你喝了一口海茶，感觉温暖。' },
    { id: 'hero',   name: '传说英雄',   heal: 40, text: '* 传说中的英雄能量涌入体内！' },
    { id: 'steak',  name: '牛排脸',     heal: 60, text: '* 一块带脸的牛排。你吃了它。' },
    { id: 'pie',    name: '奶油肉桂派', heal: 92, text: '* 妈妈做的派。你满血复活了。' },
  ];

  const PHASES = [
    { csv: 'sans_intro.csv',             name: 'Intro',                dur: 5000 },
    { csv: 'sans_multi1.csv',            name: 'Multi 1',              dur: 6000 },
    { csv: 'sans_multi2.csv',            name: 'Multi 2',              dur: 6000 },
    { csv: 'sans_multi3.csv',            name: 'Multi 3',              dur: 6500 },
    { csv: 'sans_platformblaster.csv',   name: 'PlatformBlaster',      dur: 6000 },
    { csv: 'sans_platforms1.csv',        name: 'Platforms 1',          dur: 5500 },
    { csv: 'sans_platforms2.csv',        name: 'Platforms 2',          dur: 6000 },
    { csv: 'sans_platforms3.csv',        name: 'Platforms 3',          dur: 6000 },
    { csv: 'sans_platforms4.csv',        name: 'Platforms 4',          dur: 5500 },
    { csv: 'sans_boneslidev.csv',        name: 'BoneSlide V',          dur: 5000 },
    { csv: 'sans_boneslideh.csv',        name: 'BoneSlide H',          dur: 5000 },
    { csv: 'sans_bonegap1.csv',          name: 'BoneGap 1',            dur: 5000 },
    { csv: 'sans_bonegap1fast.csv',      name: 'BoneGap 1 Fast',       dur: 5000 },
    { csv: 'sans_bonegap2.csv',          name: 'BoneGap 2',            dur: 5500 },
    { csv: 'sans_bluebone.csv',          name: 'Blue Bone',            dur: 5000 },
    { csv: 'sans_randomblaster1.csv',     name: 'RandomBlaster 1',      dur: 5500 },
    { csv: 'sans_randomblaster2.csv',     name: 'RandomBlaster 2',      dur: 5500 },
    { csv: 'sans_bonestab1.csv',         name: 'BoneStab 1',           dur: 5000 },
    { csv: 'sans_bonestab2.csv',         name: 'BoneStab 2',           dur: 5000 },
    { csv: 'sans_bonestab3.csv',         name: 'BoneStab 3',           dur: 5000 },
    { csv: 'sans_final.csv',             name: 'Final Step_2',         dur: 12000 },
  ];

  const state = {
    phase: 'intro',
    turn: 0,
    modal: null, canvas: null, ctx: null,
    c2sfReady: false,
    c2sfCache: {},
    sansImg: null, sansHeadImg: null,
    sansSlam: 0, sansSlamT: 0,
    sansX: 320,
    player: { hp: PLAYER.maxHp, maxHp: PLAYER.maxHp, karma: 0, mercy: 0, items: [2,1,1,1], atk: PLAYER.atk, def: PLAYER.def, lv: PLAYER.lv },
    soulTeleportCooldown: 0,
    dialog: '', dialogTimer: 0, dialogNextCb: null,
    introIdx: 0,
    menuIdx: 0, menus: [],
    fightBarPos: 0, fightDir: 1, fightActive: false,
    hitFlash: 0, shakeT: 0,
    turnText: '',
    c2sfIdx: 0, c2sfStart: 0,
    keys: {}, virtualKeys: { up:false,down:false,left:false,right:false,confirm:false,jump:false },
    dpr: 1,
  };

  function close() {
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    window.removeEventListener('resize', onResize);
    if (state.modal) state.modal.remove();
    state.modal = null;
    state.phase = null;
    state.keys = {};
    state.virtualKeys = { up:false,down:false,left:false,right:false,confirm:false,jump:false };
  }

  function startBattle() {
    close();
    state.phase = 'intro';
    state.turn = 0;
    state.c2sfIdx = 0;
    state.c2sfReady = false;
    state.c2sfCache = {};
    state.player.hp = PLAYER.maxHp;
    state.player.karma = 0;
    state.player.mercy = 0;
    state.player.items = [2,1,1,1];
    state.keys = {};
    state.virtualKeys = { up:false,down:false,left:false,right:false,confirm:false,jump:false };

    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;inset:0;background:#000;z-index:100060;display:flex;align-items:center;justify-content:center;overflow:hidden;';
    modal.innerHTML = `
      <canvas id="ub-c" width="${CW}" height="${CH}" style="width:100vw;height:100vh;object-fit:contain;background:#000;image-rendering:pixelated;image-rendering:crisp-edges;cursor:pointer;"></canvas>
    `;
    document.body.appendChild(modal);
    state.modal = modal;
    state.canvas = modal.querySelector('#ub-c');
    state.ctx = state.canvas.getContext('2d');
    state.ctx.imageSmoothingEnabled = false;

    setupInput();

    if (typeof C2SF !== 'undefined') {
      C2SF.loadSpriteSheet().then(() => {
        state.c2sfReady = true;
        preloadAllCsv();
      });
    }

    requestAnimationFrame(loop);
    showIntro();
  }

  function preloadAllCsv() {
    if (typeof C2SF === 'undefined') return;
    let done = 0;
    for (const p of PHASES) {
      if (state.c2sfCache[p.csv]) { done++; continue; }
      C2SF.loadCSV(p.csv).then(d => {
        if (d) state.c2sfCache[p.csv] = d;
        done++;
      });
    }
  }

  function setupInput() {
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    state.modal.addEventListener('click', onCanvasClick);
    state.canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    state.canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    state.canvas.addEventListener('touchend', onTouchEnd, { passive: false });
    state.canvas.addEventListener('touchcancel', onTouchEnd, { passive: false });
    window.addEventListener('resize', onResize);
    onResize();
  }

  function onResize() {
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || window.innerWidth < 800;
    state.isMobile = isMobile;
  }

  function onKeyDown(e) {
    const k = e.key.toLowerCase();
    state.keys[k] = true;
    if (['arrowup','arrowdown','arrowleft','arrowright',' ','w','a','s','d','j'].includes(k)) e.preventDefault();
    if (state.phase === 'intro' && (k === ' ' || k === 'enter' || k === 'z')) nextIntro();
    else if (state.phase === 'player_turn' && (k === ' ' || k === 'enter' || k === 'z')) selectMenu();
    else if (state.phase === 'fight' && (k === ' ' || k === 'enter' || k === 'z')) confirmFight();
    else if ((state.phase === 'act_menu' || state.phase === 'item_menu') && (k === ' ' || k === 'enter' || k === 'z')) selectSubMenu();
    else if (state.phase === 'mercy_menu' && (k === ' ' || k === 'enter' || k === 'z')) selectSubMenu();
    else if (k === 'escape' || k === 'x') {
      if (state.phase === 'player_turn') close();
      else if (['act_menu','item_menu','mercy_menu'].includes(state.phase)) { state.phase = 'player_turn'; state.menuIdx = 0; }
    }
  }
  function onKeyUp(e) { state.keys[e.key.toLowerCase()] = false; }

  function onCanvasClick(e) {
    if (state.phase === 'intro') nextIntro();
    else if (state.phase === 'player_turn') selectMenu();
    else if (state.phase === 'fight') confirmFight();
    else if (['act_menu','item_menu','mercy_menu'].includes(state.phase)) selectSubMenu();
  }

  function touchToCanvasPoint(clientX, clientY) {
    const rect = state.canvas.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width * CW;
    const y = (clientY - rect.top) / rect.height * CH;
    return { x, y };
  }

  function hitVirtualBtn(px, py) {
    const dpx = 40, dpy = CH - 100, R = 24;
    const bx = CW - 110, by = CH - 80;
    if (Math.hypot(px - (dpx+30), py - (dpy+20)) < R) return 'up';
    if (Math.hypot(px - (dpx+30), py - (dpy+80)) < R) return 'down';
    if (Math.hypot(px - (dpx+10), py - (dpy+50)) < R) return 'left';
    if (Math.hypot(px - (dpx+50), py - (dpy+50)) < R) return 'right';
    if (Math.hypot(px - (bx+20), py - (by+40)) < R) return 'b';
    if (Math.hypot(px - (bx+60), py - (by+15)) < R) return 'a';
    return null;
  }

  function onTouchStart(e) {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      const p = touchToCanvasPoint(t.clientX, t.clientY);
      const btn = hitVirtualBtn(p.x, p.y);
      if (btn === 'up') state.virtualKeys.up = true;
      else if (btn === 'down') state.virtualKeys.down = true;
      else if (btn === 'left') state.virtualKeys.left = true;
      else if (btn === 'right') state.virtualKeys.right = true;
      else if (btn === 'a') {
        if (state.phase === 'enemy_turn') state.virtualKeys.jump = true;
        else if (state.phase === 'player_turn') selectMenu();
        else if (state.phase === 'fight') confirmFight();
        else if (['act_menu','item_menu','mercy_menu'].includes(state.phase)) selectSubMenu();
        else if (state.phase === 'intro') nextIntro();
      } else if (btn === 'b') {
        if (['act_menu','item_menu','mercy_menu'].includes(state.phase)) { state.phase = 'player_turn'; state.menuIdx = 0; }
        else if (state.phase === 'player_turn') close();
      } else {
        if (state.phase === 'enemy_turn' && typeof C2SF !== 'undefined' && state.c2sfReady) {
          // Touch inside combat zone → start dragging soul
          const z = C2SF.state.combatZone;
          if (p.x >= z.left && p.x <= z.right && p.y >= z.top && p.y <= z.bottom) {
            state._dragTouchId = t.identifier;
            C2SF.state.soul.x = Math.max(z.left + 6, Math.min(z.right - 6, p.x));
            C2SF.state.soul.y = Math.max(z.top + 6, Math.min(z.bottom - 6, p.y));
            C2SF.state.soul.vx = 0; C2SF.state.soul.vy = 0;
          }
        }
      }
    }
  }

  function onTouchMove(e) {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (state._dragTouchId === t.identifier && state.phase === 'enemy_turn' && typeof C2SF !== 'undefined') {
        const p = touchToCanvasPoint(t.clientX, t.clientY);
        const z = C2SF.state.combatZone;
        C2SF.state.soul.x = Math.max(z.left + 6, Math.min(z.right - 6, p.x));
        C2SF.state.soul.y = Math.max(z.top + 6, Math.min(z.bottom - 6, p.y));
        C2SF.state.soul.vx = 0; C2SF.state.soul.vy = 0;
      }
    }
  }

  function onTouchEnd(e) {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      const p = touchToCanvasPoint(t.clientX, t.clientY);
      const btn = hitVirtualBtn(p.x, p.y);
      if (btn === 'up') state.virtualKeys.up = false;
      else if (btn === 'down') state.virtualKeys.down = false;
      else if (btn === 'left') state.virtualKeys.left = false;
      else if (btn === 'right') state.virtualKeys.right = false;
      else if (btn === 'a' && state.virtualKeys.jump) state.virtualKeys.jump = false;
      if (state._dragTouchId === t.identifier) state._dragTouchId = null;
    }
  }

  // =============== INTRO ===============
  function showIntro() {
    state.phase = 'intro';
    state.introIdx = 0;
    state.dialog = BOSS.introLines[0];
  }
  function nextIntro() {
    state.introIdx++;
    if (state.introIdx >= BOSS.introLines.length) {
      state.phase = 'player_turn';
      state.menuIdx = 0;
    } else {
      state.dialog = BOSS.introLines[state.introIdx];
    }
  }

  // =============== DRAW ===============
  function draw() {
    const ctx = state.ctx;
    if (!ctx) return;
    ctx.save();
    ctx.fillStyle = '#0a0a18';
    ctx.fillRect(0, 0, CW, CH);
    ctx.restore();

    if (state.hitFlash > 0) {
      ctx.fillStyle = `rgba(255,50,50,${state.hitFlash})`;
      ctx.fillRect(0, 0, CW, CH);
    }

    // Sans
    drawSans(ctx);

    // Dialog box top (intro/battle text)
    drawDialog(ctx);

    // Battle area
    drawBattleArea(ctx);

    // UI - HP, KR, menu buttons
    drawUI(ctx);

    // Virtual keys on mobile
    if (state.isMobile && state.phase !== 'enemy_turn') drawVirtualKeys(ctx);
  }

  function drawSans(ctx) {
    // Sans sprite drawn as skeleton placeholder
    const sx = state.sansX;
    const sy = 166;
    ctx.save();
    // Body
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(sx - 30, sy - 20, 60, 80);
    // Head (skull)
    ctx.beginPath();
    ctx.arc(sx, sy - 30, 28, 0, Math.PI*2);
    ctx.fill();
    // Eye sockets
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.ellipse(sx - 10, sy - 32, 6, 7, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(sx + 10, sy - 32, 6, 7, 0, 0, Math.PI*2); ctx.fill();
    // Blue left eye
    ctx.fillStyle = '#4488ff';
    ctx.beginPath(); ctx.arc(sx - 10, sy - 32, 2.5, 0, Math.PI*2); ctx.fill();
    // Smile
    ctx.strokeStyle = '#000'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sx - 12, sy - 20);
    ctx.lineTo(sx + 12, sy - 20);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(sx - 6, sy - 15);
    ctx.lineTo(sx - 3, sy - 12);
    ctx.moveTo(sx, sy - 15);
    ctx.lineTo(sx + 3, sy - 12);
    ctx.moveTo(sx + 6, sy - 15);
    ctx.lineTo(sx + 9, sy - 12);
    ctx.stroke();
    // Hoodie strings
    ctx.fillStyle = '#000';
    ctx.fillRect(sx - 25, sy + 5, 50, 12);
    // Pants
    ctx.fillStyle = '#2244aa';
    ctx.fillRect(sx - 28, sy + 60, 24, 30);
    ctx.fillRect(sx + 4, sy + 60, 24, 30);
    // Shoes
    ctx.fillStyle = '#000';
    ctx.fillRect(sx - 32, sy + 88, 28, 8);
    ctx.fillRect(sx + 4, sy + 88, 28, 8);
    ctx.restore();

    // Sans slam effect
    if (state.sansSlamT > 0) {
      ctx.fillStyle = `rgba(255,255,255,${state.sansSlamT})`;
      ctx.fillRect(0, 0, CW, CH);
    }
  }

  function drawDialog(ctx) {
    if (!state.dialog) return;
    ctx.save();
    // Dialog box at top
    const dx = 60, dy = 20, dw = CW - 120, dh = 80;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(dx, dy, dw, dh);
    ctx.fillStyle = '#000';
    ctx.fillRect(dx + 1, dy + 1, dw - 2, dh - 2);
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px "Courier New", monospace';
    ctx.textBaseline = 'top';
    const lines = state.dialog.split('\n');
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], dx + 12, dy + 10 + i * 18);
    }
    // Blinking continue indicator
    if ((Date.now() / 300 | 0) % 2 === 0) {
      ctx.fillText('▼', dx + dw - 20, dy + dh - 18);
    }
    ctx.restore();
  }

  function drawBattleArea(ctx) {
    // Battle area frame
    const bx = 60, by = 108, bw = CW - 120, bh = 200;
    ctx.save();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, by, bw, bh);
    ctx.restore();

    if (state.phase === 'enemy_turn' && typeof C2SF !== 'undefined' && state.c2sfReady) {
      C2SF.draw(ctx);
    }
  }

  function drawUI(ctx) {
    const b = state.player;
    ctx.save();
    // Name + LV
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px "Courier New", monospace';
    ctx.textBaseline = 'top';
    ctx.fillText(`${PLAYER.name}  LV ${PLAYER.lv}`, 70, 318);

    // HP bar
    const hpX = 170, hpY = 319, hpW = 220, hpH = 12;
    ctx.fillStyle = '#000';
    ctx.fillRect(hpX, hpY, hpW, hpH);
    const yellowW = Math.max(0, hpW * (b.hp / b.maxHp));
    ctx.fillStyle = '#ffee44';
    ctx.fillRect(hpX, hpY, yellowW, hpH);
    if (b.hp < b.maxHp) {
      ctx.fillStyle = '#ff2222';
      ctx.fillRect(hpX + yellowW, hpY, hpW - yellowW, hpH);
    }
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(hpX, hpY, hpW, hpH);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`HP ${b.hp}/${b.maxHp}`, 400, 318);

    // KR bar (Karma - purple)
    ctx.fillStyle = '#cc44ff';
    ctx.fillText('KR', 490, 318);
    const krW = 60;
    const krFilled = Math.max(0, krW * (b.karma / b.maxHp));
    ctx.fillStyle = '#000';
    ctx.fillRect(515, 319, krW, hpH);
    ctx.fillStyle = '#aa44ff';
    ctx.fillRect(515 + (krW - krFilled), 319, krFilled, hpH);
    ctx.strokeStyle = '#ffffff';
    ctx.strokeRect(515, 319, krW, hpH);

    // Menu buttons (bottom row)
    const btnY = 360, btnH = 50;
    const buttons = [
      { label: '❤ FIGHT', color: '#ffee44', key: 'Fight' },
      { label: '📣 ACT',  color: '#ff8833', key: 'Act' },
      { label: '💊 ITEM', color: '#ff8833', key: 'Item' },
      { label: '💘 MERCY',color: '#ff8833', key: 'Mercy' },
    ];
    const btnGap = 10;
    const totalW = CW - 120;
    const btnW = (totalW - btnGap * 3) / 4;
    for (let i = 0; i < 4; i++) {
      const bx = 60 + i * (btnW + btnGap);
      const isActive = (state.phase === 'player_turn' && state.menuIdx === i &&
        ['intro','act_menu','item_menu','mercy_menu','fight','enemy_turn','victory','defeat'].indexOf(state.phase) < 0);
      ctx.fillStyle = '#000';
      ctx.fillRect(bx, btnY, btnW, btnH);
      ctx.strokeStyle = buttons[i].color;
      ctx.lineWidth = 2;
      ctx.strokeRect(bx, btnY, btnW, btnH);
      ctx.fillStyle = buttons[i].color;
      ctx.font = '14px "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(buttons[i].label, bx + btnW/2, btnY + btnH/2 - 7);
      if (isActive) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px "Courier New", monospace';
        ctx.fillText('▶', bx + 12, btnY + btnH/2 - 8);
      }
    }
    ctx.textAlign = 'left';
    ctx.restore();

    // Fight mini-game bar
    if (state.phase === 'fight') drawFightBar(ctx);

    // Act/Item/Mercy submenus
    if (state.phase === 'act_menu' || state.phase === 'item_menu' || state.phase === 'mercy_menu') {
      drawSubMenu(ctx);
    }

    // Enemy turn indicator
    if (state.phase === 'enemy_turn') {
      ctx.fillStyle = '#888';
      ctx.font = '10px "Courier New", monospace';
      ctx.textAlign = 'right';
      ctx.fillText((C2SF.state.phaseName || '') + (C2SF.state.soul.mode === 0 ? ' 🔵' : ' 🔴'), CW - 20, 100);
      ctx.textAlign = 'left';
    }
  }

  function drawFightBar(ctx) {
    ctx.save();
    const bx = 60, by = 270, bw = CW - 120, bh = 14;
    ctx.fillStyle = '#222';
    ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.strokeRect(bx, by, bw, bh);
    ctx.fillStyle = '#ffee44';
    // Sweet spot zone (20%)
    const sweetX = bx + bw * 0.45, sweetW = bw * 0.1;
    ctx.fillStyle = '#88ff88';
    ctx.fillRect(sweetX, by, sweetW, bh);
    ctx.fillStyle = '#ffee44';
    const px = bx + state.fightBarPos * bw;
    ctx.fillRect(px - 3, by - 2, 6, bh + 4);
    ctx.fillStyle = '#fff';
    ctx.font = '10px "Courier New", monospace';
    ctx.fillText('TAP / SPACE to stop!', bx + bw/2 - 80, by - 10);
    ctx.restore();
  }

  function drawSubMenu(ctx) {
    ctx.save();
    const bx = 180, by = 130, bw = 280;
    let items = [];
    if (state.phase === 'act_menu') items = ['Check', 'Complaint', 'Talk', 'Flirt'];
    else if (state.phase === 'item_menu') {
      for (let i = 0; i < ITEMS.length; i++) {
        if (state.player.items[i] > 0) items.push(`${ITEMS[i].name} x${state.player.items[i]}`);
      }
      if (items.length === 0) items = ['(No items)'];
    } else if (state.phase === 'mercy_menu') items = ['Spare', 'Flee'];
    const bh = items.length * 28 + 20;
    ctx.fillStyle = '#000';
    ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = '#ffee44';
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, by, bw, bh);
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px "Courier New", monospace';
    for (let i = 0; i < items.length; i++) {
      const iy = by + 14 + i * 28;
      if (i === state.menuIdx) {
        ctx.fillStyle = '#ffee44';
        ctx.fillText('▶', bx + 8, iy);
      } else {
        ctx.fillStyle = '#888';
      }
      ctx.fillText(items[i], bx + 28, iy);
    }
    ctx.restore();
  }

  function drawVirtualKeys(ctx) {
    ctx.save();
    // D-pad bottom-left
    const dpx = 40, dpy = CH - 100;
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = '#555';
    // Up
    ctx.beginPath(); ctx.arc(dpx + 30, dpy + 20, 20, 0, Math.PI*2); ctx.fill();
    // Down
    ctx.beginPath(); ctx.arc(dpx + 30, dpy + 80, 20, 0, Math.PI*2); ctx.fill();
    // Left
    ctx.beginPath(); ctx.arc(dpx + 10, dpy + 50, 20, 0, Math.PI*2); ctx.fill();
    // Right
    ctx.beginPath(); ctx.arc(dpx + 50, dpy + 50, 20, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('▲', dpx + 30, dpy + 20);
    ctx.fillText('▼', dpx + 30, dpy + 80);
    ctx.fillText('◀', dpx + 10, dpy + 50);
    ctx.fillText('▶', dpx + 50, dpy + 50);

    // A/B buttons bottom-right
    const bx = CW - 110, by = CH - 80;
    ctx.fillStyle = '#444';
    ctx.beginPath(); ctx.arc(bx + 20, by + 40, 22, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#666';
    ctx.beginPath(); ctx.arc(bx + 60, by + 15, 22, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('B', bx + 20, by + 40);
    ctx.fillText('A', bx + 60, by + 15);
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  // =============== UPDATE ===============
  function update() {
    if (state.hitFlash > 0) state.hitFlash = Math.max(0, state.hitFlash - 0.03);
    if (state.sansSlamT > 0) state.sansSlamT -= 0.04;
    // Menu navigation
    if (state.phase === 'player_turn') {
      if (justPressed('arrowleft')) state.menuIdx = Math.max(0, state.menuIdx - 1);
      if (justPressed('arrowright')) state.menuIdx = Math.min(3, state.menuIdx + 1);
      if (justPressed('arrowup') || justPressed('arrowdown')) state.menuIdx = (state.menuIdx + 1) % 4;
    }
    if (state.phase === 'act_menu' || state.phase === 'item_menu' || state.phase === 'mercy_menu') {
      if (justPressed('arrowup')) state.menuIdx = Math.max(0, state.menuIdx - 1);
      if (justPressed('arrowdown')) state.menuIdx++;
    }
    // Fight bar
    if (state.phase === 'fight') {
      state.fightBarPos += state.fightDir * 0.015;
      if (state.fightBarPos >= 1) { state.fightBarPos = 1; state.fightDir = -1; }
      if (state.fightBarPos <= 0) { state.fightBarPos = 0; state.fightDir = 1; }
    }
  }

  // =============== MENU ACTIONS ===============
  function selectMenu() {
    if (state.phase !== 'player_turn') return;
    const idx = state.menuIdx;
    if (idx === 0) { state.phase = 'fight'; state.fightBarPos = Math.random() * 0.5; state.fightDir = 1; }
    else if (idx === 1) { state.phase = 'act_menu'; state.menuIdx = 0; }
    else if (idx === 2) {
      state.phase = 'item_menu'; state.menuIdx = 0;
      // Filter items - skip empty
      let realIdx = 0;
      for (let i = 0; i < ITEMS.length; i++) {
        if (state.player.items[i] > 0 && realIdx === state.menuIdx) break;
        if (state.player.items[i] > 0) realIdx++;
      }
    }
    else if (idx === 3) { state.phase = 'mercy_menu'; state.menuIdx = 0; }
  }

  function confirmFight() {
    if (state.phase !== 'fight') return;
    const pos = state.fightBarPos;
    let mult = 0.5, label = 'BAD!';
    if (pos >= 0.45 && pos <= 0.55) { mult = 2.0; label = 'PERFECT!'; }
    else if (pos >= 0.38 && pos <= 0.62) { mult = 1.5; label = 'GREAT!'; }
    else if (pos >= 0.3 && pos <= 0.7) { mult = 1.0; label = 'OK'; }
    else if (pos >= 0.2 || pos <= 0.8) { mult = 0.7; label = 'MISS'; }
    state.phase = 'player_turn';
    state.menuIdx = 0;

    const damage = Math.round(PLAYER.atk * mult);
    state.turnText = `${label} — ${damage} damage!`;
    state.dialog = state.turnText;

    // BOSS dodge check - first 11 turns
    if (state.turn < BOSS.sansoverturn) {
      state.dialog = BOSS.dodgeText;
      setTimeout(() => { state.turn++; startEnemyTurn(); }, 1500);
      return;
    }
    // Actually hurt BOSS (just increment kills, since sanshp=1 means one hit)
    state.player.mercy += 5;
    state.turn++;
    setTimeout(() => startEnemyTurn(), 1500);
  }

  function selectSubMenu() {
    const p = state.phase;
    if (p === 'act_menu') {
      const acts = ['Check', 'Complaint', 'Talk', 'Flirt'];
      const idx = Math.min(state.menuIdx, acts.length - 1);
      state.phase = 'player_turn'; state.menuIdx = 0;
      state.dialog = acts[idx] === 'Check'
        ? BOSS.checkText : acts[idx] === 'Complaint'
        ? BOSS.complainText : acts[idx] === 'Talk'
        ? BOSS.talkText : BOSS.flirtText;
      state.player.mercy += 5;
      setTimeout(() => { state.turn++; startEnemyTurn(); }, 2000);
    } else if (p === 'item_menu') {
      // Find actual item index
      let count = 0, idx = -1;
      for (let i = 0; i < ITEMS.length; i++) {
        if (state.player.items[i] > 0) {
          if (count === state.menuIdx) { idx = i; break; }
          count++;
        }
      }
      state.phase = 'player_turn'; state.menuIdx = 0;
      if (idx >= 0) {
        state.player.items[idx]--;
        state.player.hp = Math.min(PLAYER.maxHp, state.player.hp + ITEMS[idx].heal);
        state.dialog = ITEMS[idx].text;
      }
      state.turn++;
      setTimeout(() => startEnemyTurn(), 2000);
    } else if (p === 'mercy_menu') {
      const idx = state.menuIdx === 0 ? 0 : 1;
      state.phase = 'player_turn'; state.menuIdx = 0;
      if (idx === 0) {
        if (state.player.mercy >= BOSS.mercyThreshold) {
          state.phase = 'victory';
          state.dialog = BOSS.onSpareText;
          return;
        }
        state.dialog = '* "怎么了？想求饶了？"\n* MERCY 不足。';
      } else {
        state.dialog = '* 你试图逃跑...';
      }
      state.turn++;
      setTimeout(() => startEnemyTurn(), 1500);
    }
  }

  // =============== ENEMY TURN (C2SF) ===============
  function startEnemyTurn() { console.log("[BATTLE] startEnemyTurn c2sfReady=" + state.c2sfReady + " idx=" + state.c2sfIdx);
    state.phase = 'enemy_turn';
    state.dialog = '';
    if (typeof C2SF === 'undefined' || !state.c2sfReady) {
      // Fallback - just show dialog
      state.dialog = '* (C2SF 未加载，请刷新重试)';
      setTimeout(() => { state.phase = 'player_turn'; }, 2000);
      return;
    }
    const phase = PHASES[state.c2sfIdx % PHASES.length];
    state.c2sfIdx++;
    const csvData = state.c2sfCache[phase.csv];
    if (csvData) {
      console.log("[BATTLE] C2SF.startAttack csvData=" + !!csvData + " name=" + phase.name); C2SF.startAttack(csvData, phase.name);
    } else {
      C2SF.loadCSV(phase.csv).then(d => {
        if (d) {
          state.c2sfCache[phase.csv] = d;
          C2SF.startAttack(d, phase.name);
        }
      });
    }
    state.c2sfStart = performance.now();
  }

  function checkEnemyTurn() {
    if (state.phase !== 'enemy_turn') return;
    if (typeof C2SF === 'undefined' || !state.c2sfReady) { console.log("[BATTLE] checkEnemyTurn SKIP - c2sfReady=" + state.c2sfReady); return; }

    const cs = C2SF.state.soul;
    const z = C2SF.state.combatZone;
    const speed = 4.2;
    const keys = state.keys;

    if (!state._dragTouchId) {
      if (cs.mode === 1) {
        if (keys['arrowleft'] || keys['a'] || state.virtualKeys.left) cs.x -= speed;
        if (keys['arrowright'] || keys['d'] || state.virtualKeys.right) cs.x += speed;
        if (keys['arrowup'] || keys['w'] || state.virtualKeys.up) cs.y -= speed;
        if (keys['arrowdown'] || keys['s'] || state.virtualKeys.down) cs.y += speed;
      } else {
        if ((keys[' '] || keys['arrowup'] || keys['w'] || state.virtualKeys.jump) && cs.onGround) {
          cs.vy = -8; cs.onGround = false;
        }
        if (keys['arrowleft'] || keys['a'] || state.virtualKeys.left) cs.x -= speed;
        if (keys['arrowright'] || keys['d'] || state.virtualKeys.right) cs.x += speed;
        cs.vy = (cs.vy || 0) + 0.55;
        cs.vy = Math.min(cs.vy, (cs.maxFallSpeed || 750) / 60);
        cs.y += cs.vy;
        cs.onGround = false;
        for (const p of C2SF.state.platforms) {
          if (cs.vy >= 0 && cs.x >= p.x - 4 && cs.x <= p.x + p.w + 4 &&
              cs.y >= p.y - 4 && cs.y <= p.y + 12) {
            cs.y = p.y; cs.vy = 0; cs.onGround = true;
          }
        }
        if (cs.y >= C2SF.CANVAS_H - 6) {
          cs.y = C2SF.CANVAS_H - 6; cs.vy = 0; cs.onGround = true;
        }
      }
    } else {
      cs.vy = 0; cs.onGround = false;
    }
    cs.x = Math.max(z.left + 6, Math.min(z.right - 6, cs.x));
    cs.y = Math.max(z.top + 6, Math.min(z.bottom - 6, cs.y));

    C2SF.update();

    // Collision
    const hit = C2SF.collidesBullet();
    if (hit && state.soulTeleportCooldown <= 0) {
      state.soulTeleportCooldown = 12;
      state.hitFlash = 1.0;
      const dmg = 5;
      state.player.hp -= dmg;
      // Karma overflow
      if (state.player.hp < 0) {
        state.player.karma += -state.player.hp;
        state.player.hp = 0;
      }
      if (state.player.hp <= 0 && state.player.karma >= PLAYER.maxHp) {
        state.player.hp = 0;
        state.phase = 'defeat';
        state.dialog = BOSS.onKillText;
        return;
      }
    }
    if (state.soulTeleportCooldown > 0) state.soulTeleportCooldown--;

    // End attack
    if (!C2SF.isRunning()) {
      setTimeout(() => {
        if (state.player.hp > 0) {
          state.phase = 'player_turn';
          state.menuIdx = 0;
        }
      }, 800);
    }
  }

  // =============== LOOP ===============
  let prevKeys = {};
  function justPressed(k) { return state.keys[k] && !prevKeys[k]; }

  function loop() {
    if (!state.modal) return;
    update();
    checkEnemyTurn();
    draw();
    prevKeys = { ...state.keys };
    requestAnimationFrame(loop);
  }

  // =============== PUBLIC API ===============
  function openBossSelect() { startBattle(); }
  window.UndertaleBattle = { startBattle, close, openBossSelect };
  window.openBossSelect = openBossSelect;

})();
