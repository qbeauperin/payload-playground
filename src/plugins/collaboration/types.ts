export interface PluginUserOptions {
    collection: string;
    displayField: string;
}
export interface PluginOptions {
    collections: Array<string>;
    users: PluginUserOptions;
}

export interface Thread {
    id: string;
    messages: Array<Message|string>;
    createdAt: string;
    updatedAt: string;
    user: object|string;
    resolved: boolean,
}

export interface Message {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    user: object|string;
}