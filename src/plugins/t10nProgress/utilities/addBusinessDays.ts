export function addBusinessDays(date: Date, days: number): Date {
    let i = 0;
    while (i < days) {
        date.setDate(date.getDate() + 1);
        const dayOfWeek = date.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Check if it's a weekday
            i++;
        }
    }
    return date;
}