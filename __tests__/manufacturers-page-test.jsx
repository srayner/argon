import { render, screen, waitFor } from "@testing-library/react";
import ManufactuersPage from "@/app/(protected)/dashboard/manufacturers/page";

const mockData = {
  data: [
    {
      id: 1,
      name: "texas instruments2",
      imageId: null,
      createdAt: "2024-08-04T12:31:40.338Z",
      updatedAt: "2024-08-18T13:27:08.444Z",
    },
  ],
  meta: {
    totalItems: 1,
    totalPages: 1,
    currentPage: 1,
    pageSize: 10,
  },
};

// Mocking the global fetch API
global.fetch = jest.fn((url) => {
  if (url.startsWith("/api/manufacturers")) {
    return Promise.resolve({
      json: () => Promise.resolve(mockData),
    });
  }
});

describe("Manufacturers Page", () => {
  test("renders Manufacturers title and Add button", async () => {
    render(<ManufactuersPage />);

    // Wait for the title to be rendered
    await waitFor(() => {
      expect(screen.getByText("Manufacturers")).toBeInTheDocument();
    });

    // Wait for the Add button to be rendered
    await waitFor(() => {
      expect(screen.getByRole("link", { name: /Add/i })).toBeInTheDocument();
    });
  });
});
