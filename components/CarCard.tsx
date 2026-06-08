import Link from "next/link";
import type { Car } from "@/lib/types";
import { placeholder } from "@/lib/placeholder";
import { SPEC } from "./icons";

const FLAG: Record<string, string> = { Japan: "🇯🇵", UK: "🇬🇧" };

export default function CarCard({ car }: { car: Car }) {
  const isOrder = car.status === "to_order", isSold = car.status === "sold";
  const img = car.images?.[0] || placeholder(`${car.make} ${car.model}`);
  return (
    <Link href={`/car/${car.id}`} className={isSold ? "card sold" : "card"}>
      <div className="thumb" style={{ backgroundImage: `url("${img}")` }}>
        <span className="origin">{FLAG[car.origin]} {car.origin}</span>
        {isOrder && car.delivery && <span className="eta">⏱ {car.delivery}</span>}
        {isSold && <span className="soldTag">SOLD</span>}
        {!isSold && <span className="pricePill">€{Number(car.price).toLocaleString()}</span>}
      </div>
      <div className="cardBody">
        <h3>{car.make} {car.model}</h3>
        <div className="specIcons">
          <span>{SPEC.year}{car.year}</span>
          <span>{SPEC.mileage}{Number(car.mileage).toLocaleString()} km</span>
          <span>{SPEC.gear}{car.gearbox}</span>
          <span>{SPEC.fuel}{car.fuel}</span>
        </div>
        <div className="cardFoot"><span>{isSold ? "Delivered" : isOrder ? "Turnkey, delivered" : "Ready to drive"}</span><b>View details →</b></div>
      </div>
    </Link>
  );
}
