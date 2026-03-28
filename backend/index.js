const path = require('path');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Serve static assets
app.use('/videos', express.static(path.join(__dirname, '..', 'public', 'videos')));
app.use('/assets', express.static(path.join(__dirname, '..', 'public')));

const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage, limits: { fileSize: 50 * 1024 * 1024 } });

// Video list API (automatic gallery source)
app.get('/api/videos', async (req, res) => {
  const videosPath = path.join(__dirname, '..', 'public', 'videos');
  try {
    const filenames = await fs.promises.readdir(videosPath);
    const filtered = filenames.filter(f => /\.(mp4|webm|ogg|mov)$/i.test(f));
    const videos = filtered.map(name => ({ name, url: `/videos/${encodeURIComponent(name)}` }));
    res.json({ videos });
  } catch (err) {
    res.status(500).json({ error: 'Unable to read videos folder', details: err.message });
  }
});

// PDF upload and parse endpoint (in-memory only)
app.post('/api/upload-pdf', upload.single('pdf'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No pdf file uploaded' });
  }
  try {
    const data = await pdfParse(req.file.buffer);
    res.json({ text: data.text });
  } catch (err) {
    res.status(500).json({ error: 'PDF parsing failed', details: err.message });
  }
});

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(port, () => {
  console.log(`textrova backend running at http://localhost:${port}`);
});
