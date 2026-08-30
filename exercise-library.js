export const EXERCISE_LIBRARY_KEY = 'project-bane.exercise-library.v1';

export function normalizeExercise(exercise={}) {
  return {
    id: String(exercise.id || crypto.randomUUID()),
    name: String(exercise.name || '').trim(),
    muscleGroups: Array.isArray(exercise.muscleGroups) ? exercise.muscleGroups.map(String) : [],
    equipment: String(exercise.equipment || 'Other'),
    movement: String(exercise.movement || ''),
    notes: String(exercise.notes || '')
  };
}

export function filterExercises(exercises, {query='', muscleGroup='', equipment=''}={}) {
  const q = query.trim().toLowerCase();
  return exercises.filter(raw => {
    const e = normalizeExercise(raw);
    const matchesQuery = !q || [e.name,e.equipment,e.movement,...e.muscleGroups].join(' ').toLowerCase().includes(q);
    const matchesMuscle = !muscleGroup || e.muscleGroups.includes(muscleGroup);
    const matchesEquipment = !equipment || e.equipment === equipment;
    return matchesQuery && matchesMuscle && matchesEquipment;
  });
}
