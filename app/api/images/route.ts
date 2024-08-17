import prisma from "@/app/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import createSearchObject from "../functions/create-search-object";
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
  const createdSupplier = await prisma.image.create({
    data: {
      href,
      name: file.name,
    },
  });

  return NextResponse.json({ success: true });
}
