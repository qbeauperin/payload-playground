function calculateProgress(data, defaultProgress: { [key: string]: number }, defaultLocale:string): { [key: string]: number }|false {
    if (!data || typeof data !== 'object') return false;

    const progress = Object.assign({}, defaultProgress);
    
    if (data[defaultLocale]) {
        for (const key in data) {
            if (data[key] && data[key] !== '') progress[key]++;
        }
    } else {
        for (const key in data) {
            const childProgress = calculateProgress(data[key], defaultProgress, defaultLocale);
            if(childProgress){
                for (const childKey in childProgress) {
                    progress[childKey] += childProgress[childKey];
                }
            }
        }
    }
    return progress;
}

export function calculateT9nProgress(data, locales:string[], defaultLocale:string): { [key: string]: number }|false {
    const defaultProgress = locales.reduce((acc, locale) => {
        acc[locale] = 0;
        return acc;
    }, {});
    return calculateProgress(data, defaultProgress, defaultLocale);
}