import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth/minimal";
import { emailOTP } from "better-auth/plugins";

import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import authConfig from "./auth.config";

const siteUrl = process.env.SITE_URL || "http://localhost:3000";
const trustedOriginsList = Array.from(
  new Set(
    [
      siteUrl,
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3001",
      "http://127.0.0.1:3002",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5174",
      process.env.ADMIN_ORIGIN || "",
      process.env.USER_ORIGIN || "",
    ].filter(Boolean),
  ),
);

export const authComponent = createClient<DataModel>(components.betterAuth);

async function sendOTPEmail(email: string, otp: string, type: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail =
    process.env.RESEND_FROM_EMAIL || "Bus Booking Admin <onboarding@resend.dev>";
  const subject =
    type === "forget-password"
      ? "Admin Password Reset OTP Code"
      : "Admin Registration Email Verification OTP";

  const html = `
    <div style="font-family: Arial, sans-serif; padding: 24px; color: #18181b; max-width: 500px; margin: 0 auto; border: 1px solid #e4e4e7; rounded-radius: 12px;">
      <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 8px;">${subject}</h2>
      <p style="color: #71717a; font-size: 14px; margin-bottom: 20px;">Use the verification code below to proceed with your admin authentication.</p>
      <div style="font-size: 32px; font-weight: 800; letter-spacing: 6px; padding: 16px; background-color: #f4f4f5; text-align: center; border-radius: 8px; color: #09090b; margin-bottom: 20px;">
        ${otp}
      </div>
      <p style="color: #a1a1aa; font-size: 12px; margin: 0;">This code expires in 10 minutes. If you did not request this, please ignore this email.</p>
    </div>
  `;

  if (apiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [email],
          subject,
          html,
        }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Resend API error:", errorText);
      } else {
        console.log(`[RESEND OTP SENT] Delivered email to ${email}`);
      }
    } catch (err) {
      console.error("Failed to send Resend email:", err);
    }
  } else {
    console.log(`=========================================`);
    console.log(`[DEV OTP EMAIL SENDER - NO RESEND API KEY SET]`);
    console.log(`To: ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(`OTP Code: ${otp}`);
    console.log(`=========================================`);
  }
}

function createAuth(ctx: GenericCtx<DataModel>) {
  return betterAuth({
    baseURL: siteUrl,
    trustedOrigins: trustedOriginsList,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    plugins: [
      emailOTP({
        async sendVerificationOTP({ email, otp, type }) {
          await sendOTPEmail(email, otp, type);
        },
      }),
      convex({
        authConfig,
        jwksRotateOnTokenGenerationError: true,
      }),
    ],
  });
}

export { createAuth };

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return await authComponent.safeGetAuthUser(ctx);
  },
});
