/**
 * Environment configuration loader.
 * 
 * Uses `dotenv` to load environment variables and exposes a simple
 * configuration object used accross the application.
 * 
 * @module config/env
 */
import dotenv from 'dotenv';
dotenv.config();

/**
 * Application-wide configuration derived from environment variables.
 * 
 * @typedef {Object} config
 * @property {string|number} PORT - Port the HTTP server listens on.
 * @property {string} BASE_URL - Base URL used to construct short URLs.
 */
export const CONFIG = {
    PORT: process.env.PORT,
    BASE_URL: process.env.BASE_URL
};