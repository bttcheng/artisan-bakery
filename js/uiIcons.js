// ============================================================================
// SWEET DREAMS - TIỆM BÁNH NGỌT
// SDIcons: Unified 2D Pastel Cartoon SVG Icon Set (Zero Emoji Mixing)
// ============================================================================

window.SDIcons = (() => {
  const S = '#3E2723';

  const PATHS = {
    // --- Bottom Nav & Screen Icons ---
    nav_bakery: `
      <path d="M5,13 L27,13 L27,27 L5,27 Z" fill="#FFF3D6" stroke="${S}" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M3,13 L6,6 L26,6 L29,13 C26,16 23,16 21,13 C19,16 15,16 13,13 C11,16 6,16 3,13 Z" fill="#FF8FAB" stroke="${S}" stroke-width="2.2" stroke-linejoin="round"/>
      <rect x="13" y="18" width="6" height="9" rx="1.5" fill="#A8E6CF" stroke="${S}" stroke-width="1.8"/>
    `,
    nav_orders: `
      <rect x="6" y="5" width="20" height="23" rx="3.5" fill="#FFFDF9" stroke="${S}" stroke-width="2.2"/>
      <rect x="11" y="2.5" width="10" height="5" rx="2" fill="#FFD166" stroke="${S}" stroke-width="2"/>
      <line x1="10" y1="13" x2="22" y2="13" stroke="#FF8FAB" stroke-width="2.4" stroke-linecap="round"/>
      <line x1="10" y1="18" x2="20" y2="18" stroke="#74C69D" stroke-width="2.4" stroke-linecap="round"/>
      <line x1="10" y1="23" x2="17" y2="23" stroke="#C8B6FF" stroke-width="2.4" stroke-linecap="round"/>
    `,
    nav_collection: `
      <path d="M6,5 C6,4 16,5 16,8 C16,5 26,4 26,5 L26,25 C26,25 16,24 16,27 C16,24 6,25 6,25 Z" fill="#FFE5EC" stroke="${S}" stroke-width="2.2" stroke-linejoin="round"/>
      <line x1="16" y1="8" x2="16" y2="27" stroke="${S}" stroke-width="2"/>
      <circle cx="11" cy="14" r="2.2" fill="#FF8FAB"/>
      <circle cx="21" cy="14" r="2.2" fill="#FFD166"/>
    `,
    nav_inventory: `
      <path d="M5,14 L27,14 L24,27 L8,27 Z" fill="#F3C677" stroke="${S}" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M10,14 C10,7 22,7 22,14" fill="none" stroke="${S}" stroke-width="2.2" stroke-linecap="round"/>
      <line x1="4" y1="14" x2="28" y2="14" stroke="${S}" stroke-width="2.4" stroke-linecap="round"/>
      <circle cx="13" cy="20" r="2.2" fill="#FFFDF9"/><circle cx="19" cy="20" r="2.2" fill="#FF8FAB"/>
    `,
    nav_decor: `
      <path d="M16,16 L5,9 L5,23 Z" fill="#FF8FAB" stroke="${S}" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M16,16 L27,9 L27,23 Z" fill="#FF8FAB" stroke="${S}" stroke-width="2.2" stroke-linejoin="round"/>
      <circle cx="16" cy="16" r="4" fill="#FFD166" stroke="${S}" stroke-width="2"/>
    `,
    nav_upgrades: `
      <circle cx="16" cy="16" r="10" fill="#FFF3B0" stroke="${S}" stroke-width="2.2"/>
      <path d="M16,9 L16,21 M11,14 L16,9 L21,14" fill="none" stroke="#E0577C" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
    `,
    nav_achievements: `
      <path d="M9,6 L23,6 L21,17 C20,20 12,20 11,17 Z" fill="#FFD166" stroke="${S}" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M9,8 C5,8 5,14 9,14 M23,8 C27,8 27,14 23,14" fill="none" stroke="${S}" stroke-width="2"/>
      <rect x="14" y="19" width="4" height="5" fill="#F4A261" stroke="${S}" stroke-width="1.8"/>
      <rect x="10" y="24" width="12" height="3.5" rx="1.5" fill="#E09F5A" stroke="${S}" stroke-width="1.8"/>
    `,

    // --- HUD & Status Icons ---
    cupcake_logo: `
      <path d="M8,17 L24,17 L21,27 L11,27 Z" fill="#FFB3C6" stroke="${S}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M6,17 C6,10 11,7 16,7 C21,7 26,10 26,17 Z" fill="#FFFDF9" stroke="${S}" stroke-width="2"/>
      <circle cx="16" cy="6" r="2.8" fill="#FF4D6D" stroke="${S}" stroke-width="1.6"/>
    `,
    sun_day: `
      <circle cx="16" cy="16" r="6.5" fill="#FFD166" stroke="${S}" stroke-width="2"/>
      <path d="M16,4 L16,7 M16,25 L16,28 M4,16 L7,16 M25,16 L28,16 M7.5,7.5 L9.8,9.8 M22.2,22.2 L24.5,24.5 M24.5,7.5 L22.2,9.8 M9.8,22.2 L7.5,24.5" stroke="#F4A261" stroke-width="2.2" stroke-linecap="round"/>
    `,
    star_level: `
      <polygon points="16,4 19.5,11.5 28,12.5 21.8,18.2 23.4,26.5 16,22.4 8.6,26.5 10.2,18.2 4,12.5 12.5,11.5" fill="#FFD166" stroke="${S}" stroke-width="2" stroke-linejoin="round"/>
    `,
    coin: `
      <circle cx="16" cy="16" r="11" fill="#FFD166" stroke="${S}" stroke-width="2.2"/>
      <circle cx="16" cy="16" r="7.2" fill="#FFE699" stroke="#D4A373" stroke-width="1.4"/>
      <line x1="16" y1="11.5" x2="16" y2="20.5" stroke="#B45309" stroke-width="2.2" stroke-linecap="round"/>
    `,
    smile_served: `
      <circle cx="16" cy="16" r="11" fill="#A8E6CF" stroke="${S}" stroke-width="2.2"/>
      <circle cx="12.5" cy="14" r="1.6" fill="${S}"/><circle cx="19.5" cy="14" r="1.6" fill="${S}"/>
      <path d="M11.5,18.5 Q16,22.5 20.5,18.5" fill="none" stroke="${S}" stroke-width="2" stroke-linecap="round"/>
    `,
    heart_rep: `
      <path d="M16,26 C16,26 5,19 5,11.5 C5,7.5 8.2,5 11.8,5 C14,5 15.3,6.4 16,8 C16.7,6.4 18,5 20.2,5 C23.8,5 27,7.5 27,11.5 C27,19 16,26 16,26 Z" fill="#FF758F" stroke="${S}" stroke-width="2.2" stroke-linejoin="round"/>
    `,
    moon_endday: `
      <path d="M21,6 C13,7 8,14 10,21 C12,26 18,28 24,25 C17,24 14,18 16,12 C17,9 19,7 21,6 Z" fill="#FFE699" stroke="${S}" stroke-width="2.2" stroke-linejoin="round"/>
    `,
    sound_on: `
      <polygon points="6,12 12,12 19,6 19,26 12,20 6,20" fill="#BDE0FE" stroke="${S}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M22.5,11.5 Q26,16 22.5,20.5 M25.5,8.5 Q30,16 25.5,23.5" fill="none" stroke="${S}" stroke-width="2" stroke-linecap="round"/>
    `,
    sound_off: `
      <polygon points="6,12 12,12 19,6 19,26 12,20 6,20" fill="#E2ECE9" stroke="${S}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M22,12 L28,20 M28,12 L22,20" stroke="#FF4D6D" stroke-width="2.4" stroke-linecap="round"/>
    `,
    pause: `
      <rect x="8" y="6" width="5.5" height="20" rx="2.5" fill="#FFB3C6" stroke="${S}" stroke-width="2"/>
      <rect x="18.5" y="6" width="5.5" height="20" rx="2.5" fill="#FFB3C6" stroke="${S}" stroke-width="2"/>
    `,
    settings: `
      <circle cx="16" cy="16" r="9.5" fill="#E5D4FF" stroke="${S}" stroke-width="2.2"/>
      <circle cx="16" cy="16" r="4" fill="#FFFDF9" stroke="${S}" stroke-width="2"/>
    `,

    // --- Kitchen Stations & Workshop Actions ---
    whisk: `
      <path d="M16,14 C10,14 9,26 16,27 C23,26 22,14 16,14 Z" fill="none" stroke="${S}" stroke-width="2"/>
      <path d="M16,14 C13,14 12.5,26 16,27 C19.5,26 19,14 16,14 Z" fill="none" stroke="#FF8FAB" stroke-width="1.6"/>
      <rect x="14" y="4" width="4" height="11" rx="2" fill="#FFB3C6" stroke="${S}" stroke-width="2"/>
    `,
    oven_flame: `
      <rect x="5" y="6" width="22" height="20" rx="4" fill="#FFD6E0" stroke="${S}" stroke-width="2.2"/>
      <rect x="8" y="11" width="16" height="11" rx="2" fill="#FF9F1C" stroke="${S}" stroke-width="1.8"/>
      <circle cx="16" cy="17" r="3" fill="#FFE699"/>
    `,
    piping_bag: `
      <polygon points="7,7 25,15 15,25" fill="#FFB3C6" stroke="${S}" stroke-width="2.2" stroke-linejoin="round"/>
      <circle cx="23" cy="23" r="3" fill="#FFFDF9" stroke="${S}" stroke-width="1.8"/>
    `,
    berry_topping: `
      <path d="M16,9 C23,9 24,18 16,27 C8,18 9,9 16,9 Z" fill="#FF4D6D" stroke="${S}" stroke-width="2"/>
      <path d="M11,9 L16,12 L21,9 L18,5 L14,5 Z" fill="#52B788" stroke="${S}" stroke-width="1.5"/>
    `,
    candle_acc: `
      <rect x="13" y="13" width="6" height="14" rx="2" fill="#A8E6CF" stroke="${S}" stroke-width="2"/>
      <path d="M16,5 C13,9 14,12 16,12 C18,12 19,9 16,5 Z" fill="#FFD166" stroke="#E07A00" stroke-width="1.4"/>
    `,
    gift_box: `
      <rect x="6" y="12" width="20" height="14" rx="2.5" fill="#FFB3C6" stroke="${S}" stroke-width="2.2"/>
      <rect x="5" y="9" width="22" height="5" rx="2" fill="#FF8FAB" stroke="${S}" stroke-width="2"/>
      <rect x="14" y="9" width="4" height="17" fill="#FFD166" stroke="${S}" stroke-width="1.5"/>
    `,
    bell_call: `
      <path d="M8,22 C8,13 11,8 16,8 C21,8 24,13 24,22 Z" fill="#FFD166" stroke="${S}" stroke-width="2.2"/>
      <line x1="5" y1="22" x2="27" y2="22" stroke="${S}" stroke-width="2.4" stroke-linecap="round"/>
      <circle cx="16" cy="25" r="2.2" fill="#F4A261"/>
    `,
    inspect: `
      <circle cx="14" cy="14" r="7.5" fill="#EAF9FF" stroke="${S}" stroke-width="2.2"/>
      <line x1="20" y1="20" x2="26.5" y2="26.5" stroke="${S}" stroke-width="2.8" stroke-linecap="round"/>
    `,
    check_accept: `
      <circle cx="16" cy="16" r="11" fill="#74C69D" stroke="${S}" stroke-width="2.2"/>
      <path d="M10.5,16 L14.5,20 L21.5,12" fill="none" stroke="#FFFDF9" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
    `,
    chef_hat: `
      <path d="M9,18 C5,16 5,9 11,8 C13,4 19,4 21,8 C27,9 27,16 23,18 L23,25 L9,25 Z" fill="#FFFDF9" stroke="${S}" stroke-width="2.2" stroke-linejoin="round"/>
      <line x1="9" y1="21" x2="23" y2="21" stroke="#FFB3C6" stroke-width="2"/>
    `,
    undo: `
      <path d="M10,12 L5,17 L10,22" fill="none" stroke="${S}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M6,17 L19,17 C24,17 26,21 24,25" fill="none" stroke="${S}" stroke-width="2.4" stroke-linecap="round"/>
    `,
    clear: `
      <path d="M9,10 L23,10 L21,26 L11,26 Z" fill="#FFE5EC" stroke="${S}" stroke-width="2.2" stroke-linejoin="round"/>
      <line x1="7" y1="10" x2="25" y2="10" stroke="${S}" stroke-width="2.4" stroke-linecap="round"/>
      <line x1="13" y1="6" x2="19" y2="6" stroke="${S}" stroke-width="2.4" stroke-linecap="round"/>
    `,
    clock: `
      <circle cx="16" cy="16" r="10.5" fill="#FFFDF9" stroke="${S}" stroke-width="2.2"/>
      <path d="M16,10 L16,16 L20.5,18.5" fill="none" stroke="#FF5D8F" stroke-width="2.4" stroke-linecap="round"/>
    `,
    hand_guide: `
      <path d="M13,5 C13,3.5 16,3.5 16,5 L16,13 L18.5,12 C20,12 21,13 21,14.5 L21,21 C21,25 18,28 14,28 C10.5,28 8.5,25 8.5,21 L8.5,15 C8.5,13.5 10.5,13.5 11.5,14.5 L13,15 Z" fill="#FFE5D4" stroke="${S}" stroke-width="2.2" stroke-linejoin="round"/>
      <circle cx="14.5" cy="4" r="3" fill="none" stroke="#FF4D6D" stroke-width="1.8"/>
    `
  };

  // Large 64x64 2D Cartoon Illustrations for Upgrades, Shop Decors & Achievements
  const SHOP_ART = {
    // --- Equipment Upgrades (6) ---
    oven: `
      <rect x="8" y="12" width="48" height="44" rx="8" fill="#FFD6E0" stroke="${S}" stroke-width="2.4"/>
      <rect x="13" y="16" width="38" height="8" rx="4" fill="#FFFDF9" stroke="${S}" stroke-width="1.8"/>
      <circle cx="20" cy="20" r="2.2" fill="#FF4D6D"/><circle cx="32" cy="20" r="2.2" fill="#FFD166"/><circle cx="44" cy="20" r="2.2" fill="#74C69D"/>
      <rect x="14" y="27" width="36" height="23" rx="5" fill="#FF9F1C" stroke="${S}" stroke-width="2"/>
      <line x1="18" y1="30" x2="46" y2="30" stroke="#FFFDF9" stroke-width="2.4" stroke-linecap="round"/>
      <ellipse cx="32" cy="43" rx="10" ry="5" fill="#FFE699" stroke="${S}" stroke-width="1.6"/>
    `,
    mixer: `
      <path d="M16,42 L48,42 L44,54 Q32,57 20,54 Z" fill="#A8E6CF" stroke="${S}" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M16,20 C16,12 46,12 48,22 L48,28 L22,28 L22,42" fill="#FFB3C6" stroke="${S}" stroke-width="2.4" stroke-linejoin="round"/>
      <ellipse cx="32" cy="36" rx="5" ry="9" fill="none" stroke="${S}" stroke-width="2"/>
      <circle cx="42" cy="20" r="3" fill="#FFFDF9" stroke="${S}" stroke-width="1.6"/>
    `,
    deco_table: `
      <rect x="12" y="34" width="40" height="8" rx="4" fill="#FFE5EC" stroke="${S}" stroke-width="2.4"/>
      <rect x="27" y="42" width="10" height="12" fill="#D8BBFF" stroke="${S}" stroke-width="2"/>
      <rect x="20" y="52" width="24" height="4" rx="2" fill="#B185DB" stroke="${S}" stroke-width="1.8"/>
      <path d="M24,34 L40,34 L38,24 L26,24 Z" fill="#FFB3C6" stroke="${S}" stroke-width="2"/>
      <path d="M24,24 C24,16 40,16 40,24 Z" fill="#FFFDF9" stroke="${S}" stroke-width="2"/>
      <circle cx="32" cy="14" r="3" fill="#FF4D6D" stroke="${S}" stroke-width="1.4"/>
    `,
    display_shelf: `
      <rect x="10" y="14" width="44" height="42" rx="7" fill="#EAF9FF" stroke="${S}" stroke-width="2.4"/>
      <line x1="12" y1="33" x2="52" y2="33" stroke="${S}" stroke-width="2.2"/>
      <rect x="10" y="47" width="44" height="9" rx="3" fill="#FFB3C6" stroke="${S}" stroke-width="2"/>
      <circle cx="23" cy="26" r="6" fill="#FF8FAB" stroke="${S}" stroke-width="1.8"/>
      <circle cx="40" cy="26" r="6" fill="#FFE699" stroke="${S}" stroke-width="1.8"/>
      <rect x="20" y="37" width="24" height="10" rx="3" fill="#D8BBFF" stroke="${S}" stroke-width="1.8"/>
    `,
    counter_service: `
      <path d="M8,22 L12,12 L52,12 L56,22 C50,26 44,26 40,22 C36,26 28,26 24,22 C20,26 14,26 8,22 Z" fill="#FF8FAB" stroke="${S}" stroke-width="2.2" stroke-linejoin="round"/>
      <rect x="12" y="34" width="40" height="22" rx="4" fill="#FFF3D6" stroke="${S}" stroke-width="2.4"/>
      <path d="M25,34 C25,27 39,27 39,34 Z" fill="#FFD166" stroke="${S}" stroke-width="2"/>
      <circle cx="32" cy="27" r="2" fill="#F4A261"/>
    `,
    ingredient_pantry: `
      <rect x="14" y="10" width="36" height="46" rx="7" fill="#D8F3DC" stroke="${S}" stroke-width="2.4"/>
      <line x1="14" y1="32" x2="50" y2="32" stroke="${S}" stroke-width="2.2"/>
      <line x1="42" y1="18" x2="42" y2="27" stroke="${S}" stroke-width="2.6" stroke-linecap="round"/>
      <line x1="42" y1="38" x2="42" y2="48" stroke="${S}" stroke-width="2.6" stroke-linecap="round"/>
      <circle cx="26" cy="21" r="4" fill="#FF8FAB"/><circle cx="28" cy="43" r="4.5" fill="#FFD166"/>
    `,

    // --- Shop Decors (11) ---
    fairy_lights: `
      <path d="M6,18 Q32,36 58,18" fill="none" stroke="${S}" stroke-width="2.4"/>
      <circle cx="15" cy="25" r="5" fill="#FFE699" stroke="${S}" stroke-width="1.8"/>
      <circle cx="32" cy="30" r="5.5" fill="#FFB3C6" stroke="${S}" stroke-width="1.8"/>
      <circle cx="49" cy="25" r="5" fill="#A8E6CF" stroke="${S}" stroke-width="1.8"/>
      <circle cx="23" cy="43" r="3" fill="#FFD166" opacity="0.7"/><circle cx="42" cy="43" r="3" fill="#FF8FAB" opacity="0.7"/>
    `,
    crystal_lights: `
      <line x1="32" y1="8" x2="32" y2="22" stroke="${S}" stroke-width="2.4"/>
      <path d="M14,24 Q32,16 50,24" fill="none" stroke="${S}" stroke-width="2.4"/>
      <polygon points="18,24 23,36 18,45 13,36" fill="#D8BBFF" stroke="${S}" stroke-width="2"/>
      <polygon points="32,20 38,35 32,48 26,35" fill="#FFE699" stroke="${S}" stroke-width="2"/>
      <polygon points="46,24 51,36 46,45 41,36" fill="#FFB3C6" stroke="${S}" stroke-width="2"/>
    `,
    pastel_wallpaper: `
      <rect x="12" y="10" width="40" height="44" rx="5" fill="#FFF8F0" stroke="${S}" stroke-width="2.4"/>
      <rect x="17" y="12" width="7" height="40" fill="#FFD6E0"/>
      <rect x="31" y="12" width="7" height="40" fill="#FFD6E0"/>
      <rect x="44" y="12" width="6" height="40" fill="#FFD6E0"/>
      <rect x="12" y="10" width="40" height="44" rx="5" fill="none" stroke="${S}" stroke-width="2.4"/>
    `,
    mint_wallpaper: `
      <rect x="12" y="10" width="40" height="44" rx="5" fill="#E8FAF2" stroke="${S}" stroke-width="2.4"/>
      <circle cx="23" cy="21" r="4" fill="#74C69D"/><circle cx="41" cy="21" r="4" fill="#FFFDF9"/>
      <circle cx="32" cy="32" r="4" fill="#74C69D"/>
      <circle cx="23" cy="43" r="4" fill="#FFFDF9"/><circle cx="41" cy="43" r="4" fill="#74C69D"/>
    `,
    flower_pots: `
      <path d="M16,38 L48,38 L44,54 L20,54 Z" fill="#F4A261" stroke="${S}" stroke-width="2.4" stroke-linejoin="round"/>
      <line x1="24" y1="38" x2="22" y2="25" stroke="#52B788" stroke-width="2.8"/>
      <line x1="32" y1="38" x2="32" y2="20" stroke="#52B788" stroke-width="2.8"/>
      <line x1="40" y1="38" x2="42" y2="25" stroke="#52B788" stroke-width="2.8"/>
      <circle cx="22" cy="22" r="6" fill="#FF8FAB" stroke="${S}" stroke-width="1.8"/>
      <circle cx="32" cy="17" r="6.5" fill="#FFD166" stroke="${S}" stroke-width="1.8"/>
      <circle cx="42" cy="22" r="6" fill="#D8BBFF" stroke="${S}" stroke-width="1.8"/>
    `,
    monstera_plant: `
      <path d="M20,38 L44,38 L41,54 L23,54 Z" fill="#FFFDF9" stroke="${S}" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M32,38 C20,26 16,14 27,12 C33,12 34,24 32,38 Z" fill="#74C69D" stroke="${S}" stroke-width="2"/>
      <path d="M32,38 C44,26 48,14 37,12 C31,12 30,24 32,38 Z" fill="#52B788" stroke="${S}" stroke-width="2"/>
    `,
    cozy_seating: `
      <rect x="14" y="20" width="36" height="22" rx="10" fill="#FFB3C6" stroke="${S}" stroke-width="2.4"/>
      <rect x="10" y="34" width="44" height="12" rx="6" fill="#FF8FAB" stroke="${S}" stroke-width="2.4"/>
      <line x1="18" y1="46" x2="18" y2="54" stroke="${S}" stroke-width="3" stroke-linecap="round"/>
      <line x1="46" y1="46" x2="46" y2="54" stroke="${S}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="32" cy="22" r="4" fill="#FFD166" stroke="${S}" stroke-width="1.8"/>
    `,
    wall_art: `
      <rect x="12" y="12" width="40" height="40" rx="5" fill="#F4C95D" stroke="${S}" stroke-width="2.4"/>
      <rect x="17" y="17" width="30" height="30" rx="3" fill="#FFFDF9" stroke="${S}" stroke-width="1.8"/>
      <path d="M25,34 L39,34 L37,43 L27,43 Z" fill="#FFB3C6" stroke="${S}" stroke-width="1.6"/>
      <path d="M24,34 C24,25 40,25 40,34 Z" fill="#FF8FAB" stroke="${S}" stroke-width="1.6"/>
    `,
    pastel_floor: `
      <polygon points="32,12 56,28 32,46 8,28" fill="#FFE5EC" stroke="${S}" stroke-width="2.4" stroke-linejoin="round"/>
      <polygon points="32,12 44,20 32,29 20,20" fill="#FFFDF9" stroke="${S}" stroke-width="1.6"/>
      <polygon points="32,29 44,37 32,46 20,37" fill="#FFFDF9" stroke="${S}" stroke-width="1.6"/>
    `,
    bakery_signboard: `
      <path d="M20,18 L32,10 L44,18" fill="none" stroke="${S}" stroke-width="2.2"/>
      <rect x="10" y="18" width="44" height="28" rx="7" fill="#FFE699" stroke="${S}" stroke-width="2.4"/>
      <rect x="15" y="23" width="34" height="18" rx="4" fill="#FFFDF9" stroke="#D4A373" stroke-width="1.8"/>
      <circle cx="24" cy="32" r="3" fill="#FF8FAB"/><circle cx="32" cy="32" r="3" fill="#74C69D"/><circle cx="40" cy="32" r="3" fill="#D8BBFF"/>
    `,
    ribbon_bunting: `
      <path d="M6,18 Q32,32 58,18" fill="none" stroke="${S}" stroke-width="2.4"/>
      <polygon points="10,20 22,24 14,35" fill="#FF8FAB" stroke="${S}" stroke-width="1.8"/>
      <polygon points="26,25 38,25 32,38" fill="#FFD166" stroke="${S}" stroke-width="1.8"/>
      <polygon points="42,24 54,20 50,35" fill="#A8E6CF" stroke="${S}" stroke-width="1.8"/>
    `
  };

  function equipmentArt(id, level = 1, size = 78) {
    const lv = Math.max(1, Math.min(3, Number(level) || 1));
    const trim = lv === 3 ? '#F4B942' : lv === 2 ? '#FF8FAB' : '#D8C4B6';
    const body = lv === 3 ? '#E5D4FF' : lv === 2 ? '#FFD6E0' : '#FFF3E6';
    const crown = lv === 3
      ? `<polygon points="24,10 27,4 32,8 37,4 40,10" fill="#FFD166" stroke="${S}" stroke-width="1.8" stroke-linejoin="round"/>`
      : '';
    const sparkles = lv >= 2
      ? `<circle cx="10" cy="14" r="2.2" fill="#FFD166"/><circle cx="54" cy="14" r="2.2" fill="#FF8FAB"/>${lv === 3 ? '<path d="M52,22 L54,18 L56,22 L54,26 Z" fill="#FFD166"/>' : ''}`
      : '';

    let svg = '';
    if (id === 'oven') {
      const doorFill = lv === 3 ? '#FF758F' : lv === 2 ? '#FF9F1C' : '#F4A261';
      svg = `
        ${crown}${sparkles}
        <rect x="8" y="12" width="48" height="44" rx="8" fill="${body}" stroke="${S}" stroke-width="2.4"/>
        <rect x="12" y="15" width="40" height="9" rx="4" fill="#FFFDF9" stroke="${trim}" stroke-width="2"/>
        <circle cx="19" cy="19.5" r="2.2" fill="#FF4D6D"/><circle cx="32" cy="19.5" r="2.2" fill="#FFD166"/><circle cx="45" cy="19.5" r="2.2" fill="#74C69D"/>
        <rect x="13" y="27" width="38" height="23" rx="5" fill="${doorFill}" stroke="${S}" stroke-width="2"/>
        ${lv >= 2 ? '<rect x="17" y="30" width="30" height="3" rx="1.5" fill="#FFFDF9"/>' : ''}
        <ellipse cx="32" cy="43" rx="11" ry="4.5" fill="#FFE699" stroke="${S}" stroke-width="1.6"/>
        ${lv === 3 ? '<ellipse cx="32" cy="35" rx="8" ry="3.2" fill="#FFB3C6" stroke="${S}" stroke-width="1.4"/>' : ''}
      `;
    } else if (id === 'mixer') {
      const headFill = lv === 3 ? '#C8B6FF' : lv === 2 ? '#FF8FAB' : '#FFFDF9';
      svg = lv === 1
        ? `
          <path d="M18,34 L46,34 L42,52 Q32,56 22,52 Z" fill="#FFE5EC" stroke="${S}" stroke-width="2.4" stroke-linejoin="round"/>
          <path d="M32,14 L32,38 M27,27 C27,36 37,36 37,27 Z" fill="none" stroke="${S}" stroke-width="2.2"/>
          <rect x="29" y="10" width="6" height="8" rx="2" fill="#FFB3C6" stroke="${S}" stroke-width="1.8"/>
        `
        : `
          ${crown}${sparkles}
          <path d="M16,42 L48,42 L44,54 Q32,57 20,54 Z" fill="#A8E6CF" stroke="${S}" stroke-width="2.4" stroke-linejoin="round"/>
          <path d="M15,21 C15,12 47,12 49,22 L49,28 L22,28 L22,42" fill="${headFill}" stroke="${S}" stroke-width="2.4" stroke-linejoin="round"/>
          <ellipse cx="32" cy="36" rx="5.5" ry="9" fill="none" stroke="${S}" stroke-width="2"/>
          <circle cx="42" cy="20" r="3" fill="${trim}" stroke="${S}" stroke-width="1.5"/>
        `;
    } else if (id === 'deco_table') {
      svg = `
        ${crown}${sparkles}
        <rect x="10" y="34" width="44" height="8" rx="4" fill="${body}" stroke="${S}" stroke-width="2.4"/>
        <rect x="27" y="42" width="10" height="12" fill="${trim}" stroke="${S}" stroke-width="2"/>
        <rect x="18" y="52" width="28" height="4" rx="2" fill="${trim}" stroke="${S}" stroke-width="1.8"/>
        <path d="M24,34 L40,34 L38,24 L26,24 Z" fill="#FFB3C6" stroke="${S}" stroke-width="2"/>
        <path d="M23,24 C23,15 41,15 41,24 Z" fill="#FFFDF9" stroke="${S}" stroke-width="2"/>
        ${lv >= 2 ? '<circle cx="32" cy="14" r="3.2" fill="#FF4D6D" stroke="#3E2723" stroke-width="1.4"/>' : ''}
        ${lv === 3 ? '<polygon points="48,24 56,28 50,33" fill="#D8BBFF" stroke="#3E2723" stroke-width="1.6"/>' : ''}
      `;
    } else if (id === 'display_shelf') {
      const glass = lv === 3 ? '#F5EBFF' : lv === 2 ? '#EAF9FF' : '#FFF8EB';
      svg = `
        ${crown}${sparkles}
        <rect x="10" y="13" width="44" height="43" rx="7" fill="${glass}" stroke="${S}" stroke-width="2.4"/>
        <line x1="12" y1="32" x2="52" y2="32" stroke="${trim}" stroke-width="2.4"/>
        ${lv >= 2 ? `<line x1="12" y1="22" x2="52" y2="22" stroke="${trim}" stroke-width="1.8"/>` : ''}
        <rect x="10" y="47" width="44" height="9" rx="3" fill="${body}" stroke="${S}" stroke-width="2"/>
        <circle cx="23" cy="27" r="4.5" fill="#FF8FAB" stroke="${S}" stroke-width="1.6"/>
        <circle cx="40" cy="27" r="4.5" fill="#FFE699" stroke="${S}" stroke-width="1.6"/>
        <rect x="20" y="37" width="24" height="10" rx="3" fill="${trim}" stroke="${S}" stroke-width="1.8"/>
      `;
    } else if (id === 'counter_service') {
      svg = `
        ${crown}${sparkles}
        ${lv >= 2 ? `<path d="M8,22 L12,12 L52,12 L56,22 C50,26 44,26 40,22 C36,26 28,26 24,22 C20,26 14,26 8,22 Z" fill="${trim}" stroke="${S}" stroke-width="2.2" stroke-linejoin="round"/>` : ''}
        <rect x="12" y="34" width="40" height="22" rx="4" fill="${body}" stroke="${S}" stroke-width="2.4"/>
        <path d="M25,34 C25,27 39,27 39,34 Z" fill="#FFD166" stroke="${S}" stroke-width="2"/>
        ${lv === 3 ? '<circle cx="19" cy="31" r="3" fill="#FF8FAB" stroke="#3E2723" stroke-width="1.4"/><circle cx="45" cy="31" r="3" fill="#FF8FAB" stroke="#3E2723" stroke-width="1.4"/>' : ''}
      `;
    } else {
      // ingredient_pantry
      const fridgeFill = lv === 3 ? '#BDE0FE' : lv === 2 ? '#D8F3DC' : '#F3DFC1';
      svg = `
        ${crown}${sparkles}
        <rect x="14" y="10" width="36" height="46" rx="7" fill="${fridgeFill}" stroke="${S}" stroke-width="2.4"/>
        <line x1="14" y1="32" x2="50" y2="32" stroke="${S}" stroke-width="2.2"/>
        ${lv === 3 ? '<line x1="32" y1="12" x2="32" y2="54" stroke="#3E2723" stroke-width="1.8"/>' : ''}
        <line x1="42" y1="18" x2="42" y2="27" stroke="${S}" stroke-width="2.6" stroke-linecap="round"/>
        <line x1="42" y1="38" x2="42" y2="48" stroke="${S}" stroke-width="2.6" stroke-linecap="round"/>
        <circle cx="24" cy="21" r="4" fill="#FF8FAB"/><circle cx="25" cy="43" r="4.5" fill="#FFD166"/>
      `;
    }
    return `<svg viewBox="0 0 64 64" width="${size}" height="${size}" class="sd-shop-art equip-lv-${lv}" aria-hidden="true">${svg}</svg>`;
  }

  function badgeArt(id, unlocked = true, size = 54) {
    const rim = unlocked ? '#FFD166' : '#D8C4B6';
    const bg = unlocked ? '#FFF8EB' : '#F1ECEE';
    let emblem = '';
    if (id.includes('cupcake') || id === 'ach_first_cake') {
      emblem = PATHS.cupcake_logo;
    } else if (id.includes('coins') || id.includes('rich')) {
      emblem = PATHS.coin;
    } else if (id.includes('customers')) {
      emblem = PATHS.smile_served;
    } else if (id.includes('recipes')) {
      emblem = PATHS.nav_collection;
    } else if (id.includes('rep')) {
      emblem = PATHS.heart_rep;
    } else if (id.includes('decor')) {
      emblem = PATHS.nav_decor;
    } else if (id.includes('perfect') || id.includes('special')) {
      emblem = PATHS.star_level;
    } else {
      emblem = PATHS.nav_achievements;
    }
    return `
      <svg viewBox="0 0 44 44" width="${size}" height="${size}" class="sd-badge-art ${unlocked ? 'unlocked' : 'locked'}" aria-hidden="true">
        <circle cx="22" cy="22" r="19" fill="${bg}" stroke="${S}" stroke-width="2.4"/>
        <circle cx="22" cy="22" r="15.5" fill="none" stroke="${rim}" stroke-width="2.5"/>
        <g transform="translate(8, 8) scale(0.88)">${emblem}</g>
      </svg>
    `;
  }

  function shopArt(id, size = 62, level = 1) {
    if (['oven', 'mixer', 'deco_table', 'display_shelf', 'counter_service', 'ingredient_pantry'].includes(id)) {
      return equipmentArt(id, level, size);
    }
    const body = SHOP_ART[id] || PATHS.nav_decor;
    const vb = SHOP_ART[id] ? '0 0 64 64' : '0 0 32 32';
    return `<svg viewBox="${vb}" width="${size}" height="${size}" class="sd-shop-art" aria-hidden="true">${body}</svg>`;
  }

  function icon(name, size = 20, extraClass = '') {
    const body = PATHS[name] || PATHS.cupcake_logo;
    return `<svg viewBox="0 0 32 32" width="${size}" height="${size}" class="sd-ico ${extraClass}" aria-hidden="true">${body}</svg>`;
  }

  function hydrate(root = document) {
    if (!root || !root.querySelectorAll) return;
    root.querySelectorAll('[data-sd-ico]').forEach(el => {
      const name = el.dataset.sdIco;
      const size = Number(el.dataset.sdSize) || 20;
      el.innerHTML = icon(name, size);
    });
  }

  return { icon, shopArt, equipmentArt, badgeArt, hydrate, PATHS, SHOP_ART };
})();

