import React, { useEffect, useState } from 'react';
import rawData from './assets/data.json';

export const CommentContext = React.createContext<TCommentContext | null>(null);

export default function CommentsProvider({ children }: React.PropsWithChildren) {
  const [currentUser] = useState<IUser>(() => {
    const raw = localStorage.getItem('currentUser');
    return raw ? JSON.parse(raw) : rawData.currentUser;
  });
  const [comments, setComments] = useState<IComment[]>(() => {
    const raw = localStorage.getItem('comments');
    return raw ? JSON.parse(raw) : rawData.comments;
  });

  // Work around to generate ids for new comments/replies
  const [increment, setIncrement] = useState<number>(() => {
    const raw = localStorage.getItem('increment');
    return raw ? +raw : 5;
  });

  // Sync with localStorage
  useEffect(() => {
    if (comments) {
      localStorage.setItem('comments', JSON.stringify(comments));
    }
  }, [comments]);

  useEffect(() => {
    if (increment) {
      localStorage.setItem('increment', JSON.stringify(increment));
    }
  }, [increment]);

  const findTarget = (commentsCopy: IComment[], commentId: number, parentId?: number) => {
    if (parentId) {
      const targetComment = commentsCopy.find((each) => each.id === parentId);
      return targetComment?.replies?.find((each) => each.id === commentId);
    }

    return commentsCopy.find((each) => each.id === commentId);
  };

  const deleteComment = (commentId: number, parentId?: number) => {
    const commentsCopy = [...comments];

    if (parentId) {
      const targetComment = commentsCopy.find((each) => each.id === parentId);
      const targetReplyIndex =
        targetComment?.replies?.findIndex((each) => each.id === parentId) ?? -1;
      targetComment?.replies?.splice(targetReplyIndex, 1);
    } else {
      commentsCopy.splice(
        commentsCopy.findIndex((each) => each.id === commentId),
        1,
      );
    }

    setComments(commentsCopy);
  };

  const replyTo = (content: string, to?: string, id?: number) => {
    const newComment: IComment = {
      id: increment,
      createdAt: Date.now(),
      content,
      user: currentUser,
      score: 0,
      replies: [],
    };

    // If to is undefined, comment to the outmost comment
    if (!to) {
      setComments([...comments, newComment]);
      setIncrement((prev) => prev + 1);

      return;
    }

    newComment.replyingTo = to;

    // Otherwise, push to $replies$ of target comment
    const commentsCopy = [...comments];
    const targetCommentIndex = commentsCopy.findIndex((each) => each.id === id);
    commentsCopy[targetCommentIndex].replies?.push(newComment);
    setComments(commentsCopy);
    setIncrement((prev) => prev + 1);

    return;
  };

  const updateComment = (content: string, commentId: number, parentId?: number) => {
    const commentsCopy = [...comments];

    const targetComment = findTarget(commentsCopy, commentId, parentId);

    if (targetComment) {
      targetComment.content = content;
      targetComment.score = 0;
      targetComment.createdAt = Date.now();
    }

    setComments(commentsCopy);
  };

  const voteComment = (voteIncrement: number, commentId: number, parentId?: number) => {
    const commentsCopy = [...comments];

    const targetComment = findTarget(commentsCopy, commentId, parentId);

    if (targetComment) {
      targetComment.score += voteIncrement;
    }

    setComments(commentsCopy);
  };

  return (
    <CommentContext.Provider
      value={{ currentUser, comments, replyTo, updateComment, deleteComment, voteComment }}
    >
      {children}
    </CommentContext.Provider>
  );
}
