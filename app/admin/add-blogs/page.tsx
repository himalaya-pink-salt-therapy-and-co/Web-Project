"use client";

import { useState, useEffect, FormEvent } from "react";
import AdminProtectedRoute from "../AdminProtectedRoute";
import { ref, push, update, onValue, remove } from "firebase/database";
import { database } from "@/firebase";
import { FaEdit, FaHome, FaPlus, FaTimes, FaTrash } from "react-icons/fa";
import Toast from "@/app/components/tost"; // same toast component as products
import Link from "next/link";

type Blog = {
  id?: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
};

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null,
  );

  const [blogForm, setBlogForm] = useState<Blog>({
    title: "",
    excerpt: "",
    image: "",
    date: "",
  });

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Fetch blogs from Firebase
  useEffect(() => {
    const blogsRef = ref(database, "Our-Blogs");
    const unsubscribe = onValue(blogsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loaded: Blog[] = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...(value as Blog),
        }));
        setBlogs(loaded);
      } else {
        setBlogs([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setBlogForm({ ...blogForm, [e.target.name]: e.target.value });
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !blogForm.title ||
      !blogForm.excerpt ||
      !blogForm.image ||
      !blogForm.date
    ) {
      showToast("Please fill in all fields!", "error");
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await update(ref(database, `Our-Blogs/${editingId}`), blogForm);
        showToast("Blog updated successfully!", "success");
      } else {
        await push(ref(database, "Our-Blogs"), blogForm);
        showToast("Blog added successfully!", "success");
      }
      setBlogForm({ title: "", excerpt: "", image: "", date: "" });
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error(err);
      showToast("Something went wrong!", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (blog: Blog) => {
    setBlogForm({
      title: blog.title,
      excerpt: blog.excerpt,
      image: blog.image,
      date: blog.date,
    });
    setEditingId(blog.id || null);
    setShowForm(true);
  };

  const handleDelete = (id: string | undefined) => {
    if (!id) return;
    setShowDeleteConfirm(id);
  };

  const confirmDelete = async (id: string) => {
    try {
      await remove(ref(database, `Our-Blogs/${id}`));
      showToast("Blog deleted successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to delete blog!", "error");
    } finally {
      setShowDeleteConfirm(null);
    }
  };

  const handleAddClick = () => {
    setShowForm(true);
    setEditingId(null);
    setBlogForm({ title: "", excerpt: "", image: "", date: "" });
  };

  return (
    <AdminProtectedRoute>
      <section className="w-full min-h-screen bg-gray-100 p-8 relative">
        <h1 className="text-2xl font-semibold text-center mb-8 font-jost">
          Blog Catalog
        </h1>

        {toast && (
          <Toast message={toast.message} type={toast.type} duration={4000} />
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
            <form
              onSubmit={handleSubmit}
              className="bg-[#FCFEFD] p-8 shadow-xl w-full max-w-lg relative flex flex-col gap-4"
            >
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="absolute top-3 right-3 cursor-pointer hover:text-gray-800"
              >
                <FaTimes size={16} />
              </button>

              <h2 className="text-xl text-center font-jost font-semibold">
                {editingId ? "Edit Blog" : "Add New Blog"}
              </h2>

              <input
                type="text"
                name="title"
                placeholder="Title"
                value={blogForm.title}
                onChange={handleChange}
                className="border border-gray-300 font-jost p-3 focus:outline-none"
              />
              <textarea
                name="excerpt"
                placeholder="Excerpt"
                value={blogForm.excerpt}
                onChange={handleChange}
                rows={4}
                className="border border-gray-300 font-jost p-3 focus:outline-none"
              />
              <input
                type="text"
                name="image"
                placeholder="Image URL"
                value={blogForm.image}
                onChange={handleChange}
                className="border border-gray-300 font-jost p-3 focus:outline-none"
              />
              <input
                type="text"
                name="date"
                placeholder="Date (e.g., Feb 10, 2026)"
                value={blogForm.date}
                onChange={handleChange}
                className="border border-gray-300 font-jost p-3 focus:outline-none"
              />

              <button
                type="submit"
                disabled={loading}
                className="bg-[#D77D4C] text-white py-3 rounded-xs hover:opacity-80 transition font-semibold cursor-pointer font-jost"
              >
                {loading ? "Saving..." : editingId ? "Update Blog" : "Add Blog"}
              </button>
            </form>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#FCFEFD] p-6 shadow-xl w-full max-w-md rounded flex flex-col gap-4">
              <h3 className="text-lg font-semibold font-jost text-center">
                Are you sure you want to delete this blog?
              </h3>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => confirmDelete(showDeleteConfirm)}
                  className="bg-[#D77D4C] text-white py-2 px-4 rounded hover:opacity-80 transition font-jost cursor-pointer"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="border border-zinc-300 text-black py-2 px-4 rounded hover:opacity-98 transition cursor-pointer font-jost"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Blog Table */}
        <div className="grid grid-cols-5 bg-[#D77D4C] text-white text-center font-bold">
          <div className="p-3 font-jost font-light border-r">Image</div>
          <div className="p-3 font-jost font-light border-r">Title</div>
          <div className="p-3 font-jost font-light border-r">Excerpt</div>
          <div className="p-3 font-jost font-light border-r">Date</div>
          <div className="p-3 font-jost font-light ">Actions</div>
        </div>

        <div className="flex flex-col overflow-hidden">
          {blogs.length > 0 ? (
            <>
              {blogs.map((blog) => (
                <div
                  key={blog.id}
                  className="grid grid-cols-5 text-center items-center border-b border-zinc-300 border-l border-r last:border-none"
                >
                  <div className="p-3 flex justify-center border-r border-zinc-300">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                  </div>
                  <div className="p-3 font-jost font-semibold border-zinc-300">
                    {blog.title}
                  </div>
                  <div className="p-3 text-start text-sm font-jost border-l border-zinc-300 h-full flex items-center border-r">
                    {blog.excerpt}
                  </div>
                  <div className="p-3 font-jost font-bold">{blog.date}</div>
                  <div className="p-3 flex justify-center gap-2 border-l h-full border-zinc-300 py-8">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="bg-[#D77D4C] text-white py-1 px-3 rounded hover:opacity-80 flex items-center gap-1 cursor-pointer"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="bg-red-500 text-white py-1 px-3 rounded hover:opacity-80 flex items-center gap-1 cursor-pointer"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              ))}

              <div className="grid grid-cols-5 text-center items-center ">
                <div className="p-4 col-span-5 flex justify-center items-center text-gray-700 gap-4">
                  <button
                    onClick={handleAddClick}
                    className="bg-[#D77D4C] text-white py-2 px-4 rounded-md hover:opacity-80 transition flex items-center gap-2 font-jost cursor-pointer"
                  >
                    <FaPlus size={15} /> Add New Blog
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-5 text-center items-center border-b border-l border-r border-zinc-200 last:border-none">
              <div className="p-6 col-span-5 flex flex-col items-center gap-4 text-gray-500 font-jost border-b border-zinc-300 border-x">
                <button
                  onClick={handleAddClick}
                  className="bg-[#D77D4C] text-white py-2 px-4 rounded-lg hover:opacity-80 transition flex items-center gap-2 cursor-pointer"
                >
                  <FaPlus /> Create Blog
                </button>
              </div>
            </div>
          )}
        </div>
        <main className="flex gap-4 items-center justify-center">
          <div className="py-2 flex justify-center">
            <Link
              href="/admin/add-products"
              className="flex items-center gap-2 text-[#D77D4C] font-jost"
            >
              <FaPlus size={15} />
              Add Products
            </Link>
          </div>
          <div className="py-2 flex justify-center">
            <Link
              href="/"
              className="flex items-center gap-2 text-[#D77D4C] font-jost"
            >
              <FaHome size={15} />
              Go to Home
            </Link>
          </div>
        </main>
      </section>
    </AdminProtectedRoute>
  );
}
