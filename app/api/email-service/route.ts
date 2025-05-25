import { type NextRequest, NextResponse } from "next/server"

// Simple email service using free EmailJS or similar
export async function POST(request: NextRequest) {
  try {
    const { to, subject, content, deals, product } = await request.json()

    // For demo purposes, we'll simulate email sending
    // In production, you can use EmailJS (free), Resend (free tier), or similar

    const emailData = {
      to: to || "customer@example.com",
      subject: subject || `🎯 Best Deals Found for ${product?.name}`,
      content,
      deals,
      timestamp: new Date().toISOString(),
      status: "sent",
    }

    // Store email in our simple storage
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/simple-storage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "email",
        payload: emailData,
      }),
    })

    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
      email_id: `email_${Date.now()}`,
    })
  } catch (error) {
    console.error("Email service error:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
