import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/auth";
import Papa from "papaparse";

type ExportTeam = {
  id: string;
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  members: { name: string }[];
  status: string;
  pptUrl: string | null;
  paymentStatus: string;
  githubId: string | null;
  createdAt: Date;
};

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
    
    // Flatten data for CSV
    const csvData = teams.map((team: ExportTeam) => ({
      id: team.id,
      teamName: team.teamName,
      leaderName: team.leaderName,
      leaderEmail: team.leaderEmail,
      members: team.members.map(m => m.name).join("; "),
      status: team.status,
      pptUrl: team.pptUrl || "",
      paymentStatus: team.paymentStatus,
      githubId: team.githubId || "",
      createdAt: team.createdAt.toISOString(),
    }));
    
    const csv = Papa.unparse(csvData);
    
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="teams-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Failed to export teams" },
      { status: 500 }
    );
  }
}
