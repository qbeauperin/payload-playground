import { CollectionConfig } from 'payload/types';
import { PluginOptions } from '../types';

const threads = ({ collections, users: { collection: usersCollection } }: PluginOptions): CollectionConfig => {
    const Threads: CollectionConfig = {
        slug: 'threads',
        admin: {
            group: 'Collaboration',
            defaultColumns: [ 'user', 'messages', 'isResolved', 'createdAt'],
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
                admin: {
                    allowCreate: false,
                },
            },
            {
                name: 'messages',
                type: 'relationship',
                relationTo: 'messages',
                hasMany: true,
                required: true,
                min: 1,
                admin: {
                    allowCreate: false,
                },
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
                    allowCreate: false,
                },
            },
            {
                name: 'resolved',
                type: 'checkbox',
                defaultValue: false,
            },
        ],
        hooks: {
            afterDelete: [
                async ({ doc: thread, req: { payload } }) => {
                    const deleteResult = payload.delete({
                        collection: 'messages',
                        where: {
                            id: {
                                in: thread.messages.map(message => message.id).join(','),
                            }
                        },
                    });

                    console.log('// deleteResult: ', deleteResult)
                }
            ],
        },
    };

    return Threads;
}


export default threads;