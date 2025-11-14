import dotenv from 'dotenv';
dotenv.config();

export const CONFIG = {
    PORT: process.env.port,
    BASE_URL: process.env.BASE_URL
};