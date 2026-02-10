export default function Contactus() {
  return (
    <>
      <main className="bg-[#FCFEFD] w-full border border-b border-zinc-200 mb-2 rounded-md">
        {" "}
        <section className="w-[85%] mx-auto py-16 flex justify-around gap-4 ">
          <div className="w-[50%] flex flex-col justify-start py-4">
            <p className="text-5xl font-bold font-jost text-center">
              Contact Us
            </p>
            <p className="text-lg font-jost text-center w-full">
              {" "}
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magni
              ducimus voluptates adipisci odit debitis libero necessitatibus
              delectus autem possimus ipsa, corporis dolorum iusto obcaecati
              pariatur unde harum consequatur aperiam exercitationem nulla
              consequuntur in quibusdam. Culpa corrupti iste dolore magnam ut.
            </p>
          </div>
          <form className="w-[50%] flex items-center pl-10 py-6 flex-col space-y-6">
            <div className="flex items-center justify-between w-full gap-10">
              <input
                type="text"
                placeholder="First Name"
                className="w-full font-jost focus:outline-none px-4 py-3 border border-zinc-300"
              />
              <input
                type="text"
                placeholder="Last Name"
                className="w-full font-jost focus:outline-none px-4 py-3 border border-zinc-300"
              />
            </div>
            <input
              type="email"
              placeholder="Enter Your Email"
              className="w-full font-jost focus:outline-none px-4 py-3 border border-zinc-300"
            />
            <textarea
              placeholder="Your message"
              className="w-full border border-zinc-300 p-3 text-sm focus:outline-none focus:border-black"
              rows={5}
            ></textarea>

            <button className="font-jost px-6 bg-[#e27e49] py-2.5 border border-[#D77D4C] text-white w-full cursor-pointer hover:bg-black hover:text-white text-xl transition-all duration-300 hover:border-zinc-800">
              Submit
            </button>
          </form>
        </section>
      </main>
    </>
  );
}
