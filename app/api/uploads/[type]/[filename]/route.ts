import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import mime from "mime-types";
import { IMAGE_EXTENSIONS } from "@/app/api/functions/image-types";

interface Params {
  type: string;
  filename: string;
}

const ALLOWED_TYPES = ["images"];

function notFound() {
  return NextResponse.json({ error: "File not found" }, { status: 404 });
}

export async function GET(request: NextRequest, props: { params: Promise<Params> }) {
  const { type, filename } = await props.params;

  if (!ALLOWED_TYPES.includes(type) || path.basename(filename) !== filename || filename.startsWith(".")) {
    return notFound();
  }

  try {
    const baseDirectory = await fs.realpath(path.join(process.cwd(), "uploads", type));
    const filePath = await fs.realpath(path.join(baseDirectory, filename));

    if (!filePath.startsWith(baseDirectory + path.sep)) {
      return notFound();
    }

    const contentType = mime.lookup(filePath);

    if (!contentType) {
      return notFound();
    }

    const file = await fs.readFile(filePath);
    const headers: Record<string, string> = {
      "Content-Type": contentType,
      "X-Content-Type-Options": "nosniff",
    };

    if (!(contentType in IMAGE_EXTENSIONS)) {
      headers["Content-Disposition"] = "attachment";
    }

    return new NextResponse(file, { headers });
  } catch {
    return notFound();
  }
}
