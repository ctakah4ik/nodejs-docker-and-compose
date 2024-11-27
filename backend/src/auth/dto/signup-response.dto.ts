import { IsDate, IsNumber, IsString } from 'class-validator';

export class SignUpResponseDto {
  @IsNumber()
  id: number;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsString()
  username: string;

  @IsString()
  email: string;

  @IsString()
  about: string;

  @IsString()
  avatar: string;
}
