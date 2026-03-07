export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-zinc-950 text-white">
      
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 p-6">
        <h1 className="text-xl font-bold mb-8">
          AI Commerce
        </h1>

        <nav className="space-y-4 text-sm">
          <p className="text-zinc-400">Dashboard</p>
          <p className="text-zinc-400">Products</p>
          <p className="text-zinc-400">Orders</p>
          <p className="text-zinc-400">Analytics</p>
        </nav>
      </aside>

      {/* Main Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>

    </div>
  )
}