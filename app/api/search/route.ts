import prisma from "@/app/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse, NextRequest } from "next/server";
import { buildPropertiesSearchObject } from "../functions/customPropertyFilter";
import parseSortParams from "../functions/parse-sort-params";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const searchObject = buildPropertiesSearchObject(data.customProperties);

    //console.log(JSON.stringify(searchObject, null, 2));
    //return NextResponse.json({ data: [] });

    const page = parseInt(data.page || "1", 10);
    const pageSize = parseInt(data.page || "10", 10);

    if (page < 1 || pageSize < 1) {
      return NextResponse.json(
        { error: "Invalid pagination parameters" },
        { status: 400 }
      );
    }

    const totalItems = await prisma.product.count({ where: searchObject });
    const totalPages = Math.ceil(totalItems / pageSize);

    if (page > 1 && page > totalPages) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    const sortString = data.sort || "";
    const orderBy = sortString ? parseSortParams(sortString) : {};

    const products = await prisma.product.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: searchObject,
      orderBy: orderBy,
      include: {
        category: true,
        manufacturer: true,
        supplier: true,
        image: true,
      },
    });

    return NextResponse.json({
      data: products,
      meta: {
        totalItems,
        totalPages,
        currentPage: page,
        pageSize,
      },
    });
  } catch (error) {
    console.log(error);
    if (error instanceof PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: "A database error occurred" },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
