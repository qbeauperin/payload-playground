import React, { useState, useEffect, useCallback } from 'react';
import { useDocumentInfo } from "payload/components/utilities";
import Thread from '../Thread';
import MessageEditor from '../MessageEditor';
import { PluginOptions, Message } from '../../types';
import './styles.scss';

interface Props {
    currentUser: Object|null,
    pluginOptions: PluginOptions,
}

const Threads: React.FC<Props> = (props) => {
    const baseClass = "threads";
    const [ threads, setThreads ] = useState([])
    const { id: docId } = useDocumentInfo();
    
    const fetchThreads = () => {
        fetch(`http://localhost:3000/api/messages/threads/${docId}`) // TODO remove hardcoded url
            .then((response) => response.json())
            .then((data) => {
                setThreads(data?.docs ?? []);
            })
    }

    const onThreadAdd = useCallback((message: Message) => {
        setThreads([...threads, {...message, children: []}]);
    }, [threads]);

    const onThreadDelete = useCallback((deletedThreadId:string) => {
        setThreads(threads.filter(thread => thread.id !== deletedThreadId));
    }, [threads]);

    useEffect(() => {
        fetchThreads();
    }, [])

    return (
        <div className={ baseClass }>
            <ul className={`${baseClass}__list`}>
                {threads.map((message:Message) => (
                    <li key={message.id}>
                        <Thread 
                            {...message} 
                            {...props} 
                            onDelete={onThreadDelete} 
                            single={threads.length <= 1} 
                        />
                    </li>
                ))}
                <li>
                    <MessageEditor onSuccess={onThreadAdd} />
                </li>
            </ul>
        </div>
    )
}

export default Threads;