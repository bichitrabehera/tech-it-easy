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

    if (team.status === "PENDING") {
      return NextResponse.json(
        { error: "Your team is still under review" },
        { status: 403 }
      );
    }

    if (team.status === "REJECTED") {
      return NextResponse.json(
        { error: "Your team was not selected" },
        { status: 403 }
      );
    }
    
    // Check if token is expired
    if (team.tokenExpiry && new Date() > team.tokenExpiry) {
      return NextResponse.json(
        { error: "Token expired" },
        { status: 401 }
      );
    }
    
    // Invalidate the magic token after successful use (security best practice)
    // Generate a new session token for the cookie
    const { generateMagicToken } = await import("@/lib/auth");
    const sessionToken = generateMagicToken();
    const sessionExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    
    // Update team with new session token, invalidate magic token
    await prisma.team.update({
      where: { id: team.id },
      data: { 
        magicToken: sessionToken,
        tokenExpiry: sessionExpiry 
      },
    });
    
    // Set session cookie with new token
    const cookieStore = await cookies();
    cookieStore.set("team_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });
    
    return NextResponse.json({
      success: true,
      nextRoute: team.paymentStatus === "PAID" ? "/dashboard" : "/payment",
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
