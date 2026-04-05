import LoginUserUseCase from '../LoginUserUseCase.js';
import UserRepository from '../../../Domains/users/UserRepository.js';
import AuthenticationRepository from '../../../Domains/authentications/AuthenticationRepository.js';
import AuthenticationTokenManager from '../../security/AuthenticationTokenManager.js';
import PasswordHash from '../../security/PasswordHash.js';
import NewAuth from '../../../Domains/authentications/entities/NewAuth.js';

describe('LoginUserUseCase', () => {
  it('should orchestrating the login action correctly', async () => {
    const useCasePayload = { username: 'dicoding', password: 'secret' };
    const expectedAuthentication = new NewAuth({ accessToken: 'access_token', refreshToken: 'refresh_token' });

    const mockUserRepository = new UserRepository();
    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();
    const mockPasswordHash = new PasswordHash();

    mockUserRepository.getPasswordByUsername = vi.fn().mockImplementation(() => Promise.resolve('encrypted_password'));
    mockPasswordHash.comparePassword = vi.fn().mockImplementation(() => Promise.resolve());
    mockUserRepository.getIdByUsername = vi.fn().mockImplementation(() => Promise.resolve('user-123'));
    mockAuthenticationTokenManager.createAccessToken = vi.fn().mockImplementation(() => Promise.resolve('access_token'));
    mockAuthenticationTokenManager.createRefreshToken = vi.fn().mockImplementation(() => Promise.resolve('refresh_token'));
    mockAuthenticationRepository.addToken = vi.fn().mockImplementation(() => Promise.resolve());

    const loginUserUseCase = new LoginUserUseCase({
      userRepository: mockUserRepository,
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
      passwordHash: mockPasswordHash,
    });

    const actualAuthentication = await loginUserUseCase.execute(useCasePayload);

    expect(actualAuthentication).toStrictEqual(expectedAuthentication);
    expect(mockUserRepository.getPasswordByUsername).toHaveBeenCalledWith('dicoding');
    expect(mockPasswordHash.comparePassword).toHaveBeenCalledWith('secret', 'encrypted_password');
    expect(mockUserRepository.getIdByUsername).toHaveBeenCalledWith('dicoding');
    expect(mockAuthenticationTokenManager.createAccessToken).toHaveBeenCalledWith({ username: 'dicoding', id: 'user-123' });
    expect(mockAuthenticationTokenManager.createRefreshToken).toHaveBeenCalledWith({ username: 'dicoding', id: 'user-123' });
    expect(mockAuthenticationRepository.addToken).toHaveBeenCalledWith('refresh_token');
  });
});
