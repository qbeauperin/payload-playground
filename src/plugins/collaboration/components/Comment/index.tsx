import React, { useState } from 'react';
import { Button } from 'payload/components/elements';
import './styles.scss';
import CommentEditor from '../CommentEditor';

interface Props {
    id?: string,
    comment: string,
    createdAt: string,
    user: Object|null,
    currentUser: Object|null,
    respondTo?: string,
}

const Comment: React.FC<Props> = ({ id, comment = '', createdAt = '', user, currentUser, respondTo }) => {
    const [ isEditing, setIsEditing ] = useState(false);
    const [ commentContent, setCommentContent ] = useState(comment);
    const currentUserIsAuthor = user?.id && currentUser?.id ? user.id == currentUser.id : false;
    const date = new Date(createdAt);
    const fullDate = date.toLocaleDateString('en', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
    // TODO handle i18n

    const afterEdit = (newComment:string) => {
        setCommentContent(newComment);
        setIsEditing(false);
    }

    return (
        <div className="comment">
            <div className="comment__wrap">
                <div className="comment__header">
                    <div className="comment__user">{ user?.name }</div>
                    <div className="comment__date" title={fullDate}>{fullDate}</div>
                </div>
                {!isEditing &&
                    <div className="comment__content">
                        { commentContent }
                    </div>
                }
                {isEditing && 
                    <CommentEditor id={id} content={commentContent} handleExit={() => setIsEditing(false)} handleSuccess={afterEdit} />
                }
            </div>
            {currentUserIsAuthor && !isEditing && 
                <div className="comment__actions">
                    <Button
                        buttonStyle="none"
                        icon="edit"
                        size="small"
                        onClick={() => setIsEditing(true)}
                    />
                </div>
            }
        </div>
    )
}

export default Comment;