// =====================================================================
// MobileControls v2 - 原生触摸虚拟按键
// ---------------------------------------------------------------------
// 给 Dusttale Sans BOSS 战加的虚拟摇杆 + Z/X/C 按钮
// 纯原生 Canvas 2D + Touch API，零外部依赖
// =====================================================================

(function () {
'use strict';

// ── 配置 ─────────────────────────────────────────────────────────────
const GAME_W = 960;
const GAME_H = 540;
const DPR = Math.max(1, Math.min(3, window.devicePixelRatio || 1));

const KEYMAP = {
    'Z':  { code: 'KeyZ',      keyCode: 90,  which: 90 },
    'X':  { code: 'KeyX',      keyCode: 88,  which: 88 },
    'C':  { code: 'KeyC',      keyCode: 67,  which: 67 },
    'UP':    { code: 'ArrowUp',    keyCode: 38, which: 38 },
    'DOWN':  { code: 'ArrowDown',  keyCode: 40, which: 40 },
    'LEFT':  { code: 'ArrowLeft',  keyCode: 37, which: 37 },
    'RIGHT': { code: 'ArrowRight', keyCode: 39, which: 39 },
};

const COLORS = {
    z: '#00FFFF',
    x: '#FFA040',
    c: '#00A040',
    stickBase: '#555555',
    stickThumb: '#888888',
    stickRing: '#AAAAAA',
    text: '#FFFFFF',
};

const BTN_OPACITY = 0.85;
const BTN_STROKE = 3;

// ── 状态 ─────────────────────────────────────────────────────────────
let canvas = null, ctx = null;
let overlayCreated = false;
let lastRectStr = '';
let touchState = {};    // {pointerId: { type:'btn'|'stick', key:'Z'|...|'UP'..., startX, startY }}
let stickActive = false;
let stickCenter = { x: 0, y: 0 };
let stickRadius = 0;
let activeKeys = new Set();

// =====================================================================
// 游戏画面位置计算（contain/letterbox 模式精确锚点）
// =====================================================================
function getGameRect() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    var canvas = document.getElementById('c2canvas');
    if (canvas) {
        var cr = canvas.getBoundingClientRect();
        if (cr.width > 0 && cr.height > 0) {
            return {
                sx: cr.left,
                sy: cr.top,
                sw: cr.width,
                sh: cr.height,
                scale: cr.width / GAME_W,
                w: w,
                h: h,
            };
        }
    }
    const scale = Math.min(w / GAME_W, h / GAME_H);
    const sw = GAME_W * scale;
    const sh = GAME_H * scale;
    return {
        sx: (w - sw) / 2,
        sy: (h - sh) / 2,
        sw: sw,
        sh: sh,
        scale: scale,
        w: w,
        h: h,
    };
}

// =====================================================================
// 按键布局计算（全部返回屏幕物理像素坐标）
// =====================================================================
function getLayout() {
    const r = getGameRect();

    const base = Math.min(r.sw, r.sh) * 0.14;
    const btnSize = base;
    const gap = base * 0.15;
    const dpr = DPR;
    const pad = btnSize * dpr;
    const gapPx = gap * dpr;

    const marginX = btnSize * 0.4;
    const marginTop = btnSize * 0.5;
    const marginBottom = btnSize * 0.5;
    const rightEdge = (r.sx + r.sw - marginX) * dpr;

    const topY = (r.sy + marginTop) * dpr;
    const bottomY = (r.sy + r.sh - marginBottom) * dpr;
    const totalH = bottomY - topY;

    // 从右向左三个按钮：Z (最右), X (中间), C (最左)
    const zR = rightEdge;
    const zL = zR - pad;
    const xR = zL - gapPx;
    const xL = xR - pad;
    const cR = xL - gapPx;
    const cL = cR - pad;

    // Y 方向均匀分布在 topY..bottomY 之间
    const stepY = (totalH - 3 * pad) / 2;

    const z = { x1: zL, x2: zR, y1: topY, y2: topY + pad };
    const x = { x1: xL, x2: xR, y1: topY + pad + stepY, y2: topY + 2 * pad + stepY };
    const c = { x1: cL, x2: cR, y1: topY + 2 * pad + 2 * stepY, y2: bottomY };

    const stickR = Math.min(r.sw, r.sh) * 0.1;
    const sx = (r.sx + stickR * 1.8) * dpr;
    const sy = (r.sy + r.sh - stickR * 2.2) * dpr;
    const sr = stickR * dpr;

    stickCenter = { x: sx, y: sy };
    stickRadius = sr;

    return { dpr, btnSize, pad, z, x, c, stickCenter: { x: sx, y: sy }, stickR: sr, r };
}

function hitTestBtn(x, y, rect) {
    return x >= rect.x1 && x <= rect.x2 && y >= rect.y1 && y <= rect.y2;
}

function hitTestStick(x, y) {
    const dx = x - stickCenter.x;
    const dy = y - stickCenter.y;
    return Math.hypot(dx, dy) <= stickRadius * 2.5;
}

// =====================================================================
// Canvas Overlay 管理
// =====================================================================
function createOverlay() {
    canvas = document.getElementById('virt-ctrl');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'virt-ctrl';
        canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:999999;touch-action:none;background:transparent;image-rendering:crisp-edges;';
        document.body.appendChild(canvas);
    }
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * DPR;
    canvas.height = h * DPR;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    overlayCreated = true;
}

function resizeOverlay() {
    if (!canvas) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * DPR;
    canvas.height = h * DPR;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
}

// =====================================================================
// 键盘桥接 — 模拟按键事件发给 Construct 2 runtime
// =====================================================================
function pressKey(name) {
    if (activeKeys.has(name)) return;
    activeKeys.add(name);
    const km = KEYMAP[name];
    if (!km) return;
    try {
        document.dispatchEvent(new KeyboardEvent('keydown', {
            key: name === 'UP' ? 'ArrowUp' :
                 name === 'DOWN' ? 'ArrowDown' :
                 name === 'LEFT' ? 'ArrowLeft' :
                 name === 'RIGHT' ? 'ArrowRight' : name,
            code: km.code, keyCode: km.keyCode, which: km.which, bubbles: true
        }));
    } catch (e) {}
}

function releaseKey(name) {
    if (!activeKeys.has(name)) return;
    activeKeys.delete(name);
    const km = KEYMAP[name];
    if (!km) return;
    try {
        document.dispatchEvent(new KeyboardEvent('keyup', {
            key: name === 'UP' ? 'ArrowUp' :
                 name === 'DOWN' ? 'ArrowDown' :
                 name === 'LEFT' ? 'ArrowLeft' :
                 name === 'RIGHT' ? 'ArrowRight' : name,
            code: km.code, keyCode: km.keyCode, which: km.which, bubbles: true
        }));
    } catch (e) {}
}

function releaseAllKeys() {
    for (const k of [...activeKeys]) releaseKey(k);
}

// =====================================================================
// 触摸事件处理
// =====================================================================
function dirFromStick(sx, sy) {
    const dx = sx - stickCenter.x;
    const dy = sy - stickCenter.y;
    const angle = (Math.atan2(-dy, dx) * 180 / Math.PI + 360) % 360;
    const dirs = [];
    if (angle >= 292.5 || angle < 67.5) dirs.push('RIGHT');
    if (angle >= 22.5 && angle < 157.5) dirs.push('UP');
    if (angle >= 112.5 && angle < 247.5) dirs.push('LEFT');
    if (angle >= 202.5 && angle < 337.5) dirs.push('DOWN');
    return dirs;
}

function onTouchStart(e) {
    e.preventDefault();
    const layout = getLayout();
    if (!draw._logged) {
        var L = layout;
        console.log('[MC-DEBUG] btnSize='+L.btnSize+' pad='+L.pad+' gap='+(L.btnSize*0.15*L.dpr));
        console.log('[MC-DEBUG] Z:', JSON.stringify(L.z));
        console.log('[MC-DEBUG] X:', JSON.stringify(L.x));
        console.log('[MC-DEBUG] C:', JSON.stringify(L.c));
        draw._logged = true;
    }
    for (const t of e.changedTouches) {
        const sx = t.clientX * DPR;
        const sy = t.clientY * DPR;

        if (hitTestBtn(sx, sy, layout.z)) {
            pressKey('Z');
            touchState[t.identifier] = { type: 'btn', key: 'Z' };
        } else if (hitTestBtn(sx, sy, layout.x)) {
            pressKey('X');
            touchState[t.identifier] = { type: 'btn', key: 'X' };
        } else if (hitTestBtn(sx, sy, layout.c)) {
            pressKey('C');
            touchState[t.identifier] = { type: 'btn', key: 'C' };
        } else if (hitTestStick(sx, sy)) {
            stickActive = true;
            const dirs = dirFromStick(sx, sy);
            dirs.forEach(pressKey);
            touchState[t.identifier] = { type: 'stick', activeDirs: dirs };
        }
    }
}

function onTouchMove(e) {
    e.preventDefault();
    const layout = getLayout();
    if (!draw._logged) {
        var L = layout;
        console.log('[MC-DEBUG] btnSize='+L.btnSize+' pad='+L.pad+' gap='+(L.btnSize*0.15*L.dpr));
        console.log('[MC-DEBUG] Z:', JSON.stringify(L.z));
        console.log('[MC-DEBUG] X:', JSON.stringify(L.x));
        console.log('[MC-DEBUG] C:', JSON.stringify(L.c));
        draw._logged = true;
    }
    for (const t of e.changedTouches) {
        const state = touchState[t.identifier];
        if (!state) continue;
        const sx = t.clientX * DPR;
        const sy = t.clientY * DPR;

        if (state.type === 'stick') {
            const newDirs = dirFromStick(sx, sy);
            const oldSet = new Set(state.activeDirs || []);
            const newSet = new Set(newDirs);
            for (const d of oldSet) if (!newSet.has(d)) releaseKey(d);
            for (const d of newSet) if (!oldSet.has(d)) pressKey(d);
            state.activeDirs = newDirs;
        } else if (state.type === 'btn') {
            const onButton =
                (state.key === 'Z' && hitTestBtn(sx, sy, layout.z)) ||
                (state.key === 'X' && hitTestBtn(sx, sy, layout.x)) ||
                (state.key === 'C' && hitTestBtn(sx, sy, layout.c));
            if (!onButton) { releaseKey(state.key); state.key = null; }
            else if (!state.key) {
                if (hitTestBtn(sx, sy, layout.z)) { state.key = 'Z'; pressKey('Z'); }
                else if (hitTestBtn(sx, sy, layout.x)) { state.key = 'X'; pressKey('X'); }
                else if (hitTestBtn(sx, sy, layout.c)) { state.key = 'C'; pressKey('C'); }
            }
        }
    }
}

function onTouchEnd(e) {
    e.preventDefault();
    for (const t of e.changedTouches) {
        const state = touchState[t.identifier];
        if (!state) continue;
        if (state.type === 'stick') {
            (state.activeDirs || []).forEach(releaseKey);
            stickActive = false;
        } else if (state.type === 'btn') {
            if (state.key) releaseKey(state.key);
        }
        delete touchState[t.identifier];
    }
}

// =====================================================================
// 绘制
// =====================================================================
function drawRoundedRect(x1, y1, x2, y2, r, fillCol, strokeCol) {
    r = Math.min(r, (x2 - x1) / 3, (y2 - y1) / 3);
    ctx.beginPath();
    ctx.moveTo(x1 + r, y1);
    ctx.lineTo(x2 - r, y1);
    ctx.quadraticCurveTo(x2, y1, x2, y1 + r);
    ctx.lineTo(x2, y2 - r);
    ctx.quadraticCurveTo(x2, y2, x2 - r, y2);
    ctx.lineTo(x1 + r, y2);
    ctx.quadraticCurveTo(x1, y2, x1, y2 - r);
    ctx.lineTo(x1, y1 + r);
    ctx.quadraticCurveTo(x1, y1, x1 + r, y1);
    ctx.closePath();
    ctx.fillStyle = fillCol;
    ctx.fill();
    if (strokeCol) {
        ctx.strokeStyle = strokeCol;
        ctx.lineWidth = BTN_STROKE * DPR;
        ctx.stroke();
    }
}

function isKeyPressed(key) {
    for (const t in touchState) {
        const s = touchState[t];
        if (s.type === 'btn' && s.key === key) return true;
        if (s.type === 'stick' && (s.activeDirs || []).includes(key)) return true;
    }
    return false;
}

function draw() {
    if (!overlayCreated) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = BTN_OPACITY;

    const layout = getLayout();
    if (!draw._logged) {
        var L = layout;
        console.log('[MC-DEBUG] btnSize='+L.btnSize+' pad='+L.pad+' gap='+(L.btnSize*0.15*L.dpr));
        console.log('[MC-DEBUG] Z:', JSON.stringify(L.z));
        console.log('[MC-DEBUG] X:', JSON.stringify(L.x));
        console.log('[MC-DEBUG] C:', JSON.stringify(L.c));
        draw._logged = true;
    }
    const { dpr, z, x, c, stickCenter, stickR } = layout;

    // 按钮
    const buttons = [
        { rect: z, label: 'Z', color: COLORS.z, key: 'Z' },
        { rect: x, label: 'X', color: COLORS.x, key: 'X' },
        { rect: c, label: 'C', color: COLORS.c, key: 'C' },
    ];
    for (const b of buttons) {
        const pad = (b.rect.x2 - b.rect.x1);
        const r = pad * 0.15;
        drawRoundedRect(b.rect.x1, b.rect.y1, b.rect.x2, b.rect.y2, r, b.color, '#ffffff');
        ctx.fillStyle = COLORS.text;
        ctx.font = 'bold ' + (pad * 0.55) + 'px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(b.label, (b.rect.x1 + b.rect.x2) / 2, (b.rect.y1 + b.rect.y2) / 2);
    }

    // 摇杆基底
    const cx = stickCenter.x, cy = stickCenter.y, sr = stickR;
    ctx.beginPath();
    ctx.arc(cx, cy, sr, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.stickBase;
    ctx.fill();
    ctx.lineWidth = 2 * dpr;
    ctx.strokeStyle = COLORS.stickRing;
    ctx.stroke();

    // 摇杆十字方向指示
    ctx.strokeStyle = '#AAAAAA';
    ctx.lineWidth = 2 * dpr;
    ctx.beginPath();
    ctx.moveTo(cx - sr * 0.7, cy); ctx.lineTo(cx + sr * 0.7, cy);
    ctx.moveTo(cx, cy - sr * 0.7); ctx.lineTo(cx, cy + sr * 0.7);
    ctx.stroke();

    // 摇杆 thumb（按下时偏移）
    let thumbX = cx, thumbY = cy;
    if (stickActive) {
        for (const t in touchState) {
            const s = touchState[t];
            if (s.type === 'stick') {
                // 这里简化处理：thumb 跟随第一个 stick 触摸点
                // 实际偏移由 onTouchMove 更新，但 draw 帧可能不同步
                break;
            }
        }
    }
    ctx.beginPath();
    ctx.arc(thumbX, thumbY, sr * 0.45, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.stickThumb;
    ctx.fill();
    ctx.strokeStyle = COLORS.stickRing;
    ctx.lineWidth = 2 * dpr;
    ctx.stroke();

    ctx.globalAlpha = 1;
}

// =====================================================================
// 主循环
// =====================================================================
let loopRunning = false;
function startLoop() {
    if (loopRunning) return;
    loopRunning = true;
    console.log('[MC-DEBUG] startLoop called, setting interval');
    var ticks = 0;
    setInterval(function () {
        ticks++;
        if (ticks <= 3) console.log('[MC-DEBUG] draw tick #' + ticks);
        draw();
    }, 16);
}

// =====================================================================
// 初始化
// =====================================================================
function init() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
        return;
    }

    createOverlay();

    // 触摸事件
    document.addEventListener('touchstart', onTouchStart, { passive: false });
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd, { passive: false });
    document.addEventListener('touchcancel', onTouchEnd, { passive: false });

    // 窗口变化
    window.addEventListener('resize', function () {
        resizeOverlay();
    });
    window.addEventListener('orientationchange', function () {
        setTimeout(resizeOverlay, 300);
    });
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            releaseAllKeys();
            stickActive = false;
        }
    });

    startLoop();
    console.log('[MC-v2] MobileControls v2 initialized');
}

init();

})();
