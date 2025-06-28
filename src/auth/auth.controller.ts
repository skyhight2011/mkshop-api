import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RoleService } from './role.service';
import { AuthProvider } from '../schemas/auth.schema';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly roleService: RoleService,
  ) {}

  @Post('register')
  async register(
    @Body()
    registerDto: {
      email: string;
      password: string;
      name: string;
      provider?: AuthProvider;
    },
  ) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: { email: string; password: string }) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() refreshDto: { refreshToken: string }) {
    return this.authService.refreshToken(refreshDto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() logoutDto: { refreshToken: string }) {
    await this.authService.logout(logoutDto.refreshToken);
    return { message: 'Logged out successfully' };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req: any) {
    return {
      authId: req.user.authId,
      email: req.user.email,
      roleId: req.user.roleId,
      permissions: req.user.permissions,
    };
  }

  @Get('roles')
  @UseGuards(JwtAuthGuard)
  async getRoles() {
    return this.roleService.findAll();
  }

  @Post('permissions/check')
  @UseGuards(JwtAuthGuard)
  async checkPermission(
    @Body() checkDto: { permission: string },
    @Request() req: any,
  ) {
    const hasPermission = await this.authService.hasPermission(
      req.user.authId,
      checkDto.permission,
    );
    return { hasPermission };
  }
}
