import { CollectionConfig } from 'payload/types';
import { Message, PluginOptions } from '../types';

const messages = ({ collections, users: { collection:usersCollection } }: PluginOptions): CollectionConfig => {
    const Messages: CollectionConfig = {
        slug: 'messages',
        admin: {
            group: 'Collaboration',
            defaultColumns: ['content', 'thread', 'repondingTo', 'user', 'createdAt'],
            useAsTitle: 'content',
            disableDuplicate: true,
        },
        access: {
            // read: loggedIn
            // TODO handle access
        },
        fields: [
            {
                name: 'content',
                type: 'textarea',
                required: true,
            },
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
                name: 'parent',
                type: 'relationship',
                relationTo: 'messages',
                hasMany: false,
                admin: {
                    allowCreate: false,
                },
            },
            {
                name: 'repondingTo',
                type: 'relationship',
                relationTo: 'messages',
                hasMany: false,
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
                defaultValue: async ({ user }) => user.id,
                admin: {
                    // readOnly: true,
                    allowCreate: false,
                },
            },
            {
                name: 'resolved',
                type: 'checkbox',
                defaultValue: false,
            },

        ],
        endpoints: [
            {
                path: '/threads/:docId',
                method: 'get',
                handler: async (req, res, next) => {
                    const { payload, params } = req;

                    // Get all parents
                    const parents = await payload.find({
                        collection: 'messages',
                        where: {
                            and: [
                                { 'doc.value': { equals: params.docId } },
                                { resolved: { equals: false } },
                                { parent: { exists: false } },
                            ]
                        },
                        sort: "createdAt",
                    });
                    if(parents?.docs){
                        const parentsWithChildren: Message[] = await Promise.all(parents.docs.map( async (message) => {
                            const messages = await payload.find({
                                collection: 'messages',
                                where: {
                                    parent: {
                                        equals: message.id,
                                    }
                                },
                                sort: "createdAt",
                            });
                            const hasChildren = messages?.docs && messages.docs.length > 0;
                            const children = hasChildren ? messages.docs : [];
                            return {...message, children: children};
                        }));

                        res.status(200).send({ docs: parentsWithChildren });
                    }else{
                        res.status(500).send({ error: 'something went wrong' });
                    }
                }
            }
        ],
        hooks: {
            afterDelete: [
                async ({ doc: message, req: { payload } }) => {
                    // Check if the message was a thread
                    if(!message.parent){
                        // Delete all children messages
                        const deleteResult = payload.delete({
                            collection: 'messages',
                            where: {
                                parent: {
                                    equals: message.id,
                                }
                            },
                        });
                        if (!deleteResult) {
                            console.error('Thread delete in message beforeDelete failed');
                            // TODO handle error properly
                        }
                    }
                }
            ]
        }
    };

    return Messages;
}


export default messages;