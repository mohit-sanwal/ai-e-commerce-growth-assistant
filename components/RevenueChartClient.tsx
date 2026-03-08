"use client"

import RevenueChart from "./RevenueChart"

interface Props {
  data: {
    day: string
    revenue: number
  }[]
}

export default function RevenueChartClient({ data }: Props) {
  return <RevenueChart data={data} />
}