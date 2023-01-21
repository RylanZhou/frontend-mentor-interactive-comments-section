import React, { useContext, useState } from 'react';

import { CommentContext } from '../CommentContext';
import styles from '../styles/Input.module.scss';

export default function Input(props: {
  type: 'send' | 'reply';
  placeholder?: string;
  to?: string;
  onConfirm: (content: string) => void;
}) {
  const { currentUser } = useContext(CommentContext) as TCommentContext;

  const [content, setContent] = useState('');

  return (
    <div className={`${styles.Input} ${props.type === 'reply' ? styles.reply : ''}`}>
      <textarea
        rows={4}
        placeholder={props.placeholder || 'Add a comment...'}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <img src={currentUser.image.png} alt="avatar" />
      <button
        onClick={() => {
          props.onConfirm(content);
          setContent('');
        }}
      >
        {props.type === 'reply' ? 'Reply' : 'Send'}
      </button>
      <div style={{ clear: 'both' }}></div>
    </div>
  );
}
