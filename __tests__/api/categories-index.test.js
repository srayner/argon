/**
 * @vitest-environment node
 */
import { NextRequest } from "next/server";
import { GET } from "@/app/api/categories/route";
import prisma from "@/app/prisma";

vi.mock("@/app/prisma", () => ({
  __esModule: true,
  default: {
    category: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

describe("GET /api/categories", () => {
  it("should return categories with pagination and search", async () => {
    prisma.category.count.mockResolvedValue(1);
    prisma.category.findMany.mockResolvedValue([{ id: 1, name: "Category 1" }]);

    const request = new NextRequest(
      "http://localhost/api/categories?search=&page=1&pageSize=10"
    );
    const res = await GET(request);

    // Assert that the response matches the expected structure
    const jsonResponse = await res.json();
    expect(res.status).toBe(200);
    expect(jsonResponse.data).toEqual([{ id: 1, name: "Category 1" }]);
    expect(jsonResponse.meta).toEqual({
      totalItems: 1,
      totalPages: 1,
      currentPage: 1,
      pageSize: 10,
    });
  });
});
