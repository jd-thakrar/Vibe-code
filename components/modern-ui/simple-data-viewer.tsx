"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, FileText, Mail, Database, RefreshCw } from "lucide-react"

interface SimpleDataViewerProps {
  deals: any[]
  product: any
}

export function SimpleDataViewer({ deals, product }: SimpleDataViewerProps) {
  const [storedData, setStoredData] = useState<any>({ searches: [], emails: [], calls: [] })
  const [loading, setLoading] = useState(false)

  const fetchStoredData = async () => {
    setLoading(true)
    try {
      const [searchRes, emailRes, callRes] = await Promise.all([
        fetch("/api/simple-storage?type=search"),
        fetch("/api/simple-storage?type=email"),
        fetch("/api/simple-storage?type=call"),
      ])

      const [searches, emails, calls] = await Promise.all([searchRes.json(), emailRes.json(), callRes.json()])

      setStoredData({
        searches: searches.data || [],
        emails: emails.data || [],
        calls: calls.data || [],
      })
    } catch (error) {
      console.error("Error fetching stored data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStoredData()
  }, [])

  const saveSearchData = async () => {
    if (!product || deals.length === 0) return

    try {
      await fetch("/api/simple-storage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "search",
          payload: {
            product: product.name,
            category: product.category,
            deals_found: deals.length,
            best_price: Math.min(...deals.map((d) => d.price)),
            avg_price: Math.round(deals.reduce((sum, d) => sum + d.price, 0) / deals.length),
            deals: deals,
          },
        }),
      })

      await fetchStoredData()
    } catch (error) {
      console.error("Error saving search data:", error)
    }
  }

  const sendEmail = async () => {
    if (!product || deals.length === 0) return

    try {
      await fetch("/api/email-service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deals,
          product,
        }),
      })

      await fetchStoredData()
    } catch (error) {
      console.error("Error sending email:", error)
    }
  }

  const downloadCSV = () => {
    if (deals.length === 0) return

    const headers = ["Reseller", "Price", "Delivery", "Condition", "Score", "Verified"]
    const csvContent = [
      headers.join(","),
      ...deals.map((deal) =>
        [deal.reseller, `$${deal.price}`, deal.delivery, deal.condition, deal.score, deal.verified ? "Yes" : "No"].join(
          ",",
        ),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `deals_${product?.name?.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Simple Data Management</h2>
        <p className="text-gray-600">Free, easy data storage and email system - no complex APIs needed</p>
      </div>

      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="current">Current Search</TabsTrigger>
          <TabsTrigger value="history">Search History</TabsTrigger>
          <TabsTrigger value="emails">Email Reports</TabsTrigger>
          <TabsTrigger value="export">Export Data</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Current Search Data
              </CardTitle>
              <CardDescription>Save and manage your current search results</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {deals.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{deals.length}</div>
                      <div className="text-sm text-blue-800">Deals Found</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">${Math.min(...deals.map((d) => d.price))}</div>
                      <div className="text-sm text-green-800">Best Price</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        ${Math.round(deals.reduce((sum, d) => sum + d.price, 0) / deals.length)}
                      </div>
                      <div className="text-sm text-purple-800">Avg Price</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {deals.sort((a, b) => b.score - a.score)[0]?.reseller}
                      </div>
                      <div className="text-sm text-orange-800">Top Seller</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={saveSearchData} className="flex-1">
                      <Database className="w-4 h-4 mr-2" />
                      Save Search Data
                    </Button>
                    <Button onClick={sendEmail} variant="outline" className="flex-1">
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email Report
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No search data available. Complete a voice agent search first.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Search History
                </div>
                <Button onClick={fetchStoredData} variant="outline" size="sm" disabled={loading}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </CardTitle>
              <CardDescription>View all your previous searches</CardDescription>
            </CardHeader>
            <CardContent>
              {storedData.searches.length > 0 ? (
                <div className="space-y-3">
                  {storedData.searches.slice(0, 10).map((search: any) => (
                    <div key={search.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{search.product}</h4>
                        <Badge variant="outline">{search.category}</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Deals:</span> {search.deals_found}
                        </div>
                        <div>
                          <span className="font-medium">Best:</span> ${search.best_price}
                        </div>
                        <div>
                          <span className="font-medium">Avg:</span> ${search.avg_price}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">{new Date(search.timestamp).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No search history found</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emails" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Email Reports
              </CardTitle>
              <CardDescription>View sent email reports</CardDescription>
            </CardHeader>
            <CardContent>
              {storedData.emails.length > 0 ? (
                <div className="space-y-3">
                  {storedData.emails.slice(0, 10).map((email: any) => (
                    <div key={email.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{email.subject}</h4>
                        <Badge variant={email.status === "sent" ? "default" : "secondary"}>{email.status}</Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div>
                          <span className="font-medium">To:</span> {email.to}
                        </div>
                        <div>
                          <span className="font-medium">Deals:</span> {email.deals?.length || 0}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">{new Date(email.timestamp).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No email reports found</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Export Data
              </CardTitle>
              <CardDescription>Download your data in various formats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={downloadCSV} disabled={deals.length === 0} variant="outline" className="h-20">
                  <div className="text-center">
                    <Download className="w-6 h-6 mx-auto mb-1" />
                    <div className="font-medium">Download CSV</div>
                    <div className="text-xs text-gray-500">Current deals data</div>
                  </div>
                </Button>

                <Button
                  onClick={() => {
                    const data = JSON.stringify(storedData, null, 2)
                    const blob = new Blob([data], { type: "application/json" })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement("a")
                    a.href = url
                    a.download = `voice_agent_data_${new Date().toISOString().split("T")[0]}.json`
                    a.click()
                    URL.revokeObjectURL(url)
                  }}
                  variant="outline"
                  className="h-20"
                >
                  <div className="text-center">
                    <Download className="w-6 h-6 mx-auto mb-1" />
                    <div className="font-medium">Download JSON</div>
                    <div className="text-xs text-gray-500">All stored data</div>
                  </div>
                </Button>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Data Storage Info</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Data is stored locally in your project files</li>
                  <li>• No external databases or complex APIs required</li>
                  <li>• Easy to backup and migrate</li>
                  <li>• Completely free and under your control</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
