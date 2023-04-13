import React, { useState, useEffect } from 'react';
import { useDocumentInfo } from "payload/components/utilities";
import { Button } from 'payload/components/elements';
import Message from '../Message';
import MessageEditor from '../MessageEditor';
import { Message as MessageType, PluginOptions, Thread as ThreadType } from '../../types';
import './styles.scss';
import qs from 'qs';

interface Props extends ThreadType {
    currentUser: Object|null,
    pluginOptions: PluginOptions,
}

const baseClass = "thread";

const Thread: React.FC<Props> = (props) => {
    const [ messages, setMessages ] = useState<Array<MessageType|string>>(props.messages);
    const [ isOpen, setIsOpen ] = useState(false);
    const [ isWritting, setIsWritting ] = useState(false);
    const { id: docId } = useDocumentInfo();
    
    const fetchMessages = () => {
        const query = {
            where: {
                thread: { equals: props.id },
            },
            sort: "createdAt",
        };
        fetch(`http://localhost:3000/api/messages/?${qs.stringify(query)}`) // TODO remove hardcoded url
            .then((response) => response.json())
            .then((data) => {
                setMessages(data?.docs ?? []);
            })
    }

    const afterNewMessage = () => {
        fetchMessages();
        setIsWritting(false);
    }

    useEffect(() => {
        fetchMessages();
    }, [])

    const list = messages.length > 0 || isWritting ? (
        <ul className="messages">
            {messages.map((message, index) => (
                <li key={index}>
                    <Message {...message} {...props} onDelete={fetchMessages} />
                </li>
            ))}
            { isWritting && 
                <li>
                    <MessageEditor onExit={() => setIsWritting(false)} onSuccess={afterNewMessage} />
                </li>
            }
        </ul>
    ) : (
        <div className="messages">
            It's pretty quiet over here...
            {/* TODO handle i18n */}
        </div>
    );

    return (
        <div className={baseClass}>
            {list}
            { !isWritting && isOpen && 
                <Button
                    buttonStyle="secondary"
                    size="small"
                    type="button"
                    onClick={() => {
                        setIsWritting(true);
                    }}
                >
                    Add message
                    {/* TODO handle i18n */}
                </Button>
            }
        </div>
    )
}

export default Thread;