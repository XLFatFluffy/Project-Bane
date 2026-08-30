import assert from 'node:assert/strict';
import test from 'node:test';
import {filterExercises} from '../exercise-library.js';

const db=[
 {id:'bench',name:'Barbell Bench Press',muscleGroups:['Chest','Triceps'],equipment:'Barbell',movement:'Horizontal Push'},
 {id:'row',name:'Barbell Row',muscleGroups:['Back','Biceps'],equipment:'Barbell',movement:'Horizontal Pull'},
 {id:'fly',name:'Dumbbell Fly',muscleGroups:['Chest'],equipment:'Dumbbell',movement:'Horizontal Adduction'}
];

test('search finds exercises by name and movement',()=>{
 assert.equal(filterExercises(db,{query:'bench'}).length,1);
 assert.equal(filterExercises(db,{query:'horizontal pull'})[0].id,'row');
});

test('filters by muscle group and equipment',()=>{
 assert.equal(filterExercises(db,{muscleGroup:'Chest'}).length,2);
 assert.equal(filterExercises(db,{equipment:'Dumbbell'}).length,1);
 assert.equal(filterExercises(db,{muscleGroup:'Chest',equipment:'Barbell'})[0].id,'bench');
});
