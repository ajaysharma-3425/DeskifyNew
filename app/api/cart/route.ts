import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import { verifyToken } from "@/utils/auth";

export async function GET(req: Request) {
  try {
    await connectDB();

    // ✅ get logged in user from token (same auth.ts)
    const user = verifyToken(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ✅ find cart and populate product details
    const cart = await Cart.findOne({ user: user.userId }).populate("items.product");

    if (!cart) {
      return NextResponse.json({ items: [] });
    }

    return NextResponse.json(cart);

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error fetching cart" },
      { status: 500 }
    );
  }
}
