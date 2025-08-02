import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AuthProvider } from '../../schemas/auth.schema';

export class SignupDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    type: String,
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @ApiProperty({
    description: 'User password (minimum 6 characters)',
    example: 'securepassword123',
    type: String,
    minLength: 6,
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password!: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
    type: String,
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name!: string;

  @ApiProperty({
    description: 'Authentication provider (optional)',
    enum: AuthProvider,
    example: AuthProvider.LOCAL,
    required: false,
  })
  @IsOptional()
  @IsEnum(AuthProvider, { message: 'Provider must be a valid auth provider' })
  provider?: AuthProvider;
}
