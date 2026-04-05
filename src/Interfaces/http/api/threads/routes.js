import { Router } from 'express';

const routes = (handler, authMiddleware) => {
  const router = Router();

  router.post('/', authMiddleware, handler.postThreadHandler);
  router.get('/:threadId', handler.getThreadByIdHandler);

  return router;
};

export default routes;
