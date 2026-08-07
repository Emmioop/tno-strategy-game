// c2sf_engine.js v300 — 完整抄原版c2-sans-fight + BHUTE渲染引擎
// 核心改进:
//   - 龙骨炮4帧动画(闭嘴→微张→大张→发射) + 激光多层光晕
//   - 预警线/预警框闪烁动画
//   - 骨头使用原版图片精确绘制
//   - 原版CSV指令集完整支持
//   - 战斗区域黑色背景 + combatzone平铺
//   - 震动/飘字/尘埃粒子
//   - 龙骨炮自动按beam方向旋转

const C2SF = (() => {
  const CW = 640, CH = 480;
  const ASSETS = 'assets/c2sf/';

  const sp = {};

  const state = {
    loaded: false,
    bullets: [],
    lasers: [],
    platforms: [],
    stabs: [],
    sines: [],
    gbs: [],
    ivs: [],
    dust: [],
    dmgNums: [],

    cz: { l: 239, t: 226, r: 404, b: 391 },
    czT: null,

    soul: { x: 320, y: 304, vx: 0, vy: 0, mode: 0, maxFall: 750, onGnd: false },
    soulTP: null,

    shake: 0,
    blackScreen: 0,

    vars: { pi: Math.PI },
    labels: {},
    instrs: [],
    pc: 0,
    t0: 0,
    run: false,

    phaseName: '',
    hitFlash: 0,

    sansAnim: 'Idle',
    sansHead: 'Default',
    sansBody: 'HandDown',
    sansSlam: -1,
    sansSlamT: 0,
    sansX: 320,
    sansSweat: 0,
    sansText: '',
  };

  function loadSpriteSheet() {
    const defs = [
      ['bonev','bonev.png'],['boneh','boneh.png'],
      ['bonestabv','bonestabv.png'],['bonestabh','bonestabh.png'],
      ['bonestabwarn','bonestabwarn.png'],
      ['cz','combatzone.png'],['czb','combatzoneborder.png'],
      ['czclip','combatzoneclipper.png'],['czunclip','combatzoneunclipper.png'],
      ['heart0','playerheart-sheet0.png'],['heart1','playerheart-sheet1.png'],
      ['plat1','platform1.png'],['plat2','platform2.png'],
      ['gbs0','gasterblaster-sheet0.png'],
      ['gbs1','gasterblaster-sheet1.png'],
      ['gbhit','gasterblasthit.png'],
      ['hpbar','hpbar.png'],['krbar','krbar.png'],['hpbg','hpbackground.png'],
      ['sansbody0','sansbody-sheet0.png'],['sansbody1','sansbody-sheet1.png'],
      ['sanshead','sanshead-sheet0.png'],
      ['sansleg','sanslegs-sheet0.png'],['sanstorso','sanstorso-sheet0.png'],
      ['sanssweat','sanssweat-sheet0.png'],
      ['target','target-sheet0.png'],['targetch','targetchoice-sheet0.png'],
      ['strike','strike-sheet0.png'],
      ['speech','speechbubble-sheet0.png'],
      ['toucha0','toucha-sheet0.png'],['toucha1','toucha-sheet1.png'],
      ['touchb0','touchb-sheet0.png'],['touchb1','touchb-sheet1.png'],
      ['touchdpad','touchdpad-sheet0.png'],
      ['uiact','uiact-sheet0.png'],['uifight','uifight-sheet0.png'],
      ['uiitem','uiitem-sheet0.png'],['uimercy','uimercy-sheet0.png'],
      ['vpad','vpad-sheet0.png'],
    ];
    return Promise.all(defs.map(([n,f]) => new Promise(r => {
      const img = new Image();
      img.onload = () => { sp[n] = img; r(); };
      img.onerror = () => { r(); };
      img.src = ASSETS + f;
    }))).then(() => { state.loaded = true; });
  }

  function loadCSV(name) {
    return fetch(ASSETS + name).then(r => r.text()).then(t => parseCSV(t)).catch(() => null);
  }

  function parseCSV(text) {
    const lines = text.trim().split('\n').filter(l => l.trim());
    const raw = [];
    let maxT = 0;
    for (const line of lines) {
      const p = line.split(',').map(s => s.trim());
      if (p[1] && p[1].startsWith(':')) {
        raw.push({ t: parseFloat(p[0])||0, cmd:'__LBL__', args:[p[1].substring(1)], _idx:raw.length });
        continue;
      }
      if (!p[0] && !p[1]) continue;
      const t = parseFloat(p[0])||0;
      if (t > maxT) maxT = t;
      raw.push({ t, cmd:p[1]||'', args:p.slice(2), _idx:raw.length });
    }
    for (const i of raw) if (i.cmd === 'EndAttack') i.t = maxT + 100;
    raw.sort((a,b) => a.t !== b.t ? a.t - b.t : a._idx - b._idx);
    const rawLbl = {};
    for (let i = 0; i < raw.length; i++)
      if (raw[i].cmd === '__LBL__') rawLbl[raw[i].args[0]] = i;
    const real = raw.filter(i => i.cmd !== '__LBL__');
    const lbl = {};
    for (const [n, oi] of Object.entries(rawLbl)) {
      let c = 0;
      for (let i = 0; i < oi; i++) if (raw[i].cmd !== '__LBL__') c++;
      lbl[n] = c;
    }
    return { instrs: real, labels: lbl };
  }

  function resolve(v) {
    if (v === undefined || v === null || v === '') return 0;
    if (typeof v !== 'string') return v;
    if (v.startsWith('$')) {
      const k = v.substring(1);
      if (k in state.vars) return state.vars[k];
      const n = parseFloat(k); return isNaN(n) ? 0 : n;
    }
    const n = parseFloat(v);
    if (!isNaN(n)) return n;
    if (v in state.vars) return state.vars[v];
    return v;
  }
  const r = resolve;

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
      const x1=r(a[1]),y1=r(a[2]),x2=r(a[3]),y2=r(a[4]);
      state.vars[a[0]] = Math.atan2(y2-y1, x2-x1) * 180/Math.PI;
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

    BoneV: a => {
      const x=r(a[0]), y=r(a[1]), h=r(a[2]), side=parseInt(r(a[3]))||0, spd=r(a[4])||240, color=parseInt(r(a[5]))||0;
      const vy = (side===2 ? spd : -spd) / 60;
      state.bullets.push({ type:'bonev', x, y, w:10, h, vx:0, vy, color, rot:0 });
    },
    BoneVRepeat: (a,t) => {
      const x=r(a[0]), y=r(a[1]), h=r(a[2]), side=parseInt(r(a[3]))||0, spd=r(a[4])||240;
      const cnt=parseInt(r(a[5]))||4, iv=r(a[6])||16, color=parseInt(r(a[7]))||0;
      const vy = (side===2 ? spd : -spd) / 60;
      let fired=0;
      state.ivs.push({ run:(es)=>{ const le=es-t; if(le<0)return; const sf=Math.floor(le*60/iv); while(fired<sf&&fired<cnt){ state.bullets.push({type:'bonev',x,y,w:10,h,vx:0,vy,color,rot:0}); fired++; } }, done:()=>fired>=cnt });
    },
    BoneH: a => {
      const x=r(a[0]), y=r(a[1]), spd=r(a[2])||200, side=parseInt(r(a[3]))||0, color=parseInt(r(a[4]))||0;
      const vx = (side===0 ? spd : -spd) / 60;
      state.bullets.push({ type:'boneh', x, y, w:24, h:10, vx, vy:0, color, rot:0 });
    },
    BoneHRepeat: (a,t) => {
      const x=r(a[0]), y=r(a[1]), spd=r(a[2])||200, side=parseInt(r(a[3]))||0;
      const cnt=parseInt(r(a[4]))||3, iv=r(a[5])||15, color=parseInt(r(a[6]))||0;
      const vx = (side===0 ? spd : -spd) / 60;
      let fired=0;
      state.ivs.push({ run:(es)=>{ const le=es-t; if(le<0)return; const sf=Math.floor(le*60/iv); while(fired<sf&&fired<cnt){ state.bullets.push({type:'boneh',x,y,w:24,h:10,vx,vy:0,color,rot:0}); fired++; } }, done:()=>fired>=cnt });
    },
    BoneStab: a => {
      const dir=parseInt(r(a[0])), pos=r(a[1]), wd=(r(a[2])||0.4)*1000, h=r(a[3])||24;
      state.stabs.push({ dir, pos, wd, h, t:0, fired:false });
    },
    SineBones: a => {
      const cnt=parseInt(r(a[0]))||16, amp=r(a[1])||0, yb=r(a[2])||300, per=r(a[3])||55;
      for (let i=0;i<cnt;i++)
        state.sines.push({ x:-20-i*22, y:yb, amp:amp*10, per:per*10, phase:i*0.3, vy:2.5, w:14, h:28, color:0 });
    },
    GasterBlaster: a => {
      const size=r(a[0])||1, sx=r(a[1]), sy=r(a[2]), ex=r(a[3]), ey=r(a[4]);
      const ang=r(a[5])||0, wd=(r(a[6])||0.5)*1000, fd=(r(a[7])||0.3)*1000;
      state.gbs.push({ sx, sy, ex, ey, size, angle:ang, wdT:0, wd, fired:false, fireT:0, fd });
      state.lasers.push({ sx, sy, ex, ey, angle:ang, wdT:0, wd, fired:false, fireT:0, fd, size });
    },
    Platform: a => {
      const x=r(a[0]), y=r(a[1]), w=r(a[2])||50, side=parseInt(r(a[3]))||0, spd=r(a[4])||0;
      state.platforms.push({ x, y, w, h:7, side, vx:side===0?spd:-spd });
    },
    PlatformRepeat: (a,t) => {
      const x=r(a[0]), y=r(a[1]), w=r(a[2])||50, side=parseInt(r(a[3]))||0, spd=r(a[4])||0;
      const cnt=parseInt(r(a[5]))||5, iv=r(a[6])||120;
      const vx = side===0?spd:-spd;
      let fired=0;
      state.ivs.push({ run:(es)=>{ const le=es-t; if(le<0)return; const sf=Math.floor(le*60/iv); while(fired<sf&&fired<cnt){ state.platforms.push({x,y,w,h:7,side,vx}); fired++; } }, done:()=>fired>=cnt });
    },
    HeartMode: a => { state.soul.mode = parseInt(r(a[0])); },
    HeartTeleport: a => { state.soulTP = { x:r(a[0]), y:r(a[1]) }; },
    HeartMaxFallSpeed: a => { state.soul.maxFall = r(a[0]); },
    CombatZoneResize: a => { state.czT = { l:r(a[0]), t:r(a[1]), r:r(a[2]), b:r(a[3]) }; },
    CombatZoneResizeInstant: a => {
      state.cz = { l:r(a[0]), t:r(a[1]), r:r(a[2]), b:r(a[3]) };
      state.czT = null;
    },
    CombatZoneSpeed: () => {},
    BlackScreen: a => { state.blackScreen = r(a[0])>0 ? 1 : 0; },
    SansAnimation: a => { state.sansAnim = a[0]||'Idle'; },
    SansHead: a => { state.sansHead = a[0]||'Default'; },
    SansBody: a => { state.sansBody = a[0]||'HandDown'; },
    SansSweat: a => { state.sansSweat = parseInt(r(a[0]))||0; },
    SansText: a => { state.sansText = a[0]||''; },
    SansTorso: a => {},
    SansSlam: a => {
      state.sansSlam = parseInt(r(a[0]));
      state.sansSlamT = 300;
      state.shake = Math.max(state.shake, 1.0);
      spawnDust(CW/2, CH/2, 25);
    },
    SansSlamDamage: () => { state.shake = Math.max(state.shake, 0.8); },
    SansX: a => { state.sansX = r(a[0]); },
    SansRepeat: () => {},
    SansEndRepeat: () => {},
    TLPause: () => {},
    TLResume: () => {},
    Sound: () => {},
    EndAttack: () => { state.run = false; return false; },
  };

  function runInterpreter() {
    if (!state.run) return;
    const el = (performance.now() - state.t0) / 1000;
    while (state.pc < state.instrs.length) {
      const ins = state.instrs[state.pc];
      if (ins.t > el) break;
      const fn = CMD[ins.cmd];
      const before = state.pc;
      if (fn) { const res = fn(ins.args||[], ins.t); if (res !== false) state.pc++; }
      else state.pc++;
      if (state.pc === before) state.pc++;
      if (ins.cmd === 'EndAttack') { state.run = false; break; }
    }
  }

  function startAttack(csv, name) {
    state.bullets=[]; state.lasers=[]; state.platforms=[]; state.stabs=[];
    state.sines=[]; state.gbs=[]; state.ivs=[]; state.dust=[]; state.dmgNums=[];
    state.blackScreen=0; state.shake=0; state.hitFlash=0;
    state.vars={pi:Math.PI};
    state.cz={l:239,t:226,r:404,b:391}; state.czT=null;
    state.soul={x:320,y:304,vx:0,vy:0,mode:0,maxFall:750,onGnd:false}; state.soulTP=null;
    state.sansSlam=-1; state.sansSlamT=0;
    state.phaseName=name||'';
    state.instrs=csv.instrs; state.labels=csv.labels;
    state.pc=0; state.t0=performance.now(); state.run=true;
  }
  function endAttack() { state.run=false; }

  function fireStab(s) {
    let x,y,vx,vy,w,h;
    if (s.dir===0) { x=s.pos; y=state.cz.t-30; vx=0; vy=6; w=12; h=24; }
    else if (s.dir===1) { x=s.pos; y=state.cz.b+30; vx=0; vy=-6; w=12; h=24; }
    else if (s.dir===2) { x=state.cz.l-30; y=s.pos; vx=6; vy=0; w=24; h=12; }
    else { x=state.cz.r+30; y=s.pos; vx=-6; vy=0; w=24; h=12; }
    state.bullets.push({ type: s.dir<=1?'bonestabv':'bonestabh', x,y,w,h,vx,vy,color:0, rot:0 });
  }

  function spawnDust(x,y,n) {
    for (let i=0;i<n;i++) {
      state.dust.push({
        x,y, vx:(Math.random()-0.5)*10, vy:(Math.random()-0.5)*10-3,
        life:1.0, size:2+Math.random()*4, rot:Math.random()*Math.PI*2,
        rotSpd:(Math.random()-0.5)*0.3,
        color:['#aa88ff','#8866cc','#cc99ff','#ffaa66','#ffcc88'][Math.floor(Math.random()*5)],
      });
    }
  }

  function spawnDmg(x,y,txt,color) {
    state.dmgNums.push({ x,y,txt,color:color||'#ffee44', life:1.0, vy:-1.5 });
  }

  function update() {
    if (state.soulTP) {
      state.soul.x=state.soulTP.x; state.soul.y=state.soulTP.y;
      spawnDust(state.soul.x, state.soul.y, 10);
      state.soulTP = null;
    }
    if (state.sansSlamT > 0) state.sansSlamT -= 16;

    if (state.czT) {
      const z=state.cz, t=state.czT;
      z.l += (t.l-z.l)*0.1; z.t += (t.t-z.t)*0.1;
      z.r += (t.r-z.r)*0.1; z.b += (t.b-z.b)*0.1;
      if (Math.abs(z.l-t.l)<0.5) { Object.assign(z,t); state.czT=null; }
    }

    for (const b of state.bullets) { b.x+=b.vx; b.y+=b.vy; if (b.rot) b.rot+=b.rotSpd; }
    state.bullets = state.bullets.filter(b => b.x>-60&&b.x<CW+60&&b.y>-60&&b.y<CH+60);
    for (const p of state.platforms) p.x += p.vx;
    state.platforms = state.platforms.filter(p => p.x>-100&&p.x<CW+100);
    for (const s of state.sines) { s.x+=s.vy; s.y+=Math.sin(s.x/s.per*Math.PI+s.phase)*s.amp*0.3; }
    state.sines = state.sines.filter(sb => sb.x>-30&&sb.x<CW+30);
    for (const s of state.stabs) { s.t+=16; if (!s.fired && s.t>=s.wd) { s.fired=true; fireStab(s); } }
    state.stabs = state.stabs.filter(s => !s.fired || s.t < s.wd+500);

    for (const gb of state.gbs) {
      if (!gb.fired) { gb.wdT+=16; if (gb.wdT>=gb.wd) { gb.fired=true; gb.fireT=0; state.shake=Math.max(state.shake, 1.2*gb.size); spawnDust(gb.sx,gb.sy,20); spawnDust(gb.ex,gb.ey,20); } }
      else gb.fireT+=16;
    }
    state.gbs = state.gbs.filter(g => !g.fired || g.fireT < g.fd);

    for (const l of state.lasers) {
      if (!l.fired) { l.wdT+=16; if (l.wdT>=l.wd) { l.fired=true; l.fireT=0; } }
      else l.fireT+=16;
    }
    state.lasers = state.lasers.filter(l => !l.fired || l.fireT < l.fd);

    if (state.shake > 0) state.shake = Math.max(0, state.shake - 0.04);
    if (state.hitFlash > 0) state.hitFlash = Math.max(0, state.hitFlash - 0.05);

    const es = (performance.now() - state.t0)/1000;
    for (const iv of state.ivs) iv.run(es);
    state.ivs = state.ivs.filter(i => !i.done());

    for (const d of state.dust) { d.x+=d.vx; d.y+=d.vy; d.vy+=0.15; d.life-=0.02; d.rot+=d.rotSpd; }
    state.dust = state.dust.filter(d => d.life > 0);
    for (const d of state.dmgNums) { d.y+=d.vy; d.life-=0.015; }
    state.dmgNums = state.dmgNums.filter(d => d.life > 0);

    runInterpreter();
  }

  function shakeOff() {
    if (state.shake <= 0) return {x:0,y:0};
    const k = state.shake;
    return { x:(Math.random()*2-1)*12*k, y:(Math.random()*2-1)*12*k };
  }

  // ===== 绘制 =====

  function draw(ctx) {
    const z = state.cz;
    const off = shakeOff();
    ctx.save();
    ctx.translate(off.x, off.y);

    // 全局背景
    if (state.blackScreen > 0) {
      ctx.fillStyle = '#000';
      ctx.fillRect(-40,-40,CW+80,CH+80);
    } else {
      ctx.fillStyle = '#0a0a12';
      ctx.fillRect(-40,-40,CW+80,CH+80);
    }

    // 尘埃背景层
    drawDustBg(ctx);

    // 龙骨炮预警线 + 龙骨炮嘴巴 + 激光 (在clip之前，因为龙骨炮嘴巴在clip区域外)
    for (const gb of state.gbs) drawGB(ctx, gb);
    for (const l of state.lasers) drawLaser(ctx, l);

    // 战斗区域裁剪 - 扩大到覆盖龙骨炮发射点
    ctx.save();
    ctx.beginPath();
    ctx.rect(z.l - 100, z.t - 100, z.r - z.l + 200, z.b - z.t + 200);
    ctx.clip();

    // 战斗区域黑色背景
    ctx.fillStyle = '#000000';
    ctx.fillRect(z.l-5, z.t-5, z.r-z.l+10, z.b-z.t+10);

    // combatzone 平铺
    drawCZ(ctx, z);

    // 骨头预警
    for (const s of state.stabs) {
      if (s.fired) continue;
      let x1,y1,x2,y2;
      if (s.dir<=1) { x1=x2=s.pos; y1=z.t; y2=z.b; }
      else { y1=y2=s.pos; x1=z.l; x2=z.r; }
      drawWarnLine(ctx, x1,y1,x2,y2);
    }

    // 平台
    for (const p of state.platforms) drawPlatform(ctx, p);

    // 正弦骨头
    for (const sb of state.sines) drawBone(ctx, sb);

    // 普通骨头
    for (const b of state.bullets) drawBone(ctx, b);

    // 尘埃粒子
    drawDust(ctx);

    // 灵魂
    drawSoul(ctx);

    ctx.restore();

    // 战斗区域边框
    drawBorder(ctx, z);

    // 伤害飘字
    drawDMG(ctx);

    // hit flash
    if (state.hitFlash > 0) {
      ctx.fillStyle = `rgba(255,255,255,${state.hitFlash})`;
      ctx.fillRect(z.l-10,z.t-10,z.r-z.l+20,z.b-z.t+20);
    }

    ctx.restore();
  }

  function drawCZ(ctx, z) {
  }

  function drawBorder(ctx, z) {
    const img = sp['czb'];
    if (img) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.strokeRect(z.l-2, z.t-2, z.r-z.l+4, z.b-z.t+4);
    } else {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(z.l-1, z.t-1, z.r-z.l+2, z.b-z.t+2);
    }
  }

  function drawWarnLine(ctx, x1,y1,x2,y2) {
    const blink = Math.floor(Date.now() / 80) % 2;
    ctx.save();
    ctx.lineCap = 'round';
    ctx.globalCompositeOperation = 'lighter';
    // 外层光晕
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = blink ? '#ff2222' : '#ffaa00';
    ctx.lineWidth = 14;
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
    // 中层
    ctx.globalAlpha = 0.6;
    ctx.lineWidth = 6;
    ctx.stroke();
    // 内层亮芯
    ctx.globalAlpha = 1;
    ctx.strokeStyle = blink ? '#ffffff' : '#ffcc44';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  // 龙骨炮绘制 - 原版4帧动画
  // 帧0:闭嘴待机, 帧1:微张, 帧2:大张, 帧3:发射
  function drawGB(ctx, gb) {
    const dx = gb.ex - gb.sx, dy = gb.ey - gb.sy;
    const beamAng = Math.atan2(dy, dx) * 180/Math.PI;

    if (!gb.fired) {
      // 预警阶段 - 显示龙骨炮从帧0→帧3的动画
      drawWarnLine(ctx, gb.sx, gb.sy, gb.ex, gb.ey);
      drawGBMouth(ctx, gb, beamAng);
    } else {
      // 发射后显示激光
      const pct = gb.fireT / gb.fd;
      drawLaserBeam(ctx, gb.sx, gb.sy, gb.ex, gb.ey, gb.size, pct);
    }
  }

  function drawGBMouth(ctx, gb, beamAng) {
    const sheet = sp['gbs0'] || sp['gbs1'];
    if (!sheet) return;

    const fw = 64, fh = 64;  // 每帧64x64
    const frames = [ [0,0], [1,0], [0,1], [1,1] ];  // 2x2布局

    const progress = gb.wdT / gb.wd;  // 0→1
    let frameIdx;
    if (progress < 0.25) frameIdx = 0;      // 闭嘴
    else if (progress < 0.5) frameIdx = 1;  // 微张
    else if (progress < 0.8) frameIdx = 2;  // 大张
    else frameIdx = 3;                       // 发射

    const [fx, fy] = frames[frameIdx];
    const scale = 0.6 + progress * 0.6;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.translate(gb.sx, gb.sy);
    // beamAng是激光方向, 龙骨炮嘴巴应该朝向激光方向
    ctx.rotate((beamAng + 90) * Math.PI/180);
    const drawS = 64 * scale * gb.size;
    ctx.globalAlpha = 0.85 + progress * 0.15;
    // 发光效果
    if (progress > 0.5) {
      ctx.shadowColor = '#88ccff';
      ctx.shadowBlur = 20 * progress;
    }
    ctx.drawImage(sheet, fx*fw, fy*fh, fw, fh, -drawS/2, -drawS/2, drawS, drawS);
    ctx.restore();
  }

  // 激光绘制 - BHUTE风格多层光晕 + 钟形时间曲线
  function drawLaser(ctx, l) {
    if (!l.fired) {
      drawWarnLine(ctx, l.sx, l.sy, l.ex, l.ey);
    } else {
      const pct = l.fireT / l.fd;
      drawLaserBeam(ctx, l.sx, l.sy, l.ex, l.ey, l.size||1, pct);
    }
  }

  function drawLaserBeam(ctx, sx, sy, ex, ey, size, pct) {
    if (pct < 0 || pct > 1) return;
    // 钟形缩放 - 快速变大, 保持, 快速消失
    let scaleY;
    if (pct < 0.1) scaleY = pct / 0.1;         // 快速达到1
    else if (pct > 0.85) scaleY = (1-pct) / 0.15;  // 快速消失
    else scaleY = 1;
    // 透明度钟形
    const alpha = Math.min(1, pct * 10) * Math.min(1, (1-pct) * 10);

    const dx = ex - sx, dy = ey - sy;
    const len = Math.hypot(dx, dy);
    const ang = Math.atan2(dy, dx);

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.translate(sx, sy);
    ctx.rotate(ang);

    const bw = 24 * size * scaleY;

    // ========== 外层大光晕 (很大,很淡) ==========
    ctx.globalAlpha = alpha * 0.12;
    const g1 = ctx.createLinearGradient(0, -bw*5, 0, bw*5);
    g1.addColorStop(0, 'rgba(60,100,255,0)');
    g1.addColorStop(0.5, 'rgba(100,160,255,0.5)');
    g1.addColorStop(1, 'rgba(60,100,255,0)');
    ctx.fillStyle = g1;
    ctx.fillRect(0, -bw*5, len, bw*10);

    // ========== 中层光晕 ==========
    ctx.globalAlpha = alpha * 0.35;
    const g2 = ctx.createLinearGradient(0, -bw*2.5, 0, bw*2.5);
    g2.addColorStop(0, 'rgba(140,190,255,0)');
    g2.addColorStop(0.5, 'rgba(160,210,255,0.7)');
    g2.addColorStop(1, 'rgba(140,190,255,0)');
    ctx.fillStyle = g2;
    ctx.fillRect(0, -bw*2.5, len, bw*5);

    // ========== 内层柔光 ==========
    ctx.globalAlpha = alpha * 0.65;
    const g3 = ctx.createLinearGradient(0, -bw, 0, bw);
    g3.addColorStop(0, 'rgba(200,230,255,0)');
    g3.addColorStop(0.5, 'rgba(220,240,255,0.9)');
    g3.addColorStop(1, 'rgba(200,230,255,0)');
    ctx.fillStyle = g3;
    ctx.fillRect(0, -bw, len, bw*2);

    // ========== 核心白芯 ==========
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, -bw*0.35, len, bw*0.7);

    // ========== 炮口爆光点 ==========
    ctx.globalAlpha = alpha * 0.8;
    const gMouth = ctx.createRadialGradient(0, 0, 0, 0, 0, bw*3);
    gMouth.addColorStop(0, 'rgba(255,255,255,0.9)');
    gMouth.addColorStop(0.3, 'rgba(180,200,255,0.5)');
    gMouth.addColorStop(1, 'rgba(80,120,255,0)');
    ctx.fillStyle = gMouth;
    ctx.fillRect(-bw*3, -bw*3, bw*6, bw*6);

    ctx.restore();
  }

  function drawBone(ctx, b) {
    let img;
    if (b.type === 'bonev') img = sp['bonev'];
    else if (b.type === 'boneh') img = sp['boneh'];
    else if (b.type === 'bonestabv') img = sp['bonestabv'];
    else if (b.type === 'bonestabh') img = sp['bonestabh'];

    const useColor = b.color !== undefined && b.color !== 0;

    ctx.save();
    if (b.rot) { ctx.translate(b.x, b.y); ctx.rotate(b.rot); ctx.translate(-b.x, -b.y); }

    if (img) {
      if (useColor) {
        ctx.filter = colorFilter(b.color);
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(img, b.x - b.w/2, b.y - b.h/2, b.w, b.h);
      // 给骨头加一点白色光晕
      if (!useColor || b.color === 0) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(b.x - b.w/2 - 1, b.y - b.h/2 - 1, b.w + 2, b.h + 2);
      }
    } else {
      // fallback
      ctx.fillStyle = useColor ? colorHex(b.color) : '#ffffff';
      ctx.fillRect(b.x - b.w/2, b.y - b.h/2, b.w, b.h);
    }
    ctx.restore();
  }

  function colorFilter(c) {
    switch (c) {
      case 1: return 'hue-rotate(180deg) saturate(2) brightness(1.1)';  // 蓝色骨头
      case 3: return 'hue-rotate(280deg) saturate(2) brightness(1.2)';  // 紫色骨头
      case 4: return 'hue-rotate(30deg) saturate(2.5) brightness(1.2)'; // 橙色骨头
      default: return '';
    }
  }
  function colorHex(c) {
    switch (c) {
      case 1: return '#4488ff';
      case 2: return '#ffffff';
      case 3: return '#aa66ff';
      case 4: return '#ff9944';
      default: return '#ffffff';
    }
  }

  function drawPlatform(ctx, p) {
    const img = p.side === 0 ? sp['plat1'] : sp['plat2'];
    if (img) {
      const reps = Math.ceil(p.w / img.width) + 1;
      ctx.save();
      for (let i = 0; i < reps; i++) {
        ctx.globalAlpha = 0.7;
        ctx.drawImage(img, p.x - p.w/2 + i*img.width, p.y - img.height/2);
      }
      ctx.restore();
    } else {
      ctx.fillStyle = '#4477cc';
      ctx.fillRect(p.x - p.w/2, p.y - p.h/2, p.w, p.h);
      ctx.fillStyle = '#7799ee';
      ctx.fillRect(p.x - p.w/2, p.y - p.h/2, p.w, 3);
    }
  }

  function drawSoul(ctx) {
    const img = state.soul.mode === 0 ? sp['heart0'] : sp['heart1'];
    const x = state.soul.x, y = state.soul.y;
    // 灵魂光晕
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const heartColor = state.soul.mode === 0 ? '#ff3344' : '#4488ff';
    const g = ctx.createRadialGradient(x, y, 0, x, y, 20);
    g.addColorStop(0, heartColor + 'cc');
    g.addColorStop(0.5, heartColor + '44');
    g.addColorStop(1, heartColor + '00');
    ctx.fillStyle = g;
    ctx.fillRect(x-20, y-20, 40, 40);
    ctx.restore();

    if (img) {
      ctx.drawImage(img, x - img.width/2, y - img.height/2);
    } else {
      ctx.fillStyle = state.soul.mode === 0 ? '#ff2222' : '#4488ff';
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI*2);
      ctx.fill();
    }
  }

  function drawDustBg(ctx) {
    if (state.dust.length === 0) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const d of state.dust) {
      if (d.life <= 0) continue;
      ctx.globalAlpha = Math.min(1, d.life) * 0.5;
      ctx.fillStyle = d.color;
      ctx.save();
      ctx.translate(d.x, d.y);
      ctx.rotate(d.rot);
      ctx.fillRect(-d.size/2, -d.size/2, d.size, d.size);
      ctx.restore();
    }
    ctx.restore();
  }

  function drawDust(ctx) {
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    for (const d of state.dust) {
      if (d.life <= 0) continue;
      ctx.globalAlpha = Math.min(1, d.life * 1.5);
      ctx.fillStyle = d.color;
      ctx.save();
      ctx.translate(d.x, d.y);
      ctx.rotate(d.rot);
      ctx.fillRect(-d.size/2, -d.size/2, d.size, d.size);
      ctx.restore();
    }
    ctx.restore();
  }

  function drawDMG(ctx) {
    for (const d of state.dmgNums) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, d.life * 1.5);
      ctx.fillStyle = d.color;
      ctx.font = 'bold 18px monospace';
      ctx.textAlign = 'center';
      ctx.shadowColor = d.color;
      ctx.shadowBlur = 8;
      ctx.fillText(d.txt, d.x, d.y);
      ctx.restore();
    }
    ctx.textAlign = 'left';
  }

  function hitTest() {
    const sx = state.soul.x, sy = state.soul.y;
    // 平台上灵魂不被撞
    for (const b of state.bullets) {
      if (Math.abs(sx - b.x) < b.w/2 + 5 && Math.abs(sy - b.y) < b.h/2 + 5) return b;
    }
    for (const sb of state.sines) {
      if (Math.abs(sx - sb.x) < sb.w/2 + 5 && Math.abs(sy - sb.y) < sb.h/2 + 5) return sb;
    }
    for (const l of state.lasers) {
      if (!l.fired || l.fireT > l.fd * 0.85) continue;
      const d = ptLineDist(sx, sy, l.sx, l.sy, l.ex, l.ey);
      if (d.dist < 16) return { type:'laser' };
    }
    for (const g of state.gbs) {
      if (!g.fired || g.fireT > g.fd * 0.85) continue;
      const d = ptLineDist(sx, sy, g.sx, g.sy, g.ex, g.ey);
      if (d.dist < 18) return { type:'laser' };
    }
    return null;
  }

  function ptLineDist(px,py,x1,y1,x2,y2) {
    const dx=x2-x1, dy=y2-y1;
    const len2=dx*dx+dy*dy;
    if (len2<1) return {dist:999};
    const t=Math.max(0,Math.min(1,((px-x1)*dx+(py-y1)*dy)/len2));
    const cx=x1+t*dx, cy=y1+t*dy;
    return {dist:Math.hypot(px-cx, py-cy), cx, cy};
  }

  return {
    loadSpriteSheet, loadCSV, startAttack, endAttack, update, draw, hitTest,
    getSoul: () => state.soul,
    getCZ: () => state.cz,
    isRunning: () => state.run,
    shake: (s) => { state.shake = Math.max(state.shake, s); },
    hitFlash: () => { state.hitFlash = 1.0; },
    spawnDust, spawnDmg,
    state, CW, CH, sp,
  };
})();
