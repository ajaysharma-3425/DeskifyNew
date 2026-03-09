'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AdminNavbar from '@/components/admin/AdminNavbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { role } = useAuth();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);        // permanent state
  const [hoverSidebar, setHoverSidebar] = useState(false);  // temporary hover state

  // effective width: if hovering, expand; otherwise follow permanent collapsed
  const effectiveCollapsed = hoverSidebar ? false : collapsed;

  // Redirect if not admin (aapka existing logic)
  if (role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNavbar
        collapsed={collapsed}
        onCollapse={setCollapsed}
        effectiveCollapsed={effectiveCollapsed}
        onHoverSidebar={setHoverSidebar}
      />
      <div
        className={`transition-all duration-300 ${effectiveCollapsed ? 'lg:ml-20' : 'lg:ml-64'
          }`}
      >
        <main className=" pb-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
}