import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, FROM_EMAIL } from "@/lib/mail";
import { generateMagicToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    const teamName = formData.get("teamName") as string;
    const leaderName = formData.get("leaderName") as string;
    const leaderEmail = formData.get("leaderEmail") as string;
    const leaderPhone = formData.get("leaderPhone") as string;
    const membersJson = formData.get("members") as string;
    const pptUrl = formData.get("pptUrl") as string | null;
    
    if (!teamName || !leaderName || !leaderEmail || !leaderPhone) {
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
          leaderEmail,
          leaderPhone,
          pptUrl: pptUrl || existingTeam.pptUrl,
          magicToken,
          tokenExpiry,
          members: {
            deleteMany: {},
            create: members.map((member: {name: string; email: string; phone: string}) => ({ 
              name: member.name,
              email: member.email,
              phone: member.phone
            })),
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
          leaderPhone,
          pptUrl,
          magicToken,
          tokenExpiry,
          members: {
            create: members.map((member: {name: string; email: string; phone: string}) => ({ 
              name: member.name,
              email: member.email,
              phone: member.phone
            })),
          },
        },
        include: { members: true },
      });
    }
    
    // Send magic link email
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const magicLink = `${appUrl}/verify?token=${magicToken}`;
    
    try {
      await sendEmail({
        to: leaderEmail,
        subject: "Application Received - SuperNova 2026",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; padding: 40px; color: #111827;">
            <h2 style="color: #dc2626; font-size: 24px; margin-bottom: 16px;">Application Received!</h2>
            <p style="font-size: 16px; line-height: 1.5;">Hi ${leaderName},</p>
            <p style="font-size: 16px; line-height: 1.5;">Thank you for registering your team <strong>${teamName}</strong> for the SuperNova 2026 Hackathon.</p>
            
            <div style="background: #fef2f2; padding: 24px; border-radius: 8px; margin: 24px 0; border: 1px solid #fee2e2;">
              <p style="margin: 0; color: #991b1b; font-weight: 500;">Status: Under Review</p>
              <p style="margin: 8px 0 0; color: #7f1d1d; font-size: 14px;">Our team is currently reviewing your application. You will receive an email if your team is selected for the next round.</p>
            </div>

            <p style="font-size: 14px; color: #6b7280;">No further action is required from your side at this moment.</p>

            <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
            <p style="color: #6b7280; font-size: 12px; text-align: center;">
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
