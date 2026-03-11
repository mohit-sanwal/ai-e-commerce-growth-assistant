"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function AuthPageClient() {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)

    const form = new FormData(e.currentTarget)

    const data = {
      name: form.get("name"),
      email: form.get("email"),
      password: form.get("password"),
    }

    // REGISTER
    if (!isLogin) {
      const registerRes = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!registerRes.ok) {
        alert("Registration failed")
        setLoading(false)
        return
      }
    }

    // LOGIN
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    setLoading(false)

    if (!res?.error) {
      router.push("/dashboard")
    } else {
      alert("Invalid credentials")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black p-4">

      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl p-8">

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            AI Growth Assistant
          </h2>

          <p className="text-sm text-zinc-400 mt-1">
            {isLogin
              ? "Login to access your dashboard"
              : "Create your account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {!isLogin && (
            <input
              name="name"
              placeholder="Name"
              required
              className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:border-green-500 outline-none"
            />
          )}

          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:border-green-500 outline-none"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:border-green-500 outline-none"
          />

          <button
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 transition p-3 rounded-lg font-semibold text-white"
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Login"
              : "Create Account"}
          </button>

        </form>

        <p
          onClick={() => setIsLogin(!isLogin)}
          className="mt-6 text-sm text-center text-zinc-400 cursor-pointer hover:text-white"
        >
          {isLogin
            ? "Don't have an account? Sign up"
            : "Already have an account? Login"}
        </p>

      </div>

    </div>
  )
}