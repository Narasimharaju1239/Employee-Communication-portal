// server/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];
  console.log('--- AUTH DEBUG ---');
  console.log('Authorization header:', req.headers.authorization);
  console.log('Extracted token:', token);
  if (!token) {
    console.log('No token found');
    return res.status(401).json({ msg: 'Not authorized, token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded JWT:', decoded);
    req.user = await User.findById(decoded.userId).select('-password');
    console.log('User from DB:', req.user);
    next();
  } catch (err) {
    console.log('JWT verification error:', err.message);
    res.status(401).json({ msg: 'Token invalid', error: err.message });
  }
};

export const isSuperAdmin = (req, res, next) => {
  if (req.user?.role === 'SuperAdmin') return next();
  res.status(403).json({ msg: 'Only Super Admin can perform this action' });
};

// Generic role check middleware
export default function(requiredRoles) {
  return (req, res, next) => {
    // Debug: log headers and user
    console.log('--- ROLE CHECK DEBUG ---');
    console.log('Required roles:', requiredRoles);
    console.log('req.user:', req.user);
    console.log('req.headers.role:', req.headers.role);
    const role = req.user?.role || req.headers.role;
    if (!requiredRoles.includes(role)) {
      console.log('Role check failed. Role found:', role);
      return res.status(403).json({ error: "Forbidden", debug: { requiredRoles, foundRole: role, user: req.user, headers: req.headers } });
    }
    next();
  };
}
