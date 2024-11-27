import { IsString } from 'class-validator';

export class SignInResponseDto {
  @IsString()
  access_token: string;
}
