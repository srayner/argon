/**
 * @vitest-environment node
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mkdtemp, mkdir, writeFile, rm, symlink } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import { NextRequest } from "next/server";
import { GET } from "@/app/api/uploads/[type]/[filename]/route";

const SECRET = "secret-contents-that-must-not-leak";
const IMAGE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

let root: string;

beforeEach(async () => {
  root = await mkdtemp(path.join(tmpdir(), "argon-uploads-"));
  const images = path.join(root, "uploads", "images");
  await mkdir(path.join(images, "sub"), { recursive: true });
  await mkdir(path.join(root, "uploads", "docs"), { recursive: true });
  await mkdir(path.join(root, "uploads-private"), { recursive: true });
  await writeFile(path.join(images, "photo.png"), IMAGE);
  await writeFile(path.join(images, "sub", "photo.png"), IMAGE);
  await writeFile(path.join(images, ".hidden.png"), IMAGE);
  await writeFile(path.join(images, "page.html"), "<script>alert(1)</script>");
  await writeFile(path.join(images, "drawing.svg"), "<svg><script>alert(1)</script></svg>");
  await writeFile(path.join(images, "notes.txt"), "plain text");
  await writeFile(path.join(root, "uploads", "docs", "manual.pdf"), "pdf");
  await writeFile(path.join(root, "secret.json"), SECRET);
  await writeFile(path.join(root, "uploads-private", "secret.json"), SECRET);
  await symlink(path.join(root, "secret.json"), path.join(images, "link.png"));
  vi.spyOn(process, "cwd").mockReturnValue(root);
});

afterEach(async () => {
  vi.restoreAllMocks();
  await rm(root, { recursive: true, force: true });
});

function get(type: string, filename: string) {
  const request = new NextRequest(`http://localhost/api/uploads/${type}/${filename}`);
  return GET(request, { params: Promise.resolve({ type, filename }) });
}

describe("GET /api/uploads/[type]/[filename]", () => {
  describe("serving images", () => {
    it("returns an image inline with its content type and nosniff", async () => {
      const res = await get("images", "photo.png");

      expect(res.status).toBe(200);
      expect(res.headers.get("Content-Type")).toBe("image/png");
      expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
      expect(res.headers.get("Content-Disposition")).toBeNull();
      expect(Buffer.from(await res.arrayBuffer())).toEqual(IMAGE);
    });

    it.each(["page.html", "drawing.svg", "notes.txt"])(
      "makes the browser download %s instead of displaying it",
      async (filename) => {
        const res = await get("images", filename);

        expect(res.status).toBe(200);
        expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
        expect(res.headers.get("Content-Disposition")).toBe("attachment");
      }
    );
  });

  describe("not found", () => {
    it("returns a fixed message for a missing file without revealing server paths", async () => {
      const res = await get("images", "missing.png");

      expect(res.status).toBe(404);
      expect(await res.json()).toEqual({ error: "File not found" });
    });

    it.each([
      ["a folder other than images", "docs", "manual.pdf"],
      ["a type that climbs out of uploads", "..", "secret.json"],
      ["a type reaching a sibling folder sharing the uploads prefix", "../uploads-private", "secret.json"],
      ["a filename that climbs out of uploads", "images", "../../secret.json"],
      ["a filename that climbs into a sibling folder", "images", "../../uploads-private/secret.json"],
      ["a filename inside a subfolder", "images", "sub/photo.png"],
      ["a filename of ..", "images", ".."],
      ["a hidden file", "images", ".hidden.png"],
      ["a symlink pointing outside uploads", "images", "link.png"],
    ])("returns 404 without the file for %s", async (_, type, filename) => {
      const res = await get(type, filename);

      expect(res.status).toBe(404);
      expect(await res.json()).toEqual({ error: "File not found" });
    });
  });
});
