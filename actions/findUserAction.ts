'use server';

import { redirectToSignIn } from '@clerk/nextjs';

import { currentProfile } from '@/lib/currentProfile';
import { Profile } from '@prisma/client';
import { db } from '@/lib/db';

export const findUserAction = async (username: string): Promise<Profile[] | []> => {
    try {
        const profile = await currentProfile();

        if (!profile) {
            return redirectToSignIn();
        }

        if (username === '' || !username) {
            return [];
        }

        const users = await db.profile.findMany({
            where: {
                name: {
                    startsWith: username,
                    mode: 'insensitive',
                    not: {
                        equals: profile.name,
                    },
                },
            },
        });

        return users;
    } catch (error) {
        console.log('[MESSAGES_GET]', error);
        return [];
    }
};
