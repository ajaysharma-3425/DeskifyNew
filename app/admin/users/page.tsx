"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUsers, FiTrash2, FiShield, FiMail, FiCalendar, FiSearch, FiRefreshCw } from "react-icons/fi";

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const deleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });
      if (res.ok) setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F9FAFB] pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-black text-[#F9FAFB] tracking-tighter italic">
              USER <span className="text-[#3B82F6]">MANAGEMENT</span>
            </h1>
            <p className="text-[#9CA3AF] font-medium mt-2">Control and monitor Deskify access protocols.</p>
          </div>

          <div className="relative">
            <input 
              type="text" 
              placeholder="Search user email or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-4 bg-[#111827] border border-[#334155] rounded-2xl w-full md:w-80 shadow-sm focus:ring-2 focus:ring-[#3B82F6]/20 outline-none transition-all text-[#F9FAFB] placeholder:text-[#9CA3AF]"
            />
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] size-5" />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-[#1F2937] rounded-[2.5rem] border border-[#334155] shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#111827]/50 border-b border-[#334155]">
                <tr>
                  <th className="px-8 py-6 text-xs font-black text-[#9CA3AF] uppercase tracking-widest">User Details</th>
                  <th className="px-8 py-6 text-xs font-black text-[#9CA3AF] uppercase tracking-widest">Access Role</th>
                  <th className="px-8 py-6 text-xs font-black text-[#9CA3AF] uppercase tracking-widest">Joined Date</th>
                  <th className="px-8 py-6 text-xs font-black text-[#9CA3AF] uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#334155]">
                <AnimatePresence>
                  {loading ? (
                    <tr><td colSpan={4} className="text-center py-20 text-[#9CA3AF] font-bold italic">Initializing Data...</td></tr>
                  ) : filteredUsers.map((user) => (
                    <motion.tr 
                      key={user._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="hover:bg-[#0F172A]/20 transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="size-12 bg-[#3B82F6]/20 text-[#3B82F6] rounded-2xl flex items-center justify-center font-black">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-[#F9FAFB]">{user.name}</div>
                            <div className="text-xs text-[#9CA3AF] flex items-center gap-1"><FiMail /> {user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                          user.role === 'admin' 
                            ? 'bg-rose-900/30 text-rose-300' 
                            : 'bg-[#3B82F6]/20 text-[#3B82F6]'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-sm text-[#9CA3AF] font-medium">
                        <div className="flex items-center gap-2"><FiCalendar className="text-[#9CA3AF]" /> {new Date(user.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => deleteUser(user._id)}
                          className="p-3 text-[#9CA3AF] hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {!loading && filteredUsers.length === 0 && (
          <div className="text-center py-20 italic text-[#9CA3AF]">No users found matching your search.</div>
        )}
      </div>
    </div>
  );
}