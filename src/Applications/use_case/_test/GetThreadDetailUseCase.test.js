import GetThreadDetailUseCase from '../GetThreadDetailUseCase.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ReplyRepository from '../../../Domains/replies/ReplyRepository.js';
import LikeRepository from '../../../Domains/likes/LikeRepository.js';

describe('GetThreadDetailUseCase', () => {
  it('should orchestrating the get thread detail action correctly', async () => {
    const threadId = 'thread-123';

    const mockThread = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    };

    const mockComments = [
      {
        id: 'comment-123',
        username: 'dicoding',
        date: '2021-08-08T07:22:33.555Z',
        content: 'sebuah comment',
        is_deleted: false,
      },
      {
        id: 'comment-456',
        username: 'johndoe',
        date: '2021-08-08T07:26:21.338Z',
        content: 'sebuah comment',
        is_deleted: true,
      },
    ];

    const mockReplies = [
      {
        id: 'reply-123',
        comment_id: 'comment-123',
        content: 'sebuah balasan',
        date: '2021-08-08T07:59:48.766Z',
        username: 'johndoe',
        is_deleted: false,
      },
      {
        id: 'reply-456',
        comment_id: 'comment-123',
        content: 'sebuah balasan',
        date: '2021-08-08T08:07:01.522Z',
        username: 'dicoding',
        is_deleted: true,
      },
    ];

    const mockLikeCounts = [
      { comment_id: 'comment-123', like_count: 2 },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.getThreadById = vi.fn().mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentsByThreadId = vi.fn().mockImplementation(() => Promise.resolve(mockComments));
    mockReplyRepository.getRepliesByCommentIds = vi.fn().mockImplementation(() => Promise.resolve(mockReplies));
    mockLikeRepository.getLikeCountsByCommentIds = vi.fn().mockImplementation(() => Promise.resolve(mockLikeCounts));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    const thread = await getThreadDetailUseCase.execute(threadId);

    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(threadId);
    expect(mockReplyRepository.getRepliesByCommentIds).toHaveBeenCalledWith(['comment-123', 'comment-456']);
    expect(mockLikeRepository.getLikeCountsByCommentIds).toHaveBeenCalledWith(['comment-123', 'comment-456']);

    expect(thread.comments).toHaveLength(2);
    expect(thread.comments[0].content).toEqual('sebuah comment');
    expect(thread.comments[0].likeCount).toEqual(2);
    expect(thread.comments[0].replies).toHaveLength(2);
    expect(thread.comments[0].replies[0].content).toEqual('sebuah balasan');
    expect(thread.comments[0].replies[1].content).toEqual('**balasan telah dihapus**');
    expect(thread.comments[1].content).toEqual('**komentar telah dihapus**');
    expect(thread.comments[1].likeCount).toEqual(0);
  });
});
