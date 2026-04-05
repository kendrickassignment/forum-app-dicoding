import InvariantError from '../InvariantError.js';

describe('InvariantError', () => {
  it('should create InvariantError correctly', () => {
    const error = new InvariantError('an error occurs');

    expect(error.statusCode).toEqual(400);
    expect(error.message).toEqual('an error occurs');
    expect(error.name).toEqual('InvariantError');
  });
});
