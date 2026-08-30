/* Project Bane Source Engine
 * Keeps document ingestion separate from the daily UI. It recognizes supported
 * source schemas, creates a preview, and requires explicit approval before applying.
 */
(function(){
  const SOURCE_KEY='project-bane-source-staging-v1';
  const canonical={
    program:['BLOCK 1 PROGRAM','CONDITIONING'],
    nutrition:['Daily Log','Daily Summary','Weekly Summary']
  };
  const text=v=>String(v??'').trim();
  function rows(wb,name){return XLSX.utils.sheet_to_json(wb.Sheets[name],{header:1,defval:'',raw:true});}
  function signature(wb){return wb.SheetNames.map(text).sort().join('|');}
  function detect(wb){
    const names=wb.SheetNames.map(text);
    if(canonical.program.every(x=>names.includes(x))) return 'program';
    if(canonical.nutrition.every(x=>names.includes(x))) return 'nutrition';
    return null;
  }
  function previewProgram(wb){
    const r=rows(wb,'BLOCK 1 PROGRAM'), header=r[3]||[];
    const H=header.map(text); const idx=n=>H.findIndex(x=>x.toUpperCase()===n.toUpperCase());
    const days=r.slice(4).filter(x=>text(x[idx('DAY')])).map(x=>({day:text(x[idx('DAY')]),focus:text(x[idx('FOCUS')])}));
    const cond=rows(wb,'CONDITIONING');
    return {type:'program',signature:signature(wb),days,conditioningRows:Math.max(0,cond.length-4),sheets:wb.SheetNames};
  }
  function previewNutrition(wb){
    const r=rows(wb,'Daily Log'); const h=(r[0]||[]).map(text); const di=h.findIndex(x=>x.toLowerCase()==='date');
    const fi=h.findIndex(x=>x.toLowerCase()==='food / drink');
    const rowsFound=r.slice(1).filter(x=>di>=0&&fi>=0&&x[di]&&x[fi]);
    const dates=[...new Set(rowsFound.map(x=>x[di] instanceof Date?x[di].toISOString().slice(0,10):text(x[di])))].sort();
    return {type:'nutrition',signature:signature(wb),rows:rowsFound.length,dates,sheets:wb.SheetNames};
  }
  function showPreview(preview,file){
    const out=document.querySelector('#sourceResult'); if(!out)return;
    sessionStorage.setItem(SOURCE_KEY,JSON.stringify({fileName:file.name,preview}));
    out.innerHTML=`<div class="notice"><b>Import preview</b><br>${preview.type==='program'?`Workout program: ${preview.days.length} day rows, ${preview.conditioningRows} conditioning rows.`:`Meal log: ${preview.rows} entries across ${preview.dates.length} dates.`}<br><span class="muted">Sheets: ${preview.sheets.join(', ')}</span><div class="actions" style="margin-top:10px"><button class="btn primary" id="approveStaged">Apply Import</button><button class="btn" id="cancelStaged">Cancel</button></div></div>`;
    document.querySelector('#approveStaged').onclick=()=>{sessionStorage.removeItem(SOURCE_KEY); window.__baneOriginalImportSource(file)};
    document.querySelector('#cancelStaged').onclick=()=>{sessionStorage.removeItem(SOURCE_KEY);out.innerHTML='<div class="muted">Import cancelled.</div>'};
  }
  const original=window.importSource;
  if(!original)return;
  window.__baneOriginalImportSource=original;
  window.importSource=async function(file){
    if(!file)return;
    if(file.name.toLowerCase().endsWith('.md')) return original(file);
    try{
      const wb=XLSX.read(await file.arrayBuffer(),{type:'array',cellDates:true});
      const type=detect(wb);
      if(!type){document.querySelector('#sourceResult').innerHTML='<div class="error">Unsupported source structure. Expected the Project Bane canonical workout or meal-log workbook.</div>';return;}
      showPreview(type==='program'?previewProgram(wb):previewNutrition(wb),file);
    }catch(e){document.querySelector('#sourceResult').innerHTML='<div class="error">Could not read source: '+text(e.message)+'</div>'}
  };
})();
