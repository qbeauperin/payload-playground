import { Config } from 'payload/config';
import { PluginOptions } from './types';

export const triggerDeploy = (pluginOptions: PluginOptions) => (incomingConfig: Config): Config => {

    const trigger = () => {
        try {
            fetch(pluginOptions.webhook, { method: 'POST' })
                .then((response) => {
                    return response.status === 200;
                })
        } catch (error) {
            console.error(error);
            return false;
        }
    }
    
    const config: Config = {
        ...incomingConfig,
        collections: [
            ...incomingConfig.collections.map((collection) => {
                
                // If collection is not part of the ones passed in the options, ignore it
                if (!pluginOptions?.collections.includes(collection.slug)) return collection;

                // Define hooks
                const onAfterChange = async ({ doc, previousDoc }) => {
                    if (doc._status === 'published' || previousDoc?._status === 'published'){
                        trigger();
                    }
                }
                const onAfterDelete = async () => {
                    trigger();
                }
            
                // Make sure to spread already defined hooks
                const afterChange = collection?.hooks?.afterChange ? [
                    ...collection.hooks.afterChange,
                    onAfterChange
                ] : [onAfterChange];
                const afterDelete = collection?.hooks?.afterDelete ? [
                    ...collection.hooks.afterDelete,
                    onAfterDelete
                ] : [onAfterDelete];

                // Add our translator fields to all collections passed in the plugin options
                return {
                    ...collection,
                    hooks: {
                        ...collection?.hooks,
                        afterChange: afterChange,
                        afterDelete: afterDelete,
                    },
                };
            }),
        ]
    };

    return config;
};