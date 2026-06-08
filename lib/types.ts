export type CarStatus = "in_stock" | "to_order" | "sold";

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  origin: "Japan" | "UK";
  status: CarStatus;
  fuel: string;
  gearbox: string;
  engine: string;
  power: string;
  color: string;
  co2: number;
  nox: number;
  delivery: string;
  description: string;
  images: string[];
  sort?: number;
}

export interface Review {
  id: string;
  created_at: string;
  name: string;
  rating: number;
  body: string;
  published: boolean;
}
