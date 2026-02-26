import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validated = schema.parse(body)

    const existingUser = await db.user.findUnique({
      where: { email: validated.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(validated.password, 10)

    const user = await db.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password: hashedPassword,
      },
    })

    // 🔥 Auto-create organization
    await db.organization.create({
      data: {
        name: `${validated.name}'s Store`,
        ownerId: user.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}