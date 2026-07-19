import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  items: defineTable({
    title: v.string(),
    description: v.string(),
    ownerTokenIdentifier: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('by_ownerTokenIdentifier_and_updatedAt', [
    'ownerTokenIdentifier',
    'updatedAt',
  ]),
});
