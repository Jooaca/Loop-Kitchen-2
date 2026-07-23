const GroceryList = require('../models/GroceryList');
const Pantry = require('../models/Pantry');
const pantryController = require('./pantryController');

const inMemoryGrocery = new Map();

// @desc Get active grocery list
// @route GET /api/grocery
const getGroceryList = async (req, res) => {
  try {
    let list;
    try {
      list = await GroceryList.findOne({ user: req.user.id, status: 'active' });
      if (!list) {
        list = await GroceryList.create({ user: req.user.id, title: 'Lista de Compras Semanal', items: [] });
      }
    } catch (e) {
      if (!inMemoryGrocery.has(req.user.id)) {
        inMemoryGrocery.set(req.user.id, {
          title: 'Lista de Compras Semanal',
          items: [
            { _id: 'g1', name: 'Leche de Almendras', quantity: 2, unit: 'l', isBought: false },
            { _id: 'g2', name: 'Avena', quantity: 1, unit: 'kg', isBought: true },
            { _id: 'g3', name: 'Huevos', quantity: 12, unit: 'unid', isBought: false }
          ]
        });
      }
      list = inMemoryGrocery.get(req.user.id);
    }
    res.json({ success: true, groceryList: list });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener la lista de compras.' });
  }
};

// @desc Add or replace items in active grocery list
// @route POST /api/grocery
const saveGroceryList = async (req, res) => {
  try {
    const { items, title, aiOptimizationNote } = req.body;
    let list;
    try {
      list = await GroceryList.findOne({ user: req.user.id, status: 'active' });
      if (!list) {
        list = new GroceryList({ user: req.user.id });
      }
      if (title) list.title = title;
      if (items) list.items = items;
      if (aiOptimizationNote !== undefined) list.aiOptimizationNote = aiOptimizationNote;
      await list.save();
    } catch (e) {
      list = inMemoryGrocery.get(req.user.id) || { title: 'Lista de Compras Semanal', items: [] };
      if (title) list.title = title;
      if (items) list.items = items.map((it, idx) => ({ _id: it._id || 'g_' + idx + '_' + Date.now(), ...it }));
      if (aiOptimizationNote !== undefined) list.aiOptimizationNote = aiOptimizationNote;
      inMemoryGrocery.set(req.user.id, list);
    }
    res.json({ success: true, message: 'Lista de compras guardada', groceryList: list });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al guardar la lista de compras.' });
  }
};

// @desc Toggle bought status for an item
// @route PATCH /api/grocery/toggle/:itemId
const toggleBoughtItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    let list;
    try {
      list = await GroceryList.findOne({ user: req.user.id, status: 'active' });
      if (list) {
        const item = list.items.id(itemId);
        if (item) {
          item.isBought = !item.isBought;
          if (item.isBought) {
            // Add to MongoDB Pantry
            let pantry = await Pantry.findOne({ user: req.user.id });
            if (!pantry) {
              pantry = new Pantry({ user: req.user.id, items: [] });
            }
            const existingIndex = pantry.items.findIndex(
              pi => pi.name.toLowerCase().trim() === item.name.toLowerCase().trim()
            );
            if (existingIndex > -1) {
              pantry.items[existingIndex].quantity += (Number(item.quantity) || 1);
            } else {
              pantry.items.push({
                name: item.name.trim(),
                category: item.category || 'General',
                quantity: Number(item.quantity) || 1,
                unit: item.unit || 'unid',
                updatedAt: new Date()
              });
            }
            await pantry.save();
          }
          await list.save();
        }
      }
    } catch (e) {
      list = inMemoryGrocery.get(req.user.id);
      if (list) {
        const item = list.items.find(i => i._id === itemId);
        if (item) {
          item.isBought = !item.isBought;
          if (item.isBought) {
            // Add to in-memory pantry
            if (pantryController.inMemoryPantries) {
              if (!pantryController.inMemoryPantries.has(req.user.id)) {
                pantryController.inMemoryPantries.set(req.user.id, []);
              }
              const pList = pantryController.inMemoryPantries.get(req.user.id);
              const existing = pList.find(pi => pi.name.toLowerCase().trim() === item.name.toLowerCase().trim());
              if (existing) {
                existing.quantity += (Number(item.quantity) || 1);
              } else {
                pList.push({
                  _id: 'p_' + Date.now(),
                  name: item.name.trim(),
                  category: item.category || 'General',
                  quantity: Number(item.quantity) || 1,
                  unit: item.unit || 'unid'
                });
              }
            }
          }
        }
      }
    }
    res.json({ success: true, groceryList: list });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar el producto.' });
  }
};

module.exports = { getGroceryList, saveGroceryList, toggleBoughtItem };
