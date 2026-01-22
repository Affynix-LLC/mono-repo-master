import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { dbHelpers } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Generate JWT token
export const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Hash password
export const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Compare password
export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// Auth middleware
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.substring(7);
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  req.user = decoded;
  next();
};

// Optional auth middleware (doesn't fail if no token)
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (decoded) {
      req.user = decoded;
    }
  }
  
  next();
};

// Register user
export const register = async (email, password, fullName = null, role = 'user') => {
  // Check if user exists
  const existing = await dbHelpers.getUserByEmail(email);
  if (existing) {
    throw new Error('User already exists');
  }

  const passwordHash = await hashPassword(password);
  const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  await dbHelpers.createUser({
    id,
    email,
    password_hash: passwordHash,
    role,
    full_name: fullName
  });

  const user = await dbHelpers.getUserById(id);
  const token = generateToken(user);

  return { user, token };
};

// Login user
export const login = async (email, password) => {
  const user = await dbHelpers.getUserByEmail(email);
  
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValid = await comparePassword(password, user.password_hash);
  
  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user);
  
  // Remove password hash from response
  const { password_hash, ...userWithoutPassword } = user;
  
  return { user: userWithoutPassword, token };
};
