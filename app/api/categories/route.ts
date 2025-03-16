import prisma from "@/app/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse, NextRequest } from "next/server";
import createSearchObject from "../functions/create-search-object";
import parseSortParams from "../functions/parse-sort-params";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const excludeId = url.searchParams.get("exclude") || null;
    const searchTerm = url.searchParams.get("search") || "";
    const searchFields = ["code", "name", "parent.name"];
    const searchObject = createSearchObject(searchFields, searchTerm);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);

    const excludeFilter = excludeId ? { id: { not: excludeId } } : {};

    const parentId = url.searchParams.get("parentId");
    const parentFilter = parentId
      ? { parentId: parentId === "null" ? null : parentId }
      : {};

    if (page < 1 || pageSize < 1) {
      return NextResponse.json(
        { error: "Invalid pagination parameters" },
        { status: 400 }
      );
    }

    const totalItems = await prisma.category.count({
      where: { ...searchObject, ...parentFilter, ...excludeFilter },
    });
    const totalPages = Math.ceil(totalItems / pageSize);

    if (page > 1 && page > totalPages) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    const sortString = url.searchParams.get("sort") || "code";
    const orderBy = sortString ? parseSortParams(sortString) : {};

    const categories = await prisma.category.findMany({
      include: {
        parent: true,
        children: {
          orderBy: { name: "asc" },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: { ...searchObject, ...parentFilter, ...excludeFilter },
      orderBy: orderBy,
    });

    return NextResponse.json({
      data: categories,
      meta: {
        totalItems,
        totalPages,
        currentPage: page,
        pageSize,
      },
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: "A database error occurred" },
        { status: 500 }
      );
    }
    console.log(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const createdCategory = await prisma.category.create({ data: data });

    return NextResponse.json(createdCategory, { status: 201 });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          return NextResponse.json(
            { error: "A category with this unique field already exists" },
            { status: 409 }
          );
        case "P2003":
          return NextResponse.json(
            { error: "Referenced foreign key not found" },
            { status: 400 }
          );
        default:
          return NextResponse.json(
            { error: "A database error occurred" },
            { status: 500 }
          );
      }
    }
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
