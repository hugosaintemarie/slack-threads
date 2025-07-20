import { Composer } from '@/components/Composer';
import { Message } from '@/components/Message';
import { ThreadMessage } from '@/components/ThreadMessage';
import { mockMessages } from '@/lib/data/mockMessages';
import { cn } from '@/lib/utils/cn';
import { normalizeIndices, parseMessageDate, shouldHaveNoHeader, shouldShowDayDivider } from '@/lib/utils/messages';
import { useState } from 'react';

export default function App() {
    const [mouseDown, setMouseDown] = useState(false);
    const [firstMessageIndex, setFirstMessageIndex] = useState(null);
    const [lastMessageIndex, setLastMessageIndex] = useState(null);
    const [dragDirection, setDragDirection] = useState('down'); // 'down' or 'up'
    const [dialogOpen, setDialogOpen] = useState(false);

    const [threadOpen, setThreadOpen] = useState(null);

    const [messages, setMessages] = useState(mockMessages);

    // Helper function to calculate what the final thread will look like
    const calculateThreadPreview = (messages, firstIndex, lastIndex) => {
        const { start, end } = normalizeIndices(firstIndex, lastIndex);
        if (start === null || end === null) return [];

        const selectedMessages = messages.slice(start, end + 1);

        // Collect all messages that will be in the final thread (main message + all replies)
        const allThreadMessages = [];

        // Add the first message as the main thread message
        allThreadMessages.push(selectedMessages[0]);

        // Collect all replies from all selected messages and flatten them
        const allReplies = [];

        selectedMessages.forEach((message, index) => {
            if (index === 0) {
                // Add existing replies from the first message
                if (message.replies) {
                    allReplies.push(...message.replies);
                }
            } else {
                // Add the message itself as a reply (removing any nested replies)
                const messageAsReply = {
                    user: message.user,
                    date: message.date,
                    content: message.content,
                    reactions: message.reactions,
                };
                allReplies.push(messageAsReply);

                // Add any existing replies from this message (flattened)
                if (message.replies) {
                    message.replies.forEach((reply) => {
                        const flattenedReply = {
                            user: reply.user,
                            date: reply.date,
                            content: reply.content,
                            reactions: reply.reactions,
                        };
                        allReplies.push(flattenedReply);
                    });
                }
            }
        });

        // Sort all replies by date
        allReplies.sort((a, b) => {
            const dateA = parseMessageDate(a.date);
            const dateB = parseMessageDate(b.date);
            return dateA - dateB;
        });

        // Add all replies to the preview
        allThreadMessages.push(...allReplies);

        return allThreadMessages;
    };

    const setThread = ([firstIndex, lastIndex]) => {
        const { start, end } = normalizeIndices(firstIndex, lastIndex);
        if (start === null || end === null) return;

        setMessages((prevMessages) => {
            const selectedMessages = prevMessages.slice(start, end + 1);
            const threadPreview = calculateThreadPreview(prevMessages, firstIndex, lastIndex);

            // Create the first message with all sorted, flattened replies
            const firstMessageWithReplies = {
                ...selectedMessages[0],
                replies: threadPreview.slice(1), // All messages except the first one become replies
            };

            // Create new array with messages before selection, updated first message, and messages after selection
            const updatedMessages = [...prevMessages.slice(0, start), firstMessageWithReplies, ...prevMessages.slice(end + 1)];

            return updatedMessages;
        });

        // Handle thread sidebar state when messages are merged
        if (threadOpen !== null) {
            if (threadOpen >= start && threadOpen <= end) {
                // The currently open thread is part of the merge, point to the new merged message
                setThreadOpen(start);
            } else if (threadOpen > end) {
                // The currently open thread is after the merge, adjust its index
                const removedCount = end - start; // Number of messages removed (end - start, not +1 because we keep the first one)
                setThreadOpen(threadOpen - removedCount);
            }
            // If threadOpen < start, no adjustment needed
        }
    };

    return (
        <div
            className={cn(
                'flex h-screen flex-col overflow-hidden bg-gradient-to-r from-[#1F2124] to-[#121416] font-sans text-[15px] text-white scheme-dark',
                mouseDown && 'select-none',
                mouseDown && dragDirection === 'down' && '**:cursor-s-resize!',
                mouseDown && dragDirection === 'up' && '**:cursor-n-resize!',
            )}
            onMouseUp={() => {
                setMouseDown(false);
                setDragDirection('down'); // Reset direction on mouse up
            }}
        >
            <header className="flex items-center gap-3 p-2">
                <div className="flex w-92 flex-none items-center justify-end gap-3">
                    <svg className="size-5 cursor-pointer text-gray-400 hover:text-white" viewBox="0 0 20 20">
                        <path
                            fill="currentColor"
                            fillRule="evenodd"
                            d="M9.768 5.293a.75.75 0 0 0-1.036-1.086l-5.5 5.25a.75.75 0 0 0 0 1.085l5.5 5.25a.75.75 0 1 0 1.036-1.085L5.622 10.75H16.25a.75.75 0 0 0 0-1.5H5.622z"
                        ></path>
                    </svg>

                    <svg className="size-5 cursor-pointer text-gray-400 hover:text-white" viewBox="0 0 20 20">
                        <path
                            fill="currentColor"
                            fillRule="evenodd"
                            d="M11.268 15.793a.75.75 0 0 1-1.036-1.085l4.146-3.958H3.75a.75.75 0 0 1 0-1.5h10.628l-4.146-3.957a.75.75 0 0 1 1.036-1.086l5.5 5.25a.75.75 0 0 1 0 1.085z"
                        ></path>
                    </svg>

                    <svg className="size-5 cursor-pointer text-gray-200 hover:text-white" viewBox="0 0 20 20">
                        <path
                            fill="currentColor"
                            fillRule="evenodd"
                            d="M2.5 10a7.5 7.5 0 1 1 15 0 7.5 7.5 0 0 1-15 0M10 1a9 9 0 1 0 0 18 9 9 0 0 0 0-18m.75 4.75a.75.75 0 0 0-1.5 0v4.75c0 .414.336.75.75.75h3.75a.75.75 0 0 0 0-1.5h-3z"
                        ></path>
                    </svg>
                </div>

                <div className="flex h-7 w-1/2 cursor-pointer items-center gap-2 rounded-md bg-[#616365] px-2 text-[13px] text-[#ddd]">
                    <svg className="size-4 cursor-pointer" viewBox="0 0 20 20">
                        <path
                            fill="currentColor"
                            fillRule="evenodd"
                            d="M9 3a6 6 0 1 0 0 12A6 6 0 0 0 9 3M1.5 9a7.5 7.5 0 1 1 13.307 4.746l3.473 3.474a.75.75 0 1 1-1.06 1.06l-3.473-3.473A7.5 7.5 0 0 1 1.5 9"
                            clipRule="evenodd"
                        ></path>
                    </svg>
                    <span className="mt-px">Search Acme</span>
                </div>

                <svg viewBox="0 0 20 20" className="ml-auto size-5 text-[#aaa]">
                    <path
                        fill="currentColor"
                        fillRule="evenodd"
                        d="M10 2.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15M1 10a9 9 0 1 1 18 0 9 9 0 0 1-18 0m7.883-2.648c-.23.195-.383.484-.383.898a.75.75 0 0 1-1.5 0c0-.836.333-1.547.91-2.04.563-.48 1.31-.71 2.09-.71.776 0 1.577.227 2.2.729.642.517 1.05 1.294 1.05 2.271 0 .827-.264 1.515-.807 2.001-.473.423-1.08.623-1.693.703V12h-1.5v-1c0-.709.566-1.211 1.18-1.269.507-.048.827-.18 1.013-.347.162-.145.307-.39.307-.884 0-.523-.203-.87-.492-1.104C10.951 7.148 10.502 7 10 7c-.497 0-.876.146-1.117.352M10 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2"
                        clipRule="evenodd"
                    ></path>
                </svg>
            </header>

            <div className="flex flex-1 overflow-hidden">
                <aside className="flex h-full flex-col px-4">
                    <svg className="size-9 rounded-lg" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
                        <rect width="80" height="80" fill="#F06225" />
                        <path
                            d="M39.9999 20C51.0459 20 59.9999 28.954 59.9999 40V54C59.9999 55.5913 59.3678 57.1174 58.2426 58.2426C57.1174 59.3679 55.5912 60 53.9999 60H40.9999V51.226C40.9999 49.224 41.1219 47.15 42.1719 45.446C42.9237 44.2248 43.9292 43.1796 45.1205 42.3813C46.3117 41.5829 47.6607 41.0501 49.0759 40.819L49.4589 40.757C49.6168 40.703 49.7539 40.601 49.8509 40.4653C49.948 40.3296 50.0002 40.1669 50.0002 40C50.0002 39.8331 49.948 39.6704 49.8509 39.5347C49.7539 39.399 49.6168 39.297 49.4589 39.243L49.0759 39.181C47.0081 38.8432 45.0986 37.8644 43.617 36.3829C42.1355 34.9013 41.1567 32.9918 40.8189 30.924L40.7569 30.541C40.703 30.3831 40.601 30.246 40.4652 30.149C40.3295 30.0519 40.1668 29.9997 39.9999 29.9997C39.8331 29.9997 39.6704 30.0519 39.5346 30.149C39.3989 30.246 39.2969 30.3831 39.2429 30.541L39.1809 30.924C38.9499 32.3393 38.4171 33.6883 37.6187 34.8795C36.8204 36.0707 35.7751 37.0763 34.5539 37.828C32.8499 38.878 30.7759 39 28.7739 39H20.0239C20.5469 28.419 29.2899 20 39.9999 20ZM20 41H28.774C30.776 41 32.85 41.122 34.554 42.172C35.886 42.9928 37.0072 44.114 37.828 45.446C38.878 47.15 39 49.224 39 51.226V60H26C24.4087 60 22.8826 59.3679 21.7574 58.2426C20.6321 57.1174 20 55.5913 20 54V41ZM60 22C60 22.5304 59.7893 23.0391 59.4142 23.4142C59.0391 23.7893 58.5304 24 58 24C57.4696 24 56.9609 23.7893 56.5858 23.4142C56.2107 23.0391 56 22.5304 56 22C56 21.4696 56.2107 20.9609 56.5858 20.5858C56.9609 20.2107 57.4696 20 58 20C58.5304 20 59.0391 20.2107 59.4142 20.5858C59.7893 20.9609 60 21.4696 60 22Z"
                            fill="white"
                        />
                    </svg>

                    <div className="mt-6 space-y-4 text-[11px] text-[#F8F8F8]">
                        <div className="flex flex-col items-center gap-0.5">
                            <div className="flex size-9 items-center justify-center rounded-lg bg-white/20">
                                <svg className="size-5 fill-current text-white" viewBox="0 0 20 20">
                                    <path
                                        fill="currentColor"
                                        fillRule="evenodd"
                                        d="m3 7.649-.33.223a.75.75 0 0 1-.84-1.244l7.191-4.852a1.75 1.75 0 0 1 1.958 0l7.19 4.852a.75.75 0 1 1-.838 1.244L17 7.649v7.011c0 2.071-1.679 3.84-3.75 3.84h-6.5C4.679 18.5 3 16.731 3 14.66zM11 11a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1z"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                            </div>
                            Home
                        </div>

                        <div className="flex flex-col items-center gap-0.5">
                            <div className="flex size-9 items-center justify-center rounded-lg">
                                <svg className="size-5 fill-current" viewBox="0 0 20 20">
                                    <path
                                        fill="currentColor"
                                        fillRule="evenodd"
                                        d="M7.675 6.468a4.75 4.75 0 1 1 8.807 3.441.75.75 0 0 0-.067.489l.379 1.896-1.896-.38a.75.75 0 0 0-.489.068 5 5 0 0 1-.648.273.75.75 0 1 0 .478 1.422q.314-.105.611-.242l2.753.55a.75.75 0 0 0 .882-.882l-.55-2.753A6.25 6.25 0 1 0 6.23 6.064a.75.75 0 1 0 1.445.404M6.5 8.5a5 5 0 0 0-4.57 7.03l-.415 2.073a.75.75 0 0 0 .882.882l2.074-.414A5 5 0 1 0 6.5 8.5m-3.5 5a3.5 3.5 0 1 1 1.91 3.119.75.75 0 0 0-.49-.068l-1.214.243.243-1.215a.75.75 0 0 0-.068-.488A3.5 3.5 0 0 1 3 13.5"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                            </div>
                            DMs
                        </div>

                        <div className="flex flex-col items-center gap-0.5">
                            <div className="flex size-9 items-center justify-center rounded-lg">
                                <svg className="size-5 fill-current" viewBox="0 0 20 20">
                                    <path
                                        fill="currentColor"
                                        fillRule="evenodd"
                                        d="M9.357 3.256c-.157.177-.31.504-.36 1.062l-.05.558-.55.11c-1.024.204-1.691.71-2.145 1.662-.485 1.016-.736 2.566-.752 4.857l-.002.307-.217.217-2.07 2.077c-.145.164-.193.293-.206.374a.3.3 0 0 0 .034.199c.069.12.304.321.804.321h4.665l.07.672c.034.327.17.668.4.915.214.232.536.413 1.036.413.486 0 .802-.178 1.013-.41.227-.247.362-.588.396-.916l.069-.674h4.663c.5 0 .735-.202.804-.321a.3.3 0 0 0 .034-.199c-.013-.08-.061-.21-.207-.374l-2.068-2.077-.216-.217-.002-.307c-.015-2.291-.265-3.841-.75-4.857-.455-.952-1.123-1.458-2.147-1.663l-.549-.11-.05-.557c-.052-.558-.204-.885-.36-1.062C10.503 3.1 10.31 3 10 3s-.505.1-.643.256m-1.124-.994C8.689 1.746 9.311 1.5 10 1.5s1.31.246 1.767.762c.331.374.54.85.65 1.383 1.21.369 2.104 1.136 2.686 2.357.604 1.266.859 2.989.894 5.185l1.866 1.874.012.012.011.013c.636.7.806 1.59.372 2.342-.406.705-1.223 1.072-2.103 1.072H12.77c-.128.39-.336.775-.638 1.104-.493.538-1.208.896-2.12.896-.917 0-1.638-.356-2.136-.893A3 3 0 0 1 7.23 16.5H3.843c-.88 0-1.697-.367-2.104-1.072-.433-.752-.263-1.642.373-2.342l.011-.013.012-.012 1.869-1.874c.035-2.196.29-3.919.894-5.185.582-1.22 1.475-1.988 2.684-2.357.112-.533.32-1.009.651-1.383"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                            </div>
                            Activity
                        </div>

                        <div className="flex flex-col items-center gap-0.5">
                            <div className="flex size-9 items-center justify-center rounded-lg">
                                <svg className="size-5 fill-current" viewBox="0 0 20 20">
                                    <path
                                        fill="currentColor"
                                        fillRule="evenodd"
                                        d="M4.25 4.25A2.75 2.75 0 0 1 7 1.5h6a2.75 2.75 0 0 1 2.75 2.75v12.793c0 1.114-1.346 1.671-2.134.884L10 14.31l-3.616 3.616c-.788.787-2.134.23-2.134-.884zM7 3c-.69 0-1.25.56-1.25 1.25v12.19l3.649-3.65a.85.85 0 0 1 1.202 0l3.649 3.65V4.25C14.25 3.56 13.69 3 13 3z"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                            </div>
                            Later
                        </div>

                        <div className="flex flex-col items-center gap-0.5">
                            <div className="flex size-9 items-center justify-center rounded-lg">
                                <svg className="size-5 fill-current" viewBox="0 0 20 20">
                                    <path
                                        fill="currentColor"
                                        d="M14.5 10a1.75 1.75 0 1 1 3.5 0 1.75 1.75 0 0 1-3.5 0m-6.25 0a1.75 1.75 0 1 1 3.5 0 1.75 1.75 0 0 1-3.5 0M2 10a1.75 1.75 0 1 1 3.5 0A1.75 1.75 0 0 1 2 10"
                                    ></path>
                                </svg>
                            </div>
                            More
                        </div>
                    </div>

                    <div className="mt-auto">
                        <div className="flex size-9 items-center justify-center rounded-full bg-white/20">
                            <svg className="size-5 fill-current text-white" viewBox="0 0 20 20">
                                <path
                                    fill="currentColor"
                                    fillRule="evenodd"
                                    d="M10.75 3.25a.75.75 0 0 0-1.5 0v6H3.251L3.25 10v-.75a.75.75 0 0 0 0 1.5V10v.75h6v6a.75.75 0 0 0 1.5 0v-6h6a.75.75 0 0 0 0-1.5h-6z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        </div>
                    </div>

                    <div className="relative mt-4 mb-6 size-9">
                        <img src="https://randomuser.me/api/portraits/men/30.jpg" className="size-9 rounded-lg" />

                        <div className="absolute -right-1 -bottom-1 box-content size-2.5 rounded-full border-3 border-[#1F2124] bg-[#3daa7c]"></div>
                    </div>
                </aside>

                <div className="mr-0.5 mb-0.5 flex flex-1 overflow-hidden rounded-lg border border-[#3B3D42]">
                    {/* Sidebar */}
                    <aside className="flex w-80 flex-none flex-col border-r border-[#3B3D42] bg-[#17191B]">
                        <div className="flex items-center justify-between px-3">
                            <div className="flex items-center gap-1.5 px-3 py-3">
                                <p className="text-lg font-extrabold">Acme</p>
                                <svg viewBox="0 0 20 20" className="size-5">
                                    <path
                                        fill="currentColor"
                                        d="M5.72 7.47a.75.75 0 0 1 1.06 0L10 10.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-3.75 3.75a.75.75 0 0 1-1.06 0L5.72 8.53a.75.75 0 0 1 0-1.06"
                                    ></path>
                                </svg>
                            </div>

                            <div className="flex items-center gap-4">
                                <svg className="size-5 cursor-pointer text-[#aaa]" viewBox="0 0 20 20">
                                    <path
                                        fill="currentColor"
                                        fillRule="evenodd"
                                        d="m9.151 3.676.271-1.108a2.5 2.5 0 0 1 1.156 0l.271 1.108a2 2 0 0 0 3.022 1.252l.976-.592a2.5 2.5 0 0 1 .817.817l-.592.975a2 2 0 0 0 1.252 3.023l1.108.27c.09.38.09.777 0 1.157l-1.108.27a2 2 0 0 0-1.252 3.023l.592.975a2.5 2.5 0 0 1-.817.818l-.976-.592a2 2 0 0 0-3.022 1.251l-.271 1.109a2.5 2.5 0 0 1-1.156 0l-.27-1.108a2 2 0 0 0-3.023-1.252l-.975.592a2.5 2.5 0 0 1-.818-.818l.592-.975a2 2 0 0 0-1.252-3.022l-1.108-.271a2.5 2.5 0 0 1 0-1.156l1.108-.271a2 2 0 0 0 1.252-3.023l-.592-.975a2.5 2.5 0 0 1 .818-.817l.975.592A2 2 0 0 0 9.15 3.676m2.335-2.39a4 4 0 0 0-2.972 0 .75.75 0 0 0-.45.518l-.372 1.523-.004.018a.5.5 0 0 1-.758.314l-.016-.01-1.34-.813a.75.75 0 0 0-.685-.048 4 4 0 0 0-2.1 2.1.75.75 0 0 0 .047.685l.814 1.34.01.016a.5.5 0 0 1-.314.759l-.018.004-1.523.372a.75.75 0 0 0-.519.45 4 4 0 0 0 0 2.971.75.75 0 0 0 .519.45l1.523.373.018.004a.5.5 0 0 1 .314.758l-.01.016-.814 1.34a.75.75 0 0 0-.048.685 4 4 0 0 0 2.101 2.1.75.75 0 0 0 .685-.048l1.34-.813.016-.01a.5.5 0 0 1 .758.314l.004.018.372 1.523a.75.75 0 0 0 .45.518 4 4 0 0 0 2.972 0 .75.75 0 0 0 .45-.518l.372-1.523.004-.018a.5.5 0 0 1 .758-.314l.016.01 1.34.813a.75.75 0 0 0 .685.049 4 4 0 0 0 2.101-2.101.75.75 0 0 0-.048-.685l-.814-1.34-.01-.016a.5.5 0 0 1 .314-.758l.018-.004 1.523-.373a.75.75 0 0 0 .519-.45 4 4 0 0 0 0-2.97.75.75 0 0 0-.519-.45l-1.523-.373-.018-.004a.5.5 0 0 1-.314-.759l.01-.015.814-1.34a.75.75 0 0 0 .048-.685 4 4 0 0 0-2.101-2.101.75.75 0 0 0-.685.048l-1.34.814-.016.01a.5.5 0 0 1-.758-.315l-.004-.017-.372-1.524a.75.75 0 0 0-.45-.518M8 10a2 2 0 1 1 4 0 2 2 0 0 1-4 0m2-3.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>

                                <svg className="size-5 fill-current text-[#ABABAD]" viewBox="0 0 20 20">
                                    <path
                                        fill="currentColor"
                                        fillRule="evenodd"
                                        d="M16.707 3.268a1 1 0 0 0-1.414 0l-.482.482 1.439 1.44.482-.483a1 1 0 0 0 0-1.414zM15.19 6.25l-1.44-1.44-5.068 5.069-.431 1.872 1.87-.432zm-.957-4.043a2.5 2.5 0 0 1 3.536 0l.025.025a2.5 2.5 0 0 1 0 3.536l-6.763 6.763a.75.75 0 0 1-.361.2l-3.25.75a.75.75 0 0 1-.9-.9l.75-3.25a.75.75 0 0 1 .2-.361zM5.25 4A2.25 2.25 0 0 0 3 6.25v8.5A2.25 2.25 0 0 0 5.25 17h8.5A2.25 2.25 0 0 0 16 14.75v-4.5a.75.75 0 0 1 1.5 0v4.5a3.75 3.75 0 0 1-3.75 3.75h-8.5a3.75 3.75 0 0 1-3.75-3.75v-8.5A3.75 3.75 0 0 1 5.25 2.5h4.5a.75.75 0 0 1 0 1.5z"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="flex-1 px-3 text-[#ACADAD]">
                                <div className="flex items-center gap-2 rounded px-3 pt-0.5 pb-1">
                                    <svg className="size-5" viewBox="0 0 20 20">
                                        <path
                                            fill="currentColor"
                                            fillRule="evenodd"
                                            d="M1.5 4.75A.75.75 0 0 1 2.25 4h15.5a.75.75 0 0 1 0 1.5H2.25a.75.75 0 0 1-.75-.75m0 5.25a.75.75 0 0 1 .75-.75h15.5a.75.75 0 0 1 0 1.5H2.25A.75.75 0 0 1 1.5 10m.75 4.5a.75.75 0 0 0 0 1.5h11a.75.75 0 0 0 0-1.5z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                    Unreads
                                </div>

                                <div className="flex items-center gap-2 rounded px-3 pt-0.5 pb-1">
                                    <svg className="size-5" viewBox="0 0 20 20">
                                        <path
                                            fill="currentColor"
                                            fillRule="evenodd"
                                            d="M10 3a7 7 0 1 0 3.394 13.124.75.75 0 0 1 .542-.074l2.794.68-.68-2.794a.75.75 0 0 1 .073-.542A7 7 0 0 0 10 3m-8.5 7a8.5 8.5 0 1 1 16.075 3.859l.904 3.714a.75.75 0 0 1-.906.906l-3.714-.904A8.5 8.5 0 0 1 1.5 10M6 8.25a.75.75 0 0 1 .75-.75h6.5a.75.75 0 0 1 0 1.5h-6.5A.75.75 0 0 1 6 8.25M6.75 11a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                    Threads
                                </div>

                                <div className="flex items-center gap-2 rounded px-3 pt-0.5 pb-1">
                                    <svg viewBox="0 0 20 20" className="size-5">
                                        <path
                                            fill="currentColor"
                                            fillRule="evenodd"
                                            d="M1.856 1.612a.75.75 0 0 1 .73-.033l15.5 7.75a.75.75 0 0 1 0 1.342l-15.5 7.75A.75.75 0 0 1 1.5 17.75v-6.046c0-.68.302-1.29.78-1.704a2.25 2.25 0 0 1-.78-1.704V2.25a.75.75 0 0 1 .356-.638M3 3.464v4.832a.75.75 0 0 0 .727.75l6.546.204a.75.75 0 0 1 0 1.5l-6.546.204a.75.75 0 0 0-.727.75v4.833L16.073 10z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                    Drafts & sent
                                </div>
                            </div>

                            <div className="flex-1 px-3 text-[#ACADAD]">
                                <div className="flex items-center gap-2 px-3">
                                    <svg viewBox="0 0 24 24" className="size-4">
                                        <path
                                            d="M6.69444 7L19.3056 7C20.3445 7 20.8925 8.23053 20.1975 9.00276L13.892 16.0089C13.4153 16.5386 12.5847 16.5386 12.108 16.0089L5.80248 9.00276C5.10748 8.23053 5.65551 7 6.69444 7Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    Channels
                                </div>

                                <ul className="mt-1">
                                    {['general', 'random', 'engineering', 'design', 'support'].map((channel) => (
                                        <li
                                            key={channel}
                                            className={cn(
                                                'flex cursor-pointer items-center gap-2 rounded py-0.5 pr-2 pb-1 pl-3 hover:bg-[#2c2d30]',
                                                channel === 'support' && 'bg-[#393C40]! text-[#F8F8F8]',
                                            )}
                                        >
                                            <svg viewBox="0 0 20 20" className="size-4">
                                                <path
                                                    fill="currentColor"
                                                    d="M9.74 3.878a.75.75 0 1 0-1.48-.255L7.68 7H3.75a.75.75 0 0 0 0 1.5h3.67L6.472 14H2.75a.75.75 0 0 0 0 1.5h3.463l-.452 2.623a.75.75 0 0 0 1.478.255l.496-2.878h3.228l-.452 2.623a.75.75 0 0 0 1.478.255l.496-2.878h3.765a.75.75 0 0 0 0-1.5h-3.506l.948-5.5h3.558a.75.75 0 0 0 0-1.5h-3.3l.54-3.122a.75.75 0 0 0-1.48-.255L12.43 7H9.2zM11.221 14l.948-5.5H8.942L7.994 14z"
                                                    fillRule="evenodd"
                                                ></path>
                                            </svg>
                                            {channel}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="space-y-4 px-3 text-[#ACADAD]">
                                <div className="flex items-center gap-2 px-3">
                                    <svg viewBox="0 0 24 24" className="size-4 -rotate-90">
                                        <path
                                            d="M6.69444 7L19.3056 7C20.3445 7 20.8925 8.23053 20.1975 9.00276L13.892 16.0089C13.4153 16.5386 12.5847 16.5386 12.108 16.0089L5.80248 9.00276C5.10748 8.23053 5.65551 7 6.69444 7Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    Direct messages
                                </div>

                                <div className="flex items-center gap-2 px-3">
                                    <svg viewBox="0 0 24 24" className="size-4 -rotate-90">
                                        <path
                                            d="M6.69444 7L19.3056 7C20.3445 7 20.8925 8.23053 20.1975 9.00276L13.892 16.0089C13.4153 16.5386 12.5847 16.5386 12.108 16.0089L5.80248 9.00276C5.10748 8.23053 5.65551 7 6.69444 7Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    Apps
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Area */}
                    <main className="flex min-w-0 flex-1 flex-col bg-[#1B1D21]">
                        {/* Top Bar */}
                        <header className="flex h-12 items-center justify-between border-b border-white/10 px-4">
                            <div className="flex items-center gap-2 text-lg font-extrabold text-[#d1d2d3]">
                                <svg viewBox="0 0 20 20" className="size-4.5">
                                    <path
                                        fill="currentColor"
                                        d="M9.74 3.878a.75.75 0 1 0-1.48-.255L7.68 7H3.75a.75.75 0 0 0 0 1.5h3.67L6.472 14H2.75a.75.75 0 0 0 0 1.5h3.463l-.452 2.623a.75.75 0 0 0 1.478.255l.496-2.878h3.228l-.452 2.623a.75.75 0 0 0 1.478.255l.496-2.878h3.765a.75.75 0 0 0 0-1.5h-3.506l.948-5.5h3.558a.75.75 0 0 0 0-1.5h-3.3l.54-3.122a.75.75 0 0 0-1.48-.255L12.43 7H9.2zM11.221 14l.948-5.5H8.942L7.994 14z"
                                        fillRule="evenodd"
                                    ></path>
                                </svg>
                                support
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="flex h-7 items-center gap-1 rounded-lg border border-white/20 px-1 pr-1.5 text-xs text-gray-400">
                                    <svg viewBox="0 0 20 20" className="size-5">
                                        <path
                                            fill="currentColor"
                                            fillRule="evenodd"
                                            d="M7 6.673c0-1.041.352-1.824.874-2.345C8.398 3.805 9.139 3.5 10 3.5c.86 0 1.602.305 2.126.828.522.521.874 1.304.874 2.345a3.9 3.9 0 0 1-1.05 2.646c-.629.678-1.38 1.014-1.95 1.014S8.679 9.997 8.05 9.32A3.9 3.9 0 0 1 7 6.673M10 2c-1.222 0-2.356.438-3.186 1.267C5.98 4.1 5.5 5.277 5.5 6.673a5.4 5.4 0 0 0 1.951 4.14 10 10 0 0 0-1.873.658c-1.464.693-2.811 1.828-3.448 3.557-.3.811-.067 1.59.423 2.132.475.526 1.193.84 1.947.84h11c.754 0 1.472-.314 1.947-.84.49-.542.722-1.32.424-2.132-.638-1.729-1.985-2.864-3.45-3.557a10 10 0 0 0-1.872-.657q.265-.221.5-.475A5.4 5.4 0 0 0 14.5 6.673c0-1.396-.481-2.574-1.314-3.406C12.356 2.438 11.223 2 10 2M3.537 15.547c.463-1.256 1.459-2.14 2.683-2.72C7.449 12.246 8.853 12 10 12s2.552.246 3.78.827c1.224.58 2.22 1.464 2.683 2.72.083.225.034.427-.129.607a1.14 1.14 0 0 1-.834.346h-11c-.35 0-.657-.15-.834-.346-.163-.18-.212-.382-.129-.607"
                                        ></path>
                                    </svg>
                                    13
                                </div>

                                <div className="flex h-7 items-center gap-0.5 rounded-lg border border-white/20 px-1 text-xs text-gray-400">
                                    <svg viewBox="0 0 20 20" className="mx-1 size-5">
                                        <path
                                            fill="currentColor"
                                            fillRule="evenodd"
                                            d="M5.094 4.571C3.785 5.825 3 7.444 3 8.966v1.371A3.45 3.45 0 0 1 5.25 9.5h.5c1.064 0 1.75.957 1.75 1.904v5.192c0 .947-.686 1.904-1.75 1.904h-.5c-2.168 0-3.75-1.99-3.75-4.211v-.578q0-.105.005-.211H1.5V8.966c0-2.02 1.024-4.01 2.556-5.478C5.595 2.014 7.711 1 10 1s4.405 1.014 5.944 2.488C17.476 4.956 18.5 6.945 18.5 8.966V13.5h-.005q.005.105.005.211v.578c0 2.221-1.582 4.211-3.75 4.211h-.5c-1.064 0-1.75-.957-1.75-1.904v-5.192c0-.947.686-1.904 1.75-1.904h.5c.864 0 1.635.316 2.25.837V8.966c0-1.522-.785-3.141-2.094-4.395C13.602 3.322 11.844 2.5 10 2.5s-3.602.822-4.906 2.071m9.016 6.508a.5.5 0 0 0-.11.325v5.192c0 .145.05.257.11.325.057.066.109.079.14.079h.5c1.146 0 2.25-1.11 2.25-2.711v-.578C17 12.11 15.896 11 14.75 11h-.5c-.031 0-.083.013-.14.08M3 13.711C3 12.11 4.105 11 5.25 11h.5c.031 0 .083.013.14.08.06.067.11.18.11.324v5.192a.5.5 0 0 1-.11.325c-.057.066-.109.079-.14.079h-.5C4.105 17 3 15.89 3 14.289z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>

                                    <div className="h-4 w-px bg-white/20" />

                                    <svg className="size-5 cursor-pointer" viewBox="0 0 20 20">
                                        <path
                                            fill="currentColor"
                                            fillRule="evenodd"
                                            d="M5.72 7.47a.75.75 0 0 1 1.06 0L10 10.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-3.75 3.75a.75.75 0 0 1-1.06 0L5.72 8.53a.75.75 0 0 1 0-1.06"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                </div>

                                <svg className="ml-1 size-5 cursor-pointer text-[#aaa]" viewBox="0 0 20 20">
                                    <path
                                        fill="currentColor"
                                        fillRule="evenodd"
                                        d="M10 5.5A1.75 1.75 0 1 1 10 2a1.75 1.75 0 0 1 0 3.5m0 6.25a1.75 1.75 0 1 1 0-3.5 1.75 1.75 0 0 1 0 3.5m-1.75 4.5a1.75 1.75 0 1 0 3.5 0 1.75 1.75 0 0 0-3.5 0"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                            </div>
                        </header>

                        {/* Messages */}
                        <div className="flex-1 overflow-auto pb-5 [scrollbar-color:#ffffff44_transparent]">
                            {messages.map((message, index) => (
                                <Message
                                    key={index}
                                    message={message}
                                    mouseDown={mouseDown}
                                    setMouseDown={setMouseDown}
                                    index={index}
                                    firstMessageIndex={firstMessageIndex}
                                    setFirstMessageIndex={setFirstMessageIndex}
                                    isLast={index === messages.length - 1}
                                    lastMessageIndex={lastMessageIndex}
                                    setLastMessageIndex={setLastMessageIndex}
                                    setDragDirection={setDragDirection}
                                    setThread={setThread}
                                    showDayDivider={shouldShowDayDivider(messages, index)}
                                    noHeader={shouldHaveNoHeader(messages, index)}
                                    setThreadOpen={setThreadOpen}
                                    setDialogOpen={setDialogOpen}
                                    messages={messages}
                                    calculateThreadPreview={calculateThreadPreview}
                                />
                            ))}
                        </div>

                        {/* Message Input */}
                        <div className="relative p-5 pt-0">
                            <Composer placeholder="Message #support" />
                        </div>
                    </main>

                    {/* Thread Sidebar */}

                    {threadOpen !== null && messages[threadOpen] && (
                        <aside className="flex w-100 min-w-0 flex-none flex-col border-l border-[#3B3D42] bg-[#17191B]">
                            <div className="flex h-12 flex-none items-center justify-between border-b border-white/10 pr-2 pl-4">
                                <div className="text-lg font-extrabold text-[#d1d2d3]">Thread</div>
                                <button
                                    className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-gray-400 hover:bg-white/5 hover:text-gray-200"
                                    onClick={() => setThreadOpen(null)}
                                >
                                    <svg className="size-5" viewBox="0 0 20 20">
                                        <path
                                            fill="currentColor"
                                            fillRule="evenodd"
                                            d="M16.53 3.47a.75.75 0 0 1 0 1.06L11.06 10l5.47 5.47a.75.75 0 0 1-1.06 1.06L10 11.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L8.94 10 3.47 4.53a.75.75 0 0 1 1.06-1.06L10 8.94l5.47-5.47a.75.75 0 0 1 1.06 0"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto">
                                <ThreadMessage
                                    message={messages[threadOpen]}
                                    mouseDown={mouseDown}
                                    index={threadOpen}
                                    className="pt-5 [&>.actions]:top-1"
                                />

                                <div className="flex items-center gap-4 px-4 py-1">
                                    <p className="text-[13px] text-[#E8E8E8B3]">
                                        {messages[threadOpen]?.replies?.length || 0} repl
                                        {(messages[threadOpen]?.replies?.length || 0) !== 1 ? 'ies' : 'y'}
                                    </p>

                                    <div className="h-px flex-1 bg-white/10" />
                                </div>

                                {messages[threadOpen]?.replies &&
                                    messages[threadOpen].replies.length > 0 &&
                                    messages[threadOpen].replies.map((reply, index) => (
                                        <ThreadMessage
                                            key={index}
                                            message={reply}
                                            index={index}
                                            showDayDivider={false}
                                            noHeader={shouldHaveNoHeader(messages[threadOpen]?.replies || [], index)}
                                        />
                                    ))}

                                <div className="flex-none p-4 pb-5">
                                    <Composer placeholder="Reply…" />
                                </div>
                            </div>
                        </aside>
                    )}
                </div>
            </div>

            <div
                className={cn(
                    'fixed flex h-screen w-screen items-center justify-center bg-black/60 transition-opacity duration-200',
                    dialogOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
                )}
            >
                <div className="w-150 rounded-xl border border-[#262628] bg-[#1B1D21] p-6 text-[#d1d2d3]">
                    <p className="text-lg font-extrabold">Merge into thread</p>

                    <p className="mt-4 leading-relaxed">
                        Are you sure you want to merge these {calculateThreadPreview(messages, firstMessageIndex, lastMessageIndex).length} messages
                        into a thread?
                        <br />
                        This cannot be undone.
                    </p>

                    <div className="mt-6 h-80 w-full overflow-auto rounded-lg border border-[#3B3D42] bg-[#17191B] p-2 pt-4 pb-8">
                        {calculateThreadPreview(messages, firstMessageIndex, lastMessageIndex).map((message, index) => (
                            <div key={index}>
                                <ThreadMessage
                                    message={message}
                                    index={index}
                                    showDayDivider={false}
                                    noHeader={
                                        index > 0 && shouldHaveNoHeader(calculateThreadPreview(messages, firstMessageIndex, lastMessageIndex), index)
                                    }
                                    className="hover:bg-transparent [&>.actions]:hidden"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-4 font-bold">
                        <button
                            className="flex h-10 cursor-pointer items-center justify-center rounded-lg border border-white/20 px-4 text-white hover:bg-white/2"
                            onClick={() => {
                                setDialogOpen(false);
                                setFirstMessageIndex(null);
                                setLastMessageIndex(null);
                            }}
                        >
                            Cancel
                        </button>

                        <button
                            className="flex h-10 cursor-pointer items-center justify-center rounded-lg bg-[#00553D] px-4 text-white hover:bg-[#1B624C]"
                            onClick={() => {
                                setThread([firstMessageIndex, lastMessageIndex]);
                                setFirstMessageIndex(null);
                                setLastMessageIndex(null);
                                setDialogOpen(false);
                            }}
                        >
                            Merge into thread
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
