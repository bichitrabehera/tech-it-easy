import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";
import { generateMagicToken } from "@/lib/auth";
import { rateLimit, getClientIP } from "@/lib/rate-limit";
import { HACKATHON_TITLE, getAppUrl } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    // Rate limiting: 3 requests per minute per IP
    const ip = getClientIP(req);
    const limit = rateLimit(`magic-link:${ip}`, 3, 60 * 1000);
    
    if (!limit.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((limit.resetTime - Date.now()) / 1000)) } }
      );
    }
    
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }
    
    const team = await prisma.team.findUnique({
      where: { leaderEmail: email },
    });
    
    if (!team) {
      return NextResponse.json(
        { error: "No team found with this email" },
        { status: 404 }
      );
    }

    if (team.status !== "SELECTED") {
      return NextResponse.json(
        { error: "Your team is not eligible for dashboard access yet" },
        { status: 403 }
      );
    }

    // Generate new magic token
    const magicToken = generateMagicToken();
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    await prisma.team.update({
      where: { id: team.id },
      data: { magicToken, tokenExpiry },
    });
    
    // Send access link email
    const appUrl = getAppUrl();
    const magicLink = `${appUrl}/verify?token=${magicToken}`;

    const isPaid = team.paymentStatus === "PAID";
    const subject = isPaid
      ? "Your SuperNova dashboard access link"
      : "Your SuperNova payment portal link";
    const heading = isPaid
      ? "Dashboard Access"
      : "Payment Portal Access";
    const bodyCopy = isPaid
      ? "Your payment has been verified. Use the button below to open your dashboard."
      : "Your team has been selected. Use the button below to open the payment portal and complete payment.";
    
    await sendEmail({
      to: email,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">${HACKATHON_TITLE} - ${heading}</h2>
          <p>Hi ${team.leaderName},</p>
          <p>${bodyCopy}</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${magicLink}" 
               style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              ${isPaid ? "Open Dashboard" : "Open Payment Portal"}
            </a>
          </div>
          <p>Or copy this link: <a href="${magicLink}">${magicLink}</a></p>
          <p style="color: #666; font-size: 14px;">This link expires in 24 hours.</p>
        </div>
      `,
    });
    
    return NextResponse.json({
      success: true,
      message: isPaid
        ? "Dashboard access link sent to your email!"
        : "Payment portal link sent to your email!",
    });
    
  } catch (error) {
    console.error("Magic link error:", error);
    return NextResponse.json(
      { error: "Failed to send magic link" },
      { status: 500 }
    );
  }
}
