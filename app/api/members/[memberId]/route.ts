import { currentProfile } from '@/lib/currentProfile';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export const PATCH = async (req: Request, { params }: { params: { memberId: string } }) => {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);
        const { role } = await req.json();

        const serverId = searchParams.get('serverId');

        if (!profile) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (!serverId) {
            return new NextResponse('Server ID missing', { status: 400 });
        }

        if (!params.memberId) {
            return new NextResponse('Member ID missing', { status: 400 });
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id,
            },
            data: {
                members: {
                    update: { where: { id: params.memberId, profileId: { not: profile.id } }, data: { role } },
                },
            },
            include: {
                members: {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        role: 'asc',
                    },
                },
            },
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log('[MEMBERS_ID_PATCH]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
};
