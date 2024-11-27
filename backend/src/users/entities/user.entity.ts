import { Entity, Column, OneToMany } from 'typeorm';
import { Length, IsOptional, IsUrl, IsEmail } from 'class-validator';

import { Wish } from 'src/wishes/entities/wish.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { WishList } from 'src/wishlists/entities/wishlist.entity';
import { BaseEntity } from 'src/shared/entities/base.entity';
import {
  DEFAULT_USER_AVATAR_LINK,
  DEFAULT_USER_ABOUT_TEXT,
} from 'src/constants/users';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  @Length(2, 30)
  username: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @Column({ default: DEFAULT_USER_ABOUT_TEXT })
  @Length(2, 200)
  @IsOptional()
  about: string;

  @Column({ default: DEFAULT_USER_AVATAR_LINK })
  @IsUrl()
  @IsOptional()
  avatar: string;

  @OneToMany(() => Offer, (offers) => offers.user)
  offers: Offer[];

  @OneToMany(() => Wish, (wishes) => wishes.owner)
  wishes: Wish[];

  @OneToMany(() => WishList, (wishlists) => wishlists.owner)
  wishlists: WishList[];
}
