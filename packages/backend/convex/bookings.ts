import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./adminAuth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9\s-]{7,20}$/;
const MAX_BOOKINGS_PER_WINDOW = 3;
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

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
    const name = args.name.trim();
    const phone = args.phone.trim();
    const email = args.email.trim().toLowerCase();
    const from = args.from.trim();
    const to = args.to.trim();
    const travelDate = args.travelDate?.trim();
    const passengers = args.passengers;

    // 1. Required field validations
    if (!name) throw new Error("Full name is required.");
    if (!phone) throw new Error("Phone number is required.");
    if (!email) throw new Error("Email address is required.");
    if (!from) throw new Error("Departure location (From) is required.");
    if (!to) throw new Error("Destination location (To) is required.");

    // 2. Length validations
    if (name.length > 100)
      throw new Error("Name cannot exceed 100 characters.");
    if (phone.length < 7 || phone.length > 20) {
      throw new Error("Phone number must be between 7 and 20 characters.");
    }
    if (email.length > 100)
      throw new Error("Email cannot exceed 100 characters.");
    if (from.length > 100)
      throw new Error("Departure cannot exceed 100 characters.");
    if (to.length > 100)
      throw new Error("Destination cannot exceed 100 characters.");

    // 3. Format validations
    if (!EMAIL_REGEX.test(email)) {
      throw new Error("Invalid email format.");
    }
    if (!PHONE_REGEX.test(phone)) {
      throw new Error("Invalid phone number format.");
    }

    // 4. Passenger count validation
    if (!Number.isInteger(passengers) || passengers < 1 || passengers > 50) {
      throw new Error("Passengers must be an integer between 1 and 50.");
    }

    // 5. Travel date validation (not in the past)
    if (travelDate) {
      if (travelDate.length > 30) {
        throw new Error("Travel date format is invalid.");
      }

      // Check format YYYY-MM-DD
      const dateParts = travelDate.split("-");
      if (dateParts.length === 3) {
        const year = Number(dateParts[0]);
        const month = Number(dateParts[1]);
        const day = Number(dateParts[2]);

        if (isNaN(year) || isNaN(month) || isNaN(day)) {
          throw new Error("Invalid date components.");
        }

        const now = new Date();
        const currentYear = now.getFullYear();

        // If Gregorian AD format (e.g. 2024 - 2040)
        if (year < 2060) {
          const currentMonth = now.getMonth() + 1;
          const currentDay = now.getDate();
          if (
            year < currentYear ||
            (year === currentYear &&
              (month < currentMonth ||
                (month === currentMonth && day < currentDay)))
          ) {
            throw new Error("Travel date cannot be in the past.");
          }
        } else {
          // Bikram Sambat (BS) date - approx year 2081+ in 2024+
          // Basic past check: BS year should not be before 2081
          if (year < 2081) {
            throw new Error("Travel date cannot be in the past.");
          }
        }
      }
    }

    // 6. Rate limiting / Spam protection
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW_MS;

    const recentBookings = await ctx.db
      .query("bookings")
      .withIndex("by_createdAt", (q) => q.gte("createdAt", windowStart))
      .collect();

    const matchingRecent = recentBookings.filter(
      (b) =>
        b.email.toLowerCase() === email ||
        b.phone.replace(/[\s-]/g, "") === phone.replace(/[\s-]/g, ""),
    );

    if (matchingRecent.length >= MAX_BOOKINGS_PER_WINDOW) {
      throw new Error(
        "Too many booking requests. Please wait a few minutes before submitting again.",
      );
    }

    return await ctx.db.insert("bookings", {
      name,
      phone,
      email,
      travelDate,
      passengers,
      from,
      to,
      status: "pending",
      createdAt: now,
    });
  },
});

export const list = query({
  args: {
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    destination: v.optional(v.string()),
    travelDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Strictly require admin privileges
    await requireAdmin(ctx);

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

    if (args.destination && args.destination.trim() !== "") {
      const q = args.destination.trim().toLowerCase();
      bookings = bookings.filter((b) => b.to.toLowerCase().includes(q));
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

export const updateStatus = mutation({
  args: {
    id: v.id("bookings"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, {
      status: args.status,
    });
    return { success: true };
  },
});

export const remove = mutation({
  args: {
    id: v.id("bookings"),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

export type BookingResponse = Doc<"bookings">;
export type BookingId = Id<"bookings">;
