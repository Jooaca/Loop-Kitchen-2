const { generateSmartRecipes, generateWeeklyMealPlan } = require('./services/gemini.service');

async function testFullAi() {
  console.log('--- Probando Recetas Inteligentes con Proxy de la Facultad ---');
  const recipes = await generateSmartRecipes([
    { name: 'Pollo', quantity: 1, unit: 'kg' },
    { name: 'Tomate', quantity: 3, unit: 'unid' },
    { name: 'Cebolla', quantity: 1, unit: 'unid' }
  ]);
  console.log('Recetas IA:', JSON.stringify(recipes, null, 2));

  console.log('--- Probando Plan Semanal 7 Días con Proxy ---');
  const plan = await generateWeeklyMealPlan({ householdSize: 2, weeklyBudget: 150 });
  console.log('Plan Semanal IA Título:', plan.title);
  console.log('Días generados:', plan.days ? plan.days.length : 0);
}

testFullAi();
