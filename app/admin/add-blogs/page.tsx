"use client";

import { useState, useEffect, FormEvent } from "react";
import AdminProtectedRoute from "../AdminProtectedRoute";
import { ref, push, update, onValue, remove } from "firebase/database";
import { database } from "@/firebase";
import { FaEdit, FaHome, FaPlus, FaTimes, FaTrash } from "react-icons/fa";
import Toast from "@/app/components/tost"; // same toast component as products
import DashboardBar from "@/app/components/dashboardbar";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

type Blog = {
  id?: string;
  title: string;
  excerpt: string;
  content?: string;
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
    content: "",
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
      setBlogForm({ title: "", excerpt: "", content: "", image: "", date: "" });
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
      content: blog.content || "",
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
    setBlogForm({ title: "", excerpt: "", content: "", image: "", date: "" });
  };

  return (
    <AdminProtectedRoute>
      <div className="flex w-full min-h-screen bg-gray-100">
        <DashboardBar />
        <section className="flex-1 px-2 md:px-8 py-4 relative h-screen overflow-y-auto">
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
                placeholder="Short Excerpt (Preview)"
                value={blogForm.excerpt}
                onChange={handleChange}
                rows={2}
                className="border border-gray-300 font-jost p-3 focus:outline-none"
              />
              <div className="bg-white">
                <ReactQuill
                  theme="snow"
                  value={blogForm.content || ""}
                  onChange={(val) => setBlogForm({ ...blogForm, content: val })}
                  placeholder="Write full blog content here..."
                  className="font-jost"
                />
              </div>
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
        <div className="overflow-x-auto w-full shadow-sm border border-zinc-200">
          <table className="min-w-[800px] w-full border-collapse">
            <thead>
              <tr className="bg-[#D77D4C] text-white">
                <th className="p-4 font-jost font-medium text-left border-r border-[#c06a38]">Image</th>
                <th className="p-4 font-jost font-medium text-left border-r border-[#c06a38]">Title</th>
                <th className="p-4 font-jost font-medium text-left border-r border-[#c06a38]">Excerpt</th>
                <th className="p-4 font-jost font-medium text-left border-r border-[#c06a38]">Date</th>
                <th className="p-4 font-jost font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.length > 0 ? (
                blogs.map((blog, index) => (
                  <tr
                    key={blog.id}
                    className={`border-b border-zinc-200 hover:bg-orange-50 transition-colors duration-150 ${index % 2 === 0 ? "bg-white" : "bg-zinc-50"
                      }`}
                  >
                    <td className="p-4 border-r border-zinc-200">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-16 h-16 object-cover rounded-lg shadow-sm"
                      />
                    </td>
                    <td className="p-4 border-r border-zinc-200">
                      <span className="font-jost font-semibold text-zinc-800">
                        {blog.title}
                      </span>
                    </td>
                    <td className="p-4 border-r border-zinc-200 max-w-xs">
                      <p className="text-sm font-jost text-zinc-600 line-clamp-2">
                        {blog.excerpt}
                      </p>
                    </td>
                    <td className="p-4 border-r border-zinc-200">
                      <span className="font-jost font-medium text-[#D77D4C] whitespace-nowrap">
                        {blog.date}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => handleEdit(blog)}
                          className="bg-[#D77D4C] text-white py-1.5 px-3 rounded-md hover:bg-[#c06a38] transition-colors flex items-center gap-1.5 cursor-pointer text-sm font-jost whitespace-nowrap shadow-sm"
                        >
                          <FaEdit size={12} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(blog.id)}
                          className="bg-red-500 text-white py-1.5 px-3 rounded-md hover:bg-red-600 transition-colors flex items-center gap-1.5 cursor-pointer text-sm font-jost whitespace-nowrap shadow-sm"
                        >
                          <FaTrash size={12} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-zinc-400">
                      <FaTrash size={32} className="opacity-20" />
                      <p className="font-jost text-sm">No blogs found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add Button - outside scroll */}
        <div className="flex justify-center items-center py-5">
          <button
            onClick={handleAddClick}
            className="bg-[#D77D4C] text-white py-2.5 px-6 rounded-md hover:bg-[#c06a38] transition-colors flex items-center gap-2 font-jost shadow-sm cursor-pointer"
          >
            <FaPlus size={13} /> Add New Blog
          </button>
        </div>
        </section>
      </div>
    </AdminProtectedRoute>
  );
}
