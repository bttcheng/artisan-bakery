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
    this.sessions = {};
    this.activeOrderId = null;
  }

  get session() {
    return this.activeOrderId ? (this.sessions[this.activeOrderId] || null) : null;
  }

  set session(val) {
    if (!val) {
      if (this.activeOrderId) delete this.sessions[this.activeOrderId];
      this.activeOrderId = null;
      return;
    }
    if (val.orderId) {
      this.sessions[val.orderId] = val;
      this.activeOrderId = val.orderId;
    }
  }

  getSession(orderId) {
    return this.sessions[orderId] || null;
  }

  getAllSessions() {
    return Object.values(this.sessions);
  }

  getActiveSessionCount() {
    return Object.keys(this.sessions).length;
  }

  removeSession(orderId) {
    delete this.sessions[orderId];
    if (this.activeOrderId === orderId) {
      const remaining = Object.keys(this.sessions);
      this.activeOrderId = remaining.length > 0 ? remaining[0] : null;
    }
  }

  resetAll() {
    this.sessions = {};
    this.activeOrderId = null;
  }

  startSession(order) {
    if (this.sessions[order.orderId]) {
      this.activeOrderId = order.orderId;
      return this.sessions[order.orderId];
    }
    const created = {
      orderId: order.orderId,
      targetOrder: order,
      step: 'prep',
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
      bakeTargetTime: 5.5,
      bakeState: 'raw', // raw | baking | perfect | burnt
      bakeQuality: 0,
      perfectHitAccuracy: 0,
      dingPlayed: false,
      nearBurnAlerted: false,
      burntAlerted: false,
      // Per-order persisted decoration & packaging stages when juggling 2-3 orders
      decoState: null,
      decoHistory: [],
      pkgState: null,
      startedAt: Date.now()
    };
    this.sessions[order.orderId] = created;
    this.activeOrderId = order.orderId;
    return created;
  }

  switchActiveSession(orderId) {
    if (!this.sessions[orderId]) return null;
    this.activeOrderId = orderId;
    return this.sessions[orderId];
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
    // Snappy 3.8..7.2s oven cycle so baking keeps a crisp 20-40s overall rhythm
    this.session.bakeTargetTime = Math.max(3.8, +((cake.bakeTime * 0.68) / ovenLvl.speedMult).toFixed(2));
    this.audio.playClick();
    return { ok: true };
  }

  getEffectivePerfectWindow(session = this.session) {
    const ovenLvl = this.upgrades.getUpgradeLevelData('oven');
    const baseWin = ovenLvl ? (ovenLvl.perfectWindow || 2.8) : 2.8;
    // Tighter, more thrilling perfect window (~1.8s at Lv.1, wider with upgrades)
    const cake = session && session.selectedCakeType ? this.recipes.getCakeType(session.selectedCakeType) : null;
    const tempStress = cake && (cake.idealTemp >= 190 || cake.idealTemp <= 165) ? 0.88 : 1.0;
    return Math.max(1.3, +(baseWin * 0.64 * tempStress).toFixed(2));
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
    this.session.perfectHitAccuracy = 0;
    this.session.dingPlayed = false;
    this.session.nearBurnAlerted = false;
    this.session.burntAlerted = false;
    return { ok: true };
  }

  _updateSingleOven(s, dt, events) {
    if (!s || !s.ovenRunning) return false;
    const cake = this.recipes.getCakeType(s.selectedCakeType);
    const tempDiff = Math.abs(s.selectedTemp - cake.idealTemp);
    // Higher temp bakes faster & burns quicker; off-temp lowers peak quality
    const tempFactor = s.selectedTemp > cake.idealTemp ? 1.24 : (s.selectedTemp < cake.idealTemp ? 0.85 : 1.0);
    s.bakeElapsed += dt * tempFactor;

    const target = s.bakeTargetTime;
    const perfectWindow = this.getEffectivePerfectWindow(s);
    const ratio = s.bakeElapsed / target;

    if (ratio < 0.35) {
      s.bakeState = 'raw';
      s.bakeQuality = 25;
    } else if (ratio < 0.92) {
      s.bakeState = 'baking';
      s.bakeQuality = 65;
    } else if (s.bakeElapsed <= target + perfectWindow) {
      s.bakeState = 'perfect';
      const perfectStart = target * 0.92;
      const span = target + perfectWindow - perfectStart;
      const posRatio = Math.max(0, Math.min(1, (s.bakeElapsed - perfectStart) / Math.max(0.4, span)));
      const centerAccuracy = Math.max(0, Math.round((1 - Math.abs(posRatio - 0.45) * 1.6) * 100));
      s.perfectHitAccuracy = centerAccuracy;
      s.bakeQuality = Math.max(76, Math.min(100, 100 - Math.round(tempDiff * 0.65)));
      if (!s.dingPlayed) {
        s.dingPlayed = true;
        this.audio.playOvenDing();
        events.dings.push(s.orderId);
      }
      if (!s.nearBurnAlerted && posRatio >= 0.68) {
        s.nearBurnAlerted = true;
        if (this.audio.playOvenWarning) this.audio.playOvenWarning();
        events.nearBurns.push(s.orderId);
      }
    } else {
      s.bakeState = 'burnt';
      s.bakeQuality = 0;
      s.perfectHitAccuracy = 0;
      if (!s.burntAlerted) {
        s.burntAlerted = true;
        if (this.audio.playBurnSizzle) this.audio.playBurnSizzle();
        else this.audio.playError();
        events.burns.push(s.orderId);
      }
    }
    return true;
  }

  updateOven(dt) {
    const events = { updated: false, activeUpdated: false, dings: [], nearBurns: [], burns: [] };
    Object.values(this.sessions).forEach(s => {
      if (this._updateSingleOven(s, dt, events)) {
        events.updated = true;
        if (s.orderId === this.activeOrderId) events.activeUpdated = true;
      }
    });
    return events.updated ? events : null;
  }

  takeOutOfOven() {
    if (!this.session || !this.session.inOven) return { ok: false, reason: 'Bánh chưa vào lò!' };
    this.session.ovenRunning = false;
    const isSweetCenter = this.session.bakeState === 'perfect' && this.session.perfectHitAccuracy >= 70;
    if (this.session.bakeState === 'perfect') {
      if (this.audio.playPerfectSnap) this.audio.playPerfectSnap();
      else this.audio.playSuccess();
    } else {
      this.audio.playClick();
    }
    return {
      ok: true,
      bakeState: this.session.bakeState,
      bakeQuality: this.session.bakeQuality,
      perfectHitAccuracy: this.session.perfectHitAccuracy || 0,
      isSweetCenter
    };
  }

  retryBake() {
    if (!this.session) return;
    this.session.inOven = false;
    this.session.ovenRunning = false;
    this.session.bakeElapsed = 0;
    this.session.bakeState = 'raw';
    this.session.bakeQuality = 0;
    this.session.perfectHitAccuracy = 0;
    this.session.dingPlayed = false;
    this.session.nearBurnAlerted = false;
    this.session.burntAlerted = false;
  }
};

