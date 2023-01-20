import React, { useContext } from 'react';

import { CommentContext } from '../CommentContext';
import CommentItem from './CommentItem';
import { confirm } from './DeleteModal';

import styles from '../styles/Comments.module.scss';

export default function CommentList({
  replies,
  parentId,
}: {
  replies?: IComment[];
  parentId?: number;
}) {
  const { comments, currentUser, replyTo, updateComment, deleteComment, voteComment } = useContext(
    CommentContext,
  ) as TCommentContext;

  return (
    <ul className={`${styles.CommentList} ${replies ? styles.sub : ''}`}>
      {(replies || comments).map((comment) => (
        <CommentItem
          key={comment.id}
          {...comment}
          isOwner={currentUser.username === comment.user.username}
          onReply={(content) => replyTo(content, comment.user.username, parentId || comment.id)}
          onUpdate={(content) => updateComment(content, comment.id, parentId)}
          onDelete={() => {
            confirm({
              onCancel: () => {
                return;
              },
              onDelete: () => deleteComment(comment.id, parentId),
            });
          }}
          onVote={(voteIncrement) => voteComment(voteIncrement, comment.id, parentId)}
        />
      ))}
    </ul>
  );
}
