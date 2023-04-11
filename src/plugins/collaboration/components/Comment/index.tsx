import React from 'react';
import './styles.scss';

interface Props {
    id: string,
    comment: string,
    createdAt: string,
    user: Object,
    respondTo?: string,
}

const Comment: React.FC<Props> = ({ id, comment, createdAt, user, respondTo }) => {
    const date = new Date(createdAt);
    const fullDate = date.toLocaleDateString('en', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
    return (
        <div className="comment">
            <div className="comment__header">
                <div className="comment__user">{ user?.name }</div>
                <div className="comment__date" title={fullDate}>{fullDate}</div>
            </div>
            <div className="comment__content">
                { comment }
            </div>
        </div>
    )
}

export default Comment;