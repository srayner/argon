import { render, screen, waitFor } from "@testing-library/react";
import ProductsPage from "@/app/(protected)/dashboard/products/page";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const mockData = {
  data: [
    {
      id: 1,
      name: "2 inch self-tapping screw",
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
  if (url.startsWith("/api/products")) {
    return Promise.resolve({
      json: () => Promise.resolve(mockData),
    });
  }
});

// Mock next/navigation hooks
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe("Products Page", () => {
  beforeEach(() => {
    useRouter.mockReturnValue({
      push: jest.fn(), // ToDo: Mock the push function for shallow routing
    });
    usePathname.mockImplementation(() => "/mock-path");
    useSearchParams.mockImplementation(() => ({
      get: jest.fn().mockReturnValue("123"), //ToDo:Mock query param
    }));
  });

  test("renders Products title and Add button", async () => {
    // Mocking the hooks for pathname and search parameters
    usePathname.mockReturnValue("/mock-path");
    useSearchParams.mockReturnValue(new URLSearchParams({ id: "123" }));

    render(<ProductsPage />);

    // Wait for the title to be rendered
    await waitFor(() => {
      expect(screen.getByText("Products")).toBeInTheDocument();
    });

    // Wait for the Add button to be rendered
    await waitFor(() => {
      expect(screen.getByRole("link", { name: /Add/i })).toBeInTheDocument();
    });
  });
});
