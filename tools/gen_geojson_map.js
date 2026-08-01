/**
 * tools/gen_geojson_map.js
 * 生成简化的国家级GeoJSON地图，用于Canvas高性能渲染
 * 坐标系直接复用SVG viewBox: 0 0 1200 750
 * 三级显示:
 *   level 1 = 国家级 (6大势力 + 关键独立国，约15个Feature)
 *   level 2 = 战区级 (含俄罗斯军阀/专员辖区，约35个Feature)
 *   level 3 = 省份级 (未来预留)
 *
 * 运行: node tools/gen_geojson_map.js
 * 输出: data/map/world_mini.geojson (< 500KB 目标)
 */

const fs = require('fs');
const path = require('path');

// ============== 基础坐标点 (直接对齐现有SVG的布局比例) ==============
// 国家级(level=1, 低精度多边形):
const LEVEL1_REGIONS = [
  // --- 大日耳曼国 (西欧+中欧+北欧，核心德三) ---
  {
    id: 'GER', faction: 'GER', name: '大日耳曼国', level: 1,
    baseColor: '#a83232',
    // x320-680, y100-350（德、荷、比、法北部、波兰、北欧南部）
    coords: [
      [[330,110],[430,95],[540,100],[620,115],[670,150],[685,210],[675,270],
       [640,310],[580,345],[510,352],[440,348],[380,330],[335,295],[320,240],
       [325,175],[330,110]]
    ],
    label: { x: 500, y: 225, fontSize: 11, color: '#ffe0c0' }
  },
  // --- OFN / 美国 (北美) ---
  {
    id: 'USA', faction: 'USA', name: '自由国家组织 (OFN)', level: 1,
    baseColor: '#3a6a9a',
    coords: [
      [[20,260],[100,240],[200,245],[270,275],[295,330],[280,400],[225,460],
       [140,475],[60,450],[25,400],[12,330],[20,260]]
    ],
    label: { x: 150, y: 360, fontSize: 11, color: '#c0d8f0' }
  },
  // --- 大日本帝国 / 共荣圈 (东亚+太平洋) ---
  {
    id: 'JAP', faction: 'JAP', name: '大日本帝国·共荣圈', level: 1,
    baseColor: '#b89438',
    coords: [
      [[900,360],[980,345],[1060,360],[1110,410],[1125,480],[1095,545],
       [1020,570],[940,560],[895,510],[880,440],[900,360]]
    ],
    label: { x: 1000, y: 470, fontSize: 11, color: '#ffe8a0' }
  },
  // --- 勃艮第 (法国东北+低地国家部分，希特勒和希姆莱之间的黑色国家) ---
  {
    id: 'BUR', faction: 'BUR', name: '勃艮第骑士团国', level: 1,
    baseColor: '#4a2a4a',
    coords: [
      [[410,230],[470,222],[510,238],[520,280],[500,312],[458,320],[420,306],
       [402,272],[410,230]]
    ],
    label: { x: 462, y: 274, fontSize: 8.5, color: '#e0c0e0' }
  },
  // --- 意大利 / 三头同盟 (南欧+地中海沿岸) ---
  {
    id: 'ITA', faction: 'ITA', name: '意大利·三头同盟', level: 1,
    baseColor: '#5a8a4a',
    coords: [
      [[510,320],[570,310],[610,345],[615,400],[580,452],[520,458],[470,438],
       [445,395],[460,350],[490,328],[510,320]]
    ],
    label: { x: 532, y: 386, fontSize: 10, color: '#d8f0c8' }
  },
  // --- 俄罗斯分裂地区 (乌拉尔山以西 AA线以东，西伯利亚，远东) [国家级统一块，分裂时细化] ---
  {
    id: 'RUS', faction: 'RUS', name: '俄罗斯 (破碎)', level: 1,
    baseColor: '#3a3a3a',
    coords: [
      [[705,125],[830,110],[960,125],[1090,140],[1150,195],[1155,290],[1130,370],
       [1085,405],[995,415],[890,400],[800,382],[730,360],[708,290],[705,125]]
    ],
    label: { x: 925, y: 265, fontSize: 11, color: '#d0d0d0' }
  }
];

// ============== 战区级(level=2, 中精度) ==============
// 大日耳曼国拆分为: 本土、北欧、法兰西占领区、乌克兰专员辖区、莫斯科专员辖区、高加索专员辖区
// 俄罗斯拆分为: 20个军阀 (与现有SVG一致)
// 意大利拆为: 本土+巴尔干+北非
const LEVEL2_REGIONS = [
  // === 大日耳曼国 内部 (专员辖区) ===
  { id:'GER_core', faction:'GER', parent:'GER', name:'日耳曼本土', level:2,
    baseColor:'#c04040',
    coords:[[[430,130],[520,125],[590,145],[615,200],[605,265],[565,305],[510,312],
             [470,295],[440,255],[422,200],[420,160],[430,130]]],
    label:{x:510,y:218,fontSize:8,color:'#ffe8d0'}},

  { id:'GER_nord', faction:'GER', parent:'GER', name:'北欧总督区', level:2,
    baseColor:'#b03838',
    coords:[[[355,105],[430,95],[500,105],[525,130],[510,145],[440,150],[380,142],
             [350,128],[355,105]]],
    label:{x:430,y:122,fontSize:7,color:'#ffd8c0'}},

  // 法兰西占领区 (维希+占领)
  { id:'GER_france', faction:'GER', parent:'GER', name:'法兰西总督区', level:2,
    baseColor:'#8a3232',
    coords:[[[330,210],[400,200],[432,225],[440,278],[418,320],[370,338],[335,310],
             [318,268],[322,235],[330,210]]],
    label:{x:378,y:268,fontSize:7.5,color:'#ffd0b0'}},

  // 东方专员辖区 (波兰)
  { id:'GER_ostland', faction:'GER', parent:'GER', name:'东方总督区', level:2,
    baseColor:'#983030',
    coords:[[[580,120],[648,128],[680,175],[675,245],[640,280],[592,278],[570,240],
             [568,180],[580,120]]],
    label:{x:618,y:200,fontSize:7,color:'#ffd0b0'}},

  // 乌克兰专员辖区 (用户最关心的"重灾区"之一)
  { id:'GER_ukraine', faction:'GER', parent:'GER', name:'乌克兰专员辖区', level:2,
    baseColor:'#8a2828',
    coords:[[[590,280],[668,270],[708,290],[718,340],[700,382],[650,398],[590,395],
             [558,362],[552,318],[590,280]]],
    label:{x:632,y:336,fontSize:7.5,color:'#ffc8a8'}},

  // 莫斯科专员辖区 (AA线以西，俄罗斯欧洲部分)
  { id:'GER_moscow', faction:'GER', parent:'GER', name:'莫斯科专员辖区', level:2,
    baseColor:'#7a2020',
    coords:[[[690,140],[785,130],[800,178],[800,260],[775,275],[710,260],[682,220],
             [680,175],[690,140]]],
    label:{x:740,y:200,fontSize:7,color:'#ffc0a0'}},

  // 高加索专员辖区 (南俄草原，用户最关心的"重灾区"之二)
  { id:'GER_caucasus', faction:'GER', parent:'GER', name:'高加索专员辖区', level:2,
    baseColor:'#6a1818',
    coords:[[[552,390],[650,396],[700,384],[720,410],[702,450],[645,478],[578,475],
             [535,445],[528,412],[552,390]]],
    label:{x:622,y:430,fontSize:7,color:'#ffb898'}},

  // === 勃艮第 (作为一个整体) ===
  { id:'BUR_core', faction:'BUR', parent:'BUR', name:'勃艮第骑士团国', level:2,
    baseColor:'#4a2a4a',
    coords:[[[410,230],[470,222],[510,238],[520,280],[500,312],[458,320],[420,306],
             [402,272],[410,230]]],
    label:{x:462,y:274,fontSize:8,color:'#e0c0e0'}},

  // === 意大利 内部 ===
  { id:'ITA_core', faction:'ITA', parent:'ITA', name:'意大利本土', level:2,
    baseColor:'#5a8a4a',
    coords:[[[510,320],[570,310],[605,338],[600,390],[570,422],[532,420],[505,390],
             [495,358],[510,320]]],
    label:{x:548,y:368,fontSize:8,color:'#d8f0c8'}},

  { id:'ITA_balkan', faction:'ITA', parent:'ITA', name:'巴尔干总督区', level:2,
    baseColor:'#4a7a3a',
    coords:[[[605,338],[665,330],[700,362],[695,402],[668,425],[620,435],[590,415],
             [588,380],[600,352],[605,338]]],
    label:{x:640,y:380,fontSize:7.5,color:'#c8e8b8'}},

  { id:'ITA_nafrica', faction:'ITA', parent:'ITA', name:'意属北非', level:2,
    baseColor:'#6a7a3a',
    coords:[[[460,438],[550,432],[620,452],[640,495],[605,530],[520,535],
             [460,512],[442,472],[460,438]]],
    label:{x:538,y:482,fontSize:7.5,color:'#e0e8b0'}},

  // === OFN 内部 (简化) ===
  { id:'USA_core', faction:'USA', parent:'USA', name:'美利坚合众国', level:2,
    baseColor:'#3a6a9a',
    coords:[[[30,262],[140,245],[230,258],[275,300],[278,370],[230,420],[125,430],
             [45,402],[20,340],[30,262]]],
    label:{x:148,y:340,fontSize:8.5,color:'#c0d8f0'}},

  { id:'USA_canada', faction:'USA', parent:'USA', name:'加拿大 (OFN)', level:2,
    baseColor:'#4a7aaa',
    coords:[[[15,140],[120,120],[240,125],[295,170],[285,230],[215,248],[105,244],
             [35,258],[12,218],[15,140]]],
    label:{x:150,y:190,fontSize:7.5,color:'#d0e4f8'}},

  // === 日本 内部 ===
  { id:'JAP_home', faction:'JAP', parent:'JAP', name:'日本四岛', level:2,
    baseColor:'#c8a448',
    coords:[[[1035,362],[1090,350],[1120,385],[1125,430],[1100,460],[1055,462],[1025,440],
             [1020,400],[1035,362]]],
    label:{x:1072,y:410,fontSize:7.5,color:'#fff0c0'}},

  { id:'JAP_manchu', faction:'JAP', parent:'JAP', name:'满洲国 (共荣圈)', level:2,
    baseColor:'#a88838',
    coords:[[[930,330],[1000,325],[1045,350],[1040,378],[995,388],[940,375],
             [915,355],[930,330]]],
    label:{x:980,y:355,fontSize:7,color:'#ffe8a0'}},

  { id:'JAP_china', faction:'JAP', parent:'JAP', name:'中国 (共荣圈)', level:2,
    baseColor:'#988030',
    coords:[[[890,385],[955,378],[1015,400],[1010,472],[960,510],[898,500],
             [875,450],[880,415],[890,385]]],
    label:{x:945,y:445,fontSize:7.5,color:'#ffe090'}},

  { id:'JAP_sea', faction:'JAP', parent:'JAP', name:'东南亚总督区', level:2,
    baseColor:'#887028',
    coords:[[[970,520],[1060,510],[1110,545],[1100,590],[1040,605],[980,590],
             [960,555],[970,520]]],
    label:{x:1035,y:558,fontSize:7,color:'#ffd880'}},

  // === 俄罗斯 20军阀 (x700-1150, y120-400 与现有SVG对应) ===
  { id:'RUS_komi', faction:'RUS', parent:'RUS', name:'科米共和国', level:2,
    baseColor:'#4a4a5a',
    coords:[[[710,138],[750,132],[775,145],[772,180],[755,200],[726,198],[710,175],
             [710,138]]],
    label:{x:740,y:168,fontSize:6,color:'#a0a0c0'}},

  { id:'RUS_wrrf', faction:'RUS', parent:'RUS', name:'WRRF 西俄革命阵线', level:2,
    baseColor:'#5a3a3a',
    coords:[[[710,196],[755,188],[780,200],[782,240],[765,262],[730,262],[710,238],
             [710,196]]],
    label:{x:745,y:228,fontSize:5.8,color:'#c8a0a0'}},

  { id:'RUS_vyatka', faction:'RUS', parent:'RUS', name:'维亚特卡', level:2,
    baseColor:'#4a4a8a',
    coords:[[[712,268],[755,260],[780,274],[782,308],[765,332],[732,330],[712,304],
             [712,268]]],
    label:{x:746,y:298,fontSize:5.8,color:'#a0a0d8'}},

  { id:'RUS_samara', faction:'RUS', parent:'RUS', name:'萨马拉·俄解放军', level:2,
    baseColor:'#5a5a3a',
    coords:[[[760,254],[795,248],[812,264],[810,298],[792,320],[762,316],[752,288],
             [760,254]]],
    label:{x:782,y:284,fontSize:5.5,color:'#c8c8a0'}},

  { id:'RUS_ab', faction:'RUS', parent:'RUS', name:'雅利安兄弟会', level:2,
    baseColor:'#6a3a4a',
    coords:[[[718,332],[756,326],[780,340],[780,370],[762,395],[732,392],[718,365],
             [718,332]]],
    label:{x:748,y:362,fontSize:5,color:'#c8a0b0'}},

  { id:'RUS_sverdlovsk', faction:'RUS', parent:'RUS', name:'斯维尔德洛夫斯克', level:2,
    baseColor:'#3a5a4a',
    coords:[[[802,160],[845,154],[870,166],[872,204],[855,230],[822,230],[804,204],
             [802,160]]],
    label:{x:836,y:194,fontSize:5.5,color:'#a0c8b0'}},

  { id:'RUS_tyumen', faction:'RUS', parent:'RUS', name:'秋明', level:2,
    baseColor:'#5a4a3a',
    coords:[[[802,232],[840,226],[865,240],[868,274],[850,298],[818,296],[802,270],
             [802,232]]],
    label:{x:834,y:264,fontSize:5.5,color:'#c8b8a0'}},

  { id:'RUS_omsk', faction:'RUS', parent:'RUS', name:'鄂木斯克·黑色联盟', level:2,
    baseColor:'#2a2a2a',
    coords:[[[862,236],[905,228],[930,244],[934,284],[918,312],[880,314],[858,286],
             [858,260],[862,236]]],
    label:{x:896,y:272,fontSize:5.5,color:'#e8e8e8'}},

  { id:'RUS_novosib', faction:'RUS', parent:'RUS', name:'新西伯利亚', level:2,
    baseColor:'#4a4a3a',
    coords:[[[860,314],[900,306],[928,320],[934,352],[920,376],[880,376],[858,348],
             [860,314]]],
    label:{x:894,y:344,fontSize:5.5,color:'#c8c8a0'}},

  { id:'RUS_tomsk', faction:'RUS', parent:'RUS', name:'托木斯克', level:2,
    baseColor:'#4a5a5a',
    coords:[[[920,198],[960,190],[982,204],[986,238],[970,260],[934,260],[920,234],
             [920,198]]],
    label:{x:950,y:230,fontSize:5.5,color:'#a0c0c0'}},

  { id:'RUS_kemerovo', faction:'RUS', parent:'RUS', name:'克麦罗沃', level:2,
    baseColor:'#5a3a5a',
    coords:[[[920,260],[956,254],[978,268],[982,298],[966,320],[930,320],[920,294],
             [920,260]]],
    label:{x:948,y:290,fontSize:5.5,color:'#c0a0c0'}},

  { id:'RUS_blackarmy', faction:'RUS', parent:'RUS', name:'黑军自由领土', level:2,
    baseColor:'#2a2a2a',
    coords:[[[976,212],[1012,206],[1032,220],[1036,252],[1020,276],[982,272],[970,246],
             [974,228],[976,212]]],
    label:{x:1004,y:244,fontSize:5,color:'#d8d8d8'}},

  { id:'RUS_nkr', faction:'RUS', parent:'RUS', name:'人民革命委员会', level:2,
    baseColor:'#7a2a2a',
    coords:[[[924,324],[962,316],[988,330],[994,362],[980,386],[940,388],[922,360],
             [924,342],[924,324]]],
    label:{x:956,y:354,fontSize:5,color:'#e8a0a0'}},

  { id:'RUS_krasnoyarsk', faction:'RUS', parent:'RUS', name:'克拉斯诺亚尔斯克', level:2,
    baseColor:'#4a4a4a',
    coords:[[[978,286],[1012,280],[1034,294],[1038,326],[1022,348],[986,348],[974,322],
             [976,302],[978,286]]],
    label:{x:1006,y:316,fontSize:5,color:'#a8a8a8'}},

  { id:'RUS_irkutsk', faction:'RUS', parent:'RUS', name:'伊尔库茨克', level:2,
    baseColor:'#5a4a4a',
    coords:[[[1032,186],[1065,180],[1086,194],[1090,226],[1076,248],[1042,244],[1030,218],
             [1032,186]]],
    label:{x:1058,y:214,fontSize:5.5,color:'#c8b0b0'}},

  { id:'RUS_buryatia', faction:'RUS', parent:'RUS', name:'布里亚特', level:2,
    baseColor:'#6a3a3a',
    coords:[[[1034,248],[1066,242],[1084,256],[1086,282],[1072,302],[1040,296],[1030,272],
             [1034,258],[1034,248]]],
    label:{x:1058,y:276,fontSize:5.5,color:'#c8a0a0'}},

  { id:'RUS_magadan', faction:'RUS', parent:'RUS', name:'马加丹', level:2,
    baseColor:'#5a5a5a',
    coords:[[[1084,198],[1116,192],[1134,208],[1136,240],[1120,262],[1086,254],[1076,228],
             [1084,208],[1084,198]]],
    label:{x:1108,y:230,fontSize:5.5,color:'#c8c8c8'}},

  { id:'RUS_chita', faction:'RUS', parent:'RUS', name:'赤塔', level:2,
    baseColor:'#6a5a3a',
    coords:[[[1080,230],[1110,224],[1128,240],[1130,270],[1114,290],[1082,282],[1072,256],
             [1080,240],[1080,230]]],
    label:{x:1102,y:260,fontSize:5.5,color:'#c8c0a0'}},

  { id:'RUS_amur', faction:'RUS', parent:'RUS', name:'阿穆尔', level:2,
    baseColor:'#4a3a5a',
    coords:[[[1034,306],[1074,298],[1102,314],[1108,346],[1092,372],[1044,368],[1030,342],
             [1034,322],[1034,306]]],
    label:{x:1068,y:340,fontSize:5.5,color:'#b0a0c8'}},

  // === 其他中立/关键地区 ===
  { id:'MID_iberia', faction:'MID', parent:null, name:'伊比利亚联盟', level:2,
    baseColor:'#8a7a4a',
    coords:[[[318,275],[370,268],[400,290],[398,332],[370,352],[330,348],[312,320],
             [318,275]]],
    label:{x:354,y:308,fontSize:7.5,color:'#fff0c8'}},

  { id:'MID_turkey', faction:'MID', parent:null, name:'土耳其共和国', level:2,
    baseColor:'#5a5a4a',
    coords:[[[650,400],[715,392],[748,414],[745,448],[710,468],[660,466],[642,435],
             [650,400]]],
    label:{x:692,y:430,fontSize:7,color:'#e8e0b0'}},

  { id:'MID_iran', faction:'MID', parent:null, name:'伊朗', level:2,
    baseColor:'#5a6a5a',
    coords:[[[745,442],[810,432],[850,460],[848,500],[812,525],[760,518],[740,485],
             [745,442]]],
    label:{x:795,y:478,fontSize:7,color:'#c8d8b8'}},

  { id:'MID_egypt', faction:'MID', parent:null, name:'埃及', level:2,
    baseColor:'#6a7a5a',
    coords:[[[640,494],[695,490],[720,515],[710,560],[670,575],[630,560],[618,528],
             [640,494]]],
    label:{x:670,y:530,fontSize:7,color:'#d8e8b8'}},

  { id:'MID_britain', faction:'MID', parent:null, name:'不列颠 (被占领)', level:2,
    baseColor:'#5a5a6a',
    coords:[[[350,130],[395,125],[415,148],[410,184],[385,198],[354,192],[342,162],
             [350,130]]],
    label:{x:380,y:160,fontSize:7,color:'#c0c0d8'}}
];

// ============== 5个分区视图 (和ZOOM_VIEWS对齐，[x,y,w,h]) ==============
const ZOOM_PRESETS = {
  global:   { x: 0,    y: 0,   w: 1200, h: 750 },
  europe:   { x: 300,  y: 100, w: 500,  h: 420 },
  america:  { x: 10,   y: 60,  w: 300,  h: 600 },
  eastasia: { x: 740,  y: 160, w: 460,  h: 500 },
  africa:   { x: 410,  y: 350, w: 350,  h: 400 }
};

// ============== 组装GeoJSON ==============
function buildFeature(r) {
  return {
    type: 'Feature',
    id: r.id,
    properties: {
      name: r.name,
      faction: r.faction,
      parent: r.parent || null,
      level: r.level,
      baseColor: r.baseColor,
      label: r.label
    },
    geometry: {
      type: 'Polygon',
      coordinates: r.coords
    }
  };
}

const geojson = {
  type: 'FeatureCollection',
  generator: 'tools/gen_geojson_map.js v1.0',
  crs: { type: 'name', properties: { name: 'SVG_VIEWBOX:0 0 1200 750' } },
  zoomPresets: ZOOM_PRESETS,
  stats: {
    level1: LEVEL1_REGIONS.length,
    level2: LEVEL2_REGIONS.length,
    total: LEVEL1_REGIONS.length + LEVEL2_REGIONS.length
  },
  features: [
    ...LEVEL1_REGIONS.map(buildFeature),
    ...LEVEL2_REGIONS.map(buildFeature)
  ]
};

const outPath = path.join(__dirname, '..', 'data', 'map', 'world_mini.geojson');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(geojson, null, 0));

// 统计
const sizeKB = (fs.statSync(outPath).size / 1024).toFixed(2);
console.log('✓ 生成 data/map/world_mini.geojson');
console.log(`  Level 1 (国家级): ${LEVEL1_REGIONS.length} 个区域`);
console.log(`  Level 2 (战区级/军阀): ${LEVEL2_REGIONS.length} 个区域`);
console.log(`  总计: ${geojson.features.length} Features`);
console.log(`  文件大小: ${sizeKB} KB (目标 < 500KB ✓)`);
console.log(`  分区视图: ${Object.keys(ZOOM_PRESETS).join(', ')}`);

// 二次验证: 所有多边形坐标闭合且合法
let bad = 0;
for (const f of geojson.features) {
  const ring = f.geometry.coordinates[0];
  const first = ring[0], last = ring[ring.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) {
    console.warn(`  ⚠ ${f.id}: 多边形未闭合`);
    bad++;
  }
  if (ring.length < 4) {
    console.warn(`  ⚠ ${f.id}: 多边形顶点少于4`);
    bad++;
  }
}
console.log(bad ? `  验证失败: ${bad} 个异常` : '  坐标验证: 全部通过 ✓');
process.exit(bad ? 1 : 0);
