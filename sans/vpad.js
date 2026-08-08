// vpad.js - virtual buttons + auto-skip loader
'use strict';

var bar = document.createElement('div');
bar.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:3px;background:rgba(255,255,255,.15);z-index:999999;pointer-events:none;transition:opacity .6s;';
var fill = document.createElement('div');
fill.style.cssText = 'width:0%;height:100%;background:linear-gradient(90deg,#ff4444,#ff8844);transition:width .2s linear;';
bar.appendChild(fill);

var pct = document.createElement('div');
pct.style.cssText = 'position:fixed;top:8px;left:8px;z-index:999999;color:#fff;font:13px monospace;text-shadow:0 0 3px #000;pointer-events:none;';

// 安全添加元素到 body
function addToBody(el) {
    if (document.body) {
        document.body.appendChild(el);
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            document.body.appendChild(el);
        });
    }
}

addToBody(bar);
addToBody(pct);

window.vpadDebug = { setupCalled: false, pollCalls: 0 };

function getRuntime() {
    var rt = document.getElementById('c2canvas') && document.getElementById('c2canvas').c2runtime;
    if (!rt) rt = window.c2runtime;
    return rt;
}
function getLayout(name) {
    var rt = getRuntime();
    if (!rt || !rt.layouts) return null;
    var keys = Object.keys(rt.layouts);
    for (var i = 0; i < keys.length; i++) {
        if (keys[i].toLowerCase() === name.toLowerCase()) return rt.layouts[keys[i]];
    }
    return null;
}

function vpadSetup() {
    window.vpadDebug.setupCalled = true;
    var step1Done = false;
    var step2Done = false;
    
    setInterval(function(){
        window.vpadDebug.pollCalls++;
        try {
            var rt = getRuntime();
            if (!rt) return;

            if (rt.isSuspended) rt.isSuspended = false;

            var p = rt.progress || 0;
            fill.style.width = (p*100).toFixed(1)+'%';
            pct.textContent = 'Loading ' + Math.round(p*100) + '%';

            if (p >= 1) {
                var cur = rt.running_layout && rt.running_layout.name;
                if (cur) {
                    var n = cur.toLowerCase();

                    if (!step1Done && n === 'instructions') {
                        step1Done = true;
                        setTimeout(function(){
                            var target = getLayout('MainMenu');
                            if (target) rt.changelayout = target;
                        }, 1500);
                    }

                    if (step1Done && !step2Done && n === 'mainmenu') {
                        step2Done = true;
                        setTimeout(function(){
                            var target = getLayout('BattleScreen');
                            if (target) rt.changelayout = target;
                        }, 1500);
                    }

                    if (n === 'battlescreen') {
                        setTimeout(function(){
                            pct.style.opacity = '0';
                            bar.style.opacity = '0';
                        }, 2000);
                    }
                }
            }
        } catch(e){}
    }, 200);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', vpadSetup);
} else {
    vpadSetup();
}
