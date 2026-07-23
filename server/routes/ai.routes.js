const express = require('express');
const router = express.Router();
const {
  getSmartRecipes,
  optimizeActiveCart,
  generateWeeklyPlan,
  generateGroceryFromPlan,
  getAiHistory,
  getActiveMealPlan,
  saveActiveMealPlan
} = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/recipes', protect, getSmartRecipes);
router.post('/optimize-cart', protect, optimizeActiveCart);
router.get('/weekly-planner', protect, getActiveMealPlan);
router.post('/weekly-planner', protect, generateWeeklyPlan);
router.post('/weekly-planner/save', protect, saveActiveMealPlan);
router.post('/generate-grocery-from-plan', protect, generateGroceryFromPlan);
router.get('/history', protect, getAiHistory);

module.exports = router;
