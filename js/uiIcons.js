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

  return { icon, hydrate, PATHS };
})();
