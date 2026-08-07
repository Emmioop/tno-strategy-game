// ===== Undertale Sans BOSS 战引擎 v110 =====
// 完整 sans-simulator 贴图版: Sans sprite sheet + speech bubble + HP bar + UI icons + touch buttons
// 640x480 内部分辨率, CSS object-fit:contain 自动横竖屏放大

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
    sansBodyFrame: 0, sansBodyFrameTime: 0,
    sansHeadFrame: 0, sansHeadFrameTime: 0,
    sansBlinkTimer: 0,
    sansEyeGlow: 0,
    player: { hp: PLAYER.maxHp, maxHp: PLAYER.maxHp, karma: 0, mercy: 0, items: [2,1,1,1], atk: PLAYER.atk, def: PLAYER.def, lv: PLAYER.lv },
    soulTeleportCooldown: 0,
    dialog: '', dialogTimer: 0,
    introIdx: 0,
    menuIdx: 0,
    fightBarPos: 0, fightDir: 1, fightActive: false,
    sansHurtT: 0,
    c2sfIdx: 0, c2sfStart: 0,
    keys: {},
    virtualKeys: { up:false,down:false,left:false,right:false,confirm:false,jump:false },
    isMobile: false,
    shakeT: 0,
    touchDpadHold: 0,
  };

  function close() {
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('orientationchange', onResize);
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
      <canvas id="ub-c" width="${CW}" height="${CH}" style="width:100vw;height:100vh;object-fit:contain;background:#000;image-rendering:pixelated;image-rendering:crisp-edges;touch-action:none;"></canvas>
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
    state.canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    state.canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    state.canvas.addEventListener('touchend', onTouchEnd, { passive: false });
    state.canvas.addEventListener('touchcancel', onTouchEnd, { passive: false });
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
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

  function touchToCanvasPoint(clientX, clientY) {
    const rect = state.canvas.getBoundingClientRect();
    // object-fit:contain means canvas letterboxes. Need to account for that.
    const scale = Math.min(rect.width / CW, rect.height / CH);
    const drawW = CW * scale;
    const drawH = CH * scale;
    const offX = (rect.width - drawW) / 2;
    const offY = (rect.height - drawH) / 2;
    const nx = (clientX - rect.left - offX) / scale;
    const ny = (clientY - rect.top - offY) / scale;
    return { x: nx, y: ny };
  }

  function hitVirtualBtn(px, py) {
    // Left D-Pad cluster (for enemy_turn mode)
    const cx = 75, cy = CH - 75;
    if (Math.hypot(px - cx, py - cy) < 40) {
      const dx = px - cx, dy = py - cy;
      if (Math.abs(dx) > Math.abs(dy)) return dx < 0 ? 'left' : 'right';
      return dy < 0 ? 'up' : 'down';
    }
    // Right jump/action button cluster
    const bx = CW - 75, by = CH - 75;
    if (Math.hypot(px - bx, py - by) < 40) return 'a';
    // Battlefield drag zone (enemy turn, in combat zone)
    if (state.phase === 'enemy_turn' && typeof C2SF !== 'undefined' && C2SF.state) {
      const z = C2SF.state.cz;
      if (px >= z.l && px <= z.r && py >= z.t && py <= z.b) return 'drag';
    }
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
      } else if (btn === 'drag') {
        state._dragTouchId = t.identifier;
        const cs = C2SF.state.soul;
        const z = C2SF.state.cz;
        cs.x = Math.max(z.l + 6, Math.min(z.r - 6, p.x));
        cs.y = Math.max(z.t + 6, Math.min(z.b - 6, p.y));
        cs.vx = 0; cs.vy = 0;
      } else {
        if (state.phase === 'intro') nextIntro();
        else if (state.phase === 'player_turn') selectMenu();
        else if (state.phase === 'fight') confirmFight();
        else if (['act_menu','item_menu','mercy_menu'].includes(state.phase)) selectSubMenu();
        else if (state.phase === 'enemy_turn' && typeof C2SF !== 'undefined') {
          const z = C2SF.state.cz;
          if (p.x >= z.l && p.x <= z.r && p.y >= z.t && p.y <= z.b) {
            state._dragTouchId = t.identifier;
            C2SF.state.soul.x = Math.max(z.l + 6, Math.min(z.r - 6, p.x));
            C2SF.state.soul.y = Math.max(z.t + 6, Math.min(z.b - 6, p.y));
            C2SF.state.soul.vx = 0; C2SF.state.soul.vy = 0;
          }
        } else if (state.phase === 'defeat' || state.phase === 'victory') close();
      }
    }
  }
  function onTouchMove(e) {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (state._dragTouchId === t.identifier && state.phase === 'enemy_turn' && typeof C2SF !== 'undefined') {
        const p = touchToCanvasPoint(t.clientX, t.clientY);
        const z = C2SF.state.cz;
        C2SF.state.soul.x = Math.max(z.l + 6, Math.min(z.r - 6, p.x));
        C2SF.state.soul.y = Math.max(z.t + 6, Math.min(z.b - 6, p.y));
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

  // ============= SPRITE HELPERS =============
  function getSprite(name) {
    if (typeof C2SF !== 'undefined' && C2SF.sp) return C2SF.sp[name];
    return null;
  }

  function drawSpriteFrame(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
    if (!img || !img.complete || img.naturalWidth === 0) return false;
    ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
    return true;
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

    if (state.phase === 'enemy_turn' && typeof C2SF !== 'undefined' && state.c2sfReady) {
      C2SF.draw(ctx);
    } else {
      drawBattleAreaFrame(ctx);
    }

    drawDialog(ctx);

    drawUI(ctx);

    if (state.phase === 'defeat') drawDefeatScreen(ctx);
    if (state.phase === 'victory') drawVictoryScreen(ctx);

    // Virtual keys ON TOP (mobile)
    if (state.isMobile && state.phase !== 'defeat' && state.phase !== 'victory') {
      drawVirtualKeys(ctx);
    }

    ctx.restore();
  }

  function drawBattleAreaFrame(ctx) {
    const bx = 239, by = 226, bw = 166, bh = 165;
    ctx.save();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(bx - 1, by - 1, bw + 2, bh + 2);
    ctx.fillStyle = '#000';
    ctx.fillRect(bx, by, bw, bh);
    ctx.restore();
  }

  function drawSans(ctx) {
    const sp = typeof C2SF !== 'undefined' ? C2SF.sp : null;
    const sx = state.sansX;
    const baseY = 210;

    ctx.save();

    // Hurt flash
    if (state.sansHurtT > 0) {
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
    }

    // Sans body sprites - 32x32 frames from 256x256 sheet
    const body = sp ? sp['sansbody0'] : null;
    if (body && body.complete && body.naturalWidth > 0) {
      state.sansBodyFrameTime += 0.016;
      if (state.sansBodyFrameTime > 0.15) {
        state.sansBodyFrameTime = 0;
        state.sansBodyFrame = (state.sansBodyFrame + 1) % 4;
      }
      const fw = body.naturalWidth / 8;
      const fh = body.naturalHeight / 8;
      const bob = Math.sin(Date.now() / 300) * 1;
      // body center frame
      ctx.drawImage(body, state.sansBodyFrame * fw, 0, fw, fh,
                    sx - 48, baseY - 24 + bob, 96, 96);
      ctx.drawImage(body, state.sansBodyFrame * fw, fh, fw, fh,
                    sx - 48, baseY + 48 + bob, 96, 96);
    } else {
      // Fallback: hoodie
      ctx.fillStyle = '#1a1a2a';
      ctx.fillRect(sx - 30, baseY - 20, 60, 85);
    }

    // Sans head - 32x32 frames from 128x128 sheet
    const head = sp ? sp['sanshead'] : null;
    if (head && head.complete && head.naturalWidth > 0) {
      state.sansHeadFrameTime += 0.016;
      if (state.sansHeadFrameTime > 0.03) {
        state.sansHeadFrameTime = 0;
        state.sansHeadFrame++;
      }
      const fw = head.naturalWidth / 4;
      const fh = head.naturalHeight / 4;
      const bob = Math.sin(Date.now() / 400) * 1.5;
      ctx.drawImage(head, (state.sansHeadFrame % 4) * fw, 0, fw, fh,
                    sx - 40, baseY - 60 + bob, 80, 80);
    } else {
      // Fallback skull
      const bob = Math.sin(Date.now() / 400) * 1.5;
      ctx.save();
      ctx.translate(sx, baseY - 35 + bob);
      ctx.fillStyle = '#e8e8e8';
      ctx.beginPath(); ctx.ellipse(0, 0, 26, 28, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#05050a';
      ctx.beginPath(); ctx.ellipse(-9, -2, 8, 10, 0, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(+9, -2, 8, 10, 0, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#4488ff'; ctx.beginPath(); ctx.arc(-9, -1, 3, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#ff3333'; ctx.beginPath(); ctx.arc(+9, -1, 3, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = '#0a0a0f'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(-7, 14); ctx.lineTo(+7, 14); ctx.stroke();
      ctx.restore();
    }

    if (state.sansHurtT > 0) {
      ctx.globalAlpha = state.sansHurtT;
      ctx.fillStyle = '#ff3333';
      ctx.fillRect(sx - 60, baseY - 70, 120, 150);
      ctx.globalAlpha = 1;
    }

    ctx.restore();
  }

  function drawDialog(ctx) {
    if (!state.dialog) return;
    ctx.save();
    const sp = typeof C2SF !== 'undefined' ? C2SF.sp : null;
    const bubble = sp ? sp['speech'] : null;
    const dx = 60, dy = 20, dw = CW - 120, dh = 60;

    if (bubble && bubble.complete && bubble.naturalWidth > 0) {
      ctx.drawImage(bubble, 0, 0, bubble.naturalWidth, bubble.naturalHeight, dx - 8, dy - 4, dw + 16, dh + 16);
    } else {
      ctx.fillStyle = '#000';
      ctx.fillRect(dx, dy, dw, dh);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(dx, dy, dw, dh);
    }

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px "Courier New", monospace';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#ffffcc';
    const lines = state.dialog.split('\n');
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], dx + 14, dy + 12 + i * 18);
    }
    if ((Date.now() / 350 | 0) % 2 === 0) {
      ctx.fillText('▼', dx + dw - 22, dy + dh - 18);
    }
    ctx.restore();
  }

  function drawHPBar(ctx, x, y, w, h, hp, maxHp, karma) {
    ctx.save();
    const sp = typeof C2SF !== 'undefined' ? C2SF.sp : null;

    // Player name + LV
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px "Courier New", monospace';
    ctx.textBaseline = 'top';
    ctx.fillText(PLAYER.name, x, y);
    ctx.fillStyle = '#cc66ff';
    ctx.fillText('LV ' + PLAYER.lv, x + 78, y);

    const barX = x + 140, barY = y - 2;
    const barW = w - 220, barH = h;

    // HP background
    ctx.fillStyle = '#000';
    ctx.fillRect(barX, barY, barW, barH);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barW, barH);

    // HP yellow + Karma purple
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
    ctx.font = '13px "Courier New", monospace';
    ctx.fillText('HP', barX - 32, y);
    ctx.fillText(`${hp} / ${maxHp}`, barX + barW + 8, y);

    // KR 小条
    const krX = barX + barW + 100;
    ctx.fillStyle = '#cc66ff';
    ctx.fillText('KR', krX, y);
    ctx.fillStyle = '#1a0022';
    ctx.fillRect(krX + 22, y - 2, 55, barH);
    ctx.strokeStyle = '#cc66ff';
    ctx.lineWidth = 1;
    ctx.strokeRect(krX + 22, y - 2, 55, barH);
    const krPct = Math.min(1, karma / maxHp);
    ctx.fillStyle = '#aa44ff';
    ctx.fillRect(krX + 22, y - 2, 55 * krPct, barH);

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
      ctx.fillStyle = '#555';
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
    const sp = typeof C2SF !== 'undefined' ? C2SF.sp : null;
    const defs = [
      { key:'uifight', label:'FIGHT', col:'#ffee44', icon:'❤' },
      { key:'uiact',   label:'ACT',   col:'#ff8833', icon:'⚙' },
      { key:'uiitem',  label:'ITEM',  col:'#ffcc44', icon:'◆' },
      { key:'uimercy', label:'MERCY', col:'#88ccff', icon:'☼' },
    ];
    const btnY = 360;
    const btnH = 50;
    const btnGap = 6;
    const totalW = CW - 120;
    const btnW = (totalW - btnGap * 3) / 4;

    for (let i = 0; i < 4; i++) {
      const bx = 60 + i * (btnW + btnGap);
      const active = state.menuIdx === i;

      // Draw UI sprite if available
      const sprite = sp ? sp[defs[i].key] : null;
      if (sprite && sprite.complete && sprite.naturalWidth > 0) {
        ctx.drawImage(sprite, 0, 0, sprite.naturalWidth, sprite.naturalHeight,
                      bx - 4, btnY - 4, btnW + 8, btnH + 8);
        if (active) {
          ctx.save();
          ctx.shadowColor = defs[i].col;
          ctx.shadowBlur = 14;
          ctx.strokeStyle = defs[i].col;
          ctx.lineWidth = 3;
          ctx.strokeRect(bx, btnY, btnW, btnH);
          ctx.restore();
        }
      } else {
        ctx.fillStyle = active ? '#1a1a2e' : '#0a0a14';
        ctx.fillRect(bx, btnY, btnW, btnH);
        ctx.strokeStyle = active ? defs[i].col : '#333355';
        ctx.lineWidth = active ? 2 : 1;
        ctx.strokeRect(bx, btnY, btnW, btnH);
      }

      if (active) {
        ctx.save();
        ctx.shadowColor = defs[i].col;
        ctx.shadowBlur = 10;
      }
      ctx.fillStyle = active ? defs[i].col : '#888';
      ctx.font = 'bold 15px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(defs[i].label, bx + btnW/2, btnY + btnH/2 + 5);
      ctx.restore();
      if (active) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('▶', bx + 6, btnY + btnH/2 + 5);
      }
    }
    ctx.textAlign = 'left';
  }

  function drawFightBar(ctx) {
    ctx.save();
    const bx = 60, by = 260, bw = CW - 120, bh = 18;

    ctx.fillStyle = '#111';
    ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, by, bw, bh);

    const sweetX = bx + bw * 0.42, sweetW = bw * 0.16;
    ctx.fillStyle = 'rgba(100,255,100,0.5)';
    ctx.fillRect(sweetX, by, sweetW, bh);
    const greatX = bx + bw * 0.35, greatW = bw * 0.30;
    ctx.fillStyle = 'rgba(255,200,50,0.3)';
    ctx.fillRect(greatX, by, greatW, bh);

    const px = bx + state.fightBarPos * bw;
    ctx.save();
    ctx.translate(px, by + bh/2);
    ctx.fillStyle = '#ffee44';
    ctx.shadowColor = '#ffee44';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(0, -16); ctx.lineTo(-7, 0); ctx.lineTo(0, 4); ctx.lineTo(7, 0); ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, 16); ctx.lineTo(-7, 0); ctx.lineTo(0, -4); ctx.lineTo(7, 0); ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = '#aaa';
    ctx.font = '11px monospace';
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

  // ============= VIRTUAL KEYS =============
  function drawVirtualKeys(ctx) {
    const sp = typeof C2SF !== 'undefined' ? C2SF.sp : null;
    ctx.save();
    ctx.globalAlpha = state.phase === 'enemy_turn' ? 0.85 : 0.55;

    // D-Pad on LEFT
    const cx = 75, cy = CH - 75, r = 38;
    const dpad = sp ? sp['touchdpad'] : null;
    if (dpad && dpad.complete && dpad.naturalWidth > 0) {
      ctx.drawImage(dpad, cx - r, cy - r, r*2, r*2);
      // Highlight pressed direction
      ctx.fillStyle = 'rgba(100,150,255,0.35)';
      const dx = (state.virtualKeys.right ? 1 : 0) - (state.virtualKeys.left ? 1 : 0);
      const dy = (state.virtualKeys.down ? 1 : 0) - (state.virtualKeys.up ? 1 : 0);
      if (dx !== 0 || dy !== 0) {
        ctx.beginPath();
        ctx.arc(cx + dx*10, cy + dy*10, 14, 0, Math.PI*2);
        ctx.fill();
      }
    } else {
      ctx.fillStyle = 'rgba(74,74,102,0.7)';
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = '#888';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#ddd';
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('▲', cx, cy - 24);
      ctx.fillText('▼', cx, cy + 24);
      ctx.fillText('◀', cx - 24, cy);
      ctx.fillText('▶', cx + 24, cy);
    }

    // A button on RIGHT (blue: JUMP in enemy_turn, green: CONFIRM otherwise)
    const bx = CW - 75, by = CH - 75;
    const aSprite = state.virtualKeys.jump ? (sp ? sp['toucha1'] : null) : (sp ? sp['toucha0'] : null);
    const aImg = aSprite || (sp ? sp['toucha0'] : null);
    const isBlueSoul = (typeof C2SF !== 'undefined' && C2SF.state && C2SF.state.soul.mode === 1);

    if (aImg && aImg.complete && aImg.naturalWidth > 0) {
      ctx.drawImage(aImg, bx - r, by - r, r*2, r*2);
    } else {
      ctx.fillStyle = isBlueSoul ? '#3366ff' : '#4a4a66';
      ctx.beginPath(); ctx.arc(bx, by, r, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = '#888'; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('JUMP', bx, by);
    }

    // Label hint
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    if (state.phase === 'enemy_turn' && isBlueSoul) {
      ctx.fillText('▲JUMP▼', bx, by + r + 10);
    } else if (state.phase === 'enemy_turn') {
      ctx.fillText('MOVE', cx, cy + r + 10);
    } else {
      ctx.fillText('◀▶MENU', cx, cy + r + 10);
      ctx.fillText('CONFIRM', bx, by + r + 10);
    }

    ctx.restore();
  }

  // ============= UPDATE =============
  function update() {
    if (state.sansHurtT > 0) state.sansHurtT -= 0.05;

    if (state.phase === 'player_turn') {
      if (justPressed('arrowleft') || state.virtualKeys.left) { state.menuIdx = Math.max(0, state.menuIdx - 1); state.virtualKeys.left = false; }
      if (justPressed('arrowright') || state.virtualKeys.right) { state.menuIdx = Math.min(3, state.menuIdx + 1); state.virtualKeys.right = false; }
      if (justPressed('arrowup') || state.virtualKeys.up) { state.menuIdx = (state.menuIdx + 1) % 4; state.virtualKeys.up = false; }
      if (justPressed('arrowdown') || state.virtualKeys.down) { state.menuIdx = (state.menuIdx + 1) % 4; state.virtualKeys.down = false; }
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

    state.phase = 'player_turn';
    state.menuIdx = 0;
    state.dialog = `${label} — ${damage} damage!`;
    state.sansHurtT = 1.0;
    state.shakeT = 0.8;

    if (typeof C2SF !== 'undefined') {
      C2SF.shake(1.2);
      C2SF.spawnDust(state.sansX, 180, 25);
      C2SF.spawnDmg(state.sansX, 140, String(damage), col);
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
    const z = C2SF.state.cz;
    const speed = 4.2;
    const keys = state.keys;

    if (!state._dragTouchId) {
      if (cs.mode === 0) {
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
        if (cs.y >= C2SF.CH - 6) {
          cs.y = C2SF.CH - 6; cs.vy = 0; cs.onGround = true;
        }
      }
    } else {
      cs.vy = 0; cs.onGround = false;
    }
    cs.x = Math.max(z.l + 6, Math.min(z.r - 6, cs.x));
    cs.y = Math.max(z.t + 6, Math.min(z.b - 6, cs.y));

    C2SF.update();

    const hit = C2SF.hitTest();
    if (hit && state.soulTeleportCooldown <= 0) {
      state.soulTeleportCooldown = 12;

      const dmg = 5;
      state.player.hp -= dmg;

      if (state.player.hp < 0) {
        state.player.karma += -state.player.hp;
        state.player.hp = 0;
      } else {
        state.player.karma = Math.max(0, state.player.karma - 2);
      }

      if (typeof C2SF !== 'undefined') {
        C2SF.shake(0.8);
        C2SF.hitFlash();
        C2SF.spawnDmg(cs.x, cs.y - 20, String(dmg), '#ff4444');
      }

      if (state.player.hp <= 0 && state.player.karma >= PLAYER.maxHp) {
        state.player.hp = 0;
        state.phase = 'defeat';
        state.dialog = BOSS.onKillText;
        return;
      }
      if (state.player.hp <= 0) state.player.hp = 0;
    }
    if (state.soulTeleportCooldown > 0) state.soulTeleportCooldown--;

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
