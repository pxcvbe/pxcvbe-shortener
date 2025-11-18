/**
 * URL controller module.
 * 
 * Exposes Express route handlers for creating, resolving, and listing
 * shortened URLs.
 * 
 * @module controllers/url.controller
 */
import { createShortUrl, getOriginalUrl, getAllUrls } from "../services/url.service.js";
import { CONFIG } from "../config/env.js";

/**
 * Handle request to create a new shortened URL.
 * 
 * Expects `originalUrl` in the request body and returns the generated
 * short code and full short URL.
 * 
 * @async
 * @function shortedUrl
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 */
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

/**
 * Redirect to the original URL for a given short code.
 * 
 * Reads the `shortCode` from route parameters, looks up the original URL,
 * and issues a redirect if found.
 * 
 * @async
 * @function redirectUrl
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 */
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

/**
 * Return a list of all stored URLs with their metadata.
 * 
 * @async
 * @function listUrls
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 */
export const listUrls = async (req, res) => {
    try {
        const urls = await getAllUrls();
        return res.json(urls);
    } catch (error) {
        console.error('Error listUrls:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};