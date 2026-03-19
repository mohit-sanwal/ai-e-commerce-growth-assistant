"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast";

export default function CreateOrderButton({ productId }: { productId: string }) {

  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function createOrder() {
    try {
      setLoading(true)

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      })

      if (!res.ok) {
        toast.error("Failed to create order");
        return
      }
      toast.success("Order placed successfully 🎉");

      router.refresh() // refresh server data
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={createOrder}
      disabled={loading}
      className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
    >
      {loading ? "Creating..." : "Create Order"}
    </button>
  )
}