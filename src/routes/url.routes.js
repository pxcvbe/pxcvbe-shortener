import express from 'express';
import { shortedUrl, redirectUrl, listUrls } from '../controllers/url.controller.js';
import { getUrlStats } from '../services/url.service.js';

const router = express.Router();

// POST /api/v1/url/shorten
router.post('/shorten', shortedUrl);

// GET /api/v1/url/list
router.get('/list', listUrls);

// GET /:shortCode
router.get('/:shortCode', redirectUrl);

// GET /:shortCode/stats
router.get('/:shortCode/stats', async (req, res) => {
    const stats = await getUrlStats(req.params.shortCode);
    if (!stats) return res.status(404).json({ error: 'URL not found'});
    res.json(stats);
});

export default router;