import React, { useEffect, useState } from 'react';
import * as timeago from 'timeago.js';

import CommentList from './CommentList';
import Input from './Input';

import DeleteIcon from '../assets/icon-delete.svg';
import EditIcon from '../assets/icon-edit.svg';
import ReplyIcon from '../assets/icon-reply.svg';

import styles from '../styles/Comments.module.scss';

export default function CommentItem({
  user,
  isOwner,
  ...props
}: IComment & {
  isOwner: boolean;
  onReply: (content: string) => void;
  onUpdate: (content: string) => void;
  onDelete: () => void;
  onVote: (voteIncrement: number) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [editingContent, setEditingContent] = useState(`@${props.replyingTo} ${props.content}`);
  const [createdAt, setCreatedAt] = useState(timeago.format(props.createdAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setCreatedAt(timeago.format(props.createdAt));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <li className={styles.CommentItem}>
      <div className={styles.main}>
        <div className={styles.header}>
          <img src={user.image.png} alt="avatar" />
          <span className={styles.username}>{user.username}</span>
          {isOwner && <span className={styles.you}>you</span>}
          <span className={styles.time}>{createdAt}</span>
        </div>

        {isEditing ? (
          <>
            <textarea
              rows={6}
              value={editingContent}
              onChange={(e) => setEditingContent(e.target.value)}
            ></textarea>
            <div style={{ marginBottom: '1rem', textAlign: 'right' }}>
              <button
                className={styles['update-btn']}
                onClick={() => {
                  props.onUpdate(
                    props.replyingTo
                      ? editingContent.replace(new RegExp(`^@${props.replyingTo} `), '')
                      : editingContent,
                  );
                  setIsEditing(false);
                }}
              >
                Update
              </button>
            </div>
          </>
        ) : (
          <p className={styles.content}>
            {props.replyingTo && <span className={styles.at}>@{props.replyingTo}</span>}{' '}
            {props.content}
          </p>
        )}

        <div className={styles.operation}>
          <div className={styles.score}>
            <span onClick={() => props.onVote(1)}>+</span>
            <span className={styles.num}>{props.score}</span>
            <span onClick={() => props.onVote(-1)}>-</span>
          </div>

          <span className={styles.buttons}>
            {isOwner ? (
              <>
                <button className={styles.delete} onClick={props.onDelete}>
                  <img src={DeleteIcon} alt="icon" />
                  Delete
                </button>
                <button onClick={() => setIsEditing((prev) => !prev)}>
                  <img src={EditIcon} alt="icon" />
                  Edit
                </button>
              </>
            ) : (
              <button onClick={() => setIsReplying((prev) => !prev)}>
                <img src={ReplyIcon} alt="icon" />
                Reply
              </button>
            )}
          </span>
        </div>
      </div>

      {isReplying && (
        <Input
          type="reply"
          to={user.username}
          onConfirm={(content) => {
            props.onReply(content);
            setIsReplying(false);
          }}
        />
      )}

      {props.replies && props.replies.length > 0 && (
        <CommentList replies={props.replies} parentId={props.id} />
      )}
    </li>
  );
}
