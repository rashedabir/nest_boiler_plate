import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserRegistrationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly middleName: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly lastName: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  password: string;
}
