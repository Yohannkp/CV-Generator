<h1 align="center">CV Generator (React + Vite)</h1>

Application web monopage permettant de :
1. Afficher/éditer un CV structuré (profil, description, expériences, projets, formations, compétences, langues, certifications, contacts).
2. Analyser une offre d'emploi via l'API Groq (LLM) et proposer : mots-clés, compétences à ajouter, nouveau titre, puces d'expérience.
3. Appliquer sélectivement les suggestions au CV.
4. Exporter le CV en PDF sous plusieurs modes :
	 - Image (capture html2canvas + jsPDF).
	 - Impression vectorielle (nouvelle fenêtre + CSS print) avec liens cliquables.
	 - Reconstruction texte (jsPDF) pour un PDF léger et sélectionnable.

## 🚀 Démarrage rapide

Prérequis : Node 18+.

```bash
git clone https://github.com/Yohannkp/CV-Generator.git
cd CV-Generator
npm install
cp .env.example .env   # ajouter votre clé Groq
npm run dev
```

Ouvrir: http://localhost:5173

## 🔐 Configuration API Groq

Créer un fichier `.env` :

```
VITE_GROQ_API_KEY=sk_....
```

Attention: la clé est chargée côté client (prototype). Pour la production, mettre un proxy backend.

## 🧠 Analyse d'offre

Coller le texte d'une offre dans la zone prévue puis cliquer « Analyser ». Le LLM retourne un JSON strict contenant :
```json
{
	"mots_cles": ["..."],
	"suggestions": {
		"titre_cv": "...",
		"competences": { "ajouter": { "outils": [], "analyse": [], "ia": [] } },
		"experiences": { "puces": ["..."] }
	}
}
```
Le parsing est robuste (plusieurs stratégies) et nettoie doublons/cas.

## 📄 Export PDF

Boutons disponibles :
| Mode | Avantages | Limites |
|------|-----------|---------|
| Image | Aspect identique écran | Texte non sélectionnable |
| Impression | Vecteur, liens actifs, police nette | Ajustements CSS nécessaires |
| Texte | Très léger, sélectionnable | Mise en page simplifiée |

Le mode Impression applique un algorithme adaptatif (réduction espacements puis tailles) pour rester sur une seule page A4.

## 🗂 Structure simplifiée

```
src/
	App.jsx       # Logique principale (état CV, analyse, export)
	App.css       # Styles CV
	main.jsx      # Entrée React
server/
	server.js     # (Facultatif) exemple de serveur (non utilisé en prod pour l'instant)
```

## ✅ Améliorations futures

- Backend proxy pour cacher la clé Groq.
- Édition inline des sections (inputs / drag & drop).
- Undo / historique des modifications.
- Génération multi-versions de CV ciblés.
- Tests unitaires pour le parseur JSON.
- Export DOCX.

## 🔧 Scripts NPM

| Script | Description |
|--------|------------|
| dev | Lance Vite en mode développement |
| build | Build production |
| preview | Prévisualisation du build |

## ⚖️ Licence

MIT. Voir `LICENSE` si ajoutée ultérieurement.

Contributions et issues bienvenues.

## ✍️ Personnalisation par upload (nouvelle page)

Une nouvelle page `/personalize` permet d'uploader un CV (PDF / DOCX). Le fichier est envoyé au endpoint `POST /api/personalize` et le serveur renvoie une mini-base JSON (titre, profil, compétences, expériences, projets) utilisable pour pré-remplir le template.

Côté serveur, un stub est fourni dans `server/server.js` qui sauvegarde le fichier dans `server/uploads` et renvoie un JSON simulé. En production, remplacez la logique par un parseur de CV + appel LLM.

Variables d'environnement recommandées:
- `OPENAI_API_KEY` ou `VITE_GROQ_API_KEY` selon votre implémentation LLM.

Pour tester localement:

```powershell
# Installer dépendances (si nécessaire)
npm install
# Lancer le serveur express (dans un terminal)
node server/server.js
# Dans un autre terminal lancer l'app (vite)
npm run dev
# Ouvrir http://localhost:5173/personalize
```
