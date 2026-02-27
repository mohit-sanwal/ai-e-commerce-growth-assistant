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
        console.log("CREDENTIALS:", credentials);
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          return null
        }
       

        const user = await db.user.findUnique({
          where: { email: credentials.email }
        })
        console.log("DB USER:", user)

        if (!user){
          console.log("User not found");
          return null
        }

        const isValid = await compare(
          credentials.password,
          user.password
        )

        console.log("PASSWORD MATCH:", isValid);

        if (!isValid) {
          console.log("Invalid password")
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
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }