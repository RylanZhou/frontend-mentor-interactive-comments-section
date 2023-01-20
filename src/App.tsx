import React from 'react';

import CommentsProvider from './CommentContext';
import CommentList from './Components/CommentList';
import SendComment from './Components/SendComment';

import styles from './styles/App.module.scss';

function App() {
  return (
    <div className={styles.App}>
      <CommentsProvider>
        <>
          <CommentList />

          <SendComment />
        </>
      </CommentsProvider>
    </div>
  );
}

export default App;
