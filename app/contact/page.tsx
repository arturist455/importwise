"use client";
import { useState } from "react";
import { PageHead } from "@/components/SiteChrome";

export default function ContactPage() {
  const [f, setF] = useState({ name: "", email: "", phone: "", message: "" });
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const set = (k: string) => (e: any) => setF({ ...f, [k]: e.target.value });
  const submit = async () => {
    if (!f.name || (!f.email && !f.phone)) { setErr("Add your name and a way to reach you."); return; }
    setErr("");
    const res = await fetch("/api/enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "contact", name: f.name, contact: f.email || f.phone, message: f.message }) });
    if (res.ok) setDone(true); else setErr("Something went wrong — please email us directly.");
  };
  return (
    <main>
      <PageHead eyebrow="Get In Touch" title="Let's talk cars" sub="Questions about a listing, a car you'd like us to find, or import in general — reach out and we'll get back fast." />
      <div className="wrap"><div className="contactGrid">
        <div className="panel">{!done ? (<>
          <h3>Send a message</h3>
          <div className="row"><div className="field"><label className="lbl">Name *</label><input value={f.name} onChange={set("name")} /></div><div className="field"><label className="lbl">Phone</label><input value={f.phone} onChange={set("phone")} /></div></div>
          <div className="field" style={{ marginBottom: 14 }}><label className="lbl">Email</label><input value={f.email} onChange={set("email")} /></div>
          <div className="field" style={{ marginBottom: 14 }}><label className="lbl">Message</label><textarea rows={3} value={f.message} onChange={set("message")} placeholder="What can we help with?" /></div>
          {err && <p style={{ color: "#c01f2c", fontSize: 13, marginBottom: 10 }}>{err}</p>}
          <button className="cta" onClick={submit}>Send message</button>
        </>) : <div className="ok">✓ Thanks — your message is in. We'll reply shortly.</div>}</div>
        <div className="panel info"><h3>Reach us directly</h3>
          <div className="ci"><label>Email</label><b>info.importwise@gmail.com</b></div>
          <div className="ci"><label>Phone / WhatsApp</label><b>+353 85 200 2977</b></div>
          <div className="ci"><label>Based in</label><b>Ireland — nationwide delivery</b></div>
          <div className="ci"><label>Hours</label><b>Mon–Sat · 9:00–18:00</b></div>
        </div>
      </div></div>
    </main>
  );
}
