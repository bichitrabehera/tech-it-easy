import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, FROM_EMAIL } from "@/lib/mail";
import { verifyAdminToken } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Verify admin token
    const token = req.cookies.get("admin_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const admin = await verifyAdminToken(token);
    if (!admin) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    
    const { type } = await req.json();
    
    const team = await prisma.team.findUnique({
      where: { id },
    });
    
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }
    
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    
    let subject = "";
    let html = "";
    
    const magicLink = `${appUrl}/verify?token=${team.magicToken}`;

    if (type === "selected") {
      subject = "Congratulations! Your Team is Selected for SuperNova 2026";
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; padding: 40px; color: #111827;">
          <h2 style="color: #16a34a; font-size: 24px; margin-bottom: 16px;">Congratulations ${team.leaderName}!</h2>
          <p style="font-size: 16px; line-height: 1.5;">Great news! Your team <strong>${team.teamName}</strong> has been selected for the SuperNova 2026 Hackathon.</p>
          
          <div style="background: #f9fafb; padding: 24px; border-radius: 8px; margin: 24px 0; border: 1px solid #f3f4f6;">
            <h3 style="margin-top: 0; color: #111827; font-size: 18px;">Next Steps:</h3>
            <ol style="margin-bottom: 0; padding-left: 20px; line-height: 1.6;">
              <li>Complete the registration fee payment (₹500 per team)</li>
              <li>Keep your payment screenshot/proof ready</li>
              <li>Login to your dashboard to confirm your registration</li>
            </ol>
          </div>

          <div style="background: #ecfdf5; padding: 24px; border-radius: 8px; margin: 24px 0; border: 1px solid #d1fae5; text-align: center;">
            <h3 style="margin-top: 0; color: #065f46; font-size: 18px;">Payment Details</h3>
            <p style="font-size: 20px; font-weight: bold; margin: 8px 0;">Amount: ₹500</p>
            <p style="font-size: 16px; color: #065f46; margin-bottom: 16px;">UPI ID: <strong>bichitrabehera.345@okhdfcbank</strong></p>
            
            <a href="https://rzp.io/rzp/8rg7KtzH" 
               target="_blank"
               style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Pay via Razorpay / UPI
            </a>
            <p style="font-size: 12px; color: #6b7280; margin-top: 12px;">(Debit/Credit Cards, Netbanking & UPI supported)</p>
          </div>

          <div style="text-align: center; margin-top: 32px;">
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 12px;">To complete your registration or upload proof, use this link:</p>
            <a href="${magicLink}" 
               style="background: #111827; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500;">
              Access Dashboard
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
          <p style="color: #6b7280; font-size: 12px; text-align: center;">
            SuperNova 2026 Hackathon<br>
            April 29-30, 2026
          </p>
        </div>
      `;
    } else if (type === "rejected") {
      subject = "SuperNova 2026 - Application Update";
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Hello ${team.leaderName},</h2>
          <p>Thank you for your interest in SuperNova 2026 Hackathon.</p>
          <p>After careful review, we regret to inform you that your team <strong>${team.teamName}</strong> was not selected for this year's event.</p>
          <p>We encourage you to apply again next year and wish you the best in your future endeavors.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            SuperNova 2026 Hackathon
          </p>
        </div>
      `;
    } else if (type === "payment_confirmed") {
      subject = "Payment Confirmed - Welcome to SuperNova 2026";
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; padding: 40px; color: #111827;">
          <h2 style="color: #16a34a; font-size: 24px; margin-bottom: 16px;">Payment Confirmed!</h2>
          <p style="font-size: 16px; line-height: 1.5;">Hi ${team.leaderName},</p>
          <p style="font-size: 16px; line-height: 1.5;">Your registration fee has been successfully confirmed for team <strong>${team.teamName}</strong>.</p>
          
          <div style="background: #f9fafb; padding: 24px; border-radius: 8px; margin: 24px 0; border: 1px solid #f3f4f6;">
            <p style="margin: 0; color: #111827; font-size: 16px;"><strong>Your Team ID:</strong> <code style="background: #e5e7eb; padding: 2px 6px; border-radius: 4px;">${team.id}</code></p>
            <p style="margin: 8px 0 0; color: #6b7280; font-size: 14px;">Please save this ID for event check-in.</p>
          </div>

          <div style="text-align: center; margin-top: 32px;">
            <p style="font-size: 16px; color: #111827; margin-bottom: 20px;">You can now access your dashboard to complete your team profile and GitHub details.</p>
            <a href="${magicLink}" 
               style="background: #16a34a; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; font-size: 16px;">
              Access My Dashboard
            </a>
          </div>

          <p style="font-size: 14px; color: #6b7280; margin-top: 32px; text-align: center;">See you at the event on April 29th!</p>

          <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
          <p style="color: #6b7280; font-size: 12px; text-align: center;">
            SuperNova 2026 Hackathon<br>
            April 29-30, 2026
          </p>
        </div>
      `;
    }
    
    await sendEmail({
      to: team.leaderEmail,
      subject,
      html,
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Send email error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
