import AuthorizationError from '../AuthorizationError.js';

describe('AuthorizationError', () => {
  it('should create AuthorizationError correctly', () => {
    const error = new AuthorizationError('authorization error!');

    expect(error.statusCode).toEqual(403);
    expect(error.message).toEqual('authorization error!');
    expect(error.name).toEqual('AuthorizationError');
  });
});
