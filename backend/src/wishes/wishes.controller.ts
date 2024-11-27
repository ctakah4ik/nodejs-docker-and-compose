import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { JwtUserData } from 'src/auth/strategy/jwt.strategy';

import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(
    @Req() req: Request & { user: JwtUserData },
    @Body() createWishData: CreateWishDto,
  ) {
    return this.wishesService.create(req.user.userId, createWishData);
  }

  @Get('/last')
  findLastWishes() {
    return this.wishesService.findLastWishes();
  }

  @Get('/top')
  findTopWishes() {
    return this.wishesService.findTopWishes();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishesService.findOne(+id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Req() req: Request & { user: JwtUserData },
    @Param('id') id: string,
    @Body() updateWishData: UpdateWishDto,
  ) {
    return this.wishesService.update(req.user.userId, +id, updateWishData);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Req() req: Request & { user: JwtUserData }, @Param('id') id: string) {
    return this.wishesService.remove(req.user.userId, +id);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  copy(@Req() req: Request & { user: JwtUserData }, @Param('id') id: string) {
    return this.wishesService.copy(+id, req.user);
  }
}
