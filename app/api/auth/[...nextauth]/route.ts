import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "@/lib/db"
import { compare } from "bcryptjs"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {

        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user) {
          return null
        }

        const isValid = await compare(
          credentials.password,
          user.password
        )

        if (!isValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],

  session: {
    strategy: "jwt" as const,
    maxAge: 60 * 60 * 24,
  },

  secret: process.env.NEXTAUTH_SECRET,

 callbacks: {

  async jwt({ token } : {token: string}) {
    return token
  },

  async session({ session } : {session: string}) {
    return session // ✅ NO DB CALL
  }
}
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }