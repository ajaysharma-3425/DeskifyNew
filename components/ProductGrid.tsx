import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
}

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
      {products.map((product) => (
        <Link
          key={product._id}
          href={`/product/${product._id}`}
          className="group"
        >
          <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200">
            <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
              <img
                src={product.image || "/placeholder.jpg"}
                alt={product.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h2 className="font-semibold text-gray-800 text-lg mb-1 line-clamp-2">
                {product.name}
              </h2>
              <p className="text-xl font-bold text-gray-900">
                ₹{product.price.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}