# Pokédex Lite 🔴

A sleek, feature-rich Pokédex web app built with React.js and the public PokéAPI.

## Live Demo
> Deploy to Vercel for the live URL (see Deployment section below)

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 16.x
- npm ≥ 8.x

### Installation & Running Locally

```bash
# 1. Clone the repository
git clone https://github.com/ISHA-2026-G8/pokedex-lite
cd pokedex-lite

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

The app will open at **http://localhost:3000** automatically.

### Production Build

```bash
npm run build
```

This creates an optimized build in the `build/` folder, ready for deployment.

---

## 🌐 Deployment (Vercel — Free)

1. Push your code to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
3. Click **"New Project"** → Import your `pokedex-lite` repo.
4. Leave all settings as default (Vercel auto-detects React).
5. Click **"Deploy"** — you'll get a live URL in ~1 minute.

---

## ✨ Features

| Feature | Details |
|---|---|
| **Pokémon Listing** | Grid layout with official artwork, name, and type badges |
| **Search** | Real-time search by name with debounce (400ms) |
| **Type Filtering** | Filter by all 18 Pokémon types |
| **Pagination** | 20 Pokémon per page with smart page controls |
| **Favorites** | Toggle favorites persisted in localStorage |
| **Detail Modal** | Stats, abilities, height/weight, Pokédex description |
| **Responsive UI** | Fully mobile, tablet, and desktop optimized |
| **Loading States** | Shimmer skeleton cards during fetch |
| **Error Handling** | Graceful error messages with retry |
| **Animations** | Hover float, card fade-in, modal scale-in, floating hero image |

---

## 🛠 Tech Stack

| Technology | Why |
|---|---|
| **React 18** | Industry-standard component model; hooks make state management clean |
| **CSS Modules** | Scoped styles with zero configuration; no class name collisions |
| **PokéAPI** | Free, comprehensive, public REST API for all Pokémon data |
| **localStorage** | Simple, no-backend persistence for favorites |
| **Google Fonts** | Bebas Neue (display) + Nunito (body) for a distinctive typographic pair |

No extra libraries were used — the app intentionally avoids Redux, Axios, or UI component libraries to keep the codebase lean and demonstrate raw React capability.

---

## 📂 Project Structure

```
src/
├── components/
│   ├── Header.js / .module.css      — Sticky nav with page switching
│   ├── SearchBar.js / .module.css   — Debounced search input
│   ├── TypeFilter.js / .module.css  — Type chip filter row
│   ├── PokemonCard.js / .module.css — Individual Pokémon card
│   ├── PokemonGrid.js / .module.css — Responsive grid wrapper
│   ├── PokemonModal.js / .module.css— Detailed info modal
│   ├── SkeletonCard.js / .module.css— Shimmer loading placeholder
│   └── Pagination.js / .module.css  — Page navigation
├── context/
│   └── FavoritesContext.js          — Global favorites state (Context API)
├── hooks/
│   └── usePokemon.js                — All data fetching hooks
├── pages/
│   ├── HomePage.js / .module.css    — Browse + search + filter
│   └── FavoritesPage.js / .module.css — Saved favorites view
├── utils/
│   └── helpers.js                   — capitalize, padId, typeColor, etc.
├── App.js / App.module.css
├── index.js
└── index.css                        — CSS variables & global animations
```

---

## 🧩 Challenges & Solutions

### Challenge 1 — Search Performance
**Problem:** Fetching all 1300+ Pokémon names just for search was too slow.  
**Solution:** Implemented debounced search (400ms) that first tries an exact match by name via the API, then falls back to fetching the full name list and filtering client-side. This gives instant results for exact names and reasonable results for partial matches.

### Challenge 2 — Type Filter + Pagination Conflict
**Problem:** When filtering by type, pagination applies to the full list, not the filtered subset.  
**Solution:** Search and type filter bypass pagination entirely — they show all results for that query. The pagination bar hides when search or filter is active.

### Challenge 3 — Image Loading
**Problem:** Some Pokémon lack official artwork images.  
**Solution:** Falls back to the sprite image, and if that also fails, shows a "?" placeholder with an `onError` handler.

### Challenge 4 — Favorites Persistence
**Problem:** Favorites needed to survive page refreshes without a backend.  
**Solution:** Used `localStorage` via React Context. The initial state is lazily loaded from `localStorage`, and every favorites change writes back via `useEffect`.


