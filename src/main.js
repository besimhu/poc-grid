import './style.scss'
import cardsData from './cards.json'
import { DESKTOP_VARIATIONS, TABLET_VARIATIONS } from './patterns.js'

// ─── Pick a variation once on load ───────────────────────────────────────────
const variationIndex = Math.floor(Math.random() * DESKTOP_VARIATIONS.length)
const DESKTOP_PATTERNS = DESKTOP_VARIATIONS[variationIndex]
const TABLET_PATTERNS  = TABLET_VARIATIONS[variationIndex]

const SLOTS_PER_GROUP = DESKTOP_PATTERNS[0].length // 4
const ROWS_PER_GROUP = 6

// ─── Breakpoint detection ────────────────────────────────────────────────────
const mqTablet = window.matchMedia('(min-width: 768px) and (max-width: 1199px)')
const mqMobile = window.matchMedia('(max-width: 767px)')

function activePatterns() {
  if (mqTablet.matches) return TABLET_PATTERNS
  return DESKTOP_PATTERNS // mobile has no JS placement; CSS handles it
}

// ─── Theme assignment ────────────────────────────────────────────────────────
// Most cards get theme-1 (default). Every 3rd card is a candidate for an
// alternate theme — randomly picking theme-2 or theme-3 instead.
const ALTERNATE_THEMES = ['theme-2', 'theme-3']

function pickTheme(index) {
  if ((index + 1) % 3 !== 0) return 'theme-1'
  return ALTERNATE_THEMES[Math.floor(Math.random() * ALTERNATE_THEMES.length)]
}

function createCard(card, area, index) {
  const theme = pickTheme(index)
  const el = document.createElement('article')
  el.className = `card card--${theme}`
  el.dataset.area = area

  el.innerHTML = `
    <span class="card__tag">${card.tag}</span>
    <h2 class="card__title">${card.title}</h2>
    <p class="card__body">${card.body}</p>
  `

  return el
}

// ─── Simulated streaming API ──────────────────────────────────────────────────
// Swap this for a real fetch() call when the API is available.
async function fetchCards(page, size) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const start = page * size
  return cardsData.slice(start, start + size)
}

// ─── Lazy load state ──────────────────────────────────────────────────────────
const PAGE_SIZE = 8   // cards per API page; keep a multiple of SLOTS_PER_GROUP (4)
let currentPage = 0
let loadedCards = []  // accumulates all cards received so far
let isLoading = false
let exhausted = false // true once the API returns fewer cards than PAGE_SIZE

// ─── Card append ──────────────────────────────────────────────────────────────
// Appends a batch of new cards to the grid, computing grid positions from their
// global index within loadedCards. Does NOT clear existing DOM nodes.
function appendCards(cards, startIndex) {
  const grid = document.getElementById('grid')
  const patterns = activePatterns()

  cards.forEach((card, i) => {
    const index = startIndex + i
    const group = Math.floor(index / SLOTS_PER_GROUP)
    const pattern = patterns[group % patterns.length]
    const slot = pattern[index % SLOTS_PER_GROUP]

    const el = createCard(card, slot.area, index)

    if (!mqMobile.matches) {
      const rowStart = group * ROWS_PER_GROUP + slot.rowOffset + 1
      el.style.gridColumn = `${slot.colStart} / span ${slot.colSpan}`
      el.style.gridRow    = `${rowStart} / span ${slot.rowSpan}`
    }

    grid.appendChild(el)
  })
}

// ─── Full re-render (used on breakpoint change) ───────────────────────────────
// Clears and re-positions all already-loaded cards with the new pattern set.
function rerender() {
  document.getElementById('grid').innerHTML = ''
  appendCards(loadedCards, 0)
}

// ─── Load next page ───────────────────────────────────────────────────────────
async function loadNextPage() {
  if (isLoading || exhausted) return
  isLoading = true
  loader.hidden = false

  const batch = await fetchCards(currentPage, PAGE_SIZE)

  loader.hidden = true
  isLoading = false

  if (batch.length === 0) {
    exhausted = true
    observer.disconnect()
    loader.remove()
    return
  }

  if (batch.length < PAGE_SIZE) exhausted = true

  const startIndex = loadedCards.length
  loadedCards.push(...batch)
  currentPage++
  appendCards(batch, startIndex)

  if (exhausted) {
    observer.disconnect()
    loader.remove()
  }
}

// ─── Loading indicator ────────────────────────────────────────────────────────
const loader = document.createElement('div')
loader.className = 'loader'
loader.setAttribute('aria-label', 'Loading more cards')
loader.hidden = true
document.body.appendChild(loader)

// ─── Intersection sentinel ────────────────────────────────────────────────────
const sentinel = document.createElement('div')
sentinel.className = 'scroll-sentinel'
document.body.appendChild(sentinel)

const observer = new IntersectionObserver(
  (entries) => { if (entries[0].isIntersecting) loadNextPage() },
  { rootMargin: '400px' }
)

observer.observe(sentinel)

// Kick off the first page immediately
loadNextPage()

// Re-layout when crossing breakpoints
let debounceTimer
window.addEventListener('resize', () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(rerender, 100)
})

if (import.meta.hot) {
  import.meta.hot.accept()
}
