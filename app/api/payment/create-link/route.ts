import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getRazorpayPaymentUrl } from "@/lib/payment";
import { PAYMENT_AMOUNT_INR } from "@/lib/constants";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("team_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const team = await prisma.team.findUnique({
      where: { magicToken: token },
    });

    if (!team) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    if (team.status !== "SELECTED") {
      return NextResponse.json({ error: "Team is not selected" }, { status: 403 });
    }

    if (team.paymentStatus === "PAID") {
      return NextResponse.json({ error: "Payment already completed" }, { status: 400 });
    }

    const paymentUrl = getRazorpayPaymentUrl();

    return NextResponse.json({
      success: true,
      paymentUrl,
      amount: PAYMENT_AMOUNT_INR,
    });
  } catch (error) {
    console.error("Create payment link error:", error);
    return NextResponse.json({ error: "Failed to create payment link" }, { status: 500 });
  }
}
