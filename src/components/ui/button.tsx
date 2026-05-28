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
        variant === "default" && "bg-[#006600] text-white hover:bg-[#005200]",
        variant === "outline" && "border border-[#006600]/25 bg-white text-[#006600] hover:border-[#006600] hover:bg-[#006600]/5",
        variant === "ghost" && "bg-transparent text-[#1a1a1a] shadow-none hover:bg-black/5",
        variant === "secondary" && "bg-white text-[#006600] hover:bg-[#f5fff5]",
        size === "sm" && "h-9 px-4 text-sm",
        size === "md" && "h-11 px-5",
        size === "lg" && "h-14 px-8 text-base",
        className,
      )}
      {...props}
    />
  );
}
