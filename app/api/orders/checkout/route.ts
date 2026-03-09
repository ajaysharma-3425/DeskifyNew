import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import Order from "@/models/Order";
import { verifyToken } from "@/utils/auth";

export async function POST(req: Request) {
  try {
    await connectDB();

    const user = verifyToken(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { shippingAddress, paymentMethod, transactionId, paymentStatus } = await req.json();


    if (!shippingAddress) {
      return NextResponse.json(
        { message: "Shipping address required" },
        { status: 400 }
      );
    }

    // Get cart with populated products
    const cart = await Cart.findOne({ user: user.userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { message: "Cart is empty" },
        { status: 400 }
      );
    }

    // Filter out items with null products (deleted products)
    const validItems = cart.items.filter((item: any) => item.product);

    if (validItems.length === 0) {
      return NextResponse.json(
        { message: "All products in cart are unavailable" },
        { status: 400 }
      );
    }


    // Prepare order items and calculate total
    let totalAmount = 0;
    const orderItems = validItems.map((item: any) => {
      const product = item.product;
      totalAmount += product.price * item.quantity;

      return {
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image || "", // handle image (could be string or array)
      };
    });

    // Create order
    // Create order with NEW fields
    const order = await Order.create({
      user: user.userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || "COD",
      paymentStatus: paymentStatus || "Pending",
      transactionId: transactionId || "",
    });

    // 🧹 Clear cart AFTER order creation
    cart.items = [];
    await cart.save();

    return NextResponse.json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    return NextResponse.json(
      { message: "Error placing order" },
      { status: 500 }
    );
  }
}