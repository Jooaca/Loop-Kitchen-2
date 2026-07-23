const express = require('express');
const router = express.Router();
const {
  getSmartRecipes,
  optimizeActiveCart,
  generateWeeklyPlan,
  generateGroceryFromPlan,
  getAiHistory
} = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/recipes', protect, getSmartRecipes);
router.post('/optimize-cart', protect, optimizeActiveCart);
router.post('/weekly-planner', protect, generateWeeklyPlan);
router.post('/generate-grocery-from-plan', protect, generateGroceryFromPlan);
router.get('/history', protect, getAiHistory);

module.exports = router;
