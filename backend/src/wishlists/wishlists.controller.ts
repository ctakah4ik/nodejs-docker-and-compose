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

import { JwtUserData } from 'src/auth/strategy/jwt.strategy';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { WishList } from './entities/wishlist.entity';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@UseGuards(JwtGuard)
@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  create(
    @Req() req: Request & { user: JwtUserData },
    @Body() createWishlistData: CreateWishlistDto,
  ): Promise<WishList> {
    return this.wishlistsService.create(req.user.userId, createWishlistData);
  }

  @Get()
  findWishlistByOwnerId(
    @Req() req: Request & { user: JwtUserData },
  ): Promise<WishList[]> {
    return this.wishlistsService.findWishlistByOwnerId(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<WishList> {
    return this.wishlistsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Req() req: Request & { user: JwtUserData },
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ): Promise<WishList> {
    return this.wishlistsService.update(
      req.user.userId,
      +id,
      updateWishlistDto,
    );
  }

  @Delete(':id')
  remove(
    @Req() req: Request & { user: JwtUserData },
    @Param('id') id: string,
  ): Promise<WishList> {
    return this.wishlistsService.remove(+id, req.user.userId);
  }
}
