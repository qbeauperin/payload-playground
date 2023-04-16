import React, { useState } from 'react';
import { Message as MessageType, PluginOptions } from '../../types';
import { Button } from 'payload/components/elements';
import MessageEditor from '../MessageEditor';
import getFormatedDate from '../../../utilities/getFormatedDate';
import './styles.scss';
import getDisplayName from '../../../utilities/getDisplayName';
import Gravatar from '../Gravatar';
import MoreMenu, { MoreMenuItem } from '../MoreMenu';

interface Props {
    id?: string;
    content: string;
    createdAt: string;
    user: Object|null;
    respondTo?: string;
    onEdit?(id: string, newContent: string): any;
    onDelete?(deletedMessageId: string): any;
    currentUser: Object|null;
    pluginOptions: PluginOptions;
    readOnly?: boolean;
}

const Message: React.FC<Props> = ({ id, content = '', createdAt = '', user, currentUser, respondTo, onEdit, onDelete, pluginOptions, readOnly = false }) => {
    const baseClass = "message";
    const [ isEditing, setIsEditing ] = useState(false);
    const currentUserIsAuthor = user?.id && currentUser?.id ? user.id == currentUser.id : false;
    const { shortDate, fullDate } = getFormatedDate(createdAt);
    const userDisplayName = getDisplayName(user, pluginOptions.users.displayField);
    const hasActions = currentUserIsAuthor && !isEditing && !readOnly

    const afterEdit = (message: MessageType) => {
        onEdit(message.id, message.content);
        setIsEditing(false);
    }
    
    const handleDelete = () => {
        if (!id) return false;
        if (confirm(`Are you sure you want to delete this message?\n\n"${content}"`)){
            const path = `http://localhost:3000/api/messages/${id}`;
            const options = {
                method: 'DELETE',
            };

            fetch(path, options)
                .then((response) => response.json())
                .then((data) => {
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
        <div className={baseClass + (currentUserIsAuthor ? ` ${baseClass}--isAuthor` : '' )}>
            <div className={`${baseClass}__avatar`}>
                <Gravatar email={user.email} size={32} />
            </div>
            <div className={`${baseClass}__body`}>
                <div className={`${baseClass}__header` + (hasActions ? ` ${baseClass}__header--hasActions` : '')}>
                    <div className={`${baseClass}__user`}>{ userDisplayName }</div>
                    <div className={`${baseClass}__date`} title={ fullDate }>{ shortDate }</div>
                    {hasActions &&
                        <div className="message__actions">
                            <MoreMenu>
                                <MoreMenuItem label="Edit" icon="edit" onClick={() => setIsEditing(true)} />
                                <MoreMenuItem label="Delete" icon="delete" isDangerous={true} onClick={handleDelete}/>
                            </MoreMenu>
                        </div>
                    }
                </div>
                {!isEditing &&
                    <div className={`${baseClass}__content`}>
                        { content }
                    </div>
                }
                {isEditing && 
                    <MessageEditor 
                        id={id} 
                        content={content} 
                        onExit={() => setIsEditing(false)} 
                        onSuccess={afterEdit} 
                    />
                }
            </div>
        </div>
    )
}

export default Message;