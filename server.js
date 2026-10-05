import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const distPath = path.join(__dirname, 'dist');
const indexHtmlPath = path.join(distPath, 'index.html');

// Middleware for parsing JSON
app.use(express.json());

// Health check endpoints for Google Cloud Run
app.get(['/healthz', '/health', '/_ah/health', '/ping'], (req, res) => {
  res.status(200).send('OK');
});

// Direct download endpoint for website build zip
app.get(['/almaghreb-alyoum-build.zip', '/download-build'], (req, res) => {
  const zipPath = path.join(distPath, 'almaghreb-alyoum-build.zip');
  if (fs.existsSync(zipPath)) {
    res.setHeader('Content-Disposition', 'attachment; filename="almaghreb-alyoum-build.zip"');
    res.setHeader('Content-Type', 'application/zip');
    res.sendFile(zipPath);
  } else {
    res.status(404).send('Build file not found');
  }
});

// Serve static assets from dist
app.use(express.static(distPath, { maxAge: '1h', index: false }));

// Fallback to index.html for all SPA routes
app.use((req, res) => {
  if (fs.existsSync(indexHtmlPath)) {
    res.sendFile(indexHtmlPath);
  } else {
    res.status(200).send('<!DOCTYPE html><html><head><meta charset="utf-8"><title>المغرب العربي اليوم</title><meta http-equiv="refresh" content="3"></head><body style="font-family: sans-serif; text-align: center; padding: 50px;"><h2>جاري إعداد وتحميل الموقع...</h2><p>يرجى الانتظار ثوانٍ معدودة.</p></body></html>');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});
