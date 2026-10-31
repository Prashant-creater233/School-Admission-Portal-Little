import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Dashboard from "@/components/Dashboard";
export const dynamic = "force-dynamic";
export default async function AdminPage() {
  const s = await auth();
  if (s?.user?.role !== "admin") redirect("/admin/login");
  return <Dashboard />;
}
