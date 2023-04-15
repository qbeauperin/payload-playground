import payload from "payload";
import { Config, Plugin } from 'payload/config';
import { PluginOptions } from './types';
import messages from "./collections/Messages";
import threadsField from "./fields/threadsField";
import "./styles.scss";

export const collaboration = (pluginOptions: PluginOptions) => (incomingConfig: Config): Config => {

    // Abort if no config has been declared yet
    if (!incomingConfig?.collections || incomingConfig?.collections.length <= 0) return incomingConfig;

    // Abort if no config is passed
    if (!pluginOptions?.collections || pluginOptions?.collections.length <= 0) return incomingConfig;

    // Abort if no user collection has been defined
    if (!incomingConfig?.admin?.user) return incomingConfig;

    // Pass user collection in the config
    pluginOptions.users = {
        ...pluginOptions.users,
        collection: incomingConfig.admin.user,
    }

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
                        threadsField(pluginOptions),
                    ],
                };
            }),
            messages(pluginOptions),
        ]
    };

    return config;
};