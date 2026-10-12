import { v } from "convex/values";
import {
  action,
  type ActionCtx,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";
import { createAuth } from "./auth";

/**
 * Server-side authorization helper for Convex functions.
 * Validates that the caller is authenticated and that their email is in ADMIN_EMAILS.
 * Throws "Unauthorized" otherwise.
 */
export async function requireAdmin(ctx: QueryCtx | MutationCtx | ActionCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity || !identity.email) {
    throw new Error("Unauthorized");
  }

  const rawEmails = process.env.ADMIN_EMAILS || "";
  const allowedEmails = rawEmails
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const userEmail = identity.email.trim().toLowerCase();
  if (!allowedEmails.includes(userEmail)) {
    throw new Error("Unauthorized");
  }

  return { identity, email: userEmail };
}

/**
 * List registered admin users.
 * Protected by requireAdmin.
 */
export const listAdminUsers = action({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const auth = createAuth(ctx);
    const res = await auth.api.listUsers({
      query: {
        limit: 100,
      },
    });
    return res.users.map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
    }));
  },
});

/**
 * Admin action to reset another admin's password via userId.
 * Protected by requireAdmin.
 */
export const resetAdminPassword = action({
  args: {
    userId: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const auth = createAuth(ctx);

    if (!args.newPassword || args.newPassword.length < 8) {
      throw new Error("Password must be at least 8 characters long.");
    }

    await auth.api.setUserPassword({
      body: {
        userId: args.userId,
        newPassword: args.newPassword,
      },
    });

    return { success: true, message: "User password updated successfully." };
  },
});

/**
 * Admin action to reset another admin's password by email.
 * Protected by requireAdmin.
 */
export const resetAdminPasswordByEmail = action({
  args: {
    email: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const auth = createAuth(ctx);
    const email = args.email.trim().toLowerCase();

    if (!args.newPassword || args.newPassword.length < 8) {
      throw new Error("Password must be at least 8 characters long.");
    }

    const usersRes = await auth.api.listUsers({
      query: {
        searchValue: email,
        searchField: "email",
        searchOperator: "contains",
      },
    });

    const user = usersRes.users.find(
      (u: { email: string }) => u.email.toLowerCase() === email,
    );

    if (!user) {
      throw new Error(`Admin user with email "${email}" not found.`);
    }

    await auth.api.setUserPassword({
      body: {
        userId: user.id,
        newPassword: args.newPassword,
      },
    });

    return {
      success: true,
      message: `Password for ${email} updated successfully.`,
    };
  },
});
