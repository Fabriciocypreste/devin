/**
 * Authentication Middleware - Middleware de autenticacao JWT
 * 
 * Extrai userId do token JWT e adiciona ao request
 * Remove necessidade de hardcoding userId no frontend
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'redflix-secret-key-change-in-production';

export interface AuthRequest extends Request {
  userId?: number;
  user?: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

/**
 * Middleware que verifica o token JWT e extrai o userId
 * Se o token for valido, adiciona userId ao request
 * Se nao houver token ou for invalido, retorna 401
 */
export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'Token de autenticacao nao fornecido' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ error: 'Formato de token invalido' });
    }

    const token = parts[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: number;
        email: string;
        name: string;
        role: string;
      };

      req.userId = decoded.userId;
      req.user = {
        id: decoded.userId,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role
      };

      next();
    } catch (jwtError) {
      return res.status(401).json({ error: 'Token invalido ou expirado' });
    }
  } catch (error) {
    console.error('Erro no middleware de autenticacao:', error);
    return res.status(500).json({ error: 'Erro interno de autenticacao' });
  }
}

/**
 * Middleware opcional que tenta extrair userId do token
 * Se nao houver token, continua sem userId (para rotas publicas)
 */
export function optionalAuthMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      // Sem token, continua sem userId
      return next();
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return next();
    }

    const token = parts[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: number;
        email: string;
        name: string;
        role: string;
      };

      req.userId = decoded.userId;
      req.user = {
        id: decoded.userId,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role
      };
    } catch (jwtError) {
      // Token invalido, continua sem userId
    }

    next();
  } catch (error) {
    next();
  }
}

/**
 * Gera um token JWT para o usuario
 */
export function generateToken(user: { id: number; email: string; name: string; role: string }): string {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

/**
 * Verifica se o usuario e admin
 */
export function adminMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
  }
  next();
}

export default {
  authMiddleware,
  optionalAuthMiddleware,
  generateToken,
  adminMiddleware
};
