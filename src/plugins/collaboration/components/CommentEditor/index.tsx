import React, { useState, ChangeEvent } from 'react';
import { useDocumentInfo } from "payload/components/utilities";
import { Button } from 'payload/components/elements';
import './styles.scss';

interface Props {
    id?: string,
    content?: string,
    respondTo?: string,
    handleExit?: Function, 
    handleSuccess?: Function, 
}

const CommentEditor: React.FC<Props> = ({ id, content = '', respondTo, handleExit, handleSuccess }) => {
    const [ draft, setDraft ] = useState(content);
    const { id: docId, slug } = useDocumentInfo();

    const handleTyping = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setDraft(e?.target?.value)
    }

    const handleSubmit = () => {
        const path = `http://localhost:3000/api/comments/${id ?? ''}`;
        const body = Object.assign( {"comment": draft}, id ? {} : {
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
                    handleSuccess(data.doc.comment);
                } else {
                    console.error(data);
                    // TODO Handle error
                }
            })
    }

    return (
        <div className="comment-editor">
            <div className="field-type textarea">
                <label className="textarea-outer" htmlFor="field-new-comment">
                    <div className="textarea-inner">
                        <div
                            className="textarea-clone"
                            data-value={draft || ''}
                        />
                        <textarea
                            className="textarea-element"
                            id="field-new-comment"
                            value={draft || ''}
                            onChange={handleTyping}
                        />
                    </div>
                </label>
            </div>
            <div className="comment-editor__actions">
                { handleExit && 
                    <Button
                        buttonStyle="secondary"
                        size="small"
                        onClick={handleExit}
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
                    Post
                    {/* TODO handle i18n */}
                </Button>
            </div>
        </div>
    )
}

export default CommentEditor;