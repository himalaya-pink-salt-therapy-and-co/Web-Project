"use client";

import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "@/firebase"; // your firebase config path

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
          })
        );
        setProducts(loadedProducts);
      } else {
        setProducts([]);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // cleanup listener on unmount
  }, []);

  if (loading) {
    return (
      <main className="w-full h-screen flex items-center justify-center">
        <p className="text-xl font-jost">Loading Products...</p>
      </main>
    );
  }

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

      <section className="w-[85%] mx-auto py-16 flex items-center flex-wrap gap-4">
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
                <p className="font-bold font-jost">Rs. {product.price}</p>
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
