// ============================================================================
// SWEET DREAMS - TIỆM BÁNH NGỌT
// Game Data Definitions (Customers, Ingredients, Recipes, Upgrades, Levels)
// ============================================================================

window.SDData = (() => {
  const INGREDIENTS = [
    { id: 'flour', name: 'Bột mì', price: 6, unit: 'gói', unlockLevel: 1, category: 'base', color: '#FFF5E1', accent: '#E6C999' },
    { id: 'sugar', name: 'Đường', price: 5, unit: 'gói', unlockLevel: 1, category: 'base', color: '#FFFFFF', accent: '#FFD6E7' },
    { id: 'egg', name: 'Trứng', price: 7, unit: 'quả', unlockLevel: 1, category: 'base', color: '#FFE5B4', accent: '#FFB347' },
    { id: 'milk', name: 'Sữa', price: 6, unit: 'hộp', unlockLevel: 1, category: 'base', color: '#F0F8FF', accent: '#99D6FF' },
    { id: 'butter', name: 'Bơ', price: 8, unit: 'viên', unlockLevel: 1, category: 'base', color: '#FFF099', accent: '#F2C94C' },
    { id: 'vanilla', name: 'Vanilla', price: 9, unit: 'lọ', unlockLevel: 1, category: 'flavor', color: '#FFF8DC', accent: '#D4A373' },
    { id: 'chocolate', name: 'Chocolate', price: 12, unit: 'thanh', unlockLevel: 1, category: 'flavor', color: '#6B3E26', accent: '#4A2511' },
    { id: 'cacao', name: 'Bột cacao', price: 10, unit: 'hũ', unlockLevel: 2, category: 'flavor', color: '#8B5A2B', accent: '#5C3A21' },
    { id: 'strawberry', name: 'Dâu tây', price: 12, unit: 'trái', unlockLevel: 1, category: 'fruit', color: '#FF6B8B', accent: '#6BCB77' },
    { id: 'blueberry', name: 'Việt quất', price: 14, unit: 'trái', unlockLevel: 3, category: 'fruit', color: '#5E60CE', accent: '#3A0CA3' },
    { id: 'matcha', name: 'Bột trà xanh', price: 15, unit: 'hũ', unlockLevel: 4, category: 'flavor', color: '#74C69D', accent: '#40916C' },
    { id: 'caramel', name: 'Sốt Caramel', price: 13, unit: 'lọ', unlockLevel: 2, category: 'special', color: '#D97706', accent: '#92400E' },
    { id: 'cream_cheese', name: 'Kem Phô Mai', price: 16, unit: 'hộp', unlockLevel: 4, category: 'special', color: '#FFF8E7', accent: '#F4C95D' },
    { id: 'gelatin', name: 'Gelatin Trái Cây', price: 14, unit: 'gói', unlockLevel: 4, category: 'special', color: '#FF9EBB', accent: '#72EFDD' },
    { id: 'ginger_spice', name: 'Bột Quế Gừng', price: 15, unit: 'lọ', unlockLevel: 5, category: 'special', color: '#B45309', accent: '#78350F' }
  ];

  const CAKE_GROUPS = [
    { id: 'cakes', name: 'Bánh kem' },
    { id: 'cupcake_muffin', name: 'Cupcake và Muffin' },
    { id: 'donut', name: 'Donut' },
    { id: 'cookie', name: 'Bánh quy' },
    { id: 'pastry', name: 'Bánh ngọt' },
    { id: 'dessert', name: 'Món tráng miệng' }
  ];

  const BATTERS = [
    { id: 'vanilla', name: 'Vanilla Kem Sữa', flavorIngredient: 'vanilla', color: '#FFE9A8', bakedColor: '#F3C677', rimColor: '#E0A854' },
    { id: 'chocolate', name: 'Chocolate Đậm Đà', flavorIngredient: 'chocolate', color: '#7D4E38', bakedColor: '#5C3422', rimColor: '#3E2115' },
    { id: 'cacao', name: 'Cacao Ngọt Ngào', flavorIngredient: 'cacao', color: '#9C6644', bakedColor: '#7F4F24', rimColor: '#582F0E' },
    { id: 'strawberry', name: 'Dâu Tây Pastel', flavorIngredient: 'strawberry', color: '#FFB3C6', bakedColor: '#FF8FAB', rimColor: '#FB6F92' },
    { id: 'matcha', name: 'Trà Xanh Matcha', flavorIngredient: 'matcha', color: '#A3D9A5', bakedColor: '#7BC47F', rimColor: '#4F9D69' },
    { id: 'blueberry', name: 'Việt Quất Tím', flavorIngredient: 'blueberry', color: '#C8B6FF', bakedColor: '#9D8DF1', rimColor: '#725AC1' }
  ];

  const CAKE_TYPES = [
    // --- NHÓM 1: BÁNH KEM (8) ---
    {
      id: 'strawberry_cream_cake', group: 'cakes', groupName: 'Bánh kem', name: 'Bánh kem dâu tây',
      unlockLevel: 1, basePrice: 88, baseXp: 40, idealTemp: 170, bakeTime: 9,
      moldName: 'Khuôn Tròn Bánh Dâu', moldShape: 'round_cake', boxSize: 'large',
      baseIngredients: ['flour', 'sugar', 'egg', 'milk', 'butter', 'strawberry'],
      description: 'Cốt bánh bông lan mịn kết hợp kem tươi và dâu tây mọng nước.'
    },
    {
      id: 'chocolate_cream_cake', group: 'cakes', groupName: 'Bánh kem', name: 'Bánh kem chocolate',
      unlockLevel: 1, basePrice: 92, baseXp: 42, idealTemp: 175, bakeTime: 9,
      moldName: 'Khuôn Tròn Socola', moldShape: 'round_cake', boxSize: 'large',
      baseIngredients: ['flour', 'sugar', 'egg', 'milk', 'butter', 'chocolate'],
      description: 'Bánh kem phủ ganache chocolate bóng mượt đậm vị ca cao.'
    },
    {
      id: 'round_cake', group: 'cakes', groupName: 'Bánh kem', name: 'Bánh kem vanilla',
      unlockLevel: 1, basePrice: 85, baseXp: 38, idealTemp: 170, bakeTime: 9,
      moldName: 'Khuôn Tròn Cổ Điển', moldShape: 'round_cake', boxSize: 'large',
      baseIngredients: ['flour', 'sugar', 'egg', 'milk', 'butter'],
      description: 'Bánh kem vanilla cổ điển mềm mịn thích hợp cho mọi buổi tiệc ngọt.'
    },
    {
      id: 'matcha_cream_cake', group: 'cakes', groupName: 'Bánh kem', name: 'Bánh kem matcha',
      unlockLevel: 4, basePrice: 108, baseXp: 50, idealTemp: 170, bakeTime: 9,
      moldName: 'Khuôn Tròn Matcha', moldShape: 'round_cake', boxSize: 'large',
      baseIngredients: ['flour', 'sugar', 'egg', 'milk', 'butter', 'matcha'],
      description: 'Hương trà xanh Nhật Bản thanh mát hòa quyện cùng lớp kem sữa dịu.'
    },
    {
      id: 'tiered_cake', group: 'cakes', groupName: 'Bánh kem', name: 'Bánh kem nhiều tầng',
      unlockLevel: 4, basePrice: 165, baseXp: 80, idealTemp: 170, bakeTime: 10,
      moldName: 'Khuôn Tiệc Nhiều Tầng', moldShape: 'tiered_cake', boxSize: 'tall',
      baseIngredients: ['flour', 'sugar', 'egg', 'milk', 'butter'],
      description: 'Tuyệt phẩm bánh nhiều tầng lộng lẫy cho sinh nhật, kỷ niệm và lễ cưới.'
    },
    {
      id: 'fruit_cream_cake', group: 'cakes', groupName: 'Bánh kem', name: 'Bánh kem trái cây',
      unlockLevel: 5, basePrice: 118, baseXp: 55, idealTemp: 170, bakeTime: 9,
      moldName: 'Khuôn Tròn Trái Cây', moldShape: 'round_cake', boxSize: 'large',
      baseIngredients: ['flour', 'sugar', 'egg', 'milk', 'butter', 'strawberry', 'blueberry'],
      description: 'Bánh kem tươi phủ đầy trái cây bốn mùa thanh ngọt rực rỡ.'
    },
    {
      id: 'birthday_cream_cake', group: 'cakes', groupName: 'Bánh kem', name: 'Bánh kem sinh nhật',
      unlockLevel: 3, basePrice: 125, baseXp: 58, idealTemp: 170, bakeTime: 9.5,
      moldName: 'Khuôn Bánh Sinh Nhật', moldShape: 'round_cake', boxSize: 'large',
      baseIngredients: ['flour', 'sugar', 'egg', 'milk', 'butter', 'vanilla'],
      description: 'Bánh kem tiệc sinh nhật trang trí ruy băng và nến lung linh.'
    },
    {
      id: 'swiss_roll', group: 'cakes', groupName: 'Bánh kem', name: 'Bánh cuộn kem',
      unlockLevel: 6, basePrice: 105, baseXp: 50, idealTemp: 175, bakeTime: 7.5,
      moldName: 'Khay Cuộn Chữ Nhật', moldShape: 'swiss_roll', boxSize: 'wide',
      baseIngredients: ['flour', 'sugar', 'egg', 'milk', 'butter'],
      description: 'Bông lan cuộn xoắn ốc mềm mại ôm trọn lớp kem tươi mịn màng.'
    },

    // --- NHÓM 2: CUPCAKE VÀ MUFFIN (6) ---
    {
      id: 'cupcake_cherry', group: 'cupcake_muffin', groupName: 'Cupcake và Muffin', name: 'Cupcake cherry',
      unlockLevel: 1, basePrice: 58, baseXp: 26, idealTemp: 180, bakeTime: 7,
      moldName: 'Khuôn Cupcake Cherry', moldShape: 'cupcake', boxSize: 'medium',
      baseIngredients: ['flour', 'sugar', 'egg', 'milk', 'butter'],
      description: 'Cupcake kem bồng bềnh đính trái cherry đỏ mọng phía trên.'
    },
    {
      id: 'cupcake_strawberry', group: 'cupcake_muffin', groupName: 'Cupcake và Muffin', name: 'Cupcake dâu',
      unlockLevel: 2, basePrice: 60, baseXp: 28, idealTemp: 180, bakeTime: 7,
      moldName: 'Khuôn Cupcake Dâu', moldShape: 'cupcake', boxSize: 'medium',
      baseIngredients: ['flour', 'sugar', 'egg', 'milk', 'butter', 'strawberry'],
      description: 'Cupcake hồng pastel thơm mùi dâu tây tươi dịu ngọt.'
    },
    {
      id: 'cupcake_chocolate', group: 'cupcake_muffin', groupName: 'Cupcake và Muffin', name: 'Cupcake chocolate',
      unlockLevel: 2, basePrice: 62, baseXp: 28, idealTemp: 180, bakeTime: 7,
      moldName: 'Khuôn Cupcake Choco', moldShape: 'cupcake', boxSize: 'medium',
      baseIngredients: ['flour', 'sugar', 'egg', 'milk', 'butter', 'chocolate'],
      description: 'Cupcake cốt socola đậm đà cùng kem bắt xoắn quyến rũ.'
    },
    {
      id: 'cupcake_vanilla', group: 'cupcake_muffin', groupName: 'Cupcake và Muffin', name: 'Cupcake vanilla',
      unlockLevel: 1, basePrice: 52, baseXp: 24, idealTemp: 180, bakeTime: 6.8,
      moldName: 'Khuôn Cupcake Vanilla', moldShape: 'cupcake', boxSize: 'medium',
      baseIngredients: ['flour', 'sugar', 'egg', 'milk', 'butter'],
      description: 'Chiếc cupcake vanilla nhẹ tênh thơm ngát hương vani tinh khiết.'
    },
    {
      id: 'cupcake', group: 'cupcake_muffin', groupName: 'Cupcake và Muffin', name: 'Cupcake kem xoắn',
      unlockLevel: 1, basePrice: 55, baseXp: 25, idealTemp: 180, bakeTime: 7,
      moldName: 'Khuôn Cupcake Giấy', moldShape: 'cupcake', boxSize: 'medium',
      baseIngredients: ['flour', 'sugar', 'egg', 'milk', 'butter'],
      description: 'Bánh bông lan nhỏ xinh với phần kem bắt xoắn nhiều tầng bồng bềnh.'
    },
    {
      id: 'blueberry_muffin', group: 'cupcake_muffin', groupName: 'Cupcake và Muffin', name: 'Muffin việt quất',
      unlockLevel: 3, basePrice: 66, baseXp: 30, idealTemp: 185, bakeTime: 7.5,
      moldName: 'Khuôn Muffin Việt Quất', moldShape: 'muffin', boxSize: 'medium',
      baseIngredients: ['flour', 'sugar', 'egg', 'milk', 'butter', 'blueberry'],
      description: 'Muffin nở vồng nứt mặt hấp dẫn điểm xuyết quả việt quất mọng.'
    },

    // --- NHÓM 3: DONUT (6) ---
    {
      id: 'donut', group: 'donut', groupName: 'Donut', name: 'Donut đường',
      unlockLevel: 1, basePrice: 50, baseXp: 22, idealTemp: 190, bakeTime: 6,
      moldName: 'Khuôn Vòng Donut Đường', moldShape: 'donut', boxSize: 'medium',
      baseIngredients: ['flour', 'sugar', 'egg', 'milk', 'butter'],
      description: 'Bánh vòng mềm xốp phủ đường mịn và men ngọt truyền thống.'
    },
    {
      id: 'donut_chocolate', group: 'donut', groupName: 'Donut', name: 'Donut chocolate',
      unlockLevel: 1, basePrice: 56, baseXp: 25, idealTemp: 190, bakeTime: 6,
      moldName: 'Khuôn Donut Choco', moldShape: 'donut', boxSize: 'medium',
      baseIngredients: ['flour', 'sugar', 'egg', 'milk', 'butter', 'chocolate'],
      description: 'Donut nhúng sốt chocolate đen óng ánh thơm lừng.'
    },
    {
      id: 'donut_strawberry', group: 'donut', groupName: 'Donut', name: 'Donut dâu',
      unlockLevel: 2, basePrice: 58, baseXp: 26, idealTemp: 190, bakeTime: 6,
      moldName: 'Khuôn Donut Dâu', moldShape: 'donut', boxSize: 'medium',
      baseIngredients: ['flour', 'sugar', 'egg', 'milk', 'butter', 'strawberry'],
      description: 'Donut phủ glaze dâu hồng ngọt ngào kèm lát dâu tươi.'
    },
    {
      id: 'donut_matcha', group: 'donut', groupName: 'Donut', name: 'Donut matcha',
      unlockLevel: 4, basePrice: 64, baseXp: 29, idealTemp: 185, bakeTime: 6,
      moldName: 'Khuôn Donut Matcha', moldShape: 'donut', boxSize: 'medium',
      baseIngredients: ['flour', 'sugar', 'egg', 'milk', 'butter', 'matcha'],
      description: 'Donut rưới sọc matcha xanh mát cân bằng vị béo nhẹ.'
    },
    {
      id: 'donut_rainbow', group: 'donut', groupName: 'Donut', name: 'Donut cầu vồng',
      unlockLevel: 3, basePrice: 62, baseXp: 28, idealTemp: 190, bakeTime: 6,
      moldName: 'Khuôn Donut Cầu Vồng', moldShape: 'donut', boxSize: 'medium',
      baseIngredients: ['flour', 'sugar', 'egg', 'milk', 'butter'],
      description: 'Donut rực rỡ phủ cốm cầu vồng vui mắt cho ngày tràn năng lượng.'
    },
    {
      id: 'donut_cream', group: 'donut', groupName: 'Donut', name: 'Donut nhân kem',
      unlockLevel: 5, basePrice: 70, baseXp: 32, idealTemp: 185, bakeTime: 6.5,
      moldName: 'Khay Donut Nhân Kem', moldShape: 'donut_filled', boxSize: 'medium',
      baseIngredients: ['flour', 'sugar', 'egg', 'milk', 'butter', 'vanilla'],
      description: 'Bánh donut tròn đầy không lỗ với nhân kem sữa tươi béo ngậy bên trong.'
    },

    // --- NHÓM 4: BÁNH QUY (6) ---
    {
      id: 'cookie', group: 'cookie', groupName: 'Bánh quy', name: 'Cookie chocolate chip',
      unlockLevel: 1, basePrice: 45, baseXp: 20, idealTemp: 180, bakeTime: 5.5,
      moldName: 'Khay Cookie Choco Chip', moldShape: 'cookie', boxSize: 'compact',
      baseIngredients: ['flour', 'sugar', 'egg', 'butter', 'chocolate'],
      description: 'Bánh quy viền giòn tâm mềm điểm đầy hạt chocolate chip thơm lừng.'
    },
    {
      id: 'cookie_heart', group: 'cookie', groupName: 'Bánh quy', name: 'Cookie trái tim',
      unlockLevel: 2, basePrice: 52, baseXp: 23, idealTemp: 175, bakeTime: 5.5,
      moldName: 'Khuôn Cookie Trái Tim', moldShape: 'cookie_heart', boxSize: 'compact',
      baseIngredients: ['flour', 'sugar', 'egg', 'butter'],
      description: 'Bánh quy hình trái tim viền ren dịu dàng cho lời chúc yêu thương.'
    },
    {
      id: 'cookie_star', group: 'cookie', groupName: 'Bánh quy', name: 'Cookie ngôi sao',
      unlockLevel: 2, basePrice: 50, baseXp: 22, idealTemp: 175, bakeTime: 5.5,
      moldName: 'Khuôn Cookie Ngôi Sao', moldShape: 'cookie_star', boxSize: 'compact',
      baseIngredients: ['flour', 'sugar', 'egg', 'butter'],
      description: 'Bánh quy bơ hình ngôi sao năm cánh giòn rụm lấp lánh đường hạt.'
    },
    {
      id: 'cookie_butter', group: 'cookie', groupName: 'Bánh quy', name: 'Cookie bơ',
      unlockLevel: 1, basePrice: 44, baseXp: 19, idealTemp: 175, bakeTime: 5.5,
      moldName: 'Khay Cookie Bơ Hoa', moldShape: 'cookie', boxSize: 'compact',
      baseIngredients: ['flour', 'sugar', 'egg', 'butter'],
      description: 'Bánh quy bơ Đan Mạch bắt hoa xoắn thơm ngậy tan trong miệng.'
    },
    {
      id: 'cookie_choco_filled', group: 'cookie', groupName: 'Bánh quy', name: 'Cookie nhân chocolate',
      unlockLevel: 4, basePrice: 60, baseXp: 27, idealTemp: 180, bakeTime: 6,
      moldName: 'Khay Cookie Kẹp Nhân', moldShape: 'cookie', boxSize: 'compact',
      baseIngredients: ['flour', 'sugar', 'egg', 'butter', 'cacao', 'chocolate'],
      description: 'Hai lớp bánh quy giòn kẹp nhân kem chocolate sánh mịn chính giữa.'
    },
    {
      id: 'cookie_ginger', group: 'cookie', groupName: 'Bánh quy', name: 'Bánh quy gừng',
      unlockLevel: 5, basePrice: 65, baseXp: 30, idealTemp: 180, bakeTime: 6,
      moldName: 'Khuôn Người Bánh Gừng', moldShape: 'cookie_ginger', boxSize: 'compact',
      baseIngredients: ['flour', 'sugar', 'egg', 'butter', 'ginger_spice'],
      description: 'Bánh quy gừng quế tạo hình chú bé dễ thương ấm áp hương lễ hội.'
    },

    // --- NHÓM 5: BÁNH NGỌT (6) ---
    {
      id: 'croissant', group: 'pastry', groupName: 'Bánh ngọt', name: 'Croissant',
      unlockLevel: 2, basePrice: 68, baseXp: 31, idealTemp: 195, bakeTime: 7,
      moldName: 'Khay Nướng Croissant', moldShape: 'croissant', boxSize: 'wide',
      baseIngredients: ['flour', 'sugar', 'milk', 'butter'],
      description: 'Bánh sừng bò Pháp ngàn lớp vàng ruộm thơm nức mùi bơ.'
    },
    {
      id: 'macaron', group: 'pastry', groupName: 'Bánh ngọt', name: 'Macaron',
      unlockLevel: 3, basePrice: 75, baseXp: 35, idealTemp: 160, bakeTime: 6.5,
      moldName: 'Tấm Lót Macaron', moldShape: 'macaron', boxSize: 'compact',
      baseIngredients: ['flour', 'sugar', 'egg', 'milk'],
      description: 'Bánh Pháp vỏ giòn viền ren đặc trưng kẹp nhân kem dẻo pastel.'
    },
    {
      id: 'eclair', group: 'pastry', groupName: 'Bánh ngọt', name: 'Éclair',
      unlockLevel: 4, basePrice: 78, baseXp: 36, idealTemp: 185, bakeTime: 7.5,
      moldName: 'Khay Bánh Éclair Dài', moldShape: 'eclair', boxSize: 'wide',
      baseIngredients: ['flour', 'sugar', 'egg', 'milk', 'butter', 'chocolate'],
      description: 'Bánh su thuôn dài nhân kem trứng béo mịn phủ sọc chocolate.'
    },
    {
      id: 'tiramisu', group: 'pastry', groupName: 'Bánh ngọt', name: 'Tiramisu',
      unlockLevel: 6, basePrice: 98, baseXp: 46, idealTemp: 170, bakeTime: 7,
      moldName: 'Khuôn Vuông Tiramisu', moldShape: 'tiramisu', boxSize: 'medium',
      baseIngredients: ['flour', 'sugar', 'egg', 'cream_cheese', 'cacao'],
      description: 'Món Ý kinh điển kết hợp kem phô mai mascarpone và bột cacao thơm lừng.'
    },
    {
      id: 'cheesecake', group: 'pastry', groupName: 'Bánh ngọt', name: 'Cheesecake',
      unlockLevel: 5, basePrice: 94, baseXp: 44, idealTemp: 165, bakeTime: 8.5,
      moldName: 'Khuôn Cheesecake Tam Giác', moldShape: 'cheesecake', boxSize: 'medium',
      baseIngredients: ['flour', 'sugar', 'egg', 'milk', 'butter', 'cream_cheese'],
      description: 'Bánh phô mai nướng mềm ẩm béo ngậy dùng kèm dâu tây tươi.'
    },
    {
      id: 'tart', group: 'pastry', groupName: 'Bánh ngọt', name: 'Bánh tart dâu',
      unlockLevel: 3, basePrice: 95, baseXp: 45, idealTemp: 180, bakeTime: 8,
      moldName: 'Khuôn Tart Viền Sóng', moldShape: 'tart', boxSize: 'medium',
      baseIngredients: ['flour', 'sugar', 'egg', 'butter', 'strawberry'],
      description: 'Đế bánh tart viền sóng giòn rụm ôm trọn kem custard và dâu tây tươi.'
    },

    // --- NHÓM 6: MÓN TRÁNG MIỆNG (6) ---
    {
      id: 'pudding_caramel', group: 'dessert', groupName: 'Món tráng miệng', name: 'Pudding caramel',
      unlockLevel: 2, basePrice: 64, baseXp: 29, idealTemp: 160, bakeTime: 7.5,
      moldName: 'Khuôn Flan Pudding', moldShape: 'pudding', boxSize: 'medium',
      baseIngredients: ['sugar', 'egg', 'milk', 'caramel'],
      description: 'Bánh pudding trứng sữa núng nính dưới lớp sốt caramel hổ phách.'
    },
    {
      id: 'panna_cotta', group: 'dessert', groupName: 'Món tráng miệng', name: 'Panna cotta',
      unlockLevel: 5, basePrice: 82, baseXp: 38, idealTemp: 160, bakeTime: 6.5,
      moldName: 'Khuôn Panna Cotta Gợn Sóng', moldShape: 'pudding', boxSize: 'medium',
      baseIngredients: ['sugar', 'milk', 'cream_cheese', 'vanilla'],
      description: 'Kem sữa nấu kiểu Ý mượt mịn tan chảy cùng trang trí trái tim nhỏ xinh.'
    },
    {
      id: 'fruit_jelly', group: 'dessert', groupName: 'Món tráng miệng', name: 'Thạch trái cây',
      unlockLevel: 4, basePrice: 68, baseXp: 32, idealTemp: 160, bakeTime: 5.5,
      moldName: 'Khuôn Thạch Trái Cây', moldShape: 'pudding', boxSize: 'medium',
      baseIngredients: ['sugar', 'milk', 'gelatin', 'strawberry'],
      description: 'Thạch mát lạnh trong veo gói trọn những viên trái cây tươi ngon.'
    },
    {
      id: 'cream_puff', group: 'dessert', groupName: 'Món tráng miệng', name: 'Bánh su kem',
      unlockLevel: 3, basePrice: 62, baseXp: 28, idealTemp: 195, bakeTime: 7,
      moldName: 'Khay Nướng Su Kem', moldShape: 'cream_puff', boxSize: 'medium',
      baseIngredients: ['flour', 'sugar', 'egg', 'milk', 'butter'],
      description: 'Vỏ su giòn xốp căng tròn kẹp đầy nhân kem tươi mát lạnh.'
    },
    {
      id: 'cake_pop', group: 'dessert', groupName: 'Món tráng miệng', name: 'Cake pop',
      unlockLevel: 2, basePrice: 54, baseXp: 24, idealTemp: 175, bakeTime: 6,
      moldName: 'Khay Khuôn Bi Cake Pop', moldShape: 'cake_pop', boxSize: 'tall',
      baseIngredients: ['flour', 'sugar', 'egg', 'butter', 'caramel'],
      description: 'Viên bánh ngọt nhỏ cắm que thắt nơ dễ thương phủ kẹo cốm.'
    },
    {
      id: 'fruit_parfait', group: 'dessert', groupName: 'Món tráng miệng', name: 'Parfait trái cây',
      unlockLevel: 7, basePrice: 112, baseXp: 52, idealTemp: 165, bakeTime: 6,
      moldName: 'Ly Tráng Miệng Parfait', moldShape: 'parfait', boxSize: 'tall',
      baseIngredients: ['sugar', 'milk', 'gelatin', 'strawberry', 'blueberry'],
      description: 'Ly tráng miệng xếp tầng kem tươi, mứt quả, bánh quế và dâu mọng.'
    }
  ];

  const FROSTING_COLORS = [
    { id: 'white', name: 'Kem trắng', hex: '#FFFDF9', shadow: '#EADFD5', unlockLevel: 1 },
    { id: 'pink', name: 'Kem hồng', hex: '#FFB3C6', shadow: '#FF85A1', unlockLevel: 1 },
    { id: 'mint', name: 'Kem xanh mint', hex: '#A8E6CF', shadow: '#74C69D', unlockLevel: 1 },
    { id: 'lavender', name: 'Kem tím', hex: '#D8BBFF', shadow: '#B185DB', unlockLevel: 1 },
    { id: 'yellow', name: 'Kem vàng', hex: '#FFE699', shadow: '#F4C95D', unlockLevel: 2 },
    { id: 'chocolate', name: 'Kem chocolate', hex: '#6F4E37', shadow: '#4B3222', unlockLevel: 1 },
    { id: 'strawberry', name: 'Kem dâu', hex: '#FF758F', shadow: '#E04F6D', unlockLevel: 2 }
  ];

  const NOZZLES = [
    { id: 'swirl', name: 'Vòi xoắn ốc', desc: 'Xoắn kem cao bồng bềnh' },
    { id: 'smooth', name: 'Phủ kem mịn', desc: 'Bề mặt phẳng mịn màng' },
    { id: 'piped', name: 'Vòi viền sò', desc: 'Viền chấm bi dễ thương' },
    { id: 'drizzle', name: 'Rưới sốt lượn', desc: 'Đường sốt chảy mềm mại' }
  ];

  const TOPPINGS = [
    { id: 'strawberry', name: 'Dâu tây', unlockLevel: 1, color: '#FF4D6D' },
    { id: 'blueberry', name: 'Việt quất', unlockLevel: 1, color: '#5E60CE' },
    { id: 'cherry', name: 'Cherry', unlockLevel: 1, color: '#D90429' },
    { id: 'chocochip', name: 'Chocolate chip', unlockLevel: 1, color: '#4A2511' },
    { id: 'candy', name: 'Kẹo màu', unlockLevel: 1, color: '#FF99C8' },
    { id: 'cookie_crumb', name: 'Bánh quy vụn', unlockLevel: 2, color: '#C68B59' },
    { id: 'marshmallow', name: 'Marshmallow', unlockLevel: 2, color: '#FFF0F5' },
    { id: 'sprinkles', name: 'Hạt cốm', unlockLevel: 1, color: '#FFD166' },
    { id: 'sugar_flower', name: 'Hoa đường', unlockLevel: 3, color: '#FF85A1' }
  ];

  const ACCESSORIES = [
    { id: 'candle', name: 'Nến', unlockLevel: 1 },
    { id: 'star', name: 'Ngôi sao', unlockLevel: 1 },
    { id: 'heart', name: 'Trái tim', unlockLevel: 1 },
    { id: 'ribbon', name: 'Ruy băng', unlockLevel: 2 },
    { id: 'sign', name: 'Biển chúc mừng', unlockLevel: 1 },
    { id: 'topper_stick', name: 'Que trang trí', unlockLevel: 2 }
  ];

  // 15+ distinct decoration styles / presets used for variety & recipe collection
  const DECOR_STYLES = [
    { id: 'strawberry_dream', name: 'Giấc Mơ Dâu Hồng', cakeType: 'cupcake', batter: 'chocolate', frostingColor: 'pink', nozzle: 'swirl', topping: 'strawberry', toppingCount: 2, accessory: 'heart', accCount: 1 },
    { id: 'candy_pop', name: 'Kẹo Ngọt Cầu Vồng', cakeType: 'cupcake', batter: 'vanilla', frostingColor: 'pink', nozzle: 'swirl', topping: 'candy', toppingCount: 3, accessory: 'star', accCount: 1 },
    { id: 'mint_choco_ring', name: 'Donut Bạc Hà Choco', cakeType: 'donut', batter: 'chocolate', frostingColor: 'mint', nozzle: 'smooth', topping: 'chocochip', toppingCount: 4, accessory: 'none', accCount: 0 },
    { id: 'berry_glaze', name: 'Donut Việt Quất Tím', cakeType: 'donut', batter: 'vanilla', frostingColor: 'lavender', nozzle: 'drizzle', topping: 'sprinkles', toppingCount: 3, accessory: 'star', accCount: 1 },
    { id: 'floral_bliss', name: 'Bánh Kem Hoa Hồng', cakeType: 'round_cake', batter: 'vanilla', frostingColor: 'white', nozzle: 'piped', topping: 'strawberry', toppingCount: 4, accessory: 'ribbon', accCount: 1 },
    { id: 'choco_cherry', name: 'Rừng Đen Cherry', cakeType: 'round_cake', batter: 'chocolate', frostingColor: 'chocolate', nozzle: 'drizzle', topping: 'cherry', toppingCount: 3, accessory: 'heart', accCount: 1 },
    { id: 'butter_star', name: 'Bánh Quy Ngôi Sao', cakeType: 'cookie', batter: 'vanilla', frostingColor: 'yellow', nozzle: 'drizzle', topping: 'candy', toppingCount: 3, accessory: 'star', accCount: 1 },
    { id: 'marshmallow_cocoa', name: 'Bánh Quy Socola Kẹo Dẻo', cakeType: 'cookie', batter: 'cacao', frostingColor: 'white', nozzle: 'piped', topping: 'marshmallow', toppingCount: 3, accessory: 'heart', accCount: 1 },
    { id: 'lavender_macaron', name: 'Macaron Oải Hương', cakeType: 'macaron', batter: 'blueberry', frostingColor: 'lavender', nozzle: 'smooth', topping: 'sugar_flower', toppingCount: 2, accessory: 'ribbon', accCount: 1 },
    { id: 'matcha_zen', name: 'Tart Trà Xanh Thanh Mát', cakeType: 'tart', batter: 'matcha', frostingColor: 'mint', nozzle: 'swirl', topping: 'blueberry', toppingCount: 4, accessory: 'topper_stick', accCount: 1 },
    { id: 'sunny_berry_tart', name: 'Tart Dâu Nắng Vàng', cakeType: 'tart', batter: 'vanilla', frostingColor: 'yellow', nozzle: 'piped', topping: 'strawberry', toppingCount: 4, accessory: 'heart', accCount: 1 },
    { id: 'strawberry_roll', name: 'Bánh Cuộn Dâu Kem', cakeType: 'swiss_roll', batter: 'strawberry', frostingColor: 'white', nozzle: 'drizzle', topping: 'strawberry', toppingCount: 3, accessory: 'ribbon', accCount: 1 },
    { id: 'birthday_2tier', name: 'Bánh Sinh Nhật 2 Tầng', cakeType: 'tiered_cake', batter: 'vanilla', frostingColor: 'pink', nozzle: 'piped', topping: 'strawberry', toppingCount: 4, accessory: 'candle', accCount: 5, extraAccessory: 'sign' },
    { id: 'anniversary_rose', name: 'Bánh Kỷ Niệm Ngọt Ngào', cakeType: 'tiered_cake', batter: 'strawberry', frostingColor: 'lavender', nozzle: 'swirl', topping: 'sugar_flower', toppingCount: 4, accessory: 'heart', accCount: 2, extraAccessory: 'sign' },
    { id: 'royal_wedding', name: 'Bánh Cưới Hoàng Gia', cakeType: 'tiered_cake', batter: 'vanilla', frostingColor: 'white', nozzle: 'piped', topping: 'cherry', toppingCount: 5, accessory: 'ribbon', accCount: 1, extraAccessory: 'heart' },
    { id: 'crumb_party', name: 'Cupcake Vụn Bánh Quy', cakeType: 'cupcake', batter: 'cacao', frostingColor: 'chocolate', nozzle: 'swirl', topping: 'cookie_crumb', toppingCount: 3, accessory: 'topper_stick', accCount: 1 }
  ];

  const BOX_COLORS = [
    { id: 'pink', name: 'Hộp hồng pastel', hex: '#FFD1DC', border: '#FF9BB3' },
    { id: 'mint', name: 'Hộp xanh mint', hex: '#C7F2E3', border: '#74C69D' },
    { id: 'yellow', name: 'Hộp vàng bơ', hex: '#FFF0B3', border: '#F2C94C' },
    { id: 'cream', name: 'Hộp kem sữa', hex: '#FFF8EB', border: '#E6CCA3' },
    { id: 'lavender', name: 'Hộp tím lavender', hex: '#E5D4FF', border: '#B185DB' },
    { id: 'special', name: 'Giấy gói chấm bi', hex: '#FFE5EC', border: '#FF758F', pattern: true }
  ];

  const RIBBON_COLORS = [
    { id: 'rose', name: 'Ruy băng hồng đậm', hex: '#FF5D8F' },
    { id: 'gold', name: 'Ruy băng vàng ánh', hex: '#F4B942' },
    { id: 'mint', name: 'Ruy băng bạc hà', hex: '#40916C' },
    { id: 'purple', name: 'Ruy băng tím mộng mơ', hex: '#9D4EDD' },
    { id: 'cream', name: 'Ruy băng kem ngọc', hex: '#F8EDEB' }
  ];

  const BOX_CARDS = [
    { id: 'none', name: 'Không thiệp' },
    { id: 'sweet', name: 'Thiệp Sweet Dreams' },
    { id: 'birthday', name: 'Thiệp Chúc Mừng Sinh Nhật' },
    { id: 'love', name: 'Thiệp Gửi Yêu Thương' }
  ];

  const BOX_STICKERS = [
    { id: 'none', name: 'Không sticker' },
    { id: 'heart', name: 'Sticker Trái Tim' },
    { id: 'star', name: 'Sticker Ngôi Sao' },
    { id: 'flower', name: 'Sticker Bông Hoa' },
    { id: 'crown', name: 'Sticker Vương Miện' }
  ];

  // 12 Distinct Chibi Characters
  const CUSTOMERS = [
    {
      id: 'miu', name: 'Bé Miu', role: 'Bé gái thích màu hồng', unlockLevel: 1,
      hairColor: '#5C3A21', hairStyle: 'pigtails', skinColor: '#FFE0CC',
      outfitColor: '#FF9EBB', outfitStyle: 'dress', accessory: 'bow',
      patienceBase: 95, tipMultiplier: 1.15, favoriteColor: 'pink',
      greetings: [
        'Xin chào! Mình muốn đặt một chiếc bánh màu hồng thật xinh nhé!',
        'Chị chủ ơi! Làm cho Miu một chiếc bánh siêu dễ thương nha!'
      ],
      happyLines: ['Woa! Bánh xinh xỉu luôn, cảm ơn tiệm nhé!', 'Ngon tuyệt cú mèo! Miu sẽ quay lại nữa!'],
      impatientLines: ['Huhu lâu quá đi à, Miu đói bụng rồi...', 'Bánh của Miu sắp xong chưa ạ?'],
      sadLines: ['Ôi không... bánh không giống Miu tưởng lắm...', 'Hic, Miu đợi lâu quá nên về đây...']
    },
    {
      id: 'ken', name: 'Cậu bé Ken', role: 'Tín đồ Chocolate', unlockLevel: 1,
      hairColor: '#2B1B17', hairStyle: 'spiky', skinColor: '#FCD5B5',
      outfitColor: '#74C69D', outfitStyle: 'hoodie', accessory: 'cap',
      patienceBase: 90, tipMultiplier: 1.1, favoriteFlavor: 'chocolate',
      greetings: [
        'Yo! Cho mình một phần bánh thật đậm vị nhé!',
        'Nghe đồn tiệm làm bánh ngon nhất khu phố, làm giúp mình một cái nha!'
      ],
      happyLines: ['Quá đỉnh! Đúng vị mình thích luôn!', '10 điểm không có nhưng!'],
      impatientLines: ['Ơ kìa, mình chờ hơi lâu rồi đấy...', 'Nhanh tay lên đầu bếp ơi!'],
      sadLines: ['Chán ghê, vị này hơi lạ...', 'Thôi mình đi tiệm khác vậy.']
    },
    {
      id: 'hoa', name: 'Chị Hoa', role: 'Cô gái yêu hoa & bánh kem', unlockLevel: 1,
      hairColor: '#8D5524', hairStyle: 'long_wave', skinColor: '#FFE5D4',
      outfitColor: '#D8BBFF', outfitStyle: 'cardigan', accessory: 'flower',
      patienceBase: 100, tipMultiplier: 1.2,
      greetings: [
        'Chào bạn, tiệm trang trí xinh quá! Cho mình đặt chiếc bánh này nhé.',
        'Hôm nay trời đẹp, mình muốn thưởng thức một chiếc bánh thật tinh tế!'
      ],
      happyLines: ['Đẹp như một bức tranh vậy, cảm ơn bạn nhiều!', 'Hương thơm dịu nhẹ quá, rất ưng ý!'],
      impatientLines: ['Bạn ơi kiểm tra giúp mình đơn nhé, mình sắp có hẹn rồi.', 'Chờ hơi lâu một chút rồi nhỉ...'],
      sadLines: ['Tiếc quá, chiếc bánh chưa được như mong đợi.', 'Mình phải đi ngay rồi, hẹn dịp khác nhé.']
    },
    {
      id: 'minh', name: 'Anh Minh', role: 'Chàng trai mua bánh sinh nhật', unlockLevel: 1,
      hairColor: '#1F2421', hairStyle: 'neat', skinColor: '#F5CBA7',
      outfitColor: '#99D6FF', outfitStyle: 'shirt', accessory: 'glasses',
      patienceBase: 95, tipMultiplier: 1.25,
      greetings: [
        'Chào tiệm! Hôm nay là sinh nhật bạn thân mình, làm giúp mình thật chỉn chu nhé!',
        'Mình cần một chiếc bánh đặc biệt để gây bất ngờ cho tiệc tối nay!'
      ],
      happyLines: ['Tuyệt vời! Chắc chắn mọi người sẽ thích mê!', 'Chuyên nghiệp thật sự, gửi thêm bạn tiền tip nhé!'],
      impatientLines: ['Sắp tới giờ tổ chức tiệc rồi bạn ơi...', 'Cố gắng nhanh giúp mình một chút nha!'],
      sadLines: ['Ôi, thế này khó mang đi tặng rồi...', 'Xin lỗi, mình không thể đợi thêm được nữa.']
    },
    {
      id: 'lan', name: 'Mẹ Lan', role: 'Người mẹ mua bánh cho con', unlockLevel: 1,
      hairColor: '#4A2C2A', hairStyle: 'bun', skinColor: '#FFE0CC',
      outfitColor: '#FFE599', outfitStyle: 'apron_dress', accessory: 'earrings',
      patienceBase: 105, tipMultiplier: 1.15,
      greetings: [
        'Chào cháu, cô muốn mua chiếc bánh ngọt cho bé nhà cô ăn xế.',
        'Nhờ tiệm làm giúp cô một phần thật thơm ngon và an toàn cho bé nhé!'
      ],
      happyLines: ['Khéo tay quá cháu ơi, bé nhà cô thích lắm đây!', 'Cảm ơn cháu nhiều, chúc tiệm đông khách!'],
      impatientLines: ['Cháu ơi xong chưa, cô còn đi đón bé...', 'Lâu hơn cô nghĩ một chút rồi đấy.'],
      sadLines: ['Ui chao, hơi thất vọng một chút cháu ạ...', 'Cô phải đi đón con gấp rồi, lần sau nhé.']
    },
    {
      id: 'baovy', name: 'Bảo & Vy', role: 'Cặp đôi mua bánh kỷ niệm', unlockLevel: 2,
      hairColor: '#3D2B1F', hairStyle: 'couple', skinColor: '#FFE0CC',
      outfitColor: '#FFB5A7', outfitStyle: 'couple_wear', accessory: 'heart_pin',
      patienceBase: 100, tipMultiplier: 1.3,
      greetings: [
        'Hôm nay là kỷ niệm của tụi mình! Làm giúp tụi mình một chiếc bánh ngọt ngào nhé!',
        'Tụi mình muốn chia sẻ một chiếc bánh thật lãng mạn tại Sweet Dreams!'
      ],
      happyLines: ['Lãng mạn quá đi! Cảm ơn Sweet Dreams nhiều!', 'Kỷ niệm đáng nhớ nhất luôn, tuyệt vời!'],
      impatientLines: ['Đợi chút nữa nha anh... sao lâu thế nhỉ?', 'Tiệm đông khách quá hay sao mà chậm vậy?'],
      sadLines: ['Hic, làm tụt mood kỷ niệm mất rồi...', 'Tụi mình đi dạo chỗ khác vậy...']
    },
    {
      id: 'hanh', name: 'Bà Ngoại Hạnh', role: 'Khách hàng lớn tuổi hiền hậu', unlockLevel: 2,
      hairColor: '#D9D9D9', hairStyle: 'grandma_bun', skinColor: '#FAD7C4',
      outfitColor: '#B8E0D2', outfitStyle: 'floral_blouse', accessory: 'round_glasses',
      patienceBase: 115, tipMultiplier: 1.2,
      greetings: [
        'Chào cháu yêu, tiệm lúc nào cũng thơm mùi bơ sữa dễ chịu quá.',
        'Bà thèm chút ngọt nhẹ nhàng, cháu làm giúp bà chiếc bánh này nhé.'
      ],
      happyLines: ['Ngon như bánh nhà làm vậy, bà thương quá!', 'Cháu giỏi lắm, bà thưởng thêm tiền kẹo nè!'],
      impatientLines: ['Bà ngồi chờ hơi mỏi chân rồi cháu ơi...', 'Chậm rãi nhưng đừng quên đơn của bà nhé.'],
      sadLines: ['Chà, bánh này hơi khác ý bà một tẹo...', 'Bà về nghỉ ngơi trước đây cháu nhé.']
    },
    {
      id: 'bella', name: 'Cô Bella', role: 'Khách VIP sành điệu', unlockLevel: 3,
      hairColor: '#FFD166', hairStyle: 'glam_bob', skinColor: '#FFE5D9',
      outfitColor: '#9D4EDD', outfitStyle: 'vip_coat', accessory: 'crown_beret',
      patienceBase: 85, tipMultiplier: 1.6,
      greetings: [
        'Bonjour! Tôi nghe nói đây là tiệm bánh hot nhất. Hãy chứng minh tài năng đi!',
        'Tôi sẵn sàng trả hậu hĩnh nếu chiếc bánh đạt chuẩn hoàn hảo!'
      ],
      happyLines: ['Magnifique! Đúng đẳng cấp tôi tìm kiếm!', 'Xuất sắc! Đây là phần thưởng xứng đáng cho bạn!'],
      impatientLines: ['Thời gian của tôi rất quý giá đấy nhé!', 'Không ngờ tiệm lại phục vụ chậm thế này...'],
      sadLines: ['Không đạt tiêu chuẩn của tôi chút nào!', 'Thất vọng thật sự, tạm biệt!']
    },
    {
      id: 'khotinh', name: 'Ông Khó Tính', role: 'Nhà phê bình ẩm thực', unlockLevel: 3,
      hairColor: '#4A4E69', hairStyle: 'mustache', skinColor: '#F3C9B1',
      outfitColor: '#6D6875', outfitStyle: 'suit', accessory: 'monocle',
      patienceBase: 75, tipMultiplier: 1.5,
      greetings: [
        'Hừm! Để xem tay nghề tiệm bánh này tới đâu. Làm đúng từng chi tiết cho tôi!',
        'Tôi rất kỹ tính về độ chín và cách trang trí đấy nhé!'
      ],
      happyLines: ['Hừm... Phải công nhận là rất hoàn hảo! Khá khen!', 'Không chê vào đâu được, tôi ghi nhận!'],
      impatientLines: ['Quá chậm! Dịch vụ kiểu gì thế này?!', 'Tôi sắp hết kiên nhẫn rồi đấy!'],
      sadLines: ['Kém cỏi! Sai yêu cầu thế này sao bán được?!', 'Tôi không đợi thêm một giây nào nữa!']
    },
    {
      id: 'linh', name: 'Bạn Linh', role: 'Khách quen thân thiết', unlockLevel: 1,
      hairColor: '#6B4226', hairStyle: 'ponytail', skinColor: '#FFE0CC',
      outfitColor: '#A0C4FF', outfitStyle: 'overall', accessory: 'hairclip',
      patienceBase: 105, tipMultiplier: 1.15,
      greetings: [
        'Lại là mình đây! Hôm nay tiệm có món gì ngon cho mình không?',
        'Chào chủ tiệm thân yêu! Cho mình order món quen thuộc nha!'
      ],
      happyLines: ['Lúc nào cũng ngon xuất sắc! Yêu tiệm nhất!', 'Mình chụp ảnh check-in ngay mới được!'],
      impatientLines: ['Ê bạn ơi quên đơn của khách quen rồi hả?', 'Chờ xíu nữa là mình ngủ gật luôn đó!'],
      sadLines: ['Ủa hôm nay tay nghề xuống phong độ hả bạn?', 'Thôi mai mình quay lại vậy nha...']
    },
    {
      id: 'ti', name: 'Đầu bếp Tí', role: 'Thực khách sành ăn', unlockLevel: 4,
      hairColor: '#582F0E', hairStyle: 'chef_hat', skinColor: '#FFE2C6',
      outfitColor: '#FFFFFF', outfitStyle: 'chef_coat', accessory: 'scarf',
      patienceBase: 90, tipMultiplier: 1.35,
      greetings: [
        'Xin chào đồng nghiệp! Tôi muốn nếm thử công thức đặc biệt của tiệm bạn.',
        'Hương thơm từ lò nướng hấp dẫn quá, làm cho tôi một chiếc nhé!'
      ],
      happyLines: ['Kỹ thuật đánh bột và nướng quá chuẩn xác!', 'Thật đáng học hỏi, chúc mừng bạn!'],
      impatientLines: ['Nhịp độ bếp hơi chậm rồi bạn ơi...', 'Bánh sắp ra lò chưa đồng nghiệp?'],
      sadLines: ['Hương vị chưa cân bằng lắm...', 'Tiếc quá, tôi phải về bếp của mình rồi.']
    },
    {
      id: 'keongot', name: 'Em Tôm Kẹo Ngọt', role: 'Khách nhí đáng yêu', unlockLevel: 2,
      hairColor: '#FF8FAB', hairStyle: 'curly', skinColor: '#FFE5D4',
      outfitColor: '#FFD166', outfitStyle: 'stripe_tee', accessory: 'star_clip',
      patienceBase: 85, tipMultiplier: 1.2,
      greetings: [
        'Oa oa nhiều bánh ngon quá! Cho em cái có thật nhiều kẹo ngọt nha!',
        'Em thích bánh lấp lánh ngôi sao cơ!'
      ],
      happyLines: ['Hoan hô! Bánh ngon số dzách!!', 'Em thích mê luôn á, hihi!'],
      impatientLines: ['Chị ơi bánh em đâu rồi ạ?', 'Em muốn ăn bánh ngay cơ...'],
      sadLines: ['Huhu bánh hổng có giống hình...', 'Em buồn rồi, em đi về méc mẹ...']
    }
  ];

  // 15 Levels progression
  const LEVELS = Array.from({ length: 15 }, (_, idx) => {
    const level = idx + 1;
    return {
      level,
      xpRequired: Math.round(80 * Math.pow(1.32, idx)),
      maxCustomers: level === 1 ? 2 : level <= 3 ? 3 : 4,
      patienceFactor: Math.max(0.76, 1 - idx * 0.015),
      title: [
        'Tiệm Bánh Mới Mở',
        'Thợ Bánh Tập Sự',
        'Hương Bơ Ngọt Ngào',
        'Nghệ Nhân Pastel',
        'Tiệm Bánh Khu Phố',
        'Bậc Thầy Bắt Kem',
        'Xưởng Bánh Mơ Ước',
        'Thiên Đường Kẹo Ngọt',
        'Chuyên Gia Bếp Bánh',
        'Tiệm Bánh Nổi Tiếng',
        'Nghệ Thuật Ngọt Lịm',
        'Ngôi Sao Ẩm Thực',
        'Thương Hiệu Sweet Dreams',
        'Huyền Thoại Tiệm Bánh',
        'Đế Chế Bánh Ngọt 5 Sao'
      ][idx]
    };
  });

  // Equipment Upgrades
  const EQUIPMENT_UPGRADES = [
    {
      id: 'oven', name: 'Lò Nướng Cao Cấp', icon: 'oven',
      desc: 'Nướng nhanh hơn và mở rộng khoảng thời gian bánh chín hoàn hảo.',
      levels: [
        { level: 1, name: 'Lò Nướng Cơ Bản', price: 0, speedMult: 1.0, perfectWindow: 2.8 },
        { level: 2, name: 'Lò Nướng Gốm Pastel', price: 180, speedMult: 1.2, perfectWindow: 3.6 },
        { level: 3, name: 'Lò Nướng Hoàng Gia 5 Sao', price: 420, speedMult: 1.45, perfectWindow: 4.5 }
      ]
    },
    {
      id: 'mixer', name: 'Máy Đánh Trứng Tự Động', icon: 'mixer',
      desc: 'Trộn bột nhanh mịn, hạn chế bị quá tay và tăng chất lượng cốt bánh.',
      levels: [
        { level: 1, name: 'Phới Lồng Thủ Công', price: 0, speedMult: 1.0, bonusQuality: 0 },
        { level: 2, name: 'Máy Đánh Trứng Pastel', price: 150, speedMult: 1.3, bonusQuality: 4 },
        { level: 3, name: 'Máy Trộn Siêu Mịn Pro', price: 360, speedMult: 1.6, bonusQuality: 8 }
      ]
    },
    {
      id: 'deco_table', name: 'Bàn Trang Trí Lớn', icon: 'table',
      desc: 'Tăng thêm tiền tip trang trí và mở rộng không gian thao tác bắt kem.',
      levels: [
        { level: 1, name: 'Bàn Gỗ Nhỏ', price: 0, tipBonus: 0 },
        { level: 2, name: 'Bàn Đá Cẩm Thạch Hồng', price: 200, tipBonus: 8 },
        { level: 3, name: 'Quầy Nghệ Thuật Sweet Dreams', price: 450, tipBonus: 18 }
      ]
    },
    {
      id: 'display_shelf', name: 'Kệ Trưng Bày Bánh', icon: 'shelf',
      desc: 'Giữ khách kiên nhẫn lâu hơn khi ngắm nhìn những chiếc bánh lung linh.',
      levels: [
        { level: 1, name: 'Kệ Bánh Nhỏ', price: 0, patienceBonus: 0 },
        { level: 2, name: 'Tủ Kính Pastel 2 Tầng', price: 170, patienceBonus: 12 },
        { level: 3, name: 'Tủ Bánh Pha Lê Lung Linh', price: 390, patienceBonus: 25 }
      ]
    },
    {
      id: 'counter_service', name: 'Nâng Cấp Quầy Bánh', icon: 'counter',
      desc: 'Tăng tốc độ tiếp đón và nâng sức chứa khách hàng tối đa tại quầy.',
      levels: [
        { level: 1, name: 'Quầy Gỗ Tiêu Chuẩn', price: 0, extraSlots: 0, patienceBonus: 0 },
        { level: 2, name: 'Quầy Đón Khách Nhanh', price: 220, extraSlots: 1, patienceBonus: 8 },
        { level: 3, name: 'Quầy Phục Vụ VIP', price: 480, extraSlots: 2, patienceBonus: 16 }
      ]
    },
    {
      id: 'ingredient_pantry', name: 'Nâng Cấp Kho Nguyên Liệu', icon: 'pantry',
      desc: 'Giảm chi phí nhập nguyên liệu và mở khóa sớm hương vị cao cấp.',
      levels: [
        { level: 1, name: 'Tủ Kho Cơ Bản', price: 0, discountPct: 0, earlyUnlock: 0 },
        { level: 2, name: 'Tủ Lạnh Bảo Quản Tươi', price: 160, discountPct: 15, earlyUnlock: 1 },
        { level: 3, name: 'Kho Nguyên Liệu Nhập Khẩu', price: 380, discountPct: 30, earlyUnlock: 3 }
      ]
    }
  ];

  // Visual Shop Decorations (Appear directly in the bakery scene & equippable per category!)
  const SHOP_DECORS = [
    { id: 'fairy_lights', category: 'lights', catName: 'Đèn trang trí', name: 'Đèn Dây Sao Ấm Áp', price: 90, desc: 'Dây đèn vàng ấm nhấp nháy lung linh trên trần tiệm.', tipBonus: 3, patienceBonus: 4 },
    { id: 'crystal_lights', category: 'lights', catName: 'Đèn trang trí', name: 'Đèn Lồng Pha Lê Pastel', price: 170, desc: 'Đèn thả trần pha lê nhiều màu sắc dịu dàng.', tipBonus: 6, patienceBonus: 6 },
    { id: 'pastel_wallpaper', category: 'wallpaper', catName: 'Giấy dán tường', name: 'Giấy Dán Tường Kẻ Sọc', price: 120, desc: 'Tường sọc hồng kem dễ thương làm bừng sáng không gian.', tipBonus: 4, patienceBonus: 5 },
    { id: 'mint_wallpaper', category: 'wallpaper', catName: 'Giấy dán tường', name: 'Giấy Dán Tường Chấm Bi Mint', price: 145, desc: 'Tường xanh mint chấm bi kem dịu mát mắt.', tipBonus: 5, patienceBonus: 6 },
    { id: 'flower_pots', category: 'plants', catName: 'Cây xanh', name: 'Chậu Hoa Pastel Cửa Sổ', price: 110, desc: 'Những chậu hoa cúc & hồng đặt bên cửa sổ tiệm bánh.', tipBonus: 4, patienceBonus: 6 },
    { id: 'monstera_plant', category: 'plants', catName: 'Cây xanh', name: 'Chậu Cây Xanh Góc Tiệm', price: 135, desc: 'Cây xanh tươi mát đặt cạnh cửa ra vào tạo không khí thư giãn.', tipBonus: 4, patienceBonus: 7 },
    { id: 'cozy_seating', category: 'seating', catName: 'Bàn ghế', name: 'Bộ Bàn Ghế Nơ Hồng', price: 160, desc: 'Bộ bàn ghế bọc nệm nơ hồng cho khách ngồi chờ thoải mái.', tipBonus: 6, patienceBonus: 10 },
    { id: 'wall_art', category: 'wall_art', catName: 'Tranh treo tường', name: 'Bộ Tranh Bánh Ngọt Pastel', price: 105, desc: 'Khung tranh minh họa cupcake và bánh kem treo tường.', tipBonus: 4, patienceBonus: 4 },
    { id: 'pastel_floor', category: 'floor', catName: 'Sàn nhà', name: 'Sàn Gỗ Ô Caro Kem Hồng', price: 150, desc: 'Nền gạch caro kem hồng ấm áp chuẩn phong cách tiệm Pháp.', tipBonus: 5, patienceBonus: 5 },
    { id: 'bakery_signboard', category: 'signboard', catName: 'Biển hiệu tiệm bánh', name: 'Biển Hiệu Gỗ Sweet Dreams', price: 125, desc: 'Biển hiệu tiệm bánh phát sáng treo phía trên cửa tiệm.', tipBonus: 5, patienceBonus: 5 },
    { id: 'ribbon_bunting', category: 'counter', catName: 'Quầy bánh', name: 'Dải Ruy Băng Quầy Bánh', price: 130, desc: 'Dải ruy băng pastel và cờ tiệc trang trí quầy thu ngân.', tipBonus: 5, patienceBonus: 5 }
  ];

  // Daily/Normal Quests Pool
  const QUEST_TEMPLATES = [
    { id: 'q_orders_3', title: 'Hoàn thành 3 đơn hàng', type: 'orders', target: 3, rewardCoins: 80, rewardXp: 40 },
    { id: 'q_coins_200', title: 'Kiếm 200 xu từ bán bánh', type: 'coins_earned', target: 200, rewardCoins: 90, rewardXp: 45 },
    { id: 'q_serve_5', title: 'Phục vụ 5 lượt khách hàng', type: 'customers_served', target: 5, rewardCoins: 110, rewardXp: 55 },
    { id: 'q_cupcake_2', title: 'Làm 2 chiếc Cupcake', type: 'cake_cupcake', target: 2, rewardCoins: 75, rewardXp: 35 },
    { id: 'q_perfect_2', title: 'Đạt 2 đơn PERFECT (3 sao)', type: 'perfect', target: 2, rewardCoins: 130, rewardXp: 65 }
  ];

  // Achievements (with live progress tracking)
  const ACHIEVEMENTS = [
    { id: 'ach_first_cake', title: 'Đơn Bánh Đầu Tiên', desc: 'Hoàn thành đơn hàng đầu tiên.', target: 1, progress: (s) => s.stats.totalOrders, rewardCoins: 50, check: (s) => s.stats.totalOrders >= 1 },
    { id: 'ach_customers_10', title: 'Phục Vụ 10 Khách Hàng', desc: 'Phục vụ thành công 10 lượt khách hàng.', target: 10, progress: (s) => s.stats.customersServed, rewardCoins: 120, check: (s) => s.stats.customersServed >= 10 },
    { id: 'ach_orders_50', title: 'Hoàn Thành 50 Đơn Hàng', desc: 'Chạm mốc 50 đơn hàng bánh ngọt.', target: 50, progress: (s) => s.stats.totalOrders, rewardCoins: 350, check: (s) => s.stats.totalOrders >= 50 },
    { id: 'ach_all_recipes', title: 'Mở Khóa Tất Cả Công Thức', desc: 'Đạt cấp độ mở khóa toàn bộ 38 loại bánh trong Bộ Sưu Tập (Cấp 7).', target: CAKE_TYPES.length, progress: (s) => CAKE_TYPES.filter(c => c.unlockLevel <= s.level).length, rewardCoins: 450, check: (s) => CAKE_TYPES.every(c => c.unlockLevel <= s.level) },
    { id: 'ach_rep_100', title: 'Đạt 100 Danh Tiếng', desc: 'Xây dựng uy tín tiệm bánh đạt 100 điểm danh tiếng.', target: 100, progress: (s) => s.reputation, rewardCoins: 280, check: (s) => s.reputation >= 100 },
    { id: 'ach_decor_10', title: 'Sở Hữu 10 Vật Phẩm Trang Trí', desc: 'Mua ít nhất 10 vật phẩm trang trí cho tiệm.', target: 10, progress: (s) => (s.decorationsOwned || []).length, rewardCoins: 300, check: (s) => (s.decorationsOwned || []).length >= 10 },
    { id: 'ach_level_5', title: 'Đạt Cấp Độ 5', desc: 'Phát triển tiệm bánh lên cấp độ 5.', target: 5, progress: (s) => s.level, rewardCoins: 260, check: (s) => s.level >= 5 },
    { id: 'ach_perfect_5', title: 'Bàn Tay Vàng', desc: 'Đạt đánh giá PERFECT 5 lần.', target: 5, progress: (s) => s.stats.perfectCount, rewardCoins: 150, check: (s) => s.stats.perfectCount >= 5 },
    { id: 'ach_rich_1000', title: 'Triệu Phú Bánh Ngọt', desc: 'Tích lũy tổng doanh thu 1.000 xu.', target: 1000, progress: (s) => s.stats.totalEarned, rewardCoins: 250, check: (s) => s.stats.totalEarned >= 1000 },
    { id: 'ach_special_3', title: 'Bậc Thầy Sự Kiện', desc: 'Hoàn thành 3 đơn hàng đặc biệt.', target: 3, progress: (s) => s.stats.specialCompleted, rewardCoins: 220, check: (s) => s.stats.specialCompleted >= 3 }
  ];

  const SPECIAL_EVENTS = [
    {
      id: 'birthday', name: 'Đơn Bánh Sinh Nhật', badge: '🎂 Sinh Nhật',
      cakeType: 'tiered_cake', batter: 'vanilla', frostingColor: 'pink', nozzle: 'piped',
      topping: 'strawberry', toppingCount: 4, accessory: 'candle', accCount: 5,
      extraAccessory: 'sign', signText: 'Happy Birthday',
      boxColor: 'pink', ribbonColor: 'rose', card: 'birthday', sticker: 'crown',
      bonusCoins: 120, bonusXp: 65,
      speech: 'ĐẶC BIỆT: Mình cần bánh sinh nhật 2 tầng kem hồng, dâu tây, 5 cây nến và biển Happy Birthday!'
    },
    {
      id: 'anniversary', name: 'Đơn Bánh Kỷ Niệm', badge: '💖 Kỷ Niệm',
      cakeType: 'tiered_cake', batter: 'strawberry', frostingColor: 'lavender', nozzle: 'swirl',
      topping: 'sugar_flower', toppingCount: 4, accessory: 'heart', accCount: 2,
      extraAccessory: 'sign', signText: 'Happy Anniversary',
      boxColor: 'lavender', ribbonColor: 'purple', card: 'love', sticker: 'heart',
      bonusCoins: 130, bonusXp: 70,
      speech: 'ĐẶC BIỆT: Tụi mình đặt bánh kỷ niệm 2 tầng kem tím, hoa đường và trái tim nhé!'
    },
    {
      id: 'wedding', name: 'Đơn Bánh Cưới', badge: '💍 Bánh Cưới',
      cakeType: 'tiered_cake', batter: 'vanilla', frostingColor: 'white', nozzle: 'piped',
      topping: 'cherry', toppingCount: 5, accessory: 'ribbon', accCount: 1,
      extraAccessory: 'heart', signText: 'Sweet Love',
      boxColor: 'cream', ribbonColor: 'gold', card: 'love', sticker: 'flower',
      bonusCoins: 160, bonusXp: 85,
      speech: 'ĐẶC BIỆT: Cần chiếc bánh cưới 2 tầng trắng tinh khôi, cherry đỏ, ruy băng và trái tim!'
    },
    {
      id: 'seasonal', name: 'Đơn Bánh Theo Mùa', badge: '🌸 Theo Mùa',
      cakeType: 'tart', batter: 'matcha', frostingColor: 'mint', nozzle: 'swirl',
      topping: 'blueberry', toppingCount: 4, accessory: 'star', accCount: 2,
      boxColor: 'mint', ribbonColor: 'mint', card: 'sweet', sticker: 'flower',
      bonusCoins: 95, bonusXp: 50,
      speech: 'ĐẶC BIỆT: Mùa xuân tới rồi! Cho mình Tart trà xanh kem mint, việt quất và 2 ngôi sao!'
    },
    {
      id: 'bulk', name: 'Đơn Hàng Số Lượng Lớn', badge: '📦 Số Lượng Lớn',
      cakeType: 'cupcake', batter: 'chocolate', frostingColor: 'pink', nozzle: 'swirl',
      topping: 'candy', toppingCount: 3, accessory: 'star', accCount: 1,
      quantity: 3,
      boxColor: 'special', ribbonColor: 'rose', card: 'sweet', sticker: 'star',
      bonusCoins: 110, bonusXp: 60,
      speech: 'ĐẶC BIỆT: Lớp mình tổ chức tiệc! Đặt 3 chiếc Cupcake Chocolate kem hồng, 3 viên kẹo & ngôi sao!'
    }
  ];

  return {
    INGREDIENTS,
    BATTERS,
    CAKE_GROUPS,
    CAKE_TYPES,
    FROSTING_COLORS,
    NOZZLES,
    TOPPINGS,
    ACCESSORIES,
    DECOR_STYLES,
    BOX_COLORS,
    RIBBON_COLORS,
    BOX_CARDS,
    BOX_STICKERS,
    CUSTOMERS,
    LEVELS,
    EQUIPMENT_UPGRADES,
    SHOP_DECORS,
    QUEST_TEMPLATES,
    ACHIEVEMENTS,
    SPECIAL_EVENTS
  };
})();

