import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';

import { currentProfile } from '@/lib/currentProfile';
import { db } from '@/lib/db';

import { revalidatePath } from 'next/cache';

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
    }

    // Get the headers
    const headerPayload = headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error occured -- no svix headers', {
            status: 400,
        });
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error('Error verifying webhook:', err);
        return new Response('Error occured', {
            status: 400,
        });
    }

    console.log('Webhook body:', body);

    const profile = await currentProfile();

    if (!profile) {
        return new Response('Unauthorized', {
            status: 401,
        });
    }

    const bodyObject = JSON.parse(body);

    const newName = bodyObject?.data?.username as string;
    const newEmail = bodyObject?.data?.email_addresses[0]?.email_address as string;
    const newImageUrl = bodyObject?.data?.image_url as string;

    try {
        await db.profile.update({
            where: {
                userId: profile.userId,
            },
            data: {
                name: newName,
                email: newEmail,
                imageUrl: newImageUrl,
            },
        });

        revalidatePath('/');
        return new Response('', { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response('Internal Error', {
            status: 500,
        });
    }
}
