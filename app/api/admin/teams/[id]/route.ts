// Force re-build: 2026-04-08-01
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log(`[API] Received update request for team: ${id}`);
    
    // Verify admin token
    const token = req.cookies.get("admin_token")?.value;
    if (!token) {
      console.warn(`[API] Unauthorized: Missing admin_token`);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const admin = await verifyAdminToken(token);
    if (!admin) {
      console.warn(`[API] Invalid admin token attempted`);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    
    const { status, paymentStatus, githubId } = await req.json();
    
    const updateData: {
      status?: "PENDING" | "SELECTED" | "REJECTED";
      paymentStatus?: "UNPAID" | "PAID";
      githubId?: string;
      password?: string;
      paymentLink?: string;
    } = {};
    if (status) updateData.status = status as "PENDING" | "SELECTED" | "REJECTED";
    if (paymentStatus) updateData.paymentStatus = paymentStatus as "UNPAID" | "PAID";
    if (githubId) updateData.githubId = githubId;

    // Generate random password and unique payment link if selected
    if (status === "SELECTED") {
      // 1. Password generation
      const characters = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
      let randomPassword = "";
      for (let i = 0; i < 10; i++) {
        randomPassword += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      updateData.password = randomPassword;
    }
    
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
