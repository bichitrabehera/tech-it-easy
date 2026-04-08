import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

if (!process.env.ADMIN_JWT_SECRET) {
  throw new Error("ADMIN_JWT_SECRET environment variable is required");
}

const ADMIN_JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET
);

const TEAM_JWT_SECRET = new TextEncoder().encode(
  process.env.TEAM_JWT_SECRET || process.env.ADMIN_JWT_SECRET
);

export interface AdminTokenPayload {
  adminId: string;
  email: string;
}

export interface TeamTokenPayload {
  teamId: string;
  leaderEmail: string;
}

export async function verifyAdminToken(token: string): Promise<AdminTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, ADMIN_JWT_SECRET);
    return {
      adminId: payload.adminId as string,
      email: payload.email as string,
    };
  } catch {
    return null;
  }
}

export async function createAdminToken(payload: AdminTokenPayload): Promise<string> {
  return new SignJWT({ adminId: payload.adminId, email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(ADMIN_JWT_SECRET);
}

export async function verifyTeamToken(token: string): Promise<TeamTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, TEAM_JWT_SECRET);
    return {
      teamId: payload.teamId as string,
      leaderEmail: payload.leaderEmail as string,
    };
  } catch {
    return null;
  }
}

export async function createTeamToken(payload: TeamTokenPayload): Promise<string> {
  return new SignJWT({ teamId: payload.teamId, leaderEmail: payload.leaderEmail })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(TEAM_JWT_SECRET);
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password: string, hashed: string): boolean {
  return bcrypt.compareSync(password, hashed);
}

export function generateMagicToken(): string {
  return randomBytes(32).toString("hex");
}
