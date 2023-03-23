import { Field } from 'payload/types';

const publishedDateField: Field = {
    name: 'publishedDate',
    type: 'date',
    admin: {
        position: 'sidebar',
        date: {
            pickerAppearance: 'dayAndTime',
            timeIntervals: 15,
            displayFormat: 'yyyy/MM/dd h:mm',
        }
    },
};

export default publishedDateField;