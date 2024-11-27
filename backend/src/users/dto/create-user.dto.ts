import {
  IsNotEmpty,
  IsEmail,
  Length,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Поле "username" должно быть заполнено' })
  @Length(2, 30)
  username: string;

  @IsNotEmpty({ message: 'Поле "email" должно быть заполнено' })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Поле "password" должно быть заполнено' })
  password: string;

  @IsOptional()
  @IsUrl()
  avatar: string;

  @IsOptional()
  @Length(2, 200)
  about: string;
}
