import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { JwtUserData } from 'src/auth/strategy/jwt.strategy';
import { Wish } from 'src/wishes/entities/wish.entity';

import { UsersService } from './users.service';
import { FindUserDto } from './dto/find-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  async getAllUsers(): Promise<FindUserDto[]> {
    return await this.usersService.findAll();
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<FindUserDto> {
    return this.usersService.create(createUserDto);
  }

  @Get('/me')
  async getCurrentUser(
    @Req() req: Request & { user: JwtUserData },
  ): Promise<User> {
    return await this.usersService.findOne(req.user.userId);
  }

  @Patch('/me')
  async updateCurrentUser(
    @Req() req: Request & { user: JwtUserData },
    @Body() updateUserData: UpdateUserDto,
  ): Promise<FindUserDto> {
    return this.usersService.update(req.user.userId, updateUserData);
  }
  @Get('/me/wishes')
  async getCurrentUserWishes(
    @Req() req: Request & { user: JwtUserData },
  ): Promise<Wish[]> {
    return await this.usersService.findWishes(req.user.userId);
  }

  @Get(':username')
  async findByName(@Param('username') username: string): Promise<FindUserDto> {
    return await this.usersService.findByName(username);
  }

  @Get(':username/wishes')
  async getUserWishes(@Param('username') username: string): Promise<Wish[]> {
    const user = await this.usersService.findByName(username);

    return await this.usersService.findWishes(user.id);
  }

  @Post('find')
  findByQuery(@Body('query') query: string): Promise<FindUserDto[]> {
    return this.usersService.findByQuery(query);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserData: UpdateUserDto) {
    return this.usersService.update(+id, updateUserData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
