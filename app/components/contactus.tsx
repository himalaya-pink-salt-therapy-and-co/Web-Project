"use client";

import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import Toast from "./tost";

export default function Contactus() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [toast, setToast] = useState<null | {
    message: string;
    type: "success" | "error";
  }>(null);

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    // Combine first_name and last_name into a hidden name field before sending
    const form = formRef.current;
    if (form) {
      const firstName =
        (form.elements.namedItem("first_name") as HTMLInputElement)?.value ||
        "";
      const lastName =
        (form.elements.namedItem("last_name") as HTMLInputElement)?.value || "";
      let nameInput = form.elements.namedItem(
        "name",
      ) as HTMLInputElement | null;
      if (!nameInput) {
        nameInput = document.createElement("input");
        nameInput.type = "hidden";
        nameInput.name = "name";
        form.appendChild(nameInput);
      }
      nameInput.value = `${firstName} ${lastName}`.trim();
    }

    emailjs
      .sendForm(
        "service_ma82hx8", // 🔁 Replace with your EmailJS Service ID
        "template_hzynosl", // 🔁 Replace with your EmailJS Template ID
        formRef.current!,
        "qYZ5pgrCAH7gGo119", // 🔁 Replace with your EmailJS Public Key
      )
      .then(() => {
        setStatus("success");
        setToast({ message: "✅ Message sent successfully!", type: "success" });
        formRef.current?.reset();
      })
      .catch((err) => {
        console.error("EmailJS error:", err);
        setStatus("error");
        setToast({
          message: "❌ Something went wrong. Please try again.",
          type: "error",
        });
      });
  };

  return (
    <>
      <main className="bg-[#FCFEFD] w-full border border-b border-zinc-200 mb-2 rounded-md">
        <section className="w-[85%] mx-auto py-16 flex flex-col md:flex-row justify-around gap-4">
          <div className="md:w-[50%] flex flex-col md:justify-start justify-center py-4">
            <p className="text-3xl md:text-5xl font-bold font-jost text-center">
              Contact Us
            </p>
            <p className="md:text-lg font-jost text-center w-full">
              At Himalaya Pink Salt Therapy & Co., we take pride in delivering authentic Himalayan pink salt products with quality and care. Whether you are a retailer, distributor, or individual customer, we are happy to assist you. Reach out using the form below, and a member of our team will contact you shortly.
            </p>
          </div>

          <form
            ref={formRef}
            onSubmit={sendEmail}
            className="md:w-[50%] flex items-center pl-2 md:pl-10 py-6 flex-col space-y-6"
          >
            <div className="flex items-center justify-between w-full gap-10">
              <input
                type="text"
                name="first_name" // ← must match your EmailJS template variable
                placeholder="First Name"
                required
                className="w-full font-jost focus:outline-none px-4 py-3 border border-zinc-300"
              />
              <input
                type="text"
                name="last_name" // ← must match your EmailJS template variable
                placeholder="Last Name"
                required
                className="w-full font-jost focus:outline-none px-4 py-3 border border-zinc-300"
              />
              {/* Hidden input for full name, value set in sendEmail */}
              <input type="hidden" name="name" />
            </div>

            <input
              type="email"
              name="reply_to" // ← must match your EmailJS template variable
              placeholder="Enter Your Email"
              required
              className="w-full font-jost focus:outline-none px-4 py-3 border border-zinc-300"
            />

            <textarea
              name="message" // ← must match your EmailJS template variable
              placeholder="Your message"
              required
              className="w-full border border-zinc-300 p-3 text-sm focus:outline-none focus:border-black"
              rows={5}
            />

            <button
              type="submit"
              disabled={status === "sending"}
              className="font-jost px-6 bg-[#e27e49] py-2.5 border border-[#D77D4C] text-white w-full cursor-pointer hover:bg-black hover:text-white text-xl transition-all duration-300 hover:border-zinc-800 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === "sending" ? "Sending..." : "Submit"}
            </button>

            {/* Toast notification */}
            {toast && (
              <Toast
                message={toast.message}
                type={toast.type}
                duration={3000}
                onClose={() => setToast(null)}
              />
            )}
          </form>
        </section>
      </main>
    </>
  );
}
