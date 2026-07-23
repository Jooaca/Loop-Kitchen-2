const express = require('express');
const router = express.Router();
const { getPantry, addPantryItem, deletePantryItem } = require('../controllers/pantryController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, getPantry);
router.post('/', protect, addPantryItem);
router.delete('/:itemId', protect, deletePantryItem);

module.exports = router;
