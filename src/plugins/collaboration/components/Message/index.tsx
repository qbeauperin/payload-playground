import React, { useState, useMemo, useCallback } from 'react';
import { Message as MessageType, PluginOptions } from '../../types';
import { User } from "payload/dist/auth/types";
import getFormatedDate from '../../../utilities/getFormatedDate';
import getDisplayName from '../../../utilities/getDisplayName';
import MessageEditor from '../MessageEditor';
import Gravatar from '../Gravatar';
import MoreMenu, { MoreMenuItem } from '../MoreMenu';
import { useModal } from '@faceless-ui/modal';
import Confirm from '../Confirm';
import { Button } from 'payload/components/elements';
import Check from 'payload/dist/admin/components/icons/Check';
import './styles.scss';

const baseClass = "message";

interface MessageProps {
    id?: string;
    content: string;
    createdAt: string;
    user: User|null;
    respondTo?: string;
    onEdit?(id: string, newContent: string): any;
    onDelete?(deletedMessageId: string): any;
    currentUser: User|null;
    pluginOptions: PluginOptions;
    isParent?: boolean;
    readOnly?: boolean;
}

const Message: React.FC<MessageProps> = (props: MessageProps) => {
    const { id, content = '', createdAt = '', user, currentUser, respondTo, onEdit, onDelete, pluginOptions, isParent = false, readOnly = false } = props;
    const [ isEditing, setIsEditing ] = useState(false);
    const currentUserIsAuthor = user?.id && currentUser?.id ? user.id == currentUser.id : false;
    const { shortDate, fullDate } = useMemo(
        () => getFormatedDate(createdAt),
        [createdAt]
    );
    const userDisplayName = useMemo(
        () => getDisplayName(user, pluginOptions.users.displayField),
        [user, pluginOptions]
    );
    const hasActions = currentUserIsAuthor && !isEditing && !readOnly;

    const afterEdit = useCallback((message: MessageType) => {
        onEdit(message.id, message.content);
        setIsEditing(false);
    }, []);

    const handleDelete = useCallback(() => {
        fetch(`http://localhost:3000/api/messages/${id}`, { method: 'DELETE' })
            .then((response) => response.json())
            .then((data) => {
                if (data?.errors){
                    console.error(data);
                    // TODO Handle error
                }else{
                    onDelete(id);
                }
            });
    }, [id]);

    const handleResolve = useCallback(() => {
        fetch(`http://localhost:3000/api/messages/${id}`, {
            method: 'PATCH', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                resolved: true
            })
        })
            .then((response) => response.json())
            .then((data) => {
                if (data?.errors){
                    console.error(data);
                    // TODO Handle error
                }else{
                    onDelete(id);
                }
            });
    }, [id]);

    const handleActions = useCallback((action: string) => {
        switch (action) {
            case 'edit':
                setIsEditing(true);
                break;
            case 'delete':
                handleDelete();
                break;
            case 'resolve':
                handleResolve();
                break;
        }
    }, []);

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
                        <MessageActions {...props} showResolve={isParent && currentUserIsAuthor} onAction={handleActions}/>
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

interface MessageActionsProp extends MessageProps {
    showResolve: boolean;
    onAction: Function;
}
const MessageActions: React.FC<MessageActionsProp> = (props) => {
    const { onAction } = props;
    const confirmDeleteModalSlug = `${props.id}-delete`;
    const { toggleModal } = useModal();

    return (
        <div className="message__actions">
            {props.showResolve &&
                <Button
                    className={`${baseClass}__resolve`}
                    buttonStyle="none"
                    icon={<Check />}
                    size="small"
                    tooltip="Mark as resolved"
                    onClick={() => onAction('resolve')}
                />
            }
            <MoreMenu>
                <MoreMenuItem label="Edit" icon="edit" onClick={() => onAction('edit')} />
                <MoreMenuItem label="Delete" icon="delete" isDangerous={true} onClick={() => toggleModal(confirmDeleteModalSlug)} />
                <Confirm
                    slug={confirmDeleteModalSlug}
                    title={props.isParent ? "Delete thread" : "Delete message"} // TODO handle i18m
                    confirmLabel="Delete" // TODO handle i18m
                    onConfirm={() => onAction('delete')} 
                >
                    <div className="deleteMessage">
                        <p>Are you sure you want to delete this {props.isParent ? "message and all the messages in the thread" : "message"}? This cannot be undone.</p> {/* TODO handle i18m */}
                        <Message {...props} readOnly={true} />
                    </div>
                </Confirm>
            </MoreMenu>
        </div>
    )
}

export default Message;