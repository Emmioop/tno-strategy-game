(function(){
'use strict';

// ── 自动跳过 MainMenu 直接进战斗 ──
function skipToBattle() {
    try {
        if (typeof window.cr_getC2Runtime === 'undefined') return;
        var rt = window.cr_getC2Runtime();
        if (!rt) return;
        // GoToLayoutByName 在 system_object.acts 上
        if (rt.system_object && rt.system_object.acts && typeof rt.system_object.acts.GoToLayoutByName === 'function') {
            rt.system_object.acts.GoToLayoutByName('BattleScreen');
        } else if (typeof rt.doChangeLayout === 'function') {
            // 或者直接用 runtime 内部方法
            var layouts = rt.layouts;
            if (layouts) {
                for (var k in layouts) {
                    if (layouts.hasOwnProperty(k) && k.toLowerCase() === 'battlescreen') {
                        rt.doChangeLayout(layouts[k]);
                        break;
                    }
                }
            }
        }
    } catch(e) { console.warn('skipToBattle failed:', e); }
}

// 每秒尝试一次，最多 15 秒
var skipAttempts = 0;
var skipTimer = setInterval(function(){
    skipAttempts++;
    // 如果已经在 BattleScreen 就停止
    try {
        var rt2 = window.cr_getC2Runtime && window.cr_getC2Runtime();
        if (rt2 && rt2.layout && rt2.layout.name && rt2.layout.name.toLowerCase() === 'battlescreen') {
            clearInterval(skipTimer);
            return;
        }
    } catch(e) {}
    skipToBattle();
    if (skipAttempts > 15) clearInterval(skipTimer);
}, 800);

// ── 虚拟按键 ──
var keys = { up:false, down:false, left:false, right:false, z:false, x:false };

function simulateKey(keyCode, isDown, code) {
    var evt = new KeyboardEvent(isDown ? 'keydown' : 'keyup', {
        keyCode: keyCode, which: keyCode, code: code, key: code,
        bubbles: true, cancelable: true
    });
    document.dispatchEvent(evt);
}

function pressKey(code, isDown) {
    var map = {
        up:    { key: 38, cd: 'ArrowUp' },
        down:  { key: 40, cd: 'ArrowDown' },
        left:  { key: 37, cd: 'ArrowLeft' },
        right: { key: 39, cd: 'ArrowRight' },
        z:     { key: 90, cd: 'KeyZ' },
        x:     { key: 88, cd: 'KeyX' },
    };
    if (code in map) {
        keys[code] = isDown;
        var m = map[code];
        simulateKey(m.key, isDown, m.cd);
    }
}

var vpad_canvas = null;
var buttons = [];

function drawVPad() {
    if (!vpad_canvas) return;
    var ctx = vpad_canvas.getContext('2d');
    ctx.clearRect(0, 0, vpad_canvas.width, vpad_canvas.height);
    ctx.imageSmoothingEnabled = false;

    var W = vpad_canvas.width, H = vpad_canvas.height;
    var s = Math.min(W, H) / 560;
    var r = 40 * s;
    var op = 0.55;
    var op_pressed = 0.9;

    var cx = 100 * s, cy = H - 140 * s;
    var arr = [
        { label:'▲', x:cx, y:cy-90*s, code:'up',    k:keys.up    },
        { label:'▼', x:cx, y:cy+90*s, code:'down',  k:keys.down  },
        { label:'◀', x:cx-90*s, y:cy, code:'left',  k:keys.left  },
        { label:'▶', x:cx+90*s, y:cy, code:'right', k:keys.right },
    ];
    for (var i = 0; i < arr.length; i++) {
        var b = arr[i];
        ctx.globalAlpha = b.k ? op_pressed : op;
        ctx.fillStyle = '#000';
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.font = (24*s)+'px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(b.label, b.x, b.y);
    }

    var bx = W - 160 * s, by = H - 180 * s;
    var act = [
        { label:'Z', x:bx-60*s, y:by+60*s, code:'z', k:keys.z },
        { label:'X', x:bx+60*s, y:by+60*s, code:'x', k:keys.x },
    ];
    for (var j = 0; j < act.length; j++) {
        var a = act[j];
        ctx.globalAlpha = a.k ? op_pressed : op;
        ctx.fillStyle = '#a00';
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(a.x, a.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold '+(28*s)+'px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(a.label, a.x, a.y);
    }
    ctx.globalAlpha = 1;

    buttons = arr.concat(act);
}

function pointInButton(px, py) {
    var W = vpad_canvas.width, H = vpad_canvas.height;
    var s = Math.min(W, H) / 560;
    var r = 40 * s;
    for (var i = 0; i < buttons.length; i++) {
        var dx = px - buttons[i].x, dy = py - buttons[i].y;
        if (dx*dx + dy*dy <= r*r) return buttons[i];
    }
    return null;
}

function onTouchStart(e) {
    e.preventDefault();
    for (var i = 0; i < e.changedTouches.length; i++) {
        var t = e.changedTouches[i];
        var b = pointInButton(t.clientX, t.clientY);
        if (b) { pressKey(b.code, true); b._touchId = t.identifier; }
    }
    drawVPad();
}

function onTouchEnd(e) {
    e.preventDefault();
    for (var i = 0; i < e.changedTouches.length; i++) {
        var t = e.changedTouches[i];
        for (var j = 0; j < buttons.length; j++) {
            if (buttons[j]._touchId === t.identifier) {
                pressKey(buttons[j].code, false);
                buttons[j]._touchId = null;
            }
        }
    }
    drawVPad();
}

function setup() {
    var v = document.createElement('canvas');
    v.id = 'vpad';
    v.style.cssText = 'position:fixed;bottom:0;left:0;width:100vw;height:40vh;z-index:9998;pointer-events:none;';
    document.body.appendChild(v);
    vpad_canvas = v;

    function resize() {
        v.width = window.innerWidth * devicePixelRatio;
        v.height = window.innerHeight * devicePixelRatio;
        v.style.width = window.innerWidth + 'px';
        v.style.height = window.innerHeight + 'px';
        drawVPad();
    }
    resize();
    window.addEventListener('resize', resize);

    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:9999;pointer-events:none;';
    document.body.appendChild(overlay);
    overlay.addEventListener('touchstart', onTouchStart, {passive:false});
    overlay.addEventListener('touchend', onTouchEnd, {passive:false});
    overlay.addEventListener('touchcancel', onTouchEnd, {passive:false});
    overlay.addEventListener('touchmove', function(e){
        e.preventDefault();
        for (var i = 0; i < e.changedTouches.length; i++) {
            var t = e.changedTouches[i];
            var found = null;
            for (var j = 0; j < buttons.length; j++) {
                if (buttons[j]._touchId === t.identifier) { found = buttons[j]; break; }
            }
            var b = pointInButton(t.clientX, t.clientY);
            if (found && (!b || b.code !== found.code)) {
                pressKey(found.code, false);
                found._touchId = null;
            }
            if (b && b !== found) {
                pressKey(b.code, true);
                b._touchId = t.identifier;
            }
        }
        drawVPad();
    }, {passive:false});
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup);
else setup();
})();
