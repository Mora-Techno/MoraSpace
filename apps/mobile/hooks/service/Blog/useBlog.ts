import { useBlogPost, useBlogPosts } from './state/query';

export const useBlog = () => {
  return {
    query: {
      posts: useBlogPosts,
      post: useBlogPost,
    },
  };
};
