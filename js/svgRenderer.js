// ============================================================================
// SWEET DREAMS - TIỆM BÁNH NGỌT
// Unified 2D Pastel Cartoon SVG Renderer (Characters, Cakes, Ingredients, Boxes)
// ============================================================================

window.SDRenderer = (() => {
  const { BATTERS, FROSTING_COLORS, BOX_COLORS, RIBBON_COLORS, CUSTOMERS } = window.SDData;

  function findBatter(id) {
    return BATTERS.find(b => b.id === id) || BATTERS[0];
  }
  function findFrosting(id) {
    return FROSTING_COLORS.find(f => f.id === id) || FROSTING_COLORS[0];
  }

  // --------------------------------------------------------------------------
  // 1. CHIBI CHARACTER RENDERER (12 Unique Characters + Moods)
  // --------------------------------------------------------------------------
  function renderCharacter(customerOrId, mood = 'normal', opts = {}) {
    const c = typeof customerOrId === 'string'
      ? (CUSTOMERS.find(x => x.id === customerOrId) || CUSTOMERS[0])
      : customerOrId;
    const width = opts.width || 110;
    const height = opts.height || 135;
    const wave = opts.wave || false;
    const seated = opts.seated || false;
    const waitAction = opts.waitAction || '';

    const isHappy = mood === 'happy' || mood === 'delighted';
    const isAngry = mood === 'angry' || mood === 'disappointed';
    const isImpatient = mood === 'impatient';
    const isExpectant = mood === 'expectant' || seated;

    // Hair back layer
    let hairBack = '';
    if (c.hairStyle === 'pigtails') {
      hairBack = `
        <circle cx="24" cy="48" r="14" fill="${c.hairColor}" stroke="#4A3531" stroke-width="2"/>
        <circle cx="86" cy="48" r="14" fill="${c.hairColor}" stroke="#4A3531" stroke-width="2"/>
      `;
    } else if (c.hairStyle === 'long_wave') {
      hairBack = `
        <path d="M24,42 Q18,75 26,95 L84,95 Q92,75 86,42 Z" fill="${c.hairColor}" stroke="#4A3531" stroke-width="2"/>
      `;
    } else if (c.hairStyle === 'ponytail') {
      hairBack = `
        <ellipse cx="86" cy="42" rx="11" ry="18" transform="rotate(20 86 42)" fill="${c.hairColor}" stroke="#4A3531" stroke-width="2"/>
      `;
    } else if (c.hairStyle === 'curly') {
      hairBack = `
        <circle cx="26" cy="48" r="11" fill="${c.hairColor}" stroke="#4A3531" stroke-width="2"/>
        <circle cx="84" cy="48" r="11" fill="${c.hairColor}" stroke="#4A3531" stroke-width="2"/>
        <circle cx="32" cy="30" r="10" fill="${c.hairColor}"/>
        <circle cx="78" cy="30" r="10" fill="${c.hairColor}"/>
      `;
    }

    // Hair front / bangs
    let hairFront = `<path d="M26,42 Q28,16 55,16 Q82,16 84,42 Q72,30 55,34 Q38,30 26,42 Z" fill="${c.hairColor}" stroke="#4A3531" stroke-width="2"/>`;
    if (c.hairStyle === 'spiky') {
      hairFront = `<path d="M26,42 L25,25 L38,30 L48,14 L58,28 L72,15 L79,30 L88,24 L84,42 Q68,32 55,35 Q40,32 26,42 Z" fill="${c.hairColor}" stroke="#4A3531" stroke-width="2"/>`;
    } else if (c.hairStyle === 'bun' || c.hairStyle === 'grandma_bun') {
      hairFront = `
        <circle cx="55" cy="14" r="11" fill="${c.hairColor}" stroke="#4A3531" stroke-width="2"/>
        <path d="M26,42 Q28,18 55,18 Q82,18 84,42 Q70,32 55,32 Q40,32 26,42 Z" fill="${c.hairColor}" stroke="#4A3531" stroke-width="2"/>
      `;
    } else if (c.hairStyle === 'chef_hat') {
      hairFront = `
        <path d="M26,42 Q28,22 55,22 Q82,22 84,42 Q70,34 55,34 Q40,34 26,42 Z" fill="${c.hairColor}" stroke="#4A3531" stroke-width="2"/>
        <path d="M35,24 C28,10 42,2 55,6 C68,2 82,10 75,24 Z" fill="#FFFFFF" stroke="#4A3531" stroke-width="2"/>
        <rect x="35" y="21" width="40" height="7" rx="3" fill="#FFF8EB" stroke="#4A3531" stroke-width="2"/>
      `;
    }

    // Accessories
    let accSvg = '';
    if (c.accessory === 'bow') {
      accSvg = `<circle cx="34" cy="28" r="5" fill="#FF5D8F" stroke="#4A3531" stroke-width="1.5"/>
                <circle cx="42" cy="25" r="5" fill="#FF5D8F" stroke="#4A3531" stroke-width="1.5"/>
                <circle cx="38" cy="27" r="2.5" fill="#FFD166"/>`;
    } else if (c.accessory === 'cap') {
      accSvg = `<path d="M27,31 Q55,13 83,31 Z" fill="#4EA8DE" stroke="#4A3531" stroke-width="2"/>
                <path d="M72,30 Q92,31 90,36 L68,34 Z" fill="#277DA1" stroke="#4A3531" stroke-width="1.8"/>`;
    } else if (c.accessory === 'flower') {
      accSvg = `<g transform="translate(77,28)">
        <circle cx="0" cy="-4" r="3.5" fill="#FFB3C6"/><circle cx="4" cy="0" r="3.5" fill="#FFB3C6"/>
        <circle cx="0" cy="4" r="3.5" fill="#FFB3C6"/><circle cx="-4" cy="0" r="3.5" fill="#FFB3C6"/>
        <circle cx="0" cy="0" r="2.5" fill="#FFD166"/>
      </g>`;
    } else if (c.accessory === 'glasses' || c.accessory === 'round_glasses') {
      accSvg = `<circle cx="43" cy="52" r="7.5" fill="rgba(255,255,255,0.25)" stroke="#4A3531" stroke-width="1.8"/>
                <circle cx="67" cy="52" r="7.5" fill="rgba(255,255,255,0.25)" stroke="#4A3531" stroke-width="1.8"/>
                <line x1="50.5" y1="52" x2="59.5" y2="52" stroke="#4A3531" stroke-width="1.8"/>`;
    } else if (c.accessory === 'crown_beret') {
      accSvg = `<polygon points="44,20 48,10 55,16 62,10 66,20" fill="#FFD166" stroke="#4A3531" stroke-width="1.6"/>`;
    } else if (c.accessory === 'monocle') {
      accSvg = `<circle cx="67" cy="52" r="7.5" fill="rgba(255,255,255,0.25)" stroke="#D4A373" stroke-width="2"/>
                <path d="M40,60 Q55,56 70,60" fill="none" stroke="${c.hairColor}" stroke-width="3" stroke-linecap="round"/>`;
    } else if (c.accessory === 'star_clip') {
      accSvg = `<polygon points="34,24 36,28 40,28 37,31 38,35 34,33 30,35 31,31 28,28 32,28" fill="#FFD166" stroke="#4A3531" stroke-width="1.2"/>`;
    } else if (c.accessory === 'heart_pin') {
      accSvg = `<path d="M74,24 C74,21 78,20 79,23 C80,20 84,21 84,24 C84,28 79,31 79,31 C79,31 74,28 74,24 Z" fill="#FF4D6D" stroke="#4A3531" stroke-width="1.2"/>`;
    }

    // Eyes & Mouth based on mood
    let eyes = `
      <circle cx="43" cy="52" r="3.8" fill="#3D2B1F"/>
      <circle cx="41.8" cy="50.5" r="1.3" fill="#FFF"/>
      <circle cx="67" cy="52" r="3.8" fill="#3D2B1F"/>
      <circle cx="65.8" cy="50.5" r="1.3" fill="#FFF"/>
    `;
    let brows = '';
    let mouth = `<path d="M49,62 Q55,67 61,62" fill="none" stroke="#4A3531" stroke-width="2.2" stroke-linecap="round"/>`;
    let blush = `<ellipse cx="36" cy="58" rx="4.5" ry="2.5" fill="#FF9EBB" opacity="0.65"/>
                 <ellipse cx="74" cy="58" rx="4.5" ry="2.5" fill="#FF9EBB" opacity="0.65"/>`;

    if (mood === 'delighted') {
      eyes = `
        <path d="M38,53 Q43,47 48,53" fill="none" stroke="#3D2B1F" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M62,53 Q67,47 72,53" fill="none" stroke="#3D2B1F" stroke-width="2.5" stroke-linecap="round"/>
      `;
      mouth = `<path d="M47,61 Q55,70 63,61 Z" fill="#FF758F" stroke="#4A3531" stroke-width="1.8"/>`;
    } else if (isImpatient) {
      brows = `
        <line x1="38" y1="45" x2="48" y2="47" stroke="#4A3531" stroke-width="2" stroke-linecap="round"/>
        <line x1="72" y1="45" x2="62" y2="47" stroke="#4A3531" stroke-width="2" stroke-linecap="round"/>
      `;
      mouth = `<path d="M49,64 Q55,61 61,64" fill="none" stroke="#4A3531" stroke-width="2.2" stroke-linecap="round"/>`;
    } else if (isAngry) {
      brows = `
        <line x1="37" y1="44" x2="48" y2="48" stroke="#4A3531" stroke-width="2.4" stroke-linecap="round"/>
        <line x1="73" y1="44" x2="62" y2="48" stroke="#4A3531" stroke-width="2.4" stroke-linecap="round"/>
      `;
      mouth = `<path d="M48,66 Q55,59 62,66" fill="none" stroke="#4A3531" stroke-width="2.2" stroke-linecap="round"/>`;
      blush = '';
    } else if (isExpectant) {
      if (waitAction === 'check_watch') {
        eyes = `
          <circle cx="41.5" cy="53" r="3.6" fill="#3D2B1F"/>
          <circle cx="40.5" cy="51.6" r="1.2" fill="#FFF"/>
          <circle cx="65.5" cy="53" r="3.6" fill="#3D2B1F"/>
          <circle cx="64.5" cy="51.6" r="1.2" fill="#FFF"/>
        `;
        mouth = `<path d="M51,63 Q55,65 59,62" fill="none" stroke="#4A3531" stroke-width="2" stroke-linecap="round"/>`;
      } else if (waitAction === 'look_counter') {
        eyes = `
          <circle cx="45" cy="51.5" r="3.8" fill="#3D2B1F"/>
          <circle cx="44" cy="50" r="1.3" fill="#FFF"/>
          <circle cx="69" cy="51.5" r="3.8" fill="#3D2B1F"/>
          <circle cx="68" cy="50" r="1.3" fill="#FFF"/>
        `;
        mouth = `<path d="M49,62 Q55,68 61,62" fill="none" stroke="#4A3531" stroke-width="2.2" stroke-linecap="round"/>`;
      } else {
        mouth = `<path d="M48,61 Q55,69 62,61" fill="none" stroke="#4A3531" stroke-width="2.2" stroke-linecap="round"/>`;
      }
    }

    // Arms pose (crossed when impatient/angry, waving when happy/wave, check watch or resting on table when seated)
    let arms = `
      <path d="M31,84 Q20,96 27,108" fill="none" stroke="${c.skinColor}" stroke-width="8" stroke-linecap="round"/>
      <path d="M79,84 Q90,96 83,108" fill="none" stroke="${c.skinColor}" stroke-width="8" stroke-linecap="round"/>
    `;
    if (isImpatient || isAngry) {
      arms = `
        <path d="M32,86 Q45,98 65,93" fill="none" stroke="${c.outfitColor}" stroke-width="8" stroke-linecap="round"/>
        <path d="M78,86 Q65,98 45,93" fill="none" stroke="${c.outfitColor}" stroke-width="8" stroke-linecap="round"/>
        <path d="M32,86 Q45,98 65,93" fill="none" stroke="#4A3531" stroke-width="1.8" stroke-linecap="round"/>
      `;
    } else if (seated && waitAction === 'check_watch') {
      arms = `
        <path d="M31,84 Q24,96 36,96" fill="none" stroke="${c.skinColor}" stroke-width="7.5" stroke-linecap="round"/>
        <rect x="33" y="91" width="9" height="7" rx="3" fill="#FFD166" stroke="#4A3531" stroke-width="1.5"/>
        <circle cx="37.5" cy="94.5" r="2" fill="#FFF"/>
        <path d="M79,84 Q88,96 80,104" fill="none" stroke="${c.skinColor}" stroke-width="7.5" stroke-linecap="round"/>
      `;
    } else if (seated) {
      arms = `
        <path d="M31,84 Q24,96 34,104" fill="none" stroke="${c.skinColor}" stroke-width="7.5" stroke-linecap="round"/>
        <path d="M79,84 Q86,96 76,104" fill="none" stroke="${c.skinColor}" stroke-width="7.5" stroke-linecap="round"/>
      `;
    } else if (wave || mood === 'delighted') {
      arms = `
        <path d="M31,84 Q20,96 27,108" fill="none" stroke="${c.skinColor}" stroke-width="8" stroke-linecap="round"/>
        <path d="M79,84 Q96,70 92,55" fill="none" stroke="${c.skinColor}" stroke-width="8" stroke-linecap="round"/>
        <circle cx="92" cy="54" r="5" fill="${c.skinColor}" stroke="#4A3531" stroke-width="1.5"/>
      `;
    }

    const chairBackSvg = seated
      ? `<rect x="20" y="66" width="70" height="44" rx="14" fill="#FFE5EC" stroke="#E09F9D" stroke-width="2.2"/>`
      : '';
    const tableFrontSvg = seated
      ? `<rect x="14" y="106" width="82" height="12" rx="6" fill="#FFF3E0" stroke="#C99281" stroke-width="2"/>
         <rect x="48" y="118" width="14" height="10" rx="2" fill="#D4A373" stroke="#4A3531" stroke-width="1.5"/>`
      : '';
    const waitBadgeSvg = seated && waitAction === 'check_watch'
      ? `<g transform="translate(86,20)"><circle cx="0" cy="0" r="10" fill="#FFF9DB" stroke="#F4C95D" stroke-width="1.8"/><text x="0" y="4" text-anchor="middle" font-size="11">⌚</text></g>`
      : seated && waitAction === 'look_counter'
        ? `<g transform="translate(87,20)"><circle cx="0" cy="0" r="10" fill="#FFF0F5" stroke="#FF8FAB" stroke-width="1.8"/><text x="0" y="4" text-anchor="middle" font-size="11">🍰</text></g>`
        : seated
          ? `<text x="86" y="25" font-size="13">😊</text>`
          : '';

    // Couple special badge (second small head for Bao & Vy)
    let partnerSvg = '';
    if (c.hairStyle === 'couple') {
      partnerSvg = `
        <g transform="translate(22, 6) scale(0.75)">
          <circle cx="55" cy="48" r="24" fill="#FCD5B5" stroke="#4A3531" stroke-width="2.2"/>
          <path d="M31,42 Q33,18 55,18 Q77,18 79,42 Q66,30 55,34 Q42,30 31,42 Z" fill="#2B1B17" stroke="#4A3531" stroke-width="2"/>
          <circle cx="46" cy="50" r="3" fill="#3D2B1F"/>
          <circle cx="64" cy="50" r="3" fill="#3D2B1F"/>
          <path d="M50,60 Q55,64 60,60" fill="none" stroke="#4A3531" stroke-width="2"/>
        </g>
      `;
    }

    return `
      <svg viewBox="0 0 110 135" width="${width}" height="${height}" class="chibi-svg mood-${mood}${seated ? ' seated' : ''}${waitAction ? ` wait-${waitAction}` : ''}" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="55" cy="126" rx="30" ry="6" fill="rgba(74,53,49,0.12)"/>
        ${chairBackSvg}
        ${partnerSvg}
        ${hairBack}
        <!-- Body / Outfit -->
        <path d="M32,80 Q55,74 78,80 L84,120 Q55,126 26,120 Z" fill="${c.outfitColor}" stroke="#4A3531" stroke-width="2.2" stroke-linejoin="round"/>
        <!-- Collar detail -->
        <path d="M43,78 Q55,88 67,78" fill="#FFFFFF" stroke="#4A3531" stroke-width="1.8"/>
        ${arms}
        ${tableFrontSvg}
        <!-- Head -->
        <circle cx="55" cy="50" r="28" fill="${c.skinColor}" stroke="#4A3531" stroke-width="2.3"/>
        ${blush}
        <g class="chibi-eyes">${eyes}</g>
        ${brows}
        ${mouth}
        ${hairFront}
        ${accSvg}
        ${waitBadgeSvg}
        ${isHappy && !seated ? '<text x="86" y="25" font-size="14">✨</text>' : ''}
        ${isAngry ? '<text x="84" y="26" font-size="14">💢</text>' : ''}
      </svg>
    `;
  }

  // --------------------------------------------------------------------------
  // 2. 2D LINE ART CAKE ASSET RESOLVER & DYNAMIC LAYERED DECORATION RENDERER
  // --------------------------------------------------------------------------
  function getCakeAssetPath(cakeType) {
    const valid = window.SDData && window.SDData.CAKE_TYPES && window.SDData.CAKE_TYPES.some(c => c.id === cakeType);
    return `assets/cakes/${valid ? cakeType : 'round_cake'}.svg`;
  }

  function renderCake(cakeState, size = 220) {
    const s = cakeState || {};
    const type = s.cakeType || 'cupcake';
    const batter = findBatter(s.batter || 'vanilla');
    const bakeState = s.bakeState || 'perfect'; // raw | baking | perfect | burnt
    const frostingApplied = s.frostingApplied !== undefined ? s.frostingApplied : true;
    const frosting = findFrosting(s.frostingColor || 'pink');
    const nozzle = s.nozzle || 'swirl';
    const toppings = s.toppings || [];
    const accessories = s.accessories || [];

    // Determine cake body color based on bakeState
    let bodyColor = batter.bakedColor;
    let rimColor = batter.rimColor;
    let scaleY = 1;
    let charOverlay = '';

    if (bakeState === 'raw') {
      bodyColor = batter.color;
      rimColor = batter.bakedColor;
      scaleY = 0.88;
    } else if (bakeState === 'baking') {
      bodyColor = batter.color;
      rimColor = batter.bakedColor;
      scaleY = 0.94;
    } else if (bakeState === 'burnt') {
      bodyColor = '#3B2820';
      rimColor = '#21140F';
      charOverlay = `
        <circle cx="88" cy="118" r="9" fill="#1A110E" opacity="0.5"/>
        <circle cx="122" cy="126" r="11" fill="#1A110E" opacity="0.45"/>
        <path d="M80,78 Q75,62 84,50" stroke="#777" stroke-width="3" fill="none" opacity="0.6"/>
        <path d="M125,74 Q132,58 122,45" stroke="#777" stroke-width="3" fill="none" opacity="0.6"/>
      `;
    }

    const outline = '#3E2723';
    const cakeCfg = (window.SDData && window.SDData.CAKE_TYPES)
      ? window.SDData.CAKE_TYPES.find(c => c.id === type)
      : null;
    const shape = (cakeCfg && cakeCfg.moldShape) ? cakeCfg.moldShape : type;
    let baseSvg = '';
    let frostingSvg = '';
    let topZoneY = 95;

    // --- ALL 38 DISTINCT CAKE SHAPES ---
    if (shape === 'cupcake' || shape === 'muffin') {
      topZoneY = 86;
      const isMuffin = shape === 'muffin';
      const linerFill = type === 'cupcake_chocolate' ? '#D4A373'
        : type === 'cupcake_vanilla' ? '#FFF0B3'
        : isMuffin ? '#BDE0FE'
        : '#FFB3C6';
      baseSvg = `
        <path d="M56,115 L144,115 L132,167 Q100,175 68,167 Z" fill="${linerFill}" stroke="${outline}" stroke-width="3.4" stroke-linejoin="round"/>
        <path d="M71,117 L78,168 M86,117 L89,170 M100,117 L100,171 M114,117 L111,170 M129,117 L122,168" stroke="${outline}" stroke-width="2.2" stroke-linecap="round" opacity="0.5"/>
        <path d="M56,115 L144,115 L132,167 Q100,175 68,167 Z" fill="none" stroke="${outline}" stroke-width="3.4" stroke-linejoin="round"/>
        <path d="M${isMuffin ? 48 : 54},115 Q${isMuffin ? 46 : 54},${isMuffin ? 72 : 84} 100,${isMuffin ? 72 : 84} Q${isMuffin ? 154 : 146},${isMuffin ? 72 : 84} ${isMuffin ? 152 : 146},115 Z" fill="${bodyColor}" stroke="${outline}" stroke-width="3.4" stroke-linejoin="round"/>
        ${isMuffin ? `
          <circle cx="78" cy="95" r="5" fill="#4E54C8" stroke="${outline}" stroke-width="1.6"/>
          <circle cx="102" cy="86" r="5.5" fill="#4E54C8" stroke="${outline}" stroke-width="1.6"/>
          <circle cx="122" cy="98" r="5" fill="#4E54C8" stroke="${outline}" stroke-width="1.6"/>
        ` : ''}
      `;
      if (frostingApplied) {
        if (nozzle === 'swirl') {
          frostingSvg = `
            <path d="M48,112 C48,96 64,88 100,88 C136,88 152,96 152,112 C152,120 142,124 134,119 C126,125 114,125 107,119 C100,126 93,126 86,119 C78,125 66,125 58,119 C52,122 48,118 48,112 Z" fill="${frosting.hex}" stroke="${outline}" stroke-width="3.4" stroke-linejoin="round"/>
            <path d="M58,95 C56,77 78,68 100,68 C122,68 144,77 142,95 C134,104 66,104 58,95 Z" fill="${frosting.hex}" stroke="${outline}" stroke-width="3.4" stroke-linejoin="round"/>
            <path d="M72,74 C72,57 88,46 100,45 C112,46 128,57 128,74 C118,82 82,82 72,74 Z" fill="${frosting.hex}" stroke="${outline}" stroke-width="3.4" stroke-linejoin="round"/>
            <path d="M82,58 Q90,52 97,53" fill="none" stroke="#FFFFFF" stroke-width="3.2" stroke-linecap="round" opacity="0.85"/>
          `;
        } else if (nozzle === 'smooth') {
          frostingSvg = `
            <path d="M50,113 C50,74 72,66 100,66 C128,66 150,74 150,113 C136,121 118,121 100,117 C82,121 64,121 50,113 Z" fill="${frosting.hex}" stroke="${outline}" stroke-width="3.4" stroke-linejoin="round"/>
            <path d="M70,84 Q86,74 106,75" fill="none" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" opacity="0.8"/>
          `;
        } else if (nozzle === 'piped') {
          frostingSvg = `
            <path d="M52,110 Q56,73 100,73 Q144,73 148,110 Z" fill="${frosting.hex}" stroke="${outline}" stroke-width="3.4" stroke-linejoin="round"/>
            <circle cx="60" cy="111" r="9" fill="${frosting.hex}" stroke="${outline}" stroke-width="2.8"/><circle cx="80" cy="113" r="9" fill="${frosting.hex}" stroke="${outline}" stroke-width="2.8"/>
            <circle cx="100" cy="114" r="9" fill="${frosting.hex}" stroke="${outline}" stroke-width="2.8"/><circle cx="120" cy="113" r="9" fill="${frosting.hex}" stroke="${outline}" stroke-width="2.8"/>
            <circle cx="140" cy="111" r="9" fill="${frosting.hex}" stroke="${outline}" stroke-width="2.8"/>
          `;
        } else {
          frostingSvg = `
            <path d="M51,109 Q56,77 100,77 Q144,77 149,109 Q140,124 130,112 C122,126 112,112 100,125 C88,112 78,126 70,112 Q60,123 51,109 Z" fill="${frosting.hex}" stroke="${outline}" stroke-width="3.4" stroke-linejoin="round"/>
          `;
        }
      }
    } else if (shape === 'donut' || shape === 'donut_filled') {
      topZoneY = 104;
      const hasHole = shape === 'donut';
      baseSvg = `
        <ellipse cx="100" cy="120" rx="64" ry="44" fill="${bodyColor}" stroke="${outline}" stroke-width="3.6"/>
        <path d="M40,126 C46,149 72,162 100,162 C128,162 154,149 160,126 C146,144 126,152 100,152 C74,152 54,144 40,126 Z" fill="${rimColor}" opacity="0.65"/>
        ${hasHole ? `<ellipse cx="100" cy="116" rx="20" ry="11" fill="#FFFDF9" stroke="${outline}" stroke-width="3.4"/>` : ''}
      `;
      if (frostingApplied) {
        if (nozzle === 'drizzle' || type === 'donut_matcha') {
          frostingSvg = `
            <path d="M48,112 Q100,76 152,112" fill="none" stroke="${frosting.hex}" stroke-width="14" stroke-linecap="round"/>
            <path d="M44,123 Q70,105 100,134 Q130,105 156,123" fill="none" stroke="${frosting.hex}" stroke-width="10" stroke-linecap="round"/>
            ${hasHole ? `<ellipse cx="100" cy="116" rx="20" ry="11" fill="#FFFDF9" stroke="${outline}" stroke-width="3.2"/>` : ''}
          `;
        } else {
          frostingSvg = `
            <path d="M38,112 C39,82 70,75 100,75 C130,75 161,82 162,112 C161,126 149,129 141,121 C133,113 128,133 116,131 C106,129 103,118 95,120 C87,122 82,136 70,131 C59,127 57,117 49,120 C41,123 38,119 38,112 Z" fill="${frosting.hex}" stroke="${outline}" stroke-width="3.4" stroke-linejoin="round"/>
            <path d="M55,93 Q73,83 94,83" fill="none" stroke="#FFFFFF" stroke-width="3.6" stroke-linecap="round" opacity="0.8"/>
            ${hasHole ? `<ellipse cx="100" cy="116" rx="20" ry="11" fill="#FFFDF9" stroke="${outline}" stroke-width="3.2"/>` : `<circle cx="100" cy="108" r="14" fill="#FFFDF9" stroke="${outline}" stroke-width="2.6"/>`}
          `;
        }
      }
    } else if (shape === 'round_cake') {
      topZoneY = 82;
      baseSvg = `
        <path d="M42,96 L158,96 L158,152 C158,162 132,169 100,169 C68,169 42,162 42,152 Z" fill="${bodyColor}" stroke="${outline}" stroke-width="3.5" stroke-linejoin="round"/>
        <path d="M42,125 Q100,134 158,125 L158,136 Q100,145 42,136 Z" fill="#FFB3C6" stroke="${outline}" stroke-width="2.6"/>
        <ellipse cx="100" cy="96" rx="58" ry="16" fill="${rimColor}" stroke="${outline}" stroke-width="3.4"/>
      `;
      if (frostingApplied) {
        if (nozzle === 'drizzle' || type === 'chocolate_cream_cake') {
          frostingSvg = `
            <path d="M40,96 C40,81 67,72 100,72 C133,72 160,81 160,96 L160,115 C152,126 144,121 139,109 C133,97 127,125 115,123 C105,121 100,104 92,107 C84,110 79,125 67,119 C58,114 55,104 48,110 C42,114 40,107 40,96 Z" fill="${frosting.hex}" stroke="${outline}" stroke-width="3.4" stroke-linejoin="round"/>
            <ellipse cx="100" cy="94" rx="56" ry="14" fill="${frosting.hex}" stroke="${outline}" stroke-width="2.6"/>
          `;
        } else {
          frostingSvg = `
            <path d="M42,96 L158,96 L158,152 C158,162 132,169 100,169 C68,169 42,162 42,152 Z" fill="${frosting.hex}" stroke="${outline}" stroke-width="3.5" stroke-linejoin="round"/>
            <ellipse cx="100" cy="96" rx="58" ry="16" fill="${frosting.hex}" stroke="${outline}" stroke-width="3.4"/>
            <path d="M62,92 Q86,84 114,85" fill="none" stroke="#FFFFFF" stroke-width="3.4" stroke-linecap="round" opacity="0.75"/>
            ${type === 'birthday_cream_cake' ? `<path d="M42,126 Q100,136 158,126" fill="none" stroke="#FF4D6D" stroke-width="6"/>` : ''}
            ${nozzle === 'piped' ? `
              <circle cx="50" cy="103" r="6.5" fill="${frosting.shadow}" stroke="${outline}" stroke-width="2"/><circle cx="67" cy="108" r="6.5" fill="${frosting.shadow}" stroke="${outline}" stroke-width="2"/>
              <circle cx="84" cy="111" r="6.5" fill="${frosting.shadow}" stroke="${outline}" stroke-width="2"/><circle cx="100" cy="112" r="6.5" fill="${frosting.shadow}" stroke="${outline}" stroke-width="2"/>
              <circle cx="116" cy="111" r="6.5" fill="${frosting.shadow}" stroke="${outline}" stroke-width="2"/><circle cx="133" cy="108" r="6.5" fill="${frosting.shadow}" stroke="${outline}" stroke-width="2"/>
              <circle cx="150" cy="103" r="6.5" fill="${frosting.shadow}" stroke="${outline}" stroke-width="2"/>
            ` : ''}
            ${nozzle === 'swirl' ? `<circle cx="100" cy="84" r="14" fill="${frosting.hex}" stroke="${outline}" stroke-width="2.8"/><path d="M92,84 Q100,74 108,84" fill="none" stroke="${frosting.shadow}" stroke-width="2.4"/>` : ''}
          `;
        }
      }
    } else if (shape === 'cookie_heart') {
      topZoneY = 92;
      baseSvg = `
        <path d="M100,165 C100,165 40,134 40,95 C40,73 56,60 74,60 C87,60 95,67 100,76 C105,67 113,60 126,60 C144,60 160,73 160,95 C160,134 100,165 100,165 Z" fill="${bodyColor}" stroke="${outline}" stroke-width="3.6" stroke-linejoin="round"/>
      `;
      if (frostingApplied) {
        frostingSvg = `<path d="M100,149 C100,149 54,125 54,96 C54,81 65,73 77,73 C87,73 95,79 100,87 C105,79 113,73 123,73 C135,73 146,81 146,96 C146,125 100,149 100,149 Z" fill="${frosting.hex}" stroke="${outline}" stroke-width="2.8"/>`;
      }
    } else if (shape === 'cookie_star') {
      topZoneY = 92;
      baseSvg = `
        <polygon points="100,52 116,88 156,92 126,119 135,158 100,138 65,158 74,119 44,92 84,88" fill="${bodyColor}" stroke="${outline}" stroke-width="3.6" stroke-linejoin="round"/>
      `;
      if (frostingApplied) {
        frostingSvg = `<polygon points="100,68 111,94 139,97 118,116 124,143 100,129 76,143 82,116 61,97 89,94" fill="${frosting.hex}" stroke="${outline}" stroke-width="2.6" stroke-linejoin="round"/>`;
      }
    } else if (shape === 'cookie_ginger') {
      topZoneY = 84;
      baseSvg = `
        <circle cx="100" cy="68" r="22" fill="${bodyColor}" stroke="${outline}" stroke-width="3.4"/>
        <path d="M82,86 L56,88 C47,89 45,103 55,105 L76,106 L74,132 L62,155 C58,165 73,170 79,160 L93,142 L107,142 L121,160 C127,170 142,165 138,155 L126,132 L124,106 L145,105 C155,103 153,89 144,88 L118,86 Z" fill="${bodyColor}" stroke="${outline}" stroke-width="3.4" stroke-linejoin="round"/>
        <circle cx="92" cy="64" r="2.4" fill="${outline}"/><circle cx="108" cy="64" r="2.4" fill="${outline}"/>
        <path d="M92,74 Q100,81 108,74" fill="none" stroke="${outline}" stroke-width="2.4" stroke-linecap="round"/>
      `;
      if (frostingApplied) {
        frostingSvg = `
          <circle cx="100" cy="112" r="4" fill="${frosting.hex}" stroke="${outline}" stroke-width="1.8"/>
          <circle cx="100" cy="126" r="4" fill="${frosting.hex}" stroke="${outline}" stroke-width="1.8"/>
          <path d="M59,90 L61,104 M141,90 L139,104" stroke="${frosting.hex}" stroke-width="5" stroke-linecap="round"/>
        `;
      }
    } else if (shape === 'cookie') {
      topZoneY = 98;
      baseSvg = `
        <path d="M98,66 C114,65 127,70 136,78 C129,84 131,93 139,96 C135,103 139,111 147,112 C153,122 154,135 150,147 C144,163 125,172 100,173 C68,174 44,151 44,119 C44,87 68,67 98,66 Z" fill="${bodyColor}" stroke="${outline}" stroke-width="3.6" stroke-linejoin="round"/>
        ${type === 'cookie_butter'
          ? `<circle cx="100" cy="119" r="32" fill="none" stroke="${rimColor}" stroke-width="4" stroke-dasharray="6,6"/><circle cx="100" cy="119" r="10" fill="${rimColor}" stroke="${outline}" stroke-width="2.2"/>`
          : `<circle cx="74" cy="101" r="6.5" fill="${rimColor}" stroke="${outline}" stroke-width="2.4"/><circle cx="106" cy="96" r="5.5" fill="${rimColor}" stroke="${outline}" stroke-width="2.4"/><circle cx="70" cy="136" r="6" fill="${rimColor}" stroke="${outline}" stroke-width="2.4"/><circle cx="105" cy="132" r="7" fill="${rimColor}" stroke="${outline}" stroke-width="2.4"/>`}
      `;
      if (frostingApplied) {
        if (nozzle === 'drizzle' || type === 'cookie_choco_filled') {
          frostingSvg = `<path d="M58,104 Q94,88 128,104 M54,122 Q94,108 134,124 M62,140 Q94,128 126,142" fill="none" stroke="${frosting.hex}" stroke-width="7.5" stroke-linecap="round"/>`;
        } else {
          frostingSvg = `<circle cx="96" cy="122" r="32" fill="${frosting.hex}" stroke="${outline}" stroke-width="3"/>`;
        }
      }
    } else if (shape === 'croissant') {
      topZoneY = 96;
      baseSvg = `
        <path d="M36,144 C32,102 64,74 100,74 C136,74 168,102 164,144 C150,150 138,140 126,133 C114,140 86,140 74,133 C62,140 50,150 36,144 Z" fill="${bodyColor}" stroke="${outline}" stroke-width="3.6" stroke-linejoin="round"/>
        <path d="M74,77 Q66,104 74,133 M126,77 Q134,104 126,133 M54,94 Q50,115 56,138 M146,94 Q150,115 144,138" fill="none" stroke="${outline}" stroke-width="2.8" stroke-linecap="round"/>
      `;
      if (frostingApplied) {
        frostingSvg = `<path d="M56,105 Q100,78 144,105" fill="none" stroke="${frosting.hex}" stroke-width="9" stroke-linecap="round"/>`;
      }
    } else if (shape === 'eclair') {
      topZoneY = 96;
      baseSvg = `
        <rect x="34" y="102" width="132" height="52" rx="26" fill="${bodyColor}" stroke="${outline}" stroke-width="3.6"/>
      `;
      if (frostingApplied) {
        frostingSvg = `
          <path d="M38,116 C38,94 64,88 100,88 C136,88 162,94 162,116 C152,126 140,117 128,125 C116,132 106,118 94,126 C82,133 70,118 58,125 C46,130 38,122 38,116 Z" fill="${frosting.hex}" stroke="${outline}" stroke-width="3.2"/>
          <path d="M62,100 L78,112 M92,100 L108,112 M122,100 L138,112" stroke="#FFFDF9" stroke-width="3.4" stroke-linecap="round" opacity="0.8"/>
        `;
      }
    } else if (shape === 'tiramisu') {
      topZoneY = 82;
      baseSvg = `
        <polygon points="34,94 94,64 166,88 106,118" fill="${rimColor}" stroke="${outline}" stroke-width="3.4" stroke-linejoin="round"/>
        <path d="M34,94 L34,148 L106,170 L106,118 Z" fill="${bodyColor}" stroke="${outline}" stroke-width="3.4" stroke-linejoin="round"/>
        <path d="M106,118 L106,170 L166,140 L166,88 Z" fill="${rimColor}" stroke="${outline}" stroke-width="3.4" stroke-linejoin="round"/>
        <path d="M34,121 L106,144 L166,114" fill="none" stroke="#FFFDF9" stroke-width="6"/>
      `;
      if (frostingApplied) {
        frostingSvg = `
          <polygon points="38,94 94,68 162,88 106,114" fill="${frosting.hex}" stroke="${outline}" stroke-width="2.6"/>
          <circle cx="88" cy="86" r="8" fill="${frosting.shadow}" stroke="${outline}" stroke-width="2"/>
          <circle cx="110" cy="90" r="8" fill="${frosting.shadow}" stroke="${outline}" stroke-width="2"/>
        `;
      }
    } else if (shape === 'cheesecake') {
      topZoneY = 84;
      baseSvg = `
        <polygon points="40,94 156,66 158,104 40,110" fill="${rimColor}" stroke="${outline}" stroke-width="3.4" stroke-linejoin="round"/>
        <path d="M40,110 L40,158 L158,140 L158,104 Z" fill="${bodyColor}" stroke="${outline}" stroke-width="3.4" stroke-linejoin="round"/>
        <path d="M40,145 L158,128" stroke="#C68B59" stroke-width="7"/>
      `;
      if (frostingApplied) {
        frostingSvg = `<polygon points="42,95 154,68 156,104 42,109" fill="${frosting.hex}" stroke="${outline}" stroke-width="2.8" stroke-linejoin="round"/>`;
      }
    } else if (shape === 'pudding') {
      topZoneY = 82;
      baseSvg = `
        <path d="M52,158 L66,86 C72,76 128,76 134,86 L148,158 Z" fill="${bodyColor}" stroke="${outline}" stroke-width="3.6" stroke-linejoin="round"/>
        ${type === 'fruit_jelly'
          ? `<rect x="78" y="112" width="16" height="16" rx="3" fill="#FF8FAB" stroke="${outline}" stroke-width="2"/><circle cx="118" cy="126" r="9" fill="#FFD166" stroke="${outline}" stroke-width="2"/>`
          : ''}
      `;
      if (frostingApplied) {
        frostingSvg = `
          <path d="M64,96 C74,110 86,93 98,107 C110,120 120,96 136,102 L134,86 C128,76 72,76 66,86 Z" fill="${frosting.hex}" stroke="${outline}" stroke-width="3.2" stroke-linejoin="round"/>
        `;
      }
    } else if (shape === 'cream_puff') {
      topZoneY = 88;
      baseSvg = `
        <path d="M44,122 C42,82 70,66 100,66 C130,66 158,82 156,122 Z" fill="${bodyColor}" stroke="${outline}" stroke-width="3.5" stroke-linejoin="round"/>
        <path d="M44,126 C42,154 68,166 100,166 C132,166 158,154 156,126 Z" fill="${rimColor}" stroke="${outline}" stroke-width="3.5" stroke-linejoin="round"/>
      `;
      if (frostingApplied) {
        frostingSvg = `
          <path d="M40,122 Q54,136 70,124 Q86,138 100,124 Q116,138 132,124 Q148,136 160,122 Z" fill="${frosting.hex}" stroke="${outline}" stroke-width="3"/>
        `;
      }
    } else if (shape === 'cake_pop') {
      topZoneY = 74;
      baseSvg = `
        <line x1="100" y1="116" x2="100" y2="170" stroke="#FFFDF9" stroke-width="7" stroke-linecap="round"/>
        <line x1="100" y1="116" x2="100" y2="170" stroke="${outline}" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="100" cy="86" r="36" fill="${bodyColor}" stroke="${outline}" stroke-width="3.6"/>
      `;
      if (frostingApplied) {
        frostingSvg = `
          <path d="M64,86 C64,62 84,50 100,50 C116,50 136,62 136,86 C126,95 114,82 100,94 C86,82 74,95 64,86 Z" fill="${frosting.hex}" stroke="${outline}" stroke-width="3.2"/>
        `;
      }
    } else if (shape === 'parfait') {
      topZoneY = 66;
      baseSvg = `
        <path d="M62,82 L76,154 Q100,164 124,154 L138,82 Z" fill="${bodyColor}" stroke="${outline}" stroke-width="3.5" stroke-linejoin="round"/>
        <path d="M88,158 L80,170 L120,170 L112,158" fill="#E2ECE9" stroke="${outline}" stroke-width="3"/>
        <path d="M66,106 Q100,116 134,106 M70,130 Q100,140 130,130" fill="none" stroke="#FF8FAB" stroke-width="4.5"/>
      `;
      if (frostingApplied) {
        frostingSvg = `
          <path d="M63,82 C63,60 80,52 100,52 C120,52 137,60 137,82 Z" fill="${frosting.hex}" stroke="${outline}" stroke-width="3.2"/>
          <path d="M78,56 C78,44 92,38 100,38 C108,38 122,44 122,56 Z" fill="${frosting.hex}" stroke="${outline}" stroke-width="3"/>
        `;
      }
    } else if (shape === 'macaron') {
      topZoneY = 92;
      baseSvg = `
        <path d="M44,129 C44,154 70,163 100,163 C130,163 156,154 156,129 Z" fill="${bodyColor}" stroke="${outline}" stroke-width="3.5" stroke-linejoin="round"/>
        <path d="M46,129 Q55,134 64,129 Q74,134 84,129 Q94,134 104,129 Q114,134 124,129 Q134,134 144,129 Q152,134 155,129" fill="${bodyColor}" stroke="${outline}" stroke-width="2.8" stroke-linecap="round"/>
        <path d="M47,114 C47,109 153,109 153,114 L153,128 C144,133 135,128 127,131 C119,134 110,128 102,131 C94,134 85,128 77,131 C69,134 60,128 52,131 C48,132 47,129 47,126 Z" fill="${frostingApplied ? frosting.hex : '#FFF5E1'}" stroke="${outline}" stroke-width="3.2" stroke-linejoin="round"/>
        <path d="M44,111 C44,76 70,66 100,66 C130,66 156,76 156,111 C148,116 140,111 132,115 C124,118 116,111 108,115 C100,118 92,111 84,115 C76,118 68,111 60,115 C52,117 46,114 44,111 Z" fill="${bodyColor}" stroke="${outline}" stroke-width="3.5" stroke-linejoin="round"/>
        <path d="M64,87 Q82,74 106,75" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" opacity="0.8"/>
      `;
      if (frostingApplied) {
        frostingSvg = `<path d="M60,101 Q100,86 140,101" fill="none" stroke="${frosting.hex}" stroke-width="7" stroke-linecap="round"/>`;
      }
    } else if (shape === 'tart') {
      topZoneY = 92;
      baseSvg = `
        <path d="M44,112 L56,154 Q100,166 144,154 L156,112 Z" fill="${bodyColor}" stroke="${outline}" stroke-width="3.5" stroke-linejoin="round"/>
        <path d="M52,112 Q60,120 68,112 Q76,120 84,112 Q92,120 100,112 Q108,120 116,112 Q124,120 132,112 Q140,120 148,112" fill="none" stroke="${rimColor}" stroke-width="3.5" stroke-linecap="round"/>
        <ellipse cx="100" cy="112" rx="56" ry="16" fill="${rimColor}" stroke="${outline}" stroke-width="3.4"/>
      `;
      if (frostingApplied) {
        frostingSvg = `
          <ellipse cx="100" cy="112" rx="48" ry="13" fill="${frosting.hex}" stroke="${outline}" stroke-width="2.8"/>
          ${nozzle === 'swirl' ? `<path d="M70,110 Q100,84 130,110" fill="${frosting.hex}" stroke="${outline}" stroke-width="3"/>` : ''}
        `;
      }
    } else if (shape === 'swiss_roll') {
      topZoneY = 90;
      baseSvg = `
        <path d="M54,96 L132,96 C152,96 154,152 132,152 L54,152 Z" fill="${bodyColor}" stroke="${outline}" stroke-width="3.5" stroke-linejoin="round"/>
        <ellipse cx="54" cy="124" rx="20" ry="28" fill="${rimColor}" stroke="${outline}" stroke-width="3.5"/>
        <path d="M54,124 m-12,0 a12,16 0 1,0 24,0 a8,11 0 1,0 -16,0" fill="none" stroke="#FFFDF9" stroke-width="4.5" stroke-linecap="round"/>
      `;
      if (frostingApplied) {
        frostingSvg = `
          <path d="M56,96 L132,96 Q146,105 138,115 Q122,125 110,112 Q96,126 84,112 Q70,124 56,111 Z" fill="${frosting.hex}" stroke="${outline}" stroke-width="3.2" stroke-linejoin="round"/>
        `;
      }
    } else if (shape === 'tiered_cake') {
      topZoneY = 62;
      baseSvg = `
        <!-- Bottom Tier -->
        <path d="M36,114 L164,114 L164,158 C164,166 136,172 100,172 C64,172 36,166 36,158 Z" fill="${bodyColor}" stroke="${outline}" stroke-width="3.5" stroke-linejoin="round"/>
        <ellipse cx="100" cy="114" rx="64" ry="15" fill="${rimColor}" stroke="${outline}" stroke-width="3.4"/>
        <!-- Top Tier -->
        <path d="M56,72 L144,72 L144,111 C144,118 125,123 100,123 C75,123 56,118 56,111 Z" fill="${bodyColor}" stroke="${outline}" stroke-width="3.5" stroke-linejoin="round"/>
        <ellipse cx="100" cy="72" rx="44" ry="12" fill="${rimColor}" stroke="${outline}" stroke-width="3.4"/>
      `;
      if (frostingApplied) {
        frostingSvg = `
          <path d="M36,114 L164,114 L164,158 C164,166 136,172 100,172 C64,172 36,166 36,158 Z" fill="${frosting.hex}" stroke="${outline}" stroke-width="3.4" stroke-linejoin="round"/>
          <ellipse cx="100" cy="114" rx="64" ry="15" fill="${frosting.hex}" stroke="${outline}" stroke-width="3.2"/>
          <path d="M56,72 L144,72 L144,111 C144,118 125,123 100,123 C75,123 56,118 56,111 Z" fill="${frosting.hex}" stroke="${outline}" stroke-width="3.4" stroke-linejoin="round"/>
          <ellipse cx="100" cy="72" rx="44" ry="12" fill="${frosting.hex}" stroke="${outline}" stroke-width="3.2"/>
          <path d="M70,69 Q88,63 108,64" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity="0.75"/>
          ${nozzle === 'piped' ? `
            <circle cx="45" cy="121" r="5.5" fill="${frosting.shadow}" stroke="${outline}" stroke-width="1.8"/><circle cx="63" cy="125" r="5.5" fill="${frosting.shadow}" stroke="${outline}" stroke-width="1.8"/>
            <circle cx="81" cy="128" r="5.5" fill="${frosting.shadow}" stroke="${outline}" stroke-width="1.8"/><circle cx="100" cy="129" r="5.5" fill="${frosting.shadow}" stroke="${outline}" stroke-width="1.8"/>
            <circle cx="119" cy="128" r="5.5" fill="${frosting.shadow}" stroke="${outline}" stroke-width="1.8"/><circle cx="137" cy="125" r="5.5" fill="${frosting.shadow}" stroke="${outline}" stroke-width="1.8"/>
            <circle cx="155" cy="121" r="5.5" fill="${frosting.shadow}" stroke="${outline}" stroke-width="1.8"/>
          ` : ''}
        `;
      }
    }

    // --- TOPPINGS RENDERED AT EXACT X,Y ---
    const toppingsSvg = toppings.map((t, idx) => renderToppingItem(t, idx)).join('');

    // --- ACCESSORIES RENDERED AT EXACT X,Y ---
    const accSvg = accessories.map((a, idx) => renderAccessoryItem(a, idx, topZoneY)).join('');

    return `
      <svg viewBox="0 0 200 200" width="${size}" height="${size}" class="cake-svg" xmlns="http://www.w3.org/2000/svg">
        <!-- Soft Shadow & Cute Pastel Ceramic Plate -->
        <ellipse cx="100" cy="176" rx="76" ry="13" fill="rgba(74,53,49,0.12)"/>
        <ellipse cx="100" cy="172" rx="76" ry="14" fill="#FFFDF9" stroke="${outline}" stroke-width="3"/>
        <ellipse cx="100" cy="170" rx="60" ry="9" fill="#FFF3E6"/>
        <g transform="translate(0, ${(1 - scaleY) * 85}) scale(1, ${scaleY})">
          ${baseSvg}
          ${frostingSvg}
          ${charOverlay}
        </g>
        ${toppingsSvg}
        ${accSvg}
      </svg>
    `;
  }

  function renderToppingItem(t, idx) {
    const x = t.x ?? (76 + (idx % 4) * 16);
    const y = t.y ?? (92 + Math.floor(idx / 4) * 12);
    const type = t.type;

    if (type === 'strawberry') {
      return `<g transform="translate(${x},${y})" class="placed-item" data-idx="${idx}">
        <path d="M0,-8 C7,-8 9,0 0,10 C-9,0 -7,-8 0,-8 Z" fill="#FF4D6D" stroke="#4A3531" stroke-width="1.5"/>
        <path d="M-5,-8 L0,-4 L5,-8 L2,-11 L-2,-11 Z" fill="#52B788" stroke="#4A3531" stroke-width="1"/>
        <circle cx="-2" cy="-1" r="0.8" fill="#FFE5EC"/><circle cx="2" cy="1" r="0.8" fill="#FFE5EC"/><circle cx="0" cy="4" r="0.8" fill="#FFE5EC"/>
      </g>`;
    }
    if (type === 'blueberry') {
      return `<g transform="translate(${x},${y})" class="placed-item" data-idx="${idx}">
        <circle cx="0" cy="0" r="6.5" fill="#5E60CE" stroke="#3A0CA3" stroke-width="1.5"/>
        <circle cx="-2" cy="-2" r="1.5" fill="#BDB2FF"/>
      </g>`;
    }
    if (type === 'cherry') {
      return `<g transform="translate(${x},${y})" class="placed-item" data-idx="${idx}">
        <path d="M0,-4 Q4,-13 8,-14" fill="none" stroke="#40916C" stroke-width="1.8" stroke-linecap="round"/>
        <circle cx="0" cy="2" r="6.5" fill="#D90429" stroke="#4A3531" stroke-width="1.5"/>
        <circle cx="-2" cy="0" r="1.6" fill="#FFCCD5"/>
      </g>`;
    }
    if (type === 'chocochip') {
      return `<g transform="translate(${x},${y})" class="placed-item" data-idx="${idx}">
        <path d="M-5,4 L0,-6 L5,4 Q0,7 -5,4 Z" fill="#4A2511" stroke="#2B1408" stroke-width="1.2"/>
      </g>`;
    }
    if (type === 'candy') {
      const colors = ['#FF85A1', '#FFD166', '#72EFDD', '#C77DFF'];
      const col = colors[idx % colors.length];
      return `<g transform="translate(${x},${y})" class="placed-item" data-idx="${idx}">
        <circle cx="0" cy="0" r="6" fill="${col}" stroke="#4A3531" stroke-width="1.4"/>
        <path d="M-3,0 A3,3 0 0,1 3,0" fill="none" stroke="#FFF" stroke-width="1.5"/>
      </g>`;
    }
    if (type === 'cookie_crumb') {
      return `<g transform="translate(${x},${y})" class="placed-item" data-idx="${idx}">
        <polygon points="-5,-2 0,-6 6,-1 3,5 -4,4" fill="#C68B59" stroke="#4A3531" stroke-width="1.2"/>
        <circle cx="5" cy="5" r="2.2" fill="#8D5524"/>
      </g>`;
    }
    if (type === 'marshmallow') {
      return `<g transform="translate(${x},${y})" class="placed-item" data-idx="${idx}">
        <rect x="-6" y="-5" width="12" height="10" rx="4" fill="#FFF0F5" stroke="#FFACC2" stroke-width="1.5"/>
      </g>`;
    }
    if (type === 'sprinkles') {
      return `<g transform="translate(${x},${y})" class="placed-item" data-idx="${idx}">
        <rect x="-6" y="-2" width="6" height="2.5" rx="1.2" transform="rotate(-25)" fill="#FF5D8F"/>
        <rect x="1" y="1" width="6" height="2.5" rx="1.2" transform="rotate(30)" fill="#4EA8DE"/>
        <rect x="-2" y="3" width="6" height="2.5" rx="1.2" transform="rotate(10)" fill="#FFD166"/>
      </g>`;
    }
    if (type === 'sugar_flower') {
      return `<g transform="translate(${x},${y})" class="placed-item" data-idx="${idx}">
        <circle cx="0" cy="-4.5" r="3.8" fill="#FFB3C6" stroke="#4A3531" stroke-width="1"/>
        <circle cx="4.5" cy="0" r="3.8" fill="#FFB3C6" stroke="#4A3531" stroke-width="1"/>
        <circle cx="0" cy="4.5" r="3.8" fill="#FFB3C6" stroke="#4A3531" stroke-width="1"/>
        <circle cx="-4.5" cy="0" r="3.8" fill="#FFB3C6" stroke="#4A3531" stroke-width="1"/>
        <circle cx="0" cy="0" r="2.8" fill="#FFD166"/>
      </g>`;
    }
    return '';
  }

  function renderAccessoryItem(a, idx, defaultY) {
    const x = a.x ?? (84 + (idx % 5) * 10);
    const y = a.y ?? (defaultY - 12);
    const type = a.type;

    if (type === 'candle') {
      return `<g transform="translate(${x},${y})" class="placed-acc" data-acc-idx="${idx}">
        <rect x="-3" y="-18" width="6" height="22" rx="2" fill="#FFF0F5" stroke="#FF5D8F" stroke-width="1.4"/>
        <line x1="-3" y1="-10" x2="3" y2="-6" stroke="#FF5D8F" stroke-width="1.5"/>
        <line x1="-3" y1="-2" x2="3" y2="2" stroke="#FF5D8F" stroke-width="1.5"/>
        <path d="M0,-28 C3,-24 3,-19 0,-19 C-3,-19 -3,-24 0,-28 Z" fill="#FFB703"/>
        <circle cx="0" cy="-22" r="1.4" fill="#FFF3B0"/>
      </g>`;
    }
    if (type === 'star') {
      return `<g transform="translate(${x},${y})" class="placed-acc" data-acc-idx="${idx}">
        <polygon points="0,-10 3,-3 10,-3 4,2 6,9 0,5 -6,9 -4,2 -10,-3 -3,-3" fill="#FFD166" stroke="#4A3531" stroke-width="1.4"/>
      </g>`;
    }
    if (type === 'heart') {
      return `<g transform="translate(${x},${y})" class="placed-acc" data-acc-idx="${idx}">
        <path d="M0,7 C-10,0 -10,-9 -4,-9 C-1,-9 0,-6 0,-4 C0,-6 1,-9 4,-9 C10,-9 10,0 0,7 Z" fill="#FF4D6D" stroke="#4A3531" stroke-width="1.4"/>
      </g>`;
    }
    if (type === 'ribbon') {
      return `<g transform="translate(${x},${y})" class="placed-acc" data-acc-idx="${idx}">
        <path d="M0,0 L-12,-7 L-12,7 Z" fill="#FF758F" stroke="#4A3531" stroke-width="1.3"/>
        <path d="M0,0 L12,-7 L12,7 Z" fill="#FF758F" stroke="#4A3531" stroke-width="1.3"/>
        <circle cx="0" cy="0" r="3.5" fill="#FF4D6D" stroke="#4A3531" stroke-width="1.3"/>
      </g>`;
    }
    if (type === 'sign') {
      const label = a.text || 'Happy Birthday';
      return `<g transform="translate(${x},${y - 8})" class="placed-acc" data-acc-idx="${idx}">
        <line x1="0" y1="6" x2="0" y2="18" stroke="#D4A373" stroke-width="2.5"/>
        <rect x="-38" y="-12" width="76" height="20" rx="8" fill="#FFFDF9" stroke="#FF758F" stroke-width="2"/>
        <text x="0" y="1" font-size="8.5" font-weight="bold" fill="#D90429" text-anchor="middle" font-family="sans-serif">${label}</text>
      </g>`;
    }
    if (type === 'topper_stick') {
      return `<g transform="translate(${x},${y - 6})" class="placed-acc" data-acc-idx="${idx}">
        <line x1="0" y1="0" x2="0" y2="18" stroke="#D4A373" stroke-width="2.2"/>
        <circle cx="0" cy="-6" r="8" fill="#A8E6CF" stroke="#4A3531" stroke-width="1.5"/>
        <text x="0" y="-3" font-size="9" text-anchor="middle">✨</text>
      </g>`;
    }
    return '';
  }

  // --------------------------------------------------------------------------
  // 3. INGREDIENT CANVAS ICON PLACEHOLDER (Painted by SDCanvasIcons)
  // --------------------------------------------------------------------------
  function renderIngredient(id, size = 48) {
    return `<canvas class="ing-canvas-icon" data-ing="${id}" width="96" height="96" style="width:${size}px;height:${size}px;display:block;flex-shrink:0;"></canvas>`;
  }

  // --------------------------------------------------------------------------
  // 4. PACKAGING BOX RENDERER
  // --------------------------------------------------------------------------
  function renderBox(pkg, cakeState, size = 230) {
    const p = pkg || {};
    const box = BOX_COLORS.find(b => b.id === p.boxColor) || BOX_COLORS[0];
    const ribbon = RIBBON_COLORS.find(r => r.id === p.ribbonColor) || RIBBON_COLORS[0];
    const closed = !!p.closed;

    const patternOverlay = box.pattern
      ? `<circle cx="65" cy="125" r="4" fill="#FFF" opacity="0.6"/>
         <circle cx="95" cy="145" r="4" fill="#FFF" opacity="0.6"/>
         <circle cx="135" cy="130" r="4" fill="#FFF" opacity="0.6"/>
         <circle cx="155" cy="150" r="4" fill="#FFF" opacity="0.6"/>`
      : '';

    let stickerSvg = '';
    if (p.sticker && p.sticker !== 'none') {
      const emoji = p.sticker === 'heart' ? '💖' : p.sticker === 'star' ? '⭐' : p.sticker === 'flower' ? '🌸' : '👑';
      stickerSvg = `<circle cx="152" cy="136" r="12" fill="#FFF" stroke="${box.border}" stroke-width="1.8"/>
                    <text x="152" y="141" font-size="14" text-anchor="middle">${emoji}</text>`;
    }

    let cardSvg = '';
    if (p.card && p.card !== 'none') {
      cardSvg = `<g transform="translate(52, 126) rotate(-12)">
        <rect x="0" y="0" width="32" height="22" rx="4" fill="#FFFDF9" stroke="${ribbon.hex}" stroke-width="1.8"/>
        <line x1="5" y1="8" x2="27" y2="8" stroke="#FFB3C6" stroke-width="2"/>
        <line x1="5" y1="14" x2="20" y2="14" stroke="#B8E0D2" stroke-width="2"/>
      </g>`;
    }

    const innerCake = !closed && cakeState
      ? `<g transform="translate(46, 38) scale(0.54)">${renderCake(cakeState, 200)}</g>`
      : '';

    const lid = closed
      ? `
        <!-- Closed Lid -->
        <rect x="34" y="88" width="132" height="22" rx="6" fill="${box.hex}" stroke="#4A3531" stroke-width="2.5"/>
        <!-- Ribbon Vertical & Horizontal -->
        <rect x="92" y="88" width="16" height="84" fill="${ribbon.hex}" stroke="#4A3531" stroke-width="1.5"/>
        <!-- Bow on top -->
        <path d="M100,88 C80,68 70,84 88,90 Z" fill="${ribbon.hex}" stroke="#4A3531" stroke-width="1.8"/>
        <path d="M100,88 C120,68 130,84 112,90 Z" fill="${ribbon.hex}" stroke="#4A3531" stroke-width="1.8"/>
        <circle cx="100" cy="88" r="6" fill="${ribbon.hex}" stroke="#4A3531" stroke-width="1.8"/>
      `
      : `
        <!-- Open Lid tilted behind -->
        <polygon points="34,98 46,60 154,60 166,98" fill="${box.hex}" stroke="#4A3531" stroke-width="2.3"/>
      `;

    return `
      <svg viewBox="0 0 200 190" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="100" cy="176" rx="74" ry="9" fill="rgba(74,53,49,0.12)"/>
        ${!closed ? lid : ''}
        ${innerCake}
        <!-- Box Base -->
        <rect x="38" y="102" width="124" height="70" rx="8" fill="${box.hex}" stroke="#4A3531" stroke-width="2.5"/>
        ${patternOverlay}
        ${closed ? lid : `<rect x="92" y="102" width="16" height="70" fill="${ribbon.hex}" opacity="0.85"/>`}
        ${cardSvg}
        ${stickerSvg}
      </svg>
    `;
  }

  return {
    getCakeAssetPath,
    renderCharacter,
    renderCake,
    renderIngredient,
    renderBox
  };
})();

