import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import {filterExercises} from '../exercise-library.js';

const db=JSON.parse(fs.readFileSync(new URL('../data/exercises.json',import.meta.url),'utf8'));

test('bundled exercise database contains the canonical Block 1 movements',()=>{
 const required=['Barbell Bench Press','Barbell Row','Barbell Squat','Romanian Deadlift','Overhead Press','Lateral Raise','Rear-Delt Fly','Lat Pulldown','Straight-Arm Pulldown','Barbell Shrug','Leg Extension','Leg Curl'];
 for(const name of required) assert.ok(db.some(e=>e.name===name),`missing ${name}`);
});

test('bundled exercise database has unique ids and names',()=>{
 const ids=db.map(e=>e.id),names=db.map(e=>e.name.toLowerCase());
 assert.equal(new Set(ids).size,ids.length);
 assert.equal(new Set(names).size,names.length);
});

test('canonical database can be filtered by muscle and equipment',()=>{
 assert.ok(filterExercises(db,{muscleGroup:'Traps'}).some(e=>e.name==='Barbell Shrug'));
 assert.ok(filterExercises(db,{equipment:'Barbell'}).some(e=>e.name==='Barbell Bench Press'));
});
