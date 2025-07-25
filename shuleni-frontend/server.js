import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import history from 'connect-history-api-fallback';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Handle client-side routing
app.use(history({
  disableDotRule: true,
  verbose: true
}));

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React Router (return `index.html` for all non-api routes)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Network access: http://0.0.0.0:${PORT}`);
});
