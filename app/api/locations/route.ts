import prisma from "@/app/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse, NextRequest } from "next/server";
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

    const totalItems = await prisma.location.count({
      where: { ...searchObject, ...parentFilter },
    });
    const totalPages = Math.ceil(totalItems / pageSize);

    if (page > 1 && page > totalPages) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    const sortString = url.searchParams.get("sort") || "";
    const orderBy = sortString ? parseSortParams(sortString) : {};

    const locations = await prisma.location.findMany({
      include: {
        parent: true,
        children: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: { ...searchObject, ...parentFilter },
      orderBy: orderBy,
    });

    return NextResponse.json({
      data: locations,
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
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const createdLocation = await prisma.location.create({ data: data });

    return NextResponse.json(createdLocation, { status: 201 });
  } catch (error) {
    console.log(error);
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          return NextResponse.json(
            { error: "A location with this unique field already exists" },
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
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
