import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyTeamToken } from "@/lib/auth";
import { imagekit } from "@/lib/imagekit";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("team_token")?.value;
    
    if (!token) {
      console.warn("Upload attempt without team_token");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const teamData = await verifyTeamToken(token);
    if (!teamData) {
      console.warn("Invalid team_token during upload");
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to buffer for ImageKit
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: `proof_${teamData.teamId}_${Date.now()}`,
      folder: "/payments",
      useUniqueFileName: true,
    });

    const fileUrl = uploadResponse.url;

    // Update DB
    await prisma.team.update({
      where: { id: teamData.teamId },
      data: { paymentProof: fileUrl },
    });

    return NextResponse.json({
      success: true,
      url: fileUrl,
    });
  } catch (error) {
    console.error("ImageKit Proof upload error:", error);
    return NextResponse.json({ error: "Upload failed via ImageKit" }, { status: 500 });
  }
}
