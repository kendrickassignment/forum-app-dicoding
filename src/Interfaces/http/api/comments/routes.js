import { Router } from 'express';

const routes = (handler, authMiddleware) => {
  const router = Router();

  router.post('/:threadId/comments', authMiddleware, handler.postCommentHandler);
  router.delete('/:threadId/comments/:commentId', authMiddleware, handler.deleteCommentHandler);

  return router;
};

export default routes;
