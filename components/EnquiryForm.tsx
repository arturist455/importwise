"use client";
import { useState } from "react";

export default function EnquiryForm({ type, carId, carLabel, label }: { type: string; carId?: string; carLabel?: string; label: string }) {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ name: "", contact: "", message: "" });
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const submit = async () => {
    if (!f.name || !f.contact) { setErr("Please add your name and a contact."); return; }
    setErr("");
    const res = await fetch("/api/enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type, carId, carLabel, ...f }) });
    if (res.ok) setDone(true); else setErr("Something went wrong — please email us directly.");
  };
  if (done) return <div className="ok">✓ Request received. We'll be in touch shortly.</div>;
  if (!open) return <button className="cta" onClick={() => setOpen(true)}>{label}</button>;
  return (
    <div>
      <div className="row"><div className="field"><label className="lbl">Your name</label><input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div></div>
      <div className="field" style={{ marginBottom: 14 }}><label className="lbl">Phone or email</label><input value={f.contact} onChange={(e) => setF({ ...f, contact: e.target.value })} /></div>
      <div className="field" style={{ marginBottom: 14 }}><label className="lbl">Message (optional)</label><textarea rows={3} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} /></div>
      {err && <p style={{ color: "#c01f2c", fontSize: 13, marginBottom: 10 }}>{err}</p>}
      <button className="cta" onClick={submit}>Send</button>
    </div>
  );
}
