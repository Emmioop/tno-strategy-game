// c2sf_engine.js v200 — 全面抄BHUTE风格
// 修复: parseCSV稳定排序, 完整指令集, BHUTE激光/预警/震动/尘埃/龙骨炮动画

const C2SF = (() => {
  const CANVAS_W = 640;
  const CANVAS_H = 480;
  const ASSETS = 'assets/c2sf/';

  const sprites = {};
  const SPRITE_LIST = [
    { name: 'bonev',      file: 'bonev.png' },
    { name: 'boneh',      file: 'boneh.png' },
    { name: 'bonestabv',  file: 'bonestabv.png' },
    { name: 'bonestabh',  file: 'bonestabh.png' },
    { name: 'bonestabwarn', file: 'bonestabwarn.png' },
    { name: 'combatzone', file: 'combatzone.png' },
    { name: 'combatzoneborder', file: 'combatzoneborder.png' },
    { name: 'pheart0',    file: 'playerheart-sheet0.png' },
    { name: 'pheart1',    file: 'playerheart-sheet1.png' },
    { name: 'platform1',  file: 'platform1.png' },
    { name: 'platform2',  file: 'platform2.png' },
    { name: 'gbsheet0',   file: 'gasterblaster-sheet0.png' },
    { name: 'gbsheet1',   file: 'gasterblaster-sheet1.png' },
    { name: 'gasterblasthit', file: 'gasterblasthit.png' },
    { name: 'hpbar',      file: 'hpbar.png' },
    { name: 'krbar',      file: 'krbar.png' },
    { name: 'hpbg',       file: 'hpbackground.png' },
  ];

  const state = {
    loaded: false,
    bullets: [],
    lasers: [],
    platforms: [],
    stabWarnings: [],
    sineBones: [],
    gbs: [],
    intervals: [],
    dustParticles: [],
    damageNums: [],

    combatZone: { left: 239, top: 226, right: 404, bottom: 391 },
    combatZoneTarget: null,

    soul: { x: 320, y: 304, vx: 0, vy: 0, mode: 1, maxFallSpeed: 750, onGround: false },
    soulTeleport: null,

    shake: 0,
    blackScreen: 0,

    vars: { pi: 3.141592653589793 },
    labels: {},
    instructions: [],
    pc: 0,
    startTime: 0,
    running: false,

    sansAnim: 'Idle',
    sansHead: 'Default',
    sansBody: 'HandDown',
    sansSweat: 0,
    sansText: '',
    sansSlam: -1,
    sansSlamTimer: 0,
    sansX: 320,
    phaseName: '',

    startIdx: 0,
    lastHitTime: 0,
    hitFlash: 0,
  };

  function loadSpriteSheet() {
    const promises = SPRITE_LIST.map(def => new Promise(resolve => {
      const img = new Image();
      img.onload = () => { sprites[def.name] = img; resolve(); };
      img.onerror = () => { resolve(); };
      img.src = ASSETS + def.file;
    }));
    return Promise.all(promises).then(() => { state.loaded = true; });
  }

  function parseCSV(text) {
    const lines = text.trim().split('\n').filter(l => l.trim());
    const instrs = [];
    let maxTime = 0;

    for (const line of lines) {
      const parts = line.split(',').map(s => s.trim());
      if (parts[1] && parts[1].startsWith(':')) {
        instrs.push({ time: parseFloat(parts[0]) || 0, cmd: '__LABEL__', args: [parts[1].substring(1)], _rawIdx: instrs.length });
        continue;
      }
      if (!parts[0] && !parts[1]) continue;
      const t = parseFloat(parts[0]) || 0;
      if (t > maxTime) maxTime = t;
      instrs.push({ time: t, cmd: parts[1] || '', args: parts.slice(2), _rawIdx: instrs.length });
    }

    for (const instr of instrs) {
      if (instr.cmd === 'EndAttack') {
        instr.time = maxTime + 30;
      }
    }

    instrs.sort((a, b) => {
      if (a.time !== b.time) return a.time - b.time;
      return a._rawIdx - b._rawIdx;
    });

    const rawLabels = {};
    for (let i = 0; i < instrs.length; i++) {
      if (instrs[i].cmd === '__LABEL__') {
        rawLabels[instrs[i].args[0]] = i;
      }
    }

    const realInstrs = instrs.filter(i => i.cmd !== '__LABEL__');

    const newLabels = {};
    for (const [name, oldIdx] of Object.entries(rawLabels)) {
      let countBefore = 0;
      for (let i = 0; i < oldIdx; i++) {
        if (instrs[i].cmd !== '__LABEL__') countBefore++;
      }
      newLabels[name] = countBefore;
    }

    return { instrs: realInstrs, labels: newLabels };
  }

  function loadCSV(name) {
    return fetch(ASSETS + name)
      .then(r => r.text())
      .then(text => parseCSV(text))
      .catch(() => null);
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

  function r(str) { return resolve(str); }

  const CMD = {
    SET:   a => { state.vars[a[0]] = r(a[1]); },
    ADD:   a => { state.vars[a[0]] = r(a[1]) + r(a[2]); },
    SUB:   a => { state.vars[a[0]] = r(a[1]) - r(a[2]); },
    MUL:   a => { state.vars[a[0]] = r(a[1]) * r(a[2]); },
    DIV:   a => { state.vars[a[0]] = r(a[1]) / r(a[2]); },
    MOD:   a => { state.vars[a[0]] = r(a[1]) % r(a[2]); },
    RND:   a => { state.vars[a[0]] = Math.floor(Math.random() * r(a[1])); },
    COS:   a => { state.vars[a[0]] = Math.cos(r(a[1]) * Math.PI / 180); },
    SIN:   a => { state.vars[a[0]] = Math.sin(r(a[1]) * Math.PI / 180); },
    FLOOR: a => { state.vars[a[0]] = Math.floor(r(a[1])); },
    ANGLE: a => {
      const x1 = r(a[1]), y1 = r(a[2]), x2 = r(a[3]), y2 = r(a[4]);
      state.vars[a[0]] = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    },
    GetHeartPos: a => { state.vars[a[0]] = state.soul.x; state.vars[a[1]] = state.soul.y; },

    JMPABS: a => { state.pc = state.labels[a[0]] !== undefined ? state.labels[a[0]] : state.pc; return false; },
    JMPREL: a => { state.pc += parseInt(r(a[0])) + 1; return false; },
    JMPZ:   a => { if (r(a[1]) === 0) { state.pc = state.labels[a[0]] !== undefined ? state.labels[a[0]] : state.pc; return false; } },
    JMPNZ:  a => { if (r(a[1]) !== 0) { state.pc = state.labels[a[0]] !== undefined ? state.labels[a[0]] : state.pc; return false; } },
    JMPE:   a => { if (r(a[1]) === r(a[2])) { state.pc = state.labels[a[0]] !== undefined ? state.labels[a[0]] : state.pc; return false; } },
    JMPNE:  a => { if (r(a[1]) !== r(a[2])) { state.pc = state.labels[a[0]] !== undefined ? state.labels[a[0]] : state.pc; return false; } },
    JMPL:   a => { if (r(a[1]) < r(a[2])) { state.pc = state.labels[a[0]] !== undefined ? state.labels[a[0]] : state.pc; return false; } },
    JMPNL:  a => { if (r(a[1]) >= r(a[2])) { state.pc = state.labels[a[0]] !== undefined ? state.labels[a[0]] : state.pc; return false; } },
    JMPG:   a => { if (r(a[1]) > r(a[2])) { state.pc = state.labels[a[0]] !== undefined ? state.labels[a[0]] : state.pc; return false; } },
    JMPNG:  a => { if (r(a[1]) <= r(a[2])) { state.pc = state.labels[a[0]] !== undefined ? state.labels[a[0]] : state.pc; return false; } },

    BoneV: (a) => {
      const x = r(a[0]), y = r(a[1]), h = r(a[2]);
      const side = parseInt(r(a[3])) || 0;
      const spd = r(a[4]) || 240;
      const color = parseInt(r(a[5])) || 0;
      const vy = side === 2 ? spd : -spd;
      state.bullets.push({ type: 'bonev', x, y, w: 10, h, vx: 0, vy, color, rot: 0, rotSpd: 0 });
    },

    BoneVRepeat: (a, t) => {
      const x = r(a[0]), y = r(a[1]), h = r(a[2]);
      const side = parseInt(r(a[3])) || 0;
      const spd = r(a[4]) || 240;
      const count = parseInt(r(a[5])) || 4;
      const interval = r(a[6]) || 16;
      const color = parseInt(r(a[7])) || 0;
      const vy = side === 2 ? spd : -spd;
      let fired = 0;
      state.intervals.push({
        run: (elapsedSec) => {
          const localElapsed = elapsedSec - t;
          if (localElapsed < 0) return;
          const shouldFire = Math.floor(localElapsed * 60 / interval);
          while (fired < shouldFire && fired < count) {
            state.bullets.push({ type: 'bonev', x: x, y: y, w: 10, h: h, vx: 0, vy, color, rot: 0, rotSpd: 0 });
            fired++;
          }
        },
        done: () => fired >= count,
      });
    },

    BoneH: (a) => {
      const x = r(a[0]), y = r(a[1]);
      const spd = r(a[2]) || 200;
      const side = parseInt(r(a[3])) || 0;
      const color = parseInt(r(a[4])) || 0;
      const vx = side === 0 ? spd : -spd;
      state.bullets.push({ type: 'boneh', x, y, w: 24, h: 10, vx, vy: 0, color, rot: 0, rotSpd: 0 });
    },

    BoneHRepeat: (a, t) => {
      const x = r(a[0]), y = r(a[1]);
      const spd = r(a[2]) || 200;
      const side = parseInt(r(a[3])) || 0;
      const count = parseInt(r(a[4])) || 3;
      const interval = r(a[5]) || 15;
      const color = parseInt(r(a[6])) || 0;
      const vx = side === 0 ? spd : -spd;
      let fired = 0;
      state.intervals.push({
        run: (elapsedSec) => {
          const localElapsed = elapsedSec - t;
          if (localElapsed < 0) return;
          const shouldFire = Math.floor(localElapsed * 60 / interval);
          while (fired < shouldFire && fired < count) {
            state.bullets.push({ type: 'boneh', x: x, y: y, w: 24, h: 10, vx, vy: 0, color, rot: 0, rotSpd: 0 });
            fired++;
          }
        },
        done: () => fired >= count,
      });
    },

    BoneStab: (a) => {
      const dir = parseInt(r(a[0]));
      const pos = r(a[1]);
      const warnDur = r(a[2]) || 0.4;
      const height = r(a[3]) || 24;
      state.stabWarnings.push({ dir, pos, warnDur: warnDur * 1000, height: height, t: 0, fired: false });
    },

    SineBones: (a) => {
      const count = parseInt(r(a[0])) || 16;
      const amp = r(a[1]) || 0;
      const yBase = r(a[2]) || 300;
      const period = r(a[3]) || 55;
      for (let i = 0; i < count; i++) {
        state.sineBones.push({
          x: -20 - i * 22, y: yBase, amp: amp * 10, period: period * 10,
          phase: i * 0.3, vy: 2.5, w: 14, h: 28, color: 0,
        });
      }
    },

    GasterBlaster: (a) => {
      const size = r(a[0]) || 1;
      const sx = r(a[1]), sy = r(a[2]);
      const ex = r(a[3]), ey = r(a[4]);
      const ang = r(a[5]) || 0;
      const warnDur = (r(a[6]) || 0.5) * 1000;
      const fireDur = (r(a[7]) || 0.3) * 1000;

      state.gbs.push({
        sx, sy, ex, ey, size, angle: ang,
        warnDuration: warnDur, warnTimer: 0, fired: false, fireTimer: 0,
        fireDuration: fireDur,
      });
      state.lasers.push({
        sx, sy, ex, ey, angle: ang,
        warnDuration: warnDur, warnTimer: 0, fired: false, fireTimer: 0,
        fireDuration: fireDur, size,
      });
    },

    Platform: (a) => {
      const x = r(a[0]), y = r(a[1]), w = r(a[2]) || 50;
      const side = parseInt(r(a[3])) || 0;
      const spd = r(a[4]) || 0;
      state.platforms.push({ x, y, w, h: 7, side, vx: side === 0 ? spd : -spd });
    },

    PlatformRepeat: (a, t) => {
      const x = r(a[0]), y = r(a[1]), w = r(a[2]) || 50;
      const side = parseInt(r(a[3])) || 0;
      const spd = r(a[4]) || 0;
      const count = parseInt(r(a[5])) || 5;
      const interval = r(a[6]) || 120;
      const vx = side === 0 ? spd : -spd;
      let fired = 0;
      state.intervals.push({
        run: (elapsedSec) => {
          const localElapsed = elapsedSec - t;
          if (localElapsed < 0) return;
          const shouldFire = Math.floor(localElapsed * 60 / interval);
          while (fired < shouldFire && fired < count) {
            state.platforms.push({ x: x, y, w, h: 7, side, vx });
            fired++;
          }
        },
        done: () => fired >= count,
      });
    },

    HeartMode: (a) => { state.soul.mode = parseInt(r(a[0])); },
    HeartTeleport: (a) => { state.soulTeleport = { x: r(a[0]), y: r(a[1]) }; },
    HeartMaxFallSpeed: (a) => { state.soul.maxFallSpeed = r(a[0]); },

    CombatZoneResize: (a) => {
      state.combatZoneTarget = {
        left: r(a[0]), top: r(a[1]),
        right: r(a[2]), bottom: r(a[3]),
      };
    },
    CombatZoneResizeInstant: (a) => {
      state.combatZone = {
        left: r(a[0]), top: r(a[1]),
        right: r(a[2]), bottom: r(a[3]),
      };
      state.combatZoneTarget = null;
    },
    CombatZoneSpeed: (a) => {},

    BlackScreen: (a) => { state.blackScreen = r(a[0]) > 0 ? 1 : 0; },
    SansAnimation: (a) => { state.sansAnim = a[0] || 'Idle'; },
    SansHead: (a) => { state.sansHead = a[0] || 'Default'; },
    SansBody: (a) => { state.sansBody = a[0] || 'HandDown'; },
    SansSweat: (a) => { state.sansSweat = parseInt(r(a[0])) || 0; },
    SansText: (a) => { state.sansText = a[0] || ''; },
    SansTorso: (a) => { state.sansTorso = a[0] || 'Default'; },
    SansSlam: (a) => {
      state.sansSlam = parseInt(r(a[0]));
      state.sansSlamTimer = 300;
      state.shake = Math.max(state.shake, 1.0);
      spawnDust(CANVAS_W / 2, CANVAS_H / 2, 20);
    },
    SansSlamDamage: () => { state.shake = Math.max(state.shake, 0.8); },
    SansX: (a) => { state.sansX = r(a[0]); },

    SansRepeat: () => {},
    SansEndRepeat: () => {},

    TLPause: () => {},
    TLResume: () => {},
    Sound: () => {},
    EndAttack: () => { state.running = false; return false; },
  };

  function runInterpreter() {
    if (!state.running) return;
    const elapsed = (performance.now() - state.startTime) / 1000;
    while (state.pc < state.instructions.length) {
      const instr = state.instructions[state.pc];
      if (instr.time > elapsed) break;

      const fn = CMD[instr.cmd];
      const beforePc = state.pc;
      if (fn) {
        const result = fn(instr.args || [], instr.time);
        if (result !== false) state.pc++;
      } else {
        state.pc++;
      }
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
    state.gbs = [];
    state.intervals = [];
    state.dustParticles = [];
    state.damageNums = [];
    state.blackScreen = 0;
    state.shake = 0;
    state.vars = { pi: 3.141592653589793 };
    state.combatZone = { left: 239, top: 226, right: 404, bottom: 391 };
    state.combatZoneTarget = null;
    state.soul = { x: 320, y: 304, vx: 0, vy: 0, mode: 1, maxFallSpeed: 750, onGround: false };
    state.soulTeleport = null;
    state.sansSlam = -1;
    state.sansSlamTimer = 0;
    state.phaseName = name || '';

    state.instructions = csvData.instrs;
    state.labels = csvData.labels;
    state.pc = 0;
    state.running = true;
    state.startTime = performance.now();
  }

  function endAttack() { state.running = false; }

  function fireStabBone(s) {
    const dir = s.dir;
    let x, y, vx, vy, w, h;
    if (dir === 0) { x = s.pos; y = state.combatZone.top - 30; vx = 0; vy = 6; w = 12; h = 24; }
    else if (dir === 1) { x = s.pos; y = state.combatZone.bottom + 30; vx = 0; vy = -6; w = 12; h = 24; }
    else if (dir === 2) { x = state.combatZone.left - 30; y = s.pos; vx = 6; vy = 0; w = 24; h = 12; }
    else { x = state.combatZone.right + 30; y = s.pos; vx = -6; vy = 0; w = 24; h = 12; }
    state.bullets.push({ type: dir <= 1 ? 'bonestabv' : 'bonestabh', x, y, w, h, vx, vy, color: 0 });
  }

  function spawnDust(x, y, count) {
    for (let i = 0; i < count; i++) {
      state.dustParticles.push({
        x, y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8 - 2,
        life: 1.0,
        size: 2 + Math.random() * 4,
        rot: Math.random() * Math.PI * 2,
        rotSpd: (Math.random() - 0.5) * 0.3,
        color: ['#aa88ff', '#8866cc', '#cc99ff', '#ffaa66'][Math.floor(Math.random() * 4)],
      });
    }
  }

  function spawnDamageText(x, y, text, color) {
    state.damageNums.push({
      x, y, text, color: color || '#ffee44',
      life: 1.0, vy: -1.5,
    });
  }

  function update() {
    if (state.soulTeleport) {
      state.soul.x = state.soulTeleport.x;
      state.soul.y = state.soulTeleport.y;
      spawnDust(state.soul.x, state.soul.y, 8);
      state.soulTeleport = null;
    }
    if (state.sansSlamTimer > 0) state.sansSlamTimer -= 16;

    if (state.combatZoneTarget) {
      const z = state.combatZone, t = state.combatZoneTarget;
      z.left   += (t.left   - z.left)   * 0.1;
      z.top    += (t.top    - z.top)    * 0.1;
      z.right  += (t.right  - z.right)  * 0.1;
      z.bottom += (t.bottom - z.bottom) * 0.1;
      if (Math.abs(z.left - t.left) < 0.5) { Object.assign(z, t); state.combatZoneTarget = null; }
    }

    for (const b of state.bullets) { b.x += b.vx; b.y += b.vy; if (b.rotSpd) b.rot += b.rotSpd; }
    state.bullets = state.bullets.filter(b => b.x > -60 && b.x < CANVAS_W + 60 && b.y > -60 && b.y < CANVAS_H + 60);

    for (const p of state.platforms) p.x += p.vx;
    state.platforms = state.platforms.filter(p => p.x > -100 && p.x < CANVAS_W + 100);

    for (const sb of state.sineBones) {
      sb.x += sb.vy;
      sb.y += Math.sin(sb.x / sb.period * Math.PI + sb.phase) * sb.amp * 0.3;
    }
    state.sineBones = state.sineBones.filter(sb => sb.x > -30 && sb.x < CANVAS_W + 30);

    for (const s of state.stabWarnings) {
      s.t += 16;
      if (!s.fired && s.t >= s.warnDur) { s.fired = true; fireStabBone(s); }
    }
    state.stabWarnings = state.stabWarnings.filter(s => !s.fired || s.t < s.warnDur + 500);

    for (const l of state.lasers) {
      if (!l.fired) {
        l.warnTimer += 16;
        if (l.warnTimer >= l.warnDuration) {
          l.fired = true; l.fireTimer = 0;
          state.shake = Math.max(state.shake, 0.6 * (l.size || 1));
          spawnDust(l.sx, l.sy, 10);
          spawnDust(l.ex, l.ey, 10);
        }
      } else {
        l.fireTimer += 16;
      }
    }
    state.lasers = state.lasers.filter(l => !l.fired || l.fireTimer < l.fireDuration);

    for (const gb of state.gbs) {
      if (!gb.fired) {
        gb.warnTimer += 16;
        if (gb.warnTimer >= gb.warnDuration) {
          gb.fired = true; gb.fireTimer = 0;
          state.shake = Math.max(state.shake, 1.0 * gb.size);
          spawnDust(gb.sx, gb.sy, 15);
        }
      } else {
        gb.fireTimer += 16;
      }
    }
    state.gbs = state.gbs.filter(gb => !gb.fired || gb.fireTimer < gb.fireDuration);

    if (state.shake > 0) state.shake = Math.max(0, state.shake - 0.04);

    const elapsedSec = (performance.now() - state.startTime) / 1000;
    for (const iv of state.intervals) iv.run(elapsedSec);
    state.intervals = state.intervals.filter(i => !i.done());

    for (const d of state.dustParticles) {
      d.x += d.vx; d.y += d.vy;
      d.vy += 0.15; d.life -= 0.02;
      d.rot += d.rotSpd;
    }
    state.dustParticles = state.dustParticles.filter(d => d.life > 0);

    for (const d of state.damageNums) {
      d.y += d.vy; d.life -= 0.015;
    }
    state.damageNums = state.damageNums.filter(d => d.life > 0);

    runInterpreter();
  }

  function shakeOffset() {
    if (state.shake <= 0) return { x: 0, y: 0 };
    const k = state.shake;
    return { x: (Math.random() * 2 - 1) * 10 * k, y: (Math.random() * 2 - 1) * 10 * k };
  }

  function draw(ctx) {
    const z = state.combatZone;
    const off = shakeOffset();

    ctx.save();
    ctx.translate(off.x, off.y);

    if (state.blackScreen > 0) {
      ctx.fillStyle = '#000';
    } else {
      ctx.fillStyle = '#1a1a2e';
    }
    ctx.fillRect(-20, -20, CANVAS_W + 40, CANVAS_H + 40);

    drawDustBg(ctx);

    ctx.save();
    ctx.beginPath();
    ctx.rect(z.left, z.top, z.right - z.left, z.bottom - z.top);
    ctx.clip();

    const czImg = sprites['combatzone'];
    if (czImg) {
      for (let yy = z.top; yy < z.bottom; yy += czImg.height) {
        for (let xx = z.left; xx < z.right; xx += czImg.width) {
          ctx.drawImage(czImg, xx, yy);
        }
      }
    } else {
      ctx.fillStyle = '#000000';
      ctx.fillRect(z.left, z.top, z.right - z.left, z.bottom - z.top);
    }

    for (const p of state.platforms) {
      ctx.fillStyle = '#5577cc';
      ctx.fillRect(p.x - p.w/2, p.y - p.h/2, p.w, p.h);
      ctx.fillStyle = '#7799ee';
      ctx.fillRect(p.x - p.w/2, p.y - p.h/2, p.w, 3);
    }

    for (const gb of state.gbs) {
      const dx = gb.ex - gb.sx, dy = gb.ey - gb.sy;
      const beamAng = Math.atan2(dy, dx) * 180 / Math.PI;

      if (!gb.fired) {
        drawWarnLine(ctx, gb.sx, gb.sy, gb.ex, gb.ey);
        drawGBMouth(ctx, gb, beamAng);
      } else {
        drawLaserBeam(ctx, gb.sx, gb.sy, gb.ex, gb.ey, gb.size, gb.fireTimer / Math.max(1, gb.fireDuration));
      }
    }

    for (const l of state.lasers) {
      if (!l.fired) {
        drawWarnLine(ctx, l.sx, l.sy, l.ex, l.ey);
      } else {
        drawLaserBeam(ctx, l.sx, l.sy, l.ex, l.ey, l.size || 1.0, l.fireTimer / Math.max(1, l.fireDuration));
      }
    }

    for (const s of state.stabWarnings) {
      if (s.fired) continue;
      let x1, y1, x2, y2;
      if (s.dir <= 1) { x1 = x2 = s.pos; y1 = z.top; y2 = z.bottom; }
      else { y1 = y2 = s.pos; x1 = z.left; x2 = z.right; }
      drawWarnLine(ctx, x1, y1, x2, y2);
    }

    for (const sb of state.sineBones) {
      drawBoneShape(ctx, sb);
    }

    for (const b of state.bullets) drawBoneShape(ctx, b);

    drawDust(ctx);

    drawSoul(ctx);

    ctx.restore();

    drawBattleBorder(ctx, z);

    drawDamageNums(ctx);

    if (state.hitFlash > 0) {
      ctx.fillStyle = `rgba(255,255,255,${state.hitFlash})`;
      ctx.fillRect(z.left, z.top, z.right - z.left, z.bottom - z.top);
    }
    state.hitFlash = Math.max(0, state.hitFlash - 0.05);

    ctx.restore();
  }

  function drawDustBg(ctx) {
    if (state.dustParticles.length === 0) return;
    ctx.save();
    for (const d of state.dustParticles) {
      if (d.life <= 0) continue;
      ctx.globalAlpha = Math.min(1, d.life);
      ctx.fillStyle = d.color;
      ctx.save();
      ctx.translate(d.x, d.y);
      ctx.rotate(d.rot);
      ctx.fillRect(-d.size/2, -d.size/2, d.size, d.size);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  function drawWarnLine(ctx, x1, y1, x2, y2) {
    const blink = Math.floor(Date.now() / 80) % 2;
    ctx.save();
    ctx.lineCap = 'round';
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = blink ? '#ff3333' : '#ffee44';
    ctx.lineWidth = 4;
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.globalAlpha = 0.4;
    ctx.lineWidth = 10;
    ctx.stroke();
    ctx.restore();
  }

  function drawGBMouth(ctx, gb, beamAng) {
    const img = sprites['gbsheet0'];
    if (!img) return;
    const fw = 64, fh = 64;
    const progress = gb.warnTimer / Math.max(1, gb.warnDuration);
    const scale = 0.5 + progress * 0.5;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.translate(gb.sx, gb.sy);
    ctx.rotate((beamAng + 90) * Math.PI / 180);
    const drawSize = 64 * scale * gb.size;
    ctx.globalAlpha = 0.9;
    ctx.drawImage(img, -fw/2, -fh/2, fw, fh, -drawSize/2, -drawSize/2, drawSize, drawSize);
    ctx.restore();
  }

  // BHUTE风格激光 —— 多层光晕 + add blend + 钟形时间曲线
  function drawLaserBeam(ctx, sx, sy, ex, ey, size, pct) {
    if (pct < 0 || pct > 1) return;
    let scaleY;
    if (pct < 0.15) scaleY = pct / 0.15;
    else if (pct > 0.85) scaleY = (1 - pct) / 0.15;
    else scaleY = 1;
    const alpha = Math.min(1, pct * 7) * Math.min(1, (1 - pct) * 7);

    const dx = ex - sx, dy = ey - sy;
    const len = Math.hypot(dx, dy);
    const ang = Math.atan2(dy, dx);

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.translate(sx, sy);
    ctx.rotate(ang);

    const baseW = 22 * size * scaleY;

    // 外层大光晕
    ctx.globalAlpha = alpha * 0.15;
    const g1 = ctx.createLinearGradient(0, -baseW*4, 0, baseW*4);
    g1.addColorStop(0, 'rgba(80,120,255,0)');
    g1.addColorStop(0.5, 'rgba(120,180,255,0.4)');
    g1.addColorStop(1, 'rgba(80,120,255,0)');
    ctx.fillStyle = g1;
    ctx.fillRect(0, -baseW*4, len, baseW*8);

    // 中层光晕
    ctx.globalAlpha = alpha * 0.4;
    const g2 = ctx.createLinearGradient(0, -baseW*2, 0, baseW*2);
    g2.addColorStop(0, 'rgba(150,200,255,0)');
    g2.addColorStop(0.5, 'rgba(180,220,255,0.8)');
    g2.addColorStop(1, 'rgba(150,200,255,0)');
    ctx.fillStyle = g2;
    ctx.fillRect(0, -baseW*2, len, baseW*4);

    // 内层柔光
    ctx.globalAlpha = alpha * 0.7;
    const g3 = ctx.createLinearGradient(0, -baseW, 0, baseW);
    g3.addColorStop(0, 'rgba(200,230,255,0)');
    g3.addColorStop(0.5, 'rgba(220,240,255,0.9)');
    g3.addColorStop(1, 'rgba(200,230,255,0)');
    ctx.fillStyle = g3;
    ctx.fillRect(0, -baseW, len, baseW*2);

    // 核心白芯
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, -baseW*0.4, len, baseW*0.8);

    ctx.restore();
  }

  function drawBoneShape(ctx, b) {
    let img;
    if (b.type === 'bonev') img = sprites['bonev'];
    else if (b.type === 'boneh') img = sprites['boneh'];
    else if (b.type === 'bonestabv') img = sprites['bonestabv'];
    else if (b.type === 'bonestabh') img = sprites['bonestabh'];

    const useColor = b.color !== undefined && b.color !== 0;

    if (img) {
      if (useColor) {
        ctx.save();
        ctx.filter = colorFilter(b.color);
        if (b.rot) {
          ctx.translate(b.x, b.y);
          ctx.rotate(b.rot);
          ctx.drawImage(img, -b.w/2, -b.h/2, b.w, b.h);
        } else {
          ctx.drawImage(img, b.x - b.w/2, b.y - b.h/2, b.w, b.h);
        }
        ctx.restore();
      } else {
        if (b.rot) {
          ctx.save();
          ctx.translate(b.x, b.y);
          ctx.rotate(b.rot);
          ctx.drawImage(img, -b.w/2, -b.h/2, b.w, b.h);
          ctx.restore();
        } else {
          ctx.drawImage(img, b.x - b.w/2, b.y - b.h/2, b.w, b.h);
        }
      }
    } else {
      ctx.fillStyle = '#ffffff';
      if (b.rot) {
        ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.rot);
        ctx.fillRect(-b.w/2, -b.h/2, b.w, b.h); ctx.restore();
      } else {
        ctx.fillRect(b.x - b.w/2, b.y - b.h/2, b.w, b.h);
      }
    }
  }

  function colorFilter(color) {
    switch (color) {
      case 1: return 'hue-rotate(180deg) saturate(2) brightness(1.1)';
      case 2: return '';
      case 3: return 'hue-rotate(280deg) saturate(2) brightness(1.2)';
      default: return '';
    }
  }

  function drawSoul(ctx) {
    const img = state.soul.mode === 1 ? sprites['pheart0'] : sprites['pheart1'];
    const px = state.soul.x, py = state.soul.y;
    if (img) {
      ctx.drawImage(img, px - img.width/2, py - img.height/2);
    } else {
      ctx.fillStyle = state.soul.mode === 1 ? '#ff2222' : '#4488ff';
      ctx.beginPath();
      ctx.arc(px, py, 7, 0, Math.PI*2);
      ctx.fill();
    }
  }

  function drawBattleBorder(ctx, z) {
    ctx.save();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(z.left - 1, z.top - 1, z.right - z.left + 2, z.bottom - z.top + 2);
    ctx.restore();
  }

  function drawDust(ctx) {
    for (const d of state.dustParticles) {
      if (d.life <= 0) continue;
      ctx.save();
      ctx.globalAlpha = Math.min(1, d.life * 1.5);
      ctx.fillStyle = d.color;
      ctx.translate(d.x, d.y);
      ctx.rotate(d.rot);
      ctx.fillRect(-d.size/2, -d.size/2, d.size, d.size);
      ctx.restore();
    }
  }

  function drawDamageNums(ctx) {
    for (const d of state.damageNums) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, d.life * 1.5);
      ctx.fillStyle = d.color;
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'center';
      ctx.shadowColor = d.color;
      ctx.shadowBlur = 6;
      ctx.fillText(d.text, d.x, d.y);
      ctx.restore();
    }
    ctx.textAlign = 'left';
  }

  function collidesBullet() {
    const sx = state.soul.x, sy = state.soul.y;

    for (const b of state.bullets) {
      if (Math.abs(sx - b.x) < (b.w/2 + 5) && Math.abs(sy - b.y) < (b.h/2 + 5)) return b;
    }
    for (const sb of state.sineBones) {
      if (Math.abs(sx - sb.x) < (sb.w/2 + 5) && Math.abs(sy - sb.y) < (sb.h/2 + 5)) return sb;
    }
    for (const l of state.lasers) {
      if (!l.fired || l.fireTimer > l.fireDuration * 0.85) continue;
      const hit = pointLineDist(sx, sy, l.sx, l.sy, l.ex, l.ey);
      if (hit.dist < 14) return { type: 'laser' };
    }
    for (const gb of state.gbs) {
      if (!gb.fired || gb.fireTimer > gb.fireDuration * 0.85) continue;
      const hit = pointLineDist(sx, sy, gb.sx, gb.sy, gb.ex, gb.ey);
      if (hit.dist < 16) return { type: 'laser' };
    }
    return null;
  }

  function pointLineDist(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1, dy = y2 - y1;
    const len2 = dx*dx + dy*dy;
    if (len2 < 1) return { dist: 999 };
    const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / len2));
    const cx = x1 + t * dx, cy = y1 + t * dy;
    return { dist: Math.hypot(px - cx, py - cy), cx, cy };
  }

  return {
    loadSpriteSheet, loadCSV, startAttack, endAttack, update, draw,
    collidesBullet,
    getSoul: () => state.soul,
    getCombatZone: () => state.combatZone,
    isRunning: () => state.running,
    shake: (s) => { state.shake = Math.max(state.shake, s); },
    hitFlash: () => { state.hitFlash = 1.0; },
    spawnDust, spawnDamageText,
    state, CANVAS_W, CANVAS_H,
  };
})();
