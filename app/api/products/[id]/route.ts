import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await context.params;   // ⭐ FIX HERE

        const product = await Product.findById(id);

        if (!product) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ product });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Error fetching product" },
            { status: 500 }
        );
    }
}


// UPDATE PRODUCT
export async function PUT(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await context.params;

        const body = await req.json();

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            body,
            { new: true }
        );

        if (!updatedProduct) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Product updated successfully",
            product: updatedProduct,
        });

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Error updating product" },
            { status: 500 }
        );
    }
}

// DELETE PRODUCT
export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await context.params;

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Product deleted successfully",
        });

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Error deleting product" },
            { status: 500 }
        );
    }
}
