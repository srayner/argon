import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import mime from "mime-types";

interface Params {
  type: string;
  filename: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { type, filename } = params;
  const baseDirectory = path.join(process.cwd(), "uploads");
  const fileDirectory = path.join(baseDirectory, type);
  const filePath = path.join(fileDirectory, filename);

  try {
    const file = await fs.readFile(filePath);
    const contentType = mime.lookup(filePath);

    if (!contentType) {
      throw new Error("Unsupported file type");
    }

    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}
