import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { productName, resellers } = await request.json()

    // OmniDimension API configuration
    const OMNIDIMENSION_API_KEY = process.env.OMNIDIMENSION_API_KEY
    const OMNIDIMENSION_BASE_URL = process.env.OMNIDIMENSION_BASE_URL || "https://api.omnidimension.ai"

    if (!OMNIDIMENSION_API_KEY) {
      console.log("OmniDimension API key not configured, using demo mode")

      // Return demo agent for testing
      return NextResponse.json({
        success: true,
        agent_id: `demo_agent_${Date.now()}`,
        agent_name: `Demo Deal Finder for ${productName}`,
        webhook_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/omnidimension/webhook`,
        demo_mode: true,
        message: "Running in demo mode - no real calls will be made",
      })
    }

    // Create voice agent with dynamic prompt
    const agentPrompt = `You are a professional deal-finding agent named Alex working for DealFinder AI. 

Your mission: Find the best deal for "${productName}" by calling resellers and gathering pricing information.

CONVERSATION FLOW:
1. Introduce yourself politely: "Hello, this is Alex from DealFinder AI"
2. Ask about availability of "${productName}"
3. Inquire about pricing and any current promotions
4. Ask about delivery timeframes
5. Ask about product condition and authenticity verification
6. Politely negotiate for better pricing if possible
7. Thank them and end the call professionally

INFORMATION TO EXTRACT:
- Current price
- Availability (in stock/out of stock)
- Delivery timeframe
- Product condition
- Authentication/verification included
- Any special offers or discounts

TONE: Professional, friendly, and persistent but respectful. You're representing a legitimate business looking for the best deals for customers.

IMPORTANT: Always be honest about who you are and what you're looking for. Don't make false promises about purchase volume unless specifically instructed.`

    const agentConfig = {
      name: `Deal Finder for ${productName}`,
      prompt: agentPrompt,
      voice: {
        provider: "elevenlabs",
        voice_id: "21m00Tcm4TlvDq8ikWAM", // Professional male voice
        stability: 0.5,
        similarity_boost: 0.8,
      },
      conversation_config: {
        max_duration: 300, // 5 minutes max per call
        silence_timeout: 10,
        interruption_threshold: 0.7,
      },
      webhook_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/omnidimension/webhook`,
      metadata: {
        product: productName,
        search_id: `search_${Date.now()}`,
        resellers: resellers,
      },
    }

    console.log("Attempting to create OmniDimension agent...")
    console.log("API URL:", `${OMNIDIMENSION_BASE_URL}/v1/agents`)

    // Create agent via OmniDimension API with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    try {
      const response = await fetch(`${OMNIDIMENSION_BASE_URL}/v1/agents`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OMNIDIMENSION_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(agentConfig),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      console.log("OmniDimension API Response Status:", response.status)
      console.log("Response Headers:", Object.fromEntries(response.headers.entries()))

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text()
        console.log("Non-JSON response received:", textResponse.substring(0, 200))

        throw new Error(`API returned non-JSON response. Status: ${response.status}. Content-Type: ${contentType}`)
      }

      const responseText = await response.text()
      console.log("Raw response:", responseText.substring(0, 500))

      let agent
      try {
        agent = JSON.parse(responseText)
      } catch (parseError) {
        console.error("JSON parse error:", parseError)
        throw new Error(`Invalid JSON response from API: ${responseText.substring(0, 100)}`)
      }

      if (!response.ok) {
        throw new Error(`OmniDimension API error: ${response.status} ${response.statusText} - ${JSON.stringify(agent)}`)
      }

      return NextResponse.json({
        success: true,
        agent_id: agent.id,
        agent_name: agent.name,
        webhook_url: agentConfig.webhook_url,
        demo_mode: false,
      })
    } catch (fetchError) {
      clearTimeout(timeoutId)

      if (fetchError.name === "AbortError") {
        throw new Error("Request timeout - OmniDimension API took too long to respond")
      }

      throw fetchError
    }
  } catch (error) {
    console.error("Error creating OmniDimension agent:", error)

    // Fallback to demo mode on any error
    const { productName } = await request.json().catch(() => ({ productName: "Unknown Product" }))

    return NextResponse.json({
      success: true,
      agent_id: `demo_agent_${Date.now()}`,
      agent_name: `Demo Deal Finder for ${productName}`,
      webhook_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/omnidimension/webhook`,
      demo_mode: true,
      error_message: error instanceof Error ? error.message : "Unknown error occurred",
      message: "Switched to demo mode due to API error - simulated calls will be made",
    })
  }
}
