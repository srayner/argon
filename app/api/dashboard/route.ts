import prisma from "@/app/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const manufacturerCount = await prisma.manufacturer.count();
    const supplierCount = await prisma.supplier.count();
    const productCount = await prisma.product.count();
    const imageCount = await prisma.image.count();

    return NextResponse.json({
      data: {
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
