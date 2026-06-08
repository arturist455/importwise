import { createClient } from "@/lib/supabase/server";
import { placeholder } from "@/lib/placeholder";
import EnquiryForm from "@/components/EnquiryForm";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
const FLAG: any = { Japan: "🇯🇵", UK: "🇬🇧" };

export default async function CarPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: car } = await supabase.from("cars").select("*").eq("id", params.id).single();
  if (!car) notFound();
  const imgs: string[] = (car.images && car.images.length) ? car.images : [placeholder(`${car.make} ${car.model}`)];
  const isOrder = car.status === "to_order", isSold = car.status === "sold";
  const specs: [string, any][] = [["Year", car.year], ["Mileage", `${Number(car.mileage).toLocaleString()} km`], ["Origin", `${FLAG[car.origin]} ${car.origin}`], ["Gearbox", car.gearbox], ["Fuel", car.fuel], ["Engine", car.engine || "—"], ["Power", car.power || "—"], ["Colour", car.color || "—"], ["CO₂", car.co2 ? `${car.co2} g/km` : "—"], ["NOx", car.nox ? `${car.nox} mg/km` : "—"]];
  return (
    <main>
      <Link href="/" className="backLink">← Back to stock</Link>
      <div className="detailWrap">
        <div className="gallery">
          <div className="mainImg" style={{ backgroundImage: `url("${imgs[0]}")` }} />
          {imgs.length > 1 && <div className="thumbs">{imgs.map((im, i) => <div key={i} className={i === 0 ? "t on" : "t"} style={{ backgroundImage: `url("${im}")` }} />)}</div>}
        </div>
        <div>
          <span className="badge">{FLAG[car.origin]} {car.origin} import{isOrder && car.delivery ? ` · ${car.delivery}` : ""}{isSold ? " · sold" : ""}</span>
          <h1>{car.make} {car.model}</h1>
          {!isSold && <div className="bigPrice">€{Number(car.price).toLocaleString()}<small>{isOrder ? "turnkey · incl. shipping, customs & VRT" : "ready to drive · VRT paid"}</small></div>}
          <p className="desc">{car.description}</p>
          <div className="specGrid">{specs.map(([k, v]) => <div key={k}><label>{k}</label><b>{v}</b></div>)}</div>
          {isSold ? <div className="ok">This car has been sold. Browse our stock or ask us to source one like it.</div>
            : <EnquiryForm type={isOrder ? "reservation" : "enquiry"} carId={car.id} carLabel={`${car.make} ${car.model} (${car.year})`} label={isOrder ? "Reserve this car" : "Enquire about this car"} />}
        </div>
      </div>
    </main>
  );
}
