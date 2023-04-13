import React, { useState } from 'react';
import { PluginOptions } from '../../types';
import { Button } from 'payload/components/elements';
import MessageEditor from '../MessageEditor';
import getFormatedDate from '../../../utilities/getFormatedDate';
import './styles.scss';
import Gravatar from '../Gravatar';

interface Props {
    id?: string,
    content: string,
    createdAt: string,
    user: Object|null,
    respondTo?: string,
    onDelete?: Function,
    currentUser: Object|null,
    pluginOptions: PluginOptions,
    readOnly?: boolean
}

const baseClass = "message";

const Message: React.FC<Props> = ({ id, content = '', createdAt = '', user, currentUser, respondTo, onDelete, pluginOptions, readOnly = false }) => {
    const [ isEditing, setIsEditing ] = useState(false);
    const [ messageContent, setMessageContent ] = useState(content);
    const currentUserIsAuthor = user?.id && currentUser?.id ? user.id == currentUser.id : false;
    const { shortDate, fullDate } = getFormatedDate(createdAt);
    const userDisplayName = user[pluginOptions.users.displayField] ? user[pluginOptions.users.displayField] : user.email;

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
                        onDelete(id);
                    }
                });
        }
    }

    return (
        <div className={baseClass}>
            <div className={`${baseClass}__avatar`}>
                <Gravatar email={user.email} size={32} />
            </div>
            <div className={`${baseClass}__body`}>
                <div className={`${baseClass}__header`}>
                    <div className={`${baseClass}__user`}>{ userDisplayName }</div>
                    <div className={`${baseClass}__date`} title={ fullDate }>{ shortDate }</div>
                </div>
                {!isEditing &&
                    <div className={`${baseClass}__content`}>
                        { messageContent }
                    </div>
                }
                {isEditing && 
                    <MessageEditor id={id} content={messageContent} onExit={() => setIsEditing(false)} onSuccess={afterEdit} />
                }
            </div>
            {currentUserIsAuthor && !isEditing && !readOnly &&
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