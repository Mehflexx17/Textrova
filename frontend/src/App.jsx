import { useEffect, useMemo, useState } from 'react';

const labels = {
  en: {
    title: 'textrova',
    pasteHint: 'Paste text here',
    videoGallery: 'Video Gallery',
    selectVideos: 'Select one or more videos',
    parsePdf: 'Upload PDF (in-memory only)',
    parseAction: 'Extract text',
    textPreview: 'Text Preview',
    selected: 'Selected',
    clear: 'Clear all data (refresh will also clear)',
    uploadSuccess: 'PDF parsed successfully',
    noVideos: 'No videos found under /public/videos',
    language: 'TR / EN',
    inMemoryNotice: 'All user data is temporary; reload clears everything.'
  },
  tr: {
    title: 'textrova',
    pasteHint: 'Metni buraya yapıştırın',
    videoGallery: 'Video Galerisi',
    selectVideos: 'Bir veya daha fazla video seçin',
    parsePdf: 'PDF Yükle (sadece bellek)',
    parseAction: 'Metni Çıkart',
    textPreview: 'Metin Önizleme',
    selected: 'Seçili',
    clear: 'Tüm veriyi temizle (yenileme de temizler)',
    uploadSuccess: 'PDF başarıyla ayrıştırıldı',
    noVideos: '/public/videos altında video yok',
    language: 'TR / EN',
    inMemoryNotice: 'Tüm kullanıcı verileri geçici; sayfa yenilenince temizlenir.'
  }
};

const LOCALES = ['en', 'tr'];

export default function App() {
  const [locale, setLocale] = useState('en');
  const l = useMemo(() => labels[locale], [locale]);

  const [pasteText, setPasteText] = useState('');
  const [pdfResult, setPdfResult] = useState('');
  const [status, setStatus] = useState('');
  const [videos, setVideos] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    fetch('/api/videos')
      .then((r) => r.json())
      .then((data) => setVideos(data.videos || []))
      .catch(() => setVideos([]));
  }, []);

  useEffect(() => {
    // page refresh semantics: data in component state only
  }, []);

  const onPdfSubmit = async (e) => {
    e.preventDefault();
    const fileInput = e.target.elements.pdf;
    if (!fileInput.files.length) return;
    const formData = new FormData();
    formData.append('pdf', fileInput.files[0]);

    setStatus('Loading ...');

    const response = await fetch('/api/upload-pdf', { method: 'POST', body: formData });
    if (!response.ok) {
      setStatus('PDF parse failed');
      return;
    }
    const json = await response.json();
    setPdfResult(json.text || '');
    setStatus(l.uploadSuccess);
  };

  const toggleVideo = (name) => {
    setSelected((prev) => {
      if (prev.includes(name)) return prev.filter((x) => x !== name);
      return [...prev, name];
    });
  };

  const clearAll = () => {
    setPasteText('');
    setPdfResult('');
    setStatus('');
    setSelected([]);
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>{l.title}</h1>
        <p className="notice">{l.inMemoryNotice}</p>
        <div className="locale-switcher">
          <label>{l.language}</label>
          {LOCALES.map((loc) => (
            <button key={loc} className={locale === loc ? 'active' : ''} onClick={() => setLocale(loc)}>
              {loc.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      <main>
        <section className="cards">
          <div className="card">
            <h2>{l.pasteHint}</h2>
            <textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              rows={8}
              placeholder={l.pasteHint}
            />
            <div className="preview">
              <h3>{l.textPreview}</h3>
              <p>{pasteText || <em>---</em>}</p>
            </div>
          </div>

          <div className="card">
            <h2>{l.parsePdf}</h2>
            <form onSubmit={onPdfSubmit} className="pdf-form">
              <input type="file" name="pdf" accept="application/pdf" />
              <button type="submit">{l.parseAction}</button>
            </form>
            <div className="pdf-text">
              <h3>{l.textPreview}</h3>
              <p>{pdfResult || <em>---</em>}</p>
            </div>
            <small>{status}</small>
          </div>

          <div className="card">
            <h2>{l.videoGallery}</h2>
            <p>{l.selectVideos}</p>
            {videos.length === 0 && <p>{l.noVideos}</p>}
            <div className="video-grid">
              {videos.map((video) => (
                <div key={video.name} className={`video-tile ${selected.includes(video.name) ? 'selected' : ''}`}>
                  <input
                    type="checkbox"
                    checked={selected.includes(video.name)}
                    onChange={() => toggleVideo(video.name)}
                  />
                  <span>{video.name}</span>
                </div>
              ))}
            </div>
            <div className="selected-videos">
              <h4>{l.selected}: {selected.length}</h4>
              <div className="video-preview-row">
                {selected.map((name) => (
                  <div key={name} className='video-container'>
                    <video controls width="260" src={`/videos/${encodeURIComponent(name)}`}>
                      Your browser does not support the video tag.
                    </video>
                    <span>{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <button className="clear-btn" onClick={clearAll}>{l.clear}</button>
      </main>
    </div>
  );
}
