"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiPlus, FiEdit3, FiTrash2, FiBox, FiLayers, FiChevronLeft, FiChevronRight } from "react-icons/fi";

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
      getProducts();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  useEffect(() => { getProducts(); }, []);

  const totalProducts = products.length;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const SkeletonCard = () => (
    <div className="bg-white rounded-[2.5rem] p-6 border border-gray-100 animate-pulse shadow-sm">
      <div className="aspect-square w-full bg-gray-100 rounded-3xl mb-6"></div>
      <div className="h-4 bg-gray-100 rounded-full w-2/3 mb-3"></div>
      <div className="h-3 bg-gray-50 rounded-full w-1/3 mb-6"></div>
      <div className="flex gap-3 mt-auto">
        <div className="h-10 bg-gray-100 rounded-2xl w-full"></div>
        <div className="h-10 bg-gray-100 rounded-2xl w-full"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F6F7] text-[#2F2F33] pb-20">
      <div className="max-w-7xl mx-auto px-6 pt-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tighter mb-2">
              Product <span className="text-blue-600">Inventory</span>
            </h1>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
              Manage and organize your digital catalog
            </p>
          </div>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#2F2F33] text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-black/10 active:scale-95"
          >
            <FiPlus size={16} />
            Add New Product
          </Link>
        </div>

        {/* Stats Row */}
        {!loading && products.length > 0 && (
          <div className="mb-8 flex items-center justify-between">
            <div className="px-5 py-2 bg-white rounded-full border border-gray-100 shadow-sm">
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Showing <span className="text-blue-600">{startIndex + 1} - {Math.min(startIndex + itemsPerPage, totalProducts)}</span> of {totalProducts}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <FiLayers className="text-blue-600" /> Catalog Active
            </div>
          </div>
        )}

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[3.5rem] border border-gray-100 shadow-sm">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-300">
              <FiBox size={48} />
            </div>
            <h3 className="text-2xl font-black text-[#2F2F33] mb-3">No Products Found</h3>
            <p className="text-gray-400 text-[11px] font-black uppercase tracking-widest mb-10">Start building your store catalog today</p>
            <Link href="/admin/products/new" className="px-10 py-4 bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
                Launch First Product
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {currentProducts.map((product) => (
                <div
                  key={product._id}
                  className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 overflow-hidden flex flex-col"
                >
                  {/* Image Container */}
                  <div className="p-4">
                    <div className="aspect-square overflow-hidden bg-gray-50 rounded-[2rem] relative border border-gray-50">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x400?text=No+Image"; }}
                        />
                        <div className="absolute top-4 left-4">
                             <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black text-[#2F2F33] uppercase tracking-widest shadow-sm">
                                {product.category}
                            </span>
                        </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-8 pb-8 flex-1 flex flex-col">
                    <h2 className="text-lg font-black text-[#2F2F33] tracking-tight group-hover:text-blue-600 transition-colors truncate">
                      {product.name}
                    </h2>
                    <p className="text-2xl font-black text-[#2F2F33] mt-2 tracking-tighter">
                      ₹{product.price.toLocaleString()}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-8">
                      <Link
                        href={`/admin/products/${product._id}`}
                        className="flex-1 flex items-center justify-center gap-2 py-4 bg-gray-50 text-[#2F2F33] text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all"
                      >
                        <FiEdit3 size={14} /> Edit
                      </Link>
                      <button
                        onClick={() => deleteProduct(product._id)}
                        className="w-14 flex items-center justify-center py-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-rose-50 hover:text-rose-600 transition-all"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Premium Pagination */}
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center items-center gap-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-blue-600 hover:border-blue-100 disabled:opacity-30 transition-all shadow-sm"
                >
                  <FiChevronLeft size={20} />
                </button>
                
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-3xl border border-gray-100 shadow-sm">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-2xl text-[11px] font-black transition-all ${
                        currentPage === page
                            ? "bg-[#2F2F33] text-white shadow-lg"
                            : "text-gray-400 hover:bg-gray-50"
                        }`}
                    >
                        {page}
                    </button>
                    ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-blue-600 hover:border-blue-100 disabled:opacity-30 transition-all shadow-sm"
                >
                  <FiChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}