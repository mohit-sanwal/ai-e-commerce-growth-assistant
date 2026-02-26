import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth")
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">
        Welcome, {session.user?.name}
      </h1>
    </div>
  )
}