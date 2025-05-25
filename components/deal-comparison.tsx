"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, DollarSign, Truck, Shield, Trophy } from "lucide-react"

interface Deal {
  reseller: string
  price: number
  delivery: string
  condition: string
  verified: boolean
  score: number
}

interface DealComparisonProps {
  deals: Deal[]
}

export function DealComparison({ deals }: DealComparisonProps) {
  if (deals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Deal Comparison</CardTitle>
          <CardDescription>No deals found yet. Start the voice agent to begin searching.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">Deals will appear here as the voice agent completes calls</p>
        </CardContent>
      </Card>
    )
  }

  // Sort deals by score (highest first)
  const sortedDeals = [...deals].sort((a, b) => b.score - a.score)
  const topThreeDeals = sortedDeals.slice(0, 3)

  const getBadgeVariant = (index: number) => {
    switch (index) {
      case 0:
        return "default" // Gold/Best
      case 1:
        return "secondary" // Silver
      case 2:
        return "outline" // Bronze
      default:
        return "outline"
    }
  }

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-4 h-4 text-yellow-600" />
      case 1:
        return <Star className="w-4 h-4 text-gray-600" />
      case 2:
        return <Star className="w-4 h-4 text-orange-600" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Deal Comparison Results</h2>
        <p className="text-gray-600">Found {deals.length} available deals. Here are the top 3 recommendations:</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topThreeDeals.map((deal, index) => (
          <Card key={deal.reseller} className={`relative ${index === 0 ? "ring-2 ring-yellow-400 shadow-lg" : ""}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {getRankIcon(index)}
                  {deal.reseller}
                </CardTitle>
                <Badge variant={getBadgeVariant(index)}>
                  {index === 0 ? "Best Deal" : index === 1 ? "2nd Best" : "3rd Best"}
                </Badge>
              </div>
              <CardDescription>Score: {deal.score}/100</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="font-medium">Price</span>
                </div>
                <span className="text-xl font-bold text-green-600">${deal.price}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">Delivery</span>
                </div>
                <span className="text-sm">{deal.delivery}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-600" />
                  <span className="font-medium">Condition</span>
                </div>
                <Badge variant="outline">{deal.condition}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium">Verified</span>
                <Badge variant={deal.verified ? "default" : "destructive"}>{deal.verified ? "Yes" : "No"}</Badge>
              </div>

              {index === 0 && (
                <Button className="w-full mt-4 bg-yellow-600 hover:bg-yellow-700">Choose This Deal</Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {deals.length > 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Other Available Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sortedDeals.slice(3).map((deal) => (
                <div key={deal.reseller} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <span className="font-medium">{deal.reseller}</span>
                    <Badge variant="outline">Score: {deal.score}</Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-green-600">${deal.price}</span>
                    <span className="text-sm text-gray-600">{deal.delivery}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
