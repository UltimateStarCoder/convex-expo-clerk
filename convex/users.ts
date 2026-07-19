import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import {
  findCurrentUser,
  getOrCreateCurrentUser,
  identityProfile,
} from './lib/auth';

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

export const storeCurrent = mutation({
  args: {},
  returns: v.id('users'),
  handler: async (ctx) => {
    const user = await getOrCreateCurrentUser(ctx);
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('You must be signed in.');
    }

    await ctx.db.patch('users', user._id, {
      clerkUserId: identity.subject,
      ...identityProfile(identity),
      updatedAt: Date.now(),
    });

    return user._id;
  },
});
