import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { BcryptService } from 'src/bcrypt/bcrypt.service';

import { SignUpResponseDto } from './dto/signup-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private bcryptService: BcryptService,
  ) {}

  async auth(user: User) {
    const payload = {
      username: user.username,
      sub: user.id,
    };
    return { access_token: this.jwtService.sign(payload) };
  }

  async validatePassword(
    username: string,
    password: string,
  ): Promise<SignUpResponseDto> {
    const user = await this.usersService.findByName(username);

    if (
      user &&
      (await this.bcryptService.comparePassword(password, user.password))
    ) {
      const { password, ...response } = user;

      return response;
    }

    return null;
  }
}
