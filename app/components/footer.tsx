import { FaPhone } from "react-icons/fa6";
import { RiInstagramFill } from "react-icons/ri";

export default function Footer() {
  return (
    <>
      <section className="flex justify-between w-[85%] mx-auto py-16 ">
        <div className="w-[30%]">
          <p className="font-bold text-2xl font-jost">About Us</p>
          <p className="font-jost ">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
            obcaecati sed illo consectetur non vero, quis eum expedita rerum
            tenetur maiores, sit voluptatem inventore magni minima recusandae
            mollitia omnis fugiat.
          </p>
        </div>
        <div className="rlex flex-col space-y-2">
          <p className="font-bold text-2xl font-jost">Usefull Links</p>
          <p className="flex items-center gap-2 cursor-pointer">
            <FaPhone size={20} />
            <p className="text-md font-jost">+92 123 456 789</p>
          </p>
          <p className="flex items-center gap-2 cursor-pointer">
            <RiInstagramFill size={20} />
            <p className="text-md font-jost">Instagram</p>
          </p>
        </div>
        <div className="flex flex-col items-center justify-center ">
          <div className="text-2xl font-bold font-jost">Stay Connected</div>
          <div className="text-sm font-jost">
            Subscribe for free and enjoy an instant{" "}
            <b className="text-xl font-jost">10% </b>discount on your first
            purchase.
          </div>
          <form className="flex items-center py-6 w-full">
            <input
              type="text"
              placeholder="Enter Your Email"
              className="font-jost focus:outline-none px-4 py-3 border border-zinc-300 w-full"
            />
            <button className="font-jost px-6 bg-[#e27e49] py-2.5 border border-[#D77D4C] text-xl cursor-pointer hover:bg-black hover:text-white transition-all duration-300 hover:border-zinc-800 text-white">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
