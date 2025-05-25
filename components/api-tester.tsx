"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2, TestTube, ExternalLink } from "lucide-react"

export function ApiTester() {
  const [testResults, setTestResults] = useState<any>({})
  const [testing, setTesting] = useState<string | null>(null)

  const runTest = async (testType: string, endpoint: string, method = "GET") => {
    setTesting(testType)
    try {
      const response = await fetch(endpoint, { method })
      const data = await response.json()

      setTestResults((prev: any) => ({
        ...prev,
        [testType]: {
          success: response.ok,
          status: response.status,
          data: data,
          timestamp: new Date().toISOString(),
        },
      }))
    } catch (error) {
      setTestResults((prev: any) => ({
        ...prev,
        [testType]: {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
          timestamp: new Date().toISOString(),
        },
      }))
    } finally {
      setTesting(null)
    }
  }

  const TestResult = ({ testKey, title }: { testKey: string; title: string }) => {
    const result = testResults[testKey]
    if (!result) return null

    return (
      <div className="flex items-center justify-between p-3 border rounded-lg">
        <div className="flex items-center gap-2">
          {result.success ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <XCircle className="w-4 h-4 text-red-500" />
          )}
          <span className="font-medium">{title}</span>
        </div>
        <Badge variant={result.success ? "default" : "destructive"}>{result.success ? "Pass" : "Fail"}</Badge>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="w-5 h-5" />
          API Connection Tester
        </CardTitle>
        <CardDescription>Test your API connections and environment setup</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={() => runTest("omnidimension", "/api/test-omnidimension")}
            disabled={testing === "omnidimension"}
            variant="outline"
          >
            {testing === "omnidimension" ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <TestTube className="w-4 h-4 mr-2" />
            )}
            Test OmniDimension API
          </Button>

          <Button
            onClick={() => runTest("webhook", "/api/test-omnidimension", "POST")}
            disabled={testing === "webhook"}
            variant="outline"
          >
            {testing === "webhook" ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <TestTube className="w-4 h-4 mr-2" />
            )}
            Test Webhook Endpoint
          </Button>

          <Button
            onClick={() => runTest("openai", "/api/test-openai")}
            disabled={testing === "openai"}
            variant="outline"
          >
            {testing === "openai" ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <TestTube className="w-4 h-4 mr-2" />
            )}
            Test OpenAI API
          </Button>

          <Button
            onClick={() => runTest("sheets", "/api/test-google-sheets")}
            disabled={testing === "sheets"}
            variant="outline"
          >
            {testing === "sheets" ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <TestTube className="w-4 h-4 mr-2" />
            )}
            Test Google Sheets
          </Button>
        </div>

        {Object.keys(testResults).length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Test Results:</h4>
            <TestResult testKey="omnidimension" title="OmniDimension API Connection" />
            <TestResult testKey="webhook" title="Webhook Endpoint" />
            <TestResult testKey="openai" title="OpenAI API Connection" />
            <TestResult testKey="sheets" title="Google Sheets API" />
          </div>
        )}

        {testResults.omnidimension && !testResults.omnidimension.success && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>OmniDimension API Issue:</strong> {testResults.omnidimension.error || "Connection failed"}
              <br />
              <Button variant="link" className="p-0 h-auto mt-2">
                <ExternalLink className="w-3 h-3 mr-1" />
                Check Alternative Platforms
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Next Steps:</h4>
          <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
            <li>If OmniDimension fails, check the "Alternatives" tab</li>
            <li>Ensure all environment variables are set correctly</li>
            <li>Deploy to a public URL for webhook testing</li>
            <li>Test with a single call before running full searches</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
