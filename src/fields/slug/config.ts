import { Field } from 'payload/types';
import InputField from './InputField';

const slugField: Field = {
    name: 'slug',
    type: 'text',
    required: true,
    localized: true,
    unique: true,
    admin: {
        components: {
            Field: InputField,
        }
    }
};

export default slugField;