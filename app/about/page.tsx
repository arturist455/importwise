import { createClient } from "@/lib/supabase/server";
import { PageHead } from "@/components/SiteChrome";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const supabase = createClient();
  const { data: reviews } = await supabase.from("reviews").select("rating").eq("published", true);
  const count = reviews?.length || 0;
  const avg = count ? (reviews!.reduce((s: number, r: any) => s + r.rating, 0) / count) : 0;
  const why = [["⛬", "Customs & VRT handled", "We manage shipping, customs clearance and VRT up front, so the turnkey price is the price you pay — no surprises on arrival."], ["⌬", "Inspected & verified", "Every car is checked and its history verified before we commit — condition, accidents, the lot."], ["◎", "Sourced direct", "We buy from Japan and the UK through auctions, trusted exporters and dealers, and pass the saving to you."], ["✦", "Curated, not random", "We list cars worth buying — clean histories, sensible specs, fair landed pricing."]];
  const faq = [["How does importing a car actually work?", "Pick a car from In Stock, reserve one from To Order, or ask us to source it. We secure it, inspect it, ship it, clear customs and handle VRT, then deliver it ready to drive in Ireland."], ["Where do you find the cars?", "Across Japan and the UK — auctions, established exporters and dealers. We pick the best route for the specific car and budget."], ["Is VRT included in the price?", "For To Order cars, yes — the turnkey price already includes shipping, customs and VRT. In Stock cars are already registered, so the listed price is final."], ["How long does delivery take?", "UK imports are typically 1–2 weeks. Japan imports run roughly 8–12 weeks including shipping and clearance."]];
  return (
    <main>
      <PageHead eyebrow="About Us" title="Driving Your Dreams With Imported Cars" sub="We help drivers in Ireland get the exact car they want from Japan and the UK — inspected, cleared, registered, and delivered without the guesswork." />
      <div className="wrap">
        <div className="statRow">
          <div className="stat"><b>🇯🇵 🇬🇧</b><span>Japan & UK sourcing</span></div>
          <div className="stat"><b>VRT</b><span>& customs handled</span></div>
          <div className="stat"><b>Every car</b><span>inspected & verified</span></div>
          <Link href="/reviews" className="stat" style={{ textDecoration: "none" }}><b>{count ? `${avg.toFixed(1)}★` : "New"}</b><span>{count ? `${count} customer reviews` : "building our reputation"}</span></Link>
        </div>
        <span className="eyebrow">Why Us 🚗</span>
        <h2 className="secTitle">Why buy through us</h2>
        <div className="whyGrid">{why.map(([ic, t, d]) => <div key={t} className="why"><span className="ic">{ic}</span><b>{t}</b><p>{d}</p></div>)}</div>
        <span className="eyebrow">Questions 🚗</span>
        <h2 className="secTitle">Frequently asked</h2>
        <div className="faq">{faq.map(([q, a]) => <details key={q} className="fitem"><summary className="fq" style={{ listStyle: "none", cursor: "pointer" }}>{q}<span>+</span></summary><p className="fa">{a}</p></details>)}</div>
      </div>
    </main>
  );
}
