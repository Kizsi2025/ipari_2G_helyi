# 🏭 Future-Tech MI Küldetés

> Gamifikált gépi tanulási oktatási webalkalmazás React frontend-dal és Node.js backend-del

## 📋 Áttekintés

A Future-Tech MI Küldetés egy interaktív, gamifikált tanulási környezet, amely a gépi tanulás alapjait tanítja meg ipari kontextusban. A diákok "Mintázatdekódoló" alakulatokként dolgoznak és valós ipari problémákat oldanak meg.

### ✨ Főbb funkciók

- 🎮 **Gamifikált rendszer**: 50 Tanulási kredittel (TK) kezdés
- 🧠 **Modell fejlesztés**: Klasszifikációs és regressziós modellek
- 🎯 **Eseménykártyák**: 4 különböző kihívás
- 📊 **Adatelemzés**: 20 termék címkézett adatainak vizualizációja
- 🎤 **Prezentáció modul**: Végső megoldási terv bemutatása
- 💾 **Állapot mentés**: LocalStorage és backend API

## 🛠 Technológiai stack

### Frontend
- ⚛️ **React 18** - Modern komponens alapú UI
- 🎨 **Framer Motion** - Animációk és átmenetek  
- 🎯 **React Router** - Navigáció
- 📡 **Axios** - HTTP kliens
- 🎨 **CSS3** - Egyedi styling futurisztikus designnal

### Backend
- 🟢 **Node.js** - JavaScript runtime
- ⚡ **Express.js** - Web framework
- 🛡️ **Helmet** - Biztonsági middleware
- 🔒 **CORS** - Cross-origin támogatás
- 📊 **Morgan** - Logging
- ⚡ **Compression** - Gzip tömörítés
- 🚦 **Rate Limiting** - API védelem

## 🚀 Telepítés és indítás

### Előfeltételek

- Node.js 16+ 
- npm vagy yarn
- Git

### 1. Repository klónozása

\`\`\`bash
git clone https://github.com/your-username/future-tech-app.git
cd future-tech-app
\`\`\`

### 2. Backend telepítése

\`\`\`bash
cd backend
npm install

# Környezeti változók beállítása
cp .env.example .env
# Szerkeszd a .env fájlt szükség szerint

# Backend indítása
npm run dev
# vagy production módban:
npm start
\`\`\`

A backend elérhető lesz: \`http://localhost:5000\`

### 3. Frontend telepítése

\`\`\`bash
cd ../frontend
npm install

# Frontend indítása
npm start
\`\`\`

A frontend elérhető lesz: \`http://localhost:3000\`

## 📁 Projekt struktúra

\`\`\`
future-tech-app/
├── frontend/                 # React alkalmazás
│   ├── src/
│   │   ├── components/       # UI komponensek
│   │   ├── styles/          # CSS fájlok
│   │   ├── data/            # Statikus adatok
│   │   └── App.js           # Fő komponens
│   ├── public/              # Statikus fájlok
│   └── package.json
│
├── backend/                 # Node.js API
│   ├── routes/             # API útvonalak
│   ├── models/             # Adatmodellek
│   ├── server.js           # Fő szerver fájl
│   └── package.json
│
└── README.md
\`\`\`

## 🎮 Játékmenet

### 1. Kezdés
- 50 Tanulási kredit (TK) 
- Név és csapatnév megadása
- Küldetés briefing

### 2. Modell fejlesztés
- **Klasszifikációs modell** (15 TK): "Sólyomszem" - selejt felismerés
- **Regressziós modell** (15 TK): "Kristálygömb" - numerikus előrejelzés

### 3. Eseménykártyák (10 TK/darab)
- Termelési előrejelzés
- Energiahatékonysági optimalizálás  
- Prediktív karbantartás
- Készletgazdálkodási kihívás

### 4. Adatelemzés
- 20 termék címkézett adatainak megtekintése
- Interaktív táblázatok és vizualizációk
- Szűrés és rendezés funkciók

### 5. Prezentáció
- 2 perces pitch a vezetőségnek
- Megoldási terv bemutatása
- Modellek szinergiájának demonstrálása

## 🔌 API Végpontok

### Alapvető végpontok
- \`GET /health\` - Szerver állapot
- \`GET /api/products\` - Termékadatok
- \`GET /api/event-cards\` - Eseménykártyák

### Játékállapot kezelés
- \`GET /api/game-state/:userId\` - Állapot lekérése
- \`POST /api/game-state/:userId\` - Állapot mentése
- \`DELETE /api/game-state/:userId\` - Újraindítás

### Játék műveletek
- \`POST /api/unlock-model\` - Modell feloldása
- \`POST /api/complete-challenge\` - Küldetés teljesítése
- \`GET /api/leaderboard\` - Rangsor

## 🎨 Designelemek

- **Színséma**: Teal-kék (#0891b2) futurisztikus palette
- **Ikonok**: Emoji alapú, intuitív
- **Animációk**: Framer Motion smooth átmenetek
- **Responsive**: Mobil-első megközelítés
- **Accessibility**: Kontrasztok és olvashatóság

## 🧪 Tesztelés

### Frontend tesztek
\`\`\`bash
cd frontend
npm test
\`\`\`

### Backend tesztek
\`\`\`bash
cd backend
npm test
\`\`\`

## 📚 Oktatási célok

### 1. Gépi tanulás alapok
- Felügyelt tanulás koncepciója
- Klasszifikáció vs. regresszió
- Címkézett adatok fontossága

### 2. Ipari alkalmazások
- Minőségbiztosítás automatizálása
- Prediktív karbantartás
- Termelésoptimalizálás
- Energiahatékonyság

### 3. Adatelemzés
- Adatvisualizáció
- Mintázatok felismerése
- Statisztikai gondolkodás

### 4. Prezentáció készség
- Technikai tartalom egyszerűsítése
- Üzleti érték kommunikálása
- Időkeretben való prezentálás

## 🚀 Production telepítés

### Docker használata (opcionális)

\`\`\`bash
# Dockerfile létrehozása után:
docker build -t future-tech-app .
docker run -p 3000:3000 -p 5000:5000 future-tech-app
\`\`\`

### Vercel/Netlify (Frontend)
\`\`\`bash
cd frontend
npm run build
# Build mappa feltöltése
\`\`\`

### Heroku (Backend)
\`\`\`bash
cd backend
git init
heroku create future-tech-backend
git push heroku main
\`\`\`

## 🤝 Hozzájárulás

1. Fork-old a projektet
2. Készíts feature branch-et (\`git checkout -b feature/amazing-feature\`)
3. Commit-old a változásokat (\`git commit -m 'Add amazing feature'\`)
4. Push-old a branch-et (\`git push origin feature/amazing-feature\`)
5. Készíts Pull Request-et

## 📄 Licenc

Ez a projekt MIT licenc alatt áll. Részletek a \`LICENSE\` fájlban.

## 📞 Kapcsolat

- **Email**: info@future-tech-education.hu
- **GitHub**: [@future-tech-education](https://github.com/future-tech-education)
- **Website**: https://future-tech-education.hu

## 🙏 Köszönetnyilvánítás

- Oktatási anyagok: Ipari Informatikai Technikus képzés
- Design inspiráció: Futurisztikus ipari felületek
- Gamifikáció: Modern oktatási platformok
- Technológiai stack: React és Node.js közösség

---

**Made with ❤️ for Future-Tech Education**
