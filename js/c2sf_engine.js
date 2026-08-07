// c2sf_engine.js — c2-sans-fight CSV 弹幕引擎
// 移植 Construct 2 的指令流 VM + sprite sheet 绘制系统
// 原始坐标系统 640x480 canvas，通过 CSS 缩放适配移动端

const C2SF = (() => {
  const CANVAS_W = 640;
  const CANVAS_H = 480;

  const sprites = {};
  const SPRITE_LIST = [
    'bonev', 'boneh', 'bonestabh', 'bonestabv', 'bonestabwarn',
    'gasterblaster-sheet0', 'gasterblaster-sheet1', 'gasterblasthit',
    'platform1', 'platform2',
    'sansbody-sheet0', 'sansbody-sheet1', 'sanshead-sheet0',
    'sanslegs-sheet0', 'sanstorso', 'sanssweat', 'sansfont',
    'playerheart-sheet0', 'playerheart-sheet1', 'playerhitbox-sheet0',
    'hpbar', 'krbar', 'hpbackground',
    'combatzone', 'combatzoneborder',
    'toucha', 'touchb', 'touchdpad',
    'uifight', 'uiact', 'uiitem', 'uimercy',
    'defaultfont', 'battlefont', 'damagefont',
    'menubonebottom-sheet0', 'menuitem-sheet0',
    'heartshard-sheet0', 'heartshard-sheet1', 'heartshard-sheet2',
    'gameover-sheet0', 'sans_bluebone', 'sans_bonestab1', 'sans_bonestab2',
  ];

  const state = {
    loaded: false,
    loading: false,
    bullets: [],
    lasers: [],
    platforms: [],
    stabWarnings: [],
    sineBones: [],
    blackScreen: 0,
    combatZone: { left: 133, top: 226, right: 508, bottom: 391 },
    soul: { x: 320, y: 304, vx: 0, vy: 0, mode: 1, maxFallSpeed: 750, onGround: false },
    vars: { pi: 3.141592653589793 },
    labels: {},
    instructions: [],
    pc: 0,
    startTime: 0,
    running: false,
    duration: 0,
    lastTime: 0,
    sansAnim: 'Idle',
    sansHead: 'Default',
    sansBody: 'HandDown',
    sansSweat: 0,
    sansText: '',
    sansSlam: -1,
    sansX: 320,
    soulTeleport: null,
    phaseName: '',
  };

  function loadSpriteSheet() {
    const promises = SPRITE_LIST.map(name => new Promise(resolve => {
      const img = new Image();
      img.onload = () => { sprites[name] = img; resolve(); };
      img.onerror = () => resolve();
      img.src = `assets/c2sf/${name}.png`;
    }));
    return Promise.all(promises).then(() => { state.loaded = true; });
  }

  function loadCSV(name) {
    return fetch(`assets/c2sf/${name}`)
      .then(r => r.text())
      .then(text => parseCSV(text))
      .catch(() => null);
  }

  function parseCSV(text) {
    const lines = text.trim().split('\n').filter(l => l.trim());
    const instrs = [];
    const labels = {};
    for (const line of lines) {
      const parts = line.split(',').map(s => s.trim());
      if (!parts[0]) continue;
      if (parts[0].startsWith(':')) {
        labels[parts[0].substring(1)] = instrs.length;
        continue;
      }
      instrs.push({ time: parseFloat(parts[0]) || 0, cmd: parts[1], args: parts.slice(2) });
    }
    return { instrs, labels };
  }

  function resolve(v) {
    if (v === undefined || v === null || v === '') return 0;
    if (typeof v !== 'string') return v;
    if (v.startsWith('$')) {
      const key = v.substring(1);
      if (key in state.vars) return state.vars[key];
      const n = parseFloat(key);
      return isNaN(n) ? 0 : n;
    }
    const n = parseFloat(v);
    if (!isNaN(n)) return n;
    if (v in state.vars) return state.vars[v];
    return v;
  }

  const CMD = {
    SET:     a => { state.vars[a[0]] = resolve(a[1]); },
    ADD:     a => { state.vars[a[0]] = resolve(a[1]) + resolve(a[2]); },
    SUB:     a => { state.vars[a[0]] = resolve(a[1]) - resolve(a[2]); },
    MUL:     a => { state.vars[a[0]] = resolve(a[1]) * resolve(a[2]); },
    DIV:     a => { state.vars[a[0]] = resolve(a[1]) / resolve(a[2]); },
    MOD:     a => { state.vars[a[0]] = resolve(a[1]) % resolve(a[2]); },
    RND:     a => { state.vars[a[0]] = Math.floor(Math.random() * resolve(a[1])); },
    COS:     a => { state.vars[a[0]] = Math.cos(resolve(a[1]) * Math.PI / 180); },
    SIN:     a => { state.vars[a[0]] = Math.sin(resolve(a[1]) * Math.PI / 180); },
    FLOOR:   a => { state.vars[a[0]] = Math.floor(resolve(a[1])); },
    ANGLE:   a => {
      state.vars[a[0]] = Math.atan2(resolve(a[4]) - resolve(a[3]), resolve(a[2]) - resolve(a[1])) * 180 / Math.PI;
    },
    GetHeartPos: a => { state.vars[a[0]] = state.soul.x; state.vars[a[1]] = state.soul.y; },

    JMPABS:  a => { state.pc = state.labels[a[0]] || state.pc; return false; },
    JMPREL:  a => { state.pc += parseInt(resolve(a[0])) + 1; return false; },
    JMPZ:    a => { if (resolve(a[1]) === 0) { state.pc = state.labels[a[0]] || state.pc; return false; } },
    JMPNZ:   a => { if (resolve(a[1]) !== 0) { state.pc = state.labels[a[0]] || state.pc; return false; } },
    JMPE:    a => { if (resolve(a[1]) === resolve(a[2])) { state.pc = state.labels[a[0]] || state.pc; return false; } },
    JMPNE:   a => { if (resolve(a[1]) !== resolve(a[2])) { state.pc = state.labels[a[0]] || state.pc; return false; } },
    JMPL:    a => { if (resolve(a[1]) < resolve(a[2])) { state.pc = state.labels[a[0]] || state.pc; return false; } },
    JMPNL:   a => { if (resolve(a[1]) >= resolve(a[2])) { state.pc = state.labels[a[0]] || state.pc; return false; } },
    JMPNG:   a => { if (resolve(a[1]) <= resolve(a[2])) { state.pc = state.labels[a[0]] || state.pc; return false; } },

    BoneV: (a, t) => {
      const x = resolve(a[0]), y = resolve(a[1]), h = resolve(a[2]);
      const side = parseInt(resolve(a[3]));
      const spd = resolve(a[4]) || 240;
      const color = a[5] !== undefined ? parseColor(resolve(a[5])) : '#ffffff';
      const vy = side === 2 ? spd : -spd;
      state.bullets.push({ type: 'bonev', x, y, w: 14, h, vx: 0, vy, color });
    },

    BoneVRepeat: (a, t) => {
      const x = resolve(a[0]), y = resolve(a[1]), h = resolve(a[2]);
      const side = parseInt(resolve(a[3]));
      const spd = resolve(a[4]) || 120;
      const count = parseInt(resolve(a[5])) || 4;
      const interval = resolve(a[6]) || 16;
      const color = a[7] !== undefined ? parseColor(resolve(a[7])) : '#ffffff';
      const vy = side === 2 ? spd : -spd;
      let fired = 0;
      const startT = t;
      state.intervals.push({
        run: () => {
          const elapsed = (performance.now() - startT) / 1000;
          const shouldFire = Math.floor(elapsed * 60 / interval);
          while (fired < shouldFire && fired < count) {
            state.bullets.push({ type: 'bonev', x, y: y - fired * 6, w: 14, h: h + fired * 4, vx: 0, vy, color });
            fired++;
          }
        },
        done: () => fired >= count,
      });
    },

    BoneHRepeat: (a, t) => {
      const x = resolve(a[0]), y = resolve(a[1]);
      const spd = resolve(a[2]) || 200;
      const side = parseInt(resolve(a[3]));
      const count = parseInt(resolve(a[5])) || 3;
      const interval = resolve(a[6]) || 15;
      const vx = side === 0 ? spd : -spd;
      let fired = 0;
      const startT = t;
      state.intervals.push({
        run: () => {
          const elapsed = (performance.now() - startT) / 1000;
          const shouldFire = Math.floor(elapsed * 60 / interval);
          while (fired < shouldFire && fired < count) {
            state.bullets.push({ type: 'boneh', x: x - fired * 8, y, w: 32, h: 10, vx, vy: 0, color: '#ffffff' });
            fired++;
          }
        },
        done: () => fired >= count,
      });
    },

    BoneStab: (a, t) => {
      const dir = parseInt(resolve(a[0]));
      const pos = resolve(a[1]);
      const warnDur = resolve(a[2]) || 0.4;
      const color = a[3] !== undefined ? parseColor(resolve(a[3])) : '#ffffff';
      const direction = a[4] !== undefined ? parseInt(resolve(a[4])) : dir;
      state.stabWarnings.push({ dir, pos, warnDur: warnDur * 1000, t: 0, color, direction });
    },

    SineBones: (a, t) => {
      const count = parseInt(resolve(a[0])) || 16;
      const amp = resolve(a[1]) || 0;
      const yBase = resolve(a[2]) || 300;
      const period = resolve(a[3]) || 55;
      for (let i = 0; i < count; i++) {
        state.sineBones.push({
          x: -20 - i * 22,
          y: yBase,
          amp: amp * 10,
          period: period * 10,
          phase: i * 0.3,
          vy: 2.5,
          w: 14, h: 28,
        });
      }
    },

    GasterBlaster: (a, t) => {
      const type = parseInt(resolve(a[0]));
      const sx = resolve(a[1]), sy = resolve(a[2]);
      const ex = resolve(a[3]), ey = resolve(a[4]);
      const ang = resolve(a[5]) || 0;
      const warnDur = (resolve(a[6]) || 0.5) * 1000;
      const fireDur = (resolve(a[7]) || 0.3) * 1000;
      state.lasers.push({
        type, sx, sy, ex, ey, angle: ang * Math.PI / 180,
        warnDuration: warnDur, warnTimer: 0, fired: false, fireTimer: 0,
        fireDuration: fireDur,
      });
    },

    Platform: (a, t) => {
      const x = resolve(a[0]), y = resolve(a[1]), w = resolve(a[2]) || 50;
      const side = parseInt(resolve(a[3]));
      const spd = resolve(a[4]) || 0;
      const color = a[6] !== undefined ? parseColor(resolve(a[6])) : null;
      state.platforms.push({ x, y, w, h: 8, side, vx: side === 0 ? spd : -spd, color });
    },

    PlatformRepeat: (a, t) => {
      const x = resolve(a[0]), y = resolve(a[1]), w = resolve(a[2]) || 50;
      const side = parseInt(resolve(a[3]));
      const spd = resolve(a[4]) || 0;
      const count = parseInt(resolve(a[5])) || 5;
      const interval = resolve(a[6]) || 120;
      const vx = side === 0 ? spd : -spd;
      let fired = 0;
      const startT = t;
      state.intervals.push({
        run: () => {
          const elapsed = (performance.now() - startT) / 1000;
          const shouldFire = Math.floor(elapsed * 60 / interval);
          while (fired < shouldFire && fired < count) {
            state.platforms.push({ x: x - fired * 60, y, w, h: 8, side, vx, color: null });
            fired++;
          }
        },
        done: () => fired >= count,
      });
    },

    HeartMode: (a) => { state.soul.mode = parseInt(resolve(a[0])); },
    HeartTeleport: (a) => { state.soulTeleport = { x: resolve(a[0]), y: resolve(a[1]) }; },
    HeartMaxFallSpeed: (a) => { state.soul.maxFallSpeed = resolve(a[0]); },

    CombatZoneResize: (a) => {
      state.combatZone.target = {
        left: resolve(a[0]), top: resolve(a[1]),
        right: resolve(a[2]), bottom: resolve(a[3]),
      };
    },
    CombatZoneResizeInstant: (a) => {
      state.combatZone = {
        left: resolve(a[0]), top: resolve(a[1]),
        right: resolve(a[2]), bottom: resolve(a[3]),
      };
    },
    CombatZoneSpeed: (a) => { state.combatZoneSpeed = resolve(a[0]) || 30; },

    BlackScreen: (a) => { state.blackScreen = resolve(a[0]) > 0 ? 1 : 0; },
    SansAnimation: (a) => { state.sansAnim = a[0] || 'Idle'; },
    SansHead: (a) => { state.sansHead = a[0] || 'Default'; },
    SansBody: (a) => { state.sansBody = a[0] || 'HandDown'; },
    SansSweat: (a) => { state.sansSweat = parseInt(resolve(a[0])) || 0; },
    SansText: (a) => { state.sansText = a[0] || ''; },
    SansSlam: (a) => { state.sansSlam = parseInt(resolve(a[0])); state.sansSlamTimer = 300; },
    SansX: (a) => { state.sansX = resolve(a[0]); },

    TLPause: () => { state.running = false; },
  };

  function parseColor(c) {
    const map = { '1': '#ff8800', '0': '#ffffff', '2': '#4488ff', '3': '#ff4444' };
    return map[c] || c || '#ffffff';
  }

  function execInstr(instr, t) {
    const fn = CMD[instr.cmd];
    if (fn) {
      const result = fn(instr.args || [], t);
      if (result === false) return 'jump';
    }
  }

  function runInterpreter(dt) {
    if (!state.running) return;
    const elapsed = (performance.now() - state.startTime) / 1000;
    while (state.pc < state.instructions.length) {
      const instr = state.instructions[state.pc];
      if (instr.time > elapsed) break;
      const beforePc = state.pc;
      const result = execInstr(instr, elapsed);
      if (result !== 'jump') state.pc++;
      if (state.pc === beforePc) state.pc++;
      if (instr.cmd === 'EndAttack') { state.running = false; break; }
    }
  }

  function startAttack(csvData, name) {
    state.bullets = [];
    state.lasers = [];
    state.platforms = [];
    state.stabWarnings = [];
    state.sineBones = [];
    state.blackScreen = 0;
    state.intervals = [];
    state.vars = { pi: 3.141592653589793 };
    state.instructions = csvData.instrs;
    state.labels = csvData.labels;
    state.pc = 0;
    state.running = true;
    state.startTime = performance.now();
    state.phaseName = name;
    state.combatZone = { left: 133, top: 226, right: 508, bottom: 391 };
    state.soul = { x: 320, y: 304, vx: 0, vy: 0, mode: 1, maxFallSpeed: 750, onGround: false };
    state.soulTeleport = null;
    state.sansSlam = -1;
    state.sansSlamTimer = 0;
  }

  function endAttack() {
    state.running = false;
  }

  function update() {
    if (state.soulTeleport) {
      state.soul.x = state.soulTeleport.x;
      state.soul.y = state.soulTeleport.y;
      state.soulTeleport = null;
    }
    if (state.sansSlamTimer > 0) state.sansSlamTimer -= 16;

    if (state.combatZone.target) {
      const speed = state.combatZoneSpeed || 30;
      const z = state.combatZone;
      const t = state.combatZone.target;
      z.left += (t.left - z.left) * 0.05;
      z.top += (t.top - z.top) * 0.05;
      z.right += (t.right - z.right) * 0.05;
      z.bottom += (t.bottom - z.bottom) * 0.05;
      if (Math.abs(z.left - t.left) < 0.5) {
        Object.assign(z, t);
        state.combatZone.target = null;
      }
    }

    for (const b of state.bullets) {
      b.x += b.vx;
      b.y += b.vy;
    }
    state.bullets = state.bullets.filter(b => b.x > -50 && b.x < CANVAS_W + 50 && b.y > -50 && b.y < CANVAS_H + 50);

    for (const p of state.platforms) {
      p.x += p.vx;
    }
    state.platforms = state.platforms.filter(p => p.x > -100 && p.x < CANVAS_W + 100);

    for (const s of state.stabWarnings) {
      s.t += 16;
      if (!s.fired && s.t >= s.warnDur) {
        s.fired = true;
        fireStabBone(s);
      }
    }
    state.stabWarnings = state.stabWarnings.filter(s => !s.fired || s.t < s.warnDur + 500);

    for (const sb of state.sineBones) {
      sb.x += sb.vy + 2;
      sb.y += Math.sin(sb.x / sb.period * Math.PI) * sb.amp * 0.3;
    }
    state.sineBones = state.sineBones.filter(sb => sb.x > -30 && sb.x < CANVAS_W + 30);

    for (const l of state.lasers) {
      if (!l.fired) {
        l.warnTimer += 16;
        if (l.warnTimer >= l.warnDuration) {
          l.fired = true;
          l.fireTimer = 0;
        }
      } else {
        l.fireTimer += 16;
      }
    }
    state.lasers = state.lasers.filter(l => !l.fired || l.fireTimer < l.fireDuration);

    for (const interval of (state.intervals || [])) {
      interval.run();
    }
    state.intervals = (state.intervals || []).filter(i => !i.done());

    runInterpreter(16);
  }

  function fireStabBone(s) {
    const dir = s.direction;
    let x, y, vx, vy, w, h;
    if (dir === 0) { x = s.pos; y = state.combatZone.top - 30; vx = 0; vy = 6; w = 18; h = 30; }
    else if (dir === 1) { x = s.pos; y = state.combatZone.bottom + 30; vx = 0; vy = -6; w = 18; h = 30; }
    else if (dir === 2) { x = state.combatZone.left - 30; y = s.pos; vx = 6; vy = 0; w = 30; h = 10; }
    else { x = state.combatZone.right + 30; y = s.pos; vx = -6; vy = 0; w = 30; h = 10; }
    state.bullets.push({ type: dir <= 1 ? 'bonev' : 'boneh', x, y, w, h, vx, vy, color: s.color });
  }

  function drawSprite(ctx, name, x, y, w, h, angle = 0, alpha = 1) {
    const img = sprites[name];
    if (!img) {
      ctx.save();
      ctx.fillStyle = '#fff';
      ctx.globalAlpha = alpha;
      ctx.fillRect(x - w/2, y - h/2, w, h);
      ctx.restore();
      return;
    }
    ctx.save();
    ctx.globalAlpha = alpha;
    if (angle) {
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.drawImage(img, -w/2, -h/2, w, h);
    } else {
      ctx.drawImage(img, x - w/2, y - h/2, w, h);
    }
    ctx.restore();
  }

  function drawBullet(ctx, b) {
    const key = b.type === 'bonev' ? 'bonev' : b.type === 'boneh' ? 'boneh' : null;
    if (key && sprites[key]) {
      ctx.save();
      ctx.globalAlpha = 0.95;
      if (b.color && b.color !== '#ffffff') {
        ctx.filter = `drop-shadow(0 0 2px ${b.color})`;
      }
      ctx.drawImage(sprites[key], b.x - b.w/2, b.y - b.h/2, b.w, b.h);
      ctx.restore();
      return;
    }
    ctx.save();
    ctx.fillStyle = b.color || '#ffffff';
    ctx.fillRect(b.x - b.w/2, b.y - b.h/2, b.w, b.h);
    ctx.restore();
  }

  function drawLaser(ctx, l) {
    const isWarn = !l.fired;
    if (isWarn) {
      ctx.save();
      ctx.strokeStyle = '#ff4444';
      ctx.setLineDash([8, 6]);
      ctx.globalAlpha = 0.6;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(l.sx, l.sy);
      ctx.lineTo(l.ex, l.ey);
      ctx.stroke();
      ctx.restore();
      return;
    }
    const dx = l.ex - l.sx, dy = l.ey - l.sy;
    const len = Math.sqrt(dx*dx + dy*dy);
    const ang = Math.atan2(dy, dx);
    const progress = Math.min(1, l.fireTimer / (l.fireDuration * 0.3));
    const beamLen = len * progress;
    const midX = l.sx + dx * progress / 2;
    const midY = l.sy + dy * progress / 2;
    ctx.save();
    ctx.translate(midX, midY);
    ctx.rotate(ang);
    ctx.globalAlpha = 0.8;
    const g = ctx.createLinearGradient(-beamLen/2, 0, beamLen/2, 0);
    g.addColorStop(0, 'rgba(100,180,255,0)');
    g.addColorStop(0.3, 'rgba(150,210,255,0.9)');
    g.addColorStop(0.5, 'rgba(255,255,255,1)');
    g.addColorStop(0.7, 'rgba(150,210,255,0.9)');
    g.addColorStop(1, 'rgba(100,180,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(-beamLen/2, -8, beamLen, 16);
    ctx.restore();

    const gb = sprites['gasterblaster-sheet0'];
    if (gb) {
      ctx.save();
      ctx.globalAlpha = 0.8;
      ctx.translate(l.sx, l.sy);
      ctx.rotate(ang);
      ctx.drawImage(gb, -20, -16, 40, 32);
      ctx.restore();
      ctx.save();
      ctx.globalAlpha = 0.8;
      ctx.translate(l.ex, l.ey);
      ctx.rotate(ang + Math.PI);
      ctx.drawImage(gb, -20, -16, 40, 32);
      ctx.restore();
    }
  }

  function drawPlatform(ctx, p) {
    const key = p.side === 0 ? 'platform1' : 'platform2';
    if (sprites[key]) {
      ctx.save();
      ctx.globalAlpha = 0.9;
      ctx.drawImage(sprites[key], p.x - p.w/2, p.y - p.h/2, p.w, p.h);
      ctx.restore();
    } else {
      ctx.save();
      ctx.fillStyle = '#4488cc';
      ctx.fillRect(p.x - p.w/2, p.y - p.h/2, p.w, p.h);
      ctx.restore();
    }
  }

  function drawStabWarn(ctx, s) {
    const dir = s.direction;
    let x1, y1, x2, y2;
    const z = state.combatZone;
    if (dir === 0) { x1 = x2 = s.pos; y1 = z.top; y2 = z.bottom; }
    else if (dir === 1) { x1 = x2 = s.pos; y1 = z.top; y2 = z.bottom; }
    else if (dir === 2) { y1 = y2 = s.pos; x1 = z.left; x2 = z.right; }
    else { y1 = y2 = s.pos; x1 = z.left; x2 = z.right; }
    const pulse = Math.sin(s.t / 60) * 0.3 + 0.7;
    ctx.save();
    ctx.strokeStyle = `rgba(255,255,255,${0.6 * pulse})`;
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 6]);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  }

  function drawSans(ctx, canvasW, canvasH) {
    const body = sprites['sansbody-sheet0'];
    const head = sprites['sanshead-sheet0'];
    const legs = sprites['sanslegs-sheet0'];
    const torso = sprites['sanstorso'];
    const sweat = sprites['sanssweat'];
    const fontSize = Math.min(canvasW, canvasH) * 0.08;
    const sx = state.sansX * (canvasW / CANVAS_W);
    const scale = canvasW / CANVAS_W;
    const yPos = state.combatZone.top * scale - 40 * scale;

    ctx.save();
    if (body) ctx.drawImage(body, sx - 80*scale, yPos - 20*scale, 160*scale, 200*scale);
    else {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(sx, yPos + 20*scale, 30*scale, 0, Math.PI*2);
      ctx.fill();
    }
    if (state.sansText) {
      ctx.font = `${fontSize}px 'Courier New', monospace`;
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(`* ${state.sansText}`, canvasW / 2, 30 * scale);
    }
    ctx.restore();
  }

  function drawSoul(ctx, canvasW, canvasH) {
    const heart = state.soul.mode === 1 ? 'playerheart-sheet0' : 'playerheart-sheet1';
    const img = sprites[heart] || sprites['playerheart-sheet0'];
    const sx = canvasW / CANVAS_W;
    const sy = canvasH / CANVAS_H;
    const px = state.soul.x * sx;
    const py = state.soul.y * sy;
    const sw = 16 * sx;
    const sh = 20 * sy;
    ctx.save();
    if (img) {
      ctx.drawImage(img, px - sw/2, py - sh/2, sw, sh);
    } else {
      ctx.fillStyle = state.soul.mode === 1 ? '#ff2222' : '#4488ff';
      ctx.beginPath();
      ctx.arc(px, py, Math.min(sw, sh)/2, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.restore();
  }

  function draw(ctx, canvasW, canvasH) {
    const sx = canvasW / CANVAS_W;
    const sy = canvasH / CANVAS_H;
    const z = state.combatZone;
    ctx.save();

    ctx.fillStyle = state.blackScreen > 0 ? '#000' : '#0a0a18';
    ctx.fillRect(0, 0, canvasW, canvasH);

    ctx.save();
    ctx.beginPath();
    ctx.rect(z.left * sx, z.top * sy, (z.right - z.left) * sx, (z.bottom - z.top) * sy);
    ctx.clip();

    for (const b of state.bullets) drawBullet(ctx, { ...b, x: b.x * sx, y: b.y * sy, w: b.w * sx, h: b.h * sy });
    for (const sb of state.sineBones) drawBullet(ctx, { type: 'bonev', x: sb.x * sx, y: sb.y * sy, w: sb.w * sx, h: sb.h * sy, color: '#ffffff' });
    for (const p of state.platforms) drawPlatform(ctx, { ...p, x: p.x * sx, y: p.y * sy, w: p.w * sx, h: p.h * sy });
    for (const l of state.lasers) {
      drawLaser(ctx, { ...l, sx: l.sx * sx, sy: l.sy * sy, ex: l.ex * sx, ey: l.ey * sy });
    }
    for (const s of state.stabWarnings) drawStabWarn(ctx, s);

    drawSoul(ctx, canvasW, canvasH);
    ctx.restore();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(z.left * sx - 1, z.top * sy - 1, (z.right - z.left) * sx + 2, (z.bottom - z.top) * sy + 2);

    ctx.restore();
  }

  function collidesBullet(soul) {
    const sx = state.soul.x, sy = state.soul.y;
    for (const b of state.bullets) {
      if (Math.abs(sx - b.x) < (b.w/2 + 5) && Math.abs(sy - b.y) < (b.h/2 + 5)) return b;
    }
    for (const sb of state.sineBones) {
      if (Math.abs(sx - sb.x) < (sb.w/2 + 5) && Math.abs(sy - sb.y) < (sb.h/2 + 5)) return sb;
    }
    for (const l of state.lasers) {
      if (!l.fired || l.fireTimer > l.fireDuration * 0.8) continue;
      const dx = l.ex - l.sx, dy = l.ey - l.sy;
      const len2 = dx*dx + dy*dy;
      const t = Math.max(0, Math.min(1, ((sx - l.sx) * dx + (sy - l.sy) * dy) / len2));
      const px = l.sx + t * dx, py = l.sy + t * dy;
      if (Math.hypot(sx - px, sy - py) < 8) return l;
    }
    return null;
  }

  function platformCollisions() {
    return state.platforms;
  }

  function getSoul() { return state.soul; }
  function getCombatZone() { return state.combatZone; }
  function isRunning() { return state.running; }

  return {
    loadSpriteSheet, loadCSV, startAttack, endAttack, update, draw,
    collidesBullet, platformCollisions, getSoul, getCombatZone, isRunning, state,
    CANVAS_W, CANVAS_H,
  };
})();
