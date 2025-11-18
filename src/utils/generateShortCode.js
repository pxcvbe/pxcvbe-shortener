/**
 * Utility for generating short codes for URLs.
 * 
 * @module utils/generateShortCode
 */
import { nanoid } from 'nanoid';


/**
 * Generate a random short code consisting of 6 URL-safe characters.
 * 
 * @function generateShortCode
 * @returns {string} A 6-character unique identifier (e.g `AbCd12`).
 */
export const generateShortCode = () => nanoid(6); // contoh: AbCd12