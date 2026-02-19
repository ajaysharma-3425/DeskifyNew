import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import { verifyToken } from "@/utils/auth";

export async function PUT(req: Request) {
  try {
    await connectDB();

    // ✅ get user from token
    const user = verifyToken(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { productId, quantity } = await req.json();

    if (!productId || quantity === undefined) {
      return NextResponse.json(
        { message: "Product ID and quantity required" },
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

    const itemIndex = cart.items.findIndex(
      (item: any) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { message: "Product not in cart" },
        { status: 404 }
      );
    }

    // if quantity = 0 → remove item
    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();

    // Inside PUT handler – after cart.save()
    await cart.save();

    // Populate the cart before returning
    const updatedCart = await Cart.findById(cart._id).populate("items.product");

    return NextResponse.json({ message: "Cart updated", cart: updatedCart });

    // return NextResponse.json({
    //   message: "Cart updated",
    //   cart,
    // });

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error updating cart" },
      { status: 500 }
    );
  }
}
