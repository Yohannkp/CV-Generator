import React, {useState} from 'react';

export default function PersonalizePage(){
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const onFile = e => {
    const f = e.target.files[0];
    setFile(f);
    if(f){
      const url = URL.createObjectURL(f);
      setPreview(url);
    } else {
      setPreview('');
    }
  };

  const submit = async ()=>{
    if(!file) return alert('Choisissez un fichier CV (PDF ou DOCX)');
    setLoading(true);
    const fd = new FormData();
    fd.append('cv', file);
    try{
      const res = await fetch('/api/personalize', {method: 'POST', body: fd});
      if(!res.ok) throw new Error(await res.text());
      const json = await res.json();
      setResult(json);
    }catch(err){
      alert('Erreur: '+err.message);
    }finally{ setLoading(false); }
  };

  return (
    <div style={{padding:20}}>
      <h2>Personnalisation complète du CV</h2>
      <p>Importe ton CV (PDF/DOCX). L'IA analysera le contenu et retournera une mini-base JSON pré-remplie.</p>
      <input type="file" accept=".pdf,.doc,.docx" onChange={onFile} />
      {preview && (
        <div style={{marginTop:10}}>
          <strong>Aperçu:</strong>
          <div style={{border:'1px solid #ddd', padding:8, marginTop:6}}>
            <a href={preview} target="_blank" rel="noreferrer">Ouvrir le fichier</a>
          </div>
        </div>
      )}
      <div style={{marginTop:12}}>
        <button onClick={submit} disabled={loading}>{loading? 'Envoi...':'Envoyer à l\'IA'}</button>
      </div>
      {result && (
        <div style={{marginTop:20}}>
          <h3>Résultat JSON</h3>
          <pre style={{whiteSpace:'pre-wrap', background:'#f7f7f7', padding:10}}>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
