"use client";

import { useEffect, useState } from "react";
import Footer from "../components/footer";
import Nav from "../components/nav";
import Link from "next/link";

type BlogPost = {
  id?: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
};

import { ref, onValue } from "firebase/database";
import { database } from "@/firebase";
import { LiaBlogSolid } from "react-icons/lia";
import { BiLoader } from "react-icons/bi";
import { FaTimes } from "react-icons/fa";

export default function Blogs() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const blogsRef = ref(database, "Our-Blogs");
    const unsubscribe = onValue(blogsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loaded: BlogPost[] = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...(value as BlogPost),
        }));
        setBlogPosts(loaded);
      } else {
        setBlogPosts([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <>
        <Nav />
        <main className="w-full h-screen flex items-center justify-center">
          <BiLoader className="text-4xl text-[#D77D4C] animate-spin" />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav />
      <main className="w-full bg-[#F5F5F5] py-13">
        {blogPosts.length > 0 ? (
          <section className="md:w-[95%] w-full px-2 md:px-0  md:px-6 mx-auto py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ">
            {blogPosts.map((post) => (
              <div
                key={post.id}
                className="flex flex-col bg-white border border-zinc-200  overflow-hidden shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-full h-56 md:h-64 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 flex flex-col gap-3 flex-1 justify-between">
                  <div>
                    <p className="font-jost font-bold text-xl text-zinc-900 line-clamp-2" title={post.title}>
                      {post.title}
                    </p>
                    <p className="text-[#D77D4C] text-sm font-medium mt-1">{post.date}</p>
                    <p className="text-zinc-600 text-sm md:text-base line-clamp-3 mt-2">
                      {post.excerpt}
                    </p>
                  </div>
                  <Link
                    href={`/blogs/${post.id}`}
                    className="mt-4 w-full bg-transparent border-2 border-[#D77D4C] text-[#D77D4C] font-semibold py-2.5 text-sm md:text-base hover:bg-[#D77D4C] hover:text-white transition-all duration-300 font-jost cursor-pointer text-center block"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            ))}
          </section>
        ) : (
          <section className="py-20 flex flex-col items-center justify-center gap-6">
            <div className="border border-zinc-200 rounded-full p-6 flex items-center justify-center">
              <LiaBlogSolid size={80} className="text-[#D77D4C]" />
            </div>
            <p className="text-3xl sm:text-5xl font-jost font-bold text-[#D77D4C]">
              No Blogs Available
            </p>
            <p className="text-center font-jost md:text-lg text-zinc-600 max-w-md px-4">
              Currently, there are no blogs published. Please check back later.
            </p>
          </section>
        )}

      </main>
      <Footer />
    </>
  );
}
