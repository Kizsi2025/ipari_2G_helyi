// controllers/dataController.js - Adatkezelés és szolgáltatás
class DataController {

  // Termék adatok lekérése (20 termék a PDF-ből)
  static async getProducts(req, res) {
    try {
      const { category, limit, offset, sortBy, order } = req.query;

      // A 20 termék adatai a PDF alapján
      const products = [
        // 1. Címkézett adatcsomag
        { id: 1, weight: 150, color: 'Piros', size: 'Kicsi', category: 'Megfelelő', package: 1 },
        { id: 2, weight: 200, color: 'Kék', size: 'Nagy', category: 'Selejt', package: 1 },
        { id: 3, weight: 180, color: 'Zöld', size: 'Közepes', category: 'Megfelelő', package: 1 },
        { id: 4, weight: 220, color: 'Piros', size: 'Nagy', category: 'Selejt', package: 1 },
        { id: 5, weight: 160, color: 'Kék', size: 'Kicsi', category: 'Megfelelő', package: 1 },

        // 2. Címkézett adatcsomag
        { id: 6, weight: 300, color: 'Zöld', size: 'Nagy', category: 'Selejt', package: 2 },
        { id: 7, weight: 250, color: 'Piros', size: 'Közepes', category: 'Megfelelő', package: 2 },
        { id: 8, weight: 270, color: 'Kék', size: 'Kicsi', category: 'Selejt', package: 2 },
        { id: 9, weight: 290, color: 'Zöld', size: 'Nagy', category: 'Megfelelő', package: 2 },
        { id: 10, weight: 310, color: 'Piros', size: 'Közepes', category: 'Megfelelő', package: 2 },

        // 3. Címkézett adatcsomag
        { id: 11, weight: 120, color: 'Kék', size: 'Kicsi', category: 'Megfelelő', package: 3 },
        { id: 12, weight: 140, color: 'Zöld', size: 'Közepes', category: 'Megfelelő', package: 3 },
        { id: 13, weight: 130, color: 'Piros', size: 'Nagy', category: 'Selejt', package: 3 },
        { id: 14, weight: 160, color: 'Kék', size: 'Kicsi', category: 'Megfelelő', package: 3 },
        { id: 15, weight: 150, color: 'Zöld', size: 'Közepes', category: 'Selejt', package: 3 },

        // 4. Címkézett adatcsomag
        { id: 16, weight: 210, color: 'Piros', size: 'Nagy', category: 'Selejt', package: 4 },
        { id: 17, weight: 230, color: 'Kék', size: 'Nagy', category: 'Megfelelő', package: 4 },
        { id: 18, weight: 220, color: 'Zöld', size: 'Közepes', category: 'Megfelelő', package: 4 },
        { id: 19, weight: 240, color: 'Piros', size: 'Kicsi', category: 'Selejt', package: 4 },
        { id: 20, weight: 200, color: 'Kék', size: 'Közepes', category: 'Megfelelő', package: 4 }
      ];

      let filteredProducts = products;

      // Szűrés kategória alapján
      if (category) {
        filteredProducts = filteredProducts.filter(product => 
          product.category.toLowerCase() === category.toLowerCase()
        );
      }

      // Rendezés
      if (sortBy) {
        const sortOrder = order === 'desc' ? -1 : 1;
        filteredProducts.sort((a, b) => {
          if (sortBy === 'weight') {
            return (a.weight - b.weight) * sortOrder;
          } else if (sortBy === 'id') {
            return (a.id - b.id) * sortOrder;
          } else if (sortBy === 'color' || sortBy === 'size' || sortBy === 'category') {
            return a[sortBy].localeCompare(b[sortBy]) * sortOrder;
          }
          return 0;
        });
      }

      // Lapozás
      const startIndex = parseInt(offset) || 0;
      const limitNum = parseInt(limit) || filteredProducts.length;
      const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limitNum);

      // Statisztikák számítása
      const statistics = {
        total: products.length,
        filtered: filteredProducts.length,
        megfelelő: products.filter(p => p.category === 'Megfelelő').length,
        selejt: products.filter(p => p.category === 'Selejt').length,
        colors: {
          piros: products.filter(p => p.color === 'Piros').length,
          kék: products.filter(p => p.color === 'Kék').length,
          zöld: products.filter(p => p.color === 'Zöld').length
        },
        sizes: {
          kicsi: products.filter(p => p.size === 'Kicsi').length,
          közepes: products.filter(p => p.size === 'Közepes').length,
          nagy: products.filter(p => p.size === 'Nagy').length
        },
        weightStats: {
          min: Math.min(...products.map(p => p.weight)),
          max: Math.max(...products.map(p => p.weight)),
          avg: Math.round(products.reduce((sum, p) => sum + p.weight, 0) / products.length)
        }
      };

      res.json({
        success: true,
        message: 'Termék adatok sikeresen lekérve',
        data: {
          products: paginatedProducts,
          pagination: {
            total: filteredProducts.length,
            limit: limitNum,
            offset: startIndex,
            hasMore: startIndex + limitNum < filteredProducts.length
          },
          statistics,
          filters: {
            category: category || null,
            sortBy: sortBy || null,
            order: order || 'asc'
          }
        }
      });

    } catch (error) {
      console.error('Hiba a termék adatok lekérése során:', error);
      res.status(500).json({
        success: false,
        error: 'Szerver hiba a termék adatok lekérése során',
        message: error.message
      });
    }
  }

  // Eseménykártyák lekérése (4 kártya a PDF alapján)
  static async getEventCards(req, res) {
    try {
      const eventCards = [
        {
          id: 1,
          title: 'Termelési előrejelzés',
          type: 'regression',
          cost: 10,
          reward: 5,
          difficulty: 'közepes',
          description: 'A selejt-felismerő rendszer lenyűgöző, de most a jövőbe akarunk látni! Pontos előrejelzést kérünk a következő heti termelési darabszámra a kapacitástervezéshez.',
          task: 'Fektessetek be -10 Tanulási kreditet (TK) egy Regressziós modellbe, hogy teljesítsétek a kérést! Enélkül a projekt hatékonysága jelentősen csökken.',
          requirements: ['Regressziós modell'],
          benefits: ['Kapacitástervezés optimalizálása', 'Termelési előrejelzés'],
          icon: '📈',
          category: 'production'
        },
        {
          id: 2,
          title: 'Energiahatékonysági optimalizálás',
          type: 'regression',
          cost: 10,
          reward: 5,
          difficulty: 'nehéz',
          description: 'A pénzügyi osztály riadót fújt a növekvő energiaköltségek miatt! Előrejelzést kell készítenetek a gépsorok várható energiafogyasztásáról, hogy optimalizálni tudjuk a felhasználást.',
          task: 'A kihívás teljesítéséhez aktiváljátok a Regressziós modellt -10 Tanulási kredit (TK) befektetésével! Enélkül a gyár működése veszteséges marad.',
          requirements: ['Regressziós modell'],
          benefits: ['Energiaköltség csökkentés', 'Környezettudatos működés'],
          icon: '⚡',
          category: 'energy'
        },
        {
          id: 3,
          title: 'Prediktív karbantartás',
          type: 'regression',
          cost: 10,
          reward: 5,
          difficulty: 'közepes',
          description: 'Váratlan géphiba állította le a teljes 3-as gyártósort! A vezetés megelőző megoldást követel. Készítsetek egy modellt, ami előre jelzi a kulcsfontosságú alkatrészek hátralévő élettartamát órában kifejezve!',
          task: 'Oldjátok fel a Regressziós modell képességet -10 Tanulási kreditért (TK), hogy megelőzzétek a jövőbeli leállásokat! A gyár termelése és a hírnevünk múlik rajta.',
          requirements: ['Regressziós modell'],
          benefits: ['Leállások megelőzése', 'Költségmegtakarítás'],
          icon: '🔧',
          category: 'maintenance'
        },
        {
          id: 4,
          title: 'Készletgazdálkodási kihívás',
          type: 'regression',
          cost: 10,
          reward: 5,
          difficulty: 'közepes',
          description: 'Az alapanyag-készlet kritikusan alacsony, ami a termelés leállásával fenyeget! A beszerzési osztálynak pontos előrejelzésre van szüksége a következő havi alapanyag-szükségletről.',
          task: 'Fektessetek be -10 Tanulási kreditet (TK) egy Regressziós modellbe a pontos becsléshez! Ha kifogytok az alapanyagból, a küldetés elbukik.',
          requirements: ['Regressziós modell'],
          benefits: ['Optimális készletszint', 'Ellátási lánc stabilitás'],
          icon: '📦',
          category: 'logistics'
        }
      ];

      const { category, difficulty, type } = req.query;
      let filteredCards = eventCards;

      // Szűrések
      if (category) {
        filteredCards = filteredCards.filter(card => card.category === category);
      }

      if (difficulty) {
        filteredCards = filteredCards.filter(card => card.difficulty === difficulty);
      }

      if (type) {
        filteredCards = filteredCards.filter(card => card.type === type);
      }

      // Statisztikák
      const statistics = {
        total: eventCards.length,
        filtered: filteredCards.length,
        byCategory: {
          production: eventCards.filter(c => c.category === 'production').length,
          energy: eventCards.filter(c => c.category === 'energy').length,
          maintenance: eventCards.filter(c => c.category === 'maintenance').length,
          logistics: eventCards.filter(c => c.category === 'logistics').length
        },
        byDifficulty: {
          közepes: eventCards.filter(c => c.difficulty === 'közepes').length,
          nehéz: eventCards.filter(c => c.difficulty === 'nehéz').length
        },
        totalCost: eventCards.reduce((sum, card) => sum + card.cost, 0),
        totalReward: eventCards.reduce((sum, card) => sum + card.reward, 0)
      };

      res.json({
        success: true,
        message: 'Eseménykártyák sikeresen lekérve',
        data: {
          eventCards: filteredCards,
          statistics,
          filters: {
            category: category || null,
            difficulty: difficulty || null,
            type: type || null
          }
        }
      });

    } catch (error) {
      console.error('Hiba az eseménykártyák lekérése során:', error);
      res.status(500).json({
        success: false,
        error: 'Szerver hiba az eseménykártyák lekérése során',
        message: error.message
      });
    }
  }

  // Modell információk lekérése
  static async getModelInfo(req, res) {
    try {
      const models = {
        classification: {
          id: 'classification',
          name: 'Klasszifikációs Modell',
          nickname: 'Sólyomszem',
          type: 'supervised_learning',
          cost: 15,
          description: 'A digitális döntéshozó. Valós időben azonosítja a selejtes termékeket a gyártósoron.',
          capabilities: [
            'Termékek kategorizálása (Megfelelő/Selejt)',
            'Hibás termékek automatikus felismerése',
            'Valós idejű minőség-ellenőrzés',
            'Gyártósori integráció'
          ],
          inputs: ['Súly (g)', 'Színkód', 'Méret', 'Hőmérséklet', 'Rezgésszint'],
          outputs: ['Megfelelő', 'Selejt'],
          accuracy: '95%',
          processingTime: '< 100ms',
          industrialApplications: [
            'Automatizált minőség-ellenőrzés',
            'Gépek állapotának diagnosztizálása',
            'Nyomtatott áramköri lapok ellenőrzése'
          ],
          icon: '🎯',
          status: 'available'
        },
        regression: {
          id: 'regression',
          name: 'Regressziós Modell',
          nickname: 'Kristálygömb',
          type: 'supervised_learning',
          cost: 15,
          description: 'A jövőbe látó. Numerikus értékek pontos előrejelzésére specializálódott modell.',
          capabilities: [
            'Termelési mennyiség előrejelzése',
            'Energiafogyasztás becslése',
            'Alkatrész élettartam predikció',
            'Alapanyag-szükséglet kalkuláció'
          ],
          inputs: ['Historikus adatok', 'Gépállapotok', 'Megrendelések', 'Műszakbeosztás'],
          outputs: ['Numerikus értékek (darab, kWh, órák)'],
          accuracy: '92%',
          processingTime: '< 500ms',
          industrialApplications: [
            'Prediktív karbantartás',
            'Energiahatékonyság optimalizálás',
            'Készletgazdálkodás',
            'Kapacitástervezés'
          ],
          icon: '📈',
          status: 'available'
        }
      };

      const { modelType } = req.params;

      if (modelType && models[modelType]) {
        res.json({
          success: true,
          message: `${models[modelType].name} információk sikeresen lekérve`,
          data: models[modelType]
        });
      } else {
        res.json({
          success: true,
          message: 'Modell információk sikeresen lekérve',
          data: {
            models: Object.values(models),
            totalModels: Object.keys(models).length,
            totalCost: Object.values(models).reduce((sum, model) => sum + model.cost, 0)
          }
        });
      }

    } catch (error) {
      console.error('Hiba a modell információk lekérése során:', error);
      res.status(500).json({
        success: false,
        error: 'Szerver hiba a modell információk lekérése során',
        message: error.message
      });
    }
  }

  // Adatelemzési segédletek
  static async getDataAnalysisHelpers(req, res) {
    try {
      const helpers = {
        classificationTips: [
          'A súly és méret kombinációja erős indikátor lehet',
          'A piros színű, nagy méretű termékek gyakran selejtesek',
          'A kék színű, kis méretű termékek általában megfelelőek',
          'Figyeld meg a mintázatokat az adatcsomagok között'
        ],
        regressionTips: [
          'Historikus adatok elemzése kulcsfontosságú',
          'Szezonális trendek figyelembevétele',
          'Többféle változó kombinálása javítja a pontosságot',
          'Outlierek kiszűrése javíthatja a modell teljesítményét'
        ],
        dataPatterns: {
          weightDistribution: {
            light: '120-160g (gyakran megfelelő)',
            medium: '180-250g (vegyes)',
            heavy: '270-310g (gyakran vegyes, mérettől függően)'
          },
          colorPatterns: {
            piros: 'Nagy méretben gyakran selejt',
            kék: 'Kis méretben általában megfelelő',
            zöld: 'Közepes méretben jellemzően megfelelő'
          },
          sizePatterns: {
            kicsi: 'Általában megfelelő, kivéve ha túl nehéz',
            közepes: 'Kiegyensúlyozott, színtől függően',
            nagy: 'Nagyobb esély a selejtességre'
          }
        },
        businessInsights: [
          'A selejt arány jelenleg ~40% (8/20 termék)',
          'A 2. adatcsomagban a legmagasabb a selejt arány',
          'Súlyoptimalizálás javíthatja a minőséget',
          'Színkódolás átgondolása szükséges lehet'
        ]
      };

      res.json({
        success: true,
        message: 'Adatelemzési segédletek sikeresen lekérve',
        data: helpers
      });

    } catch (error) {
      console.error('Hiba az adatelemzési segédletek lekérése során:', error);
      res.status(500).json({
        success: false,
        error: 'Szerver hiba az adatelemzési segédletek lekérése során',
        message: error.message
      });
    }
  }

  // Prezentációs template lekérése
  static async getPresentationTemplate(req, res) {
    try {
      const template = {
        title: 'Future-Tech MI Megoldási Terv',
        duration: '2 perc',
        structure: {
          opening: {
            duration: '15 másodperc',
            content: 'Üdvözlés és csapat bemutatkozás',
            example: 'Tisztelt Vezetőség! Az [Csapat neve] nevében jelentem: a küldetést teljesítettük.'
          },
          classificationSolution: {
            duration: '30 másodperc',
            title: 'Klasszifikációs megoldás',
            modelName: 'Sólyomszem',
            content: 'Minőség-ellenőrzés forradalmasítása',
            keyPoints: [
              'Valós idejű selejt-felismerés',
              'Automatikus szétválogatás',
              '100%-os minőségi garancia'
            ]
          },
          regressionSolution: {
            duration: '30 másodperc',
            title: 'Regressziós megoldás', 
            modelName: 'Kristálygömb',
            content: 'Jövőbe tekintés és előrejelzés',
            keyPoints: [
              'Termelési mennyiség előrejelzése',
              'Alapanyag-tervezés optimalizálása',
              'Kapacitásmenedzsment'
            ]
          },
          synergy: {
            duration: '45 másodperc',
            title: 'Modellek szinergiája',
            content: 'A két modell együttes hatása',
            example: 'Bruttó 10.000 db - 2% selejt = Nettó 9.800 db piacra bocsátható termék',
            benefits: [
              'Pontosabb tervezés',
              'Költségoptimalizálás',
              'Versenyelőny a piacon'
            ]
          },
          closing: {
            duration: '20 másodperc',
            content: 'Zárszó és implementációs készenlét',
            example: 'Reaktív hibakezelésről proaktív, prediktív működésre való átállás. Implementációra készen állunk!'
          }
        },
        tips: [
          'Magabiztos és szakmai hangnem',
          'Konkrét számok és eredmények kiemelése',
          'Üzleti értékteremtésre fókuszálás',
          'Időkorlát betartása'
        ],
        evaluationCriteria: [
          'Koncepciók helyes használata',
          'Terv gyakorlatiassága',
          'Megmaradt TK-k száma',
          'Prezentáció minősége'
        ]
      };

      res.json({
        success: true,
        message: 'Prezentációs template sikeresen lekérve',
        data: template
      });

    } catch (error) {
      console.error('Hiba a prezentációs template lekérése során:', error);
      res.status(500).json({
        success: false,
        error: 'Szerver hiba a prezentációs template lekérése során',
        message: error.message
      });
    }
  }

  // Rendszer állapot és konfigurációk
  static async getSystemInfo(req, res) {
    try {
      const systemInfo = {
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        gameConfig: {
          startingCredits: 50,
          modelCosts: {
            classification: 15,
            regression: 15
          },
          challengeCosts: {
            default: 10,
            bonus: 5
          },
          maxCredits: 100,
          minCredits: 0
        },
        apiEndpoints: {
          products: '/api/products',
          eventCards: '/api/event-cards',
          models: '/api/models',
          gameState: '/api/game-state',
          users: '/api/users'
        },
        supportedFeatures: [
          'Termék adatelemzés',
          'Eseménykártya kezelés',
          'Modell feloldás',
          'Játékállapot mentés',
          'Felhasználói profilok',
          'Rangsor rendszer',
          'Prezentációs modul'
        ]
      };

      res.json({
        success: true,
        message: 'Rendszer információk sikeresen lekérve',
        data: systemInfo
      });

    } catch (error) {
      console.error('Hiba a rendszer információk lekérése során:', error);
      res.status(500).json({
        success: false,
        error: 'Szerver hiba a rendszer információk lekérése során',
        message: error.message
      });
    }
  }
}

module.exports = DataController;
