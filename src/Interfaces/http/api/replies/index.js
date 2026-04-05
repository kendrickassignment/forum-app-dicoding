import RepliesHandler from './handler.js';
import routes from './routes.js';

const replies = (container, authMiddleware) => {
  const repliesHandler = new RepliesHandler(container);
  return routes(repliesHandler, authMiddleware);
};

export default replies;
