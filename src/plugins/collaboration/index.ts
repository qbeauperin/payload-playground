import payload from "payload";
import { Config, Plugin } from 'payload/config';
import { PluginOptions } from './types';
import comments from "./collections/Comments";

export const collaboration = (pluginOptions: PluginOptions) => (incomingConfig: Config): Config => {

    // Abort if no config has been declared yet
    if (!incomingConfig?.collections || incomingConfig?.collections.length <= 0) return incomingConfig;

    // If no config is passed, return the config untouched
    if (!pluginOptions?.collections || pluginOptions?.collections.length <= 0) return incomingConfig;

    const config: Config = {
        ...incomingConfig,
        collections: [
            ...incomingConfig.collections.map((collection) => {
                const collectionSlug = collection.slug;
                // If collection is not part of the ones passed in the options, ignore it
                if (!pluginOptions?.collections.includes(collectionSlug)) return collection;
                
                // Add our translator fields to all collections passed in the plugin options
                return {
                    ...collection,
                    fields: [
                        ...collection.fields,
                    ],
                };
            }),
            comments(pluginOptions.collections),
        ]
    };

    return config;
};