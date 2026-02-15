import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const join = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    interest: v.union(
      v.literal("advising"),
      v.literal("product"),
      v.literal("both")
    ),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check for duplicate email
    const existing = await ctx.db
      .query("waitlist")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();

    if (existing) {
      // Update interest if they re-submit with a different one
      if (existing.interest !== args.interest) {
        await ctx.db.patch(existing._id, { interest: args.interest });
      }
      return { status: "already_joined" as const, id: existing._id };
    }

    const id = await ctx.db.insert("waitlist", {
      email: args.email.toLowerCase(),
      name: args.name,
      interest: args.interest,
      source: args.source ?? "landing",
      createdAt: Date.now(),
    });

    return { status: "joined" as const, id };
  },
});

export const count = query({
  args: {},
  handler: async (ctx) => {
    const entries = await ctx.db.query("waitlist").collect();
    return entries.length;
  },
});
