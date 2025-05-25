import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const call_id = searchParams.get("call_id")

    if (!call_id) {
      return NextResponse.json({ error: "Call ID required" }, { status: 400 })
    }

    const OMNIDIMENSION_API_KEY = process.env.OMNIDIMENSION_API_KEY
    const OMNIDIMENSION_BASE_URL = process.env.OMNIDIMENSION_BASE_URL || "https://api.omnidimension.ai"

    const response = await fetch(`${OMNIDIMENSION_BASE_URL}/v1/calls/${call_id}`, {
      headers: {
        Authorization: `Bearer ${OMNIDIMENSION_API_KEY}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`OmniDimension API error: ${response.statusText}`)
    }

    const callData = await response.json()

    return NextResponse.json({
      call_id: callData.id,
      status: callData.status,
      duration: callData.duration,
      transcript: callData.transcript,
      recording_url: callData.recording_url,
      metadata: callData.metadata,
    })
  } catch (error) {
    console.error("Error getting call status:", error)
    return NextResponse.json({ error: "Failed to get call status" }, { status: 500 })
  }
}
