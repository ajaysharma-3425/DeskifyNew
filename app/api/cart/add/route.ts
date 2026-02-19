import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { verifyToken } from "@/utils/auth";

export async function POST(req: Request) {
  try {
    await connectDB();

    // ✅ user from token (your auth.ts)
    const user = verifyToken(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { productId, quantity } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID required" },
        { status: 400 }
      );
    }

    // check product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // find user's cart
    let cart = await Cart.findOne({ user: user.userId });

    // create cart if not exist
    if (!cart) {
      cart = await Cart.create({
        user: user.userId,
        items: [{ product: productId, quantity: quantity || 1 }],
      });

      return NextResponse.json({
        message: "Cart created & product added",
        cart,
      });
    }

    // check if product already exists in cart
    const itemIndex = cart.items.findIndex(
      (item: any) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity || 1;
    } else {
      cart.items.push({
        product: productId,
        quantity: quantity || 1,
      });
    }

    await cart.save();

    return NextResponse.json({
      message: "Product added to cart",
      cart,
    });

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error adding to cart" },
      { status: 500 }
    );
  }
}
