import { avatars } from '@/lib/data/avatars';
import { cn } from '@/lib/utils/cn';
import { formatRelativeTime } from '@/lib/utils/messages';
import { useEffect, useState } from 'react';

export function Message({
    message,
    isLast,
    mouseDown,
    setMouseDown,
    index,
    firstMessageIndex,
    setFirstMessageIndex,
    lastMessageIndex,
    setLastMessageIndex,
    setDragDirection,
    setThread,
    showDayDivider,
    noHeader,
    setThreadOpen,
    setDialogOpen,
    messages,
    calculateThreadPreview,
}) {
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onMouseUp = () => {
            setMouseDown(false);
            setMenuOpen(false);
            setDragDirection('down'); // Reset to default direction

            // Only open dialog if more than one message is selected
            if (firstMessageIndex !== null && lastMessageIndex !== null && firstMessageIndex !== lastMessageIndex) {
                setDialogOpen(true);
            } else {
                // Reset selection if only one message was selected
                setFirstMessageIndex(null);
                setLastMessageIndex(null);
            }
        };

        if (menuOpen) window.addEventListener('mouseup', onMouseUp);
        else window.removeEventListener('mouseup', onMouseUp);

        return () => {
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, [
        menuOpen,
        setMouseDown,
        firstMessageIndex,
        lastMessageIndex,
        setThread,
        setFirstMessageIndex,
        setLastMessageIndex,
        setDragDirection,
        setDialogOpen,
    ]);

    const onMouseEnter = () => {
        if (mouseDown && firstMessageIndex !== null) {
            setLastMessageIndex(index);

            // Determine drag direction based on movement relative to starting point
            if (index > firstMessageIndex) {
                setDragDirection('down');
            } else if (index < firstMessageIndex) {
                setDragDirection('up');
            }
            // If index === firstMessageIndex, keep current direction
        }
    };

    const { user, date, content, reactions = [], replies = [] } = message;

    const time = `${date.split(' ')[1]} ${date.split(' ')[2]}`;
    const repliers = [...new Set(replies.map((r) => r.user))];

    const lastReplyText = replies[replies.length - 1]?.date ? formatRelativeTime(replies[replies.length - 1].date) : 'today at 10:00 AM';

    // Calculate the total number of messages that would be in the thread
    const totalThreadCount =
        firstMessageIndex !== null && lastMessageIndex !== null && messages && calculateThreadPreview
            ? calculateThreadPreview(messages, firstMessageIndex, lastMessageIndex).length
            : firstMessageIndex !== null && lastMessageIndex !== null
              ? Math.abs(lastMessageIndex - firstMessageIndex) + 1
              : 1;

    const selected =
        firstMessageIndex !== null &&
        lastMessageIndex !== null &&
        index >= Math.min(firstMessageIndex, lastMessageIndex) &&
        index <= Math.max(firstMessageIndex, lastMessageIndex);

    return (
        <>
            {showDayDivider && (
                <div className="flex items-center py-4">
                    <div className="h-px flex-1 bg-white/10" />
                    <div className="inline-flex items-center gap-1 rounded-full border border-white/10 py-1.5 pr-3 pl-4 text-[13px] text-[#D1D2D3]">
                        Today
                        <svg viewBox="0 0 20 20" className="size-3.5">
                            <path
                                fill="currentColor"
                                d="M5.72 7.47a.75.75 0 0 1 1.06 0L10 10.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-3.75 3.75a.75.75 0 0 1-1.06 0L5.72 8.53a.75.75 0 0 1 0-1.06"
                            ></path>
                        </svg>
                    </div>
                    <div className="h-px flex-1 bg-white/10" />
                </div>
            )}

            <div
                className={cn(
                    'group relative flex items-baseline gap-2.5 px-2 py-1.5 pr-8',
                    noHeader && 'pt-1',
                    selected ? 'bg-[#1D9BD1]/20' : 'hover:bg-[#232529]',
                )}
                onMouseEnter={onMouseEnter}
            >
                {firstMessageIndex !== null && lastMessageIndex !== null && index === Math.min(firstMessageIndex, lastMessageIndex) && (
                    <div className="absolute top-0 left-0 w-full border-t border-[#1D9BD1]"></div>
                )}

                {firstMessageIndex !== null && lastMessageIndex !== null && index === Math.max(firstMessageIndex, lastMessageIndex) && (
                    <div className="absolute bottom-0 left-0 w-full border-t border-[#1D9BD1]"></div>
                )}

                {noHeader && (
                    <span
                        className={cn(
                            'w-12 flex-none cursor-pointer text-right text-xs text-[#ABABAD] opacity-0 group-hover:opacity-100 group-hover:delay-10 hover:underline',
                            menuOpen && 'visible',
                        )}
                    >
                        {!selected && time.replace('AM', '').replace('PM', '')}
                    </span>
                )}

                {!noHeader && (
                    <img
                        className="mt-1 ml-3 size-9 flex-shrink-0 cursor-pointer self-start rounded-md bg-gray-600"
                        src={avatars[user] || 'https://via.placeholder.com/32'}
                    />
                )}

                <div className="-mx-2 -my-1 overflow-hidden px-2 py-1">
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

                    {replies.length > 0 && (
                        <div
                            className={cn(
                                'group/button -mx-2 mt-1 -mb-0.5 flex w-[600px] max-w-full cursor-pointer items-center justify-between rounded-lg border border-transparent p-2 text-[#ABABAD]',
                                !mouseDown && 'hover:border-[#36373B] hover:bg-[#1B1D21]',
                            )}
                            onClick={() => setThreadOpen(index)}
                        >
                            <div className="flex gap-1">
                                <div className="flex gap-1">
                                    {repliers.map((replier, index) => (
                                        <img key={index} src={avatars[replier] || 'https://via.placeholder.com/32'} className="size-5 rounded" />
                                    ))}
                                </div>

                                <div className="flex items-baseline gap-2 text-[13px]">
                                    <p className="font-bold text-[#1D9BD1] hover:underline">
                                        {replies.length} repl
                                        {replies.length > 1 ? 'ies' : 'y'}
                                    </p>

                                    <div className="relative">
                                        <p className={cn('transition-opacity', !mouseDown && 'group-hover/button:opacity-0')}>
                                            Last reply {lastReplyText}
                                        </p>
                                        <p
                                            className={cn(
                                                'absolute top-0 left-0 opacity-0 transition-opacity',
                                                !mouseDown && 'group-hover/button:opacity-100',
                                            )}
                                        >
                                            View thread
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <svg className={cn('invisible size-5 fill-current', !mouseDown && 'group-hover/button:visible')} viewBox="0 0 20 20">
                                <path d="M7.72 5.72a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1 0 1.06l-3.75 3.75a.75.75 0 0 1-1.06-1.06L10.94 10 7.72 6.78a.75.75 0 0 1 0-1.06"></path>
                            </svg>
                        </div>
                    )}
                </div>

                <div
                    className={cn(
                        'actions absolute -top-6 right-3 flex rounded-xl border border-[#343638] bg-[#191B1E] p-1 font-bold text-[#ABABAD]',
                        !menuOpen && 'opacity-0 group-hover:opacity-100',
                        mouseDown && !menuOpen && 'hidden',
                    )}
                >
                    <div className="group/button relative flex size-8 cursor-pointer items-center justify-center rounded-lg hover:bg-white/10 hover:text-[#D1D2D3]">
                        👍
                        <div className="pointer-events-none absolute top-0 -mt-2 flex -translate-y-full flex-col items-center justify-center rounded-lg border border-[#343638] bg-[#191B1E] px-3 py-1.5 text-[13px] text-nowrap text-[#ABABAD] opacity-0 shadow delay-100 duration-100 group-hover/button:opacity-100 group-hover/button:transition-opacity">
                            <p className="text-[#ddd]">+1</p>
                            <div className="absolute -bottom-1.5 size-3 translate-y-px rotate-45 rounded-br-xs border-r border-b border-[#343638] bg-[#191B1E] shadow"></div>
                        </div>
                    </div>

                    <div className="group/button relative flex size-8 cursor-pointer items-center justify-center rounded-lg hover:bg-white/10 hover:text-[#3c4147]">
                        👀
                        <div className="pointer-events-none absolute top-0 -mt-2 flex -translate-y-full flex-col items-center justify-center rounded-lg border border-[#343638] bg-[#191B1E] px-3 py-1.5 text-[13px] text-nowrap text-[#ABABAD] opacity-0 shadow delay-100 duration-100 group-hover/button:opacity-100 group-hover/button:transition-opacity">
                            <p className="text-[#ddd]">eyes</p>
                            <div className="absolute -bottom-1.5 size-3 translate-y-px rotate-45 rounded-br-xs border-r border-b border-[#343638] bg-[#191B1E] shadow"></div>
                        </div>
                    </div>

                    <div className="group/button relative flex size-8 cursor-pointer items-center justify-center rounded-lg hover:bg-white/10 hover:text-[#D1D2D3]">
                        ✅
                        <div className="pointer-events-none absolute top-0 -mt-2 flex -translate-y-full flex-col items-center justify-center rounded-lg border border-[#343638] bg-[#191B1E] px-3 py-1.5 text-[13px] text-nowrap text-[#ABABAD] opacity-0 shadow delay-100 duration-100 group-hover/button:opacity-100 group-hover/button:transition-opacity">
                            <p className="text-[#ddd]">white_check_mark</p>
                            <div className="absolute -bottom-1.5 size-3 translate-y-px rotate-45 rounded-br-xs border-r border-b border-[#343638] bg-[#191B1E] shadow"></div>
                        </div>
                    </div>

                    <div className="group/button relative flex size-8 cursor-pointer items-center justify-center rounded-lg hover:bg-white/10 hover:text-[#D1D2D3]">
                        <svg className="size-5 fill-current" viewBox="0 0 20 20">
                            <path d="M15.5 1a.75.75 0 0 1 .75.75v2h2a.75.75 0 0 1 0 1.5h-2v2a.75.75 0 0 1-1.5 0v-2h-2a.75.75 0 0 1 0-1.5h2v-2A.75.75 0 0 1 15.5 1m-13 10a6.5 6.5 0 0 1 7.166-6.466.75.75 0 0 0 .152-1.493 8 8 0 1 0 7.14 7.139.75.75 0 0 0-1.492.152A7 7 0 0 1 15.5 11a6.5 6.5 0 1 1-13 0m4.25-.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5m4.5 0a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5M9 15c1.277 0 2.553-.724 3.06-2.173.148-.426-.209-.827-.66-.827H6.6c-.452 0-.808.4-.66.827C6.448 14.276 7.724 15 9 15"></path>
                        </svg>

                        <div className="pointer-events-none absolute top-0 -mt-2 flex -translate-y-full flex-col items-center justify-center rounded-lg border border-[#343638] bg-[#191B1E] px-3 py-1.5 text-[13px] text-nowrap text-[#ABABAD] opacity-0 shadow delay-100 duration-100 group-hover/button:opacity-100 group-hover/button:transition-opacity">
                            <p className="text-[#ddd]">Find another reaction</p>
                            <div className="absolute -bottom-1.5 size-3 translate-y-px rotate-45 rounded-br-xs border-r border-b border-[#343638] bg-[#191B1E] shadow"></div>
                        </div>
                    </div>

                    <div className="group/button relative flex size-8 cursor-pointer items-center justify-center rounded-lg hover:bg-white/10 hover:text-[#D1D2D3]">
                        <svg className="size-5 fill-current" viewBox="0 0 20 20">
                            <path d="M10 3a7 7 0 1 0 3.394 13.124.75.75 0 0 1 .542-.074l2.794.68-.68-2.794a.75.75 0 0 1 .073-.542A7 7 0 0 0 10 3m-8.5 7a8.5 8.5 0 1 1 16.075 3.859l.904 3.714a.75.75 0 0 1-.906.906l-3.714-.904A8.5 8.5 0 0 1 1.5 10M6 8.25a.75.75 0 0 1 .75-.75h6.5a.75.75 0 0 1 0 1.5h-6.5A.75.75 0 0 1 6 8.25M6.75 11a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5z"></path>
                        </svg>

                        <div className="pointer-events-none absolute top-0 -mt-2 flex -translate-y-full flex-col items-center justify-center rounded-lg border border-[#343638] bg-[#191B1E] px-3 py-1.5 text-[13px] text-nowrap text-[#ABABAD] opacity-0 shadow delay-100 duration-100 group-hover/button:opacity-100 group-hover/button:transition-opacity">
                            <p className="text-[#ddd]">Reply {message.replies ? 'to' : 'in'} thread</p>
                            <div className="absolute -bottom-1.5 size-3 translate-y-px rotate-45 rounded-br-xs border-r border-b border-[#343638] bg-[#191B1E] shadow"></div>
                        </div>
                    </div>

                    {!isLast && (
                        <div
                            className="group/button relative flex size-8 cursor-pointer items-center justify-center rounded-lg hover:bg-white/10 hover:text-[#D1D2D3] active:bg-white active:text-[#3c4147]"
                            onMouseDown={() => {
                                setMouseDown(true);
                                setMenuOpen(true);
                                setFirstMessageIndex(index);
                                setLastMessageIndex(index);
                                setDragDirection('down'); // Initialize with down direction
                            }}
                        >
                            <svg className="size-5 fill-current" viewBox="0 0 20 20">
                                <path d="M14 6.5C14 6.08579 14.3358 5.75 14.75 5.75C15.1642 5.75 15.5 6.08579 15.5 6.5V11.6895L17.2197 9.96973C17.5126 9.67683 17.9874 9.67683 18.2803 9.96973C18.5732 10.2626 18.5732 10.7374 18.2803 11.0303L15.2803 14.0303C14.9874 14.3232 14.5126 14.3232 14.2197 14.0303L11.2197 11.0303C10.9268 10.7374 10.9268 10.2626 11.2197 9.96973C11.4943 9.69512 11.9291 9.67766 12.2236 9.91797L12.2803 9.96973L14 11.6895V6.5ZM11.25 17C11.6642 17 12 16.6642 12 16.25C12 15.8358 11.6642 15.5 11.25 15.5H2.75C2.33579 15.5 2 15.8358 2 16.25C2 16.6642 2.33579 17 2.75 17H11.25ZM8.25 12.84C8.66421 12.84 9 12.5042 9 12.09C9 11.6758 8.66421 11.34 8.25 11.34H2.75C2.33579 11.34 2 11.6758 2 12.09C2 12.5042 2.33579 12.84 2.75 12.84H8.25ZM11.25 3C11.6642 3 12 3.33579 12 3.75C12 4.16421 11.6642 4.5 11.25 4.5H2.75C2.33579 4.5 2 4.16421 2 3.75C2 3.33579 2.33579 3 2.75 3H11.25ZM8.25 7.17C8.66421 7.17 9 7.50579 9 7.92C9 8.33421 8.66421 8.67 8.25 8.67H2.75C2.33579 8.67 2 8.33421 2 7.92C2 7.50579 2.33579 7.17 2.75 7.17H8.25Z" />
                            </svg>

                            <div
                                className={cn(
                                    'pointer-events-none absolute top-0 -mt-2 flex -translate-y-full flex-col items-center justify-center rounded-lg border border-[#343638] bg-[#191B1E] px-3 py-1.5 text-[13px] text-nowrap text-[#ABABAD] opacity-0 shadow delay-100 duration-100 group-hover/button:opacity-100 group-hover/button:transition-opacity',
                                    menuOpen && 'opacity-100',
                                )}
                            >
                                <p className="text-[#ddd]">Merge messages into thread</p>
                                <p className="font-medium">
                                    {mouseDown &&
                                    firstMessageIndex !== null &&
                                    lastMessageIndex !== null &&
                                    Math.abs(lastMessageIndex - firstMessageIndex) >= 1 ? (
                                        <>
                                            <span className="tabular-nums">{totalThreadCount}</span> selected <span className="mx-0.5">·</span>{' '}
                                            Release to merge
                                        </>
                                    ) : (
                                        <>Hold and drag to select</>
                                    )}
                                </p>

                                <div className="absolute -bottom-1.5 size-3 translate-y-px rotate-45 rounded-br-xs border-r border-b border-[#343638] bg-[#191B1E] shadow"></div>
                            </div>
                        </div>
                    )}

                    <div className="group/button relative flex size-8 cursor-pointer items-center justify-center rounded-lg hover:bg-white/10 hover:text-[#D1D2D3]">
                        <svg className="size-5 fill-current" viewBox="0 0 20 20">
                            <path d="M10.457 2.56a.75.75 0 0 1 .814.15l7 6.75a.75.75 0 0 1 0 1.08l-7 6.75A.75.75 0 0 1 10 16.75V13.5H6c-1.352 0-2.05.389-2.43.832-.4.465-.57 1.133-.57 1.918a.75.75 0 0 1-1.5 0V14c0-2.594.582-4.54 2-5.809C4.898 6.941 6.944 6.5 9.5 6.5h.5V3.25c0-.3.18-.573.457-.69M3.052 12.79C3.777 12.278 4.753 12 6 12h4.75a.75.75 0 0 1 .75.75v2.235L16.67 10 11.5 5.015V7.25a.75.75 0 0 1-.75.75H9.5c-2.444 0-4.023.434-5 1.309-.784.702-1.29 1.788-1.448 3.481"></path>
                        </svg>

                        <div className="pointer-events-none absolute top-0 -mt-2 flex -translate-y-full flex-col items-center justify-center rounded-lg border border-[#343638] bg-[#191B1E] px-3 py-1.5 text-[13px] text-nowrap text-[#ABABAD] opacity-0 shadow delay-100 duration-100 group-hover/button:opacity-100 group-hover/button:transition-opacity">
                            <p className="text-[#ddd]">Forward message…</p>
                            <div className="absolute -bottom-1.5 size-3 translate-y-px rotate-45 rounded-br-xs border-r border-b border-[#343638] bg-[#191B1E] shadow"></div>
                        </div>
                    </div>

                    <div className="group/button relative flex size-8 cursor-pointer items-center justify-center rounded-lg hover:bg-white/10 hover:text-[#D1D2D3]">
                        <svg className="size-5 fill-current" viewBox="0 0 20 20">
                            <path d="M4.25 4.25A2.75 2.75 0 0 1 7 1.5h6a2.75 2.75 0 0 1 2.75 2.75v12.793c0 1.114-1.346 1.671-2.134.884L10 14.31l-3.616 3.616c-.788.787-2.134.23-2.134-.884zM7 3c-.69 0-1.25.56-1.25 1.25v12.19l3.649-3.65a.85.85 0 0 1 1.202 0l3.649 3.65V4.25C14.25 3.56 13.69 3 13 3z"></path>
                        </svg>

                        <div className="pointer-events-none absolute top-0 -mt-2 flex -translate-y-full flex-col items-center justify-center rounded-lg border border-[#343638] bg-[#191B1E] px-3 py-1.5 text-[13px] text-nowrap text-[#ABABAD] opacity-0 shadow delay-100 duration-100 group-hover/button:opacity-100 group-hover/button:transition-opacity">
                            <p className="text-[#ddd]">Save for later</p>
                            <div className="absolute -bottom-1.5 size-3 translate-y-px rotate-45 rounded-br-xs border-r border-b border-[#343638] bg-[#191B1E] shadow"></div>
                        </div>
                    </div>

                    <div className="group/button relative flex size-8 cursor-pointer items-center justify-center rounded-lg hover:bg-white/10 hover:text-[#D1D2D3]">
                        <svg className="size-5 fill-current" viewBox="0 0 20 20">
                            <path d="M10 5.5A1.75 1.75 0 1 1 10 2a1.75 1.75 0 0 1 0 3.5m0 6.25a1.75 1.75 0 1 1 0-3.5 1.75 1.75 0 0 1 0 3.5m-1.75 4.5a1.75 1.75 0 1 0 3.5 0 1.75 1.75 0 0 0-3.5 0"></path>
                        </svg>

                        <div className="pointer-events-none absolute top-0 -mt-2 flex -translate-x-8 -translate-y-full flex-col items-center justify-center rounded-lg border border-[#343638] bg-[#191B1E] px-3 py-1.5 text-[13px] text-nowrap text-[#ABABAD] opacity-0 shadow delay-100 duration-100 group-hover/button:opacity-100 group-hover/button:transition-opacity">
                            <p className="text-[#ddd]">More actions</p>
                            <div className="absolute -bottom-1.5 size-3 translate-x-8 translate-y-px rotate-45 rounded-br-xs border-r border-b border-[#343638] bg-[#191B1E] shadow"></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
