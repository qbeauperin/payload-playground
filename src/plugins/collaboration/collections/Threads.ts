import { CollectionConfig } from 'payload/types';
import { PluginOptions } from '../types';

const threads = ({ collections, users: { collection: usersCollection } }: PluginOptions): CollectionConfig => {
    const Threads: CollectionConfig = {
        slug: 'threads',
        admin: {
            group: 'Collaboration',
            defaultColumns: [ 'user', 'messages', 'isResolved', 'createdAt'],
            useAsTitle: 'user',
            disableDuplicate: true,
        },
        access: {
            // read: loggedIn
            // TODO handle access
        },
        fields: [
            {
                name: 'doc',
                type: 'relationship',
                relationTo: collections,
                hasMany: false,
                required: true,
            },
            {
                name: 'messages',
                type: 'relationship',
                relationTo: 'messages',
                hasMany: true,
                required: true,
                min: 1,
            },
            {
                name: 'user',
                type: 'relationship',
                relationTo: usersCollection,
                hasMany: false,
                required: true,
                defaultValue: async ({ user }) => user?.id,
                admin: {
                    readOnly: true,
                },
            },
            {
                name: 'isResolved',
                type: 'checkbox',
                defaultValue: false,
            },
        ],
    };

    return Threads;
}


export default threads;