"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AddProductForm() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [stock, setStock] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        price: Number(price),
        category,
        stock: Number(stock),
      }),
    })

    setLoading(false)
    setName("")
    setPrice("")
    setCategory("")
    setStock("")

    router.refresh() // refresh server component
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow p-6 rounded-lg mb-8 space-y-4"
    >
      <h2 className="text-lg font-semibold">Add Product</h2>

      <input
        className="w-full border p-2 rounded"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        type="number"
        step="0.01"
        className="w-full border p-2 rounded"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />

      <input
        className="w-full border p-2 rounded"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      />

      <input
        type="number"
        className="w-full border p-2 rounded"
        placeholder="Stock"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
      >
        {loading ? "Adding..." : "Add Product"}
      </button>
    </form>
  )
}