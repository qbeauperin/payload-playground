import { Field } from 'payload/types';
import TranslatorUI from './TranslatorUI';
import Cell from './Cell';


const translatorField: Field = {
    name: 'translator',
    label: 'Translations',
    type: 'ui',
    admin: {
        position: 'sidebar',
        components: {
            Field: TranslatorUI,
            Cell: Cell,
        },
    }
};

export default translatorField;