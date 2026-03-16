import { redirect } from "next/navigation"
import AuthPageClient from "@/components/AuthPageClient"
import { requireAuth } from "@/lib/requireAuth";

export default async function AuthPage() {
  const session = await requireAuth();
  if (session?.user?.email) {
    redirect("/dashboard")
  }

  return <AuthPageClient />
}