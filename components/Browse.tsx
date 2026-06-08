"use client";
import { useMemo, useState } from "react";
import type { Car } from "@/lib/types";
import { MAKES, ORIGINS, GEARBOX, FUELS } from "@/lib/vrt";
import CarCard from "./CarCard";

export default function Browse({ cars }: { cars: Car[] }) {
  const [mode, setMode] = useState<"in_stock" | "to_order" | "sold">("in_stock");
  const [s, setS] = useState({ make: "", model: "", maxPrice: "", year: "", origin: "", gearbox: "", fuel: "" });
  const set = (k: string) => (e: any) => setS({ ...s, [k]: e.target.value });
  const list = useMemo(() => cars.filter((c) => {
    if (c.status !== mode) return false;
    if (s.make && c.make !== s.make) return false;
    if (s.model && !`${c.model}`.toLowerCase().includes(s.model.toLowerCase())) return false;
    if (s.maxPrice && Number(c.price) > Number(s.maxPrice)) return false;
    if (s.year && Number(c.year) < Number(s.year)) return false;
    if (s.origin && c.origin !== s.origin) return false;
    if (s.gearbox && c.gearbox !== s.gearbox) return false;
    if (s.fuel && c.fuel !== s.fuel) return false;
    return true;
  }), [cars, mode, s]);
  const SUB: any = { in_stock: "Inspected and registered vehicles available today — VRT and customs already handled.", to_order: "Hand-picked finds from Japan & the UK. The price is turnkey: shipping, customs and VRT included.", sold: "A look at cars we've sourced and delivered to customers across Ireland." };
  const years: number[] = []; for (let y = new Date().getFullYear(); y >= 1990; y--) years.push(y);
  const scrollGrid = () => document.getElementById("stockGrid")?.scrollIntoView({ behavior: "smooth", block: "start" });
  return (
    <main>
      <section className="hero"><div className="heroInner">
        <span className="eyebrow">🚗 Welcome to ImportWise 🚗</span>
        <h1>Quality Imports <span className="hl">You Can Trust</span></h1>
        <p>Sourced from Japan & the UK — inspected, cleared and delivered across Ireland. Buy what's in stock, reserve an import, or have us find it for you.</p>
        <button className="redBtn" onClick={scrollGrid}>VIEW STOCK →</button>
      </div></section>
      <section className="searchPanel"><div className="spInner"><div className="spGrid">
        <div className="spField"><select value={s.make} onChange={set("make")}><option value="">Select Make</option>{MAKES.map((m) => <option key={m} value={m}>{m}</option>)}</select></div>
        <div className="spField"><input placeholder="Enter Model" value={s.model} onChange={set("model")} /></div>
        <div className="spField"><input placeholder="Max Price (€)" value={s.maxPrice} onChange={set("maxPrice")} /></div>
        <div className="spField"><select value={s.year} onChange={set("year")}><option value="">Year From</option>{years.map((y) => <option key={y} value={y}>{y}</option>)}</select></div>
        <div className="spField"><select value={s.origin} onChange={set("origin")}><option value="">Any Origin</option>{ORIGINS.map((o) => <option key={o} value={o}>{o}</option>)}</select></div>
        <div className="spField"><select value={s.gearbox} onChange={set("gearbox")}><option value="">Any Transmission</option>{GEARBOX.map((g) => <option key={g} value={g}>{g}</option>)}</select></div>
        <div className="spField"><select value={s.fuel} onChange={set("fuel")}><option value="">Any Fuel Type</option>{FUELS.map((f) => <option key={f} value={f}>{f}</option>)}</select></div>
        <button className="spBtn" onClick={scrollGrid}>SEARCH</button>
      </div></div></section>
      <div className="wrap">
        <div className="seg">{[["in_stock", "In Stock"], ["to_order", "To Order"], ["sold", "Sold"]].map(([k, l]) => <button key={k} className={mode === k ? "on" : ""} onClick={() => setMode(k as any)}>{l}</button>)}</div>
        <p className="modeSub">{SUB[mode]}</p>
        <div className="grid" id="stockGrid">
          {list.map((c) => <CarCard key={c.id} car={c} />)}
          {list.length === 0 && <p className="empty">Nothing matches — try clearing filters.</p>}
        </div>
      </div>
    </main>
  );
}
