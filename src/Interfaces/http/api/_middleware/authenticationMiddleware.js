import AuthenticationTokenManager from '../../../../Applications/security/AuthenticationTokenManager.js';
import AuthenticationError from '../../../../Commons/exceptions/AuthenticationError.js';

const createAuthMiddleware = (container) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AuthenticationError('Missing authentication');
      }

      const token = authHeader.substring(7);
      const authenticationTokenManager = container.getInstance(AuthenticationTokenManager.name);
      const payload = await authenticationTokenManager.verifyAccessToken(token);

      req.auth = {
        credentials: {
          id: payload.id,
        },
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default createAuthMiddleware;
