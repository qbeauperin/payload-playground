import payload from "payload";
import { Config, Plugin } from 'payload/config';
import { translationProgress } from './fields/translationProgress';
import t10nProgressUI from './fields/t10nProgressUI';
import { PluginOptions } from './types';
import serializeDocument from "./utilities/i18nSerialize";
import { LocalizationConfig } from 'payload/dist/config/types';
import { Field } from 'payload/dist/fields/config/types';
import buildStateFromSchema from 'payload/dist/admin/components/forms/Form/buildStateFromSchema';
import { CollectionBeforeChangeHook } from 'payload/types';
import i18nSerializeData from "./utilities/i18nSerialize";

export const t10nProgress = (pluginOptions: PluginOptions) => (incomingConfig: Config): Config => {

    // If no config is passed, return the config untouched
    if (!pluginOptions?.collections || pluginOptions?.collections.length <= 0) return incomingConfig;
    
    const config: Config = {
        ...incomingConfig,
        collections: incomingConfig.collections.map((collectionConfig) => {
            const collectionSlug = collectionConfig.slug;
            // If collection is not part of the ones passed in the options, ignore it
            if(!pluginOptions?.collections.includes(collectionSlug)) return collectionConfig;

            // Define hooks
            const updateTranslationProgress: CollectionBeforeChangeHook = async ({ data, req: { user, payload, params: { id }, locale, t }, operation }) => {
            // const updateTranslationProgress: CollectionBeforeChangeHook = async ({ data, req }) => {
                // const { localization, collections } = incomingConfig;
                // const { locales, defaultLocale } = localization as LocalizationConfig;

                console.log('  ');
                console.log('  ');
                // console.log('  ');
                // console.log('// collectionConfig.fields:');
                // console.log(collectionConfig.fields);
                
                console.log('  ');
                console.log('// data:');
                console.log(data);
                
                const i18nSerializedData = i18nSerializeData(data, collectionConfig.fields);
                
                console.log('  ');
                console.log('// i18nSerializedData:');
                console.log(i18nSerializedData);
                

                // const fullDoc = await payload.findByID({
                //     collection: collectionConfig.slug,
                //     id: id,
                //     locale: "de",
                //     draft: true,
                // });

                // const serializedDoc = serializeDocument(
                //     payload,
                //     id,
                //     collectionConfig, 
                // );
                
                // console.log('// fullDoc: ', fullDoc);
                

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
            const beforeChange = collectionConfig.hooks?.beforeChange ? [
                ...collectionConfig.hooks.beforeChange,
                updateTranslationProgress
            ] : [ updateTranslationProgress ];
            
            // Add our translator fields to all collections passed in the plugin options
            return {
                ...collectionConfig,
                fields: [
                    ...collectionConfig.fields,
                    translationProgress,
                    t10nProgressUI,
                ],
                hooks: {
                    ...collectionConfig.hooks,
                    beforeChange: beforeChange,
                }
            };
        }),
    };

    return config;
};