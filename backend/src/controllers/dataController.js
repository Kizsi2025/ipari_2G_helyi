// Get product data
const getProducts = (req, res) => {
  try {
    const products = [
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

    res.json({
      success: true,
      message: 'Termékadatok lekérve',
      data: products,
      totalCount: products.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Termékadatok hiba',
      message: error.message
    });
  }
};

// Get event cards
const getEventCards = (req, res) => {
  try {
    const eventCards = [
      {
        id: 1,
        title: 'Termelési előrejelzés',
        message: 'A selejt-felismerő rendszer lenyűgöző, de most a jövőbe akarunk látni! Pontos előrejelzést kérünk a következő heti termelési darabszámra.',
        task: 'Fektessetek be -10 TK-t egy Regressziós modellbe!',
        cost: 10,
        type: 'regression',
        difficulty: 'medium'
      },
      {
        id: 2,
        title: 'Energiahatékonysági optimalizálás',
        message: 'A pénzügyi osztály riadót fújt a növekvő energiaköltségek miatt! Előrejelzést kell készítenetek a gépsorok várható energiafogyasztásáról.',
        task: 'Aktiváljátok a Regressziós modellt -10 TK befektetésével!',
        cost: 10,
        type: 'regression',
        difficulty: 'hard'
      },
      {
        id: 3,
        title: 'Prediktív karbantartás',
        message: 'Váratlan géphiba állította le a teljes 3-as gyártósort! Készítsetek egy modellt, ami előre jelzi a kulcsfontosságú alkatrészek hátralévő élettartamát.',
        task: 'Oldjátok fel a Regressziós modell képességet -10 TK-ért!',
        cost: 10,
        type: 'regression',
        difficulty: 'hard'
      },
      {
        id: 4,
        title: 'Készletgazdálkodási kihívás',
        message: 'Az alapanyag-készlet kritikusan alacsony! A beszerzési osztálynak pontos előrejelzésre van szüksége a következő havi alapanyag-szükségletről.',
        task: 'Fektessetek be -10 TK-t egy Regressziós modellbe!',
        cost: 10,
        type: 'regression',
        difficulty: 'medium'
      }
    ];

    res.json({
      success: true,
      message: 'Eseménykártyák lekérve',
      data: eventCards,
      totalCount: eventCards.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Eseménykártyák hiba',
      message: error.message
    });
  }
};

module.exports = {
  getProducts,
  getEventCards
};
