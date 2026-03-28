# textrova

Open-source web app for in-memory text & PDF extraction + video selection gallery.

## 📁 Structure

- `/frontend` - React app (Vite + React)
- `/backend` - Node.js + Express API
- `/public/videos` - static video content (not uploaded by users)
- `/scripts` - optional scripts
- `README.md`, `package.json`, `LICENSE`

## 🛠️ Requirements supported

- Paste text
- Upload PDF and parse in-memory only (no disk writes)
- Auto-read videos from `/public/videos` and display gallery
- Allow one or multiple video selections
- Refresh clears app state
- Dark UI
- TR/EN toggle
- Smooth animations

## ▶️ Run locally

1. `npm install`
2. `npm run start:backend` (http://localhost:4000)
3. `npm run start:frontend` (http://localhost:3000)

Or run both:
- `npm run start` (uses concurrently)

## 💡 Add videos manually

- Place video files in `/public/videos` (e.g., `myvideo.mp4`, `demo.webm`)
- The backend API `GET /api/videos` scans this folder each request
- Frontend loads the list and shows them in the gallery
- Videos are not uploaded by users; they are local assets

## 🧾 Backend

- `backend/index.js`
- `GET /api/videos` to list files in `/public/videos`
- `POST /api/upload-pdf` to parse PDF buffer (multer memory storage + pdf-parse)

## 🧾 Frontend

- `frontend/src/App.jsx` handles paste text, PDF upload, locale switch, video gallery, and preview rendering

## 🔒 Data notice

- User uploads and extracted text are memory-only
- No permanent file storage
- Reload clears all data

## ✅ Test flow

1. Add sample video(s) to `/public/videos`
2. `npm run start:backend` + `npm run start:frontend`
3. Open http://localhost:3000
4. Upload PDF, paste text, select videos


