import assert from 'node:assert/strict';
import fs from 'node:fs';

const program = JSON.parse(fs.readFileSync(new URL('../data/program.json', import.meta.url)));
const nutrition = JSON.parse(fs.readFileSync(new URL('../data/nutrition.json', import.meta.url)));
const manifest = JSON.parse(fs.readFileSync(new URL('../data/source-manifest.json', import.meta.url)));

assert.equal(program.block, 'Block 1');
assert.equal(program.weeks, 'Weeks 1–4');
for (const day of ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY']) {
  assert.ok(program.days[day], `missing ${day}`);
  assert.ok(program.conditioning[day], `missing conditioning for ${day}`);
}
assert.equal(program.days.WEDNESDAY.exercises.find(x => x.exercise === 'Upright Row')?.reps, '10–15');
assert.equal(program.days.WEDNESDAY.exercises.find(x => x.exercise === 'Barbell Shrug')?.sets, 4);
assert.ok(program.days.THURSDAY.exercises.some(x => x.exercise === 'Barbell Row'));
assert.ok(program.days.SATURDAY.exercises.length === 0);
assert.ok(program.conditioning.SATURDAY.core.includes('Plank'));
assert.ok(Array.isArray(nutrition));
assert.ok(nutrition.every(x => x.date && x.food));
assert.ok(nutrition.every(x => x.netCarbs === null || Number.isFinite(Number(x.netCarbs))));
assert.equal(manifest.schemaVersion, 1);
assert.equal(manifest.rules.historyIsImmutable, true);
assert.equal(manifest.rules.sourcePreviewBeforeApply, true);
console.log('Bane data integrity checks passed.');
