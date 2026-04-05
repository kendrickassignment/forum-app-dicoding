import { Router } from 'express';

const routes = (handler, authMiddleware) => {
  const router = Router();

  router.post('/:threadId/comments/:commentId/replies', authMiddleware, handler.postReplyHandler);
  router.delete('/:threadId/comments/:commentId/replies/:replyId', authMiddleware, handler.deleteReplyHandler);

  return router;
};

export default routes;
