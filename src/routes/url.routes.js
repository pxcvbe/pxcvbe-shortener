/**
 * URL routes definition.
 * 
 * Wires HTTP endpoints to the URL controller handlers and stats service.
 * 
 * @module routes/url.routes
 */
import express from 'express';
import { shortedUrl, redirectUrl, listUrls } from '../controllers/url.controller.js';
import { getUrlStats } from '../services/url.service.js';

const router = express.Router();

/**
 * Create a new shortened URL
 * 
 * @name POST /api/v1/url/shorten
 * @function
 * @memberof module:routes/url.routes
 */
router.post('/shorten', shortedUrl);

/**
 * Create a new shortened URL
 * 
 * @name GET /api/v1/url/list
 * @function
 * @memberof module:routes/url.routes
 */
router.get('/list', listUrls);

/**
 * Create a new shortened URL
 * 
 * @name GET /api/v1/url/:shortCode
 * @function
 * @memberof module:routes/url.routes
 */
router.get('/:shortCode', redirectUrl);

/**
 * Create a new shortened URL
 * 
 * @name GET /api/v1/url/:shortCode/stats
 * @function
 * @memberof module:routes/url.routes
 */
router.get('/:shortCode/stats', async (req, res) => {
    const stats = await getUrlStats(req.params.shortCode);
    if (!stats) return res.status(404).json({ error: 'URL not found'});
    res.json(stats);
});

export default router;