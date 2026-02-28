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

  const { productId, quantity } = await req.json()

  try {
    const result = await db.$transaction(async (tx) => {

      // 1️⃣ Atomically decrement stock ONLY if available
      const stockUpdate = await tx.product.updateMany({
        where: {
          id: productId,
          stock: { gte: quantity }
        },
        data: {
          stock: {
            decrement: quantity
          }
        }
      })

      // If no rows updated → insufficient stock
      if (stockUpdate.count === 0) {
        throw new Error("Insufficient stock")
      }

      // 2️⃣ Fetch product price (after stock confirmed)
      const product = await tx.product.findUnique({
        where: { id: productId }
      })

      if (!product) {
        throw new Error("Product not found")
      }

      // 3️⃣ Create order
      const order = await tx.order.create({
        data: {
          quantity,
          totalPrice: Number(product.price) * quantity,
          userId: user.id,
          productId: product.id
        }
      })

      return order
    })

    return Response.json(result)

  } catch (error: any) {
    return new Response(error.message, { status: 400 })
  }
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