import prisma from "@/app/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse, NextRequest } from "next/server";

function parseAndValidateId(params: { id: string }) {
  const { id } = params;
  const parsedId = parseInt(id, 10);

  if (isNaN(parsedId)) {
    return {
      errorResponse: NextResponse.json(
        { error: "Invalid manufacturer ID" },
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
    const manufacturer = await prisma.manufacturer.findUnique({
      where: { id: parsedId },
    });

    if (!manufacturer) {
      return NextResponse.json(
        { error: "Manufacurer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(manufacturer, { status: 200 });
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

    const updatedManufacturer = await prisma.manufacturer.update({
      where: { id: parsedId },
      data: data,
    });

    return NextResponse.json(updatedManufacturer, { status: 200 });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Manufacturer not found" },
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
    const deletedManufacturer = await prisma.manufacturer.delete({
      where: { id: parsedId },
    });

    return NextResponse.json(deletedManufacturer, { status: 200 });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Manufacturer not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
