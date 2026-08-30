import assert from 'node:assert/strict';
import test from 'node:test';

const scale = (food, servings) => ({
  calories: Math.round(food.calories * servings),
  protein: Math.round(food.protein * servings * 10) / 10,
  carbs: Math.round(food.carbs * servings * 10) / 10,
  fiber: Math.round(food.fiber * servings * 10) / 10
});

const addFromLibrary = (library, id, servings, date, meal) => {
  const food = library.find(x => x.id === id);
  if (!food) throw new Error('Food not found');
  return { date, meal, food: food.name, quantity: `${servings} ${food.defaultServing}`, ...scale(food, servings), netCarbs: Math.round((food.carbs-food.fiber)*servings*10)/10 };
};

test('scales a library food when quick-added', () => {
  const food={id:'chicken',name:'Chicken breast',defaultServing:'4 oz',calories:187,protein:35,carbs:0,fiber:0};
  assert.deepEqual(addFromLibrary([food],'chicken',2,'2026-08-30','Lunch'),{date:'2026-08-30',meal:'Lunch',food:'Chicken breast',quantity:'2 4 oz',calories:374,protein:70,carbs:0,fiber:0,netCarbs:0});
});

test('missing library food fails instead of silently logging bad data', () => {
  assert.throws(()=>addFromLibrary([],'missing',1,'2026-08-30','Lunch'),/Food not found/);
});

test('library entries have independent ids and serving defaults', () => {
  const library=[{id:'eggs',name:'Eggs',defaultServing:'2 eggs',calories:140,protein:12,carbs:1,fiber:0}];
  assert.equal(library[0].id,'eggs');
  assert.equal(library[0].defaultServing,'2 eggs');
});
