// ============================================================================
// SWEET DREAMS - TIỆM BÁNH NGỌT
// GameManager & Application Bootstrap
// ============================================================================

window.GameManager = class GameManager {
  constructor() {
    this.saveManager = new window.SaveManager();
    this.state = this.saveManager.load();

    this.audio = new window.AudioManager();
    this.audio.setEnabled(this.state.settings.soundEnabled);
    this.audio.setMusicEnabled(this.state.settings.musicEnabled);
    this.audio.setVolume(this.state.settings.volume);

    this.economy = new window.EconomyManager(this.state, this.saveManager, this.audio);
    this.recipes = new window.RecipeManager(this.state, this.saveManager);
    this.upgrades = new window.UpgradeManager(this.state, this.economy, this.saveManager, this.audio);
    this.orders = new window.OrderManager(this.state, this.recipes);
    this.customers = new window.CustomerManager(this.state, this.orders, this.upgrades, this.economy, this.audio);
    this.baking = new window.BakingManager(this.economy, this.recipes, this.upgrades, this.audio);
    this.decoration = new window.DecorationManager(this.audio);
    this.scoring = new window.ScoringManager(this.recipes, this.upgrades);

    this.currentScreen = 'intro';
    this.activeTab = 'bakery';
    this.activeSubTab = 'recipes';
    this.ordersView = 'active';
    this.recipeCategory = 'all';
    this.isDayActive = false;
    this.paused = false;
    this.dayElapsed = 0;
    this.dayDuration = 420; // 7 minutes per in-game day (~08:00 to 20:00)

    this.activeOrderId = null;
    this.workshopStep = 'prep'; // prep | bake | decorate | package
    this.readyPackage = null; // { orderId, cakeState, packaging } if returned to shop
    this.tutorialReturnScreen = 'start';
    this.inspectedOrderId = null;
    this.mixingCanvas = null;

    this._lastTime = performance.now();
    this._uiTick = 0;
    this._whiskInterval = null;
    this._dragState = null;

    this.customers.onShopChange = (info) => {
      if (info && info.doorOpen) {
        const door = document.getElementById('bakery-door');
        if (door) {
          door.classList.add('door-open');
          setTimeout(() => door.classList.remove('door-open'), 1100);
        }
      }
      this.renderBakeryCustomers();
      this.renderOrdersTab();
      this.updateBadges();
    };

    this.customers.onCustomerLeft = (slot) => {
      this.showToast(`${slot.customer.name} đã rời đi vì chờ quá lâu! (-2 danh tiếng)`, 'error');
      if (this.activeOrderId === slot.order.orderId) {
        this.showToast('Khách của đơn đang làm đã rời đi!', 'error');
      }
      this.updateHUD();
    };

    this.initDOM();
    this.startLoop();
  }

  // --------------------------------------------------------------------------
  // INITIALIZATION & EVENT BINDINGS
  // --------------------------------------------------------------------------
  initDOM() {
    this.mixingCanvas = new window.MixingCanvasController('mixing-canvas');
    this.renderIntroHero();
    this.refreshStartScreen();
    this.bindScreenNavigation();
    this.bindHUDAndModals();
    this.bindBakeryActions();
    this.bindWorkshopActions();
    this.bindPointerDragAndDrop();
  }

  renderIntroHero() {
    const el = document.getElementById('intro-hero-art');
    if (!el) return;
    el.innerHTML =
      window.SDRenderer.renderCharacter('miu', 'delighted', { width: 92, height: 112, wave: true }) +
      window.SDRenderer.renderCake({ cakeType: 'tiered_cake', batter: 'vanilla', frostingColor: 'pink', nozzle: 'piped', frostingApplied: true, toppings: [{ type: 'strawberry', x: 80, y: 74 }, { type: 'strawberry', x: 120, y: 74 }], accessories: [{ type: 'candle', x: 100, y: 54 }] }, 115) +
      window.SDRenderer.renderCharacter('ken', 'happy', { width: 92, height: 112 });
  }

  refreshStartScreen() {
    const hasSave = this.saveManager.hasSave();
    const contBtn = document.getElementById('btn-continue-game');
    const summary = document.getElementById('save-summary-box');
    if (hasSave) {
      contBtn.classList.remove('hidden');
      summary.classList.remove('hidden');
      summary.innerHTML = `Tiến trình đã lưu: <b>Ngày ${this.state.day}</b> • <b>Cấp ${this.state.level}</b> • <b>${this.state.coins} xu</b> • <b>${this.state.stats.customersServed} khách</b>`;
    } else {
      contBtn.classList.add('hidden');
      summary.classList.add('hidden');
    }
  }

  showScreen(name) {
    this.currentScreen = name;
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(`screen-${name}`);
    if (target) target.classList.add('active');
  }

  bindScreenNavigation() {
    document.getElementById('btn-go-start').addEventListener('click', () => {
      this.audio.playClick();
      this.refreshStartScreen();
      this.showScreen('start');
    });

    document.getElementById('btn-continue-game').addEventListener('click', () => {
      this.audio.init();
      this.audio.playSuccess();
      this.startMainGame();
    });

    document.getElementById('btn-new-game').addEventListener('click', () => {
      this.audio.init();
      if (this.saveManager.hasSave() && !confirm('Bạn có chắc muốn mở tiệm mới và xóa tiến trình cũ?')) {
        return;
      }
      this.saveManager.clear();
      this.state = this.saveManager.createDefaultState();
      this.rebindStateReferences();
      this.audio.playSuccess();
      if (!this.state.tutorialSeen) {
        this.state.tutorialSeen = true;
        this.saveManager.save(this.state);
        this.tutorialReturnScreen = 'main';
        this.showScreen('tutorial');
      } else {
        this.startMainGame();
      }
    });

    document.getElementById('btn-open-tutorial').addEventListener('click', () => {
      this.audio.playClick();
      this.tutorialReturnScreen = 'start';
      this.showScreen('tutorial');
    });

    document.getElementById('btn-close-tutorial').addEventListener('click', () => {
      this.audio.playClick();
      this.showScreen(this.tutorialReturnScreen === 'main' ? 'main' : 'start');
    });

    document.getElementById('btn-tut-start-play').addEventListener('click', () => {
      this.audio.init();
      this.audio.playSuccess();
      this.startMainGame();
    });

    // Bottom Navigation Tabs
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.audio.playClick();
        this.switchTab(btn.dataset.tab);
      });
    });

    // Orders Subtabs (Active vs History)
    document.querySelectorAll('#orders-filter-pills .subtab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.audio.playClick();
        document.querySelectorAll('#orders-filter-pills .subtab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.ordersView = btn.dataset.orderView;
        this.renderOrdersTab();
      });
    });

    // Collection Subtabs
    document.querySelectorAll('#tab-collection .subtab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.audio.playClick();
        document.querySelectorAll('#tab-collection .subtab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeSubTab = btn.dataset.subtab;
        this.renderCollectionTab();
      });
    });

    // Recipe Category Filter
    document.querySelectorAll('#recipe-category-bar .chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.audio.playClick();
        document.querySelectorAll('#recipe-category-bar .chip-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.recipeCategory = btn.dataset.rcat;
        this.renderCollectionTab();
      });
    });
  }

  rebindStateReferences() {
    this.economy = new window.EconomyManager(this.state, this.saveManager, this.audio);
    this.recipes = new window.RecipeManager(this.state, this.saveManager);
    this.upgrades = new window.UpgradeManager(this.state, this.economy, this.saveManager, this.audio);
    this.orders = new window.OrderManager(this.state, this.recipes);
    this.customers = new window.CustomerManager(this.state, this.orders, this.upgrades, this.economy, this.audio);
    this.baking = new window.BakingManager(this.economy, this.recipes, this.upgrades, this.audio);
    this.scoring = new window.ScoringManager(this.recipes, this.upgrades);
    this.customers.onShopChange = () => {
      this.renderBakeryCustomers();
      this.renderOrdersTab();
      this.updateBadges();
    };
    this.customers.onCustomerLeft = (slot) => {
      this.showToast(`${slot.customer.name} đã rời đi vì chờ quá lâu!`, 'error');
      this.updateHUD();
    };
  }

  startMainGame() {
    this.showScreen('main');
    this.isDayActive = true;
    this.paused = false;
    this.dayElapsed = 0;
    this.customers.resetForNewDay();
    this.upgrades.ensureDailyQuests();

    // Spawn first customer immediately so the shop feels alive!
    setTimeout(() => {
      if (this.isDayActive && this.customers.slots.length === 0) {
        this.customers.spawnCustomer();
      }
    }, 350);

    this.switchTab('bakery');
    this.updateHUD();
    this.applyShopVisualUpgrades();
    this.renderDisplayCakes();
    this.renderBakeryCustomers();
  }

  switchTab(tabId) {
    this.activeTab = tabId;
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tabId));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === `tab-${tabId}`));

    if (tabId === 'orders') this.renderOrdersTab();
    else if (tabId === 'collection') this.renderCollectionTab();
    else if (tabId === 'inventory') this.renderInventoryTab();
    else if (tabId === 'decor') this.renderDecorTab();
    else if (tabId === 'upgrades') this.renderUpgradesTab();
    else if (tabId === 'achievements') this.renderAchievementsTab();
  }

  // --------------------------------------------------------------------------
  // HUD, MODALS & SETTINGS
  // --------------------------------------------------------------------------
  bindHUDAndModals() {
    document.getElementById('btn-sound-quick').addEventListener('click', () => {
      this.audio.init();
      const next = !this.audio.enabled;
      this.audio.setEnabled(next);
      this.state.settings.soundEnabled = next;
      document.getElementById('set-sound').checked = next;
      document.getElementById('btn-sound-quick').textContent = next ? '🔊' : '🔇';
      this.saveManager.save(this.state);
    });

    document.getElementById('btn-pause').addEventListener('click', () => {
      this.audio.playClick();
      this.paused = true;
      this.openModal('modal-pause');
    });

    document.getElementById('btn-resume-game').addEventListener('click', () => {
      this.audio.playClick();
      this.paused = false;
      this.closeAllModals();
    });

    document.getElementById('btn-pause-tutorial').addEventListener('click', () => {
      this.closeAllModals();
      this.tutorialReturnScreen = 'main';
      this.showScreen('tutorial');
    });

    document.getElementById('btn-settings').addEventListener('click', () => {
      this.audio.playClick();
      document.getElementById('set-sound').checked = this.state.settings.soundEnabled;
      document.getElementById('set-music').checked = this.state.settings.musicEnabled;
      document.getElementById('set-volume').value = this.state.settings.volume;
      this.paused = true;
      this.openModal('modal-settings');
    });

    document.getElementById('set-sound').addEventListener('change', (e) => {
      this.state.settings.soundEnabled = e.target.checked;
      this.audio.setEnabled(e.target.checked);
      document.getElementById('btn-sound-quick').textContent = e.target.checked ? '🔊' : '🔇';
      this.saveManager.save(this.state);
    });

    document.getElementById('set-music').addEventListener('change', (e) => {
      this.state.settings.musicEnabled = e.target.checked;
      this.audio.setMusicEnabled(e.target.checked);
      this.saveManager.save(this.state);
    });

    document.getElementById('set-volume').addEventListener('input', (e) => {
      const v = parseFloat(e.target.value);
      this.state.settings.volume = v;
      this.audio.setVolume(v);
      this.saveManager.save(this.state);
    });

    document.getElementById('btn-reset-save').addEventListener('click', () => {
      if (!confirm('Xóa toàn bộ dữ liệu tiệm bánh và bắt đầu lại?')) return;
      this.saveManager.clear();
      location.reload();
    });

    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.audio.playClick();
        this.paused = false;
        this.closeAllModals();
      });
    });

    document.getElementById('btn-accept-bake-order').addEventListener('click', () => {
      if (!this.inspectedOrderId) return;
      this.closeAllModals();
      this.openWorkshopForOrder(this.inspectedOrderId);
    });

    document.getElementById('btn-delivery-continue').addEventListener('click', () => {
      this.audio.playClick();
      this.closeAllModals();
      this.closeWorkshop();
      this.switchTab('bakery');
    });

    document.getElementById('btn-end-day').addEventListener('click', () => {
      this.audio.playClick();
      this.finishCurrentDay();
    });

    document.getElementById('btn-next-day').addEventListener('click', () => {
      this.audio.playSuccess();
      this.closeAllModals();
      this.startNextDay();
    });
  }

  openModal(modalId) {
    document.getElementById('modal-backdrop').classList.remove('hidden');
    document.querySelectorAll('.modal-card').forEach(m => m.classList.add('hidden'));
    document.getElementById(modalId).classList.remove('hidden');
  }

  closeAllModals() {
    document.getElementById('modal-backdrop').classList.add('hidden');
    document.querySelectorAll('.modal-card').forEach(m => m.classList.add('hidden'));
  }

  updateHUD() {
    const lvlInfo = this.economy.getLevelInfo();
    const maxXp = this.economy.getMaxXpForCurrentLevel();
    document.getElementById('hud-day').textContent = `Ngày ${this.state.day}`;
    document.getElementById('hud-level').textContent = `Cấp ${this.state.level}`;
    document.getElementById('hud-xp-fill').style.width = `${Math.min(100, (this.state.xp / maxXp) * 100)}%`;
    document.getElementById('hud-coins').textContent = this.state.coins;
    document.getElementById('hud-served').textContent = this.state.stats.customersServed;
    document.getElementById('hud-rep').textContent = this.state.reputation;
    document.getElementById('max-cust-label').textContent = this.customers.getMaxConcurrent();
    document.getElementById('btn-sound-quick').textContent = this.state.settings.soundEnabled ? '🔊' : '🔇';

    // Update clock (08:00 -> 20:00)
    const ratio = Math.min(1, this.dayElapsed / this.dayDuration);
    const totalMinutes = Math.round(8 * 60 + ratio * 12 * 60);
    const hh = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
    const mm = String(Math.floor((totalMinutes % 60) / 10) * 10).padStart(2, '0');
    document.getElementById('hud-clock').textContent = `${hh}:${mm}`;

    this.updateBadges();
  }

  updateBadges() {
    const badge = document.getElementById('badge-orders');
    if (badge) {
      badge.textContent = this.orders.activeOrders.length;
      badge.style.display = this.orders.activeOrders.length > 0 ? 'inline-block' : 'none';
    }
  }

  // --------------------------------------------------------------------------
  // BAKERY SCENE & SHOP VISUAL UPGRADES
  // --------------------------------------------------------------------------
  applyShopVisualUpgrades() {
    const scene = document.getElementById('bakery-scene');
    const lights = document.getElementById('scene-fairy-lights');
    const flowers = document.getElementById('scene-flowers');
    const plantCorner = document.getElementById('scene-plant-corner');
    const wallArt = document.getElementById('scene-wall-art');
    const signboard = document.getElementById('scene-signboard');
    const bunting = document.getElementById('scene-bunting');
    const seating = document.getElementById('cozy-seating-bar');
    const display = document.getElementById('scene-display');

    const eq = this.state.equippedDecors || {};
    scene.classList.toggle('has-wallpaper', eq.wallpaper === 'pastel_wallpaper');
    scene.classList.toggle('has-mint-wallpaper', eq.wallpaper === 'mint_wallpaper');
    scene.classList.toggle('has-floor', eq.floor === 'pastel_floor');

    lights.classList.toggle('upgraded', eq.lights === 'fairy_lights');
    lights.classList.toggle('crystal', eq.lights === 'crystal_lights');

    flowers.classList.toggle('hidden', eq.plants !== 'flower_pots');
    plantCorner.classList.toggle('hidden', eq.plants !== 'monstera_plant');
    wallArt.classList.toggle('hidden', eq.wall_art !== 'wall_art');
    signboard.classList.toggle('hidden', eq.signboard !== 'bakery_signboard');
    bunting.classList.toggle('hidden', eq.counter !== 'ribbon_bunting');

    if (eq.seating === 'cozy_seating') {
      seating.classList.add('upgraded');
      seating.innerHTML = '🛋️ Bộ bàn ghế nơ hồng êm ái (+10s kiên nhẫn & +6 xu tip)';
    } else {
      seating.classList.remove('upgraded');
      seating.innerHTML = '🪑 Ghế chờ tiêu chuẩn';
    }

    display.classList.remove('upgraded-2', 'upgraded-3');
    const shelfLvl = this.state.upgrades.display_shelf || 1;
    if (shelfLvl >= 2) display.classList.add(`upgraded-${shelfLvl}`);

    const ovenLvl = this.upgrades.getUpgradeLevelData('oven');
    const mixerLvl = this.upgrades.getUpgradeLevelData('mixer');
    document.getElementById('scene-oven-badge').textContent = `🔥 ${ovenLvl.name}`;
    document.getElementById('scene-mixer-badge').textContent = `🥄 ${mixerLvl.name}`;
  }

  renderDisplayCakes() {
    const row = document.getElementById('display-cakes-row');
    const colKeys = Object.keys(this.state.collection);
    const samples = colKeys.length > 0
      ? colKeys.slice(0, 4).map(k => this.state.collection[k].cakeSnapshot)
      : [
          { cakeType: 'cupcake', batter: 'vanilla', frostingColor: 'pink', nozzle: 'swirl', frostingApplied: true, toppings: [{ type: 'strawberry', x: 100, y: 78 }] },
          { cakeType: 'donut', batter: 'chocolate', frostingColor: 'mint', nozzle: 'smooth', frostingApplied: true, toppings: [{ type: 'sprinkles', x: 85, y: 100 }] },
          { cakeType: 'round_cake', batter: 'strawberry', frostingColor: 'white', nozzle: 'piped', frostingApplied: true, toppings: [{ type: 'cherry', x: 100, y: 90 }] },
          { cakeType: 'cookie', batter: 'vanilla', frostingColor: 'yellow', nozzle: 'drizzle', frostingApplied: true, toppings: [{ type: 'candy', x: 100, y: 118 }] }
        ];
    row.innerHTML = samples.map(s => `<div class="display-cake-slot">${window.SDRenderer.renderCake(s, 72)}</div>`).join('');
  }

  bindBakeryActions() {
    document.getElementById('btn-call-customer').addEventListener('click', () => {
      this.audio.init();
      const res = this.customers.spawnCustomer();
      if (!res) {
        this.showToast('Quầy đang đủ khách rồi, hãy phục vụ các khách hiện tại nhé!', 'error');
      }
    });

    document.querySelectorAll('.clickable-station').forEach(st => {
      st.addEventListener('click', () => {
        this.audio.playClick();
        const target = st.dataset.station;
        if (target === 'inventory') {
          this.switchTab('inventory');
          return;
        }
        if (this.activeOrderId && this.orders.getOrder(this.activeOrderId)) {
          this.openWorkshopForOrder(this.activeOrderId);
        } else if (this.orders.activeOrders.length > 0) {
          this.openWorkshopForOrder(this.orders.activeOrders[0].orderId);
        } else {
          this.showToast('Hãy đón khách hàng và nhận đơn trước khi vào bếp nhé!', 'info');
        }
      });
    });
  }

  renderBakeryCustomers() {
    const grid = document.getElementById('customer-slots-grid');
    if (!grid) return;

    const banner = document.getElementById('ready-delivery-banner');
    if (this.readyPackage) {
      const targetOrder = this.orders.getOrder(this.readyPackage.orderId);
      const targetCust = targetOrder ? window.SDData.CUSTOMERS.find(c => c.id === targetOrder.customerId) : null;
      banner.classList.remove('hidden');
      banner.innerHTML = `
        <span>🎁 Bạn đang có bánh đóng hộp cho <b>${targetCust ? targetCust.name : 'Khách'}</b> (${targetOrder ? targetOrder.orderNumber : ''})!</span>
        <button class="btn btn-primary btn-sm" id="btn-deliver-ready-banner">✅ Giao Đúng Khách Ngay</button>
      `;
      document.getElementById('btn-deliver-ready-banner').onclick = () => this.deliverToCustomer(this.readyPackage.orderId);
    } else {
      banner.classList.add('hidden');
    }

    if (this.customers.slots.length === 0) {
      grid.innerHTML = `
        <div class="empty-slot-placeholder">
          <div style="font-size:2rem;">🔔</div>
          <p>Đang chờ khách bước vào tiệm... Nhấn <b>Đón Khách Ngay</b> hoặc đợi trong giây lát!</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = this.customers.slots.map(slot => {
      const { customer, order, patience, maxPatience, mood, status, speech, waving } = slot;
      const pct = Math.max(0, Math.min(100, Math.round((patience / maxPatience) * 100)));
      const barClass = pct > 60 ? 'patience-green' : pct > 30 ? 'patience-yellow' : 'patience-red';
      const cakeInfo = this.recipes.getCakeType(order.cakeType);
      const frostInfo = window.SDData.FROSTING_COLORS.find(f => f.id === order.frostingColor);
      const topInfo = window.SDData.TOPPINGS.find(t => t.id === order.topping);

      return `
        <div class="customer-card ${status} ${order.isSpecial ? 'special-order' : ''}" data-order-id="${order.orderId}">
          <div class="speech-bubble">${speech}</div>
          <div class="customer-main-row">
            <div class="customer-avatar-col">
              ${window.SDRenderer.renderCharacter(customer, mood, { width: 88, height: 108, wave: waving })}
              <div class="customer-name-tag">${customer.name}</div>
            </div>
            <div class="order-mini-preview">
              <div class="order-code-tag">
                ${order.isSpecial ? order.specialBadge : `ĐƠN ${order.orderNumber}`}
              </div>
              ${window.SDRenderer.renderCake(order.targetPreview, 96)}
              <div class="order-mini-specs">
                <b>${cakeInfo.name}</b> ×${order.quantity}<br/>
                ${frostInfo ? frostInfo.name : ''} • ${order.toppingCount} ${topInfo ? topInfo.name : ''}
              </div>
            </div>
          </div>
          <div class="patience-wrap">
            <span>⏱️ ${Math.ceil(patience)}s</span>
            <div class="patience-bar"><div class="patience-fill ${barClass}" style="width:${pct}%"></div></div>
          </div>
          <div class="customer-actions">
            <button class="btn btn-soft btn-xs btn-inspect-order" data-order-id="${order.orderId}">🔍 Xem Đơn</button>
            ${this.readyPackage
              ? `<button class="btn ${this.readyPackage.orderId === order.orderId ? 'btn-mint' : 'btn-danger'} btn-xs btn-try-deliver" data-order-id="${order.orderId}">🎁 Giao Bánh</button>`
              : `<button class="btn btn-primary btn-xs btn-bake-order" data-order-id="${order.orderId}">👩‍🍳 Làm Bánh</button>`
            }
          </div>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.btn-inspect-order').forEach(btn => {
      btn.addEventListener('click', () => this.openOrderDetailModal(btn.dataset.orderId));
    });
    grid.querySelectorAll('.btn-bake-order').forEach(btn => {
      btn.addEventListener('click', () => this.openWorkshopForOrder(btn.dataset.orderId));
    });
    grid.querySelectorAll('.btn-try-deliver').forEach(btn => {
      btn.addEventListener('click', () => this.deliverToCustomer(btn.dataset.orderId));
    });
  }

  openOrderDetailModal(orderId) {
    const order = this.orders.getOrder(orderId);
    if (!order) return;
    this.audio.playClick();
    this.inspectedOrderId = orderId;
    const customer = window.SDData.CUSTOMERS.find(c => c.id === order.customerId);
    const body = document.getElementById('md-order-body');
    document.getElementById('md-order-title').textContent = `Đơn Hàng ${order.orderNumber} – ${customer ? customer.name : ''}`;
    body.innerHTML = this.buildOrderSpecHTML(order);
    this.openModal('modal-order-detail');
  }

  buildOrderSpecHTML(order) {
    const cake = this.recipes.getCakeType(order.cakeType);
    const batter = this.recipes.getBatter(order.batter);
    const frost = window.SDData.FROSTING_COLORS.find(f => f.id === order.frostingColor);
    const nozzle = window.SDData.NOZZLES.find(n => n.id === order.nozzle);
    const top = window.SDData.TOPPINGS.find(t => t.id === order.topping);
    const acc = window.SDData.ACCESSORIES.find(a => a.id === order.accessory);
    const extraAcc = order.extraAccessory ? window.SDData.ACCESSORIES.find(a => a.id === order.extraAccessory) : null;
    const box = window.SDData.BOX_COLORS.find(b => b.id === order.boxColor);
    const ribbon = window.SDData.RIBBON_COLORS.find(r => r.id === order.ribbonColor);

    return `
      <div class="ref-preview-box">${window.SDRenderer.renderCake(order.targetPreview, 155)}</div>
      <ul class="ref-checklist">
        <li><b>Loại bánh:</b> ${cake.name} (SL: ${order.quantity})</li>
        <li><b>Cốt bánh:</b> ${batter.name}</li>
        <li><b>Kem phủ:</b> ${frost ? frost.name : ''} (${nozzle ? nozzle.name : ''})</li>
        <li><b>Topping:</b> ${order.toppingCount} × ${top ? top.name : 'Không'}</li>
        <li><b>Phụ kiện:</b> ${acc ? `${order.accCount} × ${acc.name}` : 'Không'}${extraAcc ? ` + ${extraAcc.name}` : ''}</li>
        <li><b>Đóng gói:</b> ${box ? box.name : ''} + ${ribbon ? ribbon.name : ''}</li>
      </ul>
    `;
  }

  // --------------------------------------------------------------------------
  // WORKSHOP: PREP, MIX, BAKE, DECORATE, PACKAGE
  // --------------------------------------------------------------------------
  openWorkshopForOrder(orderId) {
    const order = this.orders.getOrder(orderId);
    if (!order) {
      this.showToast('Đơn hàng không còn tồn tại!', 'error');
      return;
    }

    // Resume if already working on this exact order
    if (this.activeOrderId !== orderId || !this.baking.session) {
      const missingIds = this.baking.getMissingIngredientsForOrder(order);
      if (missingIds.length > 0) {
        const missingNames = missingIds
          .map(id => window.SDData.INGREDIENTS.find(i => i.id === id)?.name || id)
          .join(', ');
        this.audio.playError();
        this.showToast(`❌ Thiếu nguyên liệu (${missingNames}) cho đơn ${order.orderNumber}! Hãy mua thêm trong Kho hàng.`, 'error');
        this.closeAllModals();
        this.switchTab('inventory');
        return;
      }
      this.activeOrderId = orderId;
      this.readyPackage = null;
      this.baking.startSession(order);
      this.workshopStep = 'prep';
      if (this.mixingCanvas) this.mixingCanvas.reset();
    }

    this.audio.playClick();
    document.getElementById('view-workshop').classList.remove('hidden');
    document.getElementById('ws-order-badge').textContent = `Đơn ${order.orderNumber}`;
    document.getElementById('workshop-order-ref').innerHTML = `
      <h4 style="margin:0;color:#d6456b;">📋 Yêu Cầu Của Khách</h4>
      ${this.buildOrderSpecHTML(order)}
    `;

    this.setWorkshopStep(this.workshopStep);
    if (this.workshopStep === 'prep') this.renderPrepStage();
    else if (this.workshopStep === 'bake') this.renderOvenStage();
    else if (this.workshopStep === 'decorate') this.renderDecorateStage();
    else if (this.workshopStep === 'package') this.renderPackageStage();
    this.renderOrdersTab();
  }

  closeWorkshop() {
    document.getElementById('view-workshop').classList.add('hidden');
    this.renderBakeryCustomers();
  }

  setWorkshopStep(step) {
    this.workshopStep = step;
    const orderSteps = ['prep', 'bake', 'decorate', 'package'];
    const curIdx = orderSteps.indexOf(step);

    document.querySelectorAll('.step-item').forEach((el, idx) => {
      el.classList.toggle('active', el.dataset.step === step);
      el.classList.toggle('done', idx < curIdx);
    });

    document.querySelectorAll('.ws-stage').forEach(st => {
      st.classList.toggle('active', st.id === `stage-${step}`);
    });
  }

  bindWorkshopActions() {
    document.getElementById('btn-workshop-back').addEventListener('click', () => {
      this.audio.playClick();
      this.closeWorkshop();
    });

    // Whisk button (click or hold with smooth Canvas physics + inertia!)
    const whiskBtn = document.getElementById('btn-whisk');
    const doWhisk = () => {
      const res = this.baking.whiskStep(8);
      if (!res.ok) {
        this.showToast(res.reason, 'error');
        return false;
      }
      if (this.mixingCanvas) this.mixingCanvas.pulseMix();
      this.updateMixUI();
      return true;
    };
    whiskBtn.addEventListener('pointerdown', () => {
      if (!doWhisk()) return;
      if (this.mixingCanvas) this.mixingCanvas.setMixing(true);
      clearInterval(this._whiskInterval);
      this._whiskInterval = setInterval(() => {
        if (!doWhisk()) {
          clearInterval(this._whiskInterval);
          if (this.mixingCanvas) this.mixingCanvas.setMixing(false);
        }
      }, 150);
    });
    const stopWhisk = () => {
      clearInterval(this._whiskInterval);
      if (this.mixingCanvas) this.mixingCanvas.setMixing(false);
    };
    window.addEventListener('pointerup', stopWhisk);
    window.addEventListener('pointercancel', stopWhisk);

    document.getElementById('btn-to-oven').addEventListener('click', () => {
      if (!this.baking.canProceedToOven()) {
        this.showToast('Hãy cho đủ nguyên liệu và trộn bột ít nhất 50%!', 'error');
        return;
      }
      this.audio.playClick();
      this.setWorkshopStep('bake');
      this.renderOvenStage();
    });

    // Oven Actions
    document.getElementById('btn-pour-batter').addEventListener('click', () => {
      const res = this.baking.pourBatter();
      if (!res.ok) return this.showToast(res.reason, 'error');
      this.showToast('Đã đổ bột vào khuôn!', 'success');
      this.renderOvenStage();
    });

    document.querySelectorAll('#oven-temp-list .chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#oven-temp-list .chip-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.baking.setTemperature(btn.dataset.temp);
        document.getElementById('oven-cur-temp').textContent = `${btn.dataset.temp}°C`;
      });
    });

    document.getElementById('btn-start-oven').addEventListener('click', () => {
      const res = this.baking.startBaking();
      if (!res.ok) return this.showToast(res.reason, 'error');
      this.renderOvenStage();
    });

    document.getElementById('btn-take-out').addEventListener('click', () => {
      const res = this.baking.takeOutOfOven();
      if (!res.ok) return;
      if (res.bakeState === 'perfect') {
        this.showToast('🎉 Bánh chín vàng hoàn hảo!', 'success');
      } else if (res.bakeState === 'burnt') {
        this.showToast('🔥 Ôi không, bánh bị cháy mất rồi! Bạn có thể nướng lại hoặc tiếp tục.', 'error');
      } else {
        this.showToast('Bánh lấy ra hơi sớm nên còn chưa chín kỹ.', 'error');
      }
      this.renderOvenStage();
    });

    document.getElementById('btn-retry-bake').addEventListener('click', () => {
      this.baking.retryBake();
      this.renderOvenStage();
    });

    document.getElementById('btn-to-decorate').addEventListener('click', () => {
      this.audio.playClick();
      this.decoration.initFromBaking(this.baking.session);
      this.setWorkshopStep('decorate');
      this.renderDecorateStage();
    });

    // Decorate Actions
    document.querySelectorAll('.deco-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.audio.playClick();
        document.querySelectorAll('.deco-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const mode = tab.dataset.mode;
        this.decoration.activeTool.mode = mode;
        document.querySelectorAll('.deco-pane').forEach(p => p.classList.toggle('active', p.id === `deco-pane-${mode}`));
      });
    });

    document.getElementById('btn-apply-frosting').addEventListener('click', () => {
      this.decoration.applyFrosting();
      this.renderDecorateCakeCanvas();
    });

    document.getElementById('btn-deco-undo').addEventListener('click', () => {
      if (this.decoration.undo()) {
        this.renderDecorateCakeCanvas();
      }
    });

    document.getElementById('btn-deco-clear').addEventListener('click', () => {
      this.decoration.clearDecorations();
      this.renderDecorateCakeCanvas();
    });

    document.getElementById('deco-sign-input').addEventListener('input', (e) => {
      this.decoration.activeTool.signText = e.target.value;
    });

    document.getElementById('btn-to-package').addEventListener('click', () => {
      this.audio.playClick();
      this.setWorkshopStep('package');
      this.renderPackageStage();
    });

    // Packaging Actions
    document.getElementById('btn-close-box').addEventListener('click', () => {
      this.decoration.closeBox();
      this.readyPackage = {
        orderId: this.activeOrderId,
        cakeState: JSON.parse(JSON.stringify(this.decoration.cakeState)),
        packaging: JSON.parse(JSON.stringify(this.decoration.packaging))
      };
      this.renderPackageStage();
    });

    document.getElementById('btn-deliver-cake').addEventListener('click', () => {
      this.deliverToCustomer(this.activeOrderId);
    });
  }

  // --------------------------------------------------------------------------
  // STAGE 1 RENDERING: PREP & MIXING
  // --------------------------------------------------------------------------
  renderPrepStage() {
    const s = this.baking.session;
    if (!s) return;

    // Cake Type chips
    const cakeRow = document.getElementById('prep-cake-types');
    cakeRow.innerHTML = this.recipes.getUnlockedCakeTypes().map(c =>
      `<button class="chip-btn ${s.selectedCakeType === c.id ? 'active' : ''}" data-cake="${c.id}">${c.name}</button>`
    ).join('');
    cakeRow.querySelectorAll('.chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.baking.selectCakeType(btn.dataset.cake);
        this.renderPrepStage();
      });
    });

    // Batter chips (require stock of flavor ingredient!)
    const batRow = document.getElementById('prep-batters');
    batRow.innerHTML = this.recipes.getUnlockedBatters().map(b => {
      const fId = b.flavorIngredient;
      const fStock = fId ? this.economy.getStock(fId) : 1;
      const alreadyIn = fId && s.addedIngredients.includes(fId);
      const outOfStock = fId && fStock <= 0 && !alreadyIn;
      const stockTag = fId ? ` (${outOfStock ? 'Hết' : `×${fStock}`})` : '';
      return `<button class="chip-btn ${s.selectedBatter === b.id ? 'active' : ''}" data-batter="${b.id}" ${outOfStock ? 'disabled title="Hết nguyên liệu trong kho"' : ''}>${b.name}${stockTag}</button>`;
    }).join('');
    batRow.querySelectorAll('.chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = this.baking.selectBatter(btn.dataset.batter);
        if (res && !res.ok) {
          this.showToast(res.reason, 'error');
          return;
        }
        this.renderPrepStage();
      });
    });

    // Ingredients Tray (respects Ingredient Pantry early unlock)
    const required = this.baking.getRequiredList();
    const tray = document.getElementById('prep-ingredients-tray');
    tray.innerHTML = window.SDData.INGREDIENTS.filter(i => this.economy.isIngredientUnlocked(i)).map(ing => {
      const stock = this.economy.getStock(ing.id);
      const isAdded = s.addedIngredients.includes(ing.id);
      const isNeeded = required.includes(ing.id) && !isAdded;
      return `
        <div class="ing-tile ${isAdded ? 'added' : ''} ${isNeeded ? 'needed' : ''}" data-ing="${ing.id}">
          <span class="ing-stock">×${stock}</span>
          ${window.SDRenderer.renderIngredient(ing.id, 44)}
          <span>${ing.name}</span>
        </div>
      `;
    }).join('');
    if (window.SDCanvasIcons) window.SDCanvasIcons.paintAll(tray);

    this.updateMixUI();
  }

  updateMixUI() {
    const s = this.baking.session;
    if (!s) return;
    const req = this.baking.getRequiredList();
    const batterCfg = s.selectedBatter ? this.recipes.getBatter(s.selectedBatter) : null;

    if (this.mixingCanvas) {
      this.mixingCanvas.syncState({
        addedIngredients: s.addedIngredients,
        mixProgress: s.mixProgress,
        batterColor: batterCfg ? batterCfg.color : '#FFE9A8',
        mixerLevel: this.state.upgrades.mixer || 1
      });
      this.mixingCanvas.render();
    }

    const hint = document.getElementById('bowl-hint');
    if (!s.selectedCakeType || !s.selectedBatter) {
      hint.textContent = 'Bước 1: Chọn Loại bánh & Cốt bánh ở trên!';
    } else if (!this.baking.areAllIngredientsAdded()) {
      const missing = req.filter(id => !s.addedIngredients.includes(id))
        .map(id => window.SDData.INGREDIENTS.find(i => i.id === id)?.name).join(', ');
      hint.textContent = `Cần thêm: ${missing}`;
    } else if (s.mixProgress >= 60 && s.mixProgress <= 98) {
      hint.textContent = '✨ Hỗn hợp bột đã mịn hoàn hảo! Có thể Đem Đi Nướng!';
    } else {
      hint.textContent = 'Đủ nguyên liệu rồi! Nhấn giữ nút TRỘN BỘT nhé!';
    }

    const p = s.mixProgress;
    document.getElementById('mix-meter-fill').style.width = `${Math.min(100, (p / 120) * 100)}%`;
    const statusTxt = !this.baking.areAllIngredientsAdded()
      ? 'Chưa đủ nguyên liệu'
      : p < 60
        ? `Đang trộn (${Math.round(p)}%)`
        : p <= 98
          ? '✨ Mịn hoàn hảo!'
          : '⚠️ Hơi quá tay!';
    document.getElementById('mix-status-text').textContent = statusTxt;
    document.getElementById('btn-to-oven').disabled = !this.baking.canProceedToOven();
  }

  // --------------------------------------------------------------------------
  // STAGE 2 RENDERING: OVEN
  // --------------------------------------------------------------------------
  renderOvenStage() {
    const s = this.baking.session;
    if (!s) return;

    const moldList = document.getElementById('oven-mold-list');
    moldList.innerHTML = this.recipes.getUnlockedCakeTypes().map(c =>
      `<button class="chip-btn ${s.selectedMold === c.id ? 'active' : ''}" data-mold="${c.id}">${c.moldName}</button>`
    ).join('');
    moldList.querySelectorAll('.chip-btn').forEach(b => {
      b.addEventListener('click', () => {
        if (s.ovenRunning) return;
        this.baking.selectMold(b.dataset.mold);
        this.renderOvenStage();
      });
    });

    const targetCake = this.recipes.getCakeType(s.selectedCakeType);
    document.getElementById('oven-temp-hint').textContent = `Gợi ý nhiệt độ cho ${targetCake.name}: ${targetCake.idealTemp}°C`;
    document.getElementById('oven-cur-temp').textContent = `${s.selectedTemp}°C`;

    const glass = document.getElementById('oven-glass-door');
    glass.classList.toggle('heating', s.ovenRunning);

    const preview = document.getElementById('oven-cake-preview');
    if (s.batterPoured) {
      preview.innerHTML = window.SDRenderer.renderCake({
        cakeType: s.selectedMold || s.selectedCakeType,
        batter: s.selectedBatter,
        bakeState: s.bakeState,
        frostingApplied: false
      }, 150);
    } else {
      preview.innerHTML = `<span style="color:#fff;font-size:0.85rem;">Chưa đổ bột vào khuôn</span>`;
    }

    const startBtn = document.getElementById('btn-start-oven');
    const takeBtn = document.getElementById('btn-take-out');
    const retryBtn = document.getElementById('btn-retry-bake');
    const nextBtn = document.getElementById('btn-to-decorate');

    const tookOut = s.inOven && !s.ovenRunning;
    startBtn.classList.toggle('hidden', s.inOven);
    takeBtn.classList.toggle('hidden', !s.ovenRunning);
    retryBtn.classList.toggle('hidden', !tookOut);
    nextBtn.classList.toggle('hidden', !tookOut);

    this.updateOvenDynamicUI();
  }

  updateOvenDynamicUI() {
    const s = this.baking.session;
    if (!s) return;
    const ovenLvl = this.upgrades.getUpgradeLevelData('oven');
    const maxTrack = s.bakeTargetTime + ovenLvl.perfectWindow + 2.2;
    const pct = Math.min(98, (s.bakeElapsed / maxTrack) * 100);
    document.getElementById('oven-pointer').style.left = `${pct}%`;
    document.getElementById('oven-timer-text').textContent = `${s.bakeElapsed.toFixed(1)}s`;

    const labels = {
      raw: 'Bột sống',
      baking: 'Đang nở...',
      perfect: '✨ Chín Hoàn Hảo!',
      burnt: '🔥 Bị Cháy!'
    };
    const pill = document.getElementById('oven-state-pill');
    pill.textContent = s.inOven ? labels[s.bakeState] : (s.batterPoured ? 'Sẵn sàng nướng' : 'Chờ đổ bột');

    if (s.ovenRunning) {
      document.getElementById('oven-cake-preview').innerHTML = window.SDRenderer.renderCake({
        cakeType: s.selectedMold || s.selectedCakeType,
        batter: s.selectedBatter,
        bakeState: s.bakeState,
        frostingApplied: false
      }, 150);
    }
  }

  // --------------------------------------------------------------------------
  // STAGE 3 RENDERING: DECORATING
  // --------------------------------------------------------------------------
  renderDecorateStage() {
    const tool = this.decoration.activeTool;

    // Frosting Swatches
    const frostWrap = document.getElementById('deco-frosting-colors');
    frostWrap.innerHTML = this.recipes.getUnlockedFrostings().map(f =>
      `<button class="swatch-btn ${tool.frostingColor === f.id ? 'active' : ''}" style="background:${f.hex}" title="${f.name}" data-fcolor="${f.id}"></button>`
    ).join('');
    frostWrap.querySelectorAll('.swatch-btn').forEach(b => {
      b.addEventListener('click', () => {
        tool.frostingColor = b.dataset.fcolor;
        this.audio.playClick();
        this.renderDecorateStage();
      });
    });

    // Nozzles
    const nozWrap = document.getElementById('deco-nozzles');
    nozWrap.innerHTML = window.SDData.NOZZLES.map(n =>
      `<button class="chip-btn ${tool.nozzle === n.id ? 'active' : ''}" data-nozzle="${n.id}">${n.name}</button>`
    ).join('');
    nozWrap.querySelectorAll('.chip-btn').forEach(b => {
      b.addEventListener('click', () => {
        tool.nozzle = b.dataset.nozzle;
        this.audio.playClick();
        this.renderDecorateStage();
      });
    });

    // Toppings Grid (supports tap-select OR drag-to-cake!)
    const topGrid = document.getElementById('deco-toppings-grid');
    topGrid.innerHTML = this.recipes.getUnlockedToppings().map(t =>
      `<button class="deco-item-btn ${tool.toppingId === t.id ? 'active' : ''}" data-top="${t.id}">${t.name}</button>`
    ).join('');

    // Accessories Grid
    const accGrid = document.getElementById('deco-accessories-grid');
    accGrid.innerHTML = this.recipes.getUnlockedAccessories().map(a =>
      `<button class="deco-item-btn ${tool.accessoryId === a.id ? 'active' : ''}" data-acc="${a.id}">${a.name}</button>`
    ).join('');

    this.renderDecorateCakeCanvas();
  }

  renderDecorateCakeCanvas() {
    const canvas = document.getElementById('decorate-cake-canvas');
    canvas.innerHTML = window.SDRenderer.renderCake(this.decoration.cakeState, 240);
    const curCount = (this.decoration.cakeState?.toppings || []).length;
    const order = this.orders.getOrder(this.activeOrderId);
    const targetCount = order ? order.toppingCount : 0;
    document.getElementById('deco-topping-counter').textContent = `Đã đặt ${curCount} topping (Đơn hàng cần: ${targetCount})`;
  }

  // --------------------------------------------------------------------------
  // STAGE 4 RENDERING: PACKAGING
  // --------------------------------------------------------------------------
  renderPackageStage() {
    const pkg = this.decoration.packaging;
    if (!pkg) return;

    document.getElementById('package-box-canvas').innerHTML =
      window.SDRenderer.renderBox(pkg, this.decoration.cakeState, 240);

    // Box colors
    const boxWrap = document.getElementById('pkg-box-colors');
    boxWrap.innerHTML = window.SDData.BOX_COLORS.map(b =>
      `<button class="swatch-btn ${pkg.boxColor === b.id ? 'active' : ''}" style="background:${b.hex}" title="${b.name}" data-box="${b.id}"></button>`
    ).join('');
    boxWrap.querySelectorAll('.swatch-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.decoration.setBoxColor(btn.dataset.box);
        this.renderPackageStage();
      });
    });

    // Ribbon colors
    const ribWrap = document.getElementById('pkg-ribbon-colors');
    ribWrap.innerHTML = window.SDData.RIBBON_COLORS.map(r =>
      `<button class="swatch-btn ${pkg.ribbonColor === r.id ? 'active' : ''}" style="background:${r.hex}" title="${r.name}" data-rib="${r.id}"></button>`
    ).join('');
    ribWrap.querySelectorAll('.swatch-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.decoration.setRibbonColor(btn.dataset.rib);
        this.renderPackageStage();
      });
    });

    // Cards
    const cardWrap = document.getElementById('pkg-cards');
    cardWrap.innerHTML = window.SDData.BOX_CARDS.map(c =>
      `<button class="chip-btn ${pkg.card === c.id ? 'active' : ''}" data-card="${c.id}">${c.name}</button>`
    ).join('');
    cardWrap.querySelectorAll('.chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.decoration.setCard(btn.dataset.card);
        this.renderPackageStage();
      });
    });

    // Stickers
    const stickWrap = document.getElementById('pkg-stickers');
    stickWrap.innerHTML = window.SDData.BOX_STICKERS.map(st =>
      `<button class="chip-btn ${pkg.sticker === st.id ? 'active' : ''}" data-stick="${st.id}">${st.name}</button>`
    ).join('');
    stickWrap.querySelectorAll('.chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.decoration.setSticker(btn.dataset.stick);
        this.renderPackageStage();
      });
    });

    document.getElementById('btn-deliver-cake').disabled = !pkg.closed;
    document.getElementById('btn-close-box').textContent = pkg.closed ? '🎀 Đã Đóng Hộp Đẹp Mắt!' : '🎀 Đóng Nắp Hộp & Thắt Nơ';
  }

  // --------------------------------------------------------------------------
  // POINTER-BASED DRAG & DROP (Ingredients + Cake Decorations + Repositioning)
  // --------------------------------------------------------------------------
  bindPointerDragAndDrop() {
    document.addEventListener('pointerdown', (e) => {
      // 1. Ingredient Tile Drag/Tap
      const ingTile = e.target.closest('.ing-tile');
      if (ingTile && this.workshopStep === 'prep') {
        const ingId = ingTile.dataset.ing;
        this._dragState = {
          kind: 'ingredient',
          id: ingId,
          startX: e.clientX,
          startY: e.clientY,
          moved: false,
          ghost: null
        };
        return;
      }

      // 2. Existing topping or accessory repositioning on Cake Canvas
      const placedTop = e.target.closest('#decorate-cake-canvas .placed-item');
      if (placedTop && this.workshopStep === 'decorate') {
        this._dragState = {
          kind: 'reposition_topping',
          idx: Number(placedTop.dataset.idx),
          startX: e.clientX,
          startY: e.clientY,
          moved: false
        };
        return;
      }
      const placedAcc = e.target.closest('#decorate-cake-canvas .placed-acc');
      if (placedAcc && this.workshopStep === 'decorate') {
        this._dragState = {
          kind: 'reposition_acc',
          idx: Number(placedAcc.dataset.accIdx),
          startX: e.clientX,
          startY: e.clientY,
          moved: false
        };
        return;
      }

      // 3. Dragging new topping/accessory from tool palette
      const topBtn = e.target.closest('#deco-toppings-grid .deco-item-btn');
      if (topBtn && this.workshopStep === 'decorate') {
        this._dragState = {
          kind: 'new_topping',
          id: topBtn.dataset.top,
          startX: e.clientX,
          startY: e.clientY,
          moved: false,
          ghost: null
        };
        return;
      }

      const accBtn = e.target.closest('#deco-accessories-grid .deco-item-btn');
      if (accBtn && this.workshopStep === 'decorate') {
        this._dragState = {
          kind: 'new_acc',
          id: accBtn.dataset.acc,
          startX: e.clientX,
          startY: e.clientY,
          moved: false,
          ghost: null
        };
        return;
      }

      // 4. Direct click on Cake Canvas in Decorate Stage
      const canvas = e.target.closest('#decorate-cake-canvas');
      if (canvas && this.workshopStep === 'decorate') {
        const rect = canvas.getBoundingClientRect();
        const svgX = ((e.clientX - rect.left) / rect.width) * 200;
        const svgY = ((e.clientY - rect.top) / rect.height) * 200;
        const tool = this.decoration.activeTool;

        if (tool.mode === 'frosting') {
          this.decoration.applyFrosting();
        } else if (tool.mode === 'topping') {
          this.decoration.addToppingAt(tool.toppingId, svgX, svgY);
        } else if (tool.mode === 'accessory') {
          this.decoration.addAccessoryAt(tool.accessoryId, svgX, svgY, tool.signText);
        }
        this.renderDecorateCakeCanvas();
      }
    });

    document.addEventListener('pointermove', (e) => {
      if (!this._dragState) return;
      const dx = e.clientX - this._dragState.startX;
      const dy = e.clientY - this._dragState.startY;
      if (Math.hypot(dx, dy) > 7) this._dragState.moved = true;

      if (!this._dragState.moved) return;

      if (this._dragState.kind === 'reposition_topping' || this._dragState.kind === 'reposition_acc') {
        const canvas = document.getElementById('decorate-cake-canvas');
        const rect = canvas.getBoundingClientRect();
        const svgX = ((e.clientX - rect.left) / rect.width) * 200;
        const svgY = ((e.clientY - rect.top) / rect.height) * 200;
        if (this._dragState.kind === 'reposition_topping') {
          this.decoration.moveTopping(this._dragState.idx, svgX, svgY);
        } else {
          this.decoration.moveAccessory(this._dragState.idx, svgX, svgY);
        }
        this.renderDecorateCakeCanvas();
        return;
      }

      // Create floating ghost for ingredient / new topping / new accessory
      if (!this._dragState.ghost) {
        const ghost = document.createElement('div');
        ghost.className = 'drag-ghost';
        if (this._dragState.kind === 'ingredient') {
          ghost.innerHTML = window.SDRenderer.renderIngredient(this._dragState.id, 52);
          if (window.SDCanvasIcons) window.SDCanvasIcons.paintAll(ghost);
        } else {
          ghost.innerHTML = `<div class="chip-btn active">${this._dragState.id}</div>`;
        }
        document.body.appendChild(ghost);
        this._dragState.ghost = ghost;
      }

      this._dragState.ghost.style.left = `${e.clientX}px`;
      this._dragState.ghost.style.top = `${e.clientY}px`;

      if (this._dragState.kind === 'ingredient') {
        const bowl = document.getElementById('mixing-bowl-zone');
        const rect = bowl.getBoundingClientRect();
        const over = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
        bowl.classList.toggle('drag-over', over);
      }
    });

    document.addEventListener('pointerup', (e) => {
      if (!this._dragState) return;
      const ds = this._dragState;
      this._dragState = null;

      if (ds.ghost) ds.ghost.remove();
      document.getElementById('mixing-bowl-zone')?.classList.remove('drag-over');

      if (ds.kind === 'ingredient') {
        const bowl = document.getElementById('mixing-bowl-zone');
        const rect = bowl.getBoundingClientRect();
        const overBowl = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
        // Drop onto bowl OR quick tap!
        if (!ds.moved || overBowl) {
          const res = this.baking.addIngredient(ds.id);
          if (!res.ok) {
            this.showToast(res.reason, 'error');
            bowl.classList.add('shake');
            setTimeout(() => bowl.classList.remove('shake'), 380);
          } else {
            this._playIngredientAnimAndSound(ds.id);
            this.renderPrepStage();
            if (this.activeTab === 'inventory') this.renderInventoryTab();
          }
        }
      } else if (ds.kind === 'new_topping') {
        if (!ds.moved) {
          this.decoration.activeTool.toppingId = ds.id;
          this.audio.playClick();
          this.renderDecorateStage();
        } else {
          const canvas = document.getElementById('decorate-cake-canvas');
          const rect = canvas.getBoundingClientRect();
          if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
            const svgX = ((e.clientX - rect.left) / rect.width) * 200;
            const svgY = ((e.clientY - rect.top) / rect.height) * 200;
            this.decoration.addToppingAt(ds.id, svgX, svgY);
            this.renderDecorateCakeCanvas();
          }
        }
      } else if (ds.kind === 'new_acc') {
        if (!ds.moved) {
          this.decoration.activeTool.accessoryId = ds.id;
          this.audio.playClick();
          this.renderDecorateStage();
        } else {
          const canvas = document.getElementById('decorate-cake-canvas');
          const rect = canvas.getBoundingClientRect();
          if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
            const svgX = ((e.clientX - rect.left) / rect.width) * 200;
            const svgY = ((e.clientY - rect.top) / rect.height) * 200;
            this.decoration.addAccessoryAt(ds.id, svgX, svgY, this.decoration.activeTool.signText);
            this.renderDecorateCakeCanvas();
          }
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // DELIVERY, SCORING & EFFECTS
  // --------------------------------------------------------------------------
  deliverToCustomer(targetOrderId) {
    if (!this.readyPackage && this.decoration.cakeState && this.decoration.packaging?.closed) {
      this.readyPackage = {
        orderId: this.activeOrderId,
        cakeState: JSON.parse(JSON.stringify(this.decoration.cakeState)),
        packaging: JSON.parse(JSON.stringify(this.decoration.packaging))
      };
    }

    if (!this.readyPackage) {
      this.showToast('Hãy đóng gói hoàn chỉnh trước khi giao bánh!', 'error');
      return;
    }

    // Strict check: prevent delivering to the wrong customer!
    if (targetOrderId !== this.readyPackage.orderId) {
      this.audio.playError();
      this.showToast('❌ Không được giao nhầm bánh cho khách khác! Hãy giao đúng chủ đơn hàng.', 'error');
      return;
    }

    const order = this.orders.getOrder(targetOrderId);
    const slot = this.customers.getSlotByOrderId(targetOrderId);
    if (!order || !slot) {
      this.showToast('Khách hàng đã rời đi mất rồi!', 'error');
      this.readyPackage = null;
      this.activeOrderId = null;
      this.closeWorkshop();
      return;
    }

    const result = this.scoring.evaluate(order, this.readyPackage.cakeState, this.readyPackage.packaging, slot);

    // Apply Rewards & Stats
    this.economy.addCoins(result.totalCoins, true);
    const xpRes = this.economy.addXp(result.xpEarned);
    this.economy.addReputation(result.repDelta);

    this.state.stats.totalOrders += 1;
    this.state.stats.dayOrders += 1;
    this.state.stats.customersServed += 1;
    if (result.stars === 3) this.state.stats.perfectCount += 1;
    if (order.isSpecial) this.state.stats.specialCompleted += 1;

    this.recipes.recordToCollection(order, this.readyPackage.cakeState, result.score);
    if (!this.state.orderHistory) this.state.orderHistory = [];
    this.state.orderHistory.unshift({
      orderId: order.orderId,
      orderNumber: order.orderNumber,
      customerName: slot.customer.name,
      customerId: slot.customer.id,
      cakeType: order.cakeType,
      batter: order.batter,
      frostingColor: order.frostingColor,
      topping: order.topping,
      toppingCount: order.toppingCount,
      accessory: order.accessory,
      quantity: order.quantity,
      isSpecial: order.isSpecial,
      score: result.score,
      stars: result.stars,
      grade: result.grade,
      totalCoins: result.totalCoins,
      cakeSnapshot: JSON.parse(JSON.stringify(this.readyPackage.cakeState)),
      day: this.state.day
    });
    if (this.state.orderHistory.length > 40) this.state.orderHistory.length = 40;

    this.upgrades.recordQuestProgress({
      cakeType: this.readyPackage.cakeState.cakeType,
      coinsEarned: result.totalCoins,
      isPerfect: result.stars === 3
    });
    const newAchs = this.upgrades.checkAchievements();

    this.customers.completeCustomerDelivery(order.orderId, result);
    this.saveManager.save(this.state);

    // Audio + Visual FX
    if (result.stars >= 2) {
      this.audio.playSuccess();
      this.spawnHeartsFX();
      if (result.stars === 3) this.spawnConfettiFX();
    } else {
      this.audio.playCoins();
    }
    this.spawnFlyingCoinsFX();

    // Show Delivery Evaluation Modal
    const custMood = result.score >= 70 ? 'delighted' : result.score >= 50 ? 'normal' : 'disappointed';
    const starText = result.stars > 0 ? '⭐'.repeat(result.stars) : '💔';
    const body = document.getElementById('md-delivery-body');
    body.innerHTML = `
      <div class="grade-banner">${result.grade} ${starText} (${result.score}/100)</div>
      <div class="delivery-hero">
        ${window.SDRenderer.renderCake(this.readyPackage.cakeState, 130)}
        ${window.SDRenderer.renderCharacter(slot.customer, custMood, { width: 100, height: 120, wave: result.score >= 70 })}
      </div>
      <div class="speech-bubble" style="text-align:center;">"${slot.speech}"</div>
      <div style="display:flex;justify-content:space-around;background:#fff8eb;padding:10px;border-radius:12px;font-weight:800;">
        <span>🪙 Tiền bánh: +${result.basePay} xu</span>
        <span>💖 Tip: +${result.tip} xu</span>
        <span>✨ EXP: +${result.xpEarned}</span>
      </div>
      ${xpRes.leveledUp ? `<div class="toast success" style="position:static;transform:none;text-align:center;">🎉 CHÚC MỪNG LÊN CẤP ${xpRes.newLevel}: ${this.economy.getLevelInfo(xpRes.newLevel).title}!</div>` : ''}
      ${newAchs.map(a => `<div class="toast success" style="position:static;transform:none;text-align:center;">🏆 Mở khóa thành tích: ${a.title} (+${a.rewardCoins} xu)</div>`).join('')}
      <div class="breakdown-list">
        ${result.breakdown.map(b => `
          <div class="breakdown-item">
            <span>${b.ok ? '✅' : '⚠️'} ${b.label}</span>
            <b>${b.pts}/${b.max}</b>
          </div>
        `).join('')}
      </div>
    `;

    this.readyPackage = null;
    this.activeOrderId = null;
    this.baking.session = null;
    this.updateHUD();
    this.renderDisplayCakes();
    this.applyShopVisualUpgrades();
    this.openModal('modal-delivery');
  }

  _playIngredientAnimAndSound(ingId) {
    if (this.mixingCanvas) {
      this.mixingCanvas.triggerAddAnimation(ingId);
    }
    if (ingId === 'egg') this.audio.playEggCrack();
    else if (ingId === 'milk' || ingId === 'vanilla') this.audio.playPourLiquid();
    else if (ingId === 'flour' || ingId === 'sugar' || ingId === 'cacao' || ingId === 'matcha') this.audio.playPourPowder();
    else if (ingId === 'butter') this.audio.playButterDrop();
  }

  // --------------------------------------------------------------------------
  // SECONDARY TABS RENDERING
  // --------------------------------------------------------------------------
  _getOrderStatus(order) {
    if (this.readyPackage && this.readyPackage.orderId === order.orderId) {
      return { key: 'ready', label: 'Hoàn thành (Chờ giao)' };
    }
    if (this.activeOrderId === order.orderId && this.baking.session) {
      return { key: 'baking', label: 'Đang làm' };
    }
    return { key: 'waiting', label: 'Chờ thực hiện' };
  }

  renderOrdersTab() {
    const grid = document.getElementById('orders-list-grid');
    if (this.ordersView === 'history') {
      const history = this.state.orderHistory || [];
      if (history.length === 0) {
        grid.innerHTML = `<div class="info-card"><h4>Chưa có đơn hàng đã giao</h4><p>Hãy hoàn thành đơn đầu tiên để xem lịch sử giao bánh tại đây!</p></div>`;
        return;
      }
      grid.innerHTML = history.map(h => {
        const cake = this.recipes.getCakeType(h.cakeType);
        const batter = this.recipes.getBatter(h.batter);
        const frost = window.SDData.FROSTING_COLORS.find(f => f.id === h.frostingColor);
        return `
          <div class="info-card">
            <div class="info-card-top">
              ${window.SDRenderer.renderCake(h.cakeSnapshot, 80)}
              <div>
                <span class="status-pill delivered">Đã giao • Ngày ${h.day}</span>
                <h4>Đơn ${h.orderNumber} – ${h.customerName}</h4>
                <p>${cake.name} (${batter.name}, ${frost ? frost.name : ''}) ×${h.quantity}</p>
                <p><b>${h.grade}</b> (${h.score}/100) • <b>+${h.totalCoins} xu</b></p>
              </div>
            </div>
          </div>
        `;
      }).join('');
      return;
    }

    if (this.orders.activeOrders.length === 0) {
      grid.innerHTML = `<div class="info-card"><h4>Chưa có đơn hàng nào</h4><p>Hãy quay lại Tiệm bánh và đón khách hàng nhé!</p></div>`;
      return;
    }

    grid.innerHTML = this.orders.activeOrders.map(order => {
      const slot = this.customers.getSlotByOrderId(order.orderId);
      const cust = window.SDData.CUSTOMERS.find(c => c.id === order.customerId);
      const cake = this.recipes.getCakeType(order.cakeType);
      const batter = this.recipes.getBatter(order.batter);
      const frost = window.SDData.FROSTING_COLORS.find(f => f.id === order.frostingColor);
      const top = window.SDData.TOPPINGS.find(t => t.id === order.topping);
      const acc = window.SDData.ACCESSORIES.find(a => a.id === order.accessory);
      const box = window.SDData.BOX_COLORS.find(b => b.id === order.boxColor);
      const st = this._getOrderStatus(order);

      return `
        <div class="info-card ${order.isSpecial ? 'special-order' : ''}">
          <div class="info-card-top">
            ${window.SDRenderer.renderCake(order.targetPreview, 84)}
            <div>
              <span class="status-pill ${st.key}">${st.label}</span>
              <h4>${order.isSpecial ? order.specialBadge : `Đơn ${order.orderNumber}`}</h4>
              <p>Khách: <b>${cust ? cust.name : ''}</b> • ⏱️ ${slot ? Math.ceil(slot.patience) : 0}s</p>
            </div>
          </div>
          <p><b>Bánh:</b> ${cake.name} ×${order.quantity} • <b>Cốt:</b> ${batter.name}</p>
          <p><b>Trang trí:</b> ${frost ? frost.name : ''}, ${order.toppingCount} ${top ? top.name : ''}${acc ? `, ${order.accCount} ${acc.name}` : ''}</p>
          <p><b>Đóng gói:</b> ${box ? box.name : ''}</p>
          <div style="display:flex;gap:6px;margin-top:4px;">
            <button class="btn btn-soft btn-xs btn-inspect-tab" data-order="${order.orderId}">🔍 Xem Yêu Cầu</button>
            ${st.key === 'ready'
              ? `<button class="btn btn-mint btn-xs btn-deliver-tab" data-order="${order.orderId}">🎁 Giao Ngay</button>`
              : `<button class="btn btn-primary btn-xs btn-go-bake-tab" data-order="${order.orderId}">${st.key === 'baking' ? '▶ Tiếp Tục Làm' : '👩‍🍳 Làm Đơn Này'}</button>`
            }
          </div>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.btn-inspect-tab').forEach(b => {
      b.addEventListener('click', () => this.openOrderDetailModal(b.dataset.order));
    });
    grid.querySelectorAll('.btn-go-bake-tab').forEach(b => {
      b.addEventListener('click', () => this.openWorkshopForOrder(b.dataset.order));
    });
    grid.querySelectorAll('.btn-deliver-tab').forEach(b => {
      b.addEventListener('click', () => this.deliverToCustomer(b.dataset.order));
    });
  }

  renderCollectionTab() {
    const container = document.getElementById('collection-content');
    const catBar = document.getElementById('recipe-category-bar');
    if (catBar) catBar.classList.toggle('hidden', this.activeSubTab !== 'recipes');

    if (this.activeSubTab === 'recipes') {
      const mainCats = ['cupcake', 'donut', 'round_cake', 'cookie'];
      const list = window.SDData.CAKE_TYPES.filter(c => {
        if (this.recipeCategory === 'all') return true;
        if (this.recipeCategory === 'other') return !mainCats.includes(c.id);
        return c.id === this.recipeCategory;
      });

      container.innerHTML = list.map(c => {
        const unlocked = c.unlockLevel <= this.state.level;
        const ingChips = c.baseIngredients.map(id => {
          const ing = window.SDData.INGREDIENTS.find(i => i.id === id);
          const stock = this.economy.getStock(id);
          return `<span class="recipe-ing-chip ${stock <= 0 ? 'missing' : ''}">${ing ? ing.name : id} (${stock})</span>`;
        }).join('');
        return `
          <div class="info-card ${unlocked ? '' : 'locked'}">
            <div class="info-card-top">
              ${window.SDRenderer.renderCake({ cakeType: c.id, batter: 'vanilla', frostingColor: 'pink', nozzle: 'swirl', frostingApplied: true }, 82)}
              <div>
                <h4>${c.name}</h4>
                <p>${unlocked ? `💰 ${c.basePrice} xu • ⏱️ Nướng ${c.bakeTime}s (${c.idealTemp}°C)` : `🔒 Mở khóa ở Cấp ${c.unlockLevel}`}</p>
              </div>
            </div>
            <p>${c.description}</p>
            <div>
              <small style="font-weight:800;">Nguyên liệu nền (+ hương vị tùy chọn):</small>
              <div class="recipe-ing-chips">${ingChips}</div>
            </div>
            <p style="font-size:0.76rem;"><b>Quy trình:</b> Trộn bột → Đổ ${c.moldName} → Nướng ${c.idealTemp}°C → Trang trí &amp; Đóng gói.</p>
          </div>
        `;
      }).join('');
    } else if (this.activeSubTab === 'styles') {
      container.innerHTML = window.SDData.DECOR_STYLES.map(st => {
        const preview = this.orders.buildTargetPreview(st);
        return `
          <div class="info-card">
            <div class="info-card-top">
              ${window.SDRenderer.renderCake(preview, 84)}
              <div>
                <h4>${st.name}</h4>
                <p>${this.recipes.getCakeType(st.cakeType).name} • ${this.recipes.getBatter(st.batter).name}</p>
              </div>
            </div>
          </div>
        `;
      }).join('');
    } else {
      const entries = Object.values(this.state.collection);
      if (entries.length === 0) {
        container.innerHTML = `<div class="info-card"><h4>Album còn trống</h4><p>Hãy hoàn thành chiếc bánh đầu tiên để lưu vào bộ sưu tập!</p></div>`;
        return;
      }
      container.innerHTML = entries.map(item => `
        <div class="info-card">
          <div class="info-card-top">
            ${window.SDRenderer.renderCake(item.cakeSnapshot, 84)}
            <div>
              <h4>${item.name}</h4>
              <p>Điểm cao nhất: <b>${item.bestScore}/100</b></p>
              <p>Số lần hoàn thành: <b>${item.count}</b></p>
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  renderInventoryTab() {
    const giftBtn = document.getElementById('btn-emergency-gift');
    giftBtn.classList.toggle('hidden', this.state.coins >= 40);
    giftBtn.onclick = () => {
      if (this.economy.claimEmergencyGift()) {
        this.showToast('🎁 Đã nhận +60 xu và nguyên liệu cơ bản!', 'success');
        this.updateHUD();
        this.renderInventoryTab();
      }
    };

    // Check active orders for missing or low ingredients!
    const neededMap = {};
    this.orders.activeOrders.forEach(ord => {
      const req = this.recipes.getRequiredIngredients(ord.cakeType, ord.batter);
      req.forEach(id => { neededMap[id] = (neededMap[id] || 0) + 1; });
    });
    const lackingNames = Object.keys(neededMap)
      .filter(id => this.economy.getStock(id) < neededMap[id])
      .map(id => window.SDData.INGREDIENTS.find(i => i.id === id)?.name || id);
    const lowNames = window.SDData.INGREDIENTS
      .filter(i => this.economy.isIngredientUnlocked(i) && this.economy.getStock(i.id) > 0 && this.economy.getStock(i.id) <= 3)
      .map(i => i.name);

    const alertBox = document.getElementById('inventory-order-alerts');
    if (lackingNames.length > 0 || lowNames.length > 0) {
      alertBox.classList.remove('hidden');
      const parts = [];
      if (lackingNames.length > 0) parts.push(`🚨 Không đủ nguyên liệu cho đơn hàng đang chờ: <b>${lackingNames.join(', ')}</b>`);
      if (lowNames.length > 0) parts.push(`⚠️ Nguyên liệu sắp hết (≤3): <b>${lowNames.join(', ')}</b>`);
      alertBox.innerHTML = parts.join('<br/>');
    } else {
      alertBox.classList.add('hidden');
    }

    const discPct = this.economy.getIngredientDiscountPct();
    const grid = document.getElementById('inventory-grid');
    grid.innerHTML = window.SDData.INGREDIENTS.map(ing => {
      const unlocked = this.economy.isIngredientUnlocked(ing);
      const stock = this.economy.getStock(ing.id);
      const unitPrice = this.economy.getIngredientPrice(ing.id);
      const badge = stock === 0
        ? `<span class="stock-badge empty">Hết hàng!</span>`
        : stock <= 3
          ? `<span class="stock-badge warn">Sắp hết!</span>`
          : `<span class="stock-badge ok">Sẵn sàng</span>`;

      return `
        <div class="info-card ${unlocked ? '' : 'locked'}">
          <div class="info-card-top">
            ${window.SDRenderer.renderIngredient(ing.id, 52)}
            <div>
              <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                <h4>${ing.name}</h4>
                ${unlocked ? badge : ''}
              </div>
              <p>Đang có: <b>${stock} ${ing.unit}</b></p>
              <p>${unlocked ? `Giá: <b>${unitPrice} xu</b> / ${ing.unit}${discPct > 0 ? ` <small>(-${discPct}%)</small>` : ''}` : `🔒 Mở ở Cấp ${ing.unlockLevel}`}</p>
            </div>
          </div>
          ${unlocked ? `
            <div style="display:flex;gap:6px;">
              <button class="btn btn-mint btn-xs btn-buy-ing" data-ing="${ing.id}" data-qty="1">Mua 1 (${unitPrice} xu)</button>
              <button class="btn btn-primary btn-xs btn-buy-ing" data-ing="${ing.id}" data-qty="5">Mua 5 (${unitPrice * 5} xu)</button>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');
    if (window.SDCanvasIcons) window.SDCanvasIcons.paintAll(grid);

    grid.querySelectorAll('.btn-buy-ing').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = this.economy.buyIngredient(btn.dataset.ing, Number(btn.dataset.qty));
        if (!res.ok) return this.showToast(res.reason, 'error');
        this.showToast(`Đã mua ${res.qty} ${res.name}!`, 'success');
        this.updateHUD();
        this.renderInventoryTab();
        if (this.workshopStep === 'prep' && this.baking.session) this.renderPrepStage();
      });
    });
  }

  renderDecorTab() {
    const grid = document.getElementById('decor-shop-grid');
    grid.innerHTML = window.SDData.SHOP_DECORS.map(d => {
      const owned = this.upgrades.hasDecor(d.id);
      const equipped = this.upgrades.isDecorEquipped(d.id);
      return `
        <div class="info-card">
          <span class="decor-cat-badge">${d.catName}</span>
          <h4>${d.name}</h4>
          <p>${d.desc}</p>
          <p><b>Hiệu quả khi trưng bày:</b> +${d.tipBonus} xu tip • +${d.patienceBonus}s kiên nhẫn</p>
          ${owned
            ? `<button class="btn ${equipped ? 'btn-mint' : 'btn-lavender'} btn-sm btn-equip-decor" data-decor="${d.id}">
                ${equipped ? '✅ Đang Trưng Bày (Nhấn để cất)' : '✨ Sử Dụng Trang Trí Này'}
               </button>`
            : `<button class="btn btn-primary btn-sm btn-buy-decor" data-decor="${d.id}">🛍️ Mua (${d.price} xu)</button>`
          }
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.btn-buy-decor').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = this.upgrades.buyDecor(btn.dataset.decor);
        if (!res.ok) return this.showToast(res.reason, 'error');
        this.showToast(`✨ Đã mua và trang trí ${res.item.name} vào tiệm!`, 'success');
        const newAchs = this.upgrades.checkAchievements();
        newAchs.forEach(a => this.showToast(`🏆 Mở khóa thành tích: ${a.title} (+${a.rewardCoins} xu)!`, 'success'));
        this.applyShopVisualUpgrades();
        this.updateHUD();
        this.renderDecorTab();
      });
    });

    grid.querySelectorAll('.btn-equip-decor').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = this.upgrades.toggleEquipDecor(btn.dataset.decor);
        if (!res.ok) return;
        this.showToast(res.equipped ? `✨ Đang trưng bày ${res.item.name}!` : `Đã cất ${res.item.name}.`, 'info');
        this.applyShopVisualUpgrades();
        this.updateHUD();
        this.renderDecorTab();
      });
    });
  }

  renderUpgradesTab() {
    const grid = document.getElementById('upgrades-grid');
    grid.innerHTML = window.SDData.EQUIPMENT_UPGRADES.map(u => {
      const cur = this.upgrades.getUpgradeLevelData(u.id);
      const next = this.upgrades.getNextUpgradeLevelData(u.id);
      return `
        <div class="info-card">
          <h4>${u.name} (Cấp ${cur.level}/${u.levels.length})</h4>
          <p>Hiện tại: <b>${cur.name}</b></p>
          <p>${u.desc}</p>
          ${next
            ? `<button class="btn btn-butter btn-sm btn-buy-upg" data-upg="${u.id}">⬆️ Nâng lên ${next.name} (${next.price} xu)</button>`
            : `<button class="btn btn-soft btn-sm" disabled>🌟 Đã Đạt Cấp Tối Đa</button>`
          }
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.btn-buy-upg').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = this.upgrades.buyEquipmentUpgrade(btn.dataset.upg);
        if (!res.ok) return this.showToast(res.reason, 'error');
        this.showToast(`🛠️ Đã nâng cấp lên ${res.next.name}!`, 'success');
        const newAchs = this.upgrades.checkAchievements();
        newAchs.forEach(a => this.showToast(`🏆 Mở khóa thành tích: ${a.title} (+${a.rewardCoins} xu)!`, 'success'));
        this.applyShopVisualUpgrades();
        this.updateHUD();
        this.renderUpgradesTab();
      });
    });
  }

  renderAchievementsTab() {
    const qGrid = document.getElementById('quests-grid');
    qGrid.innerHTML = this.state.dailyQuests.map(q => {
      const pct = Math.min(100, Math.round((q.progress / q.target) * 100));
      const ready = q.progress >= q.target && !q.claimed;
      return `
        <div class="info-card">
          <h4>${q.title}</h4>
          <div class="quest-bar"><div class="quest-bar-fill" style="width:${pct}%"></div></div>
          <p>Tiến độ: <b>${q.progress}/${q.target}</b> • Thưởng: <b>${q.rewardCoins} xu &amp; ${q.rewardXp} EXP</b></p>
          <button class="btn ${ready ? 'btn-mint' : 'btn-soft'} btn-xs btn-claim-quest" data-qid="${q.id}" ${ready ? '' : 'disabled'}>
            ${q.claimed ? '✅ Đã Nhận Thưởng' : ready ? '🎁 Nhận Thưởng Ngay' : '⏳ Chưa Hoàn Thành'}
          </button>
        </div>
      `;
    }).join('');

    qGrid.querySelectorAll('.btn-claim-quest').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = this.upgrades.claimQuest(btn.dataset.qid);
        if (res) {
          this.showToast(`🎁 Nhận +${res.quest.rewardCoins} xu & +${res.quest.rewardXp} EXP!`, 'success');
          const newAchs = this.upgrades.checkAchievements();
          newAchs.forEach(a => this.showToast(`🏆 Mở khóa thành tích: ${a.title} (+${a.rewardCoins} xu)!`, 'success'));
          this.updateHUD();
          this.renderAchievementsTab();
        }
      });
    });

    const aGrid = document.getElementById('achievements-grid');
    aGrid.innerHTML = window.SDData.ACHIEVEMENTS.map(a => {
      const unlocked = this.state.unlockedAchievements.includes(a.id);
      const curProg = typeof a.progress === 'function' ? Math.min(a.target, a.progress(this.state)) : (unlocked ? 1 : 0);
      const target = a.target || 1;
      const pct = Math.min(100, Math.round((curProg / target) * 100));
      return `
        <div class="info-card ${unlocked ? '' : 'locked'}">
          <h4>${unlocked ? '🏆' : '🔒'} ${a.title}</h4>
          <p>${a.desc}</p>
          <div class="quest-bar"><div class="quest-bar-fill" style="width:${pct}%"></div></div>
          <p>Tiến độ: <b>${curProg}/${target}</b> • Thưởng: <b>${a.rewardCoins} xu</b> ${unlocked ? '✅' : ''}</p>
        </div>
      `;
    }).join('');
  }

  // --------------------------------------------------------------------------
  // DAY CYCLE & MAIN LOOP
  // --------------------------------------------------------------------------
  finishCurrentDay() {
    this.isDayActive = false;
    this.paused = true;
    const isVictoryMilestone = this.state.level >= 15;
    document.getElementById('md-endday-title').textContent = isVictoryMilestone
      ? '👑 CHÚC MỪNG CHIẾN THẮNG! ĐẾ CHẾ SWEET DREAMS!'
      : `🌙 Tổng Kết Ngày ${this.state.day}`;
    document.getElementById('md-endday-body').innerHTML = `
      <div style="text-align:center;">
        <p>Tiệm bánh đã khép lại một ngày ngọt ngào!</p>
      </div>
      <div class="breakdown-list">
        <div class="breakdown-item"><span>Đơn hoàn thành hôm nay</span><b>${this.state.stats.dayOrders}</b></div>
        <div class="breakdown-item"><span>Doanh thu hôm nay</span><b>${this.state.stats.dayCoins} xu</b></div>
        <div class="breakdown-item"><span>Tổng khách đã phục vụ</span><b>${this.state.stats.customersServed}</b></div>
        <div class="breakdown-item"><span>Danh tiếng hiện tại</span><b>${this.state.reputation} 💖</b></div>
      </div>
    `;
    this.openModal('modal-end-day');
  }

  startNextDay() {
    this.state.day += 1;
    this.state.stats.dayOrders = 0;
    this.state.stats.dayCoins = 0;
    this.dayElapsed = 0;
    this.isDayActive = true;
    this.paused = false;
    this.readyPackage = null;
    this.activeOrderId = null;
    this.baking.session = null;
    this.closeWorkshop();
    this.customers.resetForNewDay();
    this.upgrades.ensureDailyQuests(true);
    this.saveManager.save(this.state);
    this.updateHUD();
    this.renderBakeryCustomers();

    // Chance of special order on new day!
    setTimeout(() => {
      if (this.isDayActive) {
        this.customers.spawnCustomer(this.state.day >= 2 && Math.random() < 0.65);
      }
    }, 500);
  }

  startLoop() {
    const tick = (now) => {
      const dt = Math.min(0.1, (now - this._lastTime) / 1000);
      this._lastTime = now;

      if (this.currentScreen === 'main' && this.isDayActive && !this.paused) {
        const isWorkshopOpen = !document.getElementById('view-workshop').classList.contains('hidden');
        this.dayElapsed += dt;
        this.customers.update(dt, this.isDayActive, this.activeOrderId, isWorkshopOpen);

        if (this.baking.updateOven(dt)) {
          this.updateOvenDynamicUI();
        }

        if (this.mixingCanvas && this.workshopStep === 'prep' && isWorkshopOpen) {
          this.mixingCanvas.update(dt);
        }

        this._uiTick += dt;
        if (this._uiTick >= 0.4) {
          this._uiTick = 0;
          this.updateHUD();
          if (this.activeTab === 'bakery' && document.getElementById('view-workshop').classList.contains('hidden')) {
            this.renderBakeryCustomers();
          } else if (this.activeTab === 'orders' && this.ordersView === 'active') {
            this.renderOrdersTab();
          }
        }

        if (this.dayElapsed >= this.dayDuration) {
          this.finishCurrentDay();
        }
      }

      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // --------------------------------------------------------------------------
  // VISUAL PARTICLES & TOASTS
  // --------------------------------------------------------------------------
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const div = document.createElement('div');
    div.className = `toast ${type}`;
    div.textContent = message;
    container.appendChild(div);
    setTimeout(() => div.remove(), 2600);
  }

  spawnHeartsFX() {
    const layer = document.getElementById('fx-layer');
    for (let i = 0; i < 8; i++) {
      const p = document.createElement('div');
      p.className = 'fx-particle';
      p.textContent = i % 2 === 0 ? '💖' : '✨';
      p.style.left = `${25 + Math.random() * 50}%`;
      p.style.top = `${45 + Math.random() * 25}%`;
      layer.appendChild(p);
      setTimeout(() => p.remove(), 1450);
    }
  }

  spawnFlyingCoinsFX() {
    const layer = document.getElementById('fx-layer');
    for (let i = 0; i < 6; i++) {
      const p = document.createElement('div');
      p.className = 'fx-particle';
      p.textContent = '🪙';
      p.style.left = `${40 + Math.random() * 20}%`;
      p.style.top = `${55 + Math.random() * 15}%`;
      layer.appendChild(p);
      setTimeout(() => p.remove(), 1450);
    }
  }

  spawnConfettiFX() {
    const layer = document.getElementById('fx-layer');
    const colors = ['#FF8FAB', '#FFD166', '#A8E6CF', '#D8BBFF', '#99D6FF'];
    for (let i = 0; i < 28; i++) {
      const c = document.createElement('div');
      c.className = 'confetti-piece';
      c.style.background = colors[i % colors.length];
      c.style.left = `${Math.random() * 100}%`;
      c.style.top = '-15px';
      c.style.animationDelay = `${Math.random() * 0.5}s`;
      layer.appendChild(c);
      setTimeout(() => c.remove(), 2800);
    }
  }
};

window.addEventListener('DOMContentLoaded', () => {
  window.game = new window.GameManager();
});

