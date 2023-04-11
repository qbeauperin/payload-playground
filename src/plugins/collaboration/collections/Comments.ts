import { CollectionConfig } from 'payload/types';

const comments = (collections: Array<string>): CollectionConfig => {
    const Comments: CollectionConfig = {
        slug: 'comments',
        admin: {
            group: 'Collaboration',
            defaultColumns: ['comment', 'doc', 'repondingTo', 'user', 'createdAt'],
            useAsTitle: 'comment',
            disableDuplicate: true,
        },
        access: {
            // read: loggedIn
        },
        fields: [
            {
                name: 'comment',
                type: 'textarea',
                required: true,
            },
            {
                name: 'repondingTo',
                type: 'relationship',
                relationTo: 'comments',
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

    return Comments;
}


export default comments;