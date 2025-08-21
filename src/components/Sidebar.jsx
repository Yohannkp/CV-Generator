import React from 'react';

const Sidebar = ({ cvData, sidebarScale, sidebarRef, newBulletsRef }) => {
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
  return (
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
      {hasAny && (
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
      )}
      <div className="sidebar-section">
        <h4>Certifications</h4>
        <ul>
          {cvData.certifications.map((cert, idx) => (
            <li key={idx}>{cert}</li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
