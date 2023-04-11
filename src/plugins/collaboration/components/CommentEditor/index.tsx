import React, { useState, ChangeEvent } from 'react';
import { Button } from 'payload/components/elements';
import './styles.scss';

interface Props {
    docId: string,
    slug: string,
    respondTo?: string,
    handleExit?: Function, 
    handleSuccess?: Function, 
}

const CommentEditor: React.FC<Props> = ({ docId, slug, respondTo, handleExit, handleSuccess }) => {
    const [draft, setDraft] = useState('');

    const handleTyping = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setDraft(e?.target?.value)
    }

    const addComment = (comment) => {
        fetch(`http://localhost:3000/api/comments/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "comment": comment.toString(),
                "doc": {
                    "relationTo": slug.toString(),
                    "value": docId.toString()
                }
            })
        })
            .then((response) => response.json())
            .then((data) => {
                if(data?.doc){
                    setDraft('');
                    handleSuccess();
                }else{
                    console.error(data);
                }
            })
    }

    const handleSubmit = () => {
        addComment(draft);
        console.log('ADD COMMENT');
    }

    return (
        <div className="comment-editor">
            <div className="field-type textarea">
                <label
                    className="textarea-outer"
                    htmlFor="field-new-comment"
                >
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
                        type="button"
                        onClick={handleExit}
                    >
                        Cancel
                    </Button>
                }
                <Button
                    buttonStyle="primary"
                    size="small"
                    type="button"
                    onClick={handleSubmit}
                >
                    Post
                </Button>
            </div>
        </div>
    )
}

export default CommentEditor;