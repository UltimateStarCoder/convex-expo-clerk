import type { UserIdentity } from 'convex/server';

import type { Doc } from '../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../_generated/server';

type AuthContext = QueryCtx | MutationCtx;

export async function requireIdentity(ctx: AuthContext) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new Error('You must be signed in.');
  }

  return identity;
}

export async function findCurrentUser(ctx: AuthContext) {
  const identity = await requireIdentity(ctx);
  const user = await ctx.db
    .query('users')
    .withIndex('by_tokenIdentifier', (q) =>
      q.eq('tokenIdentifier', identity.tokenIdentifier),
    )
    .unique();

  return { identity, user };
}

export async function requireCurrentUser(ctx: AuthContext) {
  const { user } = await findCurrentUser(ctx);

  if (!user) {
    throw new Error('Your user profile has not finished syncing. Please try again.');
  }

  return user;
}

export async function getOrCreateCurrentUser(ctx: MutationCtx) {
  const { identity, user } = await findCurrentUser(ctx);

  if (user) {
    return user;
  }

  const now = Date.now();
  const userId = await ctx.db.insert('users', {
    tokenIdentifier: identity.tokenIdentifier,
    clerkUserId: identity.subject,
    ...identityProfile(identity),
    createdAt: now,
    updatedAt: now,
  });

  const createdUser = await ctx.db.get('users', userId);

  if (!createdUser) {
    throw new Error('Could not create your user profile.');
  }

  return createdUser;
}

export function identityProfile(identity: UserIdentity) {
  return compactOptionalFields({
    name: identity.name,
    email: identity.email,
    imageUrl: identity.pictureUrl,
  });
}

function compactOptionalFields(fields: {
  name?: string;
  email?: string;
  imageUrl?: string;
}): Pick<Doc<'users'>, 'name' | 'email' | 'imageUrl'> {
  return Object.fromEntries(
    Object.entries(fields).filter((entry): entry is [string, string] => entry[1] !== undefined),
  );
}
