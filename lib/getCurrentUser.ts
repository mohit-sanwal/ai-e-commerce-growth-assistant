import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

export async function getCurrentUser() {

  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/auth")
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email }
  })

  console.log('user: getCurrentUser', user)
  if (!user) {
    redirect("/auth")
  }

  return user
}