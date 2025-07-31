// eventCards.js - Future-Tech eseménykártyák
export const eventCards = [
  {
    id: 1,
    title: "Termelési előrejelzés",
    type: "regression",
    cost: 10,
    message: "A selejt-felismerő rendszer lenyűgöző, de most a jövőbe akarunk látni! Pontos előrejelzést kérünk a következő heti termelési darabszámra a kapacitástervezéshez. A siker kulcsa egy új, prediktív modell!",
    task: "Fektessetek be -10 Tanulási kreditet (TK) egy 'Regressziós modellbe', hogy teljesítsétek a kérést! Enélkül a projekt hatékonysága jelentősen csökken.",
    icon: "📈",
    difficulty: "medium"
  },
  {
    id: 2,
    title: "Energiahatékonysági optimalizálás",
    type: "regression", 
    cost: 10,
    message: "A pénzügyi osztály riadót fújt a növekvő energiaköltségek miatt! Előrejelzést kell készítenetek a gépsorok várható energiafogyasztásáról, hogy optimalizálni tudjuk a felhasználást. Csak egy numerikus becslésre képes modell segíthet!",
    task: "A kihívás teljesítéséhez aktiváljátok a 'Regressziós modellt' -10 Tanulási kredit (TK) befektetésével! Enélkül a gyár működése veszteséges marad.",
    icon: "⚡",
    difficulty: "hard"
  },
  {
    id: 3,
    title: "Prediktív karbantartás",
    type: "regression",
    cost: 10,
    message: "Váratlan géphiba állította le a teljes 3-as gyártósort! A vezetés megelőző megoldást követel. Készítsetek egy modellt, ami előre jelzi a kulcsfontosságú alkatrészek hátralévő élettartamát órában kifejezve!",
    task: "Oldjátok fel a 'Regressziós modell' képességet -10 Tanulási kreditért (TK), hogy megelőzzétek a jövőbeli leállásokat! A gyár termelése és a hírnevünk múlik rajta.",
    icon: "🔧",
    difficulty: "hard"
  },
  {
    id: 4,
    title: "Készletgazdálkodási kihívás",
    type: "regression",
    cost: 10,
    message: "Az alapanyag-készlet kritikusan alacsony, ami a termelés leállásával fenyeget! A beszerzési osztálynak pontos előrejelzésre van szüksége a következő havi alapanyag-szükségletről. Az adatokban rejlik a megoldás!",
    task: "Fektessetek be -10 Tanulási kreditet (TK) egy 'Regressziós modellbe' a pontos becsléshez! Ha kifogytok az alapanyagból, a küldetés elbukik.",
    icon: "📦",
    difficulty: "medium"
  }
];

export const getRandomEventCard = () => {
  const randomIndex = Math.floor(Math.random() * eventCards.length);
  return eventCards[randomIndex];
};

export const getEventCardById = (id) => {
  return eventCards.find(card => card.id === id);
};
