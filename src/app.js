import express from 'express';
import cors from 'cors';
import { CONFIG } from './config/env.js';
import urlRoutes from './routes/url.routes.js';
import { redirectUrl } from './controllers/url.controller.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/url', urlRoutes);

// Root
app.get('/', (req, res) => {
    res.send('🚀 URL Shortener API is running...');
});

// Public short URL redirect (ex: http://localhost:5000/AbCd12)
app.get('/:shortCode', redirectUrl);

// Start server
app.listen(CONFIG.PORT, () => {
    console.log(`✓ Server running at ${CONFIG.BASE_URL}`);
});