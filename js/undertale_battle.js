// ===== Undertale Sans BOSS 战引擎 v92 =====
// 渲染全面升级：震动、伤害飘字接收、BHUTE 风格 UI、HP/KR 血条、FIGHT mini-game
// 固定 640x480 内部分辨率，CSS object-fit:contain 自动横竖屏

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
    { csv: 'sans_final.csv',             name: 'Final Step_2',    dur: 12000 },
  ];

  const BHUTE_PATH = 'assets/c2sf_bhute/';

  const UI_SPRITES = {
    hpTop: null, hpBottom: null, hpName: null, krName: null,
    fightBtn: null, actBtn: null, itemBtn: null, mercyBtn: null,
    target条: null,
    attackFrames: [],
  };

  const state = {
    phase: 'intro',
    turn: 0,
    modal: null, canvas: null, ctx: null,
    c2sfReady: false,
    c2sfCache: {},
    sansX: 320,
    player: { hp: PLAYER.maxHp, maxHp: PLAYER.maxHp, karma: 0, mercy: 0, items: [2,1,1,1], atk: PLAYER.atk, def: PLAYER.def, lv: PLAYER.lv },
    soulTeleportCooldown: 0,
    dialog: '', dialogTimer: 0, dialogNextCb: null,
    introIdx: 0,
    menuIdx: 0, menus: [],
    fightBarPos: 0, fightDir: 1, fightActive: false,
    hitFlash: 0,
    sansSlamT: 0,
    c2sfIdx: 0, c2sfStart: 0,
    keys: {}, virtualKeys: { up:false,down:false,left:false,right:false,confirm:false,jump:false },
    dpr: 1,
    // Sans 动画
    sansBlinkTimer: 0,
    sansEyeGlow: 0,
    // FIGHT mini-game target
    fightTargetX: 0.5,
  };

  // ============= UI Sprite Loading =============
  function loadUISprites() {
    const defs = [
      ['hpTop',     'spr_hp_top_0.png'],
      ['hpBottom',  'spr_hp_bottom_0.png'],
      ['hpName',    'spr_hpname_0.png'],
      ['krName',    'spr_kr_0.png'],
      ['fightBtn',  'spr_fight_0.png'],
      ['actBtn',    'spr_act_0.png'],
      ['itemBtn',   'spr_item_0.png'],
      ['mercyBtn',  'spr_mercy_0.png'],
      ['target条',  'spr_target_0.png'],
    ];
    const proms = defs.map(([key, file]) => new Promise(resolve => {
      const img = new Image();
      img.onload = () => { UI_SPRITES[key] = img; resolve(); };
      img.onerror = () => resolve();
      img.src = BHUTE_PATH + file;
    }));
    // Attack frames
    for (let i = 0; i < 25; i++) {
      proms.push(new Promise(resolve => {
        const img = new Image();
        img.onload = () => { UI_SPRITES.attackFrames[i] = img; resolve(); };
        img.onerror = () => resolve();
        img.src = BHUTE_PATH + `spr_attack_${i}.png`;
      }));
    }
    return Promise.all(proms);
  }

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
    loadUISprites();

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
      else if (btn === 'a' && state.virtualKeys.jump) state.virtualKeys.jump = false;
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

    // 屏幕震动 —— 整个 canvas 偏移
    let shakeX = 0, shakeY = 0;
    if (typeof C2SF !== 'undefined' && C2SF.state) {
      const s = C2SF.state.shake;
      if (s > 0) { shakeX = (Math.random()*2-1) * 10 * s; shakeY = (Math.random()*2-1) * 10 * s; }
    }
    ctx.save();
    ctx.translate(shakeX, shakeY);

    // 背景（Dusttale 暗紫色调）
    ctx.fillStyle = '#0c0a1a';
    ctx.fillRect(-20, -20, CW + 40, CH + 40);

    // 命中红闪
    if (state.hitFlash > 0) {
      ctx.fillStyle = `rgba(255,50,50,${state.hitFlash})`;
      ctx.fillRect(-20, -20, CW + 40, CH + 40);
    }

    // Sans
    drawSans(ctx);

    // Dialog box top
    drawDialog(ctx);

    // Battle area (C2SF 弹幕层)
    if (state.phase === 'enemy_turn' && typeof C2SF !== 'undefined' && state.c2sfReady) {
      C2SF.draw(ctx);
    } else {
      drawBattleAreaFrame(ctx);
    }

    // UI - HP, KR, menu buttons
    drawUI(ctx);

    // Virtual keys on mobile
    if (state.isMobile && state.phase !== 'enemy_turn') drawVirtualKeys(ctx);
    if (state.isMobile && state.phase === 'enemy_turn') drawVirtualKeysBattle(ctx);

    ctx.restore();

    // 黑屏过渡（clip 外）
    if (typeof C2SF !== 'undefined' && C2SF.state && C2SF.state.blackScreen > 0) {
      ctx.fillStyle = 'rgba(0,0,0,1)';
      ctx.fillRect(0, 0, CW, CH);
    }
  }

  function drawBattleAreaFrame(ctx) {
    const bx = 133, by = 226, bw = 375, bh = 165;
    ctx.save();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(bx - 1, by - 1, bw + 2, bh + 2);
    ctx.restore();
  }

  // BHUTE 风格 Sans 绘制（更精致的骷髅 + 异色瞳 + 表情）
  function drawSans(ctx) {
    const sx = state.sansX;
    const sy = 180;

    // Hoodie body（完整）
    ctx.save();
    // Hoodie 阴影
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(sx - 32, sy - 20, 64, 90);
    // Hoodie 主体
    ctx.fillStyle = '#1a1a2a';
    ctx.fillRect(sx - 30, sy - 20, 60, 85);
    // Hoodie 帽子（后）
    ctx.fillStyle = '#12121e';
    ctx.beginPath();
    ctx.arc(sx, sy - 38, 34, Math.PI * 0.95, Math.PI * 2.05);
    ctx.fill();
    // Hoodie 帽子（前）
    ctx.beginPath();
    ctx.arc(sx, sy - 40, 30, Math.PI * 1.05, Math.PI * 1.95);
    ctx.fill();
    // 胸前口袋
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

    // Skull（有呼吸感，轻微上下浮动）
    const bob = Math.sin(Date.now() / 400) * 1.5;
    ctx.save();
    ctx.translate(sx, sy - 35 + bob);

    // Skull 主体（白色，有阴影）
    ctx.fillStyle = '#e8e8e8';
    ctx.beginPath();
    ctx.ellipse(0, 0, 26, 28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#d4d4d4';
    ctx.beginPath();
    ctx.ellipse(-4, 2, 22, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eye sockets（深黑 + 柔化边缘）
    ctx.fillStyle = '#05050a';
    ctx.beginPath(); ctx.ellipse(-9, -2, 8, 10, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(+9, -2, 8, 10, 0, 0, Math.PI*2); ctx.fill();

    // Left eye — 蓝色 glow (Dusttale 异色瞳)
    ctx.save();
    const glowIntensity = 0.6 + Math.sin(Date.now() / 300) * 0.2;
    ctx.shadowColor = '#4488ff';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#4488ff';
    ctx.beginPath(); ctx.arc(-9, -1, 3, 0, Math.PI*2); ctx.fill();
    ctx.restore();

    // Right eye — 红色 laser（Gaster Blaster 激光预警）
    ctx.save();
    ctx.shadowColor = '#ff3333';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#ff3333';
    ctx.beginPath(); ctx.arc(+9, -1, 3, 0, Math.PI*2); ctx.fill();
    ctx.restore();

    // Nose
    ctx.fillStyle = '#0a0a0f';
    ctx.beginPath();
    ctx.moveTo(0, 5); ctx.lineTo(-3, 10); ctx.lineTo(3, 10);
    ctx.closePath(); ctx.fill();

    // Teeth/mouth（Undertale 风格）
    ctx.strokeStyle = '#0a0a0f';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-7, 14);
    ctx.lineTo(+7, 14);
    ctx.stroke();
    // 牙齿小竖线
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-5, 14); ctx.lineTo(-5, 19);
    ctx.moveTo(-2, 14); ctx.lineTo(-2, 19);
    ctx.moveTo(+1, 14); ctx.lineTo(+1, 19);
    ctx.moveTo(+4, 14); ctx.lineTo(+4, 19);
    ctx.stroke();

    ctx.restore(); // skull

    // Sans Slam 效果
    if (state.sansSlamT > 0) {
      ctx.fillStyle = `rgba(255,255,255,${Math.min(1, state.sansSlamT)})`;
      ctx.fillRect(-50, -50, CW + 100, CH + 100);
    }

    ctx.restore(); // sans
  }

  function drawDialog(ctx) {
    if (!state.dialog) return;
    ctx.save();
    const dx = 60, dy = 20, dw = CW - 120, dh = 72;
    // 黑色背景
    ctx.fillStyle = '#000';
    ctx.fillRect(dx, dy, dw, dh);
    // 白边
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(dx, dy, dw, dh);
    // 文字
    ctx.fillStyle = '#ffffff';
    ctx.font = '13px "Courier New", monospace';
    ctx.textBaseline = 'top';
    const lines = state.dialog.split('\n');
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], dx + 12, dy + 8 + i * 17);
    }
    // 闪烁 ▼
    if ((Date.now() / 300 | 0) % 2 === 0) {
      ctx.fillText('▼', dx + dw - 18, dy + dh - 16);
    }
    ctx.restore();
  }

  // BHUTE 风格 HP/KR 血条
  function drawHPBar(ctx, x, y, w, h, hp, maxHp, karma) {
    ctx.save();

    // Name label 背景 + 文字
    const nImg = UI_SPRITES.hpName;
    if (nImg) {
      ctx.drawImage(nImg, x, y - 1);
      ctx.fillStyle = '#000';
      ctx.font = '10px monospace';
      ctx.textBaseline = 'top';
      ctx.fillText(PLAYER.name, x + 4, y + 1);
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.font = '11px monospace';
      ctx.textBaseline = 'top';
      ctx.fillText(PLAYER.name, x, y);
    }

    // LV
    ctx.fillStyle = '#ffffff';
    ctx.font = '11px monospace';
    ctx.fillText('LV ' + PLAYER.lv, x + 70, y);

    // Top HP frame
    const topImg = UI_SPRITES.hpTop;
    const bottomImg = UI_SPRITES.hpBottom;
    const barX = x + 110, barY = y - 2;
    const barW = w - 150, barH = bottomImg ? 10 : h;

    // Bottom (黑底+边框)
    if (bottomImg) ctx.drawImage(bottomImg, barX, barY - 4, barW, bottomImg.height * (barW / bottomImg.width));
    else {
      ctx.fillStyle = '#000';
      ctx.fillRect(barX, barY, barW, barH);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.strokeRect(barX, barY, barW, barH);
    }

    // HP 黄色部分
    const yellowW = Math.max(0, barW * (hp / maxHp));
    // 被 karma 占据的红色部分
    const redW = Math.min(barW - yellowW, barW * (karma / maxHp));

    // 黄色（HP）
    if (yellowW > 0) {
      ctx.fillStyle = '#ffee44';
      ctx.fillRect(barX, barY - 1, yellowW, barH + 2);
    }
    // 红色（溢出伤害 — 等 Undertale 原版是 KR 占了黄色位置）
    if (redW > 0) {
      ctx.fillStyle = '#ff3333';
      ctx.fillRect(barX + yellowW, barY - 1, redW, barH + 2);
    }

    // Top frame（盖住填充顶端 → 精致上下框效果）
    if (topImg) ctx.drawImage(topImg, barX - 2, barY - 8, barW + 4, topImg.height * ((barW + 4) / topImg.width));

    // HP 数值文字
    ctx.fillStyle = '#ffffff';
    ctx.font = '11px monospace';
    ctx.textBaseline = 'top';
    ctx.fillText(`HP ${hp}/${maxHp}`, barX + barW + 10, y);

    // KR (Karma — 紫血)
    const krX = barX + barW + 85;
    const krImg = UI_SPRITES.krName;
    if (krImg) ctx.drawImage(krImg, krX, y - 1);
    ctx.fillStyle = '#cc66ff';
    const krW = 50;
    const krFilled = Math.max(0, krW * Math.min(1, karma / maxHp));
    ctx.fillStyle = '#1a0022';
    ctx.fillRect(krX + 30, y, krW, barH);
    ctx.fillStyle = '#aa44ff';
    ctx.fillRect(krX + 30 + (krW - krFilled), y, krFilled, barH);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(krX + 30, y, krW, barH);

    ctx.restore();
  }

  // BHUTE 风格 Battle UI
  function drawUI(ctx) {
    const b = state.player;
    ctx.save();

    // HP/KR 血条
    drawHPBar(ctx, 70, 322, CW - 140, 12, b.hp, b.maxHp, b.karma);

    // Menu 按钮（BHUTE spr_fight/spr_act/spr_item/spr_mercy 风格）
    if (state.phase === 'player_turn') drawMenuButtons(ctx);

    ctx.restore();

    // FIGHT mini-game
    if (state.phase === 'fight') drawFightBar(ctx);
    if (state.phase === 'fight_target') drawFightTarget(ctx);

    // Sub-menus
    if (state.phase === 'act_menu' || state.phase === 'item_menu' || state.phase === 'mercy_menu') {
      drawSubMenu(ctx);
    }

    // Enemy turn indicator
    if (state.phase === 'enemy_turn') {
      ctx.save();
      ctx.fillStyle = '#888';
      ctx.font = '10px monospace';
      ctx.textAlign = 'right';
      const mode = (typeof C2SF !== 'undefined' && C2SF.state && C2SF.state.soul.mode === 0) ? 'BLUE' : 'RED';
      const phase = (typeof C2SF !== 'undefined' && C2SF.state) ? C2SF.state.phaseName : '';
      ctx.fillText(`${phase}  ${mode}`, CW - 12, 105);
      ctx.fillStyle = '#4488ff';
      ctx.fillRect(CW - 80, 102, 3, 3);
      ctx.fillStyle = '#ff4444';
      ctx.fillRect(CW - 76, 102, 3, 3);
      ctx.textAlign = 'left';
      ctx.restore();
    }
  }

  function drawMenuButtons(ctx) {
    const defs = [
      { label: 'FIGHT', img: UI_SPRITES.fightBtn, col: '#ffee44', key: 'Fight' },
      { label: 'ACT',   img: UI_SPRITES.actBtn,   col: '#ff8833', key: 'Act' },
      { label: 'ITEM',  img: UI_SPRITES.itemBtn,  col: '#ff8833', key: 'Item' },
      { label: 'MERCY', img: UI_SPRITES.mercyBtn, col: '#ff8833', key: 'Mercy' },
    ];
    const btnY = 358;
    const btnH = 46;
    const btnGap = 8;
    const totalW = CW - 120;
    const btnW = (totalW - btnGap * 3) / 4;

    for (let i = 0; i < 4; i++) {
      const bx = 60 + i * (btnW + btnGap);
      const active = state.menuIdx === i;

      // 使用 BHUTE button sprite 或 fallback
      if (defs[i].img) {
        const img = defs[i].img;
        ctx.save();
        if (active) {
          ctx.shadowColor = defs[i].col;
          ctx.shadowBlur = 8;
        }
        ctx.drawImage(img, bx, btnY, btnW, btnH);
        if (!active) ctx.globalAlpha = 0.7;
        ctx.fillStyle = active ? defs[i].col : '#999999';
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(defs[i].label, bx + btnW/2, btnY + btnH/2 + 5);
        ctx.restore();
      } else {
        ctx.fillStyle = active ? '#1a1a2e' : '#0a0a14';
        ctx.fillRect(bx, btnY, btnW, btnH);
        ctx.strokeStyle = active ? defs[i].col : '#333355';
        ctx.lineWidth = active ? 2 : 1;
        ctx.strokeRect(bx, btnY, btnW, btnH);
        ctx.fillStyle = active ? defs[i].col : '#888';
        ctx.font = '14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(defs[i].label, bx + btnW/2, btnY + btnH/2 + 5);
      }

      if (active) {
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px monospace';
        ctx.fillText('▶', bx + 10, btnY + btnH/2 + 5);
        ctx.restore();
      }
    }
    ctx.textAlign = 'left';
  }

  // BHUTE spr_target 风格 FIGHT mini-game —— 完整复刻目标条
  function drawFightBar(ctx) {
    ctx.save();
    const bx = 60, by = 260, bw = CW - 120, bh = 16;
    // 目标条
    const target = UI_SPRITES.target条;
    if (target) {
      const targetH = target.height * (bw / target.width);
      ctx.drawImage(target, bx, by - (targetH - bh) / 2, bw, targetH);
    } else {
      ctx.fillStyle = '#222';
      ctx.fillRect(bx, by, bw, bh);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.strokeRect(bx, by, bw, bh);
    }
    // 完美区域（绿色条）
    const sweetX = bx + bw * 0.42, sweetW = bw * 0.16;
    ctx.fillStyle = 'rgba(100,255,100,0.6)';
    ctx.fillRect(sweetX, by - 1, sweetW, bh + 2);

    // 指针（攻击帧动画）
    const px = bx + state.fightBarPos * bw;
    const frameIdx = Math.floor(state.fightBarPos * UI_SPRITES.attackFrames.length);
    const frameImg = UI_SPRITES.attackFrames[frameIdx];
    if (frameImg) {
      ctx.drawImage(frameImg, px - frameImg.width/2, by - 8, frameImg.width * 1.5, frameImg.height * 1.5);
    } else {
      ctx.fillStyle = '#ffee44';
      ctx.fillRect(px - 3, by - 4, 6, bh + 8);
    }

    ctx.fillStyle = '#aaa';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('TAP / SPACE to STOP', bx + bw/2, by - 12);
    ctx.textAlign = 'left';
    ctx.restore();
  }

  function drawFightTarget(ctx) {
    // 保留兼容
    drawFightBar(ctx);
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

  function drawVirtualKeys(ctx) {
    ctx.save();
    const dpx = 40, dpy = CH - 100;
    ctx.globalAlpha = 0.55;
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
    ctx.globalAlpha = 0.4;
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

    // 只在蓝魂时显示 A=JUMP 提示
    if (typeof C2SF !== 'undefined' && C2SF.state && C2SF.state.soul.mode === 0) {
      const bx = CW - 110, by = CH - 80;
      ctx.fillStyle = '#3a6aff';
      ctx.beginPath(); ctx.arc(bx + 60, by + 15, 22, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('JUMP', bx + 60, by + 15);
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  // ============= UPDATE =============
  function update() {
    state.hitFlash = Math.max(0, state.hitFlash - 0.03);
    if (state.sansSlamT > 0) state.sansSlamT -= 0.04;

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
      state.fightBarPos += state.fightDir * 0.015;
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
    let mult = 0.5, label = 'BAD!';
    if (pos >= 0.45 && pos <= 0.55) { mult = 2.0; label = 'PERFECT!'; }
    else if (pos >= 0.38 && pos <= 0.62) { mult = 1.5; label = 'GREAT!'; }
    else if (pos >= 0.3 && pos <= 0.7) { mult = 1.0; label = 'OK'; }
    else { mult = 0.7; label = 'MISS'; }
    state.phase = 'player_turn';
    state.menuIdx = 0;

    const damage = Math.round(PLAYER.atk * mult);
    state.dialog = `${label} — ${damage} damage!`;

    // 震动 + 伤害飘字
    if (typeof C2SF !== 'undefined') {
      C2SF.shookSet(0.6);
      C2SF.spawnDamageNum(state.sansX, 160, damage);
      C2SF.spawnDust(state.sansX, 180, 15, '#ffdd44');
    }

    if (state.turn < BOSS.sansoverturn) {
      state.dialog = BOSS.dodgeText;
      setTimeout(() => { state.turn++; startEnemyTurn(); }, 1500);
      return;
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
      setTimeout(() => { state.turn++; startEnemyTurn(); }, 2000);
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
      state.hitFlash = 1.0;
      const dmg = 5;
      state.player.hp -= dmg;
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

    if (!C2SF.isRunning()) {
      setTimeout(() => {
        if (state.player.hp > 0) { state.phase = 'player_turn'; state.menuIdx = 0; }
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
