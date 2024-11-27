import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';

import { Offer } from './entities/offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private usersService: UsersService,
    private wishesService: WishesService,
  ) {}

  async create(
    createOfferData: CreateOfferDto,
    userId: User['id'],
  ): Promise<Offer> {
    const user = await this.usersService.findOne(userId);
    const wish = await this.wishesService.findOne(createOfferData.itemId);

    if (user.id === wish.owner.id) {
      throw new ForbiddenException(
        'Нельзя вносить деньги на собственные подарки',
      );
    }

    const newPrice = +wish.raised + createOfferData.amount;

    if (newPrice > wish.price) {
      throw new ForbiddenException(
        'Сумма собранных средств не может превышать стоимость подарка',
      );
    }

    await this.wishesService.update(
      userId,
      createOfferData.itemId,
      {
        raised: newPrice,
      },
      false,
    );

    return await this.offerRepository.save({
      user,
      item: wish,
      ...createOfferData,
    });
  }

  async findOne(id: Offer['id']): Promise<Offer> {
    const offer = await this.offerRepository.findOneBy({ id });

    if (!offer) {
      throw new NotFoundException(`Заявка с id=${id} не существует`);
    }

    return offer;
  }

  async findAll(): Promise<Offer[]> {
    return await this.offerRepository.find({
      relations: {
        user: {
          wishes: true,
          offers: true,
          wishlists: { owner: true, items: true },
        },
      },
    });
  }
}
