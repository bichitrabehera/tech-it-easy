import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    
    if (!token) {
      return NextResponse.json(
        { error: "Missing token" },
        { status: 400 }
      );
    }
    
    const team = await prisma.team.findUnique({
      where: { magicToken: token },
      include: { members: true },
    });
    
    if (!team) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }
    
    // Check if token is expired
    if (team.tokenExpiry && new Date() > team.tokenExpiry) {
      return NextResponse.json(
        { error: "Token expired" },
        { status: 401 }
      );
    }
    
    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set("team_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });
    
    return NextResponse.json({
      success: true,
      team: {
        id: team.id,
        teamName: team.teamName,
        leaderName: team.leaderName,
        leaderEmail: team.leaderEmail,
        pptUrl: team.pptUrl,
        status: team.status,
        members: team.members,
        githubId: team.githubId,
        paymentStatus: team.paymentStatus,
      },
    });
    
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json(
      { error: "Failed to verify token" },
      { status: 500 }
    );
  }
}
