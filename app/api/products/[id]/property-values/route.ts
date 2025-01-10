import prisma from "@/app/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const parsedProductId = parseInt(params.id, 10);
    console.log(parsedProductId);

    if (isNaN(parsedProductId)) {
      return NextResponse.json(
        { error: "Invalid productId format" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: parsedProductId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const propertyValues = await prisma.propertyValue.findMany({
      where: { productId: parsedProductId },
      orderBy: {
        property: { name: "asc" },
      },
      include: {
        property: true,
      },
    });

    return NextResponse.json({ data: propertyValues });
  } catch (error: any) {
    if (error instanceof PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: "A database error occurred" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "An unknown error occured" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Parse the productId from the URL
    const parsedProductId = parseInt(params.id, 10);

    // Validate the productId
    if (isNaN(parsedProductId) || parsedProductId <= 0) {
      return NextResponse.json(
        { error: "Invalid productId format" },
        { status: 400 }
      );
    }

    // Parse the request body to get property value data
    const body = await request.json();
    const { propertyId, valueString, valueNumeric } = body;

    // Check if the product exists
    const product = await prisma.product.findUnique({
      where: { id: parsedProductId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Fetch the property to check its type
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Invalid propertyId." },
        { status: 400 }
      );
    }

    // Validate that only the correct field is provided
    if (property.type === "STRING") {
      if (valueNumeric != null) {
        return NextResponse.json(
          {
            error: "This property expects a string value, not a numeric value.",
          },
          { status: 400 }
        );
      }
      if (typeof valueString !== "string" || valueString.trim() === "") {
        return NextResponse.json(
          { error: "This property expects a non-empty string value." },
          { status: 400 }
        );
      }
    }

    if (property.type !== "STRING") {
      if (valueString != null) {
        return NextResponse.json(
          {
            error: "This property expects a numeric value, not a string value.",
          },
          { status: 400 }
        );
      }
      if (typeof valueNumeric !== "number" || isNaN(valueNumeric)) {
        return NextResponse.json(
          { error: "This property expects a valid numeric value." },
          { status: 400 }
        );
      }
    }

    // Create the new property value for the product
    const propertyValue = await prisma.propertyValue.upsert({
      where: {
        productId_propertyId: {
          productId: parsedProductId,
          propertyId,
        },
      },
      update: {
        valueString,
        valueNumeric,
      },
      create: {
        productId: parsedProductId,
        propertyId,
        valueString,
        valueNumeric,
      },
    });

    return NextResponse.json({ data: propertyValue }, { status: 201 });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      console.log(error);
      if (
        error.code === "P2003" &&
        error.meta &&
        "modelName" in error.meta &&
        "field_name" in error.meta
      ) {
        const { modelName, field_name } = error.meta;
        return NextResponse.json({
          error: `The ${error.meta?.field_name} provided for ${error.meta?.modelName} is invalid or doesn't exist. Please check your input.`,
          status: 400,
        });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(error);
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
