import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    // Verify admin token
    const token = req.cookies.get("admin_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const admin = await verifyAdminToken(token);
    if (!admin) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") as string | undefined;
    
    const teams = await prisma.team.findMany({
      where: status ? { status: status as "PENDING" | "SELECTED" | "REJECTED" } : undefined,
      include: { members: true },
      orderBy: { createdAt: "desc" },
    });
    
    return NextResponse.json({ teams });
  } catch (error) {
    console.error("Get teams error:", error);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 }
    );
  }
}
