import React, { useState } from 'react';
import { Button } from 'payload/components/elements';
import Message from '../Message';
import Gravatar from '../Gravatar';
import MessageEditor from '../MessageEditor';
import { PluginOptions, Thread as ThreadType, Message as MessageType } from '../../types';
import './styles.scss';

interface Props extends ThreadType {
    currentUser: Object|null,
    pluginOptions: PluginOptions,
}

const baseClass = "thread";

const Thread: React.FC<Props> = (props) => {
    const [ isOpen, setIsOpen ] = useState(false);
    const [ replies, setReplies ] = useState(props.messages.slice(1));
    
    const uniqueUserEmails = replies.reduce((acc: Array<MessageType>, message: MessageType) => {
        const email = message.user.email; // TODO use the User type dynamically based on the plugin config
        return !acc.includes(email) ? [...acc, email] : acc;
    }, []);

    const onMessageAdded = (newMessage:string) => {
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
            <Message readOnly={true} {...props.messages[0]} currentUser={props.currentUser} pluginOptions={props.pluginOptions} />
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
                            <Message key={message.id} {...message} currentUser={props.currentUser} pluginOptions={props.pluginOptions} onEdit={onMessageEdit} onDelete={onMessageDeleted} />
                        ))}
                        <MessageEditor onSuccess={onMessageAdded} thread={props.id} />
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