import React from 'react';
import NewsFeed from './newsFeed';

const editPosts = () => {
  return(
        <NewsFeed disabled isEditable={true} />
    )
 }

export default editPosts;