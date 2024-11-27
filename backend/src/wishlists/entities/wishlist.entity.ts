import { Entity, Column, ManyToOne, ManyToMany } from 'typeorm';
import { Length, IsUrl, IsEmpty } from 'class-validator';

import { Wish } from 'src/wishes/entities/wish.entity';
import { User } from 'src/users/entities/user.entity';
import { BaseEntity } from 'src/shared/entities/base.entity';

@Entity()
export class WishList extends BaseEntity {
  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  @IsEmpty()
  @Length(0, 1500)
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToMany(() => Wish, (wishes) => wishes.wishlist)
  items: Wish[];

  @ManyToOne(() => User, (users) => users.wishlists)
  owner: User;
}
