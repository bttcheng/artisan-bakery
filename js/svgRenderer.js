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

    const isHappy = mood === 'happy' || mood === 'delighted';
    const isAngry = mood === 'angry' || mood === 'disappointed';
    const isImpatient = mood === 'impatient';

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
    }

    // Arms pose (crossed when impatient/angry, waving when happy/wave)
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
    } else if (wave || mood === 'delighted') {
      arms = `
        <path d="M31,84 Q20,96 27,108" fill="none" stroke="${c.skinColor}" stroke-width="8" stroke-linecap="round"/>
        <path d="M79,84 Q96,70 92,55" fill="none" stroke="${c.skinColor}" stroke-width="8" stroke-linecap="round"/>
        <circle cx="92" cy="54" r="5" fill="${c.skinColor}" stroke="#4A3531" stroke-width="1.5"/>
      `;
    }

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
      <svg viewBox="0 0 110 135" width="${width}" height="${height}" class="chibi-svg mood-${mood}" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="55" cy="126" rx="30" ry="6" fill="rgba(74,53,49,0.12)"/>
        ${partnerSvg}
        ${hairBack}
        <!-- Body / Outfit -->
        <path d="M32,80 Q55,74 78,80 L84,120 Q55,126 26,120 Z" fill="${c.outfitColor}" stroke="#4A3531" stroke-width="2.2" stroke-linejoin="round"/>
        <!-- Collar detail -->
        <path d="M43,78 Q55,88 67,78" fill="#FFFFFF" stroke="#4A3531" stroke-width="1.8"/>
        ${arms}
        <!-- Head -->
        <circle cx="55" cy="50" r="28" fill="${c.skinColor}" stroke="#4A3531" stroke-width="2.3"/>
        ${blush}
        ${eyes}
        ${brows}
        ${mouth}
        ${hairFront}
        ${accSvg}
        ${isHappy ? '<text x="86" y="25" font-size="14">✨</text>' : ''}
        ${isAngry ? '<text x="84" y="26" font-size="14">💢</text>' : ''}
      </svg>
    `;
  }

  // --------------------------------------------------------------------------
  // 2. DYNAMIC LAYERED CAKE RENDERER
  // --------------------------------------------------------------------------
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
        <circle cx="88" cy="118" r="10" fill="#1A110E" opacity="0.5"/>
        <circle cx="122" cy="126" r="13" fill="#1A110E" opacity="0.45"/>
        <path d="M80,78 Q75,62 84,50" stroke="#777" stroke-width="3" fill="none" opacity="0.6"/>
        <path d="M125,74 Q132,58 122,45" stroke="#777" stroke-width="3" fill="none" opacity="0.6"/>
      `;
    }

    let baseSvg = '';
    let frostingSvg = '';
    let topZoneY = 95;

    // --- BASE SHAPES ---
    if (type === 'cupcake') {
      topZoneY = 92;
      baseSvg = `
        <!-- Cupcake Liner -->
        <polygon points="62,115 138,115 126,168 74,168" fill="#FFD6E0" stroke="#4A3531" stroke-width="2.5" stroke-linejoin="round"/>
        <line x1="76" y1="115" x2="82" y2="168" stroke="#FFACC2" stroke-width="2"/>
        <line x1="92" y1="115" x2="94" y2="168" stroke="#FFACC2" stroke-width="2"/>
        <line x1="108" y1="115" x2="106" y2="168" stroke="#FFACC2" stroke-width="2"/>
        <line x1="124" y1="115" x2="118" y2="168" stroke="#FFACC2" stroke-width="2"/>
        <!-- Sponge dome -->
        <path d="M58,115 Q58,86 100,86 Q142,86 142,115 Z" fill="${bodyColor}" stroke="#4A3531" stroke-width="2.5"/>
      `;
      if (frostingApplied) {
        if (nozzle === 'swirl') {
          frostingSvg = `
            <path d="M54,112 C48,96 68,88 100,88 C132,88 152,96 146,112 C136,120 64,120 54,112 Z" fill="${frosting.hex}" stroke="#4A3531" stroke-width="2.3"/>
            <path d="M64,95 C60,80 78,72 100,72 C122,72 140,80 136,95 C124,102 76,102 64,95 Z" fill="${frosting.hex}" stroke="#4A3531" stroke-width="2.2"/>
            <path d="M77,77 C76,63 92,50 102,48 C108,56 122,64 123,77 C114,83 86,83 77,77 Z" fill="${frosting.hex}" stroke="#4A3531" stroke-width="2.2"/>
          `;
        } else if (nozzle === 'smooth') {
          frostingSvg = `
            <path d="M55,113 Q56,74 100,74 Q144,74 145,113 Q125,121 100,118 Q75,121 55,113 Z" fill="${frosting.hex}" stroke="#4A3531" stroke-width="2.3"/>
          `;
        } else if (nozzle === 'piped') {
          frostingSvg = `
            <path d="M56,112 Q58,78 100,78 Q142,78 144,112 Z" fill="${frosting.hex}" stroke="#4A3531" stroke-width="2.2"/>
            <circle cx="64" cy="112" r="8" fill="${frosting.hex}" stroke="#4A3531" stroke-width="1.8"/>
            <circle cx="82" cy="114" r="8" fill="${frosting.hex}" stroke="#4A3531" stroke-width="1.8"/>
            <circle cx="100" cy="115" r="8" fill="${frosting.hex}" stroke="#4A3531" stroke-width="1.8"/>
            <circle cx="118" cy="114" r="8" fill="${frosting.hex}" stroke="#4A3531" stroke-width="1.8"/>
            <circle cx="136" cy="112" r="8" fill="${frosting.hex}" stroke="#4A3531" stroke-width="1.8"/>
          `;
        } else {
          frostingSvg = `
            <path d="M56,110 Q60,82 100,82 Q140,82 144,110 Q136,123 128,112 Q120,125 110,112 Q100,126 90,112 Q80,124 72,112 Q64,122 56,110 Z" fill="${frosting.hex}" stroke="#4A3531" stroke-width="2.2"/>
          `;
        }
      }
    } else if (type === 'donut') {
      topZoneY = 108;
      baseSvg = `
        <ellipse cx="100" cy="122" rx="58" ry="44" fill="${bodyColor}" stroke="#4A3531" stroke-width="2.6"/>
        <ellipse cx="100" cy="126" rx="56" ry="38" fill="none" stroke="${rimColor}" stroke-width="3" opacity="0.5"/>
        <ellipse cx="100" cy="122" rx="19" ry="13" fill="#FFFDF9" stroke="#4A3531" stroke-width="2.4"/>
      `;
      if (frostingApplied) {
        if (nozzle === 'drizzle') {
          frostingSvg = `
            <path d="M52,114 Q100,80 148,114" fill="none" stroke="${frosting.hex}" stroke-width="14" stroke-linecap="round"/>
            <path d="M48,125 Q72,108 100,136 Q128,108 152,125" fill="none" stroke="${frosting.hex}" stroke-width="10" stroke-linecap="round"/>
          `;
        } else {
          frostingSvg = `
            <path d="M44,118 C44,90 156,90 156,118 C156,136 142,146 132,138 C122,130 116,144 100,144 C84,144 78,130 68,138 C58,146 44,136 44,118 Z" fill="${frosting.hex}" stroke="#4A3531" stroke-width="2.2"/>
            <ellipse cx="100" cy="122" rx="19" ry="13" fill="#FFFDF9" stroke="#4A3531" stroke-width="2.2"/>
          `;
        }
      }
    } else if (type === 'round_cake') {
      topZoneY = 85;
      baseSvg = `
        <rect x="44" y="96" width="112" height="58" rx="12" fill="${bodyColor}" stroke="#4A3531" stroke-width="2.5"/>
        <ellipse cx="100" cy="96" rx="56" ry="18" fill="${rimColor}" stroke="#4A3531" stroke-width="2.5"/>
        <ellipse cx="100" cy="154" rx="56" ry="14" fill="${bodyColor}" stroke="#4A3531" stroke-width="2.5"/>
      `;
      if (frostingApplied) {
        if (nozzle === 'drizzle') {
          frostingSvg = `
            <ellipse cx="100" cy="96" rx="56" ry="18" fill="${frosting.hex}" stroke="#4A3531" stroke-width="2.2"/>
            <path d="M46,98 L46,120 Q53,132 60,115 Q68,135 76,112 Q86,128 96,115 Q106,134 116,114 Q128,130 138,116 Q148,128 154,114 L154,98 Z" fill="${frosting.hex}" stroke="#4A3531" stroke-width="2"/>
          `;
        } else {
          frostingSvg = `
            <rect x="44" y="96" width="112" height="58" rx="12" fill="${frosting.hex}" stroke="#4A3531" stroke-width="2.4"/>
            <ellipse cx="100" cy="96" rx="56" ry="18" fill="${frosting.hex}" stroke="#4A3531" stroke-width="2.4"/>
            ${nozzle === 'piped' ? `
              <circle cx="52" cy="103" r="6" fill="${frosting.shadow}"/><circle cx="68" cy="108" r="6" fill="${frosting.shadow}"/>
              <circle cx="84" cy="111" r="6" fill="${frosting.shadow}"/><circle cx="100" cy="112" r="6" fill="${frosting.shadow}"/>
              <circle cx="116" cy="111" r="6" fill="${frosting.shadow}"/><circle cx="132" cy="108" r="6" fill="${frosting.shadow}"/>
              <circle cx="148" cy="103" r="6" fill="${frosting.shadow}"/>
            ` : ''}
            ${nozzle === 'swirl' ? `
              <circle cx="100" cy="84" r="14" fill="${frosting.hex}" stroke="#4A3531" stroke-width="2"/>
              <path d="M92,84 Q100,74 108,84" fill="none" stroke="${frosting.shadow}" stroke-width="2"/>
            ` : ''}
          `;
        }
      }
    } else if (type === 'cookie') {
      topZoneY = 104;
      baseSvg = `
        <path d="M100,74 C128,74 150,94 150,120 C150,146 128,166 100,166 C72,166 50,146 50,120 C50,94 72,74 100,74 Z" fill="${bodyColor}" stroke="#4A3531" stroke-width="2.6"/>
        <circle cx="72" cy="105" r="3" fill="${rimColor}" opacity="0.6"/>
        <circle cx="128" cy="132" r="3.5" fill="${rimColor}" opacity="0.6"/>
        <circle cx="105" cy="144" r="2.8" fill="${rimColor}" opacity="0.6"/>
      `;
      if (frostingApplied) {
        if (nozzle === 'drizzle') {
          frostingSvg = `
            <path d="M62,102 Q100,88 138,104 M58,120 Q100,106 142,122 M66,138 Q100,126 134,140" fill="none" stroke="${frosting.hex}" stroke-width="7" stroke-linecap="round"/>
          `;
        } else {
          frostingSvg = `
            <circle cx="100" cy="120" r="36" fill="${frosting.hex}" stroke="#4A3531" stroke-width="2"/>
          `;
        }
      }
    } else if (type === 'macaron') {
      topZoneY = 96;
      baseSvg = `
        <ellipse cx="100" cy="136" rx="50" ry="18" fill="${bodyColor}" stroke="#4A3531" stroke-width="2.4"/>
        <rect x="52" y="114" width="96" height="22" rx="8" fill="${frostingApplied ? frosting.hex : '#FFF5E1'}" stroke="#4A3531" stroke-width="2.2"/>
        <ellipse cx="100" cy="108" rx="50" ry="20" fill="${bodyColor}" stroke="#4A3531" stroke-width="2.4"/>
      `;
      if (frostingApplied) {
        frostingSvg = `<path d="M60,104 Q100,90 140,104" fill="none" stroke="${frosting.hex}" stroke-width="7" stroke-linecap="round"/>`;
      }
    } else if (type === 'tart') {
      topZoneY = 96;
      baseSvg = `
        <path d="M46,112 L58,154 Q100,164 142,154 L154,112 Z" fill="${bodyColor}" stroke="#4A3531" stroke-width="2.5" stroke-linejoin="round"/>
        <ellipse cx="100" cy="112" rx="54" ry="16" fill="${rimColor}" stroke="#4A3531" stroke-width="2.5"/>
      `;
      if (frostingApplied) {
        frostingSvg = `
          <ellipse cx="100" cy="112" rx="46" ry="13" fill="${frosting.hex}" stroke="#4A3531" stroke-width="2"/>
          ${nozzle === 'swirl' ? `<path d="M72,110 Q100,88 128,110" fill="${frosting.hex}" stroke="#4A3531" stroke-width="2"/>` : ''}
        `;
      }
    } else if (type === 'swiss_roll') {
      topZoneY = 94;
      baseSvg = `
        <path d="M54,96 L132,96 C152,96 154,152 132,152 L54,152 Z" fill="${bodyColor}" stroke="#4A3531" stroke-width="2.5"/>
        <ellipse cx="54" cy="124" rx="20" ry="28" fill="${rimColor}" stroke="#4A3531" stroke-width="2.5"/>
        <path d="M54,124 m-12,0 a12,16 0 1,0 24,0 a8,11 0 1,0 -16,0" fill="none" stroke="#FFFDF9" stroke-width="4" stroke-linecap="round"/>
      `;
      if (frostingApplied) {
        frostingSvg = `
          <path d="M56,96 L132,96 Q146,105 138,114 Q122,124 110,112 Q96,126 84,112 Q70,124 56,110 Z" fill="${frosting.hex}" stroke="#4A3531" stroke-width="2.2"/>
        `;
      }
    } else if (type === 'tiered_cake') {
      topZoneY = 64;
      baseSvg = `
        <!-- Bottom Tier -->
        <rect x="38" y="114" width="124" height="50" rx="10" fill="${bodyColor}" stroke="#4A3531" stroke-width="2.5"/>
        <ellipse cx="100" cy="114" rx="62" ry="15" fill="${rimColor}" stroke="#4A3531" stroke-width="2.5"/>
        <!-- Top Tier -->
        <rect x="58" y="72" width="84" height="42" rx="8" fill="${bodyColor}" stroke="#4A3531" stroke-width="2.5"/>
        <ellipse cx="100" cy="72" rx="42" ry="12" fill="${rimColor}" stroke="#4A3531" stroke-width="2.5"/>
      `;
      if (frostingApplied) {
        frostingSvg = `
          <rect x="38" y="114" width="124" height="50" rx="10" fill="${frosting.hex}" stroke="#4A3531" stroke-width="2.3"/>
          <ellipse cx="100" cy="114" rx="62" ry="15" fill="${frosting.hex}" stroke="#4A3531" stroke-width="2.3"/>
          <rect x="58" y="72" width="84" height="42" rx="8" fill="${frosting.hex}" stroke="#4A3531" stroke-width="2.3"/>
          <ellipse cx="100" cy="72" rx="42" ry="12" fill="${frosting.hex}" stroke="#4A3531" stroke-width="2.3"/>
          ${nozzle === 'piped' ? `
            <circle cx="46" cy="120" r="5" fill="${frosting.shadow}"/><circle cx="64" cy="124" r="5" fill="${frosting.shadow}"/>
            <circle cx="82" cy="127" r="5" fill="${frosting.shadow}"/><circle cx="100" cy="128" r="5" fill="${frosting.shadow}"/>
            <circle cx="118" cy="127" r="5" fill="${frosting.shadow}"/><circle cx="136" cy="124" r="5" fill="${frosting.shadow}"/>
            <circle cx="154" cy="120" r="5" fill="${frosting.shadow}"/>
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
        <!-- Cake Plate -->
        <ellipse cx="100" cy="172" rx="76" ry="14" fill="#FFFDF9" stroke="#D8C4B6" stroke-width="2.5"/>
        <ellipse cx="100" cy="170" rx="62" ry="9" fill="#FFF3E6"/>
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
    renderCharacter,
    renderCake,
    renderIngredient,
    renderBox
  };
})();

