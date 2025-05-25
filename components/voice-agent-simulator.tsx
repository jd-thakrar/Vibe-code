"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Phone, PhoneCall, CheckCircle, Clock, AlertCircle } from "lucide-react"

const mockResellers = [
  { name: "StockX", phone: "+1-555-0101", status: "pending" },
  { name: "GOAT", phone: "+1-555-0102", status: "pending" },
  { name: "Flight Club", phone: "+1-555-0103", status: "pending" },
  { name: "Stadium Goods", phone: "+1-555-0104", status: "pending" },
  { name: "Sole Supremacy", phone: "+1-555-0105", status: "pending" },
]

const mockConversations = [
  {
    reseller: "StockX",
    conversation: [
      {
        speaker: "Agent",
        text: "Hello, this is Alex from DealFinder AI. I'm looking for Air Jordan 4 Retro Black Cat in size 10. Do you have it available?",
      },
      {
        speaker: "StockX",
        text: "Yes, we have it in stock. Current asking price is $320 with authentication included.",
      },
      { speaker: "Agent", text: "What's your delivery timeframe and is there any room for negotiation on the price?" },
      { speaker: "StockX", text: "Standard delivery is 7-10 business days. For bulk buyers, we can do $310." },
      { speaker: "Agent", text: "Thank you, I'll include this in my comparison. Have a great day!" },
    ],
    result: { price: 310, delivery: "7-10 days", condition: "New", verified: true },
  },
  {
    reseller: "GOAT",
    conversation: [
      { speaker: "Agent", text: "Hi, I'm calling about Air Jordan 4 Retro Black Cat size 10. What's your best price?" },
      { speaker: "GOAT", text: "We have several listings. Best price is $295 for deadstock condition." },
      { speaker: "Agent", text: "That sounds competitive. What about shipping and authenticity guarantee?" },
      { speaker: "GOAT", text: "Free shipping, 5-7 days delivery, and full authenticity guarantee included." },
      { speaker: "Agent", text: "Excellent, thank you for the information!" },
    ],
    result: { price: 295, delivery: "5-7 days", condition: "Deadstock", verified: true },
  },
  {
    reseller: "Flight Club",
    conversation: [
      {
        speaker: "Agent",
        text: "Hello, I'm interested in Air Jordan 4 Retro Black Cat size 10. What do you have available?",
      },
      {
        speaker: "Flight Club",
        text: "We have it for $340. It's in perfect condition, stored in our climate-controlled facility.",
      },
      { speaker: "Agent", text: "Is there any flexibility on the price for immediate purchase?" },
      { speaker: "Flight Club", text: "For cash payment, we can do $325. Shipping is 3-5 business days." },
      { speaker: "Agent", text: "Thank you, I appreciate the offer!" },
    ],
    result: { price: 325, delivery: "3-5 days", condition: "Perfect", verified: true },
  },
  {
    reseller: "Stadium Goods",
    conversation: [
      { speaker: "Agent", text: "Hi there, looking for Air Jordan 4 Retro Black Cat in size 10. What's available?" },
      {
        speaker: "Stadium Goods",
        text: "We have one pair left at $285. It's been authenticated and is in excellent condition.",
      },
      { speaker: "Agent", text: "That's a great price! What's the shipping situation?" },
      {
        speaker: "Stadium Goods",
        text: "We can ship today, you'll have it in 2-3 business days. Express shipping available.",
      },
      { speaker: "Agent", text: "Perfect, thank you for the quick response!" },
    ],
    result: { price: 285, delivery: "2-3 days", condition: "Excellent", verified: true },
  },
  {
    reseller: "Sole Supremacy",
    conversation: [
      {
        speaker: "Agent",
        text: "Hello, I'm calling about Air Jordan 4 Retro Black Cat size 10. Do you have any available?",
      },
      { speaker: "Sole Supremacy", text: "Sorry, we're currently out of stock on that model in size 10." },
      { speaker: "Agent", text: "Do you expect any new inventory soon?" },
      { speaker: "Sole Supremacy", text: "We might get some next week, but I can't guarantee the price or condition." },
      { speaker: "Agent", text: "I understand, thank you for checking!" },
    ],
    result: { price: null, delivery: null, condition: null, verified: false, available: false },
  },
]

interface VoiceAgentSimulatorProps {
  selectedProduct: any
  onAgentStart: () => void
  onDealsFound: (deals: any[]) => void
  onCallsUpdate: (count: number) => void
  agentActive: boolean
}

export function VoiceAgentSimulator({
  selectedProduct,
  onAgentStart,
  onDealsFound,
  onCallsUpdate,
  agentActive,
}: VoiceAgentSimulatorProps) {
  const [currentCall, setCurrentCall] = useState(0)
  const [callStatus, setCallStatus] = useState("idle")
  const [resellers, setResellers] = useState(mockResellers)
  const [currentConversation, setCurrentConversation] = useState([])
  const [conversationIndex, setConversationIndex] = useState(0)
  const [allDeals, setAllDeals] = useState([])

  const startCalling = () => {
    if (!selectedProduct) return

    onAgentStart()
    setCallStatus("calling")
    setCurrentCall(0)
    setAllDeals([])
    onCallsUpdate(0)

    // Reset resellers
    setResellers(mockResellers.map((r) => ({ ...r, status: "pending" })))

    // Start first call
    makeCall(0)
  }

  const makeCall = (callIndex: number) => {
    if (callIndex >= mockResellers.length) {
      // All calls completed
      setCallStatus("completed")
      return
    }

    setCurrentCall(callIndex)
    setCurrentConversation([])
    setConversationIndex(0)

    // Update reseller status to calling
    setResellers((prev) => prev.map((r, i) => (i === callIndex ? { ...r, status: "calling" } : r)))

    // Simulate conversation
    simulateConversation(callIndex)
  }

  const simulateConversation = (callIndex: number) => {
    const conversation = mockConversations[callIndex]
    let messageIndex = 0

    const addMessage = () => {
      if (messageIndex < conversation.conversation.length) {
        setCurrentConversation((prev) => [...prev, conversation.conversation[messageIndex]])
        messageIndex++
        setTimeout(addMessage, 2000) // 2 second delay between messages
      } else {
        // Conversation completed
        setTimeout(() => {
          completeCall(callIndex, conversation.result)
        }, 1000)
      }
    }

    setTimeout(addMessage, 1000) // Start after 1 second
  }

  const completeCall = (callIndex: number, result: any) => {
    // Update reseller status
    setResellers((prev) =>
      prev.map((r, i) =>
        i === callIndex ? { ...r, status: result.available !== false ? "completed" : "no-stock" } : r,
      ),
    )

    // Add deal if available
    if (result.available !== false && result.price) {
      const deal = {
        reseller: mockResellers[callIndex].name,
        ...result,
        score: calculateScore(result),
      }
      setAllDeals((prev) => {
        const newDeals = [...prev, deal]
        onDealsFound(newDeals)
        return newDeals
      })
    }

    onCallsUpdate(callIndex + 1)

    // Move to next call after a short delay
    setTimeout(() => {
      makeCall(callIndex + 1)
    }, 2000)
  }

  const calculateScore = (result: any) => {
    let score = 0

    // Price score (lower is better)
    if (result.price <= 290) score += 40
    else if (result.price <= 310) score += 30
    else if (result.price <= 330) score += 20
    else score += 10

    // Delivery score (faster is better)
    if (result.delivery.includes("2-3")) score += 30
    else if (result.delivery.includes("3-5")) score += 25
    else if (result.delivery.includes("5-7")) score += 20
    else score += 15

    // Condition score
    if (result.condition === "Deadstock" || result.condition === "Perfect") score += 20
    else if (result.condition === "Excellent") score += 18
    else score += 15

    // Verification score
    if (result.verified) score += 10

    return score
  }

  if (!selectedProduct) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Voice Agent Simulator</CardTitle>
          <CardDescription>Select a product first to start the voice agent</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">Please select a product from the Setup tab to begin</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Voice Agent Control Panel
          </CardTitle>
          <CardDescription>
            AI agent will call resellers to find the best deal for {selectedProduct.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!agentActive ? (
            <Button onClick={startCalling} className="w-full" size="lg">
              <PhoneCall className="w-4 h-4 mr-2" />
              Start Voice Agent Search
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Search Progress</span>
                <span className="text-sm text-gray-600">
                  {currentCall + 1} of {mockResellers.length} calls
                </span>
              </div>
              <Progress value={((currentCall + 1) / mockResellers.length) * 100} />
            </div>
          )}
        </CardContent>
      </Card>

      {agentActive && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Reseller Call Status</CardTitle>
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
                      {reseller.status === "no-stock" && <AlertCircle className="w-4 h-4 text-red-500" />}
                    </div>
                    <div className="text-sm text-gray-600">{reseller.phone}</div>
                    <Badge
                      variant={
                        reseller.status === "completed"
                          ? "default"
                          : reseller.status === "calling"
                            ? "secondary"
                            : reseller.status === "no-stock"
                              ? "destructive"
                              : "outline"
                      }
                      className="mt-2"
                    >
                      {reseller.status === "pending"
                        ? "Waiting"
                        : reseller.status === "calling"
                          ? "Calling..."
                          : reseller.status === "completed"
                            ? "Deal Found"
                            : "No Stock"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {currentConversation.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Live Conversation - {mockResellers[currentCall]?.name}</CardTitle>
                <CardDescription>Real-time voice agent conversation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {currentConversation.map((message, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        message.speaker === "Agent" ? "bg-blue-100 ml-8" : "bg-gray-100 mr-8"
                      }`}
                    >
                      <div className="font-medium text-sm mb-1">
                        {message.speaker === "Agent" ? "🤖 AI Agent" : `👤 ${message.speaker}`}
                      </div>
                      <div className="text-sm">{message.text}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
