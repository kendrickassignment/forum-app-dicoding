import request from 'supertest';
import pool from '../../database/postgres/pool.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import AuthenticationsTableTestHelper from '../../../../tests/AuthenticationsTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import RepliesTableTestHelper from '../../../../tests/RepliesTableTestHelper.js';
import container from '../../container.js';
import createServer from '../createServer.js';

describe('HTTP server - authentications', () => {
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

  describe('when POST /authentications', () => {
    it('should response 201 and new authentication', async () => {
      const app = await createServer(container);
      await request(app).post('/users').send({ username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' });
      const response = await request(app).post('/authentications').send({ username: 'dicoding', password: 'secret' });

      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
    });

    it('should response 400 if username not found', async () => {
      const app = await createServer(container);
      const response = await request(app).post('/authentications').send({ username: 'dicoding', password: 'secret' });
      expect(response.status).toEqual(400);
    });

    it('should response 401 if password wrong', async () => {
      const app = await createServer(container);
      await request(app).post('/users').send({ username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' });
      const response = await request(app).post('/authentications').send({ username: 'dicoding', password: 'wrong' });
      expect(response.status).toEqual(401);
    });

    it('should response 400 if login payload not contain needed property', async () => {
      const app = await createServer(container);
      const response = await request(app).post('/authentications').send({ username: 'dicoding' });
      expect(response.status).toEqual(400);
    });

    it('should response 400 if login payload wrong data type', async () => {
      const app = await createServer(container);
      const response = await request(app).post('/authentications').send({ username: 123, password: 'secret' });
      expect(response.status).toEqual(400);
    });
  });

  describe('when PUT /authentications', () => {
    it('should return 200 and new access token', async () => {
      const app = await createServer(container);
      await request(app).post('/users').send({ username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' });
      const loginResponse = await request(app).post('/authentications').send({ username: 'dicoding', password: 'secret' });

      const { data: { refreshToken } } = loginResponse.body;
      const response = await request(app).put('/authentications').send({ refreshToken });

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.accessToken).toBeDefined();
    });

    it('should return 400 payload not contain refresh token', async () => {
      const app = await createServer(container);
      const response = await request(app).put('/authentications').send({});
      expect(response.status).toEqual(400);
    });

    it('should return 400 if refresh token not string', async () => {
      const app = await createServer(container);
      const response = await request(app).put('/authentications').send({ refreshToken: 123 });
      expect(response.status).toEqual(400);
    });

    it('should return 400 if refresh token not valid', async () => {
      const app = await createServer(container);
      const response = await request(app).put('/authentications').send({ refreshToken: 'invalid_refresh_token' });
      expect(response.status).toEqual(400);
    });

    it('should return 400 if refresh token not registered in database', async () => {
      const app = await createServer(container);
      const AuthenticationTokenManager = (await import('../../../Applications/security/AuthenticationTokenManager.js')).default;
      const refreshToken = await container.getInstance(AuthenticationTokenManager.name).createRefreshToken({ username: 'dicoding' });
      const response = await request(app).put('/authentications').send({ refreshToken });
      expect(response.status).toEqual(400);
    });
  });

  describe('when DELETE /authentications', () => {
    it('should response 200 if refresh token valid', async () => {
      const app = await createServer(container);
      const refreshToken = 'refresh_token';
      await AuthenticationsTableTestHelper.addToken(refreshToken);
      const response = await request(app).delete('/authentications').send({ refreshToken });
      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
    });

    it('should response 400 if refresh token not registered in database', async () => {
      const app = await createServer(container);
      const response = await request(app).delete('/authentications').send({ refreshToken: 'refresh_token' });
      expect(response.status).toEqual(400);
    });

    it('should response 400 if payload not contain refresh token', async () => {
      const app = await createServer(container);
      const response = await request(app).delete('/authentications').send({});
      expect(response.status).toEqual(400);
    });
  });
});
