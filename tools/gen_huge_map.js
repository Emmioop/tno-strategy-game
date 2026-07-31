/**
 * 生成10MB+的地图扩充内容
 * 输出: /workspace/js/map_extra.js  (MAP_EXTRA_SVG 常量)
 */
const fs = require('fs');
const path = require('path');

const OUTPUT_PATH = path.join(__dirname, '..', 'js', 'map_extra.js');
const TARGET_MB = 10.5; // 目标大小略超10MB

// ---------- 辅助工具 ----------
const rand = (a, b) => a + Math.random() * (b - a);
const randi = (a, b) => Math.floor(rand(a, b));
const pick = (arr) => arr[randi(0, arr.length)];

// 各大区域边界（用于在区域内生成内容，避免漂到海里）
const REGIONS = [
  // 名称, x1,y1,x2,y2, 人口密度因子
  ['西欧', 300, 150, 600, 420, 3.0],
  ['东欧', 560, 160, 780, 450, 2.5],
  ['俄罗斯', 750, 120, 1180, 400, 1.5],
  ['北美东', 30, 80, 295, 390, 2.8],
  ['南美', 70, 380, 285, 630, 1.8],
  ['中东', 590, 380, 820, 520, 2.0],
  ['中亚', 760, 320, 980, 500, 1.2],
  ['非洲', 430, 430, 720, 700, 1.6],
  ['南亚', 800, 440, 960, 600, 2.6],
  ['东南亚', 930, 480, 1100, 640, 2.2],
  ['东亚', 940, 200, 1170, 470, 3.2],
  ['日本', 1040, 260, 1150, 380, 4.0],
  ['大洋洲', 990, 560, 1180, 730, 0.8],
  ['斯堪的纳维亚', 400, 100, 540, 230, 1.0],
  ['不列颠', 330, 180, 420, 285, 2.8],
  ['伊比利亚', 310, 290, 430, 400, 2.0],
];

// 城市名组件（随机组合，生成真实感城市名）
const CITY_PREFIXES = ['纽','旧','圣','新','大','小','东','西','南','北','上','下','中','内','外','前','后','左','右','高','低','长','短','古','新','近','远','深','浅','宽','窄'];
const CITY_MIDDLES = ['柏','林','维','也','纳','罗','马','巴','黎','伦','敦','莫','斯','科','基','辅','明','斯','克','华','沙','布','达','佩','斯','索','非','亚','雅','典','奥','斯','陆','汉','堡','慕','尼','黑','法','兰','克','福','德','里','斯','特','加','利','福','尼','亚','纽','约','芝','加','哥','洛','杉','矶','休','斯','敦','费','城','西','雅','图','波','士','顿','华','盛','顿','旧','金','山','多','伦','多','温','哥','华','蒙','特','利','尔','墨','西','哥','里','约','热','内','卢','布','宜','诺','斯','艾','利','斯','贝','尔','格','莱','德','里','昂','马','赛','图','卢','兹','安','特','卫','普','根','廷','布','拉','格','维','尔','纽','斯','里','加','塔','林','赫','尔','辛','基','奥','斯','陆','特','尔','古','耳'];
const CITY_SUFFIXES = ['','堡','城','镇','村','市','区','郡','省','州','港','湾','岭','峰','山','河','湖','海','岛','角','洲','原','野','林','森','田','园','苑','宫','殿','塔','楼','阁','桥','路','街','巷','广场','中心','公园','花园','机场','车站','大学','工厂','要塞','据点','指挥部','集中营','劳改营','殖民地','总督府','专员区','党卫军基地','国防军军营','核武器发射井','导弹基地','雷达站','科研中心'];

// 子区域名
const SUBREGION_WORDS = ['省','州','区','郡','领','公国','伯国','侯国','王国','共和国','人民共和国','社会主义共和国','自治区','特别行政区','总督辖区','专员辖区','占领区','保护区','中立区','非军事区','军政府','托管地','殖民地','租界','势力范围','争议地区','冲突地带','游击区','解放区','治安区','绥靖区'];
const SUBREGION_PREFIXES = ['上','下','东','西','南','北','中','内','外','前','后','新','旧','古','大','小','高','低','长','短','深','浅','左','右','近','远','超','亚','次','泛','跨','环','沿','逆','顺','反','正','副','主','次'];

// 地形特征
const TERRAIN_TYPES = [
  { name: '山脉', symbol: '⛰', fill: '#4a4a3a', opacity: 0.5 },
  { name: '丘陵', symbol: '⛰', fill: '#5a5a4a', opacity: 0.35 },
  { name: '高原', symbol: '▲', fill: '#6a5a4a', opacity: 0.3 },
  { name: '平原', symbol: '▭', fill: '#3a5a3a', opacity: 0.2 },
  { name: '盆地', symbol: '▽', fill: '#5a4a3a', opacity: 0.3 },
  { name: '沙漠', symbol: '⌇', fill: '#8a7a5a', opacity: 0.4 },
  { name: '森林', symbol: '🌲', fill: '#2a5a2a', opacity: 0.35 },
  { name: '草原', symbol: '∿', fill: '#4a6a3a', opacity: 0.25 },
  { name: '冻原', symbol: '❄', fill: '#7a8aaa', opacity: 0.4 },
  { name: '沼泽', symbol: '≈', fill: '#3a5a5a', opacity: 0.35 },
];

// 水系类型
const WATER_TYPES = ['河','川','江','溪','运河','水渠','水库','湖泊','池塘','湿地','三角洲','河口湾','海峡','运河','灌溉渠','排水沟','人工湖','地下水库'];

// 交通类型
const TRANSIT_TYPES = [
  { name: '铁路', dash: '4 2', color: '#8a8a8a', width: 0.5 },
  { name: '高速公路', dash: '0', color: '#a88a5a', width: 0.6 },
  { name: '国道', dash: '2 2', color: '#7a7a6a', width: 0.4 },
  { name: '输油管道', dash: '6 3', color: '#6a4a3a', width: 0.3 },
  { name: '输电线路', dash: '3 4', color: '#5a6a7a', width: 0.25 },
  { name: '运河', dash: '0', color: '#3a5a7a', width: 0.4 },
  { name: '军事补给线', dash: '2 1 1 1', color: '#8a3a3a', width: 0.35 },
];

// 历史标记
const HISTORY_MARKS = [
  { label: '战役遗址', symbol: '⚔', color: '#aa4a4a' },
  { label: '集中营', symbol: '✠', color: '#6a2a2a' },
  { label: '核爆点', symbol: '☢', color: '#caca4a' },
  { label: '大屠杀纪念', symbol: '✞', color: '#8a4a8a' },
  { label: '东方壁垒', symbol: '▤', color: '#7a5a3a' },
  { label: '大西洋壁垒', symbol: '▥', color: '#5a5a7a' },
  { label: '齐格菲防线', symbol: '▦', color: '#6a6a5a' },
  { label: '马奇诺防线(残)', symbol: '▧', color: '#5a6a6a' },
  { label: '奴隶劳工营', symbol: '⛓', color: '#4a4a2a' },
  { label: '盖世太保总部', symbol: '☠', color: '#3a3a3a' },
  { label: '党卫军训练基地', symbol: '⚜', color: '#5a2a5a' },
  { label: '总督府', symbol: '⚑', color: '#7a4a2a' },
  { label: '日耳曼化定居点', symbol: '⌂', color: '#aa8a4a' },
  { label: '游击战根据地', symbol: '✦', color: '#3a7a3a' },
  { label: '原子弹发射井', symbol: '⌖', color: '#ca6a2a' },
  { label: 'V2火箭基地', symbol: '↑', color: '#6a4a8a' },
  { label: '登月计划遗址', symbol: '☾', color: '#8a8aaa' },
  { label: '废城（被摧毁）', symbol: '⌐', color: '#5a3a3a' },
  { label: '重建城市', symbol: '⌐', color: '#4a7a5a' },
  { label: '人口迁移出发地', symbol: '→', color: '#8a6a4a' },
];

// 生成城市名
function genCityName() {
  const len = randi(1, 4);
  let mid = '';
  for (let i = 0; i < len; i++) mid += pick(CITY_MIDDLES);
  const usePre = Math.random() < 0.25;
  const useSuf = Math.random() < 0.7;
  return (usePre ? pick(CITY_PREFIXES) : '') + mid + (useSuf ? pick(CITY_SUFFIXES) : '');
}

// 生成子区域名
function genSubregionName() {
  const len = randi(2, 4);
  let mid = '';
  for (let i = 0; i < len; i++) mid += pick(CITY_MIDDLES);
  const usePre = Math.random() < 0.4;
  return (usePre ? pick(SUBREGION_PREFIXES) : '') + mid + pick(SUBREGION_WORDS);
}

// ---------- 生成各类型SVG元素 ----------

// 城市标记：小圆 + 文字
function genCityMarkers(count, parts) {
  for (let i = 0; i < count; i++) {
    const r = pick(REGIONS);
    const [name, x1, y1, x2, y2, density] = r;
    const x = rand(x1, x2);
    const y = rand(y1, y2);
    const size = rand(0.4, 1.8) * Math.sqrt(density);
    const font = rand(2.0, 3.8);
    const isCapital = Math.random() < 0.04;
    const isIndustrial = Math.random() < 0.15;
    const isMilitary = Math.random() < 0.08;
    const isCultural = Math.random() < 0.1;
    
    let color = '#c8c8c8';
    if (isCapital) color = '#ffd700';
    else if (isMilitary) color = '#ff6a6a';
    else if (isIndustrial) color = '#c8a860';
    else if (isCultural) color = '#a8d8ff';
    
    const cityName = genCityName();
    const markChar = isCapital ? '★' : (isMilitary ? '◆' : (isIndustrial ? '●' : (isCultural ? '◎' : '·')));
    
    parts.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${size.toFixed(2)}" fill="${color}" opacity="${rand(0.6, 0.95).toFixed(2)}"/>`);
    if (Math.random() < 0.65) {
      const offsetX = size + 1.5;
      const offsetY = font * 0.35;
      parts.push(`<text x="${(x + offsetX).toFixed(1)}" y="${(y + offsetY).toFixed(1)}" font-size="${font.toFixed(1)}" fill="${color}" opacity="${rand(0.5, 0.85).toFixed(2)}" font-family="serif">${markChar}${cityName}</text>`);
    }
  }
}

// 子区域小多边形
function genSubregions(count, parts) {
  for (let i = 0; i < count; i++) {
    const r = pick(REGIONS);
    const [name, x1, y1, x2, y2, density] = r;
    const cx = rand(x1 + 20, x2 - 20);
    const cy = rand(y1 + 20, y2 - 20);
    const n = randi(5, 10);
    const rAvg = rand(8, 25);
    const pts = [];
    for (let j = 0; j < n; j++) {
      const angle = (j / n) * Math.PI * 2 + rand(-0.2, 0.2);
      const rr = rAvg * rand(0.6, 1.4);
      pts.push(`${(cx + Math.cos(angle) * rr).toFixed(1)},${(cy + Math.sin(angle) * rr).toFixed(1)}`);
    }
    const hue = randi(0, 360);
    const sat = randi(10, 35);
    const light = randi(15, 35);
    const fill = `hsl(${hue},${sat}%,${light}%)`;
    const opacity = rand(0.08, 0.22).toFixed(2);
    const subName = genSubregionName();
    
    parts.push(`<polygon points="${pts.join(' ')}" fill="${fill}" stroke="#2a2a3a" stroke-width="0.3" opacity="${opacity}"/>`);
    if (Math.random() < 0.8) {
      const font = rand(2.5, 4.2);
      parts.push(`<text x="${cx.toFixed(1)}" y="${cy.toFixed(1)}" font-size="${font.toFixed(1)}" fill="hsl(${hue},${sat+30}%,${light+35}%)" opacity="${rand(0.4, 0.7).toFixed(2)}" text-anchor="middle" font-family="serif">${subName}</text>`);
    }
  }
}

// 地形特征
function genTerrain(count, parts) {
  for (let i = 0; i < count; i++) {
    const r = pick(REGIONS);
    const [name, x1, y1, x2, y2, density] = r;
    const t = pick(TERRAIN_TYPES);
    const cx = rand(x1, x2);
    const cy = rand(y1, y2);
    const size = rand(1.5, 4.5);
    const font = rand(1.8, 3.2);
    
    // 生成一组不规则多边形表示地形
    if (Math.random() < 0.6) {
      const n = randi(3, 6);
      const pts = [];
      const rAvg = rand(3, 10);
      for (let j = 0; j < n; j++) {
        const angle = (j / n) * Math.PI * 2 + rand(-0.4, 0.4);
        const rr = rAvg * rand(0.5, 1.5);
        pts.push(`${(cx + Math.cos(angle) * rr).toFixed(1)},${(cy + Math.sin(angle) * rr).toFixed(1)}`);
      }
      parts.push(`<polygon points="${pts.join(' ')}" fill="${t.fill}" opacity="${(t.opacity * rand(0.7, 1.2)).toFixed(2)}"/>`);
    } else {
      parts.push(`<text x="${cx.toFixed(1)}" y="${cy.toFixed(1)}" font-size="${size.toFixed(1)}" fill="${t.fill}" opacity="${(t.opacity * 1.5).toFixed(2)}" text-anchor="middle">${t.symbol}</text>`);
    }
    if (Math.random() < 0.3) {
      parts.push(`<text x="${(cx + size).toFixed(1)}" y="${(cy + font * 0.3).toFixed(1)}" font-size="${font.toFixed(1)}" fill="${t.fill}" opacity="${rand(0.35, 0.6).toFixed(2)}">${t.name}</text>`);
    }
  }
}

// 水系
function genWater(count, parts) {
  for (let i = 0; i < count; i++) {
    const r = pick(REGIONS);
    const [name, x1, y1, x2, y2, density] = r;
    const waterType = pick(WATER_TYPES);
    const startX = rand(x1, x2);
    const startY = rand(y1, y2);
    const segments = randi(3, 8);
    let d = `M ${startX.toFixed(1)} ${startY.toFixed(1)}`;
    let cx = startX, cy = startY;
    for (let s = 0; s < segments; s++) {
      const nx = cx + rand(-30, 30);
      const ny = cy + rand(-25, 25);
      const c1x = cx + rand(-10, 10);
      const c1y = cy + rand(-8, 8);
      d += ` Q ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${nx.toFixed(1)} ${ny.toFixed(1)}`;
      cx = nx; cy = ny;
    }
    const width = rand(0.3, 1.2);
    const opacity = rand(0.25, 0.55).toFixed(2);
    const hue = randi(190, 230);
    
    parts.push(`<path d="${d}" stroke="hsl(${hue},50%,${randi(25, 45)}%)" stroke-width="${width.toFixed(2)}" fill="none" opacity="${opacity}"/>`);
    if (Math.random() < 0.25) {
      const font = rand(1.8, 3.0);
      const midIdx = Math.floor(segments / 2);
      const mx = startX + (cx - startX) * 0.5 + rand(-5, 5);
      const my = startY + (cy - startY) * 0.5 + rand(-5, 5);
      const len = randi(1, 3);
      let wn = '';
      for (let k = 0; k < len; k++) wn += pick(CITY_MIDDLES);
      parts.push(`<text x="${mx.toFixed(1)}" y="${my.toFixed(1)}" font-size="${font.toFixed(1)}" fill="hsl(${hue},60%,60%)" opacity="${rand(0.4, 0.7).toFixed(2)}" text-anchor="middle">${wn}${waterType}</text>`);
    }
  }
}

// 交通线
function genTransit(count, parts) {
  for (let i = 0; i < count; i++) {
    const r = pick(REGIONS);
    const [name, x1, y1, x2, y2, density] = r;
    const t = pick(TRANSIT_TYPES);
    const segments = randi(2, 6);
    let cx = rand(x1, x2);
    let cy = rand(y1, y2);
    let d = `M ${cx.toFixed(1)} ${cy.toFixed(1)}`;
    for (let s = 0; s < segments; s++) {
      const nx = cx + rand(-40, 40);
      const ny = cy + rand(-30, 30);
      d += ` L ${nx.toFixed(1)} ${ny.toFixed(1)}`;
      cx = nx; cy = ny;
    }
    parts.push(`<path d="${d}" stroke="${t.color}" stroke-width="${(t.width * rand(0.8, 1.3)).toFixed(2)}" fill="none" stroke-dasharray="${t.dash}" opacity="${rand(0.3, 0.6).toFixed(2)}"/>`);
  }
}

// 历史标记
function genHistoryMarks(count, parts) {
  for (let i = 0; i < count; i++) {
    const r = pick(REGIONS);
    const [name, x1, y1, x2, y2, density] = r;
    const h = pick(HISTORY_MARKS);
    const x = rand(x1, x2);
    const y = rand(y1, y2);
    const size = rand(3, 6);
    const font = rand(2.0, 3.5);
    
    parts.push(`<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" font-size="${size.toFixed(1)}" fill="${h.color}" opacity="${rand(0.55, 0.9).toFixed(2)}" text-anchor="middle">${h.symbol}</text>`);
    if (Math.random() < 0.7) {
      const year = randi(1933, 1962);
      const mn = randi(1, 3);
      let note = '';
      for (let k = 0; k < mn; k++) note += pick(CITY_MIDDLES);
      parts.push(`<text x="${(x + size * 0.6).toFixed(1)}" y="${(y + font * 0.3).toFixed(1)}" font-size="${font.toFixed(1)}" fill="${h.color}" opacity="${rand(0.4, 0.75).toFixed(2)}">${year}.${note}${h.label}</text>`);
    }
  }
}

// ---------- 主生成流程 ----------
console.log('开始生成地图扩充内容...');

const parts = [];
parts.push('<!-- ============================================================ -->');
parts.push('<!-- 地图扩充内容：城市、子区域、地形、水系、交通、历史标记      -->');
parts.push('<!-- ============================================================ -->');
parts.push('<g id="map-extra" opacity="0.9">');

// 各类型生成数量（根据字节估算调整）
// 每个城市标记 ~ 150-200 bytes; 子区域 ~ 250 bytes; 地形 ~ 120 bytes; 水系 ~ 200 bytes; 交通 ~ 150 bytes; 历史 ~ 180 bytes
const N_CITIES      = 42000;   // ~ 7.5 MB
const N_SUBREGIONS  =  6000;   // ~ 1.5 MB
const N_TERRAIN     =  8000;   // ~ 1.0 MB
const N_WATER       =  4000;   // ~ 0.8 MB
const N_TRANSIT     =  3000;   // ~ 0.45 MB
const N_HISTORY     =  2500;   // ~ 0.45 MB

console.log(`目标：城市${N_CITIES} 子区域${N_SUBREGIONS} 地形${N_TERRAIN} 水系${N_WATER} 交通${N_TRANSIT} 历史${N_HISTORY}`);

let lastReport = Date.now();
function report(label, done, total) {
  const now = Date.now();
  if (now - lastReport > 2000 || done === total) {
    const pct = (done / total * 100).toFixed(1);
    console.log(`  ${label}: ${done}/${total} (${pct}%)`);
    lastReport = now;
  }
}

parts.push('<!-- 子区域划分 -->');
parts.push('<g id="subregions">');
for (let i = 0; i < N_SUBREGIONS; i++) { genSubregions(1, parts); report('子区域', i + 1, N_SUBREGIONS); }
parts.push('</g>');

parts.push('<!-- 地形特征 -->');
parts.push('<g id="terrain">');
for (let i = 0; i < N_TERRAIN; i++) { genTerrain(1, parts); report('地形', i + 1, N_TERRAIN); }
parts.push('</g>');

parts.push('<!-- 水系 -->');
parts.push('<g id="water">');
for (let i = 0; i < N_WATER; i++) { genWater(1, parts); report('水系', i + 1, N_WATER); }
parts.push('</g>');

parts.push('<!-- 交通网 -->');
parts.push('<g id="transit">');
for (let i = 0; i < N_TRANSIT; i++) { genTransit(1, parts); report('交通', i + 1, N_TRANSIT); }
parts.push('</g>');

parts.push('<!-- 历史标记 -->');
parts.push('<g id="history">');
for (let i = 0; i < N_HISTORY; i++) { genHistoryMarks(1, parts); report('历史', i + 1, N_HISTORY); }
parts.push('</g>');

parts.push('<!-- 城市与定居点 -->');
parts.push('<g id="cities">');
for (let i = 0; i < N_CITIES; i++) { genCityMarkers(1, parts); report('城市', i + 1, N_CITIES); }
parts.push('</g>');

parts.push('</g><!-- /map-extra -->');

console.log('正在组装SVG字符串...');
const svgContent = parts.join('\n');
const svgBytes = Buffer.byteLength(svgContent, 'utf8');
console.log(`SVG内容大小: ${(svgBytes / 1024 / 1024).toFixed(2)} MB`);

// 如果不够，继续追加城市标记
if (svgBytes < TARGET_MB * 1024 * 1024) {
  const needBytes = TARGET_MB * 1024 * 1024 - svgBytes;
  const estPerCity = 180;
  const more = Math.ceil(needBytes / estPerCity) + 5000;
  console.log(`继续追加 ${more} 个城市标记以达到目标大小...`);
  const extraParts = [];
  for (let i = 0; i < more; i++) { genCityMarkers(1, extraParts); if (i % 5000 === 0) report('追加城市', i + 1, more); }
  const extraSvg = extraParts.join('\n');
  // 在 </g><!-- /map-extra --> 之前插入
  const insertIdx = svgContent.lastIndexOf('</g><!-- /map-extra -->');
  const finalSvg = svgContent.slice(0, insertIdx) + extraSvg + svgContent.slice(insertIdx);
  writeOutput(finalSvg);
} else {
  writeOutput(svgContent);
}

function writeOutput(svg) {
  const header = `/* ============================================================\n * 地图扩充内容（自动生成） - 目标10MB+\n * 包含: 子区域、地形、水系、交通线、历史标记、城市标记\n * 生成时间: ${new Date().toISOString()}\n * ============================================================ */\n\nconst MAP_EXTRA_SVG = \``;
  const footer = '\n`;\n';
  
  const content = header + svg + footer;
  fs.writeFileSync(OUTPUT_PATH, content, 'utf8');
  
  const totalBytes = fs.statSync(OUTPUT_PATH).size;
  console.log(`\n完成! 输出文件: ${OUTPUT_PATH}`);
  console.log(`总大小: ${(totalBytes / 1024 / 1024).toFixed(2)} MB (${totalBytes.toLocaleString()} 字节)`);
  console.log(`SVG元素行数估算: ~${(svg.match(/\n/g) || []).length + 1} 行`);
}
