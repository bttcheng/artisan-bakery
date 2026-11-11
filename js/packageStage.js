// ============================================================================
// SWEET DREAMS - TIỆM BÁNH NGỌT
// PackagingStageController: Interactive 5-Stage Gift Wrapping & Ribbon Tying
// ============================================================================

window.PackagingStageController = class PackagingStageController {
  constructor(containerId, decorationManager, audioManager) {
    this.container = document.getElementById(containerId);
    this.decoration = decorationManager;
    this.audio = audioManager;
    this.dragMode = null; // 'cake' | 'left' | 'right' | 'ends' | 'tape' | 'wrap' | 'tie' | 'sticker' | 'lid'
    this.dragStart = null;
    this.cakeDragOffset = { x: 0, y: 0 };
    this.onStateChange = null;
    this._bindEvents();
  }

  _getSvgCoords(clientX, clientY) {
    const svg = this.container ? this.container.querySelector('svg') : null;
    if (!svg) return { x: 240, y: 170 };
    const rect = svg.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * 480,
      y: ((clientY - rect.top) / rect.height) * 340
    };
  }

  _bindEvents() {
    document.addEventListener('pointerdown', (e) => {
      if (!this.container || !this.decoration || !this.decoration.packaging) return;
      const handle = e.target.closest('[data-pkg-drag]');
      if (!handle || !this.container.contains(handle)) return;

      const kind = handle.dataset.pkgDrag;
      const pt = this._getSvgCoords(e.clientX, e.clientY);
      this.dragMode = kind;
      this.dragStart = {
        x: pt.x,
        y: pt.y,
        moved: false,
        initialLeft: this.decoration.packaging.leftFold,
        initialRight: this.decoration.packaging.rightFold,
        initialEnds: this.decoration.packaging.endsFold,
        initialBow: this.decoration.packaging.bowTieProgress,
        initialLid: this.decoration.packaging.lidProgress
      };
      this.cakeDragOffset = { x: 0, y: 0 };
      e.preventDefault();
    });

    document.addEventListener('pointermove', (e) => {
      if (!this.dragMode || !this.dragStart || !this.decoration.packaging) return;
      const pt = this._getSvgCoords(e.clientX, e.clientY);
      const dx = pt.x - this.dragStart.x;
      const dy = pt.y - this.dragStart.y;
      if (Math.hypot(dx, dy) > 4) this.dragStart.moved = true;

      const pkg = this.decoration.packaging;

      if (this.dragMode === 'cake') {
        this.cakeDragOffset = { x: dx, y: dy };
        this.render();
      } else if (this.dragMode === 'left') {
        this.decoration.setFoldProgress('left', this.dragStart.initialLeft + dx / 135);
        this.render();
      } else if (this.dragMode === 'right') {
        this.decoration.setFoldProgress('right', this.dragStart.initialRight + (-dx) / 135);
        this.render();
      } else if (this.dragMode === 'ends') {
        this.decoration.setFoldProgress('ends', this.dragStart.initialEnds + Math.abs(dy) / 85);
        this.render();
      } else if (this.dragMode === 'tie') {
        const pull = (Math.abs(dx) + Math.max(0, -dy)) / 100;
        this.decoration.setBowTieProgress(this.dragStart.initialBow + pull);
        this.render();
      } else if (this.dragMode === 'sticker') {
        this.decoration.moveSticker(pt.x, pt.y);
        this.render();
      } else if (this.dragMode === 'lid') {
        this.decoration.setLidProgress(this.dragStart.initialLid + dy / 72);
        this.render();
      }
      if (pkg.closed && this.onStateChange) this.onStateChange();
    });

    document.addEventListener('pointerup', (e) => {
      if (!this.dragMode || !this.dragStart) return;
      const mode = this.dragMode;
      const moved = this.dragStart.moved;
      const pt = this._getSvgCoords(e.clientX, e.clientY);
      this.dragMode = null;
      this.dragStart = null;
      this.cakeDragOffset = { x: 0, y: 0 };

      const pkg = this.decoration.packaging;
      if (!pkg) return;

      if (mode === 'cake') {
        if (!moved || (pt.x > 140 && pt.x < 340 && pt.y > 75 && pt.y < 275)) {
          this.decoration.placeCakeInBox();
        }
      } else if (mode === 'left' && !moved) {
        this.decoration.setFoldProgress('left', 1);
      } else if (mode === 'right' && !moved) {
        this.decoration.setFoldProgress('right', 1);
      } else if (mode === 'ends' && !moved) {
        this.decoration.setFoldProgress('ends', 1);
      } else if (mode === 'tape') {
        this.decoration.applyTape();
      } else if (mode === 'wrap') {
        this.decoration.wrapRibbon();
      } else if (mode === 'tie' && !moved) {
        this.decoration.setBowTieProgress(1);
      } else if (mode === 'lid' && !moved) {
        this.decoration.setLidProgress(1);
      }

      this.render();
      if (this.onStateChange) this.onStateChange();
    });
  }

  getCurrentStepInfo() {
    const p = this.decoration.packaging;
    if (!p) return { step: 1, hint: '' };
    if (!p.cakePlaced) return { step: 1, hint: 'Bước 1: Chọn màu giấy gói và kéo chiếc bánh vào giữa tờ giấy!' };
    if (p.leftFold < 1) return { step: 2, hint: 'Bước 2.1: Kéo mép giấy bên TRÁI gập vào giữa hộp!' };
    if (p.rightFold < 1) return { step: 2, hint: 'Bước 2.2: Kéo mép giấy bên PHẢI gập chồng lên mép trái!' };
    if (p.endsFold < 1) return { step: 2, hint: 'Bước 2.3: Kéo gập hai đầu giấy trên & dưới vào hộp!' };
    if (!p.tapeApplied) return { step: 2, hint: 'Bước 2.4: Nhấn hoặc kéo cuộn băng keo dán cố định nếp gấp!' };
    if (!p.ribbonWrapped) return { step: 3, hint: 'Bước 3.1: Chọn màu ruy băng và nhấn/kéo cuộn ruy băng để quấn quanh hộp!' };
    if (p.bowTieProgress < 1) return { step: 3, hint: 'Bước 3.2: Kéo hai đầu dây ruy băng lên trên để thắt nơ xinh!' };
    if (!p.closed) return { step: 5, hint: 'Bước 4 & 5: Gắn thiệp/kéo sticker trang trí rồi kéo nắp hộp xuống để đóng!' };
    return { step: 6, hint: 'Hoàn tất đóng gói! Hãy ngắm thành phẩm và nhấn HOÀN THÀNH & GIAO BÁNH!' };
  }

  render() {
    if (!this.container || !this.decoration || !this.decoration.packaging) return;
    const pkg = this.decoration.packaging;
    const cake = this.decoration.cakeState;
    const box = window.SDData.BOX_COLORS.find(b => b.id === pkg.boxColor) || window.SDData.BOX_COLORS[0];
    const ribbon = window.SDData.RIBBON_COLORS.find(r => r.id === pkg.ribbonColor) || window.SDData.RIBBON_COLORS[0];
    const outline = '#3E2723';

    const paperFill = box.pattern ? 'url(#pkg-heart-pattern)' : box.hex;
    const stepInfo = this.getCurrentStepInfo();

    // Update top prompt text if present
    const hintEl = document.getElementById('pkg-step-hint');
    if (hintEl) hintEl.textContent = stepInfo.hint;

    // 1. Wrapping Paper & Folds Geometry
    let sceneSvg = '';

    // Base table mat
    sceneSvg += `
      <rect x="14" y="14" width="452" height="312" rx="22" fill="#FFF9F3" stroke="#F1CAD6" stroke-width="3"/>
      <ellipse cx="240" cy="284" rx="135" ry="18" fill="rgba(74,53,49,0.1)"/>
    `;

    if (!pkg.closed) {
      // Spread flat wrapping paper sheet beneath the box
      const sheetScale = pkg.cakePlaced ? 0.94 : 1;
      sceneSvg += `
        <g transform="translate(240, 185) scale(${sheetScale}) translate(-240, -185)">
          <rect x="85" y="65" width="310" height="230" rx="12" fill="${paperFill}" stroke="${outline}" stroke-width="3.2"/>
          <rect x="93" y="73" width="294" height="214" rx="8" fill="none" stroke="${box.border}" stroke-width="2" stroke-dasharray="6,6" opacity="0.7"/>
        </g>
      `;
    }

    if (!pkg.cakePlaced) {
      // Target drop zone in center of wrapping paper
      sceneSvg += `
        <rect x="172" y="115" width="136" height="130" rx="16" fill="rgba(255,255,255,0.65)" stroke="#FF758F" stroke-width="3" stroke-dasharray="8,6"/>
        <path d="M128,175 L164,175 M156,168 L165,175 L156,182" fill="none" stroke="#FF5D8F" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
      `;

      // Draggable finished cake on side stand!
      const cx = 62 + this.cakeDragOffset.x;
      const cy = 175 + this.cakeDragOffset.y;
      sceneSvg += `
        <g data-pkg-drag="cake" class="pkg-draggable" transform="translate(${cx - 55}, ${cy - 55})">
          <circle cx="55" cy="58" r="52" fill="#FFFDF9" stroke="#FF8FAB" stroke-width="3"/>
          <g transform="translate(5, 4) scale(0.5)">${window.SDRenderer.renderCake(cake, 200)}</g>
        </g>
      `;
    } else if (!pkg.closed) {
      // Box Base & Cake Inside (covered progressively as paper folds)
      sceneSvg += `
        <!-- Box Base Walls -->
        <rect x="160" y="112" width="160" height="145" rx="12" fill="${paperFill}" stroke="${outline}" stroke-width="3.5"/>
        <rect x="168" y="120" width="144" height="129" rx="8" fill="#FFFDF9" stroke="${box.border}" stroke-width="2"/>
        <!-- Placed Cake Inside -->
        <g transform="translate(185, 126) scale(0.55)">${window.SDRenderer.renderCake(cake, 200)}</g>
      `;

      // Left Wrapping Flap (folds from x=80 -> x=254)
      const lf = pkg.leftFold;
      const leftOuterX = 80 + lf * 174;
      const leftTopY = 112 + lf * 6;
      const leftBotY = 257 - lf * 6;
      sceneSvg += `
        <g ${lf < 1 ? 'data-pkg-drag="left" class="pkg-draggable"' : ''}>
          <polygon points="160,112 ${leftOuterX},${leftTopY} ${leftOuterX},${leftBotY} 160,257"
                   fill="${paperFill}" stroke="${outline}" stroke-width="3.2" stroke-linejoin="round"/>
          ${lf > 0.1 ? `<line x1="${leftOuterX - 4}" y1="${leftTopY + 4}" x2="${leftOuterX - 4}" y2="${leftBotY - 4}" stroke="rgba(74,53,49,0.22)" stroke-width="3"/>` : ''}
          ${lf < 1 ? `
            <circle cx="${Math.max(96, leftOuterX)}" cy="185" r="14" fill="#FF8FAB" stroke="${outline}" stroke-width="2.5" class="pkg-pulse-handle"/>
            <path d="M${Math.max(96, leftOuterX) - 5},185 L${Math.max(96, leftOuterX) + 5},185 M${Math.max(96, leftOuterX) + 1},180 L${Math.max(96, leftOuterX) + 6},185 L${Math.max(96, leftOuterX) + 1},190" fill="none" stroke="#FFF" stroke-width="2.5" stroke-linecap="round"/>
          ` : ''}
        </g>
      `;

      // Right Wrapping Flap (folds from x=400 -> x=224 overlapping left flap)
      if (lf >= 1) {
        const rf = pkg.rightFold;
        const rightOuterX = 400 - rf * 176;
        const rightTopY = 112 + rf * 5;
        const rightBotY = 257 - rf * 5;
        sceneSvg += `
          <g ${rf < 1 ? 'data-pkg-drag="right" class="pkg-draggable"' : ''}>
            <polygon points="320,112 ${rightOuterX},${rightTopY} ${rightOuterX},${rightBotY} 320,257"
                     fill="${paperFill}" stroke="${outline}" stroke-width="3.2" stroke-linejoin="round"/>
            ${rf > 0.15 ? `<line x1="${rightOuterX + 3}" y1="${rightTopY + 4}" x2="${rightOuterX + 3}" y2="${rightBotY - 4}" stroke="rgba(74,53,49,0.22)" stroke-width="3"/>` : ''}
            ${rf < 1 ? `
              <circle cx="${Math.min(384, rightOuterX)}" cy="185" r="14" fill="#FF8FAB" stroke="${outline}" stroke-width="2.5" class="pkg-pulse-handle"/>
              <path d="M${Math.min(384, rightOuterX) + 5},185 L${Math.min(384, rightOuterX) - 5},185 M${Math.min(384, rightOuterX) - 1},180 L${Math.min(384, rightOuterX) - 6},185 L${Math.min(384, rightOuterX) - 1},190" fill="none" stroke="#FFF" stroke-width="2.5" stroke-linecap="round"/>
            ` : ''}
          </g>
        `;
      }

      // Top & Bottom Envelope End Flaps (fold inward when rightFold >= 1)
      if (pkg.rightFold >= 1) {
        const ef = pkg.endsFold;
        const topTipY = 54 + ef * 104;
        const botTipY = 312 - ef * 100;
        sceneSvg += `
          <g ${ef < 1 ? 'data-pkg-drag="ends" class="pkg-draggable"' : ''}>
            <polygon points="160,112 320,112 240,${topTipY}" fill="${paperFill}" stroke="${outline}" stroke-width="3.2" stroke-linejoin="round"/>
            <polygon points="160,257 320,257 240,${botTipY}" fill="${paperFill}" stroke="${outline}" stroke-width="3.2" stroke-linejoin="round"/>
            ${ef < 1 ? `
              <circle cx="240" cy="${topTipY + 10}" r="13" fill="#FFD166" stroke="${outline}" stroke-width="2.4" class="pkg-pulse-handle"/>
              <path d="M240,${topTipY + 5} L240,${topTipY + 15} M235,${topTipY + 11} L240,${topTipY + 16} L245,${topTipY + 11}" fill="none" stroke="${outline}" stroke-width="2.4" stroke-linecap="round"/>
            ` : ''}
          </g>
        `;
      }

      // Washi Tape Dispenser / Applied Tape Seam
      if (pkg.endsFold >= 1) {
        if (!pkg.tapeApplied) {
          sceneSvg += `
            <g data-pkg-drag="tape" class="pkg-draggable" transform="translate(382, 165)">
              <rect x="-26" y="-22" width="52" height="44" rx="12" fill="#A8E6CF" stroke="${outline}" stroke-width="2.8"/>
              <circle cx="-4" cy="0" r="12" fill="#FFFDF9" stroke="${outline}" stroke-width="2.2"/>
              <rect x="8" y="-6" width="22" height="12" rx="2" fill="#FFE699" stroke="${outline}" stroke-width="2"/>
            </g>
            <path d="M350,185 L310,185 M318,179 L309,185 L318,191" fill="none" stroke="#52B788" stroke-width="3" stroke-linecap="round"/>
          `;
        } else {
          // Applied translucent pastel tape strip over center fold
          sceneSvg += `
            <rect x="218" y="176" width="44" height="18" rx="3" fill="rgba(255, 230, 153, 0.85)" stroke="#D4A373" stroke-width="2" class="pkg-tape-pop"/>
            <line x1="226" y1="178" x2="226" y2="192" stroke="#FFF" stroke-width="2" opacity="0.7"/>
            <line x1="254" y1="178" x2="254" y2="192" stroke="#FFF" stroke-width="2" opacity="0.7"/>
          `;
        }
      }

      // Ribbon Wrapping & Interactive Bow Tying
      if (pkg.tapeApplied) {
        if (!pkg.ribbonWrapped) {
          sceneSvg += `
            <g data-pkg-drag="wrap" class="pkg-draggable" transform="translate(88, 175)">
              <circle cx="0" cy="0" r="26" fill="${ribbon.hex}" stroke="${outline}" stroke-width="3" class="pkg-pulse-handle"/>
              <circle cx="0" cy="0" r="10" fill="#FFFDF9" stroke="${outline}" stroke-width="2.4"/>
              <path d="M26,4 L62,4" fill="none" stroke="${ribbon.hex}" stroke-width="8" stroke-linecap="round"/>
            </g>
          `;
        } else {
          // Crossed ribbon straps wrapped tightly around box
          sceneSvg += `
            <rect x="228" y="112" width="24" height="145" fill="${ribbon.hex}" stroke="${outline}" stroke-width="2.6"/>
            <rect x="160" y="174" width="160" height="22" fill="${ribbon.hex}" stroke="${outline}" stroke-width="2.6"/>
          `;
          // Loose ribbon ends -> Tie into separate knot, loops, and swaying tails!
          sceneSvg += this._renderInteractiveBow(240, 185, ribbon.hex, pkg.bowTieProgress, outline, true);
        }
      }

      // Greeting Card tucked onto box
      if (pkg.card && pkg.card !== 'none') {
        sceneSvg += this._renderVectorCard(172, 130, pkg.card, ribbon.hex, outline);
      }

      // Draggable Sticker
      if (pkg.sticker && pkg.sticker !== 'none') {
        const sx = pkg.stickerPos ? pkg.stickerPos.x : 282;
        const sy = pkg.stickerPos ? pkg.stickerPos.y : 216;
        sceneSvg += this._renderVectorSticker(sx, sy, pkg.sticker, outline, true);
      }

      // Stage 5: Hovering Box Lid ready to drag downward once bow is tied!
      if (pkg.bowTieProgress >= 1) {
        const lidOffset = -(1 - pkg.lidProgress) * 62;
        sceneSvg += `
          <g data-pkg-drag="lid" class="pkg-draggable" transform="translate(0, ${lidOffset})">
            <rect x="150" y="96" width="180" height="32" rx="8" fill="${paperFill}" stroke="${outline}" stroke-width="3.5"/>
            <rect x="227" y="96" width="26" height="32" fill="${ribbon.hex}" stroke="${outline}" stroke-width="2.6"/>
            ${this._renderInteractiveBow(240, 96, ribbon.hex, 1, outline, false)}
            <circle cx="240" cy="112" r="11" fill="#FFD166" stroke="${outline}" stroke-width="2.2" class="pkg-pulse-handle"/>
            <path d="M240,107 L240,117 M235,113 L240,118 L245,113" fill="none" stroke="${outline}" stroke-width="2.2" stroke-linecap="round"/>
          </g>
        `;
      }
    } else {
      // FINISHED CLOSED KAWAII GIFT BOX (Matching Reference Image Style!)
      sceneSvg += this._renderFinishedKawaiiGiftBox(box, paperFill, ribbon, pkg, outline);
    }

    this.container.innerHTML = `
      <svg viewBox="0 0 480 340" class="pkg-interactive-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="pkg-heart-pattern" width="36" height="36" patternUnits="userSpaceOnUse">
            <rect width="36" height="36" fill="${box.hex}"/>
            <path d="M18,24 C10,18 10,10 15,10 C17,10 18,12 18,13 C18,12 19,10 21,10 C26,10 26,18 18,24 Z" fill="#FFE699" opacity="0.88"/>
            <circle cx="6" cy="8" r="2.2" fill="#FFFDF9" opacity="0.7"/>
            <circle cx="31" cy="29" r="2.2" fill="#FFFDF9" opacity="0.7"/>
          </pattern>
        </defs>
        ${sceneSvg}
      </svg>
    `;
  }

  _renderInteractiveBow(cx, cy, color, progress, outline, showHandle) {
    // Separate components: 2 loose ends -> knot -> 2 loops -> 2 swaying tails
    let svg = '';
    if (progress < 0.55) {
      const pull = progress / 0.55;
      const spread = 26 * (1 - pull * 0.7);
      svg += `
        <path d="M${cx - 6},${cy} Q${cx - spread},${cy - 34} ${cx - spread + 6},${cy - 44}" fill="none" stroke="${color}" stroke-width="10" stroke-linecap="round"/>
        <path d="M${cx + 6},${cy} Q${cx + spread},${cy - 34} ${cx + spread - 6},${cy - 44}" fill="none" stroke="${color}" stroke-width="10" stroke-linecap="round"/>
      `;
    }
    if (progress >= 0.35) {
      const loopScale = Math.min(1, (progress - 0.35) / 0.45);
      const tailDrop = Math.max(0, (progress - 0.65) / 0.35);
      svg += `
        <g transform="translate(${cx},${cy})">
          <!-- Two separate swaying tails -->
          ${tailDrop > 0.05 ? `
            <g class="pkg-ribbon-sway">
              <path d="M-4,4 L${-24 * tailDrop},${36 * tailDrop} L${-12 * tailDrop},${32 * tailDrop} L-2,6 Z" fill="${color}" stroke="${outline}" stroke-width="2.6" stroke-linejoin="round"/>
              <path d="M4,4 L${24 * tailDrop},${36 * tailDrop} L${12 * tailDrop},${32 * tailDrop} L2,6 Z" fill="${color}" stroke="${outline}" stroke-width="2.6" stroke-linejoin="round"/>
            </g>
          ` : ''}
          <!-- Two separate inflated bow loops -->
          <g transform="scale(${loopScale})">
            <path d="M-4,0 C-38,-34 -52,6 -8,8 Z" fill="${color}" stroke="${outline}" stroke-width="3" stroke-linejoin="round"/>
            <path d="M4,0 C38,-34 52,6 8,8 Z" fill="${color}" stroke="${outline}" stroke-width="3" stroke-linejoin="round"/>
            <path d="M-28,-12 Q-18,-18 -10,-6" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="3" stroke-linecap="round"/>
            <path d="M28,-12 Q18,-18 10,-6" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="3" stroke-linecap="round"/>
          </g>
          <!-- Center knot -->
          <rect x="-9" y="-7" width="18" height="14" rx="6" fill="${color}" stroke="${outline}" stroke-width="3"/>
        </g>
      `;
    }
    if (showHandle && progress < 1) {
      svg += `
        <g data-pkg-drag="tie" class="pkg-draggable">
          <circle cx="${cx}" cy="${cy - 32}" r="14" fill="#FFD166" stroke="${outline}" stroke-width="2.5" class="pkg-pulse-handle"/>
          <path d="M${cx - 5},${cy - 32} L${cx + 5},${cy - 32} M${cx},${cy - 37} L${cx},${cy - 27}" stroke="${outline}" stroke-width="2.5" stroke-linecap="round"/>
        </g>
      `;
    }
    return svg;
  }

  _renderFinishedKawaiiGiftBox(box, paperFill, ribbon, pkg, outline) {
    const sx = pkg.stickerPos ? pkg.stickerPos.x : 284;
    const sy = pkg.stickerPos ? pkg.stickerPos.y : 218;
    return `
      <g class="pkg-finished-pop">
        <!-- Twinkling Vector Sparkles Around Finished Gift -->
        <path d="M126,105 Q126,115 136,115 Q126,115 126,125 Q126,115 116,115 Q126,115 126,105 Z" fill="#FFD166"/>
        <path d="M356,98 Q356,108 366,108 Q356,108 356,118 Q356,108 346,108 Q356,108 356,98 Z" fill="#FF8FAB"/>
        <path d="M366,225 Q366,233 374,233 Q366,233 366,241 Q366,233 358,233 Q366,233 366,225 Z" fill="#A8E6CF"/>

        <!-- Tilted Kawaii Gift Box Body (Inspired by Reference!) -->
        <g transform="translate(240, 185) rotate(-3) translate(-240, -185)">
          <!-- Main Box Body -->
          <polygon points="154,132 326,132 316,274 164,274" fill="${paperFill}" stroke="${outline}" stroke-width="4" stroke-linejoin="round"/>
          <!-- Side 3D Shade -->
          <polygon points="292,132 326,132 316,274 286,274" fill="rgba(74,53,49,0.12)"/>
          <!-- Vertical Ribbon Wrap -->
          <polygon points="225,132 255,132 253,274 227,274" fill="${ribbon.hex}" stroke="${outline}" stroke-width="3.2"/>

          <!-- Box Lid -->
          <rect x="144" y="102" width="192" height="36" rx="8" fill="${paperFill}" stroke="${outline}" stroke-width="4"/>
          <rect x="224" y="102" width="32" height="36" fill="${ribbon.hex}" stroke="${outline}" stroke-width="3.2"/>

          <!-- Tied Bow Perched on Lid -->
          ${this._renderInteractiveBow(240, 94, ribbon.hex, 1, outline, false)}

          <!-- Greeting Card & Draggable Sticker -->
          ${pkg.card && pkg.card !== 'none' ? this._renderVectorCard(162, 146, pkg.card, ribbon.hex, outline) : ''}
          ${pkg.sticker && pkg.sticker !== 'none' ? this._renderVectorSticker(sx, sy, pkg.sticker, outline, true) : ''}
        </g>
      </g>
    `;
  }

  _renderVectorCard(x, y, cardId, ribbonColor, outline) {
    const accent = cardId === 'birthday' ? '#FFD166' : cardId === 'love' ? '#FF5D8F' : '#74C69D';
    return `
      <g transform="translate(${x}, ${y}) rotate(-10)">
        <rect x="0" y="0" width="44" height="30" rx="5" fill="#FFFDF9" stroke="${outline}" stroke-width="2.4"/>
        <line x1="7" y1="10" x2="37" y2="10" stroke="${accent}" stroke-width="3" stroke-linecap="round"/>
        <line x1="7" y1="18" x2="28" y2="18" stroke="${ribbonColor}" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="34" cy="21" r="4" fill="${accent}"/>
      </g>
    `;
  }

  _renderVectorSticker(x, y, stickerId, outline, draggable = false) {
    let icon = '';
    if (stickerId === 'heart') {
      icon = `<path d="M0,7 C-10,0 -10,-9 -4,-9 C-1,-9 0,-6 0,-4 C0,-6 1,-9 4,-9 C10,-9 10,0 0,7 Z" fill="#FF4D6D" stroke="${outline}" stroke-width="1.8"/>`;
    } else if (stickerId === 'star') {
      icon = `<polygon points="0,-10 3,-3 10,-3 4,2 6,9 0,5 -6,9 -4,2 -10,-3 -3,-3" fill="#FFD166" stroke="${outline}" stroke-width="1.8"/>`;
    } else if (stickerId === 'flower') {
      icon = `
        <circle cx="0" cy="-5" r="4" fill="#FFB3C6" stroke="${outline}" stroke-width="1.4"/>
        <circle cx="5" cy="0" r="4" fill="#FFB3C6" stroke="${outline}" stroke-width="1.4"/>
        <circle cx="0" cy="5" r="4" fill="#FFB3C6" stroke="${outline}" stroke-width="1.4"/>
        <circle cx="-5" cy="0" r="4" fill="#FFB3C6" stroke="${outline}" stroke-width="1.4"/>
        <circle cx="0" cy="0" r="3" fill="#FFD166"/>
      `;
    } else if (stickerId === 'crown') {
      icon = `<polygon points="-9,6 -9,-4 -4,1 0,-7 4,1 9,-4 9,6" fill="#FFD166" stroke="${outline}" stroke-width="1.8" stroke-linejoin="round"/>`;
    }
    return `
      <g ${draggable ? 'data-pkg-drag="sticker" class="pkg-draggable"' : ''} transform="translate(${x}, ${y})">
        <circle cx="0" cy="0" r="16" fill="#FFFDF9" stroke="${outline}" stroke-width="2.2"/>
        ${icon}
      </g>
    `;
  }
};

