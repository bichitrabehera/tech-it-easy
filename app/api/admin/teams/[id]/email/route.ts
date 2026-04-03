import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend, FROM_EMAIL } from "@/lib/resend";
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
    
    if (type === "selected") {
      subject = "Congratulations! Your Team is Selected for SuperNova 2026";
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Congratulations ${team.leaderName}!</h2>
          <p>Great news! Your team <strong>${team.teamName}</strong> has been selected for SuperNova 2026 Hackathon.</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Next Steps:</h3>
            <ol>
              <li>Complete the registration fee payment</li>
              <li>Upload payment proof in your dashboard</li>
              <li>Wait for payment confirmation</li>
            </ol>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${appUrl}/dashboard" 
               style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Go to Dashboard
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">Event: April 29-30, 2026</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            SuperNova 2026 Hackathon
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
      subject = "Payment Confirmed - Your ID Pass for SuperNova 2026";
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Payment Confirmed!</h2>
          <p>Hi ${team.leaderName},</p>
          <p>Your registration fee has been confirmed for <strong>${team.teamName}</strong>.</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Your Team ID: <code>${team.id}</code></h3>
            <p>Please save this ID and bring it to the event.</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${appUrl}/dashboard" 
               style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Complete Your Profile
            </a>
          </div>
          <p>Please add your GitHub ID and complete your profile in the dashboard.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            SuperNova 2026 Hackathon<br>
            April 29-30, 2026
          </p>
        </div>
      `;
    }
    
    await resend.emails.send({
      from: FROM_EMAIL,
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
