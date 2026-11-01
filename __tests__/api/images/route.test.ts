/**
 * @vitest-environment node
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mkdtemp, mkdir, readdir, readFile, rm } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/images/route";
import prisma from "@/app/prisma";

vi.mock("@/app/prisma", () => ({
  __esModule: true,
  default: {
    image: {
      create: vi.fn(),
    },
  },
}));

const create = vi.mocked(prisma.image.create);

let root: string;
let images: string;

beforeEach(async () => {
  root = await mkdtemp(path.join(tmpdir(), "argon-images-"));
  images = path.join(root, "uploads", "images");
  await mkdir(images, { recursive: true });
  vi.spyOn(process, "cwd").mockReturnValue(root);
  create.mockReset();
  create.mockResolvedValue({} as never);
});

afterEach(async () => {
  vi.restoreAllMocks();
  await rm(root, { recursive: true, force: true });
});

function upload(name: string, type: string, contents = "image-bytes") {
  const data = new FormData();
  data.set("file", new File([contents], name, { type }));
  return POST(new NextRequest("http://localhost/api/images", { method: "POST", body: data }));
}

describe("POST /api/images", () => {
  describe("storing images", () => {
    it.each([
      ["image/png", ".png"],
      ["image/jpeg", ".jpg"],
      ["image/webp", ".webp"],
      ["image/gif", ".gif"],
    ])("stores a %s under a server-chosen name ending %s", async (type, extension) => {
      const res = await upload("Red LED.png", type);

      expect(res.status).toBe(200);
      const stored = await readdir(images);
      expect(stored).toHaveLength(1);
      expect(stored[0]).toMatch(new RegExp(`^[0-9a-f-]{36}\\${extension}$`));
      expect(await readFile(path.join(images, stored[0]), "utf8")).toBe("image-bytes");
      expect(create).toHaveBeenCalledWith({
        data: { name: "Red LED.png", href: `/api/uploads/images/${stored[0]}` },
      });
    });

    it("keeps a file name containing a path inside uploads/images", async () => {
      const res = await upload("../../evil.png", "image/png");

      expect(res.status).toBe(200);
      expect(await readdir(root)).toEqual(["uploads"]);
      expect(await readdir(path.join(root, "uploads"))).toEqual(["images"]);
      expect(await readdir(images)).toHaveLength(1);
    });

    it("does not overwrite an earlier upload with the same name", async () => {
      await upload("photo.png", "image/png", "first");
      await upload("photo.png", "image/png", "second");

      const stored = await readdir(images);
      expect(stored).toHaveLength(2);
      const contents = await Promise.all(stored.map((f) => readFile(path.join(images, f), "utf8")));
      expect(contents.sort()).toEqual(["first", "second"]);
    });
  });

  describe("rejecting uploads", () => {
    it.each([
      ["page.html", "text/html"],
      ["drawing.svg", "image/svg+xml"],
      ["photo.png", "application/octet-stream"],
      ["photo.png", ""],
    ])("rejects %s sent as '%s' without storing it", async (name, type) => {
      const res = await upload(name, type);

      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ error: "Only PNG, JPEG, WebP and GIF images can be uploaded" });
      expect(await readdir(images)).toEqual([]);
      expect(create).not.toHaveBeenCalled();
    });

    it("rejects a request with no file", async () => {
      const res = await POST(
        new NextRequest("http://localhost/api/images", { method: "POST", body: new FormData() })
      );

      expect(res.status).toBe(400);
      expect(await readdir(images)).toEqual([]);
      expect(create).not.toHaveBeenCalled();
    });
  });
});
