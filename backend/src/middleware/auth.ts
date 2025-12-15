/**
 * Authentication Middleware - Middleware de autenticacao JWT
 * 
 * Extrai userId do token JWT e adiciona ao request
 * Remove necessidade de hardcoding userId no frontend
 * Inclui verificacao de assinatura para bloqueio de conteudo
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Token curto para seguranca (15 minutos)
const JWT_SECRET = process.env.JWT_SECRET || 'redflix-secret-key-change-in-production';
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY || '15m';
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d';

export interface AuthRequest extends Request {
  userId?: number;
  user?: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
  subscription?: {
    status: string;
    plan: string;
    endDate: Date | null;
    isValid: boolean;
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

/**
 * Middleware que verifica se o usuario tem assinatura valida
 * Bloqueia acesso a conteudo protegido sem assinatura
 * Validacao server-side - NAO confiar no frontend
 */
export async function subscriptionMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Usuario nao autenticado' });
    }

    // Admin sempre tem acesso
    if (req.user?.role === 'admin') {
      req.subscription = {
        status: 'active',
        plan: 'admin',
        endDate: null,
        isValid: true
      };
      return next();
    }

    // Buscar assinatura do usuario
    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.userId }
    });

    if (!subscription) {
      req.subscription = {
        status: 'none',
        plan: 'none',
        endDate: null,
        isValid: false
      };
      return res.status(403).json({ 
        error: 'Assinatura necessaria',
        code: 'SUBSCRIPTION_REQUIRED',
        message: 'Voce precisa de uma assinatura ativa para acessar este conteudo'
      });
    }

    // Verificar se assinatura expirou
    const now = new Date();
    const isExpired = subscription.endDate && subscription.endDate < now;
    const isActive = subscription.status === 'active' || subscription.status === 'trial';

    if (isExpired || !isActive) {
      // Atualizar status para expirado se necessario
      if (isExpired && subscription.status !== 'expired') {
        await prisma.subscription.update({
          where: { userId: req.userId },
          data: { status: 'expired' }
        });
      }

      req.subscription = {
        status: 'expired',
        plan: subscription.plan,
        endDate: subscription.endDate,
        isValid: false
      };

      return res.status(403).json({ 
        error: 'Assinatura expirada',
        code: 'SUBSCRIPTION_EXPIRED',
        message: 'Sua assinatura expirou. Renove para continuar assistindo.',
        expiredAt: subscription.endDate
      });
    }

    // Assinatura valida
    req.subscription = {
      status: subscription.status,
      plan: subscription.plan,
      endDate: subscription.endDate,
      isValid: true
    };

    next();
  } catch (error) {
    console.error('Erro ao verificar assinatura:', error);
    return res.status(500).json({ error: 'Erro ao verificar assinatura' });
  }
}

/**
 * Gera token de acesso curto (15 minutos) para seguranca
 */
export function generateAccessToken(user: { id: number; email: string; name: string; role: string }): string {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      type: 'access'
    },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
}

/**
 * Gera refresh token longo (7 dias) para renovacao
 */
export function generateRefreshToken(user: { id: number; email: string; name: string; role: string }): string {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      type: 'refresh'
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

/**
 * Verifica assinatura por request (para requests de streaming)
 * Adiciona assinatura obrigatoria por request
 */
export function generateRequestSignature(userId: number, contentId: number, timestamp: number): string {
  const data = `${userId}:${contentId}:${timestamp}`;
  const crypto = require('crypto');
  return crypto.createHmac('sha256', JWT_SECRET).update(data).digest('hex');
}

/**
 * Valida assinatura de request
 */
export function validateRequestSignature(
  signature: string, 
  userId: number, 
  contentId: number, 
  timestamp: number,
  maxAgeMs: number = 300000 // 5 minutos
): boolean {
  // Verificar se timestamp nao expirou
  const now = Date.now();
  if (now - timestamp > maxAgeMs) {
    return false;
  }

  const expectedSignature = generateRequestSignature(userId, contentId, timestamp);
  return signature === expectedSignature;
}

export default {
  authMiddleware,
  optionalAuthMiddleware,
  generateToken,
  adminMiddleware,
  subscriptionMiddleware,
  generateAccessToken,
  generateRefreshToken,
  generateRequestSignature,
  validateRequestSignature
};
