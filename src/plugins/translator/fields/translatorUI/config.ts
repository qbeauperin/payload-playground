import { Field } from 'payload/types';
import TranslatorUI from './TranslatorUI';
import { useConfig, useLocale } from "payload/components/utilities";


const translatorField: Field = {
    name: 'translator',
    label: 'Translations',
    type: 'ui',
    admin: {
        position: 'sidebar',
        components: {
            Field: TranslatorUI
        },
    }
};

export default translatorField;