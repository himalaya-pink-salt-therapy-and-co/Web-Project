"use client";
import { useEffect, useState } from "react";
import { GrFormClose } from "react-icons/gr";
import { IoCloseCircleOutline } from "react-icons/io5";
import { SiTicktick } from "react-icons/si";

type ToastType = "success" | "error" | "info";

interface ToastProps {
  message?: string;
  duration?: number;
  type?: ToastType;
  onClose?: () => void;
}

export default function Toast({
  message = "New mail arrived",
  duration = 3000,
  type = "success",
  onClose,
}: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // show toast
    setVisible(true);

    const timer = setTimeout(() => {
      // hide toast
      setVisible(false);

      // call onClose after animation finishes
      setTimeout(() => {
        if (onClose) onClose();
      }, 500); // matches transition duration
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor =
    type === "success"
      ? "bg-[#D77D4C]"
      : type === "error"
        ? "bg-[#D77D4C]"
        : "bg-[#D77D4C]";

  return (
    <section
      className={`
        fixed left-1/2 bottom-5 z-400
        -translate-x-1/2  
        flex items-center gap-2 ${bgColor} text-white px-4 py-2 rounded-md shadow-lg
        transform transition-all duration-500 ease-in-out
        ${visible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}
      `}
    >
      {type === "success" && <SiTicktick size={20} />}
      {type === "error" && <IoCloseCircleOutline size={20} />}
      <p>{message}</p>
      <button
        className="ml-2 cursor-pointer"
        onClick={() => {
          setVisible(false);
          if (onClose) onClose();
        }}
      >
        <GrFormClose size={18} />
      </button>
    </section>
  );
}
