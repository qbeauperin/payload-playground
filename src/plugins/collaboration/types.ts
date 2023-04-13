export interface PluginUserOptions {
    collection: string,
    displayField: string,
}
export interface PluginOptions {
    collections: Array<string>,
    users: PluginUserOptions,
}