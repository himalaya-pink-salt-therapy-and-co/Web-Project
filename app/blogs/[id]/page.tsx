"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ref, get } from "firebase/database";
import { database } from "@/firebase";
import { BiLoader } from "react-icons/bi";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import "react-quill-new/dist/quill.snow.css"; // Ensure quill styles are loaded for the rich text

type BlogPost = {
  id?: string;
  title: string;
  excerpt: string;
  content?: string;
  image: string;
  date: string;
};

export default function BlogPostPage() {
  const params = useParams();
  const id = params.id as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const postRef = ref(database, `Our-Blogs/${id}`);
        const snapshot = await get(postRef);
        if (snapshot.exists()) {
          setPost({ id: snapshot.key || undefined, ...(snapshot.val() as BlogPost) });
        } else {
          setPost(null);
        }
      } catch (err) {
        console.error("Error fetching blog post:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <main className="w-full h-screen flex items-center justify-center bg-[#F5F5F5]">
        <BiLoader className="text-4xl text-[#D77D4C] animate-spin" />
      </main>
    );
  }

  if (!post) {
    return (
      <main className="w-full h-screen flex flex-col gap-4 items-center justify-center bg-[#F5F5F5]">
        <h1 className="text-3xl font-jost font-bold text-zinc-800">Blog Post Not Found</h1>
        <Link href="/blogs" className="text-[#D77D4C] hover:underline font-jost flex items-center gap-2">
          <FaArrowLeft /> Back to Blogs
        </Link>
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen bg-[#F5F5F5] px-4 md:px-8 ">
      <article className="max-w-4xl mx-auto bg-white shadow-sm overflow-hidden border border-zinc-100">
        {post.image && (
          <div className="w-full h-64 md:h-96">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6 md:p-12">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-sm text-[#D77D4C] hover:text-[#c06a38] font-medium font-jost mb-6 transition-colors"
          >
            <FaArrowLeft /> Back to Blogs
          </Link>

          <h1 className="text-3xl md:text-5xl font-jost font-bold text-zinc-900 leading-tight mb-4">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 border-b border-zinc-100 pb-8 mb-8">
            <p className="text-zinc-500 font-jost">
              Published on <span className="font-medium text-[#D77D4C]">{post.date}</span>
            </p>
          </div>

          {/* Rich text content or fallback to excerpt */}
          <div className="font-jost text-zinc-800 leading-relaxed ql-editor px-0">
            {post.content ? (
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            ) : (
              <p className="whitespace-pre-line">{post.excerpt}</p>
            )}
          </div>
        </div>
      </article>
    </main>
  );
}
