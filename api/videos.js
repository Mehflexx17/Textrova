const path = require('path');
const fs = require('fs');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const metadataFile = path.join(process.cwd(), 'public', 'videos', 'videos.json');
    const json = await fs.promises.readFile(metadataFile, 'utf-8');
    const videos = JSON.parse(json);
    return res.json({ videos });
  } catch (err) {
    // Fallback: directory scan
    try {
      const videosPath = path.join(process.cwd(), 'public', 'videos');
      const filenames = await fs.promises.readdir(videosPath);
      const filtered = filenames.filter(f => /\.(mp4|webm|ogg|mov)$/i.test(f));
      const videos = filtered.map(name => ({ name, url: `/videos/${encodeURIComponent(name)}` }));
      return res.json({ videos });
    } catch (innerErr) {
      return res.status(500).json({ error: 'Unable to load videos', details: err.message });
    }
  }
};
