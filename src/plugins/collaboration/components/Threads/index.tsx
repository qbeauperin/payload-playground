import React, { useState, useEffect } from 'react';
import { useDocumentInfo } from "payload/components/utilities";
import Thread from '../Thread';
import MessageEditor from '../MessageEditor';
import { PluginOptions } from '../../types';
import qs from 'qs';
import './styles.scss';

interface Props {
    currentUser: Object|null,
    pluginOptions: PluginOptions,
}

const baseClass = "threads";

const Threads: React.FC<Props> = (props) => {
    const [ threads, setThreads ] = useState([])
    const { id: docId } = useDocumentInfo();
    
    const fetchThreads = () => {
        const query = {
            where: {
                and: [
                    { 'doc.value': { equals: docId } },
                    { resolved: { equals: false } },
                ]
            },
            sort: "createdAt",
        };
        fetch(`http://localhost:3000/api/threads/?${qs.stringify(query)}`) // TODO remove hardcoded url
            .then((response) => response.json())
            .then((data) => {
                setThreads(data?.docs ?? []);
            })
    }

    const afterNewThread = () => {
        fetchThreads();
    }

    useEffect(() => {
        fetchThreads();
    }, [])

    return (
        <div className={ baseClass }>
            <ul className={`${baseClass}__list`}>
                {threads.map((thread, index) => (
                    <li key={index}>
                        <Thread {...thread} {...props} onDelete={fetchThreads} single={threads.length <= 1} />
                    </li>
                ))}
                <li>
                    <MessageEditor onSuccess={afterNewThread} />
                </li>
            </ul>
        </div>
    )
}

export default Threads;