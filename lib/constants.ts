export const APP_NAME = "SuperNova";
export const HACKATHON_YEAR = "2026";
export const HACKATHON_TITLE = `${APP_NAME} ${HACKATHON_YEAR}`;
export const HACKATHON_EVENT_NAME = `${HACKATHON_TITLE} Hackathon`;

export const DEFAULT_APP_URL = "http://localhost:3000";

export const PAYMENT_AMOUNT_INR = 1000;
export const PAYMENT_UPI_ID = "bichitrabehera.345@okhdfcbank";

export const REGISTRATION_TITLE = "Register your team";
export const REGISTRATION_SUBTITLE = "One form, one PPT, one submission.";
export const PAYMENT_TITLE = "Payment Portal";
export const ADMIN_TITLE = "Team Management";
export const ADMIN_SUBTITLE = "Review teams, open PPTs, and confirm payment.";

export const ADMIN_ACTION_APPROVE = "Approve";
export const ADMIN_ACTION_REJECT = "Reject";
export const ADMIN_ACTION_VIEW_PPT = "View PPT";
export const ADMIN_ACTION_VIEW_PROOF = "View Proof";
export const ADMIN_ACTION_CONFIRM_PAYMENT = "Confirm Paid";

export const SUBJECT_APPLICATION_RECEIVED = `Application Received - ${HACKATHON_TITLE}`;
export const SUBJECT_REJECTED = `${HACKATHON_TITLE} - Application Update`;
export const SUBJECT_SELECTED = `Your team was selected - complete payment for ${HACKATHON_TITLE}`;
export const SUBJECT_PAYMENT_CONFIRMED = `Payment confirmed - dashboard access for ${HACKATHON_TITLE}`;

export const REGISTRATION_STEPS = [
  "Fill complete team details with PPT",
  "Submit application for review",
  "Wait for selection and credentials",
];

export const PAYMENT_STEPS = [
  "Pay using provided UPI details",
  "Upload payment proof screenshot",
  "Admin confirms and enables dashboard",
];

export const STATUS_MESSAGES = {
  SUBMITTED: "Application received - Under review",
  UNDER_REVIEW: "Our team is reviewing your application",
  SELECTED: "Congratulations! Complete payment to confirm",
  REJECTED: "Application not selected for this event",
  PAID: "Payment confirmed - Dashboard access granted",
};

export const ADMIN_STEPS = [
  "Review team applications with PPTs",
  "Select qualified teams",
  "Teams receive payment link automatically",
  "Admin confirms payment proof",
];

export function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || DEFAULT_APP_URL;
}
