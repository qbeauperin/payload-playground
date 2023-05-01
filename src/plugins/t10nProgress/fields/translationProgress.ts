import type { Field } from 'payload/types'

export const translationProgress: Field = {
    name: 'translationProgress',
    type: 'json',
    hidden: true,
    admin: {
        position: 'sidebar',
        readOnly: true,
    },
}