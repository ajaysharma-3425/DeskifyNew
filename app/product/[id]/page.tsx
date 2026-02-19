"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image"; // optional, if you have next/image configured
import AddToCartButton from "@/components/AddToCartButton";

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
}

export default function ProductDetails() {
  const params = useParams();
  const id = params?.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data.product);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          <div className="md:w-1/2">
            <div className="w-full aspect-square bg-gray-200 rounded-2xl" />
          </div>
          <div className="md:w-1/2 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="h-24 bg-gray-200 rounded w-full" />
            <div className="h-10 bg-gray-200 rounded w-32" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {error || "Product not found"}
        </h2>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Breadcrumb (optional) */}
      <nav className="text-sm text-gray-500 mb-6">
        <span>Home</span> / <span>Products</span> /{" "}
        <span className="text-gray-800 font-medium">{product.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
        {/* Product Image */}
        <div className="lg:w-1/2">
          <div className="relative w-full aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
              // If using Next.js Image:
              // <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="lg:w-1/2 space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            <p className="text-2xl font-semibold text-gray-800">
              ₹{product.price.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="border-t border-b border-gray-200 py-6">
            <h2 className="text-lg font-medium text-gray-900 mb-3">
              Description
            </h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="px-4 py-2 text-gray-900 font-medium w-12 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100"
              >
                +
              </button>
            </div>

            <AddToCartButton productId={product._id} />
          </div>

          {/* Additional info (optional) */}
          <p className="text-sm text-gray-500">Free shipping on orders over ₹500</p>
        </div>
      </div>
    </div>
  );
}