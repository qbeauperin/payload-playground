export type PluginOptions = {
    collections?: Array<string>
}

export type TranslationProgress = Record<string, number>

export const progressColors = [
    { max: 1, color: '' },
    { max: 50, color: 'red' },
    { max: 75, color: 'orangered' },
    { max: 99, color: 'orange' },
    { max: 100, color: 'green' }
];