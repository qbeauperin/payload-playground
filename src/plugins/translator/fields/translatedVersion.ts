import type { Field } from 'payload/types'

export const translatedVersion: Field = {
    name: 'translationVersion',
    type: 'text',
    hidden: true,
    admin: {
        position: 'sidebar',
        readOnly: true,
    },
}