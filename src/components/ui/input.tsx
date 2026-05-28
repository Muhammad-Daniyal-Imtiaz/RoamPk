import * as React from "react";
import { cn } from "@/lib/utils";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn("h-12 w-full rounded-full border border-white/10 bg-[#1a201a] px-5 text-sm text-white outline-none ring-[#006600]/20 placeholder:text-gray-500 focus:border-[#006600] focus:ring-4", props.className)}
    />
  );
}
