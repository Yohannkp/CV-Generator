// CLEAN VERSION BELOW
import React from 'react';
import { CV_DATA } from './data/cvData.js';
import Sidebar from './components/Sidebar.jsx';
import MainContent from './components/MainContent.jsx';
import { useCvMode } from './hooks/useCvMode.js';
import { usePdfExport } from './hooks/usePdfExport.js';
import { useOfferAnalysis } from './hooks/useOfferAnalysis.js';
import './App.css';

function App(){
  // Suppression manuelle d’un projet
  const removeProjet = (idx) => setCvData(prev => ({
    ...prev,
    projets: prev.projets.filter((_, i) => i !== idx)
  }));
  const { mode, cvData, setCvData, toggleMode } = useCvMode();
  const { jobOfferText, setJobOfferText, analysis, loading, error, rawGroq, showDebug, setShowDebug, experienceCible, setExperienceCible, analyserOffre, selectedProjects } = useOfferAnalysis(cvData, setCvData);
  const cvRef = React.useRef(null);
  const { handleDownloadPDF } = usePdfExport(cvRef, () => cvData);
  const [compact,setCompact] = React.useState(false);
  const [sidebarScale,setSidebarScale] = React.useState(1);
  const [mainScaleIndex,setMainScaleIndex] = React.useState(0);
  const newBulletsRef = React.useRef(new Set());
  const ensuringFitRef = React.useRef(false);
  const fitAttemptsRef = React.useRef(0);
  const MAIN_SCALE_STEPS = [1,0.97,0.94,0.92];
  const BASE_COMP_COUNT = 33;
  const [editMode,setEditMode] = React.useState(false);

  const ensureMainFits = () => {
    if(ensuringFitRef.current) return; ensuringFitRef.current=true;
    const el=cvRef.current; if(!el){ensuringFitRef.current=false;return;}
    const MAX=1120;
    const step=()=>{
      if(!el){ensuringFitRef.current=false;return;}
      if(el.scrollHeight<=MAX){ensuringFitRef.current=false;return;}
      if(fitAttemptsRef.current++>60){ensuringFitRef.current=false;return;}
      if(mainScaleIndex < MAIN_SCALE_STEPS.length-1){ setMainScaleIndex(i=>i+1); setTimeout(step,30); return; }
      if(newBulletsRef.current.size){
        setCvData(prev=>{
          const next={...prev, experiences: prev.experiences.map(e=>({...e, details:[...e.details]}))};
          for(const e of next.experiences){
            for(let i=e.details.length-1;i>=0;i--){
              if(newBulletsRef.current.has(e.details[i])){ newBulletsRef.current.delete(e.details[i]); e.details.splice(i,1); return next; }
            }
          }
          return next;
        });
        setTimeout(step,50); return;
      }
      ensuringFitRef.current=false;
    };
    step();
  };

  const appliquerSuggestions = () => {
    if(!analysis) return;
    // Si la sélection IA est attendue mais pas encore reçue, on bloque et informe l’utilisateur
    if(analysis && selectedProjects === null && loading) {
      alert('Veuillez patienter : la sélection des projets par l’IA est en cours...');
      return;
    }
    if(selectedProjects) {
      // Debug : afficher la sélection IA dans la console
      console.log('Projets sélectionnés par l’IA :', selectedProjects);
    }
    setCvData(prev=>{
      const next={...prev, competences:{...prev.competences}, experiences:[...prev.experiences], projets:[...prev.projets]};
      const sugg=analysis.suggestions||{}; const comp=next.competences;
      // --- Fusion intelligente des compétences ---
      const TARGET_TOTAL = 30;
      const displayedCats = ['outils','baseDonnees','analyse','visualisation','ia','soft'];
      // Normalise structure existante
      displayedCats.forEach(c=>{ if(!Array.isArray(comp[c])) comp[c]=[]; });
      const suggestions = (sugg.competences)||{};
      // Construire liste plate (ordre catégories) : suggestions (protégées) puis base
      const flat=[]; const seen=new Set(); const lower = s=>s.toLowerCase();
      // Collect suggestions first category by category
      displayedCats.forEach(cat=>{
        const arr=Array.isArray(suggestions[cat])? suggestions[cat]:[];
        arr.forEach(item=>{ if(item && !seen.has(lower(item))){ flat.push({cat, value:item, suggested:true}); seen.add(lower(item)); } });
      });
      // Add base remainder
      displayedCats.forEach(cat=>{
        const baseArr=Array.isArray(prev.competences[cat])? prev.competences[cat]:[];
        baseArr.forEach(item=>{ const key=lower(item); if(item && !seen.has(key)){ flat.push({cat, value:item, suggested:false}); seen.add(key);} });
      });
      // Si trop d'éléments, retirer depuis la fin en privilégiant la suppression d'éléments non-suggérés
      if(flat.length > TARGET_TOTAL){
        // Retirer non-suggérés d'abord
        let i=flat.length-1;
        while(i>=0 && flat.length>TARGET_TOTAL){ if(!flat[i].suggested){ flat.splice(i,1);} i--; }
        // Si encore trop, retirer même suggérés fin
        i=flat.length-1; while(i>=0 && flat.length>TARGET_TOTAL){ flat.splice(i,1); i--; }
      }
      // Pas assez : impossible d'en créer artificiellement, on garde ce qu'on a.
      // Reconstruire par catégorie en respectant l'ordre filtré
      const catBuffers = Object.fromEntries(displayedCats.map(c=>[c,[]]));
      flat.forEach(entry=>{ catBuffers[entry.cat].push(entry.value); });
      // Limiter soft skills à 5 si dépasse (règle précédente) tout en maintenant target global
      if(catBuffers.soft.length>5){
        // Retirer surplus soft depuis la fin (non suggérés d'abord)
        let j=catBuffers.soft.length-1;
        while(j>=0 && catBuffers.soft.length>5){ if(!flat.find(f=>f.cat==='soft' && f.value===catBuffers.soft[j] && f.suggested)) { catBuffers.soft.splice(j,1);} j--; }
        // Si toujours >5, tronquer
        if(catBuffers.soft.length>5) catBuffers.soft.length=5;
      }
      // Assigner
      displayedCats.forEach(cat=>{ comp[cat]=catBuffers[cat]; });
      if(sugg.titre) next.titre=sugg.titre.trim();
      if(sugg.profil){
        const proposed = sugg.profil.trim();
        const keepPrev = prev.profil && prev.profil.trim().length > 0 && (proposed.length < 60 && prev.profil.length >= 80);
        if(!keepPrev) next.profil = proposed;
      }
      // Génération / conservation description (accroche secondaire) si vide
      const hasDescriptionBefore = (prev.description||'').trim().length>0;
      const stillEmpty = !(next.description||'').trim();
      if(stillEmpty){
        if(hasDescriptionBefore){
          next.description = prev.description; // conserver ancienne
        } else {
          // --- Générateur description qualitatif FR ---
          const motsCle = (analysis?.motsCles||[]).map(m=>m.trim()).filter(Boolean);
          const lowerSet = new Set(motsCle.map(m=>m.toLowerCase()));
          // Détection secteur / contexte
          const secteurPatterns = [
            {re:/(revenue management|optimisation des revenus)/i, label:'l\'optimisation des revenus'},
            {re:/(retail|commerce|e-?commerce)/i, label:'le retail et l\'expérience client'},
            {re:/(tourisme|loisir|parc|hospitality)/i, label:'le tourisme & loisirs'},
            {re:/(finance|banque|assurance)/i, label:'la finance analytique'},
            {re:/(rh|ressources humaines)/i, label:'les dynamiques RH'},
            {re:/(marketing|acquisition)/i, label:'les décisions marketing'},
            {re:/(supply|logistique)/i, label:'la chaîne opérationnelle'},
            {re:/(cloud|aws|gcp|azure)/i, label:'des environnements cloud'},
          ];
          let secteur = '';
          for(const p of secteurPatterns){ if(p.re.test(jobOfferText || '')){ secteur = p.label; break; } }
          if(!secteur){
            if(lowerSet.has('revenue management')) secteur = 'l\'optimisation des revenus';
            else if(lowerSet.has('disneyland paris')) secteur = 'l\'expérience parc & loisirs';
          }
          // Domaines clés (priorité analyse & IA)
          const domaines = [];
          const pushUnique = v=>{ if(v && !domaines.find(d=>d.toLowerCase()===v.toLowerCase())) domaines.push(v); };
          const pickTop = (arr, n)=> (arr||[]).slice(0,n).forEach(a=>pushUnique(a.replace(/\(.*?\)/,'')));
          pickTop(comp.analyse,2);
          pickTop(comp.ia,2);
          if(domaines.length<2) pickTop(comp.outils,1);
          // Outils principaux
          const outilsPrincipaux = (comp.outils||[]).filter(o=>/(Python|SQL|Power BI|Git)/i.test(o)).slice(0,3);
          // Modèles / techniques
            const modelWords = (comp.ia||[]).filter(t=>/(Classification|Régression|XGBoost|Random Forest|Deep Learning|Réseaux|Feature engineering)/i.test(t)).slice(0,3);
          // Objectif business heuristique
          let objectif='de la prise de décision';
          if(lowerSet.has('revenue management')) objectif='de l\'optimisation des revenus';
          else if(lowerSet.has('segmentation')) objectif='de la segmentation & personnalisation';
          else if(lowerSet.has('scoring')) objectif='du pilotage des scores';
          // Entreprise / marque
          let marque='';
          const m = (jobOfferText||'').match(/([A-Z][A-Za-zéèàùûôïë\-]+(?:\s+[A-Z][A-Za-zéèàùûôïë\-]+){0,2})/);
          if(m && m[1] && m[1].length>2 && /[A-Za-z]/.test(m[1])) marque = m[1];
          if(lowerSet.has('disneyland paris')) marque='Disneyland Paris';
          const titreBase = next.titre || prev.titre || 'Professionnel Data';
          const phrase1 = `${titreBase} ${domaines.length? 'spécialisé(e) en ' + domaines.join(' & ') : ''}${secteur? ' appliqués à ' + secteur : ''}${marque? ' pour ' + marque : ''}.`;
          const phrase2 = outilsPrincipaux.length ? `Maîtrise ${outilsPrincipaux.join(', ')} et transforme les données en leviers opérationnels.` : '';
          const phrase3 = modelWords.length ? `Exploite ${modelWords.join(', ')} pour accélérer ${objectif}.` : `Orienté(e) impact & fiabilité analytique.`;
          let descriptionFinale = [phrase1, phrase2, phrase3].filter(Boolean).join(' ');
          // Nettoyage stylistique
          descriptionFinale = descriptionFinale
            .replace(/\s+/g,' ') // espaces multiples
            .replace(/ ,/g,',')
            .replace(/\.(?=\.)+/g,'.')
            .trim();
          // Longueur minimale
          if(descriptionFinale.length < 120 && hasDescriptionBefore) descriptionFinale = prev.description;
          next.description = descriptionFinale;
        }
      }

      const puces=sugg.experiences?.puces||[];
      if(puces.length){
        const idx=Math.min(Math.max(0,experienceCible), next.experiences.length);
        const MAX_PUCES = 5; // Limite maximale de puces après application des suggestions
        if(next.experiences[idx]){
          const details=[...next.experiences[idx].details];
          const exists=new Set(details.map(d=>d.toLowerCase()));
          for(const p of puces){
            if(details.length >= MAX_PUCES) break; // Stop si on atteint la limite
            if(p && !exists.has(p.toLowerCase())){ details.push(p); newBulletsRef.current.add(p);} }
          // Si l'expérience dépassait déjà 5 puces, on tronque (priorité aux premières existantes + nouvelles ajoutées jusqu'à 5)
          if(details.length > MAX_PUCES){
            const removed = details.slice(MAX_PUCES);
            removed.forEach(r=>newBulletsRef.current.delete(r));
            details.length = MAX_PUCES;
          }
          next.experiences[idx]={...next.experiences[idx], details};
        }else{
          const limited = puces.slice(0,MAX_PUCES);
            limited.forEach(p=>newBulletsRef.current.add(p));
          next.experiences.push({ poste:'Expérience ajoutée', entreprise:'-', dates:new Date().getFullYear().toString(), details: limited });
        }
      }
      // --- Application des projets sélectionnés par l’IA si disponibles ---
      if(selectedProjects && Array.isArray(selectedProjects) && selectedProjects.length > 0) {
        // Pour chaque projet sélectionné, on récupère la version complète d’origine (titre strictement égal)
        next.projets = selectedProjects.map(pSel => {
          const pFull = Array.isArray(CV_DATA.projets) ? CV_DATA.projets.find(p0 => p0.titre === pSel.titre) : null;
          return pFull ? { ...pFull } : { ...pSel };
        });
      } else {
        // Fallback : filtrage local classique (pondération avancée ML/DL)
        const motsCle = (analysis?.motsCles||[]).map(m=>m.toLowerCase());
        const baseProjects = prev.projets || [];
        const MIN_PROJECTS = 3, MAX_PROJECTS = 4;
        const strongKeywords = [
          'deep learning','machine learning','pytorch','tensorflow','keras','cnn','lstm','rnn','nlp','computer vision','reconnaissance','classification','réseau de neurones','neural network','apprentissage profond','modelisation','modélisation','regression','régression','clustering','reinforcement learning','apprentissage par renforcement','xgboost','random forest','ml','dl'
        ];
        const scored = baseProjects.map((proj, idx) => {
          let score = 0;
          const titre = (proj.titre||'').toLowerCase();
          const entreprise = (proj.entreprise||'').toLowerCase();
          const details = (proj.details||[]).join(' ').toLowerCase();
          strongKeywords.forEach(sk => {
            if(titre.includes(sk)) score += 10;
            if(details.includes(sk)) score += 8;
          });
          motsCle.forEach(mot => {
            if(titre.includes(mot)) score += 3;
            if(entreprise.includes(mot)) score += 1;
            if(details.includes(mot)) score += 2;
          });
          return { idx, score };
        });
        scored.sort((a,b)=>b.score-a.score);
        let filteredProjects = scored.filter(s=>s.score>0).slice(0,MAX_PROJECTS).map(s=>baseProjects[s.idx]);
        if(filteredProjects.length < MIN_PROJECTS) {
          const usedIdx = new Set(filteredProjects.map(p=>baseProjects.indexOf(p)));
          for(let i=0; i<baseProjects.length && filteredProjects.length<MIN_PROJECTS; ++i) {
            if(!usedIdx.has(i)) filteredProjects.push(baseProjects[i]);
          }
        }
        next.projets = filteredProjects.slice(0,MAX_PROJECTS);
      }
      return next;
    });
    setMainScaleIndex(0);
    setTimeout(()=>ensureMainFits(),40);
  };

  // --- Edition handlers ---
  const updateTitre = (val) => setCvData(prev=> ({...prev, titre: val}));
  const updateProfil = (val) => setCvData(prev=> ({...prev, profil: val}));
  const updateExperiencePoste = (idx, val) => setCvData(prev=> ({...prev, experiences: prev.experiences.map((e,i)=> i===idx? {...e, poste: val}: e)}));
  const updateExperienceDetail = (expIdx, detailIdx, val) => setCvData(prev=> ({...prev, experiences: prev.experiences.map((e,i)=> {
      if(i!==expIdx) return e; const details = e.details.map((d,j)=>{ if(j===detailIdx){
        if(newBulletsRef.current.has(d)){ newBulletsRef.current.delete(d); newBulletsRef.current.add(val); }
        return val; } return d; }); return {...e, details}; }) }));
  const addExperienceDetail = (expIdx) => setCvData(prev=> ({...prev, experiences: prev.experiences.map((e,i)=> i===expIdx? {...e, details:[...e.details, 'Nouvelle réalisation']} : e)}));
  const removeExperienceDetail = (expIdx, detailIdx) => setCvData(prev=> ({...prev, experiences: prev.experiences.map((e,i)=> {
      if(i!==expIdx) return e; const details = e.details.filter((_,j)=> j!==detailIdx); return {...e, details}; }) }));
  // Projets
  const updateProjetTitre = (idx,val)=> setCvData(prev=> ({...prev, projets: prev.projets.map((p,i)=> i===idx? {...p, titre: val}: p)}));
  const updateProjetDetail = (projIdx, detailIdx, val)=> setCvData(prev=> ({...prev, projets: prev.projets.map((p,i)=> {
    if(i!==projIdx) return p; const details = p.details.map((d,j)=> j===detailIdx? val: d); return {...p, details}; }) }));
  const addProjetDetail = (projIdx)=> setCvData(prev=> ({...prev, projets: prev.projets.map((p,i)=> i===projIdx? {...p, details:[...p.details, 'Nouvelle tâche projet']} : p)}));
  const removeProjetDetail = (projIdx, detailIdx)=> setCvData(prev=> ({...prev, projets: prev.projets.map((p,i)=> {
    if(i!==projIdx) return p; const details = p.details.filter((_,j)=> j!==detailIdx); return {...p, details}; }) }));
  // Formations
  const updateFormationDiplome = (idx,val)=> setCvData(prev=> ({...prev, formations: prev.formations.map((f,i)=> i===idx? {...f, diplome: val}: f)}));
  const updateFormationDetail = (formIdx, detailIdx, val)=> setCvData(prev=> ({...prev, formations: prev.formations.map((f,i)=> {
    if(i!==formIdx) return f; const details = f.details.map((d,j)=> j===detailIdx? val: d); return {...f, details}; }) }));
  const addFormationDetail = (formIdx)=> setCvData(prev=> ({...prev, formations: prev.formations.map((f,i)=> i===formIdx? {...f, details:[...f.details, 'Nouvel élément formation']} : f)}));
  const removeFormationDetail = (formIdx, detailIdx)=> setCvData(prev=> ({...prev, formations: prev.formations.map((f,i)=> {
    if(i!==formIdx) return f; const details = f.details.filter((_,j)=> j!==detailIdx); return {...f, details}; }) }));
  // Compétences & certifications
  const updateCompetenceItem = (cat, idx, val)=> setCvData(prev=> ({...prev, competences: {...prev.competences, [cat]: prev.competences[cat].map((c,i)=> i===idx? val: c)}}));
  const addCompetenceItem = (cat)=> setCvData(prev=> ({...prev, competences: {...prev.competences, [cat]: [...(prev.competences[cat]||[]), 'Nouvelle compétence']}}));
  const removeCompetenceItem = (cat, idx)=> setCvData(prev=> ({...prev, competences: {...prev.competences, [cat]: prev.competences[cat].filter((_,i)=> i!==idx)}}));
  const updateCertification = (idx,val)=> setCvData(prev=> ({...prev, certifications: prev.certifications.map((c,i)=> i===idx? val: c)}));
  const addCertification = ()=> setCvData(prev=> ({...prev, certifications: [...prev.certifications, 'Nouvelle certification']}));
  const removeCertification = (idx)=> setCvData(prev=> ({...prev, certifications: prev.certifications.filter((_,i)=> i!==idx)}));
  const updateDescription = (val)=> setCvData(prev=> ({...prev, description: val}));
  React.useEffect(()=>{ if(editMode) return; // when leaving edit mode refit
    setTimeout(()=>ensureMainFits(),30);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[cvData.experiences, cvData.titre, cvData.profil, editMode]);

  React.useEffect(()=>{
    const el=cvRef.current; if(!el) return; const ENTER=1180, EXIT=1140;
    const check=()=>{ const h=el.scrollHeight; setCompact(p=> p ? (h<EXIT?false:true) : (h>ENTER)); };
    check(); const ro=new ResizeObserver(check); ro.observe(el); return ()=>ro.disconnect();
  },[cvData]);

  React.useEffect(()=>{
    const c=cvData.competences; const count=(c.outils?.length||0)+(c.baseDonnees?.length||0)+(c.analyse?.length||0)+(c.visualisation?.length||0)+(c.ia?.length||0)+(c.soft?.length||0)+(cvData.certifications?.length||0);
    setSidebarScale(count < BASE_COMP_COUNT ? Math.min(1.4, BASE_COMP_COUNT/Math.max(1,count)) : 1);
  },[cvData.competences, cvData.certifications]);

  return <div className="app-workspace">
    <div className="panel-left">
      <div className="panel-header-buttons">
        <button onClick={toggleMode} className="btn small primary-alt">
          {mode === 'data' ? 'Basculer vers CV Dev' : 'Revenir au CV Data'}
        </button>
        <button onClick={()=>setEditMode(m=>!m)} className={`btn small ${editMode? 'danger':'neutral'}`}>
          {editMode? 'Quitter édition':'Mode édition'}
        </button>
      </div>
      <div className="offer-analysis-container panel-box">
        <h3 style={{marginTop:0}}>Offre d'emploi</h3>
        <textarea placeholder="Collez ici le texte complet de l'offre (mission, profil, compétences...)" value={jobOfferText} onChange={e=>setJobOfferText(e.target.value)} rows={10} className="offer-textarea" />
        <div className="action-row">
          <button type="button" onClick={analyserOffre} disabled={loading} className="btn primary">{loading? 'Analyse...' : 'Analyser l\'offre'}</button>
          <button type="button" onClick={appliquerSuggestions} disabled={!analysis} className={`btn success ${!analysis? 'disabled':''}`}>Appliquer suggestions</button>
        </div>
        {error && <div className="msg error">{error}</div>}
        {analysis && <div className="analysis-block">
          <div className="analysis-section">
            <b>Mots clés extraits:</b>
            <div className="keywords-list">{analysis.motsCles?.join(', ') || ''}</div>
          </div>
          {analysis.suggestions?.competences && <div className="analysis-section">
            <b>Suggestions compétences:</b>
            <ul className="flat-list">
              {analysis.suggestions.competences.outils?.length>0 && <li><span className="tag-label">Outils</span> {analysis.suggestions.competences.outils.join(', ')}</li>}
              {analysis.suggestions.competences.analyse?.length>0 && <li><span className="tag-label">Analyse</span> {analysis.suggestions.competences.analyse.join(', ')}</li>}
              {analysis.suggestions.competences.ia?.length>0 && <li><span className="tag-label">IA/ML</span> {analysis.suggestions.competences.ia.join(', ')}</li>}
            </ul>
          </div>}
          {analysis.suggestions?.titre && <div className="analysis-section"><b>Nouveau titre:</b> {analysis.suggestions.titre}</div>}
          {analysis.suggestions?.profil && <div className="analysis-section"><b>Profil suggéré:</b> {analysis.suggestions.profil}</div>}
          {analysis.suggestions?.experiences?.puces?.length>0 && <div className="analysis-section">
            <b>Puces expériences suggérées:</b>
            <div className="target-exp">
              <label>Cibler:
                <select value={experienceCible} onChange={e=>setExperienceCible(parseInt(e.target.value,10))}>
                  {cvData.experiences.map((exp,i)=><option key={i} value={i}>{i+1}. {exp.poste.slice(0,40)}</option>)}
                  <option value={cvData.experiences.length}>+ Nouvelle expérience</option>
                </select>
              </label>
            </div>
            <ul className="bullets-preview">
              {analysis.suggestions.experiences.puces.map((p,i)=><li key={i}>{p}</li>)}
            </ul>
          </div>}
          <button type="button" onClick={()=>setShowDebug(s=>!s)} className="btn tiny secondary" style={{marginTop:6}}>{showDebug? 'Masquer debug' : 'Voir debug brut'}</button>
          {showDebug && <pre className="debug-raw">{rawGroq}</pre>}
        </div>}
      </div>
      <div className="panel-box pdf-box">
        <div className="pdf-buttons">
          <button onClick={()=>handleDownloadPDF('image')} className="btn info">PDF image</button>
          <button onClick={()=>handleDownloadPDF('print')} className="btn teal">PDF impression</button>
          <button onClick={()=>handleDownloadPDF('text')} className="btn violet">PDF texte</button>
        </div>
      </div>
    </div>
    <div className={`cv-container ${compact ? 'compact' : ''}`} ref={cvRef}>
      <Sidebar cvData={cvData} sidebarScale={sidebarScale} sidebarRef={null} newBulletsRef={newBulletsRef} />
      <MainContent
        cvData={cvData}
        mainRef={cvRef}
        mainScale={mainScaleIndex}
        scaleSteps={MAIN_SCALE_STEPS}
        newBulletsRef={newBulletsRef}
        editMode={editMode}
        updateTitre={val=>setCvData(prev=>({...prev, titre: val}))}
        updateProfil={val=>setCvData(prev=>({...prev, profil: val}))}
        updateExperiencePoste={(idx, val)=>setCvData(prev=>({...prev, experiences: prev.experiences.map((e,i)=> i===idx? {...e, poste: val}: e)}))}
        updateExperienceDetail={(expIdx, detailIdx, val)=>setCvData(prev=>({...prev, experiences: prev.experiences.map((e,i)=> {
            if(i!==expIdx) return e; const details = e.details.map((d,j)=>{ if(j===detailIdx){
              if(newBulletsRef.current.has(d)){ newBulletsRef.current.delete(d); newBulletsRef.current.add(val); }
              return val; } return d; }); return {...e, details}; }) }))}
        addExperienceDetail={expIdx=>setCvData(prev=>({...prev, experiences: prev.experiences.map((e,i)=> i===expIdx? {...e, details:[...e.details, 'Nouvelle réalisation']} : e)}))}
        removeExperienceDetail={(expIdx, detailIdx)=>setCvData(prev=>({...prev, experiences: prev.experiences.map((e,i)=> {
            if(i!==expIdx) return e; const details = e.details.filter((_,j)=> j!==detailIdx); return {...e, details}; }) }))}
        updateProjetTitre={(idx,val)=> setCvData(prev=> ({...prev, projets: prev.projets.map((p,i)=> i===idx? {...p, titre: val}: p)}))}
        updateProjetDetail={(projIdx, detailIdx, val)=> setCvData(prev=> ({...prev, projets: prev.projets.map((p,i)=> {
          if(i!==projIdx) return p; const details = p.details.map((d,j)=> j===detailIdx? val: d); return {...p, details}; }) }))}
        addProjetDetail={projIdx=> setCvData(prev=> ({...prev, projets: prev.projets.map((p,i)=> i===projIdx? {...p, details:[...p.details, 'Nouvelle tâche projet']} : p)}))}
        removeProjetDetail={(projIdx, detailIdx)=> setCvData(prev=> ({...prev, projets: prev.projets.map((p,i)=> {
          if(i!==projIdx) return p; const details = p.details.filter((_,j)=> j!==detailIdx); return {...p, details}; }) }))}
        removeProjet={removeProjet}
        updateFormationDiplome={(idx,val)=> setCvData(prev=> ({...prev, formations: prev.formations.map((f,i)=> i===idx? {...f, diplome: val}: f)}))}
        updateFormationDetail={(formIdx, detailIdx, val)=> setCvData(prev=> ({...prev, formations: prev.formations.map((f,i)=> {
          if(i!==formIdx) return f; const details = f.details.map((d,j)=> j===detailIdx? val: d); return {...f, details}; }) }))}
        addFormationDetail={formIdx=> setCvData(prev=> ({...prev, formations: prev.formations.map((f,i)=> i===formIdx? {...f, details:[...f.details, 'Nouvel élément formation']} : f)}))}
        removeFormationDetail={(formIdx, detailIdx)=> setCvData(prev=> ({...prev, formations: prev.formations.map((f,i)=> {
          if(i!==formIdx) return f; const details = f.details.filter((_,j)=> j!==detailIdx); return {...f, details}; }) }))}
        updateCompetenceItem={(cat, idx, val)=> setCvData(prev=> ({...prev, competences: {...prev.competences, [cat]: prev.competences[cat].map((c,i)=> i===idx? val: c)}}))}
        addCompetenceItem={cat=> setCvData(prev=> ({...prev, competences: {...prev.competences, [cat]: [...(prev.competences[cat]||[]), 'Nouvelle compétence']}}))}
        removeCompetenceItem={(cat, idx)=> setCvData(prev=> ({...prev, competences: {...prev.competences, [cat]: prev.competences[cat].filter((_,i)=> i!==idx)}}))}
        updateCertification={(idx,val)=> setCvData(prev=> ({...prev, certifications: prev.certifications.map((c,i)=> i===idx? val: c)}))}
        addCertification={()=> setCvData(prev=> ({...prev, certifications: [...prev.certifications, 'Nouvelle certification']}))}
        removeCertification={idx=> setCvData(prev=> ({...prev, certifications: prev.certifications.filter((_,i)=> i!==idx)}))}
        updateDescription={val=> setCvData(prev=> ({...prev, description: val}))}
      />
    </div>
  </div>
}

export default App;
