import { Router, Request, Response } from 'express';
import * as channelService from '../services/channelService';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const includeInactive = req.query.includeInactive === 'true';
    const categories = await channelService.getAllCategories(includeInactive);
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const category = await channelService.getCategoryById(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { name, icon, order, active } = req.body;
    const category = await channelService.updateCategory(id, { name, icon, order, active });
    res.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await channelService.deleteCategory(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

router.delete('/', async (req: Request, res: Response) => {
  try {
    await channelService.deleteAllCategories();
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting all categories:', error);
    res.status(500).json({ error: 'Failed to delete all categories' });
  }
});

export default router;
