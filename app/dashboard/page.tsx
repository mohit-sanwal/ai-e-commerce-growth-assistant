import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"


async function getInsights() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/ai-insights`,
    { cache: "no-store" } // always fresh
  )

  if (!res.ok) throw new Error("Failed to fetch insights")

  return res.json()
}

export default async function Dashboard() {
  const data = await getInsights()
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth")
  }

  return (
    <div className="p-6 space-y-6">

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-zinc-800 rounded-xl">
          <h2>Total Revenue</h2>
          <p className="text-2xl font-bold">₹{data.totalRevenue}</p>
        </div>

        <div className="p-4 bg-zinc-800 rounded-xl">
          <h2>Total Orders</h2>
          <p className="text-2xl font-bold">{data.totalOrders}</p>
        </div>

        <div className="p-4 bg-zinc-800 rounded-xl">
          <h2>Revenue Growth</h2>
          <p className="text-2xl font-bold">
            {data.revenueGrowth}%
          </p>
        </div>
      </div>

      {/* AI Insights Panel */}
      <div className="p-6 bg-zinc-900 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">
          🤖 AI Growth Insights
        </h2>

        <ul className="space-y-3">
          {data.insights.map((insight: string, index: number) => (
            <li
              key={index}
              className="p-3 bg-zinc-800 rounded-lg"
            >
              {insight}
            </li>
          ))}
        </ul>
      </div>

    </div>
  )
}