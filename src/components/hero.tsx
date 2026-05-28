import { MotionDiv } from "@/components/motion";
import { Button } from "@/components/ui/button";

export function Hero({ title, subtitle, image, cta }: { title: string; subtitle: string; image: string; cta?: string }) {
  return (
    <section className="relative isolate min-h-[72vh] overflow-hidden pt-24">
      <img src={image} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
      <div className="hero-gradient absolute inset-0 -z-10" />
      <MotionDiv initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mx-auto flex min-h-[72vh] max-w-7xl flex-col justify-center px-4 py-20 text-white lg:px-8">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur">Pakistan, beautifully planned</p>
          <h1 className="text-balance text-5xl font-black tracking-tight md:text-7xl">{title}</h1>
          <p className="mt-6 max-w-2xl text-lg text-white/82 md:text-xl">{subtitle}</p>
          {cta && <Button size="lg" className="mt-8">{cta}</Button>}
        </div>
      </MotionDiv>
    </section>
  );
}
