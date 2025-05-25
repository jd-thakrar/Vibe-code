"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExternalLink, Key, Phone, TestTube, CheckCircle, AlertTriangle, Code, Settings, Play } from "lucide-react"

export default function SetupGuide() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Complete Setup Guide: OmniDimension Voice Agent</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Step-by-step guide to get OmniDimension API access and test your voice agent system
          </p>
        </div>

        <Tabs defaultValue="api-access" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="api-access">API Access</TabsTrigger>
            <TabsTrigger value="environment">Environment</TabsTrigger>
            <TabsTrigger value="testing">Testing</TabsTrigger>
            <TabsTrigger value="alternatives">Alternatives</TabsTrigger>
            <TabsTrigger value="troubleshooting">Debug</TabsTrigger>
            <TabsTrigger value="demo">Live Demo</TabsTrigger>
          </TabsList>

          <TabsContent value="api-access" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Getting OmniDimension API Access
                </CardTitle>
                <CardDescription>Follow these steps to get your OmniDimension API credentials</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Important:</strong> OmniDimension is a relatively new platform. If you can't access it
                    directly, I'll provide alternative solutions below.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-lg mb-2">Step 1: Visit OmniDimension</h3>
                    <p className="text-gray-600 mb-3">Go to the OmniDimension website and create an account</p>
                    <Button variant="outline" className="mb-2">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit omnidimension.ai
                    </Button>
                    <div className="text-sm text-gray-500">
                      Note: If the website is not accessible, see the "Alternatives" tab
                    </div>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="font-semibold text-lg mb-2">Step 2: Sign Up for API Access</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Create a developer account</li>
                      <li>Verify your email address</li>
                      <li>Complete the onboarding process</li>
                      <li>Request API access (may require approval)</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="font-semibold text-lg mb-2">Step 3: Get Your API Key</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Navigate to the API section in your dashboard</li>
                      <li>Generate a new API key</li>
                      <li>Copy the API key securely</li>
                      <li>Note the API base URL (usually https://api.omnidimension.ai)</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-orange-500 pl-4">
                    <h3 className="font-semibold text-lg mb-2">Step 4: Set Up Billing (if required)</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Add payment method for API usage</li>
                      <li>Review pricing tiers</li>
                      <li>Set up usage limits and alerts</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Expected API Credentials:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="font-mono bg-white p-2 rounded border">
                      <strong>API Key:</strong> omni_sk_1234567890abcdef...
                    </div>
                    <div className="font-mono bg-white p-2 rounded border">
                      <strong>Base URL:</strong> https://api.omnidimension.ai
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="environment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Environment Setup
                </CardTitle>
                <CardDescription>Configure your environment variables and dependencies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">1. Environment Variables</h3>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                    <div className="mb-2"># .env.local</div>
                    <div>OMNIDIMENSION_API_KEY=your_omnidimension_api_key_here</div>
                    <div>OMNIDIMENSION_BASE_URL=https://api.omnidimension.ai</div>
                    <div>OPENAI_API_KEY=your_openai_api_key_here</div>
                    <div>NEXT_PUBLIC_BASE_URL=https://your-app-domain.com</div>
                    <div>GOOGLE_SHEETS_API_KEY=your_google_sheets_api_key_here</div>
                    <div>GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id_here</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">2. Required API Keys</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">OpenAI API</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-3">For transcript analysis and deal extraction</p>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Get OpenAI API Key
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Google Sheets API</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-3">For data logging and CRM integration</p>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Get Google API Key
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">3. Deployment Setup</h3>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-2">For Webhook Testing:</h4>
                    <ul className="list-disc list-inside text-yellow-700 text-sm space-y-1">
                      <li>Deploy to Vercel, Netlify, or similar platform</li>
                      <li>Get your public domain URL</li>
                      <li>Update NEXT_PUBLIC_BASE_URL with your domain</li>
                      <li>Test webhook endpoint accessibility</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="testing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="w-5 h-5" />
                  Testing Your Voice Agent
                </CardTitle>
                <CardDescription>Step-by-step testing process for your voice agent system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-lg mb-2">Phase 1: API Connection Test</h3>
                    <div className="space-y-2">
                      <Badge variant="outline">Test 1: Agent Creation</Badge>
                      <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                        <li>Select a product (e.g., Air Jordan 4 Retro)</li>
                        <li>Click "Create Voice Agent"</li>
                        <li>Verify agent ID is returned</li>
                        <li>Check browser console for any errors</li>
                      </ul>
                    </div>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="font-semibold text-lg mb-2">Phase 2: Test Call Initiation</h3>
                    <div className="space-y-2">
                      <Badge variant="outline">Test 2: Call Setup</Badge>
                      <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                        <li>Click "Start Live Voice Agent Search"</li>
                        <li>Monitor call status indicators</li>
                        <li>Check if call IDs are generated</li>
                        <li>Verify webhook endpoint receives data</li>
                      </ul>
                    </div>
                  </div>

                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="font-semibold text-lg mb-2">Phase 3: Live Monitoring</h3>
                    <div className="space-y-2">
                      <Badge variant="outline">Test 3: Real-time Updates</Badge>
                      <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                        <li>Watch for live transcript updates</li>
                        <li>Monitor call status changes</li>
                        <li>Check deal extraction accuracy</li>
                        <li>Verify data logging to Google Sheets</li>
                      </ul>
                    </div>
                  </div>

                  <div className="border-l-4 border-orange-500 pl-4">
                    <h3 className="font-semibold text-lg mb-2">Phase 4: End-to-End Test</h3>
                    <div className="space-y-2">
                      <Badge variant="outline">Test 4: Complete Workflow</Badge>
                      <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                        <li>Complete full search cycle</li>
                        <li>Verify email report generation</li>
                        <li>Check CRM data logging</li>
                        <li>Test deal comparison accuracy</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Testing Tip:</strong> Start with a single call test before running the full 5-reseller
                    search to avoid unnecessary API costs during development.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Debug Tools & Monitoring</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Browser Console</h4>
                    <p className="text-sm text-gray-600">Monitor API calls, errors, and real-time updates</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Network Tab</h4>
                    <p className="text-sm text-gray-600">Check API request/response status and timing</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Webhook Logs</h4>
                    <p className="text-sm text-gray-600">Monitor incoming webhook data from OmniDimension</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Server Logs</h4>
                    <p className="text-sm text-gray-600">Check Vercel/deployment logs for backend errors</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alternatives" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Alternative Voice AI Platforms
                </CardTitle>
                <CardDescription>If OmniDimension is not available, here are proven alternatives</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Vapi.ai</CardTitle>
                      <Badge variant="default">Recommended</Badge>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-600">
                        Production-ready voice AI platform with excellent phone integration
                      </p>
                      <div className="space-y-2 text-sm">
                        <div>
                          <strong>Pros:</strong> Easy setup, good docs, reliable
                        </div>
                        <div>
                          <strong>Pricing:</strong> $0.05-0.15 per minute
                        </div>
                        <div>
                          <strong>Setup:</strong> 15 minutes
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Visit Vapi.ai
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Bland.ai</CardTitle>
                      <Badge variant="secondary">Popular</Badge>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-600">Specialized in phone call automation with good API</p>
                      <div className="space-y-2 text-sm">
                        <div>
                          <strong>Pros:</strong> Phone-focused, good quality
                        </div>
                        <div>
                          <strong>Pricing:</strong> $0.09-0.19 per minute
                        </div>
                        <div>
                          <strong>Setup:</strong> 20 minutes
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Visit Bland.ai
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Retell.ai</CardTitle>
                      <Badge variant="outline">Enterprise</Badge>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-600">Enterprise-grade voice AI with advanced features</p>
                      <div className="space-y-2 text-sm">
                        <div>
                          <strong>Pros:</strong> Advanced features, scalable
                        </div>
                        <div>
                          <strong>Pricing:</strong> Custom pricing
                        </div>
                        <div>
                          <strong>Setup:</strong> 30 minutes
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Visit Retell.ai
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Custom Solution</CardTitle>
                      <Badge variant="outline">DIY</Badge>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-600">Build using Twilio + OpenAI + ElevenLabs</p>
                      <div className="space-y-2 text-sm">
                        <div>
                          <strong>Pros:</strong> Full control, customizable
                        </div>
                        <div>
                          <strong>Pricing:</strong> Variable
                        </div>
                        <div>
                          <strong>Setup:</strong> 2-4 hours
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Code className="w-3 h-3 mr-1" />
                        View Implementation
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Quick Switch:</strong> The code is designed to be platform-agnostic. You can easily switch
                    between voice AI providers by updating the API endpoints and authentication.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="troubleshooting" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Common Issues & Solutions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="border border-red-200 bg-red-50 p-4 rounded-lg">
                    <h4 className="font-medium text-red-800 mb-2">❌ API Key Invalid</h4>
                    <p className="text-sm text-red-700 mb-2">Error: "Unauthorized" or "Invalid API key"</p>
                    <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
                      <li>Double-check your API key in .env.local</li>
                      <li>Ensure no extra spaces or characters</li>
                      <li>Verify the API key is active in your dashboard</li>
                      <li>Check if you need to whitelist your domain</li>
                    </ul>
                  </div>

                  <div className="border border-yellow-200 bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-2">⚠️ Webhook Not Receiving Data</h4>
                    <p className="text-sm text-yellow-700 mb-2">Webhook endpoint not getting called</p>
                    <ul className="list-disc list-inside text-yellow-700 text-sm space-y-1">
                      <li>Ensure your app is deployed and publicly accessible</li>
                      <li>Check webhook URL is correctly configured</li>
                      <li>Test webhook endpoint manually with curl</li>
                      <li>Verify HTTPS is enabled (required for webhooks)</li>
                    </ul>
                  </div>

                  <div className="border border-blue-200 bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">ℹ️ Calls Not Connecting</h4>
                    <p className="text-sm text-blue-700 mb-2">Voice agent can't reach phone numbers</p>
                    <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
                      <li>Verify phone numbers are correct and active</li>
                      <li>Check if numbers accept automated calls</li>
                      <li>Test with a known working number first</li>
                      <li>Consider time zones and business hours</li>
                    </ul>
                  </div>

                  <div className="border border-green-200 bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">✅ Testing Commands</h4>
                    <div className="space-y-2">
                      <div className="bg-gray-900 text-green-400 p-2 rounded font-mono text-xs">
                        # Test webhook endpoint
                        <br />
                        curl -X POST https://your-app.com/api/omnidimension/webhook \
                        <br />
                        &nbsp;&nbsp;-H "Content-Type: application/json" \
                        <br />
                        &nbsp;&nbsp;-d '{"{"}"event_type":"test","data":{}
                        {"}"}'
                      </div>
                      <div className="bg-gray-900 text-green-400 p-2 rounded font-mono text-xs">
                        # Test API connection
                        <br />
                        curl -H "Authorization: Bearer YOUR_API_KEY" \
                        <br />
                        &nbsp;&nbsp;https://api.omnidimension.ai/v1/agents
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="demo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Live Demo & Testing
                </CardTitle>
                <CardDescription>Interactive demo to test your voice agent system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Demo Mode:</strong> This demo simulates the voice agent workflow. Replace with real API
                    calls when you have OmniDimension access.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Test Scenario 1</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-600">Test with Air Jordan 4 Retro "Black Cat"</p>
                      <Button className="w-full">
                        <Play className="w-3 h-3 mr-1" />
                        Run Test Scenario
                      </Button>
                      <div className="text-xs text-gray-500">Expected: 3-4 deals found, $285-$340 price range</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Test Scenario 2</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-600">Test with Taylor Swift Eras Tour tickets</p>
                      <Button className="w-full" variant="outline">
                        <Play className="w-3 h-3 mr-1" />
                        Run Test Scenario
                      </Button>
                      <div className="text-xs text-gray-500">Expected: 2-3 deals found, $450-$800 price range</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Expected Test Results:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <strong>API Calls:</strong>
                      <ul className="list-disc list-inside text-gray-600 mt-1">
                        <li>Agent creation: 200 OK</li>
                        <li>Call initiation: 200 OK</li>
                        <li>Webhook events: Received</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Data Flow:</strong>
                      <ul className="list-disc list-inside text-gray-600 mt-1">
                        <li>Live transcripts: ✓</li>
                        <li>Deal extraction: ✓</li>
                        <li>Google Sheets: ✓</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Output:</strong>
                      <ul className="list-disc list-inside text-gray-600 mt-1">
                        <li>Email report: Generated</li>
                        <li>CRM logging: Complete</li>
                        <li>Deal ranking: Accurate</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
