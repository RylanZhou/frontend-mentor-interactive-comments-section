interface IUser {
  image: {
    png: string;
    webp: string;
  };
  username: string;
}

interface IComment {
  id: number;
  content: string;
  createdAt: number;
  score: number;
  user: IUser;
  replies?: IComment[];
  replyingTo?: string;
}

interface ICommentsData {
  currentUser: IUser;
  comments: IComment[];
}

type TCommentContext = ICommentsData & {
  /**
   * when $to$ is provided, this is a reply; otherwise a comment
   */
  replyTo: (content: string, to?: string, id?: number) => void;

  /**
   * when parentId is provided, this is a reply with $commentId$ of a comment $parentId$
   * otherwise this is a comment with $commentId$
   */
  updateComment: (content: string, commentId: number, parentId?: number) => void;
  deleteComment: (commentId: number, parentId?: number) => void;
  voteComment: (voteIncrement, commentId: number, parentId?: number) => void;
};
