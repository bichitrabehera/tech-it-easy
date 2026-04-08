import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
    
    return NextResponse.json({
      success: true,
      team: {
        id: team.id,
        teamName: team.teamName,
        leaderEmail: team.leaderEmail,
        status: team.status,
      },
      message: "Registration successful! Wait for selection and credentials from admin.",
    });
    
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register team" },
      { status: 500 }
    );
  }
}
