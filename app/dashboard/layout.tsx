"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const pathname = usePathname()

  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Products", href: "/dashboard/products" },
    { name: "Orders", href: "/dashboard/orders" },
    { name: "Analytics", href: "/dashboard/analytics" },
  ]

  return (
    <div className="flex h-screen bg-zinc-950 text-white">

      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 p-6">

        <h1 className="text-xl font-bold mb-8">
          AI Commerce
        </h1>

        <nav className="space-y-4 text-sm">

          {navItems.map((item) => {

            const active = pathname === item.href

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`block transition
                ${
                  active
                    ? "text-green-400 font-semibold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            )

          })}

        </nav>

      </aside>

      {/* Main Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>

    </div>
  )
}