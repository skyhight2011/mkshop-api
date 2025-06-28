import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Role, RoleSchema } from '../schemas/role.schema';
import { Auth, AuthSchema } from '../schemas/auth.schema';
import { Session, SessionSchema } from '../schemas/session.schema';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RoleService } from './role.service';
import { JwtStrategy } from './jwt.strategy';
import { jwtConfig } from '../config/jwt.config';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Role.name, schema: RoleSchema },
      { name: Auth.name, schema: AuthSchema },
      { name: Session.name, schema: SessionSchema },
    ]),
    PassportModule,
    JwtModule.register(jwtConfig),
    CommonModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, RoleService, JwtStrategy],
  exports: [AuthService, RoleService],
})
export class AuthModule {}
