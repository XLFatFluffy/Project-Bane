import {filterExercises} from './exercise-library.js';

let db=[];
const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

async function load(){
  try{const r=await fetch('./data/exercises.json?'+Date.now());db=await r.json();}
  catch(e){console.error('Exercise database failed to load',e);db=[];}
}

function open(){
  let o=document.getElementById('bane-exercise-overlay');
  if(!o){o=document.createElement('div');o.id='bane-exercise-overlay';document.body.appendChild(o);}
  render();
}

function render(){
 const o=document.getElementById('bane-exercise-overlay');
 o.classList.add('open');
 const q=document.getElementById('ex-search')?.value||'';
 const muscle=document.getElementById('ex-muscle')?.value||'';
 const equipment=document.getElementById('ex-equipment')?.value||'';
 const muscles=[...new Set(db.flatMap(x=>x.muscleGroups||[]))].sort();
 const equipmentList=[...new Set(db.map(x=>x.equipment).filter(Boolean))].sort();
 const list=filterExercises(db,{query:q,muscleGroup:muscle,equipment});
 o.innerHTML=`<div class="exercise-modal"><div class="exercise-head"><div><small>BUILT-IN DATABASE</small><h2>Exercise Database</h2><p>${list.length} exercises</p></div><button id="ex-close">Close</button></div><div class="exercise-filters"><input id="ex-search" placeholder="Search exercise, muscle, equipment…" value="${esc(q)}"><select id="ex-muscle"><option value="">All muscles</option>${muscles.map(x=>`<option ${x===muscle?'selected':''}>${esc(x)}</option>`).join('')}</select><select id="ex-equipment"><option value="">All equipment</option>${equipmentList.map(x=>`<option ${x===equipment?'selected':''}>${esc(x)}</option>`).join('')}</select></div><div class="exercise-list">${list.map(e=>`<button class="exercise-card" data-ex="${esc(e.id)}"><div><b>${esc(e.name)}</b><span>${esc(e.muscleGroups.join(' · '))}</span><small>${esc(e.equipment)} · ${esc(e.movement)}</small></div><strong>Add to Builder</strong></button>`).join('')||'<p>No exercises found.</p>'}</div></div>`;
 o.querySelector('#ex-close').onclick=()=>o.remove();
 o.querySelector('#ex-search').oninput=()=>render();o.querySelector('#ex-muscle').onchange=()=>render();o.querySelector('#ex-equipment').onchange=()=>render();
 o.querySelectorAll('[data-ex]').forEach(b=>b.onclick=()=>addToBuilder(b.dataset.ex));
}

function addToBuilder(id){
 const e=db.find(x=>x.id===id);if(!e)return;
 localStorage.setItem('project-bane.builder.pending-exercise',JSON.stringify(e));
 alert(`${e.name} is ready to add in Program Builder.`);
}

await load();
function install(){if(document.getElementById('bane-exercise-button'))return;const nav=document.querySelector('aside nav');if(!nav)return;const b=document.createElement('button');b.id='bane-exercise-button';b.className='nav';b.textContent='Exercise Database';b.onclick=open;nav.appendChild(b)}
const timer=setInterval(()=>{install();if(document.getElementById('bane-exercise-button'))clearInterval(timer)},100);
