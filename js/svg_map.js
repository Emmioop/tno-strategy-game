(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SVGMap = factory();
})(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  const FACTION_COLORS = {
    germany: { fill: '#8b3a3a', border: '#5a2020' },
    uk: { fill: '#4a6fa5', border: '#2d4570' },
    france: { fill: '#3b5998', border: '#1e3560' },
    burgundy: { fill: '#6b2d5c', border: '#3d1635' },
    spain: { fill: '#c6a35b', border: '#8a7240' },
    italy: { fill: '#5b8c5a', border: '#355a34' },
    japan: { fill: '#c4342d', border: '#802020' },
    manchuria: { fill: '#d4a853', border: '#8a6d2a' },
    china: { fill: '#d4a853', border: '#8a6d2a' },
    usa: { fill: '#3a6ea5', border: '#1e4070' },
    canada: { fill: '#8b4513', border: '#5a2d0c' },
    mexico: { fill: '#2d7a4f', border: '#1a4a30' },
    brazil: { fill: '#2d7a4f', border: '#1a4a30' },
    argentina: { fill: '#6fa8dc', border: '#406090' },
    iran: { fill: '#4a8b6f', border: '#2a5a45' },
    turkey: { fill: '#a83232', border: '#6a1f1f' },
    russia: { fill: '#6a5acd', border: '#3d3499' },
    ostland: { fill: '#5a7050', border: '#35422e' },
    ukraine: { fill: '#4a7a3a', border: '#2d4a22' },
    moscow: { fill: '#5a4a7a', border: '#322a48' },
    caucasus: { fill: '#7a5a3a', border: '#4a3822' },
    netherlands: { fill: '#6b8e7a', border: '#3d5248' },
    denmark: { fill: '#708090', border: '#3d4852' },
    norway: { fill: '#6a7a8a', border: '#3a4350' },
    sweden: { fill: '#5a7a5a', border: '#354635' },
    finland: { fill: '#4a6a7a', border: '#2a3e48' },
    poland: { fill: '#8b6a5a', border: '#504030' },
    slovakia: { fill: '#7a6a4a', border: '#463e28' },
    hungary: { fill: '#6a8a4a', border: '#3e5228' },
    romania: { fill: '#7a6a5a', border: '#463e35' },
    serbia: { fill: '#8b5a4a', border: '#503028' },
    bulgaria: { fill: '#6a5a8a', border: '#3e3452' },
    croatia: { fill: '#a85a5a', border: '#6a3838' },
    greece: { fill: '#5a7ac4', border: '#354a7a' },
    egypt: { fill: '#c4a04a', border: '#7a6028' },
    algeria: { fill: '#8b7355', border: '#50422e' },
    libya: { fill: '#8b7355', border: '#50422e' },
    ethiopia: { fill: '#c4883a', border: '#7a5228' },
    south_africa: { fill: '#7a6a5a', border: '#464035' },
    ethiopia: { fill: '#c4883a', border: '#7a5228' },
    canada: { fill: '#8b4513', border: '#5a2d0c' },
    australia: { fill: '#b87333', border: '#6a4519' },
    new_zealand: { fill: '#6a7a6a', border: '#3e463e' },
    india: { fill: '#b8860b', border: '#6a4e07' },
    indonesia: { fill: '#8b5a2b', border: '#503015' },
    philippines: { fill: '#c4a853', border: '#8a6d2a' },
    thailand: { fill: '#8b6a5a', border: '#504030' },
    vietnam: { fill: '#6a8a5a', border: '#3e5228' },
    korea: { fill: '#5a7a5a', border: '#354635' },
    peru: { fill: '#c45a3a', border: '#7a3822' },
    colombia: { fill: '#3b7a57', border: '#1e4a35' },
    venezuela: { fill: '#c49a3a', border: '#7a5e22' },
    ecuador: { fill: '#6a8a6a', border: '#3e5240' },
    bolivia: { fill: '#6a5a4a', border: '#3e3428' },
    paraguay: { fill: '#5a8a5a', border: '#355235' },
    uruguay: { fill: '#5a6a8a', border: '#353e50' },
    chile: { fill: '#5a7aaa', border: '#355080' },
    cuba: { fill: '#8b6a4a', border: '#504028' },
    haiti: { fill: '#5a5a8a', border: '#353552' },
    dominican: { fill: '#c47a5a', border: '#7a4635' },
    panama: { fill: '#6a8a8a', border: '#3e5252' },
    costarica: { fill: '#5a8b5a', border: '#355235' },
    nicaragua: { fill: '#6a7a5a', border: '#3e4635' },
    honduras: { fill: '#7a6a4a', border: '#464028' },
    guatemala: { fill: '#6a7a6a', border: '#3e463e' },
    el_salvador: { fill: '#5a7a6a', border: '#35463e' },
    british_honduras: { fill: '#708090', border: '#3d4852' },
    suriname: { fill: '#5a6a5a', border: '#353e35' },
    guyana: { fill: '#4a6a5a', border: '#2a4635' },
    french_guiana: { fill: '#5a8b6a', border: '#355240' },
    west_indies: { fill: '#6a5a8a', border: '#3e3452' },
    free_france: { fill: '#3b5998', border: '#1e3560' },
    free_india: { fill: '#b8860b', border: '#6a4e07' },
    south_africa: { fill: '#7a6a5a', border: '#464035' },
    kenya: { fill: '#c47a3a', border: '#7a4622' },
    tanzania: { fill: '#8b7355', border: '#50422e' },
    congo: { fill: '#7a5a3a', border: '#463822' },
    ethiopia: { fill: '#c4883a', border: '#7a5228' },
    morocco: { fill: '#8b6a3a', border: '#503e22' },
    tunisia: { fill: '#c4a853', border: '#8a6d2a' },
    iraq: { fill: '#4a8b6f', border: '#2a5a45' },
    syria: { fill: '#8b5a2b', border: '#503015' },
    lebanon: { fill: '#7a8a6a', border: '#465240' },
    jordan: { fill: '#a87a3a', border: '#6a4a22' },
    saudi: { fill: '#5a7a3a', border: '#354620' },
    yemen: { fill: '#7a6a4a', border: '#464028' },
    oman: { fill: '#5a8a7a', border: '#355246' },
    kuwait: { fill: '#6a8a8a', border: '#3e5252' },
    qatar: { fill: '#7a5a8a', border: '#463852' },
    bahrain: { fill: '#c47a5a', border: '#7a4635' },
    uae: { fill: '#8b7355', border: '#50422e' },
    afghanistan: { fill: '#8b4513', border: '#5a2d0c' },
    pakistan: { fill: '#01411c', border: '#012916' },
    nepal: { fill: '#c4883a', border: '#7a5228' },
    bhutan: { fill: '#7a6a5a', border: '#464035' },
    sri_lanka: { fill: '#5a7ac4', border: '#355080' },
    malaya: { fill: '#8b5a2b', border: '#503015' },
    singapore: { fill: '#c4a853', border: '#8a6d2a' },
    burma: { fill: '#c47a5a', border: '#7a4635' },
    cambodia: { fill: '#6a8a5a', border: '#3e5228' },
    laos: { fill: '#7a6a4a', border: '#464028' },
    mongolia: { fill: '#6a5a8a', border: '#3e3452' },
    kazakhstan: { fill: '#7a8a7a', border: '#465246' },
    uzbekistan: { fill: '#8b7355', border: '#50422e' },
    turkmenistan: { fill: '#7a6a4a', border: '#464028' },
    kyrgyzstan: { fill: '#5a7a5a', border: '#354635' },
    tajikistan: { fill: '#6a5a5a', border: '#3e3435' },
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
      const offCtx = canvas.getContext('2d');

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

        // 计算标签位置：过滤异常大的路径，选最大路径，用 isPointInPath 验证
        const mapArea = data.view.w * data.view.h;
        const filtered = allBBoxes.filter(b => b.area < mapArea * 0.4);
        const candidates = filtered.length > 0 ? filtered : allBBoxes;
        candidates.sort((a, b) => b.area - a.area);

        // 重置变换矩阵，确保 isPointInPath 使用世界坐标
        offCtx.save();
        offCtx.setTransform(1, 0, 0, 1, 0, 0);

        let labelPos = null;
        for (const bbox of candidates) {
          const cx = (bbox.minX + bbox.maxX) / 2;
          const cy = (bbox.minY + bbox.maxY) / 2;
          // 用 isPointInPath 验证中心是否在国土内
          try {
            if (offCtx.isPointInPath(combinedPath, cx, cy)) {
              labelPos = { x: cx, y: cy, area: totalArea };
              break;
            }
          } catch (_) {}
          // 中心不在路径内，在 bounding box 内搜索
          const stepX = Math.max((bbox.maxX - bbox.minX) / 8, 0.5);
          const stepY = Math.max((bbox.maxY - bbox.minY) / 8, 0.5);
          let found = false;
          for (let dx = 0; dx <= bbox.maxX - bbox.minX && !found; dx += stepX) {
            for (let dy = 0; dy <= bbox.maxY - bbox.minY && !found; dy += stepY) {
              const tx = bbox.minX + dx;
              const ty = bbox.minY + dy;
              try {
                if (offCtx.isPointInPath(combinedPath, tx, ty)) {
                  labelPos = { x: tx, y: ty, area: totalArea };
                  found = true;
                }
              } catch (_) {}
            }
          }
          if (found) break;
        }
        offCtx.restore();

        // fallback：使用最大候选的 bounding box 中心
        if (!labelPos && candidates.length > 0) {
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
