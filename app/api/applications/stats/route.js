import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import Application from "@/models/Application";
import { isAdmin } from "@/lib/guard";
export async function GET() {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await db();
    const since = new Date(); since.setUTCHours(0, 0, 0, 0); since.setUTCDate(since.getUTCDate() - 6);
    const [o] = await Application.aggregate([{ $facet: {
      total: [{ $count: "n" }],
      byStatus: [{ $group: { _id: "$status", n: { $sum: 1 } } }],
      byClass: [{ $group: { _id: "$classApplied", n: { $sum: 1 } } }, { $sort: { n: -1 } }],
      daily: [
        { $match: { createdAt: { $gte: since } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, n: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ],
    } }]);
    return NextResponse.json({
      total: o.total[0]?.n || 0,
      byStatus: Object.fromEntries(o.byStatus.map((x) => [x._id, x.n])),
      byClass: o.byClass, daily: o.daily,
    });
  } catch (e) {
    console.error("GET stats", e);
    return NextResponse.json({ error: "Could not load stats." }, { status: 500 });
  }
}
