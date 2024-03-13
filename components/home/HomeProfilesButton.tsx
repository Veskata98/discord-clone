'use client';

import { Profile } from '@prisma/client';
import { UserAvatar } from '../UserAvatar';
import { cn } from '@/lib/utils';

import { useParams } from 'next/navigation';

interface HomeProfilesButtonProps {
    profile: Profile;
}

export const HomeProfilesButton = ({ profile }: HomeProfilesButtonProps) => {
    const params = useParams();

    return (
        <button
            onClick={() => {}}
            key={profile.id}
            className={cn(
                'group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zic-700/10 dark:hover:bg-zinc-700/50 transition mb-1',
                params?.profileId === profile.id && 'bg-zinc-700/20 dark:bg-zink-700'
            )}
        >
            <UserAvatar src={profile.imageUrl} className="h-8 w-8 md:h-8 md:w-8" />
            <p
                className={cn(
                    'font-semibold text-sm text-zinc-500 group-hoverr:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition',
                    params?.profileId === profile.id && 'text-primary dark:text-zinc-200 dark:group-hover:text-white'
                )}
            >
                {profile.name}
            </p>
        </button>
    );
};
