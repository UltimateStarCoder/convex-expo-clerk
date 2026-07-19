import { v } from 'convex/values';

import { internalMutation, query } from './_generated/server';
import { findCurrentUser } from './lib/auth';

const userValidator = v.object({
  _id: v.id('users'),
  _creationTime: v.number(),
  clerkUserId: v.string(),
  name: v.optional(v.string()),
  email: v.optional(v.string()),
  imageUrl: v.optional(v.string()),
  createdAt: v.number(),
  updatedAt: v.number(),
});

export const current = query({
  args: {},
  returns: v.union(userValidator, v.null()),
  handler: async (ctx) => {
    const { user } = await findCurrentUser(ctx);

    if (!user) {
      return null;
    }

    return {
      _id: user._id,
      _creationTime: user._creationTime,
      clerkUserId: user.clerkUserId,
      name: user.name,
      email: user.email,
      imageUrl: user.imageUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  },
});

export const upsertFromClerk = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    clerkUserId: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  returns: v.id('users'),
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_clerkUserId', (q) => q.eq('clerkUserId', args.clerkUserId))
      .unique();
    const now = Date.now();

    if (!existingUser) {
      return await ctx.db.insert('users', {
        tokenIdentifier: args.tokenIdentifier,
        clerkUserId: args.clerkUserId,
        name: args.name,
        email: args.email,
        imageUrl: args.imageUrl,
        createdAt: now,
        updatedAt: now,
      });
    }

    await ctx.db.patch('users', existingUser._id, {
      tokenIdentifier: args.tokenIdentifier,
      name: args.name,
      email: args.email,
      imageUrl: args.imageUrl,
      updatedAt: now,
    });

    return existingUser._id;
  },
});
