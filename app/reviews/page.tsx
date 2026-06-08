"use client";
import { useEffect, useState } from "react";
import { PageHead } from "@/components/SiteChrome";
import { createClient } from "@/lib/supabase/client";

function Stars({ n, size = 16 }: { n: number; size?: number }) {
  return <span className="stars" style={{ fontSize: size }}>{[1, 2, 3, 4, 5].map((i) => <span key={i} className={i <= Math.round(n) ? "s on" : "s"}>★</span>)}</span>;
}

export default function ReviewsPage() {
  const supabase = createClient();
  const [reviews, setReviews] = useState<any[]>([]);
  const [f, setF] = useState({ name: "", rating: 0, body: "" });
  const [done, setDone] = useState(false);
  const load = async () => { const { data } = await supabase.from("reviews").select("*").eq("published", true).order("created_at", { ascending: false }); setReviews(data || []); };
  useEffect(() => { load(); }, []);
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const submit = async () => {
    if (!f.name || !f.rating || !f.body) return;
    const { error } = await supabase.from("reviews").insert({ name: f.name, rating: f.rating, body: f.body });
    if (!error) { setF({ name: "", rating: 0, body: "" }); setDone(true); load(); }
  };
  return (
    <main>
      <PageHead eyebrow="Customer Feedback" title="What customers say" sub="Real reviews from people we've helped import. The rating below is the live average of every review left here." />
      <div className="wrap">
        <div className="revTop">
          <div className="revAvg"><b>{avg ? avg.toFixed(1) : "—"}</b><Stars n={avg} size={20} /><span>{reviews.length} review{reviews.length === 1 ? "" : "s"}</span></div>
          <div className="panel">
            <h3>Leave a review</h3>
            {done ? <div className="ok">✓ Thanks for your review!</div> : <>
              <div className="field" style={{ marginBottom: 14 }}><label className="lbl">Your name</label><input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
              <label className="lbl">Your rating</label>
              <div className="starPick">{[1, 2, 3, 4, 5].map((i) => <button key={i} className={i <= f.rating ? "on" : ""} onClick={() => setF({ ...f, rating: i })}>★</button>)}</div>
              <div className="field" style={{ marginBottom: 14 }}><label className="lbl">Your review</label><textarea rows={3} value={f.body} onChange={(e) => setF({ ...f, body: e.target.value })} placeholder="How was your experience?" /></div>
              <p className="note">Your review will be shown publicly on this page for other visitors to see.</p>
              <button className="cta" onClick={submit}>Post review</button>
            </>}
          </div>
        </div>
        <div className="revList">
          {reviews.length === 0 && <p className="empty">No reviews yet — be the first.</p>}
          {reviews.map((r) => <div key={r.id} className="revItem"><div className="revHead"><b>{r.name}</b><Stars n={r.rating} /></div><p>{r.body}</p><span className="revDate">{new Date(r.created_at).toLocaleDateString()}</span></div>)}
        </div>
      </div>
    </main>
  );
}
