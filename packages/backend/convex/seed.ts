import { mutation } from "./_generated/server";
import { createAuth } from "./auth";

export const seedAdmin = mutation({
  args: {},
  handler: async (ctx) => {
    const auth = createAuth(ctx);
    const email = "suzu9869@gmail.com";
    const password = "Random@123##";
    const name = "Admin";

    try {
      const res = await auth.api.signUpEmail({
        body: {
          email,
          password,
          name,
        },
      });

      return { success: true, message: "Admin created successfully", data: res };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      return { success: true, message: "Admin account seed complete or already exists", note: errorMessage };
    }
  },
});
