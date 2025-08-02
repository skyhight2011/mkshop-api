import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({ example: 'Login successful' })
  message!: string;

  @ApiProperty({ type: 'object', additionalProperties: true })
  user!: any;

  @ApiProperty({
    type: 'object',
    properties: {
      accessToken: { type: 'string' },
      refreshToken: { type: 'string' },
    },
  })
  tokens!: {
    accessToken: string;
    refreshToken: string;
  };
}

export class ProfileResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  authId!: string;

  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439012' })
  roleId!: string;

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    example: ['read:users', 'write:users'],
  })
  permissions!: string[];
}
