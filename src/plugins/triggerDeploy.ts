import { Config } from 'payload/config';
import { AfterDeleteHook } from 'payload/dist/collections/config/types';
import { AfterChangeHook } from 'payload/dist/globals/config/types';

export interface PluginOptions {
    collections: Array<string>;
    webhook: string | undefined; // can be undefined if using a env var and this codes runs in the client
}

/**
 * Adds hooks to all specified collections that will call a webhook whenever a doc is created, updated, or deleted.
 * 
 * If drafts are enabled, the webhook will only be called when the doc status is or was `published`.
 * 
 * @param pluginOptions.collections slugs of the collections that will trigger the webhook
 * @param pluginOptions.webhook url that will be called when doc is created, updated, or deleted
 *
 */
export const triggerDeploy = (pluginOptions: PluginOptions) => (incomingConfig: Config): Config => {

    // Make sure that collections have been defined
    if (!incomingConfig?.collections) return incomingConfig;

    // Make sure the webhook is present
    if (!pluginOptions.webhook) return incomingConfig;

    const trigger = () => {
        try {
            fetch(pluginOptions.webhook as string, { method: 'POST' })
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

                // Check if drafts are enabled
                const draftsEnabled = typeof collection?.versions === 'object' && collection?.versions?.drafts;

                // Define hooks
                const onAfterChange: AfterChangeHook = async ({ doc, previousDoc }) => {
                    if (!draftsEnabled || doc._status === 'published' || previousDoc?._status === 'published') {
                        trigger();
                    }
                }
                const onAfterDelete: AfterDeleteHook = async () => {
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