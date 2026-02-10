"use client";

import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "@/firebase"; // your firebase config path
import { FaStore } from "react-icons/fa6";
import { BiLoader } from "react-icons/bi";

type Product = {
  id?: string;
  title: string;
  description: string;
  price: string;
  image: string;
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const productsRef = ref(database, "Our-Products");
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedProducts: Product[] = Object.entries(data).map(
          ([key, value]) => ({
            id: key,
            ...(value as Product),
          }),
        );
        setProducts(loadedProducts);
      } else {
        setProducts([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <main className="w-full py-50 flex items-center justify-center">
        <BiLoader className="text-4xl text-[#D77D4C] animate-spin" />
      </main>
    );
  }

  return (
    <main className="w-full bg-[#F5F5F5] border-b border-zinc-100">
      {products.length > 0 && (
        <section className="pt-10 flex flex-col justify-center w-[85%] mx-auto">
          <p className="font-bold font-jost text-center text-5xl">
            Our Products
          </p>
          <p className="text-center font-jost text-xl">
            Explore our premium collection of Himalayan pink salt products,
            sourced naturally and crafted to enhance wellness, flavor, and
            everyday living.
          </p>
        </section>
      )}

      {products.length > 0 ? (
        <section className="w-[85%] mx-auto py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col bg-white border border-zinc-200 overflow-hidden"
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
                  <p className="font-bold font-jost">Rs. {product.price}</p>
                </div>

                <button className="mt-2 w-full bg-[#D77D4C] text-white py-2 text-sm hover:opacity-80 transition font-jost cursor-pointer rounded-xs">
                  Add to Bucket
                </button>
              </div>
            </div>
          ))}
        </section>
      ) : (
        <section className="py-20 flex flex-col items-center justify-center gap-6">
          <div className="border border-zinc-200 rounded-full p-6 flex items-center justify-center">
            <FaStore size={80} className="text-[#D77D4C]" />
          </div>
          <p className="text-center font-jost text-4xl sm:text-5xl font-bold text-[#D77D4C]">
            Store Is Empty
          </p>
          <p className="text-center font-jost text-lg text-zinc-600 max-w-md">
            Currently, there are no products available. Please check back later
            or contact us for more information.
          </p>
          <p className="bg-black text-white font-jost font-bold p-3 ">
            Coming Soon
          </p>
        </section>
      )}
    </main>
  );
}
