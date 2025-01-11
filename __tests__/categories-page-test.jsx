import { render, screen, waitFor } from "@testing-library/react";
import CategoriesPage from "@/app/(protected)/dashboard/categories/page";

const mockData = {
  data: [
    {
      id: "cm4kediiw0001a7m3oakhsi47",
      name: "Bolts",
      parentId: "cm51lwdmx000311quov6hlr4c",
      createdAt: "2024-12-11T21:23:28.137Z",
      updatedAt: "2024-12-23T22:26:22.366Z",
    },
  ],
  meta: {
    totalItems: 14,
    totalPages: 2,
    currentPage: 1,
    pageSize: 10,
  },
};

// Mocking the global fetch API
global.fetch = jest.fn((url) => {
  if (url.startsWith("/api/categories")) {
    return Promise.resolve({
      json: () => Promise.resolve(mockData),
    });
  }
});

describe("Categories Page", () => {
  test("renders Categories title and Add button", async () => {
    render(<CategoriesPage />);

    // Wait for the title to be rendered
    await waitFor(() => {
      expect(screen.getByText("Categories")).toBeInTheDocument();
    });

    // Wait for the Add button to be rendered
    await waitFor(() => {
      expect(screen.getByRole("link", { name: /Add/i })).toBeInTheDocument();
    });
  });
});
