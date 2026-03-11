import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import AddProductForm from "./AddProductForm"

export default async function ProductsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/auth")
  }

  const products = await db.product.findMany({
    where: {
      user: {
        email: session.user.email,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="p-8 space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Products</h1>
        <p className="text-zinc-400 text-sm">
          Manage your store inventory
        </p>
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Add Product Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">
            Add Product
          </h2>

          <AddProductForm />
        </div>

        {/* Product List */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">

  <h2 className="text-lg font-semibold mb-4">
    Product Inventory
  </h2>

  {products.length === 0 ? (
    <p className="text-zinc-400 text-sm">
      No products added yet.
    </p>
  ) : (

    <div className="overflow-y-auto max-h-[450px]">

      <table className="w-full text-sm">

        <thead className="text-zinc-400 border-b border-zinc-800 sticky top-0 bg-zinc-900">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-left">Price</th>
            <th className="p-3 text-left">Stock</th>
            <th className="p-3 text-left">Created</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-b border-zinc-800 hover:bg-zinc-800/40 transition"
            >
              <td className="p-3">{product.name}</td>
              <td className="p-3 text-zinc-400">{product.category}</td>
              <td className="p-3">₹{product.price.toString()}</td>
              <td className="p-3">{product.stock}</td>
              <td className="p-3 text-zinc-400">
                {new Date(product.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  )}

</div>

      </div>

    </div>
  )
}