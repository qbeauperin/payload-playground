import { CollectionConfig } from 'payload/types';

const messages = (collections: Array<string>): CollectionConfig => {
    const Messages: CollectionConfig = {
        slug: 'messages',
        admin: {
            group: 'Collaboration',
            defaultColumns: ['message', 'doc', 'repondingTo', 'user', 'createdAt'],
            useAsTitle: 'message',
            disableDuplicate: true,
        },
        access: {
            // read: loggedIn
        },
        fields: [
            {
                name: 'message',
                type: 'textarea',
                required: true,
            },
            {
                name: 'repondingTo',
                type: 'relationship',
                relationTo: 'messages',
                hasMany: false,
                admin: {
                    readOnly: true,
                },
            },
            {
                name: 'doc',
                type: 'relationship',
                relationTo: collections,
                hasMany: false,
                required: true,
                // admin: {
                //     readOnly: true,
                // },
            },
            {
                name: 'user',
                type: 'relationship',
                relationTo: 'users',
                hasMany: false,
                required: true,
                defaultValue: async ({ user }) => user.id,
                admin: {
                    readOnly: true,
                },
            },
        ],
    };

    return Messages;
}


export default messages;