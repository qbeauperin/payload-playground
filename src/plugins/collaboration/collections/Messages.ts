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
                                    console.error('Message update in message afterChange failed');
                                    // TODO handle error properly
                                }
                            }else{
                                console.error('Thread create in message afterChange failed');
                                // TODO handle error properly
                            }
                        }
                        // If message has a thread, add it to the thread's messages
                        else {
                            const thread = await payload.findByID({
                                collection: 'threads',
                                id: message.thread.id,
                                depth: 0,
                            });
                            if(!thread) {
                                console.error('Thread findById in message afterChange failed');
                                // TODO handle error properly
                            }
                            const update = await payload.update({
                                collection: 'threads',
                                id: message.thread.id,
                                data: {
                                    resolved: false,
                                    messages: [ ...thread.messages, message.id ],
                                }
                            });
                            if(!update){
                                console.error('Thread update in message afterChange failed');
                                // TODO handle error properly
                            }
                        }
                    }

                    return message;
                }
            ],
            beforeDelete: [
                async ({ id, req: { payload } }) => {
                    const message = await payload.findByID({
                        collection: 'messages',
                        id: id,
                        depth: 1,
                    });
                    console.log('// message data: ', message);
                    
                    if (!message) {
                        console.error('Message findById in message beforeDelete failed');
                        // TODO handle error properly
                    }
                    if(message?.thread){
                        const messages = [...message.thread?.messages];
                        if (messages?.length > 1){
                            // If there's more than one message, remove this one
                            const messageIndex = messages.indexOf(id);
                            if(messageIndex >= 0){
                                messages.splice(messageIndex, 1);
                                const update = await payload.update({
                                    collection: 'threads',
                                    id: message.thread.id,
                                    data: {
                                        resolved: false,
                                        messages: messages,
                                    }
                                });
                                if (!update) {
                                    console.error('Thread update in message beforeDelete failed');
                                    // TODO handle error properly
                                }
                            }
                        }else{
                            // If this is the only message in the thread, delete the thread as well
                            const deleteResult = payload.delete({
                                collection: 'threads',
                                where: {
                                    id: {
                                        equals: message.thread.id,
                                    }
                                },
                            });
                            if(!deleteResult){
                                console.error('Thread delete in message beforeDelete failed');
                                // TODO handle error properly
                            }
                        }
                    }
                }
            ]
        }
    };

    return Messages;
}


export default messages;