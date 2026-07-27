import { redirect } from "next/navigation"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import AdminDashboard from "./sections-dashboard"

export const dynamic = "force-dynamic"

export default function AdminPage() {
  if (!isAdminAuthenticated()) {
    redirect("/login")
  }

  return <AdminDashboard />
}
