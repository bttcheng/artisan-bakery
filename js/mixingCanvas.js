// ============================================================================
// SWEET DREAMS - TIỆM BÁNH NGỌT
// MixingCanvasController: Realistic 2D Canvas Ingredient & Whisking Physics
// ============================================================================

window.MixingCanvasController = class MixingCanvasController {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.width = 340;
    this.height = 240;

    // Live state synced from BakingManager
    this.addedIngredients = [];
    this.mixProgress = 0; // 0..120
    this.batterColor = '#FFE9A8';
    this.mixerLevel = 1;

    // Physics & Animation state
    this.actions = [];    // Active pour/crack/drop animations
    this.particles = [];  // Dust, crystals, droplets, completion stars
    this.isMixing = false;
    this.spinSpeed = 0;   // rad/s with inertia
    this.whiskAngle = 0;
    this.swirlAngle = 0;
    this.bowlShake = 0;
    this.completionSparkled = false;

    this._setupDPI();
  }

  _setupDPI() {
    if (!this.canvas || !this.ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  syncState({ addedIngredients, mixProgress, batterColor, mixerLevel }) {
    this.addedIngredients = addedIngredients || [];
    this.mixProgress = mixProgress || 0;
    if (batterColor) this.batterColor = batterColor;
    if (mixerLevel) this.mixerLevel = mixerLevel;

    if (this.mixProgress >= 60 && this.mixProgress <= 98 && !this.completionSparkled) {
      this.completionSparkled = true;
      this._spawnCompletionStars();
    } else if (this.mixProgress < 50) {
      this.completionSparkled = false;
    }
  }

  reset() {
    this.addedIngredients = [];
    this.mixProgress = 0;
    this.actions = [];
    this.particles = [];
    this.isMixing = false;
    this.spinSpeed = 0;
    this.whiskAngle = 0;
    this.swirlAngle = 0;
    this.bowlShake = 0;
    this.completionSparkled = false;
  }

  setMixing(active) {
    this.isMixing = !!active;
  }

  pulseMix() {
    this.spinSpeed = Math.max(this.spinSpeed, 9.5);
  }

  triggerAddAnimation(ingredientId) {
    const duration = ingredientId === 'egg' ? 0.95 : ingredientId === 'butter' ? 0.8 : 0.88;
    this.actions.push({
      id: ingredientId,
      elapsed: 0,
      duration,
      landed: false,
      cracked: false
    });
  }

  _spawnParticles(kind, x, y, count, color) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        kind,
        x: x + (Math.random() - 0.5) * 26,
        y: y + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * (kind === 'dust' ? 48 : 65),
        vy: kind === 'dust' ? -15 - Math.random() * 25 : 40 + Math.random() * 80,
        size: kind === 'dust' ? 3 + Math.random() * 5 : 2 + Math.random() * 3.5,
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 8,
        life: 0,
        maxLife: 0.45 + Math.random() * 0.45,
        color
      });
    }
  }

  _spawnCompletionStars() {
    for (let i = 0; i < 14; i++) {
      const ang = (i / 14) * Math.PI * 2;
      this.particles.push({
        kind: 'star',
        x: 170 + Math.cos(ang) * 45,
        y: 135 + Math.sin(ang) * 22,
        vx: Math.cos(ang) * 55,
        vy: Math.sin(ang) * 32 - 30,
        size: 5 + Math.random() * 4,
        rot: 0,
        vrot: 4,
        life: 0,
        maxLife: 0.85,
        color: i % 2 === 0 ? '#FFD166' : '#FF8FAB'
      });
    }
  }

  update(dt) {
    if (!this.ctx) return;

    // Smooth inertia for whisk speed
    const targetSpeed = this.isMixing ? (11 + this.mixerLevel * 2.2) : 0;
    const accel = this.isMixing ? 9.0 : 4.2; // Slower deceleration for natural inertia
    this.spinSpeed += (targetSpeed - this.spinSpeed) * Math.min(1, dt * accel);
    if (this.spinSpeed < 0.05 && !this.isMixing) this.spinSpeed = 0;

    if (this.spinSpeed > 0) {
      this.whiskAngle += this.spinSpeed * dt;
      this.swirlAngle += this.spinSpeed * 0.45 * dt;
    }

    if (this.bowlShake > 0) {
      this.bowlShake = Math.max(0, this.bowlShake - dt * 3.5);
    }

    // Update active pour/crack/drop animations
    for (let i = this.actions.length - 1; i >= 0; i--) {
      const a = this.actions[i];
      a.elapsed += dt;
      const t = Math.min(1, a.elapsed / a.duration);

      // Spawn continuous stream particles during pour window
      if (t > 0.22 && t < 0.72) {
        if (a.id === 'flour' && Math.random() < 0.55) {
          this._spawnParticles('dust', 170, 148, 2, 'rgba(255,252,245,0.85)');
        } else if (a.id === 'cacao' && Math.random() < 0.55) {
          this._spawnParticles('dust', 170, 148, 2, 'rgba(139,90,43,0.75)');
        } else if (a.id === 'matcha' && Math.random() < 0.55) {
          this._spawnParticles('dust', 170, 148, 2, 'rgba(116,198,157,0.75)');
        } else if (a.id === 'sugar' && Math.random() < 0.8) {
          this._spawnParticles('crystal', 170, 72, 2, '#FFFFFF');
        } else if (a.id === 'milk' && Math.random() < 0.45) {
          this._spawnParticles('drop', 170, 146, 1, '#FFFFFF');
        } else if (a.id === 'vanilla' && Math.random() < 0.35) {
          this._spawnParticles('drop', 170, 146, 1, '#D48C2E');
        }
      }

      if (a.id === 'butter' && !a.landed && t >= 0.45) {
        a.landed = true;
        this.bowlShake = 0.5;
        this._spawnParticles('dust', 170, 148, 5, 'rgba(255,240,153,0.75)');
      }

      if (a.elapsed >= a.duration) {
        this.actions.splice(i, 1);
      }
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.vrot * dt;
      if (p.kind === 'crystal' || p.kind === 'drop') {
        p.vy += 220 * dt;
      }
      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
      }
    }

    this.render();
  }

  render() {
    const ctx = this.ctx;
    if (!ctx) return;
    ctx.clearRect(0, 0, this.width, this.height);

    const shakeX = this.bowlShake > 0 ? Math.sin(this.bowlShake * 35) * this.bowlShake * 4 : 0;
    const cx = 170 + shakeX;
    const cy = 152;

    // 1. Soft Table Shadow
    ctx.save();
    ctx.fillStyle = 'rgba(140, 95, 105, 0.14)';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 62, 102, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Optimal mixing glow halo
    if (this.mixProgress >= 60 && this.mixProgress <= 98) {
      const grad = ctx.createRadialGradient(cx, cy - 10, 20, cx, cy - 10, 130);
      grad.addColorStop(0, 'rgba(255, 224, 130, 0.45)');
      grad.addColorStop(1, 'rgba(255, 224, 130, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy - 10, 130, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Bowl Back Rim & Interior
    ctx.fillStyle = '#FFF5F8';
    ctx.strokeStyle = '#4A3531';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(cx, cy - 26, 114, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Inner depth shading
    ctx.fillStyle = '#F7E3EA';
    ctx.beginPath();
    ctx.ellipse(cx, cy - 22, 104, 24, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3. Clipped Interior Contents (Batter + Settled Ingredients + Swirls)
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy - 22, 104, 24, 0, Math.PI, Math.PI * 2);
    ctx.lineTo(cx + 104, cy + 28);
    ctx.ellipse(cx, cy + 12, 85, 34, 0, 0, Math.PI);
    ctx.closePath();
    ctx.clip();

    this._renderBowlContents(ctx, cx, cy);
    ctx.restore();

    // 4. Whisk / Electric Mixer Tool (inside bowl opening, before front lip)
    if (this.addedIngredients.length > 0 || this.spinSpeed > 0.1) {
      this._renderWhisk(ctx, cx, cy - 28);
    }

    // 5. Bowl Front Body
    const bodyGrad = ctx.createLinearGradient(cx, cy - 24, cx, cy + 58);
    bodyGrad.addColorStop(0, '#FFFFFF');
    bodyGrad.addColorStop(0.55, '#FFD6E2');
    bodyGrad.addColorStop(1, '#FFB3C6');
    ctx.fillStyle = bodyGrad;
    ctx.strokeStyle = '#4A3531';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - 114, cy - 26);
    ctx.bezierCurveTo(cx - 110, cy + 48, cx - 55, cy + 60, cx, cy + 60);
    ctx.bezierCurveTo(cx + 55, cy + 60, cx + 110, cy + 48, cx + 114, cy - 26);
    ctx.ellipse(cx, cy - 26, 114, 30, 0, 0, Math.PI, false);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Cute pastel stripe & heart emblem on front of bowl
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(cx, cy - 26, 110, 27, 0, 0.12, Math.PI - 0.12);
    ctx.stroke();

    // Mini vector heart on bowl front
    ctx.fillStyle = '#FF5D8F';
    ctx.beginPath();
    const hy = cy + 24;
    ctx.moveTo(cx, hy + 8);
    ctx.bezierCurveTo(cx - 12, hy, cx - 10, hy - 10, cx, hy - 4);
    ctx.bezierCurveTo(cx + 10, hy - 10, cx + 12, hy, cx, hy + 8);
    ctx.fill();

    // 6. Active Pour / Crack / Drop Animations (above bowl)
    this.actions.forEach(a => this._renderAction(ctx, a, cx, cy));

    // 7. Particles (Dust, Sugar Crystals, Milk Drops, Stars)
    this._renderParticles(ctx);

    ctx.restore();
  }

  _renderBowlContents(ctx, cx, cy) {
    const count = this.addedIngredients.length;
    if (count === 0) return;

    const blend = Math.min(1, this.mixProgress / 65);
    const overMixed = this.mixProgress > 98;

    // Base blended batter pool (grows & intensifies with blend)
    const liquidLevel = Math.min(1, count / 5);
    const batterY = cy - 4 - liquidLevel * 10;

    if (blend > 0.05 || this.addedIngredients.includes('milk') || this.addedIngredients.includes('egg')) {
      ctx.save();
      ctx.globalAlpha = Math.max(0.45, blend);
      ctx.fillStyle = overMixed ? this._shadeColor(this.batterColor, -18) : this.batterColor;
      ctx.beginPath();
      ctx.ellipse(cx, batterY + 10, 98, 22 + liquidLevel * 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Glossy batter sheen
      ctx.fillStyle = 'rgba(255,255,255,0.32)';
      ctx.beginPath();
      ctx.ellipse(cx - 26, batterY + 4, 28, 6, -0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Swirl vortex ribbons when mixing
    if (blend > 0.08) {
      ctx.save();
      ctx.translate(cx, batterY + 10);
      ctx.rotate(this.swirlAngle);
      ctx.strokeStyle = blend > 0.85 ? 'rgba(255,255,255,0.48)' : 'rgba(255,248,225,0.65)';
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      for (let i = 0; i < 3; i++) {
        ctx.rotate((Math.PI * 2) / 3);
        ctx.beginPath();
        ctx.arc(14, 0, 22 + i * 7, 0.2, 1.9);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Individual settled ingredients (dissolve smoothly as blend -> 1)
    const rawAlpha = Math.max(0, 1 - blend * 1.15);
    if (rawAlpha > 0.02) {
      ctx.save();
      ctx.globalAlpha = rawAlpha;
      const orbit = this.swirlAngle * 0.85;

      this.addedIngredients.forEach((id) => {
        ctx.save();
        ctx.translate(cx, cy - 12);
        // Ingredients gently swirl inward as mix progresses
        const pull = 1 - blend * 0.55;
        ctx.rotate(orbit * blend * 1.5);
        ctx.scale(pull, pull);
        this._drawSettledIngredient(ctx, id);
        ctx.restore();
      });
      ctx.restore();
    }

    // Over-mixed tiny air bubbles
    if (overMixed) {
      ctx.fillStyle = 'rgba(90, 60, 50, 0.22)';
      [-45, -18, 12, 42, -5, 28].forEach((ox, idx) => {
        ctx.beginPath();
        ctx.arc(cx + ox, batterY + 8 + (idx % 3) * 4, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }

  _drawSettledIngredient(ctx, id) {
    if (id === 'flour') {
      // Soft white flour mound at left
      ctx.fillStyle = '#FFFDF9';
      ctx.strokeStyle = '#E8DCC8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-66, 8);
      ctx.quadraticCurveTo(-40, -14, -14, 8);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (id === 'sugar') {
      // Sparkling sugar mound at right
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(16, 10);
      ctx.quadraticCurveTo(44, -10, 68, 10);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#FFD6E7';
      [28, 40, 52, 36, 48].forEach((x, i) => {
        ctx.fillRect(x, 2 + (i % 2) * 4, 2.5, 2.5);
      });
    } else if (id === 'milk') {
      // Creamy milk pool
      ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
      ctx.beginPath();
      ctx.ellipse(0, 10, 80, 15, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (id === 'egg') {
      // Translucent egg white + golden yolk in center
      ctx.fillStyle = 'rgba(255, 252, 240, 0.85)';
      ctx.beginPath();
      ctx.ellipse(0, 4, 26, 12, 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFB703';
      ctx.strokeStyle = '#E08E00';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 2, 10.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.65)';
      ctx.beginPath();
      ctx.arc(-3.5, -1.5, 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (id === 'butter') {
      // Golden butter cube at front-left
      ctx.fillStyle = '#FFE66D';
      ctx.strokeStyle = '#D4A017';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.roundRect(-34, -4, 22, 15, 4);
      ctx.fill();
      ctx.stroke();
    } else if (id === 'vanilla') {
      ctx.fillStyle = 'rgba(212, 140, 46, 0.75)';
      ctx.beginPath();
      ctx.ellipse(20, 8, 16, 6, -0.2, 0, Math.PI * 2);
      ctx.fill();
    } else if (id === 'chocolate') {
      ctx.fillStyle = '#5C3422';
      [[-24, 6], [-6, 10], [16, 7], [30, 3]].forEach(([x, y]) => {
        ctx.beginPath();
        ctx.roundRect(x, y, 11, 8, 2);
        ctx.fill();
      });
    } else if (id === 'cacao') {
      ctx.fillStyle = '#8B5A2B';
      ctx.beginPath();
      ctx.moveTo(-22, 10);
      ctx.quadraticCurveTo(0, -10, 24, 10);
      ctx.closePath();
      ctx.fill();
    } else if (id === 'matcha') {
      ctx.fillStyle = '#74C69D';
      ctx.beginPath();
      ctx.moveTo(-22, 10);
      ctx.quadraticCurveTo(0, -10, 24, 10);
      ctx.closePath();
      ctx.fill();
    } else if (id === 'strawberry') {
      [[-46, 2], [28, 0], [-14, 10]].forEach(([x, y]) => {
        this._drawStrawberrySlice(ctx, x, y, 0.9);
      });
    } else if (id === 'blueberry') {
      [[34, 4], [46, 8], [24, 9], [40, 12]].forEach(([x, y]) => {
        ctx.fillStyle = '#5E60CE';
        ctx.beginPath();
        ctx.arc(x, y, 5.5, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }

  _drawStrawberrySlice(ctx, x, y, scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = '#FF4D6D';
    ctx.strokeStyle = '#A4133C';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, 7);
    ctx.bezierCurveTo(-9, 1, -8, -7, 0, -4);
    ctx.bezierCurveTo(8, -7, 9, 1, 0, 7);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#FFCCD5';
    ctx.beginPath();
    ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  _renderWhisk(ctx, cx, cy) {
    const orbitX = Math.cos(this.whiskAngle) * (this.spinSpeed > 0.2 ? 32 : 8);
    const orbitY = Math.sin(this.whiskAngle) * (this.spinSpeed > 0.2 ? 7 : 2);
    const tilt = Math.cos(this.whiskAngle) * (this.spinSpeed > 0.2 ? 0.22 : 0.08);

    ctx.save();
    ctx.translate(cx + orbitX, cy + orbitY);
    ctx.rotate(tilt);

    if (this.mixerLevel >= 2) {
      // Pastel Electric Mixer Beaters
      ctx.fillStyle = this.mixerLevel >= 3 ? '#D8BBFF' : '#FFB3C6';
      ctx.strokeStyle = '#4A3531';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.roundRect(-22, -78, 44, 24, 10);
      ctx.fill();
      ctx.stroke();

      // Dual metal beaters
      [-10, 10].forEach(bx => {
        ctx.strokeStyle = '#8D99AE';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(bx, -54);
        ctx.lineTo(bx, -8);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(bx, 4, 7, 14, 0, 0, Math.PI * 2);
        ctx.stroke();
      });
    } else {
      // Classic Stainless Whisk with Pastel Pink Handle
      ctx.fillStyle = '#FF8FAB';
      ctx.strokeStyle = '#4A3531';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.roundRect(-7, -76, 14, 34, 7);
      ctx.fill();
      ctx.stroke();

      // Wire loops
      ctx.strokeStyle = '#6C757D';
      ctx.lineWidth = 2;
      [-10, -4, 4, 10].forEach(wx => {
        ctx.beginPath();
        ctx.moveTo(0, -42);
        ctx.bezierCurveTo(wx * 1.6, -24, wx * 1.4, 14, 0, 16);
        ctx.stroke();
      });
    }
    ctx.restore();
  }

  _renderAction(ctx, a, cx, cy) {
    const t = Math.min(1, a.elapsed / a.duration);

    if (a.id === 'egg') {
      // Egg drops in, cracks at t=0.35, shells split, yolk+white drop!
      const enterT = Math.min(1, t / 0.35);
      const eggY = 24 + Math.sin(enterT * Math.PI * 0.5) * 32;
      if (t < 0.36) {
        ctx.save();
        ctx.translate(cx, eggY);
        ctx.fillStyle = '#FFE5B4';
        ctx.strokeStyle = '#4A3531';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.ellipse(0, 0, 16, 21, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        if (t > 0.24) {
          // Crack line
          ctx.beginPath();
          ctx.moveTo(-12, -2);
          ctx.lineTo(-3, 3);
          ctx.lineTo(4, -3);
          ctx.lineTo(13, 2);
          ctx.stroke();
        }
        ctx.restore();
      } else {
        const splitT = (t - 0.36) / 0.64;
        const alpha = Math.max(0, 1 - splitT * 1.3);
        // Two separating shell halves
        [-1, 1].forEach(dir => {
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.translate(cx + dir * splitT * 36, 56 - splitT * 18);
          ctx.rotate(dir * splitT * 0.9);
          ctx.fillStyle = '#FFE5B4';
          ctx.strokeStyle = '#4A3531';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, 15, dir < 0 ? Math.PI * 0.5 : -Math.PI * 0.5, dir < 0 ? Math.PI * 1.5 : Math.PI * 0.5);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        });
        // Falling yolk & white into bowl
        const dropY = 62 + Math.min(1, splitT * 1.35) * 78;
        if (splitT < 0.85) {
          ctx.save();
          ctx.fillStyle = 'rgba(255,252,240,0.9)';
          ctx.beginPath();
          ctx.ellipse(cx, dropY + 4, 15, 9, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FFB703';
          ctx.beginPath();
          ctx.arc(cx, dropY, 8.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
      return;
    }

    if (a.id === 'butter') {
      // Butter cube drops & bounces
      const fallT = Math.min(1, t / 0.45);
      let by = 18 + fallT * fallT * 116;
      let sx = 1, sy = 1;
      if (t > 0.45) {
        const bt = (t - 0.45) / 0.55;
        const bounce = Math.abs(Math.sin(bt * Math.PI * 2.5)) * Math.exp(-bt * 3.5) * 26;
        by = 134 - bounce;
        sx = bounce < 4 ? 1.15 : 0.96;
        sy = bounce < 4 ? 0.85 : 1.04;
      }
      ctx.save();
      ctx.translate(cx, by);
      ctx.scale(sx, sy);
      ctx.fillStyle = '#FFE66D';
      ctx.strokeStyle = '#4A3531';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-14, -10, 28, 20, 4);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      return;
    }

    if (a.id === 'strawberry' || a.id === 'blueberry' || a.id === 'chocolate') {
      // Multiple tumbling pieces dropping into bowl
      const pieces = a.id === 'blueberry' ? 5 : 4;
      for (let i = 0; i < pieces; i++) {
        const pt = Math.max(0, Math.min(1, (t - i * 0.1) / 0.65));
        if (pt <= 0 || pt >= 1) continue;
        const px = cx + (i - 1.5) * 18;
        const py = 18 + pt * pt * 124;
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(pt * 4 + i);
        if (a.id === 'strawberry') {
          this._drawStrawberrySlice(ctx, 0, 0, 1.1);
        } else if (a.id === 'blueberry') {
          ctx.fillStyle = '#5E60CE';
          ctx.strokeStyle = '#3A0CA3';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(0, 0, 6.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        } else {
          ctx.fillStyle = '#5C3422';
          ctx.strokeStyle = '#2B1408';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(-7, -5, 14, 10, 2);
          ctx.fill();
          ctx.stroke();
        }
        ctx.restore();
      }
      return;
    }

    // Pouring containers: flour, sugar, milk, vanilla, cacao, matcha
    const tiltProgress = t < 0.2 ? t / 0.2 : t > 0.78 ? (1 - t) / 0.22 : 1;
    const tiltAngle = -0.88 * tiltProgress;
    const containerX = cx + 66;
    const containerY = 46;

    // Pouring stream
    if (t > 0.18 && t < 0.78) {
      const streamColor = a.id === 'milk' ? '#FFFFFF'
        : a.id === 'vanilla' ? '#D48C2E'
        : a.id === 'cacao' ? '#8B5A2B'
        : a.id === 'matcha' ? '#74C69D'
        : '#FFFDF7';

      ctx.save();
      ctx.strokeStyle = streamColor;
      ctx.lineWidth = a.id === 'vanilla' ? 4 : 8;
      ctx.lineCap = 'round';
      ctx.setLineDash(a.id === 'sugar' ? [4, 5] : []);
      ctx.beginPath();
      ctx.moveTo(cx + 34, 58);
      ctx.quadraticCurveTo(cx + 6, 90, cx, 138);
      ctx.stroke();
      ctx.restore();
    }

    // Container graphic
    ctx.save();
    ctx.translate(containerX, containerY);
    ctx.rotate(tiltAngle);
    ctx.strokeStyle = '#4A3531';
    ctx.lineWidth = 2.2;
    if (a.id === 'milk') {
      ctx.fillStyle = '#F0F8FF';
      ctx.beginPath();
      ctx.roundRect(-16, -24, 32, 42, 4);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#99D6FF';
      ctx.fillRect(-14, -8, 28, 14);
    } else if (a.id === 'vanilla') {
      ctx.fillStyle = '#D48C2E';
      ctx.beginPath();
      ctx.roundRect(-11, -14, 22, 32, 5);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#FFF3B0';
      ctx.fillRect(-5, -24, 10, 10);
      ctx.strokeRect(-5, -24, 10, 10);
    } else {
      // Bag or tin for flour, sugar, cacao, matcha
      ctx.fillStyle = a.id === 'flour' ? '#FFF5E1' : a.id === 'sugar' ? '#FFE5EC' : a.id === 'cacao' ? '#8B5A2B' : '#74C69D';
      ctx.beginPath();
      ctx.roundRect(-18, -22, 36, 40, 6);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.65)';
      ctx.fillRect(-13, -6, 26, 10);
    }
    ctx.restore();
  }

  _renderParticles(ctx) {
    this.particles.forEach(p => {
      const alpha = Math.max(0, 1 - p.life / p.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.kind === 'star') {
        // Crisp 4-point vector sparkle
        ctx.beginPath();
        const r = p.size;
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

  _shadeColor(hex, amt) {
    const num = parseInt(hex.replace('#', ''), 16);
    if (isNaN(num)) return hex;
    const r = Math.max(0, Math.min(255, (num >> 16) + amt));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amt));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
    return `rgb(${r},${g},${b})`;
  }
};

// ============================================================================
// Canvas 2D Ingredient Icon Painter (Crisp Pastel Cartoon Icons)
// ============================================================================
window.SDCanvasIcons = (() => {
  function drawIcon(canvas, id) {
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = 96;
    const h = 96;
    if (canvas.width !== w) canvas.width = w;
    if (canvas.height !== h) canvas.height = h;
    ctx.clearRect(0, 0, w, h);

    // Soft pastel shadow base
    ctx.save();
    ctx.fillStyle = 'rgba(130, 88, 96, 0.14)';
    ctx.beginPath();
    ctx.ellipse(48, 83, 28, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    switch (id) {
      case 'flour': drawFlour(ctx); break;
      case 'sugar': drawSugar(ctx); break;
      case 'egg': drawEgg(ctx); break;
      case 'milk': drawMilk(ctx); break;
      case 'butter': drawButter(ctx); break;
      case 'vanilla': drawVanilla(ctx); break;
      case 'chocolate': drawChocolate(ctx); break;
      case 'cacao': drawCacao(ctx); break;
      case 'strawberry': drawStrawberry(ctx); break;
      case 'blueberry': drawBlueberry(ctx); break;
      case 'matcha': drawMatcha(ctx); break;
      default: drawFlour(ctx);
    }
    ctx.restore();
  }

  function drawFlour(ctx) {
    // Fluffy white flour mound peeking out of open rolled craft bag
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#E5D5C3';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(26, 32);
    ctx.quadraticCurveTo(36, 14, 48, 16);
    ctx.quadraticCurveTo(60, 14, 70, 32);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Wooden scoop stuck into the flour mound
    ctx.save();
    ctx.translate(60, 22);
    ctx.rotate(0.5);
    ctx.fillStyle = '#D4A373';
    ctx.strokeStyle = '#4A3531';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-3, -12, 6, 16, 3);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Open craft-cream flour bag body with soft shading
    const grad = ctx.createLinearGradient(22, 30, 74, 80);
    grad.addColorStop(0, '#FFF6E6');
    grad.addColorStop(1, '#F3DFC1');
    ctx.fillStyle = grad;
    ctx.strokeStyle = '#4A3531';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(24, 30);
    ctx.lineTo(72, 30);
    ctx.quadraticCurveTo(78, 58, 73, 77);
    ctx.quadraticCurveTo(48, 83, 23, 77);
    ctx.quadraticCurveTo(18, 58, 24, 30);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Rolled top collar cuff
    ctx.fillStyle = '#FFE8C8';
    ctx.beginPath();
    ctx.roundRect(21, 27, 54, 10, 5);
    ctx.fill();
    ctx.stroke();

    // Pastel peach medallion + golden wheat stalk emblem
    ctx.fillStyle = '#FFD6A5';
    ctx.beginPath();
    ctx.arc(48, 56, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#E6A756';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // Wheat stalk
    ctx.strokeStyle = '#9C6644';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(48, 66);
    ctx.lineTo(48, 46);
    ctx.stroke();
    ctx.fillStyle = '#E6A756';
    [[-4, -2], [4, -2], [-4, 4], [4, 4], [0, -7]].forEach(([dx, dy]) => {
      ctx.beginPath();
      ctx.ellipse(48 + dx, 55 + dy, 3.2, 2, dx < 0 ? -0.5 : dx > 0 ? 0.5 : 0, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawSugar(ctx) {
    // Silver spoon sticking out from sugar jar
    ctx.save();
    ctx.translate(62, 22);
    ctx.rotate(0.45);
    ctx.fillStyle = '#E2ECE9';
    ctx.strokeStyle = '#4A3531';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-2.5, -12, 5, 18, 2.5);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Pastel glass jar body
    const glassGrad = ctx.createLinearGradient(24, 28, 72, 78);
    glassGrad.addColorStop(0, '#FFFFFF');
    glassGrad.addColorStop(1, '#FFE8F0');
    ctx.fillStyle = glassGrad;
    ctx.strokeStyle = '#4A3531';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.roundRect(25, 30, 46, 48, 12);
    ctx.fill();
    ctx.stroke();

    // Sparkling sugar mound inside jar
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(28, 50);
    ctx.quadraticCurveTo(48, 36, 68, 50);
    ctx.lineTo(68, 74);
    ctx.quadraticCurveTo(48, 78, 28, 74);
    ctx.closePath();
    ctx.fill();

    // Sparkling sugar crystals
    ctx.fillStyle = '#FF9EBB';
    [[37, 56], [56, 54], [46, 65], [60, 66], [35, 67]].forEach(([x, y]) => {
      ctx.beginPath();
      ctx.moveTo(x, y - 3);
      ctx.lineTo(x + 2.5, y);
      ctx.lineTo(x, y + 3);
      ctx.lineTo(x - 2.5, y);
      ctx.closePath();
      ctx.fill();
    });

    // Pastel pink lid rim + bow ribbon
    ctx.fillStyle = '#FFB3C6';
    ctx.strokeStyle = '#4A3531';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.roundRect(23, 24, 50, 10, 5);
    ctx.fill();
    ctx.stroke();

    // Cute ribbon bow on jar neck
    ctx.fillStyle = '#FF5D8F';
    ctx.beginPath();
    ctx.ellipse(41, 35, 7, 4, -0.25, 0, Math.PI * 2);
    ctx.ellipse(55, 35, 7, 4, 0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(48, 35, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Glass highlight
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(31, 42);
    ctx.lineTo(31, 68);
    ctx.stroke();
  }

  function drawEgg(ctx) {
    // Two shaded eggs in warm cream shells
    const drawSingleEgg = (cx, cy, rx, ry, rot, c1, c2) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      const g = ctx.createRadialGradient(-rx * 0.3, -ry * 0.3, 2, 0, 0, ry);
      g.addColorStop(0, c1);
      g.addColorStop(1, c2);
      ctx.fillStyle = g;
      ctx.strokeStyle = '#4A3531';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.65)';
      ctx.beginPath();
      ctx.ellipse(-rx * 0.32, -ry * 0.3, rx * 0.22, ry * 0.18, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };
    drawSingleEgg(37, 50, 16, 22, -0.15, '#FFF6E5', '#F7D098');
    drawSingleEgg(59, 54, 15, 21, 0.18, '#FFF9EE', '#FCD5A4');
  }

  function drawMilk(ctx) {
    ctx.strokeStyle = '#4A3531';
    ctx.lineWidth = 2.5;
    // Carton body
    ctx.fillStyle = '#F2FAFF';
    ctx.beginPath();
    ctx.roundRect(28, 32, 40, 48, 5);
    ctx.fill();
    ctx.stroke();
    // Gable top
    ctx.fillStyle = '#A2D2FF';
    ctx.beginPath();
    ctx.moveTo(28, 32);
    ctx.lineTo(48, 16);
    ctx.lineTo(68, 32);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Top seal fin
    ctx.fillStyle = '#BDE0FE';
    ctx.fillRect(36, 12, 24, 6);
    ctx.strokeRect(36, 12, 24, 6);
    // Blue stripe & milk drop
    ctx.fillStyle = '#90E0EF';
    ctx.fillRect(30, 48, 36, 20);
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(48, 51);
    ctx.quadraticCurveTo(55, 60, 48, 65);
    ctx.quadraticCurveTo(41, 60, 48, 51);
    ctx.fill();
  }

  function drawButter(ctx) {
    // Parchment wrapper base
    ctx.fillStyle = '#FFFDF5';
    ctx.strokeStyle = '#D4A373';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(48, 66, 32, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 3D butter block
    ctx.strokeStyle = '#4A3531';
    ctx.lineWidth = 2.4;
    ctx.fillStyle = '#FFF394';
    ctx.beginPath();
    ctx.moveTo(22, 48);
    ctx.lineTo(48, 32);
    ctx.lineTo(76, 44);
    ctx.lineTo(50, 60);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FFD166';
    ctx.beginPath();
    ctx.moveTo(22, 48);
    ctx.lineTo(50, 60);
    ctx.lineTo(50, 72);
    ctx.lineTo(22, 60);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#F4B942';
    ctx.beginPath();
    ctx.moveTo(50, 60);
    ctx.lineTo(76, 44);
    ctx.lineTo(76, 56);
    ctx.lineTo(50, 72);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  function drawVanilla(ctx) {
    ctx.strokeStyle = '#4A3531';
    ctx.lineWidth = 2.4;
    // Neck & cork
    ctx.fillStyle = '#D4A373';
    ctx.beginPath();
    ctx.roundRect(41, 16, 14, 12, 3);
    ctx.fill();
    ctx.stroke();
    // Bottle
    const grad = ctx.createLinearGradient(32, 30, 64, 78);
    grad.addColorStop(0, '#F6C667');
    grad.addColorStop(1, '#B5651D');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(32, 28, 32, 50, 10);
    ctx.fill();
    ctx.stroke();
    // Cream flower label
    ctx.fillStyle = '#FFF8E7';
    ctx.beginPath();
    ctx.arc(48, 54, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFB703';
    ctx.beginPath();
    ctx.arc(48, 54, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawChocolate(ctx) {
    ctx.strokeStyle = '#4A3531';
    ctx.lineWidth = 2.4;
    // Chocolate bar
    ctx.fillStyle = '#6B3E26';
    ctx.beginPath();
    ctx.roundRect(24, 18, 48, 60, 6);
    ctx.fill();
    ctx.stroke();
    // Squares
    ctx.fillStyle = '#844D31';
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 2; c++) {
        ctx.fillRect(30 + c * 20, 24 + r * 16, 16, 12);
      }
    }
    // Pastel pink/gold foil wrapper at bottom
    ctx.fillStyle = '#FFB3C6';
    ctx.beginPath();
    ctx.moveTo(22, 54);
    ctx.lineTo(36, 48);
    ctx.lineTo(48, 56);
    ctx.lineTo(62, 48);
    ctx.lineTo(74, 54);
    ctx.lineTo(74, 78);
    ctx.lineTo(22, 78);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  function drawCacao(ctx) {
    ctx.strokeStyle = '#4A3531';
    ctx.lineWidth = 2.4;
    ctx.fillStyle = '#8B5A2B';
    ctx.beginPath();
    ctx.roundRect(26, 28, 44, 50, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#D4A373';
    ctx.beginPath();
    ctx.roundRect(23, 22, 50, 10, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#FFF5E1';
    ctx.beginPath();
    ctx.arc(48, 55, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#5C3A21';
    ctx.beginPath();
    ctx.ellipse(48, 55, 6, 4, -0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawStrawberry(ctx) {
    ctx.strokeStyle = '#4A3531';
    ctx.lineWidth = 2.4;
    const grad = ctx.createRadialGradient(42, 44, 4, 48, 52, 26);
    grad.addColorStop(0, '#FF758F');
    grad.addColorStop(1, '#D90429');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(48, 28);
    ctx.bezierCurveTo(72, 28, 72, 54, 48, 78);
    ctx.bezierCurveTo(24, 54, 24, 28, 48, 28);
    ctx.fill();
    ctx.stroke();
    // Green leaves
    ctx.fillStyle = '#52B788';
    ctx.beginPath();
    ctx.moveTo(32, 29);
    ctx.lineTo(48, 35);
    ctx.lineTo(64, 29);
    ctx.lineTo(54, 18);
    ctx.lineTo(48, 24);
    ctx.lineTo(42, 18);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Seeds
    ctx.fillStyle = '#FFE5EC';
    [[40, 46], [54, 46], [48, 56], [42, 63], [54, 62]].forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 1.8, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawBlueberry(ctx) {
    ctx.strokeStyle = '#3A0CA3';
    ctx.lineWidth = 2.4;
    // Leaf
    ctx.fillStyle = '#52B788';
    ctx.beginPath();
    ctx.ellipse(62, 32, 12, 6, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    [[37, 54, 16], [59, 58, 15], [48, 40, 14]].forEach(([x, y, r]) => {
      const g = ctx.createRadialGradient(x - 4, y - 4, 2, x, y, r);
      g.addColorStop(0, '#8E94F2');
      g.addColorStop(1, '#4E54C8');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  }

  function drawMatcha(ctx) {
    ctx.strokeStyle = '#4A3531';
    ctx.lineWidth = 2.4;
    ctx.fillStyle = '#74C69D';
    ctx.beginPath();
    ctx.roundRect(26, 28, 44, 50, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#40916C';
    ctx.beginPath();
    ctx.roundRect(23, 22, 50, 10, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#D8F3DC';
    ctx.beginPath();
    ctx.arc(48, 55, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#2D6A4F';
    ctx.beginPath();
    ctx.ellipse(48, 55, 7, 4, -0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  function paintAll(root = document) {
    if (!root || !root.querySelectorAll) return;
    root.querySelectorAll('canvas.ing-canvas-icon').forEach(cv => {
      drawIcon(cv, cv.dataset.ing);
    });
  }

  return { drawIcon, paintAll };
})();


