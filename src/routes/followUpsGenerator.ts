import { Router, Request, Response } from 'express';

const router = Router();

// POST /api/follow-ups/generate
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { context } = req.body;
    if (!context || typeof context !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid context' });
    }

    // Placeholder implementation – replace with actual follow-ups generation logic
    const followUps = [
      `Could you elaborate further about: ${context}?`,
      `What challenges did you encounter regarding: ${context}?`,
      `Are there specific goals for: ${context}?`
    ];

    return res.status(200).json({ followUps });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to generate follow-ups' });
  }
});

export default router;
