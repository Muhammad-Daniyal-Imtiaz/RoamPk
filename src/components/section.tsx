import { MotionSection, fadeUp } from "@/components/motion";
import { cn } from "@/lib/utils";

export function Section({ eyebrow, title, subtitle, children, className }: { eyebrow?: string; title?: string; subtitle?: string; children: React.ReactNode; className?: string }) {
  return (
    <MotionSection {...fadeUp} className={cn("mx-auto max-w-7xl px-4 py-16 lg:px-8", className)}>
      {(eyebrow || title || subtitle) && (
        <div className="mx-auto mb-10 max-w-3xl text-center">
          {eyebrow && <p className="mb-3 text-sm font-black uppercase tracking-[0.25em] text-[#006600]">{eyebrow}</p>}
          {title && <h2 className="text-balance text-3xl font-black tracking-tight text-white md:text-5xl">{title}</h2>}
          {subtitle && <p className="mt-4 text-lg text-gray-400">{subtitle}</p>}
        </div>
      )}
      {children}
    </MotionSection>
  );
}
