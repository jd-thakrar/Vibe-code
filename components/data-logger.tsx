"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileSpreadsheet, Database, Download, ExternalLink } from "lucide-react"

interface DataLoggerProps {
  deals: any[]
  product: any
}

export function DataLogger({ deals, product }: DataLoggerProps) {
  if (!product) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Data Logging
          </CardTitle>
          <CardDescription>Data will be logged after the search is completed</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">Complete the voice agent search to see logged data</p>
        </CardContent>
      </Card>
    )
  }

  const currentDate = new Date().toISOString().split("T")[0]
  const currentTime = new Date().toLocaleTimeString()

  // Simulate Google Sheets data structure
  const sheetsData = [
    ["Timestamp", "Product", "Reseller", "Price", "Delivery", "Condition", "Verified", "Score", "Available"],
    ...deals.map((deal) => [
      `${currentDate} ${currentTime}`,
      product.name,
      deal.reseller,
      `$${deal.price}`,
      deal.delivery,
      deal.condition,
      deal.verified ? "Yes" : "No",
      deal.score,
      "Yes",
    ]),
    // Add unavailable reseller
    [`${currentDate} ${currentTime}`, product.name, "Sole Supremacy", "N/A", "N/A", "N/A", "N/A", "N/A", "No"],
  ]

  // Simulate CRM data structure
  const crmData = {
    searchId: `SEARCH_${Date.now()}`,
    productSearched: product.name,
    category: product.category,
    totalResellersContacted: 5,
    dealsFound: deals.length,
    bestPrice: Math.min(...deals.map((d) => d.price)),
    averagePrice: Math.round(deals.reduce((sum, d) => sum + d.price, 0) / deals.length),
    searchDate: currentDate,
    searchTime: currentTime,
    topRecommendation: deals.sort((a, b) => b.score - a.score)[0]?.reseller || "N/A",
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Data Logging & CRM Integration</h2>
        <p className="text-gray-600">All search data is automatically logged to Google Sheets and CRM systems</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Google Sheets Integration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-green-600" />
              Google Sheets Log
            </CardTitle>
            <CardDescription>Detailed call data logged to Google Sheets via API</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium text-green-800">Connected to Google Sheets</span>
              </div>
              <div className="text-sm text-green-700">
                Sheet: "Voice Agent Deal Searches"
                <br />
                Last Updated: {currentDate} {currentTime}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    {sheetsData[0].map((header, index) => (
                      <th key={index} className="border border-gray-300 p-1 text-left">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sheetsData.slice(1).map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="border border-gray-300 p-1">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                <ExternalLink className="w-3 h-3 mr-1" />
                Open Sheet
              </Button>
              <Button size="sm" variant="outline">
                <Download className="w-3 h-3 mr-1" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* CRM Integration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              CRM Integration
            </CardTitle>
            <CardDescription>Search summary logged to CRM system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="font-medium text-blue-800">Connected to CRM</span>
              </div>
              <div className="text-sm text-blue-700">
                System: Salesforce
                <br />
                Record ID: {crmData.searchId}
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Search ID:</span>
                  <div className="text-gray-600">{crmData.searchId}</div>
                </div>
                <div>
                  <span className="font-medium">Product:</span>
                  <div className="text-gray-600">{crmData.productSearched}</div>
                </div>
                <div>
                  <span className="font-medium">Category:</span>
                  <div className="text-gray-600">{crmData.category}</div>
                </div>
                <div>
                  <span className="font-medium">Date/Time:</span>
                  <div className="text-gray-600">
                    {crmData.searchDate} {crmData.searchTime}
                  </div>
                </div>
                <div>
                  <span className="font-medium">Resellers Contacted:</span>
                  <div className="text-gray-600">{crmData.totalResellersContacted}</div>
                </div>
                <div>
                  <span className="font-medium">Deals Found:</span>
                  <div className="text-gray-600">{crmData.dealsFound}</div>
                </div>
                <div>
                  <span className="font-medium">Best Price:</span>
                  <div className="text-green-600 font-bold">${crmData.bestPrice}</div>
                </div>
                <div>
                  <span className="font-medium">Average Price:</span>
                  <div className="text-gray-600">${crmData.averagePrice}</div>
                </div>
              </div>

              <div className="pt-2 border-t">
                <span className="font-medium text-sm">Top Recommendation:</span>
                <div className="mt-1">
                  <Badge variant="default">{crmData.topRecommendation}</Badge>
                </div>
              </div>
            </div>

            <Button size="sm" className="w-full">
              <ExternalLink className="w-3 h-3 mr-1" />
              View in CRM
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* API Integration Details */}
      <Card>
        <CardHeader>
          <CardTitle>API Integration Details</CardTitle>
          <CardDescription>Technical implementation details for OmniDimension webhook integration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Google Sheets API</h4>
              <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                <div>POST /api/sheets/append</div>
                <div className="text-gray-600 mt-1">
                  Endpoint: https://sheets.googleapis.com/v4/spreadsheets/{"{spreadsheetId}"}/values/{"{range}"}:append
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">CRM Webhook</h4>
              <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                <div>POST /api/crm/create-record</div>
                <div className="text-gray-600 mt-1">
                  Endpoint: https://api.salesforce.com/services/data/v58.0/sobjects/Search_Record__c
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">OmniDimension Integration</h4>
            <p className="text-sm text-yellow-700">
              Use OmniDimension's Post Call API or custom webhook to trigger these integrations automatically after each
              voice agent conversation completes. The webhook payload should include call transcript, extracted deal
              information, and conversation metadata.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
