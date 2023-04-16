import { User } from "payload/dist/auth";

export interface PluginUserOptions {
    collection?: string;
    displayField?: string;
}
export interface PluginOptions {
    collections: Array<string>;
    users: PluginUserOptions;
}

export interface Message {
    id: string;
    content: string;
    parent?: Message|string;
    children?: Array<Message>;
    doc: Object|string;
    createdAt: string;
    updatedAt: string;
    user: User|string;
}