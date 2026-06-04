"use client";

import { useState, useEffect, FormEvent } from "react";
import AdminProtectedRoute from "../AdminProtectedRoute";
import { ref, push, update, onValue, remove } from "firebase/database";
import { database } from "@/firebase";
import {
  FaEdit,
  FaHome,
  FaPlus,
  FaTimes,
  FaTrash,
  FaBoxOpen,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { BiLoader } from "react-icons/bi";
import Toast from "@/app/components/tost";
import DashboardBar from "@/app/components/dashboardbar";

type Order = {
  id?: string;
  customerName: string;
  phone: string;
  address: string;
  product: string;
  quantity: string;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  date: string;
};

const STATUS_COLORS: Record<Order["status"], string> = {
  Pending: "bg-yellow-100 text-yellow-700 border border-yellow-300",
  Processing: "bg-blue-100 text-blue-700 border border-blue-300",
  Shipped: "bg-purple-100 text-purple-700 border border-purple-300",
  Delivered: "bg-green-100 text-green-700 border border-green-300",
  Cancelled: "bg-red-100 text-red-700 border border-red-300",
};

const EMPTY_ORDER: Omit<Order, "id"> = {
  customerName: "",
  phone: "",
  address: "",
  product: "",
  quantity: "",
  status: "Pending",
  date: "",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [orderForm, setOrderForm] = useState<Omit<Order, "id">>(EMPTY_ORDER);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Fetch orders from Firebase
  useEffect(() => {
    const ordersRef = ref(database, "Orders");
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loaded: Order[] = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...(value as Order),
        }));
        // Sort newest first
        loaded.sort((a, b) => (b.date > a.date ? 1 : -1));
        setOrders(loaded);
      } else {
        setOrders([]);
      }
      setFetching(false);
    });
    return () => unsubscribe();
  }, []);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setOrderForm({ ...orderForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { customerName, phone, address, product, quantity, date } = orderForm;
    if (!customerName || !phone || !address || !product || !quantity || !date) {
      showToast("Please fill in all fields!", "error");
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await update(ref(database, `Orders/${editingId}`), orderForm);
        showToast("Order updated successfully!", "success");
      } else {
        await push(ref(database, "Orders"), orderForm);
        showToast("Order added successfully!", "success");
      }
      setOrderForm(EMPTY_ORDER);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error(err);
      showToast("Something went wrong!", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (order: Order) => {
    setOrderForm({
      customerName: order.customerName,
      phone: order.phone,
      address: order.address,
      product: order.product,
      quantity: order.quantity,
      status: order.status,
      date: order.date,
    });
    setEditingId(order.id || null);
    setShowForm(true);
  };

  const handleDelete = (id: string | undefined) => {
    if (!id) return;
    setShowDeleteConfirm(id);
  };

  const confirmDelete = async (id: string) => {
    try {
      await remove(ref(database, `Orders/${id}`));
      showToast("Order deleted successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to delete order!", "error");
    } finally {
      setShowDeleteConfirm(null);
    }
  };

  const handleAddClick = () => {
    setShowForm(true);
    setEditingId(null);
    setOrderForm(EMPTY_ORDER);
  };

  return (
    <AdminProtectedRoute>
      <div className="flex w-full min-h-screen bg-gray-100">
        <DashboardBar />
        <section className="flex-1 px-2 md:px-8 py-4 relative h-screen overflow-y-auto">
        <h1 className="text-2xl font-semibold text-center mb-8 font-jost">
          Order Management
        </h1>

        {toast && (
          <Toast message={toast.message} type={toast.type} duration={4000} />
        )}

        {/* ─── Add / Edit Order Modal ─── */}
        {showForm && (
          <div className="absolute inset-0 bg-black/50 flex items-start justify-center z-50 overflow-y-auto py-10">
            <form
              onSubmit={handleSubmit}
              className="bg-[#FCFEFD] p-8 shadow-xl w-full max-w-lg relative flex flex-col gap-4"
            >
              {/* Close */}
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="absolute top-3 right-3 cursor-pointer hover:text-gray-800"
              >
                <FaTimes size={16} />
              </button>

              <h2 className="text-xl text-center font-jost font-semibold">
                {editingId ? "Edit Order" : "Add New Order"}
              </h2>

              {/* Customer Name */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-jost text-zinc-500 font-semibold uppercase tracking-wide">
                  Customer Name
                </label>
                <input
                  type="text"
                  name="customerName"
                  placeholder="e.g. Ali Hassan"
                  value={orderForm.customerName}
                  onChange={handleChange}
                  className="border border-gray-300 font-jost p-3 focus:outline-none focus:border-[#D77D4C]"
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-jost text-zinc-500 font-semibold uppercase tracking-wide">
                  Phone Number
                </label>
                <div className="relative">
                  <FaPhone
                    size={13}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+92 300 1234567"
                    value={orderForm.phone}
                    onChange={handleChange}
                    className="border border-gray-300 font-jost p-3 pl-9 focus:outline-none focus:border-[#D77D4C] w-full"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-jost text-zinc-500 font-semibold uppercase tracking-wide">
                  Delivery Address
                </label>
                <div className="relative">
                  <FaMapMarkerAlt
                    size={13}
                    className="absolute left-3 top-4 text-zinc-400"
                  />
                  <textarea
                    name="address"
                    placeholder="e.g. House 12, Street 4, Gold Leaf Colony, Lahore"
                    value={orderForm.address}
                    onChange={handleChange}
                    rows={3}
                    className="border border-gray-300 font-jost p-3 pl-9 focus:outline-none focus:border-[#D77D4C] w-full resize-none"
                  />
                </div>
              </div>

              {/* Product */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-jost text-zinc-500 font-semibold uppercase tracking-wide">
                  Product
                </label>
                <input
                  type="text"
                  name="product"
                  placeholder="e.g. Himalayan Pink Salt Lamp 3kg"
                  value={orderForm.product}
                  onChange={handleChange}
                  className="border border-gray-300 font-jost p-3 focus:outline-none focus:border-[#D77D4C]"
                />
              </div>

              {/* Quantity / Stock */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-jost text-zinc-500 font-semibold uppercase tracking-wide">
                  Quantity / Stock
                </label>
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  placeholder="e.g. 2"
                  value={orderForm.quantity}
                  onChange={handleChange}
                  className="border border-gray-300 font-jost p-3 focus:outline-none focus:border-[#D77D4C]"
                />
              </div>

              {/* Status */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-jost text-zinc-500 font-semibold uppercase tracking-wide">
                  Order Status
                </label>
                <select
                  name="status"
                  value={orderForm.status}
                  onChange={handleChange}
                  className="border border-gray-300 font-jost p-3 focus:outline-none focus:border-[#D77D4C] bg-white"
                >
                  {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map(
                    (s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Date */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-jost text-zinc-500 font-semibold uppercase tracking-wide">
                  Order Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={orderForm.date}
                  onChange={handleChange}
                  className="border border-gray-300 font-jost p-3 focus:outline-none focus:border-[#D77D4C]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-[#D77D4C] text-white py-3 rounded-xs hover:opacity-80 transition font-semibold cursor-pointer font-jost mt-2"
              >
                {loading
                  ? "Saving..."
                  : editingId
                  ? "Update Order"
                  : "Add Order"}
              </button>
            </form>
          </div>
        )}

        {/* ─── Delete Confirmation Modal ─── */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#FCFEFD] p-6 shadow-xl w-full max-w-md rounded flex flex-col gap-4">
              <h3 className="text-lg font-semibold font-jost text-center">
                Are you sure you want to delete this order?
              </h3>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => confirmDelete(showDeleteConfirm)}
                  className="bg-red-500 text-white py-2 px-5 rounded hover:bg-red-600 transition font-jost cursor-pointer"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="border border-zinc-300 text-black py-2 px-5 rounded hover:opacity-80 transition cursor-pointer font-jost"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── Orders Table ─── */}
        {fetching ? (
          <div className="flex justify-center py-20">
            <BiLoader className="text-4xl text-[#D77D4C] animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto w-full shadow-sm border border-zinc-200">
            <table className="min-w-[900px] w-full border-collapse">
              <thead>
                <tr className="bg-[#D77D4C] text-white">
                  <th className="p-4 font-jost font-medium text-left border-r border-[#c06a38]">
                    Customer
                  </th>
                  <th className="p-4 font-jost font-medium text-left border-r border-[#c06a38]">
                    Phone
                  </th>
                  <th className="p-4 font-jost font-medium text-left border-r border-[#c06a38]">
                    Address
                  </th>
                  <th className="p-4 font-jost font-medium text-left border-r border-[#c06a38]">
                    Product
                  </th>
                  <th className="p-4 font-jost font-medium text-center border-r border-[#c06a38]">
                    Qty
                  </th>
                  <th className="p-4 font-jost font-medium text-center border-r border-[#c06a38]">
                    Status
                  </th>
                  <th className="p-4 font-jost font-medium text-left border-r border-[#c06a38]">
                    Date
                  </th>
                  <th className="p-4 font-jost font-medium text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order, index) => (
                    <tr
                      key={order.id}
                      className={`border-b border-zinc-200 hover:bg-orange-50 transition-colors duration-150 ${
                        index % 2 === 0 ? "bg-white" : "bg-zinc-50"
                      }`}
                    >
                      {/* Customer */}
                      <td className="p-4 border-r border-zinc-200">
                        <span className="font-jost font-semibold text-zinc-800">
                          {order.customerName}
                        </span>
                      </td>

                      {/* Phone */}
                      <td className="p-4 border-r border-zinc-200">
                        <a
                          href={`tel:${order.phone}`}
                          className="font-jost text-sm text-[#D77D4C] whitespace-nowrap flex items-center gap-1 hover:underline"
                        >
                          <FaPhone size={11} />
                          {order.phone}
                        </a>
                      </td>

                      {/* Address */}
                      <td className="p-4 border-r border-zinc-200 max-w-[200px]">
                        <p className="font-jost text-sm text-zinc-600 line-clamp-2 flex items-start gap-1">
                          <FaMapMarkerAlt
                            size={12}
                            className="mt-0.5 shrink-0 text-[#D77D4C]"
                          />
                          {order.address}
                        </p>
                      </td>

                      {/* Product */}
                      <td className="p-4 border-r border-zinc-200 max-w-[180px]">
                        <p className="font-jost text-sm text-zinc-700 line-clamp-2">
                          {order.product}
                        </p>
                      </td>

                      {/* Qty */}
                      <td className="p-4 border-r border-zinc-200 text-center">
                        <span className="font-jost font-bold text-zinc-800">
                          {order.quantity}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-4 border-r border-zinc-200 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-jost font-semibold ${
                            STATUS_COLORS[order.status] ??
                            "bg-zinc-100 text-zinc-600"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="p-4 border-r border-zinc-200 whitespace-nowrap">
                        <span className="font-jost text-sm text-zinc-500">
                          {order.date}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => handleEdit(order)}
                            className="bg-[#D77D4C] text-white py-1.5 px-3 rounded-md hover:bg-[#c06a38] transition-colors flex items-center gap-1.5 cursor-pointer text-sm font-jost whitespace-nowrap shadow-sm"
                          >
                            <FaEdit size={12} /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(order.id)}
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
                    <td colSpan={8} className="p-12 text-center">
                      <div className="flex flex-col items-center gap-3 text-zinc-400">
                        <FaBoxOpen size={40} className="opacity-20" />
                        <p className="font-jost text-sm">No orders found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ─── Add Button ─── */}
        <div className="flex justify-center items-center py-5">
          <button
            onClick={handleAddClick}
            className="bg-[#D77D4C] text-white py-2.5 px-6 rounded-md hover:bg-[#c06a38] transition-colors flex items-center gap-2 font-jost shadow-sm cursor-pointer"
          >
            <FaPlus size={13} /> Add New Order
          </button>
        </div>
      </section>
      </div>
    </AdminProtectedRoute>
  );
}
