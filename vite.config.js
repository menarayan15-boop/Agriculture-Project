import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import https from 'https';

// Plugin to proxy TTS requests for all regional Indian languages with zero CORS issues
const ttsPlugin = () => ({
  name: 'tts-proxy-plugin',
  configureServer(server) {
    server.middlewares.use('/api/tts', (req, res) => {
      try {
        const parsedUrl = new URL(req.url, 'http://localhost:5173');
        const tl = parsedUrl.searchParams.get('tl') || 'hi';
        const q = parsedUrl.searchParams.get('q') || '';
        if (!q.trim()) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Text query is required' }));
          return;
        }

        const langMap = {
          en: 'en',
          hi: 'hi',
          te: 'te',
          ta: 'ta',
          kn: 'kn',
          pa: 'pa',
          mr: 'mr',
          bn: 'bn',
          gu: 'gu',
          or: 'hi' // Odia maps to Hindi phonetics
        };
        const targetLang = langMap[tl] || tl;
        const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(targetLang)}&q=${encodeURIComponent(q.slice(0, 200))}`;

        const gReq = https.get(googleUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Referer': 'https://translate.google.com/'
          }
        }, (gRes) => {
          res.writeHead(gRes.statusCode || 200, {
            'Content-Type': gRes.headers['content-type'] || 'audio/mpeg',
            'Cache-Control': 'public, max-age=86400',
            'Access-Control-Allow-Origin': '*'
          });
          gRes.pipe(res);
        });

        gReq.on('error', (err) => {
          console.warn('[Vite TTS Proxy Error]:', err.message);
          res.statusCode = 502;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message }));
        });
      } catch (err) {
        console.warn('[Vite TTS Handler Error]:', err.message);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: err.message }));
      }
    });
  }
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), ttsPlugin()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
