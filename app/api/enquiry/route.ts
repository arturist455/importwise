import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { error } = await supabase.from("enquiries").insert({
      type: body.type || "contact",
      car_id: body.carId || null,
      car_label: body.carLabel || null,
      name: body.name || null,
      contact: body.contact || null,
      message: body.message || null,
      payload: body,
    });
    if (error) return Response.json({ ok: false, error: error.message }, { status: 400 });

    // Optional email notification via Resend
    if (process.env.RESEND_API_KEY && process.env.ENQUIRY_NOTIFY_EMAIL) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: "ImportWise <onboarding@resend.dev>",
            to: [process.env.ENQUIRY_NOTIFY_EMAIL],
            subject: `New ${body.type || "contact"} — ImportWise`,
            text: `Name: ${body.name}\nContact: ${body.contact}\nCar: ${body.carLabel || "-"}\nMessage: ${body.message || "-"}`,
          }),
        });
      } catch {}
    }
    return Response.json({ ok: true });
  } catch (e: any) {
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}
