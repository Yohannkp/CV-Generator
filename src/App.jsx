

import { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './App.css';

function App() {
  // Données du CV inspirées du design fourni (rendent éditables via setCvData)
  const [cvData, setCvData] = useState({
    nom: 'Yohann YENDI',
  titre: 'Alternant Data – Power BI | Python | Scoring & Analyses Actionnables',
    contact: {
      telephone: '06 45 86 35 33',
      email: 'yendiyohann@gmail.com',
      adresse: 'Paris (75000)',
      linkedin: 'https://www.linkedin.com/in/yohannkp',
      portfolio: 'https://www.datascienceportfol.io/yendiyohann'
      // Permis B supprimé de l'affichage prioritaire (faible valeur ATS)
    },
    langues: [
      { nom: 'Français', niveau: 'Natif' },
      { nom: 'Anglais', niveau: 'Intermédiaire' }
    ],
    reseaux: [
      // Réseaux personnels retirés (peu d'impact ATS). Garder LinkedIn déjà dans contact.
    ],
    competences: {
      outils: [
        'Python (Pandas, Matplotlib, Scikit-learn)',
        'SQL (PostgreSQL, MySQL)',
        'Power BI',
        'Power Query / Excel avancé',
        'Git'
      ],
      // Garder anciens identifiants utilisés par le rendu et la logique suggestions pour éviter les erreurs
      baseDonnees: ['Modélisation relationnelle', 'Jointures complexes', 'Optimisation requêtes', 'Indexation'],
      ia: ['Classification', 'Régression', 'Random Forest', 'XGBoost', 'Feature engineering'],
      // Nouvelles catégories (alias) – pourront être exploitées plus tard
      dataEngineering: ['Modélisation relationnelle', 'Jointures complexes', 'Optimisation requêtes', 'Indexation'],
      ml: ['Classification', 'Régression', 'Random Forest', 'XGBoost', 'Feature engineering'],
      analyse: ['EDA', 'KPIs & métriques business', 'A/B Testing', 'Scoring', 'Modélisation prédictive', 'Segmentation clients', 'Analyse rétention'],
      visualisation: ['Dashboards Power BI', 'Data storytelling', 'Pyramid Principle', 'Rapports automatisés'],
      business: ['Recueil des besoins', 'Gestion parties prenantes', 'Amélioration de processus', 'Priorisation ROI', 'Analyse fonctionnelle'],
      soft: ['Analyse & sens business', 'Communication claire', 'Vulgarisation', 'Proactivité & autonomie', 'Travail en équipe']
    },
    certifications: [
      'Google Advanced Data Analytics',
      'IBM Data Analyst'
    ],
  profil: "Data Analyst orienté business : fidélisation, scoring client, aide à la décision. Je traduis les besoins métier en indicateurs et décisions actionnables (Python, SQL, Power BI) et recherche une alternance à fort impact sur la performance.",
  description: "",
    experiences: [
      {
        poste: 'Data Analyst – Analyse comportementale retail',
        entreprise: 'Quantum – Simulation pro Paris',
        dates: '2025',
        details: [
          'Analyse de 300 000+ transactions pour évaluer l’impact de nouveaux layouts (KPIs : panier moyen, conversion zone)',
          'Attribution automatique des magasins de contrôle (règles + script SQL) & T-tests sur magasins tests',
          'Recommandations stratégiques priorisant le déploiement sur segments à ROI le plus élevé'
        ]
      },
      {
        poste: 'Stage Développeur Fullstack',
        entreprise: 'TRUSTLINE Lyon',
        dates: 'Janvier 2024 à mars 2024',
        details: [
          "Développement app mobile Flutter (auth, QR code, notifications, cartes) + intégration d'API REST",
          "Optimisation requêtes & UI (temps de chargement écran principal ~ -30%)",
          "Structuration JSON -> modèles réutilisables pour future exploitation analytique",
        ]
      }
    ],
    projets: [
      {
        titre: 'Data Scientist – Modélisation du risque client',
        entreprise: 'Kaggle Paris',
        dates: '2025',
        details: [
          "Prédiction des défauts de paiement avec Random Forest (AUC 0.88)",
          "Réduction des faux positifs, scoring pour équipes credit",
          "Déploiement : app Streamlit, API prédictive, dashboard Power BI"
        ]
      },
      {
        titre: 'Data Scientist – Analyse RH prédictive',
        entreprise: 'Salif Motors - Google - Certification Paris',
        dates: 'Octobre 2024 à mars 2025',
        details: [
          "Analyse de données RH de 15 000 employés pour prédire les départs",
          "Création d’un modèle de départ prédictif (AUC 0.94) pour 150K salariés – Indicateur de surcharge RH et suivi des revues RH mensuelles",
          "Recommandations RH : promotion, coaching, autres outils, visuels (dashboard Power BI, Streamlit)"
        ]
      },
      {
        titre: 'Data Analyst – Optimisation des ventes et marges',
        entreprise: 'Kaggle Paris',
        dates: '2025',
        details: [
          "Analyse de 500 000 lignes de ventes (SQL) pour identifier les produits à faible marge",
          "Recommandations : +15 % marge nette via ajustement des prix, ciblage promotionnel et priorisation de 10 produits générant 65 % du CA"
        ]
      }
    ],
    formations: [
      {
        diplome: 'Cycle ingénieur – ING3 - Data & IA',
        ecole: 'ECE Paris',
        dates: '2025 à 2027',
        details: [
          "Statistiques, probabilités, algèbre linéaire, Python, SQL, Power BI, Machine Learning, IA explicable, modélisation, déploiement"
        ]
      },
      {
        diplome: 'Développeur Fullstack et DevOps',
        ecole: 'IPSSI Paris',
        dates: '2023 à 2024',
        details: [
          "Conception applications web et mobiles (React, Flutter, Node.js, Symfony), intégration d’API REST, UX/UI, bases de données SQL/NoSQL"
        ]
      },
      {
        diplome: 'Licence Génie Logiciel',
        ecole: 'IPNET Togo',
        dates: '2020 à 2023',
        details: [
          "Conception et développement d’applications web et desktop, programmation (Java, Python, C++), bases de données (SQL), modélisation (UML/Merise), gestion de projet Agile"
        ]
      }
    ]
  });

  // Référence pour la zone à exporter en PDF
  const cvRef = useRef(null);

  // Option 1 (actuelle) = image. Option 2 = print CSS (vector). Option 3 = reconstruction text jsPDF.
  const handleDownloadPDF = async (mode='image') => {
    if (!cvRef.current) return;
    if (mode === 'print') {
      // Impression vectorielle : largeur en mm proche zone imprimable A4 pour éviter le shrink automatique
  const DESIGN_WIDTH_MM = 198; // élargir légèrement pour donner plus de largeur au texte (max utile avec marges 6mm)
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;
      const doc = printWindow.document;
      const title = `CV-${cvData.nom.replace(/\s+/g,'-')}`;
      const headStyles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
        .map(n=>n.outerHTML).join('\n');
      const cvHtml = cvRef.current.outerHTML;
      const printCSS = `@page { size:A4; margin:2.8mm 6mm 8mm; }\n` /* top margin further reduced (was 4mm) */
        + `:root{--fs:13.8px; --h1:1.85em; --h2:0.99em; --lh:1.28; --secGap:32px; --blockGap:16px; --pGap:23px;}\n`
        + `html,body{background:#fff; -webkit-print-color-adjust:exact; print-color-adjust:exact; font-size:var(--fs);}`
        + `\n.controls,button,textarea{display:none!important;}`
        + `\n.cv-container{box-shadow:none!important; width:${DESIGN_WIDTH_MM}mm!important; max-width:${DESIGN_WIDTH_MM}mm!important; margin:0 auto!important; border-radius:0!important; display:flex;}`
  + `\n.cv-sidebar{flex:0 0 205px; padding:10px 14px 24px; font-size:0.9em;}` /* reduced top padding */
  + `\n.cv-main{flex:1; padding:12px 20px 30px 22px;}` /* reduced top padding */
  + `\n.cv-sidebar .contact-item{display:flex;align-items:center;gap:6px;color:#e2e8f0;font-size:0.82em;line-height:1.14;}`
  + `\n.cv-sidebar .contact-item svg{width:12px;height:12px;stroke:#6fb9d6;stroke-width:1.4;fill:none;}`
  + `\n.cv-sidebar .contact-item a{color:#6fb9d6;text-decoration:none;}`
  + `\n.cv-sidebar .contact-item a:hover{color:#d4b152;text-decoration:underline;}`
  + `\n.cv-sidebar .contact-item span{color:#cbd5e1;}`
  + `\n.cv-sidebar .contact-separator{height:1px;background:linear-gradient(90deg,rgba(255,255,255,0.18),rgba(255,255,255,0));margin:4px 0 6px;}`
        + `\n.cv-sidebar, .cv-main{line-height:var(--lh);}`
  + `\n.cv-main h1{margin:0 0 2px; font-size:var(--h1);}`
  + `\n.cv-main h2{margin:0 0 8px; font-size:var(--h2);}`
        + `\n.cv-main section{margin-bottom:var(--secGap);}`
        + `\n.cv-experience, .cv-projet, .cv-formation{margin-bottom:var(--blockGap);}`
        + `\nul{margin-top:6px!important;}`
        + `\nul li{margin:0 0 6px;}`
        + `\n.cv-profile{margin-bottom:13px;}`
        + `\n.cv-description{margin-bottom:var(--pGap);}`
        + `\n.cv-main, .cv-main p, .cv-main li{hyphens:none; word-break:normal; overflow-wrap:anywhere;}`
        + `\na{text-decoration:underline!important;}`;
      const adaptScript = `<script>(function(){var c=document.querySelector('.cv-container');if(!c){return;}var target=1122*0.97;var h=c.scrollHeight;var docEl=document.documentElement;var fs=parseFloat(getComputedStyle(docEl).fontSize)||14.2;var secGap=34,blockGap=17,pGap=28,lh=1.30;function apply(){docEl.style.setProperty('--fs',fs+'px');docEl.style.setProperty('--secGap',secGap+'px');docEl.style.setProperty('--blockGap',blockGap+'px');docEl.style.setProperty('--pGap',pGap+'px');docEl.style.setProperty('--lh',lh);}apply();var i=0;while(h>target && i<80){if(secGap>26)secGap-=1;else if(blockGap>12)blockGap-=1;else if(pGap>20)pGap-=1;else if(fs>12.2)fs-=0.2;else if(lh>1.22)lh-=0.01;else break;apply();h=c.scrollHeight;i++;}setTimeout(function(){window.print();},60);})();<\/script>`;
      doc.write(`<!DOCTYPE html><html><head><title>${title}</title><meta charset='utf-8'/>${headStyles}<style media='print'>${printCSS}</style></head><body>${cvHtml}${adaptScript}</body></html>`);
      doc.close();
      const finalize = () => { printWindow.focus(); printWindow.print(); };
      if (doc.fonts && doc.fonts.ready) { doc.fonts.ready.then(finalize); } else { setTimeout(finalize, 300); }
      return;
    }
    if (mode === 'text') {
      // Reconstruction textuelle simple (vector) : titres + listes.
      const pdf = new jsPDF('p','mm','a4');
      const lineHeight = 6;
      let y = 15;
      const pageHeight = pdf.internal.pageSize.getHeight();
      const addLine = (text, size=11, bold=false) => {
        pdf.setFontSize(size);
        pdf.setFont(undefined, bold ? 'bold' : 'normal');
        const splitted = pdf.splitTextToSize(text, 180);
        splitted.forEach(line => {
          if (y > pageHeight-15) { pdf.addPage(); y = 15; }
          pdf.text(line, 15, y); y += lineHeight;
        });
      };
      addLine(cvData.nom, 16, true);
      addLine(cvData.titre, 11);
      addLine('');
      addLine('Profil', 13, true);
      addLine(cvData.profil);
      addLine('');
      addLine('Description', 13, true);
      addLine(cvData.description);
      addLine('');
      addLine('Compétences', 13, true);
      const compBlock = [
        'Outils: '+cvData.competences.outils.join(', '),
        'Analyse: '+cvData.competences.analyse.join(', '),
        'IA: '+cvData.competences.ia.join(', ')
      ];
      compBlock.forEach(c=>addLine(c));
      addLine('');
      addLine('Expériences', 13, true);
      cvData.experiences.forEach(exp => {
        addLine(`${exp.poste} (${exp.dates}) - ${exp.entreprise}`, 11, true);
        exp.details.forEach(d=>addLine('• '+d, 10));
        addLine('');
      });
      addLine('Projets', 13, true);
      cvData.projets.forEach(p => {
        addLine(`${p.titre} (${p.dates}) - ${p.entreprise}`, 11, true);
        p.details.forEach(d=>addLine('• '+d, 10));
        addLine('');
      });
      addLine('Formations', 13, true);
      cvData.formations.forEach(f => {
        addLine(`${f.diplome} (${f.dates}) - ${f.ecole}`, 11, true);
        f.details.forEach(d=>addLine('• '+d, 10));
        addLine('');
      });
      pdf.save('cv-yohann-yendi.pdf');
      return;
    }
    // mode image (défaut)
    const element = cvRef.current;
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidthMm = canvas.width * 0.2645;
    const imgHeightMm = canvas.height * 0.2645;
    const ratio = Math.min(pageWidth / imgWidthMm, pageHeight / imgHeightMm);
    const renderWidth = imgWidthMm * ratio;
    const renderHeight = imgHeightMm * ratio;
    const x = (pageWidth - renderWidth) / 2;
    const y = 5;
    pdf.addImage(imgData, 'PNG', x, y, renderWidth, renderHeight, undefined, 'FAST');
    pdf.save('cv-yohann-yendi.pdf');
  };

  // Etat pour coller l'offre d'emploi et analyser
  const [jobOfferText, setJobOfferText] = useState('');
  const [analysis, setAnalysis] = useState(null); // { motsCles:[], suggestions:{ titre?: string, competences:{outils:[], analyse:[], ia:[]} } }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rawGroq, setRawGroq] = useState('');
  const [showDebug, setShowDebug] = useState(false);
  const [experienceCible, setExperienceCible] = useState(0);
  const [compact, setCompact] = useState(false); // mode compact auto quand trop de contenu

  // URL Groq directe (NE PAS exposer une clé sensible en production publique)
  const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

  const analyserOffre = async () => {
  // Reset previous suggestions before new analysis
  setAnalysis(null);
  setRawGroq('');
  setShowDebug(false);
  setExperienceCible(0);
  setError(null);
    if (!jobOfferText.trim()) { setError('Collez d\'abord le texte de l\'offre.'); return; }
    setLoading(true);
    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY; // clé définie dans .env local côté build
      if (!apiKey) throw new Error('VITE_GROQ_API_KEY manquante dans .env');
        const prompt = `Retourne STRICTEMENT un JSON suivant (aucun texte avant/après) :\n\n{\n  \"mots_cles\": [\"string\"],                // max 50 éléments, importance décroissante (inclure mots simples ET expressions multi-mots importantes)\n  \"suggestions\": {\n    \"titre_cv\": \"string (optionnel)\",\n    \"competences\": {\n      \"ajouter\": {\n        \"outils\": [\"string\"],           // max 12 nouvelles compétences OUTILS réellement absentes du CV\n        \"analyse\": [\"string\"],          // max 12 concepts data/analyse/métriques absents\n        \"ia\": [\"string\"]                // max 12 ML/IA absents\n      }\n    },\n    \"experiences\": {\n      \"puces\": [\"string\"]              // 1 à 8 puces (verbe d'action + impact chiffré)\n    }\n  }\n}\n\nConsignes mots_cles :\n- EXTRAIRE le plus de mots/expressions pertinents (outils, technos, méthodes, KPIs, domaines, rôles, frameworks, verbes action).\n- Garder la casse normale (première lettre majuscule si nom propre, tout en majuscules pour sigle).\n- PAS de doublons (insensible à la casse et aux accents).\n- Autorisé: expressions multi-mots (ex: \"Analyse prédictive\", \"Random Forest\").\n- Inclure aussi compétences déjà dans le CV si présentes dans l'offre (objectif = matching maximal).\n\nContraintes générales :\n- Aucun autre champ.\n- Tableau vide = [] si rien.\n- Pas d'explication supplémentaire.\n\nOFFRE:\n\"\"\"${jobOfferText}\"\"\"\n\nCV CONTEXTE (extraits) :\nNom: ${cvData.nom}\nTitre actuel: ${cvData.titre}\nOutils présents: ${cvData.competences.outils.slice(0,20).join(', ')}\nAnalyse présents: ${cvData.competences.analyse.slice(0,20).join(', ')}\nIA présents: ${cvData.competences.ia.slice(0,20).join(', ')}\n`;
      const body = {
        model: 'llama-3.3-70b-versatile',
          temperature: 0.25,
          max_tokens: 1200,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: 'Tu es un assistant d\'optimisation de CV concis. Réponds uniquement avec un JSON valide.' },
          { role: 'user', content: prompt }
        ]
      };
      const resp = await fetch(GROQ_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
          body: JSON.stringify(body)
        });
        if (!resp.ok) {
          const txt = await resp.text();
          throw new Error('Groq API: ' + txt);
        }
        const json = await resp.json();
        const content = json.choices?.[0]?.message?.content || '';
        setRawGroq(content);

        const tryParse = (text) => {
          // tentative directe
          try { return JSON.parse(text); } catch {}
          // bloc ```json
          const fenced = text.match(/```json[\s\S]*?```/i);
          if (fenced) {
            const inner = fenced[0].replace(/```json/i,'').replace(/```$/,'').trim();
            try { return JSON.parse(inner); } catch {}
          }
            // première accolade -> dernière accolade
          const objMatch = text.match(/\{[\s\S]*\}/);
          if (objMatch) {
            try { return JSON.parse(objMatch[0]); } catch {}
          }
          // nettoyage virgules traînantes
          const cleaned = text.replace(/,(\s*[}\]])/g,'$1').replace(/```/g,'');
          try { return JSON.parse(cleaned); } catch {}
          return null;
        };
        const parsed = tryParse(content);
        if (!parsed) throw new Error('Parsing réponse Groq impossible');

        // Normalisation stricte
        const stripAccents = (s) => s.normalize('NFD').replace(/\p{Diacritic}/gu,'');
        const normalizeArray = (arr, max=50) => {
          if (!Array.isArray(arr)) return [];
          const seen = new Set();
          const out = [];
            arr.forEach(x=>{
              if (typeof x !== 'string') return;
              const t = x.trim();
              if (!t) return;
              const key = stripAccents(t).toLowerCase();
              if (!seen.has(key)) { seen.add(key); out.push(t); }
            });
          return out.slice(0,max);
        };
        const norm = {
          mots_cles: normalizeArray(parsed.mots_cles || parsed.motsCles, 15),
          suggestions: {
            titre: undefined,
            competences: { outils: [], analyse: [], ia: [] },
            experiences: { puces: [] }
          }
        };
        const sugg = parsed.suggestions || {};
        norm.suggestions.titre = sugg.titre_cv || sugg.titre || undefined;
        const compAdd = (sugg.competences && (sugg.competences.ajouter || sugg.competences)) || {};
        norm.suggestions.competences.outils = normalizeArray(compAdd.outils,12);
        norm.suggestions.competences.analyse = normalizeArray(compAdd.analyse,12);
        norm.suggestions.competences.ia = normalizeArray(compAdd.ia,12);
        norm.suggestions.experiences.puces = normalizeArray((sugg.experiences && sugg.experiences.puces) || [],8);

        let motsCles = norm.mots_cles;
        // Fallback local pour maximiser le rappel: tokenisation brute de l'offre si peu de mots renvoyés
        if (motsCles.length < 40) {
          const stop = new Set(['et','de','la','le','les','des','un','une','du','en','dans','pour','par','avec','sur','au','aux','d','à','the','a','an','of','to','on','or','et/ou','ou']);
          const rawTokens = jobOfferText
            .replace(/[^A-Za-zÀ-ÖØ-öø-ÿ0-9+#/\.\- ]/g,' ')
            .split(/\s+/)
            .filter(t=>t.length>2 && !stop.has(t.toLowerCase()));
          const enriched = [...motsCles];
          const seenLocal = new Set(motsCles.map(m=>stripAccents(m).toLowerCase()));
          rawTokens.forEach(tok=>{
            const key = stripAccents(tok).toLowerCase();
            if(!seenLocal.has(key)) { seenLocal.add(key); enriched.push(tok); }
          });
          motsCles = normalizeArray(enriched, 50);
        }
        // Filtrage de bruit: retirer mots trop génériques si issus du fallback
        const generic = new Set([
          'responsable','missions','mission','profil','poste','equipe','equipes','équipe','équipes','societe','entreprise','entreprises','solution','solutions','projet','projets','client','clients','besoins','activites','activités','activite','activité','demandes','capacite','capacité','capacites','capacités','mise','place','mise en place','travailler','travail','bonne','forte','fort','plus','moins','aussi','ainsi','domaine','secteur','niveau','experience','expérience','experiences','expériences','exemple','resultats','résultats','resultat','résultat','support','processus','process','produit','produits','valeur','valeurs','donnees','données','data','analyse','analyses','analyser','optimisation','optimiser','amelioration','amélioration','ameliorer','améliorer','developpement','développement','developper','développer'
        ]);
        const monthRe = /^(janv|févr|fevr|mars|avr|mai|juin|juil|août|aout|sept|oct|nov|déc|dec)\w*$/i;
        const cleaned = [];
        const keepReason = (w) => {
          if (!w) return false;
          const t = w.trim();
          if (t.length < 3) return false;
          if (monthRe.test(t)) return false;
          const lower = t.toLowerCase();
          if (generic.has(lower)) return false; // génériques fréquents
          // Garder si contient chiffre, majuscule interne, tiret, slash, ou tout en majuscules (acronyme), ou plusieurs mots
          if (/\d/.test(t) || /[A-Z].*[A-Z]/.test(t) || /[-/#]/.test(t) || t === t.toUpperCase()) return true;
          if (t.split(/\s+/).length > 1) return true;
          // Garder certains patterns métiers/tech
          if (/(sql|python|power|excel|bi|cloud|api|model|modèle|kpi|kpis|forecast|machine|learning|ia|ml|data|dashboard|scoring|random|forest|regression|régression|classification|segmentation)/i.test(t)) return true;
          // Sinon garder seulement les 30 premiers non filtrés du modèle initial (motsCles est déjà en ordre d'importance modèle d'abord)
          return cleaned.length < 30;
        };
        motsCles.forEach(m=>{ if (keepReason(m)) cleaned.push(m); });
        // Scoring heuristique pour ne garder que les plus pertinents
        const offerLower = jobOfferText.toLowerCase();
        const freqMap = new Map();
        cleaned.forEach(w=>{
          const lw = w.toLowerCase();
          // fréquence approximative (compter occurrences séparées)
          const re = new RegExp(`\\b${lw.replace(/[-/\\.*+?^${}()|[\]\\]/g,'\\$&')}\\b`, 'g');
          const matches = offerLower.match(re);
          freqMap.set(w, matches ? matches.length : 0);
        });
        const techBoostPatterns = /(python|sql|power bi|excel|api|kpi|scikit|random forest|xgboost|classification|régression|regression|dashboard|streamlit|feature|etl|cloud|docker|kubernetes|ml|ia|machine learning|segmentation|scoring|forecast|model|modèle)/i;
        const competenceSets = new Set([
          ...norm.suggestions.competences.outils.map(s=>s.toLowerCase()),
          ...norm.suggestions.competences.analyse.map(s=>s.toLowerCase()),
          ...norm.suggestions.competences.ia.map(s=>s.toLowerCase())
        ]);
        const scored = cleaned.map(w=>{
          const lw = w.toLowerCase();
            let score = 0;
            score += (freqMap.get(w)||0) * 3; // poids fréquence
            if (w.includes(' ')) score += 4; // expression multi-mots
            if (techBoostPatterns.test(w)) score += 6; // pattern technique
            if (/^[A-Z0-9]{2,}$/.test(w.replace(/[^A-Z0-9]/g,''))) score += 5; // acronyme
            if (competenceSets.has(lw)) score += 5; // apparaît dans suggestions compétences
            if (w.length > 14) score += 1; // termes longs (spécifiques)
            return { w, score };
        });
        scored.sort((a,b)=> b.score - a.score);
        const topKeywords = scored.slice(0,30).map(o=>o.w);
        const adapted = {
          motsCles: topKeywords,
          suggestions: {
            titre: norm.suggestions.titre,
            competences: norm.suggestions.competences,
            experiences: norm.suggestions.experiences
          }
        };
  setAnalysis(adapted);
    } catch (e) {
      setError('Erreur analyse: '+ e.message);
    } finally {
      setLoading(false);
    }
  };

  // Application générique des suggestions (compétences, titre, puces expériences)
  const appliquerAnalyse = (analyseObj) => {
    if (!analyseObj) return;
    setCvData(prev => {
      const next = { ...prev, competences: { ...prev.competences }, experiences: [...prev.experiences] };
      const comp = next.competences;
      const addUnique = (arr, items) => {
        if (!Array.isArray(items)) return;
        items.forEach(it=> { if (it && !arr.some(a=>a.toLowerCase()===it.toLowerCase())) arr.push(it); });
      };
      if (analyseObj.suggestions?.competences?.outils) addUnique(comp.outils, analyseObj.suggestions.competences.outils);
      if (analyseObj.suggestions?.competences?.analyse) addUnique(comp.analyse, analyseObj.suggestions.competences.analyse);
      if (analyseObj.suggestions?.competences?.ia) addUnique(comp.ia, analyseObj.suggestions.competences.ia);
      if (analyseObj.suggestions?.titre) next.titre = analyseObj.suggestions.titre;
      const puces = analyseObj.suggestions?.experiences?.puces || analyseObj.suggestions?.experiences?.bullets || [];
      if (puces.length) {
        const idx = 0; // TODO: améliorer la sélection de l'expérience
        if (next.experiences[idx]) {
          const existing = new Set(next.experiences[idx].details.map(d=>d.toLowerCase()));
          puces.forEach(p=>{ if (p && !existing.has(p.toLowerCase())) next.experiences[idx].details.push(p); });
        } else {
          next.experiences.push({ poste: 'Expérience pertinente', entreprise: '---', dates: '2025', details: puces });
        }
      }
      return next;
    });
  };

  const appliquerSuggestions = () => {
    if (!analysis) return;
    // Appliquer compétences + titre + puces sur expérience choisie
    setCvData(prev => {
  const next = { ...prev, competences: { ...prev.competences }, experiences: [...prev.experiences] };
      const comp = next.competences;
      const sugg = analysis.suggestions || {};
      // Nouveau comportement : on efface toutes les catégories existantes et on ne garde QUE l'API
      comp.outils = [];
      comp.baseDonnees = [];
      comp.analyse = [];
      comp.visualisation = [];
      comp.ia = [];
      comp.soft = [];
      if (sugg.competences) {
        if (Array.isArray(sugg.competences.outils)) comp.outils = [...sugg.competences.outils];
        if (Array.isArray(sugg.competences.analyse)) comp.analyse = [...sugg.competences.analyse];
        if (Array.isArray(sugg.competences.ia)) comp.ia = [...sugg.competences.ia];
      }
      if (sugg.titre) next.titre = sugg.titre;
      // Expériences
      const puces = sugg.experiences?.puces || [];
      if (puces.length) {
        const idx = Math.min(Math.max(0, experienceCible), next.experiences.length);
        if (next.experiences[idx]) {
          const details = [...next.experiences[idx].details];
          const existing = new Set(details.map(d=>d.toLowerCase()));
          puces.forEach(p=>{ if (p && !existing.has(p.toLowerCase())) details.push(p); });
          next.experiences[idx] = { ...next.experiences[idx], details };
        } else {
          next.experiences.push({ poste:'Expérience ajoutée', entreprise:'-', dates:new Date().getFullYear().toString(), details:[...puces] });
        }
      }
        // Répartition des mots clés dans les catégories existantes
        if (analysis.motsCles && analysis.motsCles.length) {
          const stop = new Set(['carrefour','groupe','f/h','fh','alternance','contexte','datalab','marchands','services','recherche','activement','essor','partenariat']);
          const addUnique = (arr, term) => {
            if (!term) return; const t = term.trim(); if (!t) return;
            if (!arr.some(x=>x.toLowerCase()===t.toLowerCase())) arr.push(t);
          };
          const categorize = (kw) => {
            const k = kw.toLowerCase();
            if (/python|sql|tableau|power bi|powerbi|excel|spark|d3|nosql|docker|kubernetes|cloud|cloudera|tensor|tensorflow|git/.test(k)) return 'outils';
            if (/jointure|jointures|index|requete|requêtes|requete|requêtes|modélisation relationnelle|nosql|sql/.test(k)) return 'baseDonnees';
            if (/segmentation|scoring|analyse|kpi|recommandation|clustering|prédictif|prédictive|predictive|modélisation prédictive|data science|data scientist/.test(k)) return 'analyse';
              if (/visualisation|dataviz|dashboard|data storytelling|tableau|power bi|d3|rapport|report/.test(k)) return 'visualisation';
            if (/machine learning|random forest|xgboost|deep learning|nlp|natural language processing|computer vision|tensor|tensorflow|clustering|classification|régression|regression|modélisation prédictive|segmentation/.test(k)) return 'ia';
            if (/communication|travail en équipe|équipe|team|collabor|proactivité|autonomie|leadership|vulgarisation|sens business/.test(k)) return 'soft';
            return null;
          };
          analysis.motsCles.forEach(kw => {
            if (!kw) return; const low = kw.toLowerCase(); if (stop.has(low)) return;
            const cat = categorize(kw);
            if (cat && comp[cat]) addUnique(comp[cat], kw);
          });
        }
      return next;
    });
  };

  // Observer la hauteur du CV et activer un mode compact si dépassement (cohérence tailles)
  useEffect(() => {
    const el = cvRef.current;
    if (!el) return;
    const threshold = 1180; // px (avant impression, correspond ~ à la hauteur printable)
    const check = () => {
      const h = el.scrollHeight;
      setCompact(h > threshold);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [cvData]);

  return (
    <div>
      <div style={{maxWidth:900, margin:'16px auto', padding:'12px 16px', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:8}}>
        <h3 style={{marginTop:0}}>Offre d'emploi</h3>
        <textarea
          placeholder="Collez ici le texte complet de l'offre (mission, profil, compétences...)"
          value={jobOfferText}
          onChange={e=>setJobOfferText(e.target.value)}
          rows={6}
          style={{width:'100%', padding:8, border:'1px solid #cbd5e1', borderRadius:4, fontFamily:'inherit', fontSize:14, resize:'vertical'}}
        />
  <div style={{display:'flex', gap:8, marginTop:8, flexWrap:'wrap', alignItems:'center'}}>
          <button type="button" onClick={analyserOffre} disabled={loading} style={{background:'#2563eb',color:'#fff',border:'none',padding:'8px 14px',borderRadius:4,cursor:'pointer'}}>{loading? 'Analyse...' : 'Analyser l\'offre'}</button>
          <button type="button" onClick={appliquerSuggestions} disabled={!analysis} style={{background: analysis? '#059669':'#94a3b8',color:'#fff',border:'none',padding:'8px 14px',borderRadius:4,cursor: analysis? 'pointer':'not-allowed'}}>Appliquer suggestions</button>
        </div>
        {error && <div style={{color:'#dc2626', marginTop:8, fontSize:13}}>{error}</div>}
  {analysis && (
          <div style={{marginTop:12, fontSize:13}}>
            <b>Mots clés extraits:</b> {analysis.motsCles.join(', ')}<br />
            {analysis.suggestions?.competences && (
              <div style={{marginTop:6}}>
                <b>Suggestions compétences:</b>
                <ul style={{margin:'4px 0 0 16px'}}>
                  {analysis.suggestions.competences.outils?.length>0 && <li>Outils: {analysis.suggestions.competences.outils.join(', ')}</li>}
                  {analysis.suggestions.competences.analyse?.length>0 && <li>Analyse: {analysis.suggestions.competences.analyse.join(', ')}</li>}
                  {analysis.suggestions.competences.ia?.length>0 && <li>IA/ML: {analysis.suggestions.competences.ia.join(', ')}</li>}
                </ul>
              </div>
            )}
            {analysis.suggestions?.titre && <div style={{marginTop:6}}><b>Nouveau titre proposé:</b> {analysis.suggestions.titre}</div>}
            {analysis.suggestions?.experiences?.puces?.length>0 && (
              <div style={{marginTop:10}}>
                <b>Puces expériences suggérées:</b>
                <div style={{marginTop:4, display:'flex', gap:8, alignItems:'center', flexWrap:'wrap'}}>
                  <label style={{fontSize:12, display:'flex', alignItems:'center', gap:4}}>Cibler expérience:
                    <select value={experienceCible} onChange={e=>setExperienceCible(parseInt(e.target.value,10))} style={{padding:'2px 4px', fontSize:12}}>
                      {cvData.experiences.map((exp,i)=><option key={i} value={i}>{i+1}. {exp.poste.slice(0,40)}</option>)}
                      <option value={cvData.experiences.length}>+ Nouvelle expérience</option>
                    </select>
                  </label>
                </div>
                <ul style={{margin:'6px 0 0 16px'}}>
                  {analysis.suggestions.experiences.puces.map((p,i)=><li key={i}>{p}</li>)}
                </ul>
                <div style={{fontSize:11, color:'#64748b', marginTop:4}}>Les puces seront fusionnées lors du clic sur "Appliquer suggestions" (sans doublons).</div>
              </div>
            )}
            <button type="button" onClick={()=>setShowDebug(s=>!s)} style={{marginTop:8, background:'#475569', color:'#fff', border:'none', padding:'4px 10px', borderRadius:4, cursor:'pointer', fontSize:12}}>{showDebug? 'Masquer debug' : 'Voir debug brut'}</button>
            {showDebug && (
              <pre style={{marginTop:8, maxHeight:200, overflow:'auto', background:'#0f172a', color:'#f1f5f9', padding:8, fontSize:11, borderRadius:4}}>{rawGroq}</pre>
            )}
          </div>
        )}
        {error && rawGroq && (
          <details style={{marginTop:8}}>
            <summary style={{cursor:'pointer', fontSize:12}}>Voir sortie brute</summary>
            <pre style={{maxHeight:180, overflow:'auto', background:'#1e293b', color:'#f1f5f9', padding:8, fontSize:11, borderRadius:4}}>{rawGroq.slice(0,4000)}</pre>
          </details>
        )}
  <div style={{marginTop:10, fontSize:11, color:'#64748b'}}>Analyse effectuée via l'API Groq distante. Assurez-vous de définir VITE_GROQ_API_KEY dans un fichier .env (ne pas commiter cette clé).</div>
      </div>
  <div className="controls" style={{display:'flex', gap:12, justifyContent:'center', marginTop:16, flexWrap:'wrap'}}>
        <button onClick={()=>handleDownloadPDF('image')} style={{background:'#219ebc',color:'#fff',border:'none',borderRadius:6,padding:'10px 22px',cursor:'pointer'}}>PDF (image rapide)</button>
        <button onClick={()=>handleDownloadPDF('print')} style={{background:'#0d9488',color:'#fff',border:'none',borderRadius:6,padding:'10px 22px',cursor:'pointer'}}>PDF (vector via impression)</button>
  <button onClick={()=>handleDownloadPDF('text')} style={{background:'#6366f1',color:'#fff',border:'none',borderRadius:6,padding:'10px 22px',cursor:'pointer'}}>PDF (texte structuré)</button>
      </div>
  <div className={`cv-container ${compact ? 'compact' : ''}`} ref={cvRef}>
      <aside className="cv-sidebar">
        <div className="sidebar-section">
          <div className="sidebar-contact">
            <div className="contact-item">
              <svg viewBox="0 0 24 24"><path d="M3 5c0-1.1.9-2 2-2h2.2c.9 0 1.7.6 1.9 1.5l.7 2.8c.2.8-.1 1.6-.7 2.1l-1.2.9c1.2 2.4 3.2 4.4 5.6 5.6l.9-1.2c.5-.6 1.3-.9 2.1-.7l2.8.7c.9.2 1.5 1 1.5 1.9V19c0 1.1-.9 2-2 2h-1C10.7 21 3 13.3 3 4v1z"/></svg>
              <a href={`tel:${cvData.contact.telephone.replace(/\s+/g,'')}`}>{cvData.contact.telephone}</a>
            </div>
            <div className="contact-item">
              <svg viewBox="0 0 24 24"><path d="M4 5h16c1.1 0 2 .9 2 2v.3l-10 6-10-6V7c0-1.1.9-2 2-2Zm16 5.1V17c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2v-6.9l9 5.4 9-5.4Z"/></svg>
              <a href={`mailto:${cvData.contact.email}`}>{cvData.contact.email}</a>
            </div>
            <div className="contact-item">
              <svg viewBox="0 0 24 24"><path d="M12 2c3.9 0 7 3 7 6.8 0 5.1-6.2 11-6.5 11.3-.3.3-.8.3-1.1 0C11.2 19.8 5 13.9 5 8.8 5 5 8.1 2 12 2Zm0 3a3.2 3.2 0 0 0-3.2 3.2A3.2 3.2 0 0 0 12 11.4a3.2 3.2 0 0 0 3.2-3.2A3.2 3.2 0 0 0 12 5Z"/></svg>
              <span>{cvData.contact.adresse}</span>
            </div>
            <div className="contact-item">
              <svg viewBox="0 0 24 24"><path d="M4 4h16v2H4V4Zm0 6h10v2H4v-2Zm0 6h16v2H4v-2Zm12-9 4-3v8l-4-3Z"/></svg>
              <a href={cvData.contact.portfolio} target="_blank" rel="noopener noreferrer">Portfolio</a>
            </div>
            <div className="contact-separator" />
          </div>
        </div>
        <div className="sidebar-section">
          <h4>Langues</h4>
          <ul>
            {cvData.langues.map((lang, idx) => (
              <li key={idx}>{lang.nom} : {lang.niveau}</li>
            ))}
          </ul>
        </div>
        <div className="sidebar-section">
          <h4>Compétences</h4>
          <b>Langages & outils</b>
          <ul>{cvData.competences.outils.map((c, idx) => <li key={idx}>{c}</li>)}</ul>
          <b>Base de données</b>
          <ul>{(cvData.competences.baseDonnees||[]).map((c, idx) => <li key={idx}>{c}</li>)}</ul>
          <b>Analyse de données</b>
          <ul>{(cvData.competences.analyse||[]).map((c, idx) => <li key={idx}>{c}</li>)}</ul>
          <b>Visualisation & storytelling</b>
          <ul>{(cvData.competences.visualisation||[]).map((c, idx) => <li key={idx}>{c}</li>)}</ul>
          <b>Machine Learning/IA</b>
          <ul>{(cvData.competences.ia||[]).map((c, idx) => <li key={idx}>{c}</li>)}</ul>
          <b>Soft skills</b>
          <ul>{cvData.competences.soft.map((c, idx) => <li key={idx}>{c}</li>)}</ul>
        </div>
        <div className="sidebar-section">
          <h4>Certifications</h4>
          <ul>
            {cvData.certifications.map((cert, idx) => (
              <li key={idx}>{cert}</li>
            ))}
          </ul>
        </div>
      </aside>
      <main className="cv-main">
        <h1>{cvData.nom}</h1>
        <h2>{cvData.titre}</h2>
  <p className="cv-profile">{cvData.profil}</p>
  {cvData.description && <p className="cv-description">{cvData.description}</p>}
        <section>
          <h3>Expérience professionnelle</h3>
          {cvData.experiences.map((exp, idx) => (
            <div key={idx} className="cv-experience">
              <b>{exp.poste}</b> <span>({exp.dates})</span><br />
              <span>{exp.entreprise}</span>
              <ul>
                {exp.details.map((d, i) => <li key={i}>{d}</li>)}
              </ul>
            </div>
          ))}
        </section>
        <section>
          <h3>Projets</h3>
          {cvData.projets.map((proj, idx) => (
            <div key={idx} className="cv-projet">
              <b>{proj.titre}</b> <span>({proj.dates})</span><br />
              <span>{proj.entreprise}</span>
              <ul>
                {proj.details.map((d, i) => <li key={i}>{d}</li>)}
              </ul>
            </div>
          ))}
        </section>
        <section>
          <h3>Diplômes et Formations</h3>
          {cvData.formations.map((form, idx) => (
            <div key={idx} className="cv-formation">
              <b>{form.diplome}</b> <span>({form.dates})</span><br />
              <span>{form.ecole}</span>
              <ul>
                {form.details.map((d, i) => <li key={i}>{d}</li>)}
              </ul>
            </div>
          ))}
        </section>
      </main>
      </div>
    </div>
  );
}

export default App;
