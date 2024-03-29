import { Hash } from 'lucide-react';

import { MobileToggle } from '@/components/MobileToggle';
import { UserAvatar } from '../UserAvatar';
import { SocketIndicator } from '../SocketIndicator';
import { ChatVideoButton } from './ChatVideoButton';

interface ChatHeaderProps {
    serverId?: string;
    name: string;
    type: 'channel' | 'conversation';
    imageUrl?: string;
}

export const ChatHeader = ({ serverId, name, type, imageUrl }: ChatHeaderProps) => {
    return (
        <div
            className="flex items-center text-md font-semibold px-3 h-12
                border-neutral-200 dark:border-neutral-800 border-b-2"
        >
            {type === 'channel' && <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />}
            {type === 'conversation' && <UserAvatar src={imageUrl} className="w-8 h-8 md:h-8 md:w-8 mr-2" />}
            <p className="font-semibold text-md text-black dark:text-white">{name}</p>
            <div className="ml-auto flex items-center">
                {type === 'conversation' && <ChatVideoButton />}
                <SocketIndicator />
            </div>
            <MobileToggle serverId={serverId || ''} className="ml-auto md:hidden" />
        </div>
    );
};
