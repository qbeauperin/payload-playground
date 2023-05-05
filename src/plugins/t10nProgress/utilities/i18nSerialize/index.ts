// import Payload from "payload/dist/";
import { ArrayField, BlockField, Field, FieldAffectingData, FieldWithSubFields, GroupField, TabsField, fieldIsLocalized, tabHasName } from 'payload/dist/fields/config/types';
import { slateToHtml, payloadSlateToDomConfig } from 'slate-serializers'
import { serializerDelimiter, translatableFieldTypes, traversableFieldTypes } from "./types";
import { Payload } from 'payload';

/**
 * Turn a given doc's data (partial or complete) to a flat object of localized strings.
 *
 * @param data - doc's data
 * @param config - doc's fields config
 * @param [namespace] - namespace id, used for recursivity only
 *
 * @returns Flat object of all localized strings in the data
 */
const i18nSerializeData = (data: any, config: Field | Field[], namespace?: string): Record<string, any> => {

    let result: Record<string, any> = {};

    // Check if the value is an array or a field
    if (Array.isArray(config)){

        // Loop over it and pass the data to each field
        config.forEach((field:Field, index:number) => {
            result = { ...result, ...i18nSerializeData(data, field, namespace)};
        })

    }else{

        // Check if the field is translatable
        if (translatableFieldTypes.includes(config.type)) {
            // Alias the config
            const field = config as FieldAffectingData;

            // Only consider localized fields
            if (!fieldIsLocalized(field)) return result;

            // Make sure the field exists in the data
            if (!data[field.name]) return result;

            // Make sure the field isn't an id
            if (["id", "_id"].includes(field.name)) return result;
            
            let serializedValue:string;
            switch (field.type) {
                case "text":
                case "textarea":
                    serializedValue = data[field.name];
                    break;
                case "richText":
                    serializedValue = slateToHtml(data[field.name], payloadSlateToDomConfig);
                    break;
                default:
                    // This should never happen as the switch-cases fully matches `translatableFields`
                    throw new Error(
                        `Undefined 'translatableField': ${field.type} - aborting!`
                    );
            }
    
            const id = (namespace ? `${namespace}${serializerDelimiter}` : '') + field.name;
            return {
                [id]: serializedValue,
            };
        }

        // Check if the field is traversable 
        else if (traversableFieldTypes.includes(config.type)) {
            
            // Alias the config
            const field = config as FieldWithSubFields | TabsField | BlockField;
    
            switch (field.type) {
                case "collapsible":
                case "row":
                    // Rows and collapsibles do not really change the structure, just namespace the values in question.
                    // Go deeper into the fields
                    result = { ...result, ...i18nSerializeData(data, field.fields, namespace) };
                    break;

                case "tabs":
                    // For tabs we need to distinguish between named and unnamed tabs because named tabs have their values namespaced while unnamed tabs put their value on top-level
                    for (const tab of field.tabs) {

                        // Update the namespace for the children, if named
                        const childrenNamespace = tabHasName(tab) ? ((namespace ? `${namespace}${serializerDelimiter}` : '') + tab.name) : namespace;
                        
                        // Make sure the field exists in the data
                        const tabData = tabHasName(tab) ? data[tab.name] : data;
                        if (!tabData) return result;

                        // Go deeper into the tab's fields
                        result = { ...result, ...i18nSerializeData(tabData, tab.fields, childrenNamespace) };

                    }
                    break;

                case "group":
                case "array":
                    // Both are moving all sub-fields into a common namespace
                    // Arrays will behave like groups but need to loop through items
                    
                    // Alias again
                    const groupOrArray = field as GroupField | ArrayField;
                    
                    // Make sure the group exists in the data
                    if (!data[groupOrArray.name]) return result;
                    
                    // Array and groups also allow you to define `localize: true` on them
                    // If that's the case, we need to cascade that property down to the children
                    const groupOrArrayFields = groupOrArray?.localized ? groupOrArray.fields.map((field) => {
                        return {...field, localized: true }
                    }) : groupOrArray.fields;
                    
                    if(groupOrArray.type === 'group'){

                        // Update the namespace for the children
                        const childrenNamespace = (namespace ? `${namespace}${serializerDelimiter}` : '') + groupOrArray.name;

                        // Go deeper into the group's fields
                        result = { ...result, ...i18nSerializeData(data[groupOrArray.name], groupOrArrayFields, childrenNamespace) };

                    }else{

                        // Loop through each array item
                        for(const item of data[groupOrArray.name]){

                            // Update the namespace for the children
                            const childrenNamespace = (namespace ? `${namespace}${serializerDelimiter}` : '') + groupOrArray.name + serializerDelimiter + item.id;

                            // Go deeper into the array item's fields
                            result = { ...result, ...i18nSerializeData(item, groupOrArrayFields, childrenNamespace) };

                        }
                    }
                    break;
                    
                case "blocks":
                    // Blocks behave like arrays but will have different fields based on `blockType`

                    // Alias again
                    const blockField = field as BlockField;

                    // Make sure the block namespace exists in the data
                    if (!data[blockField.name]) return result;
                    
                    // Loop through each data item
                    for (const item of data[blockField.name]) {
                        
                        // Get the right fields config for the block
                        const blockConfig = blockField.blocks.find((block) => {
                            return block.slug === item.blockType
                        });

                        // Blocks also allow you to define `localize: true` on them
                        // If that's the case, we need to cascade that property down to the children
                        const blockFields = blockField?.localized ? blockConfig.fields.map((field) => {
                            return { ...field, localized: true }
                        }) : blockConfig.fields;

                        // Update the namespace for the children
                        const childrenNamespace = (namespace ? `${namespace}${serializerDelimiter}` : '') + blockField.name + serializerDelimiter + item.id;

                        // Go deeper into the block's fields
                        result = { ...result, ...i18nSerializeData(item, blockFields, childrenNamespace) };

                    }
                    break;
    
                default:
                    // This should never happen as the switch-cases fully matches `traversableFields`
                    throw new Error(
                        `Undefined 'traversableFields': ${(field as any)?.type || (field as any)?.name} - aborting!`
                    );
            }

        } else {

            // The field is neither translatable, nor traversable.
            // This means it might be something like a number or date field and no operation is required.
            // It might also indicate an unsupported field type which is not handled.
            return result;

        }
        
    }

    return result;
};

export default i18nSerializeData;
