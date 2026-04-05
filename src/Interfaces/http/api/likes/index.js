import { Router } from 'express';
import LikesHandler from './handler.js';

const likes = (container, authMiddleware) => {
  const router = Router();
  const handler = new LikesHandler(container);

  router.put('/:threadId/comments/:commentId/likes', authMiddleware, handler.putLikeHandler);

  return router;
};

export default likes;
