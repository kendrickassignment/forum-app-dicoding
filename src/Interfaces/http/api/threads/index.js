import ThreadsHandler from './handler.js';
import routes from './routes.js';

const threads = (container, authMiddleware) => {
  const threadsHandler = new ThreadsHandler(container);
  return routes(threadsHandler, authMiddleware);
};

export default threads;
