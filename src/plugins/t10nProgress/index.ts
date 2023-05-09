import { Config } from 'payload/config';
import { PluginOptions } from './types';
import { LocalizationConfig } from 'payload/dist/config/types';
import { CollectionBeforeChangeHook, CollectionBeforeReadHook } from 'payload/types';
import t10nProgressField from './fields/t10nProgress';
import i18nSerializeData from "./utilities/i18nSerialize";

export const t10nProgress = (pluginOptions?: PluginOptions) => (incomingConfig: Config): Config => {

    // Extract localization config
    const { localization } = incomingConfig;
    const { locales, defaultLocale } = localization as LocalizationConfig;

    const config: Config = {
        ...incomingConfig,
        collections: incomingConfig.collections.map((collectionConfig) => {

            // If collections were passed in the options and this one isn't one of them, skip it 
            if (pluginOptions?.collections && !pluginOptions.collections.includes(collectionConfig.slug)){
                return collectionConfig;
            }

            // Check if the collection has any localized fields
            const stringifiedConfig = JSON.stringify(collectionConfig);
            const hasLocalizedFields = stringifiedConfig?.indexOf('"localized":true') >= 0;

            // If no collection was passed in the options and the collection has no localized field, skip it
            if (!pluginOptions?.collections && !hasLocalizedFields) return collectionConfig;

            // Define hooks
            const updateT10nProgress: CollectionBeforeChangeHook = async ({ data, req: { locale }, originalDoc }) => {

                // Serialize the data to get only localized fields
                const i18nSerializedData = i18nSerializeData(data, collectionConfig.fields);
                
                // Initialize the progress json if it's a create event
                let t10nProgress = originalDoc?.t10nProgress ? originalDoc.t10nProgress : locales.reduce((acc, locale) => {
                    return { ...acc, [locale]: 0 }
                }, {});
                
                // Add progress to the data to be saved
                return {
                    ...data,
                    t10nProgress: {
                        ...t10nProgress,
                        [locale]: Object.keys(i18nSerializedData).length
                    }
                };
            }

            const initT10nProgress: CollectionBeforeReadHook = async ({ doc, req }) => {
                // If t10nProgress field exists, skip
                if (doc?.t10nProgress) return doc;
                
                // Prevent runs from manual payload requests
                if(req?.params === undefined) return doc;

                console.log('t10nProgress init!');
                
                // Loop through each locale
                let progress = {};
                for (const locale of locales) {
                    const localeDoc = await req.payload.findByID({
                        collection: collectionConfig.slug,
                        id: doc.id,
                        locale: locale,
                        draft: true,
                        fallbackLocale: false,
                    });
                    const localeDocI18nSerialized = localeDoc ? i18nSerializeData(localeDoc, collectionConfig.fields) : {};
                    
                    progress = { 
                        ...progress, 
                        [locale]: Object.keys(localeDocI18nSerialized).length,
                    }
                }

                // Update the doc with that fresh t10nProgress data
                const updateDoc = await req.payload.update({
                    collection: collectionConfig.slug,
                    id: doc.id,
                    draft: true,
                    locale: defaultLocale,
                    data: {
                        t10nProgress: progress
                    }
                })

                return updateDoc;
            }

            // Make sure to spread already defined hooks
            const beforeChange = collectionConfig.hooks?.beforeChange ? [
                ...collectionConfig.hooks.beforeChange,
                updateT10nProgress
            ] : [ updateT10nProgress ];
            const beforeRead = collectionConfig.hooks?.beforeRead ? [
                ...collectionConfig.hooks.beforeRead,
                initT10nProgress
            ] : [ initT10nProgress ];
            
            // Add our translator fields to all collections passed in the plugin options
            return {
                ...collectionConfig,
                // Add field to the admin default columns
                admin: {
                    ...(collectionConfig?.admin ? collectionConfig.admin : {}),
                    defaultColumns: collectionConfig?.admin?.defaultColumns ? [
                        ...collectionConfig.admin.defaultColumns,
                        t10nProgressField.name,
                    ] : []
                },
                // Add field
                fields: [
                    ...collectionConfig.fields,
                    t10nProgressField,
                ],
                // Add hooks
                hooks: {
                    ...collectionConfig.hooks,
                    beforeChange: beforeChange,
                    beforeRead: beforeRead,
                }
            };
        }),
    };

    return config;
};