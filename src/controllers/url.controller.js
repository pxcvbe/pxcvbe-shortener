import { createShortUrl, getOriginalUrl, getAllUrls } from "../services/url.service.js";
import { CONFIG } from "../config/env.js";

export const shortedUrl = async (req, res) => {
    try {
        const { originalUrl } = req.body;
        if (!originalUrl) {
            return res.status(400).json({ error: 'originalUrl is required'});
        }

        const { shortCode, shortUrl } = await createShortUrl(originalUrl, CONFIG.BASE_URL);
        return res.status(201).json({ shortCode, shortUrl });
    } catch (error) {
        console.error('Error shortenUrl:', error);
        return res.status(500).json({ error: 'Internal Server Error'});
    }
};

export const redirectUrl = async (req, res) => {
    try {
        const { shortCode } = req.params;
        const originalUrl = await getOriginalUrl(shortCode);
    
        if (!originalUrl) {
            return res.status(404).json({ error: 'URL not found'});
        }
    
        return res.redirect(originalUrl);
    } catch (error) {
        console.error('Error redirectUrl:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const listUrls = async (req, res) => {
    try {
        const urls = await getAllUrls();
        return res.json(urls);
    } catch (error) {
        console.error('Error listUrls:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};