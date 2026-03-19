import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import AuthPageClient from "@/components/AuthPageClient"

export default async function AuthPage() {

  const session = await getServerSession(authOptions)

  // ⚠️ Only session check here
  if (session?.user?.email) {
    redirect("/dashboard")
  }

  return <AuthPageClient />
}