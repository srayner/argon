import prisma from "@/app/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse, NextRequest } from "next/server";
import buildChildrenInclude from "../../functions/build-children-include";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url);
  const depth = parseInt(searchParams.get("depth") || "1", 10);

  try {
    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        ...buildChildrenInclude(depth),
        parent: true,
        properties: true,
        image: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    delete data.id;

    const updatedCategory = await prisma.category.update({
      where: { id: params.id },
      data: data,
    });

    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          return NextResponse.json(
            { error: "A category with this unique field already exists" },
            { status: 409 }
          );
        case "P2025":
          return NextResponse.json(
            { error: "Category not found" },
            { status: 404 }
          );
      }
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
    const deletedCategory = await prisma.category.delete({
      where: { id: params.id },
    });

    return NextResponse.json(deletedCategory, { status: 200 });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
