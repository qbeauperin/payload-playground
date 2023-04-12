import React, { useState } from 'react';
import { Button } from 'payload/components/elements';
import './styles.scss';
import MessageEditor from '../MessageEditor';

interface Props {
    id?: string,
    message: string,
    createdAt: string,
    user: Object|null,
    currentUser: Object|null,
    respondTo?: string,
    onDelete?: Function,
}

const Message: React.FC<Props> = ({ id, message = '', createdAt = '', user, currentUser, respondTo, onDelete }) => {
    const [ isEditing, setIsEditing ] = useState(false);
    const [ messageContent, setMessageContent ] = useState(message);
    const currentUserIsAuthor = user?.id && currentUser?.id ? user.id == currentUser.id : false;
    const date = new Date(createdAt);
    const fullDate = date.toLocaleDateString('en', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    }); // TODO handle i18n

    const afterEdit = (newMessage:string) => {
        setMessageContent(newMessage);
        setIsEditing(false);
    }
    
    const handleDelete = () => {
        if (!id) return false;
        if (confirm(`Are you sure you want to delete this message?\n\n"${messageContent}"`)){
            const path = `http://localhost:3000/api/messages/${id}`;
            const options = {
                method: 'DELETE',
            };

            fetch(path, options)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    if (data?.errors){
                        console.error(data);
                        // TODO Handle error
                    }else{
                        onDelete();
                    }
                });
        }
    }

    return (
        <div className="message">
            <div className="message__wrap">
                <div className="message__header">
                    <div className="message__user">{ user?.name }</div>
                    <div className="message__date" title={fullDate}>{fullDate}</div>
                </div>
                {!isEditing &&
                    <div className="message__content">
                        { messageContent }
                    </div>
                }
                {isEditing && 
                    <MessageEditor id={id} content={messageContent} onExit={() => setIsEditing(false)} onSuccess={afterEdit} />
                }
            </div>
            {currentUserIsAuthor && !isEditing && 
                <div className="message__actions">
                    <Button
                        buttonStyle="none"
                        icon="edit"
                        size="small"
                        tooltip="Edit"
                        onClick={() => setIsEditing(true)}
                    />
                    <Button
                        buttonStyle="none"
                        icon="x"
                        size="small"
                        tooltip="Delete"
                        className="delete"
                        onClick={handleDelete}
                    />
                </div>
            }
        </div>
    )
}

export default Message;