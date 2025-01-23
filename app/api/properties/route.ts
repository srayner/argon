import prisma from "@/app/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const categoryId = url.searchParams.get("categoryId") || "";
    const searchObject = { categoryId: categoryId };
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);

    if (page < 1 || pageSize < 1) {
      return NextResponse.json(
        { error: "Invalid pagination parameters" },
        { status: 400 }
      );
    }

    const totalItems = await prisma.property.count({ where: searchObject });
    const totalPages = Math.ceil(totalItems / pageSize);

    if (page > 1 && page > totalPages) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    const properties = await prisma.property.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: searchObject,
      include: {
        propertyValues: {
          select: {
            valueString: true,
            valueNumeric: true,
          },
        },
      },
    });

    const aggregatedProperties = properties.map((property) => {
      const useNumeric = property.type !== "STRING";

      const aggregatedValues: Array<{ value: any; count: number }> = [];

      property.propertyValues.forEach((pv) => {
        const value = useNumeric ? pv.valueNumeric : pv.valueString;

        if (value !== null && value !== undefined) {
          const existingEntry = aggregatedValues.find(
            (entry) => entry.value === value
          );

          if (existingEntry) {
            existingEntry.count++;
          } else {
            aggregatedValues.push({ value, count: 1 });
          }
        }
      });

      return {
        ...property,
        propertyValues: aggregatedValues,
      };
    });

    return NextResponse.json({
      data: aggregatedProperties,
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
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const createdProperty = await prisma.property.create({ data: data });

    return NextResponse.json(createdProperty, { status: 201 });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          return NextResponse.json(
            { error: "A property with this unique field already exists" },
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
    console.log(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
