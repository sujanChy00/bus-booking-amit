import { v } from "convex/values";
import { action } from "./_generated/server";
import { createAuth } from "./auth";

/**
 * Server-side seed action to create an admin user account.
 * Credentials are supplied at runtime via CLI or server call, NOT hardcoded.
 *
 * Example usage:
 * npx convex run seed:createAdminAccount '{"email":"admin@example.com","password":"SecurePassword123!","name":"Admin"}'
 */
export const createAdminAccount = action({
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
