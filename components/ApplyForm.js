"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CLASSES, GENDERS } from "@/lib/constants";
const empty = { studentName: "", dob: "", gender: "", classApplied: "", parentName: "", phone: "", email: "", address: "", previousSchool: "", message: "", website: "" };
const steps = [["Child", ["studentName", "dob", "gender", "classApplied"]], ["Parent", ["parentName", "phone", "email", "address"]], ["Review", []]];
export default function ApplyForm() {
  const [i, setI] = useState(0); const [f, setF] = useState(empty);
  const [errs, setErrs] = useState({}); const [busy, setBusy] = useState(false);
  const [top, setTop] = useState(""); const [done, setDone] = useState(null);
  const set = (k) => (e) => { setF({ ...f, [k]: e.target.value }); if (errs[k]) setErrs({ ...errs, [k]: "" }); };
  function check(keys) {
    const e = {};
    keys.forEach((k) => { if (!String(f[k]).trim()) e[k] = "This field is required."; });
    if (keys.includes("phone") && f.phone && !/^[6-9]\d{9}$/.test(f.phone.replace(/\D/g, "").slice(-10))) e.phone = "Enter a valid 10-digit mobile number.";
    if (keys.includes("email") && f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) e.email = "Enter a valid email address.";
    setErrs(e); return !Object.keys(e).length;
  }
  const next = () => check(steps[i][1]) && setI(i + 1);
  async function submit() {
    setBusy(true); setTop("");
    try {
      const r = await fetch("/api/applications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
      const j = await r.json().catch(() => ({}));
      if (r.ok) return setDone(j.applicationNo || "Received");
      if (j.errors) { setErrs(j.errors); setI(Object.keys(j.errors).some((k) => steps[0][1].includes(k)) ? 0 : 1); }
      setTop((j.error || "Something went wrong. Please try again.") + (j.detail ? ` [${j.detail}]` : ""));
    } catch { setTop("No internet connection. Check your network and try again."); }
    finally { setBusy(false); }
  }
  const field = (k, label, props = {}) => (
    <label className="field"><span>{label}</span>
      <input type="text" value={f[k]} onChange={set(k)} aria-invalid={!!errs[k]} {...props} />
      {errs[k] && <small className="err">{errs[k]}</small>}
    </label>
  );
  const pick = (k, label, opts) => (
    <label className="field"><span>{label}</span>
      <select value={f[k]} onChange={set(k)} aria-invalid={!!errs[k]}><option value="">Select</option>{opts.map((o) => <option key={o}>{o}</option>)}</select>
      {errs[k] && <small className="err">{errs[k]}</small>}
    </label>
  );
  if (done) return (
    <motion.div className="card form success" initial={{ scale: .9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 140, damping: 12 }}>
      <motion.div className="check" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: .2, type: "spring" }}>✓</motion.div>
      <h3>Application received</h3>
      <p className="muted">Your application number is</p>
      <p className="appno">{done}</p>
      <p className="muted">Keep this number safe. The school office will call you within 2 working days.</p>
      <button className="btn ghost" onClick={() => { setF(empty); setI(0); setDone(null); }}>Apply for another child</button>
    </motion.div>
  );
  return (
    <div className="card form">
      <ol className="steps">{steps.map(([n], x) => <li key={n} className={x === i ? "on" : x < i ? "ok" : ""}><b>{x < i ? "✓" : x + 1}</b>{n}</li>)}</ol>
      <input name="website" tabIndex={-1} autoComplete="off" value={f.website} onChange={set("website")} className="hp" aria-hidden="true" />
      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: .22 }} className="grid">
          {i === 0 && <>{field("studentName", "Child's full name", { autoComplete: "off" })}{field("dob", "Date of birth", { type: "date", max: new Date().toISOString().slice(0, 10) })}{pick("gender", "Gender", GENDERS)}{pick("classApplied", "Class applying for", CLASSES)}</>}
          {i === 1 && <>{field("parentName", "Parent or guardian name", { autoComplete: "name" })}{field("phone", "Mobile number", { type: "tel", inputMode: "numeric", autoComplete: "tel", placeholder: "10-digit number" })}{field("email", "Email", { type: "email", autoComplete: "email" })}<label className="field full"><span>Home address</span><textarea rows={3} value={f.address} onChange={set("address")} aria-invalid={!!errs.address} />{errs.address && <small className="err">{errs.address}</small>}</label></>}
          {i === 2 && <>
            <div className="sum full"><b>{f.studentName}</b> · {f.classApplied} · {f.gender}<br /><span className="muted">{f.parentName} · {f.phone} · {f.email}</span></div>
            {field("previousSchool", "Previous school (optional)")}
            <label className="field full"><span>Anything we should know (optional)</span><textarea rows={3} maxLength={600} value={f.message} onChange={set("message")} /></label>
          </>}
        </motion.div>
      </AnimatePresence>
      {top && <p className="err banner" role="alert">{top}</p>}
      <div className="actions">
        {i > 0 && <button className="btn ghost" onClick={() => setI(i - 1)} disabled={busy}>Back</button>}
        {i < 2 ? <button className="btn" onClick={next}>Continue</button> : <button className="btn" onClick={submit} disabled={busy}>{busy ? "Submitting..." : "Submit application"}</button>}
      </div>
    </div>
  );
}
