import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Product from "@/models/Product";
import Order from "@/models/Order";

export async function GET(req: Request) {
  await connectDB();

  const user = verifyToken(req);

  if (!user || user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();

  return NextResponse.json({
    totalUsers,
    totalProducts,
    totalOrders,
  });
}
