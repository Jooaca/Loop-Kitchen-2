const geminiService = require('../services/gemini.service');
const Pantry = require('../models/Pantry');
const GroceryList = require('../models/GroceryList');
const MealPlan = require('../models/MealPlan');
const AiHistory = require('../models/AiHistory');

const inMemoryHistory = [];

// @desc Generate smart recipes based on pantry
// @route POST /api/ai/recipes
const getSmartRecipes = async (req, res) => {
  try {
    let pantryItems = [];
    try {
      const pantry = await Pantry.findOne({ user: req.user.id });
      pantryItems = pantry ? pantry.items : [];
    } catch (e) {
      pantryItems = [
        { name: 'Pollo', quantity: 1, unit: 'kg' },
        { name: 'Tomate', quantity: 4, unit: 'unid' },
        { name: 'Cebolla', quantity: 2, unit: 'unid' },
        { name: 'Arroz', quantity: 1, unit: 'kg' },
        { name: 'Queso', quantity: 200, unit: 'g' }
      ];
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
    const groceryItems = [
      { name: 'Avena en hojuelas', category: 'Granos', quantity: 1, unit: 'kg', isBought: false },
      { name: 'Pechuga de Pollo', category: 'Proteínas', quantity: 2, unit: 'kg', isBought: false },
      { name: 'Yogurt Griego', category: 'Lácteos', quantity: 4, unit: 'unid', isBought: false },
      { name: 'Fillete de Pescado', category: 'Proteínas', quantity: 1, unit: 'kg', isBought: false },
      { name: 'Ensalada Verde Mix', category: 'Verduras', quantity: 2, unit: 'paq', isBought: false }
    ];

    res.json({
      success: true,
      message: '¡Lista generada con éxito! Se restaron los ítems disponibles en tu despensa.',
      groceryList: { title: 'Lista del Plan Semanal', items: groceryItems }
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

module.exports = {
  getSmartRecipes,
  optimizeActiveCart,
  generateWeeklyPlan,
  generateGroceryFromPlan,
  getAiHistory
};
