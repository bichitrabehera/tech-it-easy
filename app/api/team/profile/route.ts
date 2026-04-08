import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyTeamToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("team_token")?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const teamData = await verifyTeamToken(token);
    if (!teamData) {
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      );
    }
    
    const { githubId, githubRepo } = await req.json();
    
    const team = await prisma.team.update({
      where: { id: teamData.teamId },
      data: { 
        githubId, 
        githubRepo 
      },
    });
    
    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      team: {
        githubId: team.githubId,
        githubRepo: team.githubRepo
      }
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
