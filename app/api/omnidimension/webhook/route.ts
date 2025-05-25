import { type NextRequest, NextResponse } from "next/server"

// This webhook receives real-time updates from OmniDimension
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()

    console.log("OmniDimension webhook received:", payload)

    const { event_type, call_id, agent_id, data } = payload

    switch (event_type) {
      case "call_started":
        await handleCallStarted(call_id, data)
        break

      case "call_completed":
        await handleCallCompleted(call_id, data)
        break

      case "transcript_update":
        await handleTranscriptUpdate(call_id, data)
        break

      case "call_failed":
        await handleCallFailed(call_id, data)
        break

      default:
        console.log("Unknown event type:", event_type)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

async function handleCallStarted(call_id: string, data: any) {
  console.log(`Call ${call_id} started with ${data.reseller}`)
  // In a real app, you might update a database here
}

async function handleCallCompleted(call_id: string, data: any) {
  console.log(`Call ${call_id} completed`)

  // Extract deal information from transcript
  const dealInfo = await extractDealInformation(data.transcript, data.metadata)

  // Log to Google Sheets
  await logToGoogleSheets(dealInfo)

  // Update CRM
  await updateCRM(dealInfo)

  // Send real-time update to frontend (in demo mode)
  if (typeof window !== "undefined" && (window as any).handleCallCompleted) {
    ;(window as any).handleCallCompleted(call_id, 0, { transcript: data.transcript })
  }
}

async function handleTranscriptUpdate(call_id: string, data: any) {
  console.log(`Transcript update for call ${call_id}:`, data.transcript_chunk)

  // In a real app, you might use WebSockets or Server-Sent Events here
  // For demo purposes, we'll just log it
}

async function handleCallFailed(call_id: string, data: any) {
  console.log(`Call ${call_id} failed:`, data.error)
}

async function extractDealInformation(transcript: string, metadata: any) {
  // Simple extraction for demo - in production, use AI
  const priceMatch = transcript?.match(/\$(\d+)/g)
  const price = priceMatch ? Number.parseInt(priceMatch[0].replace("$", "")) : null

  return {
    call_id: metadata?.call_id,
    reseller: metadata?.reseller,
    product: metadata?.product,
    timestamp: new Date().toISOString(),
    transcript: transcript,
    price: price,
    delivery: "5-7 days",
    condition: "New",
    verified: true,
  }
}

async function logToGoogleSheets(dealInfo: any) {
  try {
    console.log("Would log to Google Sheets:", dealInfo)
    // Implement Google Sheets logging here
  } catch (error) {
    console.error("Google Sheets logging error:", error)
  }
}

async function updateCRM(dealInfo: any) {
  try {
    console.log("Would update CRM:", dealInfo)
    // Implement CRM update here
  } catch (error) {
    console.error("CRM update error:", error)
  }
}
