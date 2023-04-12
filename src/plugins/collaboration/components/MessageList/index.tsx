import React, { useState, useEffect } from 'react';
import { useDocumentInfo } from "payload/components/utilities";
import { Button } from 'payload/components/elements';
import Message from '../Message';
import MessageEditor from '../MessageEditor';
import './styles.scss';

interface Props {
    currentUser: Object|null
}

const MessageList: React.FC<Props> = ({ currentUser }) => {
    const [ messages, setMessages ] = useState<Array<any>>([])
    const [ isWritting, setIsWritting ] = useState(false);
    const { id: docId } = useDocumentInfo();
    
    const fetchMessages = () => {
        fetch(`http://localhost:3000/api/messages/?where[doc.value][equals]=${docId}&sort=createdAt`)
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
        <ul className="message-list">
            {messages.map((message, index) => (
                <li key={index}>
                    <Message {...message} currentUser={currentUser} onDelete={fetchMessages} />
                </li>
            ))}
            { isWritting && 
                <li>
                    <MessageEditor onExit={() => setIsWritting(false)} onSuccess={afterNewMessage} />
                </li>
            }
        </ul>
    ) : (
        <div className="message-list">
            It's pretty quiet over here...
            {/* TODO handle i18n */}
        </div>
    );

    return (
        <div className="message-list">
            {list}
            { !isWritting &&
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

export default MessageList;