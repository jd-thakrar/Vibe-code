import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { product, deals } = await request.json()

    // Generate email content
    const emailContent = generateEmailContent(product, deals)

    // In a real app, you would use a service like:
    // - Resend (free tier)
    // - EmailJS (free)
    // - SendGrid (free tier)
    // - Nodemailer with Gmail

    // For demo, we'll simulate sending
    console.log("Email would be sent:", emailContent)

    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
      emailId: `email_${Date.now()}`,
    })
  } catch (error) {
    console.error("Email send error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}

function generateEmailContent(product: string, deals: any[]) {
  const bestDeal = deals[0]
  const totalSavings = deals.reduce((sum, deal) => sum + (deal.originalPrice - deal.finalPrice), 0)

  return `
Subject: 🎯 Best Deals Found for ${product}

Hi there!

Great news! Our AI voice agent called multiple sellers and negotiated these amazing deals for ${product}:

🥇 BEST DEAL - ${bestDeal.sellerName}
💰 Final Price: $${bestDeal.finalPrice} (was $${bestDeal.originalPrice})
💵 You Save: $${bestDeal.originalPrice - bestDeal.finalPrice}
📞 Phone: ${bestDeal.phone}
🚚 Delivery: ${bestDeal.delivery}

${deals
  .slice(1)
  .map(
    (deal, index) => `
🥈 ${index === 0 ? "SECOND" : "THIRD"} BEST - ${deal.sellerName}
💰 Final Price: $${deal.finalPrice} (was $${deal.originalPrice})
💵 You Save: $${deal.originalPrice - deal.finalPrice}
📞 Phone: ${deal.phone}
🚚 Delivery: ${deal.delivery}
`,
  )
  .join("")}

💡 RECOMMENDATION:
Call ${bestDeal.sellerName} at ${bestDeal.phone} - they offered the best negotiated price!

📊 SUMMARY:
• Total sellers called: ${deals.length}
• Total savings negotiated: $${totalSavings}
• Best price: $${bestDeal.finalPrice}

All prices were negotiated by our AI voice agent in real-time!

Happy shopping!
AI Voice Deal Finder Team

---
Generated on ${new Date().toLocaleDateString()}
  `.trim()
}
