"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";
import Toast from "@/app/components/tost"; // <-- Lucide icons
import { BiChevronLeft } from "react-icons/bi";
import { FiEyeOff } from "react-icons/fi";
import { BsEye } from "react-icons/bs";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const showToast = (message: string, type: "success" | "error" = "error") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showToast("Please fill all the fields", "error");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      showToast("Login successful!", "success");
      router.push("/admin/add-products");
    } catch (error: any) {
      switch (error.code) {
        case "auth/user-not-found":
          showToast("No user found with this email", "error");
          break;
        case "auth/wrong-password":
          showToast("Password is incorrect", "error");
          break;
        case "auth/invalid-email":
          showToast("Invalid email format", "error");
          break;
        default:
          showToast("Something went wrong. Try again!", "error");
      }
    }
  };

  return (
    <section className="w-full h-screen flex items-center justify-center relative">
      <form className="bg-[#FCFEFD] w-[70%] overflow-hidden mx-auto shadow rounded-md border border-zinc-200 flex justify-between">
        <div className="w-[50%] flex flex-col space-y-4 px-10 py-8">
          <div className="flex mb-18 items-center justify-between">
            <Link
              href="/"
              className="w-8 h-8 border border-zinc-200 rounded-full flex items-center justify-center"
            >
              <BiChevronLeft size={20} />
            </Link>
          </div>

          <p className="text-center font-bold text-6xl font-jost">Admins</p>
          <p className="text-center text-lg font-jost">
            Manage content, users, and system settings securely from one place.
          </p>

          <div className="flex flex-col space-y-2">
            <label className="font-jost text-lg">Email</label>
            <input
              type="email"
              className="w-full border border-zinc-200 font-jost text-lg px-2 py-3 focus:outline-none"
              placeholder="Enter Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col space-y-2 relative ">
            <label className="font-jost text-lg">Password</label>
            <div className="flex items-center border border-zinc-200">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full  font-jost text-lg px-2 py-3 focus:outline-none pr-10"
                placeholder="Enter Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="px-2 py-1 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff size={20} /> : <BsEye size={20} />}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogin}
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

      {toastMessage && (
        <Toast message={toastMessage} type={toastType} duration={3000} />
      )}
    </section>
  );
}
