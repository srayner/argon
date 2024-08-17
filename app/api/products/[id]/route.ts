import prisma from "@/app/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse, NextRequest } from "next/server";

function parseAndValidateId(params: { id: string }) {
  const { id } = params;
  const parsedId = parseInt(id, 10);

  if (isNaN(parsedId)) {
    return {
      errorResponse: NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      ),
    };
  }

  return { parsedId };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { errorResponse, parsedId } = parseAndValidateId(params);

  if (errorResponse) return errorResponse;

  try {
    const product = await prisma.product.findUnique({
      where: { id: parsedId },
      include: {
        manufacturer: true,
        supplier: true,
        image: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { errorResponse, parsedId } = parseAndValidateId(params);

  if (errorResponse) return errorResponse;

  try {
    const data = await request.json();
    delete data.id;

    const updatedProduct = await prisma.product.update({
      where: { id: parsedId },
      data: data,
      include: {
        manufacturer: true,
        supplier: true,
        image: true,
      },
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { errorResponse, parsedId } = parseAndValidateId(params);

  if (errorResponse) return errorResponse;

  try {
    const deletedProduct = await prisma.product.delete({
      where: { id: parsedId },
    });

    return NextResponse.json(deletedProduct, { status: 200 });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
