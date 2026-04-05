class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository, replyRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);

    const commentIds = comments.map((comment) => comment.id);
    const replies = await this._replyRepository.getRepliesByCommentIds(commentIds);
    const likeCounts = await this._likeRepository.getLikeCountsByCommentIds(commentIds);

    thread.comments = comments.map((comment) => {
      const commentReplies = replies
        .filter((reply) => reply.comment_id === comment.id)
        .map((reply) => ({
          id: reply.id,
          content: reply.is_deleted ? '**balasan telah dihapus**' : reply.content,
          date: reply.date,
          username: reply.username,
        }));

      const likeCount = likeCounts.find((lc) => lc.comment_id === comment.id);

      return {
        id: comment.id,
        username: comment.username,
        date: comment.date,
        content: comment.is_deleted ? '**komentar telah dihapus**' : comment.content,
        replies: commentReplies,
        likeCount: likeCount ? likeCount.like_count : 0,
      };
    });

    return thread;
  }
}

export default GetThreadDetailUseCase;
