/**
 * Entry point of the URL Shortener HTTP server.
 * Sets up global middleware, API routes, static file serving, and
 * the public redirect route for short URLs.
 * 
 * @module app
 */
import express from 'express';
import cors from 'cors';
import { CONFIG } from './config/env.js';
import urlRoutes from './routes/url.routes.js';
import { redirectUrl } from './controllers/url.controller.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api/v1/url', urlRoutes);

// Root
app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/public/index.html');
});

// Public short URL redirect (ex: http://localhost:5000/AbCd12)
app.get('/:shortCode', redirectUrl);

// Start server
app.listen(CONFIG.PORT, () => {
    console.log(`✓ Server running at ${CONFIG.BASE_URL}`);
    console.log(`✓ PORT: ${CONFIG.PORT}`);
});