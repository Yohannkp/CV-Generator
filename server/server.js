const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

const uploadsDir = path.join(__dirname, 'uploads');
if(!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, {recursive:true});

const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, uploadsDir),
	filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.\-_]/g,''))
});
const upload = multer({ storage });

app.use(express.json());

app.post('/api/personalize', upload.single('cv'), async (req, res) => {
	try{
		if(!req.file) return res.status(400).send('No file uploaded');
		const filePath = req.file.path;
		// Stub: créer un JSON simulé. In a real deployment you'd call an LLM or a CV parser here.
		const result = {
			sourceFile: path.basename(filePath),
			titre: 'Data Scientist - Profil analysé',
			profil: 'Profil extrait automatiquement: 5+ ans expérience en data & ML, focus production de modèles et visualisation.',
			competences: {
				outils: ['Python', 'SQL', 'Pandas', 'scikit-learn'],
				ia: ['Régression', 'Classification', 'XGBoost'],
				analyse: ['Feature engineering','Exploration de données'],
				visualisation: ['Matplotlib','Seaborn','Power BI'],
				baseDonnees: ['PostgreSQL'],
				soft: ['Communication','Travail en équipe']
			},
			experiences: [
				{poste:'Data Scientist', entreprise:'Entreprise X', dates:'2021-2024', details:['Conception de modèles ML','Production et monitoring']} 
			],
			projets: [
				{titre:'Projet IA Example', entreprise:'Perso', details:['Classification produit','Déploiement API']} 
			]
		};

		// Optionnel: sauvegarder le JSON côté serveur
		const outPath = path.join(uploadsDir, path.basename(filePath) + '.json');
		fs.writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf8');

		return res.json(result);
	}catch(err){
		console.error(err); return res.status(500).send('Erreur serveur');
	}
});

// Serve static files (app) and allow other routes as needed
app.use(express.static(path.join(__dirname, '..', 'dist')));

app.listen(PORT, ()=> console.log(`Server listening on ${PORT}`));

