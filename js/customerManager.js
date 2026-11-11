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
    this.slots = []; // { slotIndex, customer, order, patience, maxPatience, accepted, waitStopped, cancelled, completed, mood, status, waitAction, waitActionTimer, speech, waving }
    this.spawnCooldown = 1.5;
    this.outsideWaiting = false;
    this.onShopChange = null;
    this.onCustomerLeft = null;
  }

  resetForNewDay() {
    this.slots = [];
    this.outsideWaiting = false;
    this.orders.resetForNewDay();
    this.spawnCooldown = 1.0;
  }

  getMaxConcurrent() {
    const day = this.state.day || 1;
    // Day 1: strictly 1 focused customer at a time; Day 2+: scales to 2 -> 3 -> 4+ so multi-order juggling shines!
    if (day === 1) return 1;
    const dayCap = day === 2 ? 2 : day === 3 ? 3 : 4;
    const lvlCap = this.economy.getLevelInfo(this.state.level).maxCustomers;
    const counterLvl = this.upgrades.getUpgradeLevelData('counter_service');
    const extra = counterLvl ? (counterLvl.extraSlots || 0) : 0;
    return Math.min(6, Math.max(dayCap, lvlCap) + extra);
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

    const day = this.state.day || 1;
    // Pick unlocked customer not already in shop, gated smoothly by day progression:
    // Day 1: Chill friendly regulars; Day 2+: Rush guests join; Day 3+: Picky critics & VIP join
    const activeIds = this.slots.map(s => s.customer.id);
    const allowedPersonalities = day <= 1
      ? ['chill']
      : day === 2
        ? ['chill', 'rush']
        : ['chill', 'rush', 'picky', 'vip'];

    let pool = window.SDData.CUSTOMERS.filter(
      c => c.unlockLevel <= Math.max(this.state.level, day)
        && allowedPersonalities.includes(c.personality || 'chill')
        && !activeIds.includes(c.id)
    );
    if (pool.length === 0) {
      pool = window.SDData.CUSTOMERS.filter(c => allowedPersonalities.includes(c.personality || 'chill'));
    }
    if (pool.length === 0) pool = window.SDData.CUSTOMERS;
    const customer = pool[Math.floor(Math.random() * pool.length)];

    const order = this.orders.generateOrder(customer, forceSpecial);
    const patienceBonus = this.upgrades.getTotalPatienceBonus();
    // Personality-driven counter patience (short for Rush & Picky, comfortable on Day 1)
    const pMult = customer.personality === 'rush' ? 0.62
      : customer.personality === 'picky' ? 0.68
      : customer.personality === 'vip' ? 0.85
      : 1.05;
    const dayTighten = Math.max(0.75, 1 - (day - 1) * 0.06);
    const baseWait = day === 1 ? 95 : Math.round((customer.patienceBase || 85) * pMult * dayTighten);
    const maxPatience = Math.max(36, Math.round(baseWait + patienceBonus + (order.isSpecial ? 14 : 0)));

    const entry = {
      slotIndex,
      customer,
      order,
      patience: maxPatience,
      maxPatience,
      accepted: false,
      waitStopped: false,
      cancelled: false,
      completed: false,
      mood: 'happy',
      status: 'entering', // entering -> waiting -> seated -> ready_pickup -> leaving
      waitAction: 'expectant_smile',
      waitActionTimer: 3.2,
      speech: order.speech,
      waving: true,
      enterTimer: 1.0
    };

    this.slots.push(entry);
    this.outsideWaiting = this.slots.length >= maxSlots;
    this.audio.playDoorBell();
    setTimeout(() => this.audio.playOrderPop(), 220);

    if (this.onShopChange) this.onShopChange({ doorOpen: true, spawned: entry });
    return entry;
  }

  acceptOrder(orderId) {
    const slot = this.getSlotByOrderId(orderId);
    if (!slot || slot.cancelled || slot.completed || slot.status === 'leaving') return null;

    if (!slot.accepted) {
      slot.accepted = true;
      slot.waitStopped = true;
      slot.waving = false;
      slot.status = 'seated';
      slot.mood = 'expectant';
      slot.waitAction = 'expectant_smile';
      slot.waitActionTimer = 3.0;
      slot.speech = 'Mình ra bàn ngồi đợi nhé, bạn cứ làm bánh thật ngon nha!';
      slot.order.accepted = true;
      // Independent execution timer starts strictly at 0 upon acceptance (wait time is NEVER included!)
      slot.order.execElapsed = 0;
      slot.order.execCompleted = false;
      if (this.onShopChange) this.onShopChange({ accepted: slot });
    }
    return slot;
  }

  markOrderReadyForPickup(orderId) {
    const slot = this.getSlotByOrderId(orderId);
    if (!slot || slot.cancelled || slot.completed || slot.status === 'leaving') return null;

    slot.accepted = true;
    slot.waitStopped = true;
    slot.status = 'ready_pickup';
    slot.mood = 'happy';
    slot.waving = true;
    slot.speech = 'Bánh thơm quá! Mình đứng tới quầy nhận bánh ngay đây!';
    slot.order.execCompleted = true;
    if (this.onShopChange) this.onShopChange({ ready: slot });
    return slot;
  }

  update(dt, opts = {}) {
    const isDayActive = typeof opts === 'boolean' ? opts : Boolean(opts.isDayActive);
    const isWorkshopOpen = typeof opts === 'object' ? Boolean(opts.isWorkshopOpen) : false;
    const freezeWaitTimers = typeof opts === 'object' ? Boolean(opts.freezeWaitTimers) : false;
    const freezeExecTimers = typeof opts === 'object' ? Boolean(opts.freezeExecTimers) : false;

    if (!isDayActive) return;

    let changed = false;
    const maxConcurrent = this.getMaxConcurrent();

    // Spawn logic: never exceed shop capacity; new customers wait outside if full
    if (!freezeWaitTimers) {
      if (this.slots.length < maxConcurrent) {
        if (this.outsideWaiting) {
          this.outsideWaiting = false;
          changed = true;
        }
        this.spawnCooldown -= dt;
        if (this.spawnCooldown <= 0) {
          this.spawnCustomer();
          const day = this.state.day || 1;
          this.spawnCooldown = day <= 1
            ? 2.2
            : Math.max(3.8, 9.5 - (day - 1) * 1.1) + Math.random() * 2.5;
        }
      } else {
        this.spawnCooldown = Math.max(0, this.spawnCooldown - dt);
        if (this.spawnCooldown <= 0 && !this.outsideWaiting) {
          this.outsideWaiting = true;
          changed = true;
        }
      }
    }

    const waitActionsCycle = ['expectant_smile', 'look_counter', 'check_watch'];

    for (let i = this.slots.length - 1; i >= 0; i--) {
      const slot = this.slots[i];

      if (slot.status === 'entering') {
        slot.enterTimer -= dt;
        if (slot.enterTimer <= 0) {
          slot.status = slot.accepted ? 'seated' : 'waiting';
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
          // If someone was waiting outside, invite them shortly after seat clears
          if (this.outsideWaiting && this.slots.length < maxConcurrent) {
            this.spawnCooldown = Math.min(this.spawnCooldown, 2.0);
          }
          changed = true;
        }
        continue;
      }

      // 2. Seated customer waiting for accepted cake: NEVER loses patience or leaves!
      if (slot.status === 'seated' || slot.accepted) {
        if (slot.status !== 'ready_pickup') {
          slot.status = 'seated';
          slot.mood = 'expectant';
          slot.waitActionTimer -= dt;
          if (slot.waitActionTimer <= 0) {
            const curIdx = waitActionsCycle.indexOf(slot.waitAction);
            slot.waitAction = waitActionsCycle[(curIdx + 1) % waitActionsCycle.length];
            slot.waitActionTimer = 3.2;
            changed = true;
          }
          if (!freezeExecTimers && !slot.order.execCompleted) {
            slot.order.execElapsed = Math.max(0, (slot.order.execElapsed || 0) + dt);
          }
        }
        continue;
      }

      // 1. Unaccepted customer at counter: pause completely only in reference/shop tabs; tick gently during baking on Day 2+
      if (slot.waitStopped || slot.cancelled || freezeWaitTimers) {
        continue;
      }
      const waitRate = isWorkshopOpen ? ((this.state.day || 1) <= 1 ? 0.25 : 0.55) : 1.0;

      slot.patience = Math.max(0, slot.patience - dt * waitRate);
      const ratio = slot.maxPatience > 0 ? (slot.patience / slot.maxPatience) : 0;
      const prevMood = slot.mood;

      if (ratio > 0.5) {
        slot.mood = 'happy';
      } else if (ratio > 0.2) {
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
      } else if (!slot.cancelled) {
        // Patience ran out BEFORE order was accepted -> customer leaves once only
        slot.cancelled = true;
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
    if (slot.completed || slot.cancelled) return null;

    slot.completed = true;
    slot.order.execCompleted = true;
    slot.waving = false;

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

  failCustomerOrder(orderId, reasonText = 'Bánh bị cháy mất rồi!') {
    const slot = this.getSlotByOrderId(orderId);
    if (!slot || slot.completed || slot.cancelled) return null;
    slot.cancelled = true;
    slot.mood = 'angry';
    slot.waving = false;
    slot.status = 'leaving';
    slot.enterTimer = 1.5;
    slot.speech = reasonText;
    this.state.stats.customersLost = (this.state.stats.customersLost || 0) + 1;
    this.state.stats.streak = 0;
    this.economy.addReputation(-3);
    if (this.onShopChange) this.onShopChange({});
    return slot;
  }

  getSlotByOrderId(orderId) {
    return this.slots.find(s => s.order.orderId === orderId) || null;
  }
};

