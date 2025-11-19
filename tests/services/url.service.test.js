import { describe, it, expect, vi, beforeEach } from "vitest";

const prismaMocks = vi.hoisted(() => ({
  mockCreate: vi.fn(),
  mockFindUnique: vi.fn(),
  mockUpdate: vi.fn(),
  mockFindMany: vi.fn(),
}));

vi.mock("../../src/utils/generateShortCode.js", () => ({
  generateShortCode: vi.fn(() => "abc123"),
}));

vi.mock("../../src/config/db.js", () => ({
  prisma: {
    url: {
      create: prismaMocks.mockCreate,
      findUnique: prismaMocks.mockFindUnique,
      update: prismaMocks.mockUpdate,
      findMany: prismaMocks.mockFindMany,
    },
  },
}));

import {
  createShortUrl,
  getOriginalUrl,
  getAllUrls,
  getUrlStats,
} from "../../src/services/url.service.js";

describe("url.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createShortUrl", () => {
    it("creates a short URL and returns metadata", async () => {
      prismaMocks.mockCreate.mockResolvedValue({ id: "1" });

      const result = await createShortUrl(
        "https://example.com",
        "http://localhost:5000",
      );

      expect(prismaMocks.mockCreate).toHaveBeenCalledWith({
        data: {
          originalUrl: "https://example.com",
          shortCode: "abc123",
        },
      });
      expect(result).toEqual({
        shortCode: "abc123",
        shortUrl: "http://localhost:5000/abc123",
        id: "1",
      });
    });
  });

  describe("getOriginalUrl", () => {
    it("returns null when short code is not found", async () => {
      prismaMocks.mockFindUnique.mockResolvedValue(null);

      const result = await getOriginalUrl("missing");

      expect(result).toBeNull();
      expect(prismaMocks.mockUpdate).not.toHaveBeenCalled();
    });

    it("returns original url and increment click count", async () => {
      prismaMocks.mockFindUnique.mockResolvedValue({
        shortCode: "abc123",
        originalUrl: "https://example.com",
      });

      const result = await getOriginalUrl("abc123");

      expect(result).toBe("https://example.com");
      expect(prismaMocks.mockUpdate).toHaveBeenCalledWith({
        where: { shortCode: "abc123" },
        data: { clicks: { increment: 1 } },
      });
    });
  });

  describe("getAllUrls", () => {
    it("returns all urls ordered by creation date", async () => {
      prismaMocks.mockFindMany.mockResolvedValue([{ id: "1" }]);

      const result = await getAllUrls();

      expect(prismaMocks.mockFindMany).toHaveBeenCalledWith({
        orderBy: { createdAt: "desc" },
      });
      expect(result).toEqual([{ id: "1" }]);
    });
  });

  describe("getUrlStats", () => {
    it("fetches stats for a specific short code", async () => {
      prismaMocks.mockFindUnique.mockResolvedValue({
        shortCode: "abc123",
        originalUrl: "https://example.com",
        clicks: 3,
        createdAt: new Date("2025-01-01"),
      });

      const result = await getUrlStats("abc123");

      expect(prismaMocks.mockFindUnique).toHaveBeenCalledWith({
        where: { shortCode: "abc123" },
        select: {
          shortCode: true,
          originalUrl: true,
          clicks: true,
          createdAt: true,
        },
      });
      expect(result.shortCode).toBe("abc123");
      expect(result.clicks).toBe(3);
    });
  });
});
