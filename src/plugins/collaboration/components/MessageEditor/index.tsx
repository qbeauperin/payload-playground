import React, { useState, ChangeEvent } from 'react';
import { useDocumentInfo } from "payload/components/utilities";
import { Button } from 'payload/components/elements';
import './styles.scss';

interface Props {
    id?: string,
    content?: string,
    respondTo?: string,
    onExit?: Function, 
    onSuccess?: Function, 
}

const baseClass = "messageEditor";

const MessageEditor: React.FC<Props> = ({ id: messageId, content = '', respondTo, onExit, onSuccess }) => {
    const [ draft, setDraft ] = useState(content);
    const [ isFocused, setIsFocused ] = useState(false);
    const { id: docId, slug } = useDocumentInfo();

    const handleTyping = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setDraft(e?.target?.value)
    }

    const handleSubmit = () => {
        const path = `http://localhost:3000/api/messages/${messageId ?? ''}`;
        const body = Object.assign( { content: draft }, messageId ? {} : {
            doc: {
                relationTo: slug,
                value: docId
            }
        });
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
                    onSuccess(data.doc.message);
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
                            data-value={draft || ''}
                        />
                        <textarea
                            className="textarea-element"
                            id="field-new-message"
                            value={draft || ''}
                            onChange={handleTyping}
                            onFocus={() => setIsFocused(true)}
                            placeholder="Create a new thread" // TODO handle i18n + handle create/edit posts
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