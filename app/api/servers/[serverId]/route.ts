import { NextResponse } from 'next/server';

import { currentProfile } from '@/lib/currentProfile';
import { db } from '@/lib/db';

export const PATCH = async (req: Request, { params }: { params: { serverId: string } }) => {
    try {
        const profile = await currentProfile();
        const { name, imageUrl } = await req.json();

        if (!profile) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id,
            },
            data: {
                name,
                imageUrl,
            },
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log('[SERVER_ID_PATCH]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
};

export const DELETE = async (req: Request, { params }: { params: { serverId: string } }) => {
    try {
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (!params.serverId) {
            return new NextResponse('Server ID Missing', { status: 400 });
        }

        const server = await db.server.delete({
            where: {
                id: params.serverId,
                profileId: profile.id,
            },
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log('SERVERS_ID_DELETE', error);
        return new NextResponse('Internal error', { status: 500 });
    }
};
