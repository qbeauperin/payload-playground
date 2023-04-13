import React, { useState, useEffect } from 'react';
import { useDocumentInfo } from "payload/components/utilities";
import { Button } from 'payload/components/elements';
import ThreadThumbnail from '../ThreadThumbnail';
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
    const [ isWritting, setIsWritting ] = useState(false);
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
        setIsWritting(false);
    }

    useEffect(() => {
        fetchThreads();
    }, [])

    const list = threads.length > 0 || isWritting ? (
        <ul className={ `${baseClass}__list` }>
            { threads.map((thread, index) => (
                <li key={index}>
                    <ThreadThumbnail {...thread} {...props} onDelete={fetchThreads} />
                </li>
            )) }
            { isWritting && 
                <li>
                    <MessageEditor onExit={() => setIsWritting(false)} onSuccess={afterNewThread} />
                </li>
            }
        </ul>
    ) : (
        <div className={ `${baseClass}__list` }>
            It's pretty quiet over here...
            {/* TODO handle i18n */}
        </div>
    );

    return (
        <div className={ baseClass }>
            { list }
            { !isWritting &&
                <Button
                    buttonStyle="secondary"
                    size="small"
                    type="button"
                    onClick={() => {
                        setIsWritting(true);
                    }}
                >
                    New thread
                    {/* TODO handle i18n */}
                </Button>
            }
        </div>
    )
}

export default Threads;