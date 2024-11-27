import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { JwtUserData } from 'src/auth/strategy/jwt.strategy';

import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
  ) {}

  async create(
    userId: User['id'],
    createWishData: CreateWishDto,
  ): Promise<Wish> {
    const user = await this.usersService.findOne(userId);
    const { password, ...owner } = user;

    return await this.wishesRepository.save({
      ...createWishData,
      owner,
    });
  }

  async findOne(id: Wish['id']): Promise<Wish> {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: ['owner', 'offers'],
    });

    if (!wish) {
      throw new NotFoundException(`Подарок с id=${id} не существует`);
    }

    return wish;
  }

  async findByIds(ids: number[]): Promise<Wish[]> {
    return await this.wishesRepository.findBy({ id: In(ids) });
  }

  async findLastWishes(): Promise<Wish[]> {
    return await this.wishesRepository.find({
      relations: ['owner'],
      order: { createdAt: 'DESC' },
      take: 40,
    });
  }

  async findTopWishes(): Promise<Wish[]> {
    return await this.wishesRepository.find({
      relations: ['owner'],
      order: { copied: 'DESC' },
      take: 20,
    });
  }

  async findByOwnerId(id: Wish['owner']['id']): Promise<Wish[]> {
    return await this.wishesRepository.find({
      where: { owner: { id } },
      relations: {
        owner: true,
        offers: {
          user: {
            wishes: true,
            offers: true,
            wishlists: { owner: true, items: true },
          },
        },
      },
    });
  }

  async update(
    ownerId: User['id'],
    id: Wish['id'],
    updateWishData: UpdateWishDto,
    checkOwner = true,
  ) {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: ['offers', 'owner'],
    });

    if (checkOwner && wish.owner.id !== ownerId) {
      throw new ForbiddenException('Нельзя изменять чужие подарки');
    }

    if (updateWishData.price && wish.raised > 0) {
      throw new ForbiddenException(
        'Нельзя изменять стоимость подарка, если уже есть желающие скинуться',
      );
    }

    await this.wishesRepository.update(id, updateWishData);

    return await this.findOne(id);
  }

  async remove(userId: User['id'], id: Wish['id']): Promise<void> {
    const wish = await this.findOne(id);

    if (userId !== wish.owner.id) {
      throw new ForbiddenException('Нельзя удалять чужие подарки');
    }

    const result = await this.wishesRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Подарок с id=${id} не существует`);
    }
  }

  async copy(wishId: Wish['id'], user: JwtUserData) {
    const wish = await this.wishesRepository.findOne({
      relations: ['owner'],
      where: { id: wishId },
    });

    if (user.userId === wish.owner.id) {
      throw new ForbiddenException('Нельзя копировать свои желания');
    }

    const { id, owner, ...wishData } = wish;
    await this.create(user.userId, { ...wishData });
    await this.wishesRepository.increment({ id }, 'copied', 1);

    return wish;
  }
}
