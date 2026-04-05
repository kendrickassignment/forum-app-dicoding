import pool from '../../database/postgres/pool.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import LikesTableTestHelper from '../../../../tests/LikesTableTestHelper.js';
import LikeRepositoryPostgres from '../LikeRepositoryPostgres.js';

describe('LikeRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
    await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addLike function', () => {
    it('should add like to database', async () => {
      const likeRepository = new LikeRepositoryPostgres(pool, () => '123');

      await likeRepository.addLike('user-123', 'comment-123');

      const likes = await LikesTableTestHelper.findLike('user-123', 'comment-123');
      expect(likes).toHaveLength(1);
    });
  });

  describe('removeLike function', () => {
    it('should remove like from database', async () => {
      const likeRepository = new LikeRepositoryPostgres(pool, () => '123');
      await likeRepository.addLike('user-123', 'comment-123');

      await likeRepository.removeLike('user-123', 'comment-123');

      const likes = await LikesTableTestHelper.findLike('user-123', 'comment-123');
      expect(likes).toHaveLength(0);
    });
  });

  describe('isLiked function', () => {
    it('should return true when liked', async () => {
      const likeRepository = new LikeRepositoryPostgres(pool, () => '123');
      await likeRepository.addLike('user-123', 'comment-123');

      const result = await likeRepository.isLiked('user-123', 'comment-123');
      expect(result).toEqual(true);
    });

    it('should return false when not liked', async () => {
      const likeRepository = new LikeRepositoryPostgres(pool, () => '123');

      const result = await likeRepository.isLiked('user-123', 'comment-123');
      expect(result).toEqual(false);
    });
  });

  describe('getLikeCountsByCommentIds function', () => {
    it('should return like counts correctly', async () => {
      const likeRepository = new LikeRepositoryPostgres(pool, () => '123');
      await likeRepository.addLike('user-123', 'comment-123');

      const result = await likeRepository.getLikeCountsByCommentIds(['comment-123']);
      expect(result).toEqual([{ comment_id: 'comment-123', like_count: 1 }]);
    });
  });
});
