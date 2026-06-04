"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaBoxOpen, FaPen, FaShoppingBag, FaSignOutAlt, FaHome } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";

export default function DashboardBar() {
  const pathname = usePathname();
  const router = useRouter();

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
    <aside className="w-64 bg-white border-r border-zinc-200 h-screen sticky top-0 flex flex-col shadow-sm shrink-0">
      <div className="p-6 border-b border-zinc-100 flex items-center justify-center">
        <h2 className="font-jost font-bold text-2xl text-[#D77D4C]">Admin Panel</h2>
      </div>
      
      <nav className="flex-1 py-6 flex flex-col gap-2 px-4 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.path;
          return (
            <Link
              key={link.path}
              href={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-md font-jost transition-colors ${
                isActive 
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
  );
}
