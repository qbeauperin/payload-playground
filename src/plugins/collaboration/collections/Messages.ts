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
            // hidden: true, // to be uncommented once #2487 is merged in
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
                    const { payload, params, user } = req;

                    if(!user){
                        res.status(403).send({
                            errors: [
                                { message: "You are not allowed to perform this action." }
                            ] 
                        });
                        return false;
                    }

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
                        depth: 1,
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
                                depth: 1,
                            });
                            const hasChildren = messages?.docs && messages.docs.length > 0;
                            const children = hasChildren ? messages.docs : [];
                            const cleanChildren = children.map((message) => {
                                return { ...message, doc: message.doc.id };
                            });
                            return { ...message, doc: message.doc.id, children: cleanChildren };
                        }));

                        res.status(200).send({ docs: parentsWithChildren });
                    }else{
                        res.status(500).send({ error: 'something went wrong' });
                    }
                }
            }
        ],
        hooks: {
            afterChange: [
                async ({ doc }) => {
                    // Notify websocket
                    try{
                        fetch(`http://localhost:3000/updateMessages/${doc.doc.value.id}`, { method: 'POST' });
                    }catch(e){
                        console.error(e);
                    }
                    return doc;
                }
            ],
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
                    // Notify websocket
                    try{
                        fetch(`http://localhost:3000/updateMessages/${message.doc.value.id}`, { method: 'POST' });
                    }catch(e){
                        console.error(e);
                    }
                }
            ]
        }
    };

    return Messages;
}


export default messages;