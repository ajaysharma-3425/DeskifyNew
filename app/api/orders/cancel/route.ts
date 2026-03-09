import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { verifyToken } from "@/utils/auth";

export async function PATCH(req: Request) {
  try {
    await connectDB();

    // 🔐 Verify User
    const user = verifyToken(req);
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 📦 Get orderId from body
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { message: "Order ID is required" },
        { status: 400 }
      );
    }

    // 🔎 Find Order
    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    // 🚫 Check Ownership
    if (order.user.toString() !== user.userId) {
      return NextResponse.json(
        { message: "You are not allowed to cancel this order" },
        { status: 403 }
      );
    }

    // ❌ Check Status
    if (
      order.status !== "pending" &&
      order.status !== "paid"
    ) {
      return NextResponse.json(
        { message: "Order cannot be cancelled at this stage" },
        { status: 400 }
      );
    }

    // ✅ Cancel Order
    order.status = "cancelled";
    order.cancelReason = "Cancelled by user";
    order.cancelledBy = "user";

    await order.save();

    return NextResponse.json(
      { message: "Order cancelled successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Cancel order error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}