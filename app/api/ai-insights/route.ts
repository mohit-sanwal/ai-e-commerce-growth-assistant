import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const insights: string[] = []

    // 📅 Date Ranges
    const now = new Date()

    const startOfThisWeek = new Date()
    startOfThisWeek.setDate(now.getDate() - 7)

    const startOfLastWeek = new Date()
    startOfLastWeek.setDate(now.getDate() - 14)

    // 🚀 Run independent queries in parallel
    const [
      revenueData,
      revenueThisWeek,
      revenueLastWeek,
      weeklySales,
      lowStockProducts,
      revenueTrendRaw,
    ] = await Promise.all([
      prisma.order.aggregate({
        _sum: { totalPrice: true },
        _count: { id: true },
      }),

      prisma.order.aggregate({
        where: { createdAt: { gte: startOfThisWeek } },
        _sum: { totalPrice: true },
      }),

      prisma.order.aggregate({
        where: {
          createdAt: {
            gte: startOfLastWeek,
            lt: startOfThisWeek,
          },
        },
        _sum: { totalPrice: true },
      }),

      prisma.order.groupBy({
        by: ["productId"],
        where: { createdAt: { gte: startOfThisWeek } },
        _sum: { quantity: true },
      }),

      prisma.product.findMany({
        where: { stock: { lt: 5 } },
      }),

      // 📈 Revenue trend raw data (last 7 days)
      prisma.order.findMany({
        // where: {
        //   createdAt: { gte: startOfThisWeek },
        // },
        select: {
          createdAt: true,
          totalPrice: true,
        },
      }),
    ])

    // 📊 Revenue Metrics
    const totalRevenue = Number(revenueData._sum.totalPrice ?? 0)
    const totalOrders = revenueData._count.id ?? 0

    const thisWeekRevenue = Number(revenueThisWeek._sum.totalPrice ?? 0)
    const lastWeekRevenue = Number(revenueLastWeek._sum.totalPrice ?? 0)

    const revenueGrowth =
      lastWeekRevenue > 0
        ? ((thisWeekRevenue - lastWeekRevenue) / lastWeekRevenue) * 100
        : 0

    // 📈 Revenue Trend (last 7 days)
    const revenueMap: Record<string, number> = {}

    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(now.getDate() - i)

      const day = d.toLocaleDateString("en-US", { weekday: "short" })
      revenueMap[day] = 0
    }

    for (const order of revenueTrendRaw) {
      const day = new Date(order.createdAt).toLocaleDateString("en-US", {
        weekday: "short",
      })

      revenueMap[day] += Number(order.totalPrice)
    }

    const revenueTrend = Object.entries(revenueMap).map(([day, revenue]) => ({
      day,
      revenue,
    }))

    // 📉 Revenue Trend Insights
    if (revenueGrowth < -10) {
      insights.push(
        `⚠ Revenue dropped ${Math.abs(
          revenueGrowth
        ).toFixed(1)}% compared to last week. Consider promotions or ads.`
      )
    } else if (revenueGrowth > 15) {
      insights.push(
        `🚀 Revenue increased ${revenueGrowth.toFixed(
          1
        )}% this week. Strong growth momentum detected.`
      )
    }

    // 📦 Low Stock Alert
    if (lowStockProducts.length > 0) {
      insights.push(
        `📦 ${lowStockProducts.length} products are low on stock. Restock soon to avoid revenue loss.`
      )
    }

    // 🔮 Stock-Out Prediction (Sales Velocity)
    if (weeklySales.length > 0) {
      const productIds = weeklySales.map((p) => p.productId)

      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
      })

      for (const sale of weeklySales) {
        const product = products.find((p) => p.id === sale.productId)
        if (!product) continue

        const weeklyQty = sale._sum.quantity ?? 0
        const avgDailySales = weeklyQty / 7

        if (avgDailySales === 0) continue

        const daysLeft = product.stock / avgDailySales

        if (daysLeft < 3) {
          insights.push(
            `🚨 ${product.name} may run out of stock in ${daysLeft.toFixed(
              1
            )} days. Immediate restock recommended.`
          )
        } else if (daysLeft < 7) {
          insights.push(
            `⚠ ${product.name} could go out of stock in ${daysLeft.toFixed(
              1
            )} days. Plan restocking.`
          )
        }
      }
    }

    // ✅ Stable fallback
    if (insights.length === 0) {
      insights.push("✅ Your store is stable. No major risks detected.")
    }

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      revenueGrowth: Number(revenueGrowth.toFixed(2)),
      insights,
      revenueTrend,
    })
  } catch (error) {
    console.error("AI Insights Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}