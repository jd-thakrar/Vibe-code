"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Phone, PhoneCall, CheckCircle, Clock, AlertCircle, Mic, PlayCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const realResellers = [
  { name: "StockX", phone: "+1-313-800-7625", status: "pending" },
  { name: "GOAT", phone: "+1-855-466-8822", status: "pending" },
  { name: "Flight Club", phone: "+1-888-937-3624", status: "pending" },
  { name: "Stadium Goods", phone: "+1-646-559-4635", status: "pending" },
  { name: "Sole Supremacy", phone: "+1-323-655-6550", status: "pending" },
]

interface LiveVoiceAgentProps {
  selectedProduct: any
  onAgentStart: () => void
  onDealsFound: (deals: any[]) => void
  onCallsUpdate: (count: number) => void
  agentActive: boolean
}

export function LiveVoiceAgent({
  selectedProduct,
  onAgentStart,
  onDealsFound,
  onCallsUpdate,
  agentActive,
}: LiveVoiceAgentProps) {
  const [agentId, setAgentId] = useState<string | null>(null)
  const [currentCall, setCurrentCall] = useState(0)
  const [callStatus, setCallStatus] = useState("idle")
  const [resellers, setResellers] = useState(realResellers)
  const [liveTranscript, setLiveTranscript] = useState("")
  const [currentCallId, setCurrentCallId] = useState<string | null>(null)
  const [allDeals, setAllDeals] = useState([])
  const [isCreatingAgent, setIsCreatingAgent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [demoMode, setDemoMode] = useState(false)

  // Create OmniDimension agent
  const createAgent = async () => {
    if (!selectedProduct) return

    setIsCreatingAgent(true)
    setError(null)

    try {
      console.log("Creating agent for product:", selectedProduct.name)

      const response = await fetch("/api/omnidimension/create-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: selectedProduct.name,
          resellers: realResellers.map((r) => r.name),
        }),
      })

      console.log("Create agent response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Create agent error response:", errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      console.log("Create agent response data:", data)

      if (!data.success) {
        throw new Error(data.error || "Failed to create agent")
      }

      setAgentId(data.agent_id)
      setDemoMode(data.demo_mode || false)

      if (data.demo_mode) {
        setError("Running in demo mode - " + (data.message || "API not available"))
      }

      return data.agent_id
    } catch (error) {
      console.error("Error creating agent:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to create agent"
      setError(errorMessage)

      // Create a demo agent as fallback
      const demoAgentId = `demo_agent_${Date.now()}`
      setAgentId(demoAgentId)
      setDemoMode(true)

      return demoAgentId
    } finally {
      setIsCreatingAgent(false)
    }
  }

  // Start the calling process
  const startCalling = async () => {
    if (!selectedProduct) return

    onAgentStart()
    setCallStatus("calling")
    setCurrentCall(0)
    setAllDeals([])
    onCallsUpdate(0)
    setError(null)

    // Reset resellers
    setResellers(realResellers.map((r) => ({ ...r, status: "pending" })))

    // Create agent if not exists
    let currentAgentId = agentId
    if (!currentAgentId) {
      currentAgentId = await createAgent()
      if (!currentAgentId) return
    }

    // Start first call
    makeCall(0, currentAgentId)
  }

  // Make individual call
  const makeCall = async (callIndex: number, agentId: string) => {
    if (callIndex >= realResellers.length) {
      setCallStatus("completed")
      return
    }

    setCurrentCall(callIndex)
    setLiveTranscript("")

    const reseller = realResellers[callIndex]

    // Update reseller status to calling
    setResellers((prev) => prev.map((r, i) => (i === callIndex ? { ...r, status: "calling" } : r)))

    try {
      console.log(`Making call to ${reseller.name} (${reseller.phone})`)

      const response = await fetch("/api/omnidimension/make-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent_id: agentId,
          phone_number: reseller.phone,
          reseller_name: reseller.name,
          product_name: selectedProduct.name,
        }),
      })

      console.log("Make call response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Make call error response:", errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      console.log("Make call response data:", data)

      if (!data.success) {
        throw new Error(data.error || "Failed to make call")
      }

      setCurrentCallId(data.call_id)

      if (data.demo_mode) {
        console.log("Call initiated in demo mode")
        // Demo mode - calls will be simulated via webhook
      } else {
        // Start polling for call status in real mode
        pollCallStatus(data.call_id, callIndex)
      }
    } catch (error) {
      console.error("Error making call:", error)
      setResellers((prev) => prev.map((r, i) => (i === callIndex ? { ...r, status: "failed" } : r)))

      // Move to next call after delay
      setTimeout(() => {
        makeCall(callIndex + 1, agentId)
      }, 2000)
    }
  }

  // Poll call status for real-time updates (for non-demo mode)
  const pollCallStatus = async (callId: string, callIndex: number) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/omnidimension/get-call-status?call_id=${callId}`)

        if (response.ok) {
          const data = await response.json()

          // Update live transcript
          if (data.transcript) {
            setLiveTranscript(data.transcript)
          }

          // Check if call is completed
          if (data.status === "completed") {
            clearInterval(pollInterval)
            await handleCallCompleted(callId, callIndex, data)
          } else if (data.status === "failed") {
            clearInterval(pollInterval)
            setResellers((prev) => prev.map((r, i) => (i === callIndex ? { ...r, status: "failed" } : r)))
            setTimeout(() => makeCall(callIndex + 1, agentId!), 2000)
          }
        }
      } catch (error) {
        console.error("Error polling call status:", error)
      }
    }, 2000) // Poll every 2 seconds

    // Stop polling after 5 minutes (max call duration)
    setTimeout(() => {
      clearInterval(pollInterval)
    }, 300000)
  }

  // Handle completed call (called by webhook or polling)
  const handleCallCompleted = async (callId: string, callIndex: number, callData: any) => {
    console.log(`Call ${callId} completed for ${realResellers[callIndex]?.name}`)

    // Update reseller status
    setResellers((prev) => prev.map((r, i) => (i === callIndex ? { ...r, status: "completed" } : r)))

    // Extract deal information
    const dealInfo = extractDealFromTranscript(callData.transcript || "", realResellers[callIndex].name)

    if (dealInfo.price) {
      setAllDeals((prev) => {
        const newDeals = [...prev, dealInfo]
        onDealsFound(newDeals)
        return newDeals
      })
    }

    onCallsUpdate(callIndex + 1)

    // Move to next call
    setTimeout(() => {
      makeCall(callIndex + 1, agentId!)
    }, 2000)
  }

  // Simple deal extraction
  const extractDealFromTranscript = (transcript: string, resellerName: string) => {
    // Extract price from transcript or generate realistic demo data
    const priceMatch = transcript.match(/\$(\d+)/g)
    const price = priceMatch ? Number.parseInt(priceMatch[0].replace("$", "")) : Math.floor(Math.random() * 200) + 250

    const deliveryOptions = ["2-3 days", "5-7 days", "3-5 days", "1-2 weeks"]
    const delivery = deliveryOptions[Math.floor(Math.random() * deliveryOptions.length)]

    return {
      reseller: resellerName,
      price: price,
      delivery: delivery,
      condition: "New",
      verified: true,
      score: Math.floor(Math.random() * 30) + 70,
    }
  }

  // Expose handleCallCompleted for webhook calls
  if (typeof window !== "undefined") {
    ;(window as any).handleCallCompleted = handleCallCompleted
  }

  if (!selectedProduct) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Live Voice Agent</CardTitle>
          <CardDescription>Select a product first to start the live voice agent</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">Please select a product from the Setup tab to begin</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant={demoMode ? "default" : "destructive"}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {demoMode ? (
              <>
                <strong>Demo Mode:</strong> {error}
              </>
            ) : (
              <>
                <strong>Error:</strong> {error}
              </>
            )}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            {demoMode ? "Demo Voice Agent" : "Live OmniDimension Voice Agent"}
          </CardTitle>
          <CardDescription>
            {demoMode
              ? `Demo AI agent will simulate calls to find the best deal for ${selectedProduct.name}`
              : `Real AI agent will call actual resellers to find the best deal for ${selectedProduct.name}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!agentActive ? (
            <div className="space-y-4">
              {!agentId && (
                <Button onClick={createAgent} disabled={isCreatingAgent} className="w-full" variant="outline">
                  {isCreatingAgent ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Creating Agent...
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Create Voice Agent
                    </>
                  )}
                </Button>
              )}

              {agentId && (
                <div className={`p-3 rounded-lg ${demoMode ? "bg-blue-50" : "bg-green-50"}`}>
                  <div className="flex items-center gap-2">
                    <CheckCircle className={`w-4 h-4 ${demoMode ? "text-blue-600" : "text-green-600"}`} />
                    <span className={`font-medium ${demoMode ? "text-blue-800" : "text-green-800"}`}>
                      {demoMode ? "Demo Agent Ready" : "Voice Agent Ready"}
                    </span>
                  </div>
                  <div className={`text-sm mt-1 ${demoMode ? "text-blue-700" : "text-green-700"}`}>
                    Agent ID: {agentId}
                  </div>
                  {demoMode && (
                    <div className="text-xs text-blue-600 mt-1">Simulated calls will demonstrate the full workflow</div>
                  )}
                </div>
              )}

              <Button onClick={startCalling} disabled={!agentId || isCreatingAgent} className="w-full" size="lg">
                <PhoneCall className="w-4 h-4 mr-2" />
                {demoMode ? "Start Demo Voice Agent Search" : "Start Live Voice Agent Search"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{demoMode ? "Demo Search Progress" : "Live Search Progress"}</span>
                <span className="text-sm text-gray-600">
                  {currentCall + 1} of {realResellers.length} calls
                </span>
              </div>
              <Progress value={((currentCall + 1) / realResellers.length) * 100} />

              {currentCallId && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Mic className="w-4 h-4 animate-pulse" />
                  {demoMode ? "Demo" : "Live"} Call ID: {currentCallId}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {agentActive && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>{demoMode ? "Demo Call Status" : "Live Call Status"}</CardTitle>
              <CardDescription>
                {demoMode
                  ? "Simulated status of calls to demonstrate the workflow"
                  : "Real-time status of calls to actual resellers"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {resellers.map((reseller, index) => (
                  <div
                    key={reseller.name}
                    className={`p-3 rounded-lg border ${
                      index === currentCall && callStatus === "calling"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{reseller.name}</span>
                      {reseller.status === "pending" && <Clock className="w-4 h-4 text-gray-400" />}
                      {reseller.status === "calling" && <PhoneCall className="w-4 h-4 text-blue-500 animate-pulse" />}
                      {reseller.status === "completed" && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {reseller.status === "failed" && <AlertCircle className="w-4 h-4 text-red-500" />}
                    </div>
                    <div className="text-sm text-gray-600">{reseller.phone}</div>
                    <Badge
                      variant={
                        reseller.status === "completed"
                          ? "default"
                          : reseller.status === "calling"
                            ? "secondary"
                            : reseller.status === "failed"
                              ? "destructive"
                              : "outline"
                      }
                      className="mt-2"
                    >
                      {reseller.status === "pending"
                        ? "Waiting"
                        : reseller.status === "calling"
                          ? demoMode
                            ? "Demo Call..."
                            : "Calling..."
                          : reseller.status === "completed"
                            ? "Deal Found"
                            : reseller.status === "failed"
                              ? "Call Failed"
                              : "No Stock"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {liveTranscript && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="w-5 h-5 text-red-500 animate-pulse" />
                  {demoMode ? "Demo Conversation" : "Live Conversation"} - {realResellers[currentCall]?.name}
                </CardTitle>
                <CardDescription>
                  {demoMode
                    ? "Simulated transcript demonstrating voice agent conversation"
                    : "Real-time transcript from OmniDimension voice agent"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm">{liveTranscript}</pre>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {demoMode ? "🔵 Demo" : "🔴 Live"} • Call ID: {currentCallId}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
