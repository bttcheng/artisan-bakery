// ============================================================================
// SWEET DREAMS - TIỆM BÁNH NGỌT
// OrderManager: Diverse Order Generation, Special Orders & Active Order Queue
// ============================================================================

window.OrderManager = class OrderManager {
  constructor(state, recipeManager) {
    this.state = state;
    this.recipes = recipeManager;
    this.activeOrders = [];
    this.orderSeq = 1;
    this.lastSignature = '';
  }

  resetForNewDay() {
    this.activeOrders = [];
  }

  _pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  generateOrder(customer, forceSpecial = false) {
    const level = this.state.level || 1;
    const day = this.state.day || 1;
    const personality = customer.personality || 'chill';
    const isSpecial = forceSpecial || (day >= 2 && level >= 2 && Math.random() < (personality === 'vip' ? 0.42 : 0.2));
    const idStr = String(this.orderSeq++).padStart(3, '0');

    let orderData = null;

    const unlockedCakes = this.recipes.getUnlockedCakeTypes();
    const unlockedBatters = this.recipes.getUnlockedBatters();
    const unlockedCakeIds = unlockedCakes.map(c => c.id);
    const unlockedBatterIds = unlockedBatters.map(b => b.id);
    const availableSpecials = window.SDData.SPECIAL_EVENTS.filter(
      ev => unlockedCakeIds.includes(ev.cakeType) && unlockedBatterIds.includes(ev.batter)
    );

    if (isSpecial && availableSpecials.length > 0) {
      const ev = this._pickRandom(availableSpecials);
      orderData = {
        orderId: `ORD-${idStr}`,
        orderNumber: `#${idStr}`,
        customerId: customer.id,
        isSpecial: true,
        specialBadge: ev.badge,
        styleName: ev.name,
        speech: ev.speech,
        cakeType: ev.cakeType,
        batter: ev.batter,
        frostingColor: ev.frostingColor,
        nozzle: ev.nozzle,
        topping: ev.topping,
        toppingCount: ev.toppingCount,
        accessory: ev.accessory,
        accCount: ev.accCount,
        extraAccessory: ev.extraAccessory || null,
        signText: ev.signText || 'Happy Birthday',
        quantity: ev.quantity || 1,
        boxColor: ev.boxColor,
        ribbonColor: ev.ribbonColor,
        card: ev.card || 'none',
        sticker: ev.sticker || 'none',
        bonusCoins: ev.bonusCoins,
        bonusXp: ev.bonusXp,
        createdAt: Date.now()
      };
    } else {
      const unlockedFrostings = this.recipes.getUnlockedFrostings();
      const unlockedToppings = this.recipes.getUnlockedToppings();
      const unlockedAcc = this.recipes.getUnlockedAccessories();

      // Day progression filters cake complexity naturally:
      // Day 1: easy small/classic cakes around ~175-180°C; Day 2+: full range including hot/precision cakes
      let dayCakePool = unlockedCakes;
      if (day === 1) {
        const easyDay1 = unlockedCakes.filter(c => ['cookie', 'cupcake_muffin', 'donut'].includes(c.group));
        if (easyDay1.length > 0) dayCakePool = easyDay1;
      } else if (day >= 3) {
        const hotOrPrecision = unlockedCakes.filter(c => c.idealTemp >= 185 || c.idealTemp <= 165 || c.group === 'cakes' || c.group === 'pastry');
        if ((personality === 'vip' || personality === 'picky') && hotOrPrecision.length > 0 && Math.random() < 0.7) {
          dayCakePool = hotOrPrecision;
        }
      }

      let attempt = 0;
      let candidate = null;
      do {
        attempt++;
        const cake = this._pickRandom(dayCakePool);
        let batter = this._pickRandom(unlockedBatters);
        if (customer.favoriteFlavor && Math.random() < 0.55) {
          const favB = unlockedBatters.find(b => b.id === customer.favoriteFlavor);
          if (favB) batter = favB;
        }
        let frosting = this._pickRandom(unlockedFrostings);
        if (customer.favoriteColor && Math.random() < 0.55) {
          const favF = unlockedFrostings.find(f => f.id === customer.favoriteColor);
          if (favF) frosting = favF;
        }

        const nozzle = this._pickRandom(window.SDData.NOZZLES);
        const topping = this._pickRandom(unlockedToppings);
        const maxTop = day === 1 ? 2 : day === 2 ? 3 : 4;
        const toppingCount = Math.min(maxTop, 1 + Math.floor(Math.random() * maxTop));

        const accChance = day === 1 ? 0.35 : (personality === 'vip' || personality === 'picky' ? 0.85 : 0.65);
        const acc = Math.random() < accChance ? this._pickRandom(unlockedAcc) : null;
        const accCount = acc ? (acc.id === 'candle' && day >= 2 ? 1 + Math.floor(Math.random() * 2) : 1) : 0;

        const box = this._pickRandom(window.SDData.BOX_COLORS);
        const ribbon = this._pickRandom(window.SDData.RIBBON_COLORS);
        const cardPick = day >= 2 && Math.random() < 0.5 ? this._pickRandom(window.SDData.BOX_CARDS.slice(1)) : window.SDData.BOX_CARDS[0];
        const stickerPick = Math.random() < 0.55 ? this._pickRandom(window.SDData.BOX_STICKERS.slice(1)) : window.SDData.BOX_STICKERS[0];

        // Day 2+ introduces multi-cake orders (2 cakes!) more often
        const canMulti = ['cookie', 'cupcake_muffin', 'donut'].includes(cake.group) || cake.id === 'macaron' || cake.id === 'cream_puff' || cake.id === 'cake_pop';
        const multiChance = day <= 1 ? 0 : Math.min(0.55, 0.22 + (day - 2) * 0.12);
        const quantity = canMulti && Math.random() < multiChance ? 2 : 1;

        const sig = `${cake.id}|${batter.id}|${frosting.id}|${topping.id}|${toppingCount}|${quantity}`;
        if (sig !== this.lastSignature || attempt > 6) {
          this.lastSignature = sig;
          const greeting = this._pickRandom(customer.greetings);
          candidate = {
            orderId: `ORD-${idStr}`,
            orderNumber: `#${idStr}`,
            customerId: customer.id,
            isSpecial: false,
            styleName: `${cake.name} (${frosting.name})`,
            speech: greeting,
            cakeType: cake.id,
            batter: batter.id,
            frostingColor: frosting.id,
            nozzle: nozzle.id,
            topping: topping.id,
            toppingCount,
            accessory: acc ? acc.id : 'none',
            accCount,
            extraAccessory: null,
            signText: 'Sweet Dreams',
            quantity,
            boxColor: box.id,
            ribbonColor: ribbon.id,
            card: cardPick.id,
            sticker: stickerPick.id,
            bonusCoins: personality === 'vip' ? 25 : 0,
            bonusXp: personality === 'vip' ? 12 : 0,
            createdAt: Date.now()
          };
        }
      } while (!candidate);

      orderData = candidate;
    }

    orderData.accepted = false;
    orderData.targetDuration = this.calculateTargetDuration(orderData, customer);
    orderData.execElapsed = 0;
    orderData.execCompleted = false;
    orderData.targetPreview = this.buildTargetPreview(orderData);
    this.activeOrders.push(orderData);
    return orderData;
  }

  calculateTargetDuration(order, customer = null) {
    const cake = this.recipes.getCakeType(order.cakeType);
    // Punchy arcade pace strictly 20..40s per order!
    let base = 24;
    if (order.cakeType === 'tiered_cake' || order.isSpecial) base = 33;
    else if (cake && cake.group === 'cookie') base = 20;
    else if (cake && (cake.group === 'cupcake_muffin' || cake.group === 'donut')) base = 23;
    else if (cake && cake.group === 'cakes') base = 28;
    else if (cake && cake.group === 'pastry') base = 26;
    else if (cake && cake.group === 'dessert') base = 24;

    const qtyBonus = Math.max(0, (order.quantity || 1) - 1) * 4;
    const detailBonus = Math.min(6, Math.round(((order.toppingCount || 0) * 1.1) + ((order.accCount || 0) * 1.5)));
    let raw = base + qtyBonus + detailBonus;
    if (customer && customer.personality === 'rush') {
      raw -= 3;
    }
    return Math.max(20, Math.min(40, Math.round(raw)));
  }

  buildTargetPreview(order) {
    const toppings = [];
    const count = order.toppingCount || 0;
    const cakeCfg = this.recipes.getCakeType(order.cakeType);
    const shape = cakeCfg ? (cakeCfg.moldShape || order.cakeType) : order.cakeType;
    for (let i = 0; i < count; i++) {
      const spreadX = count === 1 ? 100 : 72 + (i * (56 / Math.max(1, count - 1)));
      const spreadY = order.cakeType === 'tiered_cake'
        ? (i % 2 === 0 ? 72 : 114)
        : shape === 'donut'
          ? (i % 2 === 0 ? 96 : 142)
          : shape === 'cake_pop' || shape === 'parfait'
            ? 70 + (i % 2) * 12
            : 96 + (i % 2) * 10;
      toppings.push({ type: order.topping, x: Math.round(spreadX), y: Math.round(spreadY) });
    }

    const accessories = [];
    if (order.accessory && order.accessory !== 'none') {
      const aCount = order.accCount || 1;
      for (let i = 0; i < aCount; i++) {
        const ax = aCount === 1 ? 100 : 74 + (i * (52 / Math.max(1, aCount - 1)));
        const ay = order.cakeType === 'tiered_cake' ? 58 : 74;
        accessories.push({ type: order.accessory, x: Math.round(ax), y: ay, text: order.signText });
      }
    }
    if (order.extraAccessory) {
      accessories.push({
        type: order.extraAccessory,
        x: 100,
        y: order.cakeType === 'tiered_cake' ? 46 : 62,
        text: order.signText || 'Happy Birthday'
      });
    }

    return {
      cakeType: order.cakeType,
      batter: order.batter,
      bakeState: 'perfect',
      frostingApplied: true,
      frostingColor: order.frostingColor,
      nozzle: order.nozzle,
      toppings,
      accessories
    };
  }

  getOrder(orderId) {
    return this.activeOrders.find(o => o.orderId === orderId) || null;
  }

  removeOrder(orderId) {
    this.activeOrders = this.activeOrders.filter(o => o.orderId !== orderId);
  }
};

