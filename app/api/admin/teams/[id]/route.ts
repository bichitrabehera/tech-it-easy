import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Verify admin token
    const token = req.cookies.get("admin_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const admin = await verifyAdminToken(token);
    if (!admin) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    
    const { status, paymentStatus, githubId } = await req.json();
    
    const updateData: {
      status?: "PENDING" | "SELECTED" | "REJECTED";
      paymentStatus?: "UNPAID" | "PAID";
      githubId?: string;
    } = {};
    if (status) updateData.status = status as "PENDING" | "SELECTED" | "REJECTED";
    if (paymentStatus) updateData.paymentStatus = paymentStatus as "UNPAID" | "PAID";
    if (githubId) updateData.githubId = githubId;
    
    const team = await prisma.team.update({
      where: { id },
      data: updateData,
      include: { members: true },
    });
    
    return NextResponse.json({ team });
  } catch (error) {
    console.error("Update team error:", error);
    return NextResponse.json(
      { error: "Failed to update team" },
      { status: 500 }
    );
  }
}
