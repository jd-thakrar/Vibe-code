"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SnailIcon as Sneaker, Music, Trophy } from "lucide-react"

const products = [
  {
    id: "jordan-4-retro",
    name: 'Air Jordan 4 Retro "Black Cat"',
    category: "Sneakers",
    icon: Sneaker,
    estimatedPrice: "$200-400",
    demand: "Very High",
    description: "Limited edition Jordan 4 retro release",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "taylor-swift-eras",
    name: "Taylor Swift Eras Tour",
    category: "Concert Tickets",
    icon: Music,
    estimatedPrice: "$150-800",
    demand: "Extremely High",
    description: "Front row tickets for the Eras Tour",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "world-cup-final",
    name: "FIFA World Cup Final",
    category: "Sports Tickets",
    icon: Trophy,
    estimatedPrice: "$500-2000",
    demand: "Ultra High",
    description: "Premium seats for the World Cup Final",
    image: "/placeholder.svg?height=200&width=200",
  },
]

interface ProductSelectorProps {
  onProductSelect: (product: any) => void
  selectedProduct: any
}

export function ProductSelector({ onProductSelect, selectedProduct }: ProductSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Select a High-Demand Product</h2>
        <p className="text-gray-600">Choose what you want to find the best deal for</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => {
          const Icon = product.icon
          const isSelected = selectedProduct?.id === product.id

          return (
            <Card
              key={product.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""
              }`}
              onClick={() => onProductSelect(product)}
            >
              <CardHeader className="text-center">
                <Icon className="w-12 h-12 mx-auto mb-2 text-blue-600" />
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Category:</span>
                  <Badge variant="secondary">{product.category}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Price Range:</span>
                  <span className="text-sm font-bold text-green-600">{product.estimatedPrice}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Demand:</span>
                  <Badge variant={product.demand === "Ultra High" ? "destructive" : "default"}>{product.demand}</Badge>
                </div>
                {isSelected && (
                  <div className="pt-2">
                    <Badge className="w-full justify-center bg-blue-600">Selected</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {selectedProduct && (
        <div className="text-center">
          <p className="text-green-600 font-medium">✓ Selected: {selectedProduct.name}</p>
          <p className="text-sm text-gray-600 mt-1">Ready to start the voice agent search</p>
        </div>
      )}
    </div>
  )
}
