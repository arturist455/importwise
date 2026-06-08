"use client";
import { useMemo, useState } from "react";
import { PageHead } from "@/components/SiteChrome";
import { MAKES, FUELS, CATALOGUE, calcVRT } from "@/lib/vrt";

export default function VrtPage() {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [f, setF] = useState({ omsp: "", co2: "", nox: "", fuel: "Petrol" });
  const set = (k: string) => (e: any) => setF({ ...f, [k]: e.target.value });
  const models = useMemo(() => CATALOGUE.filter((r) => r[0] === make), [make]);
  const onModel = (v: string) => { setModel(v); const row = CATALOGUE.find((r) => r[0] === make && r[1].toLowerCase() === v.toLowerCase()); if (row) setF((p) => ({ ...p, fuel: row[2], co2: String(row[3]), nox: String(row[4]) })); };
  const r = useMemo(() => calcVRT(f), [f]);
  const has = Number(f.omsp) > 0;
  const eur = (n: number) => "€" + Math.round(n).toLocaleString();
  return (
    <main>
      <PageHead eyebrow="Import Costs" title="VRT estimator" sub="Pick a car and we pre-fill typical emissions; enter its Irish market value and the tax estimate updates instantly. Based on Revenue's 2026 Category A CO₂ bands and the NOx levy." />
      <div className="wrap"><div className="vrtWrap">
        <div className="vrtForm">
          <div className="row">
            <div className="field"><label className="lbl">Make</label><select value={make} onChange={(e) => { setMake(e.target.value); setModel(""); }}><option value="">Select…</option>{MAKES.map((m) => <option key={m} value={m}>{m}</option>)}</select></div>
            <div className="field"><label className="lbl">Model</label><input list="vrtModels" value={model} onChange={(e) => onModel(e.target.value)} placeholder={make ? "Type or pick…" : "Select a make first"} disabled={!make} /><datalist id="vrtModels">{models.map((r) => <option key={r[1]} value={r[1]} />)}</datalist></div>
          </div>
          <div className="row">
            <div className="field"><label className="lbl">Year</label><input value={year} onChange={(e) => setYear(e.target.value)} placeholder="e.g. 2021" /></div>
            <div className="field"><label className="lbl">Fuel type</label><select value={f.fuel} onChange={set("fuel")}>{FUELS.map((x) => <option key={x} value={x}>{x}</option>)}</select></div>
          </div>
          <div className="row">
            <div className="field"><label className="lbl">CO₂ (g/km, WLTP)</label><input value={f.co2} onChange={set("co2")} placeholder="auto-filled / manual" /></div>
            <div className="field"><label className="lbl">NOx (mg/km)</label><input value={f.nox} onChange={set("nox")} placeholder="auto-filled / manual" /></div>
          </div>
          <div className="field"><label className="lbl">OMSP — Irish market value (€)</label><input value={f.omsp} onChange={set("omsp")} placeholder="e.g. 32000" /></div>
          <p className="note">Emissions are <b>typical figures</b> — confirm exact CO₂/NOx from the car's Certificate of Conformity or V5C. <b>OMSP</b> is the value <b>Revenue</b> assigns in the Irish market, not the price paid abroad. This is an estimate; the official figure comes from Revenue at <span className="lnk">ros.ie</span>.</p>
        </div>
        <div className="vrtResult">
          {has ? (<>
            <div className="vrtTotal"><span>Estimated VRT</span><b>{eur(r.total)}</b></div>
            <div className="vrtRow"><span>CO₂ band</span><b>{r.band.pct}% {r.band.max === Infinity ? "(>190 g/km)" : `(≤${r.band.max} g/km)`}</b></div>
            <div className="vrtRow"><span>CO₂ charge</span><b>{eur(r.co2charge)}</b></div>
            {r.relief > 0 && <div className="vrtRow rel"><span>EV relief</span><b>−{eur(r.relief)}</b></div>}
            <div className="vrtRow"><span>NOx levy</span><b>{eur(r.nox)}</b></div>
            <div className="vrtHint">VRT is added to the purchase price + shipping + any customs duty/VAT to reach the full landed cost.</div>
          </>) : <div className="vrtEmpty">Enter an OMSP value to see the estimate.</div>}
        </div>
      </div></div>
    </main>
  );
}
