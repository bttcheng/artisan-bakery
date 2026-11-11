// ============================================================================
// SWEET DREAMS - TIỆM BÁNH NGỌT
// OvenCanvasController & SDOvenUI: 2D Animated Baking Simulation
// ============================================================================

window.OvenCanvasController = class OvenCanvasController {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.width = 560;
    this.height = 380;

    // Synced state from BakingManager
    this.moldType = 'cupcake';
    this.batterId = 'vanilla';
    this.batterRawColor = '#FFE9A8';
    this.batterBakedColor = '#F3C677';
    this.batterPoured = false;
    this.inOven = false;
    this.ovenRunning = false;
    this.bakeElapsed = 0;
    this.bakeTargetTime = 7;
    this.perfectWindow = 2.8;
    this.bakeState = 'raw';
    this.selectedTemp = 180;

    // Smooth animation interpolators
    this.doorOpen = 1;       // 1 = open, 0 = closed
    this.trayIn = 0;         // 0 = front prep rack, 1 = inside oven
    this.heatGlow = 0;       // 0..1
    this.pourAnim = 0;       // 0 = idle, >0..1 = pouring animation
    this.dragHighlight = false;
    this.time = 0;
    this.particles = [];     // steam, smoke, sparkles

    this._setupDPI();
  }

  _setupDPI() {
    if (!this.canvas || !this.ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  reset() {
    this.batterPoured = false;
    this.inOven = false;
    this.ovenRunning = false;
    this.bakeElapsed = 0;
    this.bakeState = 'raw';
    this.doorOpen = 1;
    this.trayIn = 0;
    this.heatGlow = 0;
    this.pourAnim = 0;
    this.particles = [];
  }

  triggerPourAnimation() {
    this.pourAnim = 0.001;
  }

  triggerPerfectBurst() {
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2;
      this.particles.push({
        kind: 'sparkle',
        x: 280 + Math.cos(a) * 60,
        y: 195 + Math.sin(a) * 40,
        vx: Math.cos(a) * (45 + Math.random() * 45),
        vy: Math.sin(a) * (35 + Math.random() * 35) - 25,
        size: 5 + Math.random() * 5,
        life: 0,
        maxLife: 0.9 + Math.random() * 0.4,
        color: i % 2 === 0 ? '#FFD166' : '#FF8FAB'
      });
    }
  }

  syncState(session, batterCfg, perfectWindow) {
    if (!session) return;
    this.moldType = session.selectedMold || session.selectedCakeType || 'cupcake';
    this.batterId = session.selectedBatter || 'vanilla';
    if (batterCfg) {
      this.batterRawColor = batterCfg.color;
      this.batterBakedColor = batterCfg.bakedColor;
    }
    this.batterPoured = !!session.batterPoured;
    this.inOven = !!session.inOven;
    this.ovenRunning = !!session.ovenRunning;
    this.bakeElapsed = session.bakeElapsed || 0;
    this.bakeTargetTime = session.bakeTargetTime || 7;
    this.perfectWindow = perfectWindow || 2.8;
    this.bakeState = session.bakeState || 'raw';
    this.selectedTemp = session.selectedTemp || 180;
  }

  update(dt) {
    if (!this.ctx) return;
    this.time += dt;

    // Target door & tray positions
    const targetTrayIn = this.inOven && this.ovenRunning ? 1 : (this.inOven ? 0.15 : 0);
    const targetDoorOpen = this.ovenRunning ? 0 : 1;
    const targetHeat = this.ovenRunning ? 1 : 0;

    this.trayIn += (targetTrayIn - this.trayIn) * Math.min(1, dt * 6.5);
    this.doorOpen += (targetDoorOpen - this.doorOpen) * Math.min(1, dt * 6.5);
    this.heatGlow += (targetHeat - this.heatGlow) * Math.min(1, dt * 4.5);

    if (this.pourAnim > 0) {
      this.pourAnim += dt * 1.45;
      if (this.pourAnim >= 1) this.pourAnim = 0;
    }

    // Emit heat shimmer / steam during baking, sparkles when perfect, smoke when burnt
    if (this.ovenRunning) {
      const ratio = this.bakeElapsed / Math.max(1, this.bakeTargetTime);
      if (ratio > 0.3 && Math.random() < 0.35) {
        this.particles.push({
          kind: 'heat',
          x: 170 + Math.random() * 220,
          y: 225,
          vx: (Math.random() - 0.5) * 14,
          vy: -28 - Math.random() * 22,
          size: 8 + Math.random() * 10,
          life: 0,
          maxLife: 1.1,
          color: 'rgba(255, 245, 220, 0.35)'
        });
      }
      if (this.bakeState === 'perfect' && Math.random() < 0.25) {
        this.particles.push({
          kind: 'sparkle',
          x: 165 + Math.random() * 230,
          y: 145 + Math.random() * 90,
          vx: (Math.random() - 0.5) * 18,
          vy: -18 - Math.random() * 16,
          size: 4 + Math.random() * 4,
          life: 0,
          maxLife: 0.75,
          color: '#FFD166'
        });
      }
      if (this.bakeState === 'burnt' && Math.random() < 0.65) {
        this.particles.push({
          kind: 'smoke',
          x: 175 + Math.random() * 210,
          y: 215,
          vx: (Math.random() - 0.5) * 24,
          vy: -36 - Math.random() * 25,
          size: 11 + Math.random() * 14,
          life: 0,
          maxLife: 1.4,
          color: 'rgba(65, 55, 52, 0.45)'
        });
      }
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.life >= p.maxLife) this.particles.splice(i, 1);
    }

    this.render();
  }

  render() {
    const ctx = this.ctx;
    if (!ctx) return;
    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Kitchen Counter Surface
    ctx.fillStyle = '#FFEFE2';
    ctx.fillRect(0, 295, this.width, 85);
    ctx.fillStyle = '#F3D6C3';
    ctx.fillRect(0, 295, this.width, 6);

    // 2. Retro Pastel Oven Body
    const ox = 84;
    const oy = 18;
    const ow = 392;
    const oh = 285;

    // Soft drop shadow
    ctx.fillStyle = 'rgba(130, 82, 96, 0.16)';
    ctx.beginPath();
    ctx.roundRect(ox + 6, oy + 10, ow, oh, 26);
    ctx.fill();

    // Outer pink-cream oven shell
    const bodyGrad = ctx.createLinearGradient(ox, oy, ox, oy + oh);
    bodyGrad.addColorStop(0, '#FFDCE6');
    bodyGrad.addColorStop(0.2, '#FFC4D6');
    bodyGrad.addColorStop(1, '#FFA6C1');
    ctx.fillStyle = bodyGrad;
    ctx.strokeStyle = '#4A3531';
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.roundRect(ox, oy, ow, oh, 24);
    ctx.fill();
    ctx.stroke();

    // Oven feet
    ctx.fillStyle = '#7C5E57';
    ctx.beginPath();
    ctx.roundRect(ox + 26, oy + oh - 3, 28, 12, 5);
    ctx.roundRect(ox + ow - 54, oy + oh - 3, 28, 12, 5);
    ctx.fill();
    ctx.stroke();

    // Top Control Panel Strip
    ctx.fillStyle = '#FFF8F0';
    ctx.beginPath();
    ctx.roundRect(ox + 16, oy + 12, ow - 32, 42, 12);
    ctx.fill();
    ctx.stroke();

    // Indicator light & decorative mini dials on oven top
    const pilotColor = this.bakeState === 'burnt' ? '#FF4D6D'
      : this.bakeState === 'perfect' ? '#52B788'
      : this.ovenRunning ? '#FF9F1C' : '#D8C4B6';
    ctx.fillStyle = pilotColor;
    ctx.beginPath();
    ctx.arc(ox + 42, oy + 33, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Temp readout pill on oven panel
    ctx.fillStyle = '#4A3531';
    ctx.beginPath();
    ctx.roundRect(ox + ow / 2 - 72, oy + 20, 144, 26, 13);
    ctx.fill();
    ctx.fillStyle = this.bakeState === 'perfect' ? '#A8E6CF' : this.bakeState === 'burnt' ? '#FF8FAB' : '#FFE699';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    const statusShort = this.ovenRunning
      ? `${this.selectedTemp}°C • ${this.bakeElapsed.toFixed(1)}s`
      : `${this.selectedTemp}°C • ${this.batterPoured ? 'Sẵn sàng' : 'Chờ bột'}`;
    ctx.fillText(statusShort, ox + ow / 2, oy + 37);

    // Side ventilation slots
    ctx.fillStyle = '#E0809D';
    [0, 1, 2].forEach(i => {
      ctx.beginPath();
      ctx.roundRect(ox + ow - 66 + i * 12, oy + 26, 6, 14, 3);
      ctx.fill();
    });

    // 3. Oven Interior Baking Chamber
    const cx = ox + 28;
    const cy = oy + 66;
    const cw = ow - 56;
    const ch = 198;

    // Chamber dark-warm metallic interior
    const chamGrad = ctx.createLinearGradient(cx, cy, cx, cy + ch);
    chamGrad.addColorStop(0, '#5A4643');
    chamGrad.addColorStop(1, '#3F2F2D');
    ctx.fillStyle = chamGrad;
    ctx.strokeStyle = '#4A3531';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(cx, cy, cw, ch, 14);
    ctx.fill();
    ctx.stroke();

    // Clip inside oven chamber
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(cx + 2, cy + 2, cw - 4, ch - 4, 12);
    ctx.clip();

    // Glowing oven warm light when heating!
    if (this.heatGlow > 0.02) {
      const glow = ctx.createRadialGradient(cx + cw / 2, cy + ch * 0.55, 18, cx + cw / 2, cy + ch * 0.55, 200);
      glow.addColorStop(0, `rgba(255, 198, 92, ${0.72 * this.heatGlow})`);
      glow.addColorStop(0.6, `rgba(255, 125, 45, ${0.42 * this.heatGlow})`);
      glow.addColorStop(1, 'rgba(255, 90, 30, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(cx, cy, cw, ch);
    }

    // Upper & Lower Heating Coils
    const coilColor = this.heatGlow > 0.1
      ? `rgba(255, ${Math.round(180 - this.heatGlow * 80)}, 40, ${0.45 + 0.55 * this.heatGlow})`
      : '#7A6865';
    ctx.strokeStyle = coilColor;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    for (let x = cx + 22; x <= cx + cw - 22; x += 28) {
      ctx.moveTo(x, cy + 12);
      ctx.quadraticCurveTo(x + 14, cy + 22, x + 24, cy + 12);
    }
    ctx.stroke();

    // Wire rack inside oven
    ctx.strokeStyle = '#B8B0AC';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx + 10, cy + ch - 38);
    ctx.lineTo(cx + cw - 10, cy + ch - 38);
    ctx.stroke();

    // Particles inside oven (heat shimmer / smoke / sparkles)
    this._renderParticles(ctx);
    ctx.restore();

    // 4. Open Oven Door Shelf (if doorOpen > 0.15, door swings down toward viewer)
    if (this.doorOpen > 0.15) {
      const shelfDrop = this.doorOpen * 72;
      ctx.save();
      ctx.fillStyle = 'rgba(255, 224, 234, 0.92)';
      ctx.strokeStyle = '#4A3531';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(cx, cy + ch);
      ctx.lineTo(cx - 26 * this.doorOpen, cy + ch + shelfDrop);
      ctx.lineTo(cx + cw + 26 * this.doorOpen, cy + ch + shelfDrop);
      ctx.lineTo(cx + cw, cy + ch);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Open door glass reflection
      ctx.fillStyle = 'rgba(205, 240, 255, 0.45)';
      ctx.beginPath();
      ctx.moveTo(cx + 16, cy + ch + 6);
      ctx.lineTo(cx - 8 * this.doorOpen, cy + ch + shelfDrop - 8);
      ctx.lineTo(cx + cw + 8 * this.doorOpen, cy + ch + shelfDrop - 8);
      ctx.lineTo(cx + cw - 16, cy + ch + 6);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // 5. Baking Tray + Cakes (Slides smoothly between Front Rack (trayIn=0) & Oven Interior (trayIn=1))
    const trayCenterX = 280;
    const trayCenterY = 294 - this.trayIn * 80; // Slides smoothly up into oven rack!
    const trayScale = 1.0 - this.trayIn * 0.08;

    ctx.save();
    ctx.translate(trayCenterX, trayCenterY);
    ctx.scale(trayScale, trayScale);
    if (this.dragHighlight) {
      ctx.shadowColor = '#FF5D8F';
      ctx.shadowBlur = 18;
    }
    this._renderBakingTrayAndCakes(ctx);
    ctx.restore();

    // 6. Batter Pouring Overlay Animation (when player pours batter!)
    if (this.pourAnim > 0) {
      this._renderPouringAnimation(ctx, trayCenterX, trayCenterY - 56);
    }

    // 7. Closed Transparent Glass Oven Door (drawn over tray when doorOpen < 0.85)
    if (this.doorOpen < 0.85) {
      const alpha = 1 - this.doorOpen;
      ctx.save();
      ctx.globalAlpha = alpha;
      // Door frame
      ctx.strokeStyle = '#4A3531';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(cx, cy, cw, ch, 14);
      ctx.stroke();

      // Transparent tinted glass window
      ctx.fillStyle = this.heatGlow > 0.2
        ? 'rgba(255, 240, 215, 0.14)'
        : 'rgba(210, 238, 255, 0.18)';
      ctx.beginPath();
      ctx.roundRect(cx + 6, cy + 6, cw - 12, ch - 12, 10);
      ctx.fill();

      // Diagonal glass gloss reflections
      ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.beginPath();
      ctx.moveTo(cx + 28, cy + 12);
      ctx.lineTo(cx + 68, cy + 12);
      ctx.lineTo(cx + 26, cy + ch - 12);
      ctx.lineTo(cx + 10, cy + ch - 12);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(cx + 82, cy + 12);
      ctx.lineTo(cx + 98, cy + 12);
      ctx.lineTo(cx + 56, cy + ch - 12);
      ctx.lineTo(cx + 42, cy + ch - 12);
      ctx.closePath();
      ctx.fill();

      // Chrome door handle bar at top of door
      ctx.fillStyle = '#FFFDF9';
      ctx.strokeStyle = '#4A3531';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.roundRect(cx + 48, cy + 12, cw - 96, 11, 5.5);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // 8. Visual Status Callout Banner (No emojis, clean vector pill)
    if (this.inOven && this.ovenRunning) {
      if (this.bakeState === 'perfect') {
        this._drawCalloutBadge(ctx, 280, 344, 'BÁNH CHÍN HOÀN HẢO! NHẤN ĐỂ LẤY RA!', '#52B788', '#FFFFFF');
      } else if (this.bakeState === 'burnt') {
        this._drawCalloutBadge(ctx, 280, 344, 'CẢNH BÁO: BÁNH ĐANG BỊ CHÁY!', '#D90429', '#FFFFFF');
      }
    } else if (!this.batterPoured) {
      this._drawCalloutBadge(ctx, 280, 355, 'Kéo tô bột bên trái thả vào khay để đổ bột!', '#FFFDF9', '#4A3531');
    }
  }

  _drawCalloutBadge(ctx, x, y, text, bg, fg) {
    ctx.save();
    ctx.font = 'bold 12px sans-serif';
    const w = Math.min(460, ctx.measureText(text).width + 28);
    ctx.fillStyle = bg;
    ctx.strokeStyle = '#4A3531';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x - w / 2, y - 14, w, 28, 14);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = fg;
    ctx.textAlign = 'center';
    ctx.fillText(text, x, y + 4);
    ctx.restore();
  }

  _renderBakingTrayAndCakes(ctx) {
    // Compute smooth continuous baking progression (0 = raw, 0.35..0.9 = rising, 0.9..1.25 = perfect, >1.25 = burnt)
    const ratio = this.inOven ? (this.bakeElapsed / Math.max(1, this.bakeTargetTime)) : 0;
    const perfectEndRatio = (this.bakeTargetTime + this.perfectWindow) / Math.max(1, this.bakeTargetTime);

    // Smooth rise 0 -> 1
    const rise = this._smoothstep(0.2, 0.92, ratio);
    // Smooth browning 0 -> 1 (golden) -> 2 (burnt)
    let brown = 0;
    if (ratio > 0.25 && ratio <= 1.0) {
      brown = this._smoothstep(0.25, 0.95, ratio);
    } else if (ratio > 1.0 && ratio <= perfectEndRatio) {
      brown = 1.0 + ((ratio - 1.0) / Math.max(0.1, perfectEndRatio - 1.0)) * 0.12;
    } else if (ratio > perfectEndRatio) {
      brown = 1.12 + this._smoothstep(perfectEndRatio, perfectEndRatio + 0.35, ratio) * 0.88;
    }

    let cakeColor = this.batterRawColor;
    let crustColor = this.batterRawColor;
    if (brown <= 1) {
      cakeColor = this._lerpHex(this.batterRawColor, this.batterBakedColor, brown);
      crustColor = this._lerpHex(this.batterRawColor, '#D48C3B', brown * 0.85);
    } else {
      const charT = Math.min(1, brown - 1.05);
      cakeColor = this._lerpHex(this.batterBakedColor, '#33201A', charT);
      crustColor = this._lerpHex('#D48C3B', '#1C110D', charT);
    }

    // Metallic Baking Tray + Parchment Sheet
    ctx.fillStyle = '#D8DEE9';
    ctx.strokeStyle = '#4A3531';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.roundRect(-142, -16, 284, 34, 10);
    ctx.fill();
    ctx.stroke();

    // Inner parchment paper
    ctx.fillStyle = '#FFF9EE';
    ctx.strokeStyle = '#E6D4B8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(-130, -11, 260, 22, 6);
    ctx.fill();
    ctx.stroke();

    const type = this.moldType;
    const cakeCfg = (window.SDData && window.SDData.CAKE_TYPES)
      ? window.SDData.CAKE_TYPES.find(c => c.id === type)
      : null;
    const shape = (cakeCfg && cakeCfg.moldShape) ? cakeCfg.moldShape : type;

    if (shape === 'cupcake' || shape === 'muffin') {
      const isMuffin = shape === 'muffin';
      [-90, -30, 30, 90].forEach(cx => {
        ctx.fillStyle = isMuffin ? '#E2ECE9' : '#FFB3C6';
        ctx.strokeStyle = '#4A3531';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx - 22, -26);
        ctx.lineTo(cx + 22, -26);
        ctx.lineTo(cx + 16, 4);
        ctx.lineTo(cx - 16, 4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = isMuffin ? '#95D5B2' : '#FF8FAB';
        ctx.lineWidth = 1.5;
        [-10, 0, 10].forEach(fx => {
          ctx.beginPath();
          ctx.moveTo(cx + fx, -25);
          ctx.lineTo(cx + fx * 0.75, 3);
          ctx.stroke();
        });

        if (this.batterPoured) {
          const domeHeight = (isMuffin ? 9 : 5) + rise * (isMuffin ? 26 : 22);
          const domeWidth = (isMuffin ? 23 : 20) + rise * 4;
          ctx.fillStyle = cakeColor;
          ctx.strokeStyle = '#4A3531';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(cx - domeWidth, -25);
          ctx.quadraticCurveTo(cx, -25 - domeHeight * 1.45, cx + domeWidth, -25);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          if (isMuffin) {
            ctx.fillStyle = '#4E54C8';
            [[-8, -32], [6, -34], [0, -28 - domeHeight * 0.5]].forEach(([bx, by]) => {
              ctx.beginPath();
              ctx.arc(cx + bx, by, 2.4, 0, Math.PI * 2);
              ctx.fill();
            });
          } else if (brown > 0.4) {
            ctx.strokeStyle = crustColor;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(cx - 6, -28 - domeHeight * 0.55);
            ctx.quadraticCurveTo(cx, -32 - domeHeight * 0.65, cx + 7, -27 - domeHeight * 0.5);
            ctx.stroke();
          }
        }
      });
    } else if (shape === 'donut' || shape === 'donut_filled') {
      const hasHole = shape === 'donut';
      [-90, -30, 30, 90].forEach(cx => {
        ctx.fillStyle = '#E9ECEF';
        ctx.strokeStyle = '#ADB5BD';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(cx, -6, 25, 13, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        if (this.batterPoured) {
          const rx = 20 + rise * 6;
          const ry = 10 + rise * 6;
          const cy = -8 - rise * 4;
          ctx.fillStyle = cakeColor;
          ctx.strokeStyle = '#4A3531';
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.strokeStyle = crustColor;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.ellipse(cx, cy - 2, rx * 0.72, ry * 0.6, 0, Math.PI * 1.1, Math.PI * 1.9);
          ctx.stroke();

          if (hasHole) {
            ctx.fillStyle = '#FFF9EE';
            ctx.strokeStyle = '#4A3531';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.ellipse(cx, cy, 7 - rise * 0.8, 3.8, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          }
        }
      });
    } else if (shape === 'cookie' || shape === 'cookie_heart' || shape === 'cookie_star' || shape === 'cookie_ginger') {
      const slots = shape === 'cookie_ginger'
        ? [[-72, -6], [0, -6], [72, -6]]
        : [[-86, -12], [-18, -14], [52, -12], [-52, 2], [18, 0], [86, 2]];
      slots.forEach(([cx, cy]) => {
        if (this.batterPoured) {
          const rx = 13 + rise * 9;
          const ry = 10 + rise * 2 - rise * 1.5;
          const yPos = cy - (1 - rise) * 6;
          ctx.fillStyle = cakeColor;
          ctx.strokeStyle = brown > 0.5 ? crustColor : '#4A3531';
          ctx.lineWidth = 2.2;

          if (shape === 'cookie_heart') {
            const s = 0.75 + rise * 0.25;
            ctx.save();
            ctx.translate(cx, yPos);
            ctx.scale(s, s * 0.7);
            ctx.beginPath();
            ctx.moveTo(0, 12);
            ctx.bezierCurveTo(-18, 0, -16, -14, -7, -14);
            ctx.bezierCurveTo(-2, -14, 0, -9, 0, -6);
            ctx.bezierCurveTo(0, -9, 2, -14, 7, -14);
            ctx.bezierCurveTo(16, -14, 18, 0, 0, 12);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
          } else if (shape === 'cookie_star') {
            const rad = 11 + rise * 5;
            ctx.beginPath();
            for (let k = 0; k < 10; k++) {
              const a = (k * Math.PI) / 5 - Math.PI / 2;
              const rr = k % 2 === 0 ? rad : rad * 0.48;
              const px = cx + Math.cos(a) * rr;
              const py = yPos + Math.sin(a) * rr * 0.72;
              if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          } else if (shape === 'cookie_ginger') {
            const s = 0.8 + rise * 0.2;
            ctx.save();
            ctx.translate(cx, yPos - 2);
            ctx.scale(s, s * 0.75);
            ctx.beginPath();
            ctx.arc(0, -10, 7, 0, Math.PI * 2);
            ctx.roundRect(-14, -3, 28, 7, 3);
            ctx.roundRect(-7, -3, 14, 18, 4);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
          } else {
            ctx.beginPath();
            ctx.ellipse(cx, yPos, rx, ry, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = this._lerpHex(crustColor, '#4A2511', 0.5);
            [[-5, -2], [4, 1], [-1, 3]].forEach(([dx, dy]) => {
              ctx.beginPath();
              ctx.arc(cx + dx, yPos + dy, 1.8, 0, Math.PI * 2);
              ctx.fill();
            });
          }
        } else {
          ctx.strokeStyle = '#E6CCA3';
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.ellipse(cx, cy, 14, 6, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });
    } else if (shape === 'round_cake' || shape === 'tiered_cake' || shape === 'cheesecake' || shape === 'tiramisu') {
      const pans = shape === 'tiered_cake' ? [[-52, 48], [56, 36]] : [[0, 66]];
      pans.forEach(([cx, r]) => {
        ctx.fillStyle = '#CED4DA';
        ctx.strokeStyle = '#4A3531';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.roundRect(cx - r, -30, r * 2, 32, shape === 'tiramisu' ? 4 : 8);
        ctx.fill();
        ctx.stroke();

        if (this.batterPoured) {
          const riseH = 6 + rise * 22;
          ctx.fillStyle = cakeColor;
          ctx.beginPath();
          if (shape === 'tiramisu') {
            ctx.roundRect(cx - r + 4, -36 - rise * 14, (r - 4) * 2, 18, 4);
          } else {
            ctx.ellipse(cx, -28 - riseH * 0.45, r - 4, 11 + rise * 3, 0, 0, Math.PI * 2);
          }
          ctx.fill();
          ctx.stroke();

          if (brown > 0.35) {
            ctx.strokeStyle = crustColor;
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.ellipse(cx, -28 - riseH * 0.45, r - 12, 7 + rise * 2, 0, 0, Math.PI);
            ctx.stroke();
          }
        }
      });
    } else if (shape === 'croissant' || shape === 'eclair') {
      [-72, 0, 72].forEach(cx => {
        ctx.fillStyle = '#E9ECEF';
        ctx.strokeStyle = '#ADB5BD';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(cx - 28, -14, 56, 18, 8);
        ctx.fill();
        ctx.stroke();
        if (this.batterPoured) {
          const puff = rise * 10;
          ctx.fillStyle = cakeColor;
          ctx.strokeStyle = '#4A3531';
          ctx.lineWidth = 2.2;
          if (shape === 'croissant') {
            ctx.beginPath();
            ctx.moveTo(cx - 24, -4);
            ctx.quadraticCurveTo(cx, -24 - puff, cx + 24, -4);
            ctx.quadraticCurveTo(cx, -10 - puff * 0.4, cx - 24, -4);
            ctx.fill();
            ctx.stroke();
          } else {
            ctx.beginPath();
            ctx.roundRect(cx - 24, -14 - puff * 0.6, 48, 12 + puff * 0.6, 8);
            ctx.fill();
            ctx.stroke();
          }
        }
      });
    } else if (shape === 'pudding') {
      [-74, 0, 74].forEach(cx => {
        // Water bath ramekin cups
        ctx.fillStyle = '#FFFDF9';
        ctx.strokeStyle = '#4A3531';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(cx - 22, -24);
        ctx.lineTo(cx + 22, -24);
        ctx.lineTo(cx + 17, 2);
        ctx.lineTo(cx - 17, 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        if (this.batterPoured) {
          ctx.fillStyle = cakeColor;
          ctx.beginPath();
          ctx.ellipse(cx, -23 - rise * 4, 19, 6 + rise * 2, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
      });
    } else if (shape === 'cream_puff' || shape === 'cake_pop') {
      [-90, -30, 30, 90].forEach(cx => {
        ctx.fillStyle = '#E9ECEF';
        ctx.strokeStyle = '#ADB5BD';
        ctx.beginPath();
        ctx.ellipse(cx, -5, 22, 9, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        if (this.batterPoured) {
          const r = 13 + rise * 7;
          ctx.fillStyle = cakeColor;
          ctx.strokeStyle = '#4A3531';
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.ellipse(cx, -10 - rise * 6, r, r * 0.78, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
      });
    } else {
      // Macaron, Tart, Swiss roll, Parfait base
      const count = shape === 'swiss_roll' ? 1 : (shape === 'tart' || shape === 'parfait') ? 2 : 4;
      const spacing = shape === 'swiss_roll' ? [0] : (shape === 'tart' || shape === 'parfait') ? [-56, 56] : [-90, -30, 30, 90];
      spacing.slice(0, count).forEach(cx => {
        const w = shape === 'swiss_roll' ? 95 : shape === 'tart' ? 42 : 24;
        ctx.fillStyle = '#E9ECEF';
        ctx.strokeStyle = '#4A3531';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(cx, -6, w, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        if (this.batterPoured) {
          ctx.fillStyle = cakeColor;
          ctx.beginPath();
          ctx.ellipse(cx, -10 - rise * 8, w - 4, 10 + rise * 4, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
      });
    }

    // Char marks overlay if burnt
    if (brown > 1.25) {
      ctx.fillStyle = 'rgba(20, 12, 10, 0.45)';
      [[-50, -18], [15, -22], [65, -14]].forEach(([bx, by]) => {
        ctx.beginPath();
        ctx.arc(bx, by, 7, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }

  _renderPouringAnimation(ctx, tx, ty) {
    const t = this.pourAnim;
    const tilt = Math.sin(t * Math.PI) * -0.75;
    ctx.save();
    ctx.translate(tx + 56, ty - 28);
    ctx.rotate(tilt);

    // Batter bowl pouring
    ctx.fillStyle = '#FFB3C6';
    ctx.strokeStyle = '#4A3531';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(0, 0, 28, 0, Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Thick batter stream dropping into tray
    if (t > 0.15 && t < 0.85) {
      ctx.save();
      ctx.strokeStyle = this.batterRawColor;
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(tx + 34, ty - 22);
      ctx.quadraticCurveTo(tx + 8, ty + 8, tx, ty + 48);
      ctx.stroke();
      ctx.restore();
    }
  }

  _renderParticles(ctx) {
    this.particles.forEach(p => {
      const alpha = Math.max(0, 1 - p.life / p.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(p.x, p.y);
      ctx.fillStyle = p.color;
      if (p.kind === 'sparkle') {
        const r = p.size;
        ctx.beginPath();
        ctx.moveTo(0, -r);
        ctx.quadraticCurveTo(0, 0, r, 0);
        ctx.quadraticCurveTo(0, 0, 0, r);
        ctx.quadraticCurveTo(0, 0, -r, 0);
        ctx.quadraticCurveTo(0, 0, 0, -r);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });
  }

  _smoothstep(edge0, edge1, x) {
    const t = Math.max(0, Math.min(1, (x - edge0) / Math.max(0.0001, edge1 - edge0)));
    return t * t * (3 - 2 * t);
  }

  _lerpHex(hexA, hexB, t) {
    const a = parseInt(hexA.replace('#', ''), 16);
    const b = parseInt(hexB.replace('#', ''), 16);
    if (isNaN(a) || isNaN(b)) return hexA;
    const ar = (a >> 16) & 255, ag = (a >> 8) & 255, ab = a & 255;
    const br = (b >> 16) & 255, bg = (b >> 8) & 255, bb = b & 255;
    const rr = Math.round(ar + (br - ar) * t);
    const rg = Math.round(ag + (bg - ag) * t);
    const rb = Math.round(ab + (bb - ab) * t);
    return `rgb(${rr},${rg},${rb})`;
  }
};

// ============================================================================
// Left-Panel 2D Canvas Painters: Mold Cards, Draggable Batter Bowl, Temp Knob
// ============================================================================
window.SDOvenUI = (() => {
  function drawMoldIcon(canvas, cakeTypeId) {
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = 96;
    canvas.height = 72;
    ctx.clearRect(0, 0, 96, 72);

    const cakeCfg = (window.SDData && window.SDData.CAKE_TYPES)
      ? window.SDData.CAKE_TYPES.find(c => c.id === cakeTypeId)
      : null;
    const shape = (cakeCfg && cakeCfg.moldShape) ? cakeCfg.moldShape : cakeTypeId;

    ctx.save();
    ctx.strokeStyle = '#4A3531';
    ctx.lineWidth = 2.2;

    if (shape === 'cupcake' || shape === 'muffin') {
      ctx.fillStyle = '#DEE2E6';
      ctx.beginPath();
      ctx.roundRect(10, 26, 76, 30, 8);
      ctx.fill();
      ctx.stroke();
      [25, 48, 71].forEach((x, idx) => {
        ctx.fillStyle = shape === 'muffin' ? '#D8F3DC' : (idx === 1 ? '#FFB3C6' : '#FFF0F5');
        ctx.beginPath();
        ctx.moveTo(x - 10, 22);
        ctx.lineTo(x + 10, 22);
        ctx.lineTo(x + 7, 42);
        ctx.lineTo(x - 7, 42);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });
    } else if (shape === 'donut' || shape === 'donut_filled') {
      ctx.fillStyle = '#CED4DA';
      ctx.beginPath();
      ctx.roundRect(10, 14, 76, 44, 10);
      ctx.fill();
      ctx.stroke();
      [[32, 36], [64, 36]].forEach(([x, y]) => {
        ctx.fillStyle = '#FFF8F0';
        ctx.beginPath();
        ctx.arc(x, y, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        if (shape === 'donut') {
          ctx.fillStyle = '#ADB5BD';
          ctx.beginPath();
          ctx.arc(x, y, 4.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
      });
    } else if (shape === 'round_cake' || shape === 'tiered_cake' || shape === 'cheesecake') {
      const pans = shape === 'tiered_cake' ? [[34, 22], [66, 16]] : [[48, 26]];
      pans.forEach(([x, r]) => {
        ctx.fillStyle = '#CED4DA';
        ctx.beginPath();
        ctx.ellipse(x, 42, r, r * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#FFFDF9';
        ctx.beginPath();
        ctx.ellipse(x, 34, r - 3, (r - 3) * 0.42, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });
    } else if (shape === 'cookie' || shape === 'cookie_heart' || shape === 'cookie_star' || shape === 'cookie_ginger') {
      ctx.fillStyle = '#CED4DA';
      ctx.beginPath();
      ctx.roundRect(10, 14, 76, 44, 6);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#FFF8EB';
      ctx.fillRect(16, 19, 64, 34);
      [[32, 31], [62, 31], [47, 41]].forEach(([x, y]) => {
        ctx.fillStyle = shape === 'cookie_heart' ? '#FFB3C6' : shape === 'cookie_star' ? '#FFE699' : '#F3C677';
        ctx.beginPath();
        ctx.arc(x, y, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });
    } else if (shape === 'pudding' || shape === 'parfait') {
      ctx.fillStyle = '#E5D4FF';
      ctx.beginPath();
      ctx.roundRect(12, 18, 72, 36, 8);
      ctx.fill();
      ctx.stroke();
      [30, 48, 66].forEach(x => {
        ctx.fillStyle = '#FFFDF9';
        ctx.beginPath();
        ctx.arc(x, 36, 7.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });
    } else {
      ctx.fillStyle = '#D8F3DC';
      ctx.beginPath();
      ctx.roundRect(12, 16, 72, 40, 8);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#FFFDF9';
      ctx.beginPath();
      ctx.roundRect(20, 22, 56, 28, 6);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawBatterSourceBowl(canvas, batterColor = '#FFE9A8', poured = false) {
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = 110;
    canvas.height = 84;
    ctx.clearRect(0, 0, 110, 84);

    ctx.save();
    ctx.strokeStyle = '#4A3531';
    ctx.lineWidth = 2.4;

    // Bowl interior
    ctx.fillStyle = '#FFF5F8';
    ctx.beginPath();
    ctx.ellipse(55, 28, 38, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Mixed batter inside
    if (!poured) {
      ctx.fillStyle = batterColor;
      ctx.beginPath();
      ctx.ellipse(55, 29, 32, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      // Ladle handle sticking out
      ctx.fillStyle = '#D4A373';
      ctx.beginPath();
      ctx.roundRect(62, 6, 8, 22, 4);
      ctx.fill();
      ctx.stroke();
    }

    // Bowl outer pink ceramic body
    ctx.fillStyle = '#FFB3C6';
    ctx.beginPath();
    ctx.moveTo(17, 28);
    ctx.bezierCurveTo(20, 68, 90, 68, 93, 28);
    ctx.ellipse(55, 28, 38, 13, 0, 0, Math.PI, false);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function drawTempKnob(canvas, currentTemp) {
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = 136;
    const h = 136;
    canvas.width = w;
    canvas.height = h;
    ctx.clearRect(0, 0, w, h);

    const cx = 68;
    const cy = 68;
    const temps = [160, 170, 180, 190, 200];
    const startAng = Math.PI * 0.78;
    const endAng = Math.PI * 2.22;

    // Draw tick marks & labels
    temps.forEach((t, i) => {
      const ratio = i / (temps.length - 1);
      const ang = startAng + ratio * (endAng - startAng);
      const tx = cx + Math.cos(ang) * 53;
      const ty = cy + Math.sin(ang) * 53;
      const active = Number(currentTemp) === t;

      ctx.fillStyle = active ? '#FF4D6D' : '#7C5E57';
      ctx.font = active ? 'bold 12px sans-serif' : 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${t}°`, tx, ty);
    });

    // Rotary Knob Body
    const idx = Math.max(0, temps.indexOf(Number(currentTemp)));
    const knobAng = startAng + (idx / (temps.length - 1)) * (endAng - startAng);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = '#FFFDF9';
    ctx.strokeStyle = '#4A3531';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 32, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Inner pastel dial face
    ctx.fillStyle = '#FFE5EC';
    ctx.beginPath();
    ctx.arc(0, 0, 25, 0, Math.PI * 2);
    ctx.fill();

    // Pointer indicator rotated to selected temperature
    ctx.rotate(knobAng);
    ctx.fillStyle = '#FF4D6D';
    ctx.beginPath();
    ctx.roundRect(6, -3.5, 22, 7, 3.5);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  return { drawMoldIcon, drawBatterSourceBowl, drawTempKnob };
})();

