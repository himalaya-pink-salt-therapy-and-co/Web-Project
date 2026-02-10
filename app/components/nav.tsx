"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBucket } from "react-icons/fa6";
import { TiUser } from "react-icons/ti";

export default function Nav() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    ` ${
      pathname === path
        ? "font-bold text-[#D77D4C]"
        : "text-black"
    }`;

  return (
    <section className="w-full flex items-center justify-between px-4 bg-[#FCFEFD] border-b-2 border-zinc-200 fixed z-50">
      <div className="w-20 h-20">
        <img
          src="/Logo.jpeg"
          alt="Himalaya Pink Salt Therapy & Co"
          className="w-full h-full"
        />
      </div>

      <div className="flex gap-14 items-center justify-center font-jost text-xl">
        <Link href="/" className={linkClass("/")}>Home</Link>
        <Link href="/aboutus" className={linkClass("/aboutus")}>About Us</Link>
        <Link href="/blogs" className={linkClass("/blogs")}>Blogs</Link>
        <Link href="/contact-us" className={linkClass("/contact-us")}>
          Contact Us
        </Link>
      </div>

      <div className="flex items-center gap-4 font-jost text-xl">
        <div className="relative group flex items-center justify-center pl-2 cursor-pointer py-2">
          <TiUser className="text-3xl" />
          <div className="absolute top-full right-0 mt-2 w-40 bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <Link href="/login" className="block px-4 py-2 text-sm hover:bg-zinc-100">
              Login
            </Link>
            <Link href="/sign-up" className="block px-4 py-2 text-sm hover:bg-zinc-100">
              Sign Up
            </Link>
          </div>
        </div>

        <Link href="/cart" className="mr-2 flex items-center justify-center relative cursor-pointer">
          <div className="bg-[#D77D4C] text-white absolute text-xs px-1.5 py-0.5 rounded-full -left-1 -top-1">
            0
          </div>
          <FaBucket className="text-2xl" />
        </Link>
      </div>
    </section>
  );
}
