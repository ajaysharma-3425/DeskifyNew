import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { verifyToken } from "@/utils/auth";

export async function POST(req: Request) {
  try {
    await connectDB();

    const decoded = verifyToken(req);

    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json(
        { message: "Admin access required" },
        { status: 403 }
      );
    }

    const { name, description, price, category, images, stock } =
      await req.json();

    if (!name || !description || !price || !category) {
      return NextResponse.json(
        { message: "All fields required" },
        { status: 400 }
      );
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      images,
      stock,
    });

    return NextResponse.json(
      { message: "Product added", product },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error adding product" },
      { status: 500 }
    );
  }
}
