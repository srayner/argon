import prisma from "@/app/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { randomUUID } from "crypto";
import createSearchObject from "../functions/create-search-object";
import { IMAGE_EXTENSIONS } from "../functions/image-types";
import parseSortParams from "../functions/parse-sort-params";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const searchTerm = url.searchParams.get("search") || "";
    const searchFields = ["name"];
    const searchObject = createSearchObject(searchFields, searchTerm);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);

    if (page < 1 || pageSize < 1) {
      return NextResponse.json(
        { error: "Invalid pagination parameters" },
        { status: 400 }
      );
    }

    const totalItems = await prisma.image.count({ where: searchObject });
    const totalPages = Math.ceil(totalItems / pageSize);

    if (page > 1 && page > totalPages) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    const sortString = url.searchParams.get("sort") || "";
    const orderBy = sortString ? parseSortParams(sortString) : {};

    const images = await prisma.image.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: searchObject,
      orderBy: orderBy,
    });

    return NextResponse.json({
      data: images,
      meta: {
        totalItems,
        totalPages,
        currentPage: page,
        pageSize,
      },
    });
  } catch (error: any) {
    if (error instanceof PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: "A database error occurred" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "An unknown error occured" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file = data.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const extension = IMAGE_EXTENSIONS[file.type];

  if (!extension) {
    return NextResponse.json(
      { error: "Only PNG, JPEG, WebP and GIF images can be uploaded" },
      { status: 400 }
    );
  }

  const storedName = `${randomUUID()}${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(join(process.cwd(), "uploads", "images", storedName), buffer, { flag: "wx" });

  await prisma.image.create({
    data: {
      href: `/api/uploads/images/${storedName}`,
      name: file.name,
    },
  });

  return NextResponse.json({ success: true });
}
