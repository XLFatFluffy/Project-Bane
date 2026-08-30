import {loadState,saveState} from './state.js';

// First-run migration: bring the bundled canonical nutrition history into local state.
// Existing user-entered nutrition is never overwritten.
const state=loadState();
if(!Array.isArray(state.nutrition)||state.nutrition.length===0){
  try{
    const r=await fetch('./data/nutrition.json?'+Date.now());
    if(r.ok){const rows=await r.json();state.nutrition=Array.isArray(rows)?rows:[];saveState(state);}
  }catch(e){console.error('Bane nutrition seed failed',e)}
}
