import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials: any) {
        const user = await db.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) throw new Error("No user found")

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isValid) throw new Error("Invalid password")

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }