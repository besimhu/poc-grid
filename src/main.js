import "./style.scss";
import preloadedCards from "./preloaded-cards.json";
import dynamicCardsData from "./cards.json";

// ─── Card type → supported sizes ─────────────────────────────────────────────
const SIZE_MAP = {
  "key-data": ["small", "medium", "large"],
  "comparative-data": ["large"],
  profile: ["medium"],
  video: ["large"],
  audio: ["large"],
  "insight-quote": ["medium", "large"],
  "insight-headline": ["small", "medium", "large"],
  "insight-image": ["small", "medium", "large"],
  action: ["medium"],
  offering: ["medium"],
};

function pickSize(type) {
  const sizes = SIZE_MAP[type] ?? ["small"];
  return sizes[Math.floor(Math.random() * sizes.length)];
}

// ─── Theme assignment ────────────────────────────────────────────────────────
const ALTERNATE_THEMES = ["theme-2", "theme-3"];

function pickTheme(index) {
  if ((index + 1) % 3 !== 0) return "theme-1";
  return ALTERNATE_THEMES[Math.floor(Math.random() * ALTERNATE_THEMES.length)];
}

function createCard(card, index) {
  const theme = pickTheme(index);
  const size = card.size ?? pickSize(card.type);
  const el = document.createElement("article");
  el.className = `card card--${theme} card--${size}`;

  el.innerHTML = `
    <span class="card__tag">${card.tag}</span>
    <h2 class="card__title">${card.title}</h2>
    <p class="card__body">${card.body}</p>
  `;

  return el;
}

// ─── Simulated streaming API ──────────────────────────────────────────────────
async function fetchCards(page, size) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const start = page * size;
  return dynamicCardsData.slice(start, start + size);
}

// ─── Lazy load state ──────────────────────────────────────────────────────────
const PAGE_SIZE = 8;
let currentPage = 0;
let totalLoaded = 0;
let isLoading = false;
let exhausted = false;

// ─── Card append ──────────────────────────────────────────────────────────────
function appendCards(cards, startIndex) {
  const grid = document.getElementById("grid");
  cards.forEach((card, i) => {
    grid.appendChild(createCard(card, startIndex + i));
  });
}

// ─── Render preloaded cards immediately ───────────────────────────────────────
appendCards(preloadedCards, 0);
totalLoaded = preloadedCards.length;

// ─── Load next page ───────────────────────────────────────────────────────────
async function loadNextPage() {
  if (isLoading || exhausted) return;
  isLoading = true;
  loader.hidden = false;

  const batch = await fetchCards(currentPage, PAGE_SIZE);

  loader.hidden = true;
  isLoading = false;

  if (batch.length === 0) {
    exhausted = true;
    observer.disconnect();
    loader.remove();
    return;
  }

  if (batch.length < PAGE_SIZE) exhausted = true;

  const startIndex = totalLoaded;
  totalLoaded += batch.length;
  currentPage++;
  appendCards(batch, startIndex);

  if (exhausted) {
    observer.disconnect();
    loader.remove();
  } else if (sentinel.getBoundingClientRect().top < window.innerHeight) {
    // Sentinel still in view — load next batch
    loadNextPage();
  }
}

// ─── Loading indicator ────────────────────────────────────────────────────────
const loader = document.createElement("div");
loader.className = "loader";
loader.setAttribute("aria-label", "Loading more cards");
loader.hidden = true;
document.body.appendChild(loader);

// ─── Intersection sentinel ────────────────────────────────────────────────────
const sentinel = document.createElement("div");
sentinel.className = "scroll-sentinel";
document.body.appendChild(sentinel);

const observer = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) loadNextPage();
  },
  { rootMargin: "400px" },
);

observer.observe(sentinel);
loadNextPage();

if (import.meta.hot) {
  import.meta.hot.accept();
}
