import { httpRouter } from 'convex/server';
import { Webhook } from 'svix';

import { internal } from './_generated/api';
import { httpAction } from './_generated/server';

type ClerkEmailAddress = {
  id: string;
  email_address: string;
};

type ClerkUserData = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  image_url: string;
  primary_email_address_id: string | null;
  email_addresses: ClerkEmailAddress[];
};

type ClerkUserEvent = {
  type: 'user.created' | 'user.updated';
  data: ClerkUserData;
};

const http = httpRouter();

http.route({
  path: '/clerk-users-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const event = await verifyClerkWebhook(request);

    if (!event) {
      return new Response('Invalid webhook request.', { status: 400 });
    }

    const issuer = process.env.CLERK_FRONTEND_API_URL?.replace(/\/$/, '');

    if (!issuer) {
      console.error('CLERK_FRONTEND_API_URL is not configured in Convex.');
      return new Response('Webhook is not configured.', { status: 500 });
    }

    const primaryEmail = event.data.email_addresses.find(
      (emailAddress) => emailAddress.id === event.data.primary_email_address_id,
    )?.email_address;
    const name =
      [event.data.first_name, event.data.last_name].filter(Boolean).join(' ') ||
      undefined;

    await ctx.runMutation(internal.users.upsertFromClerk, {
      tokenIdentifier: `${issuer}|${event.data.id}`,
      clerkUserId: event.data.id,
      name,
      email: primaryEmail,
      imageUrl: event.data.image_url,
    });

    return new Response(null, { status: 204 });
  }),
});

async function verifyClerkWebhook(request: Request): Promise<ClerkUserEvent | null> {
  const signingSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!signingSecret) {
    console.error('CLERK_WEBHOOK_SIGNING_SECRET is not configured in Convex.');
    return null;
  }

  const svixId = request.headers.get('svix-id');
  const svixTimestamp = request.headers.get('svix-timestamp');
  const svixSignature = request.headers.get('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) {
    return null;
  }

  try {
    const event = new Webhook(signingSecret).verify(await request.text(), {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    });

    return isClerkUserEvent(event) ? event : null;
  } catch (error) {
    console.error('Clerk webhook verification failed.', error);
    return null;
  }
}

function isClerkUserEvent(value: unknown): value is ClerkUserEvent {
  if (!isRecord(value)) {
    return false;
  }

  if (value.type !== 'user.created' && value.type !== 'user.updated') {
    return false;
  }

  const data = value.data;

  return (
    isRecord(data) &&
    typeof data.id === 'string' &&
    (typeof data.first_name === 'string' || data.first_name === null) &&
    (typeof data.last_name === 'string' || data.last_name === null) &&
    typeof data.image_url === 'string' &&
    (typeof data.primary_email_address_id === 'string' ||
      data.primary_email_address_id === null) &&
    Array.isArray(data.email_addresses) &&
    data.email_addresses.every(
      (emailAddress) =>
        isRecord(emailAddress) &&
        typeof emailAddress.id === 'string' &&
        typeof emailAddress.email_address === 'string',
    )
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export default http;
