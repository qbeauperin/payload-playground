import React, { useState } from 'react';
import { Button } from 'payload/components/elements';
import Message from '../Message';
import Gravatar from '../Gravatar';
import MessageEditor from '../MessageEditor';
import { PluginOptions, Message as MessageType } from '../../types';
import './styles.scss';

interface Props extends MessageType {
    currentUser: Object|null;
    pluginOptions: PluginOptions;
    single?: boolean;
    onDelete(id:string): any;
}

const Thread: React.FC<Props> = (props) => {
    const baseClass = "thread";
    const [ threadMessage, setThreadMessage ] = useState(props);
    const [ replies, setReplies ] = useState(props.children);
    const shouldBeOpen = (props?.single ?? false) && props.children.length > 0;
    const [ isOpen, setIsOpen ] = useState(shouldBeOpen);
    
    const uniqueUserEmails = replies.reduce((acc: Array<MessageType>, message: MessageType) => {
        const email = message.user.email; // TODO use the User type dynamically based on the plugin config
        return !acc.includes(email) ? [...acc, email] : acc;
    }, []);

    const onThreadEdit = (id: string, newContent: string) => {
        setThreadMessage({...props, content: newContent});
    }

    const onThreadDelete = () => {
        props.onDelete(props.id);
    }

    const onMessageAdd = (newMessage:Message) => {
        setReplies([...replies, newMessage]);
    }
    const onMessageEdit = (id:string, newContent:string) => {
        const updatedReplies = replies.map((message: MessageType) => {
            return message.id === id ? {...message, content: newContent} : message;
        })
        setReplies(updatedReplies);
    }
    const onMessageDeleted = (deletedMessageId:string) => {
        setReplies(replies.filter(message => message.id !== deletedMessageId));
    }

    const noMessages = "Reply";
    const messages = `${replies.length} ${replies.length <= 1 ? 'message' : 'messages'}`;

    return (
        <div className={baseClass + (isOpen ? ` ${baseClass}--open` : '')} onClick={() => !isOpen ? setIsOpen(true) : false}>
            <Message 
                {...threadMessage}
                readOnly={!isOpen}  
                currentUser={props.currentUser} 
                pluginOptions={props.pluginOptions} 
                onEdit={onThreadEdit} 
                onDelete={onThreadDelete} 
            />
            <div className={`${baseClass}__replies`}>
                {!isOpen && 
                    <div className={`${baseClass}__replies-overview`}>
                        <div className="avatars">
                            {uniqueUserEmails.map((email) => (
                                <Gravatar key={email} email={email} size={20} />
                            ))}
                        </div>
                        <div className="count">
                            {replies.length > 0 ? messages : noMessages}
                        </div>
                        <svg className="icon icon--chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25">
                            <path className="stroke" d="M9 10.5L12.5 14.5L16 10.5"></path>
                        </svg>
                    </div>
                }
                {isOpen && 
                    <div className={`${baseClass}__messages`}>
                        {replies.map((message) => (
                            <Message 
                                {...message} 
                                key={message.id}
                                currentUser={props.currentUser}
                                pluginOptions={props.pluginOptions}
                                onEdit={onMessageEdit}
                                onDelete={onMessageDeleted}
                            />
                        ))}
                        <MessageEditor 
                            onSuccess={onMessageAdd} 
                            parent={props.id} 
                            autofocus={replies.length <= 0} 
                        />
                    </div>
                }
                {isOpen && 
                    <Button
                        className="collapse"
                        buttonStyle="transparent"
                        icon="chevron"
                        size="small"
                        onClick={() => setIsOpen(false)}
                    />
                }
            </div>
        </div>
    )
}

export default Thread;