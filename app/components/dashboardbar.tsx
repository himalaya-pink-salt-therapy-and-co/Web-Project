"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FaBoxOpen, FaPen, FaShoppingBag, FaSignOutAlt, FaHome, FaBars, FaTimes } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";

export default function DashboardBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      sessionStorage.removeItem("admin_token");
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const links = [
    { name: "Products", path: "/admin/add-products", icon: FaBoxOpen },
    { name: "Blogs", path: "/admin/add-blogs", icon: FaPen },
    { name: "Orders", path: "/admin/orders", icon: FaShoppingBag },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 bg-white p-2.5 rounded-md shadow-md border border-zinc-200 text-[#D77D4C] cursor-pointer hover:bg-zinc-50 transition-colors"
      >
        <FaBars size={20} />
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`w-64 bg-white border-r border-zinc-200 h-screen fixed md:sticky top-0 left-0 z-50 flex flex-col shadow-xl md:shadow-sm shrink-0 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
      >
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="font-jost font-bold text-2xl text-[#D77D4C]">Admin Panel</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-zinc-400 hover:text-zinc-800 transition cursor-pointer p-1"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <nav className="flex-1 py-6 flex flex-col gap-2 px-4 overflow-y-auto">
          {links.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-md font-jost transition-colors ${isActive
                  ? "bg-[#D77D4C] text-white"
                  : "text-zinc-600 hover:bg-orange-50 hover:text-[#D77D4C]"
                  }`}
              >
                <link.icon size={18} />
                <span className="font-medium">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-100 flex flex-col gap-2 shrink-0">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-md font-jost text-zinc-600 hover:bg-zinc-50 hover:text-black transition-colors"
          >
            <FaHome size={18} />
            <span className="font-medium">Website Home</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-md font-jost text-red-600 hover:bg-red-50 transition-colors w-full text-left cursor-pointer"
          >
            <FaSignOutAlt size={18} />
            <span className="font-medium">Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
