

import { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './App.css';

function App() {
  // Constante de remplissage sidebar compétences
  const BASE_COMP_COUNT = 33; // nombre cible pour pleine hauteur approx
  // Données du CV inspirées du design fourni (rendent éditables via setCvData)
  const [cvData, setCvData] = useState({
    nom: 'Yohann YENDI',
  titre: 'Alternant Data | Python · SQL · Power BI | Scoring & analyses actionnables',
    contact: {
      telephone: '06 45 86 35 33',
      email: 'yendiyohann@gmail.com',
      adresse: 'Paris (75000)',
      linkedin: 'https://www.linkedin.com/in/yohannkp',
      portfolio: 'https://www.datascienceportfol.io/yendiyohann',
      github: 'https://github.com/Yohannkp'
    },
    langues: [
      { nom: 'Français', niveau: 'Natif' },
      { nom: 'Anglais', niveau: 'Intermédiaire' }
    ],
    reseaux: [],
    competences: {
      outils: [
        'Python (Pandas, Matplotlib, Scikit-learn)',
        'SQL (PostgreSQL, MySQL)',
        'Power BI',
        'Power Query / Excel avancé',
        'Git'
      ],
      baseDonnees: ['Modélisation relationnelle', 'Jointures complexes', 'Optimisation requêtes', 'Indexation'],
      ia: ['Classification', 'Régression', 'Random Forest', 'XGBoost', 'Feature engineering'],
      dataEngineering: ['Pipelines SQL', 'Nettoyage de données', 'Automatisation scripts', 'Indexation'],
      ml: ['Classification', 'Régression', 'Random Forest', 'XGBoost', 'Feature engineering'],
      analyse: ['EDA', 'KPIs & métriques business', 'A/B Testing', 'Scoring', 'Modélisation prédictive', 'Segmentation clients', 'Analyse rétention'],
      visualisation: ['Dashboards Power BI', 'Data storytelling', 'Pyramid Principle', 'Automatisation de rapports'],
      business: ['Recueil des besoins', 'Gestion parties prenantes', 'Amélioration de processus', 'Priorisation orientée ROI', 'Analyse fonctionnelle'],
      soft: ['Sens business & analyse', 'Communication claire', 'Vulgarisation technique', 'Proactivité & autonomie', 'Travail en équipe']
    },
    certifications: [
      'Google Advanced Data Analytics',
      'IBM Data Analyst'
    ],
  profil: "Data Analyst orienté business (fidélisation, scoring client, aide à la décision). Transforme besoins métier en indicateurs actionnables (Python, SQL, Power BI) avec forte adaptabilité, rigueur organisationnelle et focus relation utilisateurs; recherche alternance à impact mesurable.",
    description: "",
    experiences: [
      {
        poste: 'Data Analyst – Analyse comportementale retail',
        entreprise: 'Quantum – Simulation pro Paris',
        dates: '2025',
        details: [
          'Analysé 300 000+ transactions (layouts magasin) → suivi panier moyen & taux conv. par zone',
          'Automatisé attribution magasins témoins + T-tests (cycle analyse -40 % vs manuel)',
          'Priorisé 4 segments (62 % du potentiel ROI) → projection +5–7 % conversion zones test',
          'Coordination 10+ interlocuteurs (magasin, marketing) pour aligner insights & plan d’actions clients'
        ]
      },
      {
        poste: 'Stage Développeur Fullstack',
        entreprise: 'TRUSTLINE Lyon',
        dates: 'Janvier 2024 à mars 2024',
        details: [
          "Développé app mobile Flutter (auth, QR code, notifications, cartes) + API REST",
          "Optimisé requêtes & UI (chargement écran principal ≈ -30 %)",
          "Structuré schémas JSON en modèles réutilisables",
          "Ateliers utilisateurs + partage métriques → priorisation backlog (tickets mineurs -20 %)"
        ]
      }
    ],
    projets: [
      {
        titre: 'Data Scientist – Modélisation du risque client',
        entreprise: 'Kaggle Paris',
        dates: '2025',
        details: [
          'Random Forest défaut paiement (AUC 0.88) pour prioriser revues risques',
          'Faux positifs -18 % à rappel constant (allègement revue manuelle)',
          'App Streamlit + API + dashboard Power BI (120+ vues/mois) → adoption finance'
        ]
      },
      {
        titre: 'Data Scientist – Analyse RH prédictive',
        entreprise: 'Salif Motors - Google - Certification Paris',
        dates: 'Octobre 2024 à mars 2025',
        details: [
          'Exploré données RH de 15 000 employés (analyse churn interne)',
          'Modèle prédiction départs (AUC 0.94) couvrant 150 K salariés (indicateur surcharge & suivi mensuel)',
          'Actions RH (promotions ciblées, coaching, outils) + dashboards (Power BI, Streamlit) pour décisions mensuelles'
        ]
      },
      {
        titre: 'Data Analyst – Optimisation des ventes et marges',
        entreprise: 'Kaggle Paris',
        dates: '2025',
        details: [
          'Analysé 500 000 lignes de vente (SQL) pour isoler produits à faible marge',
          'Recommandé ajustements prix & ciblage promo (+15 % marge nette) en priorisant 10 produits (65 % du CA)'
        ]
      }
    ],
    formations: [
      {
        diplome: 'Cycle ingénieur – ING3 - Data & IA',
        ecole: 'ECE Paris',
        dates: '2025 à 2027',
        details: [
          'Statistiques, probabilités, algèbre linéaire, Python, SQL, Power BI, Machine Learning, IA explicable, modélisation, déploiement'
        ]
      },
      {
        diplome: 'Développeur Fullstack et DevOps',
        ecole: 'IPSSI Paris',
        dates: '2023 à 2024',
        details: [
          'Conception applications web et mobiles (React, Flutter, Node.js, Symfony), intégration d’API REST, UX/UI, bases de données SQL/NoSQL'
        ]
      },
      {
        diplome: 'Licence Génie Logiciel',
        ecole: 'IPNET Togo',
        dates: '2020 à 2023',
        details: [
          'Conception et développement d’applications web et desktop, programmation (Java, Python, C++), bases de données (SQL), modélisation (UML/Merise), gestion de projet Agile'
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
  + `\n.cv-sidebar{flex:0 0 205px; padding:10px 14px 24px; font-size:0.9em; background:linear-gradient(180deg,#1f2428 0%,#262b30 55%,#2d3338 100%); position:relative; color:#fff;}`
  + `\n.cv-sidebar:after{content:'';position:absolute;inset:0;border:1px solid rgba(255,255,255,0.05);border-radius:8px;pointer-events:none;}`
  + `\n.cv-sidebar h4{font-size:0.78em; letter-spacing:.6px; font-weight:600; text-transform:uppercase; position:relative; margin:2px 0 6px;}`
  + `\n.cv-sidebar h4:after{content:'';position:absolute;left:0;bottom:-2px;width:30px;height:2px;background:linear-gradient(90deg,#ffd166,#ffb347);border-radius:2px;}`
  + `\n.cv-sidebar .sidebar-section{font-size:0.75em; line-height:1.14;}`
  + `\n.cv-sidebar .sidebar-section ul{list-style:none;padding-left:0;margin:0 0 6px;}`
  + `\n.cv-sidebar .sidebar-section ul li{margin:0 0 2px;position:relative;padding-left:12px;}`
  + `\n.cv-sidebar .sidebar-section ul li:before{content:'';position:absolute;left:0;top:0.55em;width:5px;height:5px;border-radius:50%;background:linear-gradient(#ffd166,#ffb347);}`
  + `\n.cv-main{flex:1; padding:12px 20px 30px 22px; font-size:0.92em; line-height:1.24;}` /* further reduced main text */
  + `\n.cv-sidebar .sidebar-contact{background:#1d2125;border:1px solid #2c3339;border-radius:8px;padding:10px 12px 12px;}`
  + `\n.cv-sidebar .contact-title{font-size:0.62em;letter-spacing:1px;font-weight:600;color:#ffd166;margin:0 0 6px;}`
  + `\n.cv-sidebar .contact-item{display:flex;align-items:center;gap:6px;color:#f1f5f9;font-size:0.78em;line-height:1.16;padding:4px 6px;border-radius:6px;}`
  + `\n.cv-sidebar .contact-item svg{width:12px;height:12px;stroke:#9cd6ec;stroke-width:1.4;fill:none;}`
  + `\n.cv-sidebar .contact-item a{color:#dbeffc;text-decoration:none;}`
  + `\n.cv-sidebar .contact-item a:hover{color:#ffd166;text-decoration:underline;}`
  + `\n.cv-sidebar .contact-item:hover svg{stroke:#ffd166;}`
  + `\n.cv-sidebar .contact-item:nth-child(2) a, .cv-sidebar .contact-item:nth-child(3) a, .cv-sidebar .contact-item:nth-child(4) a, .cv-sidebar .contact-item:nth-child(5) a{color:#ffd166;font-weight:600;}`
  + `\n.cv-sidebar .contact-item:nth-child(2) svg, .cv-sidebar .contact-item:nth-child(3) svg, .cv-sidebar .contact-item:nth-child(4) svg, .cv-sidebar .contact-item:nth-child(5) svg{stroke:#ffd166;}`
  + `\n.cv-sidebar .contact-item span{color:#cbd5e1;}`
  + `\n.cv-sidebar .contact-separator{height:1px;background:linear-gradient(90deg,rgba(255,255,255,0.18),rgba(255,255,255,0));margin:4px 0 6px;}`
        + `\n.cv-sidebar, .cv-main{line-height:var(--lh);}`
  + `\n.cv-main h1{margin:0 0 2px; font-size:calc(var(--h1)*0.94);}`
  + `\n.cv-main h2{margin:0 0 8px; font-size:calc(var(--h2)*0.94);}`
        + `\n.cv-main section{margin-bottom:var(--secGap);}`
        + `\n.cv-experience, .cv-projet, .cv-formation{margin-bottom:var(--blockGap);}`
        + `\nul{margin-top:4px!important;}`
        + `\nul li{margin:0 0 4px;}`
  + `\n.cv-main .cv-experience ul li, .cv-main .cv-projet ul li, .cv-main .cv-formation ul li{font-size:0.88em; line-height:1.20;}`
  + `\n.cv-main .cv-formation ul li{font-size:0.82em; line-height:1.15;}`
        + `\n.cv-profile{margin-bottom:13px;}`
        + `\n.cv-description{margin-bottom:var(--pGap);}`
        + `\n.cv-main, .cv-main p, .cv-main li{hyphens:none; word-break:normal; overflow-wrap:anywhere;}`
  + `\na{color:#219ebc!important;text-decoration:none!important;}`
  + `\n.cv-sidebar a{color:#dbeffc!important;text-decoration:none!important;}`
  + `\n.cv-sidebar .contact-item:nth-child(2) a, .cv-sidebar .contact-item:nth-child(3) a, .cv-sidebar .contact-item:nth-child(4) a, .cv-sidebar .contact-item:nth-child(5) a{color:#ffd166!important;font-weight:600!important;}`;
  const adaptScript = `<script>(function(){var c=document.querySelector('.cv-container');if(!c){return;}var target=1122*0.97;var h=c.scrollHeight;var docEl=document.documentElement;var fs=parseFloat(getComputedStyle(docEl).fontSize)||14.2;var secGap=34,blockGap=17,pGap=28,lh=1.30;function apply(){docEl.style.setProperty('--fs',fs+'px');docEl.style.setProperty('--secGap',secGap+'px');docEl.style.setProperty('--blockGap',blockGap+'px');docEl.style.setProperty('--pGap',pGap+'px');docEl.style.setProperty('--lh',lh);}apply();var i=0;while(h>target && i<80){if(secGap>26)secGap-=1;else if(blockGap>12)blockGap-=1;else if(pGap>20)pGap-=1;else if(fs>12.2)fs-=0.2;else if(lh>1.22)lh-=0.01;else break;apply();h=c.scrollHeight;i++;}
// Compression texte formations + raccourcissements agressifs
function compressFormations(){document.querySelectorAll('.cv-formation ul li').forEach(function(li){var t=li.textContent.trim();
  t=t.replace(/Statistiques, probabilités, algèbre linéaire, Python, SQL, Power BI, Machine Learning, IA explicable, modélisation, déploiement/i,'Stats, proba, alg. lin., Python, SQL, Power BI, ML, XAI, modélisation, déploiement');
  t=t.replace(/Conception applications web et mobiles \(React, Flutter, Node\.js, Symfony\), intégration d’API REST, UX\/UI, bases de données SQL\/NoSQL/i,'Apps web & mobiles (React, Flutter, Node.js, Symfony); APIs REST; UX/UI; SQL & NoSQL');
  t=t.replace(/Conception et développement d’applications web et desktop, programmation \(Java, Python, C\+\+\), bases de données \(SQL\), modélisation \(UML\/Merise\), gestion de projet Agile/i,'Apps web & desktop; Java, Python, C++; SQL; UML/Merise; Agile');
  // Si toujours long, couper par segments
  if(t.length>120){var parts=t.split(/;|,/).map(p=>p.trim()).filter(Boolean);while(parts.join('; ').length>110 && parts.length>4){parts.pop();}t=parts.join('; ');}li.textContent=t;});}
function trimNewBullets(){var removed=false;var newBullets=[].slice.call(document.querySelectorAll('li.new-bullet'));if(newBullets.length){var last=newBullets[newBullets.length-1];last.parentNode.removeChild(last);removed=true;}return removed;}
function scaleMain(){var m=document.querySelector('.cv-main');if(!m)return;var base=parseFloat(getComputedStyle(m).fontSize);var current=base;var min=base*0.88;while(c.scrollHeight>target && current>min){current-=0.35;m.style.fontSize=current+'px';m.style.lineHeight='1.21';}}
function enforce(){var safety=0;while(c.scrollHeight>target && safety<85){if(trimNewBullets()){safety++;continue;}compressFormations();if(c.scrollHeight<=target)break;scaleMain();if(c.scrollHeight<=target)break;if(fs>11.4){fs-=0.12;apply();safety++;continue;}if(lh>1.15){lh-=0.004;apply();safety++;continue;}break;}}
enforce();setTimeout(function(){window.print();},80);})();<\/script>`;
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
  const [sidebarScale, setSidebarScale] = useState(1); // facteur d'expansion sidebar quand moins d'items
  const sidebarRef = useRef(null);
  // Ref pour les puces nouvellement ajoutées par suggestions (pour suppression prioritaire si overflow)
  const newBulletsRef = useRef(new Set());
  // Référence du bloc principal pour ajustements fins
  const mainRef = useRef(null);
  // Étapes de réduction graduelle de la taille du texte principal
  const MAIN_SCALE_STEPS = [1, 0.97, 0.94, 0.92];
  const [mainScaleIndex, setMainScaleIndex] = useState(0);
  const ensuringFitRef = useRef(false);
  const compressionDoneRef = useRef(false);
  const fitGlobalAttemptsRef = useRef(0); // sécurité anti-boucle
  const lastHeightRef = useRef(null);
  // Stocker les compétences d'origine pour réinjection si suggestions trop courtes
  const originalCompetencesRef = useRef(null);
  if (!originalCompetencesRef.current) {
    originalCompetencesRef.current = JSON.parse(JSON.stringify(cvData.competences));
  }
  const originalExperiencesRef = useRef(null);
  if (!originalExperiencesRef.current) {
    originalExperiencesRef.current = JSON.parse(JSON.stringify(cvData.experiences));
  }

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
  const prompt = `Retourne STRICTEMENT un JSON suivant (aucun texte avant/après) :\n\n{\n  \"mots_cles\": [\"string\"],\n  \"suggestions\": {\n    \"titre_cv\": \"string (optionnel)\",\n    \"profil_cv\": \"string (optionnel)\",\n    \"type_contrat\": \"string (optionnel)\",\n    \"competences\": {\n      \"ajouter\": {\n        \"outils\": [\"string\"],\n        \"analyse\": [\"string\"],\n        \"ia\": [\"string\"],\n        \"soft_skills\": [\"string\"]\n      }\n    },\n    \"experiences\": {\n      \"puces\": [\"string\"]\n    }\n  }\n}\n\nConsignes mots_cles :\n- EXTRAIRE le plus de mots/expressions pertinents (outils, technos, méthodes, KPIs, domaines, rôles, frameworks, verbes action).\n- PAS de doublons (accents/casse ignorés).\n\nConsignes type_contrat :\n- Déduire depuis l'offre (mots: alternance|apprentissage|stage|intern|cdi|cdd|freelance|contrat de professionnalisation).\n- Si plusieurs, prioriser alternance > stage > apprentissage > cdi > cdd > freelance.\n- Si rien: none.\n\nFormat titre_cv :\n- Longueur cible 55-95 caractères (min 30, max 110).\n- Structure: Segment1 | Segment2 | Segment3\n  * Segment1 = Rôle principal (+ type si alternance/stage) ex: \"Alternant Data Analyst\" ou \"Data Analyst\"\n  * Segment2 = 2-3 technos/outils clés (ex: Python · SQL · Power BI) séparés par ' · ' (point médian)\n  * Segment3 = axe valeur/action (ex: Scoring & Analyses Actionnables / Optimisation Décisions / Insights Business)\n- Interdits: phrases longues, verbes conjugués multiples, ponctuation finale (. , ! ?), hashtags, URL, emojis, répétitions exactes\n- Max 3 pipes '|' et exactement 2 si trois segments; pas d'espaces doubles; pas de segments vides\n\nConsignes profil_cv :\n- 1-2 phrases, 220 caractères max.\n- Commencer par rôle + type si applicable.\n- Inclure 2-4 mots clés différenciants + 1 impact chiffré + 1 soft skill.\n\nSoft skills (soft_skills) :\n- Jusqu'à 5 soft skills spécifiques (forme courte 2-3 mots).\n- Éviter doublons/variantes proches.\n\nContraintes générales :\n- Aucun autre champ.\n- Tableaux vides = [] si rien.\n- Pas d'explication supplémentaire.\n\nOFFRE:\n\"\"\"${jobOfferText}\"\"\"\n\nCV CONTEXTE :\nNom: ${cvData.nom}\nTitre actuel: ${cvData.titre}\nOutils présents: ${cvData.competences.outils.slice(0,20).join(', ')}\nAnalyse présents: ${cvData.competences.analyse.slice(0,20).join(', ')}\nIA présents: ${cvData.competences.ia.slice(0,20).join(', ')}\nProfil actuel: ${cvData.profil}\n`;
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
            profil: undefined,
            competences: { outils: [], analyse: [], ia: [], soft: [] },
            experiences: { puces: [] }
          }
        };
        const sugg = parsed.suggestions || {};
  norm.suggestions.titre = sugg.titre_cv || sugg.titre || undefined;
  norm.suggestions.profil = sugg.profil_cv || sugg.profil || undefined;
  norm.suggestions.typeContrat = sugg.type_contrat || sugg.typeContrat || undefined;
        const compAdd = (sugg.competences && (sugg.competences.ajouter || sugg.competences)) || {};
        norm.suggestions.competences.outils = normalizeArray(compAdd.outils,12);
        norm.suggestions.competences.analyse = normalizeArray(compAdd.analyse,12);
        norm.suggestions.competences.ia = normalizeArray(compAdd.ia,12);
  norm.suggestions.competences.soft = normalizeArray(compAdd.soft_skills || compAdd.soft || compAdd.softSkills,5);
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
  // Adresse: on ne modifie plus l'adresse d'origine (Paris (75000))
  const extractedAddress = null;
        const adapted = {
          motsCles: topKeywords,
          suggestions: {
            titre: norm.suggestions.titre,
            profil: norm.suggestions.profil,
            typeContrat: norm.suggestions.typeContrat,
            competences: norm.suggestions.competences,
            experiences: norm.suggestions.experiences
          }
        };
  setAnalysis(adapted);
  // Pas de mise à jour d'adresse
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
        if (Array.isArray(sugg.competences.soft)) comp.soft = [...sugg.competences.soft.slice(0,5)];
        if ((!comp.soft || comp.soft.length===0) && originalCompetencesRef.current?.soft) {
          comp.soft = [...originalCompetencesRef.current.soft.slice(0,5)];
        }
      }
      if (sugg.titre) {
        const originalTitre = prev.titre;
        const clean = (t) => t.replace(/\s+/g,' ').trim();
        const candidate = clean(sugg.titre);
        const okLength = candidate.length >= 30 && candidate.length <= 110;
        const pipeCount = (candidate.match(/\|/g)||[]).length;
        const has3Segments = pipeCount === 2;
        const segments = candidate.split('|').map(s=>s.trim()).filter(Boolean);
        const noWeirdChars = !/[#@<>]/.test(candidate);
        const noUrl = !/https?:\/\//i.test(candidate);
        const noEmoji = !/[\p{Extended_Pictographic}]/u.test(candidate);
        const noFinalPunct = !/[\.!?]$/.test(candidate);
        const uniqueSegments = new Set(segments.map(s=>s.toLowerCase())).size === segments.length;
        const midDotsOk = !/(\.|,){2,}/.test(candidate);
        const techSegmentLikely = /python|sql|power bi|tableau|excel|spark|cloud|ml|ia|machine learning/i.test(candidate);
        const roleSegmentLikely = /data|analyst|science|scientist|engineer|alternant|stage/i.test(segments[0]||'');
        const valueSegmentLikely = /(scoring|analyse|insight|optimisation|decisions|prédictif|predictif|impact|valeur)/i.test(candidate);
        const coherent = okLength && has3Segments && segments.length===3 && uniqueSegments && noWeirdChars && noUrl && noEmoji && noFinalPunct && midDotsOk && techSegmentLikely && roleSegmentLikely && valueSegmentLikely;
        if (coherent) {
          next.titre = candidate;
        } else {
          // Fallback: reconstruire à partir de segments plausibles
          const role = (segments[0] && roleSegmentLikely)? segments[0] : 'Alternant Data Analyst';
            // Extraire jusqu'à 3 technos de la suggestion ou reprendre celles de l'original
          const techPool = candidate.match(/(Python|SQL|Power BI|Tableau|Excel|Spark|Cloud|AWS|Azure|GCP|TensorFlow|Docker)/gi) || originalTitre.match(/(Python|SQL|Power BI|Tableau|Excel)/gi) || [];
          const uniqTech = Array.from(new Set(techPool.map(t=>t.replace(/\s+/g,' ')))).slice(0,3);
          while (uniqTech.length < 3 && /Power BI/.test(originalTitre) && !uniqTech.includes('Power BI')) uniqTech.push('Power BI');
          const techSeg = uniqTech.join(' · ') || 'Python · SQL · Power BI';
          const valuePool = candidate.match(/(Scoring|Analyse|Analyses? ?Actionnables|Optimisation|Décisions|Insights? ?Business|Modélisation Prédictive|Forecast)/gi) || [];
          let valueSeg = valuePool[0] || 'Scoring & Analyses Actionnables';
          valueSeg = valueSeg.replace(/ +/g,' ').trim();
          const rebuilt = `${role} | ${techSeg} | ${valueSeg}`.replace(/\s+/g,' ').trim();
          next.titre = rebuilt;
        }
      }
      if (sugg.profil) {
        let p = sugg.profil;
        if (sugg.typeContrat && sugg.typeContrat !== 'none') {
          const low = p.toLowerCase();
            const map = {
              alternance: "alternance",
              stage: "stage",
              apprentissage: "alternance",
              freelance: "freelance",
              cdi: "CDI",
              cdd: "CDD"
            };
          const label = map[sugg.typeContrat] || sugg.typeContrat;
          if (!low.includes(label.toLowerCase())) {
            p += (p.endsWith('.')? '':'') + (p.endsWith('.')? ' ':' – ') + 'ouvert à ' + (label.startsWith('a')? "l'":"") + label;
          }
        }
        next.profil = p;
      }
      // Expériences
      const puces = sugg.experiences?.puces || [];
      if (puces.length) {
        const idx = Math.min(Math.max(0, experienceCible), next.experiences.length);
        if (next.experiences[idx]) {
          const details = [...next.experiences[idx].details];
          const existing = new Set(details.map(d=>d.toLowerCase()));
          puces.forEach(p=>{ if (p && !existing.has(p.toLowerCase())) { details.push(p); newBulletsRef.current.add(p); } });
          next.experiences[idx] = { ...next.experiences[idx], details };
        } else {
          next.experiences.push({ poste:'Expérience ajoutée', entreprise:'-', dates:new Date().getFullYear().toString(), details:[...puces] });
          puces.forEach(p=> newBulletsRef.current.add(p));
        }
        // Limitation et synthèse des nouvelles puces
        const targetIdx = Math.min(experienceCible, next.experiences.length-1);
        const exp = next.experiences[targetIdx];
        if (exp) {
          const baseline = originalExperiencesRef.current?.[targetIdx]?.details?.length || 0;
          const newAdded = exp.details.slice(baseline).filter(d => newBulletsRef.current.has(d));
          const MAX_NEW = 3;
            if (newAdded.length > MAX_NEW) {
              const keep = newAdded.slice(0, MAX_NEW);
              const removed = newAdded.slice(MAX_NEW);
              const metrics = [], themes = [];
              removed.forEach(txt => {
                const m = txt.match(/([+\-]?\d+\s?%|\b\d+K\b|AUC\s?0?\.\d+|\b\d+\+?\b)/gi); if (m) metrics.push(...m.slice(0,2));
                const th = txt.match(/(fidélité|rétention|croissance|ventes|reporting|précision|équipe|présentation)/gi); if (th) themes.push(...th.slice(0,2));
              });
              const uniq = a => Array.from(new Set(a));
              const synth = `Synthèse impacts: ${uniq(metrics).slice(0,3).join(', ') || removed.length + ' items'}${themes.length? ' – ' + uniq(themes).slice(0,3).join(', ') : ''}`;
              exp.details = [
                ...exp.details.slice(0, baseline),
                ...keep,
                synth
              ];
              removed.forEach(r => newBulletsRef.current.delete(r));
            }
          // HARD CAP total (exp 0) : maximum 6 lignes après suggestions
          const MAX_TOTAL_EXP0 = 4; // Limite stricte demandée: max 4 lignes (puces + éventuelle synthèse)
          if (targetIdx === 0 && exp.details.length > MAX_TOTAL_EXP0) {
            const originalBase = originalExperiencesRef.current?.[0]?.details || [];
            const baseKeep = originalBase.slice(0, Math.min(originalBase.length, MAX_TOTAL_EXP0 - 2)); // garder base mais laisser place à nouvelles & synthèse
            // Identifier nouvelles restantes après baseKeep
            const remaining = exp.details.filter(d => !baseKeep.includes(d));
            const newRemaining = remaining.filter(d => newBulletsRef.current.has(d));
            const keepNew = newRemaining.slice(0, Math.max(0, MAX_TOTAL_EXP0 - baseKeep.length - 1));
            const overflow = exp.details.filter(d => !baseKeep.includes(d) && !keepNew.includes(d));
            if (overflow.length) {
              const metrics2 = [], themes2 = [];
              overflow.forEach(txt => {
                const m = txt.match(/([+\-]?\d+\s?%|\b\d+K\b|AUC\s?0?\.\d+|\b\d+\+?\b)/gi); if (m) metrics2.push(...m.slice(0,2));
                const th = txt.match(/(fidélité|rétention|croissance|ventes|reporting|précision|équipe|présentation)/gi); if (th) themes2.push(...th.slice(0,2));
              });
              const uniq2 = a => Array.from(new Set(a));
              const synth2 = `Synthèse impacts: ${uniq2(metrics2).slice(0,3).join(', ') || overflow.length + ' items'}${themes2.length? ' – ' + uniq2(themes2).slice(0,3).join(', ') : ''}`;
              exp.details = [
                ...baseKeep,
                ...keepNew,
                synth2
              ].slice(0, MAX_TOTAL_EXP0);
              overflow.forEach(r => newBulletsRef.current.delete(r));
            } else {
              // Simple tronquage si pas d'overflow détecté
              exp.details = exp.details.slice(0, MAX_TOTAL_EXP0);
            }
          }
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
        // Fallback si trop peu de compétences: réinjecter anciennes jusqu'à 75% de la cible
        const countAfter = ['outils','baseDonnees','analyse','visualisation','ia','soft']
          .reduce((acc,k)=> acc + ((comp[k]||[]).length), 0);
        if (countAfter < BASE_COMP_COUNT / 2) {
          const target = Math.ceil(BASE_COMP_COUNT * 0.75);
          const orig = originalCompetencesRef.current || {};
          const order = ['outils','baseDonnees','analyse','visualisation','ia','soft'];
          const addBack = (cat) => {
            const existingLower = new Set((comp[cat]||[]).map(x=>x.toLowerCase()));
            (orig[cat]||[]).forEach(item => {
              if (comp[cat].length >= 50) return; // safety
              if (existingLower.has(item.toLowerCase())) return;
              if (['soft'].includes(cat) && comp[cat].length > 8) return; // limiter soft
              if (totalCount() >= target) return;
              comp[cat].push(item);
              existingLower.add(item.toLowerCase());
            });
          };
          const totalCount = () => order.reduce((a,k)=>a+(comp[k]||[]).length,0);
          for (const cat of order) {
            if (totalCount() >= target) break;
            addBack(cat);
          }
        }
      return next;
    });
    // Réinitialiser l'échelle avant tentative d'ajustement
    setMainScaleIndex(0);
    // Lancer ajustement de fit après rendu
    setTimeout(() => { ensureMainFits(); }, 40);
  };

  // Fonction pour garantir que le bloc principal ne dépasse pas la hauteur cible
  const ensureMainFits = () => {
    if (ensuringFitRef.current) return;
    ensuringFitRef.current = true;
    const container = cvRef.current;
    if (!container) { ensuringFitRef.current = false; return; }
    const MAX_HEIGHT = 1120; // px approx hauteur imprimable (avant script print)
    const attemptRef = { count: 0 };
    const startHeight = container.scrollHeight;
    const step = () => {
      if (!container) { ensuringFitRef.current = false; return; }
      const over = container.scrollHeight > MAX_HEIGHT;
      if (!over) { ensuringFitRef.current = false; lastHeightRef.current = container.scrollHeight; return; }
      // garde-fou global
      if (fitGlobalAttemptsRef.current > 120) { ensuringFitRef.current = false; return; }
      fitGlobalAttemptsRef.current++;
      const beforeHeight = container.scrollHeight;
      // 1. Réduire échelle principale si possible
      if (mainScaleIndex < MAIN_SCALE_STEPS.length - 1) {
        setMainScaleIndex(i => i + 1);
        attemptRef.count++; if (attemptRef.count > 25) { ensuringFitRef.current = false; return; }
        setTimeout(step, 30);
        return;
      }
      // 1b. Compression textuelle (une seule fois) avant suppression de puces
      if (!compressionDoneRef.current) {
        compressionDoneRef.current = true;
        setCvData(prev => {
          const next = { ...prev, formations: prev.formations.map(f => ({ ...f, details: [...f.details] })) };
          // Règles de compression sur la dernière formation (souvent la plus longue)
          const shorten = (txt) => {
            let t = txt;
            t = t.replace(/Conception et développement d’applications web et desktop, programmation \(Java, Python, C\+\+\), bases de données \(SQL\), modélisation \(UML\/Merise\), gestion de projet Agile/i,
              'Apps web & desktop; Java, Python, C++; SQL; UML/Merise; Gestion Agile');
            t = t.replace(/Conception applications web et mobiles \(React, Flutter, Node\.js, Symfony\), intégration d’API REST, UX\/UI, bases de données SQL\/NoSQL/i,
              'Apps web & mobiles (React, Flutter, Node.js, Symfony); APIs REST; UX/UI; SQL & NoSQL');
            t = t.replace(/Statistiques, probabilités, algèbre linéaire, Python, SQL, Power BI, Machine Learning, IA explicable, modélisation, déploiement/i,
              'Stats, proba, algèbre linéaire; Python, SQL, Power BI; ML & XAI; Modélisation & déploiement');
            // Retirer espaces multiples
            t = t.replace(/\s{2,}/g,' ');
            return t;
          };
          next.formations.forEach(f => {
            f.details = f.details.map(d => d.length > 160 ? shorten(d) : d);
          });
          return next;
        });
        attemptRef.count++; if (attemptRef.count > 35) { ensuringFitRef.current = false; return; }
        setTimeout(step, 50);
        return;
      }
      // 2. Supprimer en dernier recours des puces ajoutées récentes
      if (newBulletsRef.current.size) {
        setCvData(prev => {
          const next = { ...prev, experiences: prev.experiences.map(e => ({ ...e, details: [...e.details] })) };
          // Stratégie : retirer une puce la plus récente (par ordre d'apparition) appartenant au set
          outer: for (let ei = 0; ei < next.experiences.length; ei++) {
            const det = next.experiences[ei].details;
            for (let di = det.length - 1; di >= 0; di--) {
              const bullet = det[di];
              if (newBulletsRef.current.has(bullet)) {
                det.splice(di,1);
                newBulletsRef.current.delete(bullet);
                break outer;
              }
            }
          }
          return next;
        });
        attemptRef.count++; if (attemptRef.count > 40) { ensuringFitRef.current = false; return; }
        setTimeout(step, 50);
        return;
      }
      // 3. Vérifier si hauteur a changé; sinon stopper pour éviter boucle
      const afterHeight = container.scrollHeight;
      if (afterHeight === beforeHeight || afterHeight === lastHeightRef.current) {
        ensuringFitRef.current = false;
        lastHeightRef.current = afterHeight;
        return;
      }
      // si la progression est minime (<3px) répéter encore une fois sinon stop
      if (Math.abs(afterHeight - beforeHeight) < 3) {
        ensuringFitRef.current = false;
        lastHeightRef.current = afterHeight;
        return;
      }
      // 4. Si encore over mais aucune action possible, abandon
      ensuringFitRef.current = false;
      lastHeightRef.current = afterHeight;
    };
    step();
  };

  // Observer la hauteur du CV et activer un mode compact si dépassement (cohérence tailles)
  useEffect(() => {
    const el = cvRef.current;
    if (!el) return;
    const ENTER_THRESHOLD = 1180; // activer au-delà
    const EXIT_THRESHOLD = 1140;  // désactiver seulement si on redescend suffisamment
    const check = () => {
      const h = el.scrollHeight;
      setCompact(prev => {
        if (prev) {
          // déjà compact: ne sortir que si bien en dessous du seuil bas
            if (h < EXIT_THRESHOLD) return false;
            return true; // rester compact
        } else {
          // pas compact: entrer seulement si franchement au-dessus
          if (h > ENTER_THRESHOLD) return true;
          return false;
        }
      });
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [cvData]);

  // Équilibrage visuel de la sidebar : si moins d'items que la base de référence, on dilate les espaces
  useEffect(() => {
  const base = BASE_COMP_COUNT; // nombre de lignes de compétences (items) optimal
    const comp = cvData.competences;
    const count = (comp.outils?.length||0) + (comp.baseDonnees?.length||0) + (comp.analyse?.length||0) + (comp.visualisation?.length||0) + (comp.ia?.length||0) + (comp.soft?.length||0) + (cvData.certifications?.length||0);
    let scale = 1;
    if (count < base) {
      scale = Math.min(1.4, base / Math.max(1, count));
    }
    setSidebarScale(scale);
  }, [cvData.competences, cvData.certifications]);

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
            {analysis.suggestions?.profil && <div style={{marginTop:6}}><b>Profil suggéré:</b> {analysis.suggestions.profil}</div>}
            {analysis.suggestions?.typeContrat && analysis.suggestions.typeContrat !== 'none' && (
              <div style={{marginTop:4, fontSize:12}}><b>Type contrat détecté:</b> {analysis.suggestions.typeContrat}</div>
            )}
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
      <aside
        className={`cv-sidebar ${sidebarScale>1.01 ? 'auto-balance' : ''}`}
        ref={sidebarRef}
        style={sidebarScale>1.01 ? {
          '--sb-gap': `${(10*sidebarScale).toFixed(1)}px`,
          '--sb-li-gap': `${Math.min(6, 2*sidebarScale).toFixed(1)}px`,
          '--sb-pad-y': `${(26*sidebarScale).toFixed(0)}px`
        }: undefined}
      >
        <div className="sidebar-section">
          <div className="sidebar-contact">
            <div className="contact-title">CONTACT</div>
            <div className="contact-item">
              <svg viewBox="0 0 24 24"><path d="M3 5c0-1.1.9-2 2-2h2.2c.9 0 1.7.6 1.9 1.5l.7 2.8c.2.8-.1 1.6-.7 2.1l-1.2.9c1.2 2.4 3.2 4.4 5.6 5.6l.9-1.2c.5-.6 1.3-.9 2.1-.7l2.8.7c.9.2 1.5 1 1.5 1.9V19c0 1.1-.9 2-2 2h-1C10.7 21 3 13.3 3 4v1z"/></svg>
              <a href={`tel:${cvData.contact.telephone.replace(/\s+/g,'')}`}>{cvData.contact.telephone}</a>
            </div>
            <div className="contact-item">
              <svg viewBox="0 0 24 24"><path d="M4 5h16c1.1 0 2 .9 2 2v.3l-10 6-10-6V7c0-1.1.9-2 2-2Zm16 5.1V17c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2v-6.9l9 5.4 9-5.4Z"/></svg>
              <a href={`mailto:${cvData.contact.email}`}>{cvData.contact.email}</a>
            </div>
            <div className="contact-item">
              <svg viewBox="0 0 24 24"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.5 8h4V23h-4V8Zm7.5 0h3.8v2.04h.05c.53-.95 1.83-1.96 3.76-1.96 4.02 0 4.77 2.64 4.77 6.07V23h-4v-7.7c0-1.84-.03-4.2-2.56-4.2-2.56 0-2.95 2-2.95 4.06V23h-3.87V8Z"/></svg>
              <a href={cvData.contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>
            <div className="contact-item">
              <svg viewBox="0 0 24 24"><path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.1 3.29 9.43 7.86 10.96.58.11.79-.25.79-.56 0-.28-.01-1.03-.02-2.02-3.2.7-3.88-1.54-3.88-1.54-.53-1.36-1.3-1.72-1.3-1.72-1.06-.73.08-.72.08-.72 1.18.08 1.8 1.22 1.8 1.22 1.04 1.79 2.72 1.27 3.38.97.11-.76.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.2-3.09-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9-.39c.99.01 1.99.13 2.92.39 2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.77.12 3.06.75.8 1.19 1.83 1.19 3.09 0 4.43-2.69 5.4-5.25 5.69.42.37.79 1.09.79 2.2 0 1.59-.02 2.87-.02 3.26 0 .31.21.68.8.56A10.53 10.53 0 0 0 23.5 12C23.5 5.74 18.27.5 12 .5Z"/></svg>
              <a href={cvData.contact.github} target="_blank" rel="noopener noreferrer">GitHub</a>
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
        {(() => {
          const comp = cvData.competences;
          const catDefs = [
            { key:'outils', label:'Langages & outils' },
            { key:'baseDonnees', label:'Base de données' },
            { key:'analyse', label:'Analyse de données' },
            { key:'visualisation', label:'Visualisation & storytelling' },
            { key:'ia', label:'Machine Learning/IA' },
            { key:'soft', label:'Soft skills' }
          ];
          const hasAny = catDefs.some(d => (comp[d.key]||[]).length>0);
          if (!hasAny) return null;
          return (
            <div className="sidebar-section">
              <h4>Compétences</h4>
              {catDefs.map(d => {
                const arr = comp[d.key]||[];
                if (!arr.length) return null;
                return (
                  <div key={d.key} style={{marginBottom:6}}>
                    <b>{d.label}</b>
                    <ul style={{marginTop:2}}>{arr.map((c,i)=><li key={i}>{c}</li>)}</ul>
                  </div>
                );
              })}
            </div>
          );
        })()}
        <div className="sidebar-section">
          <h4>Certifications</h4>
          <ul>
            {cvData.certifications.map((cert, idx) => (
              <li key={idx}>{cert}</li>
            ))}
          </ul>
        </div>
      </aside>
  <main className="cv-main" ref={mainRef} style={{ fontSize: `${MAIN_SCALE_STEPS[mainScaleIndex]}em` }}>
  <h1>{cvData.nom}<span className="welcome-note">HEC Paris – Certificat Data Strategy (2024) </span></h1>
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
                {exp.details.map((d, i) => <li key={i} className={newBulletsRef.current.has(d) ? 'new-bullet' : undefined}>{d}</li>)}
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
                {proj.details.map((d, i) => <li key={i} className={newBulletsRef.current.has(d) ? 'new-bullet' : undefined}>{d}</li>)}
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
