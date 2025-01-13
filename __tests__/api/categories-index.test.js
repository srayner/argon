/**
 * @jest-environment node
 */
import { testApiHandler } from "next-test-api-route-handler";
import * as appHandler from "@/app/api/categories/route";

jest.mock("@/app/prisma", () => ({
  category: {
    count: jest.fn(),
    findMany: jest.fn(),
  },
}));

describe("GET /api/categories", () => {
  it("should return categories with pagination and search", async () => {
    prisma.category.count.mockResolvedValue(1);
    prisma.category.findMany.mockResolvedValue([{ id: 1, name: "Category 1" }]);

    await testApiHandler({
      appHandler, // The handler to test
      requestPatcher(request) {
        request.url = "/api/categories?search=&page=1&pageSize=10";
      },
      async test({ fetch }) {
        const res = await fetch({ method: "GET" });

        // Assert that the response matches the expected structure
        const jsonResponse = await res.json();
        expect(res.status).toBe(200);
        expect(jsonResponse.data).toEqual([{ id: 1, name: "Category 1" }]);
        expect(jsonResponse.meta).toEqual({
          totalItems: 5,
          totalPages: 1,
          currentPage: 1,
          pageSize: 10,
        });
      },
    });
  });
});
