import { v } from 'convex/values';

import type { Doc } from './_generated/dataModel';
import { mutation, query } from './_generated/server';
import {
  findCurrentUser,
  getOrCreateCurrentUser,
  requireCurrentUser,
} from './lib/auth';

const itemFields = {
  _id: v.id('items'),
  _creationTime: v.number(),
  title: v.string(),
  description: v.string(),
  createdAt: v.number(),
  updatedAt: v.number(),
};

const itemValidator = v.object(itemFields);
const itemInputFields = {
  title: v.string(),
  description: v.string(),
};

function normalizeItemInput(input: { title: string; description: string }) {
  const title = input.title.trim();
  const description = input.description.trim();

  if (!title) {
    throw new Error('Title is required.');
  }

  if (title.length > 120) {
    throw new Error('Title must be 120 characters or fewer.');
  }

  if (description.length > 2_000) {
    throw new Error('Description must be 2,000 characters or fewer.');
  }

  return { title, description };
}

function toClientItem(item: Doc<'items'>) {
  return {
    _id: item._id,
    _creationTime: item._creationTime,
    title: item.title,
    description: item.description,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export const list = query({
  args: {},
  returns: v.array(itemValidator),
  handler: async (ctx) => {
    const { user } = await findCurrentUser(ctx);

    if (!user) {
      return [];
    }

    const items = await ctx.db
      .query('items')
      .withIndex('by_ownerId_and_updatedAt', (q) => q.eq('ownerId', user._id))
      .order('desc')
      .take(100);

    return items.map(toClientItem);
  },
});

export const get = query({
  args: { id: v.id('items') },
  returns: v.union(itemValidator, v.null()),
  handler: async (ctx, args) => {
    const { user } = await findCurrentUser(ctx);
    const item = await ctx.db.get('items', args.id);

    if (!user || !item || item.ownerId !== user._id) {
      return null;
    }

    return toClientItem(item);
  },
});

export const create = mutation({
  args: itemInputFields,
  returns: v.id('items'),
  handler: async (ctx, args) => {
    const user = await getOrCreateCurrentUser(ctx);
    const input = normalizeItemInput(args);
    const now = Date.now();

    return await ctx.db.insert('items', {
      ...input,
      ownerId: user._id,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id('items'),
    ...itemInputFields,
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);
    const item = await ctx.db.get('items', args.id);

    if (!item || item.ownerId !== user._id) {
      throw new Error('Item not found.');
    }

    const input = normalizeItemInput(args);
    await ctx.db.patch('items', args.id, {
      ...input,
      updatedAt: Date.now(),
    });

    return null;
  },
});

export const remove = mutation({
  args: { id: v.id('items') },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);
    const item = await ctx.db.get('items', args.id);

    if (!item || item.ownerId !== user._id) {
      throw new Error('Item not found.');
    }

    await ctx.db.delete('items', args.id);
    return null;
  },
});
