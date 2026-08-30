import {loadState,saveState} from './state.js';
import {calculateFoodMacros} from './food-library.js';
const LIB_KEY='project-bane.food-library.v1';
const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
let library=[];
async function seed(){
 try{
  const r=await fetch('./data/food-library.json?'+Date.now());
  const bundled=await r.json();
  let existing=[];try{existing=JSON.parse(localStorage.getItem(LIB_KEY)||'[]')}catch{}
  const aliases={'Mayonnaise packet':'Mayonnaise','Baked beans':'Baked beans — small serving','Chicken':'Chicken breast','Chicken breasts':'Chicken breast','Salad':'Salad — medium'};
  const merged=existing.map(f=>aliases[f.name]?{...f,name:aliases[f.name]}:f);
  for(const f of bundled){const i=merged.findIndex(x=>x.id===f.id||x.name.toLowerCase()===f.name.toLowerCase());if(i>=0)merged[i]={...merged[i],...f};else merged.push(f)}
  library=merged.filter((f,i,a)=>a.findIndex(x=>x.name.toLowerCase()===f.name.toLowerCase())===i);
  localStorage.setItem(LIB_KEY,JSON.stringify(library));
 }catch(e){console.error('Food library seed failed',e);library=[];}
}
function save(){localStorage.setItem(LIB_KEY,JSON.stringify(library));}
function calc(f,amount){return calculateFoodMacros({caloriesPerUnit:f.caloriesPerUnit,proteinPerUnit:f.proteinPerUnit,carbsPerUnit:f.carbsPerUnit,fiberPerUnit:f.fiberPerUnit,servingUnit:f.servingUnit},amount)}
function open(){let overlay=document.getElementById('bane-food-overlay');if(!overlay){overlay=document.createElement('div');overlay.id='bane-food-overlay';document.body.appendChild(overlay)}render()}
function render(filter=''){
 const overlay=document.getElementById('bane-food-overlay'),list=library.filter(f=>f.name.toLowerCase().includes(filter.toLowerCase()));
 overlay.innerHTML=`<div class="food-modal"><div class="food-head"><div><small>PERSONAL LIBRARY</small><h2>Food Library</h2></div><button id="food-close">Close</button></div><p>Tap a food to add it to today's log. Weight-based foods use ounces; other foods use servings.</p><input id="food-search" placeholder="Search foods…" value="${esc(filter)}"><div class="food-list">${list.map(f=>`<button class="food-card" data-food="${esc(f.id)}"><div><b>${esc(f.name)}</b><span>${esc(f.defaultServing)}</span></div><strong>${f.caloriesPerUnit} cal · ${f.proteinPerUnit}g P · ${Math.max(0,f.carbsPerUnit-f.fiberPerUnit)}g net C</strong></button>`).join('')||'<p>No foods found.</p>'}</div><div class="food-actions"><button id="food-import-logged">Add logged foods to library</button><button id="food-new" class="primary">Create Food</button></div><div id="food-form"></div></div>`;
 overlay.classList.add('open');
 document.getElementById('food-close').onclick=()=>overlay.remove();
 document.getElementById('food-search').oninput=e=>render(e.target.value);
 overlay.querySelectorAll('[data-food]').forEach(b=>b.onclick=()=>quickAdd(b.dataset.food));
 document.getElementById('food-import-logged').onclick=importLogged;
 document.getElementById('food-new').onclick=()=>form();
}
function quickAdd(id){const f=library.find(x=>x.id===id);if(!f)return;const amount=prompt(`${f.name}: enter ${f.servingUnit==='oz'?'weight in ounces':'number of servings'}.`,f.servingUnit==='oz'?'4':'1');if(amount===null)return;try{const m=calc(f,amount),s=loadState();s.nutrition.push({date:today(),meal:'Quick Add',food:f.name,quantity:`${amount} ${f.servingUnit}`,...m});if(!saveState(s))throw new Error('Could not save today\'s log.');window.location.reload()}catch(e){alert(e.message)}}
function form(existing=null){const box=document.getElementById('food-form');box.innerHTML=`<div class="food-editor"><h3>${existing?'Edit Food':'Create Food'}</h3><input id="fn" placeholder="Food name" value="${esc(existing?.name)}"><input id="fs" placeholder="Default serving (e.g. 4 oz)" value="${esc(existing?.defaultServing)}"><select id="fu"><option value="serving">serving</option><option value="oz">oz</option><option value="lb">lb</option><option value="item">item</option><option value="packet">packet</option><option value="cup">cup</option><option value="handful">handful</option><option value="patty">patty</option></select><input id="fc" type="number" step=".1" placeholder="Calories per unit" value="${existing?.caloriesPerUnit??''}"><input id="fp" type="number" step=".1" placeholder="Protein per unit" value="${existing?.proteinPerUnit??''}"><input id="fcarb" type="number" step=".1" placeholder="Carbs per unit" value="${existing?.carbsPerUnit??''}"><input id="ff" type="number" step=".1" placeholder="Fiber per unit" value="${existing?.fiberPerUnit??''}"><button id="food-save" class="primary">Save Food</button></div>`;document.getElementById('fu').value=existing?.servingUnit||'serving';document.getElementById('food-save').onclick=()=>{const f={id:existing?.id||crypto.randomUUID(),name:document.getElementById('fn').value.trim(),defaultServing:document.getElementById('fs').value.trim()||'1 serving',servingUnit:document.getElementById('fu').value,caloriesPerUnit:+document.getElementById('fc').value||0,proteinPerUnit:+document.getElementById('fp').value||0,carbsPerUnit:+document.getElementById('fcarb').value||0,fiberPerUnit:+document.getElementById('ff').value||0};if(!f.name){alert('Enter a food name.');return}library=existing?library.map(x=>x.id===f.id?f:x):[...library,f];save();render()}}
function importLogged(){const s=loadState(),seen=new Set(library.map(f=>f.name.toLowerCase()));let added=0;for(const x of s.nutrition){if(!x.food||seen.has(String(x.food).toLowerCase()))continue;const q=String(x.quantity||'1').match(/([0-9.]+)/),amount=+(q?.[1]||1),u=String(x.quantity||'serving').replace(String(amount),'').trim()||'serving';library.push({id:crypto.randomUUID(),name:x.food,defaultServing:x.quantity||'1 serving',servingUnit:u,caloriesPerUnit:(+x.calories||0)/amount,proteinPerUnit:(+x.protein||0)/amount,carbsPerUnit:(+x.carbs||0)/amount,fiberPerUnit:(+x.fiber||0)/amount});seen.add(String(x.food).toLowerCase());added++}save();alert(`${added} new food${added===1?'':'s'} added from your logged meals.`);render()}
await seed();
function install(){if(document.getElementById('bane-food-button'))return;const nav=document.querySelector('aside nav');if(!nav)return;const b=document.createElement('button');b.id='bane-food-button';b.className='nav';b.textContent='Food Library';b.onclick=open;nav.appendChild(b)}
const timer=setInterval(()=>{install();if(document.getElementById('bane-food-button'))clearInterval(timer)},100);