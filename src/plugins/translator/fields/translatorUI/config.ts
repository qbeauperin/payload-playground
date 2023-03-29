import { Field } from 'payload/types';
import TranslatorUI from './TranslatorUI';
import { useConfig, useLocale } from "payload/components/utilities";


const translatorField: Field = {
    name: 'translator',
    label: 'Translation',
    type: 'ui',
    admin: {
        position: 'sidebar',
        components: {
            Field: TranslatorUI
        },
        condition: () => {
            const { localization } = useConfig();
            const locale = useLocale();
            return (localization?.defaultLocale === locale);
        },
    }
};

export default translatorField;