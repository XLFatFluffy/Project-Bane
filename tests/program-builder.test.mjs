import assert from 'node:assert/strict';
import test from 'node:test';
import {createEmptyProgram,addExercise,removeExercise,validateProgram} from '../program-builder.js';

test('creates a complete seven-day program shell',()=>{const p=createEmptyProgram('Block 2'); assert.equal(Object.keys(p.days).length,7); assert.equal(p.block,'Block 2');});
test('adds and removes an exercise without losing configuration',()=>{const p=createEmptyProgram(); const e={id:'bench',name:'Bench Press'}; addExercise(p,'MONDAY',e,{sets:4,reps:'8–12',section:'Primary',rest:'2 min'}); assert.equal(p.days.MONDAY.exercises[0].sets,4); removeExercise(p,'MONDAY',0); assert.equal(p.days.MONDAY.exercises.length,0);});
test('rejects an incomplete program',()=>{assert.ok(validateProgram({block:'Block 1',days:{},conditioning:{}}).length>0);});
