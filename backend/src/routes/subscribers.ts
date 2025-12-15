/**
 * Subscribers Routes - Rotas para gerenciamento de novos assinantes
 * 
 * Funcionalidades:
 * - Cadastrar novo assinante (publico)
 * - Listar assinantes pendentes (admin)
 * - Aprovar/rejeitar assinante (admin)
 * - Estatisticas de assinantes (admin)
 */

import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, adminMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Planos disponiveis
const PLANS = {
  mensal: { name: 'Mensal', price: 29.90, months: 1 },
  trimestral: { name: '3 Meses', price: 79.90, months: 3 },
  anual: { name: '1 Ano', price: 250.00, months: 12 }
};

/**
 * POST /api/subscribers
 * Cadastra um novo assinante (publico)
 */
router.post('/', async (req, res) => {
  try {
    const { name, email, whatsapp, plan } = req.body;

    // Validacoes
    if (!name || !email || !whatsapp || !plan) {
      return res.status(400).json({ error: 'Todos os campos sao obrigatorios: name, email, whatsapp, plan' });
    }

    // Validar plano
    const planInfo = PLANS[plan as keyof typeof PLANS];
    if (!planInfo) {
      return res.status(400).json({ error: 'Plano invalido. Use: mensal, trimestral ou anual' });
    }

    // Criar assinante
    const subscriber = await prisma.subscriber.create({
      data: {
        name,
        email,
        whatsapp,
        plan,
        planPrice: planInfo.price,
        planMonths: planInfo.months,
        status: 'pending'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Cadastro realizado com sucesso! Aguarde aprovacao.',
      subscriber: {
        id: subscriber.id,
        name: subscriber.name,
        email: subscriber.email,
        plan: subscriber.plan,
        planPrice: subscriber.planPrice,
        status: subscriber.status
      }
    });
  } catch (error) {
    console.error('Erro ao cadastrar assinante:', error);
    res.status(500).json({ error: 'Erro ao cadastrar assinante' });
  }
});

/**
 * GET /api/subscribers
 * Lista todos os assinantes (admin)
 */
router.get('/', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = status ? { status: String(status) } : {};

    const [subscribers, total] = await Promise.all([
      prisma.subscriber.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.subscriber.count({ where })
    ]);

    res.json({
      subscribers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Erro ao listar assinantes:', error);
    res.status(500).json({ error: 'Erro ao listar assinantes' });
  }
});

/**
 * GET /api/subscribers/stats
 * Estatisticas dos assinantes (admin)
 */
router.get('/stats', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const [pending, approved, rejected, total] = await Promise.all([
      prisma.subscriber.count({ where: { status: 'pending' } }),
      prisma.subscriber.count({ where: { status: 'approved' } }),
      prisma.subscriber.count({ where: { status: 'rejected' } }),
      prisma.subscriber.count()
    ]);

    // Receita potencial (pendentes + aprovados)
    const pendingRevenue = await prisma.subscriber.aggregate({
      where: { status: 'pending' },
      _sum: { planPrice: true }
    });

    const approvedRevenue = await prisma.subscriber.aggregate({
      where: { status: 'approved' },
      _sum: { planPrice: true }
    });

    res.json({
      pending,
      approved,
      rejected,
      total,
      pendingRevenue: pendingRevenue._sum.planPrice || 0,
      approvedRevenue: approvedRevenue._sum.planPrice || 0
    });
  } catch (error) {
    console.error('Erro ao obter estatisticas:', error);
    res.status(500).json({ error: 'Erro ao obter estatisticas' });
  }
});

/**
 * PUT /api/subscribers/:id/approve
 * Aprova um assinante (admin)
 */
router.put('/:id/approve', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const adminId = req.userId!;

    const subscriber = await prisma.subscriber.update({
      where: { id: Number(id) },
      data: {
        status: 'approved',
        approvedBy: adminId,
        approvedAt: new Date(),
        notes: notes || null
      }
    });

    res.json({
      success: true,
      message: 'Assinante aprovado com sucesso',
      subscriber
    });
  } catch (error) {
    console.error('Erro ao aprovar assinante:', error);
    res.status(500).json({ error: 'Erro ao aprovar assinante' });
  }
});

/**
 * PUT /api/subscribers/:id/reject
 * Rejeita um assinante (admin)
 */
router.put('/:id/reject', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const adminId = req.userId!;

    const subscriber = await prisma.subscriber.update({
      where: { id: Number(id) },
      data: {
        status: 'rejected',
        approvedBy: adminId,
        approvedAt: new Date(),
        notes: notes || null
      }
    });

    res.json({
      success: true,
      message: 'Assinante rejeitado',
      subscriber
    });
  } catch (error) {
    console.error('Erro ao rejeitar assinante:', error);
    res.status(500).json({ error: 'Erro ao rejeitar assinante' });
  }
});

/**
 * DELETE /api/subscribers/:id
 * Remove um assinante (admin)
 */
router.delete('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.subscriber.delete({
      where: { id: Number(id) }
    });

    res.json({ success: true, message: 'Assinante removido' });
  } catch (error) {
    console.error('Erro ao remover assinante:', error);
    res.status(500).json({ error: 'Erro ao remover assinante' });
  }
});

/**
 * GET /api/subscribers/plans
 * Lista os planos disponiveis (publico)
 */
router.get('/plans', async (req, res) => {
  res.json({
    plans: [
      { id: 'mensal', name: 'Mensal', price: 29.90, months: 1, description: 'Acesso por 1 mes' },
      { id: 'trimestral', name: '3 Meses', price: 79.90, months: 3, description: 'Acesso por 3 meses' },
      { id: 'anual', name: '1 Ano', price: 250.00, months: 12, description: 'Acesso por 1 ano' }
    ]
  });
});

export default router;
