"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const getProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.products);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      getProducts(); // refresh list
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  // Pagination calculations
  const totalProducts = products.length;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Skeleton loader
  const SkeletonCard = () => (
    <div className="border border-[#334155] bg-[#1F2937] rounded-xl p-4 animate-pulse">
      <div className="h-40 w-full bg-[#334155] rounded-lg mb-4"></div>
      <div className="h-5 bg-[#334155] rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-[#334155] rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-[#334155] rounded w-1/3 mb-4"></div>
      <div className="flex gap-2">
        <div className="h-8 bg-[#334155] rounded w-16"></div>
        <div className="h-8 bg-[#334155] rounded w-16"></div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-[#0F172A] min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F9FAFB]">
            Products
          </h1>
          <p className="mt-1 text-sm text-[#9CA3AF]">
            Manage your product catalog
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="mt-4 sm:mt-0 inline-flex items-center justify-center px-5 py-2.5 bg-[#3B82F6] text-white font-medium rounded-lg hover:bg-[#60A5FA] transition-all duration-300 shadow-lg"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add Product
        </Link>
      </div>

      {/* Stats / Summary */}
      {!loading && products.length > 0 && (
        <div className="mb-6 flex items-center justify-between text-sm text-[#9CA3AF]">
          <span>
            Showing <span className="font-medium text-[#F9FAFB]">{startIndex + 1}</span> to{" "}
            <span className="font-medium text-[#F9FAFB]">{Math.min(endIndex, totalProducts)}</span> of{" "}
            <span className="font-medium text-[#F9FAFB]">{totalProducts}</span> products
          </span>
        </div>
      )}

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: itemsPerPage }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-[#1F2937] rounded-lg border-2 border-dashed border-[#334155]">
          <svg
            className="mx-auto h-12 w-12 text-[#9CA3AF]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-[#F9FAFB]">
            No products yet
          </h3>
          <p className="mt-1 text-sm text-[#9CA3AF]">
            Get started by creating your first product.
          </p>
          <div className="mt-6">
            <Link
              href="/admin/products/new"
              className="inline-flex items-center px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#60A5FA] transition-all duration-300"
            >
              Add Product
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {currentProducts.map((product) => (
              <div
                key={product._id}
                className="group bg-[#1F2937] border border-[#334155] rounded-xl shadow-lg hover:shadow-2xl hover:border-[#3B82F6] transition-all duration-300 overflow-hidden"
              >
                {/* Image Container */}
                <div className="aspect-square overflow-hidden bg-[#0F172A]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/400x400?text=No+Image";
                    }}
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  <h2 className="font-semibold text-[#F9FAFB] truncate">
                    {product.name}
                  </h2>
                  <p className="text-sm text-[#9CA3AF] mt-1 capitalize">
                    {product.category}
                  </p>
                  <p className="text-lg font-bold text-[#F9FAFB] mt-2">
                    ₹{product.price.toLocaleString()}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    <Link
                      href={`/admin/products/${product._id}`}
                      className="flex-1 text-center px-3 py-2 border border-[#3B82F6] text-[#3B82F6] font-medium rounded-lg hover:bg-[#3B82F6] hover:text-white transition-all duration-300 text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="flex-1 px-3 py-2 border border-red-600 text-[#3B82F6] font-medium rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center space-x-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-[#334155] rounded-lg text-[#9CA3AF] hover:bg-[#1F2937] hover:text-[#F9FAFB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-10 h-10 rounded-lg transition-colors ${
                    currentPage === page
                      ? "bg-[#3B82F6] text-white"
                      : "text-[#9CA3AF] hover:bg-[#1F2937] hover:text-[#F9FAFB]"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-[#334155] rounded-lg text-[#9CA3AF] hover:bg-[#1F2937] hover:text-[#F9FAFB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}