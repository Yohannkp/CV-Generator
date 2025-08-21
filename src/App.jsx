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

  React.useEffect(()=>{
    const el=cvRef.current; if(!el) return; const ENTER=1180, EXIT=1140;
    const check=()=>{ const h=el.scrollHeight; setCompact(p=> p ? (h<EXIT?false:true) : (h>ENTER)); };
    check(); const ro=new ResizeObserver(check); ro.observe(el); return ()=>ro.disconnect();
  },[cvData]);

  React.useEffect(()=>{
    const c=cvData.competences; const count=(c.outils?.length||0)+(c.baseDonnees?.length||0)+(c.analyse?.length||0)+(c.visualisation?.length||0)+(c.ia?.length||0)+(c.soft?.length||0)+(cvData.certifications?.length||0);
    setSidebarScale(count < BASE_COMP_COUNT ? Math.min(1.4, BASE_COMP_COUNT/Math.max(1,count)) : 1);
  },[cvData.competences, cvData.certifications]);

  return <div>
    <div style={{maxWidth:900, margin:'0 auto', display:'flex', justifyContent:'flex-end', padding:'8px 4px'}}>
      <button onClick={toggleMode} style={{background:'#1e293b', color:'#fff', border:'none', borderRadius:4, padding:'6px 10px', cursor:'pointer', fontSize:12}}>
        {mode === 'data' ? 'Basculer vers CV Dev' : 'Revenir au CV Data'}
      </button>
    </div>
    <div style={{maxWidth:900, margin:'16px auto', padding:'12px 16px', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:8}}>
      <h3 style={{marginTop:0}}>Offre d'emploi</h3>
      <textarea placeholder="Collez ici le texte complet de l'offre (mission, profil, compétences...)" value={jobOfferText} onChange={e=>setJobOfferText(e.target.value)} rows={6} style={{width:'100%', padding:8, border:'1px solid #cbd5e1', borderRadius:4, fontFamily:'inherit', fontSize:14, resize:'vertical'}} />
      <div style={{display:'flex', gap:8, marginTop:8, flexWrap:'wrap', alignItems:'center'}}>
        <button type="button" onClick={analyserOffre} disabled={loading} style={{background:'#2563eb',color:'#fff',border:'none',padding:'8px 14px',borderRadius:4,cursor:'pointer'}}>{loading? 'Analyse...' : 'Analyser l\'offre'}</button>
        <button type="button" onClick={appliquerSuggestions} disabled={!analysis} style={{background: analysis? '#059669':'#94a3b8',color:'#fff',border:'none',padding:'8px 14px',borderRadius:4,cursor: analysis? 'pointer':'not-allowed'}}>Appliquer suggestions</button>
      </div>
      {error && <div style={{color:'#dc2626', marginTop:8, fontSize:13}}>{error}</div>}
      {analysis && <div style={{marginTop:12, fontSize:13}}>
        <b>Mots clés extraits:</b> {analysis.motsCles?.join(', ') || ''}<br />
        {analysis.suggestions?.competences && <div style={{marginTop:6}}>
          <b>Suggestions compétences:</b>
          <ul style={{margin:'4px 0 0 16px'}}>
            {analysis.suggestions.competences.outils?.length>0 && <li>Outils: {analysis.suggestions.competences.outils.join(', ')}</li>}
            {analysis.suggestions.competences.analyse?.length>0 && <li>Analyse: {analysis.suggestions.competences.analyse.join(', ')}</li>}
            {analysis.suggestions.competences.ia?.length>0 && <li>IA/ML: {analysis.suggestions.competences.ia.join(', ')}</li>}
          </ul>
        </div>}
        {analysis.suggestions?.titre && <div style={{marginTop:6}}><b>Nouveau titre proposé:</b> {analysis.suggestions.titre}</div>}
        {analysis.suggestions?.profil && <div style={{marginTop:6}}><b>Profil suggéré:</b> {analysis.suggestions.profil}</div>}
        {analysis.suggestions?.experiences?.puces?.length>0 && <div style={{marginTop:10}}>
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
        </div>}
        <button type="button" onClick={()=>setShowDebug(s=>!s)} style={{marginTop:8, background:'#475569', color:'#fff', border:'none', padding:'4px 10px', borderRadius:4, cursor:'pointer', fontSize:12}}>{showDebug? 'Masquer debug' : 'Voir debug brut'}</button>
        {showDebug && <pre style={{marginTop:8, maxHeight:200, overflow:'auto', background:'#0f172a', color:'#f1f5f9', padding:8, fontSize:11, borderRadius:4}}>{rawGroq}</pre>}
      </div>}
    </div>
    <div className="controls" style={{display:'flex', gap:12, justifyContent:'center', marginTop:16, flexWrap:'wrap'}}>
      <button onClick={()=>handleDownloadPDF('image')} style={{background:'#219ebc',color:'#fff',border:'none',borderRadius:6,padding:'10px 22px',cursor:'pointer'}}>PDF (image rapide)</button>
      <button onClick={()=>handleDownloadPDF('print')} style={{background:'#0d9488',color:'#fff',border:'none',borderRadius:6,padding:'10px 22px',cursor:'pointer'}}>PDF (vector via impression)</button>
      <button onClick={()=>handleDownloadPDF('text')} style={{background:'#6366f1',color:'#fff',border:'none',borderRadius:6,padding:'10px 22px',cursor:'pointer'}}>PDF (texte structuré)</button>
    </div>
    <div className={`cv-container ${compact ? 'compact' : ''}`} ref={cvRef}>
      <Sidebar cvData={cvData} sidebarScale={sidebarScale} sidebarRef={null} newBulletsRef={newBulletsRef} />
      <MainContent cvData={cvData} mainRef={null} mainScale={mainScaleIndex} scaleSteps={MAIN_SCALE_STEPS} newBulletsRef={newBulletsRef} />
    </div>
  </div>;
}

export default App;
