import assert from 'node:assert/strict';
import fs from 'node:fs';
const p=JSON.parse(fs.readFileSync(new URL('../data/program-v2.json',import.meta.url)));
const n=JSON.parse(fs.readFileSync(new URL('../data/nutrition-canonical.json',import.meta.url)));
assert.equal(p.schemaVersion,1);
for(const d of ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY']){
  assert.ok(p.days[d]?.focus,`${d} focus missing`);
  assert.ok(p.days[d]?.exercises?.length,`${d} exercises missing`);
}
assert.equal(p.days.WEDNESDAY.exercises.find(x=>x.exercise==='Upright Row').reps,'10–15');
assert.equal(n.length,15);
for(const x of n){
  assert.match(x.date,/^\d{4}-\d{2}-\d{2}$/);
  if(x.netCarbs!==null) assert.equal(x.netCarbs,x.carbs-x.fiber);
}
console.log('Project Bane canonical v2 contract: PASS');
