import { Router } from 'express';
import prisma from '../services/database';

const router = Router();

router.get('/kpis', async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      totalUsers,
      activeSubscriptions,
      newUsersThisMonth,
      newUsersLastMonth,
      totalContent,
      totalViews,
      monthlyRevenue,
      yearlyRevenue,
      cancelledThisMonth
    ] = await Promise.all([
      prisma.user.count(),
      prisma.subscription.count({ where: { status: 'active' } }),
      prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.user.count({ where: { createdAt: { gte: lastMonth, lt: startOfMonth } } }),
      prisma.content.count({ where: { active: true } }),
      prisma.viewHistory.count(),
      prisma.payment.aggregate({
        where: { createdAt: { gte: startOfMonth }, status: 'completed' },
        _sum: { amount: true }
      }),
      prisma.payment.aggregate({
        where: { createdAt: { gte: startOfYear }, status: 'completed' },
        _sum: { amount: true }
      }),
      prisma.subscription.count({
        where: { status: 'cancelled', updatedAt: { gte: startOfMonth } }
      })
    ]);

    res.json({
      totalUsers,
      activeSubscriptions,
      newUsersThisMonth,
      newUsersLastMonth,
      userGrowth: newUsersLastMonth > 0 ? ((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth * 100).toFixed(1) : 0,
      totalContent,
      totalViews,
      monthlyRevenue: monthlyRevenue._sum.amount || 0,
      yearlyRevenue: yearlyRevenue._sum.amount || 0,
      cancelledThisMonth
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch KPIs' });
  }
});

router.get('/top-content', async (req, res) => {
  try {
    const { limit = '10', period = '30' } = req.query;
    const since = new Date();
    since.setDate(since.getDate() - parseInt(period as string));

    const topContent = await prisma.viewHistory.groupBy({
      by: ['contentId'],
      where: { updatedAt: { gte: since } },
      _count: { contentId: true },
      orderBy: { _count: { contentId: 'desc' } },
      take: parseInt(limit as string)
    });

    const contentIds = topContent.map(t => t.contentId);
    const contents = await prisma.content.findMany({
      where: { id: { in: contentIds } },
      select: { id: true, title: true, posterPath: true, type: true }
    });

    const result = topContent.map(t => ({
      ...contents.find(c => c.id === t.contentId),
      views: t._count?.contentId || 0
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch top content' });
  }
});

router.get('/user-activity', async (req, res) => {
  try {
    const { days = '30' } = req.query;
    const since = new Date();
    since.setDate(since.getDate() - parseInt(days as string));

    const activity = await prisma.viewHistory.groupBy({
      by: ['updatedAt'],
      where: { updatedAt: { gte: since } },
      _count: { id: true }
    });

    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user activity' });
  }
});

router.get('/subscription-stats', async (req, res) => {
  try {
    const stats = await prisma.subscription.groupBy({
      by: ['plan', 'status'],
      _count: { id: true }
    });

    const planStats = await prisma.subscription.groupBy({
      by: ['plan'],
      _count: { id: true },
      _sum: { price: true }
    });

    res.json({ stats, planStats });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subscription stats' });
  }
});

router.get('/revenue', async (req, res) => {
  try {
    const { months = '12' } = req.query;
    const since = new Date();
    since.setMonth(since.getMonth() - parseInt(months as string));

    const payments = await prisma.payment.findMany({
      where: { createdAt: { gte: since }, status: 'completed' },
      select: { amount: true, createdAt: true }
    });

    const monthlyData: { [key: string]: number } = {};
    payments.forEach(p => {
      const key = `${p.createdAt.getFullYear()}-${String(p.createdAt.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[key] = (monthlyData[key] || 0) + p.amount;
    });

    res.json(Object.entries(monthlyData).map(([month, revenue]) => ({ month, revenue })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch revenue data' });
  }
});

export default router;
