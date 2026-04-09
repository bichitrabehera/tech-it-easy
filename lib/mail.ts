import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: true, // protocol 465 is secure
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const FROM_EMAIL = process.env.FROM_EMAIL
const EMAILS_DISABLED = process.env.DISABLE_EMAILS === "true";

export const sendEmail = async ({ to, subject, html }: { to: string; subject: string; html: string }) => {
  if (EMAILS_DISABLED) {
    console.log(`[mail] Skipped email (DISABLE_EMAILS/NON_PROD): to=${to}, subject=${subject}`);
    return { success: true, messageId: "disabled-in-testing" };
  }

  try {
    const info = await transporter.sendMail({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });
    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
