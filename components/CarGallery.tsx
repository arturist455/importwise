"use client";
import { useState } from "react";

export default function CarGallery({ imgs }: { imgs: string[] }) {
  const [active, setActive] = useState(0);
  return (
    <div className="gallery">
      <div className="mainImg" style={{ backgroundImage: `url("${imgs[active]}")` }} />
      {imgs.length > 1 && (
        <div className="thumbs">
          {imgs.map((im, i) => (
            <div
              key={i}
              className={i === active ? "t on" : "t"}
              style={{ backgroundImage: `url("${im}")` }}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
