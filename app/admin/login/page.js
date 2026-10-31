"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
export default function Login() {
  const r = useRouter();
  const [f, setF] = useState({ email: "", password: "" });
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  async function go(e) {
    e.preventDefault(); setBusy(true); setErr("");
    try {
      const res = await signIn("credentials", { ...f, redirect: false });
      if (res?.error) setErr("Email or password is incorrect.");
      else { r.push("/admin"); r.refresh(); }
    } catch { setErr("Could not sign in. Try again."); }
    setBusy(false);
  }
  return (
    <main className="login">
      <motion.form onSubmit={go} className="card login-card" initial={{ opacity: 0, y: 24, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 120, damping: 16 }}>
        <img src="/logo.png" alt="LHPG logo" className="logo-img big" />
        <h1>Admin sign in</h1>
        <p className="muted">Review and manage admission applications.</p>
        <label className="field"><span>Email</span><input type="email" required autoComplete="username" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
        <label className="field"><span>Password</span><input type="password" required autoComplete="current-password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></label>
        {err && <p className="err" role="alert">{err}</p>}
        <button className="btn" disabled={busy}>{busy ? "Signing in..." : "Sign in"}</button>
      </motion.form>
    </main>
  );
}
