import * as React from "react";
import { cn } from "@/lib/utils";

export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn("h-12 rounded-full border border-black/10 bg-white px-4 text-sm font-medium text-[#1a1a1a] outline-none focus:border-[#006600]", className)}
      {...props}
    >
      {children}
    </select>
  );
}
