import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true, unique: true })
  name!: string;

  @Prop()
  age?: number;

  @Prop({ default: true })
  isActive!: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Auth' })
  authId?: Types.ObjectId;

  @Prop()
  avatar?: string;

  @Prop()
  phone?: string;

  @Prop({ type: Date })
  emailVerifiedAt?: Date;

  @Prop({ type: Date })
  lastSeenAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
