import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa6";

export default function Login() {
  return (
    <>
      <section className="w-full h-screen flex items-center justify-center relative">
        <Link
          href="/"
          className="absolute top-2 right-0 text-xl  text-white font-jost bg-[#D77D4C] py-2 px-6 rounded-l-md  border border-zinc-200"
        >
          Create Account?
        </Link>
        <form className="bg-[#FCFEFD] w-[70%] overflow-hidden mx-auto shadow rounded-md border border-zinc-200 flex justify-between">
          <div className="w-[50%] flex flex-col space-y-4 px-10 py-8">
            <Link
              href="/"
              className="w-8 h-8 border border-zinc-200 rounded-full flex items-center justify-center mb-18"
            >
              <FaChevronLeft size={20} />
            </Link>
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
            <button className="mt-2 w-full bg-[#D77D4C] text-white py-3.5 text-lg hover:opacity-80 transition font-jost rounded-xs cursor-pointer">
              Sign In
            </button>
            <Link
              href="/forget-password"
              className="font-semibold font-jost text-lg cursor-pointer pb-20"
            >
              Forget Password?
            </Link>
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
