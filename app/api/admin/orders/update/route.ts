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

    const { orderId, status, reason } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { message: "Order ID and status required" },
        { status: 400 }
      );
    }

    const allowedStatuses = [
      "pending",
      "paid",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { message: "Invalid status value" },
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

    // Prevent changing cancelled or delivered orders
    if (order.status === "cancelled" || order.status === "delivered") {
      return NextResponse.json(
        { message: "Order cannot be modified" },
        { status: 400 }
      );
    }

    // If cancelling → reason required
    if (status === "cancelled") {
      if (!reason) {
        return NextResponse.json(
          { message: "Cancel reason required" },
          { status: 400 }
        );
      }
      order.cancelReason = reason;
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