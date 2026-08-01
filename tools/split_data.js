#!/usr/bin/env node
/**
 * tools/split_data.js
 *
 * 功能: 把 data.js 里的 6 个顶层 const 对象拆到 data/ 目录下对应 JSON
 * 输入: js/data.js
 * 输出:
 *   data/buildings.json                 ← BUILDINGS (民用/军工/能源建筑, 30项)
 *   data/policies.json                  ← POLICIES
 *   data/national_foci.json             ← NATIONAL_FOCI (国策树, 约60项)
 *   data/technology/all.json            ← TECHS (科技20项)
 *   data/economy/industries.json        ← 工业分类 (对齐 v2.0 第四阶段: 民用/军事/高科技/能源)
 *   data/succession_paths.json          ← SUCCESSION_PATHS (继承人路线)
 *   data/countries/*.json               ← 6 大国家详细数据 (GER/USA/JAP/ITA/BUR/RUS)
 *   data/countries/index.json           ← 国家id索引
 *
 * 注意: 本脚本只生成 JSON 静态数据文件, 不修改 data.js; 保持原 data.js 完整作为 fallback
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const DATA_JS = path.join(ROOT, 'js', 'data.js');
const OUT = path.join(ROOT, 'data');
const mkdir = (d) => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); };
mkdir(path.join(OUT, 'countries'));
mkdir(path.join(OUT, 'technology'));
mkdir(path.join(OUT, 'economy'));

// 1. 加载 data.js 并取 6 个顶层 const
const src = fs.readFileSync(DATA_JS, 'utf8');
const sandbox = { window: {}, console: { log: () => { } } };
vm.createContext(sandbox);
vm.runInContext(src, sandbox);
const BUILDINGS = sandbox.BUILDINGS || sandbox.window.BUILDINGS || {};
const FACTIONS = sandbox.FACTIONS || sandbox.window.FACTIONS || {};
const POLICIES = sandbox.POLICIES || sandbox.window.POLICIES || {};
const NATIONAL_FOCI = sandbox.NATIONAL_FOCI || sandbox.window.NATIONAL_FOCI || {};
const TECHS = sandbox.TECHS || sandbox.window.TECHS || {};
const SUCCESSION_PATHS = sandbox.SUCCESSION_PATHS || sandbox.window.SUCCESSION_PATHS || {};

// 2. 写简单结构 JSON (BUILDINGS / POLICIES / NATIONAL_FOCI / SUCCESSION_PATHS)
//    这些对象可能带函数字段? 检查一下，如果有函数字段 => 用事件拆分那套序列化方式。
//    我们知道 data.js 里目前 BUILDINGS/TECHS 都是纯数据，但为了保险也做个浅检查。
function sanitizeAny(v, pathKey) {
    if (v == null) return v;
    if (typeof v === 'function') {
        try { return { __type: 'fn', __source: v.toString(), __path: pathKey || 'root' }; }
        catch (_) { return undefined; }
    }
    if (Array.isArray(v)) return v.map((x, i) => sanitizeAny(x, (pathKey || '') + '[' + i + ']'));
    if (typeof v === 'object') {
        const out = {};
        for (const k of Object.keys(v)) {
            const nk = (pathKey ? pathKey + '.' : '') + k;
            const c = v[k];
            if (typeof c === 'function') {
                try { out[k] = { __type: 'fn', __source: c.toString(), __path: nk }; continue; }
                catch (_) { /* skip */ }
            }
            out[k] = sanitizeAny(c, nk);
        }
        return out;
    }
    return v;
}
function writeJson(file, obj) {
    const buf = Buffer.from(JSON.stringify(obj));
    fs.writeFileSync(file, buf);
    return buf.length;
}
const stats = [];
stats.push(['buildings.json', writeJson(path.join(OUT, 'buildings.json'), sanitizeAny(BUILDINGS, 'BUILDINGS'))]);
stats.push(['policies.json', writeJson(path.join(OUT, 'policies.json'), sanitizeAny(POLICIES, 'POLICIES'))]);
stats.push(['national_foci.json', writeJson(path.join(OUT, 'national_foci.json'), sanitizeAny(NATIONAL_FOCI, 'NATIONAL_FOCI'))]);
stats.push(['succession_paths.json', writeJson(path.join(OUT, 'succession_paths.json'), sanitizeAny(SUCCESSION_PATHS, 'SUCCESSION_PATHS'))]);
stats.push(['technology/all.json', writeJson(path.join(OUT, 'technology', 'all.json'), sanitizeAny(TECHS, 'TECHS'))]);

// 3. 工业分类: v2.0 第四阶段 新增的工业四维分类 (民用 / 军事 / 高科技 / 能源)
const industries = {
    meta: { generatedAt: new Date().toISOString(), categories: 4 },
    categories: [
        {
            id: 'civil',
            name: '民用工业',
            desc: '消费品生产 / 基建 / 制造业。影响: GDP增长、生活水平、税收',
            baseGdpMultiplier: 1.2,
            taxRate: 0.42,
            manpowerCost: 1.0
        },
        {
            id: 'military',
            name: '军事工业',
            desc: '武器 / 弹药 / 载具。影响: 武器产量、军力提升',
            baseMilitaryMultiplier: 1.5,
            resourceConsumption: { steel: 2, rare_metal: 0.2 }
        },
        {
            id: 'hi_tech',
            name: '高科技工业',
            desc: '计算机 / 导弹 / 航空航天。影响: 科技、导弹、航天、研发',
            researchMultiplier: 1.8,
            requiresTechUnlocked: true,
            manpowerSkill: 'high'
        },
        {
            id: 'energy',
            name: '能源工业',
            desc: '石油 / 煤炭 / 核能。影响: 能源安全、石油自给率、核弹原料',
            energyOutputPerSlot: { oil: 20, coal: 50, uranium: 0.5 },
            securityMultiplier: 1.3
        }
    ]
};
stats.push(['economy/industries.json', writeJson(path.join(OUT, 'economy', 'industries.json'), industries)]);

// 4. 资源清单: v2.0 第三阶段 6类资源
const resources = {
    meta: { generatedAt: new Date().toISOString(), count: 9 },
    items: [
        { id: 'money',       name: '帝国马克', unit: '亿',      core: true,  desc: '通用货币资金' },
        { id: 'manpower',    name: '人力',     unit: '万人',    core: true,  desc: '可动员人口' },
        { id: 'research',    name: '研发点',   unit: '点',      core: true,  desc: '科研进度点' },
        { id: 'oil',         name: '石油',     unit: '百万桶',  core: false, desc: '动力/工业燃料' },
        { id: 'steel',       name: '钢材',     unit: '百万吨',  core: false, desc: '基础工业原料' },
        { id: 'rare_metal',  name: '稀有金属', unit: '吨',      core: false, desc: '高科技工业原料' },
        { id: 'uranium',     name: '铀',       unit: '吨',      core: false, desc: '核电/核弹原料' },
        { id: 'grain',       name: '粮食',     unit: '百万吨',  core: false, desc: '民生物资/人口承载' },
        { id: 'consumer',    name: '消费品',   unit: '亿',      core: false, desc: '生活水平/稳定度' }
    ]
};
stats.push(['economy/resources.json', writeJson(path.join(OUT, 'economy', 'resources.json'), resources)]);

// 5. 6大国家详细数据 (v2.0 第三阶段 所有字段)
//    id映射: 玩家 GER，其他 5 势力 + 俄罗斯(RUS)
const factionToId = {
    ofn:       { id: 'USA', name: '自由国家组织 (OFN)',     shortName: '美国',   leader: '理查德·尼克松', flagColor: '#3a6a9a', ideology: '自由民主主义' },
    japan:     { id: 'JAP', name: '大日本帝国 / 共荣圈',    shortName: '日本',   leader: '昭和天皇',      flagColor: '#d8d0a8', ideology: '皇道法西斯主义' },
    italy:     { id: 'ITA', name: '意大利帝国（罗马帝国）', shortName: '意大利', leader: '杜伊利奥·科西嘉', flagColor: '#b0a060', ideology: '殖民法西斯主义' },
    burgundy:  { id: 'BUR', name: '勃艮第骑士团国',          shortName: '勃艮第', leader: '海因里希·希姆莱', flagColor: '#3a1a3a', ideology: '极端神秘主义' },
    russia:    { id: 'RUS', name: '俄罗斯（统一后）',        shortName: '俄罗斯', leader: '待定',           flagColor: '#7a3a3a', ideology: '未定' }
};
const base = {
    GER: {
        name: '大日耳曼国 (Großgermanien)', shortName: '大日耳曼国', leader: '康拉德·阿登纳(临时)', flagColor: '#a83232',
        ideology: '纳粹主义', capital: '日耳曼尼亚(日耳曼尼亚计划)',
        // 经济 v2.0
        gdp: 1800000,            // 百万帝国马克
        gdpGrowth: 0.012,        // 季度
        gdpPerCapita: 21200,
        inflation: 0.035,
        treasury: 120000,        // 国库
        taxRate: 0.42,
        governmentBudget: { military: 0.38, welfare: 0.18, research: 0.09, administration: 0.20, espionage: 0.15 },
        // 政治
        stability: 70,
        support: 62,
        corruption: 0.18,
        // 军事
        army: 480, airforce: 220, navy: 140,
        nuclear: { warheads: 2, delivery: { icbm: 15, slbm: 0, bomber: 80 }, deterrence: 45 },
        // 人口
        population: 85000000,
        unemployment: 0.045,
        literacy: 0.96,
        urbanRate: 0.82,
        lifeExpectancy: 70,
        // 工业
        industry: { civilSlots: 320, militarySlots: 210, hiTechSlots: 38, energySlots: 96, efficiency: 0.82 },
        // 科技
        tech: { militaryTier: 2, civilTier: 3, nuclearTier: 1, rocketTier: 1 },
        // 资源 (年产出)
        resources: { oil: 60, steel: 240, rare_metal: 18, uranium: 3, grain: 210, consumer: 240 },
        // 领土
        territories: ['本土', '尼德兰', '法兰西北部', '挪威', '丹麦', '波兰总督府', '莫斯科专员辖区', '乌克兰专员辖区', '高加索专员辖区', '南斯拉夫总督府', '波希米亚总督府']
    }
};
// 其他5国从 base 的同结构派生，数值按TNO设定
const presets = {
    USA: {
        name: '自由国家组织 (OFN) / 美利坚合众国', shortName: '美国', leader: '理查德·尼克松', flagColor: '#3a6a9a',
        ideology: '自由民主主义', capital: '华盛顿DC',
        gdp: 3200000, gdpGrowth: 0.018, gdpPerCapita: 18600, inflation: 0.028,
        treasury: 260000, taxRate: 0.32,
        governmentBudget: { military: 0.42, welfare: 0.22, research: 0.12, administration: 0.14, espionage: 0.10 },
        stability: 58, support: 54, corruption: 0.10,
        army: 360, airforce: 380, navy: 480,
        nuclear: { warheads: 6, delivery: { icbm: 120, slbm: 80, bomber: 220 }, deterrence: 85 },
        population: 190000000, unemployment: 0.052, literacy: 0.94, urbanRate: 0.74, lifeExpectancy: 69,
        industry: { civilSlots: 560, militarySlots: 340, hiTechSlots: 88, energySlots: 180, efficiency: 0.88 },
        tech: { militaryTier: 3, civilTier: 3, nuclearTier: 2, rocketTier: 2 },
        resources: { oil: 380, steel: 480, rare_metal: 56, uranium: 8, grain: 540, consumer: 520 },
        territories: ['本土48州', '阿拉斯加', '夏威夷', '古巴', '巴拿马运河区', '加拿大(半控制)', '格陵兰']
    },
    JAP: {
        name: '大日本帝国 / 大东亚共荣圈', shortName: '日本', leader: '昭和天皇（裕仁）', flagColor: '#d8d0a8',
        ideology: '皇道法西斯主义', capital: '东京（新京/计划）',
        gdp: 1560000, gdpGrowth: 0.024, gdpPerCapita: 4800, inflation: 0.052,
        treasury: 145000, taxRate: 0.38,
        governmentBudget: { military: 0.52, welfare: 0.10, research: 0.10, administration: 0.14, espionage: 0.14 },
        stability: 66, support: 72, corruption: 0.16,
        army: 520, airforce: 260, navy: 360,
        nuclear: { warheads: 0, delivery: { icbm: 0, slbm: 0, bomber: 40 }, deterrence: 18 },
        population: 430000000, unemployment: 0.062, literacy: 0.84, urbanRate: 0.48, lifeExpectancy: 64,
        industry: { civilSlots: 420, militarySlots: 280, hiTechSlots: 60, energySlots: 100, efficiency: 0.72 },
        tech: { militaryTier: 2, civilTier: 2, nuclearTier: 0, rocketTier: 1 },
        resources: { oil: 180, steel: 300, rare_metal: 40, uranium: 1, grain: 260, consumer: 220 },
        territories: ['本土四岛', '朝鲜', '满洲国', '中国(关内合作政府)', '东南亚(缅甸/印尼/马来亚)', '印度支那', '夏威夷', '太平洋诸岛']
    },
    ITA: {
        name: '意大利帝国（新罗马帝国）', shortName: '意大利', leader: '本尼托·墨索里尼(病危)', flagColor: '#b0a060',
        ideology: '殖民法西斯主义', capital: '罗马（新罗马计划）',
        gdp: 580000, gdpGrowth: 0.010, gdpPerCapita: 3800, inflation: 0.068,
        treasury: 54000, taxRate: 0.40,
        governmentBudget: { military: 0.40, welfare: 0.16, research: 0.06, administration: 0.18, espionage: 0.20 },
        stability: 48, support: 44, corruption: 0.28,
        army: 220, airforce: 140, navy: 180,
        nuclear: { warheads: 0, delivery: { icbm: 0, slbm: 0, bomber: 10 }, deterrence: 6 },
        population: 165000000, unemployment: 0.078, literacy: 0.78, urbanRate: 0.45, lifeExpectancy: 63,
        industry: { civilSlots: 200, militarySlots: 120, hiTechSlots: 14, energySlots: 60, efficiency: 0.66 },
        tech: { militaryTier: 1, civilTier: 2, nuclearTier: 0, rocketTier: 0 },
        resources: { oil: 120, steel: 180, rare_metal: 12, uranium: 1, grain: 140, consumer: 100 },
        territories: ['本土', '西西里', '撒丁岛', '利比亚', '埃及（地中海亚特兰大计划）', '埃塞俄比亚', '东非', '阿尔巴尼亚', '希腊', '克罗地亚']
    },
    BUR: {
        name: '勃艮第骑士团国（SS-Ordensstaat Burgund）', shortName: '勃艮第', leader: '海因里希·希姆莱', flagColor: '#3a1a3a',
        ideology: '极端神秘主义 / 亚特兰蒂斯崇拜', capital: '第戎（新黑尔韦格）',
        gdp: 90000, gdpGrowth: -0.004, gdpPerCapita: 1800, inflation: 0.14,
        treasury: 12000, taxRate: 0.68,
        governmentBudget: { military: 0.68, welfare: 0.02, research: 0.12, administration: 0.04, espionage: 0.14 },
        stability: 28, support: 18, corruption: 0.12,
        army: 140, airforce: 40, navy: 20,
        nuclear: { warheads: 1, delivery: { icbm: 2, slbm: 0, bomber: 18 }, deterrence: 32 },
        population: 20000000, unemployment: 0.12, literacy: 0.72, urbanRate: 0.55, lifeExpectancy: 56,
        industry: { civilSlots: 40, militarySlots: 80, hiTechSlots: 18, energySlots: 26, efficiency: 0.50 },
        tech: { militaryTier: 2, civilTier: 0, nuclearTier: 1, rocketTier: 1 },
        resources: { oil: 4, steel: 28, rare_metal: 3, uranium: 1, grain: 8, consumer: 6 },
        territories: ['勃艮第本土', '比利时', '卢森堡', '法国东部边境']
    },
    RUS: {
        name: '俄罗斯（统一后的残部）', shortName: '俄罗斯', leader: '未定', flagColor: '#7a3a3a',
        ideology: '统一后待决定（民主/法西斯/君主/共产主义）', capital: '莫斯科废墟 或 斯维尔德洛夫斯克',
        gdp: 140000, gdpGrowth: 0.028, gdpPerCapita: 1100, inflation: 0.22,
        treasury: 18000, taxRate: 0.32,
        governmentBudget: { military: 0.62, welfare: 0.08, research: 0.04, administration: 0.12, espionage: 0.14 },
        stability: 36, support: 40, corruption: 0.26,
        army: 320, airforce: 40, navy: 6,
        nuclear: { warheads: 0, delivery: { icbm: 0, slbm: 0, bomber: 2 }, deterrence: 4 },
        population: 120000000, unemployment: 0.18, literacy: 0.70, urbanRate: 0.30, lifeExpectancy: 54,
        industry: { civilSlots: 60, militarySlots: 48, hiTechSlots: 4, energySlots: 28, efficiency: 0.50 },
        tech: { militaryTier: 1, civilTier: 1, nuclearTier: 0, rocketTier: 0 },
        resources: { oil: 120, steel: 180, rare_metal: 24, uranium: 6, grain: 60, consumer: 40 },
        territories: ['西俄残余', '乌拉尔', '西伯利亚（部分）', '中亚残余']
    }
};
// 合并到 countries 目录
const index = { generatedAt: new Date().toISOString(), countries: {} };
Object.keys(presets).forEach(id => {
    const c = { id, generatedAt: new Date().toISOString(), ...presets[id] };
    const p = path.join(OUT, 'countries', `${id}.json`);
    const size = writeJson(p, c);
    stats.push(['countries/' + id + '.json', size]);
    index.countries[id] = { name: c.name, shortName: c.shortName, flagColor: c.flagColor, leader: c.leader, sizeBytes: size };
});
// 玩家 GER 也从 FACTIONS 导入
(function writeGer(){
    const c = { id: 'GER', generatedAt: new Date().toISOString(), ...base.GER };
    const of = factionToId;
    // 从原 FACTIONS 合并 desc / longDesc
    if (FACTIONS && FACTIONS.ger) { c.desc = FACTIONS.ger.desc; c.longDesc = FACTIONS.ger.longDesc; }
    const p = path.join(OUT, 'countries', 'GER.json');
    const size = writeJson(p, c);
    stats.push(['countries/GER.json', size]);
    index.countries['GER'] = { name: c.name, shortName: c.shortName, flagColor: c.flagColor, leader: c.leader, sizeBytes: size };
})();
// 顺序: GER 第一个
const ordered = { GER: index.countries.GER };
for (const k of Object.keys(index.countries)) if (k !== 'GER') ordered[k] = index.countries[k];
index.countries = ordered;
stats.push(['countries/index.json', writeJson(path.join(OUT, 'countries', 'index.json'), index)]);

// 科技树：v2.0 第六阶段 双科技树 (军事/民用) — 合并TECHS的基础上，分年代阶段
function genTechTree() {
    // 原TECHS导入
    const old = sanitizeAny(TECHS, 'TECHS');
    // v2.0 建议的新科技（不覆盖old，只是补充阶段）
    const additional = {
        mil_1960_jet: { id: 'mil_1960_jet',       name: '喷气飞机',    branch: 'military', decade: 1960, cost: 60,  desc: '米格/霍克级别喷气机量产', effects: { airforce: 30, militaryPower: 15 } },
        mil_1960_missile: { id: 'mil_1960_missile', name: '导弹基础',  branch: 'military', decade: 1960, cost: 70,  desc: 'V-1 V-2 的实用化后裔', effects: { deterrence: 10 } },
        mil_1960_nuclear: { id: 'mil_1960_nuclear', name: '核技术',    branch: 'military', decade: 1960, cost: 120, desc: '裂变/聚变武器工程', effects: { nukeDeter: 25, nukes: 1 }, requires: 'mil_1960_missile' },
        mil_1970_pgm:     { id: 'mil_1970_pgm',      name: '精确制导',  branch: 'military', decade: 1970, cost: 110, desc: '激光/电视制导炸弹', effects: { militaryPower: 25, army: 20 }, requires: 'mil_1960_jet' },
        mil_1970_mbt:     { id: 'mil_1970_mbt',      name: '先进坦克',  branch: 'military', decade: 1970, cost: 100, desc: 'MBT/MBT-70/Kpz.70', effects: { army: 40 }, requires: 'mil_1960_jet' },
        mil_1980_info:    { id: 'mil_1980_info',     name: '信息战争',  branch: 'military', decade: 1980, cost: 150, desc: '电子战 / C4I', effects: { militaryPower: 40, deterrence: 20 }, requires: 'mil_1970_pgm' },
        mil_1980_stealth: { id: 'mil_1980_stealth',  name: '隐形技术',  branch: 'military', decade: 1980, cost: 160, desc: 'F/B-2 级别低可视', effects: { airforce: 60, deterrence: 15 }, requires: 'mil_1980_info' },
        mil_1990_cyber:   { id: 'mil_1990_cyber',    name: '网络战争',  branch: 'military', decade: 1990, cost: 200, desc: '国家级网络攻防', effects: { deterrence: 40 }, requires: 'mil_1980_info' },
        mil_1990_uav:     { id: 'mil_1990_uav',      name: '无人设备',  branch: 'military', decade: 1990, cost: 180, desc: '无人机/UCAV', effects: { airforce: 40, militaryPower: 25 }, requires: 'mil_1980_stealth' },

        civ_1960_computer: { id: 'civ_1960_computer', name: '晶体管计算机', branch: 'civil', decade: 1960, cost: 80,   desc: '大型机/小型机普及', effects: { research: 20, gdpGrowth: 0.002 } },
        civ_1970_comm:     { id: 'civ_1970_comm',     name: '通讯革命',   branch: 'civil', decade: 1970, cost: 100,  desc: '卫星通讯/光纤', effects: { research: 20, stability: 5 }, requires: 'civ_1960_computer' },
        civ_1980_internet: { id: 'civ_1980_internet', name: '互联网',     branch: 'civil', decade: 1980, cost: 150,  desc: 'TCP/IP全球网', effects: { research: 40, gdpGrowth: 0.006 }, requires: 'civ_1970_comm' },
        civ_1990_ai:       { id: 'civ_1990_ai',       name: '人工智能',   branch: 'civil', decade: 1990, cost: 220,  desc: '专家系统/早期神经网络', effects: { research: 80, efficiency: 0.04 }, requires: 'civ_1980_internet' },
    };
    return {
        meta: { generatedAt: new Date().toISOString(), branches: 2 },
        // 合并：original TECHS + v2.0 追加科技
        all: Object.assign({}, old, additional),
        byBranch: {
            military: Object.keys(additional).filter(k => additional[k].branch === 'military').map(k => additional[k].id),
            civil: Object.keys(additional).filter(k => additional[k].branch === 'civil').map(k => additional[k].id),
            legacy: Object.keys(old)
        },
        byDecade: {
            1960: Object.keys(additional).filter(k => additional[k].decade === 1960).map(k => additional[k].id),
            1970: Object.keys(additional).filter(k => additional[k].decade === 1970).map(k => additional[k].id),
            1980: Object.keys(additional).filter(k => additional[k].decade === 1980).map(k => additional[k].id),
            1990: Object.keys(additional).filter(k => additional[k].decade === 1990).map(k => additional[k].id)
        }
    };
}
stats.push(['technology/tech_tree.json', writeJson(path.join(OUT, 'technology', 'tech_tree.json'), genTechTree())]);

// 打印报表
console.log('==== split_data.js 输出报表 ====');
let total = 0;
stats.forEach(([n, s]) => {
    console.log('  ' + n.padEnd(32) + ' ' + Math.round(s/1024) + ' KB');
    total += s;
});
console.log('  ' + '——————————————————————————————');
console.log('  合计: '.padEnd(32) + ' ' + (total/1024/1024).toFixed(2) + ' MB');
