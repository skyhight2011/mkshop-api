import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import {
  Auth,
  AuthDocument,
  AuthProvider,
  AuthStatus,
} from '../schemas/auth.schema';
import { Session, SessionDocument } from '../schemas/session.schema';
import { RoleService } from './role.service';
import { ErrorParserService } from '../common/error-parser.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private authModel: Model<AuthDocument>,
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    private roleService: RoleService,
    private jwtService: JwtService,
    private readonly errorParser: ErrorParserService,
  ) {}

  async register(registerDto: {
    email: string;
    password: string;
    name: string;
    provider?: AuthProvider;
  }): Promise<{ auth: Auth; accessToken: string; refreshToken: string }> {
    const existingAuth = await this.authModel
      .findOne({ email: registerDto.email })
      .exec();
    if (existingAuth) {
      throw new BadRequestException('Email already registered');
    }

    const defaultRole = await this.roleService.getDefaultRole();

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(registerDto.password, saltRounds);

    const auth = new this.authModel({
      email: registerDto.email,
      passwordHash,
      roleId: defaultRole.id,
      provider: registerDto.provider || AuthProvider.LOCAL,
      status: AuthStatus.ACTIVE,
    });

    const savedAuth = await auth.save();

    // Generate tokens
    const tokens = await this.generateTokens(savedAuth);

    return {
      auth: savedAuth,
      ...tokens,
    };
  }

  async login(loginDto: { email: string; password: string }): Promise<{
    auth: Auth;
    accessToken: string;
    refreshToken: string;
  }> {
    const auth = await this.authModel.findOne({ email: loginDto.email }).exec();
    if (!auth || auth.status !== AuthStatus.ACTIVE) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      auth.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    auth.lastLoginAt = new Date();
    auth.loginAttempts = 0;
    await auth.save();

    // Generate tokens
    const tokens = await this.generateTokens(auth);

    return {
      auth,
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret:
          process.env.JWT_REFRESH_SECRET ||
          'your-super-secret-refresh-key-change-in-production',
      });

      const auth = await this.findById(payload.sub);
      if (!auth || !auth.isActive) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new tokens
      return await this.generateTokens(auth);
    } catch (error) {
      this.errorParser.parseError(error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async findById(authId: string): Promise<Auth | null> {
    return this.authModel.findById(authId).exec();
  }

  async generateTokens(auth: Auth): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const payload = {
      sub: (auth as any)._id,
      email: auth.email,
      roleId: auth.roleId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret:
          process.env.JWT_REFRESH_SECRET ||
          'your-super-secret-refresh-key-change-in-production',
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      // Verify and decode the refresh token
      await this.jwtService.verify(refreshToken, {
        secret:
          process.env.JWT_REFRESH_SECRET ||
          'your-super-secret-refresh-key-change-in-production',
      });

      // Add to blacklist or invalidate (in a real app, you'd store this in Redis)
      // For now, we'll just return successfully
    } catch (error) {
      // Token is invalid, but we don't throw an error for logout
      this.errorParser.parseError(error);
    }
  }

  async hasPermission(authId: string, permission: string): Promise<boolean> {
    const auth = await this.authModel.findById(authId).exec();
    if (!auth) return false;

    // Check role permissions
    const hasRolePermission = await this.roleService.hasPermission(
      auth.roleId.toString(),
      permission,
    );

    // Check individual permissions
    const hasIndividualPermission = auth.permissions.includes(permission);

    return hasRolePermission || hasIndividualPermission;
  }

  async updatePermissions(
    authId: string,
    permissions: string[],
  ): Promise<Auth> {
    const auth = await this.authModel
      .findByIdAndUpdate(authId, { permissions }, { new: true })
      .exec();

    if (!auth) {
      throw new BadRequestException('Auth record not found');
    }

    return auth;
  }
}
