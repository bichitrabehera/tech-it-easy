import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend, FROM_EMAIL } from "@/lib/resend";
import { generateMagicToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    const teamName = formData.get("teamName") as string;
    const leaderName = formData.get("leaderName") as string;
    const leaderEmail = formData.get("leaderEmail") as string;
    const membersJson = formData.get("members") as string;
    const pptUrl = formData.get("pptUrl") as string | null;
    
    if (!teamName || !leaderName || !leaderEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    const members = membersJson ? JSON.parse(membersJson) : [];
    
    // Check if email already exists (prevent duplicates - update instead of create)
    const existingTeam = await prisma.team.findUnique({
      where: { leaderEmail },
    });
    
    let team;
    const magicToken = generateMagicToken();
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    if (existingTeam) {
      // Update existing team
      team = await prisma.team.update({
        where: { id: existingTeam.id },
        data: {
          teamName,
          leaderName,
          pptUrl: pptUrl || existingTeam.pptUrl,
          magicToken,
          tokenExpiry,
          members: {
            deleteMany: {},
            create: members.map((name: string) => ({ name })),
          },
        },
        include: { members: true },
      });
    } else {
      // Create new team
      team = await prisma.team.create({
        data: {
          teamName,
          leaderName,
          leaderEmail,
          pptUrl,
          magicToken,
          tokenExpiry,
          members: {
            create: members.map((name: string) => ({ name })),
          },
        },
        include: { members: true },
      });
    }
    
    // Send magic link email
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const magicLink = `${appUrl}/verify?token=${magicToken}`;
    
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: leaderEmail,
        subject: "Your SuperNova Hackathon Magic Link",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">Welcome to SuperNova 2026!</h2>
            <p>Hi ${leaderName},</p>
            <p>Your team <strong>${teamName}</strong> has been registered successfully.</p>
            <p>Click the button below to access your dashboard and manage your submission:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${magicLink}" 
                 style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Access Your Dashboard
              </a>
            </div>
            <p>Or copy this link: <a href="${magicLink}">${magicLink}</a></p>
            <p style="color: #666; font-size: 14px;">This link expires in 24 hours.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">
              SuperNova 2026 Hackathon<br>
              April 29-30, 2026
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      // Continue even if email fails - we can resend later
    }
    
    return NextResponse.json({
      success: true,
      team: {
        id: team.id,
        teamName: team.teamName,
        leaderEmail: team.leaderEmail,
        status: team.status,
      },
      message: "Registration successful! Check your email for the magic link.",
    });
    
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register team" },
      { status: 500 }
    );
  }
}
