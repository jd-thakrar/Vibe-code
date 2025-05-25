"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingDown, Clock, Star, Phone } from "lucide-react"

interface DashboardStatsProps {
  callsCompleted: number
  dealsFound: any[]
  isActive: boolean
}

export function DashboardStats({ callsCompleted, dealsFound, isActive }: DashboardStatsProps) {
  const bestPrice = dealsFound.length > 0 ? Math.min(...dealsFound.map((d) => d.price)) : 0
  const avgPrice =
    dealsFound.length > 0 ? Math.round(dealsFound.reduce((sum, d) => sum + d.price, 0) / dealsFound.length) : 0
  const fastestDelivery =
    dealsFound.length > 0
      ? dealsFound.reduce((fastest, deal) => {
          const days = Number.parseInt(deal.delivery.match(/\d+/)?.[0] || "999")
          const fastestDays = Number.parseInt(fastest.match(/\d+/)?.[0] || "999")
          return days < fastestDays ? deal.delivery : fastest
        }, dealsFound[0].delivery)
      : "--"

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Calls Made</p>
              <p className="text-2xl font-bold text-blue-900">{callsCompleted}/5</p>
            </div>
            <Phone className={`w-8 h-8 text-blue-500 ${isActive ? "animate-pulse" : ""}`} />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Best Price</p>
              <p className="text-2xl font-bold text-green-900">{bestPrice > 0 ? `$${bestPrice}` : "--"}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Avg Price</p>
              <p className="text-2xl font-bold text-purple-900">{avgPrice > 0 ? `$${avgPrice}` : "--"}</p>
            </div>
            <Star className="w-8 h-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Fastest</p>
              <p className="text-2xl font-bold text-orange-900">{fastestDelivery}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
