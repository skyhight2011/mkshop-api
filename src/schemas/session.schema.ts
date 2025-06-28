import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SessionDocument = Session & Document;

export enum SessionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
}

@Schema({ timestamps: true })
export class Session {
  @Prop({ type: Types.ObjectId, ref: 'Auth', required: true })
  authId!: Types.ObjectId;

  @Prop({ required: true, unique: true })
  sessionToken!: string;

  @Prop({ required: true })
  refreshToken!: string;

  @Prop({ type: Date, required: true })
  expiresAt!: Date;

  @Prop({ enum: SessionStatus, default: SessionStatus.ACTIVE })
  status!: SessionStatus;

  @Prop()
  userAgent?: string;

  @Prop()
  ipAddress?: string;

  @Prop({ type: Date })
  lastActivityAt?: Date;

  @Prop({ default: true })
  isActive!: boolean;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
