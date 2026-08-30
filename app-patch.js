// UI safety patch: app.js renders views through frame(), while layout also owns the shell.
// Normalize that double shell after each render without changing the data engine.
(function(){
  function normalize(){
    const root=document.querySelector('#root');
    if(!root) return;
    const mains=root.querySelectorAll(':scope > main > #content > aside');
    if(!mains.length) return;
    try{
      root.innerHTML=views[S.view]();
      if(typeof bind==='function') bind();
    }catch(e){console.error('Bane UI normalization failed',e)}
  }
  new MutationObserver(()=>setTimeout(normalize,0)).observe(document.documentElement,{childList:true,subtree:true});
  setInterval(normalize,500);
})();