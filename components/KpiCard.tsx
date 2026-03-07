interface Props {
  title: string
  value: string | number
}

export default function KpiCard({ title, value }: Props) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
      <p className="text-sm text-zinc-400">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  )
}