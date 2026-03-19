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
} from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';

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
    setOpenMenus((prev) => ({ ...prev, [menuName]: !prev[menuName] }));
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

  // Reusable Nav Link Component for both Sidebars
  const NavItem = ({ item, isMobile = false }: { item: any; isMobile?: boolean }) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isOpen = openMenus[item.name];
    const active = isActive(item.href || '');
    const showLabels = isMobile || !effectiveCollapsed;

    return (
      <li key={item.name} className="list-none">
        {hasSubItems ? (
          <div>
            <button
              onClick={() => toggleMenu(item.name)}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                isOpen ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center">
                <item.icon size={20} />
                {showLabels && <span className="ml-3 text-sm font-medium">{item.name}</span>}
              </div>
              {showLabels && (isOpen ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />)}
            </button>
            {showLabels && isOpen && (
              <ul className="ml-9 mt-1 space-y-1">
                {item.subItems.map((sub: any) => (
                  <li key={sub.name}>
                    <Link
                      href={sub.href}
                      onClick={() => isMobile && setMobileSidebarOpen(false)}
                      className={`block p-2 text-sm rounded-lg transition-colors ${
                        isActive(sub.href) ? 'text-white font-semibold bg-white/5' : 'text-gray-500 hover:text-white'
                      }`}
                    >
                      {sub.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <Link
            href={item.href!}
            onClick={() => isMobile && setMobileSidebarOpen(false)}
            className={`flex items-center p-3 rounded-xl transition-all ${
              active ? 'bg-white text-[#2F2F33] shadow-lg font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <item.icon size={20} />
            {showLabels && <span className="ml-3 text-sm font-medium">{item.name}</span>}
          </Link>
        )}
      </li>
    );
  };

  return (
    <>
      {/* --- TOP NAVBAR --- */}
      <nav
        className={`sticky top-0 z-40 bg-[#F5F6F7] border-b border-gray-200 px-4 sm:px-8 py-3 transition-all duration-300 ${
          effectiveCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1">
            {/* Toggle Buttons */}
            <button
              onClick={() => onCollapse(!collapsed)}
              className="hidden lg:flex p-2 mr-4 text-[#2F2F33] hover:bg-white rounded-lg border border-transparent hover:border-gray-200 transition-all shadow-sm"
            >
              <FiMenu size={22} />
            </button>
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 mr-4 text-[#2F2F33] hover:bg-white rounded-lg transition-all"
            >
              <FiMenu size={22} />
            </button>

            {/* Search Bar */}
            <div className="flex-1 max-w-md hidden md:block">
              <div className="relative group">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2F2F33]" size={18} />
                <input
                  type="text"
                  placeholder="Quick search..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-[#2F2F33] focus:outline-none focus:ring-2 focus:ring-[#2F2F33]/5 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            
            <button className="p-2 rounded-lg text-[#2F2F33] hover:bg-white border border-transparent hover:border-gray-200 transition-all relative">
              <FiBell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#F5F6F7]"></span>
            </button>

            {/* Profile Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center space-x-3 p-1 pr-3 rounded-full bg-white border border-gray-200 hover:shadow-md transition-all"
              >
                <div className="w-8 h-8 bg-[#2F2F33] rounded-full flex items-center justify-center text-white font-bold text-xs">
                  AD
                </div>
                <FiChevronDown className={`text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              <div
                className={`absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 transition-all duration-200 origin-top-right ${
                  profileOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                }`}
              >
                <div className="px-4 py-3 border-b border-gray-50 mb-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Admin Panel</p>
                  <p className="text-sm font-semibold text-[#2F2F33]">Deskify Manager</p>
                </div>
                <Link href="/admin/profile" className="flex items-center px-4 py-2.5 text-sm text-[#2F2F33] hover:bg-[#F5F6F7] transition-colors"><FiUser className="mr-3" /> Profile</Link>
                <Link href="/admin/settings" className="flex items-center px-4 py-2.5 text-sm text-[#2F2F33] hover:bg-[#F5F6F7] transition-colors"><FiGrid className="mr-3" /> Settings</Link>
                <div className="border-t border-gray-50 my-2"></div>
                <button onClick={handleLogout} className="w-full flex items-center px-4 py-2.5 text-sm text-rose-600 font-bold hover:bg-rose-50 transition-colors">
                  <FiLogOut className="mr-3" /> Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* --- DESKTOP SIDEBAR --- */}
      <aside
        className={`fixed left-0 top-0 h-full bg-[#2F2F33] transition-all duration-300 z-30 hidden lg:block ${
          effectiveCollapsed ? 'w-20' : 'w-64'
        }`}
        onMouseEnter={() => onHoverSidebar(true)}
        onMouseLeave={() => onHoverSidebar(false)}
      >
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="h-20 flex items-center px-6">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onCollapse(!collapsed)}>
              <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-lg shadow-black/20">
                <img src="/apple.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              {!effectiveCollapsed && (
                <span className="text-2xl font-black text-white tracking-tighter">
                  Des<span className="text-gray-400">Kify</span>
                </span>
              )}
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
            {menuItems.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>

          {/* Footer Support */}
          <div className="p-4 border-t border-white/5 bg-black/10">
            <Link href="/support" className="flex items-center space-x-3 p-3 text-gray-400 hover:text-white transition-colors rounded-xl hover:bg-white/5">
              <FiHelpCircle size={20} />
              {!effectiveCollapsed && <span className="text-sm font-medium">Help & Support</span>}
            </Link>
          </div>
        </div>
      </aside>

      {/* --- MOBILE SIDEBAR & OVERLAY --- */}
      {mobileSidebarOpen && (
        <>
          <div 
            className="fixed inset-0 bg-[#2F2F33]/60 backdrop-blur-md z-[60] lg:hidden transition-opacity"
            onClick={() => setMobileSidebarOpen(false)} 
          />
          <div className="fixed top-0 left-0 w-80 h-full bg-[#2F2F33] z-[70] shadow-2xl lg:hidden flex flex-col transform transition-transform duration-300 ease-in-out">
            <div className="p-6 flex justify-between items-center border-b border-white/5 bg-black/10">
              <div className="flex items-center space-x-3">
                 <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1"><img src="/apple.png" alt="L" /></div>
                 <span className="text-xl font-black text-white tracking-tight">DesKify</span>
              </div>
              <button onClick={() => setMobileSidebarOpen(false)} className="p-2 text-gray-400 hover:text-white">
                <FiX size={24} />
              </button>
            </div>
            
            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
              {menuItems.map((item) => (
                <NavItem key={item.name} item={item} isMobile={true} />
              ))}
              <div className="border-t border-white/5 my-4 pt-4">
                 <Link href="/support" onClick={() => setMobileSidebarOpen(false)} className="flex items-center p-3 text-gray-400 hover:text-white rounded-xl"><FiHelpCircle className="mr-3" /> Support</Link>
                 <Link href="/chat" onClick={() => setMobileSidebarOpen(false)} className="flex items-center p-3 text-gray-400 hover:text-white rounded-xl"><FiMessageSquare className="mr-3" /> Chat</Link>
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  );
}