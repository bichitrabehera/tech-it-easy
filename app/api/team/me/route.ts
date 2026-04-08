import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("team_token")?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { verifyTeamToken } = await import("@/lib/auth");
    const payload = await verifyTeamToken(token);
    
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      );
    }
    
    const team = await prisma.team.findUnique({
      where: { id: payload.teamId },
      include: { members: true },
    });
    
    if (!team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      team: {
        id: team.id,
        teamName: team.teamName,
        leaderName: team.leaderName,
        leaderEmail: team.leaderEmail,
        pptUrl: team.pptUrl,
        status: team.status,
        members: team.members,
        githubId: team.githubId,
        githubRepo: team.githubRepo,
        idProofUrl: team.idProofUrl,
        paymentStatus: team.paymentStatus,
        paymentProof: team.paymentProof,
        createdAt: team.createdAt,
      },
    });
  } catch (error) {
    console.error("Get team error:", error);
    return NextResponse.json(
      { error: "Failed to fetch team" },
      { status: 500 }
    );
  }
}
