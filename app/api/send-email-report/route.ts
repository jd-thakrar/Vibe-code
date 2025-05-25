import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { product, deals, userEmail } = await request.json()

    console.log("📧 Sending professional email report for:", product)

    // Generate email content
    const emailContent = generateProfessionalEmailContent(product, deals)

    // Try to send with Resend if API key is available
    const resendApiKey = process.env.RESEND_API_KEY

    if (resendApiKey) {
      try {
        // Use Resend API
        const resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "onboarding@resend.dev", // Use Resend's default sender
            to: userEmail || "customer@example.com",
            subject: `🎯 Best Deals Found for ${product}`,
            html: generateHTMLEmail(emailContent, deals),
            text: emailContent,
          }),
        })

        if (resendResponse.ok) {
          const result = await resendResponse.json()
          return NextResponse.json({
            success: true,
            message: "Email sent successfully via Resend",
            emailId: result.id,
          })
        }
      } catch (resendError) {
        console.log("Resend error:", resendError)
      }
    }

    // Fallback: Store email data
    const emailData = {
      id: `email_${Date.now()}`,
      to: userEmail || "customer@example.com",
      subject: `🎯 Best Deals Found for ${product}`,
      content: emailContent,
      deals: deals,
      timestamp: new Date().toISOString(),
      status: "ready",
    }

    return NextResponse.json({
      success: true,
      message: "Email report generated successfully",
      emailId: emailData.id,
      note: "Add RESEND_API_KEY environment variable to enable email sending",
    })
  } catch (error) {
    console.error("Email error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process email request",
      },
      { status: 500 },
    )
  }
}

function generateProfessionalEmailContent(product: string, deals: any[]): string {
  const topDeals = deals.sort((a, b) => a.finalPrice - b.finalPrice).slice(0, 3)
  const bestDeal = topDeals[0]
  const totalSavings = deals.reduce((sum, deal) => sum + (deal.originalPrice - deal.finalPrice), 0)

  return `
🎯 AI Deal Finder Results for ${product}

Dear Customer,

Our AI voice agent successfully negotiated the best deals for ${product}:

🏆 BEST DEAL - ${bestDeal.sellerName}
💰 Price: $${bestDeal.finalPrice} (was $${bestDeal.originalPrice})
💵 Savings: $${bestDeal.originalPrice - bestDeal.finalPrice} (${bestDeal.savingsPercent}% OFF)
📞 Phone: ${bestDeal.phone}
🔗 Product: ${bestDeal.productUrl}
🚚 Delivery: ${bestDeal.delivery}

${topDeals
  .slice(1)
  .map(
    (deal, index) => `
${index === 0 ? "🥈" : "🥉"} ${deal.sellerName}
💰 Price: $${deal.finalPrice} (was $${deal.originalPrice})
💵 Savings: $${deal.originalPrice - deal.finalPrice} (${deal.savingsPercent}% OFF)
📞 Phone: ${deal.phone}
🔗 Product: ${deal.productUrl}
`,
  )
  .join("")}

📊 SUMMARY:
• Total deals found: ${deals.length}
• Best price: $${bestDeal.finalPrice}
• Total savings: $${totalSavings}

🎯 RECOMMENDATION: Choose ${bestDeal.sellerName} for the best value!

Best regards,
AI Deal Finder Team
  `.trim()
}

function generateHTMLEmail(content: string, deals: any[]): string {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>AI Deal Finder Results</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #3b82f6, #6366f1); color: white; padding: 20px; text-align: center; border-radius: 8px; }
        .deal { border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 16px 0; }
        .best-deal { border-color: #10b981; background: #f0fdf4; }
        .price { font-size: 24px; font-weight: bold; color: #10b981; }
        .button { background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 8px 4px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎯 AI Deal Finder Results</h1>
        <p>Your personalized deal report</p>
    </div>
    
    <div style="padding: 20px;">
        <div style="white-space: pre-line;">
            ${content}
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
            <a href="${deals[0]?.productUrl}" class="button">🏆 View Best Deal</a>
            <a href="tel:${deals[0]?.phone}" class="button">📞 Call Now</a>
        </div>
    </div>
</body>
</html>
  `
}
