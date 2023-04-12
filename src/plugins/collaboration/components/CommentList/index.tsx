import React, { useState, useEffect } from 'react';
import { useDocumentInfo } from "payload/components/utilities";
import { Button } from 'payload/components/elements';
import Comment from '../Comment';
import CommentEditor from '../CommentEditor';
import './styles.scss';

interface Props {
    currentUser: Object|null
}

const CommentList: React.FC<Props> = ({ currentUser }) => {
    const [ comments, setComments ] = useState<Array<any>>([])
    const [ isWritting, setIsWritting ] = useState(false);
    const { id: docId } = useDocumentInfo();
    
    const fetchComments = () => {
        fetch(`http://localhost:3000/api/comments/?where[doc.value][equals]=${docId}&sort=createdAt`)
            .then((response) => response.json())
            .then((data) => {
                setComments(data?.docs ?? []);
            })
    }

    const afterNewComment = () => {
        fetchComments();
        setIsWritting(false);
    }

    useEffect(() => {
        fetchComments();
    }, [])

    const list = comments.length > 0 || isWritting ? (
        <ul className="comment-list">
            {comments.map((comment, index) => (
                <li key={index}>
                    <Comment {...comment} currentUser={currentUser} />
                </li>
            ))}
            { isWritting && 
                <li>
                    <CommentEditor handleExit={() => setIsWritting(false)} handleSuccess={afterNewComment} />
                </li>
            }
        </ul>
    ) : (
        <div className="comment-list">
            It's pretty quiet over here...
            {/* TODO handle i18n */}
        </div>
    );

    return (
        <div className="comment-list">
            {list}
            { !isWritting &&
                <Button
                    buttonStyle="secondary"
                    size="small"
                    type="button"
                    onClick={() => {
                        setIsWritting(true);
                    }}
                >
                    Add comment
                    {/* TODO handle i18n */}
                </Button>
            }
        </div>
    )
}

export default CommentList;