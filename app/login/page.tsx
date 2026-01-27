import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa6";

export default function Login() {
  return (
    <>
      <section className="w-full h-screen flex items-center justify-center relative">
        <form className="bg-[#FCFEFD] w-[70%] overflow-hidden mx-auto shadow rounded-md border border-zinc-200 flex justify-between">
          <div className="w-[50%] flex flex-col space-y-4 px-10 py-8">
            <div className="flex  mb-18 items-center justify-between">
              <Link
                href="/"
                className="w-8 h-8 border border-zinc-200 rounded-full flex items-center justify-center"
              >
                <FaChevronLeft size={20} />
              </Link>
              <Link
                href="/admin/add-products"
                className="py-2 px-4 bg-[#D77D4C] font-jost rounded-sm text-white "
              >
                Admin Login
              </Link>
            </div>
            <p className="text-center font-bold text-6xl font-jost select-none pointer-events-none">
              Sign In
            </p>
            <p className="text-center text-lg font-jost select-none pointer-events-none">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Repudiandae, cum.
            </p>
            <div className="flex flex-col space-y-2">
              <label className="font-jost text-lg select-none pointer-events-none">
                Email
              </label>
              <input
                type="text"
                name=""
                id=""
                className="w-full border border-zinc-200 font-jost text-lg px-2 py-3 focus:outline-none"
                placeholder="Enter Your Email"
              />
            </div>
            <div className="flex flex-col space-y-2 ">
              <label className="font-jost text-lg select-none pointer-events-none">
                Password
              </label>
              <input
                type="password"
                name=""
                id=""
                className="w-full border border-zinc-200 font-jost text-lg px-2 py-3 focus:outline-none"
                placeholder="Enter Your Email"
              />
            </div>
            <button className="mt-2 w-full bg-[#D77D4C] text-white py-3.5 text-lg hover:opacity-80 transition font-jost rounded-sm cursor-pointer">
              Sign In
            </button>
            <div className="flex justify-between">
              <Link
                href="/sign-up"
                className=" text-lg font-semibold font-jost"
              >
                Create Account.
              </Link>
              <Link
                href="/forget-password"
                className="font-semibold font-jost text-lg cursor-pointer pb-20"
              >
                Forget Password?
              </Link>
            </div>
          </div>
          <div className="w-[50%]  select-none pointer-events-none">
            <img
              src="https://sauna-timber.co.uk/wp-content/uploads/2023/07/salt-wall.png.webp"
              alt=""
              className="w-full h-full"
            />
          </div>
        </form>
      </section>
    </>
  );
}
