import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { User } from './entities/user.entity';

import { Wish } from 'src/wishes/entities/wish.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { BcryptService } from 'src/bcrypt/bcrypt.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(forwardRef(() => WishesService))
    private wishesService: WishesService,
    private bcryptService: BcryptService,
  ) {}

  async create(createUserData: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: [
        { username: createUserData.username },
        { email: createUserData.email },
      ],
    });

    if (existingUser) {
      if (
        existingUser.username === createUserData.username ||
        existingUser.email === createUserData.email
      ) {
        throw new ConflictException(
          'Пользователь с таким username или email уже зарегистрирован',
        );
      }
    }

    const password = await this.bcryptService.hashPassword(
      createUserData.password,
    );
    const user = this.userRepository.create({ ...createUserData, password });

    return this.userRepository.save(user);
  }

  async findOne(id: User['id']) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`Пользователь с id=${id} не существует`);
    }

    return user;
  }

  async findByName(username: string) {
    const user = await this.userRepository.findOneBy({ username });

    if (!user) {
      throw new NotFoundException(
        `Пользователь с username=${username} не существует`,
      );
    }

    return user;
  }

  async findByQuery(query: string): Promise<FindUserDto[]> {
    return await this.userRepository.find({
      where: [{ email: query }, { username: query }],
    });
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async update(
    id: User['id'],
    updateUserData: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({
      where: [
        { username: updateUserData?.username },
        { email: updateUserData?.email },
      ],
    });

    if (user) {
      throw new BadRequestException('Ошибка валидации переданных значений');
    }

    if (updateUserData.password) {
      updateUserData.password = await this.bcryptService.hashPassword(
        updateUserData.password,
      );
    }

    const oldUserData = await this.findOne(id);

    await this.userRepository.update(
      { id },
      {
        ...oldUserData,
        ...updateUserData,
      },
    );

    const { password, ...response } = await this.findOne(id);

    return response;
  }

  async remove(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Пользователя с id=${id} не существует`);
    }

    await this.userRepository.remove(user);
  }

  async findWishes(id: User['id']): Promise<Wish[]> {
    return await this.wishesService.findByOwnerId(id);
  }
}
