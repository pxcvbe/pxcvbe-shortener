import { generateShortCode } from "../utils/generateShortCode.js";
import { prisma } from '../config/db.js';

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

export const getAllUrls = async () => {
    return await prisma.url.findMany({
        orderBy: { createdAt: 'desc' }
    });
};

export const getUrlStats = async (shortCode) => {
    return await prisma.url.findUnique({
        where: { shortCode },
        select: { shortCode: true, originalUrl: true, clicks: true, createdAt: true }
    });
};