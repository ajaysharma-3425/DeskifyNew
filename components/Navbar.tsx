'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from "next/navigation";
import {
  FiMenu, FiX, FiShoppingCart, FiUser, FiLogOut, FiHome,
  FiPackage, FiInfo, FiChevronDown, FiChevronUp, FiMail,
  FiHeart, FiSearch, FiStar, FiBookOpen, FiFileText, FiGrid
} from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

function NavbarContent() {
  const { token, role, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const { itemCount } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(false);
  const [mobilePagesOpen, setMobilePagesOpen] = useState(false);
  const [mobileBlogsOpen, setMobileBlogsOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) {
        setMobileSearchOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (mobileSearchOpen && mobileInputRef.current) {
      mobileInputRef.current.focus();
    }
  }, [mobileSearchOpen]);

  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
    setPagesOpen(false);
    setMobileSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const query = searchParams.get("search");
    if (query) setSearchQuery(query);
  }, [searchParams]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setProfileOpen(false);
    router.push('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/product?search=${encodeURIComponent(searchQuery)}`);
      setMobileSearchOpen(false);
    } else {
      router.push(`/product`);
    }
  };

  const isUser = token && role === 'user';
  const linkClasses = (path: string) => `
    relative text-sm font-medium text-[#1F2937] hover:text-[#10B981] transition-colors whitespace-nowrap
    after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-[#10B981] after:transition-all hover:after:w-full
    ${pathname === path ? 'text-[#10B981] after:w-full' : ''}
  `;

  return (
    <>
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-[#E5E7EB] shadow-sm animate-fadeIn">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div className="flex items-center">
              <button onClick={() => setMenuOpen(true)} className="md:hidden p-2 mr-1 text-[#6B7280] hover:bg-[#F9FAFB] rounded-md transition-colors">
                <FiMenu size={24} />
              </button>
              <Link href="/" className="flex items-center space-x-2">
                <div className="relative w-8 h-8 sm:w-9 sm:h-9">
                  <Image src="/Logo.png" alt="Logo" fill className="object-contain" priority />
                </div>
                <span className="text-xl md:text-2xl font-bold">
                  <span className="text-[#10B981]">Des</span>kify
                </span>
              </Link>
            </div>

            <form onSubmit={handleSearch} className="hidden md:flex flex-grow max-w-xl relative group">
              <input
                type="text"
                placeholder="Search for premium products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 px-6 pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
              />
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            </form>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <button onClick={() => setMobileSearchOpen(true)} className="sm:hidden p-2 text-[#6B7280] hover:text-[#10B981] transition-colors">
                <FiSearch size={20} />
              </button>

              {isUser ? (
                <div className="hidden md:block relative" ref={dropdownRef}>
                  <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center space-x-1 text-[#1F2937]">
                    <FiUser size={20} />
                    <span className="text-sm font-medium">Account</span>
                    <FiChevronDown size={14} />
                  </button>
                  {profileOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#E5E7EB] py-2 z-50">
                      <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-[#F9FAFB]">Profile</Link>
                      <Link href="/my-orders" className="block px-4 py-2 text-sm hover:bg-[#F9FAFB]">My Orders</Link>
                      <hr className="my-1 border-[#E5E7EB]" />
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-[#F9FAFB]">Sign Out</button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-3 text-sm font-medium">
                  <Link href="/login" className="hover:text-[#10B981]">Sign In</Link>
                  <span className="text-gray-300">|</span>
                  <Link href="/signup" className="hover:text-[#10B981]">Register</Link>
                </div>
              )}

              {isUser && (
                <>
                  <Link href="/whitelist" className="p-2 text-[#6B7280] hover:text-[#10B981]"><FiHeart size={20} /></Link>
                  <Link href="/cart" className="relative p-2 text-[#6B7280] hover:text-[#10B981]">
                    <FiShoppingCart size={20} />
                    {mounted && itemCount > 0 && (
                      <span className="absolute top-0 right-0 bg-[#10B981] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center animate-fadeIn">
                        {itemCount}
                      </span>
                    )}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Secondary Navbar */}
      <div className="hidden md:block sticky top-20 z-20 bg-white border-b border-[#E5E7EB] animate-fadeIn">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center space-x-8">
              <Link href="/" className={linkClasses('/')}>Home</Link>
              <Link href="/popular" className={linkClasses('/popular')}>Popular</Link>
              <Link href="/product" className={linkClasses('/product')}>Shop</Link>
              <Link href="/my-contact" className={linkClasses('/my-contact')}>Contact</Link>
              
              <div className="relative group">
                <button onMouseEnter={() => setPagesOpen(true)} className="flex items-center space-x-1 text-sm font-medium text-[#1F2937]">
                  <span>Pages</span><FiChevronDown size={14} />
                </button>
                <div className="hidden group-hover:block absolute top-full left-0 w-40 bg-white border border-[#E5E7EB] shadow-lg py-2">
                  <Link href="/about" className="block px-4 py-2 text-sm hover:bg-[#F9FAFB]">About</Link>
                  <Link href="/faq" className="block px-4 py-2 text-sm hover:bg-[#F9FAFB]">FAQ</Link>
                </div>
              </div>

              {/* Blogs Dropdown Desktop */}
              <div className="relative group">
                <button className="flex items-center space-x-1 text-sm font-medium text-[#1F2937]">
                  <span>Blogs</span><FiChevronDown size={14} />
                </button>
                <div className="hidden group-hover:block absolute top-full left-0 w-40 bg-white border border-[#E5E7EB] shadow-lg py-2">
                  <Link href="/blog" className="block px-4 py-2 text-sm hover:bg-[#F9FAFB]">News</Link>
                  <Link href="/blog/tips" className="block px-4 py-2 text-sm hover:bg-[#F9FAFB]">Tips</Link>
                </div>
              </div>
            </div>
            <div className="flex items-center text-sm font-bold italic">
              <span className="bg-[#84CC16] text-white px-2 py-0.5 rounded text-[10px] mr-2">SALE</span>
              <span className="text-[#1F2937]">Best Selling</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Popup */}
      {mobileSearchOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileSearchOpen(false)} />
          <div ref={mobileSearchRef} className="fixed top-[20%] left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white rounded-2xl shadow-2xl z-50 md:hidden overflow-hidden border border-[#E5E7EB] animate-fadeIn">
            <div className="p-4 border-b border-[#E5E7EB] flex justify-between items-center bg-[#F9FAFB]">
              <span className="text-sm font-bold text-[#10B981]">Search Products</span>
              <button onClick={() => setMobileSearchOpen(false)} className="p-1 hover:bg-gray-200 rounded-full"><FiX size={18} /></button>
            </div>
            <form onSubmit={handleSearch} className="p-4">
              <div className="relative">
                <input ref={mobileInputRef} type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 pl-10 text-sm outline-none" />
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              </div>
              <button type="submit" className="w-full mt-4 bg-[#10B981] text-white py-2.5 rounded-xl text-sm font-bold">Search</button>
            </form>
          </div>
        </>
      )}

      {/* Mobile Drawer (Matches image_509ab2.png exactly) */}
      {menuOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMenuOpen(false)} />
          <div className="fixed top-0 left-0 w-72 h-full bg-white z-50 shadow-2xl md:hidden overflow-y-auto">
            <div className="p-5 border-b flex justify-between items-center bg-[#F9FAFB]">
              <span className="text-xl font-bold text-[#10B981]">Deskify Menu</span>
              <button onClick={() => setMenuOpen(false)} className="p-2"><FiX size={22} /></button>
            </div>
            <nav className="p-4 space-y-1">
              <MobileLink href="/" icon={<FiHome />} label="Home" onClick={() => setMenuOpen(false)} />
              <MobileLink href="/popular" icon={<FiStar />} label="Popular" onClick={() => setMenuOpen(false)} />
              <MobileLink href="/product" icon={<FiPackage />} label="Shop" onClick={() => setMenuOpen(false)} />
              
              {/* Pages Accordion Mobile */}
              <div>
                <button onClick={() => setMobilePagesOpen(!mobilePagesOpen)} className="w-full flex items-center justify-between p-3 text-[#1F2937] hover:bg-[#F0FDF4] rounded-lg">
                  <div className="flex items-center space-x-3"><FiBookOpen /> <span>Pages</span></div>
                  {mobilePagesOpen ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {mobilePagesOpen && (
                  <div className="ml-9 mt-1 space-y-1 border-l-2 border-[#10B981]/20">
                    <Link href="/about" onClick={() => setMenuOpen(false)} className="block p-2 text-sm text-gray-600">About Us</Link>
                    <Link href="/faq" onClick={() => setMenuOpen(false)} className="block p-2 text-sm text-gray-600">FAQ</Link>
                  </div>
                )}
              </div>

              {/* Blogs Accordion Mobile */}
              <div>
                <button onClick={() => setMobileBlogsOpen(!mobileBlogsOpen)} className="w-full flex items-center justify-between p-3 text-[#1F2937] hover:bg-[#F0FDF4] rounded-lg">
                  <div className="flex items-center space-x-3"><FiFileText /> <span>Blogs</span></div>
                  {mobileBlogsOpen ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {mobileBlogsOpen && (
                  <div className="ml-9 mt-1 space-y-1 border-l-2 border-[#10B981]/20">
                    <Link href="/blog" onClick={() => setMenuOpen(false)} className="block p-2 text-sm text-gray-600">News</Link>
                    <Link href="/blog/tips" onClick={() => setMenuOpen(false)} className="block p-2 text-sm text-gray-600">Tips</Link>
                  </div>
                )}
              </div>

              <MobileLink href="/my-contact" icon={<FiMail />} label="Contact" onClick={() => setMenuOpen(false)} />
              
              <hr className="my-4" />

              {isUser ? (
                <div className="space-y-1">
                   <MobileLink href="/profile" icon={<FiUser />} label="Profile" onClick={() => setMenuOpen(false)} />
                   <MobileLink href="/my-orders" icon={<FiGrid />} label="My Orders" onClick={() => setMenuOpen(false)} />
                   <button onClick={handleLogout} className="w-full flex items-center space-x-3 p-3 text-red-600 hover:bg-red-50 rounded-lg">
                    <FiLogOut /> <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <Link href="/login" onClick={() => setMenuOpen(false)} className="text-center py-2 bg-gray-100 rounded-lg text-xs font-bold">Login</Link>
                  <Link href="/signup" onClick={() => setMenuOpen(false)} className="text-center py-2 bg-[#10B981] text-white rounded-lg text-xs font-bold">Register</Link>
                </div>
              )}
            </nav>
          </div>
        </>
      )}
    </>
  );
}

function MobileLink({ href, icon, label, onClick }: any) {
  return (
    <Link href={href} onClick={onClick} className="flex items-center space-x-3 p-3 text-[#1F2937] hover:bg-[#F0FDF4] hover:text-[#10B981] rounded-lg transition-colors">
      <span className="text-lg">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<div className="h-16 md:h-20 bg-white shadow-sm" />}>
      <NavbarContent />
    </Suspense>
  );
}