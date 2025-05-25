"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Download, Send } from "lucide-react"

interface EmailPreviewProps {
  deals: any[]
  product: any
}

export function EmailPreview({ deals, product }: EmailPreviewProps) {
  if (!product || deals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email Report Preview
          </CardTitle>
          <CardDescription>Email report will be generated after deals are found</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">Complete the voice agent search to generate an email report</p>
        </CardContent>
      </Card>
    )
  }

  const topThreeDeals = [...deals].sort((a, b) => b.score - a.score).slice(0, 3)
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const emailContent = `
Subject: 🎯 Best Deals Found for ${product.name}

Dear Customer,

Great news! Our AI voice agent has completed its search and found the best deals for your requested item: ${product.name}.

After calling multiple resellers and comparing prices, delivery times, and conditions, here are the TOP 3 DEALS we recommend:

🥇 BEST DEAL - ${topThreeDeals[0]?.reseller}
💰 Price: $${topThreeDeals[0]?.price}
🚚 Delivery: ${topThreeDeals[0]?.delivery}
✅ Condition: ${topThreeDeals[0]?.condition}
🛡️ Verified: ${topThreeDeals[0]?.verified ? "Yes" : "No"}
⭐ Score: ${topThreeDeals[0]?.score}/100

${
  topThreeDeals[1]
    ? `🥈 SECOND BEST - ${topThreeDeals[1].reseller}
💰 Price: $${topThreeDeals[1].price}
🚚 Delivery: ${topThreeDeals[1].delivery}
✅ Condition: ${topThreeDeals[1].condition}
🛡️ Verified: ${topThreeDeals[1].verified ? "Yes" : "No"}
⭐ Score: ${topThreeDeals[1].score}/100`
    : ""
}

${
  topThreeDeals[2]
    ? `🥉 THIRD BEST - ${topThreeDeals[2].reseller}
💰 Price: $${topThreeDeals[2].price}
🚚 Delivery: ${topThreeDeals[2].delivery}
✅ Condition: ${topThreeDeals[2].condition}
🛡️ Verified: ${topThreeDeals[2].verified ? "Yes" : "No"}
⭐ Score: ${topThreeDeals[2].score}/100`
    : ""
}

💡 OUR RECOMMENDATION:
We recommend going with ${topThreeDeals[0]?.reseller} as they offer the best overall value considering price, delivery speed, condition, and verification status.

📊 SEARCH SUMMARY:
• Total resellers contacted: 5
• Deals found: ${deals.length}
• Best price found: $${Math.min(...deals.map((d) => d.price))}
• Fastest delivery: ${deals.reduce((fastest, deal) => {
    const days = Number.parseInt(deal.delivery.match(/\d+/)[0])
    const fastestDays = Number.parseInt(fastest.match(/\d+/)[0])
    return days < fastestDays ? deal.delivery : fastest
  }, deals[0].delivery)}

Ready to make your purchase? Contact ${topThreeDeals[0]?.reseller} directly or reply to this email for assistance.

Happy shopping!
DealFinder AI Team

---
This search was completed on ${currentDate}
Powered by OmniDimension Voice AI Technology
  `.trim()

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Email Report</h2>
        <p className="text-gray-600">Automated email report with the top 3 deals found</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email Preview
          </CardTitle>
          <CardDescription>This email will be automatically sent to the user</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-2 text-sm">
              <div>
                <strong>To:</strong> customer@example.com
              </div>
              <div>
                <strong>From:</strong> deals@dealfinder-ai.com
              </div>
              <div>
                <strong>Subject:</strong> 🎯 Best Deals Found for {product.name}
              </div>
              <div>
                <strong>Date:</strong> {currentDate}
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6 max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm font-mono">{emailContent}</pre>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1">
              <Send className="w-4 h-4 mr-2" />
              Send Email
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">${Math.min(...deals.map((d) => d.price))}</div>
                  <div className="text-sm text-gray-600">Best Price</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{deals.length}</div>
                  <div className="text-sm text-gray-600">Deals Found</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {deals.reduce((fastest, deal) => {
                      const days = Number.parseInt(deal.delivery.match(/\d+/)[0])
                      const fastestDays = Number.parseInt(fastest.match(/\d+/)[0])
                      return days < fastestDays ? deal.delivery : fastest
                    }, deals[0].delivery)}
                  </div>
                  <div className="text-sm text-gray-600">Fastest Delivery</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
