import express from 'express';
// Vite is imported dynamically only in development
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import axios from 'axios';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import dotenv from 'dotenv';
import cors from 'cors';
import crypto from 'crypto';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Credentials
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = `${process.env.APP_URL}/auth/callback`;
const LASTFM_API_KEY = process.env.LASTFM_API_KEY;
const LASTFM_API_SECRET = process.env.LASTFM_API_SECRET;

app.set('trust proxy', 1);
app.use(cors());
app.use((req, res, next) => {
  console.log(`[Request] ${req.method} ${req.url}`);
  next();
});
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: 'scrobblefy-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    sameSite: 'none',
    httpOnly: true,
    maxAge: 3600000 * 24
  }
}));

const getSignature = (params: Record<string, string>) => {
  const sortedKeys = Object.keys(params).sort();
  let signatureString = '';
  for (const key of sortedKeys) {
    signatureString += key + params[key];
  }
  signatureString += LASTFM_API_SECRET;
  return crypto.createHash('md5').update(signatureString, 'utf8').digest('hex');
};

// Spotify Auth
app.get('/api/auth/url', (req, res) => {
  const scope = [
    'user-read-private',
    'user-read-email',
    'user-read-playback-state',      // required for /me/player
    'user-read-currently-playing',   // required for currently playing
    'user-read-recently-played',
    'user-top-read',
    'user-library-read',
    'playlist-read-private',
    'playlist-modify-private',
    'playlist-modify-public',
  ].join(' ');
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID!,
    scope: scope,
    redirect_uri: REDIRECT_URI,
    state: Math.random().toString(36).substring(7)
  });
  res.json({ url: `https://accounts.spotify.com/authorize?${params.toString()}` });
});

app.get('/auth/callback', async (req, res) => {
  const code = req.query.code as string;
  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', 
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID!,
        client_secret: CLIENT_SECRET!
      }).toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    const { access_token, refresh_token } = response.data;
    (req as any).session.accessToken = access_token;
    (req as any).session.refreshToken = refresh_token;
    (req as any).session.save(() => {
      res.send('<html><body><script>opener.postMessage({type:"OAUTH_AUTH_SUCCESS"}, "*");window.close();</script></body></html>');
    });
  } catch (error) { res.status(500).send('Auth failed'); }
});

// Last.fm Auth
app.get('/api/auth/lastfm/url', (req, res) => {
  const url = `http://www.last.fm/api/auth/?api_key=${LASTFM_API_KEY}&cb=${process.env.APP_URL}/auth/lastfm/callback`;
  res.json({ url });
});

app.get('/auth/lastfm/callback', async (req, res) => {
  const token = req.query.token as string;
  try {
    const params: Record<string, string> = { api_key: LASTFM_API_KEY!, method: 'auth.getSession', token };
    params.api_sig = getSignature(params);
    params.format = 'json';
    const response = await axios.get('https://ws.audioscrobbler.com/2.0/', { params });
    const { session } = response.data;
    (req as any).session.lastfmSession = session.key;
    (req as any).session.lastfmName = session.name;
    (req as any).session.save(() => {
      res.send(`<html><body><script>opener.postMessage({type:"LASTFM_AUTH_SUCCESS",name:"${session.name}"}, "*");window.close();</script></body></html>`);
    });
  } catch (error) { res.status(500).send('Last.fm Auth failed'); }
});

app.get('/api/auth/lastfm/status', (req, res) => {
  res.json({ isConnected: !!(req as any).session.lastfmSession, username: (req as any).session.lastfmName || null });
});

app.get('/api/auth/status', (req, res) => {
  res.json({ isAuthenticated: !!(req as any).session.accessToken });
});

// --- High Priority API Routes ---
const FEEDBACK_FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), 'feedbacks.json');

app.post('/api/feedback', async (req, res) => {
  try {
    const { message, user, timestamp } = req.body;
    let feedbacks = [];
    if (fs.existsSync(FEEDBACK_FILE)) {
      feedbacks = JSON.parse(fs.readFileSync(FEEDBACK_FILE, 'utf-8'));
    }
    feedbacks.push({ id: Date.now(), message, user, timestamp });
    fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(feedbacks, null, 2));

    if (process.env.RESEND_API_KEY) {
      await axios.post('https://api.resend.com/emails', {
        from: 'Scrobblefy Feedback <onboarding@resend.dev>',
        to: process.env.ADMIN_EMAIL || 'lucas.frischeisen@gmail.com',
        subject: `✨ Novo Feedback: ${user}`,
        html: `
          <div style="font-family: sans-serif; background: #000; color: #fff; padding: 40px; border-radius: 20px;">
            <h1 style="color: #1DB954;">📬 Novo Recado para Lira!</h1>
            <p><strong>Usuário:</strong> ${user}</p>
            <p><strong>Horário:</strong> ${new Date(timestamp).toLocaleString()}</p>
            <hr style="border: 1px solid #333; margin: 20px 0;">
            <div style="background: #111; padding: 20px; border-radius: 10px; border-left: 4px solid #1DB954;">
              "${message}"
            </div>
            <p style="font-size: 10px; color: #666; margin-top: 40px;">Scrobblefy AI System x Resend</p>
          </div>
        `
      }, {
        headers: { 'Authorization': `Bearer ${process.env.RESEND_API_KEY}` }
      }).catch(e => console.error('Resend Error:', e.response?.data));
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save feedback' });
  }
});

app.get('/api/admin/feedbacks', (req, res) => {
  if (fs.existsSync(FEEDBACK_FILE)) {
    const feedbacks = JSON.parse(fs.readFileSync(FEEDBACK_FILE, 'utf-8'));
    res.json(feedbacks);
  } else {
    res.json([]);
  }
});

app.get('/api/lastfm', async (req, res) => {
  const queryParams = new URLSearchParams({ ...req.query as any, api_key: LASTFM_API_KEY!, format: 'json' }).toString();
  try {
    const response = await axios.get(`https://ws.audioscrobbler.com/2.0/?${queryParams}`);
    res.json(response.data);
  } catch (error: any) { res.status(error.response?.status || 500).json(error.response?.data); }
});

app.post('/api/lastfm/nowplaying', async (req, res) => {
  const sk = (req as any).session.lastfmSession;
  if (!sk) return res.status(401).json({ error: 'Last.fm not connected' });
  const { track, artist, album } = req.body;
  const params: Record<string, string> = { api_key: LASTFM_API_KEY!, method: 'track.updateNowPlaying', sk, track, artist };
  if (album) params.album = album;
  params.api_sig = getSignature(params);
  params.format = 'json';
  try {
    const response = await axios.post('https://ws.audioscrobbler.com/2.0/', new URLSearchParams(params).toString());
    res.json(response.data);
  } catch (error: any) { res.status(500).json({ error: 'Failed to update now playing' }); }
});

app.post('/api/lastfm/scrobble', async (req, res) => {
  const sk = (req as any).session.lastfmSession;
  if (!sk) return res.status(401).json({ error: 'Last.fm not connected' });
  const { track, artist, album, timestamp } = req.body;
  const params: Record<string, string> = { api_key: LASTFM_API_KEY!, method: 'track.scrobble', sk, track, artist, timestamp: timestamp?.toString() || Math.floor(Date.now() / 1000).toString() };
  if (album) params.album = album;
  params.api_sig = getSignature(params);
  params.format = 'json';
  try {
    const response = await axios.post('https://ws.audioscrobbler.com/2.0/', new URLSearchParams(params).toString());
    res.json(response.data);
  } catch (error: any) { res.status(error.response?.status || 500).json(error.response?.data); }
});

app.post('/api/lira/chat', async (req, res) => {
  const { message, context, mode } = req.body;
  const GEMINI_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_KEY) {
    return res.status(500).json({ error: 'Gemini API not configured' });
  }

  try {
    let prompt = `
      Você é a Lira, uma assistente virtual de música altamente carismática, nerd de música e fã de sintetizadores.
      Seu objetivo é ajudar o usuário a descobrir novas músicas e analisar seu gosto.
      Use gírias leves de produtor musical (vibe, mixagem, groove) e emojis.
      
      Contexto do usuário: ${JSON.stringify(context)}
      Mensagem do usuário: "${message}"
    `;

    if (mode === 'recommend') {
      prompt += `
        O usuário quer descobertas. Além da sua resposta, gere uma lista de 10 músicas sugeridas.
        A lista deve vir no final da resposta, após a tag [TRACKS], no formato "Artista - Música" (uma por linha).
      `;
    } else {
      prompt += `Responda de forma curta e empolgante.`;
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );

    const fullText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    let content = fullText;
    let suggestions: string[] = [];

    if (fullText.includes('[TRACKS]')) {
      const parts = fullText.split('[TRACKS]');
      content = parts[0].trim();
      suggestions = parts[1].trim().split('\n').filter((s: string) => s.includes('-'));
    }

    res.json({ content, suggestions });
  } catch (error) {
    console.error('Gemini Error:', error);
    res.status(500).json({ error: 'Failed' });
  }
});

// Wildcard Proxy (Spotify)
app.all('/api/spotify/*', async (req, res) => {
  const accessToken = (req as any).session.accessToken;
  if (!accessToken) return res.status(401).json({ error: 'Not authenticated' });

  // Use regex to get everything AFTER /api/spotify/
  const endpoint = req.path.replace(/^\/api\/spotify\//, '');
  const url = `https://api.spotify.com/v1/${endpoint}`;
  const queryParams = new URLSearchParams(req.query as any).toString();
  const fullUrl = queryParams ? `${url}?${queryParams}` : url;

  console.log(`[Spotify Proxy] ${req.method} ${fullUrl}`);

  try {
    const response = await axios({
      method: req.method,
      url: fullUrl,
      data: req.body,
      headers: { 
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    res.json(response.data || { success: true });
  } catch (error: any) {
    console.error(`[Spotify Proxy Error] ${endpoint}:`, error.response?.status, error.response?.data);
    if (error.response?.status === 204) return res.json({ success: true });
    res.status(error.response?.status || 500).json(error.response?.data || { error: `Spotify API error (${endpoint})` });
  }
});

// Final Catch-all Proxies / Vite
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'custom' });
  app.use(vite.middlewares);
  app.use(async (req, res, next) => {
    if (req.method !== 'GET') return next();
    if (req.originalUrl.startsWith('/api')) return next();
    try {
      let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
      template = await vite.transformIndexHtml(req.originalUrl, template);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e) { next(e); }
  });
} else {
  // Use absolute paths for Vercel
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/') || req.path.startsWith('/auth/')) return res.status(404).json({ error: 'API route not found' });
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

if (process.env.NODE_ENV !== 'production') {
  app.listen(Number(PORT), '0.0.0.0', () => console.log(`Server: http://0.0.0.0:${PORT}`));
}

export default app;
