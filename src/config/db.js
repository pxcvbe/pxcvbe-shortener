/**
 * Prisma database client configuration.
 * 
 * Exports a singleton instance of {@link PrismaClient} to be used
 * throughout the application for database access.
 * 
 * @module config/db
 */
import { PrismaClient } from "@prisma/client";

/**
 * Shared Prisma client instance used for all database operations.
 * @type {PrismaClient}
 */
export const prisma = new PrismaClient();