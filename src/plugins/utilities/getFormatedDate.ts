export interface FormatedDates {
    shortDate: string,
    fullDate: string,
}

export default function getFormatedDate(dateString: string = null): FormatedDates {
    const date = dateString ? new Date(dateString) : new Date();
    const now = new Date();
    const short = date.toLocaleDateString('en', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
    const full = date.toLocaleDateString('en', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
    // TODO handle i18n

    return {
        shortDate: short,
        fullDate: full,
    }
}