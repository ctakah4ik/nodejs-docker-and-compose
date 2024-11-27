import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UsersService } from 'src/users/users.service';
import { WishesService } from 'src/wishes/wishes.service';
import { User } from 'src/users/entities/user.entity';

import { WishList } from './entities/wishlist.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(WishList)
    private readonly wishlistsRepository: Repository<WishList>,
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  async create(userId: User['id'], createWishlistData: CreateWishlistDto) {
    const user = await this.usersService.findOne(userId);
    const items = await this.wishesService.findByIds(
      createWishlistData.itemsId,
    );

    const wishlist = this.wishlistsRepository.create({
      ...createWishlistData,
      owner: user,
      items: items,
    });

    return await this.wishlistsRepository.save(wishlist);
  }

  async findWishlistByOwnerId(userId: User['id']) {
    return await this.wishlistsRepository.find({
      where: { owner: { id: userId } },
      relations: { owner: true, items: true },
    });
  }

  async findOne(id: WishList['id']) {
    return await this.wishlistsRepository.findOne({
      where: { id: id },
      relations: { owner: true, items: true },
    });
  }

  async update(
    userId: User['id'],
    id: WishList['id'],
    updateWishlistData: UpdateWishlistDto,
  ) {
    const wishlist = await this.findOne(id);

    if (userId !== wishlist.owner.id) {
      throw new ForbiddenException(
        'Нельзя редактировать чужие подборки подарков',
      );
    }

    const { itemsId, name, image, description } = updateWishlistData;
    const wishes = await this.wishesService.findByIds(itemsId || []);

    await this.wishlistsRepository.save({
      ...wishlist,
      name,
      image,
      description,
      items: wishes,
    });

    return await this.findOne(id);
  }

  async remove(id: WishList['id'], userId: User['id']) {
    const wishlist = await this.findOne(id);

    if (userId !== wishlist.owner.id) {
      throw new ForbiddenException('Нельзя удалять чужие подборки подарков');
    }

    return await this.wishlistsRepository.remove(wishlist);
  }
}
