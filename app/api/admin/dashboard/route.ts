import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import User from "@/models/User";
import { verifyToken } from "@/utils/auth";

export async function GET(req: Request) {
  try {
    await connectDB();

    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const [products, orders, users] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments(),
    ]);

    const revenueAgg = await Order.aggregate([
      { $match: { status: "delivered" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const revenue = revenueAgg[0]?.total || 0;

    return NextResponse.json({
      products,
      orders,
      users,
      revenue,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Dashboard error" },
      { status: 500 }
    );
  }
}