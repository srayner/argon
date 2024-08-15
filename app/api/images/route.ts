import prisma from "@/app/prisma";
import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get("file") as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const path = join(process.cwd(), "public/images/", file.name);
  await writeFile(path, buffer);
  console.log(`open ${path} to see the uploaded file`);

  const encodedFilename = encodeURIComponent(file.name);
  console.log(encodedFilename);
  const href = join("/images/", encodeURIComponent(file.name));
  const createdSupplier = await prisma.image.create({ data: { href } });

  return NextResponse.json({ success: true });
}
