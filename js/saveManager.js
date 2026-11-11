// ============================================================================
// SWEET DREAMS - TIỆM BÁNH NGỌT
// SaveManager: LocalStorage Persistence & Default State
// ============================================================================

window.SaveManager = class SaveManager {
  constructor(storageKey = 'sweet_dreams_bakery_save_v1') {
    this.storageKey = storageKey;
  }

  createDefaultState() {
    return {
      day: 1,
      level: 1,
      xp: 0,
      coins: 150,
      reputation: 10,
      inventory: {
        flour: 12,
        sugar: 12,
        egg: 12,
        milk: 10,
        butter: 10,
        vanilla: 8,
        chocolate: 8,
        cacao: 4,
        strawberry: 8,
        blueberry: 4,
        matcha: 4,
        caramel: 4,
        cream_cheese: 4,
        gelatin: 4,
        ginger_spice: 4
      },
      upgrades: {
        oven: 1,
        mixer: 1,
        deco_table: 1,
        display_shelf: 1,
        counter_service: 1,
        ingredient_pantry: 1
      },
      decorationsOwned: [],
      equippedDecors: {}, // category -> decorId
      decorPositions: {
        fairy_lights: { xPct: 50, yPct: 12 },
        crystal_lights: { xPct: 50, yPct: 14 },
        bakery_signboard: { xPct: 50, yPct: 26 },
        ribbon_bunting: { xPct: 50, yPct: 36 },
        wall_art: { xPct: 28, yPct: 44 },
        flower_pots: { xPct: 30, yPct: 62 },
        monstera_plant: { xPct: 14, yPct: 78 },
        cozy_seating: { xPct: 80, yPct: 78 }
      },
      orderHistory: [], // completed orders history
      collection: {}, // key -> { name, cakeState, bestScore, count }
      unlockedAchievements: [],
      claimedAchievements: [],
      dailyQuests: [], // populated by UpgradeManager
      stats: {
        totalOrders: 0,
        customersServed: 0,
        customersLost: 0,
        perfectCount: 0,
        totalEarned: 0,
        specialCompleted: 0,
        dayOrders: 0,
        dayCoins: 0,
        streak: 0,
        bestStreak: 0,
        dayGoalClaimedDay: 0
      },
      settings: {
        soundEnabled: true,
        musicEnabled: true,
        volume: 0.55
      },
      guidesSeen: {
        accept_order: false,
        prep_ingredient: false,
        prep_whisk: false,
        oven_pour: false,
        decorate_frosting: false
      },
      tutorialSeen: false
    };
  }

  hasSave() {
    try {
      return !!localStorage.getItem(this.storageKey);
    } catch {
      return false;
    }
  }

  load() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return this.createDefaultState();
      const parsed = JSON.parse(raw);
      const def = this.createDefaultState();
      const ownedDecors = Array.isArray(parsed.decorationsOwned) ? parsed.decorationsOwned : [];
      const unlockedAchs = Array.isArray(parsed.unlockedAchievements) ? parsed.unlockedAchievements : [];
      // Backward compatibility: auto-equip owned decors if equippedDecors missing
      let equipped = parsed.equippedDecors && typeof parsed.equippedDecors === 'object' ? { ...parsed.equippedDecors } : {};
      if (!parsed.equippedDecors && ownedDecors.length > 0 && window.SDData && window.SDData.SHOP_DECORS) {
        ownedDecors.forEach(id => {
          const item = window.SDData.SHOP_DECORS.find(d => d.id === id);
          if (item) equipped[item.category] = id;
        });
      }
      return {
        ...def,
        ...parsed,
        inventory: { ...def.inventory, ...(parsed.inventory || {}) },
        upgrades: { ...def.upgrades, ...(parsed.upgrades || {}) },
        stats: { ...def.stats, ...(parsed.stats || {}) },
        settings: { ...def.settings, ...(parsed.settings || {}) },
        guidesSeen: { ...def.guidesSeen, ...(parsed.guidesSeen || {}) },
        collection: parsed.collection || {},
        decorationsOwned: ownedDecors,
        equippedDecors: equipped,
        decorPositions: { ...def.decorPositions, ...(parsed.decorPositions || {}) },
        orderHistory: Array.isArray(parsed.orderHistory) ? parsed.orderHistory : [],
        unlockedAchievements: unlockedAchs,
        claimedAchievements: Array.isArray(parsed.claimedAchievements) ? parsed.claimedAchievements : [...unlockedAchs],
        dailyQuests: Array.isArray(parsed.dailyQuests) ? parsed.dailyQuests : []
      };
    } catch {
      return this.createDefaultState();
    }
  }

  save(state) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(state));
      return true;
    } catch {
      return false;
    }
  }

  clear() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch {
      // ignore storage errors
    }
  }
};

