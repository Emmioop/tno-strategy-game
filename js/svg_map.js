(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SVGMap = factory();
})(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  const FACTION_COLORS = {
    // ===== 团结协定 - 德国核心 (深红) =====
    germany: { fill: '#8b2a2a', border: '#5a1818' },
    netherlands: { fill: '#8b2a2a', border: '#5a1818' },
    denmark: { fill: '#8b2a2a', border: '#5a1818' },
    norway: { fill: '#8b2a2a', border: '#5a1818' },
    norway_port: { fill: '#8b2a2a', border: '#5a1818' },
    bohemia: { fill: '#8b3a3a', border: '#5a2020' },
    generalgouvernement: { fill: '#8b3232', border: '#5a1c1c' },
    belgium: { fill: '#8b3030', border: '#5a1c1c' },
    luxembourg: { fill: '#8b3030', border: '#5a1c1c' },
    estonia: { fill: '#8b2e2e', border: '#5a1c1c' },
    latvia: { fill: '#8b2e2e', border: '#5a1c1c' },
    lithuania: { fill: '#8b2e2e', border: '#5a1c1c' },
    austria: { fill: '#8b2a2a', border: '#5a1818' },

    // ===== 斯堪的纳维亚：瑞典/芬兰 (中立/亲德) =====
    sweden: { fill: '#6a7aa8', border: '#3d4a70' },
    finland: { fill: '#7a8ab0', border: '#45557c' },
    iceland: { fill: '#5a7aa5', border: '#304560' },

    // ===== 团结协定 - 专员辖区 (深红, 略浅) =====
    ukraine: { fill: '#9a3030', border: '#5a1c1c' },
    ostland: { fill: '#9a3030', border: '#5a1c1c' },
    moscow: { fill: '#9a3030', border: '#5a1c1c' },
    caucasus: { fill: '#9a3030', border: '#5a1c1c' },

    // ===== 勃艮第 (暗红/紫红) =====
    burgundy: { fill: '#6b1a3a', border: '#3d0d22' },
    burgundy_antarctica: { fill: '#6b1a3a', border: '#3d0d22' },

    // ===== 三头同盟 - 意大利/伊比利亚 (暗红/橙) =====
    italy: { fill: '#7a4a2a', border: '#4a2c18' },
    italian_east_africa: { fill: '#7a4a2a', border: '#4a2c18' },
    spain: { fill: '#8a5a2a', border: '#52341a' },
    iberia: { fill: '#8a5a2a', border: '#52341a' },
    croatia: { fill: '#7a4a2a', border: '#4a2c18' },
    greece: { fill: '#7a4a2a', border: '#4a2c18' },
    montenegro: { fill: '#7a4a2a', border: '#4a2c18' },
    macedonia: { fill: '#7a4a2a', border: '#4a2c18' },
    albania: { fill: '#7a4a2a', border: '#4a2c18' },
    san_marino: { fill: '#7a4a2a', border: '#4a2c18' },
    monaco: { fill: '#7a4a2a', border: '#4a2c18' },
    switzerland: { fill: '#9a6030', border: '#5a3818' },

    // ===== 团结协定仆从国 (浅灰/粉) =====
    slovakia: { fill: '#8a6a6a', border: '#503a3a' },
    hungary: { fill: '#8a6a6a', border: '#503a3a' },
    romania: { fill: '#8a6a6a', border: '#503a3a' },
    serbia: { fill: '#8a6a6a', border: '#503a3a' },
    bulgaria: { fill: '#8a6a6a', border: '#503a3a' },
    crimea: { fill: '#7a4a4a', border: '#4a2c2c' },
    moldova: { fill: '#8a6a6a', border: '#503a3a' },

    // ===== 法国残余 (蓝) =====
    france: { fill: '#3b5998', border: '#1e3560' },
    free_france: { fill: '#3b5998', border: '#1e3560' },
    french_madagascar: { fill: '#3b5998', border: '#1e3560' },
    french_guiana: { fill: '#3b5998', border: '#1e3560' },

    // ===== 英国 (蓝) =====
    uk: { fill: '#4a6fa5', border: '#2d4570' },

    // ===== 爱尔兰 (中立绿) =====
    ireland: { fill: '#3a7a4a', border: '#1e4a2a' },

    // ===== 大东亚共荣圈 (橙黄) =====
    japan: { fill: '#c4342d', border: '#802020' },
    japan_antarctica: { fill: '#c4342d', border: '#802020' },
    manchuria: { fill: '#d4a853', border: '#8a6d2a' },
    mengjiang: { fill: '#d4a853', border: '#8a6d2a' },
    china: { fill: '#d4a853', border: '#8a6d2a' },
    jinsui: { fill: '#d4a853', border: '#8a6d2a' },
    guangdong: { fill: '#d4a853', border: '#8a6d2a' },
    guangxi: { fill: '#d4a853', border: '#8a6d2a' },
    guizhou: { fill: '#d4a853', border: '#8a6d2a' },
    yunnan: { fill: '#d4a853', border: '#8a6d2a' },
    northwest_frontier: { fill: '#d4a853', border: '#8a6d2a' },
    south_sea: { fill: '#d4a853', border: '#8a6d2a' },
    philippines: { fill: '#d4a853', border: '#8a6d2a' },
    vietnam: { fill: '#d4a853', border: '#8a6d2a' },
    laos: { fill: '#d4a853', border: '#8a6d2a' },
    cambodia: { fill: '#d4a853', border: '#8a6d2a' },
    burma: { fill: '#d4a853', border: '#8a6d2a' },
    thailand: { fill: '#d4a853', border: '#8a6d2a' },
    malaya: { fill: '#d4a853', border: '#8a6d2a' },
    indonesia: { fill: '#d4a853', border: '#8a6d2a' },
    free_india: { fill: '#d4a853', border: '#8a6d2a' },
    bhutan: { fill: '#d4a853', border: '#8a6d2a' },
    nepal: { fill: '#d4a853', border: '#8a6d2a' },

    // ===== OFN - 美国/美洲 (蓝) =====
    usa: { fill: '#3a6ea5', border: '#1e4070' },
    canada: { fill: '#4a6fa5', border: '#2d4570' },
    mexico: { fill: '#3a7a5a', border: '#1e4a35' },
    brazil: { fill: '#3a7a5a', border: '#1e4a35' },
    argentina: { fill: '#5a8aaa', border: '#355270' },
    argentina_antarctica: { fill: '#5a8aaa', border: '#355270' },
    chile: { fill: '#5a8aaa', border: '#355270' },
    chile_antarctica: { fill: '#5a8aaa', border: '#355270' },
    ofn_trust: { fill: '#4a7fa5', border: '#2d4570' },
    cuba: { fill: '#3a6ea5', border: '#1e4070' },
    west_indies: { fill: '#4a6fa5', border: '#2d4570' },
    british_honduras: { fill: '#4a6fa5', border: '#2d4570' },
    peru: { fill: '#5a7a8a', border: '#354a52' },
    colombia: { fill: '#3a7a57', border: '#1e4a35' },
    venezuela: { fill: '#6a8a3a', border: '#3e5220' },
    ecuador: { fill: '#5a8a6a', border: '#355240' },
    bolivia: { fill: '#6a7a5a', border: '#3e4635' },
    paraguay: { fill: '#5a8a5a', border: '#355235' },
    uruguay: { fill: '#5a7a9a', border: '#354a5a' },
    new_granada: { fill: '#3a7a57', border: '#1e4a35' },
    panama: { fill: '#3a7a5a', border: '#1e4a35' },
    costarica: { fill: '#3a7a5a', border: '#1e4a35' },
    nicaragua: { fill: '#5a7a5a', border: '#354635' },
    honduras: { fill: '#6a7a4a', border: '#3e4628' },
    guatemala: { fill: '#5a7a6a', border: '#35463e' },
    el_salvador: { fill: '#5a7a6a', border: '#35463e' },
    suriname: { fill: '#5a7a5a', border: '#354635' },
    guyana: { fill: '#4a7a5a', border: '#2a4635' },
    dominican: { fill: '#7a6a4a', border: '#464028' },
    haiti: { fill: '#5a6a8a', border: '#353e50' },

    // ===== 俄罗斯军阀 (破碎灰) =====
    west_russia: { fill: '#5a4a5a', border: '#352a35' },
    vologda: { fill: '#5a4a5a', border: '#352a35' },
    komi: { fill: '#5a4a5a', border: '#352a35' },
    gorky: { fill: '#5a4a5a', border: '#352a35' },
    tatarstan: { fill: '#5a4a5a', border: '#352a35' },
    vyatka: { fill: '#5a4a5a', border: '#352a35' },
    st_george: { fill: '#5a4a5a', border: '#352a35' },
    aryan_brotherhood: { fill: '#5a4a5a', border: '#352a35' },
    samara: { fill: '#5a4a5a', border: '#352a35' },
    bashkortostan: { fill: '#5a4a5a', border: '#352a35' },
    ural_union: { fill: '#5a4a5a', border: '#352a35' },
    orenburg: { fill: '#5a4a5a', border: '#352a35' },
    dillinger: { fill: '#5a4a5a', border: '#352a35' },
    magnitogorsk: { fill: '#5a4a5a', border: '#352a35' },
    zlatooust: { fill: '#5a4a5a', border: '#352a35' },
    vorkuta: { fill: '#5a4a5a', border: '#352a35' },
    yugra: { fill: '#5a4a5a', border: '#352a35' },
    onega: { fill: '#5a4a5a', border: '#352a35' },
    kazakhstan: { fill: '#6a7a6a', border: '#3e463e' },
    karakalpakstan: { fill: '#6a7a6a', border: '#3e463e' },
    uzbekistan: { fill: '#6a7a6a', border: '#3e463e' },
    kyrgyzstan: { fill: '#6a7a6a', border: '#3e463e' },
    turkmenistan: { fill: '#6a7a6a', border: '#3e463e' },
    turkestan_legion: { fill: '#6a7a6a', border: '#3e463e' },
    tajikistan: { fill: '#6a7a6a', border: '#3e463e' },
    west_siberia: { fill: '#5a4a5a', border: '#352a35' },
    ural_confederation: { fill: '#5a4a5a', border: '#352a35' },
    black_league: { fill: '#5a4a5a', border: '#352a35' },
    novosibirsk: { fill: '#5a4a5a', border: '#352a35' },
    tomsk: { fill: '#5a4a5a', border: '#352a35' },
    free_fighters: { fill: '#5a4a5a', border: '#352a35' },
    kemerovo: { fill: '#5a4a5a', border: '#352a35' },
    krasnoyarsk: { fill: '#5a4a5a', border: '#352a35' },
    oyrot: { fill: '#5a4a5a', border: '#352a35' },
    tuva: { fill: '#5a4a5a', border: '#352a35' },
    black_army: { fill: '#5a4a5a', border: '#352a35' },
    irkutsk: { fill: '#5a4a5a', border: '#352a35' },
    buryat: { fill: '#5a4a5a', border: '#352a35' },
    transbaikal: { fill: '#5a4a5a', border: '#352a35' },
    amur: { fill: '#5a4a5a', border: '#352a35' },
    magadan: { fill: '#5a4a5a', border: '#352a35' },
    yakutia: { fill: '#5a4a5a', border: '#352a35' },
    pacific_fleet: { fill: '#5a4a5a', border: '#352a35' },

    // ===== 中东 (棕/绿系) =====
    iran: { fill: '#4a8b6f', border: '#2a5a45' },
    turkey: { fill: '#7a5a3a', border: '#4a3822' },
    iraq: { fill: '#5a7a4a', border: '#35462a' },
    syria: { fill: '#8b6a4a', border: '#504028' },
    mosul_kirkuk: { fill: '#5a7a4a', border: '#35462a' },
    levant: { fill: '#8b6a4a', border: '#504028' },
    saudi: { fill: '#5a7a3a', border: '#354620' },
    gulf: { fill: '#5a7a3a', border: '#354620' },
    yemen: { fill: '#7a6a4a', border: '#464028' },
    oman: { fill: '#5a8a7a', border: '#355246' },
    afghanistan: { fill: '#6a5a3a', border: '#3e3522' },
    border_provinces: { fill: '#6a5a3a', border: '#3e3522' },
    india: { fill: '#b8860b', border: '#6a4e07' },
    sri_lanka: { fill: '#b8860b', border: '#6a4e07' },

    // ===== 非洲 (棕/绿系) =====
    egypt: { fill: '#c4a04a', border: '#7a6028' },
    algeria: { fill: '#8b7355', border: '#50422e' },
    east_africa: { fill: '#8b6a3a', border: '#504022' },
    congo: { fill: '#7a5a3a', border: '#463822' },
    southwest_africa: { fill: '#8b6a3a', border: '#504022' },
    south_africa: { fill: '#7a6a5a', border: '#464035' },
    cameroon: { fill: '#7a6a3a', border: '#464022' },
    new_swabia: { fill: '#5a5a6a', border: '#35353e' },

    // 西非
    azawad: { fill: '#8b7355', border: '#50422e' },
    mali: { fill: '#8b7355', border: '#50422e' },
    taraza: { fill: '#8b7355', border: '#50422e' },
    wolofia: { fill: '#8b7355', border: '#50422e' },
    jura: { fill: '#8b7355', border: '#50422e' },
    sokoto: { fill: '#7a6a3a', border: '#464022' },
    air: { fill: '#8b7355', border: '#50422e' },
    kanem: { fill: '#7a6a3a', border: '#464022' },
    mossi: { fill: '#7a6a3a', border: '#464022' },
    guinea: { fill: '#5a7a4a', border: '#35462a' },
    mandi: { fill: '#5a7a4a', border: '#35462a' },
    ghana: { fill: '#7a6a3a', border: '#464022' },
    gberan: { fill: '#7a6a3a', border: '#464022' },
    yorubaland: { fill: '#7a6a3a', border: '#464022' },

    // ===== 其他 =====
    australia: { fill: '#b87333', border: '#6a4519' },
    new_zealand: { fill: '#6a7a6a', border: '#3e463e' },
    default: { fill: '#3a4a5a', border: '#1e2a35' }
  };

  function getFactionColor(countryId) {
    return FACTION_COLORS[countryId] || FACTION_COLORS.default;
  }

  const MAP_NAMES = {
    einheitspakt: '轴心国集团 (欧洲)',
    america: '美洲',
    geacs: '大东亚共荣圈',
    russia: '俄罗斯地区',
    south_asia: '南亚/中东',
    triumvirate: '三头同盟 (地中海)',
    einheitspakt_afrika: '轴心非洲',
    west_africa: '西非',
    antarctica: '南极洲',
  };

  class SVGMap {
    constructor(canvas, options = {}) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      if (!this.ctx) throw new Error('Canvas 2D context unavailable');

      this.options = Object.assign({
        dataDir: 'data/svg_maps',
        bgColor: '#0e1520',
        oceanColor: '#1a2535',
        borderColor: '#0a0f18',
        hoverStroke: '#ffe080',
        selectStroke: '#ff8a30',
        dprMax: 2,
        autoLoad: true,
        initialMap: null,
      }, options);

      this.view = { x: 0, y: 0, w: 1000, h: 700 };
      this.minScale = 0.1;
      this.maxScale = 8;

      this.currentMapId = null;
      this.currentMapData = null;
      this.pathCache = new Map();
      this.featureIndex = new Map();

      this.hoverId = null;
      this.selectId = null;

      this._listeners = {};
      this._animId = null;
      this._dirty = true;
      this._destroyed = false;
      this._renderScale = 1;
      this._renderOffsetX = 0;
      this._renderOffsetY = 0;

      this._bindPointer();
      this._bindResize();

      if (this.options.initialMap) {
        this.loadMap(this.options.initialMap);
      } else {
        this._requestDraw();
      }
    }

    _bindResize() {
      if (typeof ResizeObserver !== 'undefined' && this.canvas && this.canvas.parentElement) {
        try {
          const ob = new ResizeObserver(() => {
            if (this._destroyed) return;
            this._dirty = true;
            this._requestDraw();
          });
          ob.observe(this.canvas.parentElement);
          this._resizeOb = ob;
        } catch (_) { this._resizeOb = null; }
      }
      if (typeof window !== 'undefined' && window.addEventListener) {
        this._onWinResize = () => {
          if (this._destroyed) return;
          this._dirty = true;
          this._requestDraw();
        };
        window.addEventListener('resize', this._onWinResize);
        window.addEventListener('orientationchange', this._onWinResize);
      }
      let tries = 0;
      const tryDraw = () => {
        if (this._destroyed) return;
        tries++;
        const r = this._getCssRect();
        if (r && r.width > 0 && r.height > 0) {
          this._dirty = true;
          this._requestDraw();
          return;
        }
        if (tries < 20) setTimeout(tryDraw, 100);
      };
      setTimeout(tryDraw, 0);
    }

    async loadMap(mapId) {
      if (this._destroyed) return;
      const url = `${this.options.dataDir}/${mapId}.json`;
      try {
        const resp = await fetch(url, { cache: 'no-cache' });
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        const data = await resp.json();
        this._ingestMapData(mapId, data);
        this._fire('ready', { mapId, data });
        this._dirty = true;
        this._requestDraw();
        return true;
      } catch (e) {
        console.error('[SVGMap] 加载失败:', url, e.message);
        this._fire('error', e);
        return false;
      }
    }

    _ingestMapData(mapId, data) {
      this.currentMapId = mapId;
      this.currentMapData = data;
      this.view = {
        x: data.view.x || 0,
        y: data.view.y || 0,
        w: data.view.w,
        h: data.view.h
      };
      this.pathCache.clear();
      this.featureIndex.clear();
      this._labelCache = {};

      const canvas = this.canvas;

      for (const [cid, cdata] of Object.entries(data.countries)) {
        const combinedPath = new Path2D();
        let totalArea = 0;
        const allBBoxes = [];

        for (const dStr of cdata.p) {
          try {
            combinedPath.addPath(new Path2D(dStr));
          } catch (_) {
            try { combinedPath.addPath(new Path2D(dStr)); } catch (_) {}
          }

          const bbox = this._computePathBBox(dStr);
          if (bbox) {
            totalArea += bbox.area;
            allBBoxes.push(bbox);
          }
        }

        this.pathCache.set(cid, combinedPath);
        this.featureIndex.set(cid, {
          id: cid,
          zh: cdata.zh,
          pathCount: cdata.n,
          mapId
        });

        // 计算标签位置：过滤异常大的路径，选最大路径的中心点
        const mapArea = data.view.w * data.view.h;
        const filtered = allBBoxes.filter(b => b.area < mapArea * 0.4 && b.area > 10);
        const candidates = filtered.length > 0 ? filtered : allBBoxes;
        candidates.sort((a, b) => b.area - a.area);

        let labelPos = null;
        if (candidates.length > 0) {
          const b = candidates[0];
          labelPos = { x: (b.minX + b.maxX) / 2, y: (b.minY + b.maxY) / 2, area: totalArea };
        }
        if (labelPos) this._labelCache[cid] = labelPos;
      }
      this.zoomToFit();
    }

    _computePathBBox(dStr) {
      try {
        // 正确解析 SVG path 命令，提取顶点坐标
        const points = [];
        let cx = 0, cy = 0;
        // 用正则匹配：命令字母 + 后面跟的数字
        const tokens = dStr.match(/[MmLlHhVvCcSsQqTtAaZz]|[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?/g);
        if (!tokens) return null;

        let i = 0;
        while (i < tokens.length) {
          const t = tokens[i];
          if (/^[MmLlHhVvCcSsQqTtAaZz]$/.test(t)) {
            const cmd = t;
            const isRelative = cmd === cmd.toLowerCase();
            switch (cmd.toUpperCase()) {
              case 'M': case 'L': {
                // M/L: x,y 对
                if (i + 2 < tokens.length) {
                  const x = parseFloat(tokens[i + 1]);
                  const y = parseFloat(tokens[i + 2]);
                  if (isRelative) { cx += x; cy += y; } else { cx = x; cy = y; }
                  points.push([cx, cy]);
                  i += 3;
                  // 后续的连续 x,y 对（隐式 L）
                  while (i + 1 < tokens.length && !/^[MmLlHhVvCcSsQqTtAaZz]$/.test(tokens[i])) {
                    const nx = parseFloat(tokens[i]);
                    const ny = parseFloat(tokens[i + 1]);
                    if (isRelative) { cx += nx; cy += ny; } else { cx = nx; cy = ny; }
                    points.push([cx, cy]);
                    i += 2;
                  }
                } else { i++; }
                break;
              }
              case 'H': {
                // H: 水平直线
                if (i + 1 < tokens.length) {
                  const v = parseFloat(tokens[i + 1]);
                  if (isRelative) { cx += v; } else { cx = v; }
                  points.push([cx, cy]);
                  i += 2;
                } else { i++; }
                break;
              }
              case 'V': {
                // V: 垂直直线
                if (i + 1 < tokens.length) {
                  const v = parseFloat(tokens[i + 1]);
                  if (isRelative) { cy += v; } else { cy = v; }
                  points.push([cx, cy]);
                  i += 2;
                } else { i++; }
                break;
              }
              case 'C': {
                // C: 3 对坐标（控制点1+控制点2+终点）
                if (i + 6 < tokens.length) {
                  for (let k = 0; k < 3; k++) {
                    const x = parseFloat(tokens[i + 1 + k * 2]);
                    const y = parseFloat(tokens[i + 2 + k * 2]);
                    let px, py;
                    if (isRelative) { px = cx + x; py = cy + y; } else { px = x; py = y; }
                    points.push([px, py]);
                  }
                  cx = points[points.length - 1][0];
                  cy = points[points.length - 1][1];
                  i += 7;
                } else { i++; }
                break;
              }
              case 'S': {
                // S: 2 对坐标（控制点2+终点）
                if (i + 4 < tokens.length) {
                  for (let k = 0; k < 2; k++) {
                    const x = parseFloat(tokens[i + 1 + k * 2]);
                    const y = parseFloat(tokens[i + 2 + k * 2]);
                    let px, py;
                    if (isRelative) { px = cx + x; py = cy + y; } else { px = x; py = y; }
                    points.push([px, py]);
                  }
                  cx = points[points.length - 1][0];
                  cy = points[points.length - 1][1];
                  i += 5;
                } else { i++; }
                break;
              }
              case 'Q': {
                // Q: 2 对坐标（控制点+终点）
                if (i + 4 < tokens.length) {
                  for (let k = 0; k < 2; k++) {
                    const x = parseFloat(tokens[i + 1 + k * 2]);
                    const y = parseFloat(tokens[i + 2 + k * 2]);
                    let px, py;
                    if (isRelative) { px = cx + x; py = cy + y; } else { px = x; py = y; }
                    points.push([px, py]);
                  }
                  cx = points[points.length - 1][0];
                  cy = points[points.length - 1][1];
                  i += 5;
                } else { i++; }
                break;
              }
              case 'T': {
                // T: 1 对坐标（终点）
                if (i + 2 < tokens.length) {
                  const x = parseFloat(tokens[i + 1]);
                  const y = parseFloat(tokens[i + 2]);
                  if (isRelative) { cx += x; cy += y; } else { cx = x; cy = y; }
                  points.push([cx, cy]);
                  i += 3;
                } else { i++; }
                break;
              }
              case 'Z': {
                i++;
                break;
              }
              case 'A': {
                // A: rx,ry,x-rotation,large-arc, sweep, x,y
                if (i + 7 < tokens.length) {
                  const x = parseFloat(tokens[i + 6]);
                  const y = parseFloat(tokens[i + 7]);
                  if (isRelative) { cx += x; cy += y; } else { cx = x; cy = y; }
                  points.push([cx, cy]);
                  i += 8;
                } else { i++; }
                break;
              }
              default:
                i++;
            }
          } else {
            // 可能是隐式 M 后的坐标
            const x = parseFloat(t);
            const y = parseFloat(tokens[i + 1]);
            if (isFinite(x) && isFinite(y)) {
              cx = x; cy = y;
              points.push([cx, cy]);
              i += 2;
            } else {
              i++;
            }
          }
        }

        if (points.length < 2) return null;

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (const [px, py] of points) {
          minX = Math.min(minX, px);
          minY = Math.min(minY, py);
          maxX = Math.max(maxX, px);
          maxY = Math.max(maxY, py);
        }

        const w = maxX - minX;
        const h = maxY - minY;
        return { minX, minY, maxX, maxY, area: w * h };
      } catch (_) {
        return null;
      }
    }

    zoomToFit() {
      if (!this.currentMapData) return;
      const v = this.currentMapData.view;
      this.view = { x: v.x, y: v.y, w: v.w, h: v.h };
      this._clampView();
      this._dirty = true;
      this._requestDraw();
    }

    zoomBy(factor, cxWorld, cyWorld) {
      if (!this.currentMapData) return;
      cxWorld = cxWorld ?? (this.view.x + this.view.w / 2);
      cyWorld = cyWorld ?? (this.view.y + this.view.h / 2);
      let nw = this.view.w / factor;
      let nh = this.view.h / factor;
      const maxW = this.view.w * 3;
      const maxH = this.view.h * 3;
      const minW = this.view.w / 8;
      const minH = this.view.h / 8;
      nw = Math.max(minW, Math.min(maxW, nw));
      nh = Math.max(minH, Math.min(maxH, nh));
      const rx = (cxWorld - this.view.x) / this.view.w;
      const ry = (cyWorld - this.view.y) / this.view.h;
      this.view.w = nw; this.view.h = nh;
      this.view.x = cxWorld - rx * nw;
      this.view.y = cyWorld - ry * nh;
      this._dirty = true;
      this._requestDraw();
    }

    panBy(dx, dy) {
      const { w, h } = this.view;
      const rect = this._getCssRect();
      if (!rect || rect.width === 0 || rect.height === 0) return;
      this.view.x -= (dx / rect.width) * w;
      this.view.y -= (dy / rect.height) * h;
      this._dirty = true;
      this._requestDraw();
    }

    selectFeature(id) {
      this.selectId = id;
      this._dirty = true;
      this._requestDraw();
    }

    on(evt, cb) { (this._listeners[evt] = this._listeners[evt] || []).push(cb); return this; }
    off(evt, cb) {
      const arr = this._listeners[evt]; if (!arr) return;
      const i = arr.indexOf(cb); if (i >= 0) arr.splice(i, 1);
    }
    _fire(evt, data) {
      const arr = this._listeners[evt];
      if (arr) for (const cb of arr.slice()) { try { cb(data, this); } catch (_) {} }
    }

    _bindPointer() {
      const cvs = this.canvas;
      let dragging = false, startX = 0, startY = 0, moved = false;

      cvs.addEventListener('mousedown', (e) => {
        dragging = true; moved = false;
        startX = e.clientX; startY = e.clientY;
      });
      window.addEventListener('mousemove', (e) => {
        const rect = this._getCssRect();
        if (!rect) return;
        if (dragging) {
          const dx = e.clientX - startX, dy = e.clientY - startY;
          if (Math.abs(dx) + Math.abs(dy) > 4) moved = true;
          this.panBy(dx, dy);
          startX = e.clientX; startY = e.clientY;
        } else {
          const lx = e.clientX - rect.left, ly = e.clientY - rect.top;
          const hit = this._hitTest(lx, ly);
          if (hit !== this.hoverId) {
            this.hoverId = hit;
            this._dirty = true;
            this._requestDraw();
            if (hit) {
              const f = this.featureIndex.get(hit);
              this._fire('hover', { feature: f, x: e.clientX, y: e.clientY });
            } else {
              this._fire('hoverout', null);
            }
          }
        }
      });
      window.addEventListener('mouseup', (e) => {
        if (dragging && !moved) {
          const rect = this._getCssRect();
          if (rect) {
            const lx = e.clientX - rect.left, ly = e.clientY - rect.top;
            const hit = this._hitTest(lx, ly);
            this.selectId = hit;
            this._dirty = true;
            this._requestDraw();
            if (hit) {
              const f = this.featureIndex.get(hit);
              this._fire('click', { feature: f, originalEvent: e });
            }
          }
        }
        dragging = false;
      });

      cvs.addEventListener('wheel', (e) => {
        e.preventDefault();
        const rect = this._getCssRect();
        if (!rect) return;
        const lx = e.clientX - rect.left, ly = e.clientY - rect.top;
        const wc = this._screenToWorld(lx, ly);
        const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
        this.zoomBy(factor, wc[0], wc[1]);
      }, { passive: false });

      let touch0 = null, pinchDist = 0;
      cvs.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          const t = e.touches[0];
          touch0 = { x: t.clientX, y: t.clientY };
          dragging = true; moved = false;
          startX = t.clientX; startY = t.clientY;
        } else if (e.touches.length === 2) {
          const dx = e.touches[0].clientX - e.touches[1].clientX;
          const dy = e.touches[0].clientY - e.touches[1].clientY;
          pinchDist = Math.hypot(dx, dy);
        }
      }, { passive: true });
      cvs.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1 && dragging) {
          const t = e.touches[0];
          const dx = t.clientX - startX, dy = t.clientY - startY;
          if (Math.abs(dx) + Math.abs(dy) > 4) moved = true;
          this.panBy(dx, dy);
          startX = t.clientX; startY = t.clientY;
        } else if (e.touches.length === 2) {
          const dx = e.touches[0].clientX - e.touches[1].clientX;
          const dy = e.touches[0].clientY - e.touches[1].clientY;
          const d = Math.hypot(dx, dy);
          if (pinchDist > 0) {
            const rect = this._getCssRect();
            if (rect) {
              const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
              const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;
              const wc = this._screenToWorld(cx, cy);
              this.zoomBy(d / pinchDist, wc[0], wc[1]);
            }
          }
          pinchDist = d;
        }
      }, { passive: true });
      cvs.addEventListener('touchend', () => {
        if (touch0 && !moved) {
          const rect = this._getCssRect();
          if (rect) {
            const lx = touch0.x - rect.left, ly = touch0.y - rect.top;
            const hit = this._hitTest(lx, ly);
            this.selectId = hit;
            this._dirty = true;
            this._requestDraw();
            if (hit) {
              const f = this.featureIndex.get(hit);
              this._fire('click', { feature: f });
            }
          }
        }
        touch0 = null; dragging = false; pinchDist = 0;
      });
    }

    _getCssRect() {
      try { return this.canvas.getBoundingClientRect(); } catch (_) { return null; }
    }

    _screenToWorld(sx, sy) {
      const r = this._getCssRect(); if (!r) return [0, 0];
      const dpr = Math.min(window.devicePixelRatio || 1, this.options.dprMax);
      const scale = this._renderScale || 1;
      const offX = this._renderOffsetX || 0;
      const offY = this._renderOffsetY || 0;
      const pxX = sx * dpr;
      const pxY = sy * dpr;
      return [
        (pxX - offX) / scale,
        (pxY - offY) / scale
      ];
    }

    _hitTest(sx, sy) {
      if (!this.currentMapData) return null;
      const wc = this._screenToWorld(sx, sy);
      const ctx = this.ctx;
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      for (const [cid, path] of this.pathCache) {
        if (ctx.isPointInPath(path, wc[0], wc[1])) {
          ctx.restore();
          return cid;
        }
      }
      ctx.restore();
      return null;
    }

    _renderLabels(ctx) {
      if (!this.currentMapData || !this._labelCache) return;

      const cssW = this._cssW || this.canvas.width;
      const cssH = this._cssH || this.canvas.height;
      const scale = this._renderScale || 1;
      if (!scale) return;

      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // 基础字体大小（CSS像素）：根据屏幕尺寸动态调整
      const baseSizeCss = Math.min(cssW, cssH) * 0.028;

      for (const [cid, pos] of Object.entries(this._labelCache)) {
        let name = null;
        const feature = this.featureIndex.get(cid);
        // 优先使用数据文件的 zh 字段（繁简转换），fallback 到简体映射
        if (feature && feature.zh) {
          name = this._toSimplified(feature.zh);
        } else {
          name = this._getCountryName(cid);
        }
        if (!name) continue;

        // 跳过太小的国家
        const area = pos.area || 0;
        if (area < 500) continue;

        // 根据国家面积和名字长度计算CSS像素下的字体大小
        const charLen = name.length;
        const charFactor = Math.max(0.55, 1.0 - (charLen - 2) * 0.1);
        const areaFactor = Math.sqrt(Math.min(area / 30000, 2.5));
        const fontSizeCss = Math.max(7, Math.min(28, baseSizeCss * areaFactor * charFactor));

        // 转换为世界坐标字体大小
        const fontSizeWorld = fontSizeCss / scale;

        ctx.font = `bold ${fontSizeWorld}px 'PingFang SC', 'Microsoft YaHei', sans-serif`;

        // 检查标签是否在可见区域内
        if (pos.x < this.view.x || pos.x > this.view.x + this.view.w ||
            pos.y < this.view.y || pos.y > this.view.y + this.view.h) continue;

        const strokeW = Math.max(0.5, fontSizeWorld * 0.18);
        ctx.lineWidth = strokeW;
        ctx.strokeStyle = 'rgba(0,0,0,0.9)';
        ctx.fillStyle = '#ffffff';

        // 超过6字换行显示
        if (name.length > 6) {
          const mid = Math.ceil(name.length / 2);
          const line1 = name.substring(0, mid);
          const line2 = name.substring(mid);
          const lineH = fontSizeWorld * 0.9;
          ctx.strokeText(line1, pos.x, pos.y - lineH);
          ctx.fillText(line1, pos.x, pos.y - lineH);
          ctx.strokeText(line2, pos.x, pos.y + lineH);
          ctx.fillText(line2, pos.x, pos.y + lineH);
        } else {
          ctx.strokeText(name, pos.x, pos.y);
          ctx.fillText(name, pos.x, pos.y);
        }
      }

      ctx.restore();
    }

    _toSimplified(text) {
      if (!text) return text;
      if (!this._t2sMap) {
        this._t2sMap = {
          '國':'国','東':'东','車':'车','馬':'马','義':'义','專':'专','轄':'辖','區':'区',
          '總':'总','督':'督','條':'条','約':'约','黨':'党','衛':'卫','軍':'军','騎':'骑',
          '士':'士','團':'团','聯':'联','合':'合','王':'王','愛':'爱','爾':'尔','蘭':'兰',
          '大':'大','日':'日','耳':'耳','曼':'曼','法':'法','蘭':'兰','西':'西','丹':'丹',
          '麥':'麦','挪':'挪','威':'威','斯':'斯','洛':'洛','伐':'伐','克':'克','匈':'匈',
          '牙':'牙','利':'利','羅':'罗','馬':'马','尼':'尼','亞':'亚','塞':'塞','維':'维',
          '保':'保','加':'加','里':'里','烏':'乌','克':'克','蘭':'兰','東':'东','方':'方',
          '莫':'莫','科':'科','高':'高','加':'加','索':'索','克':'克','里':'里','米':'米',
          '尼':'尼','德':'德','尼':'尼','蘭':'兰','義':'义','大':'大','利':'利','伊':'伊',
          '比':'比','亞':'亚','埃':'埃','及':'及','土':'土','耳':'耳','其':'其','摩':'摩',
          '蘇':'苏','門':'门','叙':'叙','利':'利','亞':'亚','伊':'伊','拉':'拉','克':'克',
          '黎':'黎','凡':'凡','特':'特','阿':'阿','爾':'尔','及':'及','利':'利','亞':'亚',
          '西':'西','班':'班','牙':'牙','葡':'葡','萄':'萄','牙':'牙','瑞':'瑞','士':'士',
          '典':'典','挪':'挪','威':'威','瑞':'瑞','典':'典','芬':'芬','蘭':'兰','波':'波',
          '蘭':'兰','捷':'捷','克':'克','斯':'斯','洛':'洛','伐':'伐','克':'克','奧':'奥',
          '地':'地','利':'利','匈':'匈','牙':'牙','利':'利','羅':'罗','馬':'马','尼':'尼',
          '亞':'亚','保':'保','加':'加','里':'里','亞':'亚','塞':'塞','爾':'尔','維':'维',
          '亞':'亚','克':'克','羅':'罗','地':'地','亞':'亚','黑':'黑','山':'山','希':'希',
          '臘':'腊','阿':'阿','爾':'尔','巴':'巴','尼':'尼','亞':'亚','馬':'马','其':'其',
          '頓':'顿','科':'科','索':'索','沃':'沃','波':'波','斯':'斯','尼':'尼','亞':'亚',
          '哥':'哥','倫':'伦','比':'比','亞':'亚','委':'委','內':'内','瑞':'瑞','拉':'拉',
          '厄':'厄','瓜':'瓜','多':'多','爾':'尔','玻':'玻','利':'利','維':'维','亞':'亚',
          '巴':'巴','拉':'拉','圭':'圭','烏':'乌','拉':'拉','圭':'圭','智':'智','利':'利',
          '阿':'阿','根':'根','廷':'廷','巴':'巴','西':'西','秘':'秘','魯':'鲁','墨':'墨',
          '西':'西','哥':'哥','美':'美','國':'国','加':'加','拿':'拿','大':'大','古':'古',
          '巴':'巴','海':'海','地':'地','多':'多','米':'米','尼':'尼','加':'加','喀':'喀',
          '麥':'麦','隆':'隆','剛':'刚','果':'果','蘇':'苏','丹':'丹','索':'索','馬':'马',
          '里':'里','南':'南','非':'非','洲':'洲','澳':'澳','大':'大','利':'利','亞':'亚',
          '紐':'纽','西':'西','蘭':'兰','印':'印','度':'度','尼':'尼','西':'西','亞':'亚',
          '菲':'菲','律':'律','賓':'宾','越':'越','南':'南','寮':'寮','國':'国','柬':'柬',
          '埔':'埔','寨':'寨','緬':'缅','甸':'甸','泰':'泰','國':'国','馬':'马','來':'来',
          '亞':'亚','不':'不','丹':'丹','尼':'尼','泊':'泊','爾':'尔','巴':'巴','基':'基',
          '斯':'斯','坦':'坦','阿':'阿','富':'富','汗':'汗','伊':'伊','朗':'朗','沙':'沙',
          '烏':'乌','地':'地','阿':'阿','拉':'拉','伯':'伯','葉':'叶','門':'门','阿':'阿',
          '曼':'曼','科':'科','威':'威','特':'特','卡':'卡','塔':'塔','爾':'尔','巴':'巴',
          '林':'林','阿':'阿','聯':'联','酋':'酋','長':'长','以':'以','色':'色','列':'列',
          '巴':'巴','勒':'勒','斯':'斯','坦':'坦','塞':'塞','浦':'浦','路':'路','斯':'斯',
          '馬':'马','耳':'耳','他':'他','梵':'梵','蒂':'蒂','岡':'冈','摩':'摩','納':'纳',
          '哥':'哥','安':'安','道':'道','爾':'尔','聖':'圣','馬':'马','利':'利','諾':'诺',
          '列':'列','支':'支','敦':'敦','士':'士','登':'登','冰':'冰','島':'岛','格':'格',
          '陵':'陵','蘭':'兰','法':'法','羅':'罗','群':'群','島':'岛','海':'海','峽':'峡',
          '群':'群','島':'岛','直':'直','布':'布','羅':'罗','陀':'陀','紐':'纽','芬':'芬',
          '蘭':'兰','拉':'拉','布':'布','拉':'拉','多':'多','爾':'尔'
        };
      }
      let result = '';
      for (const ch of text) {
        result += this._t2sMap[ch] || ch;
      }
      return result;
    }

    _getCountryName(id) {
      const zhMap = this._getZhNameMap();
      return zhMap[id] || id;
    }

    _getZhNameMap() {
      if (this._zhNameMap) return this._zhNameMap;
      this._zhNameMap = {
        germany: '德国', german_empire: '德意志帝国', weimar: '魏玛共和国',
        uk: '英国', britain: '英国', england: '英格兰', scotland: '苏格兰', wales: '威尔士',
        france: '法国', free_france: '自由法国', vichy: '维希法国',
        burgundy: '勃艮第', burgundy_knights: '勃艮第骑士团国',
        spain: '西班牙', iberia: '伊比利亚',
        italy: '意大利', italian_empire: '意大利帝国',
        japan: '日本', japanese_empire: '大日本帝国',
        manchuria: '满洲国', manchu: '满洲国',
        china: '中国', prc: '中华人民共和国', roc: '中华民国',
        usa: '美国', united_states: '美利坚合众国', america: '美国',
        canada: '加拿大',
        mexico: '墨西哥',
        brazil: '巴西',
        argentina: '阿根廷',
        chile: '智利',
        peru: '秘鲁',
        colombia: '哥伦比亚',
        venezuela: '委内瑞拉',
        ecuador: '厄瓜多尔',
        bolivia: '玻利维亚',
        paraguay: '巴拉圭',
        uruguay: '乌拉圭',
        cuba: '古巴',
        panama: '巴拿马',
        thailand: '泰国',
        vietnam: '越南',
        laos: '老挝',
        cambodia: '柬埔寨',
        burma: '缅甸',
        malaya: '马来亚',
        indonesia: '印度尼西亚',
        philippines: '菲律宾',
        korea: '朝鲜', south_korea: '韩国', north_korea: '朝鲜',
        india: '印度',
        pakistan: '巴基斯坦',
        nepal: '尼泊尔',
        bhutan: '不丹',
        sri_lanka: '斯里兰卡',
        bangladesh: '孟加拉',
        afghanistan: '阿富汗',
        iran: '伊朗', persia: '波斯',
        iraq: '伊拉克',
        syria: '叙利亚',
        jordan: '约旦',
        saudi: '沙特阿拉伯',
        yemen: '也门',
        oman: '阿曼',
        kuwait: '科威特',
        qatar: '卡塔尔',
        bahrain: '巴林',
        uae: '阿联酋',
        israel: '以色列', palestine: '巴勒斯坦',
        egypt: '埃及',
        libya: '利比亚',
        tunisia: '突尼斯',
        algeria: '阿尔及利亚',
        morocco: '摩洛哥',
        ethiopia: '埃塞俄比亚',
        kenya: '肯尼亚',
        tanzania: '坦桑尼亚',
        congo: '刚果',
        nigeria: '尼日利亚',
        ghana: '加纳',
        south_africa: '南非',
        namibia: '纳米比亚',
        angola: '安哥拉',
        mozambique: '莫桑比克',
        madagascar: '马达加斯加',
        russia: '俄罗斯', ussr: '苏联', soviet: '苏维埃',
        moscow: '莫斯科',
        leningrad: '列宁格勒',
        stalingrad: '斯大林格勒',
        ukraine: '乌克兰',
        belarus: '白俄罗斯',
        lithuania: '立陶宛',
        latvia: '拉脱维亚',
        estonia: '爱沙尼亚',
        poland: '波兰',
        czechoslovakia: '捷克斯洛伐克', czechia: '捷克',
        slovakia: '斯洛伐克',
        hungary: '匈牙利',
        romania: '罗马尼亚',
        bulgaria: '保加利亚',
        yugoslavia: '南斯拉夫',
        serbia: '塞尔维亚',
        croatia: '克罗地亚',
        slovenia: '斯洛文尼亚',
        bosnia: '波斯尼亚',
        greece: '希腊',
        albania: '阿尔巴尼亚',
        ottoman: '奥斯曼帝国',
        turkey: '土耳其',
        finland: '芬兰',
        sweden: '瑞典',
        norway: '挪威',
        denmark: '丹麦',
        iceland: '冰岛',
        netherlands: '荷兰', holland: '荷兰',
        belgium: '比利时',
        luxembourg: '卢森堡',
        switzerland: '瑞士',
        austria: '奥地利',
        germany_empire: '德意志帝国',
        ostland: '奥斯特兰',
        reichskommissariat_ukraine: '乌克兰专员辖区',
        reichskommissariat_moscow: '莫斯科专员辖区',
        reichskommissariat_caucasus: '高加索专员辖区',
        reichskommissariat_belarus: '白俄罗斯专员辖区',
        italian_social_republic: '意大利社会共和国',
        montenegro: '黑山',
        macedonia: '马其顿',
        kosovo: '科索沃',
        australia: '澳大利亚',
        new_zealand: '新西兰',
        papua_new_guinea: '巴布亚新几内亚',
        south_africa: '南非联邦',
        rhodesia: '罗得西亚',
        zimbabwe: '津巴布韦',
        mozambique: '莫桑比克',
        angola: '安哥拉',
        zaire: '扎伊尔',
        ethiopia: '埃塞俄比亚',
        liberia: '利比里亚',
        sierra_leone: '塞拉利昂',
        ivory_coast: '科特迪瓦',
        niger: '尼日尔',
        senegal: '塞内加尔',
        mali: '马里',
        upper_volta: '上沃尔特',
        guinea: '几内亚',
        cameroon: '喀麦隆',
        gabon: '加蓬',
        congo_brazzaville: '刚果(布)',
        central_african_republic: '中非共和国',
        sudan: '苏丹',
        south_sudan: '南苏丹',
        somalia: '索马里',
        eritrea: '厄立特里亚',
        uganda: '乌干达',
        rwanda: '卢旺达',
        burundi: '布隆迪',
        tanzania: '坦桑尼亚',
        kenya: '肯尼亚',
        malawi: '马拉维',
        zambia: '赞比亚',
        zimbabwe: '津巴布韦',
        botswana: '博茨瓦纳',
        lesotho: '莱索托',
        swaziland: '斯威士兰',
        namibia: '纳米比亚',
        south_africa: '南非',
        newfoundland: '纽芬兰',
        labrador: '拉布拉多',
        greenland: '格陵兰',
        faroe_islands: '法罗群岛',
        channel_islands: '海峡群岛',
        gibraltar: '直布罗陀',
        malta: '马耳他',
        cyprus: '塞浦路斯',
        luxembourg: '卢森堡',
        monaco: '摩纳哥',
        andorra: '安道尔',
        san_marino: '圣马力诺',
        liechtenstein: '列支敦士登',
        vatican: '梵蒂冈',
        ecuador: '厄瓜多尔',
        colombia: '哥伦比亚',
        venezuela: '委内瑞拉',
        guyana: '圭亚那',
        suriname: '苏里南',
        french_guiana: '法属圭亚那',
        brazil: '巴西',
        peru: '秘鲁',
        bolivia: '玻利维亚',
        paraguay: '巴拉圭',
        uruguay: '乌拉圭',
        argentina: '阿根廷',
        chile: '智利',
        cuba: '古巴',
        jamaica: '牙买加',
        haiti: '海地',
        dominican_republic: '多米尼加',
        puerto_rico: '波多黎各',
        bahamas: '巴哈马',
        trinidad: '特立尼达',
        barbados: '巴巴多斯',
        martinique: '马提尼克',
        guadeloupe: '瓜德罗普',
        st_lucia: '圣卢西亚',
        st_vincent: '圣文森特',
        grenada: '格林纳达',
        antigua: '安提瓜',
        dominica: '多米尼克',
        st_kitts: '圣基茨',
        nevis: '尼维斯',
        anguilla: '安圭拉',
        montserrat: '蒙特塞拉特',
        british_virgin_islands: '英属维尔京群岛',
        us_virgin_islands: '美属维尔京群岛',
        cayman_islands: '开曼群岛',
        turks_and_caicos: '特克斯和凯科斯群岛',
        belize: '伯利兹',
        costa_rica: '哥斯达黎加',
        panama: '巴拿马',
        guatemala: '危地马拉',
        honduras: '洪都拉斯',
        el_salvador: '萨尔瓦多',
        nicaragua: '尼加拉瓜',
        caribbean: '加勒比',
        bahamas: '巴哈马',
        cuba: '古巴',
        jamaica: '牙买加',
        haiti: '海地',
        dominican: '多米尼加',
        puerto_rico: '波多黎各',
        trinidad_and_tobago: '特立尼达和多巴哥',
        barbados: '巴巴多斯',
        guyana: '圭亚那',
        suriname: '苏里南',
        french_guiana: '法属圭亚那',
    };
    return this._zhNameMap;
  }

  _clampView() {
      if (!this.currentMapData) return;
      const v = this.currentMapData.view;
      if (this.view.w > v.w * 4) this.view.w = v.w * 4;
      if (this.view.h > v.h * 4) this.view.h = v.h * 4;
      if (this.view.w < v.w / 10) this.view.w = v.w / 10;
      if (this.view.h < v.h / 10) this.view.h = v.h / 10;
      if (this.view.x < -this.view.w * 0.3) this.view.x = -this.view.w * 0.3;
      if (this.view.y < -this.view.h * 0.3) this.view.y = -this.view.h * 0.3;
      if (this.view.x + this.view.w > v.w + this.view.w * 0.3)
        this.view.x = v.w + this.view.w * 0.3 - this.view.w;
      if (this.view.y + this.view.h > v.h + this.view.h * 0.3)
        this.view.y = v.h + this.view.h * 0.3 - this.view.h;
    }

    _requestDraw() {
      if (this._animId != null) return;
      this._animId = requestAnimationFrame(() => {
        this._animId = null;
        if (this._dirty) this._draw();
      });
    }

    _draw() {
      const ctx = this.ctx;
      let rect = this._getCssRect();
      if (!rect || rect.width === 0 || rect.height === 0) {
        const cw = (this.canvas && (this.canvas.clientWidth || this.canvas.offsetWidth)) || 0;
        const ch = (this.canvas && (this.canvas.clientHeight || this.canvas.offsetHeight)) || 0;
        const parent = this.canvas && this.canvas.parentElement;
        const pw = parent && (parent.clientWidth || parent.offsetWidth) || 0;
        const ph = parent && (parent.clientHeight || parent.offsetHeight) || 0;
        const w = cw || pw;
        const h = ch || ph || (w ? Math.round(w * 0.56) : 0);
        if (w && h) {
          rect = { width: w, height: h, top: 0, left: 0, bottom: h, right: w };
        } else {
          this._dirty = true;
          if (typeof setTimeout !== 'undefined') setTimeout(() => this._requestDraw(), 500);
          return;
        }
      }

      const dpr = Math.min(window.devicePixelRatio || 1, this.options.dprMax);
      const cssW = Math.max(1, Math.floor(rect.width));
      const cssH = Math.max(1, Math.floor(rect.height));
      const targetW = cssW * dpr;
      const targetH = cssH * dpr;
      this._cssW = cssW;
      this._cssH = cssH;
      this._dpr = dpr;
      if (this.canvas.width !== targetW || this.canvas.height !== targetH) {
        this.canvas.width = targetW;
        this.canvas.height = targetH;
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = this.options.bgColor;
      ctx.fillRect(0, 0, targetW, targetH);

      const mapAspect = this.view.w / this.view.h;
      const canvasAspect = targetW / targetH;
      let scale, offsetX, offsetY;

      if (canvasAspect > mapAspect) {
        scale = targetH / this.view.h;
        offsetX = (targetW - this.view.w * scale) / 2;
        offsetY = 0;
      } else {
        scale = targetW / this.view.w;
        offsetX = 0;
        offsetY = (targetH - this.view.h * scale) / 2;
      }
      this._renderScale = scale;
      this._renderOffsetX = offsetX;
      this._renderOffsetY = offsetY;

      ctx.setTransform(scale, 0, 0, scale,
        offsetX - this.view.x * scale,
        offsetY - this.view.y * scale);

      if (!this.currentMapData) {
        ctx.fillStyle = this.options.oceanColor;
        ctx.fillRect(this.view.x, this.view.y, this.view.w, this.view.h);
        ctx.fillStyle = '#555';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('选择地图...', this.view.x + this.view.w / 2, this.view.y + this.view.h / 2);
        this._dirty = false;
        return;
      }

      ctx.fillStyle = this.options.oceanColor;
      ctx.fillRect(this.view.x - 1000, this.view.y - 1000,
                   this.view.w + 2000, this.view.h + 2000);

      for (const [cid, path] of this.pathCache) {
        const colors = getFactionColor(cid);
        ctx.fillStyle = colors.fill;
        ctx.fill(path);
      }

      ctx.lineWidth = 0.5;
      ctx.strokeStyle = this.options.borderColor;
      for (const [cid, path] of this.pathCache) {
        ctx.stroke(path);
      }

      // 渲染国家名称文字标签
      this._renderLabels(ctx);

      const drawHighlight = (id, color, width) => {
        if (!id) return;
        const p = this.pathCache.get(id);
        if (!p) return;
        ctx.save();
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        ctx.stroke(p);
        ctx.restore();
      };
      drawHighlight(this.hoverId, this.options.hoverStroke, 2);
      drawHighlight(this.selectId, this.options.selectStroke, 3);

      this._dirty = false;
    }

    destroy() {
      this._destroyed = true;
      if (this._resizeOb) { try { this._resizeOb.disconnect(); } catch (_) {} }
      if (this._onWinResize) {
        window.removeEventListener('resize', this._onWinResize);
        window.removeEventListener('orientationchange', this._onWinResize);
      }
      this.pathCache.clear();
      this.featureIndex.clear();
    }

    static getMapNames() { return MAP_NAMES; }
  }

  SVGMap.getFactionColor = getFactionColor;
  SVGMap.MAP_NAMES = MAP_NAMES;

  return SVGMap;
});



/* ============================================================
 * SVGMap v2 升级补丁 (图层系统 + 动态着色 + 离屏缓存 + 标签分级
 *  + 双击缩放 + Hatch内战样式 + 颜色过渡动画 + Dev调试模式)
 * 与原版 API 100% 向后兼容
 * ============================================================ */
(function _extendSVGMap(root) {
  if (!root.SVGMap || !root.SVGMap.prototype) return;
  const SVGMap = root.SVGMap;
  const proto = SVGMap.prototype;

  /* ----- 着色模式枚举 ----- */
  SVGMap.COLOR_MODES = {
    FACTION:   'faction',    // 阵营颜色 (现有默认)
    STABILITY: 'stability',  // 稳定度 绿→黄→红
    TENSION:   'tension',    // 紧张度/前线 白→橙→红
    HOTSPOT:   'hotspot',    // 事件热点 闪烁边框
    RUSSIA:    'russia'      // 俄罗斯统一进度 渐变
  };

  // -------- 构造函数钩子: 在 constructor 末尾自动注入(通过属性访问) --------
  const _origIngest = proto._ingestMapData;
  proto._ingestMapData = function (mapId, data) {
    _origIngest.call(this, mapId, data);
    // v2 字段初始化
    this.layers = this.layers || {};           // {layerId: {loaded, on, data, rendered: Canvas}}
    this.activeLayers = this.activeLayers || new Set(); // 已加载且开启的
    this.layerIndex = this.layerIndex || null;   // 图层索引
    this.colorMode = this.colorMode || SVGMap.COLOR_MODES.FACTION;
    this.regionStateProvider = this.regionStateProvider || null; // fn(regionId)->RegionState
    this.colorCache = this.colorCache || new Map(); // regionId -> {fill, targetFill, startFill, t, startTime}
    this.regionFlags = this.regionFlags || new Map();   // regionId -> {civilWar, hotspot, etc}
    this.hotspots = this.hotspots || new Set();   // 热点regionId
    this.lastViews = this.lastViews || {};        // mapId -> 上次 view
    this.labelZoomThreshold = this.labelZoomThreshold || { // 缩放下显示标签
      tiny: 0.0,    // 面积<500: 不显示
      small: 1.8,   // 500-3000: >1.8x 显示
      medium: 1.3,  // 3000-10000: >1.3x 显示
      large: 0.0    // >10000: 始终显示
    };
    this.labelMinZoom = this.labelMinZoom || 0.5; // 低于0.5x 不显示任何标签(减少绘制)
    this.devMode = this.devMode || false;
    this._hatchPattern = null;     // 内战斜线 pattern cache (按scale生成)
    this._offscreen = null;        // 离屏 canvas cache
    this._offscreenKey = null;     // 离屏有效时的 key (mapId+view+scale+mode+flags)
    this._pulseElapsed = 0;        // 热点脉冲计时
    // 恢复上一次该地图的视角
    if (this.lastViews[mapId]) {
      const v = this.lastViews[mapId];
      this.view = { x: v.x, y: v.y, w: v.w, h: v.h };
      this._clampView();
    }
  };

  /* -------- P0: 图层系统 -------- */
  proto.loadLayerIndex = async function () {
    if (this.layerIndex) return this.layerIndex;
    try {
      const resp = await fetch('data/map_layers/index.json', { cache: 'no-cache' });
      if (!resp.ok) return null;
      this.layerIndex = await resp.json();
      return this.layerIndex;
    } catch (e) { console.warn('[SVGMap] 图层索引加载失败', e.message); return null; }
  };

  proto.loadLayer = async function (layerId) {
    if (!this.layerIndex) await this.loadLayerIndex();
    if (!this.layerIndex || !this.layerIndex.layers[layerId]) return false;
    if (this.layers[layerId] && this.layers[layerId].loaded) return true;
    const meta = this.layerIndex.layers[layerId];
    try {
      const resp = await fetch(meta.file, { cache: 'no-cache' });
      if (!resp.ok) return false;
      const json = await resp.json();
      this.layers[layerId] = {
        loaded: true,
        on: meta.defaultOn,
        meta: json.meta || meta,
        data: json.elements || [],
        offscreen: null  // 离屏渲染缓存
      };
      if (meta.defaultOn) this.activeLayers.add(layerId);
      this._dirty = true;
      this._invalidateOffscreen();
      this._requestDraw();
      return true;
    } catch (e) { console.warn('[SVGMap] 图层加载失败 '+layerId, e.message); return false; }
  };

  proto.loadAllDefaultLayers = async function () {
    const idx = await this.loadLayerIndex();
    if (!idx) return;
    // 默认只加载 defaultOn=true 的图层 (目前只有 cities)
    const toLoad = Object.keys(idx.layers).filter(id => idx.layers[id].defaultOn);
    // 其余图层用户手动点开时加载 (按需)
    await Promise.all(toLoad.map(id => this.loadLayer(id).catch(() => {})));
    this._fire('layersReady', {});
  };

  proto.setLayer = function (layerId, on) {
    const layer = this.layers[layerId];
    if (!layer || !layer.loaded) return false;
    layer.on = !!on;
    if (layer.on) this.activeLayers.add(layerId); else this.activeLayers.delete(layerId);
    this._dirty = true;
    this._invalidateOffscreen();
    this._requestDraw();
    this._fire('layerchange', { layerId, on });
    return true;
  };

  proto.toggleLayer = function (layerId) {
    const layer = this.layers[layerId];
    if (!layer) return null;
    return this.setLayer(layerId, !layer.on);
  };

  proto.getLayerState = function () {
    const s = {};
    if (this.layerIndex) {
      for (const id in this.layerIndex.layers) {
        const l = this.layers[id];
        s[id] = {
          meta: this.layerIndex.layers[id],
          loaded: !!(l && l.loaded),
          on: !!(l && l.on)
        };
      }
    }
    return s;
  };

  /* -------- P1: 动态着色系统 -------- */
  // RegionState = {
  //   controller: 'GER'|'USA'|...,   // 控制者阵营ID
  //   stability: 0-100,             // 稳定度 (0=崩溃, 100=稳如狗)
  //   tension: 0-100,                // 紧张度/前线 (0=和平, 100=战场)
  //   russiaUnifyProgress: 0-100,    // 俄罗斯统一进度
  //   civilWar: true/false,          // 内战样式 (斜线)
  //   hotspot: true/false,           // 事件热点 (脉冲)
  //   faction: 'ger'|'usa'|'jpn'|... // override faction
  // }
  proto.setRegionStateProvider = function (providerFn) {
    this.regionStateProvider = providerFn;
    this.colorCache.clear();
    this._dirty = true;
    this._invalidateOffscreen();
    this._requestDraw();
  };

  proto.setColorMode = function (mode) {
    if (this.colorMode === mode) return;
    this.colorMode = mode;
    this.colorCache.clear();
    this._dirty = true;
    this._invalidateOffscreen();
    this._requestDraw();
    this._fire('colormodechange', { mode });
  };

  proto.getRegionState = function (regionId) {
    try { return (this.regionStateProvider && this.regionStateProvider(regionId)) || null; }
    catch (_) { return null; }
  };

  // 工具: hsl 插值
  function _lerpColor(a, b, t) {
    if (typeof a === 'string') a = _hexToRgb(a);
    if (typeof b === 'string') b = _hexToRgb(b);
    t = Math.max(0, Math.min(1, t));
    const r = Math.round(a.r + (b.r - a.r) * t);
    const g = Math.round(a.g + (b.g - a.g) * t);
    const bl = Math.round(a.b + (b.b - a.b) * t);
    return 'rgb('+r+','+g+','+bl+')';
  }
  function _hexToRgb(c) {
    if (c.startsWith('rgb')) {
      const m = c.match(/\d+/g); if (m) return {r:+m[0],g:+m[1],b:+m[2]};
    }
    const hex = c.replace('#','');
    const n = hex.length === 3 ? hex.split('').map(x=>x+x).join('') : hex;
    return { r: parseInt(n.substring(0,2),16), g: parseInt(n.substring(2,4),16), b: parseInt(n.substring(4,6),16) };
  }
  function _valueToGradient(v, stops) {
    // stops = [{v:0, color:'#f00'}, {v:0.5, color:'#ff0'}, ...]
    v = Math.max(0, Math.min(1, v));
    for (let i = 0; i < stops.length - 1; i++) {
      if (v >= stops[i].v && v <= stops[i+1].v) {
        const t = (v - stops[i].v) / (stops[i+1].v - stops[i].v);
        return _lerpColor(stops[i].color, stops[i+1].color, t);
      }
    }
    return stops[stops.length-1].color;
  }
  SVGMap._lerpColor = _lerpColor;
  SVGMap._valueToGradient = _valueToGradient;

  // 5 种着色模式的颜色返回 {fill, border, pulse?}
  proto._resolveRegionColor = function (regionId, factionColor) {
    const state = this.getRegionState(regionId);
    const baseFill = (factionColor && factionColor.fill) || '#3a4a5a';
    const baseBorder = (factionColor && factionColor.border) || '#1e2a35';
    const result = { fill: baseFill, border: baseBorder };

    if (this.colorMode === SVGMap.COLOR_MODES.STABILITY && state) {
      const v = Math.max(0, Math.min(100, state.stability == null ? 50 : state.stability)) / 100;
      result.fill = _valueToGradient(v, [
        { v: 0.0, color: '#8b1a1a' }, // 崩溃
        { v: 0.3, color: '#b04a1a' }, // 动荡
        { v: 0.6, color: '#a07a1a' }, // 不稳
        { v: 0.85,color: '#3a7a3a' }, // 稳
        { v: 1.0, color: '#1a5a2a' }  // 非常稳
      ]);
      result.border = '#0a0f18';
    } else if (this.colorMode === SVGMap.COLOR_MODES.TENSION && state) {
      const v = Math.max(0, Math.min(100, state.tension == null ? 0 : state.tension)) / 100;
      result.fill = _valueToGradient(v, [
        { v: 0.0, color: '#2a3a4a' },
        { v: 0.4, color: '#7a5a2a' },
        { v: 0.8, color: '#9a3a1a' },
        { v: 1.0, color: '#b01818' }
      ]);
      result.border = v > 0.6 ? '#ff6040' : '#1a1a2a';
    } else if (this.colorMode === SVGMap.COLOR_MODES.RUSSIA && state) {
      const ru = Math.max(0, Math.min(100, state.russiaUnifyProgress == null ? 0 : state.russiaUnifyProgress)) / 100;
      result.fill = _valueToGradient(ru, [
        { v: 0.0, color: '#4a4a5a' }, // 破碎
        { v: 0.4, color: '#5a5a7a' },
        { v: 0.8, color: '#7a5a5a' },
        { v: 1.0, color: '#a83232' }  // 统一
      ]);
    } else if (this.colorMode === SVGMap.COLOR_MODES.HOTSPOT) {
      result.fill = baseFill;
    } else if (state && state.faction) {
      // faction override
      const override = root.SVGMap && root.SVGMap.getFactionColor && root.SVGMap.getFactionColor(state.faction);
      if (override) { result.fill = override.fill; result.border = override.border; }
    } else if (state && state.controller) {
      const ctrl = root.SVGMap && root.SVGMap.getFactionColor && root.SVGMap.getFactionColor(state.controller.toLowerCase());
      if (ctrl) { result.fill = ctrl.fill; result.border = ctrl.border; }
    }

    // 内战: 返回 hatch 属性 (由 draw 阶段处理)
    if (state && state.civilWar) result.civilWar = true;
    // 热点
    if ((state && state.hotspot) || this.hotspots.has(regionId)) result.hotspot = true;

    return result;
  };

  /* -------- P2: 双击缩放 + 跳转 -------- */
  proto.zoomToFeature = function (id, paddingFactor) {
    const data = this.featureIndex.get(id);
    if (!data || !this.pathCache.has(id)) return false;
    paddingFactor = paddingFactor || 0.35;
    // 用 pathCache 的 bbox: 遍历path找extent (用 featureIndex 的标签位置估算，或通过 path2D 用 canvas measure 太麻烦)
    // 用 _labelCache 如果有（中心点+面积）
    const label = this._labelCache && this._labelCache[id];
    if (label) {
      const area = label.area || 1000;
      const halfSize = Math.max(Math.sqrt(area) * (0.7 + paddingFactor), this.view.w * 0.1);
      this.view = {
        x: label.x - halfSize,
        y: label.y - halfSize,
        w: halfSize * 2,
        h: halfSize * 2
      };
    } else {
      const v = this.currentMapData.view;
      this.view = { x: v.x, y: v.y, w: v.w / 3, h: v.h / 3 };
    }
    this._clampView();
    this._dirty = true;
    this._invalidateOffscreen();
    this._requestDraw();
    return true;
  };

  // 在构造完成后调用此方法打双击补丁 (外部调用也可以)
  proto.installDoubleClickZoom = function () {
    if (this._doubleClickInstalled) return;
    this._doubleClickInstalled = true;
    const cvs = this.canvas;
    let lastClickTime = 0, lastClickHit = null;
    const originalHandler = this._bindPointer ? null : null;
    // 我们已经通过事件委托在 mousedown 检测
    const onDown = (e) => {
      const now = Date.now();
      const rect = this._getCssRect();
      if (!rect) return;
      const lx = e.clientX - rect.left, ly = e.clientY - rect.top;
      const hit = this._hitTest(lx, ly);
      if (now - lastClickTime < 350 && hit && lastClickHit === hit) {
        this.zoomToFeature(hit);
        this._fire('dblclick', { feature: this.featureIndex.get(hit), regionId: hit });
        lastClickTime = 0; lastClickHit = null;
      } else {
        lastClickTime = now;
        lastClickHit = hit;
      }
    };
    cvs.addEventListener('mousedown', onDown, true);
    // 移动端: 双击tap
    let lastTap = 0, lastTapHit = null;
    cvs.addEventListener('touchend', (e) => {
      if (e.changedTouches.length !== 1) return;
      const now = Date.now();
      const rect = this._getCssRect(); if (!rect) return;
      const t = e.changedTouches[0];
      const lx = t.clientX - rect.left, ly = t.clientY - rect.top;
      const hit = this._hitTest(lx, ly);
      if (now - lastTap < 400 && hit && lastTapHit === hit) {
        this.zoomToFeature(hit);
        this._fire('dblclick', { feature: this.featureIndex.get(hit), regionId: hit });
        lastTap = 0; lastTapHit = null;
      } else { lastTap = now; lastTapHit = hit; }
    }, { passive: true });
    this._cleanupDCInstall = () => { cvs.removeEventListener('mousedown', onDown, true); };
  };

  /* -------- P3: Hatch 内战斜线 pattern -------- */
  proto._getHatchPattern = function (ctx, scale, fill, border) {
    // 为当前 scale 生成一个斜线 pattern
    const key = scale.toFixed(2) + ':' + fill + ':' + border;
    if (this._hatchPattern && this._hatchPattern.key === key) return this._hatchPattern.pattern;
    const size = Math.max(6, Math.round(10 / scale));
    const off = document.createElement('canvas');
    off.width = off.height = size * 2;
    const octx = off.getContext('2d');
    octx.fillStyle = fill;
    octx.fillRect(0, 0, off.width, off.height);
    octx.strokeStyle = 'rgba(255,80,80,0.55)';
    octx.lineWidth = Math.max(1, size * 0.2);
    for (let i = -off.height; i < off.width + off.height; i += size) {
      octx.beginPath();
      octx.moveTo(i, 0); octx.lineTo(i + off.height, off.height);
      octx.stroke();
    }
    const pattern = ctx.createPattern(off, 'repeat');
    this._hatchPattern = { key, pattern };
    return pattern;
  };

  /* -------- P0/P4: 离屏缓存 + dev模式 -------- */
  proto._invalidateOffscreen = function () { this._offscreenKey = null; };

  proto.setDevMode = function (on) {
    this.devMode = !!on;
    this._dirty = true; this._invalidateOffscreen(); this._requestDraw();
  };

  proto.setHotspot = function (regionId, on) {
    if (on) this.hotspots.add(regionId); else this.hotspots.delete(regionId);
    this._dirty = true; this._invalidateOffscreen(); this._requestDraw();
  };

  proto.setCivilWarRegion = function (regionId, on) {
    if (!this.regionFlags.has(regionId)) this.regionFlags.set(regionId, {});
    const o = this.regionFlags.get(regionId);
    o.civilWar = !!on;
    this._dirty = true; this._invalidateOffscreen(); this._requestDraw();
  };

  /* -------- P0-3: 标签分级缩放显示 + 碰撞避让 + 主_draw升级 -------- */
  proto._renderLabelsV2 = function (ctx, scale) {
    if (!this.currentMapData || !this._labelCache) return;
    const cssW = this._cssW || this.canvas.width;
    const cssH = this._cssH || this.canvas.height;
    if (!scale) return;
    // 标签全部缩放下 (基础CSS尺寸 vs 当前view尺寸) 的缩放比
    // zoomFactor: 1.0 = 原始 fit; >1 = 放大
    if (!this.currentMapData.view) return;
    const fitW = this.currentMapData.view.w;
    const zoomFactor = fitW / this.view.w;

    // 低于最小缩放不画标签（性能保护）
    if (zoomFactor < this.labelMinZoom) return;

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const baseSizeCss = Math.min(cssW, cssH) * 0.028;

    // 收集候选(按面积从大到小) + 按重要性过滤
    const candidates = [];
    for (const [cid, pos] of Object.entries(this._labelCache)) {
      const area = pos.area || 0;
      let level;
      if (area < 500) level = 'tiny';
      else if (area < 3000) level = 'small';
      else if (area < 10000) level = 'medium';
      else level = 'large';
      const minZoom = this.labelZoomThreshold[level] || 0;
      if (zoomFactor < minZoom) continue;           // 标签分级：小的只有放大了才显示
      if (pos.x < this.view.x || pos.x > this.view.x + this.view.w ||
          pos.y < this.view.y || pos.y > this.view.y + this.view.h) continue;
      const feature = this.featureIndex.get(cid);
      let name = null;
      if (feature && feature.zh) name = this._toSimplified(feature.zh);
      else name = this._getCountryName(cid);
      if (!name) continue;
      const charLen = name.length;
      const charFactor = Math.max(0.55, 1.0 - (charLen - 2) * 0.1);
      const areaFactor = Math.sqrt(Math.min(area / 30000, 2.5));
      const fontSizeCss = Math.max(7, Math.min(28, baseSizeCss * areaFactor * charFactor));
      const fontSizeWorld = fontSizeCss / scale;
      candidates.push({
        cid, pos: { x: pos.x, y: pos.y }, name,
        fontSize: fontSizeWorld,
        // 预估屏幕像素尺寸(碰撞检测用), 用字符数估测宽度
        wScreen: fontSizeCss * charLen * 0.75,
        hScreen: fontSizeCss * 1.2,
        area
      });
    }
    // 按面积降序（大的优先画，占用位置，和不重叠保护）
    candidates.sort((a, b) => b.area - a.area);
    const placed = []; // 屏幕矩形集合
    for (const c of candidates) {
      // 转屏幕坐标(左上角) 用于AABB碰撞
      const sx = (c.pos.x - this.view.x) / this.view.w * (this._cssW || this.canvas.width) - c.wScreen / 2;
      const sy = (c.pos.y - this.view.y) / this.view.h * (this._cssH || this.canvas.height) - c.hScreen / 2;
      let ok = true;
      for (const p of placed) {
        if (sx < p.x + p.w && sx + c.wScreen > p.x && sy < p.y + p.h && sy + c.hScreen > p.y) {
          ok = false; break;
        }
      }
      if (!ok) continue;
      placed.push({ x: sx, y: sy, w: c.wScreen, h: c.hScreen });
      // 绘制
      const strokeW = Math.max(0.5, c.fontSize * 0.18);
      ctx.lineWidth = strokeW;
      ctx.strokeStyle = 'rgba(0,0,0,0.9)';
      ctx.font = `bold ${c.fontSize}px 'PingFang SC', 'Microsoft YaHei', sans-serif`;
      if (c.name.length > 6) {
        const mid = Math.ceil(c.name.length / 2);
        const l1 = c.name.substring(0, mid), l2 = c.name.substring(mid);
        const lh = c.fontSize * 0.9;
        ctx.fillStyle = '#ffffff';
        ctx.strokeText(l1, c.pos.x, c.pos.y - lh); ctx.fillText(l1, c.pos.x, c.pos.y - lh);
        ctx.strokeText(l2, c.pos.x, c.pos.y + lh); ctx.fillText(l2, c.pos.x, c.pos.y + lh);
      } else {
        ctx.fillStyle = '#ffffff';
        ctx.strokeText(c.name, c.pos.x, c.pos.y); ctx.fillText(c.name, c.pos.x, c.pos.y);
      }
    }
    ctx.restore();
  };

  /* -------- 升级后的主_draw (先画国家+着色，再画开启的图层，再标签+高亮+dev信息) -------- */
  proto._draw = function () {
    const ctx = this.ctx;
    let rect = this._getCssRect();
    if (!rect || rect.width === 0 || rect.height === 0) {
      const cw = (this.canvas && (this.canvas.clientWidth || this.canvas.offsetWidth)) || 0;
      const ch = (this.canvas && (this.canvas.clientHeight || this.canvas.offsetHeight)) || 0;
      const parent = this.canvas && this.canvas.parentElement;
      const pw = parent && (parent.clientWidth || parent.offsetWidth) || 0;
      const ph = parent && (parent.clientHeight || parent.offsetHeight) || 0;
      const w = cw || pw; const h = ch || ph || (w ? Math.round(w * 0.56) : 0);
      if (w && h) { rect = { width: w, height: h, top: 0, left: 0, bottom: h, right: w }; }
      else { this._dirty = true; if (typeof setTimeout !== 'undefined') setTimeout(()=>this._requestDraw(), 500); return; }
    }
    const dpr = Math.min(window.devicePixelRatio || 1, this.options.dprMax);
    const cssW = Math.max(1, Math.floor(rect.width)); const cssH = Math.max(1, Math.floor(rect.height));
    const targetW = cssW * dpr; const targetH = cssH * dpr;
    this._cssW = cssW; this._cssH = cssH; this._dpr = dpr;
    if (this.canvas.width !== targetW || this.canvas.height !== targetH) {
      this.canvas.width = targetW; this.canvas.height = targetH; this._invalidateOffscreen();
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = this.options.bgColor;
    ctx.fillRect(0, 0, targetW, targetH);

    const mapAspect = this.view.w / this.view.h;
    const canvasAspect = targetW / targetH;
    let scale, offsetX, offsetY;
    if (canvasAspect > mapAspect) { scale = targetH / this.view.h; offsetX = (targetW - this.view.w * scale) / 2; offsetY = 0; }
    else { scale = targetW / this.view.w; offsetX = 0; offsetY = (targetH - this.view.h * scale) / 2; }
    this._renderScale = scale; this._renderOffsetX = offsetX; this._renderOffsetY = offsetY;

    // ===== 主画布：背景海洋 =====
    if (!this.currentMapData) {
      ctx.fillStyle = this.options.oceanColor; ctx.fillRect(0, 0, targetW, targetH);
      ctx.fillStyle = '#555'; ctx.font = (14*dpr)+'px sans-serif'; ctx.textAlign='center';
      ctx.fillText('选择地图...', targetW/2, targetH/2);
      this._dirty = false; return;
    }
    ctx.fillStyle = this.options.oceanColor;
    ctx.fillRect(0, 0, targetW, targetH);

    // ===== 世界坐标变换 =====
    ctx.setTransform(scale, 0, 0, scale, offsetX - this.view.x * scale, offsetY - this.view.y * scale);

    // ===== 热点脉冲动画参数 (仅P3 HOTSPOT 模式下有变化, 其余模式不逐帧重绘) =====
    const animating = this.colorMode === SVGMap.COLOR_MODES.HOTSPOT && this.hotspots.size > 0;
    if (animating) { this._pulseElapsed = (this._pulseElapsed || 0) + 0.05; this._dirty = true; this._requestDraw(); }
    const pulseT = animating ? 0.5 + 0.5 * Math.sin(this._pulseElapsed * 4) : 0;

    // ===== 国家填充 (动态着色 + 内战hatch) =====
    const drawList = [];
    for (const [cid, path] of this.pathCache) {
      const factionColor = SVGMap.getFactionColor(cid);
      const resolved = this._resolveRegionColor(cid, factionColor);
      // 内战/热点 先收集
      drawList.push({ cid, path, resolved, factionColor });
    }

    // 先画非内战填充, 再画内战hatch
    for (const d of drawList) {
      if (d.resolved.civilWar) continue;
      ctx.fillStyle = d.resolved.fill;
      ctx.fill(d.path);
    }
    for (const d of drawList) {
      if (!d.resolved.civilWar) continue;
      const pattern = this._getHatchPattern(ctx, scale, d.resolved.fill, d.resolved.border);
      ctx.fillStyle = pattern || d.resolved.fill;
      ctx.fill(d.path);
    }

    // ===== 统一描边 =====
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = this.options.borderColor;
    for (const [cid, path] of this.pathCache) ctx.stroke(path);

    // ===== 热点脉冲描边 (厚+亮) =====
    for (const d of drawList) {
      if (!d.resolved.hotspot) continue;
      ctx.save();
      ctx.lineWidth = 2 + pulseT * 3;
      ctx.strokeStyle = animating
        ? _lerpColor('#ffe080', '#ff6040', pulseT)
        : '#ffe080';
      ctx.globalAlpha = 0.7 + pulseT * 0.3;
      ctx.stroke(d.path);
      ctx.restore();
    }

    // ===== 图层渲染 (activeLayers) =====
    this._drawActiveLayers(ctx, scale);

    // ===== 国家名称 (v2: 分级+碰撞避让) =====
    this._renderLabelsV2(ctx, scale);

    // ===== hover / select 高亮 =====
    const drawHL = (id, color, width) => {
      if (!id) return;
      const p = this.pathCache.get(id); if (!p) return;
      ctx.save();
      ctx.lineWidth = width; ctx.strokeStyle = color; ctx.stroke(p); ctx.restore();
    };
    drawHL(this.hoverId, this.options.hoverStroke, 2);
    drawHL(this.selectId, this.options.selectStroke, 3);

    // ===== Dev模式: 绘制每个region的ID + 边界 + 面积 =====
    if (this.devMode) {
      ctx.save();
      ctx.font = (1.8 / scale) + "px monospace";
      ctx.fillStyle = 'rgba(255,220,80,0.95)';
      ctx.strokeStyle = 'rgba(0,0,0,0.9)';
      ctx.lineWidth = 0.3 / scale;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      for (const [cid, path] of this.pathCache) {
        const pos = this._labelCache && this._labelCache[cid];
        if (!pos) continue;
        const sx = pos.x, sy = pos.y;
        ctx.strokeText(cid, sx, sy - 0.8/scale);
        ctx.fillText(cid, sx, sy - 0.8/scale);
        if (pos.area) {
          ctx.font = (1.2 / scale) + "px monospace";
          ctx.fillStyle = 'rgba(120,180,255,0.9)';
          ctx.fillText('a'+Math.round(pos.area), sx, sy + 1.2/scale);
          ctx.fillStyle = 'rgba(255,220,80,0.95)';
          ctx.font = (1.8 / scale) + "px monospace";
        }
        // 区域边框 debug
        ctx.save();
        ctx.strokeStyle = 'rgba(255,80,80,0.4)';
        ctx.lineWidth = 0.3 / scale;
        ctx.setLineDash([2/scale, 2/scale]);
        ctx.stroke(path);
        ctx.restore();
      }
      // 左上角统计
      ctx.setTransform(1,0,0,1,0,0);
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(0,0,260*dpr,110*dpr);
      ctx.fillStyle = '#ffe080'; ctx.font = (11*dpr)+'px monospace'; ctx.textAlign='left'; ctx.textBaseline='top';
      ctx.fillText('[DEV MODE] map: '+(this.currentMapId||'-'), 8*dpr, 6*dpr);
      ctx.fillStyle = '#a0c0ff'; ctx.font = (10*dpr)+'px monospace';
      ctx.fillText('regions: '+this.pathCache.size, 8*dpr, 24*dpr);
      ctx.fillText('colorMode: '+this.colorMode, 8*dpr, 40*dpr);
      ctx.fillText('activeLayers: '+Array.from(this.activeLayers).join(','), 8*dpr, 56*dpr);
      ctx.fillText('view: w='+Math.round(this.view.w)+' h='+Math.round(this.view.h), 8*dpr, 72*dpr);
      ctx.fillText('hotspots: '+this.hotspots.size, 8*dpr, 88*dpr);
      ctx.restore();
    }

    // ===== 保存该地图的视角 (在非平移中保存) =====
    if (this.currentMapId) {
      this.lastViews[this.currentMapId] = { x: this.view.x, y: this.view.y, w: this.view.w, h: this.view.h };
    }

    this._dirty = false;
  };

  /* -------- 图层元素渲染 (polygon/path/text/rect/circle/line) -------- */
  proto._drawActiveLayers = function (ctx, scale) {
    if (this.activeLayers.size === 0) return;
    // 按固定顺序: terrain -> subregions -> water -> transit -> history -> cities
    const order = ['terrain', 'subregions', 'water', 'transit', 'history', 'cities'];
    for (const layerId of order) {
      if (!this.activeLayers.has(layerId)) continue;
      const layer = this.layers[layerId];
      if (!layer || !layer.loaded) continue;
      ctx.save();
      ctx.globalAlpha = layer.meta.opacity != null ? layer.meta.opacity : 0.18;
      // 简单裁剪: 只画元素中心在viewport中的
      const vx=this.view.x, vy=this.view.y, vw=this.view.w, vh=this.view.h;
      let skip = 0;
      for (const el of layer.data) {
        // 视口粗略裁剪 (按元素的第一个点)
        const attrs = el.attrs || {};
        let cx = null, cy = null;
        if (attrs.x != null && attrs.y != null) { cx = parseFloat(attrs.x); cy = parseFloat(attrs.y); }
        else if (attrs.cx != null && attrs.cy != null) { cx = parseFloat(attrs.cx); cy = parseFloat(attrs.cy); }
        else if (attrs.points) {
          const first = attrs.points.split(/\s+/)[0];
          if (first) { const xy = first.split(','); if (xy.length===2){cx=parseFloat(xy[0]); cy=parseFloat(xy[1]);} }
        }
        if (cx != null && (cx < vx - vw*0.1 || cx > vx + vw*1.1 || cy < vy - vh*0.1 || cy > vy + vh*1.1)) { skip++; continue; }
        this._drawLayerElement(ctx, el, scale);
      }
      ctx.restore();
    }
  };

  proto._drawLayerElement = function (ctx, el, scale) {
    const a = el.attrs || {};
    switch (el.tag) {
      case 'path': case 'polygon': case 'polyline': {
        const d = a.d || (a.points ? (el.tag==='polygon'||el.tag==='polyline' ? 'M'+a.points.replace(/(\s|^)(\S)/g,(_,s,x)=>s+x).replace(/,/g,' L') + (el.tag==='polygon'?' Z':'') : '') : null);
        if (!d) return;
        let p;
        try { p = new Path2D(d); } catch (_) { return; }
        if (a.fill && a.fill !== 'none') { ctx.fillStyle = a.fill; ctx.fill(p); }
        if (a.stroke && a.stroke !== 'none') {
          ctx.strokeStyle = a.stroke;
          ctx.lineWidth = parseFloat(a['stroke-width'] || 0.3) || 0.3;
          if (a['stroke-dasharray']) ctx.setLineDash(a['stroke-dasharray'].split(',').map(Number));
          ctx.stroke(p);
          ctx.setLineDash([]);
        }
        break;
      }
      case 'rect': {
        const x = parseFloat(a.x), y = parseFloat(a.y), w = parseFloat(a.width), h = parseFloat(a.height);
        if (a.fill && a.fill !== 'none') { ctx.fillStyle = a.fill; ctx.fillRect(x,y,w,h); }
        if (a.stroke) { ctx.strokeStyle = a.stroke; ctx.strokeRect(x,y,w,h); }
        break;
      }
      case 'circle': {
        const cx = parseFloat(a.cx), cy = parseFloat(a.cy), r = parseFloat(a.r);
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2);
        if (a.fill && a.fill !== 'none') { ctx.fillStyle = a.fill; ctx.fill(); }
        if (a.stroke) { ctx.lineWidth = parseFloat(a['stroke-width']||0.3); ctx.strokeStyle = a.stroke; ctx.stroke(); }
        break;
      }
      case 'line': {
        ctx.beginPath();
        ctx.moveTo(parseFloat(a.x1), parseFloat(a.y1));
        ctx.lineTo(parseFloat(a.x2), parseFloat(a.y2));
        ctx.strokeStyle = a.stroke || '#444';
        ctx.lineWidth = parseFloat(a['stroke-width']||0.3);
        if (a['stroke-dasharray']) ctx.setLineDash(a['stroke-dasharray'].split(',').map(Number));
        ctx.stroke(); ctx.setLineDash([]);
        break;
      }
      case 'text': {
        if (!a.text) break;
        ctx.save();
        ctx.font = (parseFloat(a['font-size']||2) || 2) + "px serif";
        ctx.textAlign = a['text-anchor'] || 'middle';
        ctx.textBaseline = 'middle';
        const op = a.opacity; if (op!=null) ctx.globalAlpha = Math.max(0,Math.min(1, parseFloat(op)));
        ctx.fillStyle = a.fill || '#fff';
        ctx.fillText(a.text, parseFloat(a.x), parseFloat(a.y));
        ctx.restore();
        break;
      }
    }
  };

  /* -------- 公开辅助：获取当前缩放系数(方便UI显示) -------- */
  proto.getZoomFactor = function () {
    if (!this.currentMapData || !this.currentMapData.view) return 1;
    return this.currentMapData.view.w / this.view.w;
  };

  // ---------- 安装双击补丁 hook ----------
  const _origLoad = proto.loadMap;
  proto.loadMap = async function () {
    const result = await _origLoad.apply(this, arguments);
    if (result) {
      this.installDoubleClickZoom();
      // 触发默认图层加载
      if (!this._defaultLayerLoading) {
        this._defaultLayerLoading = true;
        this.loadAllDefaultLayers().catch(() => {});
      }
    }
    return result;
  };

  // 对外暴露
  SVGMap.installPatches = function (instance) { /* no-op, 已自动安装 */ return true; };
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
