const Pantry = require('../models/Pantry');

const inMemoryPantries = new Map();

// @desc Get user pantry
// @route GET /api/pantry
const getPantry = async (req, res) => {
  try {
    let items = [];
    try {
      let pantry = await Pantry.findOne({ user: req.user.id });
      if (!pantry) {
        pantry = await Pantry.create({ user: req.user.id, items: [] });
      }
      items = pantry.items;
    } catch (e) {
      if (!inMemoryPantries.has(req.user.id)) {
        inMemoryPantries.set(req.user.id, [
          { _id: 'p1', name: 'Pollo', category: 'Proteínas', quantity: 1, unit: 'kg' },
          { _id: 'p2', name: 'Tomate', category: 'Verduras', quantity: 4, unit: 'unid' },
          { _id: 'p3', name: 'Cebolla', category: 'Verduras', quantity: 2, unit: 'unid' },
          { _id: 'p4', name: 'Arroz', category: 'Granos', quantity: 1, unit: 'kg' },
          { _id: 'p5', name: 'Queso', category: 'Lácteos', quantity: 200, unit: 'g' }
        ]);
      }
      items = inMemoryPantries.get(req.user.id);
    }
    res.json({ success: true, pantry: items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener la despensa.' });
  }
};

// @desc Add or update pantry item
// @route POST /api/pantry
const addPantryItem = async (req, res) => {
  try {
    const { name, category, quantity, unit } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'El nombre del ingrediente es obligatorio.' });
    }

    let items = [];
    try {
      let pantry = await Pantry.findOne({ user: req.user.id });
      if (!pantry) {
        pantry = new Pantry({ user: req.user.id, items: [] });
      }

      const existingIndex = pantry.items.findIndex(
        item => item.name.toLowerCase().trim() === name.toLowerCase().trim()
      );

      if (existingIndex > -1) {
        pantry.items[existingIndex].quantity += (Number(quantity) || 1);
        if (category) pantry.items[existingIndex].category = category;
        if (unit) pantry.items[existingIndex].unit = unit;
        pantry.items[existingIndex].updatedAt = new Date();
      } else {
        pantry.items.push({
          name: name.trim(),
          category: category || 'General',
          quantity: Number(quantity) || 1,
          unit: unit || 'unid',
          updatedAt: new Date()
        });
      }

      await pantry.save();
      items = pantry.items;
    } catch (e) {
      if (!inMemoryPantries.has(req.user.id)) {
        inMemoryPantries.set(req.user.id, []);
      }
      const list = inMemoryPantries.get(req.user.id);
      const existing = list.find(i => i.name.toLowerCase().trim() === name.toLowerCase().trim());
      if (existing) {
        existing.quantity += (Number(quantity) || 1);
      } else {
        list.push({
          _id: 'p_' + Date.now(),
          name: name.trim(),
          category: category || 'General',
          quantity: Number(quantity) || 1,
          unit: unit || 'unid'
        });
      }
      items = list;
    }

    res.json({ success: true, message: 'Ingrediente agregado a la despensa', pantry: items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar la despensa.' });
  }
};

// @desc Delete pantry item
// @route DELETE /api/pantry/:itemId
const deletePantryItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    let items = [];
    try {
      let pantry = await Pantry.findOne({ user: req.user.id });
      if (pantry) {
        pantry.items = pantry.items.filter(item => item._id.toString() !== itemId);
        await pantry.save();
        items = pantry.items;
      }
    } catch (e) {
      if (inMemoryPantries.has(req.user.id)) {
        const list = inMemoryPantries.get(req.user.id).filter(i => i._id !== itemId);
        inMemoryPantries.set(req.user.id, list);
        items = list;
      }
    }

    res.json({ success: true, message: 'Ingrediente eliminado', pantry: items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar el ingrediente.' });
  }
};

const useIngredients = async (req, res) => {
  try {
    const { ingredients } = req.body;
    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({ success: false, message: 'Faltan los ingredientes a descontar.' });
    }

    let items = [];
    try {
      let pantry = await Pantry.findOne({ user: req.user.id });
      if (pantry) {
        ingredients.forEach(useItem => {
          const idx = pantry.items.findIndex(
            pi => pi.name.toLowerCase().trim() === useItem.name.toLowerCase().trim()
          );
          if (idx > -1) {
            pantry.items[idx].quantity -= (Number(useItem.quantity) || 0);
            if (pantry.items[idx].quantity <= 0) {
              pantry.items.splice(idx, 1);
            }
          }
        });
        await pantry.save();
        items = pantry.items;
      }
    } catch (e) {
      if (inMemoryPantries.has(req.user.id)) {
        const list = inMemoryPantries.get(req.user.id);
        ingredients.forEach(useItem => {
          const idx = list.findIndex(
            pi => pi.name.toLowerCase().trim() === useItem.name.toLowerCase().trim()
          );
          if (idx > -1) {
            list[idx].quantity -= (Number(useItem.quantity) || 0);
            if (list[idx].quantity <= 0) {
              list.splice(idx, 1);
            }
          }
        });
        items = list;
      }
    }

    res.json({ success: true, message: 'Ingredientes utilizados y descontados de la despensa.', pantry: items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al descontar ingredientes de la despensa.' });
  }
};

module.exports = { getPantry, addPantryItem, deletePantryItem, useIngredients, inMemoryPantries };
