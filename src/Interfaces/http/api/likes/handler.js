import ToggleLikeUseCase from '../../../../Applications/use_case/ToggleLikeUseCase.js';

class LikesHandler {
  constructor(container) {
    this._container = container;
    this.putLikeHandler = this.putLikeHandler.bind(this);
  }

  async putLikeHandler(req, res, next) {
    try {
      const { threadId, commentId } = req.params;
      const { id: userId } = req.auth;

      const toggleLikeUseCase = this._container.getInstance(ToggleLikeUseCase.name);
      await toggleLikeUseCase.execute({ threadId, commentId, userId });

      res.status(200).json({ status: 'success' });
    } catch (error) {
      next(error);
    }
  }
}

export default LikesHandler;
