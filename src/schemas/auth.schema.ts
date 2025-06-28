import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AuthDocument = Auth & Document;

export enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  GITHUB = 'github',
}

export enum AuthStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
  BANNED = 'banned',
}

// Email validation function
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

@Schema({ timestamps: true })
export class Auth {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId!: Types.ObjectId;

  @Prop({
    required: true,
    unique: true,
    validate: {
      validator: validateEmail,
      message: 'Please provide a valid email address',
    },
    lowercase: true,
    trim: true,
  })
  email!: string;

  @Prop({ required: true })
  passwordHash!: string;

  @Prop({ type: [String], default: [] })
  refreshTokens!: string[];

  @Prop({ type: Types.ObjectId, ref: 'Role', required: true })
  roleId!: Types.ObjectId;

  @Prop({ enum: AuthProvider, default: AuthProvider.LOCAL })
  provider!: AuthProvider;

  @Prop({ enum: AuthStatus, default: AuthStatus.ACTIVE })
  status!: AuthStatus;

  @Prop({ type: Date })
  lastLoginAt?: Date;

  @Prop({ type: Date })
  passwordChangedAt?: Date;

  @Prop({ type: Date })
  emailVerifiedAt?: Date;

  @Prop({ default: 0 })
  loginAttempts!: number;

  @Prop({ type: Date })
  lockedUntil?: Date;

  @Prop({ type: [String], default: [] })
  permissions!: string[];

  @Prop({ default: true })
  isActive!: boolean;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
