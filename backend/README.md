# Future-Tech MI Küldetés - Backend

🎯 **Gamifikált gépi tanulás oktatási platform backend API**

A Future-Tech MI Küldetés egy interaktív webalkalmazás, amely játékos formában tanítja meg az ipari informatikai technikus tanulóknak a gépi tanulás alapjait, különös tekintettel a klasszifikációra és regresszióra.

## 🚀 Gyors indítás

### Telepítés
```bash
npm install
```

### Fejlesztői szerver indítása
```bash
npm run dev
```

### Production szerver indítása
```bash
npm start
```

## 📋 Főbb funkciók

### 🎮 Gamifikált Tanulás
- **50 TK (Tanulási Kredit)** kezdő rendszer
- **Modell feloldás**: Klasszifikációs (15 TK), Regressziós (15 TK)
- **4 Eseménykártya**: Termelés, Energia, Karbantartás, Készletgazdálkodás
- **Rangsor és Achievement** rendszer

### 🧠 MI Oktatási Tartalom
- **20 címkézett termék** adatai (PDF alapján)
- **Klasszifikációs** és **regressziós** modellek szimulációja
- **Üzleti hatások** és ROI számítások
- **Prezentációs** támogatás

### 🛠️ Technikai Megoldások
- **RESTful API** design
- **Express.js** middleware architektúra
- **Memória alapú** adattárolás
- **Teljes validáció** és hibakezelés

## 📂 Projekt struktúra

```
backend/
├── controllers/     # API kontroller logika
├── models/         # Adatmodellek
├── routes/         # API útvonalak
├── middleware/     # Middleware funkciók
├── data/          # JSON adatfájlok
├── utils/         # Segédfunkciók
├── config/        # Konfigurációs fájlok
└── tests/         # Unit tesztek
```

## 🔗 API Végpontok

### Alapvető
- `GET /health` - Szerver állapot
- `GET /api` - API információk

### Felhasználók
- `POST /api/users/register` - Regisztráció
- `POST /api/users/login` - Bejelentkezés
- `GET /api/users/:userId` - Felhasználó lekérés
- `PUT /api/users/:userId` - Felhasználó frissítés

### Játék
- `POST /api/game/session/start` - Játék indítás
- `GET /api/game/session/:userId` - Játékállapot lekérés
- `POST /api/game/models/unlock` - Modell feloldás
- `POST /api/game/challenges/complete` - Kihívás teljesítés
- `GET /api/game/leaderboard` - Rangsor

### Adatok
- `GET /api/products` - Termék adatok
- `GET /api/event-cards` - Eseménykártyák
- `GET /api/models` - Modell információk

## 🎯 Oktatási Célok

### Klasszifikáció (15 TK)
- **Cél**: Selejt vs. Megfelelő termékek felismerése
- **Adatok**: Súly, szín, méret, hőmérséklet, rezgés
- **Üzleti hatás**: Minőség-ellenőrzés automatizálása

### Regresszió (15 TK) 
- **Cél**: Numerikus értékek előrejelzése
- **Alkalmazások**: Energiafogyasztás, alkatrész-élettartam, termelési mennyiség
- **Üzleti hatás**: Prediktív karbantartás, kapacitástervezés

### Kombinált MI Megoldás
- **Szinergia**: Bruttó termelés (10,000 db) + Selejt arány (2%) = Nettó output (9,800 db)
- **Versenyelőny**: Pontos tervezés és optimalizált működés

## 🏆 Gamifikáció Elemek

- **Tanulási Kreditek (TK)**: Játékos gazdasági rendszer
- **Modell Feloldás**: Progresszív képességfejlesztés  
- **Eseménykártyák**: Valós ipari kihívások
- **Rangsor**: Versengés és motiváció
- **Prezentáció**: Gyakorlati alkalmazás bemutatása

## 🔧 Fejlesztői információk

### Környezeti változók
Másold át a `.env.example` fájlt `.env` néven és állítsd be a szükséges értékeket.

### Tesztelés
```bash
npm test
```

### Linting
```bash
npm run lint
npm run lint:fix
```

## 📚 Dokumentáció

### Modellek
- **Product.js**: Termék adatmodell validációval
- **GameState.js**: Játékállapot kezelés
- **User.js**: Felhasználó adatok

### Middleware
- **auth.js**: Hitelesítés és jogosultságok
- **validation.js**: Adatvalidáció
- **errorHandler.js**: Hibakezelés

### Utils
- **database.js**: Memória-alapú adatbázis szimuláció
- **helpers.js**: Általános segédfunkciók

## 🎓 Oktatási Felhasználás

Ez a backend API kifejezetten **ipari informatikai technikus tanulók** számára készült, hogy gyakorlati példákon keresztül megértsék:

1. **Gépi tanulás alapjait** (ML pipeline)
2. **Felügyelt tanulást** (supervised learning)
3. **Klasszifikáció vs. regresszió** különbségeit
4. **Ipari alkalmazásokat** és üzleti hatásokat
5. **API fejlesztés** és backend architektúra alapjait

## 📄 Licenc

MIT License - lásd a LICENSE fájlt a részletekért.

## 👥 Közreműködés

1. Fork-old a projektet
2. Készíts egy feature branch-et (`git checkout -b feature/AmazingFeature`)
3. Commit-old a változásokat (`git commit -m 'Add some AmazingFeature'`)
4. Push-old a branch-et (`git push origin feature/AmazingFeature`)
5. Nyiss egy Pull Request-et

---

**🏭 Future-Tech MI Küldetés** - *A jövő gyárainak intelligens megoldásai*
