import Link from "next/link";

export default function Login() {
  return (
    <>
      <section className="w-full h-screen flex items-center justify-center">
        <form className="bg-[#FCFEFD] py-2 w-[70%] mx-auto h-130 shadow rounded-md border border-zinc-200 flex">
          <div className="w-[50%] flex flex-col space-y-4 px-10 py-8">
            <p className="text-center font-bold text-6xl font-jost">Sign In</p>
            <p className="text-center text-lg font-jost">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Repudiandae, cum.
            </p>
            <div className="flex flex-col space-y-2">
              <label className="font-jost text-lg">Email</label>
              <input
                type="text"
                name=""
                id=""
                className="w-full border border-zinc-200 font-jost text-lg px-2 py-3 focus:outline-none"
                placeholder="Enter Your Email"
              />
            </div>
            <div className="flex flex-col space-y-2 ">
              <label className="font-jost text-lg">Password</label>
              <input
                type="password"
                name=""
                id=""
                className="w-full border border-zinc-200 font-jost text-lg px-2 py-3 focus:outline-none"
                placeholder="Enter Your Email"
              />
            </div>
            <Link href="/forget-password" className="font-semibold font-jost text-lg">Forget Password?</Link>
          </div>

          <div className="w-[50%]"></div>
        </form>
      </section>
    </>
  );
}
