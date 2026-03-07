import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import RevenueChart from "@/components/RevenueChart"

async function getInsights() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/ai-insights`,
    { cache: "no-store" }
  )

  if (!res.ok) throw new Error("Failed to fetch insights")

  return res.json()
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth")
  }

  const data = await getInsights()
  console.log("data.revenueTrend..", data.revenueTrend);

  return (
    <div className="p-6 space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-zinc-400 text-sm">
          AI-powered insights for your store
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition">
          <p className="text-sm text-zinc-400">Total Revenue</p>
          <p className="text-3xl font-bold mt-2">
            ₹{data.totalRevenue}
          </p>
        </div>

        <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition">
          <p className="text-sm text-zinc-400">Total Orders</p>
          <p className="text-3xl font-bold mt-2">
            {data.totalOrders}
          </p>
        </div>

        <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition">
          <p className="text-sm text-zinc-400">Revenue Growth</p>
          <p className="text-3xl font-bold mt-2 text-green-400">
            {data.revenueGrowth}%
          </p>
        </div>
      </div>

      {/* AI Insights Panel */}
      <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">
          🤖 AI Growth Insights
        </h2>

        <div className="space-y-3">
          {data.insights.map((insight: string, index: number) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 bg-zinc-800 border border-zinc-700 rounded-lg"
            >
              <span className="text-yellow-400">⚡</span>
              <p className="text-sm text-zinc-200">
                {insight}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Revenue Chart */}
      <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">
          Revenue Trend (Last 7 Days)
        </h2>

        <RevenueChart data={data.revenueTrend || []} />
      </div>
    </div>
  )
}