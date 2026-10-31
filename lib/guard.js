import { auth } from "@/auth";
export async function isAdmin() {
  const s = await auth();
  return s?.user?.role === "admin";
}
