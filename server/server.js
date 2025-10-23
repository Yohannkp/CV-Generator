const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '2mb' }));

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

app.post('/api/groq', async (req, res) => {
  try{
    const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY || process.env.VITE_GROQ_API_KEY;
    if(!apiKey) return res.status(400).json({ error: 'Server: GROQ_API_KEY not configured' });
    // forward body to Groq
    const body = req.body;
    const resp = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify(body)
    });
    const text = await resp.text();
    // try parse json
    try{ const json = JSON.parse(text); return res.status(resp.status).json(json); } catch(e){ return res.status(resp.status).send(text); }
  }catch(err){ console.error('Error proxying to Groq:', err); return res.status(500).json({ error: 'proxy error' }); }
});

// static serve (optional) - serve dist when present
const staticPath = path.join(__dirname, '..', 'dist');
if(fs.existsSync(staticPath)) app.use(express.static(staticPath));

app.listen(PORT, ()=> console.log(`Proxy server listening on ${PORT}`));
