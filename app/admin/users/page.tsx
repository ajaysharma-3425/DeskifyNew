"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUsers, FiTrash2, FiShield, FiMail, FiCalendar, FiSearch, FiRefreshCw, FiMoreVertical } from "react-icons/fi";

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
    <div className="min-h-screen bg-[#F5F6F7] text-[#2F2F33] pt-24 pb-20 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-blue-600 mb-2">
                <FiUsers size={24}/>
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Administration</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-[#2F2F33]">
              USER <span className="text-blue-600">CENTRAL.</span>
            </h1>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Access Control & Member Directory</p>
          </div>

          <div className="relative group w-full lg:w-96">
            <input 
              type="text" 
              placeholder="SEARCH PROTOCOL..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-14 pr-6 py-5 bg-white border border-gray-100 rounded-[2rem] w-full shadow-xl shadow-black/5 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all text-[#2F2F33] font-bold placeholder:text-gray-300 text-xs tracking-widest"
            />
            <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-600 size-5" />
          </div>
        </div>

        {/* Desktop Table View (Hidden on Mobile) */}
        <div className="hidden md:block bg-white rounded-[3rem] shadow-2xl shadow-black/5 border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">User Profile</th>
                <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Privilege</th>
                <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Registry Date</th>
                <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Command</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence>
                {loading ? (
                  <tr><td colSpan={4} className="text-center py-24 text-gray-300 font-black uppercase tracking-[0.3em] animate-pulse">Synchronizing Data...</td></tr>
                ) : filteredUsers.map((user) => (
                  <motion.tr 
                    key={user._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-5">
                        <div className="size-14 bg-[#2F2F33] text-white rounded-2xl flex items-center justify-center text-xl font-black shadow-lg shadow-[#2F2F33]/20">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-black text-[#2F2F33] text-lg tracking-tight">{user.name}</div>
                          <div className="text-[11px] text-gray-400 font-bold flex items-center gap-1.5 uppercase tracking-wider">
                            <FiMail className="text-blue-600" /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-7">
                      <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border ${
                        user.role === 'admin' 
                          ? 'bg-rose-50 border-rose-100 text-rose-500' 
                          : 'bg-blue-50 border-blue-100 text-blue-600'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-10 py-7 text-xs text-gray-400 font-black uppercase tracking-widest">
                      <div className="flex items-center gap-2"><FiCalendar className="text-blue-600" /> {new Date(user.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-10 py-7 text-right">
                      <button 
                        onClick={() => deleteUser(user._id)}
                        className="p-4 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Mobile Card View (Visible only on Mobile) */}
        <div className="md:hidden space-y-6">
          <AnimatePresence>
            {loading ? (
              <div className="text-center py-20 text-gray-300 font-black uppercase tracking-widest animate-pulse">Fetching Nodes...</div>
            ) : filteredUsers.map((user) => (
              <motion.div 
                key={user._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-6 rounded-[2rem] shadow-xl shadow-black/5 border border-gray-50 relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="size-12 bg-[#2F2F33] text-white rounded-xl flex items-center justify-center font-black">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-black text-[#2F2F33] tracking-tight">{user.name}</h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{user.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteUser(user._id)}
                    className="p-3 text-rose-500 bg-rose-50 rounded-xl"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-50 flex justify-between items-center">
                   <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                      user.role === 'admin' ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-600'
                   }`}>
                     {user.role}
                   </span>
                   <div className="flex items-center gap-2 text-[9px] font-black text-gray-300 uppercase tracking-widest">
                     <FiCalendar /> {new Date(user.createdAt).toLocaleDateString()}
                   </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {!loading && filteredUsers.length === 0 && (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-gray-200 mt-10 shadow-inner">
             <FiRefreshCw className="mx-auto mb-4 text-gray-200 animate-spin-slow" size={40} />
             <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">No matching protocols found in the database.</p>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}