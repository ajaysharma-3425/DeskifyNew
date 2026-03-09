import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/utils/auth";

export async function GET(req: Request) {
  try {
    await connectDB();

    const decoded = verifyToken(req);

    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(decoded.userId).select("-password");

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching user" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDB();

    const decoded = verifyToken(req);

    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone } = body;

    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      {
        name,
        phone,
      },
      { new: true }
    ).select("-password");

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating profile" },
      { status: 500 }
    );
  }
}