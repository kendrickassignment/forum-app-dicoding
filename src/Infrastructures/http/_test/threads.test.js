import request from 'supertest';
import pool from '../../database/postgres/pool.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import AuthenticationsTableTestHelper from '../../../../tests/AuthenticationsTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import RepliesTableTestHelper from '../../../../tests/RepliesTableTestHelper.js';
import container from '../../container.js';
import createServer from '../createServer.js';

describe('HTTP server - threads', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  const getAccessToken = async (app, username = 'dicoding') => {
    const userPayload = {
      username,
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    };

    await request(app).post('/users').send(userPayload);

    const response = await request(app).post('/authentications').send({
      username: userPayload.username,
      password: userPayload.password,
    });

    return response.body.data.accessToken;
  };

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      const app = await createServer(container);
      const accessToken = await getAccessToken(app);

      const response = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'sebuah thread', body: 'sebuah body thread' });

      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.addedThread).toBeDefined();
      expect(response.body.data.addedThread.id).toBeDefined();
      expect(response.body.data.addedThread.title).toEqual('sebuah thread');
      expect(response.body.data.addedThread.owner).toBeDefined();
    });

    it('should response 400 when payload not contain needed property', async () => {
      const app = await createServer(container);
      const accessToken = await getAccessToken(app);

      const response = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'sebuah thread' });

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
    });

    it('should response 401 when no authentication', async () => {
      const app = await createServer(container);
      const response = await request(app).post('/threads').send({ title: 'sebuah thread', body: 'sebuah body thread' });
      expect(response.status).toEqual(401);
    });
  });

  describe('when GET /threads/:threadId', () => {
    it('should response 200 and thread detail', async () => {
      const app = await createServer(container);
      const accessToken = await getAccessToken(app);

      const threadResponse = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'sebuah thread', body: 'sebuah body thread' });

      const { id: threadId } = threadResponse.body.data.addedThread;

      await request(app)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'sebuah komentar' });

      const response = await request(app).get(`/threads/${threadId}`);

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.thread).toBeDefined();
      expect(response.body.data.thread.id).toEqual(threadId);
      expect(response.body.data.thread.comments).toHaveLength(1);
    });

    it('should response 404 when thread not found', async () => {
      const app = await createServer(container);
      const response = await request(app).get('/threads/thread-xxx');
      expect(response.status).toEqual(404);
    });
  });
});
