import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// POST
export async function POST(req: Request) {
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

  const body = await req.json()
  const { productId, quantity } = body

  const product = await db.product.findUnique({
    where: { id: productId }
  })

  if (!product) {
    return new Response("Product not found", { status: 404 })
  }

  if (product.stock < quantity) {
    return new Response("Insufficient stock", { status: 400 })
  }

  const totalPrice = Number(product.price) * quantity

  const order = await db.order.create({
    data: {
      quantity,
      totalPrice,
      productId: product.id,
      userId: user.id,
    }
  })

  await db.product.update({
    where: { id: product.id },
    data: {
      stock: product.stock - quantity
    }
  })

  return Response.json(order)
}


// GET
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

  const orders = await db.order.findMany({
    where: { userId: user.id },
    include: {
      product: true
    },
    orderBy: { createdAt: "desc" }
  })

  return Response.json(orders)
}