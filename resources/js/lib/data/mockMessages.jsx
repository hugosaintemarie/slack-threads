export const mockMessages = [
    {
        user: 'Matt',
        date: '7/19/25 8:15 AM',
        content: (
            <>
                Heads up - we're getting reports of login timeouts for users in the APAC region.
                Investigating now.
            </>
        ),
        reactions: [{ emoji: '🔍', count: 2 }],
    },
    {
        user: 'Caroline',
        date: '7/19/25 8:42 AM',
        content: (
            <>
                Customer escalation:{' '}
                <span className="cursor-pointer text-[#1D9BD1] hover:text-[#40B3E4] hover:underline">
                    this enterprise client
                </span>{' '}
                can't access their billing dashboard. They have a board meeting in 2 hours 👀
            </>
        ),
        reactions: [{ emoji: '🚨', count: 3 }],
        replies: [
            {
                user: 'Matt',
                date: '7/19/25 8:55 AM',
                content: <>On it</>,
            },
        ],
    },
    {
        user: 'Roberto',
        date: '7/19/25 9:10 AM',
        content: (
            <>
                PSA: Updated our{' '}
                <span className="cursor-pointer text-[#1D9BD1] hover:text-[#40B3E4] hover:underline">
                    status page
                </span>{' '}
                with maintenance window for this weekend. SSL certificate renewal scheduled for
                Saturday 2 AM EST.
            </>
        ),
    },
    {
        user: 'Caroline',
        date: '7/19/25 9:33 AM',
        content: (
            <>
                Mobile app feedback: Users are reporting the new search feature is much faster! App
                Store rating went up to 4.7 stars{' '}
                <span className="ml-px inline-block translate-y-0.5 text-xl">💪</span>
            </>
        ),
        reactions: [
            { emoji: '📱', count: 2 },
            { emoji: '⭐', count: 5 },
        ],
    },
    {
        user: 'Matt',
        date: '7/19/25 10:05 AM',
        content: (
            <>
                Bug report: The export function for large datasets (&gt;10k records) is timing out.
                Working on pagination solution.
            </>
        ),
        replies: [
            {
                user: 'Matt',
                date: '7/19/25 10:15 AM',
                content: (
                    <>
                        See{' '}
                        <span className="cursor-pointer text-[#1D9BD1] hover:text-[#40B3E4] hover:underline">
                            #789
                        </span>
                    </>
                ),
            },
        ],
    },
    {
        user: 'Roberto',
        date: '7/19/25 10:28 AM',
        content: <>Can we integrate with Jira? We've just had our 5th request this month.</>,
        reactions: [{ emoji: '🤔', count: 3 }],
        replies: [
            {
                user: 'Matt',
                date: '7/19/25 10:35 AM',
                content: <>UGH</>,
            },
        ],
    },
    {
        user: 'Caroline',
        date: '7/19/25 11:28 AM',
        content: (
            <>
                Can we add a troubleshooting section for SSO setup? Getting lots of questions about
                SAML configuration.
            </>
        ),
        reactions: [{ emoji: '📝', count: 2 }],
    },
    {
        user: 'Caroline',
        date: '7/19/25 12:25 PM',
        content: (
            <>
                Folks are loving the new UI updates! Well done team{' '}
                <span className="ml-px inline-block translate-y-0.5 text-xl">🎉</span>
            </>
        ),
        reactions: [{ emoji: '❤️', count: 6 }],
    },
    {
        user: 'Matt',
        date: '7/19/25 12:30 PM',
        content: (
            <>
                We've found an issue with email notifications not being sent for password resets.
                Working on a hotfix now.
            </>
        ),
        reactions: [{ emoji: '🚨', count: 1 }],
        replies: [
            {
                user: 'Matt',
                date: '7/19/25 12:59 PM',
                content: <>This should be resolved</>,
            },
        ],
    },
    {
        user: 'Roberto',
        date: '7/19/25 1:22 PM',
        content: (
            <>We have two enterprise customers hitting rate limits with bulk contact import.</>
        ),
        replies: [
            {
                user: 'Caroline',
                date: '7/19/25 1:23 PM',
                content: (
                    <>
                        <span className="cursor-pointer rounded-sm bg-[#1D9BD1]/20 px-0.5 text-[#1D9BD1] hover:bg-[#1D9BD1]/30">
                            @Matt
                        </span>{' '}
                        and I have a meeting on rate limits scheduled for Friday FWIW 🙂
                    </>
                ),
                reactions: [{ emoji: '👍', count: 1 }],
            },
        ],
    },
    {
        user: 'Roberto',
        date: '7/19/25 1:24 PM',
        content: (
            <>
                <span className="cursor-pointer rounded-sm bg-[#1D9BD1]/20 px-0.5 text-[#1D9BD1] hover:bg-[#1D9BD1]/30">
                    @Matt
                </span>{' '}
                can we bump the limits for them?
            </>
        ),
    },
    {
        user: 'Roberto',
        date: '7/19/25 1:25 PM',
        content: <>Like up to 50k? wdyt</>,
    },
    {
        user: 'Matt',
        date: '7/19/25 1:26 PM',
        content: (
            <>
                Yeah will do <span className="ml-px inline-block translate-y-0.5 text-xl">👍</span>
            </>
        ),
        reactions: [{ emoji: '🙏', count: 2 }],
        replies: [
            {
                user: 'Matt',
                date: '7/19/25 1:30 PM',
                content: (
                    <>
                        <span className="cursor-pointer rounded-sm bg-[#1D9BD1]/20 px-0.5 text-[#1D9BD1] hover:bg-[#1D9BD1]/30">
                            @Roberto
                        </span>{' '}
                        done! They can now import up to 50k contacts every hour.
                    </>
                ),
            },
            {
                user: 'Caroline',
                date: '7/19/25 1:32 PM',
                content: (
                    <>
                        I'll let them know{' '}
                        <span className="ml-px inline-block translate-y-0.5 text-xl">👌</span>
                    </>
                ),
                reactions: [{ emoji: '🙌', count: 1 }],
            },
        ],
    },
    {
        user: 'Caroline',
        date: '7/19/25 3:15 PM',
        content: (
            <>
                I've added troubleshooting guides for the most common user issues. Check out the new{' '}
                <span className="cursor-pointer text-[#1D9BD1] hover:text-[#40B3E4] hover:underline">
                    docs.acme.com
                </span>{' '}
                when you have a moment!
            </>
        ),
        reactions: [{ emoji: '📚', count: 2 }],
    },
    {
        user: 'Roberto',
        date: '7/20/25 8:52 AM',
        content: (
            <>
                Just a heads up - we've removed the feature flag for message attachments. This is
                available to everyone now! cc{' '}
                <span className="cursor-pointer rounded-sm bg-[#1D9BD1]/20 px-0.5 text-[#1D9BD1] hover:bg-[#1D9BD1]/30">
                    @Caroline
                </span>
            </>
        ),
        reactions: [
            { emoji: '🚀', count: 3 },
            { emoji: '👍', count: 1 },
            { emoji: '📎', count: 1 },
        ],
    },
    {
        user: 'Caroline',
        date: '7/20/25 3:26 PM',
        content: (
            <>
                We've had a few users report unexpected delays when loading the logs page,
                especially when filtering by date range.
            </>
        ),
        reactions: [{ emoji: '👀', count: 2 }],
    },
    {
        user: 'Caroline',
        date: '7/20/25 3:26 PM',
        content: (
            <>
                <span className="cursor-pointer rounded-sm bg-[#1D9BD1]/20 px-0.5 text-[#1D9BD1] hover:bg-[#1D9BD1]/30">
                    @Matt
                </span>{' '}
                can you please take a look when you have a moment?
            </>
        ),
    },
    {
        user: 'Matt',
        date: '7/20/25 3:29 PM',
        content: 'Mmmmh',
    },
    {
        user: 'Matt',
        date: '7/20/25 3:29 PM',
        content: (
            <>
                We've changed how we handle some of the database queries recently, so it's possible
                that's causing the issue.
            </>
        ),
    },
    {
        user: 'Matt',
        date: '7/20/25 3:30 PM',
        content: 'Let me check',
    },
    {
        user: 'Roberto',
        date: '7/20/25 3:30 PM',
        content: (
            <>
                I can hop on a call if you need a hand{' '}
                <span className="cursor-pointer rounded-sm bg-[#1D9BD1]/20 px-0.5 text-[#1D9BD1] hover:bg-[#1D9BD1]/30">
                    @Matt
                </span>
                , just lmk
            </>
        ),
    },
    {
        user: 'Matt',
        date: '7/20/25 3:38 PM',
        content: <>Ok found the issue</>,
    },
    {
        user: 'Matt',
        date: '7/20/25 3:38 PM',
        content: <>Working on a fix now</>,
    },
    {
        user: 'Caroline',
        date: '7/20/25 3:42 PM',
        content: (
            <>
                Also{' '}
                <span className="cursor-pointer rounded-sm bg-[#a073002e] px-0.5 text-[#dea700]">
                    @Nathan
                </span>{' '}
                it seems the new profile page breaks on mobile.
            </>
        ),
        reactions: [{ emoji: '👀', count: 1, self: true }],
    },
];
