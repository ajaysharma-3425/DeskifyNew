"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi"; // Icons for hamburger menu (install react-icons if not already)

export default function Navbar() {
  const [token, setToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname(); // For active link highlighting

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    if (storedToken) {
      try {
        // Decode JWT to get role (assuming token contains { role: "admin" or "user" })
        const payload = JSON.parse(atob(storedToken.split(".")[1])); // simple decode (for production use jwt-decode)
        setUserRole(payload.role || "user");
      } catch (error) {
        console.error("Invalid token", error);
        setUserRole(null);
      }
    } else {
      setUserRole(null);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUserRole(null);
    setMenuOpen(false);
    // Redirect to home or reload
    window.location.href = "/";
  };

  // Helper to check if a link is active
  const isActive = (path: string) => pathname === path;

  // Toggle mobile menu
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Deskify
            </span>
          </Link>

          {/* Desktop Navigation (hidden on mobile) */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLinks
              token={token}
              userRole={userRole}
              isActive={isActive}
              onClick={() => {}}
            />
          </div>

          {/* Desktop Auth/User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {token ? (
              <button
                onClick={logout}
                className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-md text-gray-200 hover:text-white hover:bg-gray-700 transition-colors text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Signup
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none"
          >
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700 px-4 py-3 space-y-2">
          <NavLinks
            token={token}
            userRole={userRole}
            isActive={isActive}
            onClick={() => setMenuOpen(false)}
            mobile
          />
          <div className="pt-2 border-t border-gray-700">
            {token ? (
              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Logout
              </button>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 rounded-md text-gray-200 hover:text-white hover:bg-gray-700 transition-colors text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition-colors text-sm font-medium text-center"
                >
                  Signup
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

// Separate component for navigation links (to avoid duplication)
function NavLinks({
  token,
  userRole,
  isActive,
  onClick,
  mobile = false,
}: {
  token: string | null;
  userRole: string | null;
  isActive: (path: string) => boolean;
  onClick: () => void;
  mobile?: boolean;
}) {
  const baseClass = mobile
    ? "block px-4 py-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 transition-colors text-sm font-medium"
    : "text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors";

  const activeClass = mobile
    ? "bg-gray-900 text-white"
    : "bg-gray-900 text-white";

  return (
    <>
      {/* Common links for all authenticated users */}
      {token && (
        <>
          <Link
            href="/cart"
            onClick={onClick}
            className={`${baseClass} ${isActive("/cart") ? activeClass : ""}`}
          >
            Cart
          </Link>
          <Link
            href="/orders"
            onClick={onClick}
            className={`${baseClass} ${isActive("/orders") ? activeClass : ""}`}
          >
            Orders
          </Link>
        </>
      )}

      {/* Admin-only links */}
      {userRole === "admin" && (
        <>
          <Link
            href="/admin/dashboard"
            onClick={onClick}
            className={`${baseClass} ${
              isActive("/admin/dashboard") ? activeClass : ""
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            onClick={onClick}
            className={`${baseClass} ${
              isActive("/admin/products") ? activeClass : ""
            }`}
          >
            Manage Products
          </Link>

           <Link
            href="/admin/orders"
            onClick={onClick}
            className={`${baseClass} ${
              isActive("/admin/orders") ? activeClass : ""
            }`}
          >
            Manage Orders
          </Link>
        </>
      )}

      {/* Public links for non-authenticated users */}
      {!token && (
        <>
          <Link
            href="/"
            onClick={onClick}
            className={`${baseClass} ${isActive("/") ? activeClass : ""}`}
          >
            Home
          </Link>
        </>
      )}
    </>
  );
}