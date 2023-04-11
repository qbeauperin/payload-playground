import React from 'react';
import { Field } from 'payload/types';
import { Label } from 'payload/components/forms';
import { UIField } from 'payload/dist/fields/config/types';
import CommentList from '../components/CommentList';

const CommentsField: React.FC<UIField> = (props) => {
    const { label } = props;

    return (
        <div className="collaboration">
            <Label label={label} />
            <CommentList />
        </div>
    )
}

const commentsField: Field = {
    name: 'comments',
    label: 'Comments',
    type: 'ui',
    admin: {
        position: 'sidebar',
        components: {
            Field: CommentsField
        },
    },
};

export default commentsField;