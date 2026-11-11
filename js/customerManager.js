// ============================================================================
// SWEET DREAMS - TIỆM BÁNH NGỌT
// CustomerManager: Up to 4 Concurrent Customers, Patience, Moods & Animations
// ============================================================================

window.CustomerManager = class CustomerManager {
  constructor(state, orderManager, upgradeManager, economyManager, audioManager) {
    this.state = state;
    this.orders = orderManager;
    this.upgrades = upgradeManager;
    this.economy = economyManager;
    this.audio = audioManager;
    this.slots = []; // { slotIndex, customer, order, patience, maxPatience, mood, state: 'entering'|'waiting'|'leaving', speech, waving }
    this.spawnCooldown = 1.5;
    this.onShopChange = null;
    this.onCustomerLeft = null;
  }

  resetForNewDay() {
    this.slots = [];
    this.orders.resetForNewDay();
    this.spawnCooldown = 1.0;
  }

  getMaxConcurrent() {
    const base = this.economy.getLevelInfo(this.state.level).maxCustomers;
    const counterLvl = this.upgrades.getUpgradeLevelData('counter_service');
    const extra = counterLvl ? (counterLvl.extraSlots || 0) : 0;
    return Math.min(6, base + extra);
  }

  getOccupiedSlotIndices() {
    return this.slots.map(s => s.slotIndex);
  }

  spawnCustomer(forceSpecial = false) {
    const maxSlots = this.getMaxConcurrent();
    if (this.slots.length >= maxSlots) return null;

    // Pick free slot 0..5
    const used = this.getOccupiedSlotIndices();
    const freeSlots = [0, 1, 2, 3, 4, 5].filter(i => !used.includes(i) && i < maxSlots);
    if (freeSlots.length === 0) return null;
    const slotIndex = freeSlots[0];

    // Pick unlocked customer not already in shop
    const activeIds = this.slots.map(s => s.customer.id);
    const pool = window.SDData.CUSTOMERS.filter(
      c => c.unlockLevel <= this.state.level && !activeIds.includes(c.id)
    );
    const candidates = pool.length > 0 ? pool : window.SDData.CUSTOMERS.filter(c => c.unlockLevel <= this.state.level);
    const customer = candidates[Math.floor(Math.random() * candidates.length)];

    const order = this.orders.generateOrder(customer, forceSpecial);
    const lvlData = this.economy.getLevelInfo(this.state.level);
    const patienceBonus = this.upgrades.getTotalPatienceBonus();
    const maxPatience = Math.round((customer.patienceBase * lvlData.patienceFactor) + patienceBonus + (order.isSpecial ? 25 : 0));

    const entry = {
      slotIndex,
      customer,
      order,
      patience: maxPatience,
      maxPatience,
      mood: 'happy',
      status: 'entering', // entering -> waiting -> leaving
      speech: order.speech,
      waving: true,
      enterTimer: 1.0
    };

    this.slots.push(entry);
    this.audio.playDoorBell();
    setTimeout(() => this.audio.playOrderPop(), 220);

    if (this.onShopChange) this.onShopChange({ doorOpen: true, spawned: entry });
    return entry;
  }

  update(dt, isDayActive, activeOrderIdBeingBaked = null, isWorkshopOpen = false) {
    if (!isDayActive) return;

    // Spawn logic (gentler pacing so player has breathing room)
    this.spawnCooldown -= dt;
    if (this.spawnCooldown <= 0 && this.slots.length < this.getMaxConcurrent()) {
      this.spawnCustomer();
      this.spawnCooldown = 11 + Math.random() * 6;
    }

    let changed = false;
    for (let i = this.slots.length - 1; i >= 0; i--) {
      const slot = this.slots[i];

      if (slot.status === 'entering') {
        slot.enterTimer -= dt;
        if (slot.enterTimer <= 0) {
          slot.status = 'waiting';
          slot.waving = false;
          changed = true;
        }
        continue;
      }

      if (slot.status === 'leaving') {
        slot.enterTimer -= dt;
        if (slot.enterTimer <= 0) {
          this.orders.removeOrder(slot.order.orderId);
          this.slots.splice(i, 1);
          changed = true;
        }
        continue;
      }

      // Waiting: drain patience much slower while player is actively baking in the kitchen
      const drainRate = (activeOrderIdBeingBaked === slot.order.orderId)
        ? 0.42
        : (isWorkshopOpen ? 0.68 : 0.88);
      slot.patience = Math.max(0, slot.patience - dt * drainRate);

      const ratio = slot.patience / slot.maxPatience;
      const prevMood = slot.mood;

      if (ratio > 0.6) {
        slot.mood = 'happy';
      } else if (ratio > 0.3) {
        slot.mood = 'impatient';
        if (prevMood !== 'impatient') {
          slot.speech = slot.customer.impatientLines[0];
          changed = true;
        }
      } else if (ratio > 0) {
        slot.mood = 'angry';
        if (prevMood !== 'angry') {
          slot.speech = slot.customer.impatientLines[1] || slot.customer.impatientLines[0];
          changed = true;
        }
      } else {
        // Patience ran out -> customer leaves angrily!
        slot.mood = 'angry';
        slot.status = 'leaving';
        slot.enterTimer = 1.4;
        slot.speech = slot.customer.sadLines[1] || 'Mình không chờ thêm được nữa!';
        this.state.stats.customersLost += 1;
        this.economy.addReputation(-2);
        this.audio.playError();
        if (this.onCustomerLeft) this.onCustomerLeft(slot, false);
        changed = true;
      }
    }

    if (changed && this.onShopChange) {
      this.onShopChange({});
    }
  }

  completeCustomerDelivery(orderId, scoreResult) {
    const idx = this.slots.findIndex(s => s.order.orderId === orderId);
    if (idx === -1) return null;
    const slot = this.slots[idx];

    if (scoreResult.score >= 70) {
      slot.mood = 'delighted';
      slot.speech = slot.customer.happyLines[Math.floor(Math.random() * slot.customer.happyLines.length)];
    } else if (scoreResult.score >= 50) {
      slot.mood = 'normal';
      slot.speech = 'Cảm ơn tiệm, bánh tạm ổn rồi ạ.';
    } else {
      slot.mood = 'disappointed';
      slot.speech = slot.customer.sadLines[0];
    }

    slot.status = 'leaving';
    slot.enterTimer = 1.6;
    if (this.onShopChange) this.onShopChange({});
    return slot;
  }

  getSlotByOrderId(orderId) {
    return this.slots.find(s => s.order.orderId === orderId) || null;
  }
};

