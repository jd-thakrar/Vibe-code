import { type NextRequest, NextResponse } from "next/server"

// Test endpoint to verify OmniDimension API connection
export async function GET(request: NextRequest) {
  try {
    const OMNIDIMENSION_API_KEY = process.env.OMNIDIMENSION_API_KEY
    const OMNIDIMENSION_BASE_URL = process.env.OMNIDIMENSION_BASE_URL || "https://api.omnidimension.ai"

    if (!OMNIDIMENSION_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "OMNIDIMENSION_API_KEY not found in environment variables",
          setup_required: true,
        },
        { status: 400 },
      )
    }

    // Test API connection
    const response = await fetch(`${OMNIDIMENSION_BASE_URL}/v1/agents`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${OMNIDIMENSION_API_KEY}`,
        "Content-Type": "application/json",
      },
    })

    const responseData = await response.text()

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: "OmniDimension API connection successful",
        status: response.status,
        api_accessible: true,
      })
    } else {
      return NextResponse.json({
        success: false,
        error: `API Error: ${response.status} ${response.statusText}`,
        response_body: responseData,
        api_accessible: false,
      })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      api_accessible: false,
      network_error: true,
    })
  }
}

// Test webhook endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("Test webhook received:", body)

    return NextResponse.json({
      success: true,
      message: "Webhook test successful",
      received_data: body,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Webhook test failed",
      details: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
