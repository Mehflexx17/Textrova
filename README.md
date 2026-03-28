# Textrova

A complete open-source web app for study overlay (scrolling text over video). Supports:
- Paste text manually
- Upload PDF (in-memory parsing only)
- Choose preloaded Google Drive videos
- Fullscreen video background with scrolling overlay text
- Dark theme, mobile friendly, TR/EN toggle
- Data cleared on refresh (state only)

## 📁 Project structure

- `/frontend` - React app (Vite + React)
- `/backend` - Node.js + Express API
- `/public/videos` - video metadata (Google Drive links)
- `/scripts` - optional scripts
- `.gitignore`, `README.md`, `package.json`, `LICENSE`

## 📦 Setup

1. Clone:
   - `git clone https://github.com/Mehflexx17/Textrova.git`
   - `cd Textrova`
2. Install dependencies:
   - `npm install`
3. Start backend:
   - `npm run start:backend`
4. Start frontend:
   - `npm run start:frontend`
5. Open `http://localhost:3000`

Use `npm run start` to run both at once with `concurrently`.

## 🎬 Google Drive videos

Video URLs are under `/public/videos/videos.json`. Example entries:
```json
[
  { "name": "Study Session 1", "url": "https://docs.google.com/uc?export=download&id=1A2B3C4D5E6F7G8H9I0J" },
  { "name": "Study Session 2", "url": "https://docs.google.com/uc?export=download&id=0J9I8H7G6F5E4D3C2B1A" }
]
```

- `GET /api/videos` reads this JSON and returns links.
- No user-side video uploads.

## 🧠 Backend details

`backend/index.js`:
- `GET /api/videos` reads `public/videos/videos.json` (fallback to static file scan)
- `POST /api/upload-pdf` accepts PDF via `multer` memory storage and parses with `pdf-parse`

## 💻 Frontend details

`frontend/src/App.jsx` now:
- loads videos from API
- selectable checkboxes (one or more)
- fullscreen video background using first selected (or first in list)
- scrolling text overlay with adjustable speed slider
- TR/EN labels + locale switch
- in-memory text and parsed pdf state

## 🧾 .gitignore

Ignore `node_modules`, `dist`, `.env`, editor caches etc.

## 📜 LICENSE

MIT license in `LICENSE`.

## 🧪 Quick test flow

1. Run backend+frontend
2. Confirm video list appears
3. Paste text or upload PDF
4. Toggle video selection
5. Adjust scroll speed
6. Refresh page -> all state resets


