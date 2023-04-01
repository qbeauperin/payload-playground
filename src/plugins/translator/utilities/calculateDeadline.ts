import { addBusinessDays } from "./addBusinessDays";

const baseDays = 1;
const daysPerSlice = 1;
const wordsPerSlice = 1000;

export function calculateDeadline(words: number): Date {
    const duration = baseDays + (Math.ceil(words / wordsPerSlice) * daysPerSlice);
    const deadline = addBusinessDays(new Date(), duration);
    return deadline;
}