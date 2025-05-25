import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { agent_id, phone_number, reseller_name, product_name } = await request.json()

    const OMNIDIMENSION_API_KEY = process.env.OMNIDIMENSION_API_KEY
    const OMNIDIMENSION_BASE_URL = process.env.OMNIDIMENSION_BASE_URL || "https://api.omnidimension.ai"

    // Check if we're in demo mode
    if (!OMNIDIMENSION_API_KEY || agent_id.startsWith("demo_agent_")) {
      console.log("Running in demo mode - simulating call")

      // Simulate call with demo data
      const demoCallId = `demo_call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Simulate call completion after a delay
      setTimeout(async () => {
        try {
          await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/omnidimension/webhook`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              event_type: "call_started",
              call_id: demoCallId,
              agent_id: agent_id,
              data: {
                reseller: reseller_name,
                product: product_name,
                phone_number: phone_number,
              },
            }),
          })

          // Simulate conversation progress
          setTimeout(async () => {
            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/omnidimension/webhook`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                event_type: "transcript_update",
                call_id: demoCallId,
                data: {
                  transcript_chunk: `Agent: Hello, this is Alex from DealFinder AI. I'm looking for ${product_name}. Do you have it available?\n\n${reseller_name}: Yes, we have it in stock. Current price is $${Math.floor(Math.random() * 200) + 250}.`,
                },
              }),
            })
          }, 3000)

          // Simulate call completion
          setTimeout(async () => {
            const mockTranscript = generateMockTranscript(reseller_name, product_name)
            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/omnidimension/webhook`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                event_type: "call_completed",
                call_id: demoCallId,
                data: {
                  transcript: mockTranscript,
                  metadata: {
                    call_id: demoCallId,
                    reseller: reseller_name,
                    product: product_name,
                  },
                },
              }),
            })
          }, 8000)
        } catch (error) {
          console.error("Error in demo webhook simulation:", error)
        }
      }, 1000)

      return NextResponse.json({
        success: true,
        call_id: demoCallId,
        status: "initiated",
        estimated_duration: "2-3 minutes",
        demo_mode: true,
      })
    }

    // Real API call logic (if API key is available)
    const callConfig = {
      agent_id: agent_id,
      phone_number: phone_number,
      metadata: {
        reseller: reseller_name,
        product: product_name,
        call_purpose: "price_inquiry",
        timestamp: new Date().toISOString(),
      },
      call_settings: {
        record_call: true,
        transcribe: true,
        analyze_sentiment: true,
      },
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    try {
      const response = await fetch(`${OMNIDIMENSION_BASE_URL}/v1/calls`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OMNIDIMENSION_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(callConfig),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`API returned non-JSON response. Status: ${response.status}`)
      }

      const responseText = await response.text()
      const call = JSON.parse(responseText)

      if (!response.ok) {
        throw new Error(`OmniDimension API error: ${response.status} ${response.statusText}`)
      }

      return NextResponse.json({
        success: true,
        call_id: call.id,
        status: call.status,
        estimated_duration: call.estimated_duration,
        demo_mode: false,
      })
    } catch (fetchError) {
      clearTimeout(timeoutId)
      throw fetchError
    }
  } catch (error) {
    console.error("Error making call:", error)

    // Fallback to demo mode
    const demoCallId = `demo_call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    return NextResponse.json({
      success: true,
      call_id: demoCallId,
      status: "demo_initiated",
      estimated_duration: "2-3 minutes",
      demo_mode: true,
      error_message: error instanceof Error ? error.message : "Unknown error occurred",
    })
  }
}

function generateMockTranscript(reseller: string, product: string): string {
  const price = Math.floor(Math.random() * 200) + 250
  const deliveryOptions = ["2-3 days", "5-7 days", "3-5 days", "1-2 weeks"]
  const delivery = deliveryOptions[Math.floor(Math.random() * deliveryOptions.length)]

  return `Agent: Hello, this is Alex from DealFinder AI. I'm looking for ${product}. Do you have it available?

${reseller}: Yes, we have it in stock. Current asking price is $${price} with authentication included.

Agent: What's your delivery timeframe and is there any room for negotiation on the price?

${reseller}: Standard delivery is ${delivery}. For immediate purchase, we can do $${price - 10}.

Agent: That sounds reasonable. What about the condition and authenticity guarantee?

${reseller}: It's in excellent condition, brand new, and comes with our full authenticity guarantee.

Agent: Perfect, thank you for the information. I'll include this in my comparison and get back to you.

${reseller}: Sounds good, have a great day!

Agent: Thank you, you too!`
}
