import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { seller, product, callIndex } = await request.json()

    // Check if we have real Twilio credentials
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const fromNumber = process.env.TWILIO_PHONE_NUMBER

    if (!accountSid || !authToken || !fromNumber) {
      // Demo mode - simulate the call
      return simulateVoiceCall(seller, product, callIndex)
    }

    // Real Twilio call
    const callId = await makeRealTwilioCall(seller, product, accountSid, authToken, fromNumber)

    return NextResponse.json({
      success: true,
      callId: callId,
      mode: "real",
      seller: seller.name,
    })
  } catch (error) {
    console.error("Voice call error:", error)

    // Fallback to simulation
    return simulateVoiceCall(
      await request.json().then((r) => r.seller),
      await request.json().then((r) => r.product),
      await request.json().then((r) => r.callIndex),
    )
  }
}

async function makeRealTwilioCall(
  seller: any,
  product: string,
  accountSid: string,
  authToken: string,
  fromNumber: string,
) {
  // Create TwiML for the call
  const twiml = generateTwiML(seller, product)

  // Make the actual Twilio call
  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Calls.json`, {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      To: seller.phone,
      From: fromNumber,
      Twiml: twiml,
    }),
  })

  const callData = await response.json()
  return callData.sid
}

function generateTwiML(seller: any, product: string) {
  // Generate TwiML for AI voice conversation
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">
    Hello, this is Alex from DealFinder AI. I'm calling about ${product}. Do you have it available?
  </Say>
  <Pause length="3"/>
  <Say voice="alice">
    What's your current price for this item?
  </Say>
  <Pause length="3"/>
  <Say voice="alice">
    Is there any flexibility on the price for immediate purchase?
  </Say>
  <Pause length="3"/>
  <Say voice="alice">
    Thank you for your time. I'll include this in my comparison.
  </Say>
  <Hangup/>
</Response>`
}

async function simulateVoiceCall(seller: any, product: string, callIndex: number) {
  // Simulate a realistic call with negotiated pricing
  const originalPrice = seller.price
  const negotiatedPrice = originalPrice - Math.floor(Math.random() * 50) - 10

  const deal = {
    sellerName: seller.name,
    phone: seller.phone,
    website: seller.website,
    originalPrice: originalPrice,
    finalPrice: negotiatedPrice,
    delivery: seller.delivery,
    negotiated: true,
    callDuration: Math.floor(Math.random() * 180) + 60, // 1-4 minutes
    timestamp: new Date().toISOString(),
  }

  // Simulate call delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  return NextResponse.json({
    success: true,
    callId: `sim_${Date.now()}_${callIndex}`,
    mode: "simulation",
    deal: deal,
    seller: seller.name,
  })
}
