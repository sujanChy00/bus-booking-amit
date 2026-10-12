import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { createAuth } from "./auth";

/**
 * Server-side seed action to create an admin user account.
 * Credentials are supplied at runtime via CLI or server call, NOT hardcoded.
 *
 * Example usage:
 * npx convex run seed:createAdminAccount '{"email":"admin@example.com","password":"SecurePassword123!","name":"Admin"}'
 */
export const createAdminAccount = internalAction({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const auth = createAuth(ctx);
    const email = args.email.trim().toLowerCase();

    if (!args.password || args.password.length < 8) {
      throw new Error("Password must be at least 8 characters long.");
    }

    try {
      const res = await auth.api.createUser({
        body: {
          email,
          password: args.password,
          name: args.name.trim(),
          role: "admin",
        },
      });

      return {
        success: true,
        message: `Admin account for ${email} created successfully.`,
        user: res?.user,
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      throw new Error(`Failed to create admin account: ${errorMessage}`);
    }
  },
});

export const resetPasswordByEmail = internalAction({
  args: { email: v.string(), newPassword: v.string() },
  handler: async (ctx, args) => {
    if (args.newPassword.length < 8) throw new Error("Password too short.");
    const auth = createAuth(ctx);
    const email = args.email.trim().toLowerCase();

    const res = await auth.api.listUsers({
      query: {
        searchValue: email,
        searchField: "email",
        searchOperator: "contains",
      },
    });
    const user = res.users.find((u) => u.email.toLowerCase() === email);
    if (!user) throw new Error("User not found.");

    await auth.api.setUserPassword({
      body: { userId: user.id, newPassword: args.newPassword },
    });
    return { success: true };
  },
});
