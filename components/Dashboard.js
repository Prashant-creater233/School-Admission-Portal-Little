"use client";
import { useCallback, useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { CLASSES, STATUSES } from "@/lib/constants";
const L = { pending: "Pending", review: "In review", approved: "Approved", rejected: "Rejected" };
export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [d, setD] = useState({ rows: [], total: 0, pages: 1 });
  const [q, setQ] = useState(""), [status, setStatus] = useState(""), [cls, setCls] = useState(""), [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true), [err, setErr] = useState("");
  const load = useCallback(async () => {
    setLoading(true); setErr("");
    try {
      const p = new URLSearchParams({ page, q, status, cls });
      const [a, b] = await Promise.all([fetch(`/api/applications?${p}`), fetch("/api/applications/stats")]);
      if (a.status === 401) return (location.href = "/admin/login");
      if (!a.ok || !b.ok) throw new Error();
      setD(await a.json()); setStats(await b.json());
    } catch { setErr("Could not load applications. Check MONGODB_URI in .env.local."); }
    finally { setLoading(false); }
  }, [page, q, status, cls]);
  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [load]);
  const flt = (fn) => (e) => { fn(e.target.value); setPage(1); };
  async function setSt(id, s) {
    const r = await fetch(`/api/applications/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: s }) });
    r.ok ? load() : setErr("Status update failed.");
  }
  async function del(id, n) {
    if (!confirm(`Delete application ${n}? This cannot be undone.`)) return;
    const r = await fetch(`/api/applications/${id}`, { method: "DELETE" });
    r.ok ? load() : setErr("Delete failed.");
  }
  const days = Array.from({ length: 7 }, (_, k) => { const t = new Date(Date.now() - (6 - k) * 864e5).toISOString().slice(0, 10); return [t.slice(5), stats?.daily.find((x) => x._id === t)?.n || 0]; });
  const maxD = Math.max(1, ...days.map((x) => x[1])), maxC = Math.max(1, ...(stats?.byClass.map((x) => x.n) || [1]));
  const cards = [["Total", stats?.total], ...STATUSES.map((s) => [L[s], stats?.byStatus[s] || 0])];
  return (
    <div className="dash">
      <header className="nav"><div className="wrap row">
        <span className="brand"><img src="/logo.png" alt="" className="logo-img" />Admissions dashboard</span>
        <span className="row gap"><a className="btn ghost sm" href="/">View site</a><button className="btn sm" onClick={() => signOut({ callbackUrl: "/admin/login" })}>Sign out</button></span>
      </div></header>
      <main className="wrap">
        <div className="cards">
          {cards.map(([n, v], i) => (
            <motion.div key={n} className="card stat" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .07 }}>
              <span className="muted">{n}</span><strong>{v ?? "-"}</strong>
            </motion.div>
          ))}
        </div>
        <div className="charts">
          <div className="card"><h3>Last 7 days</h3><div className="bars">{days.map(([t, n]) => <div key={t}><motion.i initial={{ height: 0 }} animate={{ height: `${(n / maxD) * 100}%` }} /><em>{n}</em><small>{t}</small></div>)}</div></div>
          <div className="card"><h3>By class</h3>{(stats?.byClass || []).map((c) => <div className="hbar" key={c._id}><span>{c._id}</span><div><motion.i initial={{ width: 0 }} animate={{ width: `${(c.n / maxC) * 100}%` }} /></div><b>{c.n}</b></div>)}{stats && !stats.byClass.length && <p className="muted">No applications yet.</p>}</div>
        </div>
        <div className="card">
          <div className="filters">
            <input placeholder="Search name, phone, email, number" value={q} onChange={flt(setQ)} />
            <select value={status} onChange={flt(setStatus)}><option value="">All statuses</option>{STATUSES.map((s) => <option key={s} value={s}>{L[s]}</option>)}</select>
            <select value={cls} onChange={flt(setCls)}><option value="">All classes</option>{CLASSES.map((c) => <option key={c}>{c}</option>)}</select>
          </div>
          {err && <p className="err banner">{err}</p>}
          <div className="tbl"><table>
            <thead><tr><th>No.</th><th>Child</th><th>Class</th><th>Parent</th><th>Contact</th><th>Applied</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {d.rows.map((r) => (
                <tr key={r._id}>
                  <td>{r.applicationNo}</td><td><b>{r.studentName}</b><br /><small className="muted">{r.gender} · {r.dob}</small></td><td>{r.classApplied}</td>
                  <td>{r.parentName}</td><td>{r.phone}<br /><small className="muted">{r.email}</small></td>
                  <td>{new Date(r.createdAt).toLocaleDateString("en-IN")}</td>
                  <td><select className={`st ${r.status}`} value={r.status} onChange={(e) => setSt(r._id, e.target.value)}>{STATUSES.map((s) => <option key={s} value={s}>{L[s]}</option>)}</select></td>
                  <td><button className="link" onClick={() => del(r._id, r.applicationNo)}>Delete</button></td>
                </tr>
              ))}
              {!loading && !d.rows.length && <tr><td colSpan={8} className="muted center">No applications match these filters.</td></tr>}
              {loading && <tr><td colSpan={8} className="muted center">Loading...</td></tr>}
            </tbody>
          </table></div>
          <div className="pager"><span className="muted">{d.total} application{d.total === 1 ? "" : "s"}</span>
            <span className="row gap"><button className="btn ghost sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button><span>{page} / {d.pages}</span><button className="btn ghost sm" disabled={page >= d.pages} onClick={() => setPage(page + 1)}>Next</button></span></div>
        </div>
      </main>
    </div>
  );
}
