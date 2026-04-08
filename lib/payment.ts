import crypto from "crypto";
import { DEFAULT_RAZORPAY_PAYMENT_URL } from "@/lib/constants";

const RAZORPAY_API = "https://api.razorpay.com/v1";

type CreatePaymentLinkInput = {
  teamId: string;
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  amountInRupees: number;
  callbackUrl: string;
};

function getRazorpayCredentials() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are required");
  }

  return { keyId, keySecret };
}

export async function createRazorpayPaymentLink(input: CreatePaymentLinkInput) {
  const { keyId, keySecret } = getRazorpayCredentials();

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const amountInPaise = Math.round(input.amountInRupees * 100);

  const response = await fetch(`${RAZORPAY_API}/payment_links`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: amountInPaise,
      currency: "INR",
      accept_partial: false,
      description: `SuperNova 2026 registration - ${input.teamName}`,
      customer: {
        name: input.leaderName,
        email: input.leaderEmail,
      },
      notify: {
        email: true,
      },
      reminder_enable: true,
      callback_url: `${input.callbackUrl}?payment_id={{payment_id}}&status={{status}}`,
      callback_method: "get",
      notes: {
        teamId: input.teamId,
        teamName: input.teamName,
        leaderEmail: input.leaderEmail,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Razorpay payment link error: ${errorText}`);
  }

  return response.json();
}

export function getRazorpayPaymentUrl() {
  return process.env.RAZORPAY_PAYMENT_URL || DEFAULT_RAZORPAY_PAYMENT_URL;
}

export function verifyRazorpayWebhookSignature(payload: string, signature: string) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("RAZORPAY_WEBHOOK_SECRET is required");
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  const left = Buffer.from(expected, "utf8");
  const right = Buffer.from(signature || "", "utf8");

  if (left.length !== right.length) {
    return false;
  }

  return crypto.timingSafeEqual(left, right);
}
