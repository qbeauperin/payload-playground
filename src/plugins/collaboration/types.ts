export interface PluginUserOptions {
    collection: string,
    field: string,
}
export interface PluginOptions {
    collections: Array<string>,
    users: PluginUserOptions,
}