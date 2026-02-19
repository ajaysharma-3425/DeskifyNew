import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface DashboardData {
    totalProducts: number;
    totalOrders: number;
    totalUsers: number;
}

async function getDashboardData(): Promise<DashboardData | null> {
    try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/dashboard`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        if (res.status === 401) return null;

        const data = await res.json();
        return data;
    } catch {
        return null;
    }
}

export default async function AdminDashboard() {
    const data = await getDashboardData();

    // not admin → redirect home
    if (!data) redirect("/");

    return (
        <div className="max-w-6xl mx-auto px-6 py-10">
            <h1 className="text-3xl font-bold mb-10">Admin Dashboard</h1>

            <div className="grid grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow">
                    <h2 className="text-gray-500">Products</h2>
                    <p className="text-3xl font-bold">{data.totalProducts}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <h2 className="text-gray-500">Orders</h2>
                    <p className="text-3xl font-bold">{data.totalOrders}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <h2 className="text-gray-500">Users</h2>
                    <p className="text-3xl font-bold">{data.totalUsers}</p>
                </div>
            </div>
        </div>
    );
}
