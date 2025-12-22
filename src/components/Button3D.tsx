import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "success" | "danger" | "neutral";
  fullWidth?: boolean;
};

export default function Button3D({ 
  children, 
  onClick, 
  variant = "primary", 
  fullWidth = false 
}: ButtonProps) {
  
  const styles = {
    primary: "bg-primary border-primary-dark text-white hover:bg-[#9d74f7]",
    success: "bg-success border-success-dark text-white hover:bg-[#65e00b]",
    danger:  "bg-error border-error-dark text-white hover:bg-[#f87171]",
    neutral: "bg-white border-gray-shadow text-gray-700 hover:bg-gray-50",
  };

  return (
    <button
      onClick={onClick}
      className={`
        ${styles[variant]} 
        ${fullWidth ? "w-full" : "w-auto"}
        border-2 
        border-b-[6px] 
        active:border-b-2 active:translate-y-[4px] 
        rounded-2xl 
        px-6 py-3 
        font-black 
        text-lg 
        uppercase 
        tracking-wide 
        transition-all 
        duration-100
      `}
    >
      {children}
    </button>
  );
}