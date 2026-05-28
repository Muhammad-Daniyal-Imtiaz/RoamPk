import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#101510] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <div className="text-3xl font-black">RoamPK</div>
          <p className="mt-3 max-w-sm text-white/65">Your all-in-one Pakistan travel companion for stays, SIM cards, currency, routes, and guided discovery.</p>
        </div>
        <div>
          <h3 className="font-bold">Quick links</h3>
          <div className="mt-4 grid gap-2 text-white/70">
            {["Hotels", "SIM", "Currency", "Tours", "Contact"].map((item) => <Link key={item} href={`/${item.toLowerCase() === "sim" ? "sim" : item.toLowerCase()}`}>{item}</Link>)}
          </div>
        </div>
        <div>
          <h3 className="font-bold">Social</h3>
          <div className="mt-4 flex gap-3">
            {["f", "ig", "x", "in"].map((item) => <span key={item} className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-xs font-black uppercase text-white/75">{item}</span>)}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-sm text-white/50">© 2026 RoamPK. All rights reserved.</div>
    </footer>
  );
}
