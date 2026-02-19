"use client";

import { useEffect, useState } from "react";

interface OrderItem {
  product: {
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
}

interface Order {
  _id: string;
  user: {
    email: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      // ✅ API directly returns array, not { orders }
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/admin/orders/update", {  // ✅ same endpoint
        method: "POST",                                // ✅ POST method
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId, status: newStatus }), // ✅ send both fields
      });

      if (!res.ok) throw new Error("Update failed");
      // Refresh list after update
      fetchOrders();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <h1 className="p-10">Loading orders...</h1>;
  if (error) return <h1 className="p-10 text-red-500">Error: {error}</h1>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Admin Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="border p-5 rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row justify-between mb-3">
              <div>
                <p className="font-bold">Order ID: {order._id}</p>
                <p>User: {order.user?.email}</p>
                <p>Total: ₹{order.totalAmount}</p>
              </div>

              <div className="mt-2 md:mt-0">
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  className="border p-2 rounded-md bg-white"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>

            {/* Products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {order.items.map((item, i) => (
                <div key={i} className="border p-3 rounded-lg">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-20 w-full object-cover mb-2 rounded"
                  />
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  <p className="text-sm font-semibold">₹{item.product.price}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}