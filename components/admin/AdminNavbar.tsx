'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import {
  FiMenu,
  FiChevronDown,
  FiChevronRight,
  FiX,
  FiSearch,
  FiBell,
  FiUser,
  FiHome,
  FiCpu,
  FiShoppingBag,
  FiCalendar,
  FiCheckSquare,
  FiFileText,
  FiGrid,
  FiBookOpen,
  FiMessageSquare,
  FiHelpCircle,
  FiLogOut,
  FiMoreVertical,
} from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from '../ui/ThemeToggle'; // ⚠️ This component still needs conversion separately

const menuItems = [
  {
    name: 'Dashboard',
    icon: FiHome,
    subItems: [
      { name: 'Ecommerce', href: '/admin/dashboard' },
      { name: 'Analytics', href: '/admin/analytics' },
      { name: 'Marketing', href: '/admin/marketing' },
      { name: 'CRM', href: '/admin/crm' },
      { name: 'Stocks', href: '/admin/stocks' },
      { name: 'SaaS', href: '/admin/saas' },
      { name: 'Logistics', href: '/admin/logistics' },
      { name: 'Orders', href: '/admin/orders' },
    ],
  },
  {
    name: 'AI Assistant',
    icon: FiCpu,
    subItems: [
      { name: 'Text Generator', href: '/admin/text-generator' },
      { name: 'Image Generator', href: '/admin/image-generator' },
      { name: 'Code Generator', href: '/admin/code-generator' },
      { name: 'Video Generator', href: '/admin/video-generator' },
    ],
  },
  {
    name: 'E-Commerce',
    icon: FiShoppingBag,
    subItems: [
      { name: 'Products', href: '/admin/products' },
      { name: 'Add Product', href: '/admin/products/new' },
      { name: 'Billing', href: '/admin/billing' },
      { name: 'Invoices', href: '/admin/invoice' },
      { name: 'Single Invoice', href: '/admin/single-invoice' },
      { name: 'Transactions', href: '/admin/transactions' },
      { name: 'Single Transaction', href: '/admin/single-transaction' },
    ],
  },
  { name: 'Calendar', href: '/admin/calendar', icon: FiCalendar },
  { name: 'User Profile', href: '/admin/profile', icon: FiUser },
  { name: 'Task', href: '/admin/task', icon: FiCheckSquare },
  { name: 'Forms', href: '/admin/forms', icon: FiFileText },
  { name: 'Tables', href: '/admin/tables', icon: FiGrid },
  { name: 'Users', href: '/admin/users', icon: FiBookOpen },
];

interface AdminNavbarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  effectiveCollapsed: boolean;
  onHoverSidebar: (hovering: boolean) => void;
}

export default function AdminNavbar({
  collapsed,
  onCollapse,
  effectiveCollapsed,
  onHoverSidebar,
}: AdminNavbarProps) {
  const { logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    Dashboard: true,
  });

  const toggleMenu = (menuName: string) => {
    setOpenMenus(prev => ({ ...prev, [menuName]: !prev[menuName] }));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Top Navbar – Slate Dark (#111827) */}
      <nav
        className={`sticky top-0 z-40 bg-[#111827] border-b border-[#334155] px-4 sm:px-6 lg:px-8 py-3 transition-all duration-300 ${effectiveCollapsed ? 'lg:ml-20' : 'lg:ml-64'
          }`}
      >
        <div className="flex items-center justify-between">
          {/* Left section */}
          <div className="flex items-center flex-1">
            {/* Desktop hamburger */}
            <button
              onClick={() => onCollapse(!collapsed)}
              className="hidden lg:block p-2 mr-2 text-[#F9FAFB] hover:bg-[#60A5FA] hover:text-white rounded-md transition-colors"
              aria-label="Toggle sidebar"
            >
              <FiMenu size={24} />
            </button>
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 mr-2 text-[#F9FAFB] hover:bg-[#60A5FA] hover:text-white rounded-md transition-colors"
            >
              <FiMenu size={24} />
            </button>

            {/* Search input */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={18} />
                <input
                  type="text"
                  placeholder="Search or type command..."
                  className="w-full pl-10 pr-4 py-2 border border-[#334155] rounded-lg bg-[#0F172A] text-[#F9FAFB] placeholder-[#9CA3AF] focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition"
                />
              </div>
            </div>
          </div>

          {/* Right icons */}
          <div className="flex items-center space-x-3">
            <ThemeToggle /> {/* ⚠️ Needs separate conversion */}
            <button className="p-2 rounded-full text-[#F9FAFB] hover:bg-[#60A5FA] hover:text-white transition-colors relative">
              <FiBell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#3B82F6] rounded-full"></span>
            </button>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center space-x-2 p-1 rounded-full text-[#F9FAFB] hover:bg-[#60A5FA] hover:text-white transition-colors"
              >
                <div className="w-8 h-8 bg-[#334155] rounded-full flex items-center justify-center">
                  <FiUser className="text-[#F9FAFB]" size={18} />
                </div>
                <FiChevronDown className={`transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>
              <div
                className={`absolute right-0 mt-2 w-48 bg-[#111827] rounded-lg shadow-lg border border-[#334155] py-2 z-50 transform transition-all duration-200 ease-out origin-top-right
            ${profileOpen
                    ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                  }`}
              >
                <Link
                  href="/admin/profile"
                  className="block px-4 py-2 text-sm text-[#F9FAFB] hover:bg-[#60A5FA] hover:text-white"
                >
                  Edit Profile
                </Link>
                <Link
                  href="/admin/settings"
                  className="block px-4 py-2 text-sm text-[#F9FAFB] hover:bg-[#60A5FA] hover:text-white"
                >
                  Account Settings
                </Link>
                <Link
                  href="/support"
                  className="block px-4 py-2 text-sm text-[#F9FAFB] hover:bg-[#60A5FA] hover:text-white"
                >
                  Support
                </Link>
                <div className="border-t border-[#334155] my-2"></div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm border border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white transition-colors"
                // removed mx-2, using px-4 py-2 for consistent padding
                >
                  Sign Out
                </button>
                
              </div>
            </div>
              

          </div>
        </div>
      </nav>

      {/* Sidebar (desktop) – Darker Slate (#111827) */}
      <aside
        className={`fixed left-0 top-0 h-full bg-[#111827] border-r border-[#334155] transition-all duration-300 z-30 hidden lg:block ${effectiveCollapsed ? 'w-20' : 'w-64'
          }`}
        onMouseEnter={() => onHoverSidebar(true)}
        onMouseLeave={() => onHoverSidebar(false)}
      >
        <div className="flex flex-col h-full relative">
          {/* Hover handle */}
          <div className="absolute right-0 top-0 w-2 h-full cursor-ew-resize hover:bg-[#60A5FA]/50" />

          {/* Logo area */}
          {/* Logo area */}
          <div className="flex items-center justify-between p-4">
            <div
              className="flex items-center space-x-2 p-1 rounded cursor-pointer transition-colors"
              onMouseEnter={() => onHoverSidebar(true)}
              onMouseLeave={() => onHoverSidebar(false)}
              onClick={() => onCollapse(!collapsed)}
            >
              <img src="/apple.png" alt="Logo" className="h-8 w-auto mr-10 hover:shadow-green-500" />
              {!effectiveCollapsed && (
                <span className="text-lg font-bold">
                  <span className="text-[#3B82F6] font-bold text-2xl">Des</span>
                  <span className="text-[#F9FAFB] font-bold text-2xl">Kify</span>
                </span>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const hasSubItems = item.subItems && item.subItems.length > 0;
                const isOpen = openMenus[item.name];

                return (
                  <li key={item.name}>
                    {hasSubItems ? (
                      // Button with submenu
                      <button
                        onClick={() => toggleMenu(item.name)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${isOpen
                          ? 'bg-[rgba(59,130,246,0.15)] text-[#3B82F6]'
                          : 'text-[#F9FAFB] hover:bg-[#60A5FA] hover:text-white'
                          }`}
                      >
                        <div className="flex items-center">
                          <item.icon
                            size={20}
                            className={isOpen ? 'text-[#3B82F6]' : ''}
                          />
                          {!effectiveCollapsed && (
                            <span className="ml-3 text-sm font-medium">{item.name}</span>
                          )}
                        </div>
                        {!effectiveCollapsed &&
                          (isOpen ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />)}
                      </button>
                    ) : (
                      // Direct link
                      <Link
                        href={item.href!}
                        className={`flex items-center p-3 rounded-lg transition-colors ${isActive(item.href!)
                          ? 'bg-[rgba(59,130,246,0.15)] text-[#3B82F6]'
                          : 'text-[#F9FAFB] hover:bg-[#60A5FA] hover:text-white'
                          }`}
                      >
                        <item.icon
                          size={20}
                          className={isActive(item.href!) ? 'text-[#3B82F6]' : ''}
                        />
                        {!effectiveCollapsed && <span className="ml-3 text-sm font-medium">{item.name}</span>}
                      </Link>
                    )}

                    {/* Submenu items */}
                    {!effectiveCollapsed && hasSubItems && isOpen && (
                      <ul
                        className={`ml-8 mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                          }`}
                      >
                        {item.subItems.map((subItem) => (
                          <li key={subItem.name}>
                            <Link
                              href={subItem.href}
                              className={`flex items-center p-2 rounded-lg transition-colors ${isActive(subItem.href)
                                ? 'bg-[rgba(59,130,246,0.15)] text-[#3B82F6]'
                                : 'text-[#9CA3AF] hover:bg-[#60A5FA] hover:text-white'
                                }`}
                            >
                              <span className="text-sm">{subItem.name}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer support links */}
          <div className="p-4 border-t border-[#334155]">
            {!effectiveCollapsed ? (
              <div className="space-y-2">
                <Link
                  href="/support"
                  className="flex items-center text-sm text-[#9CA3AF] hover:bg-[#60A5FA] hover:text-white p-2 rounded-lg transition-colors"
                >
                  <FiHelpCircle size={16} className="mr-2" />
                  Support
                </Link>
                <Link
                  href="/chat"
                  className="flex items-center text-sm text-[#9CA3AF] hover:bg-[#60A5FA] hover:text-white p-2 rounded-lg transition-colors"
                >
                  <FiMessageSquare size={16} className="mr-2" />
                  Chat
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-3">
                <Link href="/support" title="Support">
                  <FiHelpCircle size={20} className="text-[#9CA3AF] hover:text-[#60A5FA] transition-colors" />
                </Link>
                <Link href="/chat" title="Chat">
                  <FiMessageSquare size={20} className="text-[#9CA3AF] hover:text-[#60A5FA] transition-colors" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
          <div className="fixed top-0 left-0 w-64 h-full bg-[#111827] z-50 shadow-xl transform transition-transform duration-300 lg:hidden">
            <div className="p-4 border-b border-[#334155] flex justify-between items-center">
              <span className="text-xl font-bold text-[#F9FAFB]">DesKify</span>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded text-[#F9FAFB] hover:bg-[#60A5FA] hover:text-white transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-2">
                {menuItems.map((item) => {
                  const hasSubItems = item.subItems && item.subItems.length > 0;
                  const isOpen = openMenus[item.name];

                  return (
                    <li key={item.name}>
                      {hasSubItems ? (
                        <button
                          onClick={() => toggleMenu(item.name)}
                          className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${isOpen
                            ? 'bg-[rgba(59,130,246,0.15)] text-[#3B82F6]'
                            : 'text-[#F9FAFB] hover:bg-[#60A5FA] hover:text-white'
                            }`}
                        >
                          <div className="flex items-center">
                            <item.icon
                              size={20}
                              className={isOpen ? 'text-[#3B82F6]' : ''}
                            />
                            <span className="ml-3 text-sm font-medium">{item.name}</span>
                          </div>
                          {isOpen ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
                        </button>
                      ) : (
                        <Link
                          href={item.href!}
                          onClick={() => setMobileSidebarOpen(false)} // ✅ close sidebar on click
                          className={`flex items-center p-3 rounded-lg transition-colors ${isActive(item.href!)
                            ? 'bg-[rgba(59,130,246,0.15)] text-[#3B82F6]'
                            : 'text-[#F9FAFB] hover:bg-[#60A5FA] hover:text-white'
                            }`}
                        >
                          <item.icon
                            size={20}
                            className={isActive(item.href!) ? 'text-[#3B82F6]' : ''}
                          />
                          <span className="ml-3 text-sm font-medium">{item.name}</span>
                        </Link>
                      )}

                      {hasSubItems && isOpen && (
                        <ul className="ml-8 mt-1 space-y-1">
                          {item.subItems.map((subItem) => (
                            <li key={subItem.name}>
                              <Link
                                href={subItem.href}
                                onClick={() => setMobileSidebarOpen(false)} // ✅ close sidebar on click
                                className={`flex items-center p-2 rounded-lg transition-colors ${isActive(subItem.href)
                                  ? 'bg-[rgba(59,130,246,0.15)] text-[#3B82F6]'
                                  : 'text-[#9CA3AF] hover:bg-[#60A5FA] hover:text-white'
                                  }`}
                              >
                                <span className="text-sm">{subItem.name}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
                <li className="pt-4 border-t border-[#334155]">
                  <Link
                    href="/support"
                    onClick={() => setMobileSidebarOpen(false)} // ✅ close sidebar on click
                    className="flex items-center p-2 text-[#9CA3AF] hover:bg-[#60A5FA] hover:text-white rounded-lg transition-colors"
                  >
                    <FiHelpCircle size={18} className="mr-2" />
                    <span className="text-sm">Support</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/chat"
                    onClick={() => setMobileSidebarOpen(false)} // ✅ close sidebar on click
                    className="flex items-center p-2 text-[#9CA3AF] hover:bg-[#60A5FA] hover:text-white rounded-lg transition-colors"
                  >
                    <FiMessageSquare size={18} className="mr-2" />
                    <span className="text-sm">Chat</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </>
      )}
    </>
  );
}