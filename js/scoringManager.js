// ============================================================================
// SWEET DREAMS - TIỆM BÁNH NGỌT
// ScoringManager: 8-Criteria 100-Point Cake Evaluation & Rewards
// ============================================================================

window.ScoringManager = class ScoringManager {
  constructor(recipeManager, upgradeManager) {
    this.recipes = recipeManager;
    this.upgrades = upgradeManager;
  }

  evaluate(order, cakeState, packaging, customerSlot) {
    const breakdown = [];
    let total = 0;

    // 1. Cake Type (14 pts)
    const cakeOk = cakeState.cakeType === order.cakeType;
    const cakePts = cakeOk ? 14 : 0;
    total += cakePts;
    breakdown.push({ label: 'Loại bánh', pts: cakePts, max: 14, ok: cakeOk });

    // 2. Batter Flavor (12 pts)
    const batterOk = cakeState.batter === order.batter;
    const batterPts = batterOk ? 12 : 3;
    total += batterPts;
    breakdown.push({ label: 'Cốt bánh', pts: batterPts, max: 12, ok: batterOk });

    // 3. Frosting Color & Application (14 pts)
    let frostPts = 0;
    if (cakeState.frostingApplied) {
      if (cakeState.frostingColor === order.frostingColor) frostPts += 10;
      else frostPts += 4;
      if (cakeState.nozzle === order.nozzle) frostPts += 4;
      else frostPts += 2;
    }
    total += frostPts;
    breakdown.push({ label: 'Kem & Vòi bắt kem', pts: frostPts, max: 14, ok: cakeState.frostingApplied && cakeState.frostingColor === order.frostingColor });

    // 4. Topping Type & Count (15 pts)
    const matchingToppings = (cakeState.toppings || []).filter(t => t.type === order.topping).length;
    const targetTopCount = order.toppingCount || 0;
    let topPts = 0;
    let topOk = false;
    if (targetTopCount === 0) {
      topPts = 15;
      topOk = true;
    } else if (matchingToppings === targetTopCount) {
      topPts = 15;
      topOk = true;
    } else if (matchingToppings > 0) {
      const diff = Math.abs(matchingToppings - targetTopCount);
      topPts = Math.max(5, 15 - diff * 3);
    }
    total += topPts;
    breakdown.push({ label: `Topping (${matchingToppings}/${targetTopCount})`, pts: topPts, max: 15, ok: topOk });

    // 5. Accessories (11 pts)
    let accPts = 0;
    let accOk = false;
    const placedAcc = cakeState.accessories || [];
    if (!order.accessory || order.accessory === 'none') {
      accPts = 11;
      accOk = true;
    } else {
      const mainCount = placedAcc.filter(a => a.type === order.accessory).length;
      const targetAccCount = order.accCount || 1;
      const hasExtra = !order.extraAccessory || placedAcc.some(a => a.type === order.extraAccessory);
      if (mainCount >= targetAccCount && hasExtra) {
        accPts = 11;
        accOk = true;
      } else if (mainCount > 0) {
        accPts = 6;
      }
    }
    total += accPts;
    breakdown.push({ label: 'Phụ kiện trang trí', pts: accPts, max: 11, ok: accOk });

    // 6. Packaging & Interactive Wrapping (14 pts)
    let pkgPts = 0;
    if (packaging && packaging.closed) {
      const stepsDone = packaging.cakePlaced === undefined
        ? true
        : (packaging.cakePlaced && packaging.leftFold >= 1 && packaging.rightFold >= 1 && packaging.endsFold >= 1 && packaging.tapeApplied && packaging.ribbonWrapped && packaging.bowTieProgress >= 1);
      pkgPts += stepsDone ? 4 : 2;
      if (packaging.boxColor === order.boxColor) pkgPts += 3;
      if (packaging.ribbonColor === order.ribbonColor) pkgPts += 3;
      const reqCard = order.card || 'none';
      if (reqCard === 'none' || packaging.card === reqCard) pkgPts += 2;
      const reqSticker = order.sticker || 'none';
      if (reqSticker === 'none' || packaging.sticker === reqSticker) pkgPts += 2;
    }
    total += pkgPts;
    breakdown.push({ label: 'Đóng gói, ruy băng & phụ kiện hộp', pts: pkgPts, max: 14, ok: pkgPts >= 11 });

    // 7. Baking & Mixing Quality (12 pts)
    const bakeQual = cakeState.bakeQuality || 60;
    const mixQual = cakeState.mixQuality || 70;
    const avgQual = (bakeQual * 0.65 + mixQual * 0.35) / 100;
    const qualPts = cakeState.bakeState === 'burnt' ? 2 : Math.round(avgQual * 12);
    total += qualPts;
    breakdown.push({ label: 'Chất lượng trộn & nướng', pts: qualPts, max: 12, ok: cakeState.bakeState === 'perfect' });

    // 8. Completion Speed / Patience Remaining (8 pts)
    const ratio = customerSlot ? (customerSlot.patience / customerSlot.maxPatience) : 0.7;
    const timePts = ratio >= 0.55 ? 8 : ratio >= 0.3 ? 5 : 2;
    total += timePts;
    breakdown.push({ label: 'Thời gian phục vụ', pts: timePts, max: 8, ok: ratio >= 0.3 });

    const score = Math.max(0, Math.min(100, Math.round(total)));

    let grade = 'NEED IMPROVEMENT';
    let stars = 0;
    if (score >= 90) {
      grade = 'PERFECT';
      stars = 3;
    } else if (score >= 70) {
      grade = 'GREAT';
      stars = 2;
    } else if (score >= 50) {
      grade = 'GOOD';
      stars = 1;
    }

    // Calculate Money, Tip & XP
    const cakeCfg = this.recipes.getCakeType(order.cakeType);
    const qtyMult = order.quantity || 1;
    const basePay = Math.round(cakeCfg.basePrice * qtyMult * (0.45 + (score / 100) * 0.75) + (order.bonusCoins || 0) * (score >= 50 ? 1 : 0.3));
    const tipMult = customerSlot ? customerSlot.customer.tipMultiplier : 1;
    const decoTipBonus = this.upgrades.getTotalTipBonus();
    const tip = score >= 85
      ? Math.round((15 + decoTipBonus) * tipMult)
      : score >= 70
        ? Math.round((7 + decoTipBonus * 0.5) * tipMult)
        : 0;

    const xpEarned = Math.round((cakeCfg.baseXp * qtyMult + (order.bonusXp || 0)) * (score >= 50 ? (0.6 + score / 200) : 0.3));
    const repDelta = stars === 3 ? 3 : stars === 2 ? 2 : stars === 1 ? 1 : -1;

    return {
      score,
      grade,
      stars,
      basePay,
      tip,
      totalCoins: basePay + tip,
      xpEarned,
      repDelta,
      breakdown
    };
  }
};

