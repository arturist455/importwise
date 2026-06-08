"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SOCIAL } from "./icons";

const NAV = [["/", "Browse"], ["/source", "Source for Me"], ["/vrt", "VRT Calculator"], ["/reviews", "Reviews"], ["/about", "About"], ["/contact", "Contact"]];

export function SiteHeader() {
  const path = usePathname();
  const [menu, setMenu] = useState(false);
  const active = (href: string) => (href === "/" ? path === "/" || path.startsWith("/car") : path.startsWith(href));
  return (
    <>
      <div className="topbar"><div className="tbInner">
        <div className="tbLeft"><span className="hideMob">📍 Ireland · nationwide delivery</span><a href="tel:+353852002977">☎ +353 85 200 2977</a><a className="hideMob" href="mailto:info.importwise@gmail.com">✉ info.importwise@gmail.com</a></div>
        <div className="tbRight">{Object.entries(SOCIAL).map(([k, ic]) => <a key={k} className="soc">{ic}</a>)}</div>
      </div></div>
      <header className="hdr">
        <Link href="/" className="brand"><span className="mark">IW</span><span className="word">IMPORT<em>WISE</em><small>CAR IMPORTS</small></span></Link>
        <nav className="nav">{NAV.map(([h, l]) => <Link key={h} href={h} className={active(h) ? "on" : ""}>{l}</Link>)}</nav>
        <Link href="/source" className="quote headerQuote">GET A QUOTE</Link>
        <button className="burger" onClick={() => setMenu(m => !m)}>{menu ? "✕" : "☰"}</button>
      </header>
      {menu && <div className="drawer">{NAV.map(([h, l]) => <Link key={h} href={h} className={active(h) ? "on" : ""} onClick={() => setMenu(false)}>{l}</Link>)}<Link href="/source" className="quote" onClick={() => setMenu(false)}>GET A QUOTE</Link></div>}
    </>
  );
}

export function SiteFooter() {
  return (
    <>
      <section className="ctaBand"><div className="ctaInner">
        <div><span className="eyebrow">Can't see it? 🚗</span><h2>Tell us the car — we'll source it for you.</h2></div>
        <Link href="/source">START A REQUEST →</Link>
      </div></section>
      <footer className="ftr">
        <div className="ftrCol"><b>IMPORT<em>WISE</em>.ie</b><p>Performance & quality car imports, sourced from Japan and the UK — auctions, exporters and dealers. Shipping, customs and VRT handled end-to-end.</p></div>
        <div className="ftrCol"><b>Explore</b>{NAV.map(([h, l]) => <Link key={h} href={h}>{l}</Link>)}</div>
        <div className="ftrCol"><b>Contact</b><a href="mailto:info.importwise@gmail.com">info.importwise@gmail.com</a><a href="tel:+353852002977">+353 85 200 2977</a><a>Ireland · nationwide delivery</a><a>Mon–Sat · 9:00–18:00</a></div>
        <div className="ftrBottom">© {new Date().getFullYear()} ImportWise.ie · All rights reserved</div>
      </footer>
    </>
  );
}

export function PageHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return <header className="pageHead"><div className="phInner"><span className="eyebrow">{eyebrow} 🚗</span><h1>{title}</h1>{sub && <p>{sub}</p>}</div></header>;
}
