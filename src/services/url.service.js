/**
 * URL service layer.
 * 
 * Contains business logic for creating, resolving and reading
 * statistics for shortened URLs.
 * 
 * @module services/url.service
 */
import { generateShortCode } from "../utils/generateShortCode.js";
import { prisma } from '../config/db.js';

/**
 * Create and persist a new shortened URL
 * 
 * @async
 * @function createShortUrl
 * @param {string} originalUrl - the full original URL to shorten. 
 * @param {string} baseUrl  - Base URL used to build the public short URL.
 * @returns {Promise<{shortCode: string, shortUrl: string, id: string}>}
 * Returns the generated short code, the full short URL, and the database id.
 */
export const createShortUrl = async (originalUrl, baseUrl) => {
    const shortCode = generateShortCode();
    const shortUrl = `${baseUrl}/${shortCode}`;

    const newUrl = await prisma.url.create({
        data: {
            originalUrl,
            shortCode
        }
    });

    return { shortCode, shortUrl, id: newUrl.id };
};

/**
 * Resolve a short code to it's original URL and increment click count.
 * 
 * @async
 * @function getOriginalUrl
 * @param {string} shortCode - Short code to look up. 
 * @returns {Promise<string|null>} The original URL or `null` if not found.
 */
export const getOriginalUrl = async (shortCode) => {
    const url = await prisma.url.findUnique({
        where: { shortCode }
    });

    if (!url) return null;

    // increment click counter
    await prisma.url.update({
        where: { shortCode },
        data: { clicks: { increment: 1 } }
    });

    return url.originalUrl;
}

/**
 * Retrieve all stored shortened URLs ordered by creation date.
 * 
 * @async
 * @function getAllUrls
 * @returns {Promise<array>} List of URL records.
 */
export const getAllUrls = async () => {
    return await prisma.url.findMany({
        orderBy: { createdAt: 'desc' }
    });
};

/**
 * Retrieve statistics for a given short code.
 * 
 * @async
 * @function getUrlStats
 * @param {string} shortCode - Short code to fetch stats for. 
 * @returns {Promise<{shortCode: string, originalUrl: string, clicks: number, createdAt: Date} | null}
 * Selected URL fields or `null` if not found.
 */
export const getUrlStats = async (shortCode) => {
    return await prisma.url.findUnique({
        where: { shortCode },
        select: { shortCode: true, originalUrl: true, clicks: true, createdAt: true }
    });
};