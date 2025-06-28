import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleOptions = {
  secret:
    process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  signOptions: {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m', // Access token expires in 15 minutes
    issuer: process.env.JWT_ISSUER || 'mkshop-api',
    audience: process.env.JWT_AUDIENCE || 'mkshop-users',
  },
};

export const refreshTokenConfig = {
  secret:
    process.env.JWT_REFRESH_SECRET ||
    'your-super-secret-refresh-key-change-in-production',
  expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d', // Refresh token expires in 7 days
};
