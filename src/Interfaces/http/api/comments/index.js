import CommentsHandler from './handler.js';
import routes from './routes.js';

const comments = (container, authMiddleware) => {
  const commentsHandler = new CommentsHandler(container);
  return routes(commentsHandler, authMiddleware);
};

export default comments;
