import type { Field } from 'payload/types'

export const translationStatus: Field = {
    name: 'translationStatus',
    type: 'select',
    defaultValue: 'untranslated',
    required: true,
    options: [
        {
            value: 'untranslated',
            label: 'Untranslated',
        },
        {
            value: 'translating',
            label: 'Translating',
        },
        {
            value: 'translated',
            label: 'Translated',
        },
        {
            value: 'partiallyTranslated',
            label: 'Partially translated',
        },
    ],
    hidden: true,
    admin: {
        position: 'sidebar',
        readOnly: true,
    },
}