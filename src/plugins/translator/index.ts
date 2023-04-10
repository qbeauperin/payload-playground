import payload from "payload";
import { Config, Plugin } from 'payload/config';
import { translationProgress } from './fields/translationProgress';
import { translationStatus } from './fields/translationStatus';
import translatorField from './fields/translatorUI/config';
import { PluginOptions } from './types';
import { calculateT9nProgress } from "./utilities/calculateT9nProgress";
import { LocalizationConfig } from 'payload/dist/config/types';
import { Field } from 'payload/dist/fields/config/types';
import buildStateFromSchema from 'payload/dist/admin/components/forms/Form/buildStateFromSchema';
import { CollectionBeforeChangeHook } from 'payload/types';

export const translator = (pluginOptions: PluginOptions) => (incomingConfig: Config): Config => {

    // If no config is passed, return the config untouched
    if (!pluginOptions?.collections || pluginOptions?.collections.length <= 0) return incomingConfig;
    
    const config: Config = {
        ...incomingConfig,
        collections: incomingConfig.collections.map((collection) => {
            const collectionSlug = collection.slug;
            // If collection is not part of the ones passed in the options, ignore it
            if(!pluginOptions?.collections.includes(collectionSlug)) return collection;

            // Define hooks
            const updateTranslationProgress: CollectionBeforeChangeHook = async ({ data, req: { user, payload: { config }, params: { id }, locale, t }, operation }) => {
            // const updateTranslationProgress: CollectionBeforeChangeHook = async ({ data, req }) => {
                
                const { localization, collections } = config;
                // const { locales, defaultLocale } = localization as LocalizationConfig;
                
                const fieldSchema = collections.find((collection) => collection.slug === collectionSlug)?.fields;

                const state = await buildStateFromSchema({ fieldSchema, data, user, id, operation, locale, t });
                console.log('// state: ', state);
                
                
                const fullDoc = await payload.findByID({
                    collection: collection.slug,
                    id: id,
                    locale: "all",
                    draft: true,
                });
                
                console.log('// fullDoc: ', fullDoc);
                

                // console.log('// fieldsConfig: ', fieldsConfig);
                
                // const getLocalizedFieldsFromConfig = (config: Field[]): { [key: string]: boolean } => {
                //     const localizedFields = config.map((field:Field) => {
                //         if (field.type === 'tabs'){
                //             field.tabs.forEach((tab) => {
                //                 tab.fields.forEach((tabField) => {
                //                     console.log('// field: ', tabField);
                //                 });
                //             });
                            
                //             // const tabsFields = field.tabs.map((tab) => {
                                
                //                 // }) 
                //             }else{
                //             console.log('// field: ', field);
                //         }
                //     });

                //     return {title: true};
                // }
                // getLocalizedFieldsFromConfig(fieldsConfig);
                
                return data;
            }

            // Make sure to spread already defined hooks
            const beforeChange = collection.hooks?.beforeChange ? [
                ...collection.hooks.beforeChange,
                updateTranslationProgress
            ] : [ updateTranslationProgress ];
            
            // Add our translator fields to all collections passed in the plugin options
            return {
                ...collection,
                fields: [
                    ...collection.fields,
                    translationStatus,
                    translationProgress,
                    translatorField,
                ],
                hooks: {
                    ...collection.hooks,
                    beforeChange: beforeChange,
                }
            };
        }),
    };

    return config;
};