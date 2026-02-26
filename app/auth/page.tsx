"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const router = useRouter()

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)

    const data = {
      name: form.get("name"),
      email: form.get("email"),
      password: form.get("password"),
    }

    if (!isLogin) {
      await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(data),
      })
    }

    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (!res?.error) {
      router.push("/dashboard")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          AI Growth Assistant
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              name="name"
              placeholder="Name"
              className="w-full p-3 border rounded-lg"
              required
            />
          )}

          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg"
            required
          />

          <button className="w-full bg-black text-white p-3 rounded-lg">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p
          onClick={() => setIsLogin(!isLogin)}
          className="mt-4 text-sm text-center cursor-pointer text-gray-600"
        >
          {isLogin
            ? "Don't have an account? Sign up"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  )
}