import { query } from "./_generated/server";
import { requireAdmin } from "./adminAuth";

export const get = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return {
      message: "This is private admin data.",
    };
  },
});
