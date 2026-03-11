import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

export default async function AnalyticsPage() {

  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/auth")
  }

  const totalProducts = await db.product.count({
    where: {
      user: {
        email: session.user.email,
      },
    },
  })

  const totalOrders = await db.order.count({
    where: {
      user: {
        email: session.user.email,
      },
    },
  })

  return (
    <div className="space-y-8">

      <h1 className="text-2xl font-bold">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
          <p className="text-sm text-zinc-400">Total Products</p>
          <p className="text-3xl font-bold">{totalProducts}</p>
        </div>

        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
          <p className="text-sm text-zinc-400">Total Orders</p>
          <p className="text-3xl font-bold">{totalOrders}</p>
        </div>

        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
          <p className="text-sm text-zinc-400">Revenue</p>
          <p className="text-3xl font-bold">₹ 0</p>
        </div>

      </div>

    </div>
  )
}