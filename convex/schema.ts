import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  waitlist: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    interest: v.union(
      v.literal("advising"),
      v.literal("product"),
      v.literal("both")
    ),
    source: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_interest", ["interest"])
    .index("by_created", ["createdAt"]),
});
