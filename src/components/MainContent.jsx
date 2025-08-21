import React from 'react';

const MainContent = ({ cvData, mainRef, mainScale, scaleSteps, newBulletsRef, editMode,
  updateTitre, updateProfil,
  updateExperiencePoste, updateExperienceDetail, addExperienceDetail, removeExperienceDetail,
  updateProjetTitre, updateProjetDetail, addProjetDetail, removeProjetDetail,
  updateFormationDiplome, updateFormationDetail, addFormationDetail, removeFormationDetail,
  updateDescription, updateCompetenceItem, addCompetenceItem, removeCompetenceItem,
  updateCertification, addCertification, removeCertification }) => {
  return (
    <main className="cv-main" ref={mainRef} style={{ fontSize: `${scaleSteps[mainScale]}em` }}>
      <h1>{cvData.nom}<span className="welcome-note">HEC Paris – Certificat Data Strategy (2024) </span></h1>
      <h2>
        {editMode ? (
          <input value={cvData.titre} onChange={e=>updateTitre(e.target.value)} style={{width:'100%', fontSize:'inherit', fontWeight:600, border:'1px solid #cbd5e1', borderRadius:4, padding:'2px 6px'}} />
        ) : cvData.titre}
      </h2>
      {editMode ? (
        <textarea value={cvData.profil} onChange={e=>updateProfil(e.target.value)} rows={3} style={{width:'100%', fontSize:'0.95em', lineHeight:1.3, border:'1px solid #cbd5e1', borderRadius:4, padding:6, fontFamily:'inherit', resize:'vertical'}} />
      ) : <p className="cv-profile">{cvData.profil}</p>}
      {editMode ? (
        <textarea value={cvData.description||''} onChange={e=>updateDescription(e.target.value)} placeholder="Description / Accroche additionnelle" rows={2} style={{width:'100%', fontSize:'0.8em', border:'1px solid #cbd5e1', borderRadius:4, padding:4, fontFamily:'inherit', resize:'vertical', marginTop:4}} />
      ) : (cvData.description && <p className="cv-description">{cvData.description}</p>)}
      <section>
        <h3>Expérience professionnelle</h3>
        {cvData.experiences.map((exp, idx) => (
          <div key={idx} className="cv-experience">
            <b>
              {editMode ? (
                <input value={exp.poste} onChange={e=>updateExperiencePoste(idx, e.target.value)} style={{width:'100%', fontWeight:600, border:'1px solid #cbd5e1', borderRadius:4, padding:'1px 4px'}} />
              ) : exp.poste}
            </b> <span>({exp.dates})</span><br />
            <span>{exp.entreprise}</span>
            <ul>
              {exp.details.map((d, i) => <li key={i} className={newBulletsRef.current.has(d) ? 'new-bullet' : undefined}>
                {editMode ? (
                  <div style={{display:'flex', alignItems:'flex-start', gap:4}}>
                    <textarea value={d} onChange={e=>updateExperienceDetail(idx, i, e.target.value)} rows={2} style={{flex:1, fontSize:'0.9em', border:'1px solid #cbd5e1', borderRadius:4, padding:4, fontFamily:'inherit', resize:'vertical'}} />
                    <button type="button" onClick={()=>removeExperienceDetail(idx,i)} style={{background:'#dc2626', color:'#fff', border:'none', borderRadius:4, padding:'2px 6px', cursor:'pointer'}}>×</button>
                  </div>
                ) : d}
              </li>)}
              {editMode && <li style={{listStyle:'none', marginTop:4}}>
                <button type="button" onClick={()=>addExperienceDetail(idx)} style={{background:'#2563eb', color:'#fff', border:'none', borderRadius:4, padding:'4px 8px', cursor:'pointer', fontSize:12}}>+ Ajouter une puce</button>
              </li>}
            </ul>
          </div>
        ))}
      </section>
      <section>
        <h3>Projets</h3>
        {cvData.projets.map((proj, idx) => (
          <div key={idx} className="cv-projet">
            <b>{editMode ? <input value={proj.titre} onChange={e=>updateProjetTitre(idx,e.target.value)} style={{width:'100%', border:'1px solid #cbd5e1', borderRadius:4, padding:'1px 4px'}} /> : proj.titre}</b> <span>({proj.dates})</span><br />
            <span>{proj.entreprise}</span>
            <ul>
              {proj.details.map((d, i) => <li key={i}>{editMode ? (
                <div style={{display:'flex', gap:4}}>
                  <textarea value={d} onChange={e=>updateProjetDetail(idx,i,e.target.value)} rows={2} style={{flex:1, fontSize:'0.85em', border:'1px solid #cbd5e1', borderRadius:4, padding:4, fontFamily:'inherit'}} />
                  <button type="button" onClick={()=>removeProjetDetail(idx,i)} style={{background:'#dc2626', color:'#fff', border:'none', borderRadius:4, padding:'2px 6px', cursor:'pointer'}}>×</button>
                </div>
              ): d}</li>)}
              {editMode && <li style={{listStyle:'none', marginTop:4}}><button type="button" onClick={()=>addProjetDetail(idx)} style={{background:'#2563eb', color:'#fff', border:'none', borderRadius:4, padding:'4px 8px', fontSize:12, cursor:'pointer'}}>+ Ajouter une puce</button></li>}
            </ul>
          </div>
        ))}
      </section>
      <section>
        <h3>Diplômes et Formations</h3>
        {cvData.formations.map((form, idx) => (
          <div key={idx} className="cv-formation">
            <b>{editMode ? <input value={form.diplome} onChange={e=>updateFormationDiplome(idx,e.target.value)} style={{width:'100%', border:'1px solid #cbd5e1', borderRadius:4, padding:'1px 4px'}} /> : form.diplome}</b> <span>({form.dates})</span><br />
            <span>{form.ecole}</span>
            <ul>
              {form.details.map((d, i) => <li key={i}>{editMode ? (
                <div style={{display:'flex', gap:4}}>
                  <textarea value={d} onChange={e=>updateFormationDetail(idx,i,e.target.value)} rows={2} style={{flex:1, fontSize:'0.85em', border:'1px solid #cbd5e1', borderRadius:4, padding:4, fontFamily:'inherit'}} />
                  <button type="button" onClick={()=>removeFormationDetail(idx,i)} style={{background:'#dc2626', color:'#fff', border:'none', borderRadius:4, padding:'2px 6px', cursor:'pointer'}}>×</button>
                </div>
              ) : d}</li>)}
              {editMode && <li style={{listStyle:'none', marginTop:4}}><button type="button" onClick={()=>addFormationDetail(idx)} style={{background:'#2563eb', color:'#fff', border:'none', borderRadius:4, padding:'4px 8px', fontSize:12, cursor:'pointer'}}>+ Ajouter un détail</button></li>}
            </ul>
          </div>
        ))}
      </section>
      {editMode && <section>
        <h3>Compétences & Certifications (édition rapide)</h3>
        <div style={{display:'flex', flexWrap:'wrap', gap:16}}>
          {Object.entries(cvData.competences).map(([cat, arr])=> (
            <div key={cat} style={{flex:'1 1 220px', minWidth:200}}>
              <b style={{fontSize:'0.85em'}}>{cat}</b>
              <ul style={{marginTop:4}}>
                {arr.map((c,i)=> <li key={i} style={{listStyle:'none', display:'flex', gap:4, alignItems:'flex-start'}}>
                  <textarea value={c} onChange={e=>updateCompetenceItem(cat,i,e.target.value)} rows={1} style={{flex:1, fontSize:'0.7em', border:'1px solid #cbd5e1', borderRadius:4, padding:3, fontFamily:'inherit'}} />
                  <button type="button" onClick={()=>removeCompetenceItem(cat,i)} style={{background:'#dc2626', color:'#fff', border:'none', borderRadius:4, padding:'0 6px', cursor:'pointer'}}>×</button>
                </li>)}
                <li style={{listStyle:'none', marginTop:4}}><button type="button" onClick={()=>addCompetenceItem(cat)} style={{background:'#2563eb', color:'#fff', border:'none', borderRadius:4, padding:'2px 6px', fontSize:11, cursor:'pointer'}}>+ Ajouter</button></li>
              </ul>
            </div>
          ))}
        </div>
        <div style={{marginTop:12}}>
          <b style={{fontSize:'0.85em'}}>Certifications</b>
          <ul style={{marginTop:4}}>
            {cvData.certifications.map((cert,i)=> <li key={i} style={{listStyle:'none', display:'flex', gap:4}}>
              <input value={cert} onChange={e=>updateCertification(i,e.target.value)} style={{flex:1, fontSize:'0.75em', border:'1px solid #cbd5e1', borderRadius:4, padding:'2px 6px'}} />
              <button type="button" onClick={()=>removeCertification(i)} style={{background:'#dc2626', color:'#fff', border:'none', borderRadius:4, padding:'0 6px', cursor:'pointer'}}>×</button>
            </li>)}
            <li style={{listStyle:'none', marginTop:4}}><button type="button" onClick={addCertification} style={{background:'#2563eb', color:'#fff', border:'none', borderRadius:4, padding:'2px 6px', fontSize:11, cursor:'pointer'}}>+ Ajouter certification</button></li>
          </ul>
        </div>
      </section>}
    </main>
  );
};

export default MainContent;
