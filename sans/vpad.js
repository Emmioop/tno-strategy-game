(function(){
'use strict';

let keys = { up:false, down:false, left:false, right:false, z:false, x:false };

function pressKey(code, isDown) {
    if (code === 'up')    { keys.up = isDown; if (isDown) simulateKey(38, true, 'ArrowUp'); else simulateKey(38, false, 'ArrowUp'); }
    if (code === 'down')  { keys.down = isDown; if (isDown) simulateKey(40, true, 'ArrowDown'); else simulateKey(40, false, 'ArrowDown'); }
    if (code === 'left')  { keys.left = isDown; if (isDown) simulateKey(37, true, 'ArrowLeft'); else simulateKey(37, false, 'ArrowLeft'); }
    if (code === 'right') { keys.right = isDown; if (isDown) simulateKey(39, true, 'ArrowRight'); else simulateKey(39, false, 'ArrowRight'); }
    if (code === 'z')     { keys.z = isDown; if (isDown) simulateKey(90, true, 'KeyZ'); else simulateKey(90, false, 'KeyZ'); }
    if (code === 'x')     { keys.x = isDown; if (isDown) simulateKey(88, true, 'KeyX'); else simulateKey(88, false, 'KeyX'); }
}

function simulateKey(keyCode, isDown, code) {
    var evt = new KeyboardEvent(isDown ? 'keydown' : 'keyup', {
        keyCode: keyCode, which: keyCode, code: code, key: code,
        bubbles: true, cancelable: true
    });
    document.dispatchEvent(evt);
}

function getCanvas() {
    return document.getElementById('c2canvas');
}

function screenToCanvas(sx, sy) {
    var c = getCanvas();
    if (!c) return {x:sx, y:sy};
    var r = c.getBoundingClientRect();
    var scale = c.width / r.width;
    return { x: (sx - r.left) * scale, y: (sy - r.top) * scale };
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

    // D-pad (bottom-left)
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

    // Action buttons (bottom-right)
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

    // overlay for touch events (on top of canvas but with pointer-events)
    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:9999;pointer-events:none;';
    document.body.appendChild(overlay);
    overlay.addEventListener('touchstart', onTouchStart, {passive:false});
    overlay.addEventListener('touchend', onTouchEnd, {passive:false});
    overlay.addEventListener('touchcancel', onTouchEnd, {passive:false});
    overlay.addEventListener('touchmove', function(e){
        e.preventDefault();
        // handle move - if finger slides off button, release old one, press new one
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
