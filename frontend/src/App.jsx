import { useEffect, useMemo, useState } from 'react';

const labels = {
  en: {
    title: 'Textrova',
    pasteHint: 'Paste text here',
    videoGallery: 'Video Gallery',
    selectVideos: 'Select one or more videos',
    parsePdf: 'Upload PDF (in-memory only)',
    parseAction: 'Extract text',
    textPreview: 'Text Preview',
    selected: 'Selected',
    clear: 'Clear all data (refresh also clears)',
    uploadSuccess: 'PDF parsed successfully',
    noVideos: 'No videos found in /public/videos',
    language: 'TR / EN',
    inMemoryNotice: 'All data is temporary; refresh clears state.',
    speed: 'Scroll Speed',
    placeHolder: 'Your study text overlay appears here. Paste or parse PDF.'
  },
  tr: {
    title: 'Textrova',
    pasteHint: 'Metni buraya yapıştırın',
    videoGallery: 'Video Galerisi',
    selectVideos: 'Bir veya daha fazla video seçin',
    parsePdf: 'PDF Yükle (bellek içi)',
    parseAction: 'Metni Çıkart',
    textPreview: 'Metin Önizleme',
    selected: 'Seçili',
    clear: 'Tüm veriyi temizle (yenileme de temizler)',
    uploadSuccess: 'PDF başarıyla ayrıştırıldı',
    noVideos: '/public/videos içinde video yok',
    language: 'TR / EN',
    inMemoryNotice: 'Veriler geçici; yenileme sıfırlar.',
    speed: 'Kaydırma Hızı',
    placeHolder: 'Çalışma metni burada görünür. Yapıştır veya PDF oku.'
  }
};

const LOCALES = ['en', 'tr'];

export default function App() {
  const [locale, setLocale] = useState('en');
  const l = useMemo(() => labels[locale], [locale]);

  const [pasteText, setPasteText] = useState('');
  const [pdfText, setPdfText] = useState('');
  const [status, setStatus] = useState('');
  const [videos, setVideos] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [speed, setSpeed] = useState(25);

  useEffect(() => {
    fetch('/api/videos')
      .then((res) => res.json())
      .then((data) => setVideos(data.videos || []))
      .catch(() => setVideos([]));
  }, []);

  const allText = pasteText.trim() || pdfText.trim() || l.placeHolder;

  const onPdfSubmit = async (event) => {
    event.preventDefault();
    const file = event.target.elements.pdf?.files?.[0];
    if (!file) {
      setStatus('Select a PDF first.');
      return;
    }

    setStatus('Parsing PDF (in-memory)...');
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const res = await fetch('/api/upload-pdf', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setPdfText(data.text || '');
      setStatus(l.uploadSuccess);
    } catch (err) {
      setStatus('Error parsing PDF');
    }
  };

  const toggleVideo = (video) => {
    setSelectedVideos((prev) => {
      if (prev.some((v) => v.url === video.url)) {
        return prev.filter((v) => v.url !== video.url);
      }
      return [...prev, video];
    });
  };

  const clearAll = () => {
    setPasteText('');
    setPdfText('');
    setStatus('');
    setSelectedVideos([]);
    setSpeed(25);
  };

  const backgroundVideo = selectedVideos[0] || videos[0];

  return (
    <div className="app-root">
      {backgroundVideo && (
        <video
          className="fullscreen-video"
          key={backgroundVideo.url}
          src={backgroundVideo.url}
          preload="auto"
          autoPlay
          muted
          loop
          playsInline
        />
      )}

      <div className="overlay" />

      <div className="app-container">
        <header className="topbar">
          <h1>{l.title}</h1>
          <div className="locale-switcher">
            {LOCALES.map((loc) => (
              <button
                key={loc}
                className={loc === locale ? 'active' : ''}
                onClick={() => setLocale(loc)}
                type="button"
              >
                {loc.toUpperCase()}
              </button>
            ))}
          </div>
        </header>

        <div className="action-grid">
          <section className="card">
            <h2>{l.pasteHint}</h2>
            <textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder={l.placeHolder}
              rows={6}
            />
          </section>

          <section className="card">
            <h2>{l.parsePdf}</h2>
            <form className="pdf-form" onSubmit={onPdfSubmit}>
              <input type="file" name="pdf" accept="application/pdf" />
              <button type="submit">{l.parseAction}</button>
            </form>
            <div className="status">{status}</div>
          </section>

          <section className="card">
            <h2>{l.videoGallery}</h2>
            <p>{l.selectVideos}</p>
            <div className="video-list">
              {videos.map((video) => {
                const isChecked = selectedVideos.some((x) => x.url === video.url);
                return (
                  <label key={video.url} className="video-item">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleVideo(video)}
                    />
                    <span>{video.name}</span>
                  </label>
                );
              })}
            </div>
          </section>

          <section className="card">
            <h2>{l.speed}</h2>
            <input
              type="range"
              min={5}
              max={120}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            />
            <div className="speed-value">{speed} px/s</div>
            <div className="selected-title">{l.selected}: {selectedVideos.length}</div>
          </section>
        </div>

        <button className="clear-btn" type="button" onClick={clearAll}>{l.clear}</button>

        <div className="overlay-text-section">
          <div
            className="scrolling-words"
            style={{ animationDuration: `${Math.max(1, 120 / speed)}s` }}
          >
            {allText}
          </div>
        </div>
      </div>
    </div>
  );
}
