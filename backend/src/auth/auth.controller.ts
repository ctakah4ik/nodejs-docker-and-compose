import { Controller, Post, UseGuards, Req, Body } from '@nestjs/common';

import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';

import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { SignInResponseDto } from './dto/signin-response.dto';
import { SignUpResponseDto } from './dto/signup-response.dto';

@Controller('/')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(LocalGuard)
  @Post('signin')
  async signin(@Req() req: Record<'user', User>): Promise<SignInResponseDto> {
    return this.authService.auth(req.user);
  }

  @Post('signup')
  async signup(
    @Body() createUserDto: CreateUserDto,
  ): Promise<SignUpResponseDto> {
    const user = await this.usersService.create(createUserDto);

    await this.authService.auth(user);

    const { password, ...response } = user;

    return response;
  }
}
