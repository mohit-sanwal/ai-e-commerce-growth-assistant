import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

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

  const product = await db.product.create({
    data: {
      name: body.name,
      price: body.price,
      category: body.category,
      stock: body.stock,
      userId: user.id,
    }
  })

  return Response.json(product)
}

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

  const products = await db.product.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" }
  })

  return Response.json(products)
}