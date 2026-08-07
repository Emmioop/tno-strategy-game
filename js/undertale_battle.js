// ===== Undertale 风格 Boss 战引擎 =====
// 独立 mini-boss 系统，用于趣味模式
(function() {
  'use strict';

  const BOSSES = {
    hitler: {
      id: 'hitler',
      name: '垂死的元首',
      title: '帝国守护者 (垂死)',
      maxHp: 80,
      atk: 8,
      def: 2,
      mercyThreshold: 30,
      color: '#a83232',
      difficulty: '★☆☆☆☆',
      sprite: '💀',
      introText: '* 空气变得沉重...\n* 一个颤抖的声音说: "你...你为什么要这样做..."',
      actCheck: '* 他看起来病得很重。手臂无力地颤抖着。',
      actEncourage: '* "我的...我的梦想...破灭了..." 他开始哭泣。\n* (MERCY 上升了)',
      actFlirt: '* 他看起来很困惑。\n* "你...是奥伯萨鲁？"',
      onKillText: '* 垂死的元首倒下了。\n* 千年的噩梦终于结束。',
      onSpareText: '* 你放过了他。\n* 他看起来很惊讶...然后轻声说: "谢谢..."',
      patterns: ['speech', 'hand_raise'],
      rewardKill: { militaryPower: 30, stability: 10, deterrence: 10 },
      rewardSpare: { stability: 20, ofn: 8, manpower: 5 },
      rewardFlee: { stability: -5 },
      pacifistLabel: '忏悔',
      anim: { breatheFreq: 2.2, breatheAmp: 0.04, swayFreq: 3.5, swayAmp: 2.5, rotAmp: 0 },
    },
    himmler: {
      id: 'himmler',
      name: '勃艮第之主',
      title: '黑骑士团团长',
      maxHp: 140,
      atk: 12,
      def: 4,
      mercyThreshold: 80,
      color: '#2a2a2a',
      difficulty: '★★★☆☆',
      sprite: '🖤',
      introText: '* 一只冷酷的眼睛从阴影中审视着你。\n* "你知道得太多了..."',
      actCheck: '* 他穿着黑色皮夹克，胸前别着骷髅徽章。',
      actThreaten: '* "勃艮第的眼睛无处不在..." 他压低了声音。\n* (MERCY 上升了)',
      actJoke: '* "哈哈哈哈..." 他的笑容让你脊背发凉。',
      onKillText: '* 勃艮第之主倒下了。\n* 但黑夜的阴影还会徘徊很久。',
      onSpareText: '* 你放过了他。\n* 他消失在阴影中。你有一种不祥的预感...',
      patterns: ['grid', 'sieg_heil', 'grid'],
      rewardKill: { militaryPower: 40, stability: 5, deterrence: 25 },
      rewardSpare: { stability: 15, burgundy_relation: 15 },
      rewardFlee: { stability: -10 },
      pacifistLabel: '饶过',
      anim: { breatheFreq: 0.9, breatheAmp: 0.05, swayFreq: 1.8, swayAmp: 1.5, rotAmp: 3 },
    },
    goebbels: {
      id: 'goebbels',
      name: '帝国喇叭',
      title: '宣传机器',
      maxHp: 100,
      atk: 15,
      def: 1,
      mercyThreshold: 15,
      color: '#b8860b',
      difficulty: '★★★★☆',
      sprite: '🎤',
      introText: '* 一个尖锐的声音响彻大厅。\n* "谎言！一切都是谎言！"',
      actCheck: '* 他的眼睛里充满疯狂。右手不停地颤抖。',
      actDebunk: '* "你说的...都是真的吗?" 他愣住了。\n* (MERCY 大幅上升！)',
      actYellBack: '* "你敢！" 他被激怒了，攻击力上升！',
      onKillText: '* 宣传机器停止了它的叫喊。\n* 世界安静了下来。',
      onSpareText: '* "也许...你是对的..." 他低下了头。',
      patterns: ['random', 'speech', 'random'],
      rewardKill: { militaryPower: 25, stability: 15, research: 20 },
      rewardSpare: { stability: 25, research: 10 },
      rewardFlee: { stability: -5 },
      pacifistLabel: '闭嘴',
      anim: { breatheFreq: 3.0, breatheAmp: 0.07, swayFreq: 4.2, swayAmp: 4, rotAmp: 5 },
    },
    rommel: {
      id: 'rommel',
      name: '沙漠之狐',
      title: '北非传奇',
      maxHp: 160,
      atk: 10,
      def: 6,
      mercyThreshold: 100,
      color: '#8b7355',
      difficulty: '★★★☆☆',
      sprite: '🦊',
      introText: '* 一位儒雅的军官轻轻拔出了手枪。\n* "我本不想走到这一步..."',
      actCheck: '* 他看起来很疲惫。沙漠的风沙雕刻了他的脸。',
      actRespect: '* "你是个可敬的对手..." 他点头示意。\n* (MERCY 上升了)',
      actMock: '* "沙漠里没有懦夫的位置！" 他被激怒了。',
      onKillText: '* 沙漠之狐倒下了。\n* 狐狸回到了沙漠。',
      onSpareText: '* "我们...打个平手吧。" 他收起手枪。',
      patterns: ['blitz', 'blitz', 'grid'],
      rewardKill: { militaryPower: 50, deterrence: 15 },
      rewardSpare: { stability: 20, manpower: 15, italy_relation: 10 },
      rewardFlee: { stability: -8 },
      pacifistLabel: '撤退',
      anim: { breatheFreq: 1.0, breatheAmp: 0.04, swayFreq: 1.5, swayAmp: 1, rotAmp: 1 },
    },
    speer: {
      id: 'speer',
      name: '帝国建筑师',
      title: '蓝图大师',
      maxHp: 120,
      atk: 6,
      def: 8,
      mercyThreshold: 90,
      color: '#556b2f',
      difficulty: '★★☆☆☆',
      sprite: '🏛️',
      introText: '* 他正在画图纸。\n* "等等我...画完这一笔..."',
      actCheck: '* 他的手很稳，眼神专注得可怕。',
      actAppreciate: '* "你能欣赏美...?" 他微笑。\n* (MERCY 上升了)',
      actDemand: '* "你毁了我一辈子的作品！" 他突然发怒！',
      onKillText: '* 图纸散落在地。\n* 一座永远不会建成的城市，就这样消失了。',
      onSpareText: '* "也许...艺术不应该服务于疯狂。"',
      patterns: ['geometric', 'grid'],
      rewardKill: { research: 30, militaryPower: 15 },
      rewardSpare: { research: 40, stability: 10 },
      rewardFlee: { stability: -3 },
      pacifistLabel: '和解',
      anim: { breatheFreq: 1.2, breatheAmp: 0.03, swayFreq: 2.0, swayAmp: 0.8, rotAmp: 0 },
    },
    himmler_sp: {
      id: 'himmler_sp',
      name: '真结局·黑领主',
      title: '★ 真实结局 ★',
      maxHp: 200,
      atk: 20,
      def: 5,
      mercyThreshold: 150,
      color: '#4a0080',
      difficulty: '★★★★★',
      sprite: '👁️',
      introText: '* 时间似乎静止了...\n* "你知道吗...我也可以做个好人..."',
      actCheck: '* 他在颤抖。不是因为冷。',
      actForgive: '* "真的...真的可以吗?" 他哭了。\n* (MERCY 满了！)',
      actReject: '* "那就...一起下地狱吧！"',
      onKillText: '* 黑领主倒在地上。\n* "也许...这样也好..."',
      onSpareText: '* 他站在你面前...带着一丝微笑。\n* "谢谢。这是我第一次选择活下去。"',
      patterns: ['random', 'sieg_heil', 'grid', 'speech'],
      rewardKill: { militaryPower: 60, stability: 30, deterrence: 40 },
      rewardSpare: { stability: 60, deterrence: 30, manpower: 30 },
      rewardFlee: { stability: -20 },
      pacifistLabel: '救赎',
      secret: true,
      anim: { breatheFreq: 0.5, breatheAmp: 0.06, swayFreq: 0.8, swayAmp: 3, rotAmp: 8 },
    },
  };

  // 玩家属性来源
  function getPlayerStats() {
    const r = (typeof Game !== 'undefined' && Game.state) ? Game.state.resources : {};
    const military = r.militaryPower || 10;
    const deterrence = r.deterrence || 10;
    const research = r.research || 10;
    return {
      maxHp: 100 + (Game ? (r.manpower || 20) : 0),
      atk: 8 + Math.floor(military / 20),
      def: 2 + Math.floor(deterrence / 25),
      lv: 1 + Math.floor(research / 20),
      gold: r.money || 100,
    };
  }

  // ===== 战斗状态 =====
  let _battle = null;

  // ===== 主入口：打开战斗 =====
  function openBossSelect() {
    closeBattle();
    const panel = document.createElement('div');
    panel.id = 'undertale-boss-select';
    panel.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:100050;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;font-family:"Courier New",monospace;';
    const regular = Object.values(BOSSES).filter(b => !b.secret);
    const secret = Object.values(BOSSES).filter(b => b.secret);
    let html = `
      <div style="text-align:center;margin-bottom:30px;">
        <div style="font-size:42px;margin-bottom:8px;">⚔️</div>
        <div style="font-size:28px;color:#ffcc00;letter-spacing:4px;">★ BOSS 选择 ★</div>
        <div style="font-size:12px;color:#888;margin-top:6px;">选一个对手狠狠干 — 打赢有大奖励</div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;max-width:640px;width:100%;padding:0 20px;">
    `;
    regular.forEach(b => {
      html += `
        <div class="ub-boss-card" data-boss="${b.id}" style="background:#1a1a1a;border:2px solid ${b.color};border-radius:6px;padding:14px;cursor:pointer;transition:all 0.15s;text-align:center;">
          <div style="font-size:32px;margin-bottom:6px;">${b.sprite}</div>
          <div style="font-size:13px;color:${b.color};font-weight:bold;">${b.name}</div>
          <div style="font-size:10px;color:#888;margin-top:2px;">${b.title}</div>
          <div style="font-size:10px;color:#666;margin-top:6px;">${b.difficulty}</div>
          <div style="font-size:10px;color:#aaa;margin-top:4px;">HP ${b.maxHp} · ATK ${b.atk} · DEF ${b.def}</div>
        </div>
      `;
    });
    html += `</div>`;
    if (secret.length) {
      html += `<div style="margin-top:18px;font-size:11px;color:#555;">—— 隐藏 BOSS ——</div><div style="display:flex;gap:12px;margin-top:8px;">`;
      secret.forEach(b => {
        html += `
          <div class="ub-boss-card" data-boss="${b.id}" style="background:#2a0040;border:2px solid ${b.color};border-radius:6px;padding:10px;cursor:pointer;text-align:center;opacity:0.8;">
            <div style="font-size:24px;">${b.sprite}</div>
            <div style="font-size:11px;color:${b.color};font-weight:bold;">${b.name}</div>
            <div style="font-size:9px;color:#888;margin-top:2px;">${b.difficulty}</div>
          </div>
        `;
      });
      html += `</div>`;
    }
    html += `<div style="margin-top:24px;"><button id="ub-close" style="background:#333;color:#aaa;border:1px solid #555;padding:8px 24px;border-radius:4px;cursor:pointer;font-family:inherit;">← 返回</button></div>`;
    panel.innerHTML = html;
    document.body.appendChild(panel);

    panel.querySelectorAll('.ub-boss-card').forEach(card => {
      card.onmouseenter = () => card.style.transform = 'scale(1.05)';
      card.onmouseleave = () => card.style.transform = 'scale(1)';
      card.onclick = () => {
        const bid = card.dataset.boss;
        panel.remove();
        startBattle(bid);
      };
    });
    document.getElementById('ub-close').onclick = () => panel.remove();
  }

  function closeBattle() {
    if (_battle) { _battle._animStop = true; }
    if (_battle && _battle.modal) _battle.modal.remove();
    _battle = null;
  }

  // ===== BOSS 呼吸/摆动动画 =====
  // 参考UT底层: image_angle = sin(time/1000*freq) * amp
  function startBossAnimation() {
    const b = _battle;
    if (!b) return;
    const sprite = b.modal.querySelector('#ub-enemy-sprite');
    if (!sprite) return;
    const anim = b.boss.anim || { breatheFreq: 1.5, breatheAmp: 0.04, swayFreq: 2.0, swayAmp: 2, rotAmp: 0 };
    const t0 = performance.now();
    function loop() {
      if (!_battle || _battle._animStop) return;
      const t = (performance.now() - t0) / 1000;
      const breathe = 1 + Math.sin(t * anim.breatheFreq * Math.PI * 2) * anim.breatheAmp;
      const swayY = Math.sin(t * anim.swayFreq * Math.PI * 2) * anim.swayAmp;
      const rot = Math.sin(t * anim.swayFreq * 0.7 * Math.PI * 2) * anim.rotAmp;
      sprite.style.transform = `translateY(${swayY}px) scale(${breathe}) rotate(${rot}deg)`;
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  // ===== 开始战斗 =====
  function startBattle(bossId) {
    const boss = BOSSES[bossId];
    if (!boss) return;
    const stats = getPlayerStats();

    _battle = {
      boss: boss,
      bossHp: boss.maxHp,
      player: {
        hp: stats.maxHp,
        maxHp: stats.maxHp,
        atk: stats.atk,
        def: stats.def,
        lv: stats.lv,
        gold: stats.gold,
        actLv: 0,
        mercy: 0,
      },
      phase: 'intro', // intro | player_turn | acting | enemy_turn | dialog | result
      bullets: [],
      soul: { x: 50, y: 145 },
      selectedBtn: 0,
      btnLabels: ['FIGHT', 'ACT', 'ITEM', 'MERCY'],
      ended: false,
      result: null,
    };

    const modal = document.createElement('div');
    modal.id = 'undertale-battle';
    modal.style.cssText = 'position:fixed;inset:0;background:#000;z-index:100060;display:flex;align-items:center;justify-content:center;font-family:"Courier New",monospace;color:#fff;';
    modal.innerHTML = buildBattleHTML();
    document.body.appendChild(modal);
    _battle.modal = modal;
    _battle._animStop = false;
    startBossAnimation();

    // 绑定按钮
    ['ub-fight', 'ub-act', 'ub-item', 'ub-mercy'].forEach((id, i) => {
      modal.querySelector('#' + id).onclick = () => onBtnPress(i);
    });
    modal.querySelector('#ub-close-x').onclick = () => {
      if (confirm('确定要逃跑吗？（稳定会有损失）')) {
        const bossRef = boss;
        _battle.ended = true;
        _battle.phase = 'result';
        applyReward(bossRef.rewardFlee || {}, 'flee');
        showResultModal('flee');
      }
    };

    showIntro();
  }

  function buildBattleHTML() {
    const b = _battle;
    return `
      <div id="ub-root" style="width:min(640px, 96vw, calc(100vh * 1.78));max-width:640px;background:#000;border:3px solid #fff;padding:clamp(10px, 2.5vw, 16px);box-sizing:relative;max-height:96vh;overflow-y:auto;">
        <!-- Boss 栏 -->
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;flex-wrap:wrap;gap:4px;">
          <div style="font-size:clamp(14px, 3vw, 16px);color:${b.boss.color};font-weight:bold;">${b.boss.name}</div>
          <div style="font-size:clamp(10px, 2.2vw, 12px);color:#888;">${b.boss.title}</div>
        </div>
        <div style="margin-bottom:8px;">
          <div style="background:#1a1a1a;height:16px;border:2px solid #fff;border-radius:2px;overflow:hidden;">
            <div id="ub-boss-hp" style="background:linear-gradient(90deg,#ff0000,#ff8800);height:100%;width:100%;transition:width 0.3s;"></div>
          </div>
          <div style="font-size:10px;margin-top:2px;text-align:right;color:#aaa;">${b.bossHp} / ${b.boss.maxHp}</div>
        </div>

        <!-- 敌人区（加大做攻击条目标区） -->
        <div style="background:#0a0a0a;border:2px solid #444;height:clamp(140px, 34vw, 200px);min-height:120px;display:flex;align-items:center;justify-content:center;margin-bottom:8px;position:relative;user-select:none;-webkit-user-select:none;touch-action:manipulation;">
          <div id="ub-enemy-sprite" style="font-size:clamp(48px, 14vw, 80px);color:${b.boss.color};filter:drop-shadow(0 0 20px ${b.boss.color});transition:filter 0.1s;">${b.boss.sprite}</div>
          <div id="ub-enemy-name" style="position:absolute;bottom:4px;right:8px;font-size:10px;color:#666;">${b.boss.difficulty}</div>
          <div id="ub-fight-hint" style="display:none;position:absolute;top:4px;left:50%;transform:translateX(-50%);font-size:12px;color:#ffcc00;letter-spacing:2px;text-shadow:0 0 6px #ffcc00;pointer-events:none;">TAP THE ENEMY! / SPACE</div>
        </div>

        <!-- 对话框 -->
        <div style="background:#1a1a2a;border:2px solid #444;padding:clamp(8px, 2vw, 12px);min-height:60px;margin-bottom:8px;">
          <div id="ub-dialog" style="font-size:clamp(12px, 2.8vw, 14px);line-height:1.5;color:#ddd;white-space:pre-wrap;"></div>
        </div>

        <!-- 战斗区域(弹幕) -->
        <div id="ub-bullet-area" style="background:#000;border:2px solid #0f0;height:clamp(140px, 30vw, 180px);margin-bottom:8px;position:relative;overflow:hidden;display:none;touch-action:none;">
          <canvas id="ub-canvas" style="position:absolute;inset:0;width:100%;height:100%;"></canvas>
        </div>

        <!-- 玩家栏 -->
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;flex-wrap:wrap;gap:4px;">
          <div style="font-size:clamp(11px, 2.6vw, 13px);">
            <span style="color:#ffcc00;">YOU</span>
            <span style="margin-left:10px;color:#aaa;">Lv.${b.player.lv}</span>
          </div>
          <div style="font-size:clamp(10px, 2.2vw, 12px);color:#aaa;">ATK ${b.player.atk} · DEF ${b.player.def}</div>
        </div>
        <div style="background:#1a1a1a;height:14px;border:2px solid #fff;border-radius:2px;overflow:hidden;margin-bottom:4px;">
          <div id="ub-player-hp" style="background:linear-gradient(90deg,#00ff00,#88ff00);height:100%;width:100%;transition:width 0.3s;"></div>
        </div>
        <div style="font-size:9px;margin-bottom:8px;color:#aaa;">HP ${b.player.hp} / ${b.player.maxHp}</div>

        <!-- MERCY 条 -->
        <div style="margin-bottom:8px;">
          <div style="background:#1a1a1a;height:8px;border:1px solid #888;border-radius:2px;overflow:hidden;">
            <div id="ub-mercy" style="background:#00ffff;height:100%;width:0%;transition:width 0.3s;"></div>
          </div>
          <div style="font-size:9px;margin-top:2px;color:#666;text-align:right;">MERCY ${b.player.mercy}/${b.boss.mercyThreshold}</div>
        </div>

        <!-- 按钮区 -->
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px;">
          ${['FIGHT','ACT','ITEM','MERCY'].map((l, i) => `
            <button id="ub-${l.toLowerCase()}" style="background:#000;border:2px solid #fff;color:#fff;padding:clamp(8px, 2vw, 12px) 4px;font-family:inherit;font-size:clamp(12px, 2.8vw, 15px);cursor:pointer;letter-spacing:2px;min-height:44px;" onmouseover="this.style.background='#fff';this.style.color='#000'" onmouseout="this.style.background='#000';this.style.color='#fff'">${l}</button>
          `).join('')}
        </div>

        <!-- 右上角关闭 -->
        <div id="ub-close-x" style="position:absolute;top:8px;right:12px;color:#888;cursor:pointer;font-size:16px;width:28px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:50%;">✕</div>
      </div>
    `;
  }

  function updateBattleUI() {
    if (!_battle) return;
    const b = _battle;
    b.modal.querySelector('#ub-boss-hp').style.width = (b.bossHp / b.boss.maxHp * 100) + '%';
    b.modal.querySelector('#ub-player-hp').style.width = (b.player.hp / b.player.maxHp * 100) + '%';
    b.modal.querySelector('#ub-mercy').style.width = Math.min(100, b.player.mercy / b.boss.mercyThreshold * 100) + '%';
  }

  function setDialog(text, cb) {
    const el = _battle.modal.querySelector('#ub-dialog');
    el.textContent = '';
    let i = 0;
    const speed = 30;
    function type() {
      if (!_battle) return;
      if (i < text.length) {
        el.textContent += text[i++];
        setTimeout(type, speed);
      } else if (cb) {
        setTimeout(cb, 100);
      }
    }
    type();
  }

  function showIntro() {
    const b = _battle;
    b.modal.querySelectorAll('[id^="ub-fight"],[id^="ub-act"],[id^="ub-item"],[id^="ub-mercy"]').forEach(x => x.disabled = true);
    setDialog(b.boss.introText, () => {
      b.phase = 'player_turn';
      b.modal.querySelectorAll('[id^="ub-fight"],[id^="ub-act"],[id^="ub-item"],[id^="ub-mercy"]').forEach(x => x.disabled = false);
    });
  }

  function onBtnPress(idx) {
    const b = _battle;
    if (!b || b.ended || b.phase !== 'player_turn') return;
    b.phase = 'acting';
    b.modal.querySelectorAll('[id^="ub-fight"],[id^="ub-act"],[id^="ub-item"],[id^="ub-mercy"]').forEach(x => x.disabled = true);

    switch (idx) {
      case 0: doFight(); break;
      case 1: doAct(); break;
      case 2: doItem(); break;
      case 3: doMercy(); break;
    }
  }

  // ===== FIGHT =====
  // UT原版攻击条 mini-game：白条在BOSS身上横向滑动，玩家按空格/点击停止
  // 停止位置决定伤害倍率 — 正中=PERFECT 1.5x, 两侧=GOOD 1.0x, 极端=MISS/0.5x
  // 基础伤害公式: Damage = max(1, ATK - DEF + random(-2, +2))
  function doFight() {
    const b = _battle;
    const enemyArea = b.modal.querySelector('#ub-enemy-sprite');
    if (!enemyArea) { finishFight(1.0); return; }
    const enemyBox = enemyArea.parentElement;
    const hint = b.modal.querySelector('#ub-fight-hint');

    // 让整个敌人区域都可以点击/触摸停止（覆盖层不拦截事件）
    enemyBox.style.position = 'relative';
    enemyBox.style.cursor = 'crosshair';

    // 创建攻击条 overlay（透明条 + 黄色中心标记 + 滑动白条）
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);height:16px;z-index:10;pointer-events:none;';
    const trackBg = document.createElement('div');
    trackBg.style.cssText = 'position:absolute;inset:0;background:rgba(255,255,255,0.08);';
    overlay.appendChild(trackBg);
    const centerMark = document.createElement('div');
    centerMark.style.cssText = 'position:absolute;left:50%;top:-8px;width:2px;height:32px;background:#ffcc00;transform:translateX(-50%);box-shadow:0 0 4px #ffcc00;';
    overlay.appendChild(centerMark);
    const slider = document.createElement('div');
    slider.style.cssText = 'position:absolute;left:0;top:-4px;width:8px;height:24px;background:#fff;box-shadow:0 0 8px #fff;';
    overlay.appendChild(slider);
    enemyBox.appendChild(overlay);

    // 显示提示
    if (hint) hint.style.display = 'block';

    let pos = 0;
    let dir = 1;
    let speed = 2.5;
    let stopped = false;

    const stop = (ev) => {
      if (stopped || !_battle) return;
      if (ev) ev.preventDefault();
      stopped = true;

      // 解绑所有监听器
      window.removeEventListener('keydown', onKey);
      enemyBox.removeEventListener('click', stop);
      enemyBox.removeEventListener('touchend', stop);
      enemyBox.style.cursor = '';
      overlay.remove();
      if (hint) hint.style.display = 'none';

      const distance = Math.abs(pos - 50);
      let multiplier, label, color;
      if (distance <= 3) { multiplier = 1.8; label = 'PERFECT!!'; color = '#ffcc00'; }
      else if (distance <= 8) { multiplier = 1.4; label = 'GREAT!'; color = '#44ff44'; }
      else if (distance <= 18) { multiplier = 1.0; label = 'GOOD'; color = '#88ccff'; }
      else if (distance <= 30) { multiplier = 0.6; label = 'BAD'; color = '#ff8844'; }
      else { multiplier = 0.3; label = 'MISS'; color = '#ff4444'; }

      enemyArea.style.filter = 'brightness(3)';
      setTimeout(() => { enemyArea.style.filter = `drop-shadow(0 0 20px ${b.boss.color})`; }, 120);

      const tag = document.createElement('div');
      tag.style.cssText = `position:absolute;top:24px;left:50%;transform:translateX(-50%);font-size:clamp(16px,4vw,24px);font-weight:bold;color:${color};text-shadow:0 0 8px ${color};pointer-events:none;z-index:11;letter-spacing:2px;`;
      tag.textContent = label;
      enemyBox.appendChild(tag);
      setTimeout(() => tag.remove(), 900);

      setTimeout(() => finishFight(multiplier, label), 500);
    };
    const onKey = e => {
      if (e.code === 'Space' || e.key === ' ' || e.key === 'Enter') { e.preventDefault(); stop(); }
    };

    // 绑定三类触发：键盘 / 鼠标点击 / 触摸
    window.addEventListener('keydown', onKey);
    enemyBox.addEventListener('click', stop);
    enemyBox.addEventListener('touchend', stop, { passive: false });

    function tick() {
      if (!_battle) { window.removeEventListener('keydown', onKey); overlay.remove(); return; }
      if (stopped) return;
      pos += dir * speed;
      if (pos >= 100) { pos = 100; dir = -1; }
      if (pos <= 0) { pos = 0; dir = 1; }
      slider.style.left = `calc(${pos}% - 4px)`;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function finishFight(multiplier, label) {
    const b = _battle;
    if (!b) return;
    // UT原版: Damage = max(1, ATK - DEF + random(-2, +2))
    const baseDmg = b.player.atk - b.boss.def + Math.floor(Math.random() * 5) - 2;
    let dmg = Math.max(1, Math.round(baseDmg * multiplier));

    let critText = '';
    if (label === 'PERFECT!!' && Math.random() < 0.25) {
      critText = '\n* ⚡ 暴击！';
      dmg = Math.round(dmg * 1.5);
    }

    b.bossHp = Math.max(0, b.bossHp - dmg);
    b.player.mercy = Math.max(0, b.player.mercy - (multiplier >= 1.4 ? 5 : 8));

    setDialog(`* 你攻击了 ${b.boss.name}！\n* ${label || ''} 造成 ${dmg} 点伤害！${critText}`.replace(/\n{2,}/g, '\n'), () => {
      updateBattleUI();
      if (b.bossHp <= 0) {
        onVictory('kill');
      } else {
        setTimeout(startEnemyTurn, 500);
      }
    });
  }

  // ===== ACT =====
  function doAct() {
    const b = _battle;
    if (!b) return;
    const label = b.boss.pacifistLabel || '交谈';
    const panel = document.createElement('div');
    panel.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:100065;display:flex;align-items:center;justify-content:center;font-family:"Courier New",monospace;color:#fff;';
    panel.innerHTML = `
      <div style="background:#1a1a2a;border:2px solid #fff;padding:20px;max-width:360px;width:90%;">
        <div style="font-size:14px;color:#ffcc00;margin-bottom:14px;text-align:center;">⚔️ 选择 ACT</div>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <button class="ub-act-btn" data-act="0" style="background:#000;border:2px solid #888;color:#fff;padding:10px;font-family:inherit;cursor:pointer;text-align:left;font-size:13px;">🔍 检查 - 观察对手弱点</button>
          <button class="ub-act-btn" data-act="1" style="background:#000;border:2px solid #888;color:#fff;padding:10px;font-family:inherit;cursor:pointer;text-align:left;font-size:13px;">💬 ${label} - 尝试理解对手</button>
          <button class="ub-act-btn" data-act="2" style="background:#000;border:2px solid #888;color:#fff;padding:10px;font-family:inherit;cursor:pointer;text-align:left;font-size:13px;">🔥 质问 - 激怒对手 (MERCY↑, 攻击上升)</button>
        </div>
      </div>
    `;
    document.body.appendChild(panel);
    panel.querySelectorAll('.ub-act-btn').forEach(btn => {
      btn.onmouseenter = () => { btn.style.background = '#333'; btn.style.borderColor = '#ffcc00'; };
      btn.onmouseleave = () => { btn.style.background = '#000'; btn.style.borderColor = '#888'; };
      btn.onclick = () => {
        const idx = parseInt(btn.dataset.act);
        panel.remove();
        applyActResult(idx);
      };
    });
  }

  function applyActResult(idx) {
    const b = _battle;
    let text = '', mercyGain = 0;
    if (idx === 0) {
      text = b.boss.actCheck;
    } else if (idx === 1) {
      text = b.boss.actEncourage || b.boss.actAppreciate || '* 你说了些好话。';
      mercyGain = 15 + Math.floor(Math.random() * 10);
    } else {
      text = b.boss.actThreaten || b.boss.actDebunk || '* 你质问了他。';
      mercyGain = 25 + Math.floor(Math.random() * 15);
      b.boss.atk = Math.min(30, b.boss.atk + 2);
    }
    b.player.mercy = Math.min(b.boss.mercyThreshold, b.player.mercy + mercyGain);
    setDialog(text + `\n* MERCY +${mercyGain}`, () => {
      updateBattleUI();
      setTimeout(startEnemyTurn, 600);
    });
  }

  // ===== ITEM =====
  function doItem() {
    const b = _battle;
    const r = (typeof Game !== 'undefined' && Game.state) ? Game.state.resources : {};
    let healAmount = 30;
    let cost = 50;
    const canAfford = (r.money || 0) >= cost && b.player.hp < b.player.maxHp;

    if (!canAfford) {
      setDialog('* 没有足够的资金...或者HP已满。', () => {
        setTimeout(startEnemyTurn, 400);
      });
      return;
    }
    r.money -= cost;
    b.player.hp = Math.min(b.player.maxHp, b.player.hp + healAmount);
    setDialog(`* 你掏出急救包，恢复了 ${healAmount} HP！\n* (花费 ${cost} 资金)`, () => {
      updateBattleUI();
      setTimeout(startEnemyTurn, 600);
    });
  }

  // ===== MERCY =====
  function doMercy() {
    const b = _battle;
    if (b.player.mercy >= b.boss.mercyThreshold) {
      setDialog(`* 你伸出了手...\n* "让我们结束这一切吧。"\n* ${b.boss.name} 愣住了...`, () => {
        setTimeout(() => {
          setDialog(b.boss.onSpareText, () => onVictory('spare'));
        }, 800);
      });
    } else {
      setDialog('* 你尝试饶恕...\n* 但 MERCY 还不够。\n* (MERCY 需要 ' + b.boss.mercyThreshold + ')');
      setTimeout(startEnemyTurn, 1000);
    }
  }

  // ===== 敌人回合（弹幕）=====
  function startEnemyTurn() {
    const b = _battle;
    if (b.ended) return;
    b.phase = 'enemy_turn';
    const area = b.modal.querySelector('#ub-bullet-area');
    area.style.display = 'block';

    const canvas = b.modal.querySelector('#ub-canvas');
    const ctx = canvas.getContext('2d');
    b.bullets = [];
    b.soul = { x: 300, y: 78, vx: 0, vy: 0 };
    const keys = {};
    const onKeyDown = e => { keys[e.key.toLowerCase()] = true; if (['arrowup','arrowdown','arrowleft','arrowright',' '].includes(e.key.toLowerCase())) e.preventDefault(); };
    const onKeyUp = e => { keys[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // 随机选 pattern
    const pattern = b.boss.patterns[Math.floor(Math.random() * b.boss.patterns.length)];
    spawnPattern(pattern, canvas.width, canvas.height);

    let startTime = Date.now();
    let hitCooldown = 0;
    const attackDuration = 5000;
    let running = true;

    function loop() {
      if (!running || !_battle) { window.removeEventListener('keydown', onKeyDown); window.removeEventListener('keyup', onKeyUp); return; }
      const elapsed = Date.now() - startTime;
      if (elapsed > attackDuration) {
        running = false;
        endEnemyTurn();
        return;
      }
      // 更新魂
      const speed = 3;
      if (keys['arrowleft'] || keys['a']) b.soul.x -= speed;
      if (keys['arrowright'] || keys['d']) b.soul.x += speed;
      if (keys['arrowup'] || keys['w']) b.soul.y -= speed;
      if (keys['arrowdown'] || keys['s']) b.soul.y += speed;
      b.soul.x = Math.max(6, Math.min(canvas.width - 6, b.soul.x));
      b.soul.y = Math.max(6, Math.min(canvas.height - 6, b.soul.y));

      // 更新子弹
      b.bullets.forEach(bu => {
        bu.x += bu.vx;
        bu.y += bu.vy;
        if (bu.fn) bu.fn(bu, elapsed);
      });
      // 移除出界
      b.bullets = b.bullets.filter(bu => bu.x > -20 && bu.x < canvas.width + 20 && bu.y > -20 && bu.y < canvas.height + 20);

      // 碰撞
      if (hitCooldown > 0) hitCooldown--;
      for (const bu of b.bullets) {
        const dx = bu.x - b.soul.x;
        const dy = bu.y - b.soul.y;
        if (dx * dx + dy * dy < (bu.r + 6) * (bu.r + 6) && hitCooldown === 0) {
          hitCooldown = 40;
          // UT原版: max(1, ATK - DEF + random(-2, +2))
          const raw = Math.max(1, b.boss.atk - b.player.def + Math.floor(Math.random() * 5) - 2);
          b.player.hp = Math.max(0, b.player.hp - raw);
          b.player.mercy = Math.max(0, b.player.mercy - 3);
          updateBattleUI();
          flashScreen('#ff0000');
          if (b.player.hp <= 0) {
            running = false;
            onDefeat();
            return;
          }
          break;
        }
      }

      // 绘制
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // 魂 (心形)
      ctx.fillStyle = hitCooldown > 0 && hitCooldown % 6 < 3 ? '#ff6666' : '#ff0000';
      drawHeart(ctx, b.soul.x, b.soul.y, 6);
      // 子弹
      b.bullets.forEach(bu => {
        ctx.fillStyle = bu.color || '#ffff00';
        if (bu.shape === 'text') {
          ctx.font = bu.font || 'bold 12px Courier New';
          ctx.fillText(bu.text, bu.x, bu.y);
        } else if (bu.shape === 'square') {
          ctx.fillRect(bu.x - bu.r, bu.y - bu.r, bu.r * 2, bu.r * 2);
        } else if (bu.shape === 'diamond') {
          ctx.beginPath();
          ctx.moveTo(bu.x, bu.y - bu.r);
          ctx.lineTo(bu.x + bu.r, bu.y);
          ctx.lineTo(bu.x, bu.y + bu.r);
          ctx.lineTo(bu.x - bu.r, bu.y);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(bu.x, bu.y, bu.r, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  function flashScreen(color) {
    const area = _battle.modal.querySelector('#ub-bullet-area');
    area.style.background = color;
    setTimeout(() => { area.style.background = '#000'; }, 80);
  }

  function drawHeart(ctx, x, y, size) {
    ctx.beginPath();
    ctx.moveTo(x, y + size * 0.7);
    ctx.bezierCurveTo(x + size * 1.5, y - size * 0.5, x + size * 0.5, y - size * 1.5, x, y - size * 0.2);
    ctx.bezierCurveTo(x - size * 0.5, y - size * 1.5, x - size * 1.5, y - size * 0.5, x, y + size * 0.7);
    ctx.fill();
  }

  // ===== 弹幕 pattern =====
  function spawnPattern(pattern, w, h) {
    const b = _battle;
    if (pattern === 'speech') {
      const texts = ['GLORY!', 'REICH!', 'ORDER!', 'POWER!', 'NO PEACE!', 'UNITY!'];
      let i = 0;
      const intv = setInterval(() => {
        if (!_battle) { clearInterval(intv); return; }
        b.bullets.push({ x: -40, y: 30 + Math.random() * 100, vx: 1.2, vy: 0, r: 4, shape: 'text', text: texts[i % texts.length], font: 'bold 14px Courier New', color: '#ff4444' });
        b.bullets.push({ x: w + 40, y: 30 + Math.random() * 100, vx: -1.2, vy: 0, r: 4, shape: 'text', text: texts[(i + 2) % texts.length], font: 'bold 14px Courier New', color: '#ff4444' });
        i++;
      }, 450);
      setTimeout(() => clearInterval(intv), 4800);
    } else if (pattern === 'sieg_heil') {
      let i = 0;
      const intv = setInterval(() => {
        if (!_battle) { clearInterval(intv); return; }
        b.bullets.push({ x: w / 2, y: h + 10, vx: Math.sin(i * 0.7) * 1.5, vy: -2.5, r: 6, color: '#ff0000' });
        i++;
      }, 120);
      setTimeout(() => clearInterval(intv), 4800);
    } else if (pattern === 'hand_raise') {
      let i = 0;
      const intv = setInterval(() => {
        if (!_battle) { clearInterval(intv); return; }
        b.bullets.push({ x: -5, y: 10 + i * 10 % h, vx: 2.5, vy: 0.8, r: 5, color: '#ffcc00' });
        b.bullets.push({ x: w + 5, y: 10 + (i + 5) * 10 % h, vx: -2.5, vy: 0.8, r: 5, color: '#ffcc00' });
        i++;
      }, 180);
      setTimeout(() => clearInterval(intv), 4800);
    } else if (pattern === 'grid') {
      // 下落网格
      for (let col = 0; col < 8; col++) {
        const delay = col * 150;
        const intv = setInterval(() => {
          if (!_battle) { clearInterval(intv); return; }
          b.bullets.push({ x: 30 + col * 70, y: -10, vx: 0, vy: 2.2, r: 5, shape: 'square', color: '#888' });
        }, 900);
        setTimeout(() => { clearInterval(intv); }, delay + 4800);
      }
    } else if (pattern === 'blitz') {
      // 快速横向波浪
      let i = 0;
      const intv = setInterval(() => {
        if (!_battle) { clearInterval(intv); return; }
        b.bullets.push({ x: -10, y: 20 + Math.sin(i * 0.4) * 50 + h / 2, vx: 3.5, vy: 0, r: 4, color: '#ff8800' });
        b.bullets.push({ x: w + 10, y: 20 + Math.cos(i * 0.4) * 50 + h / 2, vx: -3.5, vy: 0, r: 4, color: '#ff8800' });
        i++;
      }, 130);
      setTimeout(() => clearInterval(intv), 4800);
    } else if (pattern === 'random') {
      let i = 0;
      const intv = setInterval(() => {
        if (!_battle) { clearInterval(intv); return; }
        const x = Math.random() * w;
        const y = Math.random() < 0.5 ? -10 : h + 10;
        b.bullets.push({ x, y, vx: (Math.random() - 0.5) * 3, vy: y < 0 ? 2.5 : -2.5, r: 4 + Math.random() * 3, color: ['#ff0000','#00ff00','#ffff00','#ff00ff','#00ffff'][Math.floor(Math.random()*5)] });
        i++;
      }, 100);
      setTimeout(() => clearInterval(intv), 4800);
    } else if (pattern === 'geometric') {
      // 旋转菱形
      let t = 0;
      const intv = setInterval(() => {
        if (!_battle) { clearInterval(intv); return; }
        for (let k = 0; k < 4; k++) {
          const ang = t + k * Math.PI / 2;
          b.bullets.push({ x: w / 2, y: h / 2, vx: Math.cos(ang) * 2, vy: Math.sin(ang) * 2, r: 5, shape: 'diamond', color: '#66ffaa' });
        }
        t += 0.25;
      }, 180);
      setTimeout(() => clearInterval(intv), 4800);
    }
  }

  function endEnemyTurn() {
    const b = _battle;
    if (!b || b.ended) return;
    b.modal.querySelector('#ub-bullet-area').style.display = 'none';
    b.bullets = [];
    b.phase = 'player_turn';
    updateBattleUI();
    b.modal.querySelectorAll('[id^="ub-fight"],[id^="ub-act"],[id^="ub-item"],[id^="ub-mercy"]').forEach(x => x.disabled = false);
    setDialog('* 你感到一阵疲惫...\n* 轮到你了。');
  }

  // ===== 结果 =====
  function onVictory(type) {
    const b = _battle;
    b.ended = true;
    b.phase = 'result';
    const area = b.modal.querySelector('#ub-bullet-area');
    area.style.display = 'none';
    const rewardData = type === 'spare' ? b.boss.rewardSpare : b.boss.rewardKill;
    const text = type === 'spare' ? b.boss.onSpareText : b.boss.onKillText;
    setDialog(text, () => {
      applyReward(rewardData, type);
      showResultModal(type);
    });
  }

  function onDefeat() {
    const b = _battle;
    b.ended = true;
    b.phase = 'result';
    const area = b.modal.querySelector('#ub-bullet-area');
    area.style.display = 'none';
    // 惩罚
    if (Game && Game.state) {
      Game.state.resources.stability = Math.max(0, Game.state.resources.stability - 20);
      Game.state.resources.manpower = Math.max(0, Game.state.resources.manpower - 20);
      Game.clampResources();
      Game.addNews(`你在与 ${b.boss.name} 的战斗中倒下了... 稳定-20 人力-20`, 'crisis');
    }
    setDialog('* 你倒下了...\n* 但故事还没结束。', () => showResultModal('defeat'));
  }

  function showResultModal(type) {
    const b = _battle;
    if (!b) return;
    setTimeout(() => {
      const bossName = b.boss.name;
      const playerHp = b.player.hp;
      b._animStop = true;
      b.modal.remove();
      _battle = null;

      const r = document.createElement('div');
      r.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:100070;display:flex;align-items:center;justify-content:center;color:#fff;font-family:"Courier New",monospace;';
      let color, title;
      if (type === 'kill') { color = '#ff4444'; title = '☠ 胜利 (击杀)'; }
      else if (type === 'spare') { color = '#44ff44'; title = '💚 胜利 (饶恕)'; }
      else if (type === 'flee') { color = '#aaa'; title = '🏃 逃跑'; }
      else { color = '#888'; title = '💀 战败'; }

      let rw = {};
      if (type === 'kill') rw = BOSSES[getBossIdByName(bossName)]?.rewardKill || {};
      else if (type === 'spare') rw = BOSSES[getBossIdByName(bossName)]?.rewardSpare || {};
      else if (type === 'flee') rw = BOSSES[getBossIdByName(bossName)]?.rewardFlee || {};
      const rwStr = Object.keys(rw).length ? Object.entries(rw).map(([k,v]) => resourceLabel(k) + (v >= 0 ? '+' : '') + v).join('  ') : '';

      let extraInfo = '';
      if (type === 'defeat') {
        extraInfo = '<div style="font-size:11px;color:#ff6666;margin-top:12px;">稳定 -20  人力 -20</div>';
      }

      r.innerHTML = `
        <div style="text-align:center;padding:30px;border:2px solid ${color};border-radius:8px;background:#111;max-width:400px;">
          <div style="font-size:36px;margin-bottom:12px;">${title.split(' ')[0]}</div>
          <div style="font-size:20px;color:${color};margin-bottom:16px;letter-spacing:2px;">${title.split(' ').slice(1).join(' ')}</div>
          <div style="font-size:13px;color:#ccc;margin-bottom:10px;">对手: ${bossName}</div>
          <div style="font-size:11px;color:#888;margin-bottom:16px;">剩余HP ${playerHp}/${getPlayerStats().maxHp}</div>
          <div style="font-size:12px;color:#ffcc00;margin-bottom:8px;">${rwStr}</div>
          ${extraInfo}
          <button id="ub-result-close" style="margin-top:16px;background:#333;color:#fff;border:1px solid #fff;padding:8px 28px;border-radius:4px;cursor:pointer;font-family:inherit;">确认</button>
        </div>
      `;
      document.body.appendChild(r);
      r.querySelector('#ub-result-close').onclick = () => r.remove();
    }, 500);
  }

  function getBossIdByName(name) {
    for (const id in BOSSES) if (BOSSES[id].name === name) return id;
    return null;
  }

  function resourceLabel(k) {
    const m = { money: '💰', manpower: '👥', stability: '✨', deterrence: '🛡️', militaryPower: '⚔️', nukeDeter: '☢️', research: '🔬',
                ofn: '🤝 OFN', japan: '🇯🇵', italy: '🇮🇹', burgundy: '🖤 BR', russia: '🇷🇺', egypt: '🇪🇬', middle_east: '🌍', africa: '🌍',
                burgundy_relation: '🖤 BR' };
    return m[k] || k;
  }

  function applyReward(rewards, type) {
    if (!rewards || !Game || !Game.state) return;
    const r = Game.state.resources;
    const rel = Game.state.relations;
    for (const key in rewards) {
      const v = rewards[key];
      if (key === 'stability') { r.stability = Math.max(0, Math.min(100, r.stability + v)); }
      else if (key === 'manpower') { r.manpower = Math.max(0, r.manpower + v); }
      else if (key === 'money') { r.money = Math.max(0, r.money + v); }
      else if (key === 'deterrence') { r.deterrence = Math.max(0, r.deterrence + v); }
      else if (key === 'militaryPower') { r.militaryPower = Math.max(0, r.militaryPower + v); }
      else if (key === 'nukeDeter') { r.nukeDeter = Math.max(0, r.nukeDeter + v); }
      else if (key === 'research') { r.research = Math.max(0, r.research + v); }
      else if (key === 'ofn' || key === 'ofn_relation') { rel.ofn = Math.max(-100, Math.min(100, (rel.ofn || 0) + v)); }
      else if (key === 'japan' || key === 'japan_relation') { rel.japan = Math.max(-100, Math.min(100, (rel.japan || 0) + v)); }
      else if (key === 'italy' || key === 'italy_relation') { rel.italy = Math.max(-100, Math.min(100, (rel.italy || 0) + v)); }
      else if (key === 'burgundy_relation' || key === 'burgundy') { rel.burgundy = Math.max(-100, Math.min(100, (rel.burgundy || 0) + v)); }
      else if (key === 'russia' || key === 'russia_relation') { rel.russia = Math.max(-100, Math.min(100, (rel.russia || 0) + v)); }
      else { r[key] = (r[key] || 0) + v; }
    }
    Game.clampResources();
    if (typeof Game.addNews === 'function') {
      const b = _battle;
      let label = '';
      if (type === 'spare') label = '饶恕了';
      else if (type === 'kill') label = '击败了';
      else if (type === 'flee') label = '从';
      else label = '在与';
      const suffix = type === 'flee' ? '逃跑' : (type === 'defeat' ? '战斗中倒下' : 'BOSS 战胜利');
      Game.addNews(`⚔️ BOSS 战: 你${label}${b ? b.boss.name : 'BOSS'} ${suffix}！`, type === 'defeat' || type === 'flee' ? 'crisis' : 'tech');
    }
    if (typeof UI !== 'undefined') {
      try { UI.renderTopbar(); } catch(e) {}
      try { UI.renderLeftPanel(); } catch(e) {}
    }
  }

  // ===== 对外 API =====
  window.UndertaleBattle = {
    openBossSelect,
    startBattle,
    closeBattle,
    getBosses: () => BOSSES,
    getPlayerStats,
    isAvailable: () => !!Game && !!Game.getMode && Game.getMode().funMode,
  };

})();
