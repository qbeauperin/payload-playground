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
    parent?: string;
    autofocus: boolean;
}


const MessageEditor: React.FC<Props> = ({ id: messageId, content = '', respondTo, onExit, onSuccess, parent, autofocus = true }) => {
    const baseClass = "messageEditor";
    const [ draft, setDraft ] = useState('');
    const [ isReadyToSubmit, setIsReadyToSubmit ] = useState(false);
    const [ isFocused, setIsFocused ] = useState(false);
    const { id: docId, slug } = useDocumentInfo();
    const textareaId = "message-editor-textarea" + (messageId ? `-${messageId}` : '') + (parent ? `-${parent}` : '');
    const component = useRef(null);
    const textarea = useRef(null);

    useEffect(() => {
        // Autofocus textarea when needed
        if (autofocus && (messageId || parent)){
            textarea.current.focus();
        }

        // Listen to clicks on the whole document
        document.addEventListener('click', handleClicks, true);
        return () => {
            document.removeEventListener('click', handleClicks, true);
        };
    }, []);

    const handleClicks = (event) => {
        // If click is outside of the component
        if (component.current && !component.current.contains(event.target)) {
            setIsFocused(false);
        }
    }

    useEffect(() => {
        setIsReadyToSubmit(!!draft.trim());
    }, [draft])

    const onTextareaFocus = () => {
        setDraft(draft ? draft : content);
        setIsFocused(true);
    }

    const handleTyping = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setDraft(e?.target?.value);
    }

    const handleSubmit = () => {
        // Check that content isn't empty
        if (!draft.trim()){
            return false;
        }

        // Create or update message
        const path = `http://localhost:3000/api/messages/${messageId ?? ''}`;
        const body = Object.assign( 
            { content: draft }, 
            messageId ? {} : {
                doc: {
                    relationTo: slug,
                    value: docId
                },
            }, parent ? {
                parent: parent
            } : {}
        );
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
        <div className={baseClass + (isFocused ? ` ${baseClass}--focused` : '')} ref={component}>
            <div className="field-type textarea">
                <label className="textarea-outer" htmlFor={textareaId}>
                    <div className="textarea-inner">
                        <div
                            className="textarea-clone"
                            data-value={draft}
                        />
                        <textarea
                            ref={textarea}
                            className="textarea-element"
                            id={textareaId}
                            value={draft}
                            onChange={handleTyping}
                            onFocus={onTextareaFocus}
                            placeholder={parent ? "Reply..." : "New thread..."} // TODO handle i18n + handle create/edit posts
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
                        disabled={!isReadyToSubmit}
                    >
                        { messageId ? "Save" : "Send" }
                        {/* TODO handle i18n */}
                    </Button>
                </div>
            }
        </div>
    )
}

export default MessageEditor;