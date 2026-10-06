import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    name: v.string(),
    phone: v.string(),
    email: v.string(),
    travelDate: v.optional(v.string()),
    passengers: v.number(),
    from: v.string(),
    to: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("bookings", {
      name: args.name,
      phone: args.phone,
      email: args.email,
      travelDate: args.travelDate,
      passengers: args.passengers,
      from: args.from,
      to: args.to,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

export const list = query({
  args: {
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    travelDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let bookings = await ctx.db
      .query("bookings")
      .withIndex("by_createdAt")
      .order("desc")
      .collect();

    if (args.name && args.name.trim() !== "") {
      const q = args.name.trim().toLowerCase();
      bookings = bookings.filter((b) => b.name.toLowerCase().includes(q));
    }

    if (args.phone && args.phone.trim() !== "") {
      const q = args.phone.trim().toLowerCase();
      bookings = bookings.filter((b) => b.phone.toLowerCase().includes(q));
    }

    if (args.travelDate && args.travelDate.trim() !== "") {
      const q = args.travelDate.trim();
      bookings = bookings.filter(
        (b) => b.travelDate && b.travelDate.includes(q),
      );
    }

    return bookings;
  },
});
