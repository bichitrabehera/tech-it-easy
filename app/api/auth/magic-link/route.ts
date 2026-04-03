import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend, FROM_EMAIL } from "@/lib/resend";
import { generateMagicToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
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
    
    // Generate new magic token
    const magicToken = generateMagicToken();
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    await prisma.team.update({
      where: { id: team.id },
      data: { magicToken, tokenExpiry },
    });
    
    // Send magic link email
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const magicLink = `${appUrl}/verify?token=${magicToken}`;
    
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Your SuperNova Hackathon Login Link",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">SuperNova 2026 - Login Link</h2>
          <p>Hi ${team.leaderName},</p>
          <p>Click the button below to access your team dashboard:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${magicLink}" 
               style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Access Dashboard
            </a>
          </div>
          <p>Or copy this link: <a href="${magicLink}">${magicLink}</a></p>
          <p style="color: #666; font-size: 14px;">This link expires in 24 hours.</p>
        </div>
      `,
    });
    
    return NextResponse.json({
      success: true,
      message: "Magic link sent to your email!",
    });
    
  } catch (error) {
    console.error("Magic link error:", error);
    return NextResponse.json(
      { error: "Failed to send magic link" },
      { status: 500 }
    );
  }
}
