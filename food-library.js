export const FOOD_LIBRARY_KEY = 'project-bane.food-library.v1';
export const DEFAULT_FOOD_LIBRARY = [];

export function normalizeFood(food={}) {
  return {
    id: String(food.id || crypto.randomUUID()),
    name: String(food.name || '').trim(),
    defaultServing: String(food.defaultServing || '1 serving').trim(),
    calories: Number(food.calories) || 0,
    protein: Number(food.protein) || 0,
    carbs: Number(food.carbs) || 0,
    fiber: Number(food.fiber) || 0
  };
}

export function loadFoodLibrary() {
  try {
    const raw = localStorage.getItem(FOOD_LIBRARY_KEY);
    const list = raw ? JSON.parse(raw) : DEFAULT_FOOD_LIBRARY;
    return Array.isArray(list) ? list.map(normalizeFood).filter(x => x.name) : [];
  } catch (e) {
    console.error('Bane food library could not be read', e);
    return [];
  }
}

export function saveFoodLibrary(list) {
  localStorage.setItem(FOOD_LIBRARY_KEY, JSON.stringify(list.map(normalizeFood)));
}

export function scaleFood(food, servings=1) {
  const n = Number(servings);
  if (!Number.isFinite(n) || n <= 0) throw new Error('Servings must be greater than zero.');
  return {
    calories: Math.round(food.calories*n),
    protein: Math.round(food.protein*n*10)/10,
    carbs: Math.round(food.carbs*n*10)/10,
    fiber: Math.round(food.fiber*n*10)/10,
    netCarbs: Math.round((food.carbs-food.fiber)*n*10)/10
  };
}

export function makeNutritionEntry(food, servings, date, meal) {
  return {date, meal, food:food.name, quantity:`${servings} ${food.defaultServing}`, ...scaleFood(food, servings)};
}
