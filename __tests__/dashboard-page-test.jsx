import { render, screen, waitFor } from "@testing-library/react";
import DashboardPage from "../app/(protected)/dashboard/page";

const mockData = {
  data: {
    categories: {
      count: 15,
    },
    manufacturers: {
      count: 5,
    },
    suppliers: {
      count: 2,
    },
    products: {
      count: 8,
    },
    images: {
      count: 23,
    },
  },
};

// Mocking the global fetch API
global.fetch = jest.fn((url) => {
  if (url === "/api/dashboard") {
    return Promise.resolve({
      json: () => Promise.resolve(mockData),
    });
  }
});

describe("Dashboard Page", () => {
  test("renders heading and counts", async () => {
    render(<DashboardPage />);

    await waitFor(() => screen.getByText("Stock Control"));

    const cards = [
      { testId: "categories-count", count: mockData.data.categories.count },
      { testId: "manufacturers-count", count: mockData.data.manufacturers.count },
      { testId: "suppliers-count", count: mockData.data.suppliers.count },
      { testId: "products-count", count: mockData.data.products.count },
      { testId: "images-count", count: mockData.data.images.count },
    ];

    for (const card of cards) {
      await waitFor(() => {
        const element = screen.getByTestId(card.testId);
        expect(element).toHaveTextContent(card.count.toString());
      });
    }
  });
});
