import { FaPhone } from "react-icons/fa6";
import { RiInstagramFill } from "react-icons/ri";

export default function Footer() {
  return (
    <>
      <section className="flex flex-col gap-4 md:grid md:grid-cols-3 justify-between px-6 md:px-20 mx-auto py-16 ">
        <div className="w-full">
          <p className="font-bold text-2xl font-jost">About Us</p>
          <p className="font-jost ">
            Himalaya Pink Salt Therapy & Co is your trusted source for premium
            Himalayan pink salt bricks, bringing the ancient healing traditions
            of the Himalayas into modern wellness spaces.
          </p>
        </div>
        <div className="flex ">
          <div className="flex flex-col space-y-2 ">
            <p className="font-bold text-2xl font-jost">Usefull Links</p>
            <div className="flex justify-between">
              <p className="flex items-center gap-2 cursor-pointer text-md font-jost">
                <FaPhone size={18} />
                +92 123 456 789
              </p>
            </div>
            <p className="flex items-center gap-2 cursor-pointer font-jost text-md">
              <RiInstagramFill size={20} />
              Instagram
            </p>
          </div>
        </div>
        <div className="flex flex-col md:items-center justify-center border border-zinc-200 py-4 px-4">
          <div className="text-2xl font-bold font-jost text-center">
            Stay Connected
          </div>
          <div className="text-sm font-jost text-center">
            Subscribe for latest updates and exclusive offers on our products
            and purchase.
          </div>
          <form className="flex items-center py-6 w-full text-sm md:text-md">
            <input
              type="text"
              placeholder="Enter Your Email"
              className="font-jost focus:outline-none px-4 py-3 border border-zinc-300 w-full"
            />
            <button className="font-jost p-3  md:px-6  bg-[#e27e49] md:py-2.5 text-sm md:text-xl cursor-pointer hover:bg-black hover:text-white transition-all duration-300 hover:border-zinc-800 text-white">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
