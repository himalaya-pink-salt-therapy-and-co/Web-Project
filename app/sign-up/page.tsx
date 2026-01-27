"use client";
import Link from "next/link";
import { useState } from "react";
import { FaChevronLeft, FaEyeSlash } from "react-icons/fa6";
import { IoEyeSharp } from "react-icons/io5";
import Toast from "../components/tost";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  return (
    <>
      <section className="w-full h-screen flex items-center justify-center relative">
        <form className="bg-[#FCFEFD] w-[70%] overflow-hidden mx-auto shadow rounded-md border border-zinc-200 flex justify-between">
          <div className="w-[50%] flex flex-col space-y-4 px-10 py-8">
            <div className="w-full flex items-center justify-between">
              <Link
                href="/"
                className="w-8 h-8 border border-zinc-200 rounded-full flex items-center justify-center mb-4"
              >
                <FaChevronLeft size={20} />
              </Link>

              
            </div>
            <p className="text-center font-bold text-6xl font-jost select-none pointer-events-none">
              Sign Up
            </p>
            <p className="text-center text-lg font-jost select-none pointer-events-none">
              Create your account to get started.
            </p>

            <div className="flex w-full justify-between gap-4">
              <div className="flex flex-col space-y-2 w-full">
                <label className="font-jost text-lg select-none pointer-events-none">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full border border-zinc-200 font-jost text-lg px-2 py-3 focus:outline-none"
                  placeholder="Enter Your First Name"
                />
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="font-jost text-lg select-none pointer-events-none">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-zinc-200 font-jost text-lg px-2 py-3 focus:outline-none"
                placeholder="Enter Your Email"
              />
            </div>

            <div className="flex justify-between gap-4">
              <div className="flex flex-col space-y-2 w-full">
                <label className="font-jost text-lg select-none pointer-events-none">
                  Password
                </label>
                <div className="flex border border-zinc-200 font-jost text-lg px-2 py-3">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full focus:outline-none"
                    placeholder="Enter Your Password"
                  />
                  <button
                    type="button"
                    className="cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <IoEyeSharp size={20} />
                    ) : (
                      <FaEyeSlash size={20} />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-col space-y-2 w-full">
                <label className="font-jost text-lg select-none pointer-events-none">
                  Confirm Password
                </label>
                <div className="flex border border-zinc-200 font-jost text-lg px-2 py-3">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full focus:outline-none"
                    placeholder="Enter Again"
                  />
                  <button
                    type="button"
                    className="cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <IoEyeSharp size={20} />
                    ) : (
                      <FaEyeSlash size={20} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="mt-2 w-full bg-[#D77D4C] text-white py-3.5 text-lg hover:opacity-80 transition font-jost rounded-sm cursor-pointer"
            >
              Sign Up
            </button>

            <div className="flex justify-between">
              <Link href="/login" className="text-lg font-semibold font-jost">
                Already have an account?
              </Link>
              <Link
                href="/forget-password"
                className="font-semibold font-jost text-lg cursor-pointer pb-20"
              >
                Forget Password?
              </Link>
            </div>
          </div>

          <div className="w-[50%] select-none pointer-events-none">
            <img
              src="https://sauna-timber.co.uk/wp-content/uploads/2023/07/salt-wall.png.webp"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </form>
      </section>
      <Toast
        message="Email sent successfully!"
        duration={4000}
        type="success"
      />
    </>
  );
}
