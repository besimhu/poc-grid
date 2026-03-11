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
  const el = document.createElement("button");
  el.className = `card card--${theme} card--${size}`;
  el.type = "button";
  
  if (card.url) {
    el.setAttribute("role", "link");
    el.setAttribute("data-url", card.url);
  }

  el.innerHTML = `
    <span class="card__tag">${card.tag}</span>
    <h2 class="card__title">${card.title}</h2>
    <p class="card__body">${card.body}</p>
  `;

  return el;
}

// ─── Overlay management ────────────────────────────────────────────────────────
async function openOverlay(url) {
  const overlay = document.getElementById("overlay");
  const overlayBody = document.getElementById("overlay-body");
  
  // Show loading state
  overlayBody.innerHTML = '<p style="text-align: center; padding: 2rem;">Loading...</p>';
  overlay.showModal();

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      overlayBody.innerHTML = `<p style="color: red;">Error loading content: ${response.status}</p>`;
      return;
    }

    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const content = doc.getElementById("content");
    
    if (content) {
      overlayBody.innerHTML = content.innerHTML;
    } else {
      overlayBody.innerHTML = '<p style="color: red;">Content not found</p>';
    }
  } catch (error) {
    overlayBody.innerHTML = '<p style="color: red;">Network error occurred</p>';
  }
}

function closeOverlay() {
  const overlay = document.getElementById("overlay");
  overlay.close();
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

// ─── Event delegation for card clicks ─────────────────────────────────────────
const grid = document.getElementById("grid");
grid.addEventListener("click", (e) => {
  const card = e.target.closest(".card[data-url]");
  if (card) {
    const url = card.getAttribute("data-url");
    openOverlay(url);
  }
});

// ─── Load button ─────────────────────────────────────────────────────────────
// Clicking replaces the preloaded cards with the first page of dynamic cards
// and enables infinite scroll for subsequent pages.
const loadBtn = document.getElementById('load-btn');
let dynamicScrollEnabled = false;

function enableDynamicScroll() {
  if (dynamicScrollEnabled) return;
  dynamicScrollEnabled = true;
  initScrollInfrastructure();
  observer.observe(sentinel);
  loadNextPage();
}

loadBtn.addEventListener('click', () => {
  loadBtn.disabled = true;
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  currentPage = 0;
  totalLoaded = 0;
  exhausted = false;
  enableDynamicScroll();
});

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

// ─── Loading indicator & sentinel (created on demand) ────────────────────────
let loader;
let sentinel;
let observer;

function initScrollInfrastructure() {
  loader = document.createElement("div");
  loader.className = "loader";
  loader.setAttribute("aria-label", "Loading more cards");
  loader.hidden = true;
  document.body.appendChild(loader);

  sentinel = document.createElement("div");
  sentinel.className = "scroll-sentinel";
  document.body.appendChild(sentinel);

  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) loadNextPage();
    },
    { rootMargin: "400px" },
  );
}

// ─── Close overlay event listeners ────────────────────────────────────────────
const overlay = document.getElementById("overlay");

document.getElementById("overlay-close").addEventListener("click", closeOverlay);

// Close when clicking on backdrop
overlay.addEventListener("click", (e) => {
  if (e.target.tagName === "DIALOG") {
    closeOverlay();
  }
});

if (import.meta.hot) {
  import.meta.hot.accept();
}
