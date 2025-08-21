// CLEAN VERSION BELOW
import React from 'react';
import Sidebar from './components/Sidebar.jsx';
import MainContent from './components/MainContent.jsx';
import { useCvMode } from './hooks/useCvMode.js';
import { usePdfExport } from './hooks/usePdfExport.js';
import { useOfferAnalysis } from './hooks/useOfferAnalysis.js';
import './App.css';

function App(){
  const { mode, cvData, setCvData, toggleMode } = useCvMode();
  const { jobOfferText, setJobOfferText, analysis, loading, error, rawGroq, showDebug, setShowDebug, experienceCible, setExperienceCible, analyserOffre } = useOfferAnalysis(cvData, setCvData);
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
    setCvData(prev=>{
      const next={...prev, competences:{...prev.competences}, experiences:[...prev.experiences]};
      const sugg=analysis.suggestions||{}; const comp=next.competences;
      // Reset catégories pour insérer celles proposées
      comp.outils=[]; comp.baseDonnees=[]; comp.analyse=[]; comp.visualisation=[]; comp.ia=[]; comp.soft=[];
      if(sugg.competences){
        if(Array.isArray(sugg.competences.outils)) comp.outils=[...sugg.competences.outils];
        if(Array.isArray(sugg.competences.analyse)) comp.analyse=[...sugg.competences.analyse];
        if(Array.isArray(sugg.competences.ia)) comp.ia=[...sugg.competences.ia];
        if(Array.isArray(sugg.competences.soft)) comp.soft=[...sugg.competences.soft.slice(0,5)];
      }
      if(sugg.titre) next.titre=sugg.titre.trim();
      if(sugg.profil) next.profil=sugg.profil.trim();

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
        mainRef={null}
        mainScale={mainScaleIndex}
        scaleSteps={MAIN_SCALE_STEPS}
        newBulletsRef={newBulletsRef}
        editMode={editMode}
        updateTitre={updateTitre}
        updateProfil={updateProfil}
        updateExperiencePoste={updateExperiencePoste}
        updateExperienceDetail={updateExperienceDetail}
        addExperienceDetail={addExperienceDetail}
        removeExperienceDetail={removeExperienceDetail}
        updateProjetTitre={updateProjetTitre}
        updateProjetDetail={updateProjetDetail}
        addProjetDetail={addProjetDetail}
        removeProjetDetail={removeProjetDetail}
        updateFormationDiplome={updateFormationDiplome}
        updateFormationDetail={updateFormationDetail}
        addFormationDetail={addFormationDetail}
        removeFormationDetail={removeFormationDetail}
        updateDescription={updateDescription}
        updateCompetenceItem={updateCompetenceItem}
        addCompetenceItem={addCompetenceItem}
        removeCompetenceItem={removeCompetenceItem}
        updateCertification={updateCertification}
        addCertification={addCertification}
        removeCertification={removeCertification}
      />
    </div>
  </div>;
}

export default App;
