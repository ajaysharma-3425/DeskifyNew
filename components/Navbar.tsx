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
    relative text-sm font-medium text-white/70 hover:text-[#A4F000] transition-colors whitespace-nowrap
    after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-[#A4F000] after:transition-all hover:after:w-full
    ${pathname === path ? 'text-[#A4F000] after:w-full' : ''}
  `;

  return (
    <>
      <nav className="sticky top-0 z-30 bg-[#003F3A]/90 backdrop-blur-md border-b border-white/5 shadow-lg animate-fadeIn">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div className="flex items-center">
              <button onClick={() => setMenuOpen(true)} className="md:hidden p-2 mr-1 text-white hover:bg-white/10 rounded-md transition-colors">
                <FiMenu size={24} />
              </button>
              <Link href="/" className="flex items-center space-x-2">
                <div className="relative w-8 h-8 sm:w-9 sm:h-9">
                  <Image src="/Logo.png" alt="Logo" fill className="object-contain" priority />
                </div>
                <span className="text-xl md:text-2xl font-bold text-white">
                  <span className="text-[#A4F000]">Des</span>kify
                </span>
              </Link>
            </div>

            <form onSubmit={handleSearch} className="hidden md:flex flex-grow max-w-xl relative group">
              <input
                type="text"
                placeholder="Search for premium products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-2xl py-2.5 px-6 pl-12 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#A4F000]/20 focus:border-[#A4F000]/50 transition-all placeholder:text-white/20"
              />
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#A4F000] transition-colors" />
            </form>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <button onClick={() => setMobileSearchOpen(true)} className="sm:hidden p-2 text-white/70 hover:text-[#A4F000] transition-colors">
                <FiSearch size={20} />
              </button>

              {isUser ? (
                <div className="hidden md:block relative" ref={dropdownRef}>
                  <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center space-x-1 text-white">
                    <FiUser size={20} className="text-[#A4F000]" />
                    <span className="text-sm font-medium">Account</span>
                    <FiChevronDown size={14} className="text-white/50" />
                  </button>
                  {profileOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-[#003F3A] rounded-xl shadow-2xl border border-white/10 py-2 z-50 overflow-hidden">
                      <Link href="/profile" className="block px-4 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-[#A4F000]">Profile</Link>
                      <Link href="/my-orders" className="block px-4 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-[#A4F000]">My Orders</Link>
                      <hr className="my-1 border-white/5" />
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-rose-400 hover:bg-white/5">Sign Out</button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-3 text-sm font-medium text-white/80">
                  <Link href="/login" className="hover:text-[#A4F000]">Sign In</Link>
                  <span className="text-white/10">|</span>
                  <Link href="/signup" className="hover:text-[#A4F000]">Register</Link>
                </div>
              )}

              {isUser && (
                <>
                  <Link href="/whitelist" className="p-2 text-white/70 hover:text-[#A4F000]"><FiHeart size={20} /></Link>
                  <Link href="/cart" className="relative p-2 text-white/70 hover:text-[#A4F000]">
                    <FiShoppingCart size={20} />
                    {mounted && itemCount > 0 && (
                      <span className="absolute top-0 right-0 bg-[#A4F000] text-[#003F3A] text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center animate-fadeIn">
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
      <div className="hidden md:block sticky top-20 z-20 bg-[#003F3A] border-b border-white/5 animate-fadeIn">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center space-x-8">
              <Link href="/" className={linkClasses('/')}>Home</Link>
              <Link href="/popular" className={linkClasses('/popular')}>Popular</Link>
              <Link href="/product" className={linkClasses('/product')}>Shop</Link>
              <Link href="/my-contact" className={linkClasses('/my-contact')}>Contact</Link>
              
              <div className="relative group">
                <button onMouseEnter={() => setPagesOpen(true)} className="flex items-center space-x-1 text-sm font-medium text-white/70 hover:text-[#A4F000]">
                  <span>Pages</span><FiChevronDown size={14} />
                </button>
                <div className="hidden group-hover:block absolute top-full left-0 w-40 bg-[#003F3A] border border-white/10 shadow-2xl py-2">
                  <Link href="/about" className="block px-4 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-[#A4F000]">About</Link>
                  <Link href="/faq" className="block px-4 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-[#A4F000]">FAQ</Link>
                </div>
              </div>

              <div className="relative group">
                <button className="flex items-center space-x-1 text-sm font-medium text-white/70 hover:text-[#A4F000]">
                  <span>Blogs</span><FiChevronDown size={14} />
                </button>
                <div className="hidden group-hover:block absolute top-full left-0 w-40 bg-[#003F3A] border border-white/10 shadow-2xl py-2">
                  <Link href="/blog" className="block px-4 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-[#A4F000]">News</Link>
                  <Link href="/blog/tips" className="block px-4 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-[#A4F000]">Tips</Link>
                </div>
              </div>
            </div>
            <div className="flex items-center text-sm font-bold italic">
              <span className="bg-[#A4F000] text-[#003F3A] px-2 py-0.5 rounded text-[10px] mr-2">SALE</span>
              <span className="text-white/90">Best Selling</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Popup */}
      {mobileSearchOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" onClick={() => setMobileSearchOpen(false)} />
          <div ref={mobileSearchRef} className="fixed top-[20%] left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-[#003F3A] rounded-2xl shadow-2xl z-50 md:hidden overflow-hidden border border-white/10 animate-fadeIn">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/10">
              <span className="text-sm font-bold text-[#A4F000]">Search Products</span>
              <button onClick={() => setMobileSearchOpen(false)} className="p-1 text-white/50 hover:text-white rounded-full"><FiX size={18} /></button>
            </div>
            <form onSubmit={handleSearch} className="p-4">
              <div className="relative">
                <input ref={mobileInputRef} type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 pl-10 text-sm text-white outline-none focus:border-[#A4F000]/50" />
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
              </div>
              <button type="submit" className="w-full mt-4 bg-[#A4F000] text-[#003F3A] py-2.5 rounded-xl text-sm font-bold">Search</button>
            </form>
          </div>
        </>
      )}

      {/* Mobile Drawer */}
      {menuOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" onClick={() => setMenuOpen(false)} />
          <div className="fixed top-0 left-0 w-72 h-full bg-[#003F3A] z-50 shadow-2xl md:hidden overflow-y-auto border-r border-white/5">
            <div className="p-5 border-b border-white/5 flex justify-between items-center bg-black/10">
              <span className="text-xl font-bold text-white"><span className="text-[#A4F000]">Des</span>kify Menu</span>
              <button onClick={() => setMenuOpen(false)} className="p-2 text-white/50"><FiX size={22} /></button>
            </div>
            <nav className="p-4 space-y-1">
              <MobileLink href="/" icon={<FiHome />} label="Home" onClick={() => setMenuOpen(false)} />
              <MobileLink href="/popular" icon={<FiStar />} label="Popular" onClick={() => setMenuOpen(false)} />
              <MobileLink href="/product" icon={<FiPackage />} label="Shop" onClick={() => setMenuOpen(false)} />
              
              <div>
                <button onClick={() => setMobilePagesOpen(!mobilePagesOpen)} className="w-full flex items-center justify-between p-3 text-white/70 hover:bg-white/5 hover:text-[#A4F000] rounded-lg">
                  <div className="flex items-center space-x-3"><FiBookOpen /> <span>Pages</span></div>
                  {mobilePagesOpen ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {mobilePagesOpen && (
                  <div className="ml-9 mt-1 space-y-1 border-l border-[#A4F000]/20">
                    <Link href="/about" onClick={() => setMenuOpen(false)} className="block p-2 text-sm text-white/40 hover:text-[#A4F000]">About Us</Link>
                    <Link href="/faq" onClick={() => setMenuOpen(false)} className="block p-2 text-sm text-white/40 hover:text-[#A4F000]">FAQ</Link>
                  </div>
                )}
              </div>

              <div>
                <button onClick={() => setMobileBlogsOpen(!mobileBlogsOpen)} className="w-full flex items-center justify-between p-3 text-white/70 hover:bg-white/5 hover:text-[#A4F000] rounded-lg">
                  <div className="flex items-center space-x-3"><FiFileText /> <span>Blogs</span></div>
                  {mobileBlogsOpen ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {mobileBlogsOpen && (
                  <div className="ml-9 mt-1 space-y-1 border-l border-[#A4F000]/20">
                    <Link href="/blog" onClick={() => setMenuOpen(false)} className="block p-2 text-sm text-white/40 hover:text-[#A4F000]">News</Link>
                    <Link href="/blog/tips" onClick={() => setMenuOpen(false)} className="block p-2 text-sm text-white/40 hover:text-[#A4F000]">Tips</Link>
                  </div>
                )}
              </div>

              <MobileLink href="/my-contact" icon={<FiMail />} label="Contact" onClick={() => setMenuOpen(false)} />
              
              <hr className="my-4 border-white/5" />

              {isUser ? (
                <div className="space-y-1">
                   <MobileLink href="/profile" icon={<FiUser />} label="Profile" onClick={() => setMenuOpen(false)} />
                   <MobileLink href="/my-orders" icon={<FiGrid />} label="My Orders" onClick={() => setMenuOpen(false)} />
                   <button onClick={handleLogout} className="w-full flex items-center space-x-3 p-3 text-rose-400 hover:bg-rose-400/5 rounded-lg">
                    <FiLogOut /> <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <Link href="/login" onClick={() => setMenuOpen(false)} className="text-center py-2 bg-white/5 text-white rounded-lg text-xs font-bold">Login</Link>
                  <Link href="/signup" onClick={() => setMenuOpen(false)} className="text-center py-2 bg-[#A4F000] text-[#003F3A] rounded-lg text-xs font-bold">Register</Link>
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
    <Link href={href} onClick={onClick} className="flex items-center space-x-3 p-3 text-white/70 hover:bg-white/5 hover:text-[#A4F000] rounded-lg transition-colors">
      <span className="text-lg">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<div className="h-16 md:h-20 bg-[#003F3A] border-b border-white/5 shadow-sm" />}>
      <NavbarContent />
    </Suspense>
  );
}