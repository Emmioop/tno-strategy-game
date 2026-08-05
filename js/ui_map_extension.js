// ====== SVGMap UI 扩展 (图层/着色模式/图例/信息卡片/快速区域切换) ======
// 插入到 ui.js 末尾，兼容现有 renderMap() / renderMapPage() / _bindMapPostRender()
(function (root) {
  if (!root.UI || typeof root.UI !== 'object') return;
  // UI 是对象字面量（非 class），直接在对象上扩展方法，不使用 prototype
  const UIp = root.UI;

  /* --- 着色模式元数据 --- */
  const COLOR_MODES = [
    { id: 'faction',   label: '阵营', short: '营', desc: '按控制者阵营着色',
      legend: null, colorBar: null },
    { id: 'stability', label: '稳定', short: '稳', desc: '绿(稳定)→黄(不稳)→红(崩溃)',
      legend: [{ pos:0, c:'#8b1a1a', t:'崩溃' }, { pos:0.5, c:'#a07a1a', t:'不稳' }, { pos:1, c:'#1a5a2a', t:'稳定' }], compact: true },
    { id: 'tension',   label: '紧张', short: '紧', desc: '蓝(和平)→橙→红(激战)',
      legend: [{ pos:0, c:'#2a3a4a', t:'和' }, { pos:1, c:'#b01818', t:'战' }], compact: true },
    { id: 'hotspot',   label: '热点', short: '热', desc: '高亮最近事件区域',
      legend: [{ t:'🔆热点', c:'#ffe080' }] },
    { id: 'russia',    label: '俄统', short: '俄', desc: '俄罗斯统一进度',
      legend: [{ pos:0, c:'#4a4a5a', t:'分' }, { pos:1, c:'#a83232', t:'统' }], compact: true },
  ];

  /* --- 图层元数据 (与 data/map_layers/index.json 一致) --- */
  const LAYER_META = [
    { id: 'subregions', label: '子区域', desc: '内部行政边界 (省/州)', defaultOn: false },
    { id: 'terrain',    label: '地形',   desc: '地形低透明度装饰', defaultOn: false },
    { id: 'water',      label: '水系',   desc: '河流与湖泊', defaultOn: false },
    { id: 'transit',    label: '交通线', desc: '铁路与交通线', defaultOn: false },
    { id: 'history',    label: '历史标记', desc: '历史事件印记', defaultOn: false },
    { id: 'cities',     label: '城市',   desc: '重要城市点位', defaultOn: true },
  ];

  /* --- 快速区域 (预设 viewport 偏移，在已加载的当前map基础上缩放平移) --- */
  // 按 einheitspakt / america / geacs / russia 等 mapId 预设
  const AREA_PRESETS = [
    { id: 'global', label: '🌐 全局', desc: '重置到全图视图' },
    { id: 'europe', label: '🇩🇪 欧洲', desc: '欧洲核心 (德/法/勃)', extra: { zoom: 1.2, regionIds: ['germany','france','burgundy','italy'] } },
    { id: 'east',   label: '🇷🇺 东方', desc: '俄罗斯 & 奥斯特兰', extra: { zoom: 1.0, regionIds: ['ostland','moscow','sverdlovsk','krasnoyarsk'] } },
    { id: 'america',label: '🇺🇸 美洲', desc: '美洲大陆' },
    { id: 'asia',   label: '🇯🇵 东亚', desc: '东亚 & 共荣圈' },
    { id: 'afrika', label: '🇿🇦 非洲', desc: '非洲大陆' },
  ];

  /* --- 生成地图工具扩展 HTML (右侧面板) --- */
  UIp._renderMapExtensionPanel = function () {
    const self = this;

    // 着色模式按钮组 (紧凑版，适合移动端显示)
    const cmHtml = COLOR_MODES.map(c => {
      const active = c.id === 'faction';  // 默认
      let barHtml = '';
      if (c.legend && c.legend[0].pos !== undefined) {
        const stops = c.legend.slice().sort((a,b)=>a.pos-b.pos);
        const parts = [];
        for (let i=0;i<stops.length-1;i++){
          const w = Math.round((stops[i+1].pos - stops[i].pos) * 1000)/10;
          parts.push(`<span style="flex:0 0 ${w}%;background:linear-gradient(to right,${stops[i].c},${stops[i+1].c});height:100%;"></span>`);
        }
        const labelsHtml = c.compact
          ? `<div style="display:flex;justify-content:space-between;font-size:7.5px;color:var(--text-muted);padding:0 1px;margin-top:1px;">
               ${stops.map(s=>`<span style="color:${s.c};opacity:0.85;white-space:nowrap;">${s.t}</span>`).join('')}
             </div>`
          : '';
        barHtml = `<div style="display:flex;height:5px;border-radius:1px;overflow:hidden;margin:2px 0 1px;">${parts.join('')}</div>${labelsHtml}`;
      } else if (c.legend) {
        barHtml = `<div style="display:flex;align-items:center;gap:3px;font-size:8px;color:var(--text-muted);margin-top:1px;">
          <span style="display:inline-block;width:10px;height:5px;background:${c.legend[0].c};border-radius:1px;"></span>
          <span>${c.legend[0].t}</span>
        </div>`;
      }
      const compact = c.compact;
      return `<div class="map-cm-item${active?' active':''}" data-cm="${c.id}"
        style="padding:${compact?'3px 6px':'4px 8px'};background:rgba(20,25,38,0.9);border:1px solid ${active?'#a83232':'#2a3548'};border-radius:4px;cursor:pointer;min-width:${compact?'40px':'50px'};text-align:center;user-select:none;${active?'box-shadow:0 0 0 1px #a83232 inset;':''}"
        title="${c.desc}">
        <div style="font-size:${compact?'11px':'12px'};color:${active?'#f0e0c0':'#c0c8d0'};font-weight:${active?'bold':'normal'};letter-spacing:0.03em;">${c.label}</div>
        ${barHtml}
      </div>`;
    }).join('');

    // 图层开关
    const layersHtml = LAYER_META.map(l => `
      <label class="map-layer-item" data-layer="${l.id}" style="display:flex;align-items:center;gap:6px;padding:4px 6px;cursor:pointer;border-radius:3px;user-select:none;">
        <input type="checkbox" data-layer-chk="${l.id}" ${l.defaultOn?'checked':''} style="accent-color:#a83232;">
        <span style="flex:0 0 46px;font-size:11px;color:#d8d0b8;">${l.label}</span>
        <span style="flex:1;font-size:9px;color:var(--text-muted);">${l.desc}</span>
      </label>
    `).join('');

    // 区域快速切换
    const areasHtml = AREA_PRESETS.map(a => `
      <button class="map-area-btn" data-area="${a.id}"
        style="padding:3px 8px;background:rgba(20,25,38,0.9);border:1px solid #2a3548;border-radius:3px;font-size:10px;color:#c8d0d8;cursor:pointer;white-space:nowrap;"
        title="${a.desc}">${a.label}</button>
    `).join('');

    return `
      <!-- ========================================== -->
      <!-- 1. 【全局按钮】：一键隐藏/显示所有面板（最优先，保证地图能完整看）-->
      <button class="map-ext-toggle-all" id="map-toggle-all-panels"
        style="position:absolute;top:6px;left:50%;transform:translateX(-50%);z-index:20;pointer-events:auto;\
               padding:3px 10px;background:rgba(40,25,20,0.95);border:1px solid #8a5a30;border-radius:100px;\
               color:#ffe0a0;font-size:10px;font-weight:bold;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.6);\
               font-family:var(--font-serif);letter-spacing:0.06em;">
        ⊟ 面板显隐
      </button>

      <!-- 着色模式（右上角），带折叠按钮 -->
      <div class="map-ext-panel" data-extblock="color" style="position:absolute;top:6px;right:12px;z-index:8;pointer-events:auto;max-width:60%;">
        <div style="background:rgba(10,14,22,0.92);border:1px solid #2a3548;border-radius:6px;padding:4px 7px 5px 7px;box-shadow:0 4px 14px rgba(0,0,0,0.55);">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
            <div style="font-size:9px;color:var(--accent-gold);letter-spacing:0.12em;">着色模式</div>
            <button class="map-ext-foldbtn" data-fold="color"
              style="background:none;border:none;color:#c0c8d0;cursor:pointer;font-size:11px;padding:0 2px;line-height:1;" title="折叠/展开">—</button>
          </div>
          <div class="map-ext-fold-body" data-foldbody="color">
            <div style="display:flex;gap:4px;flex-wrap:wrap;justify-content:flex-end;">${cmHtml}</div>
          </div>
        </div>
      </div>

      <!-- 左上面板：图层开关 + 快速区域 + 折叠按钮 -->
      <div class="map-ext-tl" data-extblock="tl" style="position:absolute;top:6px;left:8px;z-index:8;pointer-events:auto;width:200px;max-width:45vw;">
        <div style="background:rgba(10,14,22,0.92);border:1px solid #2a3548;border-radius:6px;padding:4px 8px 6px 8px;box-shadow:0 4px 14px rgba(0,0,0,0.55);">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:3px;">
            <div style="font-size:9px;color:var(--accent-gold);letter-spacing:0.12em;">图层 & 快捷</div>
            <button class="map-ext-foldbtn" data-fold="tl"
              style="background:none;border:none;color:#c0c8d0;cursor:pointer;font-size:11px;padding:0 2px;line-height:1;" title="折叠/展开">—</button>
          </div>
          <div class="map-ext-fold-body" data-foldbody="tl">
            <div style="font-size:8.5px;color:var(--accent-gold);letter-spacing:0.08em;margin:1px 0 2px;">图层开关 <span style="color:var(--text-muted);font-size:8px;letter-spacing:normal;">(按需加载)</span></div>
            <div>${layersHtml}</div>
            <div style="border-top:1px dashed #2a3548;margin:4px 0 3px;"></div>
            <div style="font-size:8.5px;color:var(--accent-gold);letter-spacing:0.08em;margin:1px 0 2px;">快速跳转</div>
            <div style="display:flex;flex-wrap:wrap;gap:3px;">${areasHtml}</div>
            <div style="border-top:1px dashed #2a3548;margin:4px 0 3px;"></div>
            <label style="display:flex;align-items:center;gap:4px;padding:2px 1px;cursor:pointer;font-size:9px;color:#c8c8b8;user-select:none;">
              <input type="checkbox" id="map-dev-toggle" style="accent-color:#a83232;">
              <span>🪲 开发者模式</span>
            </label>
          </div>
        </div>
      </div>

      <!-- 右下信息卡片（单独折叠按钮在卡片标题旁） -->
      <div class="map-info-card" id="map-info-card" data-extblock="info" style="position:absolute;right:8px;bottom:8px;z-index:8;pointer-events:auto;width:280px;max-width:55vw;display:none;">
        <div style="background:rgba(10,14,22,0.96);border:1px solid #3a4a5a;border-radius:6px;box-shadow:0 6px 20px rgba(0,0,0,0.65);">
          <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 10px;border-bottom:1px solid #2a3548;">
            <div style="min-width:0;flex:1;">
              <div class="mic-title" style="font-family:var(--font-serif);color:var(--accent-gold-bright);font-size:13px;letter-spacing:0.08em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">未选择区域</div>
              <div class="mic-id" style="font-size:9px;color:var(--text-muted);margin-top:1px;">—</div>
            </div>
            <div style="display:flex;gap:2px;align-items:center;flex-shrink:0;">
              <button class="map-ext-foldbtn" data-fold="info"
                style="background:none;border:none;color:#c0c8d0;cursor:pointer;font-size:11px;padding:0 4px;line-height:1;" title="折叠/展开">—</button>
              <button id="mic-close" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:13px;padding:0 2px;flex-shrink:0;" title="关闭卡片">✕</button>
            </div>
          </div>
          <div class="map-ext-fold-body mic-body" data-foldbody="info" style="padding:8px 10px;font-size:11px;color:#d0d8e0;max-height:38vh;overflow-y:auto;">
            <div style="color:var(--text-muted);text-align:center;padding:14px 6px;">点击地图任意国家/地区<br>查看其实时状态与相关事件</div>
          </div>
          <div class="mic-footer" style="display:none;border-top:1px solid #2a3548;padding:4px 10px;">
            <button class="mic-zoom-btn" style="width:100%;padding:4px 8px;background:rgba(60,45,30,0.8);border:1px solid #6a5030;border-radius:3px;color:#f0d8a8;font-size:10px;cursor:pointer;">🔍 双击区域 = 自动缩放居中</button>
          </div>
        </div>
      </div>
    `;
  };

  /* --- 把扩展面板注入到 map-page 和 map-overlay-page ---
       策略：不通过字符串替换 HTML，而是挂 openMapPage() / _bindMapPostRender() 的 DOM 钩子
       在 canvas 之后注入（保证绝对定位层叠正确） --- */
  const _origOpenMapPage = UIp.openMapPage ? UIp.openMapPage : null;
  UIp.openMapPage = function () {
    const self = this;
    // FIX: 打开地图前强制关闭所有事件弹窗/modal，避免挡住地图
    try {
      const selectors = [
        '#event-modal.active', '.event-modal.active', '.modal.active',
        '.event-overlay.active', '.overlay.active'
      ];
      selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
          if (el.classList) el.classList.remove('active');
          if (el.style) el.style.display = 'none';
        });
      });
      // 关闭后点击背景时事件弹窗也会隐藏，我们直接手动触发一次 UI 的关闭逻辑（如果存在）
      if (self && typeof self.toast === 'function') {
        /* no-op, 不主动 toast (避免打断) */
      }
    } catch (_) { /* ignore */ }

    if (_origOpenMapPage) _origOpenMapPage.call(self);
    // FIX: overlay 注入完成后 再额外关掉一次 弹窗 + 调高 map-overlay-page z-index
    setTimeout(() => {
      try {
        document.querySelectorAll('#event-modal, .event-modal, .modal').forEach(el => {
          if (el.style) el.style.display = 'none';
          if (el.classList) el.classList.remove('active');
        });
        const ov = document.getElementById('map-overlay-page');
        if (ov) {
          ov.style.display = '';
          ov.style.zIndex = Math.max(1000, parseInt(getComputedStyle(ov).zIndex || '0') || 1000);
        }
      } catch (_) {}
      self._injectMapExtensionDOM();
    }, 280);
    setTimeout(() => {
      try {
        const ov = document.getElementById('map-overlay-page');
        if (ov) ov.style.zIndex = Math.max(1200, parseInt(getComputedStyle(ov).zIndex || '0') || 1200);
        document.querySelectorAll('#event-modal, .event-modal').forEach(el => { if (el.style) el.style.display = 'none'; });
      } catch (_) {}
      self._injectMapExtensionDOM();
      self._bindMapExtensionEvents();
    }, 900);
  };

  // 原版 renderMap() 是导航tab: 显示/隐藏 content 中的 tab，同样需要后注入
  UIp._injectMapExtensionDOM = function () {
    const self = this;
    const panels = [
      // 全屏地图 overlay: 插入到 .map-overlay-stage 开头 (stage应为 relative 容器)
      { parent: document.querySelector('.map-overlay-stage'), pos: 'afterbegin' },
      // 常规tab内地图: 插入到 .map-container 前面 (map-page 同级绝对定位)
      { parent: document.querySelector('.map-page'), pos: 'afterbegin' },
      { parent: document.querySelector('#map-page-root'), pos: 'afterbegin' }
    ];
    let injected = 0;
    for (const p of panels) {
      if (!p.parent) continue;
      // 避免重复注入
      if (p.parent.querySelector('.map-ext-panel, .map-ext-tl, .map-info-card')) continue;
      try {
        const html = this._renderMapExtensionPanel();
        p.parent.insertAdjacentHTML(p.pos, html);
        injected++;
      } catch (e) { console.warn('[MapExt] DOM注入失败:', e && e.message); }
    }
    if (injected > 0) {
      // 重新绑定扩展事件 (面板现在存在了)
      this._bindMapExtensionEvents();
      // 尝试把 canvas 容器的 position 设为 relative 确保子元素绝对定位层级正确
      ['.map-overlay-stage', '.map-page', '#map-page-root', '.map-container'].forEach(sel => {
        const el = document.querySelector(sel);
        if (el && getComputedStyle(el).position === 'static') el.style.position = 'relative';
      });
    }
    return injected;
  };

  /* --- 信息卡片数据填充 (RegionState + Game.state) --- */
  UIp._populateMapInfoCard = function (regionId, feature) {
    const card = document.getElementById('map-info-card');
    if (!card) return;
    const self = this;
    card.style.display = 'block';
    const titleEl = card.querySelector('.mic-title');
    const idEl = card.querySelector('.mic-id');
    const bodyEl = card.querySelector('.mic-body');
    const footEl = card.querySelector('.mic-footer');

    const s = Game.state || {};
    const zh = (feature && feature.zh) || (typeof SVGMap !== 'undefined' && SVGMap.prototype && SVGMap.prototype._getCountryName &&
      (function(){ try { return (new SVGMap(document.createElement('canvas')))._getCountryName(regionId); }catch(_){return null;}})()) || regionId;
    if (titleEl) titleEl.textContent = zh;
    if (idEl) idEl.textContent = 'ID: ' + regionId;

    // 获取RegionState (若无 provider, 从 NationSim / state 拼一个 fallback)
    let rs = null;
    const mapInst = self._svgMapInstance;
    if (mapInst && mapInst.getRegionState) rs = mapInst.getRegionState(regionId);
    // fallback
    if (!rs) rs = self._fallbackRegionState(regionId);

    const controllerName = rs.controller ? (self._factionShort(rs.controller) || rs.controller) : '未知';
    const factionColor = (typeof SVGMap !== 'undefined' && SVGMap.getFactionColor && SVGMap.getFactionColor(rs.controller || regionId))
      || { fill: '#3a4a5a', border: '#1e2a35' };

    const stabilityPct = Math.round(rs.stability == null ? 50 : rs.stability);
    const tensionPct = Math.round(rs.tension == null ? 0 : rs.tension);
    const russiaPct = Math.round(rs.russiaUnifyProgress == null ? 0 : rs.russiaUnifyProgress);

    const pctBar = (v, colLow, colHigh, label) => {
      v = Math.max(0, Math.min(100, v));
      const bg = (x) => { const t = x/100; return 'linear-gradient(90deg,'+colLow+' 0%,'+colHigh+' 100%)'; };
      return `<div style="margin:2px 0 8px;">
        <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text-muted);margin-bottom:2px;">
          <span>${label}</span><span>${v}/100</span>
        </div>
        <div style="height:7px;background:rgba(0,0,0,0.4);border-radius:3px;overflow:hidden;border:1px solid #1a1a22;">
          <div style="width:${v}%;height:100%;background:${bg(v)};transition:width 0.3s;"></div>
        </div>
      </div>`;
    };

    const relation = s.relations && (s.relations[regionId] != null ? s.relations[regionId] : null);
    const relCls = relation == null ? 'var(--text-muted)' : relation <= -40 ? '#d85050' : relation <= -10 ? '#d08040' : relation <= 10 ? 'var(--text-muted)' : relation <= 40 ? '#60c080' : '#d0c060';
    const relText = relation == null ? '—' : relation <= -40 ? `敌对 (${relation})` : relation <= -10 ? `冷淡 (${relation})` : relation <= 10 ? `中立 (${relation})` : relation <= 40 ? `友好 (+${relation})` : `盟友 (+${relation})`;

    // 查找该区域最近事件
    const recentEvents = self._findRecentEventsFor(regionId, 3);
    const eventHtml = (recentEvents && recentEvents.length) ? `<div style="margin-top:10px;">
      <div style="font-size:9px;color:var(--accent-gold);letter-spacing:0.08em;margin-bottom:4px;">最近相关事件</div>
      ${recentEvents.map(e => `<div style="padding:5px 8px;margin-bottom:4px;background:rgba(255,220,160,0.06);border-left:2px solid #8a7a3a;border-radius:2px;font-size:10px;line-height:1.5;">
        <div style="color:var(--accent-gold);font-size:9px;">${Game.getDateStr ? Game.getDateStr(e.turn||1) : ('第'+(e.turn||1)+'回合')}</div>
        <div style="color:#d8d0b8;margin-top:1px;">${(e.title||e.text||'').substring(0,60)}</div>
        ${e.id ? `<button data-event-jump="${e.id}" style="margin-top:3px;padding:1px 6px;background:rgba(50,40,20,0.7);border:1px solid #6a5030;border-radius:2px;color:#e0c890;font-size:9px;cursor:pointer;">📜 查看详情 →</button>` : ''}
      </div>`).join('')}
    </div>` : '<div style="margin-top:8px;font-size:10px;color:var(--text-muted);">近期未触发与此区域相关的重要事件</div>';

    const tags = [];
    if (rs.civilWar) tags.push(`<span style="padding:1px 6px;background:rgba(160,30,30,0.3);border:1px solid #a03030;color:#f0a090;border-radius:10px;font-size:9px;">⚔️ 内战中</span>`);
    if (rs.hotspot) tags.push(`<span style="padding:1px 6px;background:rgba(255,200,100,0.25);border:1px solid #c09040;color:#ffd8a0;border-radius:10px;font-size:9px;">🔆 事件热点</span>`);

    bodyEl.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;padding-bottom:10px;border-bottom:1px dashed #2a3548;">
        <span style="display:inline-block;width:28px;height:20px;background:${factionColor.fill};border:1px solid ${factionColor.border};border-radius:2px;flex-shrink:0;"></span>
        <div style="flex:1;min-width:0;">
          <div style="font-size:11px;color:var(--text-muted);">当前控制者</div>
          <div style="font-size:13px;color:#f0e8c8;">${controllerName}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:11px;color:var(--text-muted);">对德关系</div>
          <div style="font-size:12px;color:${relCls};font-weight:bold;">${relText}</div>
        </div>
      </div>

      ${tags.length ? `<div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:8px;">${tags.join('')}</div>` : ''}

      ${pctBar(stabilityPct, '#8b1a1a', '#1a5a2a', '稳定度')}
      ${pctBar(tensionPct,   '#2a3a4a', '#b01818', '军事紧张度')}
      ${regionId && (regionId.toLowerCase().includes('russia') || regionId.toLowerCase().includes('moscow') || regionId.toLowerCase().includes('sverdlovsk') || regionId.toLowerCase().includes('krasnoyarsk') || regionId.toLowerCase().includes('leningrad') || regionId.toLowerCase().includes('stalingrad') || regionId.toLowerCase().includes('ostland') || regionId.toLowerCase().includes('ukraine') || regionId.toLowerCase().includes('caucasus') || regionId.toLowerCase().includes('belarus'))
        ? pctBar(russiaPct, '#4a4a5a', '#a83232', '俄罗斯统一进度') : ''}

      ${eventHtml}
    `;

    if (footEl) { footEl.style.display = 'block'; footEl.querySelector('.mic-zoom-btn').onclick = () => {
      if (mapInst && mapInst.zoomToFeature) mapInst.zoomToFeature(regionId);
    }; }

    // 事件详情跳转
    bodyEl.querySelectorAll('[data-event-jump]').forEach(btn => {
      btn.onclick = () => {
        const eid = btn.getAttribute('data-event-jump');
        if (eid) self._openEventDetail(eid);
      };
    });

    // 关闭按钮
    const closeBtn = document.getElementById('mic-close');
    if (closeBtn && !closeBtn._micBound) {
      closeBtn._micBound = true;
      closeBtn.addEventListener('click', () => { card.style.display = 'none'; });
    }
  };

  UIp._factionShort = function (id) {
    if (!id) return null;
    const m = {
      ger: '德国', germany: '德国', ofn: '美国 (OFN)', usa: '美国',
      japan: '日本', jpn: '日本', italy: '意大利', ita: '意大利',
      burgundy: '勃艮第', iberia: '伊比利亚', russia: '俄罗斯',
      triumvirate: '三头同盟', geacs: '共荣圈', einheitspakt: '轴心国集团'
    };
    return m[id.toLowerCase()] || id[0].toUpperCase() + id.substring(1);
  };

  // RegionState fallback: 直接从 Game.state 推一个模拟
  UIp._fallbackRegionState = function (regionId) {
    const s = Game.state || {};
    const f = s.flags || {};
    const rz = (regionId || '').toLowerCase();

    // 根据国家类型给个稳定度模拟
    let stability = 70, tension = 25, controller = regionId, russia = 0, civil = false, hotspot = false;

    // 阵营推断 (与 svg_map.js 的 getFactionColor 映射)
    const factionMap = [
      { r: /germany|reich|deuts|german|ostland|ukraine|moscow|belarus|caucasus|austria|czech|slovak|poland|hungary|romania|bulgaria|albania|serbia|croatia|greece|yugoslav|sloveni|bosnia|macedon|monten|nether|belgium|luxem|denmark|norway|iceland|sweeden|sweden|finland|turkey|ottoman|georgia|armenia|azerbai|estonia|latvia|lithua/, c: 'ger' },
      { r: /france|vichy|free_fr|iberia|spain|portugal|andorra|monaco|switzer|liech|vatican|san_mar/, c: 'ger' },
      { r: /burgund|himmler/, c: 'burgundy' },
      { r: /italy|malt|cyprus|tunisia|algeria|libya|egypt|ethiopia|somalia|eritrea|italian_sr|san_marino|monaco|switzerland|austri/, c: 'italy' },
      { r: /usa|canada|newfou|labrad|greenland|faroes|cuba|jamaica|haiti|domin|puerto|bahama|trinidad|barbados|liberia|panama|costa_rica|nicara|hondu|guatem|salvad|belize|mexico|colomb|venez|guyana|surina|ecuador|peru|bolivia|parag|urugu|argen|chile|brazil|australia|new_zea|papua|pacific/, c: 'ofn' },
      { r: /japan|korea|manchuria|manchu|china|roc|prc|india|pakistan|nepal|bhutan|sri_lanka|bangla|afghan|iran|iraq|syria|jordan|saudi|yemen|oman|kuwait|qatar|bahrain|uae|israel|palest|malaya|indonesia|philipp|vietna|thaila|laos|cambod|burma/, c: 'japan' },
      { r: /russia|sverdlovsk|krasnoyarsk|leningrad|stalingrad|kazakh|uzbek|turkmen|tajik|kirgiz|moscow|ostland|ukraine|caucasus|belarus/, c: 'russia' },
      { r: /africa|sudan|somali|eritre|ethiop|kenya|tanzan|uganda|rwanda|burundi|malawi|zambia|zimba|botswana|lesoth|swazi|namibi|south_af|angola|mozamb|mada|zaire|congo_b|camer|gabon|centra|niger|mali|senega|guinea|liberia|ivory|sierra|ghana|nigeria|togo|benin|burkina|chad|maurit|morocc|algeria|tunis|libya|egypt/, c: 'ger' },
    ];
    for (const fm of factionMap) if (fm.r.test(rz)) { controller = fm.c; break; }

    // 内战判断
    if ((controller === 'ger' || rz.match(/germany|reich/)) && (f.civil_war_imminent || f.civil_war_over === false) && f.civil_war_started) civil = true;
    if (rz.match(/iberia|spain|portugal/) && f.iberian_collapse) civil = true;
    if (rz.match(/russia|moscow|sverdlovsk|krasnoyarsk|leningrad|stalingrad/) && !f.russia_democratic && !f.russia_communist && !f.russia_fascist && !f.russia_madman && !f.russia_monarchist) {
      // 分裂期 -> 高紧张
      tension = 70; stability = 40;
    }
    if (f.russia_monarchist || f.russia_democratic || f.russia_communist || f.russia_fascist || f.russia_madman) {
      russia = rz.match(/moscow|central_russia|russia/) ? 100 : 70;
    }

    // 最近事件热点判断
    const evs = this._findRecentEventsFor(regionId, 1);
    if (evs && evs.length) hotspot = true;

    // 随机一点扰动避免都是固定值
    const noise = (k) => { let h = 0; for (let i=0;i<regionId.length;i++) h = (h*31 + regionId.charCodeAt(i)) >>> 0; return ((h >> k) & 31); };
    stability = Math.max(5, Math.min(99, stability - noise(3) + noise(7)));
    tension   = Math.max(0, Math.min(100, tension + noise(5) - noise(2)));

    return { controller, stability, tension, russiaUnifyProgress: russia, civilWar: civil, hotspot: hotspot, faction: controller };
  };

  UIp._findRecentEventsFor = function (regionId, limit) {
    try {
      const evLog = (Game.state && Game.state.eventLog) || (EventBus && EventBus.log) || [];
      if (!evLog || !evLog.length) return [];
      const rz = regionId.toLowerCase();
      const matches = [];
      for (let i = evLog.length - 1; i >= 0 && matches.length < (limit || 3); i--) {
        const ev = evLog[i];
        const text = (ev.title || ev.text || ev.id || '').toLowerCase();
        if (text.includes(rz)) matches.push(ev);
        else if (ev.regions && Array.isArray(ev.regions) && ev.regions.some(r => r.toLowerCase() === rz)) matches.push(ev);
        else if (ev.regionId === regionId) matches.push(ev);
        else {
          // 用国家别称再查一次
          const alias = (this._getCountryAlias && this._getCountryAlias(regionId)) || [];
          if (alias.some(a => text.includes(a.toLowerCase()))) matches.push(ev);
        }
      }
      return matches;
    } catch (_) { return []; }
  };

  UIp._openEventDetail = function (eventId) {
    const evLog = (Game.state && Game.state.eventLog) || [];
    const ev = evLog.find(x => x.id === eventId);
    if (!ev) { this.toast('事件详情未找到', 'error'); return; }
    const html = `
      <div style="margin-bottom:8px;font-size:10px;color:var(--accent-gold);">${Game.getDateStr ? Game.getDateStr(ev.turn||1) : '第'+(ev.turn||1)+'回合'}</div>
      <div style="font-family:var(--font-serif);font-size:16px;color:var(--accent-gold-bright);margin-bottom:10px;letter-spacing:0.05em;">${ev.title || ''}</div>
      <div style="font-size:12px;color:#d0d8e0;line-height:1.7;">${ev.text || ev.desc || ''}</div>
      ${ev.choices && ev.choices.length ? `<div style="margin-top:12px;border-top:1px dashed #3a4a5a;padding-top:10px;">
        <div style="font-size:10px;color:var(--text-muted);margin-bottom:6px;">历史选择：</div>
        <div style="font-size:11px;color:#c8d0a0;padding:5px 8px;background:rgba(100,120,60,0.2);border:1px solid #6a7a30;border-radius:3px;">
          ${ev.choices[ev._chosen || 0] ? (ev.choices[ev._chosen].text || ev.choices[ev._chosen]) : (ev.choices[0] && (ev.choices[0].text || ev.choices[0]))}
        </div>
      </div>` : ''}
    `;
    this.showModal(`事件档案 · #${eventId.substring(0,8)}`, html);
  };

  /* --- 绑定扩展面板事件 (独立函数，供DOM注入后即时调用) --- */
  UIp._bindMapExtensionEvents = function () {
    const self = this;
    const mapInst = self._svgMapInstance;
    if (!mapInst) {
      setTimeout(() => self._bindMapExtensionEvents(), 300);
      return;
    }

    // 着色模式
    document.querySelectorAll('.map-cm-item').forEach(btn => {
      if (btn._boundCm) return; btn._boundCm = true;
      btn.addEventListener('click', () => {
        const cm = btn.getAttribute('data-cm');
        document.querySelectorAll('.map-cm-item').forEach(x => {
          x.classList.remove('active');
          x.style.borderColor = '#2a3548';
          x.style.boxShadow = 'none';
          x.querySelector(':scope > div').style.color = '#c0c8d0';
          x.querySelector(':scope > div').style.fontWeight = 'normal';
        });
        btn.classList.add('active');
        btn.style.borderColor = '#a83232';
        btn.style.boxShadow = '0 0 0 1px #a83232 inset';
        btn.querySelector(':scope > div').style.color = '#f0e0c0';
        btn.querySelector(':scope > div').style.fontWeight = 'bold';
        if (mapInst.setColorMode) mapInst.setColorMode(cm);
      });
    });

    // 图层开关
    document.querySelectorAll('[data-layer-chk]').forEach(chk => {
      if (chk._boundL) return; chk._boundL = true;
      chk.addEventListener('change', async function () {
        const id = chk.getAttribute('data-layer-chk');
        const on = chk.checked;
        const layer = (mapInst.layers && mapInst.layers[id]);
        if (!layer || !layer.loaded) {
          chk.disabled = true;
          const parent = chk.closest('.map-layer-item');
          let orig = null;
          if (parent) {
            const sp = parent.querySelector('span:last-child');
            if (sp) { orig = sp.textContent; sp.textContent = '加载中…'; }
          }
          const ok = await mapInst.loadLayer(id);
          chk.disabled = false;
          if (parent) {
            const sp = parent.querySelector('span:last-child');
            if (sp && orig) sp.textContent = orig;
          }
          if (!ok) { chk.checked = false; if (self.toast) self.toast('图层加载失败', 'error'); return; }
          mapInst.setLayer(id, true);
          return;
        }
        mapInst.setLayer(id, on);
      });
    });

    // 快速区域
    document.querySelectorAll('.map-area-btn').forEach(btn => {
      if (btn._boundA) return; btn._boundA = true;
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-area');
        if (id === 'global') { mapInst.zoomToFit && mapInst.zoomToFit(); return; }
        const candidates = {
          europe:  ['germany','burgundy','france','italy','uk','spain','iberia'],
          east:    ['ostland','reichskommissariat_moscow','reichskommissariat_ukraine','moscow','sverdlovsk','krasnoyarsk','leningrad'],
          america: ['usa','canada','mexico','brazil','argentina'],
          asia:    ['japan','china','manchuria','india','korea','thailand','indonesia','australia'],
          afrika:  ['south_africa','egypt','nigeria','ethiopia','congo','algeria','morocco']
        };
        const ids = candidates[id] || [];
        let fitFirst = null;
        for (const rid of ids) {
          if (mapInst.featureIndex && mapInst.featureIndex.has(rid)) { fitFirst = rid; break; }
        }
        if (fitFirst) { mapInst.zoomToFeature && mapInst.zoomToFeature(fitFirst, 0.7); }
        else mapInst.zoomToFit && mapInst.zoomToFit();
      });
    });

    // Dev模式
    const devChk = document.getElementById('map-dev-toggle');
    if (devChk && !devChk._boundDev) {
      devChk._boundDev = true;
      devChk.addEventListener('change', () => {
        if (mapInst.setDevMode) mapInst.setDevMode(devChk.checked);
      });
      // 开发者模式自动开启地图调试
      try {
        const gm = (typeof GAME_MODES !== 'undefined' && Game && Game.state)
          ? GAME_MODES[Game.state.gameMode] : null;
        if (gm && gm.godMode && !gm.chaosStabilityJitter) {
          devChk.checked = true;
          if (mapInst.setDevMode) mapInst.setDevMode(true);
        }
      } catch(e) {}
    }

    // ===================== 新增：折叠按钮 / 全局面板显隐 =====================
    // 单面板折叠 (— 按钮)
    document.querySelectorAll('.map-ext-foldbtn').forEach(btn => {
      if (btn._boundFold) return; btn._boundFold = true;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const key = btn.getAttribute('data-fold');
        if (!key) return;
        const body = document.querySelector(`[data-foldbody="${key}"]`);
        if (!body) return;
        const hidden = body.style.display === 'none';
        body.style.display = hidden ? '' : 'none';
        btn.textContent = hidden ? '—' : '+';
      });
    });

    // 全局面板显隐按钮 (⊟ 面板显隐) - 一键隐藏/显示所有扩展面板
    const toggleBtn = document.getElementById('map-toggle-all-panels');
    if (toggleBtn && !toggleBtn._boundToggleAll) {
      toggleBtn._boundToggleAll = true;
      const panelSelectors = [
        '[data-extblock="color"]',
        '[data-extblock="tl"]',
        '[data-extblock="info"]'
      ];
      // 记忆上次状态
      let panelsHidden = false;
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        panelsHidden = !panelsHidden;
        for (const sel of panelSelectors) {
          const p = document.querySelector(sel);
          if (p) p.style.display = panelsHidden ? 'none' : '';
        }
        toggleBtn.textContent = panelsHidden ? '⊞ 显示面板' : '⊟ 隐藏面板';
        toggleBtn.style.color = panelsHidden ? '#e0f0ff' : '#ffe0a0';
        toggleBtn.style.borderColor = panelsHidden ? '#3a6a8a' : '#8a5a30';
        toggleBtn.style.background = panelsHidden ? 'rgba(20,35,55,0.95)' : 'rgba(40,25,20,0.95)';
        if (self.toast) self.toast(panelsHidden ? '已隐藏所有面板（纯地图视图）' : '已恢复显示所有面板', 'info');
      });
      // ESC 键 = 也触发面板显隐（与 ESC 关地图 overlay 解耦：只在打开地图 overlay 时生效）
      if (!document._mapExtEscBound) {
        document._mapExtEscBound = true;
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && toggleBtn && toggleBtn.isConnected) {
            const overlay = document.getElementById('map-overlay-page');
            const mapPage = document.getElementById('map-page');
            const mapOpen = (overlay && getComputedStyle(overlay).display !== 'none') ||
                            (mapPage && getComputedStyle(mapPage).display !== 'none');
            if (mapOpen) {
              // 只在面板没全部隐藏时才触发（保留原有ESC关地图的优先级）
              if (panelsHidden) return;
              toggleBtn.click();
              e.preventDefault();
              e.stopPropagation();
            }
          }
        }, true);
      }
    }

    // RegionState Provider 与 click→信息卡片 / dblclick hook
    if (!self._mapExtEventsBound) {
      self._mapExtEventsBound = true;
      if (mapInst.setRegionStateProvider) {
        mapInst.setRegionStateProvider((rid) => self._fallbackRegionState(rid));
      }
      if (mapInst.on) {
        mapInst.on('click', (evt) => {
          if (evt && evt.regionId) self._populateMapInfoCard(evt.regionId, evt.feature);
        });
        mapInst.on('dblclick', (evt) => {
          if (evt && evt.regionId) {
            setTimeout(() => self._populateMapInfoCard(evt.regionId, evt.feature), 220);
            if (self.toast) self.toast('已缩放至该区域', 'info');
          }
        });
      }
    }
  };

  /* --- 嵌入到 _bindMapPostRender 末尾执行 --- */
  const _origBind = UIp._bindMapPostRender;
  UIp._bindMapPostRender = function () {
    const self = this;
    _origBind.call(self);

    // 确保扩展面板和事件绑定有机会执行 (即使 openMapPage 先跑)
    setTimeout(() => {
      self._injectMapExtensionDOM();
    }, 300);
    setTimeout(() => {
      self._injectMapExtensionDOM();
      self._bindMapExtensionEvents();
    }, 1200);
  };
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
