"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
    description: "",
    stock: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = "Product name is required";
    if (!form.price) newErrors.price = "Price is required";
    else if (Number(form.price) <= 0)
      newErrors.price = "Price must be greater than 0";

    if (!form.category.trim()) newErrors.category = "Category is required";
    if (!form.image.trim()) newErrors.image = "Image URL is required";
    if (!form.description.trim())
      newErrors.description = "Description is required";

    if (!form.stock) newErrors.stock = "Stock is required";
    else if (Number(form.stock) < 0)
      newErrors.stock = "Stock cannot be negative";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("/api/products/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          price: Number(form.price),
          category: form.category,
          image: form.image,
          description: form.description,
          stock: Number(form.stock),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Product created successfully!");
        router.push("/admin/products");
      } else {
        alert(data.message || "Failed to create product");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-[#1F2937] shadow-lg overflow-hidden border border-[#334155]">
        <div className="px-6 py-8 border-b border-[#334155]">
          <h1 className="text-3xl font-bold text-[#F9FAFB]">Add New Product</h1>
          <p className="mt-2 text-sm text-[#9CA3AF]">
            Fill in the details below to create a new product in your catalog.
          </p>
        </div>

        <form onSubmit={createProduct} className="px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[#9CA3AF] mb-1"
              >
                Product Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg bg-[#0F172A] text-[#F9FAFB] focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition ${
                  errors.name ? "border-[#3B82F6]" : "border-[#334155]"
                }`}
                placeholder="e.g., Wireless Headphones"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-[#3B82F6]">{errors.name}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-[#9CA3AF] mb-1"
              >
                Category *
              </label>
              <input
                id="category"
                name="category"
                type="text"
                value={form.category}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg bg-[#0F172A] text-[#F9FAFB] focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition ${
                  errors.category ? "border-[#3B82F6]" : "border-[#334155]"
                }`}
                placeholder="e.g., Electronics"
              />
              {errors.category && (
                <p className="mt-1 text-sm text-[#3B82F6]">{errors.category}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-[#9CA3AF] mb-1"
              >
                Price ($) *
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min="0.01"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg bg-[#0F172A] text-[#F9FAFB] focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition ${
                  errors.price ? "border-[#3B82F6]" : "border-[#334155]"
                }`}
                placeholder="99.99"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-[#3B82F6]">{errors.price}</p>
              )}
            </div>

            {/* Stock */}
            <div>
              <label
                htmlFor="stock"
                className="block text-sm font-medium text-[#9CA3AF] mb-1"
              >
                Stock Quantity *
              </label>
              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg bg-[#0F172A] text-[#F9FAFB] focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition ${
                  errors.stock ? "border-[#3B82F6]" : "border-[#334155]"
                }`}
                placeholder="100"
              />
              {errors.stock && (
                <p className="mt-1 text-sm text-[#3B82F6]">{errors.stock}</p>
              )}
            </div>

            {/* Image URL */}
            <div className="md:col-span-2">
              <label
                htmlFor="image"
                className="block text-sm font-medium text-[#9CA3AF] mb-1"
              >
                Image URL *
              </label>
              <input
                id="image"
                name="image"
                type="url"
                value={form.image}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg bg-[#0F172A] text-[#F9FAFB] focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition ${
                  errors.image ? "border-[#3B82F6]" : "border-[#334155]"
                }`}
                placeholder="https://example.com/image.jpg"
              />
              {errors.image && (
                <p className="mt-1 text-sm text-[#3B82F6]">{errors.image}</p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-[#9CA3AF] mb-1"
              >
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={form.description}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg bg-[#0F172A] text-[#F9FAFB] focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition ${
                  errors.description ? "border-[#3B82F6]" : "border-[#334155]"
                }`}
                placeholder="Enter a detailed description of the product..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-[#3B82F6]">
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-8 py-3 border border-[#3B82F6] text-[#3B82F6] font-medium rounded-lg hover:bg-[#3B82F6] hover:text-white transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-[#3B82F6] text-white font-medium rounded-lg hover:bg-[#60A5FA] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </>
              ) : (
                "Create Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}