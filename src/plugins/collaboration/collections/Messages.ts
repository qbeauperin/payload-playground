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
                admin: {
                    allowCreate: false,
                },
            },
            {
                name: 'thread',
                type: 'relationship',
                relationTo: 'threads',
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
        ],
        hooks: {
            afterChange: [
                async ({ doc: message, operation, req: { payload } }) => {
                    if(operation === 'create') {
                        // If message is threadless, create a new thread
                        if (!message?.thread){
                            console.log('// create thread query: ', {
                                doc: {
                                    relationTo: message.doc.relationTo,
                                    value: message.doc.value.id,
                                },
                                user: message.user.id,
                                messages: [message.id],
                            });
                            
                            const thread = await payload.create({
                                collection: 'threads',
                                data: {
                                    doc: {
                                        relationTo: message.doc.relationTo,
                                        value: message.doc.value.id,
                                    },
                                    user: message.user.id,
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
                            console.log('// MESSAGE HAS A THREAD, seaching for: ', message.thread.id);
                            
                            const thread = await payload.findByID({
                                collection: 'threads',
                                id: message.thread.id,
                                depth: 0,
                            });
                            if(!thread) {
                                // TODO handle error
                            }
                            console.log('// thread: ', thread);
                            console.log('// update params: ', {
                                collection: 'threads',
                                id: message.thread,
                                data: {
                                    resolved: false,
                                    messages: [...thread.messages, message.id],
                                }
                            });
                            const update = await payload.update({
                                collection: 'threads',
                                id: message.thread.id,
                                data: {
                                    resolved: false,
                                    messages: [ ...thread.messages, message.id ],
                                }
                            });
                            console.log('// update: ', update);
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