import mongoose from "mongoose";
const cache = globalThis._mongo || (globalThis._mongo = { conn: null, p: null });
export async function db() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI missing in .env.local");
  if (/USERNAME:PASSWORD|CLUSTER\.mongodb/.test(process.env.MONGODB_URI)) throw new Error("MONGODB_URI is still the placeholder");
  if (cache.conn) return cache.conn;
  cache.p ||= mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000, maxPoolSize: 10 });
  try { cache.conn = await cache.p; } catch (e) { cache.p = null; throw e; }
  return cache.conn;
}
