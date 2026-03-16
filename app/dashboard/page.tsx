import RevenueChartClient from "@/components/RevenueChartClient"
import {getCurrentUser} from "@/lib/getCurrentUser"

async function getInsights() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/ai-insights`,
    { cache: "no-store" }
  )

  if (!res.ok) throw new Error("Failed to fetch insights")

  return res.json()
}

export default async function Dashboard() {
  const user = await getCurrentUser();

  const data = await getInsights()
  console.log("data.revenueTrend..", data.revenueTrend);

  return (
  <div className="p-8 space-y-8">

    {/* Header */}
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-zinc-400 text-sm">
        AI-powered insights for your store
      </p>
    </div>

    {/* Dashboard Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* KPI Cards */}
      <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl shadow hover:border-zinc-700 transition">
        <h2 className="text-lg font-semibold mb-4">Store Overview</h2>

        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-zinc-800 rounded-lg">
            <p className="text-xs text-zinc-400">Revenue</p>
            <p className="text-xl font-bold">₹{data.totalRevenue}</p>
          </div>

          <div className="p-4 bg-zinc-800 rounded-lg">
            <p className="text-xs text-zinc-400">Orders</p>
            <p className="text-xl font-bold">{data.totalOrders}</p>
          </div>

          <div className="p-4 bg-zinc-800 rounded-lg">
            <p className="text-xs text-zinc-400">Growth</p>
            <p className="text-xl font-bold text-green-400">
              {data.revenueGrowth}%
            </p>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
        <h2 className="text-lg font-semibold mb-4">
          Revenue Trend
        </h2>

        <RevenueChartClient data={data.revenueTrend || []} />
      </div>

      {/* AI Insights */}
      <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
        <h2 className="text-lg font-semibold mb-4">
          🤖 AI Growth Insights
        </h2>

        <div className="space-y-3">
          {data.insights.map((insight: string, index: number) => (
            <div
              key={index}
              className="p-3 bg-zinc-800 rounded-lg text-sm"
            >
              {insight}
            </div>
          ))}
        </div>
      </div>

      {/* Placeholder for Future Widget */}
      <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
        <h2 className="text-lg font-semibold mb-4">
          Top Products (Coming Soon)
        </h2>

        <p className="text-zinc-400 text-sm">
          Product analytics will appear here.
        </p>
      </div>

    </div>
  </div>
)
}