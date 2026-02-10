export default function HeroSection() {
  return (
    <>
      <section className="w-full pt-20">
        <div className="w-full h-210 relative">
          <img
            className="w-full h-full"
            src="/pic2.png"
            alt=""
          />
          <div className="absolute top-10 left-10 font-jost">
            <p className="text-white text-4xl font-bold">Himalayan Pink Salt </p>
            <p className="text-2xl font-jost text-white">Therapy & Co</p>
          </div>
        </div>
      </section>
    </>
  );
}
