import request from 'supertest';
import pool from '../../database/postgres/pool.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import AuthenticationsTableTestHelper from '../../../../tests/AuthenticationsTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import RepliesTableTestHelper from '../../../../tests/RepliesTableTestHelper.js';
import container from '../../container.js';
import createServer from '../createServer.js';

describe('HTTP server - general and users', () => {
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

  it('should response 404 when request unregistered route', async () => {
    const app = await createServer({});
    const response = await request(app).get('/unregisteredRoute');
    expect(response.status).toEqual(404);
  });

  describe('when POST /users', () => {
    it('should response 201 and persisted user', async () => {
      const requestPayload = { username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' };
      const app = await createServer(container);
      const response = await request(app).post('/users').send(requestPayload);

      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.addedUser).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      const requestPayload = { fullname: 'Dicoding Indonesia', password: 'secret' };
      const app = await createServer(container);
      const response = await request(app).post('/users').send(requestPayload);

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      const requestPayload = { username: 'dicoding', password: 'secret', fullname: ['Dicoding Indonesia'] };
      const app = await createServer(container);
      const response = await request(app).post('/users').send(requestPayload);

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('tidak dapat membuat user baru karena tipe data tidak sesuai');
    });

    it('should response 400 when username more than 50 character', async () => {
      const requestPayload = { username: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding', password: 'secret', fullname: 'Dicoding Indonesia' };
      const app = await createServer(container);
      const response = await request(app).post('/users').send(requestPayload);

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
    });

    it('should response 400 when username contain restricted character', async () => {
      const requestPayload = { username: 'dicoding indonesia', password: 'secret', fullname: 'Dicoding Indonesia' };
      const app = await createServer(container);
      const response = await request(app).post('/users').send(requestPayload);

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
    });

    it('should response 400 when username unavailable', async () => {
      const app = await createServer(container);
      await request(app).post('/users').send({ username: 'dicoding', fullname: 'Dicoding Indonesia', password: 'super_secret' });
      const response = await request(app).post('/users').send({ username: 'dicoding', fullname: 'Dicoding Indonesia', password: 'super_secret' });

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('username tidak tersedia');
    });
  });

  it('should handle server error correctly', async () => {
    const requestPayload = { username: 'dicoding', fullname: 'Dicoding Indonesia', password: 'super_secret' };
    const app = await createServer({});
    const response = await request(app).post('/users').send(requestPayload);

    expect(response.status).toEqual(500);
    expect(response.body.status).toEqual('error');
    expect(response.body.message).toEqual('terjadi kegagalan pada server kami');
  });
});
