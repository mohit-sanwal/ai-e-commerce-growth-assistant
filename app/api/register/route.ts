import { db } from "@/lib/db"
import { hash } from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json()

    if (!email || !password) {
      return new Response("Missing fields", { status: 400 })
    }

    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return new Response("User already exists", { status: 400 })
    }

    const hashedPassword = await hash(password, 10)

    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      }
    })

    return new Response("User created successfully", { status: 201 })

  } catch (error) {
    console.error("REGISTER ERROR:", error)
    return new Response("Something went wrong", { status: 500 })
  }
}