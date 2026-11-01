import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ImagesPage from "@/app/(protected)/dashboard/images/page";
import { ToastProvider } from "@/components/ToastContext";
import Toast from "@/components/ui/Toast";

function renderPage() {
  return render(
    <ToastProvider>
      <Toast />
      <ImagesPage />
    </ToastProvider>
  );
}

async function chooseAndUpload(user) {
  const file = new File(["bytes"], "photo.png", { type: "image/png" });
  await user.upload(screen.getByLabelText("Choose a file"), file);
  await user.click(screen.getByRole("button", { name: "Upload" }));
  return file;
}

beforeEach(() => {
  vi.stubGlobal("URL", Object.assign(URL, { createObjectURL: vi.fn(() => "blob:preview") }));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Images Page", () => {
  test("renders Image Upload title, file chooser and Upload button", async () => {
    renderPage();

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

  describe("successful upload", () => {
    test("sends the file and clears the selection without showing an error", async () => {
      const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true })));
      vi.stubGlobal("fetch", fetchMock);
      const user = userEvent.setup();
      renderPage();

      const file = await chooseAndUpload(user);

      expect(await screen.findByText("No image selected")).toBeInTheDocument();
      expect(fetchMock).toHaveBeenCalledWith("/api/images", expect.objectContaining({ method: "POST" }));
      expect(fetchMock.mock.calls[0][1].body.get("file")).toBe(file);
      expect(screen.getByRole("button", { name: "Upload" })).toBeDisabled();
      expect(screen.queryByText(/upload failed|can be uploaded/i)).not.toBeInTheDocument();
    });
  });

  describe("failed upload", () => {
    test.each([
      [
        "the server's message when it rejects the file",
        () =>
          Promise.resolve(
            new Response(JSON.stringify({ error: "Only PNG, JPEG, WebP and GIF images can be uploaded" }), {
              status: 400,
            })
          ),
        "Only PNG, JPEG, WebP and GIF images can be uploaded",
      ],
      [
        "a general message when the server gives no reason",
        () => Promise.resolve(new Response("Internal Server Error", { status: 500 })),
        "Image upload failed. Please try again.",
      ],
      [
        "a general message when the request cannot reach the server",
        () => Promise.reject(new TypeError("Failed to fetch")),
        "Image upload failed. Please try again.",
      ],
    ])("shows %s and keeps the chosen file", async (_, respond, message) => {
      vi.stubGlobal("fetch", vi.fn(respond));
      const user = userEvent.setup();
      renderPage();

      await chooseAndUpload(user);

      expect(await screen.findByText(message)).toBeInTheDocument();
      expect(screen.getByAltText("Selected preview")).toBeInTheDocument();
      expect(screen.queryByText("No image selected")).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Upload" })).toBeEnabled();
    });
  });
});
