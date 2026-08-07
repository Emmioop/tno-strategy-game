// c2sf_engine.js v92 — c2-sans-fight CSV 弹幕引擎
// 渲染系统全面借鉴 BHUTE (BoneCreate / GBCreate / WarnboxCreate / Shook_Tick / Player_Damage)
// 固定 640x480 canvas，通过 CSS object-fit:contain 适配

const C2SF = (() => {
  const CANVAS_W = 640;
  const CANVAS_H = 480;

  const BHUTE_PATH = 'assets/c2sf_bhute/';
  const C2SF_PATH  = 'assets/c2sf/';

  const sprites = {};

  const SPRITE_LIST = [
    { name: 'bt',        file: 'spr_top_bone_0.png',          path: BHUTE_PATH },
    { name: 'bb',        file: 'spr_bottom_bone_0.png',      path: BHUTE_PATH },
    { name: 'bp',        file: 'spr_bone_pixel_0.png',       path: BHUTE_PATH },
    { name: 'bone0',     file: 'spr_bone_0_0.png',           path: BHUTE_PATH },
    { name: 'gb0',       file: 'spr_gb_0.png',               path: BHUTE_PATH },
    { name: 'gb1',       file: 'spr_gb_1.png',               path: BHUTE_PATH },
    { name: 'gb2',       file: 'spr_gb_2.png',               path: BHUTE_PATH },
    { name: 'gb3',       file: 'spr_gb_3.png',               path: BHUTE_PATH },
    { name: 'gb4',       file: 'spr_gb_4.png',               path: BHUTE_PATH },
    { name: 'gb5',       file: 'spr_gb_5.png',               path: BHUTE_PATH },
    { name: 'gb6',       file: 'spr_gb_6.png',               path: BHUTE_PATH },
    { name: 'gbglow',    file: 'spr_gb_light_growing_0.png', path: BHUTE_PATH },
    { name: 'warnbox0',  file: 'spr_warnbox_0.png',          path: BHUTE_PATH },
    { name: 'warnbox1',  file: 'spr_warnbox_1.png',          path: BHUTE_PATH },
    { name: 'dmg0',      file: 'spr_damage_0.png',           path: BHUTE_PATH },
    { name: 'dmg1',      file: 'spr_damage_1.png',           path: BHUTE_PATH },
    { name: 'dmg2',      file: 'spr_damage_2.png',           path: BHUTE_PATH },
    { name: 'dmg3',      file: 'spr_damage_3.png',           path: BHUTE_PATH },
    { name: 'dmg4',      file: 'spr_damage_4.png',           path: BHUTE_PATH },
    { name: 'dmg5',      file: 'spr_damage_5.png',           path: BHUTE_PATH },
    { name: 'dmg6',      file: 'spr_damage_6.png',           path: BHUTE_PATH },
    { name: 'dmg7',      file: 'spr_damage_7.png',           path: BHUTE_PATH },
    { name: 'dmg8',      file: 'spr_damage_8.png',           path: BHUTE_PATH },
    { name: 'dmg9',      file: 'spr_damage_9.png',           path: BHUTE_PATH },
    { name: 'soul_red',  file: 'spr_move_soul_0.png',        path: BHUTE_PATH },
    { name: 'bonev',     file: 'bonev.png',                  path: C2SF_PATH },
    { name: 'boneh',     file: 'boneh.png',                  path: C2SF_PATH },
    { name: 'platform1', file: 'platform1.png',               path: C2SF_PATH },
    { name: 'platform2', file: 'platform2.png',               path: C2SF_PATH },
    { name: 'pheart0',   file: 'playerheart-sheet0.png',      path: C2SF_PATH },
    { name: 'pheart1',   file: 'playerheart-sheet1.png',      path: C2SF_PATH },
    { name: 'gbsheet0',  file: 'gasterblaster-sheet0.png',    path: C2SF_PATH },
  ];

  // ============= AnimCurves (Hermite 插值还原 BHUTE GMAnimCurve) =============
  function hermite(points, t) {
    t = Math.max(0, Math.min(1, t));
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i], p1 = points[i + 1];
      if (t >= p0.x && t <= p1.x) {
        const localT = (t - p0.x) / (p1.x - p0.x || 1);
        const h00 = 2*localT*localT*localT - 3*localT*localT + 1;
        const h10 = localT*localT*localT - 2*localT*localT + localT;
        const h01 = -2*localT*localT*localT + 3*localT*localT;
        const h11 = localT*localT*localT - localT*localT;
        const m0 = p0.th1 * (p1.x - p0.x);
        const m1 = p1.th0 * (p1.x - p0.x);
        return h00*p0.y + h10*m0 + h01*p1.y + h11*m1;
      }
    }
    return points[points.length - 1].y;
  }

  // ac_gb_default — 激光水平 scale（钟形：0→1→1→0）
  const AC_GB_DEFAULT = (() => {
    const pts = [
      { x: 0.0,    y: 0.0, th0: -0.1,  th1:  0.1  },
      { x: 0.2004, y: 1.0, th0: -0.04, th1:  0.12 },
      { x: 0.7996, y: 1.0, th0: -0.12, th1:  0.04 },
      { x: 1.0,    y: 0.0, th0: -0.1,  th1:  0.1  },
    ];
    return t => hermite(pts, t);
  })();

  // ac_gb_alpha — 激光 alpha（快速升至 1，平台期较长，最后下降）
  const AC_GB_ALPHA = (() => {
    const pts = [
      { x: 0.0,    y: 0.0,   th0: -0.1, th1:  0.1 },
      { x: 0.1966, y: 1.0,   th0:  1.0, th1: -1.0 },
      { x: 0.4924, y: 1.033, th0:  1.0, th1: -1.0 },
      { x: 0.7977, y: 1.0,   th0:  1.0, th1: -1.0 },
      { x: 1.0,    y: 0.0,   th0: -0.1, th1:  0.1 },
    ];
    return t => hermite(pts, t);
  })();

  // ac_gb_prepare — 前摇位移曲线（ease-out：先快后慢）
  const AC_GB_PREPARE = (() => {
    const pts = [
      { x: 0.0, y: 0.0,   th0: -0.1,  th1: 0.052 },
      { x: 1.0, y: 200.0, th0: -0.771, th1: 0.1   },
    ];
    return t => hermite(pts, t);
  })();

  // ac_gb_left — 后座位移（快速后撤后慢慢停住）
  const AC_GB_LEFT = (() => {
    const pts = [
      { x: 0.0, y: 0.0,   th0: -0.1,  th1: 0.682 },
      { x: 1.0, y: 600.0, th0: -0.506, th1: 0.1   },
    ];
    return t => hermite(pts, t);
  })();

  // ac_bone_default — 骨头生长（线性）
  const AC_BONE = t => t;

  // ============= State =============
  const state = {
    loaded: false,
    loading: false,
    bullets: [],
    lasers: [],
    platforms: [],
    stabWarnings: [],
    sineBones: [],
    // BHUTE 风格龙骨炮（独立于 lasers，带前摇/后座/帧动画）
    gbs: [],
    // BHUTE 风格骨头（带旋转/生长动画）
    rotBones: [],
    // BHUTE 风格预警框
    warnBoxes: [],
    // BHUTE 风格预警线
    warnLines: [],
    // BHUTE 风格伤害飘字
    damageNums: [],
    // BHUTE 风格方块尘埃粒子（Dusttale 特色）
    dust: [],
    // 屏幕震动（0~1 强度）
    shake: 0,
    // 屏幕 Glow 开关 + 强度
    glowEnabled: false,
    glowStrength: 1,

    blackScreen: 0,
    combatZone: { left: 133, top: 226, right: 508, bottom: 391 },
    soul: { x: 320, y: 304, vx: 0, vy: 0, mode: 1, maxFallSpeed: 750, onGround: false },
    vars: { pi: 3.141592653589793 },
    labels: [],
    instructions: [],
    intervals: [],
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

  // ============= Shook (BHUTE Shook_Set / Shook_Tick) =============
  function shookSet(s) {
    if (s > state.shake) state.shake = s;
  }
  function shookTick() {
    if (state.shake >= 0.01) {
      state.shake = Math.max(0, state.shake - 0.05);
    } else {
      state.shake = 0;
    }
  }
  function shakeOffset() {
    if (state.shake <= 0) return { x: 0, y: 0 };
    const k = state.shake;
    return {
      x: (Math.random() * 2 - 1) * 10 * k,
      y: (Math.random() * 2 - 1) * 10 * k,
    };
  }

  // ============= Damage Number (BHUTE obj_damage_num) =============
  function spawnDamageNum(x, y, damage) {
    const bits = [];
    let n = Math.abs(damage);
    if (n === 0) bits.push(0);
    while (n > 0) { bits.unshift(n % 10); n = Math.floor(n / 10); }
    state.damageNums.push({ x, y, bits, t: 0, life: 60 });
  }

  // ============= Dust Particle (Dusttale 特色) =============
  function spawnDust(x, y, count, color) {
    for (let i = 0; i < count; i++) {
      state.dust.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 2,
        vy: -Math.random() * 1.5 - 0.5,
        size: 2 + Math.random() * 3,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.15,
        life: 40 + Math.random() * 30,
        color: color || '#a080d0',
      });
    }
  }

  // ============= Sprite Loading =============
  function loadSpriteSheet() {
    const promises = SPRITE_LIST.map(def => new Promise(resolve => {
      const img = new Image();
      img.onload = () => { sprites[def.name] = img; resolve(); };
      img.onerror = () => { resolve(); };
      img.src = def.path + def.file;
    }));
    return Promise.all(promises).then(() => { state.loaded = true; });
  }

  function loadCSV(name) {
    return fetch(C2SF_PATH + name)
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
      if (parts[1] && parts[1].startsWith(':')) {
        labels[parts[1].substring(1)] = instrs.length;
        continue;
      }
      if (!parts[0] && !parts[1]) continue;
      instrs.push({ time: parseFloat(parts[0]) || 0, cmd: parts[1] || '', args: parts.slice(2) });
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

  function parseColor(c) {
    const map = { '1': '#ff8800', '0': '#ffffff', '2': '#4488ff', '3': '#ff4444', '4': '#cc66ff', '5': '#00ffff' };
    return map[c] || c || '#ffffff';
  }

  // ============= CMD 实现（增加 Warnbox/Warnline/GB 指令） =============
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

    BoneV: (a) => {
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
      state.intervals.push({
        run: () => {
          const elapsedSec = (performance.now() - state.startTime) / 1000;
          const localElapsed = elapsedSec - t;
          if (localElapsed < 0) return;
          const shouldFire = Math.floor(localElapsed * 60 / interval);
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
      state.intervals.push({
        run: () => {
          const elapsedSec = (performance.now() - state.startTime) / 1000;
          const localElapsed = elapsedSec - t;
          if (localElapsed < 0) return;
          const shouldFire = Math.floor(localElapsed * 60 / interval);
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
      // BHUTE 预警线
      const z = state.combatZone;
      let x1, y1, x2, y2;
      if (dir <= 1) { x1 = x2 = pos; y1 = z.top; y2 = z.bottom; }
      else { y1 = y2 = pos; x1 = z.left; x2 = z.right; }
      state.warnLines.push({ x1, y1, x2, y2, keepTime: warnDur * 1000, t: 0 });
    },

    SineBones: (a) => {
      const count = parseInt(resolve(a[0])) || 16;
      const amp = resolve(a[1]) || 0;
      const yBase = resolve(a[2]) || 300;
      const period = resolve(a[3]) || 55;
      for (let i = 0; i < count; i++) {
        state.sineBones.push({
          x: -20 - i * 22, y: yBase, amp: amp * 10, period: period * 10,
          phase: i * 0.3, vy: 2.5, w: 14, h: 28,
        });
      }
    },

    GasterBlaster: (a, t) => {
      // 新 BHUTE 风格龙骨炮指令：使用前摇动画 + 激光 + 后座
      const sx = resolve(a[1]), sy = resolve(a[2]);
      const ex = resolve(a[3]), ey = resolve(a[4]);
      const ang = resolve(a[5]) || 0;
      const warnDur = (resolve(a[6]) || 0.5) * 1000;
      const fireDur = (resolve(a[7]) || 0.3) * 1000;

      // 同时创建一个 lasers 条目（用于后向兼容 + 碰撞检测）
      state.lasers.push({
        sx, sy, ex, ey, angle: ang * Math.PI / 180,
        warnDuration: warnDur, warnTimer: 0, fired: false, fireTimer: 0,
        fireDuration: fireDur,
      });

      // 创建 BHUTE 风格龙骨炮对象（前摇→开火→后座）
      state.gbs.push({
        x: sx, y: sy, tx: sx, ty: sy, facing: ang,
        size: 1, keepTime: fireDur / 16, fireTime: 0,
        start_facing: 90, readyTime: true,
        time: -(warnDur / 16), glow: true,
      });
    },

    Platform: (a) => {
      const x = resolve(a[0]), y = resolve(a[1]), w = resolve(a[2]) || 50;
      const side = parseInt(resolve(a[3]));
      const spd = resolve(a[4]) || 0;
      state.platforms.push({ x, y, w, h: 8, side, vx: side === 0 ? spd : -spd });
    },

    PlatformRepeat: (a, t) => {
      const x = resolve(a[0]), y = resolve(a[1]), w = resolve(a[2]) || 50;
      const side = parseInt(resolve(a[3]));
      const spd = resolve(a[4]) || 0;
      const count = parseInt(resolve(a[5])) || 5;
      const interval = resolve(a[6]) || 120;
      const vx = side === 0 ? spd : -spd;
      let fired = 0;
      state.intervals.push({
        run: () => {
          const elapsedSec = (performance.now() - state.startTime) / 1000;
          const localElapsed = elapsedSec - t;
          if (localElapsed < 0) return;
          const shouldFire = Math.floor(localElapsed * 60 / interval);
          while (fired < shouldFire && fired < count) {
            state.platforms.push({ x: x - fired * 60, y, w, h: 8, side, vx });
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

    TLPause: () => {},
    TLResume: () => {},
    Sound: () => {},
    EndAttack: () => { state.running = false; return false; },
  };

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
    state.gbs = [];
    state.rotBones = [];
    state.warnBoxes = [];
    state.warnLines = [];
    state.damageNums = [];
    state.dust = [];
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
    state.shake = 0;
  }

  function endAttack() { state.running = false; }

  function fireStabBone(s) {
    const dir = s.direction;
    let x, y, vx, vy, w, h;
    if (dir === 0) { x = s.pos; y = state.combatZone.top - 30; vx = 0; vy = 6; w = 18; h = 30; }
    else if (dir === 1) { x = s.pos; y = state.combatZone.bottom + 30; vx = 0; vy = -6; w = 18; h = 30; }
    else if (dir === 2) { x = state.combatZone.left - 30; y = s.pos; vx = 6; vy = 0; w = 30; h = 10; }
    else { x = state.combatZone.right + 30; y = s.pos; vx = -6; vy = 0; w = 30; h = 10; }
    state.bullets.push({ type: dir <= 1 ? 'bonev' : 'boneh', x, y, w, h, vx, vy, color: s.color });
  }

  // ============= Update =============
  function update() {
    shookTick();

    if (state.soulTeleport) {
      state.soul.x = state.soulTeleport.x;
      state.soul.y = state.soulTeleport.y;
      state.soulTeleport = null;
    }
    if (state.sansSlamTimer > 0) state.sansSlamTimer -= 16;

    if (state.combatZone.target) {
      const z = state.combatZone;
      const t = state.combatZone.target;
      z.left   += (t.left   - z.left)   * 0.05;
      z.top    += (t.top    - z.top)    * 0.05;
      z.right  += (t.right  - z.right)  * 0.05;
      z.bottom += (t.bottom - z.bottom) * 0.05;
      if (Math.abs(z.left - t.left) < 0.5) { Object.assign(z, t); state.combatZone.target = null; }
    }

    // bullets
    for (const b of state.bullets) { b.x += b.vx; b.y += b.vy; }
    state.bullets = state.bullets.filter(b => b.x > -50 && b.x < CANVAS_W + 50 && b.y > -50 && b.y < CANVAS_H + 50);

    // platforms
    for (const p of state.platforms) p.x += p.vx;
    state.platforms = state.platforms.filter(p => p.x > -100 && p.x < CANVAS_W + 100);

    // stab warnings
    for (const s of state.stabWarnings) {
      s.t += 16;
      if (!s.fired && s.t >= s.warnDur) { s.fired = true; fireStabBone(s); }
    }
    state.stabWarnings = state.stabWarnings.filter(s => !s.fired || s.t < s.warnDur + 500);

    // sine bones
    for (const sb of state.sineBones) {
      sb.x += sb.vy + 2;
      sb.y += Math.sin(sb.x / sb.period * Math.PI) * sb.amp * 0.3;
    }
    state.sineBones = state.sineBones.filter(sb => sb.x > -30 && sb.x < CANVAS_W + 30);

    // lasers
    for (const l of state.lasers) {
      if (!l.fired) {
        l.warnTimer += 16;
        if (l.warnTimer >= l.warnDuration) { l.fired = true; l.fireTimer = 0; shookSet(0.8); }
      } else {
        l.fireTimer += 16;
      }
    }
    state.lasers = state.lasers.filter(l => !l.fired || l.fireTimer < l.fireDuration);

    // BHUTE GBs
    for (const gb of state.gbs) {
      gb.time++;
      // 前摇动画 (time 0 → 27)
      if (gb.time >= 1 && gb.time <= 27 && gb.readyTime) {
        const curve = AC_GB_PREPARE(gb.time / 27);
        const dis = (200 - curve) * 1.5 * gb.size;
        const dir = gb.facing;
        gb.x = gb.tx + Math.cos((dir + 135) * Math.PI / 180) * dis;
        gb.y = gb.ty + Math.sin((dir + 135) * Math.PI / 180) * dis;
      }
      if (gb.time === 27) {
        gb.x = gb.tx; gb.y = gb.ty;
        gb.shootTime = 27 + gb.fireTime;
      }
      // 开火瞬间：震动
      if (gb.time === gb.shootTime) {
        gb.fired = true;
        gb.shook = true;
        shookSet(1.0 * gb.size);
      }
      // 后座 (开火后 time 27+fireTime → keepTime)
      if (gb.fired) {
        const t = (gb.time - gb.shootTime) / 60;
        let back_dis = AC_GB_LEFT(Math.min(1, t)) * gb.size * 2;
        if (t >= 1) back_dis += 20;
        gb.x = gb.tx - Math.cos(gb.facing * Math.PI / 180) * back_dis;
        gb.y = gb.ty - Math.sin(gb.facing * Math.PI / 180) * back_dis;
        gb.frame = (gb.frame || 0) + 0.3;
      }
    }
    state.gbs = state.gbs.filter(gb => gb.time < (gb.shootTime || 0) + gb.keepTime || !gb.shootTime);

    // warnLines
    for (const wl of state.warnLines) wl.t += 16;
    state.warnLines = state.warnLines.filter(wl => wl.t < wl.keepTime);

    // damageNums
    for (const dn of state.damageNums) { dn.t++; dn.y -= 0.8 + dn.t * 0.02; }
    state.damageNums = state.damageNums.filter(dn => dn.t < dn.life);

    // dust particles
    for (const d of state.dust) {
      d.x += d.vx; d.y += d.vy; d.vy += 0.05; d.rot += d.vr; d.life--;
    }
    state.dust = state.dust.filter(d => d.life > 0);

    // intervals
    for (const interval of (state.intervals || [])) interval.run();
    state.intervals = (state.intervals || []).filter(i => !i.done());

    runInterpreter(16);
  }

  // ============= Draw Helpers =============
  function drawImg(ctx, name, x, y, w, h, angle = 0, alpha = 1) {
    const img = sprites[name];
    if (!img) return false;
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
    return true;
  }

  // 绘制骨头（BHUTE 风格：bottom → pixel×N → top，可旋转可变色）
  function drawBHUTEBone(ctx, b) {
    const w = 10, pixelH = 6, totalH = b.h;
    const long = Math.max(0, Math.round((totalH - 12) / pixelH));
    const rot = (b.angle || 0); // degrees
    const offX = Math.cos((rot + 90) * Math.PI / 180);
    const offY = Math.sin((rot + 90) * Math.PI / 180);
    const cx = b.x, cy = b.y;
    const col = b.color || '#ffffff';
    const alpha = 1;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot * Math.PI / 180);

    // bottom bone (10x6) — 固定在 origin 位置
    const bb = sprites['bb'];
    if (bb) {
      ctx.drawImage(bb, -bb.width/2, 0);
    } else {
      ctx.fillStyle = col;
      ctx.fillRect(-5, 0, 10, 6);
    }
    // pixel bones (6x6) — 堆叠
    const bp = sprites['bp'];
    for (let i = 0; i < long; i++) {
      if (bp) ctx.drawImage(bp, -bp.width/2, 6 + i * pixelH);
      else { ctx.fillStyle = col; ctx.fillRect(-3, 6 + i * pixelH, 6, 6); }
    }
    // top bone (10x6)
    const bt = sprites['bt'];
    if (bt) {
      ctx.drawImage(bt, -bt.width/2, 6 + long * pixelH);
    } else {
      ctx.fillStyle = col;
      ctx.fillRect(-5, 6 + long * pixelH, 10, 6);
    }
    ctx.restore();
  }

  function drawBullet(ctx, b) {
    // 优先用 BHUTE 骨头绘制
    if (b.type === 'bonev' || b.type === 'boneh') {
      // BHUTE 骨头 — 垂直骨头有完整高度，水平骨头宽度对应长度
      if (b.type === 'boneh') {
        // 水平骨头：用 BHUTE 骨头旋转 90°
        drawBHUTEBone(ctx, { ...b, angle: 90, h: b.w, w: b.h });
      } else {
        drawBHUTEBone(ctx, { ...b, angle: 0 });
      }
      // 若 BHUTE 素材未加载，fallback 到 Construct 2 sprite
      if (!sprites['bt']) {
        const key = b.type === 'bonev' ? 'bonev' : 'boneh';
        if (sprites[key]) {
          ctx.save();
          ctx.globalAlpha = 0.95;
          ctx.drawImage(sprites[key], b.x - b.w/2, b.y - b.h/2, b.w, b.h);
          ctx.restore();
        }
      }
      return;
    }
    ctx.save();
    ctx.fillStyle = b.color || '#ffffff';
    ctx.fillRect(b.x - b.w/2, b.y - b.h/2, b.w, b.h);
    ctx.restore();
  }

  // 绘制龙骨炮（BHUTE 风格：前摇 → 开火动画 → 后座 → 激光）
  function drawGB(ctx, gb) {
    const frame = Math.min(6, Math.floor(gb.frame || 0));
    const frameName = 'gb' + frame;
    const img = sprites[frameName] || sprites['gb0'];
    if (!img) return;

    ctx.save();
    ctx.translate(gb.x, gb.y);
    // BHUTE: image_angle = facing + 90 + start_facing (start_facing 随前摇变化)
    let angle = gb.facing + 90;
    if (gb.time >= 1 && gb.time <= 27 && gb.readyTime && !gb.fired) {
      const t = gb.time / 27;
      const dir = gb.start_facing * (1 - AC_GB_PREPARE(t) / 200);
      angle = gb.facing + 90 + dir;
    }
    ctx.rotate(angle * Math.PI / 180);
    // 开火帧动画（fired 后自动循环）
    const scale = 1.6 * gb.size;
    ctx.drawImage(img, -img.width/2, -img.height/2, img.width * scale, img.height * scale);
    ctx.restore();

    // 激光（开火后）
    if (gb.fired) {
      const lf = gb.time - gb.shootTime; // 开火后经过的 frame
      const lfmax = gb.keepTime;
      if (lf >= 0 && lf < lfmax) {
        const t = lf / lfmax;
        drawLaserBeam(ctx, gb.tx, gb.ty, gb.facing, t, gb.size, gb.glow);
      }
    }
  }

  // 独立的 laser（后向兼容 + 碰撞检测，以及未走 GasterBlaster 新指令的情况）
  function drawLaser(ctx, l) {
    const isWarn = !l.fired;
    if (isWarn) {
      drawWarnLine(ctx, l.sx, l.sy, l.ex, l.ey);
      return;
    }
    const dx = l.ex - l.sx, dy = l.ey - l.sy;
    const ang = Math.atan2(dy, dx) * 180 / Math.PI;
    const elapsed = l.fireTimer / 16;
    const maxFrames = l.fireDuration / 16;
    drawLaserBeam(ctx, l.sx, l.sy, ang, elapsed / maxFrames, 1.0, true);
  }

  // BHUTE 风格激光光束（spr_gb_light_growing + 动画曲线 scale/alpha + add blend）
  function drawLaserBeam(ctx, sx, sy, angleDeg, t, size, glow) {
    const dx = Math.cos(angleDeg * Math.PI / 180);
    const dy = Math.sin(angleDeg * Math.PI / 180);
    const len = Math.hypot(CANVAS_W, CANVAS_H);
    const scaleH = AC_GB_DEFAULT(t);
    const alpha = AC_GB_ALPHA(t);
    const hasGlow = glow;
    const glowImg = sprites['gbglow'];

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.translate(sx, sy);
    ctx.rotate(angleDeg * Math.PI / 180);

    if (hasGlow && glowImg) {
      const glowH = 4140;
      ctx.save();
      ctx.globalAlpha = alpha * 0.5;
      ctx.drawImage(glowImg, 0, -glowH/2, len + 200, glowH);
      ctx.restore();
    }
    // 核心亮白光束
    ctx.save();
    ctx.globalAlpha = alpha;
    const coreW = 32 * size * scaleH;
    const grad = ctx.createLinearGradient(0, -coreW/2, 0, coreW/2);
    grad.addColorStop(0, 'rgba(100,180,255,0)');
    grad.addColorStop(0.3, 'rgba(150,210,255,0.8)');
    grad.addColorStop(0.5, 'rgba(255,255,255,1)');
    grad.addColorStop(0.7, 'rgba(150,210,255,0.8)');
    grad.addColorStop(1, 'rgba(100,180,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, -coreW/2, len + 100, coreW);
    ctx.restore();

    ctx.restore();

    // 激光起点/终点的龙骨炮（简洁版）
    const gbImg = sprites['gb0'];
    if (gbImg) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = alpha * 0.9;
      ctx.translate(sx, sy);
      ctx.rotate(angleDeg * Math.PI / 180);
      ctx.drawImage(gbImg, -gbImg.width/2, -gbImg.height/2, gbImg.width * 1.6 * size, gbImg.height * 1.6 * size);
      ctx.restore();
    }
  }

  // BHUTE 风格预警线（红黄色闪烁，draw_line_width）
  function drawWarnLine(ctx, x1, y1, x2, y2) {
    const cycle = Math.floor(Date.now() / 80) % 2;
    const col = cycle === 0 ? '#ff2222' : '#ffee44';
    ctx.save();
    ctx.strokeStyle = col;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    // 内部虚线描边
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.setLineDash([10, 6]);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  }

  function drawStabWarn(ctx, s) {
    const dir = s.direction;
    let x1, y1, x2, y2;
    const z = state.combatZone;
    if (dir <= 1) { x1 = x2 = s.pos; y1 = z.top; y2 = z.bottom; }
    else { y1 = y2 = s.pos; x1 = z.left; x2 = z.right; }
    drawWarnLine(ctx, x1, y1, x2, y2);
  }

  function drawPlatform(ctx, p) {
    ctx.save();
    ctx.fillStyle = '#3355aa';
    ctx.fillRect(p.x - p.w/2, p.y - p.h/2, p.w, p.h);
    ctx.fillStyle = '#6688dd';
    ctx.fillRect(p.x - p.w/2, p.y - p.h/2, p.w, 3);
    ctx.restore();
  }

  // BHUTE 风格战斗框（用 spr_battle_edge_corner 画四角 + battle edge 画四边）
  function drawBattleFrame(ctx, z) {
    ctx.save();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(z.left - 1, z.top - 1, z.right - z.left + 2, z.bottom - z.top + 2);
    ctx.restore();
  }

  function drawSoul(ctx) {
    const heart = state.soul.mode === 1 ? 'pheart0' : 'pheart1';
    const img = sprites[heart] || sprites['pheart0'];
    const px = state.soul.x, py = state.soul.y;
    ctx.save();
    if (img) {
      ctx.drawImage(img, px - 8, py - 10, 16, 20);
    } else {
      ctx.fillStyle = state.soul.mode === 1 ? '#ff2222' : '#4488ff';
      ctx.beginPath();
      ctx.arc(px, py, 7, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.restore();
  }

  // BHUTE 风格伤害飘字（每个数字一张 spr_damage 帧，从右向左排列）
  function drawDamageNum(ctx, dn) {
    const scale = 1 - dn.t / dn.life * 0.4;
    const alpha = 1 - dn.t / dn.life;
    const bitW = 30 * scale;
    const totalW = dn.bits.length * bitW;
    let startX = dn.x - totalW / 2;
    ctx.save();
    ctx.globalAlpha = alpha;
    for (const b of dn.bits) {
      const name = 'dmg' + b;
      const img = sprites[name];
      if (img) {
        ctx.drawImage(img, startX, dn.y - 15 * scale, bitW, 30 * scale);
      } else {
        ctx.fillStyle = '#ffee44';
        ctx.font = 'bold 20px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(b, startX + bitW/2, dn.y);
      }
      startX += bitW;
    }
    ctx.restore();
  }

  // Dusttale 尘埃粒子（旋转的彩色小方块）
  function drawDust(ctx) {
    ctx.save();
    for (const d of state.dust) {
      const alpha = Math.min(1, d.life / 30);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = d.color;
      ctx.translate(d.x, d.y);
      ctx.rotate(d.rot);
      ctx.fillRect(-d.size/2, -d.size/2, d.size, d.size);
      ctx.restore();
    }
    ctx.restore();
  }

  function drawSans(ctx) {
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(state.sansText || '', CANVAS_W / 2, 24);
    ctx.restore();
  }

  // ============= 主 Draw =============
  function draw(ctx) {
    const z = state.combatZone;
    const off = shakeOffset();

    ctx.save();
    ctx.translate(off.x, off.y);

    // 背景
    ctx.fillStyle = state.blackScreen > 0 ? '#000' : '#0a0a18';
    ctx.fillRect(-20, -20, CANVAS_W + 40, CANVAS_H + 40);

    // 战斗区域
    ctx.save();
    ctx.beginPath();
    ctx.rect(z.left, z.top, z.right - z.left, z.bottom - z.top);
    ctx.clip();

    // Dust 粒子（战斗区域内）
    drawDust(ctx);

    // platforms
    for (const p of state.platforms) drawPlatform(ctx, p);

    // lasers（独立的 lasers 数组 —— 预警或发光束）
    for (const l of state.lasers) drawLaser(ctx, l);

    // BHUTE 龙骨炮（带前摇 / 后座 / 帧动画 / 激光）
    for (const gb of state.gbs) drawGB(ctx, gb);

    // bullets（BHUTE 骨头风格）
    for (const b of state.bullets) drawBullet(ctx, b);
    for (const sb of state.sineBones) drawBullet(ctx, { type: 'bonev', ...sb, color: '#ffffff' });

    // stab warning lines（BHUTE Warnline 风格）
    for (const s of state.stabWarnings) drawStabWarn(ctx, s);
    for (const wl of state.warnLines) drawWarnLine(ctx, wl.x1, wl.y1, wl.x2, wl.y2);

    drawSoul(ctx);

    ctx.restore();

    // 战斗框（clip 外）
    drawBattleFrame(ctx, z);

    // damageNums（最顶层 UI）
    for (const dn of state.damageNums) drawDamageNum(ctx, dn);

    ctx.restore();
  }

  // ============= 碰撞检测 =============
  function collidesBullet() {
    const sx = state.soul.x, sy = state.soul.y;
    for (const b of state.bullets) {
      if (Math.abs(sx - b.x) < (b.w/2 + 5) && Math.abs(sy - b.y) < (b.h/2 + 5)) {
        spawnDamageNum(sx, sy - 20, 5);
        shookSet(0.6);
        spawnDust(sx, sy, 8, '#ff8080');
        return b;
      }
    }
    for (const sb of state.sineBones) {
      if (Math.abs(sx - sb.x) < (sb.w/2 + 5) && Math.abs(sy - sb.y) < (sb.h/2 + 5)) {
        spawnDamageNum(sx, sy - 20, 5);
        shookSet(0.6);
        return sb;
      }
    }
    for (const l of state.lasers) {
      if (!l.fired || l.fireTimer > l.fireDuration * 0.8) continue;
      const dx = l.ex - l.sx, dy = l.ey - l.sy;
      const len2 = dx*dx + dy*dy;
      const t = Math.max(0, Math.min(1, ((sx - l.sx) * dx + (sy - l.sy) * dy) / len2));
      const px = l.sx + t * dx, py = l.sy + t * dy;
      if (Math.hypot(sx - px, sy - py) < 8) {
        spawnDamageNum(sx, sy - 20, 5);
        shookSet(0.8);
        spawnDust(sx, sy, 12, '#80a0ff');
        return l;
      }
    }
    // BHUTE 风格 GB 的激光碰撞
    for (const gb of state.gbs) {
      if (!gb.fired) continue;
      const dx = Math.cos(gb.facing * Math.PI / 180);
      const dy = Math.sin(gb.facing * Math.PI / 180);
      const len = CANVAS_W + CANVAS_H;
      const ex = gb.tx + dx * len, ey = gb.ty + dy * len;
      const ldx = ex - gb.tx, ldy = ey - gb.ty;
      const l2 = ldx*ldx + ldy*ldy;
      const pt = Math.max(0, Math.min(1, ((sx - gb.tx) * ldx + (sy - gb.ty) * ldy) / l2));
      const px = gb.tx + pt * ldx, py = gb.ty + pt * ldy;
      if (Math.hypot(sx - px, sy - py) < 10) {
        spawnDamageNum(sx, sy - 20, 5);
        shookSet(1.0);
        spawnDust(sx, sy, 15, '#a0c0ff');
        return gb;
      }
    }
    return null;
  }

  function platformCollisions() { return state.platforms; }
  function getSoul() { return state.soul; }
  function getCombatZone() { return state.combatZone; }
  function isRunning() { return state.running; }

  return {
    loadSpriteSheet, loadCSV, startAttack, endAttack, update, draw,
    collidesBullet, platformCollisions, getSoul, getCombatZone, isRunning,
    shookSet, spawnDamageNum, spawnDust,
    state, CANVAS_W, CANVAS_H,
  };
})();
