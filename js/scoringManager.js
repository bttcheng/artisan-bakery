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
    const customer = customerSlot ? customerSlot.customer : null;
    const personality = customer ? (customer.personality || 'chill') : 'chill';
    const execElapsed = Math.max(0, Math.round(order.execElapsed || 0));
    const targetDuration = Math.max(20, order.targetDuration || 28);
    const overtime = Math.max(0, execElapsed - targetDuration);

    // 0. Burnt Cake Rule: Burnt cake spoils the entire order ("cháy thì mất đơn")
    if (cakeState && cakeState.bakeState === 'burnt') {
      breakdown.push({ label: 'Bánh bị cháy khét trong lò', pts: 0, max: 100, ok: false });
      return {
        burntFail: true,
        score: 0,
        grade: 'CHÁY KHÉT - MẤT ĐƠN',
        stars: 0,
        basePay: 0,
        tip: 0,
        totalCoins: 0,
        xpEarned: 0,
        repDelta: -3,
        personalityFeedback: 'Khách từ chối nhận bánh bị cháy!',
        speedInfo: {
          execElapsed,
          targetDuration,
          overtime,
          tipMultSpeed: 0,
          speedLabel: 'Bánh hỏng do cháy lò'
        },
        breakdown
      };
    }

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

    // 7. Baking & Mixing Quality (12 pts — rewards snapping "Chín!" right on time)
    const bakeQual = cakeState.bakeQuality || 40;
    const mixQual = cakeState.mixQuality || 70;
    const avgQual = (bakeQual * 0.68 + mixQual * 0.32) / 100;
    const qualPts = cakeState.bakeState === 'perfect'
      ? Math.min(12, Math.max(9, Math.round(avgQual * 12)))
      : Math.min(5, Math.round(avgQual * 6));
    total += qualPts;
    breakdown.push({
      label: cakeState.bakeState === 'perfect' ? 'Canh lò chuẩn "Chín!"' : 'Chất lượng trộn & nướng (Chưa chín tới)',
      pts: qualPts,
      max: 12,
      ok: cakeState.bakeState === 'perfect'
    });

    // 8. Execution Speed vs 20-40s Arcade Target Time (8 pts)
    let timePts = 8;
    let tipMultSpeed = 1.0;
    let repSpeedDelta = 1;
    let speedLabel = `Đúng nhịp (${execElapsed}s / ${targetDuration}s)`;
    let speedOk = true;

    if (overtime === 0) {
      timePts = 8;
      tipMultSpeed = 1.1;
      repSpeedDelta = 1;
      speedLabel = `Hoàn hảo đúng hẹn (${execElapsed}s / ${targetDuration}s)`;
      speedOk = true;
    } else if (overtime <= 15) {
      timePts = 5;
      tipMultSpeed = 0.6;
      repSpeedDelta = 0;
      speedLabel = `Trễ nhẹ +${overtime}s • Giảm phần tip`;
      speedOk = true;
    } else if (overtime <= 35) {
      timePts = 2;
      tipMultSpeed = 0.25;
      repSpeedDelta = -1;
      speedLabel = `Hơi chậm +${overtime}s • Giảm tip & uy tín`;
      speedOk = false;
    } else {
      timePts = 0;
      tipMultSpeed = 0;
      repSpeedDelta = -1;
      speedLabel = `Quá chậm (+${overtime}s) • Mất tiền tip`;
      speedOk = false;
    }

    total += timePts;
    breakdown.push({ label: speedLabel, pts: timePts, max: 8, ok: speedOk });

    const score = Math.max(0, Math.min(100, Math.round(total)));

    let grade = 'CHƯA ĐẠT - MẤT ĐƠN';
    let stars = 0;
    if (score >= 88) {
      grade = 'PERFECT!';
      stars = 3;
    } else if (score >= 70) {
      grade = 'NGON!';
      stars = 2;
    } else if (score >= 50) {
      grade = 'TẠM ĐƯỢC';
      stars = 1;
    }

    // Calculate Money, Tip & XP scaled sharply by quality & customer personality
    const cakeCfg = this.recipes.getCakeType(order.cakeType);
    const qtyMult = order.quantity || 1;
    const payScale = stars === 3 ? 1.15 : stars === 2 ? 0.88 : stars === 1 ? 0.55 : 0;
    const vipMult = personality === 'vip' && stars >= 2 ? 1.35 : 1.0;
    const basePay = stars === 0
      ? 0
      : Math.round((cakeCfg.basePrice * qtyMult * payScale + (order.bonusCoins || 0) * (stars >= 2 ? 1 : 0.4)) * vipMult);

    const tipMult = customer ? customer.tipMultiplier : 1;
    const decoTipBonus = this.upgrades.getTotalTipBonus();
    let rawTip = stars === 3
      ? (18 + decoTipBonus) * tipMult
      : stars === 2
        ? (8 + decoTipBonus * 0.45) * tipMult
        : 0; // 1 star ("Tạm được") = no tip!

    let personalityFeedback = '';
    let personalityRepDelta = 0;

    if (personality === 'rush') {
      if (overtime === 0 && stars >= 2) {
        rawTip += 12 * tipMult;
        personalityFeedback = 'Khách Vội rất hài lòng tốc độ · +Thưởng nhanh!';
      } else if (overtime > 0) {
        rawTip = 0;
        personalityFeedback = 'Khách Vội chê giao chậm · Mất tiền tip!';
      }
    } else if (personality === 'picky') {
      if (score < 85) {
        rawTip = 0;
        personalityRepDelta = -1;
        personalityFeedback = 'Khách Khó Tính chê chất lượng chưa đạt · -1 uy tín!';
      } else if (score >= 92) {
        rawTip += 15;
        personalityRepDelta = 2;
        personalityFeedback = 'Khách Khó Tính gật gù khen ngợi · +15 tip & +2 uy tín!';
      }
    } else if (personality === 'vip') {
      if (stars >= 2) {
        personalityFeedback = 'Khách VIP hài lòng · Thưởng lớn!';
      } else {
        personalityRepDelta = -2;
        personalityFeedback = 'Khách VIP thất vọng · -2 uy tín!';
      }
    }

    const tip = stars === 0 ? 0 : Math.max(0, Math.round(rawTip * tipMultSpeed));
    const xpEarned = stars === 0 ? 0 : Math.round((cakeCfg.baseXp * qtyMult + (order.bonusXp || 0)) * (stars === 3 ? 1.25 : stars === 2 ? 0.9 : 0.5) * (personality === 'vip' ? 1.3 : 1));
    const baseRepDelta = stars === 3 ? 3 : stars === 2 ? 1 : stars === 1 ? 0 : -2;
    const repDelta = baseRepDelta + (stars >= 2 ? Math.max(0, repSpeedDelta) : Math.min(0, repSpeedDelta)) + personalityRepDelta;

    return {
      burntFail: false,
      score,
      grade,
      stars,
      basePay,
      tip,
      totalCoins: basePay + tip,
      xpEarned,
      repDelta,
      personalityFeedback,
      speedInfo: {
        execElapsed,
        targetDuration,
        overtime,
        tipMultSpeed,
        speedLabel
      },
      breakdown
    };
  }
};

