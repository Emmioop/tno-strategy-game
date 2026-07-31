/* ============================================================
 * 千年帝国的最后一息 - 核心游戏逻辑
 * ============================================================ */

const Game = {

  // ===== 游戏状态 =====
  state: null,

  // ===== 初始化新游戏 =====
  init() {
    this.state = {
      // 时间：1962Q1 开始，2000Q4 结束（共156回合）
      year: 1962,
      quarter: 1,
      turn: 1,
      totalTurns: 156, // (2000-1962)*4

      // 当前路线与领导人
      leader: {
        id: 'hitler',
        name: '阿道夫·希特勒',
        title: '元首（垂死）',
        ideology: 'none'
      },
      chosenPath: null,

      // 资源
      resources: {
        money: 500,         // 帝国马克（百万元）
        manpower: 100,      // 可用人力
        stability: 45,      // 稳定度 0-100
        deterrence: 60,     // 综合威慑
        militaryPower: 80,  // 军事实力
        nukeDeter: 30,      // 核威慑
        nukes: 2,           // 核武器数量
        research: 20,       // 研发点数
        efficiency: 1.0     // 工业效率系数
      },

      // 国际关系 -100(敌对) ~ +100(友好)
      relations: {
        ofn: -20,
        japan: -10,
        italy: 5,
        burgundy: -30,
        russia: -40
      },

      // 建筑 {buildingId: count}
      buildings: {
        consumer_factory: 3,
        infrastructure: 2,
        agriculture: 2,
        arms_factory: 2,
        aircraft_factory: 1,
        ss_barracks: 1
      },

      // 建造队列 {id, turnsLeft}
      buildQueue: [],

      // 已研发科技（1962年的帝国已经掌握核武器技术）
      techs: {
        nuclear_tech: true
      },

      // 政策选择 {policyId: optionId}
      policies: {},

      // 标记位
      flags: {
        nuclear_tech: true
      },

      // 已触发的一次性事件
      triggeredEvents: {},

      // 事件日志（最近的事件）
      eventLog: [],

      // 新闻流
      newsLog: [],

      // 游戏是否结束
      ended: false,
      endingId: null
    };

    return this.state;
  },

  // ===== 获取当前日期字符串 =====
  getDateStr() {
    const q = ['一', '二', '三', '四'];
    return `${this.state.year}年 第${q[this.state.quarter - 1]}季度`;
  },

  // ===== 计算回合数（用于事件触发） =====
  turnToYearQuarter(turn) {
    const year = 1962 + Math.floor((turn - 1) / 4);
    const quarter = ((turn - 1) % 4) + 1;
    return { year, quarter };
  },

  // ===== 当前是否匹配指定年/季度 =====
  matchesTurn(turnMatch) {
    if (!turnMatch) return true;
    return this.state.year === turnMatch.year && this.state.quarter === turnMatch.quarter;
  },

  // ===== 检查事件触发条件 =====
  checkEventCondition(ev) {
    // 一次性事件已触发过
    if (ev.once && this.state.triggeredEvents[ev.id]) return false;

    // 回合匹配
    if (ev.turn) {
      if (!this.matchesTurn(ev.turn)) return false;
    } else {
      // 随机事件：检查 minTurn/maxTurn
      if (ev.minTurn) {
        const t = ev.minTurn;
        if (this.state.year < t.year) return false;
      }
      if (ev.maxTurn) {
        const t = ev.maxTurn;
        if (this.state.year > t.year) return false;
      }
    }

    // 自定义条件
    if (ev.condition && !ev.condition(this.state)) return false;

    return true;
  },

  // ===== 获取本回合应触发的事件 =====
  getEventsForTurn() {
    const events = [];

    // 1. 匹配回合的剧情事件
    for (const ev of STORY_EVENTS) {
      if (ev.turn && this.checkEventCondition(ev)) {
        events.push(ev);
      }
    }

    // 2. 随机事件（每回合最多1个，按权重）
    const randomCandidates = STORY_EVENTS.filter(ev =>
      !ev.turn && ev.weight && this.checkEventCondition(ev)
    );
    if (randomCandidates.length > 0 && Math.random() < 0.55) {
      const totalWeight = randomCandidates.reduce((s, e) => s + e.weight, 0);
      let r = Math.random() * totalWeight;
      for (const ev of randomCandidates) {
        r -= ev.weight;
        if (r <= 0) {
          events.push(ev);
          break;
        }
      }
    }

    return events;
  },

  // ===== 应用事件效果 =====
  applyEffects(effects) {
    if (!effects) return [];
    const changes = [];
    for (const key in effects) {
      const val = effects[key];
      if (key in this.state.resources) {
        this.state.resources[key] += val;
        changes.push({ key, val });
      } else if (key in this.state.relations) {
        this.state.relations[key] = Math.max(-100, Math.min(100, this.state.relations[key] + val));
        changes.push({ key, val });
      } else if (key === 'stability' || key === 'deterrence') {
        // 已在 resources 中处理
      }
    }
    return changes;
  },

  // ===== 设置标记 =====
  setFlags(flags) {
    if (!flags) return;
    for (const k in flags) {
      this.state.flags[k] = flags[k];
    }
  },

  // ===== 处理事件选项 =====
  chooseEventOption(ev, choice) {
    // 检查选项条件
    if (choice.condition && !choice.condition(this.state)) {
      return false;
    }

    // 应用效果
    this.applyEffects(choice.effects);
    this.setFlags(choice.setFlags);

    // 标记事件已触发
    if (ev.once) {
      this.state.triggeredEvents[ev.id] = true;
    } else {
      // 随机事件也标记，避免短期重复（但允许后期再触发）
      this.state.triggeredEvents[ev.id + '_' + this.state.turn] = true;
    }

    // 执行 onTrigger（用于特殊逻辑）
    if (ev.onTrigger) {
      ev.onTrigger(this.state);
    }

    // 记录日志
    this.state.eventLog.unshift({
      turn: this.state.turn,
      date: this.getDateStr(),
      title: ev.title,
      choice: choice.text
    });
    if (this.state.eventLog.length > 30) this.state.eventLog.pop();

    // 添加新闻
    if (choice.showToast) {
      this.addNews(choice.showToast, 'crisis');
    }

    // 限制资源范围
    this.clampResources();

    return true;
  },

  // ===== 限制资源范围 =====
  clampResources() {
    const r = this.state.resources;
    r.stability = Math.max(0, Math.min(100, r.stability));
    r.deterrence = Math.max(0, Math.min(150, r.deterrence));
    r.nukeDeter = Math.max(0, Math.min(150, r.nukeDeter));
    r.efficiency = Math.max(0.3, Math.min(2.0, r.efficiency));
    r.money = Math.max(-200, r.money);
    r.manpower = Math.max(0, r.manpower);
    r.nukes = Math.max(0, r.nukes);
  },

  // ===== 添加新闻 =====
  addNews(text, type = 'world') {
    this.state.newsLog.unshift({
      date: this.getDateStr(),
      text: text,
      type: type
    });
    if (this.state.newsLog.length > 40) this.state.newsLog.pop();
  },

  // ===== 建造建筑 =====
  buildBuilding(buildingId) {
    const b = BUILDINGS[buildingId];
    if (!b) return { ok: false, msg: '建筑不存在' };

    // 检查科技前置
    if (b.requires && !this.state.flags[b.requires] && !this.state.techs[b.requires]) {
      return { ok: false, msg: '需要前置科技: ' + (TECHS[b.requires]?.name || b.requires) };
    }

    // 检查资金
    if (this.state.resources.money < b.cost) {
      return { ok: false, msg: '资金不足' };
    }

    // 扣除资金，加入队列
    this.state.resources.money -= b.cost;
    this.state.buildQueue.push({
      id: buildingId,
      name: b.name,
      turnsLeft: b.buildTime
    });

    return { ok: true, msg: `${b.name} 开始建造，${b.buildTime}季度后完成` };
  },

  // ===== 拆除建筑 =====
  demolishBuilding(buildingId) {
    const b = BUILDINGS[buildingId];
    if (!b) return { ok: false, msg: '建筑不存在' };
    if (!this.state.buildings[buildingId] || this.state.buildings[buildingId] <= 0) {
      return { ok: false, msg: '没有可拆除的建筑' };
    }
    this.state.buildings[buildingId]--;
    // 返还少量资金
    this.state.resources.money += Math.floor(b.cost * 0.3);
    return { ok: true, msg: `${b.name} 已拆除，返还部分资金` };
  },

  // ===== 研发科技 =====
  researchTech(techId) {
    const t = TECHS[techId];
    if (!t) return { ok: false, msg: '科技不存在' };
    if (this.state.techs[techId]) return { ok: false, msg: '已研发完成' };
    if (this.state.resources.research < t.cost) return { ok: false, msg: '研发点数不足' };

    this.state.resources.research -= t.cost;
    this.state.techs[techId] = true;
    this.state.flags[techId] = true; // 同时设为flag，便于事件条件判断

    return { ok: true, msg: `${t.name} 研发完成` };
  },

  // ===== 设置政策 =====
  setPolicy(policyId, optionId) {
    const p = POLICIES[policyId];
    if (!p) return { ok: false, msg: '政策不存在' };
    const opt = p.options.find(o => o.id === optionId);
    if (!opt) return { ok: false, msg: '选项不存在' };

    // 检查条件
    if (opt.requires && !this.state.flags[opt.requires] && this.state.leader.ideology !== opt.requires) {
      // 也允许通过 leader ideology 判断
      if (this.state.leader.ideology !== opt.requires) {
        return { ok: false, msg: '需要路线: ' + opt.requires };
      }
    }
    if (opt.requiresFlag && !this.state.flags[opt.requiresFlag]) {
      return { ok: false, msg: '需要前置条件' };
    }

    this.state.policies[policyId] = optionId;
    return { ok: true, msg: `政策已更新: ${opt.name}` };
  },

  // ===== 检查政策是否可用 =====
  canChoosePolicy(policyId, optionId) {
    const p = POLICIES[policyId];
    if (!p) return false;
    const opt = p.options.find(o => o.id === optionId);
    if (!opt) return false;

    // requires: 路线要求
    if (opt.requires) {
      if (this.state.leader.ideology !== opt.requires && !this.state.flags[opt.requires]) {
        return false;
      }
    }
    // requiresFlag: 前置标记
    if (opt.requiresFlag && !this.state.flags[opt.requiresFlag]) {
      return false;
    }
    return true;
  },

  // ===== 检查选项（事件）是否可用 =====
  canChooseEventOption(ev, choice) {
    if (choice.condition && !choice.condition(this.state)) return false;
    return true;
  },

  // ===== 计算每回合收支 =====
  calculateIncome() {
    const r = this.state.resources;
    const eff = r.efficiency;
    let income = { money: 0, manpower: 0, stability: 0, deterrence: 0,
                   militaryPower: 0, nukeDeter: 0, nukes: 0, research: 0 };

    // 建筑产出
    for (const bid in this.state.buildings) {
      const count = this.state.buildings[bid];
      const b = BUILDINGS[bid];
      if (!b) continue;
      const eff_multi = b.type === 'civilian' ? eff : 1.0;
      for (const key in b.effects) {
        income[key] = (income[key] || 0) + b.effects[key] * count * eff_multi;
      }
      // 维护成本
      income.money -= b.maint * count;
    }

    // 政策影响
    this.applyPolicyEffects(income);

    // 稳定度衰减（回归中值）
    if (r.stability > 60) income.stability -= (r.stability - 60) * 0.05;
    if (r.stability < 30) income.stability += (30 - r.stability) * 0.05;

    // 威慑衰减
    income.deterrence -= 1;

    // 基础收入
    income.money += 10;
    income.manpower += 2;
    income.research += 1;

    return income;
  },

  // ===== 应用政策效果到收入 =====
  applyPolicyEffects(income) {
    const s = this.state;
    const econ = s.policies.economy;
    if (econ === 'slave_economy') { income.money += 15; income.stability -= 1; }
    if (econ === 'mixed_reform') { income.money += 8; income.stability += 1; income.research += 2; }
    if (econ === 'war_economy') { income.militaryPower += 5; income.money -= 10; }
    if (econ === 'free_market') { income.money += 30; income.stability -= 2; }

    const slave = s.policies.slave_policy;
    if (slave === 'maintain_slaves') { income.money += 10; income.stability -= 1; income.manpower -= 1; }
    if (slave === 'limited_rights') { income.money -= 5; income.stability += 1; }
    if (slave === 'gradual_emancipation') { income.money -= 15; income.stability += 2; income.manpower += 3; }
    if (slave === 'harsher_rule') { income.money += 15; income.stability -= 2; income.manpower -= 2; }

    const mil = s.policies.military_doctrine;
    if (mil === 'defensive') { income.money += 5; }
    if (mil === 'expansionist') { income.deterrence += 3; income.money -= 10; }
    if (mil === 'modernization') { income.militaryPower += 3; income.research += 2; }
    if (mil === 'nuclear_first') { income.nukeDeter += 3; income.money -= 15; }

    const youth = s.policies.youth_policy;
    if (youth === 'suppress_youth') { income.stability += 2; income.manpower -= 2; }
    if (youth === 'coopt_youth') { income.stability += 1; }
    if (youth === 'dialogue') { income.stability += 1; income.research += 2; }
    if (youth === 'militarize_youth') { income.militaryPower += 3; income.stability -= 1; }
  },

  // ===== 推进一回合 =====
  advanceTurn(eventsQueue, onEvent) {
    if (this.state.ended) return;

    // 1. 处理建造队列
    const completed = [];
    for (let i = this.state.buildQueue.length - 1; i >= 0; i--) {
      this.state.buildQueue[i].turnsLeft--;
      if (this.state.buildQueue[i].turnsLeft <= 0) {
        const item = this.state.buildQueue[i];
        this.state.buildings[item.id] = (this.state.buildings[item.id] || 0) + 1;
        completed.push(item.name);
        this.state.buildQueue.splice(i, 1);
      }
    }
    completed.forEach(name => {
      this.addNews(`${name} 建造完成`, 'economy');
    });

    // 2. 计算并应用收入
    const income = this.calculateIncome();
    for (const key in income) {
      this.state.resources[key] = (this.state.resources[key] || 0) + income[key];
    }
    this.clampResources();

    // 3. 推进时间
    this.state.turn++;
    this.state.quarter++;
    if (this.state.quarter > 4) {
      this.state.quarter = 1;
      this.state.year++;
    }

    // 4. 检查事件
    const turnEvents = this.getEventsForTurn();
    if (turnEvents.length > 0 && onEvent) {
      onEvent(turnEvents);
    }

    // 5. 检查结局
    this.checkEnding();

    // 6. 添加随机新闻
    if (Math.random() < 0.4) {
      this.generateRandomNews();
    }

    return { income, completed, turnEvents };
  },

  // ===== 生成随机新闻 =====
  generateRandomNews() {
    const newsPool = [
      { text: '日耳曼尼亚证券交易所开盘，马克汇率波动', type: 'economy' },
      { text: 'OFN太平洋舰队在夏威夷海域演习', type: 'world' },
      { text: '日本宣布新的"共荣圈"经济计划', type: 'world' },
      { text: '俄罗斯军阀在乌拉尔发生冲突', type: 'world' },
      { text: '意大利电影在帝国地下流行', type: 'world' },
      { text: '鲁尔区工厂订单增加', type: 'economy' },
      { text: '帝国空军试飞新型战斗机', type: 'world' },
      { text: '三头同盟外长会议在那不勒斯召开', type: 'world' },
      { text: '帝国教育部收紧大学课程审查', type: 'world' },
      { text: '美国NPP与共和民主党在国会激烈辩论', type: 'world' },
      { text: '合成燃料工厂产量创新高', type: 'economy' },
      { text: '东方总督辖区发生小规模骚乱', type: 'crisis' },
      { text: '帝国航天局发布新火箭设计', type: 'tech' },
      { text: '奥地利发生反奴隶制示威', type: 'crisis' },
      { text: '日本天皇接见共荣圈代表', type: 'world' }
    ];
    const n = newsPool[Math.floor(Math.random() * newsPool.length)];
    this.addNews(n.text, n.type);
  },

  // ===== 检查结局条件 =====
  checkEnding() {
    const s = this.state;
    const r = s.resources;

    // 核毁灭结局
    if (s.flags.nuclear_holocaust) {
      this.endGame('nuclear_holocaust');
      return;
    }

    // 稳定度归零 - 崩溃
    if (r.stability <= 0) {
      this.endGame('collapse');
      return;
    }

    // 资金极度负债 - 经济崩溃
    if (r.money <= -150) {
      this.endGame('economic_collapse');
      return;
    }

    // 威慑过低且敌对 - 被入侵
    if (r.deterrence <= 5 && (s.relations.russia < -50 || s.relations.ofn < -50)) {
      this.endGame('invasion');
      return;
    }

    // 到达2000年 - 根据状态判定结局
    if (s.year >= 2001) {
      this.determineFinalEnding();
      return;
    }

    // 提前到达2000Q4
    if (s.year === 2000 && s.quarter === 4 && s.turn >= s.totalTurns) {
      this.determineFinalEnding();
      return;
    }
  },

  // ===== 判定最终结局 =====
  determineFinalEnding() {
    const s = this.state;
    const r = s.resources;
    const f = s.flags;

    let endingId;

    // 根据路线和状态判定
    if (f.reformist) {
      if (r.stability > 70 && r.deterrence > 60 && f.ofn_detente) {
        endingId = 'democratic_reform'; // 民主化改革成功
      } else if (r.stability > 50) {
        endingId = 'reformist_survival'; // 改革派延续
      } else {
        endingId = 'reformist_failure'; // 改革失败
      }
    } else if (f.militarist) {
      if (r.deterrence > 100 && r.stability > 40) {
        endingId = 'militarist_victory'; // 军国胜利
      } else if (r.deterrence > 60) {
        endingId = 'militarist_stalemate'; // 军国僵持
      } else {
        endingId = 'militarist_collapse'; // 军国崩溃
      }
    } else if (f.extremist) {
      if (f.nuclear_first_strike || f.burgundy_ally) {
        endingId = 'dark_victory'; // 黑暗胜利
      } else {
        endingId = 'terror_state'; // 恐怖国家
      }
    } else if (f.conservative) {
      if (r.stability > 60) {
        endingId = 'conservative_survival'; // 保守延续
      } else {
        endingId = 'conservative_decay'; // 保守衰亡
      }
    } else {
      // 默认
      if (r.stability > 60 && r.deterrence > 50) {
        endingId = 'conservative_survival';
      } else {
        endingId = 'collapse';
      }
    }

    // 特殊结局覆盖
    if (f.peace_maker && r.stability > 65) {
      endingId = 'peaceful_coexistence'; // 缓和共存（最佳结局）
    }

    this.endGame(endingId);
  },

  // ===== 结束游戏 =====
  endGame(endingId) {
    this.state.ended = true;
    this.state.endingId = endingId;
  }
};

// 导出
if (typeof window !== 'undefined') {
  window.Game = Game;
}
