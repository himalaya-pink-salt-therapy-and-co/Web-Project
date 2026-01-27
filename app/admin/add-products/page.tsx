"use client";

import { useState, useEffect, FormEvent } from "react";
import { ref, push, update, onValue, remove } from "firebase/database";
import { database } from "@/firebase";
import { FaEdit, FaPlus, FaTimes, FaTrash } from "react-icons/fa";
import Toast from "@/app/components/tost"; // make sure path is correct

type Product = {
  id?: string;
  title: string;
  description: string;
  price: string;
  image: string;
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const [productForm, setProductForm] = useState<Product>({
    title: "",
    description: "",
    price: "",
    image: "",
  });

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Fetch products
  useEffect(() => {
    const productsRef = ref(database, "Our-Products");
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loaded: Product[] = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...(value as Product),
        }));
        setProducts(loaded);
      } else {
        setProducts([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate all fields
    if (!productForm.title || !productForm.description || !productForm.price || !productForm.image) {
      showToast("Please fill in all fields!", "error");
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await update(ref(database, `Our-Products/${editingId}`), productForm);
        showToast("Product updated successfully!", "success");
      } else {
        await push(ref(database, "Our-Products"), productForm);
        showToast("Product added successfully!", "success");
      }
      setProductForm({ title: "", description: "", price: "", image: "" });
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error(err);
      showToast("Something went wrong!", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setProductForm({
      title: product.title,
      description: product.description,
      price: product.price,
      image: product.image,
    });
    setEditingId(product.id || null);
    setShowForm(true);
  };

  const handleDelete = (id: string | undefined) => {
    if (!id) return;
    setShowDeleteConfirm(id);
  };

  const confirmDelete = async (id: string) => {
    try {
      await remove(ref(database, `Our-Products/${id}`));
      showToast("Product deleted successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to delete product!", "error");
    } finally {
      setShowDeleteConfirm(null);
    }
  };

  const handleAddClick = () => {
    setShowForm(true);
    setEditingId(null);
    setProductForm({ title: "", description: "", price: "", image: "" });
  };

  return (
    <section className="w-full min-h-screen bg-gray-100 p-8 relative">
      <h1 className="text-2xl font-semibold text-center mb-8 font-jost">
        Product Catalog
      </h1>

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} duration={4000} />}

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
              {editingId ? "Edit Product" : "Add New Product"}
            </h2>

            <input
              type="text"
              name="title"
              placeholder="Title"
              value={productForm.title}
              onChange={handleChange}
              className="border border-gray-300 font-jost p-3 focus:outline-none"
            />
            <textarea
              name="description"
              placeholder="Description"
              value={productForm.description}
              onChange={handleChange}
              rows={4}
              className="border border-gray-300 font-jost p-3 focus:outline-none"
            />
            <input
              type="text"
              name="price"
              placeholder="Price"
              value={productForm.price}
              onChange={handleChange}
              className="border border-gray-300 font-jost p-3 focus:outline-none"
            />
            <input
              type="text"
              name="image"
              placeholder="Image URL"
              value={productForm.image}
              onChange={handleChange}
              className="border border-gray-300 font-jost p-3 focus:outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-[#D77D4C] text-white py-3 rounded-xs hover:opacity-80 transition font-semibold cursor-pointer font-jost"
            >
              {loading
                ? "Saving..."
                : editingId
                  ? "Update Product"
                  : "Add Product"}
            </button>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#FCFEFD] p-6 shadow-xl w-full max-w-md rounded flex flex-col gap-4">
            <h3 className="text-lg font-semibold font-jost text-center">
              Are you sure you want to delete this product?
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

      {/* Product Table */}
      <div className="grid grid-cols-5 bg-[#D77D4C] text-white text-center font-bold">
        <div className="p-3 font-jost font-light border-r">Image</div>
        <div className="p-3 font-jost font-light border-r">Title</div>
        <div className="p-3 font-jost font-light border-r">Description</div>
        <div className="p-3 font-jost font-light border-r">Price</div>
        <div className="p-3 font-jost font-light ">Actions</div>
      </div>

      <div className="flex flex-col overflow-hidden">
        {products.length > 0 ? (
          <>
            {products.map((prod) => (
              <div
                key={prod.id}
                className="grid grid-cols-5 text-center items-center border-b border-zinc-300 border-l border-r last:border-none transition"
              >
                <div className="p-3 flex justify-center border-r border-zinc-300">
                  <img
                    src={prod.image}
                    alt={prod.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                </div>
                <div className="p-3 font-jost font-semibold border-zinc-300">{prod.title}</div>
                <div className="p-3 text-start text-sm font-jost border-l border-zinc-300 h-full flex items-center border-r">{prod.description}</div>
                <div className="p-3 font-jost font-bold">Rs. {prod.price}</div>
                <div className="p-3 flex justify-center gap-2 border-l h-full border-zinc-300 py-8">
                  <button
                    onClick={() => handleEdit(prod)}
                    className="bg-[#D77D4C] text-white py-1 px-3 rounded hover:opacity-80 flex items-center gap-1 cursor-pointer"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(prod.id)}
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
                  <FaPlus size={15} /> Add New Product
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
                <FaPlus /> Create
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
