/**
 * js/canvas_map.js  v1.0
 * Canvas高性能地图渲染器（手机性能优先）
 *
 * 特性:
 *   - 三级显示: level 1 国家级 (6), level 2 战区级/军阀 (41), level 3 预留
 *   - Path2D命中检测: O(1) 点中判定，避免每帧重算
 *   - 5个预设分区视图: 全球/欧洲/美洲/东亚/非洲
 *   - 鼠标滚轮缩放 + 拖拽平移 + 移动端双指
 *   - DPR(设备像素比)适配，Retina屏不糊
 *   - setStateColorOverrides() → 根据flags动态改色（内战/崩溃/统一切换）
 *   - Canvas失败时可回退：保持原SVG地图完整
 *
 * 用法:
 *   const cm = new CanvasMap(canvasElement, { url: 'data/map/world_mini.geojson' });
 *   cm.on('ready', () => {
 *     cm.zoomTo('europe');
 *     cm.setDisplayLevel(2);
 *   });
 *   cm.on('click', (feature) => console.log('点中了:', feature.properties.name));
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.CanvasMap = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  class CanvasMap {
    constructor(canvas, options = {}) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      if (!this.ctx) { throw new Error('Canvas 2D context unavailable'); }

      this.options = Object.assign({
        url: 'data/map/world_mini.geojson',
        bgColor: '#0e1520',
        oceanColor: '#1a2535',
        borderColor: '#0a0f18',
        hoverStroke: '#ffe080',
        selectStroke: '#ff8a30',
        defaultDisplayLevel: 2,
        autoLoad: true,
        dprMax: 2 // 手机上限制最高DPR=2，避免显存爆炸
      }, options);

      // 视口: 以SVG逻辑坐标 (0~1200, 0~750) 为世界坐标
      this.view = { x: 0, y: 0, w: 1200, h: 750 };
      this.minScale = 0.2;
      this.maxScale = 5;

      this.features = [];          // 原始Feature数组
      this.pathCache = new Map();  // id → Path2D 缓存
      this.featureIndex = new Map(); // id → feature

      this.displayLevel = this.options.defaultDisplayLevel;
      this.colorOverrides = {};    // id → 新颜色 (setStateColorOverrides写入)

      this.hoverId = null;
      this.selectId = null;

      this._listeners = {};
      this._animId = null;
      this._dirty = true;

      this._bindPointer();

      if (this.options.autoLoad && this.options.url) {
        this.loadGeoJSON(this.options.url);
      } else {
        this._requestDraw();
      }
    }

    /* ================= 公开: 数据加载 ================= */
    async loadGeoJSON(url) {
      try {
        const resp = await fetch(url, { cache: 'no-cache' });
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        const gj = await resp.json();
        this._ingestGeoJSON(gj);
        this._fire('ready', gj);
        this._dirty = true;
        this._requestDraw();
      } catch (e) {
        console.error('[CanvasMap] 加载失败:', e.message);
        this._fire('error', e);
      }
    }

    _ingestGeoJSON(gj) {
      this.geoJSON = gj;
      this.features = gj.features || [];
      this.zoomPresets = gj.zoomPresets || null;
      this.featureIndex.clear();
      this.pathCache.clear();

      for (const f of this.features) {
        this.featureIndex.set(f.id, f);
        // 构建 Path2D
        const p = new Path2D();
        const ring = f.geometry.coordinates[0];
        if (ring && ring.length) {
          p.moveTo(ring[0][0], ring[0][1]);
          for (let i = 1; i < ring.length; i++) {
            p.lineTo(ring[i][0], ring[i][1]);
          }
          p.closePath();
        }
        this.pathCache.set(f.id, p);
      }
    }

    /* ================= 公开: 显示控制 ================= */
    /**
     * 设定三级显示:
     *   1 = 国家级 (大国块，6个，超高清快速渲染)
     *   2 = 战区级 (默认，专员辖区/军阀/细分，47个)
     *   3 = 省份级 (未来预留)
     */
    setDisplayLevel(level) {
      this.displayLevel = Math.max(1, Math.min(3, level | 0));
      this._dirty = true;
      this._requestDraw();
    }

    /**
     * 动态颜色覆盖，对接游戏flags：
     *   cm.setStateColorOverrides({ GER:'#6a2a2a', RUS:'#3a7a5a' })
     */
    setStateColorOverrides(map) {
      this.colorOverrides = Object.assign({}, map || {});
      this._dirty = true;
      this._requestDraw();
    }

    /** 跳到5个预设视图之一: global / europe / america / eastasia / africa */
    zoomTo(name) {
      if (this.zoomPresets && this.zoomPresets[name]) {
        const z = this.zoomPresets[name];
        this.view = { x: z.x, y: z.y, w: z.w, h: z.h };
        this._dirty = true;
        this._requestDraw();
        this._fire('zoomchange', { preset: name, view: this.view });
        return true;
      }
      return false;
    }

    /** 以中心点相对缩放 */
    zoomBy(factor, cxWorld, cyWorld) {
      cxWorld = cxWorld ?? (this.view.x + this.view.w / 2);
      cyWorld = cyWorld ?? (this.view.y + this.view.h / 2);
      let nw = this.view.w / factor;
      let nh = this.view.h / factor;
      // 边界
      const minW = 1200 / this.maxScale, minH = 750 / this.maxScale;
      const maxW = 1200 / this.minScale, maxH = 750 / this.minScale;
      nw = Math.max(minW, Math.min(maxW, nw));
      nh = Math.max(minH, Math.min(maxH, nh));
      const rx = (cxWorld - this.view.x) / this.view.w;
      const ry = (cyWorld - this.view.y) / this.view.h;
      this.view.w = nw; this.view.h = nh;
      this.view.x = cxWorld - rx * nw;
      this.view.y = cyWorld - ry * nh;
      this._clampView();
      this._dirty = true;
      this._requestDraw();
    }

    panBy(dx, dy) {
      // dx/dy: 像素位移，换算为世界坐标
      const { w, h } = this.view;
      const rect = this._getCssRect();
      if (!rect || rect.width === 0 || rect.height === 0) return;
      this.view.x -= (dx / rect.width) * w;
      this.view.y -= (dy / rect.height) * h;
      this._clampView();
      this._dirty = true;
      this._requestDraw();
    }

    selectFeature(id) {
      this.selectId = id;
      this._dirty = true;
      this._requestDraw();
    }

    /* ================= 公开: 事件 ================= */
    on(evt, cb) { (this._listeners[evt] = this._listeners[evt] || []).push(cb); return this; }
    off(evt, cb) {
      const arr = this._listeners[evt]; if (!arr) return;
      const i = arr.indexOf(cb); if (i >= 0) arr.splice(i, 1);
    }
    _fire(evt, data) {
      const arr = this._listeners[evt];
      if (arr) for (const cb of arr.slice()) { try { cb(data, this); } catch (_) {} }
    }

    /* ================= 内部: 指针绑定 ================= */
    _bindPointer() {
      const cvs = this.canvas;
      let dragging = false; let startX = 0, startY = 0;
      let moved = false;

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
          // Hover 命中检测
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
      // 滚轮缩放
      cvs.addEventListener('wheel', (e) => {
        e.preventDefault();
        const rect = this._getCssRect();
        if (!rect) return;
        const lx = e.clientX - rect.left, ly = e.clientY - rect.top;
        const wc = this._screenToWorld(lx, ly);
        const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
        this.zoomBy(factor, wc[0], wc[1]);
      }, { passive: false });

      // 移动端触屏
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
            const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
            const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;
            const wc = this._screenToWorld(cx, cy);
            this.zoomBy(d / pinchDist, wc[0], wc[1]);
          }
          pinchDist = d;
        }
      }, { passive: true });
      cvs.addEventListener('touchend', (e) => {
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

    /** CSS像素坐标 → 世界(SVG逻辑)坐标 */
    _screenToWorld(sx, sy) {
      const r = this._getCssRect(); if (!r) return [0, 0];
      const x = this.view.x + (sx / r.width) * this.view.w;
      const y = this.view.y + (sy / r.height) * this.view.h;
      return [x, y];
    }

    _hitTest(sx, sy) {
      const wc = this._screenToWorld(sx, sy);
      // 高level优先 (level 2 > level 1，更精细)
      const candidates = this.features.filter(f => f.properties.level <= this.displayLevel);
      // 优先匹配 level 更高的 (按level倒序)
      candidates.sort((a, b) => b.properties.level - a.properties.level);
      for (const f of candidates) {
        const p = this.pathCache.get(f.id);
        if (p) {
          // 命中检测在世界坐标系进行，所以不需要变换Path2D
          // 但 Path2D.isPointInPath 需要 canvas 变换后才能判断 —— 这里直接用 world 坐标和原始Path2D等价判断
          // 由于Path2D是按世界坐标构建的，我们调用 ctx.save() + resetTransform() 再判断，避免canvas DPR/缩放干扰
          const ctx = this.ctx;
          ctx.save();
          ctx.setTransform(1, 0, 0, 1, 0, 0); // 单位矩阵，Path2D本身是世界坐标
          const hit = ctx.isPointInPath(p, wc[0], wc[1]);
          ctx.restore();
          if (hit) return f.id;
        }
      }
      return null;
    }

    _clampView() {
      // 不允许view超出世界边界太多
      if (this.view.w > 1200 * 1.2) this.view.w = 1200 * 1.2;
      if (this.view.h > 750 * 1.2) this.view.h = 750 * 1.2;
      if (this.view.x < -this.view.w * 0.3) this.view.x = -this.view.w * 0.3;
      if (this.view.y < -this.view.h * 0.3) this.view.y = -this.view.h * 0.3;
      if (this.view.x + this.view.w > 1200 + this.view.w * 0.3) this.view.x = 1200 + this.view.w * 0.3 - this.view.w;
      if (this.view.y + this.view.h > 750 + this.view.h * 0.3) this.view.y = 750 + this.view.h * 0.3 - this.view.h;
    }

    /* ================= 内部: 绘制 ================= */
    _requestDraw() {
      if (this._animId != null) return;
      this._animId = requestAnimationFrame(() => {
        this._animId = null;
        if (this._dirty) this._draw();
      });
    }

    _draw() {
      const ctx = this.ctx;
      const rect = this._getCssRect();
      if (!rect || rect.width === 0 || rect.height === 0) return;

      // 处理 DPR，每个尺寸都乘以 devicePixelRatio
      const dpr = Math.min(window.devicePixelRatio || 1, this.options.dprMax);
      const cssW = Math.max(1, Math.floor(rect.width));
      const cssH = Math.max(1, Math.floor(rect.height));
      const targetW = cssW * dpr;
      const targetH = cssH * dpr;
      if (this.canvas.width !== targetW || this.canvas.height !== targetH) {
        this.canvas.width = targetW;
        this.canvas.height = targetH;
      }

      // 背景
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = this.options.bgColor;
      ctx.fillRect(0, 0, targetW, targetH);

      // → 世界坐标系变换: world(x,y) → canvas像素(pixelX,pixelY)
      // scaleX = targetW / view.w;  scaleY = targetH / view.h
      const sx = targetW / this.view.w;
      const sy = targetH / this.view.h;
      ctx.setTransform(sx, 0, 0, sy, -this.view.x * sx, -this.view.y * sy);

      // 海洋底色
      ctx.fillStyle = this.options.oceanColor;
      ctx.fillRect(0, 0, 1200, 750);

      // 1. 绘制多边形填充 (只显示 level <= 当前)
      const visible = this.features.filter(f => f.properties.level <= this.displayLevel);
      // 先按 level 正序 (level 1 先画大的，level 2 小的叠上去)
      visible.sort((a, b) => a.properties.level - b.properties.level);

      for (const f of visible) {
        const p = this.pathCache.get(f.id);
        if (!p) continue;
        const id = f.id;
        const color = this.colorOverrides[id] || f.properties.baseColor;
        ctx.fillStyle = color;
        ctx.fill(p);
        // 默认边界 (细线)
        ctx.lineWidth = 0.6;
        ctx.strokeStyle = this.options.borderColor;
        ctx.stroke(p);
      }

      // 2. Hover / Select 描边
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
      drawHighlight(this.hoverId, this.options.hoverStroke, 1.8);
      drawHighlight(this.selectId, this.options.selectStroke, 2.5);

      // 3. 标签
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      for (const f of visible) {
        const L = f.properties.label; if (!L) continue;
        // 标签可见性: 在view内才画
        if (L.x < this.view.x || L.x > this.view.x + this.view.w) continue;
        if (L.y < this.view.y || L.y > this.view.y + this.view.h) continue;
        // 字体随zoom缩小后也要可见
        const zoomFactor = 1200 / this.view.w;
        const size = L.fontSize * Math.min(3, Math.max(0.6, zoomFactor));
        ctx.font = `bold ${size}px -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif`;
        ctx.fillStyle = L.color || '#e8e8f0';
        ctx.fillText(f.properties.name, L.x, L.y);
      }

      // 4. 纬度线 (很淡，增加真实感)
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth = 0.5;
      for (let lat = 150; lat < 750; lat += 75) {
        ctx.beginPath();
        ctx.moveTo(0, lat); ctx.lineTo(1200, lat); ctx.stroke();
      }
      for (let lon = 120; lon < 1200; lon += 120) {
        ctx.beginPath();
        ctx.moveTo(lon, 0); ctx.lineTo(lon, 750); ctx.stroke();
      }

      this._dirty = false;
      this._fire('draw', { features: visible.length, view: this.view, dpr });
    }

    /* ================= 性能测量 ================= */
    measureFPS(durationMs = 2000) {
      return new Promise(resolve => {
        let frames = 0;
        const start = performance.now();
        const loop = () => {
          frames++;
          this._dirty = true; this._draw();
          if (performance.now() - start < durationMs) requestAnimationFrame(loop);
          else resolve(Math.round(frames * 1000 / (performance.now() - start)));
        };
        requestAnimationFrame(loop);
      });
    }

    destroy() {
      if (this._animId != null) cancelAnimationFrame(this._animId);
      this._animId = null;
      this.pathCache.clear();
      this.featureIndex.clear();
      this.features = [];
      this._listeners = {};
    }
  }

  return CanvasMap;
});
