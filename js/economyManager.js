// ============================================================================
// SWEET DREAMS - TIỆM BÁNH NGỌT
// EconomyManager: Coins, XP, 15 Levels, Reputation, Ingredient Inventory
// ============================================================================

window.EconomyManager = class EconomyManager {
  constructor(state, saveManager, audioManager) {
    this.state = state;
    this.saveManager = saveManager;
    this.audio = audioManager;
  }

  getLevelInfo(lvl = this.state.level) {
    const levels = window.SDData.LEVELS;
    return levels[Math.min(lvl - 1, levels.length - 1)];
  }

  getMaxXpForCurrentLevel() {
    return this.getLevelInfo(this.state.level).xpRequired;
  }

  addCoins(amount, countTowardStats = true) {
    const add = Math.max(0, Math.round(amount));
    this.state.coins += add;
    if (countTowardStats) {
      this.state.stats.totalEarned += add;
      this.state.stats.dayCoins += add;
    }
    this.saveManager.save(this.state);
    return add;
  }

  spendCoins(amount) {
    const cost = Math.round(amount);
    if (this.state.coins < cost) return false;
    this.state.coins -= cost;
    this.saveManager.save(this.state);
    return true;
  }

  addReputation(delta) {
    this.state.reputation = Math.max(0, this.state.reputation + delta);
    this.saveManager.save(this.state);
  }

  addXp(amount) {
    if (this.state.level >= window.SDData.LEVELS.length) {
      this.state.xp += amount;
      this.saveManager.save(this.state);
      return { leveledUp: false, newLevel: this.state.level };
    }

    this.state.xp += amount;
    let leveledUp = false;
    while (
      this.state.level < window.SDData.LEVELS.length &&
      this.state.xp >= this.getMaxXpForCurrentLevel()
    ) {
      this.state.xp -= this.getMaxXpForCurrentLevel();
      this.state.level += 1;
      leveledUp = true;
    }
    this.saveManager.save(this.state);
    return { leveledUp, newLevel: this.state.level };
  }

  getStock(ingredientId) {
    return this.state.inventory[ingredientId] || 0;
  }

  consumeIngredient(ingredientId, qty = 1) {
    const cur = this.getStock(ingredientId);
    if (cur < qty) return false;
    this.state.inventory[ingredientId] = cur - qty;
    this.saveManager.save(this.state);
    return true;
  }

  getIngredientDiscountPct() {
    const pantryCfg = window.SDData.EQUIPMENT_UPGRADES.find(u => u.id === 'ingredient_pantry');
    const lvl = (this.state.upgrades && this.state.upgrades.ingredient_pantry) || 1;
    const lvlData = pantryCfg ? (pantryCfg.levels.find(l => l.level === lvl) || pantryCfg.levels[0]) : null;
    return lvlData ? (lvlData.discountPct || 0) : 0;
  }

  getEarlyIngredientUnlock() {
    const pantryCfg = window.SDData.EQUIPMENT_UPGRADES.find(u => u.id === 'ingredient_pantry');
    const lvl = (this.state.upgrades && this.state.upgrades.ingredient_pantry) || 1;
    const lvlData = pantryCfg ? (pantryCfg.levels.find(l => l.level === lvl) || pantryCfg.levels[0]) : null;
    return lvlData ? (lvlData.earlyUnlock || 0) : 0;
  }

  isIngredientUnlocked(ingredient) {
    const effectiveLevel = this.state.level + this.getEarlyIngredientUnlock();
    return ingredient.unlockLevel <= effectiveLevel;
  }

  getIngredientPrice(ingredientId) {
    const item = window.SDData.INGREDIENTS.find(i => i.id === ingredientId);
    if (!item) return 0;
    const disc = this.getIngredientDiscountPct();
    return Math.max(1, Math.round(item.price * (1 - disc / 100)));
  }

  buyIngredient(ingredientId, qty = 5) {
    const item = window.SDData.INGREDIENTS.find(i => i.id === ingredientId);
    if (!item) return { ok: false, reason: 'Không tìm thấy nguyên liệu.' };
    const unitPrice = this.getIngredientPrice(ingredientId);
    const totalCost = unitPrice * qty;
    if (!this.spendCoins(totalCost)) {
      return { ok: false, reason: `Không đủ xu (cần ${totalCost} xu).` };
    }
    this.state.inventory[ingredientId] = (this.state.inventory[ingredientId] || 0) + qty;
    this.audio.playCoins();
    this.saveManager.save(this.state);
    return { ok: true, qty, totalCost, name: item.name };
  }

  // Emergency starter pack if player runs out of both coins and essential ingredients
  claimEmergencyGift() {
    if (this.state.coins >= 40) return false;
    this.state.coins += 60;
    ['flour', 'sugar', 'egg', 'milk', 'butter'].forEach(id => {
      if ((this.state.inventory[id] || 0) < 3) {
        this.state.inventory[id] = (this.state.inventory[id] || 0) + 4;
      }
    });
    this.saveManager.save(this.state);
    return true;
  }
};

