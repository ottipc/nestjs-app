import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'kminchelle' })
  @IsString()
  @IsNotEmpty()
  username!: string;

  @ApiProperty({ example: '0lelplR' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
