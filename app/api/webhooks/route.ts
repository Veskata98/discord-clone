import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';

import { db } from '@/lib/db';

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

    // Get the ID and type
    const { id } = evt.data;
    const eventType = evt.type;

    console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
    console.log('Webhook body:', body);

    const bodyObject = JSON.parse(body);

    const profileId = bodyObject?.data?.id as string;

    const newName = bodyObject?.data?.username as string;
    const newEmail = bodyObject?.data?.email_addresses[0]?.email_address as string;
    const newImageUrl = bodyObject?.data?.image_url as string;

    console.log(bodyObject, profileId, newName, newEmail, newImageUrl);

    try {
        await db.profile.update({
            where: {
                id: profileId,
            },
            data: {
                name: newName,
                email: newEmail,
                imageUrl: newImageUrl,
            },
        });

        return new Response('', { status: 200 });
    } catch (error) {
        console.log(error);

        return new Response('Internal Error', {
            status: 500,
        });
    }
}
