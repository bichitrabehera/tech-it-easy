// Force re-build: 2026-04-08-01
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";
import { verifyAdminToken } from "@/lib/auth";
import {
  HACKATHON_EVENT_NAME,
  PAYMENT_AMOUNT_INR,
  PAYMENT_UPI_ID,
  SUBJECT_PAYMENT_CONFIRMED,
  SUBJECT_REJECTED,
  SUBJECT_SELECTED,
  getAppUrl,
} from "@/lib/constants";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
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

    const appUrl = getAppUrl();

    let subject = "";
    let html = "";

    if (type === "selected") {
      const upiUri = `upi://pay?pa=${PAYMENT_UPI_ID}&pn=${encodeURIComponent(HACKATHON_EVENT_NAME)}&am=${PAYMENT_AMOUNT_INR}&cu=INR`;
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUri)}`;

      subject = SUBJECT_SELECTED;
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; padding: 40px; color: #111827;">
          <h2 style="color: #16a34a; font-size: 24px; margin-bottom: 16px;">Congratulations ${team.leaderName}!</h2>
          <p style="font-size: 16px; line-height: 1.5;">Your team <strong>${team.teamName}</strong> has been selected for the ${HACKATHON_EVENT_NAME}.</p>
          
          <div style="background: #f9fafb; padding: 24px; border-radius: 8px; margin: 24px 0; border: 1px solid #f3f4f6;">
            <h3 style="margin-top: 0; color: #111827; font-size: 18px;">Dashboard Access:</h3>
            <p style="margin: 8px 0; font-size: 16px;"><strong>Email ID:</strong> ${team.leaderEmail}</p>
            <p style="margin: 8px 0; font-size: 16px;"><strong>Login Password:</strong> <code style="background: #fee2e2; color: #dc2626; padding: 2px 6px; border-radius: 4px; font-weight: bold;">${team.password}</code></p>
          </div>

          <div style="background: #ecfdf5; padding: 24px; border-radius: 8px; margin: 24px 0; border: 1px solid #d1fae5; text-align: center;">
            <h3 style="margin-top: 0; color: #065f46; font-size: 18px;">Scan to Pay: ₹${PAYMENT_AMOUNT_INR}</h3>
            
            <img src="${qrCodeUrl}" alt="UPI QR Code" style="width: 200px; height: 200px; margin: 20px 0; border: 4px solid white; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
            
            <p style="font-size: 14px; color: #065f46; margin: 12px 0;">Alternatively, pay to: <strong>${PAYMENT_UPI_ID}</strong></p>
            
            <hr style="border: none; border-top: 1px solid #d1fae5; margin: 20px 0;">
            
            <p style="font-size: 14px; color: #065f46; margin-bottom: 16px;">Once paid, log in to your dashboard to upload the screenshot for verification.</p>
            <a href="${appUrl}/login" 
               style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Access My Dashboard
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
          <p style="color: #6b7280; font-size: 12px; text-align: center;">
            ${HACKATHON_EVENT_NAME}<br>
            April 29-30, 2026
          </p>
        </div>
      `;
    } else if (type === "rejected") {
      subject = SUBJECT_REJECTED;
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Hello ${team.leaderName},</h2>
          <p>Thank you for your interest in ${HACKATHON_EVENT_NAME}.</p>
          <p>After careful review, we regret to inform you that your team <strong>${team.teamName}</strong> was not selected for this year's event.</p>
          <p>We encourage you to apply again next year and wish you the best in your future endeavors.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            ${HACKATHON_EVENT_NAME}
          </p>
        </div>
      `;
    } else if (type === "payment_confirmed") {
      subject = "Payment Verified - Welcome to Supernova!";
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; padding: 40px; color: #111827; text-align: center;">
          <div style="font-size: 50px; margin-bottom: 20px;">🚀</div>
          <h2 style="color: #16a34a; font-size: 28px; margin-bottom: 16px;">Registration Confirmed!</h2>
          <p style="font-size: 18px; line-height: 1.5; font-weight: bold;">See you at the ${HACKATHON_EVENT_NAME}!</p>
          <p style="font-size: 16px; line-height: 1.5; color: #4b5563;">Hi ${team.leaderName}, your payment for team <strong>${team.teamName}</strong> has been successfully verified.</p>
          
          <div style="background: #f9fafb; padding: 24px; border-radius: 8px; margin: 24px 0; border: 1px solid #f3f4f6; text-align: left;">
            <p style="margin: 0; color: #111827; font-size: 16px;"><strong>Team ID:</strong> <code style="background: #e5e7eb; padding: 2px 6px; border-radius: 4px;">${team.id}</code></p>
            <p style="margin: 8px 0 0; color: #6b7280; font-size: 14px;">Keep this ID handy for check-in on April 29th.</p>
          </div>

          <a href="${appUrl}/dashboard" 
             style="background: #111827; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; font-size: 16px; margin-top: 20px;">
            Go to My Dashboard
          </a>

          <p style="font-size: 14px; color: #6b7280; margin-top: 40px;">
            Get ready for an epic 24 hours of building.<br>
            <strong>April 29-30, 2026</strong>
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
      { status: 500 },
    );
  }
}
