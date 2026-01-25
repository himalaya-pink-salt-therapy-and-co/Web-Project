export default function Products() {
  const products = [
    {
      id: 1,
      title: "Pink Salt",
      description:
        "Pure Himalayan pink salt sourced naturally for cooking and wellness.",
      price: "Rs. 100",
      image:
        "https://www.anveya.com/cdn/shop/articles/shutterstock_1830831551.webp?v=1680239811&width=1000",
    },
    {
      id: 2,
      title: "Pink Salt Lamp",
      description:
        "Handcrafted Himalayan pink salt lamp for a calming environment.",
      price: "Rs. 2,500",
      image:
        "https://tanveersalt.com/wp-content/uploads/2024/09/Himalayan-Salt-Products-And-Their-Major-Benefits.png",
    },
    {
      id: 3,
      title: "Pink Salt Soap",
      description: "Mineral-rich pink salt soap for gentle skin cleansing.",
      price: "Rs. 350",
      image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec",
    },
    {
      id: 4,
      title: "Pink Salt Candle Holder",
      description: "Natural Himalayan salt candle holder for warm ambiance.",
      price: "Rs. 1,200",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
    },
  ];

  return (
    <main className="w-full bg-[#F5F5F5] border-b border-zinc-100">
      <section className="pt-10 flex flex-col justify-center w-[85%] mx-auto">
        <p className="font-bold font-jost text-center text-5xl">Our Products</p>
        <p className="text-center font-jost text-xl">
          Explore our premium collection of Himalayan pink salt products,
          sourced naturally and crafted to enhance wellness, flavor, and
          everyday living.
        </p>
      </section>

      <section className="w-[85%] mx-auto py-16 flex items-center flex-wrap justify-between">
        {products.map((product) => (
          <div
            key={product.id}
            className="w-97 flex flex-col bg-zinc-100 border border-zinc-200 shadow rounded-md overflow-hidden"
          >
            <div className="w-full h-80">
              <img
                className="w-full h-full object-cover"
                src={product.image}
                alt={product.title}
              />
            </div>

            <div className="w-full p-4 flex flex-col gap-2">
              <p className="font-jost font-bold text-xl">{product.title}</p>

              <p className="text-lg line-clamp-2 font-jost">
                {product.description}
              </p>

              <div className="flex w-full items-center justify-between">
                <p className="font-jost font-bold">Price</p>
                <p className="font-bold font-jost">{product.price}</p>
              </div>

              <button className="mt-2 w-full bg-[#D77D4C] text-white py-2 text-sm hover:opacity-80 transition font-jost cursor-pointer rounded-xs">
                Add to Bucket
              </button>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
