"use client";

import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa6";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();

  return (
    <section className="w-full h-screen flex items-center justify-center relative">
      <form className="bg-[#FCFEFD] w-[70%] overflow-hidden mx-auto shadow rounded-md border border-zinc-200 flex justify-between">
        <div className="w-[50%] flex flex-col space-y-4 px-10 py-8">
          <div className="flex mb-18 items-center justify-between">
            <Link
              href="/login"
              className="w-8 h-8 border border-zinc-200 rounded-full flex items-center justify-center"
            >
              <FaChevronLeft size={20} />
            </Link>
          </div>

          <p className="text-center font-bold text-6xl font-jost">
            Admins
          </p>
          <p className="text-center text-lg font-jost">
            Manage content, users, and system settings securely from one place.
          </p>

          <div className="flex flex-col space-y-2">
            <label className="font-jost text-lg">Email</label>
            <input
              type="text"
              className="w-full border border-zinc-200 font-jost text-lg px-2 py-3 focus:outline-none"
              placeholder="Enter Your Email"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="font-jost text-lg">Password</label>
            <input
              type="password"
              className="w-full border border-zinc-200 font-jost text-lg px-2 py-3 focus:outline-none"
              placeholder="Enter Your Password"
            />
          </div>

          <button
            type="button"
            onClick={() => router.push("/admin/add-products")}
            className="mt-2 w-full bg-[#D77D4C] text-white py-3.5 text-lg hover:opacity-80 transition font-jost cursor-pointer"
          >
            Sign In
          </button>

          <div className="flex justify-between">
            <Link
              href="/forget-password"
              className="font-semibold font-jost text-lg pb-20"
            >
              Forget Password?
            </Link>
          </div>
        </div>

        <div className="w-[50%] select-none pointer-events-none">
          <img src="/admin.jpg" alt="" className="w-full h-full" />
        </div>
      </form>
    </section>
  );
}
