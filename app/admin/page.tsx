"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { MAKES, ORIGINS, FUELS, GEARBOX } from "@/lib/vrt";
import { placeholder } from "@/lib/placeholder";

const blank = () => ({ make: "", model: "", year: new Date().getFullYear(), price: 0, mileage: 0, origin: "Japan", status: "in_stock", fuel: "Petrol", gearbox: "Automatic", engine: "", power: "", color: "", co2: 0, nox: 0, delivery: "", description: "", images: [] as string[], sort: 0 });

export default function AdminPage() {
  const supabase = createClient();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<"cars" | "reviews" | "enquiries">("cars");
  const [cars, setCars] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);

  const loadAll = async () => {
    const [c, r, e] = await Promise.all([
      supabase.from("cars").select("*").order("sort", { ascending: true }),
      supabase.from("reviews").select("*").order("created_at", { ascending: false }),
      supabase.from("enquiries").select("*").order("created_at", { ascending: false }),
    ]);
    setCars(c.data || []); setReviews(r.data || []); setEnquiries(e.data || []);
  };
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/admin/login"); return; }
      await loadAll(); setReady(true);
    })();
  }, []);

  const signOut = async () => { await supabase.auth.signOut(); router.push("/admin/login"); router.refresh(); };
  const saveCar = async (car: any) => {
    const payload = { ...car, year: Number(car.year) || 0, price: Number(car.price) || 0, mileage: Number(car.mileage) || 0, co2: Number(car.co2) || 0, nox: Number(car.nox) || 0, sort: Number(car.sort) || 0 };
    if (car.id) await supabase.from("cars").update(payload).eq("id", car.id);
    else { delete (payload as any).id; await supabase.from("cars").insert(payload); }
    setEditing(null); loadAll();
  };
  const delCar = async (id: string) => { if (confirm("Delete this vehicle?")) { await supabase.from("cars").delete().eq("id", id); loadAll(); } };
  const delReview = async (id: string) => { if (confirm("Delete this review?")) { await supabase.from("reviews").delete().eq("id", id); loadAll(); } };
  const togglePub = async (r: any) => { await supabase.from("reviews").update({ published: !r.published }).eq("id", r.id); loadAll(); };

  if (!ready) return <main className="wrap"><p>Loading…</p></main>;

  return (
    <main className="wrap">
      <div className="adminBar">
        <h1>Admin dashboard</h1>
        <button className="aBtn" onClick={signOut}>Sign out</button>
      </div>
      <div className="adminTabs">
        <button className={tab === "cars" ? "on" : ""} onClick={() => setTab("cars")}>Cars ({cars.length})</button>
        <button className={tab === "reviews" ? "on" : ""} onClick={() => setTab("reviews")}>Reviews ({reviews.length})</button>
        <button className={tab === "enquiries" ? "on" : ""} onClick={() => setTab("enquiries")}>Enquiries ({enquiries.length})</button>
      </div>

      {tab === "cars" && <>
        <div style={{ marginBottom: 16 }}><button className="aBtn solid" onClick={() => setEditing(blank())}>+ Add vehicle</button></div>
        {cars.map((c) => (
          <div key={c.id} className="aRow">
            <div className="athumb" style={{ backgroundImage: `url("${c.images?.[0] || placeholder(c.model)}")` }} />
            <div className="ameta"><b>{c.make} {c.model}</b><span>{c.year} · €{Number(c.price).toLocaleString()} · {c.status} · {c.origin}</span></div>
            <button className="aBtn" onClick={() => setEditing(c)}>Edit</button>
            <button className="aBtn red" onClick={() => delCar(c.id)}>Delete</button>
          </div>
        ))}
      </>}

      {tab === "reviews" && reviews.map((r) => (
        <div key={r.id} className="aRow">
          <div className="ameta"><b>{r.name} · {"★".repeat(r.rating)}</b><span>{r.body}</span><span>{r.published ? "Published" : "Hidden"}</span></div>
          <button className="aBtn" onClick={() => togglePub(r)}>{r.published ? "Hide" : "Publish"}</button>
          <button className="aBtn red" onClick={() => delReview(r.id)}>Delete</button>
        </div>
      ))}

      {tab === "enquiries" && (enquiries.length === 0 ? <p className="empty">No enquiries yet.</p> : enquiries.map((e) => (
        <div key={e.id} className="aRow">
          <div className="ameta"><b>{e.type} · {e.name || "—"}</b><span>{e.contact} {e.car_label ? `· ${e.car_label}` : ""}</span><span>{e.message}</span><span>{new Date(e.created_at).toLocaleString()}</span></div>
        </div>
      )))}

      {editing && <CarEditor car={editing} onClose={() => setEditing(null)} onSave={saveCar} supabase={supabase} />}
    </main>
  );
}

function CarEditor({ car, onClose, onSave, supabase }: any) {
  const [f, setF] = useState({ ...car });
  const [uploading, setUploading] = useState(false);
  const set = (k: string) => (e: any) => setF({ ...f, [k]: e.target.value });
  const upload = async (e: any) => {
    const files = Array.from(e.target.files || []) as File[];
    if (!files.length) return;
    setUploading(true);
    const urls: string[] = [...(f.images || [])];
    for (const file of files) {
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
      const { error } = await supabase.storage.from("car-photos").upload(path, file);
      if (!error) { const { data } = supabase.storage.from("car-photos").getPublicUrl(path); urls.push(data.publicUrl); }
    }
    setF({ ...f, images: urls }); setUploading(false);
  };
  const rmImg = (i: number) => setF({ ...f, images: f.images.filter((_: any, x: number) => x !== i) });
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(8,18,35,.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, zIndex: 50 }} onClick={onClose}>
      <div className="panel" style={{ maxWidth: 720, width: "100%", maxHeight: "90vh", overflow: "auto" }} onClick={(e) => e.stopPropagation()}>
        <h3>{car.id ? "Edit vehicle" : "Add vehicle"}</h3>
        <div className="row"><div className="field"><label className="lbl">Make *</label><select value={f.make} onChange={set("make")}><option value="">Select…</option>{MAKES.map((m) => <option key={m} value={m}>{m}</option>)}</select></div><div className="field"><label className="lbl">Model *</label><input value={f.model} onChange={set("model")} /></div></div>
        <div className="row"><div className="field"><label className="lbl">Listing type</label><select value={f.status} onChange={set("status")}><option value="in_stock">In Stock</option><option value="to_order">To Order</option><option value="sold">Sold</option></select></div><div className="field"><label className="lbl">Delivery time</label><input value={f.delivery} onChange={set("delivery")} placeholder="e.g. 8-12 weeks" /></div></div>
        <div className="row"><div className="field"><label className="lbl">Year</label><input value={f.year} onChange={set("year")} /></div><div className="field"><label className="lbl">Price (€)</label><input value={f.price} onChange={set("price")} /></div><div className="field"><label className="lbl">Mileage (km)</label><input value={f.mileage} onChange={set("mileage")} /></div></div>
        <div className="row"><div className="field"><label className="lbl">Origin</label><select value={f.origin} onChange={set("origin")}>{ORIGINS.map((o) => <option key={o} value={o}>{o}</option>)}</select></div><div className="field"><label className="lbl">Fuel</label><select value={f.fuel} onChange={set("fuel")}>{FUELS.map((x) => <option key={x} value={x}>{x}</option>)}</select></div><div className="field"><label className="lbl">Gearbox</label><select value={f.gearbox} onChange={set("gearbox")}>{GEARBOX.map((x) => <option key={x} value={x}>{x}</option>)}</select></div></div>
        <div className="row"><div className="field"><label className="lbl">Engine</label><input value={f.engine} onChange={set("engine")} /></div><div className="field"><label className="lbl">Power</label><input value={f.power} onChange={set("power")} /></div><div className="field"><label className="lbl">Colour</label><input value={f.color} onChange={set("color")} /></div></div>
        <div className="row"><div className="field"><label className="lbl">CO₂ (g/km)</label><input value={f.co2} onChange={set("co2")} /></div><div className="field"><label className="lbl">NOx (mg/km)</label><input value={f.nox} onChange={set("nox")} /></div><div className="field"><label className="lbl">Sort (lower = first)</label><input value={f.sort} onChange={set("sort")} /></div></div>
        <div className="field" style={{ marginBottom: 14 }}><label className="lbl">Description</label><textarea rows={3} value={f.description} onChange={set("description")} /></div>
        <label className="lbl">Photos</label>
        <input type="file" accept="image/*" multiple onChange={upload} style={{ marginBottom: 10 }} />
        {uploading && <p className="note">Uploading…</p>}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
          {(f.images || []).map((im: string, i: number) => (
            <div key={i} style={{ position: "relative" }}>
              <div style={{ width: 90, height: 64, borderRadius: 8, backgroundImage: `url("${im}")`, backgroundSize: "cover", backgroundPosition: "center", border: "1px solid #e0ddd3" }} />
              <button onClick={() => rmImg(i)} style={{ position: "absolute", top: -7, right: -7, background: "#c01f2c", color: "#fff", border: "none", width: 20, height: 20, borderRadius: "50%", cursor: "pointer", fontSize: 11 }}>✕</button>
            </div>
          ))}
        </div>
        <div className="row"><button className="cta" onClick={() => onSave(f)}>Save vehicle</button><button className="aBtn" onClick={onClose} style={{ flex: "0 0 auto" }}>Cancel</button></div>
      </div>
    </div>
  );
}
