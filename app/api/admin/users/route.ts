import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db"; // Apna DB connection path check karein
import User from "@/models/User";

// GET: Sabhi users ko fetch karna
export async function GET() {
  try {
    await connectDB();
    // Hum password ko exclude kar rahe hain security ke liye
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// DELETE: User ko remove karna
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { id } = await req.json();
    await User.findByIdAndDelete(id);
    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}