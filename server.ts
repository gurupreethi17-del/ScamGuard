import path from 'path';
import express from 'express';
import { app } from './src/server/index.ts';

const PORT = 3000;
const distPath = path.resolve(process.cwd(), 'dist');

// Serve static frontend assets if built
app.use(express.static(distPath));

// For SPA routing, redirect non-API requests to index.html
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('ScamGuard AI backend is running. Frontend build in progress.');
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`ScamGuard AI full-stack server running on http://0.0.0.0:${PORT}`);
});
