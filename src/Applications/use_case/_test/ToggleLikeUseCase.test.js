import ToggleLikeUseCase from '../ToggleLikeUseCase.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import LikeRepository from '../../../Domains/likes/LikeRepository.js';

describe('ToggleLikeUseCase', () => {
  it('should orchestrating the add like action correctly when not liked', async () => {
    const useCasePayload = { threadId: 'thread-123', commentId: 'comment-123', userId: 'user-123' };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.verifyThreadExists = vi.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExists = vi.fn().mockImplementation(() => Promise.resolve());
    mockLikeRepository.isLiked = vi.fn().mockImplementation(() => Promise.resolve(false));
    mockLikeRepository.addLike = vi.fn().mockImplementation(() => Promise.resolve());
    mockLikeRepository.removeLike = vi.fn().mockImplementation(() => Promise.resolve());

    const toggleLikeUseCase = new ToggleLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    await toggleLikeUseCase.execute(useCasePayload);

    expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentExists).toHaveBeenCalledWith('comment-123');
    expect(mockLikeRepository.isLiked).toHaveBeenCalledWith('user-123', 'comment-123');
    expect(mockLikeRepository.addLike).toHaveBeenCalledWith('user-123', 'comment-123');
    expect(mockLikeRepository.removeLike).not.toHaveBeenCalled();
  });

  it('should orchestrating the remove like action correctly when already liked', async () => {
    const useCasePayload = { threadId: 'thread-123', commentId: 'comment-123', userId: 'user-123' };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.verifyThreadExists = vi.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExists = vi.fn().mockImplementation(() => Promise.resolve());
    mockLikeRepository.isLiked = vi.fn().mockImplementation(() => Promise.resolve(true));
    mockLikeRepository.addLike = vi.fn().mockImplementation(() => Promise.resolve());
    mockLikeRepository.removeLike = vi.fn().mockImplementation(() => Promise.resolve());

    const toggleLikeUseCase = new ToggleLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    await toggleLikeUseCase.execute(useCasePayload);

    expect(mockLikeRepository.isLiked).toHaveBeenCalledWith('user-123', 'comment-123');
    expect(mockLikeRepository.removeLike).toHaveBeenCalledWith('user-123', 'comment-123');
    expect(mockLikeRepository.addLike).not.toHaveBeenCalled();
  });
});
