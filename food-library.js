export const FOOD_LIBRARY_KEY = 'project-bane.food-library.v1';
export const DEFAULT_FOOD_LIBRARY = [];

export function normalizeFood(food={}) {
  return {
    id: String(food.id || crypto.randomUUID()),
    name: String(food.name || '').trim(),
    defaultServing: String(food.defaultServing || '1 serving').trim(),
    servingUnit: String(food.servingUnit || 'serving').trim(),
    caloriesPerUnit: Number(food.caloriesPerUnit ?? food.calories) || 0,
    proteinPerUnit: Number(food.proteinPerUnit ?? food.protein) || 0,
    carbsPerUnit: Number(food.carbsPerUnit ?? food.carbs) || 0,
    fiberPerUnit: Number(food.fiberPerUnit ?? food.fiber) || 0,
    calorieFormula: String(food.calorieFormula || 'units × caloriesPerUnit'),
    proteinFormula: String(food.proteinFormula || 'units × proteinPerUnit'),
    carbFormula: String(food.carbFormula || 'units × carbsPerUnit'),
    fiberFormula: String(food.fiberFormula || 'units × fiberPerUnit'),
    source: String(food.source || 'User-created')
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

export function calculateFoodMacros(food, amount) {
  const units = Number(amount);
  if (!Number.isFinite(units) || units <= 0) throw new Error('Amount must be greater than zero.');
  const calories = units * food.caloriesPerUnit;
  const protein = units * food.proteinPerUnit;
  const carbs = units * food.carbsPerUnit;
  const fiber = units * food.fiberPerUnit;
  return {
    calories: Math.round(calories),
    protein: Math.round(protein * 10) / 10,
    carbs: Math.round(carbs * 10) / 10,
    fiber: Math.round(fiber * 10) / 10,
    netCarbs: Math.round((carbs - fiber) * 10) / 10,
    calculatedFrom: {amount: units, unit: food.servingUnit}
  };
}

export function calculateChickenByWeight(weightOz) {
  const oz = Number(weightOz);
  if (!Number.isFinite(oz) || oz <= 0) throw new Error('Chicken weight must be greater than zero.');
  // Bane's logged-food estimate: 187 calories and 35g protein per 4 oz.
  return calculateFoodMacros({caloriesPerUnit:46.75, proteinPerUnit:8.75, carbsPerUnit:0, fiberPerUnit:0, servingUnit:'oz'}, oz);
}

export function makeNutritionEntry(food, amount, date, meal) {
  const macros = calculateFoodMacros(food, amount);
  return {date, meal, food:food.name, quantity:`${amount} ${food.servingUnit}`, ...macros};
}
