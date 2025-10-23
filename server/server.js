const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '4mb' }));

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

// --- /api/groq proxy to external Groq/OpenAI endpoint (server-side key)
app.post('/api/groq', async (req, res) => {
  try{
    const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY || process.env.VITE_GROQ_API_KEY;
    if(!apiKey) return res.status(400).json({ error: 'Server: GROQ_API_KEY not configured' });
    const body = req.body;
    const resp = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify(body)
    });
    const text = await resp.text();
    try{ const json = JSON.parse(text); return res.status(resp.status).json(json); } catch(e){ return res.status(resp.status).send(text); }
  }catch(err){ console.error('Error proxying to Groq:', err); return res.status(500).json({ error: 'proxy error' }); }
});

// --- /api/personalize : accept CV upload and return a JSON stub
const uploadsDir = path.join(__dirname, 'uploads');
if(!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.\-_]/g,''))
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

app.post('/api/personalize', upload.single('cv'), async (req, res) => {
  try{
    if(!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const filePath = req.file.path;
    // Minimal stub response: in prod, replace with PDF/DOCX parser + LLM
    const result = {
      sourceFile: path.basename(filePath),
      titre: 'Data Scientist - Profil généré',
      profil: 'Profil extrait automatiquement: expertise data & ML, production de modèles et visualisation.',
      competences: {
        outils: ['Python','SQL','Pandas','scikit-learn'],
        ia: ['Classification','Régression'],
        analyse: ['Exploration','Feature engineering'],
        visualisation: ['Matplotlib','Seaborn']
      },
      experiences: [ { poste:'Data Scientist', entreprise:'Entreprise X', dates:'2021-2024', details:['Conception de modèles','Déploiement en production'] } ],
      projets: [ { titre:'Projet Exemple', entreprise:'Perso', details:['Classification', 'API de déploiement'] } ]
    };
    // Save JSON alongside the uploaded file
    const outPath = path.join(uploadsDir, path.basename(filePath) + '.json');
    fs.writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf8');
    return res.json(result);
  }catch(err){ console.error('Error handling personalize upload:', err); return res.status(500).json({ error: 'server error' }); }
});

// static serve (optional) - serve dist when present
const staticPath = path.join(__dirname, '..', 'dist');
if(fs.existsSync(staticPath)) app.use(express.static(staticPath));

app.listen(PORT, ()=> console.log(`Server listening on ${PORT}`));
