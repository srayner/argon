import prisma from "@/app/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log(JSON.stringify(data, null, 2));

    return NextResponse.json({
      data: [],
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      console.log(error);
      return NextResponse.json(
        { error: "A database error occurred" },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
