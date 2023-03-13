import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { IsInt, Length, IsUrl } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Offer } from 'src/offers/entities/offer.entity';

//Схема для подарков (wish):
@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  //name — название подарка.
  @Column()
  @Length(1, 250)
  name: string;

  //link — ссылка на интернет-магазин, в котором можно приобрести подарок
  @Column()
  @IsUrl()
  link: string;

  //image - ссылка на изображение подарка, строка.
  @Column()
  @IsUrl()
  image: string;

  //price — стоимость подарка, с округлением до сотых.
  @Column()
  @IsInt()
  price: number;

  //raised — сумма предварительного сбора или сумма,
  // которую пользователи сейчас готовы скинуть на подарок.
  @Column({ default: 0 })
  @IsInt()
  raised: number;

  //owner — ссылка на пользователя, который добавил пожелание подарка.
  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  //description — строка с описанием подарка длиной от 1 и до 1024 символов.
  @Column()
  @Length(1, 1024)
  description: string;

  //offers — массив ссылок на заявки скинуться от других пользователей.
  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  //copied — содержит cчётчик сколько раз был скопирован подарок.
  @Column({ default: 0 })
  @IsInt()
  copied: number;
}
