import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken, createAdminToken, hashPassword, verifyPassword } from "@/lib/auth";
import { cookies } from "next/headers";
import { adminLoginSchema } from "@/lib/validation";
import { rateLimit, getClientIP } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    // Rate limiting: 5 login attempts per minute per IP
    const ip = getClientIP(req);
    const limit = rateLimit(`admin-login:${ip}`, 5, 60 * 1000);
    
    if (!limit.success) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((limit.resetTime - Date.now()) / 1000)) } }
      );
    }
    
    const body = await req.json();
    
    // Validate input with Zod
    const result = adminLoginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.issues },
        { status: 400 }
      );
    }
    
    const { email, password } = result.data;
    
    // Find admin
    const admin = await prisma.admin.findUnique({
      where: { email },
    });
    
    if (!admin || !verifyPassword(password, admin.password)) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
    
    // Create JWT token
    const token = await createAdminToken({
      adminId: admin.id,
      email: admin.email,
    });
    
    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });
    
    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
