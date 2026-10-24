import { render, screen, waitFor } from "@testing-library/react";
import ImagesPage from "@/app/(protected)/dashboard/images/page";

describe("Images Page", () => {
  test("renders Image Upload title, file chooser and Upload button", async () => {
    render(<ImagesPage />);

    // Wait for the title to be rendered
    await waitFor(() => {
      expect(screen.getByText("Image Upload")).toBeInTheDocument();
    });

    // The file chooser and the (initially disabled) Upload button are rendered
    await waitFor(() => {
      expect(screen.getByLabelText("Choose a file")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Upload/i })).toBeDisabled();
    });
  });
});
