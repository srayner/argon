import prisma from "@/app/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse, NextRequest } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    delete data.id;

    const updatedStock = await prisma.stock.update({
      where: { id: params.id },
      data: data,
    });

    return NextResponse.json(updatedStock, { status: 200 });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "Stock not found" }, { status: 404 });
    }
    console.log(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deletedStock = await prisma.stock.delete({
      where: { id: params.id },
    });

    return NextResponse.json(deletedStock, { status: 200 });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "Stock not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
