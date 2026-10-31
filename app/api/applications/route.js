import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import Application from "@/models/Application";
import { isAdmin } from "@/lib/guard";
import { validate } from "@/lib/validate";
import { CLASSES, STATUSES } from "@/lib/constants";
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const genNo = () => `LHPG-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
const fail = (error, status, extra = {}) => NextResponse.json({ error, ...extra }, { status });

export async function POST(req) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") return fail("Invalid request.", 400);
    if (body.website) return NextResponse.json({ ok: true }); // honeypot for bots
    const { data, errors } = validate(body);
    if (errors) return fail("Please fix the highlighted fields.", 422, { errors });
    await db();
    const dup = await Application.findOne({
      phone: data.phone, classApplied: data.classApplied,
      studentName: new RegExp(`^${esc(data.studentName)}$`, "i"),
    }).lean();
    if (dup) return fail(`An application for ${data.studentName} already exists (${dup.applicationNo}).`, 409);
    let doc;
    for (let i = 0; i < 4; i++) {
      try { doc = await Application.create({ ...data, applicationNo: genNo() }); break; }
      catch (e) { if (e.code !== 11000 || i === 3) throw e; }
    }
    return NextResponse.json({ ok: true, applicationNo: doc.applicationNo }, { status: 201 });
  } catch (e) {
    console.error("POST /api/applications", e);
    const msg = String(e?.message || e);
    const detail = process.env.NODE_ENV !== "production" ? msg : undefined;
    if (e?.name === "ValidationError") return fail("Some details look invalid. Please check the form.", 422, { detail });
    if (/MONGODB_URI|ECONN|ENOTFOUND|ETIMEDOUT|ServerSelection|Authentication|bad auth|querySrv|buffering|Mongo/i.test(msg + e?.name))
      return fail("The database is not connected. Check MONGODB_URI in .env.local, then restart the server.", 503, { detail });
    return fail("We could not save your application. Please try again in a minute.", 500, { detail });
  }
}

export async function GET(req) {
  try {
    if (!(await isAdmin())) return fail("Unauthorized", 401);
    const sp = new URL(req.url).searchParams;
    const page = Math.max(1, parseInt(sp.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(sp.get("limit")) || 10));
    const q = (sp.get("q") || "").trim().slice(0, 60);
    const status = sp.get("status"), cls = sp.get("cls");
    const match = {};
    if (STATUSES.includes(status)) match.status = status;
    if (CLASSES.includes(cls)) match.classApplied = cls;
    if (q) {
      const r = new RegExp(esc(q), "i");
      match.$or = [{ studentName: r }, { parentName: r }, { phone: r }, { email: r }, { applicationNo: r }];
    }
    await db();
    const [out] = await Application.aggregate([
      { $match: match },
      { $facet: {
        rows: [{ $sort: { createdAt: -1 } }, { $skip: (page - 1) * limit }, { $limit: limit }, { $project: { __v: 0 } }],
        total: [{ $count: "n" }],
      } },
    ]);
    const total = out.total[0]?.n || 0;
    return NextResponse.json({ rows: out.rows, total, page, pages: Math.max(1, Math.ceil(total / limit)) });
  } catch (e) {
    console.error("GET /api/applications", e);
    return fail("Could not load applications.", 500);
  }
}
