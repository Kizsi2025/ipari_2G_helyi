// products.js - Future-Tech gyár termékadatai
export const products = [
  // 1. Címkézett adatcsomag
  { id: 1, weight: 150, color: 'Piros', size: 'Kicsi', category: 'Megfelelő' },
  { id: 2, weight: 200, color: 'Kék', size: 'Nagy', category: 'Selejt' },
  { id: 3, weight: 180, color: 'Zöld', size: 'Közepes', category: 'Megfelelő' },
  { id: 4, weight: 220, color: 'Piros', size: 'Nagy', category: 'Selejt' },
  { id: 5, weight: 160, color: 'Kék', size: 'Kicsi', category: 'Megfelelő' },

  // 2. Címkézett adatcsomag
  { id: 6, weight: 300, color: 'Zöld', size: 'Nagy', category: 'Selejt' },
  { id: 7, weight: 250, color: 'Piros', size: 'Közepes', category: 'Megfelelő' },
  { id: 8, weight: 270, color: 'Kék', size: 'Kicsi', category: 'Selejt' },
  { id: 9, weight: 290, color: 'Zöld', size: 'Nagy', category: 'Megfelelő' },
  { id: 10, weight: 310, color: 'Piros', size: 'Közepes', category: 'Megfelelő' },

  // 3. Címkézett adatcsomag
  { id: 11, weight: 120, color: 'Kék', size: 'Kicsi', category: 'Megfelelő' },
  { id: 12, weight: 140, color: 'Zöld', size: 'Közepes', category: 'Megfelelő' },
  { id: 13, weight: 130, color: 'Piros', size: 'Nagy', category: 'Selejt' },
  { id: 14, weight: 160, color: 'Kék', size: 'Kicsi', category: 'Megfelelő' },
  { id: 15, weight: 150, color: 'Zöld', size: 'Közepes', category: 'Selejt' },

  // 4. Címkézett adatcsomag
  { id: 16, weight: 210, color: 'Piros', size: 'Nagy', category: 'Selejt' },
  { id: 17, weight: 230, color: 'Kék', size: 'Nagy', category: 'Megfelelő' },
  { id: 18, weight: 220, color: 'Zöld', size: 'Közepes', category: 'Megfelelő' },
  { id: 19, weight: 240, color: 'Piros', size: 'Kicsi', category: 'Selejt' },
  { id: 20, weight: 200, color: 'Kék', size: 'Közepes', category: 'Megfelelő' }
];

export const getProductStats = () => {
  const total = products.length;
  const megfelelő = products.filter(p => p.category === 'Megfelelő').length;
  const selejt = products.filter(p => p.category === 'Selejt').length;

  return {
    total,
    megfelelő,
    selejt,
    selejtArány: ((selejt / total) * 100).toFixed(1)
  };
};
