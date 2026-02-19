import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import { verifyToken } from "@/utils/auth";

export async function DELETE(req: Request) {
  try {
    await connectDB();

    // ✅ get user from token (same auth.ts)
    const user = verifyToken(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID required" },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ user: user.userId });

    if (!cart) {
      return NextResponse.json(
        { message: "Cart not found" },
        { status: 404 }
      );
    }

    // remove product from cart
    cart.items = cart.items.filter(
      (item: any) => item.product.toString() !== productId
    );

    await cart.save();

    // Inside DELETE handler – after cart.save()
    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate("items.product");
    return NextResponse.json({ message: "Product removed", cart: updatedCart });

    // return NextResponse.json({
    //   message: "Product removed from cart",
    //   cart,
    // });

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error removing item" },
      { status: 500 }
    );
  }
}
