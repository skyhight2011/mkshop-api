import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoleDocument = Role & Document;

export enum RoleLevel {
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

@Schema({ timestamps: true })
export class Role {
  @Prop({ required: true, unique: true })
  name!: string;

  @Prop({ required: true, unique: true })
  id!: string;

  @Prop({ required: true, enum: RoleLevel, default: RoleLevel.USER })
  level!: RoleLevel;

  @Prop({ type: [String], default: [] })
  permissions!: string[];

  @Prop({ default: true })
  isActive!: boolean;

  @Prop()
  description?: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
