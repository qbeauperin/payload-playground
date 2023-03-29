import { Field } from 'payload/types';
import TranslatorUI from './TranslatorUI';

const translatorField: Field = {
    name: 'translator',
    label: 'Translation',
    type: 'ui',
    admin: {
        position: 'sidebar',
        components: {
            Field: TranslatorUI
        }
    }
};

export default translatorField;