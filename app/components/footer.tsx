"use client";
import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import Toast from "./tost";
import { FaPhone } from "react-icons/fa6";
import { RiInstagramFill } from "react-icons/ri";

export default function Footer() {
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

    emailjs
      .sendForm(
        "service_ma82hx8", // your service ID
        "template_6jpiw6s", // your template ID
        formRef.current!,
        "qYZ5pgrCAH7gGo119", // your public key (replace if needed)
      )
      .then(() => {
        setStatus("success");
        setToast({ message: "✅ Subscribed successfully!", type: "success" });
        formRef.current?.reset();
      })
      .catch((error) => {
        console.log(error);
        setStatus("error");
        setToast({ message: "❌ Failed, try again.", type: "error" });
      });
  };

  return (
    <>
      <section className="flex flex-col lg:gap-4 gap-2 md:grid grid-cols-1 lg:grid-cols-3 justify-between px-2 px-4 md:px-20 mx-auto py-16 ">
        <div className="w-full">
          <p className="font-bold text-xl xl:text-2xl font-jost">About Us</p>
          <p className="font-jost text-sm xl:text-lg">
            Himalaya Pink Salt Therapy & Co is your trusted source for premium
            Himalayan pink salt bricks, bringing the ancient healing traditions
            of the Himalayas into modern wellness spaces.
          </p>
        </div>

        <div className="flex ">
          <div className="flex flex-col space-y-2 ">
            <p className="font-bold text-xl xl:text-2xl font-jost">Usefull Links</p>
            <div className="flex justify-between">
              <p className="flex items-center gap-2 cursor-pointer text-sm xl:text-md font-jost">
                <FaPhone size={18} />
                +92 123 456 789
              </p>
            </div>
            <p className="flex items-center gap-2 cursor-pointer font-jost text-sm md:text-md">
              <RiInstagramFill size={20} />
              Instagram
            </p>
          </div>
        </div>

        {/* FORM */}
        <div className="flex flex-col md:items-center justify-center border border-zinc-200 py-4 px-2 md:px-4">
          <div className="text-xl xl:text-2xl font-bold font-jost text-center">
            Stay Connected
          </div>
          <div className="text-sm xl:text-lg font-jost text-center">
            Subscribe for latest updates and exclusive offers on our products
            and purchase.
          </div>

          <form
            ref={formRef}
            onSubmit={sendEmail}
            className="flex flex-col xl:flex-row gap-2 xl:gap-0 items-center py-6 w-full text-sm md:text-md"
          >
            <input
              type="email"
              name="email" // IMPORTANT (EmailJS variable)
              required
              placeholder="Enter Your Email"
              className="font-jost focus:outline-none px-4 py-3 border border-zinc-300 w-full"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="font-jost p-3 xl:px-6 bg-[#e27e49] md:py-2.5 text-sm xl:text-xl cursor-pointer hover:bg-black hover:text-white transition-all duration-300 hover:border-zinc-800 text-white disabled:opacity-60 disabled:cursor-not-allowed w-full xl:w-auto"
            >
              {status === "sending" ? "Subscribing..." : "Subscribe"}
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
        </div>
      </section>
    </>
  );
}
