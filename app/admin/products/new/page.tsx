"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiPlusCircle, FiBox, FiDollarSign, FiTag, FiImage, FiFileText, FiActivity } from "react-icons/fi";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.price || Number(form.price) <= 0) newErrors.price = "Enter valid price";
    if (!form.category.trim()) newErrors.category = "Category is required";
    if (!form.image.trim()) newErrors.image = "Image URL is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (!form.stock || Number(form.stock) < 0) newErrors.stock = "Invalid stock";
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
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
        }),
      });

      if (res.ok) {
        router.push("/admin/products");
      } else {
        const data = await res.json();
        alert(data.message || "Failed to create");
      }
    } catch (error) {
      alert("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6F7] pb-20">
      <div className="max-w-5xl mx-auto px-6 pt-12">
        {/* Navigation & Header */}
        <button 
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-blue-600 transition-colors mb-8"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" size={14} />
          Back to Inventory
        </button>

        <div className="mb-12">
          <h1 className="text-5xl font-black tracking-tighter text-[#2F2F33]">
            New <span className="text-blue-600">Creation.</span>
          </h1>
          <p className="mt-3 text-gray-400 text-[11px] font-black uppercase tracking-[0.3em]">
            Expansion of the Deskify Ecosystem
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Form Area */}
          <div className="lg:col-span-2">
            <form onSubmit={createProduct} className="space-y-8 bg-white p-10 rounded-[3rem] shadow-xl shadow-black/5 border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Name */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
                    <FiTag className="text-blue-600" /> Product Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-[#2F2F33] placeholder:text-gray-300"
                    placeholder="Minimalist Desk Mat"
                  />
                  {errors.name && <p className="text-[10px] font-bold text-rose-500 mt-1">{errors.name}</p>}
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
                    <FiBox className="text-blue-600" /> Category
                  </label>
                  <input
                    name="category"
                    type="text"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-[#2F2F33]"
                    placeholder="Accessories"
                  />
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
                    <FiDollarSign className="text-blue-600" /> Price (INR)
                  </label>
                  <input
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-[#2F2F33]"
                    placeholder="2499"
                  />
                </div>

                {/* Stock */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
                    <FiActivity className="text-blue-600" /> Initial Stock
                  </label>
                  <input
                    name="stock"
                    type="number"
                    value={form.stock}
                    onChange={handleChange}
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-[#2F2F33]"
                    placeholder="50"
                  />
                </div>

                {/* Image URL */}
                <div className="md:col-span-2 space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
                    <FiImage className="text-blue-600" /> Image Repository Link
                  </label>
                  <input
                    name="image"
                    type="url"
                    value={form.image}
                    onChange={handleChange}
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-[#2F2F33]"
                    placeholder="https://cloudinary.com/..."
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2 space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
                    <FiFileText className="text-blue-600" /> Product Narrative
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    value={form.description}
                    onChange={handleChange}
                    className="w-full px-6 py-4 rounded-3xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-[#2F2F33] resize-none"
                    placeholder="Crafted for the elite professional..."
                  />
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-5 bg-[#2F2F33] text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-black/10 disabled:opacity-50"
                >
                  {loading ? "Processing..." : <><FiPlusCircle size={18} /> Deploy to Catalog</>}
                </button>
              </div>
            </form>
          </div>

          {/* Side Advertisement & Brand Section */}
          <div className="space-y-8">
            <div className="bg-blue-600 p-8 rounded-[3rem] text-white shadow-2xl shadow-blue-600/30">
              <h3 className="text-2xl font-black tracking-tighter mb-4 italic">Deskify Elite</h3>
              <p className="text-[11px] font-medium leading-relaxed opacity-90 mb-6 uppercase tracking-wider">
                Every product you add today defines the future of minimalist workspaces. Deskify isn't just a store; it's a lifestyle for the modern developer.
              </p>
              <div className="pt-6 border-t border-white/20">
                <p className="text-[9px] font-black uppercase tracking-[0.2em]">Efficiency Protocol</p>
                <p className="text-lg font-black tracking-tighter mt-1">100% Focused.</p>
              </div>
            </div>

            <div className="bg-[#2F2F33] p-8 rounded-[3rem] text-white relative overflow-hidden group">
               <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-2">Did you know?</h4>
               <p className="text-xs font-bold leading-relaxed text-gray-300">
                 Adding detailed descriptions increases "Deskify" conversion rates by 40%. Quality over Quantity.
               </p>
            </div>
            
            <div className="text-center px-4">
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">© 2026 DESKIFY INTERACTIVE</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}