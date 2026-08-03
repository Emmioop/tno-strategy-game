/* ============================================================
 * 千年帝国的最后一息 - 存档系统 (多槽位)
 * 支持5个手动存档槽 + 1个自动存档槽
 * 保存: 游戏状态 + NationSim国家数据 + 元数据(时间/年份/路线)
 * ============================================================ */

const SaveSystem = {
  // 存档槽位配置
  SLOTS: [
    { id: 0, name: '自动存档', type: 'auto' },
    { id: 1, name: '存档槽 1', type: 'manual' },
    { id: 2, name: '存档槽 2', type: 'manual' },
    { id: 3, name: '存档槽 3', type: 'manual' },
    { id: 4, name: '存档槽 4', type: 'manual' },
    { id: 5, name: '存档槽 5', type: 'manual' }
  ],
  STORAGE_PREFIX: 'tno_save_',
  META_PREFIX: 'tno_meta_',

  // ===== 序列化游戏状态 (含NationSim数据) =====
  serialize() {
    const payload = {
      version: (typeof Game !== 'undefined') ? Game.SAVE_VERSION : 1,
      savedAt: new Date().toISOString(),
      state: Game.state
    };
    // 附加NationSim国家数据 (深拷贝, 去除函数和临时字段)
    if (typeof NationSim !== 'undefined' && NationSim.nations) {
      const nations = {};
      for (const id in NationSim.nations) {
        const n = NationSim.nations[id];
        // 仅保存可序列化的数据字段
        nations[id] = {
          id: n.id, name: n.name, leader: n.leader, capital: n.capital,
          ideology: n.ideology, flagColor: n.flagColor,
          gdp: n.gdp, gdpGrowth: n.gdpGrowth, gdpPerCapita: n.gdpPerCapita,
          inflation: n.inflation, treasury: n.treasury, taxRate: n.taxRate,
          governmentBudget: n.governmentBudget,
          stability: n.stability, support: n.support, corruption: n.corruption,
          army: n.army, airforce: n.airforce, navy: n.navy,
          nuclear: { warheads: n.nuclear.warheads, delivery: n.nuclear.delivery, deterrence: n.nuclear.deterrence },
          population: n.population, unemployment: n.unemployment,
          literacy: n.literacy, urbanRate: n.urbanRate, lifeExpectancy: n.lifeExpectancy,
          industry: n.industry, tech: n.tech, resources: n.resources,
          territories: n.territories,
          gdpHistory: (n.gdpHistory || []).slice(-40), // 仅保留最近40季度
          aiState: n.aiState ? {
            goal: n.aiState.goal, goalName: n.aiState.goalName,
            diploMod: n.aiState.diploMod, milMod: n.aiState.milMod, gdpMod: n.aiState.gdpMod,
            lastEvalYear: n.aiState.lastEvalYear, log: n.aiState.log
          } : null
        };
      }
      payload.nations = nations;
      // 保存危机状态
      if (NationSim._lastCrisis) {
        payload.crisis = NationSim._lastCrisis;
      }
    }
    return JSON.stringify(payload);
  },

  // ===== 反序列化 (恢复游戏状态 + NationSim) =====
  deserialize(jsonStr) {
    try {
      const payload = JSON.parse(jsonStr);
      // 版本检查
      const curVer = (typeof Game !== 'undefined') ? Game.SAVE_VERSION : 1;
      if (!payload.version || payload.version !== curVer) {
        return { ok: false, msg: '存档版本不匹配，需要开新档' };
      }
      // 恢复游戏状态
      Game.state = payload.state;
      if (Game.state.difficulty) Game.difficulty = Game.state.difficulty;
      if (Game.state.gameMode && Game.setMode) Game.setMode(Game.state.gameMode);
      // 兼容性修复: 有核弹无核武技术
      if (Game.state.resources.nukes > 0 && !Game.state.techs['nuclear_tech']) {
        Game.state.techs['nuclear_tech'] = true;
        Game.state.flags['nuclear_tech'] = true;
      }
      // v0.4.2 兼容: 旧存档补 flavorLog
      if (!Game.state.flavorLog) Game.state.flavorLog = [];
      // 恢复NationSim国家数据
      if (payload.nations && typeof NationSim !== 'undefined') {
        NationSim._initialized = true;
        NationSim.nations = {};
        for (const id in payload.nations) {
          NationSim.nations[id] = payload.nations[id];
        }
        // 恢复危机状态
        if (payload.crisis) NationSim._lastCrisis = payload.crisis;
        console.log('[SaveSystem] NationSim数据已恢复, 共', Object.keys(payload.nations).length, '国');
      }
      return { ok: true, msg: '存档加载成功' };
    } catch (e) {
      return { ok: false, msg: '存档损坏: ' + e.message };
    }
  },

  // ===== 保存到指定槽位 =====
  saveToSlot(slotId) {
    try {
      const jsonStr = this.serialize();
      localStorage.setItem(this.STORAGE_PREFIX + slotId, jsonStr);
      // 保存元数据 (轻量, 列表展示用)
      const meta = {
        slotId, savedAt: new Date().toISOString(),
        year: Game.state.year, quarter: Game.state.quarter,
        difficulty: Game.state.difficulty,
        leader: Game.state.leader.name,
        chosenPath: Game.state.chosenPath,
        stability: Math.round(Game.state.resources.stability),
        turn: Game.state.turn
      };
      localStorage.setItem(this.META_PREFIX + slotId, JSON.stringify(meta));
      return { ok: true, msg: this.SLOTS[slotId].name + ' 保存成功' };
    } catch (e) {
      return { ok: false, msg: '保存失败: ' + e.message };
    }
  },

  // ===== 从槽位加载 =====
  loadFromSlot(slotId) {
    try {
      const jsonStr = localStorage.getItem(this.STORAGE_PREFIX + slotId);
      if (!jsonStr) return { ok: false, msg: '该槽位无存档' };
      const result = this.deserialize(jsonStr);
      if (result.ok) result.msg = this.SLOTS[slotId].name + ' 加载成功';
      return result;
    } catch (e) {
      return { ok: false, msg: '加载失败: ' + e.message };
    }
  },

  // ===== 删除槽位存档 =====
  deleteSlot(slotId) {
    localStorage.removeItem(this.STORAGE_PREFIX + slotId);
    localStorage.removeItem(this.META_PREFIX + slotId);
    return { ok: true, msg: this.SLOTS[slotId].name + ' 已删除' };
  },

  // ===== 获取槽位元数据 (列表展示用) =====
  getSlotMeta(slotId) {
    try {
      const meta = localStorage.getItem(this.META_PREFIX + slotId);
      return meta ? JSON.parse(meta) : null;
    } catch (_) { return null; }
  },

  // ===== 获取所有槽位状态 =====
  getAllSlots() {
    return this.SLOTS.map(slot => {
      const meta = this.getSlotMeta(slot.id);
      return Object.assign({}, slot, {
        occupied: !!meta,
        meta: meta
      });
    });
  },

  // ===== 自动保存到槽位0 (静默) =====
  autoSave() {
    try {
      this.saveToSlot(0);
    } catch (e) {
      console.warn('[SaveSystem] 自动保存失败:', e.message);
    }
  },

  // ===== 兼容旧接口: 迁移旧单槽存档 =====
  migrateLegacy() {
    try {
      const legacy = localStorage.getItem('tno_game_save');
      if (!legacy) return false;
      // 若槽位1无存档, 迁移到槽位1
      if (!localStorage.getItem(this.STORAGE_PREFIX + '1')) {
        localStorage.setItem(this.STORAGE_PREFIX + '1', legacy);
        // 生成元数据
        const parsed = JSON.parse(legacy);
        const meta = {
          slotId: 1, savedAt: new Date().toISOString(),
          year: parsed.year, quarter: parsed.quarter,
          difficulty: parsed.difficulty,
          leader: parsed.leader ? parsed.leader.name : '未知',
          chosenPath: parsed.chosenPath,
          stability: parsed.resources ? Math.round(parsed.resources.stability) : 0,
          turn: parsed.turn
        };
        localStorage.setItem(this.META_PREFIX + '1', JSON.stringify(meta));
        localStorage.removeItem('tno_game_save');
        console.log('[SaveSystem] 旧存档已迁移到槽位1');
        return true;
      }
      return false;
    } catch (_) { return false; }
  }
};

// 导出
if (typeof window !== 'undefined') {
  window.SaveSystem = SaveSystem;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SaveSystem;
}
