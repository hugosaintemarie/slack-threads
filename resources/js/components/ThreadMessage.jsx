import { avatars } from '@/lib/data/avatars';
import { cn } from '@/lib/utils/cn';

export function ThreadMessage({ message, index, firstMessageIndex, lastMessageIndex, noHeader, className }) {
    const { user, date, content, reactions = [] } = message;

    const time = `${date.split(' ')[1]} ${date.split(' ')[2]}`;

    const selected = firstMessageIndex !== null && index >= firstMessageIndex && index <= lastMessageIndex;

    return (
        <>
            <div className={cn('group relative flex items-baseline gap-2.5 px-2 py-1.5 pr-4 hover:bg-[#232529]', noHeader && 'pt-1', className)}>
                {noHeader && (
                    <span className="w-11 flex-none cursor-pointer text-right text-xs text-[#ABABAD] opacity-0 group-hover:opacity-100 group-hover:delay-10 hover:underline">
                        {!selected && time.replace('AM', '').replace('PM', '')}
                    </span>
                )}

                {!noHeader && (
                    <img
                        className="mt-1 ml-2 size-9 flex-shrink-0 cursor-pointer self-start rounded-md bg-gray-600"
                        src={avatars[user] || 'https://via.placeholder.com/32'}
                    />
                )}

                <div>
                    {!noHeader && (
                        <div className="flex items-baseline gap-1.5">
                            <span className="cursor-pointer font-extrabold hover:underline">{user}</span>
                            <span className="cursor-pointer text-xs text-[#ABABAD] hover:underline">{time}</span>
                        </div>
                    )}

                    <div className="text-[#D1D2D3]">{content}</div>

                    {reactions.length > 0 && (
                        <div className="mt-1 flex gap-2">
                            {reactions.map((r, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        'flex cursor-pointer items-center gap-1.5 rounded-full px-2 py-px text-white',
                                        r.self ? 'bg-[#004d76]' : 'bg-white/10 hover:bg-white/15',
                                    )}
                                >
                                    <span className="text-[15px]">{r.emoji}</span>
                                    <span className="text-xs">{r.count}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div
                    className={cn(
                        'actions absolute -top-6 right-3 flex rounded-xl border border-[#343638] bg-[#191B1E] p-1 text-[#ABABAD] opacity-0 group-hover:opacity-100',
                    )}
                >
                    <div className="flex size-8 cursor-pointer items-center justify-center rounded-lg hover:bg-white/10 hover:text-[#D1D2D3]">👍</div>

                    <div className="flex size-8 cursor-pointer items-center justify-center rounded-lg hover:bg-white/10 hover:text-[#3c4147]">👀</div>

                    <div className="flex size-8 cursor-pointer items-center justify-center rounded-lg hover:bg-white/10 hover:text-[#D1D2D3]">✅</div>

                    <div className="flex size-8 cursor-pointer items-center justify-center rounded-lg hover:bg-white/10 hover:text-[#D1D2D3]">
                        <svg className="size-5 fill-current" viewBox="0 0 20 20">
                            <path d="M15.5 1a.75.75 0 0 1 .75.75v2h2a.75.75 0 0 1 0 1.5h-2v2a.75.75 0 0 1-1.5 0v-2h-2a.75.75 0 0 1 0-1.5h2v-2A.75.75 0 0 1 15.5 1m-13 10a6.5 6.5 0 0 1 7.166-6.466.75.75 0 0 0 .152-1.493 8 8 0 1 0 7.14 7.139.75.75 0 0 0-1.492.152A7 7 0 0 1 15.5 11a6.5 6.5 0 1 1-13 0m4.25-.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5m4.5 0a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5M9 15c1.277 0 2.553-.724 3.06-2.173.148-.426-.209-.827-.66-.827H6.6c-.452 0-.808.4-.66.827C6.448 14.276 7.724 15 9 15"></path>
                        </svg>
                    </div>

                    <div className="flex size-8 cursor-pointer items-center justify-center rounded-lg hover:bg-white/10 hover:text-[#D1D2D3]">
                        <svg className="size-5 fill-current" viewBox="0 0 20 20">
                            <path d="M4.25 4.25A2.75 2.75 0 0 1 7 1.5h6a2.75 2.75 0 0 1 2.75 2.75v12.793c0 1.114-1.346 1.671-2.134.884L10 14.31l-3.616 3.616c-.788.787-2.134.23-2.134-.884zM7 3c-.69 0-1.25.56-1.25 1.25v12.19l3.649-3.65a.85.85 0 0 1 1.202 0l3.649 3.65V4.25C14.25 3.56 13.69 3 13 3z"></path>
                        </svg>
                    </div>

                    <div className="flex size-8 cursor-pointer items-center justify-center rounded-lg hover:bg-white/10 hover:text-[#D1D2D3]">
                        <svg className="size-5 fill-current" viewBox="0 0 20 20">
                            <path d="M10 5.5A1.75 1.75 0 1 1 10 2a1.75 1.75 0 0 1 0 3.5m0 6.25a1.75 1.75 0 1 1 0-3.5 1.75 1.75 0 0 1 0 3.5m-1.75 4.5a1.75 1.75 0 1 0 3.5 0 1.75 1.75 0 0 0-3.5 0"></path>
                        </svg>
                    </div>
                </div>
            </div>
        </>
    );
}
