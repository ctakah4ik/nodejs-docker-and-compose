import { IsInt, IsString, IsUrl, IsDate, IsOptional } from 'class-validator';

export class FindUserDto {
  @IsInt()
  id: number;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsString()
  username: string;

  @IsUrl()
  avatar: string;

  @IsString()
  @IsOptional()
  about: string;
}
