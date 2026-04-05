import NotFoundError from '../NotFoundError.js';

describe('NotFoundError', () => {
  it('should create NotFoundError correctly', () => {
    const error = new NotFoundError('not found!');

    expect(error.statusCode).toEqual(404);
    expect(error.message).toEqual('not found!');
    expect(error.name).toEqual('NotFoundError');
  });
});
