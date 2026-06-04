"use client";

import { useEffect, useState } from "react";
import { ref, onValue, push } from "firebase/database";
import { database } from "@/firebase"; // your firebase config path
import { FaStore, FaTimes, FaPhone, FaMapMarkerAlt, FaShoppingBag } from "react-icons/fa";
import { BiLoader } from "react-icons/bi";
import Toast from "@/app/components/tost";

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
  
  // Order form state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [orderForm, setOrderForm] = useState({
    customerName: "",
    phone: "",
    address: "",
    quantity: "1",
  });
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleOrderChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setOrderForm({ ...orderForm, [e.target.name]: e.target.value });
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const { customerName, phone, address, quantity } = orderForm;
    if (!customerName || !phone || !address || !quantity) {
      showToast("Please fill in all fields!", "error");
      return;
    }

    setSubmitting(true);
    try {
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format for consistency
      
      const newOrder = {
        customerName,
        phone,
        address,
        quantity,
        product: selectedProduct.title,
        status: "Pending",
        date: today,
      };

      await push(ref(database, "Orders"), newOrder);
      showToast("Order placed successfully!", "success");
      
      // Reset and close
      setOrderForm({ customerName: "", phone: "", address: "", quantity: "1" });
      setSelectedProduct(null);
    } catch (err) {
      console.error("Order submission error:", err);
      showToast("Failed to place order. Try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

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
    <main className="w-full bg-[#F5F5F5] border-b border-zinc-100 relative">
      {toast && (
        <Toast message={toast.message} type={toast.type} duration={4000} />
      )}
      {products.length > 0 && (
        <section className="pt-10 flex flex-col justify-center w-[85%] mx-auto">
          <p className="font-bold font-jost text-center text-2xl md:text-5xl">
            Our Products
          </p>
          <p className="text-center font-jost text-sm md:text-xl">
            Explore our premium collection of Himalayan pink salt products,
            sourced naturally and crafted to enhance wellness, flavor, and
            everyday living.
          </p>
        </section>
      )}

      {products.length > 0 ? (
        <section className="md:w-[95%] w-full px-2 md:px-0  md:px-6 mx-auto py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col bg-white border border-zinc-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
            >
              <div className="w-full h-48 md:h-60 overflow-hidden">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src={product.image}
                  alt={product.title}
                />
              </div>

              <div className="w-full p-5 flex flex-col gap-3 flex-1 justify-between">
                <div>
                  <p className="font-jost font-bold text-lg md:text-xl text-zinc-900 line-clamp-1">{product.title}</p>
                  <p className="text-sm md:text-base line-clamp-2 font-jost text-zinc-500 mt-1">
                    {product.description}
                  </p>
                </div>

                <div className="flex flex-col gap-3 mt-auto">
                  <div className="flex w-full items-center justify-between border-t border-zinc-100 pt-3">
                    <p className="font-jost text-sm md:text-base text-zinc-500">Price</p>
                    <p className="font-bold font-jost text-lg md:text-xl text-[#D77D4C]">Rs. {product.price}</p>
                  </div>

                  <button 
                    onClick={() => setSelectedProduct(product)}
                    className="w-full bg-[#D77D4C] text-white py-3 text-sm md:text-base hover:bg-[#c06a38] hover:shadow-md transition-all font-semibold font-jost cursor-pointer  flex items-center justify-center gap-2"
                  >
                    <FaShoppingBag size={14} /> Order Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
      ) : (
        <section className="py-5 md:py-20 flex flex-col items-center justify-center gap-6">
          <div className="border border-zinc-200 rounded-full p-6 flex items-center justify-center">
            <FaStore size={80} className="text-[#D77D4C]" />
          </div>
          <p className="text-center font-jost text-4xl sm:text-5xl font-bold text-[#D77D4C]">
            Store Is Empty
          </p>
          <p className="text-center font-jost text-sm px-2 md:text-lg text-zinc-600 max-w-md">
            Currently, there are no products available. Please check back later
            or contact us for more information.
          </p>
          <p className="bg-black text-white font-jost font-bold p-3 ">
            Coming Soon
          </p>
        </section>
      )}

      {/* Order Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] px-4 py-10 overflow-y-auto">
          <div className="bg-white p-6 md:p-8 w-full max-w-md relative shadow-2xl rounded-sm flex flex-col gap-4 my-auto">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-800 transition cursor-pointer"
            >
              <FaTimes size={18} />
            </button>
            
            <div className="flex flex-col gap-1 items-center border-b border-zinc-100 pb-4">
              <h2 className="text-xl md:text-2xl font-bold font-jost text-center">Place Your Order</h2>
              <p className="text-sm text-zinc-500 font-jost text-center">
                Ordering: <span className="font-semibold text-[#D77D4C]">{selectedProduct.title}</span>
              </p>
            </div>

            <form onSubmit={handleOrderSubmit} className="flex flex-col gap-4 mt-2">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-jost text-zinc-500 font-semibold uppercase tracking-wide">
                  Full Name
                </label>
                <input
                  type="text"
                  name="customerName"
                  placeholder="e.g. Ali Hassan"
                  value={orderForm.customerName}
                  onChange={handleOrderChange}
                  className="border border-gray-300 font-jost p-3 focus:outline-none focus:border-[#D77D4C]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-jost text-zinc-500 font-semibold uppercase tracking-wide">
                  Phone Number
                </label>
                <div className="relative">
                  <FaPhone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+92 300 1234567"
                    value={orderForm.phone}
                    onChange={handleOrderChange}
                    className="border border-gray-300 font-jost p-3 pl-9 focus:outline-none focus:border-[#D77D4C] w-full"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-jost text-zinc-500 font-semibold uppercase tracking-wide">
                  Delivery Address
                </label>
                <div className="relative">
                  <FaMapMarkerAlt size={13} className="absolute left-3 top-4 text-zinc-400" />
                  <textarea
                    name="address"
                    placeholder="e.g. House 12, Street 4, Gold Leaf Colony, Lahore"
                    value={orderForm.address}
                    onChange={handleOrderChange}
                    rows={3}
                    className="border border-gray-300 font-jost p-3 pl-9 focus:outline-none focus:border-[#D77D4C] w-full resize-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-jost text-zinc-500 font-semibold uppercase tracking-wide">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  value={orderForm.quantity}
                  onChange={handleOrderChange}
                  className="border border-gray-300 font-jost p-3 focus:outline-none focus:border-[#D77D4C]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-4 bg-[#D77D4C] text-white py-3 rounded-xs hover:opacity-80 transition font-bold font-jost cursor-pointer w-full text-lg"
              >
                {submitting ? "Submitting..." : "Confirm Order"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
