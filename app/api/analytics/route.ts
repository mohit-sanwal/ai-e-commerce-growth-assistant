import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 })
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) {
    return new Response("User not found", { status: 404 })
  }

  // Total revenue
  const revenue = await db.order.aggregate({
    where: { userId: user.id },
    _sum: { totalPrice: true },
    _count: true
  })

  // Top selling product
  const topProduct = await db.order.groupBy({
    by: ["productId"],
    where: { userId: user.id },
    _sum: { quantity: true },
    orderBy: {
      _sum: { quantity: "desc" }
    },
    take: 1
  })

  // Low stock products
  const lowStockProducts = await db.product.findMany({
    where: {
      userId: user.id,
      stock: { lt: 5 }
    }
  })

  return Response.json({
    totalRevenue: revenue._sum.totalPrice || 0,
    totalOrders: revenue._count || 0,
    topProduct,
    lowStockProducts
  })
}