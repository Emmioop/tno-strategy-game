// ===== Undertale Sans BOSS 战引擎 v100 =====
// 全面抄BHUTE风格: FIGHT mini-game, Karma紫血, 异色瞳Sans, 震动/飘字, 结局画面
// 固定 640x480 内部分辨率, CSS object-fit:contain 自动横竖屏

(function () {
  'use strict';

  const CW = 640, CH = 480;

  const BOSS = {
    name: '德衫',
    sanshp: 1,
    sansoverturn: 11,
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
    onHitText: '* "好痛..."',
  };

  const PLAYER = { maxHp: 92, atk: 19, def: 9, lv: 19, name: 'CHARA' };

  const ITEMS = [
    { id: 'tea',    name: '海茶',       heal: 10, text: '* 你喝了一口海茶，感觉温暖。' },
    { id: 'hero',   name: '传说英雄',   heal: 40, text: '* 传说中的英雄能量涌入体内！' },
    { id: 'steak',  name: '牛排脸',     heal: 60, text: '* 一块带脸的牛排。你吃了它。' },
    { id: 'pie',    name: '奶油肉桂派', heal: 92, text: '* 妈妈做的派。你满血复活了。' },
  ];

  const PHASES = [
    { csv: 'sans_intro.csv',             name: 'Intro',           dur: 5000 },
    { csv: 'sans_multi1.csv',            name: 'Multi 1',         dur: 6000 },
    { csv: 'sans_multi2.csv',            name: 'Multi 2',         dur: 6000 },
    { csv: 'sans_multi3.csv',            name: 'Multi 3',         dur: 6500 },
    { csv: 'sans_platformblaster.csv',   name: 'PlatformBlaster', dur: 6000 },
    { csv: 'sans_platforms1.csv',        name: 'Platforms 1',     dur: 5500 },
    { csv: 'sans_platforms2.csv',        name: 'Platforms 2',     dur: 6000 },
    { csv: 'sans_platforms3.csv',        name: 'Platforms 3',     dur: 6000 },
    { csv: 'sans_platforms4.csv',        name: 'Platforms 4',     dur: 5500 },
    { csv: 'sans_boneslidev.csv',        name: 'BoneSlide V',     dur: 5000 },
    { csv: 'sans_boneslideh.csv',        name: 'BoneSlide H',     dur: 5000 },
    { csv: 'sans_bonegap1.csv',          name: 'BoneGap 1',       dur: 5000 },
    { csv: 'sans_bonegap1fast.csv',      name: 'BoneGap 1 Fast',  dur: 5000 },
    { csv: 'sans_bonegap2.csv',          name: 'BoneGap 2',       dur: 5500 },
    { csv: 'sans_bluebone.csv',          name: 'Blue Bone',       dur: 5000 },
    { csv: 'sans_randomblaster1.csv',     name: 'RandomBlaster 1', dur: 5500 },
    { csv: 'sans_randomblaster2.csv',     name: 'RandomBlaster 2', dur: 5500 },
    { csv: 'sans_bonestab1.csv',         name: 'BoneStab 1',      dur: 5000 },
    { csv: 'sans_bonestab2.csv',         name: 'BoneStab 2',      dur: 5000 },
    { csv: 'sans_bonestab3.csv',         name: 'BoneStab 3',      dur: 5000 },
    { csv: 'sans_final.csv',             name: 'Final Step_2',    dur: 15000 },
  ];

  const state = {
    phase: 'intro',
    turn: 0,
    modal: null, canvas: null, ctx: null,
    c2sfReady: false,
    c2sfCache: {},
    sansX: 320,
    player: { hp: PLAYER.maxHp, maxHp: PLAYER.maxHp, karma: 0, mercy: 0, items: [2,1,1,1], atk: PLAYER.atk, def: PLAYER.def, lv: PLAYER.lv },
    soulTeleportCooldown: 0,
    dialog: '', dialogTimer: 0,
    introIdx: 0,
    menuIdx: 0,
    fightBarPos: 0, fightDir: 1, fightActive: false,
    fightTargetCenter: 0.5,
    sansHurtT: 0,
    c2sfIdx: 0, c2sfStart: 0,
    keys: {}, virtualKeys: { up:false,down:false,left:false,right:false,confirm:false,jump:false },
    isMobile: false,
    shakeT: 0,
    // Sans 动画
    sansBlinkTimer: 0,
    sansEyeGlow: 0,
    // FIGHT 动画帧
    attackFrame: 0,
    attackFrameTimer: 0,
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
    state.sansX = 320;
    state.sansHurtT = 0;
    state.shakeT = 0;

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
    for (const p of PHASES) {
      if (state.c2sfCache[p.csv]) continue;
      C2SF.loadCSV(p.csv).then(d => { if (d) state.c2sfCache[p.csv] = d; });
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
    state.isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || window.innerWidth < 800;
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

  function onCanvasClick() {
    if (state.phase === 'intro') nextIntro();
    else if (state.phase === 'player_turn') selectMenu();
    else if (state.phase === 'fight') confirmFight();
    else if (['act_menu','item_menu','mercy_menu'].includes(state.phase)) selectSubMenu();
    else if (state.phase === 'defeat' || state.phase === 'victory') close();
  }

  function touchToCanvasPoint(clientX, clientY) {
    const rect = state.canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left) / rect.width * CW,
      y: (clientY - rect.top) / rect.height * CH,
    };
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
        else if (state.phase === 'defeat' || state.phase === 'victory') close();
      } else if (btn === 'b') {
        if (['act_menu','item_menu','mercy_menu'].includes(state.phase)) { state.phase = 'player_turn'; state.menuIdx = 0; }
        else if (state.phase === 'player_turn') close();
      } else {
        if (state.phase === 'enemy_turn' && typeof C2SF !== 'undefined' && state.c2sfReady) {
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
      else if (btn === 'a') state.virtualKeys.jump = false;
      if (state._dragTouchId === t.identifier) state._dragTouchId = null;
    }
  }

  // ============= INTRO =============
  function showIntro() { state.phase = 'intro'; state.introIdx = 0; state.dialog = BOSS.introLines[0]; }
  function nextIntro() {
    state.introIdx++;
    if (state.introIdx >= BOSS.introLines.length) { state.phase = 'player_turn'; state.menuIdx = 0; }
    else state.dialog = BOSS.introLines[state.introIdx];
  }

  // ============= DRAW =============
  function draw() {
    const ctx = state.ctx;
    if (!ctx) return;

    let shakeX = 0, shakeY = 0;
    if (typeof C2SF !== 'undefined' && C2SF.state) {
      const s = C2SF.state.shake;
      if (s > 0) { shakeX = (Math.random()*2-1) * 12 * s; shakeY = (Math.random()*2-1) * 12 * s; }
    }
    if (state.shakeT > 0) {
      shakeX += (Math.random()*2-1) * 6 * state.shakeT;
      shakeY += (Math.random()*2-1) * 6 * state.shakeT;
      state.shakeT -= 0.05;
    }

    ctx.save();
    ctx.translate(shakeX, shakeY);

    ctx.fillStyle = '#0c0a1a';
    ctx.fillRect(-20, -20, CW + 40, CH + 40);

    if (typeof C2SF !== 'undefined' && C2SF.state && C2SF.state.blackScreen > 0) {
      ctx.fillStyle = '#000';
      ctx.fillRect(-20, -20, CW + 40, CH + 40);
    }

    drawSans(ctx);

    drawDialog(ctx);

    if (state.phase === 'enemy_turn' && typeof C2SF !== 'undefined' && state.c2sfReady) {
      C2SF.draw(ctx);
    } else {
      drawBattleAreaFrame(ctx);
    }

    drawUI(ctx);

    if (state.phase === 'defeat') drawDefeatScreen(ctx);
    if (state.phase === 'victory') drawVictoryScreen(ctx);

    if (state.isMobile && state.phase !== 'defeat' && state.phase !== 'victory') {
      if (state.phase === 'enemy_turn') drawVirtualKeysBattle(ctx);
      else drawVirtualKeys(ctx);
    }

    ctx.restore();
  }

  function drawBattleAreaFrame(ctx) {
    const bx = 133, by = 226, bw = 375, bh = 165;
    ctx.save();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(bx - 1, by - 1, bw + 2, bh + 2);
    ctx.fillStyle = '#000';
    ctx.fillRect(bx, by, bw, bh);
    ctx.restore();
  }

  function drawSans(ctx) {
    const sx = state.sansX;
    const sy = 180;

    ctx.save();

    // Hurt flash
    if (state.sansHurtT > 0) {
      ctx.globalAlpha = state.sansHurtT;
      ctx.fillStyle = '#ff3333';
      ctx.fillRect(sx - 40, sy - 60, 80, 170);
      ctx.globalAlpha = 1;
    }

    // Hoodie body
    ctx.fillStyle = '#1a1a2a';
    ctx.fillRect(sx - 30, sy - 20, 60, 85);
    ctx.fillStyle = '#12121e';
    ctx.beginPath();
    ctx.arc(sx, sy - 38, 34, Math.PI * 0.95, Math.PI * 2.05);
    ctx.fill();
    ctx.fillStyle = '#151522';
    ctx.beginPath();
    ctx.arc(sx, sy - 40, 30, Math.PI * 1.05, Math.PI * 1.95);
    ctx.fill();
    // 口袋
    ctx.fillStyle = '#222238';
    ctx.fillRect(sx - 16, sy + 10, 32, 20);
    // 抽绳
    ctx.fillStyle = '#2a2a40';
    ctx.fillRect(sx - 8, sy + 8, 3, 18);
    ctx.fillRect(sx + 5, sy + 8, 3, 18);
    // 腿
    ctx.fillStyle = '#222240';
    ctx.fillRect(sx - 22, sy + 65, 18, 35);
    ctx.fillRect(sx + 4, sy + 65, 18, 35);
    // 鞋
    ctx.fillStyle = '#0a0a14';
    ctx.fillRect(sx - 26, sy + 98, 26, 10);
    ctx.fillRect(sx + 0, sy + 98, 26, 10);

    // Skull — 呼吸感浮动
    const bob = Math.sin(Date.now() / 400) * 1.5;
    ctx.save();
    ctx.translate(sx, sy - 35 + bob);

    ctx.fillStyle = '#e8e8e8';
    ctx.beginPath();
    ctx.ellipse(0, 0, 26, 28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#d4d4d4';
    ctx.beginPath();
    ctx.ellipse(-4, 2, 22, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    // 眼窝
    ctx.fillStyle = '#05050a';
    ctx.beginPath(); ctx.ellipse(-9, -2, 8, 10, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(+9, -2, 8, 10, 0, 0, Math.PI*2); ctx.fill();

    // 左瞳 — 蓝色 (Dusttale异色瞳)
    const leftGlow = 0.7 + Math.sin(Date.now() / 280) * 0.3;
    ctx.save();
    ctx.shadowColor = '#4488ff';
    ctx.shadowBlur = 12 * leftGlow;
    ctx.fillStyle = '#4488ff';
    ctx.beginPath(); ctx.arc(-9, -1, 3, 0, Math.PI*2); ctx.fill();
    ctx.restore();

    // 右瞳 — 红色激光 (Gaster Blaster)
    const rightGlow = 0.8 + Math.sin(Date.now() / 220 + 1) * 0.2;
    ctx.save();
    ctx.shadowColor = '#ff3333';
    ctx.shadowBlur = 14 * rightGlow;
    ctx.fillStyle = '#ff3333';
    ctx.beginPath(); ctx.arc(+9, -1, 3, 0, Math.PI*2); ctx.fill();
    ctx.restore();

    // 鼻子
    ctx.fillStyle = '#0a0a0f';
    ctx.beginPath();
    ctx.moveTo(0, 5); ctx.lineTo(-3, 10); ctx.lineTo(3, 10);
    ctx.closePath(); ctx.fill();

    // 嘴/牙
    ctx.strokeStyle = '#0a0a0f';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-7, 14); ctx.lineTo(+7, 14);
    ctx.stroke();
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-5, 14); ctx.lineTo(-5, 19);
    ctx.moveTo(-2, 14); ctx.lineTo(-2, 19);
    ctx.moveTo(+1, 14); ctx.lineTo(+1, 19);
    ctx.moveTo(+4, 14); ctx.lineTo(+4, 19);
    ctx.stroke();

    ctx.restore(); // skull

    ctx.restore(); // sans
  }

  function drawDialog(ctx) {
    if (!state.dialog) return;
    ctx.save();
    const dx = 60, dy = 20, dw = CW - 120, dh = 72;
    ctx.fillStyle = '#000';
    ctx.fillRect(dx, dy, dw, dh);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(dx, dy, dw, dh);
    ctx.fillStyle = '#ffffff';
    ctx.font = '13px "Courier New", monospace';
    ctx.textBaseline = 'top';
    const lines = state.dialog.split('\n');
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], dx + 12, dy + 8 + i * 17);
    }
    if ((Date.now() / 300 | 0) % 2 === 0) {
      ctx.fillText('▼', dx + dw - 18, dy + dh - 16);
    }
    ctx.restore();
  }

  function drawHPBar(ctx, x, y, w, h, hp, maxHp, karma) {
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.font = '11px monospace';
    ctx.textBaseline = 'top';
    ctx.fillText(PLAYER.name, x, y);
    ctx.fillText('LV ' + PLAYER.lv, x + 70, y);

    const barX = x + 110, barY = y - 2;
    const barW = w - 150, barH = 10;

    ctx.fillStyle = '#000';
    ctx.fillRect(barX, barY, barW, barH);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barW, barH);

    const yellowW = Math.max(0, barW * (hp / maxHp));
    const redW = Math.min(barW - yellowW, barW * (karma / maxHp));

    if (yellowW > 0) {
      ctx.fillStyle = '#ffee44';
      ctx.fillRect(barX, barY, yellowW, barH);
    }
    if (redW > 0) {
      ctx.fillStyle = '#aa44ff';
      ctx.fillRect(barX + yellowW, barY, redW, barH);
    }

    ctx.fillStyle = '#ffffff';
    ctx.font = '11px monospace';
    ctx.fillText(`HP ${hp}/${maxHp}`, barX + barW + 10, y);

    // KR 标签 + 进度条
    const krX = barX + barW + 85;
    ctx.fillStyle = '#cc66ff';
    ctx.fillText('KR', krX, y);
    ctx.fillStyle = '#1a0022';
    ctx.fillRect(krX + 20, y - 1, 50, barH);
    const krPct = Math.min(1, karma / maxHp);
    ctx.fillStyle = '#aa44ff';
    ctx.fillRect(krX + 20, y - 1, 50 * krPct, barH);
    ctx.strokeStyle = '#ffffff';
    ctx.strokeRect(krX + 20, y - 1, 50, barH);

    ctx.restore();
  }

  function drawUI(ctx) {
    const b = state.player;
    ctx.save();

    drawHPBar(ctx, 70, 322, CW - 140, 12, b.hp, b.maxHp, b.karma);

    if (state.phase === 'player_turn') drawMenuButtons(ctx);

    ctx.restore();

    if (state.phase === 'fight') drawFightBar(ctx);

    if (['act_menu','item_menu','mercy_menu'].includes(state.phase)) {
      drawSubMenu(ctx);
    }

    if (state.phase === 'enemy_turn') {
      ctx.save();
      ctx.fillStyle = '#888';
      ctx.font = '10px monospace';
      ctx.textAlign = 'right';
      const mode = (typeof C2SF !== 'undefined' && C2SF.state && C2SF.state.soul.mode === 0) ? 'BLUE' : 'RED';
      const phase = (typeof C2SF !== 'undefined' && C2SF.state) ? C2SF.state.phaseName : '';
      ctx.fillText(`${phase}  ${mode}`, CW - 12, 105);
      ctx.textAlign = 'left';
      ctx.restore();
    }
  }

  function drawMenuButtons(ctx) {
    const defs = [
      { label: 'FIGHT', col: '#ffee44' },
      { label: 'ACT',   col: '#ff8833' },
      { label: 'ITEM',  col: '#ff8833' },
      { label: 'MERCY', col: '#88ccff' },
    ];
    const btnY = 358;
    const btnH = 46;
    const btnGap = 8;
    const totalW = CW - 120;
    const btnW = (totalW - btnGap * 3) / 4;

    for (let i = 0; i < 4; i++) {
      const bx = 60 + i * (btnW + btnGap);
      const active = state.menuIdx === i;

      ctx.fillStyle = active ? '#1a1a2e' : '#0a0a14';
      ctx.fillRect(bx, btnY, btnW, btnH);
      ctx.strokeStyle = active ? defs[i].col : '#333355';
      ctx.lineWidth = active ? 2 : 1;
      ctx.strokeRect(bx, btnY, btnW, btnH);

      if (active) {
        ctx.save();
        ctx.shadowColor = defs[i].col;
        ctx.shadowBlur = 8;
      }
      ctx.fillStyle = active ? defs[i].col : '#888';
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(defs[i].label, bx + btnW/2, btnY + btnH/2 + 5);
      ctx.restore();
      if (active) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('▶', bx + 8, btnY + btnH/2 + 5);
      }
    }
    ctx.textAlign = 'left';
  }

  function drawFightBar(ctx) {
    ctx.save();
    const bx = 60, by = 260, bw = CW - 120, bh = 16;

    ctx.fillStyle = '#222';
    ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.strokeRect(bx, by, bw, bh);

    // 完美区域
    const sweetX = bx + bw * 0.42, sweetW = bw * 0.16;
    ctx.fillStyle = 'rgba(100,255,100,0.5)';
    ctx.fillRect(sweetX, by, sweetW, bh);

    // 好区域
    const greatX = bx + bw * 0.35, greatW = bw * 0.30;
    ctx.fillStyle = 'rgba(255,200,50,0.3)';
    ctx.fillRect(greatX, by, greatW, bh);

    // 指针
    const px = bx + state.fightBarPos * bw;
    const frameIdx = Math.floor(state.fightBarPos * 25);
    ctx.save();
    ctx.translate(px, by + bh/2);
    ctx.fillStyle = '#ffee44';
    ctx.shadowColor = '#ffee44';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(0, -14); ctx.lineTo(-6, 0); ctx.lineTo(0, 4); ctx.lineTo(6, 0); ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, 14); ctx.lineTo(-6, 0); ctx.lineTo(0, -4); ctx.lineTo(6, 0); ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = '#aaa';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('TAP / SPACE / CLICK to STOP', bx + bw/2, by - 12);
    ctx.textAlign = 'left';
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
    const bh = items.length * 28 + 16;
    ctx.fillStyle = '#000';
    ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = '#ffee44';
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, by, bw, bh);
    ctx.fillStyle = '#ffffff';
    ctx.font = '13px monospace';
    for (let i = 0; i < items.length; i++) {
      const iy = by + 12 + i * 28;
      if (i === state.menuIdx) {
        ctx.fillStyle = '#ffee44';
        ctx.fillText('▶', bx + 8, iy);
      } else {
        ctx.fillStyle = '#777';
      }
      ctx.fillText(items[i], bx + 28, iy);
    }
    ctx.restore();
  }

  function drawDefeatScreen(ctx) {
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.fillRect(0, 0, CW, CH);
    ctx.fillStyle = '#aa44ff';
    ctx.font = 'bold 32px monospace';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#aa44ff';
    ctx.shadowBlur = 20;
    ctx.fillText('GAME OVER', CW/2, CH/2 - 20);
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px monospace';
    ctx.fillText('* 点击 / SPACE 退出', CW/2, CH/2 + 30);
    ctx.restore();
  }

  function drawVictoryScreen(ctx) {
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.fillRect(0, 0, CW, CH);
    ctx.fillStyle = '#ffee44';
    ctx.font = 'bold 28px monospace';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#ffee44';
    ctx.shadowBlur = 20;
    ctx.fillText('★ 胜利 ★', CW/2, CH/2 - 20);
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px monospace';
    ctx.fillText('* 点击 / SPACE 退出', CW/2, CH/2 + 30);
    ctx.restore();
  }

  function drawVirtualKeys(ctx) {
    ctx.save();
    const dpx = 40, dpy = CH - 100;
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = '#4a4a66';
    ctx.beginPath(); ctx.arc(dpx + 30, dpy + 20, 20, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(dpx + 30, dpy + 80, 20, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(dpx + 10, dpy + 50, 20, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(dpx + 50, dpy + 50, 20, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('▲', dpx + 30, dpy + 20);
    ctx.fillText('▼', dpx + 30, dpy + 80);
    ctx.fillText('◀', dpx + 10, dpy + 50);
    ctx.fillText('▶', dpx + 50, dpy + 50);

    const bx = CW - 110, by = CH - 80;
    ctx.fillStyle = '#3a3a5a';
    ctx.beginPath(); ctx.arc(bx + 20, by + 40, 22, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#5a5a7a';
    ctx.beginPath(); ctx.arc(bx + 60, by + 15, 22, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('B', bx + 20, by + 40);
    ctx.fillText('A', bx + 60, by + 15);
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  function drawVirtualKeysBattle(ctx) {
    ctx.save();
    ctx.globalAlpha = 0.35;
    const dpx = 40, dpy = CH - 100;
    ctx.fillStyle = '#4a4a66';
    ctx.beginPath(); ctx.arc(dpx + 30, dpy + 20, 20, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(dpx + 30, dpy + 80, 20, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(dpx + 10, dpy + 50, 20, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(dpx + 50, dpy + 50, 20, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('▲', dpx + 30, dpy + 20);
    ctx.fillText('▼', dpx + 30, dpy + 80);
    ctx.fillText('◀', dpx + 10, dpy + 50);
    ctx.fillText('▶', dpx + 50, dpy + 50);

    if (typeof C2SF !== 'undefined' && C2SF.state && C2SF.state.soul.mode === 0) {
      const bx = CW - 110, by = CH - 80;
      ctx.fillStyle = '#3a6aff';
      ctx.beginPath(); ctx.arc(bx + 60, by + 15, 22, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('JUMP', bx + 60, by + 15);
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  // ============= UPDATE =============
  function update() {
    if (state.sansHurtT > 0) state.sansHurtT -= 0.05;

    if (state.phase === 'player_turn') {
      if (justPressed('arrowleft')) state.menuIdx = Math.max(0, state.menuIdx - 1);
      if (justPressed('arrowright')) state.menuIdx = Math.min(3, state.menuIdx + 1);
      if (justPressed('arrowup') || justPressed('arrowdown')) state.menuIdx = (state.menuIdx + 1) % 4;
    }
    if (state.phase === 'act_menu' || state.phase === 'item_menu' || state.phase === 'mercy_menu') {
      if (justPressed('arrowup')) state.menuIdx = Math.max(0, state.menuIdx - 1);
      if (justPressed('arrowdown')) state.menuIdx++;
    }
    if (state.phase === 'fight') {
      state.fightBarPos += state.fightDir * 0.014;
      if (state.fightBarPos >= 1) { state.fightBarPos = 1; state.fightDir = -1; }
      if (state.fightBarPos <= 0) { state.fightBarPos = 0; state.fightDir = 1; }
    }
  }

  // ============= MENU ACTIONS =============
  function selectMenu() {
    if (state.phase !== 'player_turn') return;
    const idx = state.menuIdx;
    if (idx === 0) { state.phase = 'fight'; state.fightBarPos = Math.random() * 0.5; state.fightDir = 1; }
    else if (idx === 1) { state.phase = 'act_menu'; state.menuIdx = 0; }
    else if (idx === 2) { state.phase = 'item_menu'; state.menuIdx = 0; }
    else if (idx === 3) { state.phase = 'mercy_menu'; state.menuIdx = 0; }
  }

  function confirmFight() {
    if (state.phase !== 'fight') return;
    const pos = state.fightBarPos;
    let mult = 0.5, label = 'MISS!', col = '#666666';
    if (pos >= 0.44 && pos <= 0.56) { mult = 2.0; label = 'PERFECT!'; col = '#ffee44'; }
    else if (pos >= 0.38 && pos <= 0.62) { mult = 1.5; label = 'GREAT!'; col = '#ffaa44'; }
    else if (pos >= 0.3 && pos <= 0.7) { mult = 1.0; label = 'OK'; col = '#aaffaa'; }
    else { mult = 0.5; label = 'MISS'; col = '#ff6666'; }

    const damage = Math.round(PLAYER.atk * mult);

    if (state.turn < BOSS.sansoverturn) {
      // BOSS 闪避
      state.phase = 'player_turn';
      state.menuIdx = 0;
      state.dialog = BOSS.dodgeText;
      state.shakeT = 0.5;
      if (typeof C2SF !== 'undefined') {
        C2SF.shake(0.3);
        C2SF.spawnDust(state.sansX + 15, 180 - 20, 12);
        C2SF.spawnDust(state.sansX - 15, 180 - 20, 12);
      }
      state.turn++;
      setTimeout(() => startEnemyTurn(), 1800);
      return;
    }

    // 命中!
    state.phase = 'player_turn';
    state.menuIdx = 0;
    state.dialog = `${label} — ${damage} damage!`;
    state.sansHurtT = 1.0;
    state.shakeT = 0.8;

    if (typeof C2SF !== 'undefined') {
      C2SF.shake(1.2);
      C2SF.spawnDust(state.sansX, 180, 25);
      C2SF.spawnDamageText(state.sansX, 140, String(damage), col);
    }

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
      state.dialog = acts[idx] === 'Check' ? BOSS.checkText
                   : acts[idx] === 'Complaint' ? BOSS.complainText
                   : acts[idx] === 'Talk' ? BOSS.talkText
                   : BOSS.flirtText;
      state.player.mercy += 5;
      state.turn++;
      setTimeout(() => startEnemyTurn(), 2000);
    } else if (p === 'item_menu') {
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

  // ============= ENEMY TURN =============
  function startEnemyTurn() {
    state.phase = 'enemy_turn';
    state.dialog = '';
    if (typeof C2SF === 'undefined' || !state.c2sfReady) {
      state.dialog = '* (弹幕引擎未加载)';
      setTimeout(() => { state.phase = 'player_turn'; }, 2000);
      return;
    }
    const phase = PHASES[state.c2sfIdx % PHASES.length];
    state.c2sfIdx++;
    const csvData = state.c2sfCache[phase.csv];
    if (csvData) {
      C2SF.startAttack(csvData, phase.name);
    } else {
      C2SF.loadCSV(phase.csv).then(d => {
        if (d) { state.c2sfCache[phase.csv] = d; C2SF.startAttack(d, phase.name); }
      });
    }
    state.c2sfStart = performance.now();
  }

  function checkEnemyTurn() {
    if (state.phase !== 'enemy_turn') return;
    if (typeof C2SF === 'undefined' || !state.c2sfReady) return;

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

    const hit = C2SF.collidesBullet();
    if (hit && state.soulTeleportCooldown <= 0) {
      state.soulTeleportCooldown = 12;

      const dmg = 5;
      state.player.hp -= dmg;

      // Karma紫血：HP < 0 时溢出为 KR
      if (state.player.hp < 0) {
        state.player.karma += -state.player.hp;
        state.player.hp = 0;
      } else {
        // HP>0 但 KR 存在时，KR自然减少
        state.player.karma = Math.max(0, state.player.karma - 2);
      }

      if (typeof C2SF !== 'undefined') {
        C2SF.shake(0.8);
        C2SF.hitFlash();
        C2SF.spawnDamageText(cs.x, cs.y - 20, String(dmg), '#ff4444');
      }

      if (state.player.hp <= 0 && state.player.karma >= PLAYER.maxHp) {
        state.player.hp = 0;
        state.phase = 'defeat';
        state.dialog = BOSS.onKillText;
        return;
      }
      // HP=0 但 KR < maxHp，玩家不会死，还能继续
      if (state.player.hp <= 0) {
        state.player.hp = 0;
      }
    }
    if (state.soulTeleportCooldown > 0) state.soulTeleportCooldown--;

    // Karma 自动缓慢减少
    if (state.player.karma > 0 && !hit) {
      state.player.karma = Math.max(0, state.player.karma - 0.01);
    }

    if (!C2SF.isRunning()) {
      setTimeout(() => {
        if (state.player.hp > 0 || state.player.karma < PLAYER.maxHp) {
          state.phase = 'player_turn'; state.menuIdx = 0;
        }
      }, 800);
    }
  }

  // ============= LOOP =============
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

  // ============= PUBLIC =============
  function openBossSelect() { startBattle(); }
  window.UndertaleBattle = { startBattle, close, openBossSelect };
  window.openBossSelect = openBossSelect;
})();
