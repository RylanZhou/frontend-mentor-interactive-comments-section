import React, { useContext } from 'react';

import { CommentContext } from '../CommentContext';
import Input from './Input';

export default function SendComment() {
  const { replyTo } = useContext(CommentContext) as TCommentContext;

  return <Input type="send" onConfirm={replyTo} />;
}
