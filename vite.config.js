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
          en: 'en-IN',
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
          if (!res.headersSent) {
            res.statusCode = 502;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
          } else {
            res.destroy();
          }
        });
      } catch (err) {
        console.warn('[Vite TTS Handler Error]:', err.message);
        if (!res.headersSent) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message }));
        } else {
          res.destroy();
        }
      }
    });
  }
});

// Plugin to provide built-in mock/local REST API endpoints so the app runs 100% standalone locally
const localApiPlugin = () => ({
  name: 'local-api-plugin',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const url = req.url || '';

      if (url === '/api/status' || url.startsWith('/api/status?')) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          success: true,
          status: 'online',
          server: 'Krishi Jal Local Agro Engine',
          version: '3.8',
          timestamp: new Date().toISOString()
        }));
        return;
      }

      if (url === '/api/equipment' || url.startsWith('/api/equipment?')) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          success: true,
          count: 16,
          equipment: [
            { id: "mach-03", owner: "Agri Drone Sprayer CHC Rental", name: "Custom Hiring Drone Spraying Unit", description: "Thenkurissi, Palakkad, Kerala • Ultra-low volume canopy spray", phone: "9496294951", website: "https://agrimachinery.nic.in/", category: "drone" },
            { id: "mach-04", owner: "Drone Raja Head Office", name: "Agricultural Crop Spraying Drone", description: "Kankipadu, Vijayawada, Andhra Pradesh • Aerial mapping & spraying", phone: "9989838337", website: "https://droneraja.in/", category: "drone" },
            { id: "mach-05", owner: "Marut Drones", name: "DGCA-Certified Agricultural Drone", description: "Madhapur, Hyderabad, Telangana • Direct field custom hiring", phone: "9052999365", website: "https://marutdrones.com/", category: "drone" },
            { id: "mach-06", owner: "Bushra Impex / X1 Power", name: "Power Weeders, Harvesters & Sprayers", description: "Kalasipalya, Bengaluru, Karnataka • High-efficiency inter-row weeders", phone: "7624869606", website: "", category: "harvester" },
            { id: "mach-07", owner: "Kale Agri Tech", name: "Tractors, Harvesters & Machinery Hire", description: "Shivamogga, Karnataka • Farm machinery custom hiring centre", phone: "+91 94481 23456", website: "https://www.kaleagritech.com/", category: "tractors" },
            { id: "mach-08", owner: "WhiteOx Agri Services", name: "Tractor, Drone Spraying & Seed Sowing", description: "Sholinganallur, Chennai, Tamil Nadu • Modern custom mechanization", phone: "8111015577", website: "https://whiteox.in/", category: "tractors" },
            { id: "mach-09", owner: "Agrizone India", name: "Agricultural Machinery & Harvesters", description: "Puttur, Dakshina Kannada, Karnataka • Heavy equipment hire network", phone: "9108575757", website: "https://www.agrizoneind.com/", category: "tractors" },
            { id: "mach-10", owner: "GreenRider Enterprises", name: "Agricultural & Dairy Machinery", description: "Bettahalli, Kunigal, Karnataka • Fodder harvesters & tractor implements", phone: "9844107053", website: "https://www.greenriderskb.com/", category: "tractors" },
            { id: "mach-11", owner: "Sawbhumi Asha Agri India", name: "Mini Tractors, Threshers & Power Tillers", description: "Amta/Nowda, Murshidabad, West Bengal • Smallholder machinery rental", phone: "9733829216", website: "https://www.ashaagriindia.com/", category: "tractors" },
            { id: "mach-12", owner: "JFarm Services (TAFE)", name: "Farmer-to-Farmer Tractor & Implement Rental", description: "National Network • Pan-India Free Custom Hiring Platform", phone: "1800-4200-100", website: "https://www.jfarmservices.in/", category: "tractors" },
            { id: "mach-13", owner: "BhoomiHire Mechanization", name: "Tractor, Rotavator & Harvester Booking", description: "Hyderabad, Telangana • Multi-district custom hiring", phone: "7337291961", website: "https://bhoomihire.in/", category: "tractors" },
            { id: "mach-14", owner: "Miraitu Agri Robotics", name: "Spraying Drones, Borewell & Field Services", description: "Parappana Agrahara, Bengaluru, Karnataka • Smart mechanization", phone: "9380306475", website: "https://www.miraitu.in/", category: "drone" },
            { id: "mach-15", owner: "SarvaGram Farm Services", name: "Cultivator, Rotavator & Harvester Rentals", description: "Rural India Network • Rural mechanization & custom hiring", phone: "8101777555", website: "https://www.sarvagram.com/farm-services/", category: "harvester" },
            { id: "mach-16", owner: "GROO Agri Solutions", name: "Tractor, Harvester, Drone & Earthmover", description: "Pan India • Heavy farm machinery on-demand booking", phone: "+91 98200 11223", website: "https://grooagri.com/", category: "tractors" },
            { id: "mach-17", owner: "Desinganadu Farmer Producer Company", name: "FPO Custom Hiring & Agri Drones", description: "Kollam, Kerala • Farmer cooperative machinery center", phone: "+91 94470 55667", website: "https://www.desinganadu.in/", category: "drone" },
            { id: "mach-18", owner: "KisanDepot / Kerblet", name: "Tractor, Rotavator & Sprayer Rental", description: "India Network • Digital machinery custom hiring portal", phone: "1800-120-1234", website: "https://www.kerblet.com/", category: "tractors" }
          ]
        }));
        return;
      }

      if (url === '/api/equipment/book') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true, message: 'Equipment booking confirmed successfully!' }));
        return;
      }

      if (url === '/api/produce' || url.startsWith('/api/produce?')) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true, produce: [] }));
        return;
      }

      if (url === '/api/produce/add') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true, message: 'Produce listing added successfully!' }));
        return;
      }

      if (url === '/api/soillab/save') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true, message: 'Soil laboratory report saved successfully!' }));
        return;
      }

      next();
    });
  }
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), ttsPlugin(), localApiPlugin()],
  server: {
    port: 5173,
    host: true
  }
});
