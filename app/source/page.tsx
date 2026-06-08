"use client";
import { useState } from "react";
import { PageHead } from "@/components/SiteChrome";
import { ORIGINS } from "@/lib/vrt";

export default function SourcePage() {
  const [f, setF] = useState({ make: "", budget: "", origin: "Japan", year: "", notes: "", name: "", contact: "" });
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const set = (k: string) => (e: any) => setF({ ...f, [k]: e.target.value });
  const submit = async () => {
    if (!f.make || !f.contact) { setErr("Add at least the car and your contact."); return; }
    setErr("");
    const res = await fetch("/api/enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "source", name: f.name, contact: f.contact, message: `Wants: ${f.make} | Budget: ${f.budget} | Origin: ${f.origin} | Year from: ${f.year} | Notes: ${f.notes}`, ...f }) });
    if (res.ok) setDone(true); else setErr("Something went wrong — please email us directly.");
  };
  return (
    <main>
      <PageHead eyebrow="Custom Sourcing" title="Can't find it? We'll source it for you." sub="Tell us exactly what you want. We find it across Japan and the UK — auctions, exporters and dealers — inspect it, import it and deliver it turnkey." />
      <div className="wrap">
        <div className="steps">{[["01", "Brief", "You tell us the car & budget"], ["02", "Source & inspect", "We find it and verify condition & history"], ["03", "Import", "Shipping, customs & VRT handled"], ["04", "Delivery", "Keys handed over in Ireland"]].map(([n, t, d]) => <div key={n} className="step"><span>{n}</span><b>{t}</b><p>{d}</p></div>)}</div>
        {!done ? (
          <div className="panel" style={{ maxWidth: 760 }}>
            <h3>Start a sourcing request</h3>
            <div className="row"><div className="field"><label className="lbl">Car you want *</label><input value={f.make} onChange={set("make")} placeholder="e.g. Lexus RX450h, 2021+" /></div><div className="field"><label className="lbl">Budget (€)</label><input value={f.budget} onChange={set("budget")} placeholder="e.g. 40000" /></div></div>
            <div className="row"><div className="field"><label className="lbl">Preferred origin</label><select value={f.origin} onChange={set("origin")}>{ORIGINS.map((o) => <option key={o} value={o}>{o}</option>)}</select></div><div className="field"><label className="lbl">Year from</label><input value={f.year} onChange={set("year")} placeholder="e.g. 2020" /></div></div>
            <div className="field" style={{ marginBottom: 14 }}><label className="lbl">Notes</label><textarea rows={3} value={f.notes} onChange={set("notes")} placeholder="Colour, spec, mileage limit, condition…" /></div>
            <div className="row"><div className="field"><label className="lbl">Your name</label><input value={f.name} onChange={set("name")} /></div><div className="field"><label className="lbl">Phone or email *</label><input value={f.contact} onChange={set("contact")} /></div></div>
            {err && <p style={{ color: "#c01f2c", fontSize: 13, marginBottom: 10 }}>{err}</p>}
            <button className="cta" onClick={submit}>Submit request</button>
          </div>
        ) : <div className="panel ok" style={{ maxWidth: 760 }}>✓ Request received. We'll review what's available and come back with options and a full landed-price estimate.</div>}
      </div>
    </main>
  );
}
