import Footer from "../components/footer";
import Nav from "../components/nav";

export default function AboutUs() {
  return (
    <>
      <Nav />
      <section className="pt-30">
        <main className="px-20 flex pt-40 pb-10 w-[90%] mx-auto gap-5 border-t border-x border-zinc-200 ">
          <div className="font-jost w-[50%] flex flex-col gap-2 justify-center">
            <p className="text-5xl font-bold text-center">About Us</p>
            <p className="text-2xl text-justify pr-4">
              Himalaya Pink Salt Therapy & Co is your trusted source for premium
              Himalayan pink salt bricks, bringing the ancient healing
              traditions of the Himalayas into modern wellness spaces. Our
              mission is to provide high-quality, authentic Himalayan pink salt
              products that promote relaxation, rejuvenation, and overall
              well-being. We are committed to ensuring that our customers
              receive the purest and most beneficial salt for their wellness
              needs.
            </p>
          </div>
          <div className="text-3xl font-bold font-jost w-[50%]">
            <div className="overflow-hidden">
              <img className="w-full h-full" src="/pic.png" alt="" />
            </div>
          </div>
        </main>
      </section>
      <section className="">
        <main className="px-20 flex py-15 w-[90%] mx-auto gap-5 border-b border-x border-zinc-200 ">
          <div className="text-3xl font-bold font-jost w-[50%]">
            <div className=" overflow-hidden">
              <img className="w-full h-full" src="/ourstory.avif" alt="" />
            </div>
          </div>
          <div className="font-jost w-[50%] flex flex-col gap-2 justify-center">
            <p className="text-5xl font-bold text-center">Our Story</p>
            <p className="text-2xl text-justify px-4">
              We believe in the transformative power of nature's purest
              elements. Sourced from the pristine Himalayan mountain ranges, our
              pink salt bricks carry millions of years of mineral-rich history,
              hand-selected to deliver both therapeutic benefits and timeless
              beauty to your environment.
            </p>
          </div>
        </main>
      </section>
      <Footer />
    </>
  );
}
