// ============================================================================
// SWEET DREAMS - TIỆM BÁNH NGỌT
// BakingManager: Prep (Drag/Drop), Mixing (Whisking Physics), Oven (4 States)
// ============================================================================

window.BakingManager = class BakingManager {
  constructor(economyManager, recipeManager, upgradeManager, audioManager) {
    this.economy = economyManager;
    this.recipes = recipeManager;
    this.upgrades = upgradeManager;
    this.audio = audioManager;
    this.session = null;
  }

  startSession(order) {
    this.session = {
      orderId: order.orderId,
      targetOrder: order,
      // Player selections (must actively choose!)
      selectedCakeType: null,
      selectedBatter: null,
      addedIngredients: [],
      mixProgress: 0,
      isMixing: false,
      mixQuality: 0, // 0..100
      // Oven stage
      selectedMold: null,
      batterPoured: false,
      inOven: false,
      selectedTemp: 180,
      ovenRunning: false,
      bakeElapsed: 0,
      bakeTargetTime: 7,
      bakeState: 'raw', // raw | baking | perfect | burnt
      bakeQuality: 0,
      dingPlayed: false,
      startedAt: Date.now()
    };
    return this.session;
  }

  getMissingIngredientsForOrder(order) {
    if (!order) return [];
    const req = this.recipes.getRequiredIngredients(order.cakeType, order.batter);
    return req.filter(id => this.economy.getStock(id) <= 0);
  }

  selectCakeType(cakeTypeId) {
    if (!this.session) return { ok: false };
    this.session.selectedCakeType = cakeTypeId;
    const cake = this.recipes.getCakeType(cakeTypeId);
    const ovenLvl = this.upgrades.getUpgradeLevelData('oven');
    this.session.bakeTargetTime = +(cake.bakeTime / ovenLvl.speedMult).toFixed(2);
    this.audio.playClick();
    return { ok: true };
  }

  selectBatter(batterId) {
    if (!this.session) return { ok: false };
    const batter = this.recipes.getBatter(batterId);
    const flavorId = batter ? batter.flavorIngredient : null;
    if (
      flavorId &&
      !this.session.addedIngredients.includes(flavorId) &&
      this.economy.getStock(flavorId) <= 0
    ) {
      const ing = window.SDData.INGREDIENTS.find(i => i.id === flavorId);
      this.audio.playError();
      return {
        ok: false,
        outOfStock: true,
        ingredientId: flavorId,
        reason: `Hết ${ing ? ing.name : flavorId} trong kho! Hãy ghé Kho hàng mua thêm trước khi chọn cốt bánh này.`
      };
    }
    this.session.selectedBatter = batterId;
    this.audio.playClick();
    return { ok: true };
  }

  getRequiredList() {
    if (!this.session || !this.session.selectedCakeType || !this.session.selectedBatter) {
      return [];
    }
    return this.recipes.getRequiredIngredients(this.session.selectedCakeType, this.session.selectedBatter);
  }

  addIngredient(ingredientId) {
    if (!this.session) return { ok: false, reason: 'Chưa bắt đầu làm bánh.' };
    if (!this.session.selectedCakeType || !this.session.selectedBatter) {
      this.audio.playError();
      return { ok: false, reason: 'Hãy chọn Loại bánh và Cốt bánh trước khi cho nguyên liệu!' };
    }

    const required = this.getRequiredList();
    if (!required.includes(ingredientId)) {
      this.audio.playError();
      const ing = window.SDData.INGREDIENTS.find(i => i.id === ingredientId);
      return {
        ok: false,
        wrongIngredient: true,
        reason: `Sai nguyên liệu! Công thức này không dùng ${ing ? ing.name : ingredientId}.`
      };
    }

    if (this.session.addedIngredients.includes(ingredientId)) {
      return { ok: false, reason: 'Nguyên liệu này đã có đủ trong tô rồi!' };
    }

    if (!this.economy.consumeIngredient(ingredientId, 1)) {
      this.audio.playError();
      return { ok: false, outOfStock: true, reason: 'Hết nguyên liệu trong kho! Hãy ghé Kho nguyên liệu để mua thêm.' };
    }

    this.session.addedIngredients.push(ingredientId);
    this.audio.playIngredientDrop();
    return {
      ok: true,
      allAdded: this.session.addedIngredients.length >= required.length
    };
  }

  areAllIngredientsAdded() {
    const req = this.getRequiredList();
    return req.length > 0 && req.every(id => this.session.addedIngredients.includes(id));
  }

  whiskStep(amount = 14) {
    if (!this.session || !this.areAllIngredientsAdded()) {
      return { ok: false, reason: 'Hãy cho đủ tất cả nguyên liệu vào tô trước khi trộn!' };
    }
    const mixerLvl = this.upgrades.getUpgradeLevelData('mixer');
    const delta = amount * mixerLvl.speedMult;
    this.session.mixProgress = Math.min(120, this.session.mixProgress + delta);

    const p = this.session.mixProgress;
    if (p < 60) {
      this.session.mixQuality = Math.round(40 + (p / 60) * 35);
    } else if (p <= 98) {
      this.session.mixQuality = Math.min(100, 92 + (mixerLvl.bonusQuality || 0));
    } else {
      // Over-mixed penalty softened by mixer upgrade
      const penalty = Math.max(8, 25 - (mixerLvl.bonusQuality || 0) * 2);
      this.session.mixQuality = Math.max(45, 95 - penalty);
    }

    this.audio.playWhisk();
    return {
      ok: true,
      progress: this.session.mixProgress,
      quality: this.session.mixQuality,
      status: p < 60 ? 'undermixed' : p <= 98 ? 'optimal' : 'overmixed'
    };
  }

  canProceedToOven() {
    return this.session && this.areAllIngredientsAdded() && this.session.mixProgress >= 50;
  }

  selectMold(cakeTypeId) {
    if (!this.session) return;
    this.session.selectedMold = cakeTypeId;
    this.audio.playClick();
  }

  pourBatter() {
    if (!this.session) return { ok: false, reason: 'Chưa có phiên làm bánh.' };
    if (!this.session.selectedMold) {
      this.audio.playError();
      return { ok: false, reason: 'Hãy chọn khuôn bánh trước khi đổ bột!' };
    }
    this.session.batterPoured = true;
    this.audio.playIngredientDrop();
    return { ok: true };
  }

  setTemperature(temp) {
    if (!this.session) return;
    this.session.selectedTemp = Number(temp);
    this.audio.playClick();
  }

  startBaking() {
    if (!this.session) return { ok: false };
    if (!this.session.batterPoured) {
      this.audio.playError();
      return { ok: false, reason: 'Hãy đổ bột vào khuôn trước khi nướng!' };
    }
    this.session.inOven = true;
    this.session.ovenRunning = true;
    this.session.bakeElapsed = 0;
    this.session.bakeState = 'raw';
    this.session.dingPlayed = false;
    return { ok: true };
  }

  updateOven(dt) {
    if (!this.session || !this.session.ovenRunning) return false;
    const cake = this.recipes.getCakeType(this.session.selectedCakeType);
    const tempDiff = Math.abs(this.session.selectedTemp - cake.idealTemp);
    // Wrong temp affects speed/quality slightly
    const tempFactor = this.session.selectedTemp > cake.idealTemp ? 1.18 : (this.session.selectedTemp < cake.idealTemp ? 0.85 : 1.0);
    this.session.bakeElapsed += dt * tempFactor;

    const ovenLvl = this.upgrades.getUpgradeLevelData('oven');
    const target = this.session.bakeTargetTime;
    const perfectWindow = ovenLvl.perfectWindow || 2.8;
    const ratio = this.session.bakeElapsed / target;

    if (ratio < 0.35) {
      this.session.bakeState = 'raw';
      this.session.bakeQuality = 25;
    } else if (ratio < 0.9) {
      this.session.bakeState = 'baking';
      this.session.bakeQuality = 65;
    } else if (this.session.bakeElapsed <= target + perfectWindow) {
      this.session.bakeState = 'perfect';
      this.session.bakeQuality = Math.max(75, 100 - Math.round(tempDiff * 0.6));
      if (!this.session.dingPlayed) {
        this.session.dingPlayed = true;
        this.audio.playOvenDing();
      }
    } else {
      this.session.bakeState = 'burnt';
      this.session.bakeQuality = 20;
    }
    return true;
  }

  takeOutOfOven() {
    if (!this.session || !this.session.inOven) return { ok: false, reason: 'Bánh chưa vào lò!' };
    this.session.ovenRunning = false;
    this.audio.playClick();
    return {
      ok: true,
      bakeState: this.session.bakeState,
      bakeQuality: this.session.bakeQuality
    };
  }

  retryBake() {
    if (!this.session) return;
    this.session.inOven = false;
    this.session.ovenRunning = false;
    this.session.bakeElapsed = 0;
    this.session.bakeState = 'raw';
    this.session.bakeQuality = 0;
    this.session.dingPlayed = false;
  }
};

