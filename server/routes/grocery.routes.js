const express = require('express');
const router = express.Router();
const { getGroceryList, saveGroceryList, toggleBoughtItem } = require('../controllers/groceryController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, getGroceryList);
router.post('/', protect, saveGroceryList);
router.patch('/toggle/:itemId', protect, toggleBoughtItem);

module.exports = router;
