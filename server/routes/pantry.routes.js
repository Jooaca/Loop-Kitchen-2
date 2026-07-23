const express = require('express');
const router = express.Router();
const { getPantry, addPantryItem, deletePantryItem, useIngredients } = require('../controllers/pantryController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, getPantry);
router.post('/', protect, addPantryItem);
router.post('/use-ingredients', protect, useIngredients);
router.delete('/:itemId', protect, deletePantryItem);

module.exports = router;
