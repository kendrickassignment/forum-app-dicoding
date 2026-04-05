import DeleteAuthenticationUseCase from '../DeleteAuthenticationUseCase.js';
import AuthenticationRepository from '../../../Domains/authentications/AuthenticationRepository.js';

describe('DeleteAuthenticationUseCase', () => {
  it('should throw error if use case payload not contain refresh token', async () => {
    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({});
    await expect(deleteAuthenticationUseCase.execute({})).rejects.toThrow('DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
  });

  it('should throw error if refresh token not string', async () => {
    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({});
    await expect(deleteAuthenticationUseCase.execute({ refreshToken: 123 })).rejects.toThrow('DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the delete authentication action correctly', async () => {
    const useCasePayload = { refreshToken: 'refresh_token' };
    const mockAuthenticationRepository = new AuthenticationRepository();

    mockAuthenticationRepository.checkAvailabilityToken = vi.fn().mockImplementation(() => Promise.resolve());
    mockAuthenticationRepository.deleteToken = vi.fn().mockImplementation(() => Promise.resolve());

    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({ authenticationRepository: mockAuthenticationRepository });
    await deleteAuthenticationUseCase.execute(useCasePayload);

    expect(mockAuthenticationRepository.checkAvailabilityToken).toHaveBeenCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationRepository.deleteToken).toHaveBeenCalledWith(useCasePayload.refreshToken);
  });
});
