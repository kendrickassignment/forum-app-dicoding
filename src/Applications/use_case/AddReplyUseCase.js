import NewReply from '../../Domains/replies/entities/NewReply.js';

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.verifyThreadExists(useCasePayload.threadId);
    await this._commentRepository.verifyCommentExists(useCasePayload.commentId);
    const newReply = new NewReply(useCasePayload);
    return this._replyRepository.addReply(newReply);
  }
}

export default AddReplyUseCase;
