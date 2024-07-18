import prisma from "@/app/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const products = await prisma.product.findMany();

  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const createdProduct = await prisma.product.create({ data: data });

  return NextResponse.json(createdProduct, { status: 200 });
}

export async function PUT(request: NextRequest) {
  const data = await request.json();
  const updatedProduct = await prisma.product.update({
    where: { id: data.id },
    data: data,
  });

  return NextResponse.json(updatedProduct, { status: 200 });
}

export async function DELETE(request: NextRequest) {
  const data = await request.json();
  const deletedProduct = await prisma.product.deleteMany({
    where: {
      id: data.id,
    },
  });

  return NextResponse.json(deletedProduct, { status: 200 });
}
