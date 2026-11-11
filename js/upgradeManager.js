// ============================================================================
// SWEET DREAMS - TIỆM BÁNH NGỌT
// UpgradeManager: Upgrades, Shop Decors, Quests & Achievements
// ============================================================================

window.UpgradeManager = class UpgradeManager {
  constructor(state, economy, saveManager, audioManager) {
    this.state = state;
    this.economy = economy;
    this.saveManager = saveManager;
    this.audio = audioManager;
    this.ensureDailyQuests();
  }

  getUpgradeConfig(upgradeId) {
    return window.SDData.EQUIPMENT_UPGRADES.find(u => u.id === upgradeId);
  }

  getUpgradeLevelData(upgradeId) {
    const cfg = this.getUpgradeConfig(upgradeId);
    const lvl = this.state.upgrades[upgradeId] || 1;
    return cfg.levels.find(l => l.level === lvl) || cfg.levels[0];
  }

  getNextUpgradeLevelData(upgradeId) {
    const cfg = this.getUpgradeConfig(upgradeId);
    const cur = this.state.upgrades[upgradeId] || 1;
    return cfg.levels.find(l => l.level === cur + 1) || null;
  }

  buyEquipmentUpgrade(upgradeId) {
    const next = this.getNextUpgradeLevelData(upgradeId);
    if (!next) return { ok: false, reason: 'Thiết bị đã đạt cấp tối đa!' };
    if (!this.economy.spendCoins(next.price)) {
      return { ok: false, reason: `Không đủ xu (cần ${next.price} xu).` };
    }
    this.state.upgrades[upgradeId] = next.level;
    this.audio.playSuccess();
    this.saveManager.save(this.state);
    return { ok: true, next };
  }

  hasDecor(decorId) {
    return this.state.decorationsOwned.includes(decorId);
  }

  isDecorEquipped(decorId) {
    const item = window.SDData.SHOP_DECORS.find(d => d.id === decorId);
    if (!item || !this.state.equippedDecors) return false;
    return this.state.equippedDecors[item.category] === decorId;
  }

  buyDecor(decorId) {
    if (this.hasDecor(decorId)) return { ok: false, reason: 'Bạn đã sở hữu vật phẩm này!' };
    const item = window.SDData.SHOP_DECORS.find(d => d.id === decorId);
    if (!item) return { ok: false, reason: 'Không tìm thấy vật phẩm.' };
    if (!this.economy.spendCoins(item.price)) {
      return { ok: false, reason: `Không đủ xu (cần ${item.price} xu).` };
    }
    this.state.decorationsOwned.push(decorId);
    if (!this.state.equippedDecors) this.state.equippedDecors = {};
    this.state.equippedDecors[item.category] = decorId;
    this.economy.addReputation(5);
    this.audio.playSuccess();
    this.saveManager.save(this.state);
    return { ok: true, item };
  }

  toggleEquipDecor(decorId) {
    if (!this.hasDecor(decorId)) return { ok: false, reason: 'Chưa sở hữu vật phẩm này.' };
    const item = window.SDData.SHOP_DECORS.find(d => d.id === decorId);
    if (!item) return { ok: false };
    if (!this.state.equippedDecors) this.state.equippedDecors = {};
    if (this.state.equippedDecors[item.category] === decorId) {
      delete this.state.equippedDecors[item.category];
      this.audio.playClick();
      this.saveManager.save(this.state);
      return { ok: true, equipped: false, item };
    }
    this.state.equippedDecors[item.category] = decorId;
    this.audio.playClick();
    this.saveManager.save(this.state);
    return { ok: true, equipped: true, item };
  }

  getTotalPatienceBonus() {
    let bonus = (this.getUpgradeLevelData('display_shelf').patienceBonus || 0)
      + (this.getUpgradeLevelData('counter_service').patienceBonus || 0);
    const equippedIds = Object.values(this.state.equippedDecors || {});
    equippedIds.forEach(id => {
      const d = window.SDData.SHOP_DECORS.find(x => x.id === id);
      if (d) bonus += d.patienceBonus || 0;
    });
    return bonus;
  }

  getTotalTipBonus() {
    let bonus = this.getUpgradeLevelData('deco_table').tipBonus || 0;
    const equippedIds = Object.values(this.state.equippedDecors || {});
    equippedIds.forEach(id => {
      const d = window.SDData.SHOP_DECORS.find(x => x.id === id);
      if (d) bonus += d.tipBonus || 0;
    });
    return bonus;
  }

  ensureDailyQuests(forceRefresh = false) {
    if (!forceRefresh && this.state.dailyQuests && this.state.dailyQuests.length >= 3) return;
    const pool = [...window.SDData.QUEST_TEMPLATES];
    const picked = [];
    while (picked.length < 3 && pool.length > 0) {
      const idx = Math.floor(Math.random() * pool.length);
      const q = pool.splice(idx, 1)[0];
      picked.push({
        id: q.id,
        title: q.title,
        type: q.type,
        target: q.target,
        progress: 0,
        rewardCoins: q.rewardCoins,
        rewardXp: q.rewardXp,
        claimed: false
      });
    }
    this.state.dailyQuests = picked;
    this.saveManager.save(this.state);
  }

  recordQuestProgress({ cakeType, coinsEarned, isPerfect }) {
    this.state.dailyQuests.forEach(q => {
      if (q.claimed) return;
      if (q.type === 'orders' || q.type === 'customers_served') {
        q.progress = Math.min(q.target, q.progress + 1);
      } else if (q.type === 'coins_earned') {
        q.progress = Math.min(q.target, q.progress + coinsEarned);
      } else if (q.type === 'cake_cupcake' && cakeType === 'cupcake') {
        q.progress = Math.min(q.target, q.progress + 1);
      } else if (q.type === 'perfect' && isPerfect) {
        q.progress = Math.min(q.target, q.progress + 1);
      }
    });
    this.saveManager.save(this.state);
  }

  claimQuest(questId) {
    const q = this.state.dailyQuests.find(x => x.id === questId);
    if (!q || q.claimed || q.progress < q.target) return null;
    q.claimed = true;
    this.economy.addCoins(q.rewardCoins, false);
    const xpRes = this.economy.addXp(q.rewardXp);
    this.audio.playCoins();
    this.saveManager.save(this.state);
    return { quest: q, xpRes };
  }

  checkAchievements() {
    const newlyUnlocked = [];
    if (!this.state.claimedAchievements) this.state.claimedAchievements = [];
    window.SDData.ACHIEVEMENTS.forEach(ach => {
      if (!this.state.unlockedAchievements.includes(ach.id) && ach.check(this.state)) {
        this.state.unlockedAchievements.push(ach.id);
        this.state.claimedAchievements.push(ach.id);
        this.economy.addCoins(ach.rewardCoins, false);
        newlyUnlocked.push(ach);
      }
    });
    if (newlyUnlocked.length > 0) {
      this.audio.playSuccess();
      this.saveManager.save(this.state);
    }
    return newlyUnlocked;
  }
};

