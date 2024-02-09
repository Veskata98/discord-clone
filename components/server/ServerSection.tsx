'use client';

import { ChannelType, MemberRole } from '@prisma/client';
import { Hash, Plus } from 'lucide-react';
import { ActionTooltip } from '../ActionTooltip';
import { useModal } from '@/hooks/useModalStore';
import { ServerWithMembersWithProfiles } from '@/types';

interface ServerSectionProps {
    label: string;
    sectionType: 'channels' | 'members';
    role?: MemberRole;
    channelType?: ChannelType;
    server?: ServerWithMembersWithProfiles;
}

export const ServerSection = ({ label, channelType, role, sectionType, server }: ServerSectionProps) => {
    const { onOpen } = useModal();

    return (
        <div className="flex items-center justify-between py-2">
            <p
                className="text-xs uppercase font-semibold text-zinc-500
                dark:text-zinc-400"
            >
                {label}
            </p>
            {role !== MemberRole.GUEST && sectionType === 'channels' && (
                <ActionTooltip label="Create Channel" side="top">
                    <button
                        onClick={() => onOpen('createChannel')}
                        className="text-zinc-500 hover:text-zinc-600
                        dark:text-zinc-400 dark:hover:text-zinc-300
                        transition"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </ActionTooltip>
            )}
        </div>
    );
};