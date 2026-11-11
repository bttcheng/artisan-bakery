// ============================================================================
// SWEET DREAMS - TIỆM BÁNH NGỌT
// DecorationManager: Frosting, Drag/Drop Toppings, Undo, Reposition, Packaging
// ============================================================================

window.DecorationManager = class DecorationManager {
  constructor(audioManager) {
    this.audio = audioManager;
    this.cakeState = null;
    this.packaging = null;
    this.history = [];
    this.activeTool = {
      mode: 'frosting', // 'frosting' | 'topping' | 'accessory'
      frostingColor: 'pink',
      nozzle: 'swirl',
      toppingId: 'strawberry',
      accessoryId: 'candle',
      signText: 'Happy Birthday'
    };
  }

  initFromBaking(bakingSession) {
    this.cakeState = {
      cakeType: bakingSession.selectedCakeType || 'cupcake',
      batter: bakingSession.selectedBatter || 'vanilla',
      bakeState: bakingSession.bakeState || 'perfect',
      bakeQuality: bakingSession.bakeQuality || 85,
      mixQuality: bakingSession.mixQuality || 85,
      frostingApplied: false,
      frostingColor: 'pink',
      nozzle: 'swirl',
      toppings: [],
      accessories: []
    };
    this.packaging = {
      boxColor: 'pink',
      ribbonColor: 'rose',
      card: 'none',
      sticker: 'none',
      closed: false
    };
    this.history = [];
    return this.cakeState;
  }

  _pushHistory() {
    if (!this.cakeState) return;
    this.history.push(JSON.stringify({
      frostingApplied: this.cakeState.frostingApplied,
      frostingColor: this.cakeState.frostingColor,
      nozzle: this.cakeState.nozzle,
      toppings: this.cakeState.toppings,
      accessories: this.cakeState.accessories
    }));
    if (this.history.length > 30) this.history.shift();
  }

  applyFrosting(colorId = this.activeTool.frostingColor, nozzleId = this.activeTool.nozzle) {
    if (!this.cakeState) return;
    this._pushHistory();
    this.cakeState.frostingApplied = true;
    this.cakeState.frostingColor = colorId;
    this.cakeState.nozzle = nozzleId;
    this.audio.playFrosting();
  }

  addToppingAt(toppingId, x = 100, y = 95) {
    if (!this.cakeState) return;
    this._pushHistory();
    const clampedX = Math.max(46, Math.min(154, Math.round(x)));
    const clampedY = Math.max(54, Math.min(152, Math.round(y)));
    this.cakeState.toppings.push({ type: toppingId, x: clampedX, y: clampedY });
    this.audio.playToppingPop();
  }

  moveTopping(idx, x, y) {
    if (!this.cakeState || !this.cakeState.toppings[idx]) return;
    this.cakeState.toppings[idx].x = Math.max(46, Math.min(154, Math.round(x)));
    this.cakeState.toppings[idx].y = Math.max(54, Math.min(152, Math.round(y)));
  }

  addAccessoryAt(accessoryId, x = 100, y = 72, customText = null) {
    if (!this.cakeState || accessoryId === 'none') return;
    this._pushHistory();
    const clampedX = Math.max(46, Math.min(154, Math.round(x)));
    const clampedY = Math.max(36, Math.min(130, Math.round(y)));
    this.cakeState.accessories.push({
      type: accessoryId,
      x: clampedX,
      y: clampedY,
      text: customText || this.activeTool.signText || 'Happy Birthday'
    });
    this.audio.playToppingPop();
  }

  moveAccessory(idx, x, y) {
    if (!this.cakeState || !this.cakeState.accessories[idx]) return;
    this.cakeState.accessories[idx].x = Math.max(46, Math.min(154, Math.round(x)));
    this.cakeState.accessories[idx].y = Math.max(36, Math.min(130, Math.round(y)));
  }

  undo() {
    if (!this.cakeState || this.history.length === 0) return false;
    const prev = JSON.parse(this.history.pop());
    this.cakeState.frostingApplied = prev.frostingApplied;
    this.cakeState.frostingColor = prev.frostingColor;
    this.cakeState.nozzle = prev.nozzle;
    this.cakeState.toppings = prev.toppings;
    this.cakeState.accessories = prev.accessories;
    this.audio.playClick();
    return true;
  }

  clearDecorations() {
    if (!this.cakeState) return;
    this._pushHistory();
    this.cakeState.frostingApplied = false;
    this.cakeState.toppings = [];
    this.cakeState.accessories = [];
    this.audio.playClick();
  }

  // Packaging methods
  setBoxColor(boxColor) {
    if (!this.packaging) return;
    this.packaging.boxColor = boxColor;
    this.audio.playClick();
  }

  setRibbonColor(ribbonColor) {
    if (!this.packaging) return;
    this.packaging.ribbonColor = ribbonColor;
    this.audio.playClick();
  }

  setCard(cardId) {
    if (!this.packaging) return;
    this.packaging.card = cardId;
    this.audio.playClick();
  }

  setSticker(stickerId) {
    if (!this.packaging) return;
    this.packaging.sticker = stickerId;
    this.audio.playClick();
  }

  closeBox() {
    if (!this.packaging) return;
    this.packaging.closed = true;
    this.audio.playBoxClose();
  }

  reopenBox() {
    if (!this.packaging) return;
    this.packaging.closed = false;
    this.audio.playClick();
  }
};

