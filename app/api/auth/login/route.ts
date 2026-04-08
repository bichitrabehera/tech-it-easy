import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createTeamToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    // Find team by email and password
    const team = await prisma.team.findFirst({
      where: {
        leaderEmail: email,
        password: password, // In a real app, use hashed passwords. Following user requirement for random password.
      },
    });

    if (!team) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Create token
    const token = await createTeamToken({
      teamId: team.id,
      leaderEmail: team.leaderEmail,
    });

    // Set cookie
    const response = NextResponse.json({ success: true, teamId: team.id });
    response.cookies.set("team_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
