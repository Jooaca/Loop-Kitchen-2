const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// In-Memory Fallback Store if MongoDB is offline
const inMemoryUsers = [];

const generateToken = (userId, email, username) => {
  return jwt.sign(
    { id: userId, email, username },
    process.env.JWT_SECRET || 'loop_kitchen_super_secret_jwt_key_2026',
    { expiresIn: '7d' }
  );
};

// @desc Register new user
// @route POST /api/auth/register
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios.' });
    }

    let existingUser;
    try {
      existingUser = await User.findOne({ email });
    } catch (e) {
      existingUser = inMemoryUsers.find(u => u.email === email);
    }

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'El correo electrónico ya está registrado.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    let newUser;
    try {
      newUser = await User.create({
        username,
        email,
        password: passwordHash,
      });
    } catch (e) {
      console.log('[Auth]: Mongoose connection offline, saving to in-memory store.');
      newUser = {
        _id: 'mem_user_' + Date.now(),
        username,
        email,
        password: passwordHash,
        preferences: {
          householdSize: 2,
          weeklyBudget: 150,
          cookingDays: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
          maxPrepTime: 45,
          dietaryRestrictions: [],
          allergies: [],
          likedFoods: [],
          dislikedFoods: [],
          mainGoal: 'Comer saludable y ahorrar tiempo',
        }
      };
      inMemoryUsers.push(newUser);
    }

    const token = generateToken(newUser._id, newUser.email, newUser.username);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado con éxito',
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        preferences: newUser.preferences,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Error al registrar usuario: ' + error.message });
  }
};

// @desc Login user
// @route POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Ingresa correo y contraseña.' });
    }

    let user;
    try {
      user = await User.findOne({ email });
    } catch (e) {
      user = inMemoryUsers.find(u => u.email === email);
    }

    if (!user && inMemoryUsers.length > 0) {
      user = inMemoryUsers.find(u => u.email === email);
    }

    if (!user) {
      return res.status(400).json({ success: false, message: 'Credenciales inválidas.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Credenciales inválidas.' });
    }

    const token = generateToken(user._id, user.email, user.username);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        preferences: user.preferences,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor al iniciar sesión: ' + error.message });
  }
};

// @desc Get current logged user
// @route GET /api/auth/me
const getMe = async (req, res) => {
  try {
    let user;
    try {
      user = await User.findById(req.user.id).select('-password');
    } catch (e) {
      user = inMemoryUsers.find(u => u._id === req.user.id);
    }
    if (!user && inMemoryUsers.length > 0) {
      user = inMemoryUsers.find(u => u._id === req.user.id);
    }
    if (!user) {
      user = { _id: req.user.id, username: req.user.username, email: req.user.email, preferences: {} };
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener datos del usuario.' });
  }
};

// @desc Update dietary preferences
// @route PUT /api/auth/preferences
const updatePreferences = async (req, res) => {
  try {
    const { preferences } = req.body;
    let user;
    try {
      user = await User.findByIdAndUpdate(
        req.user.id,
        { $set: { preferences } },
        { new: true }
      ).select('-password');
    } catch (e) {
      user = inMemoryUsers.find(u => u._id === req.user.id);
      if (user) user.preferences = preferences;
    }

    res.json({ success: true, message: 'Preferencias actualizadas correctamente', user: user || { preferences } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar preferencias.' });
  }
};

module.exports = { register, login, getMe, updatePreferences };
