export function renderExerciseLibrary(exercises, root, onAdd) {
  root.innerHTML=`<div class="library-toolbar"><input id="exercise-search" placeholder="Search exercises..."><select id="exercise-muscle"><option value="">All muscle groups</option></select><select id="exercise-equipment"><option value="">All equipment</option></select></div><div id="exercise-results" class="exercise-results"></div>`;
  const groups=[...new Set(exercises.flatMap(e=>e.muscleGroups||[]))].sort();
  const equipment=[...new Set(exercises.map(e=>e.equipment).filter(Boolean))].sort();
  const muscle=root.querySelector('#exercise-muscle'), equip=root.querySelector('#exercise-equipment');
  groups.forEach(x=>muscle.insertAdjacentHTML('beforeend',`<option>${x}</option>`));
  equipment.forEach(x=>equip.insertAdjacentHTML('beforeend',`<option>${x}</option>`));
  const refresh=()=>{const q=root.querySelector('#exercise-search').value.toLowerCase(),m=muscle.value,e=equip.value; const list=exercises.filter(x=>(!q||`${x.name} ${x.equipment} ${x.movement} ${(x.muscleGroups||[]).join(' ')}`.toLowerCase().includes(q))&&(!m||(x.muscleGroups||[]).includes(m))&&(!e||x.equipment===e)); root.querySelector('#exercise-results').innerHTML=list.map(x=>`<button class="exercise-card" data-id="${x.id}"><strong>${x.name}</strong><span>${(x.muscleGroups||[]).join(' · ')}</span><small>${x.equipment}${x.movement?' · '+x.movement:''}</small></button>`).join('')||'<p>No exercises found.</p>'; root.querySelectorAll('.exercise-card').forEach(b=>b.onclick=()=>onAdd(exercises.find(x=>x.id===b.dataset.id)));};
  root.querySelector('#exercise-search').oninput=refresh; muscle.onchange=refresh; equip.onchange=refresh; refresh();
}
