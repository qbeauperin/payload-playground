import React, { useState, useEffect } from 'react';
import { useDocumentInfo } from "payload/components/utilities";
import { Button } from 'payload/components/elements';
import Comment from '../Comment';
import CommentEditor from '../CommentEditor';
import './styles.scss';

const CommentList: React.FC = () => {
    const [ comments, setComments ] = useState<Array<any>>([])
    const [ isWritting, setIsWritting ] = useState(false);
    const { id: docId, slug } = useDocumentInfo();
    
    const startWritting = () => {
        setIsWritting(true);
    }

    const stopWritting = () => {
        setIsWritting(false);
    }

    const fetchComments = () => {
        fetch(`http://localhost:3000/api/comments/?where[doc.value][equals]=${docId}&sort=createdAt`)
            .then((response) => response.json())
            .then((data) => {
                setComments(data?.docs ?? []);
            })
    }

    useEffect(() => {
        fetchComments();
    }, [])

    const list = comments.length > 0 || isWritting ? (
        <ul className="comment-list">
            {comments.map((comment, index) => (
                <li key={index}>
                    <Comment {...comment} />
                </li>
            ))}
            { isWritting && 
                <li>
                    <CommentEditor docId={docId} slug={slug} handleExit={stopWritting} handleSuccess={() => fetchComments()} />
                </li>
            }
        </ul>
    ) : (
        'No comments yet.'
    );

    return (
        <div className="comment-list">
            {list}
            { !isWritting &&
                <Button
                    buttonStyle="secondary"
                    // icon="plus"
                    size="small"
                    type="button"
                    onClick={() => {
                        startWritting();
                    }}
                >
                    Add comment
                </Button>
            }
        </div>
    )
}

export default CommentList;