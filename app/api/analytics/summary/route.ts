// app/api/analytics/summary/route.ts
// app/api/analytics/summary/route.ts

import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const revenueData = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      _count: { id: true },
    })

    const totalRevenue = revenueData._sum.totalAmount ?? 0
    const totalOrders = revenueData._count.id ?? 0

    const averageOrderValue =
      totalOrders > 0 ? totalRevenue / totalOrders : 0

    const now = new Date()
    const startOfThisWeek = new Date()
    startOfThisWeek.setDate(now.getDate() - 7)

    const startOfLastWeek = new Date()
    startOfLastWeek.setDate(now.getDate() - 14)

    const revenueThisWeek = await prisma.order.aggregate({
      where: { createdAt: { gte: startOfThisWeek } },
      _sum: { totalAmount: true },
    })

    const revenueLastWeek = await prisma.order.aggregate({
      where: {
        createdAt: {
          gte: startOfLastWeek,
          lt: startOfThisWeek,
        },
      },
      _sum: { totalAmount: true },
    })

    const thisWeek = revenueThisWeek._sum.totalAmount ?? 0
    const lastWeek = revenueLastWeek._sum.totalAmount ?? 0

    const revenueGrowth =
      lastWeek > 0
        ? ((thisWeek - lastWeek) / lastWeek) * 100
        : 0

    const topProducts = await prisma.order.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    })

    const productIds = topProducts.map(p => p.productId)

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    })

    const lowStockProducts = await prisma.product.findMany({
      where: { stock: { lt: 5 } },
    })

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      averageOrderValue,
      revenueThisWeek: thisWeek,
      revenueLastWeek: lastWeek,
      revenueGrowth,
      topProducts,
      lowStockProducts,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Server Error" }, { status: 500 })
  }
}