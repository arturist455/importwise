"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLogin() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const login = async () => {
    setErr("");
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
    if (error) setErr(error.message);
    else { router.push("/admin"); router.refresh(); }
  };
  return (
    <main className="wrap" style={{ maxWidth: 420 }}>
      <div className="panel">
        <h3>Admin sign in</h3>
        <div className="field" style={{ marginBottom: 14 }}><label className="lbl">Email</label><input value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div className="field" style={{ marginBottom: 14 }}><label className="lbl">Password</label><input type="password" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && login()} /></div>
        {err && <p style={{ color: "#c01f2c", fontSize: 13, marginBottom: 10 }}>{err}</p>}
        <button className="cta" onClick={login}>Sign in</button>
        <p className="note">Only your account can sign in. Create it in Supabase → Authentication → Users.</p>
      </div>
    </main>
  );
}
