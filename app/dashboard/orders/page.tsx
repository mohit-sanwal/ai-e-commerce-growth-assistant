import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

export default async function OrdersPage() {

  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/auth")
  }

  const orders = await db.order.findMany({
  where: {
    user: {
      email: session.user.email,
    },
  },
  include: {
    product: true,
  },
  orderBy: {
    createdAt: "desc",
  },
})

const formattedOrders = orders.map(order => ({
  ...order,
  totalPrice: Number(order.totalPrice),
  productPrice: Number(order.product.price)
}))

  console.log("orders", orders);

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">Orders</h1>

      {formattedOrders.length === 0 ? (
        <p className="text-zinc-400">No orders yet.</p>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">

          <table className="w-full text-sm">

            <thead className="bg-zinc-800">
              <tr>
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>

            <tbody>

              {formattedOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-zinc-800 hover:bg-zinc-800"
                >
                  <td className="p-3">{order.id}</td>
                  <td className="p-3">{order.product.name}</td>
                  <td className="p-3">₹ {order.product.price.toString()}</td>
                  <td className="p-3 text-green-400">{order.status}</td>
                  <td className="p-3">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}

            </tbody>

          </table>

        </div>
      )}
    </div>
  )
}