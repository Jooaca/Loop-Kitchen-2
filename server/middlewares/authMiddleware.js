const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'loop_kitchen_super_secret_jwt_key_2026');
      req.user = decoded; // { id, email, username }
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Token no válido o expirado. Inicia sesión nuevamente.' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Acceso no autorizado, falta el token de autenticación.' });
  }
};

module.exports = { protect };
