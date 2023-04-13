import React, { useState } from 'react';
import { Button } from 'payload/components/elements';
import Message from '../Message';
import Gravatar from '../Gravatar';
import MessageEditor from '../MessageEditor';
import { PluginOptions, Thread as ThreadType } from '../../types';
import './styles.scss';

interface Props extends ThreadType {
    currentUser: Object|null,
    pluginOptions: PluginOptions,
}

const baseClass = "thread";

const Thread: React.FC<Props> = (props) => {
    const [ isOpen, setIsOpen ] = useState(false);
    const [ replies, setReplies ] = useState(props.messages.slice(1));
    
    const uniqueUserEmails = replies.reduce((acc, message) => {
        const email = message.user.email;
        return !acc.includes(email) ? [...acc, email] : acc;
    }, []);

    const afterNewMessage = (newMessage) => {
        setReplies([...replies, newMessage]);
    }

    const noMessages = "No messages.";
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
                    </div>
                }
                {isOpen && 
                    <div className={`${baseClass}__messages`}>
                        {replies.map((message) => (
                            <Message key={message.id} {...message} currentUser={props.currentUser} pluginOptions={props.pluginOptions} />
                        ))}
                        <MessageEditor onSuccess={afterNewMessage} thread={props.id} />
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