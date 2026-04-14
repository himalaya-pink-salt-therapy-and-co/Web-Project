"use client";

import { useEffect, useState } from "react";
import Footer from "../components/footer";
import Nav from "../components/nav";

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

export default function Blogs() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalPost, setModalPost] = useState<BlogPost | null>(null);

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
          <section className="w-[85%] mx-auto py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 md:grid-cols-4 gap-8">
            {blogPosts.map((post) => (
              <div
                key={post.id}
                className="flex flex-col bg-white border border-zinc-200 rounded-lg overflow-hidden shadow hover:shadow-lg transition"
              >
                <div className="w-full h-64">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 flex flex-col gap-2">
                  <p
                    className="font-jost font-bold text-xl truncate"
                    title={post.title}
                  >
                    {post.title}
                  </p>
                  <p className="text-zinc-600 text-sm">{post.date}</p>
                  <p className="text-zinc-700 text-base line-clamp-3">
                    {post.excerpt}
                  </p>
                  <button
                    className="mt-2 w-full bg-[#D77D4C] text-white py-2 text-sm hover:opacity-80 transition font-jost rounded-sm cursor-pointer"
                    onClick={() => setModalPost(post)}
                  >
                    Read More
                  </button>
                </div>
              </div>
            ))}
          </section>
        ) : (
          <section className="py-20 flex flex-col items-center justify-center gap-6">
            <div className="border border-zinc-200 rounded-full p-6 flex items-center justify-center">
              <LiaBlogSolid size={80} className="text-[#D77D4C]" />
            </div>
            <p className="text-4xl sm:text-5xl font-jost font-bold text-[#D77D4C]">
              No Blogs Available
            </p>
            <p className="text-center font-jost text-lg text-zinc-600 max-w-md">
              Currently, there are no blogs published. Please check back later.
            </p>
          </section>
        )}

        {/* Modal for Read More */}
        {modalPost && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => setModalPost(null)}
          >
            <div
              className="relative bg-white rounded-lg shadow-xl max-w-lg w-[90vw] mx-4 p-6 flex flex-col gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile close button */}
              <button
                className="absolute top-3 right-3 md:hidden text-gray-500 hover:text-gray-800 text-2xl"
                onClick={() => setModalPost(null)}
                aria-label="Close"
              >
                &times;
              </button>
              <img
                src={modalPost.image}
                alt={modalPost.title}
                className="w-full h-56 object-cover rounded mb-2"
              />
              <h2 className="font-jost font-bold text-2xl mb-1 text-center">
                {modalPost.title}
              </h2>
              <p className="text-zinc-600 text-center text-sm mb-2">
                {modalPost.date}
              </p>
              <p className="text-zinc-700 text-base whitespace-pre-line text-center">
                {modalPost.excerpt}
              </p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
