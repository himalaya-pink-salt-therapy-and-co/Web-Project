export default function HeroSection() {
  return (
    <>
      <section className="w-full pt-20">
        <div className="w-full h-80 md:h-210 relative">
          <img
            className="w-full h-full"
            src="/pic2.png"
            alt=""
          />
          <div className="absolute top-5 left-3 md:top-10 md:left-10 font-jost">
            <p className="text-white text-xl md:text-4xl font-bold">Himalayan Pink Salt </p>
            <p className="text-md md:text-2xl font-jost text-white">Therapy & Co</p>
          </div>
        </div>
      </section>
    </>
  );
}
