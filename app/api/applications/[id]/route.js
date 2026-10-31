import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { db } from "@/lib/db";
import Application from "@/models/Application";
import { isAdmin } from "@/lib/guard";
import { STATUSES } from "@/lib/constants";
const res = (error, status) => NextResponse.json({ error }, { status });
async function guard(params) {
  if (!(await isAdmin())) return { r: res("Unauthorized", 401) };
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return { r: res("Invalid id", 400) };
  return { id };
}
export async function PATCH(req, { params }) {
  try {
    const g = await guard(params); if (g.r) return g.r;
    const { status } = (await req.json().catch(() => ({}))) || {};
    if (!STATUSES.includes(status)) return res("Invalid status", 422);
    await db();
    const doc = await Application.findByIdAndUpdate(g.id, { status }, { new: true }).lean();
    return doc ? NextResponse.json({ ok: true }) : res("Not found", 404);
  } catch (e) { console.error(e); return res("Update failed", 500); }
}
export async function DELETE(_req, { params }) {
  try {
    const g = await guard(params); if (g.r) return g.r;
    await db();
    const doc = await Application.findByIdAndDelete(g.id).lean();
    return doc ? NextResponse.json({ ok: true }) : res("Not found", 404);
  } catch (e) { console.error(e); return res("Delete failed", 500); }
}
