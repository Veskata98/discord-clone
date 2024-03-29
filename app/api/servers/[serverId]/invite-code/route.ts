import { NextResponse } from 'next/server';

import { v4 as uuidv4 } from 'uuid';

import { db } from '@/lib/db';
import { currentProfile } from '@/lib/currentProfile';

export const PATCH = async (req: Request, { params }: { params: { serverId: string } }) => {
    try {
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { serverId } = params;

        if (!params.serverId) {
            return new NextResponse('Server ID Missing', { status: 400 });
        }

        const server = await db.server.update({
            where: { id: serverId, profileId: profile.id },
            data: { inviteCode: uuidv4() },
        });
        return NextResponse.json(server);
    } catch (error) {
        console.log('SERVER_ID', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
};
