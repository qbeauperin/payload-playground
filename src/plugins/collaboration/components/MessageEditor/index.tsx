import React, { useState, useEffect, ChangeEvent, useRef } from 'react';
import { useDocumentInfo } from "payload/components/utilities";
import { Button } from 'payload/components/elements';
import { Message } from '../../types';
import './styles.scss';

interface Props {
    id?: string;
    content?: string;
    respondTo?: string;
    onExit?: Function; 
    onSuccess?(message: Message): any;
    thread?: string;
    autofocus: boolean;
}

const baseClass = "messageEditor";

const MessageEditor: React.FC<Props> = ({ id: messageId, content = '', respondTo, onExit, onSuccess, thread, autofocus = true }) => {
    const [ draft, setDraft ] = useState('');
    const [ isFocused, setIsFocused ] = useState(false);
    const { id: docId, slug } = useDocumentInfo();
    const textarea = useRef(null);

    useEffect(() => {
        if (autofocus && (messageId || thread)){
            textarea.current.focus();
        }
    }, []);

    const onTextareaFocus = () => {
        setDraft(content);
        setIsFocused(true);
    }

    const handleTyping = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setDraft(e?.target?.value)
    }

    const handleSubmit = () => {
        const path = `http://localhost:3000/api/messages/${messageId ?? ''}`;
        const body = Object.assign( { content: draft }, messageId ? {} : {
            doc: {
                relationTo: slug,
                value: docId
            },
        }, thread ? {
            thread: thread
        } : {});
        const options = {
            method: messageId ? 'PATCH' : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        };
        
        fetch(path, options)
            .then((response) => response.json())
            .then((data) => {
                if (data?.doc) {
                    setDraft('');
                    onSuccess(data.doc);
                    handleCancel();
                } else {
                    console.error(data);
                    // TODO Handle error
                }
            })
    }

    const handleCancel = () => {
        setIsFocused(false);
        setDraft('');
        if (onExit) onExit();
    }

    return (
        <div className={baseClass + (isFocused ? ` ${baseClass}--focused` : '')}>
            <div className="field-type textarea">
                <label className="textarea-outer" htmlFor="field-new-message">
                    <div className="textarea-inner">
                        <div
                            className="textarea-clone"
                            data-value={draft}
                        />
                        <textarea
                            ref={textarea}
                            className="textarea-element"
                            id="field-new-message"
                            value={draft}
                            onChange={handleTyping}
                            onFocus={onTextareaFocus}
                            placeholder={thread ? "Reply..." : "New thread..."} // TODO handle i18n + handle create/edit posts
                        />
                    </div>
                </label>
            </div>
            {isFocused &&
                <div className={`${baseClass}__actions`}>
                    <Button
                        buttonStyle="secondary"
                        size="small"
                        onClick={handleCancel}
                    >
                        Cancel
                        {/* TODO handle i18n */}
                    </Button>
                    <Button
                        buttonStyle="primary"
                        size="small"
                        onClick={handleSubmit}
                    >
                        { messageId ? "Save" : "Post" }
                        {/* TODO handle i18n */}
                    </Button>
                </div>
            }
        </div>
    )
}

export default MessageEditor;