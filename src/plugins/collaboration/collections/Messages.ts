import { CollectionConfig } from 'payload/types';
import { PluginOptions } from '../types';

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
            },
            {
                name: 'thread',
                type: 'relationship',
                relationTo: 'threads',
                hasMany: false,
                required: false,
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
                name: 'user',
                type: 'relationship',
                relationTo: usersCollection,
                hasMany: false,
                required: true,
                defaultValue: async ({ user }) => user.id,
                admin: {
                    readOnly: true,
                },
            },
        ],
        hooks: {
            afterChange: [
                async ({ doc: message, operation, req: { payload } }) => {
                    if(operation === 'create') {
                        // If message is threadless, create a new thread
                        if (!message?.thread){
                            const thread = await payload.create({
                                collection: 'threads',
                                data: {
                                    doc: message.doc,
                                    user: message.user,
                                    messages: [ message.id ],
                                }
                            });
                            if (thread?.id){
                                const update = await payload.update({
                                    collection: 'messages',
                                    id: message.id,
                                    data: {
                                        thread: thread.id,
                                    }   
                                });
                                if (!update) {
                                    // TODO handle error
                                }
                            }else{
                                // TODO handle error
                            }
                        }
                        // If message has a thread, add it to the thread's messages
                        else {
                            const thread = await payload.findByID({
                                collection: 'threads',
                                id: message.thread,
                                depth: 0,
                            });
                            if(!thread) {
                                // TODO handle error
                            }
                            const update = await payload.update({
                                collection: 'threads',
                                id: message.thread,
                                data: {
                                    resolved: false,
                                    messages: [ ...thread.messages, message.id ],
                                }
                            });
                            if(!update){
                                // TODO handle error
                            }
                        }
                    }

                    return message;
                }
            ]
        }
    };

    return Messages;
}


export default messages;