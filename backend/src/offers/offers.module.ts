import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Wish } from 'src/wishes/entities/wish.entity';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { UsersService } from 'src/users/users.service';
import { BcryptModule } from 'src/bcrypt/bcrypt.module';

import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { Offer } from './entities/offer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Offer, Wish, User]), BcryptModule],
  controllers: [OffersController],
  providers: [OffersService, WishesService, UsersService],
})
export class OffersModule {}
