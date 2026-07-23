const geminiService = require('../services/gemini.service');
const Pantry = require('../models/Pantry');
const GroceryList = require('../models/GroceryList');
const MealPlan = require('../models/MealPlan');
const AiHistory = require('../models/AiHistory');

const inMemoryHistory = [];
const inMemoryMealPlans = new Map();

const getSmartRecipes = async (req, res) => {
  try {
    let pantryItems = [];
    const customPantry = req.body.preferences?.customPantry;

    if (customPantry && Array.isArray(customPantry)) {
      pantryItems = customPantry.map(item => {
        if (typeof item === 'string') {
          return { name: item, quantity: 1, unit: 'unid' };
        }
        return item;
      });
    } else {
      try {
        const pantry = await Pantry.findOne({ user: req.user.id });
        pantryItems = pantry ? pantry.items : [];
      } catch (e) {
        const pantryController = require('./pantryController');
        if (pantryController.inMemoryPantries && pantryController.inMemoryPantries.has(req.user.id)) {
          pantryItems = pantryController.inMemoryPantries.get(req.user.id);
        } else {
          pantryItems = [
            { name: 'Pollo', quantity: 1, unit: 'kg' },
            { name: 'Tomate', quantity: 4, unit: 'unid' },
            { name: 'Cebolla', quantity: 2, unit: 'unid' },
            { name: 'Arroz', quantity: 1, unit: 'kg' },
            { name: 'Queso', quantity: 200, unit: 'g' }
          ];
        }
      }
    }

    const recipes = await geminiService.generateSmartRecipes(pantryItems, req.body.preferences || {});

    try {
      await AiHistory.create({
        user: req.user.id,
        actionType: 'SMART_RECIPES',
        promptInput: { pantryCount: pantryItems.length },
        aiResponse: recipes,
      });
    } catch (e) {
      inMemoryHistory.unshift({
        _id: 'h_' + Date.now(),
        actionType: 'SMART_RECIPES',
        aiResponse: recipes,
        createdAt: new Date()
      });
    }

    res.json({ success: true, recipes });
  } catch (error) {
    console.error('Smart Recipes Error:', error);
    res.status(500).json({ success: false, message: 'Error al generar recetas inteligentes con Gemini.' });
  }
};

// @desc Optimize active cart
// @route POST /api/ai/optimize-cart
const optimizeActiveCart = async (req, res) => {
  try {
    let groceryItems = [];
    let pantryItems = [];
    try {
      const groceryList = await GroceryList.findOne({ user: req.user.id, status: 'active' });
      const pantry = await Pantry.findOne({ user: req.user.id });
      groceryItems = groceryList ? groceryList.items : [];
      pantryItems = pantry ? pantry.items : [];
    } catch (e) {
      groceryItems = [{ name: 'Leche de Almendras' }, { name: 'Huevos' }];
    }

    const result = await geminiService.optimizeCart(groceryItems, pantryItems, req.body.preferences || {});

    try {
      await AiHistory.create({
        user: req.user.id,
        actionType: 'CART_OPTIMIZER',
        promptInput: { groceryCount: groceryItems.length },
        aiResponse: result,
      });
    } catch (e) {
      inMemoryHistory.unshift({
        _id: 'h_' + Date.now(),
        actionType: 'CART_OPTIMIZER',
        aiResponse: result,
        createdAt: new Date()
      });
    }

    res.json({ success: true, result });
  } catch (error) {
    console.error('Optimize Cart Error:', error);
    res.status(500).json({ success: false, message: 'Error al optimizar el carrito de compras.' });
  }
};

// @desc Generate 7-day weekly meal plan ⭐
// @route POST /api/ai/weekly-planner
const generateWeeklyPlan = async (req, res) => {
  try {
    const preferences = req.body.preferences || {};
    const planData = await geminiService.generateWeeklyMealPlan(preferences);

    let newPlan = {
      _id: 'mp_' + Date.now(),
      title: planData.title || 'Plan Semanal Personalizado',
      preferencesSnapshot: preferences,
      days: planData.days,
      isActive: true,
    };

    try {
      await MealPlan.updateMany({ user: req.user.id }, { isActive: false });
      newPlan = await MealPlan.create({
        user: req.user.id,
        title: planData.title || 'Plan Semanal Personalizado',
        preferencesSnapshot: preferences,
        days: planData.days,
        isActive: true,
      });
    } catch (e) {
      // In-memory fallback
      inMemoryMealPlans.set(req.user.id, newPlan);
    }

    try {
      await AiHistory.create({
        user: req.user.id,
        actionType: 'WEEKLY_PLANNER',
        promptInput: preferences,
        aiResponse: newPlan,
      });
    } catch (e) {
      inMemoryHistory.unshift({
        _id: 'h_' + Date.now(),
        actionType: 'WEEKLY_PLANNER',
        aiResponse: newPlan,
        createdAt: new Date()
      });
    }

    res.json({ success: true, mealPlan: newPlan });
  } catch (error) {
    console.error('Weekly Planner Error:', error);
    res.status(500).json({ success: false, message: 'Error al generar el plan semanal con IA.' });
  }
};

// @desc Generate grocery list from active meal plan (subtracting pantry items)
// @route POST /api/ai/generate-grocery-from-plan
const generateGroceryFromPlan = async (req, res) => {
  try {
    // 1. Get user active meal plan
    let plan = null;
    try {
      plan = await MealPlan.findOne({ user: req.user.id, isActive: true });
    } catch (e) {
      plan = inMemoryMealPlans.get(req.user.id);
    }

    if (!plan || !plan.days || plan.days.length === 0) {
      return res.status(400).json({ success: false, message: 'No tienes un plan semanal activo. Por favor genera uno primero.' });
    }

    // 2. Extract and consolidate ingredients from all meals of all days
    const requiredIngredients = new Map();

    plan.days.forEach(day => {
      ['breakfast', 'lunch', 'snack', 'dinner'].forEach(mealType => {
        const meal = day[mealType];
        if (meal && Array.isArray(meal.ingredients)) {
          meal.ingredients.forEach(ing => {
            if (!ing || !ing.name) return;
            const name = ing.name.trim().toLowerCase();
            const quantity = Number(ing.quantity) || 0;
            const unit = (ing.unit || 'unid').toLowerCase();

            if (name) {
              const key = `${name}_${unit}`;
              if (requiredIngredients.has(key)) {
                const existing = requiredIngredients.get(key);
                existing.quantity += quantity;
              } else {
                requiredIngredients.set(key, {
                  name: ing.name.trim(),
                  quantity,
                  unit: ing.unit || 'unid',
                  category: ing.category || 'General'
                });
              }
            }
          });
        }
      });
    });

    // 3. Fetch current user pantry stock to deduct what they already have
    let pantryItems = [];
    try {
      const pantry = await Pantry.findOne({ user: req.user.id });
      pantryItems = pantry ? pantry.items : [];
    } catch (e) {
      const pantryController = require('./pantryController');
      if (pantryController.inMemoryPantries && pantryController.inMemoryPantries.has(req.user.id)) {
        pantryItems = pantryController.inMemoryPantries.get(req.user.id);
      }
    }

    // Map pantry items for fast case-insensitive lookup
    const pantryMap = new Map();
    pantryItems.forEach(item => {
      const name = item.name.trim().toLowerCase();
      const unit = (item.unit || 'unid').toLowerCase();
      const key = `${name}_${unit}`;
      pantryMap.set(key, (Number(item.quantity) || 0));
    });

    // 4. Subtract pantry stock and create final grocery list
    const groceryItems = [];
    requiredIngredients.forEach((ing, key) => {
      let neededQty = ing.quantity;
      if (pantryMap.has(key)) {
        neededQty -= pantryMap.get(key);
      }

      if (neededQty > 0) {
        groceryItems.push({
          name: ing.name,
          category: ing.category,
          quantity: neededQty,
          unit: ing.unit,
          isBought: false
        });
      }
    });

    // 5. Save the generated grocery list as active grocery list
    const groceryController = require('./groceryController');
    let list;
    try {
      list = await GroceryList.findOne({ user: req.user.id, status: 'active' });
      if (!list) {
        list = new GroceryList({ user: req.user.id });
      }
      list.title = 'Lista del Plan Semanal';
      list.items = groceryItems;
      list.aiOptimizationNote = 'Generada a partir de los ingredientes de tu menú semanal, restando los que ya tienes en la alacena.';
      await list.save();
    } catch (e) {
      list = {
        title: 'Lista del Plan Semanal',
        items: groceryItems.map((it, idx) => ({ _id: 'g_' + idx + '_' + Date.now(), ...it })),
        aiOptimizationNote: 'Generada a partir de los ingredientes de tu menú semanal (Caché Offline).'
      };
      if (groceryController.inMemoryGrocery) {
        groceryController.inMemoryGrocery.set(req.user.id, list);
      }
    }

    res.json({
      success: true,
      message: '¡Lista de compras generada con éxito a partir de tu menú! Se descontaron los ingredientes disponibles en tu despensa.',
      groceryList: list
    });
  } catch (error) {
    console.error('Generate Grocery from Plan error:', error);
    res.status(500).json({ success: false, message: 'Error al generar la lista de compras desde el plan.' });
  }
};

// @desc Get AI interaction history
// @route GET /api/ai/history
const getAiHistory = async (req, res) => {
  try {
    let history = [];
    try {
      history = await AiHistory.find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .limit(20);
    } catch (e) {
      history = inMemoryHistory;
    }
    res.json({ success: true, history: history.length > 0 ? history : inMemoryHistory });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener el historial de IA.' });
  }
};

// @desc Get active weekly meal plan
// @route GET /api/ai/weekly-planner
const getActiveMealPlan = async (req, res) => {
  try {
    let plan;
    try {
      plan = await MealPlan.findOne({ user: req.user.id, isActive: true });
    } catch (e) {
      plan = inMemoryMealPlans.get(req.user.id) || null;
    }
    res.json({ success: true, mealPlan: plan });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener el plan semanal.' });
  }
};

// @desc Save/update active weekly meal plan
// @route POST /api/ai/weekly-planner/save
const saveActiveMealPlan = async (req, res) => {
  try {
    const { mealPlan } = req.body;
    let savedPlan = mealPlan;
    try {
      await MealPlan.updateMany({ user: req.user.id }, { isActive: false });
      mealPlan.user = req.user.id;
      mealPlan.isActive = true;
      if (mealPlan._id && (mealPlan._id.startsWith('mp_') || mealPlan._id.startsWith('p_'))) {
        delete mealPlan._id;
      }
      savedPlan = await MealPlan.create(mealPlan);
    } catch (e) {
      mealPlan.isActive = true;
      inMemoryMealPlans.set(req.user.id, mealPlan);
      savedPlan = mealPlan;
    }
    res.json({ success: true, mealPlan: savedPlan });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al guardar el plan semanal.' });
  }
};

module.exports = {
  getSmartRecipes,
  optimizeActiveCart,
  generateWeeklyPlan,
  generateGroceryFromPlan,
  getAiHistory,
  getActiveMealPlan,
  saveActiveMealPlan
};
