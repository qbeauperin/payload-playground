import { Config, Plugin } from 'payload/config';
import { translatedVersion } from './fields/translatedVersion';
import { translationStatus } from './fields/translationStatus';
import translatorField from './fields/translatorUI/config';
import { PluginOptions } from './types';

export const translator = (pluginOptions: PluginOptions) => (incomingConfig: Config): Config => {

    // If no config is passed, return the config untouched
    if (!pluginOptions?.collections || pluginOptions?.collections.length <= 0) return incomingConfig;
    
    const config: Config = {
        ...incomingConfig,
        collections: incomingConfig.collections.map((collection) => {
            // If collection is not part of the ones passed in the options, ignore it
            if(!pluginOptions?.collections.includes(collection?.slug)) return collection;
            
            // Add our translator fields to all collections passed in the plugin options
            return {
                ...collection,
                fields: [
                    ...collection.fields,
                    translationStatus,
                    translatedVersion,
                    translatorField,
                ],
            };
        }),
    };

    return config;
};