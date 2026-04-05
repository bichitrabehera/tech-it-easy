import { z } from "zod";

// Email validation
export const emailSchema = z.string().email("Invalid email format").min(1, "Email is required");

// Team registration validation
export const teamRegistrationSchema = z.object({
  teamName: z.string().min(2, "Team name must be at least 2 characters").max(100, "Team name too long"),
  leaderName: z.string().min(2, "Leader name must be at least 2 characters").max(100, "Leader name too long"),
  leaderEmail: z.string().email("Invalid leader email"),
  members: z.array(
    z.object({
      name: z.string().min(2, "Member name must be at least 2 characters").max(100),
      email: z.string().email("Invalid member email"),
    })
  ).min(1, "At least one member required").max(4, "Maximum 4 members allowed"),
  pptUrl: z.string().url("Invalid PPT URL").optional(),
});

// Admin login validation
export const adminLoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

// Magic link request validation
export const magicLinkSchema = z.object({
  email: z.string().email("Invalid email format"),
});

// Team update validation (admin)
export const teamUpdateSchema = z.object({
  status: z.enum(["PENDING", "SELECTED", "REJECTED"]).optional(),
  paymentStatus: z.enum(["UNPAID", "PAID"]).optional(),
  githubId: z.string().min(1).max(39, "GitHub ID too long").optional(),
});

// File upload validation
export const fileUploadSchema = z.object({
  file: z.instanceof(File).refine(
    (file) => file.size <= 50 * 1024 * 1024,
    "File size must be less than 50MB"
  ).refine(
    (file) => ["application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.ms-powerpoint"].includes(file.type),
    "Only PPT and PPTX files are allowed"
  ),
});
