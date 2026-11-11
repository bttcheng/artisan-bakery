// ============================================================================
// SWEET DREAMS - TIỆM BÁNH NGỌT
// RecipeManager: Unlocked Cakes, Batter Formulas & Collection Album
// ============================================================================

window.RecipeManager = class RecipeManager {
  constructor(state, saveManager) {
    this.state = state;
    this.saveManager = saveManager;
  }

  getUnlockedCakeTypes() {
    return window.SDData.CAKE_TYPES.filter(c => c.unlockLevel <= this.state.level);
  }

  getCakeType(id) {
    return window.SDData.CAKE_TYPES.find(c => c.id === id) || window.SDData.CAKE_TYPES[0];
  }

  getBatter(id) {
    return window.SDData.BATTERS.find(b => b.id === id) || window.SDData.BATTERS[0];
  }

  getRequiredIngredients(cakeTypeId, batterId) {
    const cake = this.getCakeType(cakeTypeId);
    const batter = this.getBatter(batterId);
    const list = [...cake.baseIngredients];
    if (batter.flavorIngredient && !list.includes(batter.flavorIngredient)) {
      list.push(batter.flavorIngredient);
    }
    return list;
  }

  getUnlockedBatters() {
    const ings = window.SDData.INGREDIENTS;
    const pantryCfg = window.SDData.EQUIPMENT_UPGRADES.find(u => u.id === 'ingredient_pantry');
    const pantryLvl = (this.state.upgrades && this.state.upgrades.ingredient_pantry) || 1;
    const earlyUnlock = pantryCfg ? ((pantryCfg.levels.find(l => l.level === pantryLvl) || {}).earlyUnlock || 0) : 0;
    const effectiveLevel = this.state.level + earlyUnlock;
    return window.SDData.BATTERS.filter(b => {
      const ing = ings.find(i => i.id === b.flavorIngredient);
      return !ing || ing.unlockLevel <= effectiveLevel;
    });
  }

  getUnlockedFrostings() {
    return window.SDData.FROSTING_COLORS.filter(f => f.unlockLevel <= this.state.level);
  }

  getUnlockedToppings() {
    return window.SDData.TOPPINGS.filter(t => t.unlockLevel <= this.state.level);
  }

  getUnlockedAccessories() {
    return window.SDData.ACCESSORIES.filter(a => a.unlockLevel <= this.state.level);
  }

  recordToCollection(order, cakeState, score) {
    const key = `${cakeState.cakeType}_${cakeState.batter}_${cakeState.frostingColor}`;
    const cakeInfo = this.getCakeType(cakeState.cakeType);
    const batterInfo = this.getBatter(cakeState.batter);
    const frostInfo = window.SDData.FROSTING_COLORS.find(f => f.id === cakeState.frostingColor);
    const displayName = order.styleName || `${cakeInfo.name} ${batterInfo.name} (${frostInfo ? frostInfo.name : ''})`;

    const existing = this.state.collection[key];
    if (!existing) {
      this.state.collection[key] = {
        key,
        name: displayName,
        cakeType: cakeState.cakeType,
        batter: cakeState.batter,
        frostingColor: cakeState.frostingColor,
        cakeSnapshot: JSON.parse(JSON.stringify(cakeState)),
        bestScore: score,
        count: 1
      };
    } else {
      existing.count += 1;
      if (score >= existing.bestScore) {
        existing.bestScore = score;
        existing.cakeSnapshot = JSON.parse(JSON.stringify(cakeState));
      }
    }
    this.saveManager.save(this.state);
  }
};

