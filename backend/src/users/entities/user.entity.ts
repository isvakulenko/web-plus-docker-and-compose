import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import { Length, IsUrl, IsEmail, IsNotEmpty } from 'class-validator';

//Схема пользователя (user):
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ unique: true })
  @IsNotEmpty()
  @Length(2, 30)
  username: string;

  @Column({
    default: 'Пока ничего не рассказал о себе',
  })
  @Length(2, 200)
  about: string;

  @Column({
    default: 'https://i.pravatar.cc/300',
  })
  @IsUrl()
  avatar: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  password: string;

  //wishes — список желаемых подарков
  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  //offers — содержит список подарков, на которые скидывается пользователь.
  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  //wishlists - содержит список вишлистов, которые создал пользователь.
  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
