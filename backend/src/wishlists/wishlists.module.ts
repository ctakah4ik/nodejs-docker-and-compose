import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { UsersModule } from 'src/users/users.module';
import { WishesModule } from 'src/wishes/wishes.module';

import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { WishList } from './entities/wishlist.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([WishList, User, Wish]),
    forwardRef(() => UsersModule),
    forwardRef(() => WishesModule),
  ],
  controllers: [WishlistsController],
  providers: [WishlistsService],
})
export class WishlistsModule {}
