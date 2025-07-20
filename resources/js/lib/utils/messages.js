// Helper function to extract date from message date string
export const getDateFromMessage = (dateString) => {
    return dateString.split(' ')[0]; // Extract '7/17/25' from '7/17/25 8:15 AM'
};

// Helper function to parse message date and time into a Date object
export const parseMessageDate = (dateString) => {
    // Convert '7/17/25 8:15 AM' to a proper Date object
    const [datePart, timePart, ampm] = dateString.split(' ');
    const [month, day, year] = datePart.split('/');
    const [hour, minute] = timePart.split(':');

    let hour24 = parseInt(hour);
    if (ampm === 'PM' && hour24 !== 12) hour24 += 12;
    if (ampm === 'AM' && hour24 === 12) hour24 = 0;

    return new Date(2000 + parseInt(year), parseInt(month) - 1, parseInt(day), hour24, parseInt(minute));
};

// Helper function to check if a message should show a day divider
export const shouldShowDayDivider = (messages, currentIndex) => {
    if (currentIndex === 0) return true; // First message always shows divider

    const currentDate = getDateFromMessage(messages[currentIndex].date);
    const previousDate = getDateFromMessage(messages[currentIndex - 1].date);

    return currentDate !== previousDate;
};

// Helper function to check if a message should have no header
export const shouldHaveNoHeader = (messages, currentIndex) => {
    if (currentIndex === 0) return false; // First message always has header

    const currentMessage = messages[currentIndex];
    const previousMessage = messages[currentIndex - 1];

    // Different users always get headers
    if (currentMessage.user !== previousMessage.user) return false;

    // Parse the dates
    const currentTime = parseMessageDate(currentMessage.date);
    const previousTime = parseMessageDate(previousMessage.date);

    // Check if within 2 minutes (2 * 60 * 1000 milliseconds)
    const timeDiff = currentTime - previousTime;
    return timeDiff <= 2 * 60 * 1000;
};

// Helper function to format relative time for last reply
export const formatRelativeTime = (dateString) => {
    if (!dateString) return '';

    const messageDate = parseMessageDate(dateString);
    const now = new Date();

    // Calculate time difference in milliseconds
    const timeDiff = now - messageDate;
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));

    // Check if it's today
    const isToday = now.toDateString() === messageDate.toDateString();
    const time = dateString.split(' ').slice(1).join(' '); // Extract "3:23 PM"

    if (isToday) {
        return `today at ${time}`;
    } else if (daysDiff < 2) {
        return `yesterday at ${time}`;
    } else if (daysDiff < 7) {
        return `${daysDiff} days ago`;
    } else if (hoursDiff < 48) {
        return `${hoursDiff} hours ago`;
    } else {
        // For older messages, show the actual date
        const time = dateString.split(' ').slice(1).join(' ');
        return `on ${messageDate.toLocaleDateString()} at ${time}`;
    }
};

// Helper function to ensure proper ordering of start and end indices
export const normalizeIndices = (first, last) => {
    if (first === null || last === null) return { start: null, end: null };
    return {
        start: Math.min(first, last),
        end: Math.max(first, last),
    };
};
