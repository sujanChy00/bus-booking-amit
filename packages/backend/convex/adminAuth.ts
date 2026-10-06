import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { createAuth } from "./auth";

export const checkAdminAuthorized = mutation({
  args: {
    email: v.string(),
  },
  handler: async (_ctx, args) => {
    const rawEmails = process.env.ADMIN_EMAILS || "suzu9869@gmail.com";
    const allowedEmails = rawEmails
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    const isAuthorized = allowedEmails.includes(args.email.trim().toLowerCase());
    return { isAuthorized, email: args.email };
  },
});

export const sendRegistrationOTP = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const rawEmails = process.env.ADMIN_EMAILS || "suzu9869@gmail.com";
    const allowedEmails = rawEmails
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    const email = args.email.trim().toLowerCase();
    if (!allowedEmails.includes(email)) {
      throw new Error("This email is not authorized to register as an admin.");
    }

    const auth = createAuth(ctx);
    await auth.api.sendVerificationOTP({
      body: {
        email,
        type: "email-verification",
      },
    });

    return { success: true, message: "Verification OTP code sent to email." };
  },
});

export const sendPasswordResetOTP = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const auth = createAuth(ctx);
    const email = args.email.trim().toLowerCase();

    // Trigger password reset OTP
    await auth.api.sendVerificationOTP({
      body: {
        email,
        type: "forget-password",
      },
    });

    return { success: true, message: "Password reset OTP sent to email." };
  },
});
