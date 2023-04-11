import React, { useState, useEffect } from 'react';
import { useDocumentInfo } from "payload/components/utilities";
import Comment from '../Comment';
import './styles.scss';

interface Props {
    id: string,
    comment: string,
    createdAt: string,
    user: Object,
    respondTo?: string,
}

const CommentList: React.FC<Props> = ({}) => {
    const [comments, setComments] = useState<Array<any>>([])
    const { id: docId } = useDocumentInfo();

    const fetchComments = () => {
        fetch(`http://localhost:3000/api/comments/?where[doc.value][equals]=${docId}`)
            .then((response) => response.json())
            .then((data) => {
                setComments(data?.docs ?? []);
            })
    }

    useEffect(() => {
        fetchComments();
    }, [])

    return comments.length > 0 ? (
        <ul className="comment-list">
            {comments.map((comment, index) => (
                <li key={index}>
                    <Comment {...comment} />
                </li>
            ))}
        </ul>
    ) : (
        'No comments yet.'
    );
}

export default CommentList;