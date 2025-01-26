import prisma from "@/app/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categoriesCount = await prisma.category.count();
    const locationsCount = await prisma.location.count();
    const manufacturerCount = await prisma.manufacturer.count();
    const supplierCount = await prisma.supplier.count();
    const productCount = await prisma.product.count();
    const imageCount = await prisma.image.count();

    return NextResponse.json({
      data: {
        categories: {
          count: categoriesCount,
        },
        locations: {
          count: locationsCount,
        },
        manufacturers: {
          count: manufacturerCount,
        },
        suppliers: {
          count: supplierCount,
        },
        products: {
          count: productCount,
        },
        images: {
          count: imageCount,
        },
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
