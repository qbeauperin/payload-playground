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

const MessageEditor: React.FC<Props> = ({ id, content = '', respondTo, onExit, onSuccess }) => {
    const [ draft, setDraft ] = useState(content);
    const { id: docId, slug } = useDocumentInfo();

    const handleTyping = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setDraft(e?.target?.value)
    }

    const handleSubmit = () => {
        const path = `http://localhost:3000/api/messages/${id ?? ''}`;
        const body = Object.assign( {"message": draft}, id ? {} : {
            "doc": {
                "relationTo": slug,
                "value": docId
            }
        });
        const options = {
            method: id ? 'PATCH' : 'POST',
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

    return (
        <div className="message-editor">
            <div className="field-type textarea">
                <label className="textarea-outer" htmlFor="field-new-message">
                    <div className="textarea-inner">
                        <div
                            className="textarea-clone"
                            data-value={draft || ''}
                        />
                        <textarea
                            autoFocus 
                            className="textarea-element"
                            id="field-new-message"
                            value={draft || ''}
                            onChange={handleTyping}
                        />
                    </div>
                </label>
            </div>
            <div className="message-editor__actions">
                { onExit && 
                    <Button
                        buttonStyle="secondary"
                        size="small"
                        onClick={onExit}
                    >
                        Cancel
                        {/* TODO handle i18n */}
                    </Button>
                }
                <Button
                    buttonStyle="primary"
                    size="small"
                    onClick={handleSubmit}
                >
                    { id ? "Save" : "Post" }
                    {/* TODO handle i18n */}
                </Button>
            </div>
        </div>
    )
}

export default MessageEditor;