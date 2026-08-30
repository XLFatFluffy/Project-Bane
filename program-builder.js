export const BUILDER_SCHEMA_VERSION=1;
export const PROGRAM_DAYS=['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'];

export function createEmptyProgram(block='Block 1') {
  return {schemaVersion:BUILDER_SCHEMA_VERSION,block,days:Object.fromEntries(PROGRAM_DAYS.map(day=>[day,{focus:'',exercises:[],notes:''}])),conditioning:Object.fromEntries(PROGRAM_DAYS.map(day=>[day,{cardio:'',intent:'',emphasis:'',core:''}]))};
}
export function addExercise(program,day,exercise,config={}) {
  if(!program.days?.[day]) throw new Error(`Unknown day: ${day}`);
  program.days[day].exercises.push({exerciseId:exercise.id,exercise:exercise.name,section:config.section||'Primary',sets:config.sets||3,reps:config.reps||'8–12',rest:config.rest||''});
  return program;
}
export function removeExercise(program,day,index) {
  if(!program.days?.[day]) throw new Error(`Unknown day: ${day}`);
  if(!Number.isInteger(index)||index<0||index>=program.days[day].exercises.length) throw new Error('Exercise index out of range');
  program.days[day].exercises.splice(index,1); return program;
}
export function validateProgram(program) {
  const errors=[]; if(!program?.block) errors.push('Program needs a block name.');
  for(const day of PROGRAM_DAYS){if(!program.days?.[day]) errors.push(`Missing ${day}.`); if(!program.conditioning?.[day]) errors.push(`Missing conditioning for ${day}.`);}
  return errors;
}
