import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { verifyToken } from "@/utils/auth";

export async function POST(req: Request) {
  try {
    await connectDB();

    const user = verifyToken(req);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ message: "Admin only" }, { status: 403 });
    }

    const { orderId, status } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { message: "Order ID and status required" },
        { status: 400 }
      );
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    order.status = status;
    await order.save();

    return NextResponse.json({
      message: "Order status updated",
      order,
    });

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error updating order" },
      { status: 500 }
    );
  }
}
