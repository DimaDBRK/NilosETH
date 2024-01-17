export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'mockSecret',
  expiresIn:  process.env.JWT_EXPIRES_IN || '600s'
};

