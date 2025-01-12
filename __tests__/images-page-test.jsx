import { render, screen, waitFor } from "@testing-library/react";
import ImagesPage from "@/app/(protected)/dashboard/images/page";

describe("Products Page", () => {
  test("renders Images title and Upload button", async () => {
    render(<ImagesPage />);

    // Wait for the title to be rendered
    await waitFor(() => {
      expect(screen.getByText("Images")).toBeInTheDocument();
    });

    // Wait for the Add button to be rendered
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Upload/i })).toBeInTheDocument();
      expect(screen.getByLabelText("Upload file:")).toBeInTheDocument();
    });
  });
});
