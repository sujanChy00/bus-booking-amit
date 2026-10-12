import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const bookingStatus = v.union(
  v.literal("pending"),
  v.literal("confirmed"),
  v.literal("cancelled"),
);

export default defineSchema({
  bookings: defineTable({
    name: v.string(),
    phone: v.string(),
    email: v.string(),
    travelDate: v.optional(v.string()),
    passengers: v.number(),
    from: v.string(),
    to: v.string(),
    status: bookingStatus,
    createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"]),
});
