// Irish VRT (Vehicle Registration Tax) — Category A passenger cars.
// CO2 bands + NOx levy per Revenue.ie (2026). Figures are estimates; OMSP is set by Revenue.

export const ORIGINS = ["Japan", "UK"] as const;
export const FUELS = ["Petrol", "Diesel", "Hybrid", "Electric"];
export const GEARBOX = ["Automatic", "Manual"];

export const MAKES = ["Audi","BMW","Citroën","Dacia","Fiat","Ford","Honda","Hyundai","Jaguar","Jeep","Kia","Land Rover","Lexus","Mazda","Mercedes-Benz","MG","Mini","Mitsubishi","Nissan","Opel","Peugeot","Porsche","Renault","SEAT","Škoda","Subaru","Suzuki","Tesla","Toyota","Volkswagen","Volvo"];

const VRT_BANDS = [
  { max: 50, pct: 7, min: 140 }, { max: 80, pct: 9, min: 180 }, { max: 85, pct: 9.75, min: 195 },
  { max: 90, pct: 10.5, min: 210 }, { max: 95, pct: 11.25, min: 225 }, { max: 100, pct: 12, min: 240 },
  { max: 105, pct: 12.75, min: 255 }, { max: 110, pct: 13.5, min: 270 }, { max: 115, pct: 15.25, min: 305 },
  { max: 120, pct: 16, min: 320 }, { max: 125, pct: 16.75, min: 335 }, { max: 130, pct: 17.5, min: 350 },
  { max: 135, pct: 19.25, min: 385 }, { max: 140, pct: 20, min: 400 }, { max: 145, pct: 21.5, min: 430 },
  { max: 150, pct: 25, min: 500 }, { max: 155, pct: 27.5, min: 550 }, { max: 170, pct: 30, min: 600 },
  { max: 190, pct: 35, min: 700 }, { max: Infinity, pct: 41, min: 820 },
];

export function noxCharge(nox: number, fuel: string) {
  if (fuel === "Electric") return 0;
  const n = Number(nox) || 0;
  let c = Math.min(n, 40) * 5;
  if (n > 40) c += (Math.min(n, 80) - 40) * 15;
  if (n > 80) c += (n - 80) * 25;
  return Math.min(c, fuel === "Diesel" ? 4850 : 600);
}

export function calcVRT({ omsp, co2, nox, fuel }: { omsp: any; co2: any; nox: any; fuel: string }) {
  const o = Number(omsp) || 0, c = Number(co2) || 0;
  const band = VRT_BANDS.find((b) => c <= b.max)!;
  const co2charge = Math.max((o * band.pct) / 100, band.min);
  let relief = 0;
  if (fuel === "Electric") {
    if (o <= 40000) relief = Math.min(5000, co2charge);
    else if (o < 50000) relief = Math.min((5000 * (50000 - o)) / 10000, co2charge);
  }
  const nx = noxCharge(nox, fuel);
  return { band, co2charge, relief, nox: nx, total: Math.max(co2charge - relief, 0) + nx };
}

// typical emissions [make, model, fuel, co2, nox] — confirm via CoC / V5C
export const CATALOGUE: [string, string, string, number, number][] = [
  ["Audi","A1","Petrol",110,30],["Audi","A3","Petrol",120,32],["Audi","A4 TDI","Diesel",130,45],["Audi","A6 TDI","Diesel",140,48],["Audi","Q3","Diesel",140,45],["Audi","Q5 TDI","Diesel",160,50],["Audi","Q7","Diesel",180,55],["Audi","e-tron","Electric",0,0],
  ["BMW","116i","Petrol",120,30],["BMW","320d","Diesel",130,45],["BMW","330e","Hybrid",40,15],["BMW","520d","Diesel",135,46],["BMW","X3","Diesel",150,48],["BMW","X5","Diesel",175,52],["BMW","M3","Petrol",230,40],["BMW","i4","Electric",0,0],
  ["Mercedes-Benz","A180","Petrol",125,32],["Mercedes-Benz","C220d","Diesel",130,45],["Mercedes-Benz","E220d","Diesel",140,46],["Mercedes-Benz","GLC","Diesel",160,48],["Mercedes-Benz","GLE","Diesel",185,55],["Mercedes-Benz","EQC","Electric",0,0],
  ["Toyota","Yaris","Hybrid",100,9],["Toyota","Corolla","Hybrid",100,9],["Toyota","C-HR","Hybrid",110,10],["Toyota","RAV4","Hybrid",130,12],["Toyota","Land Cruiser Prado","Diesel",200,55],["Toyota","Hilux","Diesel",230,60],["Toyota","Supra","Petrol",170,38],["Toyota","Prius","Hybrid",90,7],["Toyota","Alphard","Hybrid",150,18],
  ["Honda","Jazz","Hybrid",100,10],["Honda","Civic","Petrol",130,28],["Honda","Civic Type R","Petrol",182,28],["Honda","CR-V","Hybrid",140,18],["Honda","HR-V","Hybrid",120,14],
  ["Nissan","Micra","Petrol",110,28],["Nissan","Qashqai","Petrol",140,30],["Nissan","X-Trail","Petrol",165,30],["Nissan","Leaf","Electric",0,0],["Nissan","GT-R R35","Petrol",275,60],["Nissan","Skyline GT-R R34","Petrol",280,65],
  ["Mazda","Mazda2","Petrol",110,24],["Mazda","Mazda3","Petrol",120,26],["Mazda","CX-5","Diesel",150,45],["Mazda","MX-5","Petrol",150,24],["Mazda","RX-8","Petrol",290,70],
  ["Subaru","Impreza","Petrol",160,30],["Subaru","Impreza WRX STI","Petrol",242,35],["Subaru","Forester","Petrol",170,30],["Subaru","Outback","Petrol",180,32],
  ["Lexus","IS300h","Hybrid",130,11],["Lexus","ES300h","Hybrid",120,10],["Lexus","RX450h","Hybrid",150,14],["Lexus","NX350h","Hybrid",130,12],["Lexus","UX250h","Hybrid",110,9],
  ["Mitsubishi","Lancer Evolution","Petrol",250,50],["Mitsubishi","Outlander PHEV","Hybrid",40,5],["Mitsubishi","ASX","Petrol",150,30],
  ["Land Rover","Defender","Diesel",230,48],["Land Rover","Discovery","Diesel",200,50],["Land Rover","Range Rover Evoque","Diesel",170,40],["Land Rover","Range Rover Sport","Diesel",190,50],["Land Rover","Range Rover","Diesel",230,55],
  ["Volkswagen","Polo","Petrol",110,30],["Volkswagen","Golf","Petrol",120,32],["Volkswagen","Golf GTI","Petrol",170,35],["Volkswagen","Golf TDI","Diesel",120,45],["Volkswagen","Passat","Diesel",130,46],["Volkswagen","Tiguan","Diesel",150,48],["Volkswagen","ID.4","Electric",0,0],
  ["Ford","Fiesta","Petrol",115,30],["Ford","Focus","Petrol",125,32],["Ford","Kuga","Diesel",140,45],["Ford","Mustang","Petrol",230,40],
  ["Hyundai","i20","Petrol",115,28],["Hyundai","i30","Petrol",125,30],["Hyundai","Tucson","Diesel",140,45],["Hyundai","Ioniq","Electric",0,0],
  ["Kia","Picanto","Petrol",110,28],["Kia","Ceed","Petrol",125,30],["Kia","Sportage","Diesel",140,45],["Kia","EV6","Electric",0,0],
  ["Škoda","Fabia","Petrol",110,30],["Škoda","Octavia","Diesel",120,45],["Škoda","Kodiaq","Diesel",150,48],["Škoda","Superb","Diesel",130,46],
  ["SEAT","Ibiza","Petrol",115,30],["SEAT","Leon","Petrol",125,32],["SEAT","Ateca","Diesel",140,45],
  ["Volvo","V40","Diesel",120,44],["Volvo","XC40","Petrol",150,32],["Volvo","XC60","Diesel",150,48],["Volvo","XC90","Diesel",170,52],
  ["Peugeot","208","Petrol",110,28],["Peugeot","308","Diesel",120,44],["Peugeot","3008","Diesel",130,46],
  ["Renault","Clio","Petrol",110,28],["Renault","Megane","Diesel",120,44],["Renault","Captur","Petrol",130,30],
  ["Porsche","911","Petrol",230,40],["Porsche","Cayenne","Petrol",230,42],["Porsche","Macan","Petrol",200,40],["Porsche","Taycan","Electric",0,0],
  ["Jaguar","XE","Diesel",130,45],["Jaguar","F-Pace","Diesel",160,50],["Jaguar","F-Type","Petrol",210,40],
  ["Tesla","Model 3","Electric",0,0],["Tesla","Model Y","Electric",0,0],["Tesla","Model S","Electric",0,0],
  ["Mini","Cooper","Petrol",120,30],["Mini","Countryman","Petrol",140,32],
  ["Suzuki","Swift","Petrol",110,26],["Suzuki","Vitara","Petrol",130,30],
  ["MG","MG3","Petrol",120,28],["MG","ZS","Petrol",140,30],["MG","MG4","Electric",0,0],
  ["Citroën","C3","Petrol",110,28],["Citroën","C4","Diesel",120,44],
  ["Fiat","500","Petrol",110,26],["Fiat","Panda","Petrol",115,28],
  ["Dacia","Sandero","Petrol",120,28],["Dacia","Duster","Diesel",140,44],
  ["Jeep","Renegade","Petrol",150,32],["Jeep","Compass","Diesel",150,46],
  ["Opel","Corsa","Petrol",110,28],["Opel","Astra","Diesel",120,44],
];
