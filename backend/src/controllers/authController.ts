import { Request, Response } from 'express';
import { pool } from '../config/database';
import { loginSchema, registerSchema } from '../validation/productValidation';
import { User, LoginRequest, LoginResponse } from '../types/Product';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Simple session storage (in production, use Redis or database)
const sessions: Map<string, { userId: number; email: string; isAdmin: boolean }> = new Map();

// Generate simple session ID
function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Login controller
export const login = async (req: Request, res: Response) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password }: LoginRequest = value;

    // Find user by email
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = rows[0] as User;

    // Simple password check (in production, use bcrypt)
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Create session
    const sessionId = generateSessionId();
    sessions.set(sessionId, {
      userId: user.id,
      email: user.email,
      isAdmin: user.is_admin
    });

    // Set session cookie
    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'lax'
    });

    const response: LoginResponse = {
      user: {
        id: user.id,
        email: user.email,
        is_admin: user.is_admin,
        created_at: user.created_at,
        updated_at: user.updated_at
      },
      message: 'Login successful'
    };

    res.json(response);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Register controller
export const register = async (req: Request, res: Response) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password, is_admin = false } = value;

    // Check if user already exists
    const [existingUsers] = await pool.execute<RowDataPacket[]>(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Create new user
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO users (email, password, is_admin) VALUES (?, ?, ?)',
      [email, password, is_admin]
    );

    // Get the created user
    const [newUserRows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE id = ?',
      [result.insertId]
    );

    const newUser = newUserRows[0] as User;

    // Create session
    const sessionId = generateSessionId();
    sessions.set(sessionId, {
      userId: newUser.id,
      email: newUser.email,
      isAdmin: newUser.is_admin
    });

    // Set session cookie
    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'lax'
    });

    const response: LoginResponse = {
      user: {
        id: newUser.id,
        email: newUser.email,
        is_admin: newUser.is_admin,
        created_at: newUser.created_at,
        updated_at: newUser.updated_at
      },
      message: 'Registration successful'
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Logout controller
export const logout = async (req: Request, res: Response) => {
  try {
    const sessionId = req.cookies.sessionId;
    
    if (sessionId) {
      sessions.delete(sessionId);
    }

    res.clearCookie('sessionId');
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get current user
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const sessionId = req.cookies.sessionId;
    
    if (!sessionId || !sessions.has(sessionId)) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const session = sessions.get(sessionId)!;
    
    // Get fresh user data
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE id = ?',
      [session.userId]
    );

    if (rows.length === 0) {
      sessions.delete(sessionId);
      res.clearCookie('sessionId');
      return res.status(401).json({ error: 'User not found' });
    }

    const user = rows[0] as User;

    res.json({
      user: {
        id: user.id,
        email: user.email,
        is_admin: user.is_admin,
        created_at: user.created_at,
        updated_at: user.updated_at
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Middleware to check authentication
export const requireAuth = (req: Request, res: Response, next: any) => {
  const sessionId = req.cookies.sessionId;
  
  if (!sessionId || !sessions.has(sessionId)) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const session = sessions.get(sessionId)!;
  (req as any).user = session;
  next();
};

// Middleware to check admin access
export const requireAdmin = (req: Request, res: Response, next: any) => {
  const sessionId = req.cookies.sessionId;
  
  if (!sessionId || !sessions.has(sessionId)) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const session = sessions.get(sessionId)!;
  
  if (!session.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  (req as any).user = session;
  next();
};
