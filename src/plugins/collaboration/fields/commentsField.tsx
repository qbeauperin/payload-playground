import React, { useState, useEffect } from 'react';
import { Label } from 'payload/components/forms';
import { Field } from 'payload/types';
import { UIField } from 'payload/dist/fields/config/types';
import CommentList from '../components/CommentList';

const CommentsField: React.FC<UIField> = ({ label }) => {
    const [ currentUser, setCurrentUser ] = useState(null);

    const getCurrentUser = () => {
        fetch(`http://localhost:3000/api/users/me/`)
            .then((response) => response.json())
            .then((data) => {
                setCurrentUser(data?.user);
            });
    }

    useEffect(() => {
        getCurrentUser();
    }, []);

    return (
        <div className="collaboration">
            <Label label={label} />
            <CommentList currentUser={currentUser} />
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