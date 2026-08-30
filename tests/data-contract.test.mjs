import assert from 'node:assert/strict';
import fs from 'node:fs';

const program=JSON.parse(fs.readFileSync(new URL('../data/program-canonical.json',import.meta.url)));
const nutrition=JSON.parse(fs.readFileSync(new URL('../data/nutrition-canonical.json',import.meta.url)));

const requiredDays=['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY'];
assert.equal(program.schemaVersion,1);
for(const day of requiredDays){
  assert.ok(program.days[day],`missing ${day}`);
  assert.ok(program.days[day].focus,`${day} missing focus`);
  assert.ok(program.days[day].exercises.length>0,`${day} has no exercises`);
}
for(const [day,entry] of Object.entries(program.conditioning)){
  assert.ok(entry.cardio!==undefined,`${day} missing cardio`);
  assert.ok(entry.core!==undefined,`${day} missing core`);
}
assert.ok(program.source.issues.length>0,'source conflict should remain visible');
assert.equal(nutrition.length,15);
for(const row of nutrition){
  assert.match(row.date,/^\d{4}-\d{2}-\d{2}$/);
  assert.ok(row.food);
  if(row.netCarbs!==null) assert.equal(row.netCarbs,row.carbs-row.fiber);
}
console.log('Project Bane data contract: PASS');
