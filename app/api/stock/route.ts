import prisma from "@/app/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const createdStock = await prisma.stock.create({
      data: data,
    });

    return NextResponse.json(createdStock, { status: 201 });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
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
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
