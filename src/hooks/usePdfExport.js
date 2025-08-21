import { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Export PDF (image, advanced print vector, or text reconstruction)
export function usePdfExport(cvRef, getCvData) {
  const busyRef = useRef(false);

  const handleDownloadPDF = async (mode = 'image') => {
    if (busyRef.current) return;
    busyRef.current = true;
    try {
      const cvData = getCvData();
      if (!cvRef.current) return;
      if (mode === 'print') {
        // Full advanced print logic (vector-quality output with adaptive fitting)
        const DESIGN_WIDTH_MM = 198; // widened effective page width
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;
        const doc = printWindow.document;
        const title = `CV-${cvData.nom.replace(/\s+/g, '-')}`;
        const headStyles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
          .map(n => n.outerHTML).join('\n');
        const cvHtml = cvRef.current.outerHTML;
        const printCSS = `@page { size:A4; margin:2.8mm 6mm 8mm; }\n`
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
          + `\n.cv-main{flex:1; padding:12px 20px 30px 22px; font-size:0.92em; line-height:1.24;}`
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

        const adaptScript = `<script>(function(){var c=document.querySelector('.cv-container');if(!c){return;}var target=1122*0.97;var h=c.scrollHeight;var docEl=document.documentElement;var fs=parseFloat(getComputedStyle(docEl).fontSize)||14.2;var secGap=34,blockGap=17,pGap=28,lh=1.30;function apply(){docEl.style.setProperty('--fs',fs+'px');docEl.style.setProperty('--secGap',secGap+'px');docEl.style.setProperty('--blockGap',blockGap+'px');docEl.style.setProperty('--pGap',pGap+'px');docEl.style.setProperty('--lh',lh);}apply();var i=0;while(h>target && i<80){if(secGap>26)secGap-=1;else if(blockGap>12)blockGap-=1;else if(pGap>20)pGap-=1;else if(fs>12.2)fs-=0.2;else if(lh>1.22)lh-=0.01;else break;apply();h=c.scrollHeight;i++;}function compressFormations(){document.querySelectorAll('.cv-formation ul li').forEach(function(li){var t=li.textContent.trim();t=t.replace(/Statistiques, probabilités, algèbre linéaire, Python, SQL, Power BI, Machine Learning, IA explicable, modélisation, déploiement/i,'Stats, proba, alg. lin., Python, SQL, Power BI, ML, XAI, modélisation, déploiement');t=t.replace(/Conception applications web et mobiles \(React, Flutter, Node\.js, Symfony\), intégration d’API REST, UX\/UI, bases de données SQL\/NoSQL/i,'Apps web & mobiles (React, Flutter, Node.js, Symfony); APIs REST; UX/UI; SQL & NoSQL');t=t.replace(/Conception et développement d’applications web et desktop, programmation \(Java, Python, C\+\+\), bases de données \(SQL\), modélisation \(UML\/Merise\), gestion de projet Agile/i,'Apps web & desktop; Java, Python, C++; SQL; UML/Merise; Agile');if(t.length>120){var parts=t.split(/;|,/).map(p=>p.trim()).filter(Boolean);while(parts.join('; ').length>110 && parts.length>4){parts.pop();}t=parts.join('; ');}li.textContent=t;});}function trimNewBullets(){var removed=false;var newBullets=[].slice.call(document.querySelectorAll('li.new-bullet'));if(newBullets.length){var last=newBullets[newBullets.length-1];last.parentNode.removeChild(last);removed=true;}return removed;}function scaleMain(){var m=document.querySelector('.cv-main');if(!m)return;var base=parseFloat(getComputedStyle(m).fontSize);var current=base;var min=base*0.88;while(c.scrollHeight>target && current>min){current-=0.35;m.style.fontSize=current+'px';m.style.lineHeight='1.21';}}function enforce(){var safety=0;while(c.scrollHeight>target && safety<85){if(trimNewBullets()){safety++;continue;}compressFormations();if(c.scrollHeight<=target)break;scaleMain();if(c.scrollHeight<=target)break;if(fs>11.4){fs-=0.12;apply();safety++;continue;}if(lh>1.15){lh-=0.004;apply();safety++;continue;}break;}}enforce();setTimeout(function(){window.print();},80);})()<\/script>`;
        doc.write(`<!DOCTYPE html><html><head><title>${title}</title><meta charset='utf-8'/>${headStyles}<style media='print'>${printCSS}</style></head><body>${cvHtml}${adaptScript}</body></html>`);
        doc.close();
        const finalize = () => { printWindow.focus(); printWindow.print(); };
        if (doc.fonts && doc.fonts.ready) { doc.fonts.ready.then(finalize); } else { setTimeout(finalize, 300); }
        return;
      }
      if (mode === 'text') {
        // Textual reconstruction (vector text)
        const pdf = new jsPDF('p', 'mm', 'a4');
        const lineHeight = 6;
        let y = 15;
        const pageHeight = pdf.internal.pageSize.getHeight();
        const addLine = (text, size = 11, bold = false) => {
          pdf.setFontSize(size);
          pdf.setFont(undefined, bold ? 'bold' : 'normal');
          const splitted = pdf.splitTextToSize(text, 180);
          splitted.forEach(line => {
            if (y > pageHeight - 15) { pdf.addPage(); y = 15; }
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
        addLine(cvData.description || '');
        addLine('');
        addLine('Compétences', 13, true);
        ['outils','analyse','ia'].forEach(k => { if (cvData.competences[k]?.length) addLine(k + ': ' + cvData.competences[k].join(', '), 10); });
        addLine('');
        const section = (label, arr) => {
          addLine(label, 13, true);
          arr.forEach(e => {
            addLine(`${e.poste || e.titre} (${e.dates}) - ${(e.entreprise || e.ecole)}`, 11, true);
            (e.details || []).forEach(d => addLine('• ' + d, 10));
            addLine('');
          });
        };
        section('Expériences', cvData.experiences);
        section('Projets', cvData.projets);
        section('Formations', cvData.formations);
        pdf.save('cv.pdf');
        return;
      }
      // Default image capture
      const canvas = await html2canvas(cvRef.current, { scale: 2, useCORS: true });
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
      pdf.save('cv.pdf');
    } finally {
      busyRef.current = false;
    }
  };

  return { handleDownloadPDF };
}
