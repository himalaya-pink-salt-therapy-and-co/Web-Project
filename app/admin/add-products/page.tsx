"use client";

import { useState, useEffect, FormEvent, useRef } from "react";
import AdminProtectedRoute from "../AdminProtectedRoute";
import { ref, push, update, onValue, remove, set } from "firebase/database";
import { database } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";
import { FaEdit, FaHome, FaPlus, FaTimes, FaTrash } from "react-icons/fa";
import Toast from "@/app/components/tost";
import Link from "next/link";
import { LuGitBranchPlus } from "react-icons/lu";
import { FaEyeSlash } from "react-icons/fa6";
import { IoEyeSharp } from "react-icons/io5";
import { FiChevronsLeft } from "react-icons/fi";

type Product = {
  id?: string;
  title: string;
  description: string;
  price: string;
  image: string;
};

type Admin = {
  id?: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  adminId: string;
};

export default function AdminProducts() {
  const adminPanelRef = useRef<HTMLDivElement | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null,
  );
  const [showAdminDeleteConfirm, setShowAdminDeleteConfirm] = useState<
    string | null
  >(null);

  // Admin form state
  const [adminForm, setAdminForm] = useState({
    firstName: "",
    lastName: "",
    adminId: "",
  });

  const [productForm, setProductForm] = useState<Product>({
    title: "",
    description: "",
    price: "",
    image: "",
  });

  // Toast state
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

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

  // Fetch admins
  useEffect(() => {
    const adminsRef = ref(database, "admin");
    const unsubscribe = onValue(adminsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loaded: Admin[] = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...(value as Admin),
        }));
        setAdmins(loaded);
      } else {
        setAdmins([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const handleAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdminForm({ ...adminForm, [e.target.name]: e.target.value });
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate all fields
    if (
      !productForm.title ||
      !productForm.description ||
      !productForm.price ||
      !productForm.image
    ) {
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

  const handleAdminSubmit = async () => {
    // Validate all fields
    if (
      !adminForm.firstName ||
      !adminForm.lastName ||
      !adminForm.adminId ||
      !password ||
      !confirmPassword
    ) {
      showToast("Please fill in all fields!", "error");
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      showToast("Passwords do not match!", "error");
      return;
    }

    // Check password length
    if (password.length < 6) {
      showToast("Password must be at least 6 characters!", "error");
      return;
    }

    setAdminLoading(true);
    try {
      // Create email from adminId
      const email = `${adminForm.adminId}@pinksaltweb.com`;

      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      // Prepare admin data
      const adminData: Omit<Admin, "id"> = {
        firstName: adminForm.firstName,
        lastName: adminForm.lastName,
        role: "admin",
        email: email,
        adminId: adminForm.adminId,
      };

      // Save to Realtime Database under /admin with user's UID as key
      await set(ref(database, `admin/${userCredential.user.uid}`), adminData);

      showToast("Admin created successfully!", "success");

      // Reset form
      setAdminForm({
        firstName: "",
        lastName: "",
        adminId: "",
      });
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        showToast("This admin ID already exists!", "error");
      } else if (err.code === "auth/weak-password") {
        showToast("Password is too weak!", "error");
      } else {
        showToast("Failed to create admin!", "error");
      }
    } finally {
      setAdminLoading(false);
    }
  };

  const handleDeleteAdmin = (id: string | undefined) => {
    if (!id) return;
    setShowAdminDeleteConfirm(id);
  };

  const confirmDeleteAdmin = async (id: string) => {
    try {
      // Delete from Realtime Database
      await remove(ref(database, `admin/${id}`));
      showToast("Admin deleted successfully!", "success");

      // Note: To delete from Firebase Authentication, you would need Firebase Admin SDK
      // on the backend, as client SDK can only delete the currently authenticated user
    } catch (err) {
      console.error(err);
      showToast("Failed to delete admin!", "error");
    } finally {
      setShowAdminDeleteConfirm(null);
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

  const openAdminPanel = (): void => {
    if (!adminPanelRef.current) return;

    adminPanelRef.current.classList.remove("-right-130");
    adminPanelRef.current.classList.add("right-0");
  };

  const closeAdminPanel = (): void => {
    if (!adminPanelRef.current) return;

    adminPanelRef.current.classList.remove("right-0");
    adminPanelRef.current.classList.add("-right-130");
  };

  return (
    <AdminProtectedRoute>
      <section className="w-full min-h-screen bg-gray-100 p-8 relative">
        <div
          ref={adminPanelRef}
          className="border-l border-zinc-200 w-110 py-8 px-4 absolute bg-white top-0 -right-130
             text-center font-jost h-full 
             transition-all duration-300 ease-in-out z-50"
        >
          <div
            onClick={closeAdminPanel}
            className="border absolute p-1 rounded-full border-zinc-300 text-[#D77D4C]
             flex items-center justify-center top-10 -left-3 bg-white cursor-pointer"
          >
            <FiChevronsLeft size={15} className="text-[#D77D4C] rotate-180" />
          </div>

          <div className="flex items-center h-full flex-col">
            <main className="flex items-center justify-center w-full flex-col gap-4">
              <div className="border p-4 rounded-full border-zinc-300 text-[#D77D4C] flex items-center justify-center">
                <LuGitBranchPlus size={25} />
              </div>
              <p className="font-bold text-2xl text-[#D77D4C]">Create Admin</p>
              <p className="text-zinc-600">
                Use this form to add a new admin who can manage and control the
                system.
              </p>
            </main>
            <main className="w-full flex flex-col gap-6 mt-4">
              <div className="flex w-full gap-2">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={adminForm.firstName}
                  onChange={handleAdminChange}
                  className="border border-gray-300 font-jost p-3 focus:outline-none w-full"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={adminForm.lastName}
                  onChange={handleAdminChange}
                  className="border border-gray-300 font-jost p-3 focus:outline-none w-full"
                />
              </div>
              <input
                type="text"
                name="adminId"
                placeholder="Admin Id (e.g., admin1122)"
                value={adminForm.adminId}
                onChange={handleAdminChange}
                className="border border-gray-300 font-jost p-3 focus:outline-none w-full"
              />
              {adminForm.adminId && (
                <div className="text-sm text-zinc-600 -mt-4">
                  Email will be: {adminForm.adminId}@pinksaltweb.com
                </div>
              )}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col space-y-2 w-full">
                  <div className="flex border border-zinc-200 font-jost text-lg px-2 py-3">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full focus:outline-none"
                      placeholder="Enter Password"
                    />
                    <button
                      type="button"
                      className="cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <IoEyeSharp size={20} />
                      ) : (
                        <FaEyeSlash size={20} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 w-full">
                  <div className="flex border border-zinc-200 font-jost text-lg px-2 py-3">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full focus:outline-none"
                      placeholder="Confirm Password"
                    />
                    <button
                      type="button"
                      className="cursor-pointer"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <IoEyeSharp size={20} />
                      ) : (
                        <FaEyeSlash size={20} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAdminSubmit}
                disabled={adminLoading}
                className="w-full bg-[#D77D4C] text-white py-2 text-lg hover:opacity-80 transition font-jost cursor-pointer disabled:opacity-50"
              >
                {adminLoading ? "Creating..." : "Create Admin"}
              </button>
            </main>
            <main className="w-full mt-8 border border-zinc-200 px-2 py-4 rounded">
              <p className="font-semibold mb-2">Team Members</p>
              <main className="py-2 h-70 overflow-auto flex flex-col gap-2">
                {admins.filter((admin) => admin.role === "admin").length > 0 ? (
                  admins
                    .filter((admin) => admin.role === "admin")
                    .map((admin) => (
                      <div
                        key={admin.id}
                        className="border py-2 border-zinc-200"
                      >
                        <main className="flex items-center justify-between w-full px-4">
                          <div className="flex flex-col text-start">
                            <p className="font-jost font-semibold">
                              {admin.firstName} {admin.lastName}
                            </p>

                            <p className="text-xs text-zinc-500">
                              {admin.email}
                            </p>
                          </div>
                          <div>
                            <button
                              onClick={() => handleDeleteAdmin(admin.id)}
                              className="flex items-center gap-2 bg-red-500 text-white px-2 py-1 rounded cursor-pointer hover:opacity-80 transition"
                            >
                              Delete
                            </button>
                          </div>
                        </main>
                      </div>
                    ))
                ) : (
                  <p className="text-sm text-zinc-500 py-4">No admins yet</p>
                )}
              </main>
            </main>
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-center mb-8 font-jost">
          Product Catalog
        </h1>

        {/* Toast */}
        {toast && (
          <Toast message={toast.message} type={toast.type} duration={4000} />
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
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
                className="bg-[#D77D4C] text-white py-3 rounded-xs hover:opacity-80 transition font-semibold cursor-pointer font-jost disabled:opacity-50"
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

        {/* Delete Product Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
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

        {/* Delete Admin Confirmation Modal */}
        {showAdminDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#FCFEFD] p-6 shadow-xl w-full max-w-md rounded flex flex-col gap-4">
              <h3 className="text-lg font-semibold font-jost text-center">
                Are you sure you want to delete this admin?
              </h3>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => confirmDeleteAdmin(showAdminDeleteConfirm)}
                  className="bg-red-500 text-white py-2 px-4 rounded hover:opacity-80 transition font-jost cursor-pointer"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowAdminDeleteConfirm(null)}
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
                  <div className="p-3 font-jost font-semibold border-zinc-300">
                    {prod.title}
                  </div>
                  <div className="p-3 text-start text-sm font-jost border-l border-zinc-300 h-full flex items-center border-r">
                    {prod.description}
                  </div>
                  <div className="p-3 font-jost font-bold">
                    Rs. {prod.price}
                  </div>
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
        <main className="flex gap-4 items-center justify-center mt-4">
          <div className="py-2 flex justify-center">
            <Link
              href="/admin/add-blogs"
              className="flex items-center gap-2 text-[#D77D4C] font-jost"
            >
              <FaPlus size={15} />
              Add Blogs
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
          <button
            type="button"
            onClick={openAdminPanel}
            className="flex items-center gap-2 text-[#D77D4C] font-jost cursor-pointer"
          >
            <LuGitBranchPlus size={15} />
            Admins
          </button>
        </main>
      </section>
    </AdminProtectedRoute>
  );
}
