(function(){
'use strict';
var bar = document.createElement('div');
bar.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:3px;background:rgba(255,255,255,.1);z-index:100000;pointer-events:none;';
var fill = document.createElement('div');
fill.style.cssText = 'width:0%;height:100%;background:linear-gradient(90deg,#ff4444,#ff8844);transition:width .15s linear;';
bar.appendChild(fill);
document.body.appendChild(bar);
var pct = document.createElement('div');
pct.style.cssText = 'position:fixed;top:8px;left:8px;z-index:100000;color:#fff;font:13px monospace;text-shadow:0 0 3px #000;pointer-events:none;';
document.body.appendChild(pct);
function setup(){
    var skipTimer = null;
    var stepCount = 0;
    var poll = setInterval(function(){
        try {
            var rt = document.getElementById('c2canvas') && document.getElementById('c2canvas').c2runtime;
            if (!rt) rt = window.c2runtime;
            if (!rt) return;
            var p = rt.progress || 0;
            fill.style.width = (p*100).toFixed(1)+'%';
            pct.textContent = 'Loading ' + Math.round(p*100) + '%';
            if (p >= 1 && !skipTimer) {
                clearInterval(poll);
                skipTimer = setInterval(function(){
                    try {
                        var rt2 = document.getElementById('c2canvas') && document.getElementById('c2canvas').c2runtime;
                        if (!rt2) rt2 = window.c2runtime;
                        var cur = rt2.running_layout && rt2.running_layout.name;
                        if (!cur) return;
                        var n = cur.toLowerCase();
                        var targetName = null;
                        // Instructions → MainMenu → BattleScreen
                        if (n === 'instructions') targetName = 'MainMenu';
                        else if (n === 'mainmenu') {
                            stepCount++;
                            if (stepCount >= 1) targetName = 'BattleScreen';
                        }
                        if (targetName) {
                            var layouts = rt2.layouts;
                            var target = null;
                            for (var k in layouts) {
                                if (layouts.hasOwnProperty(k) && k.toLowerCase() === targetName.toLowerCase()) {
                                    target = layouts[k];
                                    break;
                                }
                            }
                            if (target) rt2.changelayout = target;
                        }
                        if (n === 'battlescreen') {
                            clearInterval(skipTimer);
                            setTimeout(function(){
                                pct.style.transition='opacity .8s'; pct.style.opacity='0';
                                bar.style.transition='opacity .8s'; bar.style.opacity='0';
                            }, 2000);
                        }
                    } catch(e){}
                }, 400);
            }
        } catch(e){}
    }, 80);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup);
else setup();
})();
