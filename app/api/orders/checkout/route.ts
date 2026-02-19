import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import Order from "@/models/Order";
import { verifyToken } from "@/utils/auth";

export async function POST(req: Request) {
  try {
    await connectDB();

    // ✅ user from token
    const user = verifyToken(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { shippingAddress } = await req.json();

    if (!shippingAddress) {
      return NextResponse.json(
        { message: "Shipping address required" },
        { status: 400 }
      );
    }

    // 🛒 get cart with products
    const cart = await Cart.findOne({ user: user.userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { message: "Cart is empty" },
        { status: 400 }
      );
    }

    // 💰 calculate total + prepare order items
    let totalAmount = 0;

    const orderItems = cart.items.map((item: any) => {
      const product = item.product;

      totalAmount += product.price * item.quantity;

      return {
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image,
      };
    });

    // 📦 create order
    const order = await Order.create({
      user: user.userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
    });

    // 🧹 clear cart after order
    cart.items = [];
    await cart.save();

    return NextResponse.json({
      message: "Order placed successfully",
      order,
    });

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error placing order" },
      { status: 500 }
    );
  }
}
