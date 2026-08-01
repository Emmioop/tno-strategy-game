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

      for (const [cid, cdata] of Object.entries(data.countries)) {
        const combinedPath = new Path2D();
        for (const dStr of cdata.p) {
          try {
            combinedPath.addPath(new Path2D(dStr));
          } catch (_) {
            try { combinedPath.addPath(new Path2D(dStr)); } catch (_) {}
          }
        }
        this.pathCache.set(cid, combinedPath);
        this.featureIndex.set(cid, {
          id: cid,
          zh: cdata.zh,
          pathCount: cdata.n,
          mapId
        });
      }
      this.zoomToFit();
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
      return [
        this.view.x + (sx / r.width) * this.view.w,
        this.view.y + (sy / r.height) * this.view.h
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
      if (this.canvas.width !== targetW || this.canvas.height !== targetH) {
        this.canvas.width = targetW;
        this.canvas.height = targetH;
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = this.options.bgColor;
      ctx.fillRect(0, 0, targetW, targetH);

      const sx = targetW / this.view.w;
      const sy = targetH / this.view.h;
      ctx.setTransform(sx, 0, 0, sy, -this.view.x * sx, -this.view.y * sy);

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
      ctx.fillRect(this.view.x - this.view.w, this.view.y - this.view.h,
                   this.view.w * 3, this.view.h * 3);

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
