import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'your-super-secret-jwt-key-change-in-production',
      issuer: configService.get<string>('JWT_ISSUER') || 'mkshop-api',
      audience: configService.get<string>('JWT_AUDIENCE') || 'mkshop-users',
    });
  }

  async validate(payload: any) {
    const { sub: authId, email, roleId } = payload;

    // Validate that the auth record still exists and is active
    const auth = await this.authService.findById(authId);
    if (!auth || !auth.isActive) {
      throw new UnauthorizedException('Invalid token');
    }

    return {
      authId,
      email,
      roleId,
      permissions: auth.permissions,
    };
  }
}
