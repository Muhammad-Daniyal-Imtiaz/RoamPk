import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "sm" | "md" | "lg";
};

export function Button({ className, variant = "default", size = "md", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold shadow-sm hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
        variant === "default" && "bg-[#006600] text-white hover:bg-[#008800]",
        variant === "outline" && "border border-green-500/30 bg-transparent text-green-400 hover:border-green-500 hover:bg-green-500/10",
        variant === "ghost" && "bg-transparent text-gray-300 shadow-none hover:bg-white/10",
        variant === "secondary" && "bg-[#e8f5e9] text-[#006600] hover:bg-[#c8e6c9]",
        size === "sm" && "h-9 px-4 text-sm",
        size === "md" && "h-11 px-5",
        size === "lg" && "h-14 px-8 text-base",
        className,
      )}
      {...props}
    />
  );
}
