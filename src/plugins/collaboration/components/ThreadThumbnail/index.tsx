import React, { useState } from 'react';
import Message from '../Message';
import { PluginOptions, Thread as ThreadType } from '../../types';
import './styles.scss';
import Gravatar from '../Gravatar';

interface Props extends ThreadType {
    currentUser: Object|null,
    pluginOptions: PluginOptions,
}

const baseClass = "threadThumbnail";

const ThreadThumbnail: React.FC<Props> = (props) => {
    const [ isOpen, setIsOpen ] = useState(false);
    const uniqueUserEmails = props.messages.reduce((acc, message) => {
        const email = message.user.email;
        return !acc.includes(email) ? [...acc, email] : acc;
    }, []);
    
    const openThread = () => {
        setIsOpen(true);
        console.log('OPEN THE THREAD');
    };

    return (
        <div className={baseClass} onClick={openThread}>
            <Message readOnly={true} {...props.messages[0]} currentUser={props.currentUser} pluginOptions={props.pluginOptions} />
            <div className={`${baseClass}__messages`}>
                <div className="avatars">
                    {uniqueUserEmails.map((email) => (
                        <Gravatar key={email} email={email} size={20} />
                    ))}
                </div>
                <div className="count">
                    {`${props.messages.length} ${props.messages.length <= 1 ? 'message' : 'messages' }`}
                </div>
            </div>
        </div>
    )
}

export default ThreadThumbnail;