import prisma from "@/app/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse, NextRequest } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { productId: string; propertyValueId: string } }
) {
  const { productId, propertyValueId } = params;
  try {
    const deletedPropertyValue = await prisma.propertyValue.delete({
      where: { id: propertyValueId },
    });

    return NextResponse.json(deletedPropertyValue, { status: 200 });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Property Value not found" },
        { status: 404 }
      );
    }

    console.log(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
