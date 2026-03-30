const { IncomingForm } = require('formidable');
const pdfParse = require('pdf-parse');
const fs = require('fs');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new IncomingForm({
    maxFileSize: 50 * 1024 * 1024, // 50MB
  });

  try {
    const [fields, files] = await form.parse(req);
    const pdfFile = files.pdf?.[0];

    if (!pdfFile) {
      return res.status(400).json({ error: 'No pdf file uploaded' });
    }

    const fileBuffer = await fs.promises.readFile(pdfFile.filepath);
    const data = await pdfParse(fileBuffer);

    return res.json({ text: data.text });
  } catch (err) {
    return res.status(500).json({ error: 'PDF parsing failed', details: err.message });
  }
};
