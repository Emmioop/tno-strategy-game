#!/usr/bin/env node
/**
 * tools/split_events.js
 *
 * 功能: 把 84MB events_gen.js + 380KB events.js 按年份拆分成 data/events/*.json
 * 输出:
 *   data/events/story_core.json  (剧情事件，274个，来自 events.js)
 *   data/events/1962.json ~ 2000.json  (39个年份池，每个池覆盖 [year-1, year, year+1] 的随机事件)
 * 注意: 剧情事件始终加载; 随机事件按 minTurn/maxTurn 落入对应年份池
 *       每个年份JSON预计算一次，游戏里只加载「当前年 ± 1 年 + story
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const EVENTS_JS = path.join(ROOT, 'js', 'events.js');
const GEN_JS = path.join(ROOT, 'js', 'events_gen.js');
const OUT_DIR = path.join(ROOT, 'data', 'events');

function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }
ensureDir(OUT_DIR);

// 清理对象: 
// - condition / onTrigger 这类函数 -> 转成 __fn_XXX: true + 函数字符串（JSON支持），datastore加载时用 new Function 恢复
// - 其他函数 -> 丢弃（通常只是内部方法）
function sanitize(obj, path = '') {
    if (obj == null) return obj;
    if (typeof obj === 'function') {
        // condition(state)或onTrigger(state), choices里的少量函数 -> 字符串化
        try {
            return {
                __type: 'fn',
                __source: obj.toString(),
                __path: path || 'root'
            };
        } catch (_) { return undefined; }
    }
    if (Array.isArray(obj)) return obj.map((v, i) => sanitize(v, (path ? path + '.' : '') + i));
    if (typeof obj !== 'object') return obj;
    const out = {};
    for (const k of Object.keys(obj)) {
        const v = obj[k];
        const newPath = (path ? path + '.' : '') + k;
        if (typeof v === 'function') {
            // 只保留 condition/onTrigger/perTurn 这类业务函数；其它函数字段丢弃
            if (/^(condition|onTrigger)$/.test(k) || k.startsWith('perTurn') || k.startsWith('apply')) {
                try {
                    out[k] = { __type: 'fn', __source: v.toString(), __path: newPath };
                } catch (_) { /* 丢弃不能转的 */ }
            }
            continue;
        }
        const r = sanitize(v, newPath);
        if (r !== undefined) out[k] = r;
    }
    return out;
}

console.time('split_events');
// 加载剧情事件 story_core
console.log('[1/3 加载 events.js (剧情事件)...');
const storySrc = fs.readFileSync(EVENTS_JS, 'utf8');
const sb = { window: {}, console: { log: () => {} } };
vm.createContext(sb);
vm.runInContext(storySrc, sb);
const STORY_EVENTS = sb.STORY_EVENTS || sb.window.STORY_EVENTS || [];
console.log('    剧情事件数:', STORY_EVENTS.length);

// 写 story_core.json
const core = {
    meta: { type: 'story_core', count: STORY_EVENTS.length, generatedAt: new Date().toISOString() },
    events: STORY_EVENTS.map(sanitize)
};
fs.writeFileSync(path.join(OUT_DIR, 'story_core.json'), JSON.stringify(core));
console.log('    写入 story_core.json :', (fs.statSync(path.join(OUT_DIR, 'story_core.json')).size / 1024).toFixed(1), 'KB');

// 加载随机事件 (84MB，流式解析太重，直接VM跑, 但里面 GENERATED_EVENTS 是全局
console.log('[2/3 加载 events_gen.js (随机事件)...此步骤约需2-5秒...');
const genSrc = fs.readFileSync(GEN_JS, 'utf8');
// 尾部有自动 concat 逻辑，注入 window.STORY_EVENTS = [] 让 concat 正常执行，再取 GENERATED_EVENTS
const gb2 = { window: { STORY_EVENTS: [] }, console: { log: () => { } } };
vm.createContext(gb2);
vm.runInContext(genSrc, gb2);
const GEN_EVENTS = gb2.GENERATED_EVENTS || gb2.window.GENERATED_EVENTS || gb2.window.STORY_EVENTS.slice();
console.log('    随机事件数:', GEN_EVENTS.length.toLocaleString());

// 年份分桶: 每个事件按「minTurn.year」放入**唯一一个**年份池
// 游戏端读取「当前年±1年共3年的池子」，再按 minTurn/maxTurn 精确匹配
// —— 这样避免同个事件重复复制，压缩率 ~85MB（和原85.9MB几乎一致），但加载只需3年≈6MB/首屏
const START_YEAR = 1962;
const END_YEAR = 2000;
const pools = {};
for (let y = START_YEAR; y <= END_YEAR; y++) pools[y] = [];

console.log('[3/3 分桶39个年份池 (按 minTurn.year 唯一落点)...');
let skipped = 0;
for (const e of GEN_EVENTS) {
    if (!e || !e.minTurn || !e.maxTurn) { skipped++; continue; }
    const y = Math.max(START_YEAR, Math.min(END_YEAR, e.minTurn.year));
    pools[y].push(e);
}
// 写出
let totalBytes = 0;
let totalCount = 0;
for (let y = START_YEAR; y <= END_YEAR; y++) {
    const arr = pools[y];
    const data = {
        meta: { type: 'year_pool', year: y, count: arr.length, generatedAt: new Date().toISOString() },
        events: arr.map(sanitize)
    };
    const buf = Buffer.from(JSON.stringify(data));
    fs.writeFileSync(path.join(OUT_DIR, `${y}.json`), buf);
    totalBytes += buf.length;
    totalCount += arr.length;
}
console.log('    写入 39 个年份池完成. 总大小:', (totalBytes / 1024 / 1024).toFixed(2), 'MB (共', totalCount.toLocaleString(), '次事件引用，含重复)');
if (skipped) console.log('    跳过无年份范围事件:', skipped);
console.timeEnd('split_events');

// 输出清单
const manifest = {
    generatedAt: new Date().toISOString(),
    years: Object.fromEntries(
        Object.entries(pools).map(([y, arr]) => [y, { count: arr.length, sizeKb: Math.round(fs.statSync(path.join(OUT_DIR, `${y}.json`)).size / 1024) }])
    ),
    storyCoreSizeKb: Math.round(fs.statSync(path.join(OUT_DIR, 'story_core.json')).size / 1024),
    totalPoolSizeMb: +(totalBytes / 1024 / 1024).toFixed(2),
    totalPoolEventRefs: totalCount,
    uniqueStoryEvents: STORY_EVENTS.length,
    uniqueRandomEvents: GEN_EVENTS.length
};
fs.writeFileSync(path.join(OUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log('清单:', JSON.stringify(manifest, null, 2));
