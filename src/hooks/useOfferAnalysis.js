// Nouvelle fonction : sélection des meilleurs projets par l’IA
export async function selectBestProjectsWithAI(projects, jobOfferText, apiKey) {
  // Debug : afficher en console les données envoyées à l’IA
  console.log('[IA][Sélection projets] Projets envoyés :', projects);
  console.log('[IA][Sélection projets] Offre envoyée :', jobOfferText);
  const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
  // Même modèle et structure que l’analyse d’offre
  const prompt = `Voici une liste de projets de portfolio (format JSON) :\n${JSON.stringify(projects, null, 2)}\n\nEt voici une offre d'emploi :\n"""\n${jobOfferText}\n"""\n\nSélectionne simplement les 3 ou 4 projets qui correspondent le plus à cette offre.\n\nRetourne UNIQUEMENT un JSON strict :\n{\n  "projets": [\n    { "titre": "...", "details": ["...", "..."] },\n    ...\n  ]\n}\nPas de texte hors JSON.`;
  const body = {
    model: 'llama-3.3-70b-versatile', // identique à l’analyse d’offre
    temperature: 0.2,
    max_tokens: 1400,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: 'Assistant sélection projets CV. Réponds UNIQUEMENT JSON.' },
      { role: 'user', content: prompt }
    ]
  };
  const resp = await fetch(GROQ_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify(body)
  });
  if (!resp.ok) throw new Error(await resp.text());
  const data = await resp.json();
  const content = data.choices?.[0]?.message?.content || '{}';
  let parsed;
  try { parsed = JSON.parse(content); } catch { parsed = {}; }
  return parsed.projets || [];
}
import { useState } from 'react';
import { CV_DATA } from '../data/cvData.js';


// Utility helpers
const uniqLower = (arr) => Array.from(new Map(arr.filter(Boolean).map(v=>[v.toLowerCase(), v.trim()])).values());
const clampArray = (arr, n) => (Array.isArray(arr)? arr.slice(0,n):[]);
const safeSplit = (txt, re) => txt.split(re).map(s=>s.trim()).filter(Boolean);

export function useOfferAnalysis(cvData, setCvData) {
  const [jobOfferText,setJobOfferText] = useState('');
  const [analysis,setAnalysis] = useState(null);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(null);
  const [rawGroq,setRawGroq] = useState('');
  const [showDebug,setShowDebug] = useState(false);
  const [experienceCible,setExperienceCible] = useState(0);
  // Ajout : projets sélectionnés par l’IA
  const [selectedProjects, setSelectedProjects] = useState(null);
  // Liste complète des projets d’origine importée directement (jamais modifiée)
  const allProjects = Array.isArray(CV_DATA.projets) ? CV_DATA.projets : [];

  const GROQ_ENDPOINT='https://api.groq.com/openai/v1/chat/completions';

  const buildPrompt = (offre) => `Analyse l'offre suivante et retourne UNIQUEMENT un JSON strict:
{
  "mots_cles": [list max 60 de mots ou expressions clés utiles triés],
  "suggestions": {
    "titre": "Titre de CV optimisé concis (40-100 caractères)",
    "profil": "Résumé profil 1 à 3 phrases (max 420 caractères)",
    "competences": {
      "outils": [max 15],
      "analyse": [max 12],
      "ia": [max 12],
      "soft": [max 10]
    },
    "experiences": { "puces": [4 à 8 bullets impact mesurables orientées résultats] }
  }
}
Règles: Pas de texte hors JSON. Pas de doublons. Adapter vocabulaire FR de l'offre.
OFFRE:\n${offre}`;

  const normaliserStructure = (parsed) => {
    const sugg = parsed.suggestions || {};
    const comp = sugg.competences || {};
    const norm = {
      motsCles: Array.isArray(parsed.mots_cles)? parsed.mots_cles : [],
      suggestions: {
        titre: (sugg.titre||'').trim(),
        profil: (sugg.profil||'').trim(),
        competences: {
          outils: uniqLower(comp.outils||[]),
          analyse: uniqLower(comp.analyse||comp.data_analytics||[]),
          ia: uniqLower(comp.ia||comp.ml||comp['ia_ml']||[]),
          soft: uniqLower(comp.soft||comp.comportementales||[])
        },
        experiences: { puces: uniqLower((sugg.experiences?.puces||sugg.experiences?.bullets||[]).map(b=> b.replace(/^[•\-*\d)\s]+/,'').trim())) }
      }
    };
    // Filtrer longueurs / clamp
    norm.suggestions.competences.outils = clampArray(norm.suggestions.competences.outils,15);
    norm.suggestions.competences.analyse = clampArray(norm.suggestions.competences.analyse,12);
    norm.suggestions.competences.ia = clampArray(norm.suggestions.competences.ia,12);
    norm.suggestions.competences.soft = clampArray(norm.suggestions.competences.soft,10);
    norm.suggestions.experiences.puces = clampArray(norm.suggestions.experiences.puces,12);
    return norm;
  };

  const fallbackExtraction = (txt) => {
    const lower = txt.toLowerCase();
    // Very naive keyword extraction by frequency + whitelist patterns
    const tokens = lower.match(/[a-zA-ZÀ-ÖØ-öø-ÿ0-9+.#-]{3,}/g)||[];
    const freq = new Map();
    tokens.forEach(t=> freq.set(t, (freq.get(t)||0)+1));
    const stop = new Set(['les','des','avec','pour','par','aux','dans','une','sur','ses','est','sont','plus','nous','vous','notre','vos','leur','ainsi','afin','entre','dont','cela','cette','cet','mais','elle','elles','ils','elles','comme','tout','tous','très','tres','être','etre','avoir','faire']);
    const ranked = Array.from(freq.entries())
      .filter(([w])=> !stop.has(w) && w.length<=30)
      .sort((a,b)=> b[1]-a[1])
      .slice(0,80).map(([w])=> w);
    // Group obvious competencies heuristics
    const outils = ranked.filter(w=> /(python|sql|power|excel|tableau|bi|git|docker|airflow|spark|pandas|numpy|node|react)/i.test(w)).slice(0,15);
    const analyse = ranked.filter(w=> /(analyse|report|kpi|dashboard|etl|model|mod[eè]le|prévision|segmentation|stat|regression|classification)/i.test(w)).slice(0,12);
    const ia = ranked.filter(w=> /(ml|machine|learning|ia|model|xgboost|random|forest|tensor|deep|nlp)/i.test(w)).slice(0,12);
    const soft = ['communication','esprit d\'équipe','organisation','rigueur','autonomie'].slice(0,10);
    const puces = ranked.filter(w=> /(optim|autom|amélior|analyse|mise|déploi|pilot|recommand)/i.test(w)).slice(0,6).map(w=>`• ${w} (impact mesurable)`);
    return {
      motsCles: ranked.slice(0,40),
      suggestions: {
        titre: 'Data Analyst / ML (adaptation automatique)',
        profil: 'Professionnel data polyvalent: analyse, modélisation et valorisation des données pour générer des décisions business mesurables.',
        competences: { outils, analyse, ia, soft },
        experiences: { puces }
      }
    };
  };

  const scoreKeywords = (keywords, offer) => {
    const offerLower = offer.toLowerCase();
    const freq = (w) => (offerLower.match(new RegExp(`\\b${w.replace(/[-/\\.*+?^${}()|[\]\\]/g,'\\$&')}\\b`,'gi'))||[]).length;
    return keywords.map(k=>({k, s: freq(k.toLowerCase())*3 + (k.includes(' ')?4:0) + (/^[A-Z0-9]{2,}$/.test(k.replace(/[^A-Z0-9]/g,''))?5:0) + (k.length>14?1:0)}))
      .sort((a,b)=>b.s-a.s).map(o=>o.k);
  };

  const analyserOffre = async () => {
    setAnalysis(null); setRawGroq(''); setShowDebug(false); setExperienceCible(0); setError(null);
    if(!jobOfferText.trim()){ setError('Collez d\'abord le texte de l\'offre.'); return; }
    setLoading(true);
    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      if(!apiKey) throw new Error('VITE_GROQ_API_KEY manquante');
      // Appel principal (analyse CV)
      const prompt = buildPrompt(jobOfferText.slice(0,12000));
      const body = { model:'llama-3.3-70b-versatile', temperature:0.2, max_tokens:1400, response_format:{type:'json_object'}, messages:[{role:'system', content:'Assistant optimisation CV, répond UNIQUEMENT JSON conforme.'},{role:'user', content:prompt}] };
      const resp = await fetch(GROQ_ENDPOINT,{method:'POST', headers:{'Content-Type':'application/json','Authorization':`Bearer ${apiKey}`}, body:JSON.stringify(body)});
      if(!resp.ok){ throw new Error(await resp.text()); }
      const data = await resp.json();
      const content = data.choices?.[0]?.message?.content || '{}';
      setRawGroq(content);
      let parsed; try { parsed = JSON.parse(content); } catch { parsed = {}; }
      let norm = normaliserStructure(parsed);
      // Fallback if too weak
      if(norm.motsCles.length < 8 || (!norm.suggestions.competences.outils.length && !norm.suggestions.competences.analyse.length)){
        norm = normaliserStructure(fallbackExtraction(jobOfferText));
      }
      // Keyword scoring & pruning
      norm.motsCles = scoreKeywords(uniqLower(norm.motsCles), jobOfferText).slice(0,30);
      setAnalysis(norm);

      // Appel parallèle : sélection projets IA (toujours sur la liste complète d’origine importée)
      selectBestProjectsWithAI(allProjects, jobOfferText, apiKey)
        .then(projs => setSelectedProjects(projs))
        .catch(()=>setSelectedProjects(null));
    } catch(e){
      // Fallback entire flow
      try {
        const fb = normaliserStructure(fallbackExtraction(jobOfferText));
        fb.motsCles = scoreKeywords(fb.motsCles, jobOfferText).slice(0,30);
        setAnalysis(fb);
        setError('Analyse approximative (fallback): '+ e.message);
      } catch(inner){
        setError('Erreur analyse: '+e.message);
      }
      setSelectedProjects(null);
    } finally { setLoading(false); }
  };

  // On expose aussi les projets sélectionnés par l’IA
  return { jobOfferText,setJobOfferText, analysis, loading, error, rawGroq, showDebug, setShowDebug, experienceCible, setExperienceCible, analyserOffre, selectedProjects };
}
