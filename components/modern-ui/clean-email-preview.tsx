"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Send, Download, Copy, Check } from "lucide-react"
import { useState } from "react"

interface CleanEmailPreviewProps {
  deals: any[]
  product: any
}

export function CleanEmailPreview({ deals, product }: CleanEmailPreviewProps) {
  const [emailSent, setEmailSent] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!product || deals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email Report
          </CardTitle>
          <CardDescription>Email report will be generated after deals are found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Mail className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Complete the voice agent search to generate an email report</p>
          </div>
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

  const sendEmail = async () => {
    try {
      await fetch("/api/email-service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deals: topThreeDeals,
          product,
        }),
      })
      setEmailSent(true)
      setTimeout(() => setEmailSent(false), 3000)
    } catch (error) {
      console.error("Error sending email:", error)
    }
  }

  const copyToClipboard = async () => {
    const emailContent = generateEmailContent()
    await navigator.clipboard.writeText(emailContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const generateEmailContent = () => {
    return `🎯 Best Deals Found for ${product.name}

Hi there!

Great news! I found the best deals for your requested item: ${product.name}

TOP 3 RECOMMENDATIONS:

🥇 BEST DEAL - ${topThreeDeals[0]?.reseller}
💰 Price: $${topThreeDeals[0]?.price}
🚚 Delivery: ${topThreeDeals[0]?.delivery}
✅ Condition: ${topThreeDeals[0]?.condition}
⭐ Score: ${topThreeDeals[0]?.score}/100

${
  topThreeDeals[1]
    ? `🥈 SECOND BEST - ${topThreeDeals[1].reseller}
💰 Price: $${topThreeDeals[1].price}
🚚 Delivery: ${topThreeDeals[1].delivery}
✅ Condition: ${topThreeDeals[1].condition}
⭐ Score: ${topThreeDeals[1].score}/100`
    : ""
}

${
  topThreeDeals[2]
    ? `🥉 THIRD BEST - ${topThreeDeals[2].reseller}
💰 Price: $${topThreeDeals[2].price}
🚚 Delivery: ${topThreeDeals[2].delivery}
✅ Condition: ${topThreeDeals[2].condition}
⭐ Score: ${topThreeDeals[2].score}/100`
    : ""
}

💡 MY RECOMMENDATION:
Go with ${topThreeDeals[0]?.reseller} - they offer the best overall value!

📊 SEARCH SUMMARY:
• Total resellers contacted: 5
• Deals found: ${deals.length}
• Best price: $${Math.min(...deals.map((d) => d.price))}
• Average price: $${Math.round(deals.reduce((sum, d) => sum + d.price, 0) / deals.length)}

Happy shopping!
DealFinder AI

---
Search completed on ${currentDate}
Powered by Voice AI Technology`
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Email Report</h2>
        <p className="text-gray-600">Professional email report with your top deals</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email Preview
          </CardTitle>
          <CardDescription>Ready to send email report with top 3 deals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Header */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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

          {/* Deal Cards */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Top 3 Deals Found:</h3>
            {topThreeDeals.map((deal, index) => (
              <Card key={deal.reseller} className={`${index === 0 ? "ring-2 ring-yellow-400 bg-yellow-50" : ""}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}</span>
                      <h4 className="font-semibold text-lg">{deal.reseller}</h4>
                    </div>
                    <Badge variant={index === 0 ? "default" : "secondary"}>
                      {index === 0 ? "Best Deal" : index === 1 ? "2nd Best" : "3rd Best"}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Price:</span>
                      <div className="font-bold text-green-600 text-lg">${deal.price}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Delivery:</span>
                      <div className="font-medium">{deal.delivery}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Condition:</span>
                      <div className="font-medium">{deal.condition}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Score:</span>
                      <div className="font-bold text-blue-600">{deal.score}/100</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-blue-600">{deals.length}</div>
              <div className="text-sm text-blue-800">Deals Found</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-xl font-bold text-green-600">${Math.min(...deals.map((d) => d.price))}</div>
              <div className="text-sm text-green-800">Best Price</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-xl font-bold text-purple-600">
                ${Math.round(deals.reduce((sum, d) => sum + d.price, 0) / deals.length)}
              </div>
              <div className="text-sm text-purple-800">Avg Price</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-xl font-bold text-orange-600">5</div>
              <div className="text-sm text-orange-800">Resellers</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={sendEmail} className="flex-1" disabled={emailSent}>
              {emailSent ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Email Sent!
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Email Report
                </>
              )}
            </Button>
            <Button onClick={copyToClipboard} variant="outline">
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
            <Button
              onClick={() => {
                const content = generateEmailContent()
                const blob = new Blob([content], { type: "text/plain" })
                const url = URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = url
                a.download = `deal_report_${product.name.replace(/\s+/g, "_")}.txt`
                a.click()
                URL.revokeObjectURL(url)
              }}
              variant="outline"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">✅ Simple Email System</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• No complex SMTP setup required</li>
              <li>• Works with any email service (Gmail, Outlook, etc.)</li>
              <li>• Copy & paste or download the report</li>
              <li>• All data stored locally for your privacy</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
