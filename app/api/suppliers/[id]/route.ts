import prisma from "@/app/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse, NextRequest } from "next/server";

function parseAndValidateId(params: { id: string }) {
  const { id } = params;
  const parsedId = parseInt(id, 10);

  if (isNaN(parsedId)) {
    return {
      errorResponse: NextResponse.json(
        { error: "Invalid supplier ID" },
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
    const supplier = await prisma.supplier.findUnique({
      where: { id: parsedId },
      include: {
        image: true,
      },
    });

    if (!supplier) {
      return NextResponse.json(
        { error: "Supplier not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(supplier, { status: 200 });
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

    const updatedSupplier = await prisma.supplier.update({
      where: { id: parsedId },
      data: data,
    });

    return NextResponse.json(updatedSupplier, { status: 200 });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Supplier not found" },
        { status: 404 }
      );
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
    const deletedSupplier = await prisma.supplier.delete({
      where: { id: parsedId },
    });

    return NextResponse.json(deletedSupplier, { status: 200 });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Supplier not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
