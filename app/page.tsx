import { createClient } from "@/lib/supabase/server";
import Browse from "@/components/Browse";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = createClient();
  const { data } = await supabase.from("cars").select("*").order("sort", { ascending: true });
  return <Browse cars={(data as any) || []} />;
}
